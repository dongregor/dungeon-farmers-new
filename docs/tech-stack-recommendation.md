# Tech Stack Recommendation - Dungeon Farmers

**Date:** 2024-12-14  
**Based on:** GAME_DESIGN_V2.md + Implementation Plans  
**Status:** Recommended for Phase 1 MVP

---

## Executive Summary

**Recommended Stack:**
- **Frontend:** Nuxt 3/4 + Vue 3 + TypeScript + Tailwind CSS + Pinia ✅ (Already chosen)
- **Backend:** Nuxt Server Routes (MVP) → Supabase (Production)
- **Database:** PostgreSQL (via Supabase)
- **Real-time:** Server-Sent Events (MVP) → Supabase Realtime (Production)
- **Hosting:** Vercel (Frontend) + Supabase (Database/Auth)
- **Payments:** Stripe
- **Testing:** Vitest + Playwright ✅ (Already chosen)

**Why This Stack:**
1. ✅ Matches your current setup (Nuxt 4, Vue 3, Pinia, Tailwind)
2. ✅ Rapid development for solo dev
3. ✅ Cost-effective (free tiers sufficient for MVP)
4. ✅ Scales to production without major rewrites
5. ✅ Supports all game requirements (timers, offline progress, real-time)

---

## Frontend Stack ✅ (Already Set)

### Core Framework: **Nuxt 3/4 + Vue 3**

**Current Status:** ✅ Already installed (Nuxt 4.2.2, Vue 3.5.25)

**Why This Works:**
- ✅ **Full-stack framework** - Frontend + backend in one codebase
- ✅ **File-based routing** - Fast development, clear structure
- ✅ **Auto-imports** - Components, composables, utilities auto-imported
- ✅ **SSR + SPA hybrid** - SEO-friendly initial load, then SPA
- ✅ **TypeScript support** - Type safety throughout
- ✅ **Server Routes** - Built-in API endpoints (`/server/api/*`)

