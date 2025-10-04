import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '@/services/authService';
import { ConflictError, AuthenticationError, NotFoundError } from '@/types';
import prisma from '@/utils/database';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = await authService.register(userData);

      expect(result.user).toHaveProperty('id');
      expect(result.user.email).toBe(userData.email);
      expect(result.user.firstName).toBe(userData.firstName);
      expect(result.tokens).toHaveProperty('accessToken');
      expect(result.tokens).toHaveProperty('refreshToken');
      expect(result.tokens).toHaveProperty('expiresIn');
    });

    it('should throw error for duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
      };

      // Create first user
      await authService.register(userData);

      // Try to create second user with same email
      await expect(authService.register(userData)).rejects.toThrow(ConflictError);
    });
  });

  describe('login', () => {
    it('should login user with correct credentials', async () => {
      const userData = {
        email: 'login@example.com',
        password: 'password123',
      };

      // Register user first
      await authService.register(userData);

      // Login
      const result = await authService.login(userData);

      expect(result.user.email).toBe(userData.email);
      expect(result.tokens).toHaveProperty('accessToken');
    });

    it('should throw error for invalid email', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      await expect(authService.login(credentials)).rejects.toThrow(AuthenticationError);
    });

    it('should throw error for invalid password', async () => {
      const userData = {
        email: 'password@example.com',
        password: 'password123',
      };

      // Register user
      await authService.register(userData);

      // Try to login with wrong password
      const wrongCredentials = {
        email: userData.email,
        password: 'wrongpassword',
      };

      await expect(authService.login(wrongCredentials)).rejects.toThrow(AuthenticationError);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const userData = {
        email: 'profile@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      // Register user
      const { user } = await authService.register(userData);

      // Get profile
      const profile = await authService.getProfile(user.id!);

      expect(profile.email).toBe(userData.email);
      expect(profile.firstName).toBe(userData.firstName);
      expect(profile).not.toHaveProperty('passwordHash');
    });

    it('should throw error for non-existent user', async () => {
      await expect(authService.getProfile('non-existent-id')).rejects.toThrow(NotFoundError);
    });
  });
});
