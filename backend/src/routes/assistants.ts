import { Router } from 'express';
import { authenticate, optionalAuth } from '@/middleware/auth';
import { ApiResponse, PaginatedResponse, Assistant } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import prisma from '@/utils/database';

const router = Router();

/**
 * @route GET /api/v1/assistants
 * @desc Get all active assistants
 * @access Public (with optional auth for personalization)
 */
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;
  const category = req.query.category as string;
  const search = req.query.search as string;
  const offset = (page - 1) * limit;

  // Build where clause
  const where: any = {
    isActive: true,
  };

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [assistants, total] = await Promise.all([
    prisma.assistant.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        category: true,
        pricing: true,
        demoAvailable: true,
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.assistant.count({ where }),
  ]);

  // Calculate average ratings
  const assistantsWithRatings = assistants.map((assistant: any) => {
    const ratings = assistant.reviews.map((r: any) => r.rating);
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length
      : null;

    return {
      ...assistant,
      averageRating,
      totalOrders: assistant._count.orders,
      totalReviews: assistant._count.reviews,
    };
  });

  const response: PaginatedResponse<any> = {
    success: true,
    data: assistantsWithRatings,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  res.json(response);
}));

/**
 * @route GET /api/v1/assistants/categories
 * @desc Get available assistant categories
 * @access Public
 */
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await prisma.assistant.findMany({
    where: { isActive: true },
    select: {
      category: true,
    },
    distinct: ['category'],
  });

  // Count assistants per category
  const categoryCounts = await prisma.assistant.groupBy({
    by: ['category'],
    where: { isActive: true },
    _count: {
      category: true,
    },
  });

  const categoryStats = categories.map(cat => {
    const countData = categoryCounts.find(c => c.category === cat.category);
    return {
      name: cat.category,
      count: countData?._count.category || 0,
    };
  });

  const response: ApiResponse = {
    success: true,
    data: categoryStats,
  };

  res.json(response);
}));

/**
 * @route GET /api/v1/assistants/:slug
 * @desc Get assistant by slug
 * @access Public
 */
router.get('/:slug', optionalAuth, asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const assistant = await prisma.assistant.findUnique({
    where: { slug: slug, isActive: true },
    include: {
      reviews: {
        select: {
          rating: true,
          comment: true,
          createdAt: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10, // Latest 10 reviews
      },
      _count: {
        select: {
          orders: true,
          reviews: true,
        },
      },
    },
  }) as any;

  if (!assistant) {
    return res.status(404).json({
      success: false,
      message: 'Assistant not found',
    });
  }

  // Calculate average rating
  const ratings = assistant.reviews.map((r: any) => r.rating);
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length
    : null;

  const assistantData = {
    ...assistant,
    averageRating,
    totalOrders: assistant._count.orders,
    totalReviews: assistant._count.reviews,
  };

  const response: ApiResponse = {
    success: true,
    data: assistantData,
  };

  res.json(response);
  return;
}));

/**
 * @route POST /api/v1/assistants/:slug/demo
 * @desc Test assistant demo (rate limited)
 * @access Public
 */
router.post('/:slug/demo', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { message, voice } = req.body;

  if (!message || typeof message !== 'string' || message.length > 500) {
    return res.status(400).json({
      success: false,
      message: 'Message is required and must be less than 500 characters',
    });
  }

  const assistant = await prisma.assistant.findUnique({
    where: { slug: slug, isActive: true, demoAvailable: true },
  });

  if (!assistant) {
    return res.status(404).json({
      success: false,
      message: 'Assistant not found or demo not available',
    });
  }

  // TODO: Integrate with AI service for demo response
  // For now, return a mock response
  const demoResponse = {
    assistant: assistant.name,
    response: `Hello! I'm ${assistant.name}, your ${assistant.category} assistant. I received your message: "${message}". This is a demo response.`,
    timestamp: new Date().toISOString(),
  };

  const response: ApiResponse = {
    success: true,
    data: demoResponse,
    message: 'Demo interaction completed',
  };

  res.json(response);
  return;
}));

export default router;
