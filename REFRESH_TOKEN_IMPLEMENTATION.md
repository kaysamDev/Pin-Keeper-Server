# Refresh Token Implementation

## ✅ Implementation Complete!

Your application now has a complete refresh token system.

## New Files Created

1. **`src/models/auth/dto/refresh-token.dto.ts`** - DTO for refresh token requests
2. **`src/models/auth/dto/token-response.dto.ts`** - DTO for token responses
3. **`src/models/auth/refresh-token.service.ts`** - Service to manage refresh tokens

## Updated Files

1. **`src/models/auth/auth.service.ts`** - Added refresh token logic
2. **`src/models/auth/auth.controller.ts`** - Added new endpoints
3. **`src/models/auth/auth.module.ts`** - Added new providers

## New API Endpoints

### POST `/auth/login`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "a1b2c3d4e5f6...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### POST `/auth/refresh`
Use this to get a new access token when the current one expires.

**Request:**
```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "new-refresh-token...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### POST `/auth/logout`
Invalidates a specific refresh token.

**Request:**
```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### POST `/auth/logout-all`
Invalidates all refresh tokens for the user (logout from all devices).
Requires Bearer token authentication.

**Response:**
```json
{
  "message": "Logged out from all devices successfully"
}
```

## Token Expiration

| Token Type | Expiration |
|------------|------------|
| Access Token | 1 hour |
| Refresh Token | 7 days |

## Security Features

1. **Token Rotation**: When you refresh, the old refresh token is deleted and a new one is issued.
2. **Secure Storage**: Refresh tokens are stored in the database with expiration dates.
3. **Logout All**: Users can invalidate all their refresh tokens at once.
4. **Automatic Cleanup**: Expired tokens can be cleaned up using `deleteExpiredTokens()`.

## Usage Flow

```
1. User logs in with email/password
   └─→ Receives access_token + refresh_token

2. User makes API requests with access_token
   └─→ Authorization: Bearer <access_token>

3. Access token expires (after 1 hour)
   └─→ API returns 401 Unauthorized

4. Client calls /auth/refresh with refresh_token
   └─→ Receives new access_token + new refresh_token

5. User logs out
   └─→ Refresh token is invalidated
```

## Frontend Integration Example

```javascript
// Store tokens after login
const login = async (email, password) => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const { access_token, refresh_token } = await response.json();
  
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('refresh_token', refresh_token);
};

// Refresh tokens when access token expires
const refreshTokens = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  
  const response = await fetch('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken: refresh_token }),
  });
  
  const { access_token, refresh_token: new_refresh_token } = await response.json();
  
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('refresh_token', new_refresh_token);
};

// Logout
const logout = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  
  await fetch('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken: refresh_token }),
  });
  
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};
```

## Database

The `RefreshTokens` table stores:
- `id`: Primary key
- `userId`: Foreign key to Users
- `token`: Unique refresh token string
- `createdAt`: When the token was created
- `expiresAt`: When the token expires

## Testing in Swagger

1. Call `POST /auth/login` with credentials
2. Copy the `refresh_token` from the response
3. Call `POST /auth/refresh` with the refresh token
4. Observe new tokens are returned
5. Call `POST /auth/logout` to invalidate the token
