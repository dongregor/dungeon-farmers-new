# Authentication & Onboarding UI Flow Design

**Last Updated:** 2025-12-29
**Status:** Design Document
**Related User Stories:** US-OB-001 through US-OB-027

---

## Table of Contents

1. [Overview](#overview)
2. [Landing Page](#1-landing-page)
3. [Guest vs Account Decision](#2-guest-vs-account-decision)
4. [Authentication Flows](#3-authentication-flows)
5. [Account Linking](#5-account-linking)
6. [Welcome Sequence](#6-welcome-sequence)
7. [Tutorial Progression](#7-tutorial-progression)
8. [Contextual Help System](#8-contextual-help-system)
9. [Returning Player Experience](#9-returning-player-experience)
10. [State Management](#10-state-management)
11. [Implementation Priority](#11-implementation-priority)

---

## Overview

### Design Goals

- **Zero Friction:** Players can start immediately without account creation
- **Progressive Engagement:** Convert engaged guests to full accounts
- **Respects Player Time:** Skippable tutorials, self-paced learning
- **Mobile-First:** Works seamlessly on all devices
- **Tone-Appropriate:** Lighthearted fantasy parody throughout

### User Journey Map

```
NEW PLAYER:
Landing Page → Guest/Account Choice → [Guest: Immediate Play | Account: Register/Login]
  → Welcome Screen → First Hero → UI Tour → Guild Name → Tutorial → Game

RETURNING PLAYER (Guest):
Landing Page → Auto-login via localStorage → Welcome Back Modal → Resume Game

RETURNING PLAYER (Account):
Landing Page → Auto-login via session → Welcome Back Modal → Offline Progress → Resume Game

GUEST → ACCOUNT CONVERSION:
Playing as Guest → "Create Account" prompt → Link Account Flow → Data Migration → Confirmed Account
```

---

## 1. Landing Page

**Route:** `/` (when not authenticated)
**User Stories:** US-OB-001, US-OB-002, US-OB-003
**Priority:** Phase 1

### Purpose
First impression that sets the tone and offers immediate play or account options.

### UI Elements

#### Hero Section
- **Game Logo**: "Dungeon Farmers" with fantasy-style typography
- **Tagline**: "Build dungeons. Capture monsters. Farm legendary loot."
- **Animated Background**: Subtle parallax or idle animation (low-fidelity sprites)
- **Tone Indicator**: Brief flavor text (1-2 sentences)
  - Example: "Your heroes are quirky. Your dungeons are deadly. Your loot is questionable. Welcome to the guild."

#### Primary Actions (Prominent, Center)
```
┌──────────────────────────────────────┐
│  [▶ Play as Guest - No Account]     │  ← Large, eye-catching button
│        Start playing in seconds!     │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  [🔐 Sign In / Create Account]      │  ← Secondary button (less prominent)
└──────────────────────────────────────┘
```

#### Supporting Content (Below fold)
- **Three Core Pillars** (visual icons + 1 sentence each)
  - Quirky Heroes: "Randomly generated with personality traits"
  - Player-Built Dungeons: "Capture monsters, stock your own dungeons"
  - Emergent Stories: "Every expedition tells a unique tale"
- **Screenshot Carousel** (optional Phase 3)
- **Footer**: Links to Discord, Support, Privacy Policy, Terms of Service

### Navigation Flow

| Action | Destination | Notes |
|--------|-------------|-------|
| "Play as Guest" | `/welcome` | Creates guest session, redirects |
| "Sign In / Create Account" | `/auth/choice` | Intermediate choice page |
| Auto-redirect if session exists | `/` (game dashboard) | Skip landing entirely |

### State Persistence
- **localStorage**: Last auth choice (guest/account) for "Welcome back!" messaging
- **Cookie**: Session token if authenticated

### Mobile Considerations
- Stack buttons vertically on small screens
- Reduce parallax animation complexity
- Ensure tap targets are 44x44px minimum

### Implementation Notes
```vue
// /app/pages/index.vue (unauthenticated landing)
<script setup lang="ts">
definePageMeta({
  layout: 'landing', // Custom layout with no nav/sidebar
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Redirect if already authenticated
watch(user, (newUser) => {
  if (newUser) {
    navigateTo('/dashboard')
  }
}, { immediate: true })

async function playAsGuest() {
  // Create guest session in localStorage
  const guestId = crypto.randomUUID()
  localStorage.setItem('guest_session', guestId)
  localStorage.setItem('is_guest', 'true')
  navigateTo('/welcome')
}

function goToAuth() {
  navigateTo('/auth/choice')
}
</script>
```

---

## 2. Guest vs Account Decision

**Route:** `/auth/choice`
**User Stories:** US-OB-001, US-OB-002, US-OB-003
**Priority:** Phase 1

### Purpose
Intermediate page when user clicks "Sign In / Create Account" from landing.

### UI Elements

```
┌─────────────────────────────────────────────┐
│           DUNGEON FARMERS                    │
│                                              │
│   Already have an account?                   │
│   ┌───────────────────────────────┐         │
│   │   [Sign In]                   │         │
│   └───────────────────────────────┘         │
│                                              │
│   New to Dungeon Farmers?                    │
│   ┌───────────────────────────────┐         │
│   │   [Create Account]            │         │
│   └───────────────────────────────┘         │
│                                              │
│   ← Back to Landing                          │
└─────────────────────────────────────────────┘
```

### Navigation Flow

| Action | Destination |
|--------|-------------|
| "Sign In" | `/login` |
| "Create Account" | `/register` |
| "Back to Landing" | `/` |

### State Persistence
None required (transient page)

---

## 3. Authentication Flows

### 3.1 Login Page

**Route:** `/login`
**User Stories:** US-OB-003, US-OB-004
**Priority:** Phase 1

#### Purpose
Authenticate existing users with email/password or OAuth.

#### UI Elements

**Layout: Centered Card on Dark Background**

```
┌─────────────────────────────────────────────┐
│          🏰 DUNGEON FARMERS                  │
│         Welcome back, Guild Master           │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │  [G] Continue with Google          │    │ ← OAuth (prominent)
│  └────────────────────────────────────┘    │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │  [D] Continue with Discord         │    │ ← OAuth (Phase 2)
│  └────────────────────────────────────┘    │
│                                              │
│  ───────── or sign in with email ─────────  │
│                                              │
│  Email:                                      │
│  [_________________________________]        │
│                                              │
│  Password:                                   │
│  [_________________________________]        │
│  🔗 Forgot password?                        │
│                                              │
│  [ ] Remember me                             │
│                                              │
│  [Sign In]                                   │
│                                              │
│  Don't have an account? Create one           │
│  ← Back to Landing                           │
└─────────────────────────────────────────────┘
```

#### Form Validation
- **Email**: Valid email format
- **Password**: Minimum 6 characters (Supabase default)
- **Error Messages**: Generic for security ("Invalid email or password")
- **Rate Limiting**: 5 attempts → 5-minute cooldown (Supabase handles this)

#### OAuth Flow
```typescript
async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
}
```

#### Navigation Flow

| Action | Destination | Notes |
|--------|-------------|-------|
| Successful login | `/dashboard` or `/welcome` | Check if new user |
| "Forgot password" | `/auth/reset` | Password recovery |
| "Create one" | `/register` | Registration flow |
| OAuth callback | `/auth/callback` | Handles OAuth redirect |

#### State Persistence
- **Session Cookie**: Supabase JWT token
- **Remember Me**: Extended session (30 days vs 1 hour)

#### Error Handling
```typescript
// Generic error for invalid credentials
if (error?.message.includes('Invalid login')) {
  error.value = 'Invalid email or password. Please try again.'
}

// Rate limit error
if (error?.message.includes('too many requests')) {
  error.value = 'Too many attempts. Please try again in 5 minutes.'
}
```

---

### 3.2 Registration Page

**Route:** `/register`
**User Stories:** US-OB-002
**Priority:** Phase 1

#### Purpose
Create new full accounts with email/password or OAuth.

#### UI Elements

```
┌─────────────────────────────────────────────┐
│          🏰 DUNGEON FARMERS                  │
│       Create your Guild Master account       │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │  [G] Continue with Google          │    │ ← OAuth (fastest)
│  └────────────────────────────────────┘    │
│                                              │
│  ───────── or register with email ──────────│
│                                              │
│  Email:                                      │
│  [_________________________________]        │
│                                              │
│  Password (8+ characters):                   │
│  [_________________________________]        │
│  Password strength: [████░░] Weak           │
│                                              │
│  Confirm Password:                           │
│  [_________________________________]        │
│                                              │
│  [ ] I agree to Terms of Service and        │
│      Privacy Policy                          │
│                                              │
│  [Create Account]                            │
│                                              │
│  Already have an account? Sign in            │
│  ← Back to Landing                           │
└─────────────────────────────────────────────┘
```

#### Form Validation
- **Email**: Valid format, not already registered
- **Password**:
  - Minimum 8 characters
  - At least 1 uppercase, 1 lowercase, 1 number
  - Strength indicator (Weak/Good/Strong)
- **Confirm Password**: Must match password
- **Terms Acceptance**: Required checkbox

#### Success Flow
```
Registration → Email Verification Sent → Success Message
```

**Success Message:**
```
✅ Account Created!

Check your email (spam folder too!) to verify your account.

[Take me to the game →]
```

#### Navigation Flow

| Action | Destination | Notes |
|--------|-------------|-------|
| Successful registration | `/welcome` | Start onboarding |
| Email already exists | Show error inline | "Email already in use" |
| "Sign in" link | `/login` | Switch to login |

#### Email Verification
- **Immediate Access**: Can play before verifying (per Supabase default)
- **Reminder**: Banner in-game until verified
- **Resend Link**: Available on settings page

---

### 3.3 Password Recovery

**Route:** `/auth/reset`
**User Stories:** US-OB-004
**Priority:** Phase 2 (Nice-to-have for MVP)

#### Purpose
Allow users to recover forgotten passwords.

#### UI Elements - Request Reset

```
┌─────────────────────────────────────────────┐
│          🔑 Password Recovery                │
│                                              │
│  Enter your email to receive a reset link.  │
│                                              │
│  Email:                                      │
│  [_________________________________]        │
│                                              │
│  [Send Reset Link]                           │
│                                              │
│  Remember your password? Sign in             │
│  ← Back to Login                             │
└─────────────────────────────────────────────┘
```

#### UI Elements - Reset Email Sent

```
┌─────────────────────────────────────────────┐
│          ✉️  Check Your Email                │
│                                              │
│  We sent a password reset link to:          │
│  user@example.com                            │
│                                              │
│  The link expires in 1 hour.                 │
│                                              │
│  Check your spam folder if you don't see it. │
│                                              │
│  [Resend Email] [Back to Login]              │
└─────────────────────────────────────────────┘
```

#### UI Elements - Set New Password

**Route:** `/auth/reset/confirm?token=...`

```
┌─────────────────────────────────────────────┐
│          🔑 Set New Password                 │
│                                              │
│  New Password (8+ characters):               │
│  [_________________________________]        │
│  Password strength: [██████] Strong          │
│                                              │
│  Confirm New Password:                       │
│  [_________________________________]        │
│                                              │
│  [Reset Password]                            │
└─────────────────────────────────────────────┘
```

#### Navigation Flow

| Action | Destination | Notes |
|--------|-------------|-------|
| Reset link sent | Show success message | Stay on page |
| Password reset success | `/login` | Auto-login optional |
| Token expired | Show error, offer resend | Token valid 1 hour |

#### Security Features
- **Token Generation**: Supabase secure tokens
- **Rate Limiting**: Max 3 requests per email per hour
- **CAPTCHA**: Add if abuse detected (Phase 3)

---

### 3.4 OAuth Callback Handler

**Route:** `/auth/callback`
**User Stories:** US-OB-002, US-OB-003
**Priority:** Phase 1

#### Purpose
Handle OAuth redirect from Google/Discord and complete authentication.

#### UI Elements

**Loading State:**
```
┌─────────────────────────────────────────────┐
│                                              │
│           [Loading Spinner]                  │
│                                              │
│         Completing sign in...                │
│                                              │
└─────────────────────────────────────────────┘
```

#### Implementation
```typescript
// /app/pages/auth/callback.vue
<script setup lang="ts">
const supabase = useSupabaseClient()
const router = useRouter()

onMounted(async () => {
  // Supabase automatically handles the OAuth callback
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    console.error('OAuth error:', error)
    navigateTo('/login?error=oauth_failed')
    return
  }

  if (session) {
    // Check if new user or returning
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_complete')
      .eq('id', session.user.id)
      .single()

    if (!profile || !profile.onboarding_complete) {
      // New user - start onboarding
      navigateTo('/welcome')
    } else {
      // Returning user
      navigateTo('/dashboard')
    }
  }
})
</script>
```

#### Error Handling

| Error | User Message | Action |
|-------|--------------|--------|
| OAuth canceled | "Sign in was canceled." | Redirect to `/login` |
| OAuth failed | "Something went wrong. Please try again." | Redirect to `/login` |
| Session invalid | "Session expired. Please sign in again." | Redirect to `/login` |

---

## 4. OAuth Integration Points

**User Stories:** US-OB-002, US-OB-003
**Priority:** Phase 1 (Google), Phase 2 (Discord)

### Supported Providers

#### Phase 1: Google OAuth
- **Why**: Most common, trusted, easy Supabase integration
- **Scopes**: Email, profile
- **Button Design**: Official Google branding guidelines

#### Phase 2: Discord OAuth
- **Why**: Gaming audience alignment
- **Scopes**: Email, identify
- **Button Design**: Discord branding guidelines

### Configuration

**Supabase Dashboard:**
- Enable Google provider
- Set OAuth callback URL: `https://yourdomain.com/auth/callback`
- Configure consent screen

**Environment Variables:**
```env
# Not needed - Supabase handles this via dashboard
```

### User Experience Flow

```
User clicks "Continue with Google"
  ↓
Popup/Redirect to Google consent screen
  ↓
User approves
  ↓
Redirect to /auth/callback
  ↓
Session created
  ↓
Check if new user:
  - New: /welcome
  - Returning: /dashboard
```

### Mobile Considerations
- Use redirect flow (not popup) on mobile devices
- Deep linking for native app integration (Phase 4+)

---

## 5. Account Linking

**Route:** `/auth/link` or modal on `/settings`
**User Stories:** US-OB-005
**Priority:** Phase 2

### Purpose
Convert guest accounts to full accounts without losing progress.

### Trigger Points

1. **Persistent Header Banner** (Guest users only)
   ```
   ⚠️ Playing as guest. Create an account to save your progress.
   [Create Account] [×]
   ```

2. **Settings Page** (Prominent button)
   ```
   Account Status: Guest
   [Create Account to Save Progress]
   ```

3. **Milestone Prompts** (After significant progress)
   ```
   🎉 You've recruited 3 heroes!

   Create an account to save your progress forever.
   [Create Account] [Maybe Later]
   ```

### UI Elements - Link Account Modal

```
┌─────────────────────────────────────────────┐
│  🔗 Save Your Progress                       │
│                                              │
│  You've played as a guest. Create an account│
│  to save your progress across all devices.  │
│                                              │
│  What You'll Keep:                           │
│  ✓ 3 Heroes                                  │
│  ✓ Level progress                            │
│  ✓ 50 Gold                                   │
│  ✓ All equipment                             │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │  [G] Continue with Google          │    │
│  └────────────────────────────────────┘    │
│                                              │
│  ───────── or register with email ──────────│
│                                              │
│  Email:                                      │
│  [_________________________________]        │
│                                              │
│  Password (8+ characters):                   │
│  [_________________________________]        │
│                                              │
│  [Create Account & Transfer Progress]        │
│                                              │
│  [Maybe Later]                               │
└─────────────────────────────────────────────┘
```

### Account Linking Flow

```typescript
async function linkGuestAccount(email: string, password: string) {
  // 1. Get guest data from localStorage
  const guestData = {
    heroes: localStorage.getItem('guest_heroes'),
    gold: localStorage.getItem('guest_gold'),
    inventory: localStorage.getItem('guest_inventory'),
    // ... all guest data
  }

  // 2. Create full account
  const { data: { user }, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw error

  // 3. Migrate guest data to server
  await $fetch('/api/account/migrate-guest', {
    method: 'POST',
    body: {
      userId: user.id,
      guestData,
    },
  })

  // 4. Clear guest session
  localStorage.removeItem('is_guest')
  localStorage.removeItem('guest_session')
  // Clear all guest data keys

  // 5. Confirm success
  return { success: true }
}
```

### Server-Side Migration

```typescript
// /server/api/account/migrate-guest.post.ts
export default defineEventHandler(async (event) => {
  const { userId, guestData } = await readBody(event)

  // Validate user is authenticated
  const user = event.context.user
  if (!user || user.id !== userId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // Parse and validate guest data
  const heroes = JSON.parse(guestData.heroes || '[]')
  const gold = parseInt(guestData.gold || '0')
  // ... validate all data

  // Insert into database
  await Promise.all([
    // Insert heroes
    supabase.from('heroes').insert(
      heroes.map(h => ({ ...h, user_id: userId, migrated_from_guest: true }))
    ),

    // Update user resources
    supabase.from('user_resources').upsert({
      user_id: userId,
      gold,
      // ... other resources
    }),

    // Insert inventory items
    // ...
  ])

  // Mark profile as migrated
  await supabase.from('profiles').update({
    migrated_from_guest: true,
    migration_date: new Date().toISOString(),
  }).eq('id', userId)

  return { success: true }
})
```

### Success Confirmation

```
┌─────────────────────────────────────────────┐
│  ✅ Account Created!                         │
│                                              │
│  Your progress has been saved.               │
│                                              │
│  You can now access your guild from any      │
│  device by signing in with:                  │
│  user@example.com                            │
│                                              │
│  [Continue Playing]                          │
└─────────────────────────────────────────────┘
```

### Edge Cases

| Scenario | Handling |
|----------|----------|
| Email already exists | "This email is already registered. Please sign in instead." |
| Migration fails mid-process | Transaction rollback, keep guest data, show error |
| Guest data invalid/corrupted | Skip corrupted data, migrate what's valid, log error |
| Network error during migration | Retry mechanism, keep guest data safe |

### Data Loss Prevention

- **Never delete guest data** until server confirms successful migration
- **Transaction-based migration**: All-or-nothing approach
- **Backup guest data** to separate localStorage key during migration
- **Rollback mechanism** if migration fails

---

## 6. Welcome Sequence

**Route:** `/welcome` (multi-step)
**User Stories:** US-OB-006, US-OB-007, US-OB-008, US-OB-009
**Priority:** Phase 1

### Purpose
Introduce new players to the game's tone, grant first hero, tour UI, and set guild name.

### Flow Overview

```
Step 1: Welcome Screen (US-OB-006)
  ↓
Step 2: First Hero Grant (US-OB-007)
  ↓
Step 3: UI Orientation Tour (US-OB-008)
  ↓
Step 4: Guild Name Selection (US-OB-009)
  ↓
Step 5: Start Tutorial (US-OB-010)
```

---

### Step 1: Welcome Screen

**US-OB-006**

#### UI Elements

```
┌─────────────────────────────────────────────┐
│                                              │
│           [Animated Logo]                    │
│         🏰 DUNGEON FARMERS                   │
│                                              │
│  Build dungeons. Capture monsters.           │
│  Farm legendary loot.                        │
│                                              │
│  ───────────────────────────────────────────│
│                                              │
│  Welcome, aspiring Guild Master!             │
│                                              │
│  Your heroes are quirky. Your dungeons are   │
│  deadly. Your loot is questionable.          │
│                                              │
│  Let's get started.                          │
│                                              │
│  [Begin Adventure →]                         │
│                                              │
│  (Skip if returning player)                  │
└─────────────────────────────────────────────┘
```

#### Behavior
- **Animation**: Parallax or subtle background movement
- **Skip Detection**: Check localStorage for `onboarding_complete` flag
- **Loading**: Preload next step assets during this screen
- **Duration**: Self-paced, but 3-5 seconds minimum for tone-setting

#### Implementation
```typescript
onMounted(async () => {
  // Check if returning player
  const onboardingComplete = localStorage.getItem('onboarding_complete')
  if (onboardingComplete === 'true') {
    // Skip to dashboard
    navigateTo('/dashboard')
  }

  // Preload first hero data
  await preloadFirstHero()
})
```

---

### Step 2: First Hero Grant

**US-OB-007**

#### UI Elements

```
┌─────────────────────────────────────────────┐
│  🎉 Your First Recruit Has Arrived!          │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │                                     │    │
│  │     [Hero Portrait Image]           │    │
│  │                                     │    │
│  │     ⭐ Ser Reginald the Cautious    │    │
│  │        Uncommon Warrior              │    │
│  │                                     │    │
│  │     ┌─────────────────────────┐     │    │
│  │     │ Traits:                  │     │    │
│  │     │ • Careful Fighter        │     │    │
│  │     │   +15% Defense           │     │    │
│  │     │ • Monster Knowledge      │     │    │
│  │     │   +10% vs Beasts         │     │    │
│  │     └─────────────────────────┘     │    │
│  │                                     │    │
│  │     Level 1 • Power: 35             │    │
│  │                                     │    │
│  └────────────────────────────────────┘    │
│                                              │
│  "Every guild needs a leader. This one's    │
│  yours."                                     │
│                                              │
│  [Meet Your Hero →]                          │
└─────────────────────────────────────────────┘
```

#### Hero Generation Rules
- **Rarity**: Always Uncommon (good starting point)
- **Traits**: 2 traits, both **flat bonuses** (easy to understand)
  - Avoid conditional traits for first hero
  - Example: "+15% Attack", "+10% Defense", "+20 HP"
- **Archetype**: Randomly selected (Warrior, Mage, Ranger, Rogue)
- **Stats**: Standard level 1 stats for archetype

#### Pre-Generated vs Random
- **Option A**: Pre-generated hero pool (5-10 options) - consistent experience
- **Option B**: True random with seed - unique for each player
- **Recommendation**: Pre-generated pool (Phase 1) → Full random (Phase 2)

#### Implementation
```typescript
// /server/api/onboarding/first-hero.post.ts
export default defineEventHandler(async (event) => {
  const user = event.context.user

  // Select first hero from pre-generated pool
  const firstHeroTemplate = FIRST_HERO_POOL[
    Math.floor(Math.random() * FIRST_HERO_POOL.length)
  ]

  // Create hero instance
  const hero = {
    ...firstHeroTemplate,
    user_id: user.id,
    is_first_hero: true,
    created_at: new Date().toISOString(),
  }

  // Insert into database
  const { data, error } = await supabase
    .from('heroes')
    .insert(hero)
    .select()
    .single()

  if (error) throw error

  return { hero: data }
})
```

---

### Step 3: UI Orientation Tour

**US-OB-008**

#### UI Elements

**Overlay System with Spotlight:**

```
Screen Layout:
┌─────────────────────────────────────────────┐
│  [Darkened Overlay - 70% opacity]           │
│                                              │
│   [Spotlight on highlighted element]        │
│                                              │
│   ┌───────────────────────────┐             │
│   │  💡 Tooltip Bubble         │             │
│   │                            │             │
│   │  "This is the Heroes tab.  │             │
│   │  Manage your roster here." │             │
│   │                            │             │
│   │  [Next →]  [Skip Tour]     │             │
│   └───────────────────────────┘             │
│                                              │
└─────────────────────────────────────────────┘
```

#### Tour Steps

| Step | Element Highlighted | Tooltip Text | Action |
|------|-------------------|--------------|--------|
| 1 | **Heroes** nav item | "View and manage your heroes here. They're the heart of your guild." | Click or Next |
| 2 | **Expeditions** nav item | "Send heroes on expeditions to earn loot and tell their stories." | Click or Next |
| 3 | **Inventory** nav item | "Equipment and items you collect are stored here." | Click or Next |
| 4 | **Dungeons** nav item (locked) | "Build your own dungeons later! [Phase 2 feature]" | Next only |
| 5 | **Settings** nav item | "Adjust settings, change your guild name, or link your account here." | Next |

**Final Step:**
```
┌─────────────────────────────────────────────┐
│  ✅ Tour Complete!                           │
│                                              │
│  You know where everything is. Ready to      │
│  make this guild yours?                      │
│                                              │
│  [Let's Go! →]                               │
│                                              │
│  [Replay Tour]                               │
└─────────────────────────────────────────────┘
```

#### Behavior
- **Skip Option**: Available on every step
- **Navigation**: Can click elements directly to advance
- **Persistence**: Mark tour complete in localStorage/database
- **Replay**: Available from Settings → Help

#### Implementation
```typescript
// /app/composables/useUITour.ts
export const useUITour = () => {
  const currentStep = ref(0)
  const isActive = ref(false)

  const tourSteps = [
    {
      target: '#nav-heroes',
      title: 'Heroes',
      description: 'View and manage your heroes here...',
      position: 'bottom',
    },
    // ... more steps
  ]

  const startTour = () => {
    isActive.value = true
    currentStep.value = 0
  }

  const nextStep = () => {
    if (currentStep.value < tourSteps.length - 1) {
      currentStep.value++
    } else {
      completeTour()
    }
  }

  const skipTour = () => {
    isActive.value = false
    completeTour()
  }

  const completeTour = () => {
    localStorage.setItem('ui_tour_complete', 'true')
    // Also save to database for cross-device
  }

  return {
    isActive,
    currentStep,
    tourSteps,
    startTour,
    nextStep,
    skipTour,
  }
}
```

#### Mobile Considerations
- **Touch-friendly**: Tap anywhere to advance (not just "Next")
- **Tooltip Positioning**: Auto-adjust to avoid viewport edges
- **Simplified Tour**: Fewer steps on mobile (combine related items)

---

### Step 4: Guild Name Selection

**US-OB-009**

#### UI Elements

```
┌─────────────────────────────────────────────┐
│  ⚔️ Name Your Guild                          │
│                                              │
│  Every legendary guild needs a name.         │
│  What will yours be?                         │
│                                              │
│  Guild Name:                                 │
│  [_________________________________]        │
│  3-24 characters • A-Z, 0-9, spaces          │
│                                              │
│  [🎲 Random Name]                            │
│                                              │
│  Examples:                                   │
│  • The Questionable Questers                 │
│  • Loot Hoarders Anonymous                   │
│  • Perfectly Normal Heroes                   │
│                                              │
│  [Continue →]                                │
│                                              │
│  (You can change this once per month)        │
│  Skip to use default: "Adventurer's Guild"   │
└─────────────────────────────────────────────┘
```

#### Validation Rules

| Rule | Validation |
|------|------------|
| Length | 3-24 characters |
| Characters | Alphanumeric + spaces + hyphens |
| Profanity | Basic word list filter |
| Reserved Words | Block: "Admin", "Support", "Dungeon Farmers" |
| Uniqueness | Not required (guilds are personal, not shared) |

#### Random Name Generator

**Word Lists:**
```typescript
const adjectives = [
  'Brave', 'Questionable', 'Legendary', 'Chaotic', 'Hungry',
  'Optimistic', 'Caffeinated', 'Mysterious', 'Reluctant', 'Valiant'
]

const nouns = [
  'Adventurers', 'Questers', 'Loot Hoarders', 'Dungeon Delvers',
  'Monster Farmers', 'Treasure Hunters', 'Heroes', 'Wanderers'
]

function generateGuildName() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${adj} ${noun}`
}
```

#### Default Behavior

- **Skip**: Uses "Adventurer's Guild"
- **Leave Empty**: Same as skip
- **Invalid Name**: Show inline error, disable Continue

#### Name Change Policy

- **Free Change**: Once every 30 days
- **Enforcement**: Check `last_name_change` timestamp in database
- **UI**: Show "Next change available: Dec 29, 2025" in Settings

#### Implementation
```typescript
async function setGuildName(name: string) {
  // Validate locally first
  if (!validateGuildName(name)) {
    throw new Error('Invalid guild name')
  }

  // Save to database
  await $fetch('/api/profile/guild-name', {
    method: 'PATCH',
    body: { guildName: name }
  })

  // Update local store
  const profileStore = useProfileStore()
  profileStore.guildName = name

  // Mark onboarding step complete
  await completeOnboardingStep('guild_name')
}
```

---

### Step 5: Transition to Tutorial

After guild name, seamlessly transition to tutorial intro (see Section 7).

```
┌─────────────────────────────────────────────┐
│  🗺️ Ready for Your First Expedition?        │
│                                              │
│  Let's see the core gameplay loop in action. │
│                                              │
│  Don't worry - this is quick!                │
│                                              │
│  [Start Tutorial →]                          │
└─────────────────────────────────────────────┘
```

---

### Welcome Sequence State Management

```typescript
// /app/stores/onboarding.ts
export const useOnboardingStore = defineStore('onboarding', {
  state: () => ({
    currentStep: 'welcome' as OnboardingStep,
    completedSteps: [] as OnboardingStep[],
    firstHero: null as Hero | null,
    guildName: '',
    uiTourComplete: false,
  }),

  actions: {
    async completeStep(step: OnboardingStep) {
      if (!this.completedSteps.includes(step)) {
        this.completedSteps.push(step)

        // Persist to server
        await $fetch('/api/onboarding/progress', {
          method: 'POST',
          body: { step },
        })
      }

      // Advance to next step
      this.advanceToNextStep()
    },

    advanceToNextStep() {
      const sequence = [
        'welcome',
        'first_hero',
        'ui_tour',
        'guild_name',
        'tutorial_start',
      ]

      const currentIndex = sequence.indexOf(this.currentStep)
      if (currentIndex < sequence.length - 1) {
        this.currentStep = sequence[currentIndex + 1]
      } else {
        this.completeOnboarding()
      }
    },

    async completeOnboarding() {
      this.currentStep = 'complete'
      localStorage.setItem('onboarding_complete', 'true')

      await $fetch('/api/onboarding/complete', {
        method: 'POST',
      })

      // Redirect to game
      navigateTo('/dashboard')
    },
  },
})
```

---

## 7. Tutorial Progression

**User Stories:** US-OB-010 through US-OB-017
**Priority:** Phase 1 (US-OB-010 to US-OB-014), Phase 2 (US-OB-015 to US-OB-017)

### Tutorial Philosophy

**From existing implementation (see `/app/components/tutorial/README.md`):**
- **Hybrid Approach**: Mandatory intro (2 min) + Optional mentor quests
- **Respect Player Time**: Skippable, self-paced, no pressure
- **Progressive Disclosure**: Learn by doing, not reading

---

### Mandatory Tutorial Flow (Already Implemented)

**Current Implementation:** See `/app/components/tutorial/Intro.vue`

#### Steps:
1. **Welcome** - Sets expectations
2. **Name Guild Master** - Personalization
3. **Tutorial Expedition** - Core loop demo (instant completion)
4. **View Log** - Story emphasis
5. **Complete** - Transition to mentor quests

**Status:** ✅ Implemented in Phase 1

---

### Optional Mentor Quests (Already Implemented)

**Current Implementation:** See `/app/stores/tutorial.ts` and `/app/data/mentorQuests.ts`

#### Quest Tiers:

**Early Quests (Immediate unlock):**
- US-OB-010: First Steps - Complete tutorial expedition
- US-OB-013: New Blood - Recruit your first hero
- US-OB-014: Stronger Together - Send a 2+ hero party
- US-OB-012: Spoils of War - Equip an item on any hero

**Mid Quests (Stat thresholds):**
- Know Your Team - Recruit 3 heroes → Read profile
- Counter Play - Complete 5 expeditions → Match tag
- Explorer - Unlock 2 zones → Discover subzone
- Dressed for Success - Own 5 equipment → Equip full set
- Rest & Recovery - Hero tired → Let recover

**Late Quests (Progression milestones):**
- Veteran - Hero level 10 → View prestige
- Team Builder - Own 5+ heroes → Save preset
- Moving On - Own 6+ heroes → Retire hero

**Final Quest:**
- Completionist - Complete all above → Title: "The Prepared"

**Status:** ✅ Implemented in Phase 1

---

### Phase 2 Tutorial Extensions

**User Stories:** US-OB-015, US-OB-016, US-OB-017

These introduce dungeon building mechanics:

#### US-OB-015: First Monster Capture

**Trigger:** 30-60 minutes into gameplay, after completing 3-5 expeditions

**UI Elements:**

```
┌─────────────────────────────────────────────┐
│  🐉 Monster Captured!                        │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │   [Slime Icon]                      │    │
│  │                                     │    │
│  │   Green Slime                       │    │
│  │   Common • Beast                    │    │
│  │                                     │    │
│  │   "A jiggly blob of questionable    │    │
│  │   nutrition."                       │    │
│  └────────────────────────────────────┘    │
│                                              │
│  Monsters power your dungeons!               │
│                                              │
│  Collect more monsters and schematics to     │
│  build dungeons for targeted loot farming.   │
│                                              │
│  [View Collection →]                         │
│                                              │
│  💡 Dungeon building unlocks soon!           │
└─────────────────────────────────────────────┘
```

**Mentor Quest:** "Capture your first monster during an expedition"
- **Reward:** 200 gold
- **Follow-up:** Unlocks schematic drop hints

---

#### US-OB-016: First Schematic and Dungeon Build

**Trigger:** After first monster + first schematic drop

**UI Flow:**

1. **Schematic Drop Notification**
   ```
   📜 Schematic Found!
   "Basic Slime Pit" dungeon schematic added to collection.
   ```

2. **Dungeon Builder Unlock**
   ```
   ┌─────────────────────────────────────────────┐
   │  🏗️ Dungeon Building Unlocked!              │
   │                                              │
   │  You found a schematic and captured a        │
   │  monster. Time to build your first dungeon!  │
   │                                              │
   │  [Open Dungeon Builder →]                    │
   └─────────────────────────────────────────────┘
   ```

3. **Guided Build Process**
   ```
   Step 1: Select Schematic
   ┌────────────────────────────────┐
   │  Basic Slime Pit               │
   │  • 2 slots                     │
   │  • Requires: 2 Beasts          │
   │  • Drops: Basic gear           │
   └────────────────────────────────┘

   Step 2: Place Monsters
   [Slot 1: Green Slime ✓]
   [Slot 2: Empty - Needs Beast monster]

   Step 3: Activate Dungeon
   [Not ready - need 1 more monster]
   ```

**Mentor Quest:** "Build your first dungeon using a schematic and captured monster"
- **Reward:** Free dungeon slot unlock + 300 gold

---

#### US-OB-017: First Dungeon Run Completion

**Trigger:** After first dungeon is activated and run completes

**UI Elements:**

```
┌─────────────────────────────────────────────┐
│  🎉 Dungeon Cleared!                         │
│                                              │
│  Your heroes farmed "Basic Slime Pit"        │
│                                              │
│  Rewards:                                    │
│  • 75 Gold                                   │
│  • Slime Sword (from Green Slime's loot)     │
│  • 5 Slime Essence (crafting material)       │
│                                              │
│  ───────────────────────────────────────────│
│                                              │
│  💡 The Power of Dungeon Building:           │
│                                              │
│  The monsters YOU placed determine what      │
│  loot drops. Build better dungeons to farm   │
│  the exact gear you need!                    │
│                                              │
│  [Collect Rewards →]                         │
└─────────────────────────────────────────────┘
```

**Mentor Quest:** "Complete your first dungeon run"
- **Reward:** Schematic pack (3 random uncommon schematics) + 500 gold

---

### Tutorial Tracking System

**Existing Implementation:** `/app/composables/useTutorial.ts`

**Tracking Methods:**
```typescript
export const useTutorial = () => {
  const store = useTutorialStore()

  // Core tracking methods
  const trackHeroRecruited = () => {
    store.incrementPlayerStat('heroes_recruited')
    store.checkQuestProgress('recruit_hero')
  }

  const trackExpeditionComplete = (isTutorial = false) => {
    store.incrementPlayerStat('expeditions_completed')
    store.checkQuestProgress('expedition_complete', { isTutorial })
  }

  const trackMonsterCaptured = (monster: Monster) => {
    store.incrementPlayerStat('monsters_captured')
    store.checkQuestProgress('monster_captured', {
      monsterId: monster.id,
      isFirst: store.playerStats.monsters_captured === 1
    })
  }

  const trackDungeonBuilt = (dungeon: Dungeon) => {
    store.incrementPlayerStat('dungeons_built')
    store.checkQuestProgress('dungeon_built', {
      dungeonId: dungeon.id,
      isFirst: store.playerStats.dungeons_built === 1
    })
  }

  // ... more tracking methods

  return {
    trackHeroRecruited,
    trackExpeditionComplete,
    trackMonsterCaptured,
    trackDungeonBuilt,
    // ... export all tracking methods
  }
}
```

**Integration Points:**

| Game Action | Tracking Call | Location |
|-------------|---------------|----------|
| Hero recruited | `trackHeroRecruited()` | `/server/api/tavern/recruit.post.ts` |
| Expedition completes | `trackExpeditionComplete()` | `/app/stores/expeditions.ts` |
| Monster captured | `trackMonsterCaptured(monster)` | Expedition result handler |
| Dungeon built | `trackDungeonBuilt(dungeon)` | `/app/stores/dungeons.ts` |
| Dungeon run completes | `trackDungeonRunComplete()` | Dungeon expedition handler |

---

## 8. Contextual Help System

**User Stories:** US-OB-018, US-OB-019, US-OB-020, US-OB-021, US-OB-022
**Priority:** Phase 2 (US-OB-018, US-OB-019), Phase 3 (US-OB-020, US-OB-021, US-OB-022)

---

### 8.1 Contextual Tooltips (US-OB-018)

**Purpose:** Explain new features on first encounter

#### UI Component

```vue
<!-- /app/components/help/ContextualTooltip.vue -->
<template>
  <div v-if="!dismissed" class="contextual-tooltip">
    <div class="tooltip-arrow" />
    <div class="tooltip-content">
      <button class="close-btn" @click="dismiss">×</button>
      <div class="tooltip-icon">💡</div>
      <p>{{ message }}</p>
      <div class="tooltip-actions">
        <button @click="dismiss">Got it</button>
        <button class="link-btn" @click="dontShowAgain">
          Don't show again
        </button>
      </div>
    </div>
  </div>
</template>
```

#### Tooltip Types

| Feature | Trigger | Message | Dismissal Key |
|---------|---------|---------|---------------|
| Tavern | First visit | "Recruit new heroes here. Rosters refresh daily for free players." | `tooltip_tavern` |
| Trait Tags | First tag-matched expedition | "You matched a trait tag to an expedition threat! This increases efficiency." | `tooltip_tags` |
| Prestige | Hero reaches level 60 | "This hero can prestige! Reset their level to unlock new potential." | `tooltip_prestige` |
| Dungeon Builder | Unlock | "Place captured monsters here to determine what loot your dungeon drops." | `tooltip_dungeon` |
| Fatigue | Hero becomes tired | "Tired heroes need rest. Let them recover before the next expedition." | `tooltip_fatigue` |

#### Implementation

```typescript
// /app/composables/useTooltips.ts
export const useTooltips = () => {
  const dismissedTooltips = ref<string[]>([])

  onMounted(() => {
    // Load dismissed tooltips from localStorage
    const saved = localStorage.getItem('dismissed_tooltips')
    if (saved) {
      dismissedTooltips.value = JSON.parse(saved)
    }
  })

  const shouldShow = (tooltipKey: string) => {
    return !dismissedTooltips.value.includes(tooltipKey)
  }

  const dismiss = (tooltipKey: string) => {
    if (!dismissedTooltips.value.includes(tooltipKey)) {
      dismissedTooltips.value.push(tooltipKey)
      localStorage.setItem('dismissed_tooltips', JSON.stringify(dismissedTooltips.value))
    }
  }

  const resetAll = () => {
    dismissedTooltips.value = []
    localStorage.removeItem('dismissed_tooltips')
  }

  return {
    shouldShow,
    dismiss,
    resetAll,
  }
}
```

---

### 8.2 Suggested Next Actions (US-OB-019)

**Purpose:** Prevent "what do I do now?" moments

#### UI Component

```vue
<!-- Suggested Actions Panel (collapsible sidebar) -->
<template>
  <div class="suggested-actions-panel" :class="{ collapsed }">
    <div class="panel-header">
      <h3>Suggested Actions</h3>
      <button @click="collapsed = !collapsed">
        {{ collapsed ? '▼' : '▲' }}
      </button>
    </div>

    <div v-if="!collapsed" class="panel-content">
      <div
        v-for="action in suggestedActions"
        :key="action.id"
        class="action-card"
        @click="navigateTo(action.route)"
      >
        <div class="action-icon">{{ action.icon }}</div>
        <div class="action-text">
          <h4>{{ action.title }}</h4>
          <p>{{ action.description }}</p>
        </div>
        <div class="action-arrow">→</div>
      </div>

      <button class="dismiss-panel" @click="dismissPanel">
        Hide suggestions
      </button>
    </div>
  </div>
</template>
```

#### Suggestion Logic

```typescript
// /app/composables/useSuggestedActions.ts
export const useSuggestedActions = () => {
  const heroStore = useHeroStore()
  const expeditionStore = useExpeditionStore()
  const inventoryStore = useInventoryStore()

  const suggestedActions = computed(() => {
    const actions = []

    // Priority 1: Collect completed expeditions
    if (expeditionStore.completedExpeditions.length > 0) {
      actions.push({
        id: 'collect-expeditions',
        icon: '📜',
        title: 'Collect Expedition Rewards',
        description: `${expeditionStore.completedExpeditions.length} expeditions complete`,
        route: '/expeditions?tab=completed',
        priority: 10,
      })
    }

    // Priority 2: Equip better gear
    const unequippedGear = inventoryStore.items.filter(i => !i.equipped && i.isUpgrade)
    if (unequippedGear.length > 0) {
      actions.push({
        id: 'equip-gear',
        icon: '⚔️',
        title: 'Equip Better Gear',
        description: `${unequippedGear.length} upgrade(s) available`,
        route: '/inventory?filter=upgrades',
        priority: 8,
      })
    }

    // Priority 3: Recruit heroes
    if (heroStore.heroes.length < 5 && heroStore.canRecruit) {
      actions.push({
        id: 'recruit-hero',
        icon: '👥',
        title: 'Recruit More Heroes',
        description: 'Expand your roster',
        route: '/tavern',
        priority: 6,
      })
    }

    // Priority 4: Start expedition (if heroes are resting)
    const restingHeroes = heroStore.heroes.filter(h => !h.isOnExpedition && !h.isTired)
    if (restingHeroes.length >= 2 && expeditionStore.activeExpeditions.length < 3) {
      actions.push({
        id: 'start-expedition',
        icon: '🗺️',
        title: 'Start an Expedition',
        description: `${restingHeroes.length} heroes ready`,
        route: '/expeditions?tab=zones',
        priority: 5,
      })
    }

    // Priority 5: Try a new zone
    if (heroStore.totalPower > expeditionStore.currentZone.recommendedPower * 1.5) {
      actions.push({
        id: 'unlock-zone',
        icon: '🔓',
        title: 'Try a Harder Zone',
        description: 'Your team is strong enough!',
        route: '/expeditions?tab=zones',
        priority: 4,
      })
    }

    // Sort by priority and return top 3
    return actions
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3)
  })

  return {
    suggestedActions,
  }
}
```

#### Placement
- **Desktop**: Right sidebar (collapsible)
- **Mobile**: Bottom sheet (swipe up to expand)

---

### 8.3 Progress Milestone Celebrations (US-OB-020)

**Purpose:** Positive reinforcement for achievements

#### Milestone Definitions

```typescript
// /app/data/milestones.ts
export const MILESTONES = [
  {
    id: 'first-level-5',
    trigger: 'hero_level_up',
    condition: (hero: Hero) => hero.level === 5,
    title: 'First Hero to Level 5!',
    description: 'Your first hero is growing stronger.',
    icon: '⭐',
    reward: { gold: 100 },
  },
  {
    id: 'first-rare-drop',
    trigger: 'item_obtained',
    condition: (item: Item) => item.rarity === 'rare',
    title: 'First Rare Drop!',
    description: 'RNG smiled upon you.',
    icon: '💎',
    reward: { gems: 10 },
  },
  {
    id: 'ten-expeditions',
    trigger: 'expedition_complete',
    condition: (stats: PlayerStats) => stats.expeditions_completed === 10,
    title: '10 Expeditions Complete!',
    description: 'You\'re getting the hang of this.',
    icon: '🗺️',
    reward: { gold: 250 },
  },
  {
    id: 'first-zone-unlock',
    trigger: 'zone_unlocked',
    condition: (zone: Zone) => zone.tier === 2,
    title: 'New Zone Unlocked!',
    description: 'Greater challenges await.',
    icon: '🚪',
    reward: { gems: 25 },
  },
  {
    id: 'full-roster',
    trigger: 'hero_recruited',
    condition: (stats: PlayerStats) => stats.heroes_owned === 10,
    title: 'Full Roster!',
    description: 'You have 10 heroes. Your guild is thriving!',
    icon: '👥',
    reward: { gold: 500, gems: 50 },
  },
  // ... more milestones
]
```

#### Celebration Modal

```vue
<!-- /app/components/celebration/MilestoneCelebration.vue -->
<template>
  <div v-if="show" class="milestone-modal-overlay">
    <div class="milestone-modal">
      <div class="milestone-animation">
        <!-- Confetti or particle effect -->
        <div class="milestone-icon">{{ milestone.icon }}</div>
      </div>

      <h2>{{ milestone.title }}</h2>
      <p>{{ milestone.description }}</p>

      <div class="milestone-rewards">
        <h3>Rewards</h3>
        <div class="reward-items">
          <div v-if="milestone.reward.gold" class="reward">
            <span class="reward-icon">💰</span>
            <span>+{{ milestone.reward.gold }} Gold</span>
          </div>
          <div v-if="milestone.reward.gems" class="reward">
            <span class="reward-icon">💎</span>
            <span>+{{ milestone.reward.gems }} Gems</span>
          </div>
        </div>
      </div>

      <button class="claim-btn" @click="claimReward">
        Claim Reward
      </button>

      <!-- Optional: Share button for Phase 3+ -->
      <!-- <button class="share-btn">Share Achievement</button> -->
    </div>
  </div>
</template>
```

---

### 8.4 Integrated Help Menu (US-OB-021)

**Purpose:** Comprehensive help documentation

#### UI Structure

```
┌─────────────────────────────────────────────┐
│  [?] Help Center                 [× Close]  │
│                                              │
│  ┌────────────┐ ┌────────────────────────┐ │
│  │ Categories │ │   Search Help Topics   │ │
│  │            │ │ [___________________]  │ │
│  │ ▸ Getting  │ │                        │ │
│  │   Started  │ │ ┌────────────────────┐ │ │
│  │            │ │ │ How do I equip...? │ │ │
│  │ ▾ Heroes   │ │ │                    │ │ │
│  │   • Traits │ │ │ [Help article...]  │ │ │
│  │   • Level  │ │ │                    │ │ │
│  │   • Prestig│ │ │                    │ │ │
│  │            │ │ │ [Related articles] │ │ │
│  │ ▸ Expedit. │ │ └────────────────────┘ │ │
│  │            │ │                        │ │
│  │ ▸ Dungeons │ │ Still need help?       │ │
│  │            │ │ [Contact Support]      │ │
│  │ ▸ FAQ      │ │                        │ │
│  └────────────┘ └────────────────────────┘ │
└─────────────────────────────────────────────┘
```

#### Help Topics Structure

```typescript
// /app/data/helpTopics.ts
export const HELP_TOPICS = {
  'getting-started': {
    title: 'Getting Started',
    articles: [
      {
        id: 'first-steps',
        title: 'Your First Steps',
        content: `Welcome to Dungeon Farmers! Here's what you need to know...`,
        tags: ['beginner', 'tutorial'],
      },
      {
        id: 'understanding-traits',
        title: 'Understanding Hero Traits',
        content: `Traits are the heart of your heroes...`,
        tags: ['heroes', 'traits', 'beginner'],
      },
    ],
  },

  'heroes': {
    title: 'Heroes & Management',
    articles: [
      {
        id: 'traits-explained',
        title: 'How Traits Work',
        content: `...`,
        tags: ['heroes', 'traits'],
      },
      {
        id: 'leveling-up',
        title: 'Leveling and Experience',
        content: `...`,
        tags: ['heroes', 'progression'],
      },
      {
        id: 'prestige-system',
        title: 'Prestige System',
        content: `...`,
        tags: ['heroes', 'prestige', 'advanced'],
      },
    ],
  },

  // ... more categories
}
```

#### Contextual Help Links

Embed help links throughout the UI:

```vue
<!-- Example: Hero detail page -->
<div class="hero-traits">
  <h3>
    Traits
    <button class="help-icon" @click="openHelp('traits-explained')">
      ?
    </button>
  </h3>
  <!-- ... traits display ... -->
</div>
```

---

### 8.5 Optional Hint System (US-OB-022)

**Purpose:** Safety net for stuck players

#### Trigger Conditions

```typescript
// /app/composables/useHints.ts
export const useHints = () => {
  const lastInteraction = ref(Date.now())
  const currentScreen = ref('')
  const hintShown = ref(false)

  // Track user inactivity
  watch([currentScreen], () => {
    lastInteraction.value = Date.now()
    hintShown.value = false
  })

  // Check if hint should show
  const shouldShowHint = computed(() => {
    const inactiveTime = Date.now() - lastInteraction.value
    const INACTIVITY_THRESHOLD = 5 * 60 * 1000 // 5 minutes

    return inactiveTime > INACTIVITY_THRESHOLD && !hintShown.value
  })

  // Get contextual hint for current screen
  const currentHint = computed(() => {
    const hints = {
      '/tavern': {
        message: "Not sure who to recruit? Look for traits that complement your existing heroes or match expedition threats.",
        action: "View expedition threats",
        actionRoute: "/expeditions",
      },
      '/expeditions': {
        message: "Struggling with a zone? Try matching your heroes' trait tags to the threats listed, or equip better gear.",
        action: "Check your inventory",
        actionRoute: "/inventory",
      },
      '/inventory': {
        message: "Not enough gold for gear? Send heroes on expeditions to earn more resources.",
        action: "View available expeditions",
        actionRoute: "/expeditions",
      },
    }

    return hints[currentScreen.value]
  })

  return {
    shouldShowHint,
    currentHint,
    dismissHint: () => { hintShown.value = true },
  }
}
```

#### Hint Display Component

```vue
<!-- /app/components/help/HintPrompt.vue -->
<template>
  <div v-if="shouldShowHint" class="hint-prompt">
    <div class="hint-character">
      <!-- Optional: Avatar of a "guild advisor" character -->
      <img src="/images/advisor.png" alt="Advisor" />
    </div>

    <div class="hint-content">
      <p class="hint-title">Need a hint?</p>
      <p class="hint-message">{{ currentHint.message }}</p>

      <div class="hint-actions">
        <button class="hint-action-btn" @click="navigateTo(currentHint.actionRoute)">
          {{ currentHint.action }}
        </button>
        <button class="hint-dismiss-btn" @click="dismissHint">
          I'm good, thanks
        </button>
      </div>
    </div>

    <button class="hint-close" @click="dismissHint">×</button>
  </div>
</template>
```

#### Settings Toggle

```vue
<!-- In /app/pages/settings.vue -->
<div class="setting-row">
  <label>
    <input type="checkbox" v-model="hintsEnabled" />
    Show hints when inactive
  </label>
  <p class="setting-description">
    Get helpful suggestions if you're stuck on a screen for 5+ minutes.
  </p>
</div>
```

---

## 9. Returning Player Experience

**User Stories:** US-OB-023 through US-OB-027
**Priority:** Phase 2 (US-OB-023, US-OB-024), Phase 3 (US-OB-025, US-OB-026, US-OB-027)

---

### 9.1 Welcome Back Modal (US-OB-023)

**Purpose:** Show offline progress and make returning feel rewarding

#### UI Elements

```vue
<!-- /app/components/returning/WelcomeBackModal.vue -->
<template>
  <div v-if="show" class="welcome-back-overlay">
    <div class="welcome-back-modal">
      <h2>👋 Welcome Back!</h2>

      <div class="time-away">
        <p>You were away for:</p>
        <p class="time-display">{{ formatTimeAway(timeAwayMs) }}</p>
      </div>

      <div class="offline-progress">
        <h3>While you were gone...</h3>

        <div class="progress-item">
          <span class="icon">🗺️</span>
          <span class="label">Expeditions completed:</span>
          <span class="value">{{ offlineResults.expeditionsCompleted }}</span>
        </div>

        <div class="progress-item">
          <span class="icon">💰</span>
          <span class="label">Gold earned:</span>
          <span class="value">+{{ offlineResults.goldEarned }}</span>
        </div>

        <div class="progress-item">
          <span class="icon">⚔️</span>
          <span class="label">Items found:</span>
          <span class="value">{{ offlineResults.itemsFound }}</span>
        </div>

        <div v-if="offlineResults.highlights.length > 0" class="highlights">
          <h4>Highlights:</h4>
          <ul>
            <li v-for="highlight in offlineResults.highlights" :key="highlight">
              {{ highlight }}
            </li>
          </ul>
        </div>
      </div>

      <button class="collect-all-btn" @click="collectAllAndClose">
        Collect All Rewards
      </button>

      <button class="view-details-btn" @click="viewDetails">
        View Details
      </button>
    </div>
  </div>
</template>
```

#### Offline Progress Calculation

```typescript
// /server/api/offline-progress/calculate.post.ts
export default defineEventHandler(async (event) => {
  const user = event.context.user
  const { lastLoginAt } = await readBody(event)

  const now = new Date()
  const lastLogin = new Date(lastLoginAt)
  const timeAwayMs = now.getTime() - lastLogin.getTime()

  // Cap offline progress at 48 hours
  const MAX_OFFLINE_TIME = 48 * 60 * 60 * 1000
  const cappedTimeAway = Math.min(timeAwayMs, MAX_OFFLINE_TIME)

  // Calculate offline progress
  const offlineResults = {
    expeditionsCompleted: 0,
    goldEarned: 0,
    itemsFound: 0,
    highlights: [],
  }

  // 1. Complete any active expeditions
  const activeExpeditions = await getActiveExpeditions(user.id)
  for (const expedition of activeExpeditions) {
    const timeElapsed = cappedTimeAway
    const duration = expedition.durationMinutes * 60 * 1000

    if (timeElapsed >= duration) {
      // Expedition completed offline
      const result = await completeExpedition(expedition.id)
      offlineResults.expeditionsCompleted++
      offlineResults.goldEarned += result.gold
      offlineResults.itemsFound += result.items.length

      // Check for highlights
      if (result.items.some(i => i.rarity === 'rare' || i.rarity === 'epic')) {
        offlineResults.highlights.push(`Found ${result.items[0].name}!`)
      }
    }
  }

  // 2. Calculate passive income (if any stations are set up)
  const stations = await getPassiveStations(user.id)
  if (stations.length > 0) {
    const passiveGold = calculatePassiveIncome(stations, cappedTimeAway)
    offlineResults.goldEarned += passiveGold
  }

  // 3. Mark progress as collected
  await supabase
    .from('offline_progress')
    .insert({
      user_id: user.id,
      calculated_at: now.toISOString(),
      time_away_ms: timeAwayMs,
      results: offlineResults,
    })

  return {
    timeAwayMs,
    offlineResults,
  }
})
```

#### Time Away Formatting

```typescript
function formatTimeAway(ms: number) {
  const hours = Math.floor(ms / (60 * 60 * 1000))
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}, ${hours % 24} hours`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`
  } else {
    const minutes = Math.floor(ms / (60 * 1000))
    return `${minutes} minute${minutes > 1 ? 's' : ''}`
  }
}
```

---

### 9.2 Expedition Completion Notifications (US-OB-024)

**Purpose:** Notify players when expeditions complete

#### Push Notification Configuration

**Phase 3: Browser Notifications**

```typescript
// /app/composables/useNotifications.ts
export const useNotifications = () => {
  const permission = ref(Notification.permission)

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission()
      permission.value = result
      return result === 'granted'
    }
    return false
  }

  const sendNotification = (title: string, options: NotificationOptions) => {
    if (permission.value === 'granted') {
      new Notification(title, {
        icon: '/images/icon-512.png',
        badge: '/images/badge-96.png',
        ...options,
      })
    }
  }

  const notifyExpeditionComplete = (expedition: Expedition) => {
    sendNotification('Expedition Complete!', {
      body: `Your heroes have returned from ${expedition.zoneName}`,
      tag: `expedition-${expedition.id}`,
      requireInteraction: false,
      actions: [
        { action: 'view', title: 'View Results' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    })
  }

  return {
    permission,
    requestPermission,
    notifyExpeditionComplete,
  }
}
```

#### In-Game Notification Badge

```vue
<!-- In main navigation -->
<template>
  <nav>
    <NuxtLink to="/expeditions" class="nav-item">
      <span class="nav-icon">🗺️</span>
      <span class="nav-label">Expeditions</span>
      <span v-if="completedExpeditionCount > 0" class="badge">
        {{ completedExpeditionCount }}
      </span>
    </NuxtLink>
  </nav>
</template>
```

#### Expedition Results List

```vue
<!-- /app/pages/expeditions.vue (Completed tab) -->
<template>
  <div class="completed-expeditions">
    <div class="section-header">
      <h2>Completed Expeditions</h2>
      <button
        v-if="uncollectedExpeditions.length > 1"
        @click="collectAll"
      >
        Collect All
      </button>
    </div>

    <div
      v-for="expedition in completedExpeditions"
      :key="expedition.id"
      class="expedition-result-card"
      :class="{ collected: expedition.collected }"
    >
      <div class="result-header">
        <h3>{{ expedition.zoneName }}</h3>
        <span class="completion-time">
          {{ formatTimeAgo(expedition.completedAt) }}
        </span>
      </div>

      <div class="result-summary">
        <div class="summary-item">
          <span class="icon">💰</span>
          <span>{{ expedition.rewards.gold }} Gold</span>
        </div>
        <div class="summary-item">
          <span class="icon">⚔️</span>
          <span>{{ expedition.rewards.items.length }} Items</span>
        </div>
        <div v-if="expedition.rewards.monster" class="summary-item">
          <span class="icon">🐉</span>
          <span>Monster Captured!</span>
        </div>
      </div>

      <div class="result-actions">
        <button
          v-if="!expedition.collected"
          class="collect-btn"
          @click="collectRewards(expedition.id)"
        >
          Collect Rewards
        </button>
        <button class="view-log-btn" @click="viewLog(expedition.id)">
          View Log
        </button>
      </div>
    </div>
  </div>
</template>
```

---

### 9.3 What's New Announcement (US-OB-025)

**Purpose:** Inform returning players about updates

#### UI Elements

```vue
<!-- /app/components/returning/WhatsNewModal.vue -->
<template>
  <div v-if="show" class="whats-new-overlay">
    <div class="whats-new-modal">
      <div class="modal-header">
        <h2>✨ What's New</h2>
        <span class="version-badge">v{{ newVersion }}</span>
      </div>

      <div class="update-content">
        <div
          v-for="feature in newFeatures"
          :key="feature.id"
          class="feature-item"
        >
          <div class="feature-icon">{{ feature.icon }}</div>
          <div class="feature-details">
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
            <button
              v-if="feature.link"
              class="try-it-btn"
              @click="navigateTo(feature.link)"
            >
              Try it now →
            </button>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="patch-notes-btn" @click="openPatchNotes">
          View Full Patch Notes
        </button>
        <button class="close-btn" @click="close">
          Got it, thanks!
        </button>
      </div>
    </div>
  </div>
</template>
```

#### Version Check Logic

```typescript
// /app/composables/useVersionCheck.ts
export const useVersionCheck = () => {
  const currentVersion = ref('')
  const lastSeenVersion = ref('')
  const hasNewFeatures = ref(false)

  onMounted(async () => {
    // Get current version from package.json or API
    currentVersion.value = await $fetch('/api/version')

    // Get last seen version from localStorage
    lastSeenVersion.value = localStorage.getItem('last_seen_version') || '0.0.0'

    // Check if version changed
    if (currentVersion.value !== lastSeenVersion.value) {
      hasNewFeatures.value = true
    }
  })

  const markVersionSeen = () => {
    localStorage.setItem('last_seen_version', currentVersion.value)
    hasNewFeatures.value = false
  }

  return {
    currentVersion,
    hasNewFeatures,
    markVersionSeen,
  }
}
```

#### Feature Announcement Data

```typescript
// /app/data/releases.ts
export const RELEASES = {
  '1.1.0': {
    date: '2025-01-15',
    features: [
      {
        id: 'dungeon-building',
        title: 'Dungeon Building System',
        description: 'Build your own dungeons! Capture monsters, collect schematics, and farm targeted loot.',
        icon: '🏗️',
        link: '/dungeons',
      },
      {
        id: 'passive-assignments',
        title: 'Passive Assignments',
        description: 'Station heroes in zones to earn passive income over time.',
        icon: '💼',
        link: '/expeditions?tab=passive',
      },
    ],
    minorChanges: [
      'Improved expedition log generation',
      'Added trait tag tooltips',
      'Fixed fatigue calculation bug',
    ],
  },

  '1.0.5': {
    date: '2025-01-05',
    features: [
      {
        id: 'party-presets',
        title: 'Party Presets',
        description: 'Save your favorite team compositions for quick deployment.',
        icon: '📋',
        link: '/expeditions',
      },
    ],
    minorChanges: [
      'UI performance improvements',
      'Balance adjustments for early zones',
    ],
  },
}
```

---

### 9.4 Daily Login Rewards (US-OB-026)

**Purpose:** Incentivize regular play (without FOMO)

#### UI Elements

```vue
<!-- /app/components/rewards/DailyLoginCalendar.vue -->
<template>
  <div v-if="show" class="daily-login-modal">
    <div class="modal-header">
      <h2>📅 Daily Login Rewards</h2>
      <p>Current Streak: {{ streak }} day{{ streak > 1 ? 's' : '' }}</p>
    </div>

    <div class="calendar-grid">
      <div
        v-for="day in 7"
        :key="day"
        class="calendar-day"
        :class="{
          claimed: day <= currentDay,
          today: day === currentDay,
          locked: day > currentDay,
        }"
      >
        <div class="day-number">Day {{ day }}</div>
        <div class="reward-icon">{{ getRewardIcon(day) }}</div>
        <div class="reward-text">{{ getRewardText(day) }}</div>
        <div v-if="day <= currentDay" class="claimed-badge">✓</div>
      </div>
    </div>

    <div v-if="canClaim" class="claim-section">
      <p class="claim-message">Day {{ currentDay }} reward available!</p>
      <button class="claim-btn" @click="claimReward">
        Claim {{ getRewardText(currentDay) }}
      </button>
    </div>

    <div v-else class="next-reward-section">
      <p>Next reward in: {{ timeUntilNextReward }}</p>
    </div>

    <button class="close-btn" @click="close">Close</button>
  </div>
</template>
```

#### Reward Schedule

```typescript
// /app/data/dailyRewards.ts
export const DAILY_REWARDS = [
  { day: 1, gold: 100, icon: '💰', text: '100 Gold' },
  { day: 2, gems: 10, icon: '💎', text: '10 Gems' },
  { day: 3, gold: 150, icon: '💰', text: '150 Gold' },
  { day: 4, materials: { common: 5 }, icon: '🧰', text: '5 Materials' },
  { day: 5, gold: 200, icon: '💰', text: '200 Gold' },
  { day: 6, gems: 25, icon: '💎', text: '25 Gems' },
  { day: 7, special: 'trait_token', icon: '🎫', text: 'Trait Reroll Token' },
]

export function getDailyReward(day: number) {
  return DAILY_REWARDS.find(r => r.day === day)
}
```

#### Streak Calculation

```typescript
// /server/api/daily-rewards/check.get.ts
export default defineEventHandler(async (event) => {
  const user = event.context.user

  // Get last claim date
  const { data: loginData } = await supabase
    .from('daily_logins')
    .select('last_claim_date, streak')
    .eq('user_id', user.id)
    .single()

  const now = new Date()
  const today = now.toISOString().split('T')[0] // YYYY-MM-DD

  if (!loginData) {
    // First login
    return {
      canClaim: true,
      currentDay: 1,
      streak: 1,
    }
  }

  const lastClaimDate = loginData.last_claim_date
  const lastClaim = new Date(lastClaimDate)
  const lastClaimDay = lastClaim.toISOString().split('T')[0]

  // Check if already claimed today
  if (lastClaimDay === today) {
    return {
      canClaim: false,
      currentDay: (loginData.streak % 7) + 1,
      streak: loginData.streak,
    }
  }

  // Check if streak continues (logged in yesterday)
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayDay = yesterday.toISOString().split('T')[0]

  let newStreak = loginData.streak
  if (lastClaimDay === yesterdayDay) {
    // Streak continues
    newStreak++
  } else if (lastClaimDay < yesterdayDay) {
    // Streak broken - allow 1-day grace period
    const daysSinceLast = Math.floor((now.getTime() - lastClaim.getTime()) / (24 * 60 * 60 * 1000))
    if (daysSinceLast > 2) {
      // Reset streak after 2+ days
      newStreak = 1
    } else {
      // Grace period - keep streak
      newStreak++
    }
  }

  return {
    canClaim: true,
    currentDay: (newStreak % 7) || 7,
    streak: newStreak,
  }
})
```

#### Important: No FOMO Design

- **Grace Period**: 1-day missed login doesn't break streak
- **Catch-Up Mechanic (Phase 3)**: Allow claiming missed days for gems
- **No Penalties**: Streak resets are simply neutral, not punishing
- **Transparent**: Show exactly when next reward is available

---

### 9.5 Data Recovery Guidance (US-OB-027)

**Purpose:** Help players recover lost progress

#### Detection Logic

```typescript
// In app.vue or layout
onMounted(() => {
  const isGuest = localStorage.getItem('is_guest') === 'true'
  const hasSession = !!useSupabaseUser().value
  const hadDataBefore = localStorage.getItem('had_data_before') === 'true'

  // Detect data loss scenario
  if (hadDataBefore && !isGuest && !hasSession) {
    // User had account but session is gone
    showDataRecoveryPrompt()
  }

  // Track that user had data
  if (hasSession) {
    localStorage.setItem('had_data_before', 'true')
  }
})
```

#### Recovery Prompt UI

```vue
<!-- /app/components/recovery/DataRecoveryPrompt.vue -->
<template>
  <div class="recovery-prompt-overlay">
    <div class="recovery-prompt-modal">
      <div class="icon">⚠️</div>
      <h2>Welcome Back!</h2>
      <p>
        It looks like you've played before, but you're not signed in.
      </p>

      <div class="recovery-options">
        <div class="option-card">
          <h3>Have an Account?</h3>
          <p>Sign in to restore your progress from the cloud.</p>
          <button class="primary-btn" @click="navigateTo('/login')">
            Sign In
          </button>
        </div>

        <div class="option-card">
          <h3>Played as Guest?</h3>
          <p>
            Guest progress is stored locally. If you cleared your browser data,
            it may be lost.
          </p>
          <button class="secondary-btn" @click="startFresh">
            Start Fresh
          </button>
        </div>
      </div>

      <div class="help-section">
        <p>Still need help?</p>
        <button class="link-btn" @click="openSupport">
          Contact Support
        </button>
      </div>
    </div>
  </div>
</template>
```

#### Prevention Messaging

**Guest Banner (Always Visible):**
```vue
<div v-if="isGuest" class="guest-warning-banner">
  <span class="icon">⚠️</span>
  <span class="message">
    You're playing as a guest. Your progress is only saved locally.
    <strong>Create an account</strong> to save your progress forever.
  </span>
  <button @click="openAccountLinking">Create Account</button>
  <button class="dismiss-btn" @click="dismissBanner">×</button>
</div>
```

---

## 10. State Management

### State Persistence Strategy

| State Type | Storage | Auth Type | Sync |
|------------|---------|-----------|------|
| Guest session data | localStorage | Guest only | No |
| User profile | Supabase DB | Account only | Yes |
| UI preferences | localStorage | Both | Optional |
| Tutorial progress | localStorage + DB | Both | Yes (accounts) |
| Dismissed tooltips | localStorage | Both | No |
| Session token | Cookie (httpOnly) | Account only | N/A |

### Store Structure

```typescript
// /app/stores/auth.ts
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    profile: null as Profile | null,
    isGuest: false,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    needsAccountLinking: (state) => state.isGuest,
  },

  actions: {
    async initializeAuth() {
      const supabase = useSupabaseClient()

      // Check for guest session
      const guestSession = localStorage.getItem('guest_session')
      if (guestSession) {
        this.isGuest = true
        await this.loadGuestData()
        return
      }

      // Check for account session
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        this.user = session.user
        await this.loadUserProfile()
      }
    },

    async loadGuestData() {
      // Load all guest data from localStorage
      // ...
    },

    async loadUserProfile() {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', this.user.id)
        .single()

      if (!error) {
        this.profile = data
      }
    },
  },
})
```

### Cross-Device Sync

**For Accounts Only:**

```typescript
// /app/composables/useSync.ts
export const useSync = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Subscribe to real-time updates (Phase 3)
  watch(user, (newUser) => {
    if (newUser) {
      // Subscribe to profile changes
      supabase
        .channel('profile-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${newUser.id}`,
          },
          (payload) => {
            // Update local state
            const authStore = useAuthStore()
            authStore.profile = payload.new
          }
        )
        .subscribe()
    }
  })
}
```

---

## 11. Implementation Priority

### Phase 1: MVP Core (Launch-Critical)

**Must-Have for First Playable Version**

| Feature | User Stories | Estimated Effort | Status |
|---------|--------------|------------------|--------|
| Landing Page | US-OB-001 | 2 days | ⬜ Todo |
| Login Page | US-OB-003 | 1 day | ✅ Done |
| Register Page | US-OB-002 | 1 day | ✅ Done |
| OAuth (Google) | US-OB-002, US-OB-003 | 2 days | ✅ Done |
| Guest Mode | US-OB-001 | 3 days | ⬜ Todo |
| Welcome Sequence | US-OB-006, US-OB-007, US-OB-008, US-OB-009 | 5 days | ⬜ Todo |
| Tutorial Flow | US-OB-010, US-OB-011, US-OB-012, US-OB-013, US-OB-014 | 3 days | ✅ Done |

**Total: ~17 days (MVP authentication + onboarding)**

---

### Phase 2: Account Management & Polish

**Improves conversion and retention**

| Feature | User Stories | Estimated Effort | Status |
|---------|--------------|------------------|--------|
| Account Linking | US-OB-005 | 4 days | ⬜ Todo |
| Password Recovery | US-OB-004 | 2 days | ⬜ Todo |
| Welcome Back Modal | US-OB-023 | 3 days | ⬜ Todo |
| Completion Notifications | US-OB-024 | 2 days | ⬜ Todo |
| Contextual Tooltips | US-OB-018 | 3 days | ⬜ Todo |
| Suggested Actions | US-OB-019 | 2 days | ⬜ Todo |
| Dungeon Tutorial | US-OB-015, US-OB-016, US-OB-017 | 4 days | ⬜ Todo |

**Total: ~20 days (post-MVP enhancements)**

---

### Phase 3: Engagement & Retention

**Nice-to-have features for long-term players**

| Feature | User Stories | Estimated Effort | Status |
|---------|--------------|------------------|--------|
| Milestone Celebrations | US-OB-020 | 3 days | ⬜ Todo |
| Help Center | US-OB-021 | 4 days | ⬜ Todo |
| Hint System | US-OB-022 | 2 days | ⬜ Todo |
| What's New Modal | US-OB-025 | 2 days | ⬜ Todo |
| Daily Login Rewards | US-OB-026 | 3 days | ⬜ Todo |
| Data Recovery UI | US-OB-027 | 1 day | ⬜ Todo |
| Push Notifications | US-OB-024 (extended) | 3 days | ⬜ Todo |

**Total: ~18 days (retention features)**

---

### Phase 4+: Future Enhancements

**Post-Launch Improvements**

- Discord OAuth integration
- Social sharing for milestones
- Achievements system integration
- Advanced hint AI (context-aware suggestions)
- Deep linking for native apps
- Multi-language support for onboarding

---

## Summary

This document provides a complete blueprint for implementing authentication and onboarding flows for Dungeon Farmers. The design prioritizes:

1. **Zero-Friction Entry**: Guest mode removes barriers to trying the game
2. **Progressive Conversion**: Gentle nudges to create accounts without pressure
3. **Respect Player Time**: Skippable tutorials, self-paced learning
4. **Retention Focus**: Welcome back experiences, offline progress, daily rewards
5. **Tone Consistency**: Lighthearted fantasy parody throughout

**Next Steps:**
1. Review and approve this design document
2. Create detailed component mockups/wireframes (Figma)
3. Begin Phase 1 implementation starting with Landing Page
4. Iterate based on playtesting feedback

**Dependencies:**
- Supabase Auth configuration (OAuth, email templates)
- Asset creation (logos, illustrations, animations)
- Copy writing (flavor text, tutorial messages)
- Database schema for profiles, onboarding progress, daily rewards

---

**Related Documentation:**
- [User Stories: Onboarding](/home/user/dungeon-farmers-new/docs/user-stories/01-onboarding.md)
- [Tutorial System README](/home/user/dungeon-farmers-new/app/components/tutorial/README.md)
- [Game Design v2](/home/user/dungeon-farmers-new/design/GAME_DESIGN_V2.md)
- [Tech Stack Recommendations](/home/user/dungeon-farmers-new/docs/tech-stack-recommendation.md)
