# Activity Logs Interceptor - Implementation Guide

## ✅ Setup Complete!

Your activity logging interceptor is now fully configured and will automatically save all authenticated requests to the database.

## How It Works

### 1. **Global Registration** (app.module.ts)
The interceptor is registered globally using `APP_INTERCEPTOR`:

```typescript
{
  provide: APP_INTERCEPTOR,
  useClass: ActivityLogsInterceptor,
}
```

This means **every HTTP request** in your application will pass through this interceptor.

### 2. **Data Captured**
For each authenticated request, the interceptor captures:
- **Action**: Generated from method + URL (e.g., `POST_CATEGORIES`, `GET_CATEGORIES_CATEGORY_:ID`)
- **User Info**: ID, fullName, role, email (from JWT token)
- **Request Details**: Method, URL, status code, duration
- **Request Body**: Sanitized (passwords/secrets redacted)
- **Errors**: If the request fails

### 3. **Database Storage**
The interceptor calls `ActivityLogsService.createActivityLog()` with this structure:

```typescript
{
  action: "POST_CATEGORIES",
  metadata: {
    method: "POST",
    url: "/categories",
    statusCode: 201,
    durationMs: 45,
    actor: {
      id: 1,
      fullName: "John Doe",
      role: "USER",
      email: "john@example.com"
    },
    requestBody: { name: "New Category" },
    timestamp: "2026-02-10T14:30:00.000Z"
  },
  user: { connect: { id: 1 } }
}
```

## Usage Examples

### Viewing Activity Logs

**Get all logs:**
```bash
GET /activity-logs
```

**Get logs for specific user:**
```bash
GET /activity-logs/user/1
```

**Get specific log:**
```bash
GET /activity-logs/activity-log/123
```

### Sample Response

```json
{
  "id": 1,
  "userId": 1,
  "action": "POST_CATEGORIES",
  "metadata": {
    "method": "POST",
    "url": "/categories",
    "statusCode": 201,
    "durationMs": 45,
    "actor": {
      "id": 1,
      "fullName": "John Doe",
      "role": "USER",
      "email": "john@example.com"
    },
    "requestBody": {
      "name": "New Category"
    },
    "timestamp": "2026-02-10T14:30:00.000Z"
  },
  "createdAt": "2026-02-10T14:30:00.000Z",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "USER"
  }
}
```

## Key Features

### ✅ Automatic Logging
- No need to add logging code to each controller
- Works for ALL routes automatically

### ✅ User Context Included
- **fullName**: Display who performed the action
- **role**: Know if it was USER, ADMIN, etc.
- **email**: Additional user identification

### ✅ Security
- Passwords and secrets are redacted (`***REDACTED***`)
- Only logs authenticated requests (requires JWT token)
- Logging failures don't break your application

### ✅ Performance Tracking
- Tracks request duration in milliseconds
- Helps identify slow endpoints

### ✅ Error Tracking
- Logs failed requests with error messages
- Status codes captured (200, 401, 500, etc.)

## Action Name Examples

The interceptor generates action names from the HTTP method and URL:

| Request | Action Name |
|---------|-------------|
| `POST /categories` | `POST_CATEGORIES` |
| `GET /categories` | `GET_CATEGORIES` |
| `GET /categories/category/123` | `GET_CATEGORIES_CATEGORY_:ID` |
| `PUT /categories/category/123` | `PUT_CATEGORIES_CATEGORY_:ID` |
| `DELETE /categories/category/123` | `DELETE_CATEGORIES_CATEGORY_:ID` |
| `POST /auth/login` | `POST_AUTH_LOGIN` |
| `GET /locations` | `GET_LOCATIONS` |

Numbers in URLs are replaced with `:id` for cleaner action names.

## Testing It Out

### 1. Start your application
```bash
npm run start:dev
```

### 2. Make an authenticated request
```bash
# Login first
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Use the token to create a category
curl -X POST http://localhost:3000/categories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Category"}'
```

### 3. Check the logs
```bash
curl http://localhost:3000/activity-logs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

You should see an entry like:
```json
{
  "action": "POST_CATEGORIES",
  "metadata": {
    "actor": {
      "fullName": "Your Name",
      "role": "USER"
    }
  }
}
```

## Important Notes

### Authentication Required
The interceptor only logs requests where `req.user` exists (set by your `AuthGuard`). This means:
- ✅ Protected routes with `@UseGuards(AuthGuard)` will be logged
- ❌ Public routes (login, register) won't be logged (no user context)

### Non-Blocking
- Logging happens asynchronously
- If logging fails, your request continues normally
- Errors are caught and logged to console

### Privacy
Sensitive fields are automatically redacted:
- `password`
- `token`
- `secret`
- `apiKey`

## Troubleshooting

### No logs appearing?
1. **Check authentication**: Ensure your requests include a valid JWT token
2. **Check database**: Verify the `ActivityLogs` table exists
3. **Check console**: Look for "Failed to save activity log" errors
4. **Verify JWT payload**: Token must include `sub` (user ID), `fullName`, and `role`

### Logs missing user fullName/role?
Update your auth service to include these fields in the JWT payload:

```typescript
const payload = {
  sub: user.id,
  username: user.fullName,
  fullName: user.fullName,
  role: user.role,
  email: user.email,
};
```

## Summary

Your activity logging is now **fully operational**! Every authenticated request will automatically:
1. ✅ Be captured by the interceptor
2. ✅ Include user fullName and role
3. ✅ Be saved to the ActivityLogs table
4. ✅ Be queryable via `/activity-logs` endpoints

No additional code needed in your controllers - it's all automatic! 🎉
