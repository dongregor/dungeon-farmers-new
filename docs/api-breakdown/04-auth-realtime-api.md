# Auth & Real-time APIs

**Category:** Authentication, Onboarding, Sync, Real-time Events
**Total Endpoints:** ~27
**Priority:** Phase 1

---

## 1. Authentication API

Base path: `/api/auth`

### US-OB-001 to US-OB-010: Account Management

#### POST /api/auth/register
Register a new account.

```typescript
// Request
POST /api/auth/register
{
  "email": "player@example.com",
  "password": "securePassword123",
  "displayName": "DragonSlayer42",
  "acceptTerms": true
}

// Response
{
  success: true,
  data: {
    user: {
      id: "user123",
      email: "player@example.com",
      displayName: "DragonSlayer42",
      createdAt: 1704067200000
    },
    session: {
      accessToken: "eyJhbG...",
      refreshToken: "eyJhbG...",
      expiresAt: 1704153600000
    },
    player: PlayerProfile,  // New player created
    tutorial: {
      required: true,
      startStep: "welcome"
    }
  }
}

// Error responses
{
  success: false,
  error: {
    code: "EMAIL_EXISTS",
    message: "An account with this email already exists"
  }
}

{
  success: false,
  error: {
    code: "WEAK_PASSWORD",
    message: "Password must be at least 8 characters with a number"
  }
}
```

**Related User Stories:** US-OB-001, US-OB-002
**Priority:** Phase 1

---

#### POST /api/auth/login
Login to existing account.

```typescript
// Request
POST /api/auth/login
{
  "email": "player@example.com",
  "password": "securePassword123"
}

// Response
{
  success: true,
  data: {
    user: {
      id: "user123",
      email: "player@example.com",
      displayName: "DragonSlayer42"
    },
    session: {
      accessToken: "eyJhbG...",
      refreshToken: "eyJhbG...",
      expiresAt: 1704153600000
    },
    player: PlayerProfile,
    offlineProgress: {
      duration: 28800000,  // 8 hours
      rewards: {
        gold: 450,
        experience: 200
      },
      expeditionsCompleted: 2
    }
  }
}

// Error
{
  success: false,
  error: {
    code: "INVALID_CREDENTIALS",
    message: "Invalid email or password"
  }
}
```

**Related User Stories:** US-OB-003
**Priority:** Phase 1

---

#### POST /api/auth/guest
Create anonymous guest account.

```typescript
// Request
POST /api/auth/guest
{
  "deviceId": "device_fingerprint_123"  // Optional, for device linking
}

// Response
{
  success: true,
  data: {
    user: {
      id: "guest_abc123",
      isGuest: true,
      displayName: "Adventurer_7823"
    },
    session: {
      guestToken: "guest_eyJhbG...",
      expiresAt: null  // Guests don't expire
    },
    player: PlayerProfile,
    tutorial: {
      required: true,
      startStep: "welcome"
    },
    warning: "Create an account to save your progress permanently"
  }
}
```

**Related User Stories:** US-OB-004, US-OB-005
**Priority:** Phase 1

---

#### POST /api/auth/guest/link
Link guest account to permanent account.

```typescript
// Request (with guest token)
POST /api/auth/guest/link
{
  "email": "player@example.com",
  "password": "securePassword123",
  "displayName": "DragonSlayer42"
}

// Response
{
  success: true,
  data: {
    linked: true,
    previousGuest: "guest_abc123",
    newUser: {
      id: "user456",
      email: "player@example.com",
      displayName: "DragonSlayer42"
    },
    session: {
      accessToken: "eyJhbG...",
      refreshToken: "eyJhbG..."
    },
    progressPreserved: true,
    bonusReward: {
      gold: 500,
      reason: "Account creation bonus"
    }
  }
}
```

**Related User Stories:** US-OB-006
**Priority:** Phase 1

---

#### POST /api/auth/logout
Logout current session.

```typescript
// Request
POST /api/auth/logout

// Response
{
  success: true,
  data: {
    loggedOut: true
  }
}
```

**Related User Stories:** US-OB-007
**Priority:** Phase 1

---

#### POST /api/auth/refresh
Refresh access token.

```typescript
// Request
POST /api/auth/refresh
{
  "refreshToken": "eyJhbG..."
}

// Response
{
  success: true,
  data: {
    accessToken: "eyJhbG...",
    expiresAt: 1704153600000
  }
}
```

**Related User Stories:** US-OB-008
**Priority:** Phase 1

---

#### POST /api/auth/password/reset
Request password reset.

```typescript
// Request
POST /api/auth/password/reset
{
  "email": "player@example.com"
}

// Response
{
  success: true,
  data: {
    sent: true,
    message: "If an account exists, a reset email has been sent"
  }
}
```

