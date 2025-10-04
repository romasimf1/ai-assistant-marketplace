import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import { ApiResponse, CreateOrderInput, ValidationError } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import prisma from '@/utils/database';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

/**
 * @route POST /api/v1/orders
 * @desc Create a new order
 * @access Private
 */
router.post('/', asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const orderData: CreateOrderInput = req.body;

  // Validate input
  if (!orderData.assistantId || !orderData.serviceDetails || orderData.serviceDetails.length === 0) {
    throw new ValidationError('Assistant ID and service details are required');
  }

  // Check if assistant exists and is active
  const assistant = await prisma.assistant.findUnique({
    where: { id: orderData.assistantId, isActive: true },
  });

  if (!assistant) {
    return res.status(404).json({
      success: false,
      message: 'Assistant not found or not available',
    });
  }

  // Calculate total amount based on assistant pricing
  // TODO: Implement proper pricing calculation logic
  const totalAmount = 29.99; // Placeholder pricing

  // Create order
  const order = await prisma.order.create({
    data: {
      userId,
      assistantId: orderData.assistantId,
      serviceDetails: orderData.serviceDetails as any,
      totalAmount,
      currency: 'USD',
    },
    include: {
      assistant: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
    },
  });

  // TODO: Integrate with payment service (Stripe)
  // TODO: Send order confirmation email

  const response: ApiResponse = {
    success: true,
    data: order,
    message: 'Order created successfully',
  };

  res.status(201).json(response);
  return;
}));

/**
 * @route GET /api/v1/orders/:id
 * @desc Get order by ID
 * @access Private (user can only view their own orders)
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const orderId = req.params.id;

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: userId, // Ensure user can only access their own orders
    },
    include: {
      assistant: {
        select: {
          id: true,
          name: true,
          slug: true,
          category: true,
        },
      },
      transactions: {
        orderBy: { createdAt: 'desc' },
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
        },
      },
    },
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  const response: ApiResponse = {
    success: true,
    data: order,
  };

  res.json(response);
  return;
}));

/**
 * @route PUT /api/v1/orders/:id/cancel
 * @desc Cancel an order (if still pending)
 * @access Private
 */
router.put('/:id/cancel', asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const orderId = req.params.id;

  // Find order
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: userId,
      status: 'pending', // Only pending orders can be cancelled
    },
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found or cannot be cancelled',
    });
  }

  // Update order status
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: 'cancelled' },
  });

  // TODO: Process refund if payment was made
  // TODO: Send cancellation email

  const response: ApiResponse = {
    success: true,
    data: updatedOrder,
    message: 'Order cancelled successfully',
  };

  res.json(response);
  return;
}));

/**
 * @route POST /api/v1/orders/:id/review
 * @desc Add review to completed order
 * @access Private
 */
router.post('/:id/review', asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const orderId = req.params.id;
  const { rating, comment } = req.body;

  // Validate input
  if (!rating || rating < 1 || rating > 5) {
    throw new ValidationError('Rating must be between 1 and 5');
  }

  // Check if order exists and belongs to user
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: userId,
      status: 'completed', // Only completed orders can be reviewed
    },
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found or not eligible for review',
    });
  }

  // Check if review already exists
  const existingReview = await prisma.review.findFirst({
    where: {
      orderId: orderId,
      userId: userId,
    },
  });

  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: 'Review already exists for this order',
    });
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      userId: userId,
      assistantId: order.assistantId,
      orderId: orderId!,
      rating: rating,
      comment: comment?.trim() || null,
    },
    include: {
      assistant: {
        select: {
          name: true,
          category: true,
        },
      },
    },
  });

  const response: ApiResponse = {
    success: true,
    data: review,
    message: 'Review added successfully',
  };

  res.status(201).json(response);
  return;
}));

export default router;
