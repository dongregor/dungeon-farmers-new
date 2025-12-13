# Recommended Tech Stack - Dungeon Farmers

**Date**: 2025-11-02  
**Purpose**: Comprehensive technology stack recommendations for web-first idle RPG

---

## 🎯 Stack Selection Principles

**Guiding Principles**:
1. **Web-first** - Browser-based, PWA-ready
2. **Rapid development** - Fast iteration, developer velocity
3. **Simple backend** - No gacha complexity, ethical monetization
4. **Real-time updates** - Expedition completion, WebSocket support
5. **Scalable foundation** - Support growth without major rewrites
6. **Cost-effective** - Sustainable for indie budget
7. **Cross-platform ready** - Web → PWA → Steam → Mobile path

---

## 🎨 Frontend Stack

### Core Framework: **Nuxt 3** (Vue 3)
**Why Nuxt 3**:
- ✅ **Mentioned in design docs** - Already identified as preferred stack
- ✅ **Vue vs React**: Vue wins for this project (see [VUE_VS_REACT_COMPARISON.md](VUE_VS_REACT_COMPARISON.md))
  - Faster MVP development (20-30% faster)
  - Simpler state management (Pinia vs Redux)
  - Better full-stack integration (Nuxt Server Routes)
  - Easier learning curve for indie developers
  - Better PWA support out-of-the-box
- ✅ **Full-stack framework** - Unified frontend/backend development
- ✅ **SSR + SPA hybrid** - SEO-friendly, fast initial load, then SPA
- ✅ **File-based routing** - Rapid development, clear structure
- ✅ **Auto-imports** - Developer velocity
- ✅ **PWA ready** - Built-in service worker support via @vite-pwa/nuxt
- ✅ **TypeScript support** - Type safety, better DX

**Key Modules**:
```json
{
  "@nuxtjs/tailwindcss": "^6.x",     // Utility-first CSS
  "@pinia/nuxt": "^2.x",             // State management
  "@vite-pwa/nuxt": "^0.5.x",        // PWA support
  "@vueuse/core": "^10.x",           // Composition utilities
  "@nuxtjs/supabase": "^2.x"         // Backend integration (optional)
}
```

**UI Framework**: **Tailwind CSS + Headless UI**
**Why**:
- ✅ **Rapid UI development** - Utility-first, no custom CSS needed
- ✅ **Mobile-first** - Responsive by default
- ✅ **Corporate aesthetic** - Clean, professional look matches game tone
- ✅ **Accessibility** - Headless UI components are accessible
- ✅ **Customizable** - Easy to match "Office Space meets D&D" aesthetic

**State Management**: **Pinia**
**Why**:
- ✅ **Vue 3 native** - Official state management
- ✅ **TypeScript support** - Type-safe stores
- ✅ **DevTools** - Excellent debugging
- ✅ **Composition API** - Modern, intuitive API
- ✅ **Modular** - Separate stores for heroes, expeditions, dungeons, etc.

**Real-time Updates**: **WebSocket Client**
- **Socket.io-client** (if using Node.js backend)
- **Native WebSocket API** (for Supabase/alternatives)
- **Fallback**: Polling for expedition completion checks

---

## 🔧 Backend Stack

### Option A: **Nuxt 3 Server Routes** (Recommended for MVP)
**Why**:
- ✅ **Unified stack** - Same codebase, same language
- ✅ **Rapid development** - No separate backend project
- ✅ **Simple architecture** - Perfect for pay-once model
- ✅ **Cost-effective** - Single deployment, minimal infrastructure
- ✅ **Fast iteration** - Frontend + backend changes together

**Architecture**:
```
Nuxt 3 Server Routes (/server/api/*)
├── Auth endpoints (JWT tokens)
├── Game state endpoints (CRUD operations)
├── Expedition management
├── Payment processing (webhook handling)
└── Alliance/chat endpoints
```

