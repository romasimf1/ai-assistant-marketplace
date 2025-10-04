import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import { ApiResponse, PaginatedResponse } from '@/types';
import { Order } from '@prisma/client';
import { asyncHandler } from '@/utils/asyncHandler';
import prisma from '@/utils/database';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

/**
 * @route GET /api/v1/users/stats
 * @desc Get user statistics
 * @access Private
 */
router.get('/stats', asyncHandler(async (req, res) => {
  const userId = req.user!.id;

  // Get user orders count
  const ordersCount = await prisma.order.count({
    where: { userId },
  });

  // Get user reviews count
  const reviewsCount = await prisma.review.count({
    where: { userId },
  });

  // Get total spent
  const totalSpent = await prisma.order.aggregate({
    where: {
      userId,
      status: 'completed',
    },
    _sum: {
      totalAmount: true,
    },
  });

  const stats = {
    ordersCount,
    reviewsCount,
    totalSpent: totalSpent._sum.totalAmount || 0,
  };

  const response: ApiResponse = {
    success: true,
    data: stats,
  };

  res.json(response);
}));

/**
 * @route GET /api/v1/users/orders
 * @desc Get user's orders
 * @access Private
 */
router.get('/orders', asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: {
        assistant: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        reviews: {
          select: {
            rating: true,
            comment: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.order.count({ where: { userId } }),
  ]);

  const response: PaginatedResponse<Order> = {
    success: true,
    data: orders,
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
 * @route GET /api/v1/users/reviews
 * @desc Get user's reviews
 * @access Private
 */
router.get('/reviews', asyncHandler(async (req, res) => {
  const userId = req.user!.id;

  const reviews = await prisma.review.findMany({
    where: { userId },
    include: {
      assistant: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
      order: {
        select: {
          id: true,
          totalAmount: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const response: ApiResponse = {
    success: true,
    data: reviews,
  };

  res.json(response);
}));

export default router;
