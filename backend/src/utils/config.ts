import { AppConfig } from '@/types';

export const config: AppConfig = {
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/ai_assistant_marketplace',
    ssl: process.env.NODE_ENV === 'production',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-change-in-production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  server: {
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
      standardHeaders: true,
      legacyHeaders: false,
    },
  },

  externalServices: {
    elevenlabs: {
      apiKey: process.env.ELEVENLABS_API_KEY || '',
      baseUrl: process.env.ELEVENLABS_BASE_URL || 'https://api.elevenlabs.io',
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    },
  },
};

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'ELEVENLABS_API_KEY',
  'OPENAI_API_KEY',
  'STRIPE_SECRET_KEY',
];

if (config.server.nodeEnv === 'production') {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export default config;
