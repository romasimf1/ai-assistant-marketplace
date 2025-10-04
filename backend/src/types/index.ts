import { Request, Response, NextFunction } from 'express';
import { User, Assistant, Order, Transaction, Review } from '@prisma/client';

// Re-export Prisma types for convenience
export type { User, Assistant, Order, Transaction, Review } from '@prisma/client';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        subscriptionTier: string;
      };
    }
  }
}

// Common API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User types
export interface CreateUserInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: Record<string, any>;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface PhiladelphiaAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  neighborhood?: string;
}

// Assistant types
export interface VoiceConfig {
  voiceId: string;
  model: string;
  stability: number;
  similarityBoost: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

export interface PricingTier {
  name: string;
  price: number;
  currency: string;
  features: string[];
  limits: {
    monthlyRequests: number;
    voiceMinutes: number;
  };
}

export interface CreateAssistantInput {
  name: string;
  description: string;
  category: string;
  voiceConfig: VoiceConfig;
  aiModel?: string;
  pricing: PricingTier[];
}

// Order types
export interface OrderItem {
  serviceType: string;
  details: Record<string, any>;
  quantity?: number;
}

export interface CreateOrderInput {
  assistantId: string;
  serviceDetails: OrderItem[];
  notes?: string;
}

export interface OrderStatus {
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  updatedAt: Date;
  notes?: string;
}

// Transaction types
export interface TransactionDetails {
  type: 'payment' | 'refund' | 'commission' | 'fee';
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, any>;
}

// Review types
export interface CreateReviewInput {
  orderId: string;
  assistantId: string;
  rating: number;
  comment?: string;
}

// API Error types
export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403);
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(message, 409);
  }
}

// Middleware types
export interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
}

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export type ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

// Service types
export interface EmailService {
  sendWelcomeEmail(email: string, name: string): Promise<void>;
  sendOrderConfirmation(email: string, orderId: string): Promise<void>;
  sendPasswordReset(email: string, resetToken: string): Promise<void>;
}

export interface PaymentService {
  createPaymentIntent(amount: number, currency: string, metadata: Record<string, any>): Promise<string>;
  confirmPayment(paymentIntentId: string): Promise<boolean>;
  createRefund(paymentIntentId: string, amount?: number): Promise<string>;
}

export interface AIService {
  generateResponse(prompt: string, model?: string): Promise<string>;
  analyzeIntent(text: string): Promise<string>;
  moderateContent(text: string): Promise<boolean>;
}

export interface VoiceService {
  generateSpeech(text: string, voiceConfig: VoiceConfig): Promise<Buffer>;
  getVoices(): Promise<any[]>;
  validateVoiceConfig(config: VoiceConfig): boolean;
}

// Configuration types
export interface DatabaseConfig {
  url: string;
  ssl?: boolean;
  maxConnections?: number;
}

export interface JWTConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export interface ServerConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  rateLimit: RateLimitOptions;
}

export interface ExternalServicesConfig {
  elevenlabs: {
    apiKey: string;
    baseUrl: string;
  };
  openai: {
    apiKey: string;
  };
  stripe: {
    secretKey: string;
    webhookSecret: string;
  };
}

export interface AppConfig {
  database: DatabaseConfig;
  jwt: JWTConfig;
  server: ServerConfig;
  externalServices: ExternalServicesConfig;
}
