# Authentication Flow Documentation

This document describes the authentication flow implemented in SPARTAN 4.

## Overview

SPARTAN 4 implements a JWT-based authentication system with both registration and login capabilities. The system supports both database storage (SQLite) and in-memory fallback for development.

## Registration Flow

1. **User Input**:
   - Name (required for registration)
   - Email (validated format)
   - Password (minimum 6 characters)
   - Confirm Password (must match password)

2. **Validation**:
   - Client-side validation with real-time feedback
   - Server-side validation for security
   - Duplicate email check

3. **Processing**:
   - Password hashing with bcrypt
   - User creation in database or in-memory storage
   - JWT token generation (access and refresh tokens)

4. **Response**:
   - User object (without password)
   - Access and refresh tokens
   - Success status

## Login Flow

1. **User Input**:
   - Email
   - Password

2. **Validation**:
   - Email format validation
   - Password length validation

3. **Authentication**:
   - Email lookup in database/in-memory storage
   - Password verification with bcrypt
   - Last login timestamp update

4. **Token Generation**:
   - Access token (15 minutes expiry)
   - Refresh token (7 days expiry)

5. **Response**:
   - User object
   - Access and refresh tokens
   - Success status

## Token Management

### Access Token
- Short-lived (15 minutes)
- Used for API authentication
- Must be included in Authorization header

### Refresh Token
- Long-lived (7 days)
- Used to obtain new access tokens
- Stored securely (HttpOnly cookie recommended)

## Security Features

1. **Rate Limiting**:
   - General API: 100 requests per 15 minutes
   - Auth endpoints: 5 attempts per 15 minutes

2. **Password Security**:
   - bcrypt hashing with salt
   - Minimum length requirement

3. **Input Validation**:
   - Email format validation
   - Password strength requirements
   - SQL injection prevention

4. **CORS Protection**:
   - Restricted origins
   - Secure headers

## Environment-Based Configuration

### Development
- In-memory fallback available
- Configurable force sync
- Detailed error messages

### Production
- Database storage only
- No force sync
- Generic error messages

## API Endpoints

### POST /api/auth/register
Register a new user

**Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response**:
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "createdAt": "date",
    "lastLogin": "date"
  },
  "tokens": {
    "accessToken": "string",
    "refreshToken": "string",
    "expiresIn": "number"
  }
}
```

### POST /api/auth/login
Login with existing credentials

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response**:
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "createdAt": "date",
    "lastLogin": "date"
  },
  "tokens": {
    "accessToken": "string",
    "refreshToken": "string",
    "expiresIn": "number"
  }
}
```

### POST /api/auth/refresh
Refresh access token

**Request Body**:
```json
{
  "refreshToken": "string"
}
```

**Response**:
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "expiresIn": "number"
}
```

## UI Components

### AuthScreen Component
The main authentication screen that handles both registration and login flows.

**Features**:
- Toggle between login and registration views
- Real-time form validation
- Password visibility toggle
- Loading states
- Error handling
- Terms and privacy links (registration)

### Form Validation
- Client-side validation with immediate feedback
- Server-side validation for security
- Password strength indicators
- Matching password confirmation

## Best Practices

1. **Token Storage**:
   - Store refresh tokens securely (HttpOnly cookies)
   - Never store tokens in localStorage for production

2. **Error Handling**:
   - Generic error messages for security
   - Detailed logging for debugging

3. **Session Management**:
   - Implement token refresh automatically
   - Handle expired tokens gracefully

4. **Security**:
   - Use HTTPS in production
   - Implement proper CORS policies
   - Regularly rotate JWT secrets