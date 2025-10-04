import { Router } from 'express';
import Joi from 'joi';
import { authService } from '@/services/authService';
import { authenticate } from '@/middleware/auth';
import { ApiResponse, CreateUserInput, LoginInput, ValidationError } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().trim().max(50),
  lastName: Joi.string().trim().max(50),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).max(20),
  address: Joi.object(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

/**
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', asyncHandler(async (req, res) => {
  // Validate input
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details?.[0]?.message || 'Validation error');
  }

  const userData: CreateUserInput = value;

  // Register user
  const result = await authService.register(userData);

  const response: ApiResponse = {
    success: true,
    data: result,
    message: 'User registered successfully',
  };

  res.status(201).json(response);
}));

/**
 * @route POST /api/v1/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', asyncHandler(async (req, res) => {
  // Validate input
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details?.[0]?.message || 'Validation error');
  }

  const credentials: LoginInput = value;

  // Login user
  const result = await authService.login(credentials);

  const response: ApiResponse = {
    success: true,
    data: result,
    message: 'Login successful',
  };

  res.json(response);
}));

/**
 * @route POST /api/v1/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ValidationError('Refresh token is required');
  }

  const tokens = await authService.refreshToken(refreshToken);

  const response: ApiResponse = {
    success: true,
    data: tokens,
    message: 'Tokens refreshed successfully',
  };

  res.json(response);
}));

/**
 * @route GET /api/v1/auth/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/profile', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user!.id;

  const profile = await authService.getProfile(userId);

  const response: ApiResponse = {
    success: true,
    data: profile,
  };

  res.json(response);
}));

/**
 * @route PUT /api/v1/auth/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const updates = req.body;

  const updatedProfile = await authService.updateProfile(userId, updates);

  const response: ApiResponse = {
    success: true,
    data: updatedProfile,
    message: 'Profile updated successfully',
  };

  res.json(response);
}));

/**
 * @route PUT /api/v1/auth/change-password
 * @desc Change user password
 * @access Private
 */
router.put('/change-password', authenticate, asyncHandler(async (req, res) => {
  // Validate input
  const { error, value } = changePasswordSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details?.[0]?.message || 'Validation error');
  }

  const { currentPassword, newPassword } = value;
  const userId = req.user!.id;

  await authService.changePassword(userId, currentPassword, newPassword);

  const response: ApiResponse = {
    success: true,
    message: 'Password changed successfully',
  };

  res.json(response);
}));

/**
 * @route POST /api/v1/auth/logout
 * @desc Logout user (invalidate refresh token)
 * @access Private
 */
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const { refreshToken } = req.body;

  if (refreshToken) {
    await authService.invalidateRefreshToken(userId, refreshToken);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Logout successful',
  };

  res.json(response);
}));

/**
 * @route DELETE /api/v1/auth/account
 * @desc Delete user account
 * @access Private
 */
router.delete('/account', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user!.id;

  await authService.deleteAccount(userId);

  const response: ApiResponse = {
    success: true,
    message: 'Account deleted successfully',
  };

  res.json(response);
}));

export default router;