**Related User Stories:** US-OB-009
**Priority:** Phase 1

---

#### POST /api/auth/password/change
Change password (authenticated).

```typescript
// Request
POST /api/auth/password/change
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}

// Response
{
  success: true,
  data: {
    changed: true,
    sessionsInvalidated: 3  // Other sessions logged out
  }
}
```

**Related User Stories:** US-OB-010
**Priority:** Phase 1

---

#### DELETE /api/auth/account
Delete account permanently.

```typescript
// Request
DELETE /api/auth/account
{
  "password": "securePassword123",
  "confirm": "DELETE MY ACCOUNT"
}

// Response
{
  success: true,
  data: {
    deleted: true,
    dataRemoved: [
      "player_profile",
      "heroes",
      "inventory",
      "monsters",
      "dungeons",
      "progress"
    ],
    gracePeriod: {
      canRecover: true,
      until: 1706745600000  // 30 days
    }
  }
}
```

**Related User Stories:** US-OB-011
**Priority:** Phase 2

---

## 2. Onboarding API

Base path: `/api/onboarding`

### US-OB-012 to US-OB-027: Tutorial & New Player Experience

#### GET /api/onboarding/status
Get onboarding/tutorial status.

```typescript
// Response
{
  success: true,
  data: {
    completed: false,
    currentStep: "first_expedition",

    progress: {
      welcome: { completed: true, skippable: false },
      name_hero: { completed: true, skippable: false },
      first_expedition: { completed: false, skippable: true },
      collect_rewards: { completed: false, skippable: false },
      recruit_hero: { completed: false, skippable: true },
      equip_item: { completed: false, skippable: true },
      tutorial_complete: { completed: false, skippable: false }
    },

    rewards: {
      claimed: ["welcome_gold"],
      pending: ["first_expedition_reward"]
    },

    canSkip: true,  // User has option to skip remaining
    estimatedTime: "5 minutes"
  }
}
```

**Related User Stories:** US-OB-012, US-OB-013
**Priority:** Phase 1

---

#### POST /api/onboarding/step
Complete an onboarding step.

```typescript
// Request
POST /api/onboarding/step
{
  "step": "first_expedition",
  "data": {
    "expeditionId": "exp123"  // Validation data
  }
}

// Response
{
  success: true,
  data: {
    step: "first_expedition",
    completed: true,

    reward: {
      gold: 200,
      message: "Great job completing your first expedition!"
    },

    nextStep: "collect_rewards",
    hint: "Now let's collect your rewards and see what loot you got!"
  }
}
```

**Related User Stories:** US-OB-014, US-OB-015
**Priority:** Phase 1

---

#### POST /api/onboarding/skip
Skip remaining tutorial.

```typescript
// Request
POST /api/onboarding/skip
{
  "confirm": true
}

// Response
{
  success: true,
  data: {
    skipped: true,
    missedRewards: [
      { step: "recruit_hero", reward: { gold: 100 } }
    ],
    bonusGranted: {
      reason: "Tutorial skip compensation",
      items: [
        { type: "gold", amount: 500 }
      ]
    },
    tipEnabled: true,  // Show contextual tips instead
    message: "Tutorial skipped. Tips will appear to help you learn!"
  }
}
```

**Related User Stories:** US-OB-016
**Priority:** Phase 1

---

#### POST /api/onboarding/reset
Reset tutorial (for testing or re-learning).

```typescript
// Request
POST /api/onboarding/reset

// Response
{
  success: true,
  data: {
    reset: true,
    startStep: "welcome",
    warning: "Tutorial rewards will not be given again"
  }
}
```

**Related User Stories:** US-OB-017
**Priority:** Phase 2

---

## 3. Game Sync API

Base path: `/api/sync`

### US-OB-018 to US-OB-022: Game State Synchronization

#### POST /api/sync
Synchronize game state with server.

```typescript
// Request
POST /api/sync
{
  "clientTimestamp": 1704067200000,
  "clientVersion": "1.0.0",
  "lastSyncId": "sync_abc123",

  // Optional: client-side changes to push
  "changes": {
    "settings": { "theme": "dark" }
  }
}

// Response
{
  success: true,
  data: {
    syncId: "sync_def456",
    serverTimestamp: 1704067200500,

    // Full state or delta based on lastSyncId
    state: {
      player: PlayerProfile,
      heroes: HeroSummary[],
      activeExpeditions: ExpeditionSummary[],
      resources: ResourceState,
      notifications: Notification[]
    },

    // Offline progress calculated
    offlineProgress: {
      duration: 28800000,
      passiveIncome: {
        gold: 450,
        experience: 200,
        materials: []
      },
      completedExpeditions: [
        {
          expeditionId: "exp123",
          rewards: RewardSummary,
          claimable: true
        }
      ],
      dungeonRuns: [
        {
          dungeonId: "dun456",
          runId: "run789",
          rewards: RewardSummary,
          claimable: true
        }
      ]
    },

    // Server events that occurred
    events: [
      {
        type: "daily_reset",
        message: "Daily quests have reset!",
        timestamp: 1704067200000
      }
    ]
  }
}
```