**Nuxt 4 vs Nuxt 3:**
- Nuxt 4 is newer with better performance
- Both work for this project
- Nuxt 4 has improved Nitro (server engine)
- Recommendation: **Keep Nuxt 4** (you're already on it)

### State Management: **Pinia** ✅

**Current Status:** ✅ Already installed (@pinia/nuxt 0.11.3)

**Why This Works:**
- ✅ Official Vue 3 state management
- ✅ TypeScript support
- ✅ DevTools integration
- ✅ Perfect for game state (heroes, expeditions, inventory)

**Store Structure:**
```
stores/
├── heroes.ts      # Hero roster, recruitment
├── tavern.ts      # Tavern state, refresh logic
├── expeditions.ts # Active expeditions, timers
├── zones.ts       # Zone data, familiarity
├── inventory.ts   # Equipment, materials
└── game.ts        # Global game state, player data
```

### Styling: **Tailwind CSS** ✅

**Current Status:** ✅ Already installed (@nuxtjs/tailwindcss 6.14.0)

**Why This Works:**
- ✅ Rapid UI development
- ✅ Mobile-first responsive
- ✅ Consistent design system
- ✅ Perfect for game UI (cards, badges, progress bars)

**Recommended Additions:**
```bash
npm install @headlessui/vue @heroicons/vue
```
- Headless UI: Accessible components (modals, dropdowns)
- Heroicons: Icon library

### Testing: **Vitest** ✅

**Current Status:** ✅ Already installed (vitest 4.0.15)

**Why This Works:**
- ✅ Fast unit tests
- ✅ TypeScript support
- ✅ Vue component testing
- ✅ Perfect for game logic (hero generation, power calculations)

**Recommended Addition:**
```bash
npm install -D @vue/test-utils @testing-library/vue
```

---

## Backend Stack (Decision Needed)

### Phase 1 MVP: **Nuxt Server Routes (Nitro)**

**Why Start Here:**
- ✅ **No separate backend** - Everything in one codebase
- ✅ **Rapid development** - Frontend + backend changes together
- ✅ **Cost-effective** - Single deployment (Vercel free tier)
- ✅ **Simple architecture** - Perfect for MVP
- ✅ **Fast iteration** - No context switching

**Architecture:**
```
server/
├── api/
│   ├── heroes/
│   │   ├── index.get.ts      # List heroes
│   │   ├── [id].get.ts       # Get hero
│   │   ├── recruit.post.ts   # Recruit hero
│   │   └── [id]/retire.post.ts
│   ├── expeditions/
│   │   ├── index.get.ts      # List expeditions
│   │   ├── start.post.ts     # Start expedition
│   │   └── [id]/complete.post.ts
│   ├── zones/
│   │   └── index.get.ts
│   └── equipment/
│       └── index.get.ts
├── utils/
│   ├── db.ts                 # Database client
│   └── auth.ts               # Auth helpers
└── middleware/
    └── auth.ts               # Auth middleware
```

**Database Client Options:**
1. **Supabase Client** (Recommended)
   ```typescript
   // server/utils/db.ts
   import { createClient } from '@supabase/supabase-js'
   export const supabase = createClient(
     process.env.SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_KEY!
   )
   ```

2. **Drizzle ORM** (Alternative)
   ```typescript
   // Type-safe queries, migrations
   import { drizzle } from 'drizzle-orm/postgres-js'
   ```

**Limitations:**
- ⚠️ WebSocket requires separate service (use SSE for MVP)
- ⚠️ Background jobs need cron service (use Vercel Cron or separate worker)

**Best For:** MVP, rapid iteration, solo dev

---

### Phase 2+ Production: **Supabase** (Recommended Migration)

**Why Migrate:**
- ✅ **Backend-as-a-Service** - Database, Auth, Real-time, Storage
- ✅ **PostgreSQL** - Powerful relational database
- ✅ **Real-time subscriptions** - WebSocket built-in
- ✅ **Row-level security** - Secure data access
- ✅ **Free tier generous** - 500MB DB, 50K MAU
- ✅ **Auto-scaling** - Handles growth automatically
- ✅ **Nuxt integration** - Official @nuxtjs/supabase module

**Migration Path:**
1. Start with Nuxt Server Routes + Supabase PostgreSQL
2. Use Supabase client in server routes
3. Gradually migrate to Supabase Realtime for real-time features
4. Use Supabase Auth when ready

**Best For:** Production launch, scale, real-time features

---

## Database: **PostgreSQL** (via Supabase)

**Why PostgreSQL:**
- ✅ **Relational data** - Heroes, expeditions, equipment have relationships
- ✅ **ACID transactions** - Critical for game state consistency
- ✅ **JSON support** - Store flexible data (traits, monster properties)
- ✅ **Mature & stable** - Battle-tested, well-documented
- ✅ **Free tier** - Supabase free tier sufficient for MVP

**Schema Overview:**
```sql
-- Core Tables
users              -- Player accounts
heroes             -- Hero roster
expeditions        -- Active/completed expeditions
equipment          -- Equipment inventory
zones              -- Zone progress (familiarity, mastery)
monsters           -- Captured monsters (Phase 2)
dungeons           -- Player-built dungeons (Phase 2)
schematics         -- Dungeon schematics (Phase 2)
```

**ORM/Query Builder:**
- **Supabase Client** (if using Supabase) - Recommended
- **Drizzle ORM** (if using raw PostgreSQL) - Type-safe alternative
- **Prisma** (alternative) - More features, more setup

**Recommendation:** Start with **Supabase Client** (simplest), add Drizzle if you need complex queries.

---

## Real-Time Updates

### MVP: **Server-Sent Events (SSE)**

**Why SSE for MVP:**
- ✅ **Built into Nuxt/Nitro** - No additional setup
- ✅ **One-way (server → client)** - Perfect for expedition updates
- ✅ **Simple implementation** - Less complexity than WebSocket
- ✅ **Auto-reconnect** - Browser handles reconnection

**Implementation:**
```typescript
// server/api/expeditions/[id]/stream.get.ts
export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')
  
  // Stream expedition updates
  return new ReadableStream({
    start(controller) {
      // Send updates every second
      const interval = setInterval(() => {
        const data = getExpeditionStatus(id)
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`)
      }, 1000)
      
      // Cleanup on close
      event.node.req.on('close', () => clearInterval(interval))
    }
  })
})
```

**Client Usage:**
```typescript
// composables/useExpeditionStream.ts
const eventSource = new EventSource(`/api/expeditions/${id}/stream`)
eventSource.onmessage = (e) => {
  const data = JSON.parse(e.data)
  // Update expedition state
}
```

### Production: **Supabase Realtime**

**Why Upgrade:**
- ✅ **WebSocket-based** - Bidirectional communication
- ✅ **Database subscriptions** - Real-time database changes
- ✅ **Built-in** - No custom server needed
- ✅ **Scalable** - Handles many concurrent connections

**Implementation:**
```typescript
// composables/useExpeditionRealtime.ts
const supabase = useSupabaseClient()

