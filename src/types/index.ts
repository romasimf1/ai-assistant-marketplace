// User types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: PhiladelphiaAddress;
  preferences?: UserPreferences;
  subscriptionTier: 'free' | 'premium' | 'business';
  createdAt: Date;
  updatedAt: Date;
}

export interface PhiladelphiaAddress {
  street: string;
  city: string;
  state: 'PA';
  zipCode: string;
  neighborhood?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface UserPreferences {
  voiceEnabled: boolean;
  language: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
}

// Assistant types
export interface Assistant {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: AssistantCategory;
  voiceConfig: VoiceConfig;
  aiModel: 'gpt-4' | 'gpt-3.5-turbo' | 'groq' | 'gemini';
  pricing: PricingTier;
  isActive: boolean;
  demoAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AssistantCategory =
  | 'food'
  | 'travel'
  | 'healthcare'
  | 'automotive'
  | 'shopping'
  | 'entertainment'
  | 'utilities'
  | 'other';

export interface VoiceConfig {
  voiceId: string;
  stability: number;
  clarity: number;
  style: number;
  provider: 'elevenlabs';
}

export interface PricingTier {
  free: {
    requestsPerMonth: number;
    demoAvailable: boolean;
  };
  premium: {
    monthlyFee: number;
    requestsPerMonth: number;
  };
  business: {
    monthlyFee: number;
    apiAccess: boolean;
    whiteLabel: boolean;
  };
}

// Order types
export interface Order {
  id: string;
  userId: string;
  assistantId: string;
  serviceDetails: ServiceDetails;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  stripePaymentId?: string;
  fulfillmentData?: FulfillmentData;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export interface ServiceDetails {
  category: AssistantCategory;
  description: string;
  requirements: Record<string, any>;
  deliveryAddress?: PhiladelphiaAddress;
  scheduledTime?: Date;
  specialInstructions?: string;
}

export interface FulfillmentData {
  providerId: string;
  providerResponse: any;
  trackingInfo?: TrackingInfo;
  completionTime?: Date;
}

export interface TrackingInfo {
  status: string;
  estimatedDelivery?: Date;
  trackingNumber?: string;
  updates: TrackingUpdate[];
}

export interface TrackingUpdate {
  timestamp: Date;
  status: string;
  message: string;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  assistantId: string;
  orderId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  isVerified: boolean;
  createdAt: Date;
}

// Transaction types
export interface Transaction {
  id: string;
  orderId?: string;
  userId: string;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  stripeTransactionId?: string;
  createdAt: Date;
}

export type TransactionType =
  | 'payment'
  | 'refund'
  | 'commission'
  | 'subscription';

export type TransactionStatus =
  | 'pending'
  | 'completed'
  | 'failed'
  | 'cancelled';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptTerms: boolean;
}

export interface ServiceRequestForm {
  assistantId: string;
  serviceDetails: ServiceDetails;
  paymentMethodId: string;
}

// Voice interaction types
export interface VoiceMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  audioUrl?: string;
}

export interface VoiceSession {
  id: string;
  assistantId: string;
  userId: string;
  messages: VoiceMessage[];
  status: 'active' | 'completed' | 'error';
  startTime: Date;
  endTime?: Date;
}

// UI State types
export interface UiState {
  isLoading: boolean;
  error: string | null;
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'auto';
}

// Auth state types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}