**Related User Stories:** US-OB-018, US-OB-019
**Priority:** Phase 1

---

#### GET /api/sync/status
Check sync status without full sync.

```typescript
// Response
{
  success: true,
  data: {
    lastSync: 1704067000000,
    pendingChanges: 2,
    serverVersion: "1.0.1",
    clientOutdated: false,

    quickStatus: {
      activeExpeditions: 2,
      completedExpeditions: 1,
      unreadNotifications: 3,
      unclaimedRewards: 2
    }
  }
}
```

**Related User Stories:** US-OB-020
**Priority:** Phase 1

---

#### POST /api/sync/claim-offline
Claim offline progress rewards.

```typescript
// Request
POST /api/sync/claim-offline
{
  "expeditionIds": ["exp123"],
  "dungeonRunIds": ["run789"]
}

// Response
{
  success: true,
  data: {
    claimed: {
      expeditions: [
        {
          id: "exp123",
          rewards: ExpeditionRewards
        }
      ],
      dungeonRuns: [
        {
          id: "run789",
          rewards: DungeonRunRewards
        }
      ],
      passiveIncome: {
        gold: 450,
        experience: 200
      }
    },
    totals: {
      gold: 1200,
      experience: 500,
      items: 3
    }
  }
}
```

**Related User Stories:** US-OB-021
**Priority:** Phase 1

---

## 4. Real-time Events API

Base path: `/api/events`

### Server-Sent Events for Real-time Updates

#### GET /api/events/subscribe
Subscribe to real-time events (SSE).

```typescript
// Request
GET /api/events/subscribe
Accept: text/event-stream

// Response (SSE stream)
event: connected
data: {"connectionId": "conn123", "timestamp": 1704067200000}

event: expedition_complete
data: {"expeditionId": "exp123", "rewards": {...}, "timestamp": 1704070800000}

event: expedition_event
data: {"expeditionId": "exp456", "event": {...}, "requiresChoice": true}

event: tavern_refresh
data: {"slots": [...], "freeRefresh": true}

event: daily_reset
data: {"newQuests": 5, "loginRewardAvailable": true}

event: achievement_unlocked
data: {"achievementId": "ach123", "name": "Hero Collector", "rewards": {...}}

event: notification
data: {"id": "notif123", "type": "info", "message": "...", "action": {...}}

event: heartbeat
data: {"timestamp": 1704067260000}
```

#### Event Types by Phase

**Phase 1 (MVP) - Required:**
- `connected` - Connection established confirmation
- `expedition_complete` - Expedition finished, rewards available
- `daily_reset` - Daily quests/rewards reset
- `heartbeat` - Keep-alive ping (every 30 seconds)

**Phase 2 - Extended:**
- `expedition_event` - Choice/event during expedition
- `tavern_refresh` - Tavern auto-refreshed
- `achievement_unlocked` - Achievement earned
- `notification` - General notifications
- `dungeon_run_complete` - Dungeon farming finished

#### Connection Management

```typescript
// Client-side reconnection strategy
const connectSSE = () => {
  const eventSource = new EventSource('/api/events/subscribe')

  eventSource.onerror = () => {
    eventSource.close()
    // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
    setTimeout(connectSSE, Math.min(retryDelay * 2, 30000))
  }

  eventSource.addEventListener('heartbeat', () => {
    lastHeartbeat = Date.now()
  })
}

// Server sends heartbeat every 30 seconds
// Client should reconnect if no heartbeat received in 60 seconds
```

**Related User Stories:** US-OB-022, US-EX-004
**Priority:** Phase 1 (basic), Phase 2 (full)

---

#### POST /api/events/unsubscribe
Unsubscribe from events.

```typescript
// Request
POST /api/events/unsubscribe
{
  "connectionId": "conn123"
}

// Response
{
  success: true,
  data: {
    unsubscribed: true
  }
}
```

**Related User Stories:** US-OB-022
**Priority:** Phase 1

---

## 5. Notifications API

Base path: `/api/notifications`

### US-OB-023 to US-OB-027: Notification System

#### GET /api/notifications
Get all notifications.

```typescript
// Request
GET /api/notifications?unread=true&limit=20

// Response
{
  success: true,
  data: {
    notifications: Notification[],
    unreadCount: 5,
    hasMore: true
  }
}

interface Notification {
  id: string
  type: 'expedition' | 'achievement' | 'daily' | 'system' | 'social'
  priority: 'low' | 'medium' | 'high'

  title: string
  message: string
  icon?: string

  action?: {
    type: 'navigate' | 'claim' | 'dismiss'
    target?: string
    data?: any
  }

  read: boolean
  createdAt: number
  expiresAt?: number
}
```

