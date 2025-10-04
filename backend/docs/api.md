# AI Assistant Marketplace API Documentation

## Overview

The AI Assistant Marketplace API provides endpoints for managing users, AI assistants, orders, and reviews. The API follows RESTful conventions and uses JSON for request/response bodies.

**Base URL:** `https://api.ai-assistant-marketplace.com/v1`

**Version:** 1.0.0

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Expiration
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Use `/api/v1/auth/refresh` to get new tokens

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "errors": ["Error messages if any"],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

## Authentication Endpoints

### POST /api/v1/auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "Philadelphia",
    "state": "PA",
    "zipCode": "19101"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "subscriptionTier": "free"
    },
    "tokens": {
      "accessToken": "jwt-access-token",
      "refreshToken": "jwt-refresh-token",
      "expiresIn": 900
    }
  },
  "message": "User registered successfully"
}
```

### POST /api/v1/auth/login

Authenticate user and get tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "firstName": "John",
      "subscriptionTier": "free"
    },
    "tokens": {
      "accessToken": "jwt-access-token",
      "refreshToken": "jwt-refresh-token",
      "expiresIn": 900
    }
  },
  "message": "Login successful"
}
```

### POST /api/v1/auth/refresh

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt-refresh-token"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-access-token",
    "refreshToken": "new-jwt-refresh-token",
    "expiresIn": 900
  },
  "message": "Tokens refreshed successfully"
}
```

### GET /api/v1/auth/profile

Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "address": { ... },
    "preferences": { ... },
    "subscriptionTier": "free",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /api/v1/auth/profile

Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "Jane",
  "phone": "+1987654321"
}
```

### PUT /api/v1/auth/change-password

Change user password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newsecurepassword"
}
```

### DELETE /api/v1/auth/account

Delete user account.

**Headers:** `Authorization: Bearer <token>`

---

## Assistant Endpoints

### GET /api/v1/assistants

Get list of available assistants.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `category` (string): Filter by category
- `search` (string): Search in name and description

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "assistant-id",
      "name": "Foodie Assistant",
      "slug": "foodie-assistant",
      "description": "Your personal food ordering assistant",
      "category": "food",
      "pricing": [...],
      "demoAvailable": true,
      "averageRating": 4.5,
      "totalOrders": 150,
      "totalReviews": 45
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 25,
    "totalPages": 3
  }
}
```

### GET /api/v1/assistants/categories

Get available assistant categories.

**Response (200):**
```json
{
  "success": true,
  "data": [
    { "name": "food", "count": 5 },
    { "name": "travel", "count": 3 },
    { "name": "healthcare", "count": 4 }
  ]
}
```

### GET /api/v1/assistants/{slug}

Get detailed assistant information.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "assistant-id",
    "name": "Foodie Assistant",
    "description": "Your personal food ordering assistant",
    "category": "food",
    "voiceConfig": { ... },
    "pricing": [...],
    "demoAvailable": true,
    "averageRating": 4.5,
    "totalOrders": 150,
    "totalReviews": 45,
    "reviews": [
      {
        "rating": 5,
        "comment": "Great assistant!",
        "createdAt": "2024-01-01T00:00:00Z",
        "user": {
          "firstName": "John",
          "lastName": "D"
        }
      }
    ]
  }
}
```

### POST /api/v1/assistants/{slug}/demo

Test assistant demo functionality.

**Request Body:**
```json
{
  "message": "I want to order pizza",
  "voice": false
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "assistant": "Foodie Assistant",
    "response": "I'd be happy to help you order pizza...",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

---

## Order Endpoints

### POST /api/v1/orders

Create a new order.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "assistantId": "assistant-id",
  "serviceDetails": [
    {
      "serviceType": "food_delivery",
      "details": {
        "restaurant": "Pizza Place",
        "items": ["Large Pepperoni Pizza"],
        "deliveryAddress": "123 Main St, Philadelphia, PA"
      }
    }
  ],
  "notes": "Extra cheese please"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "order-id",
    "userId": "user-id",
    "assistantId": "assistant-id",
    "serviceDetails": [...],
    "status": "pending",
    "totalAmount": 29.99,
    "currency": "USD",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "message": "Order created successfully"
}
```

### GET /api/v1/orders/{id}

Get order details.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "order-id",
    "status": "completed",
    "totalAmount": 29.99,
    "assistant": {
      "id": "assistant-id",
      "name": "Foodie Assistant",
      "category": "food"
    },
    "transactions": [...],
    "reviews": [...],
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /api/v1/orders/{id}/cancel

Cancel a pending order.

**Headers:** `Authorization: Bearer <token>`

### POST /api/v1/orders/{id}/review

Add review to completed order.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent service!"
}
```

---

## User Endpoints

### GET /api/v1/users/stats

Get user statistics.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "ordersCount": 5,
    "reviewsCount": 3,
    "totalSpent": 149.95
  }
}
```

### GET /api/v1/users/orders

Get user's orders.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page

### GET /api/v1/users/reviews

Get user's reviews.

**Headers:** `Authorization: Bearer <token>`

---

## Health Check

### GET /health

Check API health status.

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "environment": "production",
  "version": "1.0.0"
}
```

---

## Rate Limits

- **General endpoints:** 100 requests per 15 minutes per IP
- **Authentication endpoints:** 5 attempts per 15 minutes per IP
- **Demo endpoints:** 10 requests per hour per IP

## Pagination

Paginated responses include a `meta` object:

```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

## Webhooks

The API supports webhooks for order status updates. Configure webhook URLs in your dashboard.

### Order Status Webhook

**Method:** POST

**Headers:**
```
Content-Type: application/json
X-Webhook-Signature: <signature>
```

**Payload:**
```json
{
  "event": "order.status_updated",
  "data": {
    "orderId": "order-id",
    "oldStatus": "pending",
    "newStatus": "completed",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

---

## SDKs and Libraries

- **JavaScript/Node.js:** `npm install ai-assistant-marketplace-sdk`
- **Python:** `pip install ai-assistant-marketplace-sdk`
- **PHP:** Composer package available

## Support

For API support, contact: api-support@ai-assistant-marketplace.com

## Changelog

### Version 1.0.0 (Current)
- Initial API release
- Basic CRUD operations for users, assistants, and orders
- JWT authentication
- Rate limiting and security features

---

*Last updated: October 2024*