const subscription = supabase
  .channel('expeditions')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'expeditions',
    filter: `id=eq.${expeditionId}`
  }, (payload) => {
    // Update expedition state
  })
  .subscribe()
```

**Recommendation:** Start with **SSE** (MVP), migrate to **Supabase Realtime** (Production).

---

## Authentication

### Option A: **Supabase Auth** (Recommended)

**Why:**
- ✅ **Built-in** - Email/password, OAuth (Google, Discord)
- ✅ **JWT tokens** - Stateless authentication
- ✅ **Row-level security** - Database-level authorization
- ✅ **Free tier** - Sufficient for indie game
- ✅ **Nuxt integration** - @nuxtjs/supabase module

**Setup:**
```bash
npm install @nuxtjs/supabase
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase'],
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/']
    }
  }
})
```

### Option B: **Nuxt Auth Utils** (Alternative)

**Why:**
- ✅ **Pure Nuxt** - No external service
- ✅ **JWT-based** - Stateless
- ✅ **Customizable** - Full control

**Best For:** If you want to avoid Supabase dependency

**Recommendation:** Use **Supabase Auth** (simplest, most features).

---

## Payment Processing: **Stripe**

**Why Stripe:**
- ✅ **Simple integration** - Webhook-based, well-documented
- ✅ **One-time payments** - Perfect for $15-20 supporter pack
- ✅ **Low fees** - 2.9% + $0.30 per transaction
- ✅ **Compliance** - PCI-compliant, handles security
- ✅ **Nuxt/JS libraries** - Excellent SDK support

**Implementation:**
```bash
npm install stripe @stripe/stripe-js
```

```typescript
// server/api/stripe/checkout.post.ts
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default defineEventHandler(async (event) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'Dungeon Farmers Supporter Pack' },
        unit_amount: 2000, // $20.00
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.APP_URL}/success`,
    cancel_url: `${process.env.APP_URL}/cancel`,
  })
  
  return { url: session.url }
})
```

**Webhook Handler:**
```typescript
// server/api/stripe/webhook.post.ts
export default defineEventHandler(async (event) => {
  const sig = getHeader(event, 'stripe-signature')
  const body = await readBody(event)
  
  const webhook = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
  
  if (webhook.type === 'checkout.session.completed') {
    // Grant supporter pack benefits
    await grantSupporterPack(webhook.data.object.customer_email)
  }
})
```

---

## Hosting & Deployment

### Frontend + Backend: **Vercel** (Recommended)

**Why Vercel:**
- ✅ **Nuxt optimized** - Built-in Nuxt support
- ✅ **Serverless functions** - Nuxt server routes
- ✅ **Edge network** - Global CDN
- ✅ **Free tier** - Generous for MVP (100GB bandwidth)
- ✅ **Instant deployment** - Git push → deploy
- ✅ **Preview deployments** - Test before production