**Related User Stories:** US-OB-023
**Priority:** Phase 1

---

#### POST /api/notifications/:id/read
Mark notification as read.

```typescript
// Request
POST /api/notifications/notif123/read

// Response
{
  success: true,
  data: {
    notificationId: "notif123",
    read: true,
    unreadCount: 4
  }
}
```

**Related User Stories:** US-OB-024
**Priority:** Phase 1

---

#### POST /api/notifications/read-all
Mark all notifications as read.

```typescript
// Request
POST /api/notifications/read-all

// Response
{
  success: true,
  data: {
    marked: 5,
    unreadCount: 0
  }
}
```

**Related User Stories:** US-OB-025
**Priority:** Phase 1

---

#### DELETE /api/notifications/:id
Delete a notification.

```typescript
// Request
DELETE /api/notifications/notif123

// Response
{
  success: true,
  data: {
    deleted: true
  }
}
```

**Related User Stories:** US-OB-026
**Priority:** Phase 2

---

#### PATCH /api/notifications/settings
Update notification preferences.

```typescript
// Request
PATCH /api/notifications/settings
{
  "push": {
    "enabled": true,
    "expeditionComplete": true,
    "dailyReminder": false,
    "achievements": true
  },
  "inApp": {
    "sound": false,
    "vibrate": true
  }
}

// Response
{
  success: true,
  data: {
    updated: true,
    settings: NotificationSettings
  }
}
```

**Related User Stories:** US-OB-027
**Priority:** Phase 2

---

## 6. Health & Meta API

Base path: `/api`

### Server Health and Meta Information

#### GET /api/health
Server health check.

```typescript
// Response
{
  success: true,
  data: {
    status: "healthy",
    version: "1.0.0",
    timestamp: 1704067200000,

    services: {
      database: "healthy",
      auth: "healthy",
      cache: "healthy"
    }
  }
}
```

**Priority:** Phase 1

---

#### GET /api/version
Get client version requirements.

```typescript
// Response
{
  success: true,
  data: {
    currentVersion: "1.0.0",
    minimumVersion: "0.9.0",
    recommendedVersion: "1.0.0",

    updateAvailable: false,
    forceUpdate: false,

    changelog: [
      {
        version: "1.0.0",
        date: "2024-12-29",
        changes: ["Initial release"]
      }
    ]
  }
}
```

**Priority:** Phase 1

---

#### GET /api/maintenance
Check maintenance status.

```typescript
// Response (normal)
{
  success: true,
  data: {
    maintenance: false
  }
}

// Response (during maintenance)
{
  success: true,
  data: {
    maintenance: true,
    message: "Server maintenance in progress",
    estimatedEnd: 1704070800000,
    reason: "Database upgrade"
  }
}
```

**Priority:** Phase 1

---

## Summary

### Endpoint Count by Category
- **Authentication:** 9 endpoints
- **Onboarding:** 4 endpoints
- **Game Sync:** 3 endpoints
- **Real-time Events:** 2 endpoints
- **Notifications:** 5 endpoints
- **Health & Meta:** 3 endpoints

**Total:** 26 endpoints

### Implementation Priority

**Phase 1 (MVP):**
- Auth: register, login, guest, guest/link, logout, refresh
- Onboarding: status, step, skip
- Sync: sync, status, claim-offline
- Events: subscribe (basic)
- Notifications: list, read, read-all
- Health: health, version, maintenance

**Phase 2:**
- Auth: password/reset, password/change, account delete
- Onboarding: reset
- Events: full event types
- Notifications: delete, settings

**Phase 3+:**
- Advanced notification targeting
- Push notifications
- Supabase Realtime migration

### Security Notes

> **See Also:** [Centralized Security Specification](../README.md#security-considerations) for complete rate-limiting tables and security policies across all API endpoints.

1. **Rate Limiting:**
   - Auth endpoints: 5 requests/minute
   - Guest creation: 3/hour per IP
   - General API: 100 requests/minute
   - SSE connections: 1 per user (older connections closed)

2. **Token Management:**
   - Access tokens: 1 hour expiry
   - Refresh tokens: 7 days expiry
   - Guest tokens: No expiry (device-linked)

3. **Validation:**
   - Email format validation
   - Password strength requirements (8+ chars, 1 number)
   - Display name sanitization (no HTML, length limits)

4. **Anti-Abuse:**
   - Device fingerprinting for guest accounts
   - IP-based rate limiting
   - Suspicious activity detection
   - Failed login lockout (5 attempts, 15 min cooldown)
