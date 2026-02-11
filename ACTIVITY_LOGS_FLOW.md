# Activity Logs Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT REQUEST                                │
│  POST /categories (with JWT Bearer Token)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APP.MODULE.TS                                 │
│  Global APP_INTERCEPTOR: ActivityLogsInterceptor                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              ACTIVITY LOGS INTERCEPTOR                           │
│  1. Extract request details (method, url, body)                 │
│  2. Extract user from JWT (id, fullName, role, email)           │
│  3. Let request continue to controller...                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              CATEGORIES CONTROLLER                               │
│  Processes the request and returns response                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│         INTERCEPTOR (tap operator - after response)              │
│  1. Calculate duration                                           │
│  2. Get status code                                              │
│  3. Call saveActivityLog()                                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              ACTIVITY LOGS SERVICE                               │
│  createActivityLog({                                             │
│    action: "POST_CATEGORIES",                                    │
│    metadata: {                                                   │
│      actor: { fullName, role },                                  │
│      method, url, statusCode, durationMs                         │
│    },                                                            │
│    user: { connect: { id } }                                     │
│  })                                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PRISMA / DATABASE                              │
│  INSERT INTO ActivityLogs (userId, action, metadata, createdAt) │
│  VALUES (1, 'POST_CATEGORIES', {...}, '2026-02-10...')          │
└─────────────────────────────────────────────────────────────────┘

                         │
                         ▼
                  ✅ LOG SAVED!

┌─────────────────────────────────────────────────────────────────┐
│            RETRIEVING LOGS (GET /activity-logs)                  │
│                                                                  │
│  ActivityLogsController                                          │
│         ↓                                                        │
│  ActivityLogsService.getActivityLogs()                          │
│         ↓                                                        │
│  Prisma query with user.select (id, email, fullName, role)     │
│         ↓                                                        │
│  Response: [{ action, metadata: { actor: { fullName, role }}}] │
└─────────────────────────────────────────────────────────────────┘
```

## Key Points:

1. **Automatic**: Runs on EVERY request via APP_INTERCEPTOR
2. **Non-blocking**: Uses tap() operator, doesn't delay response
3. **User Context**: Extracts fullName & role from JWT token
4. **Database**: Saves to ActivityLogs table via Prisma
5. **Queryable**: GET /activity-logs returns logs with user details