**Server Technologies**:
- **H3** (Nuxt's built-in server framework)
- **Nitro** (Nuxt's server engine - runs on Node.js, Deno, or edge)

**Limitations**: 
- ⚠️ WebSocket support requires Nitro hooks or separate service
- ⚠️ Not ideal for high-concurrency (but idle game doesn't need that)

**Best For**: MVP, rapid iteration, indie budget

---

### Option B: **Supabase** (Recommended for Scale)
**Why**:
- ✅ **Backend-as-a-Service** - Database, Auth, Storage, Real-time in one
- ✅ **PostgreSQL** - Powerful relational database
- ✅ **Real-time subscriptions** - WebSocket built-in for expedition updates
- ✅ **Row-level security** - Secure data access
- ✅ **Free tier generous** - 500MB database, 50K monthly active users
- ✅ **Auto-scaling** - Handles growth without infrastructure management
- ✅ **Nuxt integration** - Official @nuxtjs/supabase module

**Architecture**:
```
Supabase Services:
├── PostgreSQL Database (game state, users, alliances)
├── Authentication (email/password, OAuth)
├── Real-time (WebSocket subscriptions for expeditions)
├── Storage (user assets, cosmetics - future)
└── Edge Functions (complex logic, payment webhooks)
```

**Best For**: Production launch, scale, real-time features

---

### Option C: **Node.js + Express/Fastify** (Traditional Approach)
**Why**:
- ✅ **Full control** - Complete customization
- ✅ **Proven stack** - Large ecosystem, many resources
- ✅ **WebSocket support** - Socket.io or ws library
- ✅ **Flexible** - Choose any database, any architecture

**Architecture**:
```
Express/Fastify Server:
├── REST API endpoints
├── WebSocket server (Socket.io)
├── Background jobs (expedition timers, cron jobs)
└── Payment webhooks
```

**Best For**: Complex custom requirements, team familiar with Node.js

**Recommendation**: Start with **Option A (Nuxt Server Routes)**, migrate to **Option B (Supabase)** for production.

---

## 💾 Database

### Primary Database: **PostgreSQL**
**Why**:
- ✅ **Relational data** - Heroes, expeditions, dungeons have relationships
- ✅ **ACID transactions** - Critical for game state consistency
- ✅ **JSON support** - Store flexible data (traits, monster properties)
- ✅ **Mature** - Stable, well-documented
- ✅ **Free tier available** - Supabase, Railway, Render all offer free PostgreSQL

**Schema Design**:
```sql
-- Core Tables:
users
heroes
expeditions (with timer/completion tracking)
monsters
personal_dungeons
schematics
equipment
alliances
alliance_members
raid_participants
```

**ORM/Query Builder**: 
- **Prisma** (TypeScript-first, excellent DX) - Recommended
- **Drizzle ORM** (lightweight, SQL-like) - Alternative
- **Supabase Client** (if using Supabase) - Built-in

---

### Caching Layer: **Redis** (Optional, for Production)
**Why**:
- ✅ **Session storage** - User sessions, JWT tokens
- ✅ **Expedition timers** - Real-time countdowns
- ✅ **Rate limiting** - API protection
- ✅ **Leaderboards** - Fast sorted sets
- ✅ **Real-time data** - Chat messages, alliance activity

**Alternatives**:
- **Upstash Redis** (serverless, pay-per-use)
- **Railway Redis** (simple deployment)
- **Redis Cloud** (managed service)

**MVP**: Can skip, add when needed for real-time features

---

## 🔐 Authentication & Authorization

### **Supabase Auth** (If using Supabase)
**Why**:
- ✅ **Built-in** - Email/password, OAuth (Google, Discord, etc.)
- ✅ **JWT tokens** - Stateless authentication
- ✅ **Row-level security** - Database-level authorization
- ✅ **Free tier** - Sufficient for indie game

**Alternatives**:
- **Nuxt Auth Utils** (if using pure Nuxt)
- **NextAuth** (if migrating to Next.js - not recommended)
- **Custom JWT** (if using Express/Fastify)

---

## 💳 Payment Processing

### **Stripe** (Recommended)
**Why**:
- ✅ **Simple integration** - Webhook-based, well-documented
- ✅ **One-time payments** - Perfect for $9.99 premium unlock
- ✅ **Subscription support** - For optional cosmetic passes (future)
- ✅ **Low fees** - 2.9% + $0.30 per transaction
- ✅ **Compliance** - PCI-compliant, handles all security
- ✅ **Nuxt/JS libraries** - Excellent SDK support

**Implementation**:
```javascript
// Stripe Checkout (redirect-based)
// Or Stripe Elements (embedded form)
// Webhook: /server/api/stripe/webhook
```

**Alternatives**:
- **Paddle** (better for SaaS, higher fees)
- **PayPal** (alternative payment method)
- **Lemon Squeezy** (simpler, but less control)

**Demo/Testing**: **Stripe Test Mode** - Perfect for beta testing

---

## 🎮 Real-Time Features

### **WebSocket Implementation**

**Option A: Supabase Realtime** (Recommended)
- ✅ Built-in WebSocket subscriptions
- ✅ Real-time database changes
- ✅ Perfect for expedition completion updates
- ✅ Free tier includes real-time

**Option B: Socket.io**
- ✅ Node.js backend required
- ✅ More control, more setup
- ✅ Rooms for alliance chat
- ✅ Custom events for expeditions

**Option C: Server-Sent Events (SSE)**
- ✅ Simpler than WebSocket
- ✅ One-way (server → client)
- ✅ Perfect for expedition updates (timer countdowns)
- ✅ Built into Nuxt/Nitro

**Recommendation**: **Supabase Realtime** for production, **SSE** for MVP

---

## 📱 PWA & Mobile Support

### **@vite-pwa/nuxt** (PWA Plugin)
**Features**:
- ✅ Service worker generation
- ✅ Offline support
- ✅ App manifest
- ✅ Install prompt
- ✅ Update notifications

**Mobile Optimization**:
- ✅ **Responsive design** - Tailwind mobile-first
- ✅ **Touch controls** - Large buttons, swipe gestures
- ✅ **App-like experience** - PWA manifest
- ✅ **Offline progress** - Service worker caches critical data

**Future Mobile Expansion**:
- **Capacitor** - Wrap web app for iOS/Android
- Same codebase, native app wrapper
- Access to device features (notifications, etc.)

---

## 🚀 Deployment & Hosting

### **Frontend + Backend**: **Vercel** or **Netlify** or **Railway**
**Vercel** (Recommended):
- ✅ **Nuxt optimized** - Built-in Nuxt support
- ✅ **Serverless functions** - Nuxt server routes
- ✅ **Edge network** - Global CDN
- ✅ **Free tier** - Generous for MVP
- ✅ **Instant deployment** - Git push → deploy
- ⚠️ **Database separate** - Need external PostgreSQL

**Railway** (Full-stack):
- ✅ **Database included** - PostgreSQL + Redis
- ✅ **Simple deployment** - Git push → deploy
- ✅ **$5/month starter** - Affordable
- ✅ **All-in-one** - Frontend + Backend + Database

**Netlify**:
- ✅ **Nuxt support** - Good integration
- ✅ **Serverless functions** - Netlify Functions
- ✅ **Free tier** - Good for MVP
- ⚠️ **Database separate** - Need external database

**Supabase** (If using Supabase):
- ✅ **Database hosted** - PostgreSQL included
- ✅ **Edge Functions** - Serverless functions
- ✅ **Static hosting** - Can host frontend
- ✅ **All-in-one** - Frontend + Backend + Database

**Recommendation**: **Railway** for MVP (all-in-one), **Vercel + Supabase** for production scale

---

## 📊 Analytics & Monitoring

### **Analytics**: **Posthog** or **Plausible** or **Simple Analytics**
**Posthog** (Recommended):
- ✅ **Product analytics** - User behavior, conversion tracking
- ✅ **Feature flags** - A/B testing
- ✅ **Session replay** - Debug user issues
- ✅ **Free tier** - 1M events/month
- ✅ **Privacy-focused** - Self-hostable

**Plausible** (Alternative):
- ✅ **Privacy-first** - GDPR compliant, no cookies
- ✅ **Simple** - Focused on essentials
- ✅ **Affordable** - $9/month for 10K pageviews
- ⚠️ **Less features** - No advanced analytics

**Simple Analytics**:
- ✅ **Ultra-lightweight** - 1KB script
- ✅ **Privacy-focused** - No personal data
- ✅ **Free tier** - For small sites

---

### **Error Monitoring**: **Sentry**
**Why**:
- ✅ **Real-time errors** - Catch bugs in production
- ✅ **Source maps** - Debug TypeScript/Vue errors
- ✅ **Performance monitoring** - Track slow operations
- ✅ **Free tier** - 5K events/month
- ✅ **Nuxt integration** - Official module

---

### **Logging**: **Axiom** or **LogTail**
**Axiom**:
- ✅ **Fast queries** - Query logs in real-time
- ✅ **Affordable** - Free tier + pay-as-you-go
- ✅ **Modern** - Built for modern apps

**LogTail** (Alternative):
- ✅ **Simple** - Easy setup
- ✅ **Free tier** - 1GB/month
- ✅ **Real-time** - Live log streaming

---

## 🧪 Testing

### **Unit Testing**: **Vitest**
**Why**:
- ✅ **Vite-native** - Fast, modern test runner
- ✅ **Nuxt integration** - Works out-of-the-box
- ✅ **TypeScript** - Full TS support
- ✅ **Vue Test Utils** - Vue component testing

### **E2E Testing**: **Playwright**
**Why**:
- ✅ **Cross-browser** - Chrome, Firefox, Safari
- ✅ **Fast** - Modern, efficient
- ✅ **Great DX** - Excellent debugging tools
- ✅ **TypeScript** - Native TS support

**Alternative**: **Cypress** (more ecosystem, slower)

---

## 📦 DevOps & CI/CD

### **Version Control**: **GitHub**
**CI/CD**: **GitHub Actions**
**Why**:
- ✅ **Free for public repos** - Cost-effective
- ✅ **Nuxt deployment** - Many actions available
- ✅ **Automated testing** - Run tests on PR
- ✅ **Automated deployment** - Deploy on merge

**Workflow**:
```yaml
# .github/workflows/deploy.yml
- Run tests (Vitest)
- Build Nuxt app
- Deploy to Vercel/Railway
- Run E2E tests (Playwright)
```

---

## 🔄 State Management Architecture

### **Client-Side State**: **Pinia Stores**
```typescript
stores/
├── auth.ts          // User authentication
├── heroes.ts        // Hero roster management
├── expeditions.ts   // Active expeditions
├── dungeons.ts      // Personal dungeons
├── monsters.ts      // Monster collection
├── equipment.ts     // Equipment management
├── alliance.ts      // Alliance data
└── ui.ts            // UI state (modals, etc.)
```

### **Server-Side State**: **Nuxt Server Routes + Database**
- Server handles all game state persistence
- Client fetches/updates via API endpoints
- Real-time updates via WebSocket/SSE

---

## 🗄️ Data Architecture

### **Database Schema Design** (PostgreSQL)

**Core Tables**:
```sql
users (id, email, premium_status, created_at, updated_at)
heroes (id, user_id, name, archetype, level, traits, equipment_ids, power)
expeditions (id, user_id, zone_id, hero_ids, start_time, duration, status)
monsters (id, user_id, type, power, level, captured_at)
personal_dungeons (id, user_id, schematic_id, monster_ids, durability, status)
schematics (id, name, rarity, slots, durability)
equipment (id, user_id, hero_id, slot, name, rarity, stats)
alliances (id, name, level, member_count)
alliance_members (id, alliance_id, user_id, role)
raids (id, alliance_id, participants, start_time, status)
```

**Indexes**:
- `users.email` (unique)
- `heroes.user_id`
- `expeditions.user_id, status`
- `expeditions.start_time` (for timer queries)
- `alliance_members.alliance_id, user_id`

---

## 🎨 Asset Management

### **Images/Assets**: 
**Development**: **Local assets** (in `/public` folder)
**Production**: **Supabase Storage** or **Cloudflare R2** or **S3**
- Hero portraits
- Monster sprites
- Equipment icons
- UI elements
- Cosmetics (premium)

**CDN**: **Cloudflare** or **Vercel Edge** - Fast global delivery

---

## 🔐 Security Considerations

### **Best Practices**:
1. **HTTPS only** - SSL/TLS certificates (handled by hosting)
2. **JWT tokens** - Stateless authentication
3. **Row-level security** - Database-level authorization (Supabase)
4. **Rate limiting** - API protection (Redis or middleware)
5. **Input validation** - Zod schemas for API endpoints
6. **SQL injection prevention** - Parameterized queries (Prisma/Drizzle)
7. **CORS** - Configure for production domains
8. **Environment variables** - Secrets in .env, never commit

---

## 📱 Future Platform Expansion

### **Steam Release**: **Electron**
- Wrap Nuxt app in Electron
- Same codebase, desktop app
- Add Steam integration (Steamworks API)
- Achievement support
- Cloud saves via Steam

### **Mobile Release**: **Capacitor**
- Wrap Nuxt app in Capacitor
- Same codebase, native app
- Access device features (notifications, etc.)
- App store distribution (iOS/Android)

---

## 💰 Cost Estimation (MVP)

### **Development Phase** (Months 1-6):
- **Hosting**: $0-20/month (free tiers)
- **Database**: $0-5/month (Supabase free tier or Railway starter)
- **Domain**: $12/year (~$1/month)
- **Total**: **~$0-25/month**

### **Launch Phase** (Post-launch):
- **Hosting**: $20-100/month (depending on traffic)
- **Database**: $25-100/month (scale with users)
- **Payment processing**: 2.9% + $0.30 per transaction (Stripe)
- **Analytics**: $0-50/month (PostHog free tier may suffice)
- **Total**: **~$50-250/month** (scales with success)

**Very sustainable for indie developer!**

---

## 🚀 Recommended MVP Stack

### **Phase 1 (Months 1-2) - MVP**:
```
Frontend: Nuxt 3 + Tailwind CSS + Pinia
Backend: Nuxt Server Routes (Nitro)
Database: Supabase PostgreSQL (free tier)
Auth: Supabase Auth
Real-time: Server-Sent Events (SSE) or polling
Payment: Stripe Checkout
Hosting: Vercel (free tier)
Analytics: PostHog (free tier)
```

### **Phase 2-3 (Months 3-6) - Scale**:
```
Everything above, plus:
Real-time: Supabase Realtime (WebSocket)
Caching: Upstash Redis (if needed)
Monitoring: Sentry (error tracking)
Logging: Axiom (if needed)
Hosting: Vercel Pro or Railway ($20/month)
```

### **Phase 4 (Month 7+) - Production**:
```
Everything above, plus:
CDN: Cloudflare (for assets)
Backup: Automated database backups
Monitoring: Full observability stack
Scale: Upgrade hosting as needed
```

---

## ✅ Tech Stack Decision Summary

**Recommended MVP Stack**:
1. **Frontend**: Nuxt 3 + Vue 3 + TypeScript
2. **Styling**: Tailwind CSS + Headless UI
3. **State**: Pinia
4. **Backend**: Nuxt Server Routes (Nitro)
5. **Database**: Supabase PostgreSQL
6. **Auth**: Supabase Auth
7. **Real-time**: Supabase Realtime (or SSE for MVP)
8. **Payment**: Stripe
9. **Hosting**: Vercel or Railway
10. **Analytics**: PostHog
11. **Testing**: Vitest + Playwright
12. **CI/CD**: GitHub Actions

**Why This Stack**:
- ✅ **Rapid development** - Modern, efficient tools
- ✅ **Cost-effective** - Free tiers for MVP
- ✅ **Scalable** - Handles growth
- ✅ **Simple** - Unified stack, easy maintenance
- ✅ **Future-proof** - Easy migration to Steam/Mobile
- ✅ **Developer-friendly** - Great DX, TypeScript support

---

**Ready to start development!** This stack aligns perfectly with your web-first, rapid iteration, ethical monetization approach.

