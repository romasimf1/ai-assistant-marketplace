import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { config } from '@/utils/config';
import prisma from '@/utils/database';
import {
  CreateUserInput,
  LoginInput,
  AuthTokens,
  ConflictError,
  AuthenticationError,
  NotFoundError,
} from '@/types';

export class AuthService {
  /**
   * Hash a password using bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify a password against its hash
   */
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT access token
   */
  private generateAccessToken(user: { id: string; email: string; subscriptionTier: string }): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        subscriptionTier: user.subscriptionTier,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
    );
  }

  /**
   * Generate JWT refresh token
   */
  private generateRefreshToken(user: { id: string; email: string }): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn } as jwt.SignOptions
    );
  }

  /**
   * Generate both access and refresh tokens
   */
  private generateTokens(user: { id: string; email: string; subscriptionTier: string }): AuthTokens {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Calculate expiration time in seconds
    const expiresIn = config.jwt.expiresIn.includes('m')
      ? parseInt(config.jwt.expiresIn.replace('m', '')) * 60
      : parseInt(config.jwt.expiresIn.replace('h', '')) * 3600;

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  /**
   * Register a new user
   */
  async register(userData: CreateUserInput): Promise<{ user: Partial<User>; tokens: AuthTokens }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(userData.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        passwordHash,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        phone: userData.phone || null,
        address: userData.address || {},
        preferences: {},
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        subscriptionTier: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const tokens = this.generateTokens({
      id: user.id,
      email: user.email,
      subscriptionTier: user.subscriptionTier
    });

    return { user, tokens };
  }

  /**
   * Login user
   */
  async login(credentials: LoginInput): Promise<{ user: Partial<User>; tokens: AuthTokens }> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(credentials.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate tokens
    const tokens = this.generateTokens({
      id: user.id,
      email: user.email,
      subscriptionTier: user.subscriptionTier
    });

    // Return user data without sensitive information
    const { passwordHash, ...userData } = user;

    return { user: userData, tokens };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as {
        userId: string;
        email: string;
      };

      // Find user
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new NotFoundError('User');
      }

      // Generate new tokens
      return this.generateTokens({
        id: user.id,
        email: user.email,
        subscriptionTier: user.subscriptionTier
      });
    } catch (error) {
      throw new AuthenticationError('Invalid refresh token');
    }
  }

  /**
   * Get user profile (without password)
   */
  async getProfile(userId: string): Promise<Partial<User>> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        preferences: true,
        subscriptionTier: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<CreateUserInput>): Promise<Partial<User>> {
    const updateData: any = {};

    if (updates.firstName !== undefined) updateData.firstName = updates.firstName;
    if (updates.lastName !== undefined) updateData.lastName = updates.lastName;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.address !== undefined) updateData.address = updates.address;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        preferences: true,
        subscriptionTier: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    // Verify current password
    const isCurrentPasswordValid = await this.verifyPassword(currentPassword, user.passwordHash);

    if (!isCurrentPasswordValid) {
      throw new AuthenticationError('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await this.hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });
  }

  /**
   * Invalidate refresh token (for logout)
   */
  async invalidateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    // TODO: Implement token blacklisting
    // For now, we just acknowledge the logout
    // In production, you might want to:
    // 1. Store invalidated tokens in Redis/database
    // 2. Add token versioning to User model
    // 3. Implement token blacklisting
    console.log(`User ${userId} logged out with token: ${refreshToken?.substring(0, 20)}...`);
  }

  /**
   * Delete user account
   */
  async deleteAccount(userId: string): Promise<void> {
    await prisma.user.delete({
      where: { id: userId },
    });
  }
}

export const authService = new AuthService();