**Setup:**
```bash
npm install -D vercel
vercel
```

**Environment Variables:**
```
SUPABASE_URL=...
SUPABASE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
```

### Database: **Supabase** (Recommended)

**Why:**
- ✅ **Free tier** - 500MB database, 50K MAU
- ✅ **Managed PostgreSQL** - No server management
- ✅ **Backups included** - Automated daily backups
- ✅ **Scales automatically** - Upgrade as needed

**Alternatives:**
- **Railway** - $5/month, simple setup
- **Render** - Free tier available
- **Neon** - Serverless PostgreSQL

**Recommendation:** Use **Supabase** (free tier sufficient, easy migration path).

---

## Background Jobs & Cron

### MVP: **Vercel Cron** (Recommended)

**Why:**
- ✅ **Built into Vercel** - No separate service
- ✅ **Free tier** - Sufficient for MVP
- ✅ **Simple setup** - JSON config

**Setup:**
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/expeditions",
    "schedule": "*/5 * * * *"
  }]
}
```

**Use Cases:**
- Complete expired expeditions
- Refresh tavern slots
- Process offline progress

### Production: **Supabase Edge Functions** (Alternative)

**Why:**
- ✅ **Serverless** - No infrastructure
- ✅ **Scheduled** - Cron-like scheduling
- ✅ **Integrated** - Same platform as database

**Recommendation:** Use **Vercel Cron** (MVP), consider **Supabase Edge Functions** (Production).

---

## Offline Progress

### Implementation Strategy

**Client-Side:**
- Store expedition start time in localStorage
- Calculate progress on app load
- Send completion to server

**Server-Side:**
- Validate completion time
- Process rewards
- Update game state

**Implementation:**
```typescript
// composables/useOfflineProgress.ts
export const useOfflineProgress = () => {
  const processOfflineProgress = async () => {
    const lastSync = localStorage.getItem('lastSync')
    const now = Date.now()
    const offlineTime = now - (lastSync ? parseInt(lastSync) : now)
    
    // Calculate completed expeditions
    const completed = await $fetch('/api/sync', {
      method: 'POST',
      body: { offlineTime }
    })
    
    // Update game state
    return completed
  }
  
  return { processOfflineProgress }
}
```

---

## AI Integration (Phase 4)

### **OpenAI API** (Recommended)

**Why:**
- ✅ **GPT-4** - High-quality text generation
- ✅ **Well-documented** - Easy integration
- ✅ **Pay-per-use** - Cost-effective for rare events

**Use Cases:**
- Rare expedition events (5% of expeditions)
- Unique story moments
- Hero trait reactions

**Implementation:**
```typescript
// server/utils/ai.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateRareEvent(
  heroes: Hero[],
  zone: Zone,
  context: string
): Promise<string> {
  const prompt = `Generate a unique fantasy event for heroes ${heroes.map(h => h.name).join(', ')} in ${zone.name}. Context: ${context}`
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200
  })
  
  return response.choices[0].message.content
}
```

**Cost Management:**
- Only generate for rare events (5% of expeditions)
- Cache similar events
- Use cheaper models (gpt-3.5-turbo) for less important content

**Alternatives:**
- **Anthropic Claude** - Alternative AI provider
- **Local LLM** - Self-hosted (complex setup)

---

## Testing Stack ✅ (Already Set)

### Unit Tests: **Vitest** ✅

**Current Status:** ✅ Already installed

**Recommended Additions:**
```bash
npm install -D @vue/test-utils @testing-library/vue
```

### E2E Tests: **Playwright** (Recommended)

**Why:**
- ✅ **Cross-browser** - Chrome, Firefox, Safari
- ✅ **Fast** - Parallel execution
- ✅ **Reliable** - Auto-wait, retries

**Setup:**
```bash
npm install -D @playwright/test
npx playwright install
```

**Test Examples:**
- Hero recruitment flow
- Expedition start → complete
- Equipment equipping
- Offline progress calculation

---

## Recommended Package.json

```json
{
  "name": "dungeon-farmers",
  "type": "module",
  "private": true,
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "test": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@headlessui/vue": "^1.7.16",
    "@heroicons/vue": "^2.0.18",
    "@nuxtjs/supabase": "^2.0.0",
    "@nuxtjs/tailwindcss": "^6.14.0",
    "@pinia/nuxt": "^0.11.3",
    "@stripe/stripe-js": "^2.1.11",
    "@vueuse/core": "^10.7.0",
    "date-fns": "^2.30.0",
    "nuxt": "^4.2.2",
    "openai": "^4.20.0",
    "stripe": "^14.0.0",
    "uuid": "^9.0.1",
    "vue": "^3.5.25",
    "vue-router": "^4.6.3"
  },
  "devDependencies": {
    "@nuxt/eslint": "^1.12.1",
    "@playwright/test": "^1.40.0",
    "@testing-library/vue": "^8.0.0",
    "@types/uuid": "^9.0.7",
    "@vitest/ui": "^4.0.15",
    "@vue/test-utils": "^2.4.3",
    "vitest": "^4.0.15"
  }
}
```

---

## Cost Estimation

### MVP Phase (Months 1-6):
- **Vercel:** $0/month (free tier)
- **Supabase:** $0/month (free tier: 500MB DB, 50K MAU)
- **Stripe:** 2.9% + $0.30 per transaction
- **OpenAI:** ~$5-20/month (rare events only)
- **Domain:** $12/year (~$1/month)
- **Total:** **~$1-25/month**

### Production Phase (Post-launch):
- **Vercel:** $20/month (Pro plan)
- **Supabase:** $25/month (Pro plan)
- **Stripe:** 2.9% + $0.30 per transaction
- **OpenAI:** $50-200/month (scales with users)
- **Total:** **~$100-300/month** (scales with success)

**Very sustainable for indie developer!**

---

## Migration Path

### Phase 1 (MVP): Nuxt Server Routes + Supabase DB
- ✅ Simple setup
- ✅ Fast development
- ✅ Free tier sufficient

### Phase 2 (Production): Add Supabase Realtime
- ✅ Real-time expedition updates
- ✅ WebSocket support
- ✅ Better user experience

### Phase 3 (Scale): Add Caching (Optional)
- ✅ Redis for leaderboards
- ✅ Session caching
- ✅ Only if needed

---

## Final Recommendation

**For Phase 1 MVP:**
1. ✅ **Keep current stack** (Nuxt 4, Vue 3, Pinia, Tailwind, Vitest)
2. ✅ **Add Supabase** for database and auth
3. ✅ **Use Nuxt Server Routes** for API
4. ✅ **Use SSE** for real-time updates
5. ✅ **Add Stripe** for payments
6. ✅ **Deploy to Vercel**

**This stack:**
- ✅ Matches your current setup
- ✅ Rapid development
- ✅ Cost-effective
- ✅ Scales to production
- ✅ Supports all game requirements

**Next Steps:**
1. Install Supabase: `npm install @nuxtjs/supabase`
2. Set up Supabase project (free tier)
3. Create database schema
4. Start building Phase 1 features

---

## Questions to Consider

1. **Do you want to start with Supabase immediately?**
   - ✅ Yes: Use Supabase from day 1 (recommended)
   - ⚠️ No: Use Nuxt Server Routes + separate PostgreSQL (more setup)

2. **Real-time priority?**
   - ✅ MVP: SSE is sufficient
   - ⚠️ Production: Upgrade to Supabase Realtime

3. **AI generation budget?**
   - ✅ MVP: Skip AI, use templates
   - ⚠️ Phase 4: Add OpenAI for rare events

4. **Testing priority?**
   - ✅ MVP: Unit tests for game logic
   - ⚠️ Production: Add E2E tests

---

**Bottom Line:** Your current stack is excellent. Add Supabase for database/auth, use Nuxt Server Routes for API, and you're ready to build! 🚀
