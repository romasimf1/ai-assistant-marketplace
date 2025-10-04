# Development stage
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npm run prisma:generate

# Expose port
EXPOSE 3001

# Health check
RUN apk add --no-cache curl
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Default command for development
CMD ["npm", "run", "dev"]

# Production stage (same as development for now to avoid build errors)
FROM development AS production

# Start the application in development mode
CMD ["npm", "run", "dev"]
