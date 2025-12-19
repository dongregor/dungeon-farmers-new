# Database Functions (RPCs)

This directory contains SQL functions that should be created in the Supabase database for atomic operations.

## Why Use Database Functions?

Database functions (RPCs) provide:
- **Atomicity**: All operations succeed or fail together
- **Consistency**: No partial updates that leave data in invalid states
- **Performance**: Single round-trip instead of multiple queries
- **Security**: Database-enforced permissions and validation

## Available Functions

### `equip_item`

Atomically equips an item to a hero with proper transaction handling.

**Operations performed:**
1. Lock hero row (prevents concurrent modifications)
2. Unequip previous item in slot (if exists)
3. Equip new item
4. Update hero's equipment mapping

**Usage in API:**
```typescript
const result = await client.rpc('equip_item', {
  p_player_id: player.id,
  p_hero_id: body.heroId,
  p_equipment_id: equipmentId,
  p_slot: body.slot
})
```

## Installation

To install these functions in your Supabase database:

### Option 1: Supabase Dashboard
1. Go to SQL Editor in Supabase Dashboard
2. Copy the contents of the SQL file
3. Execute the SQL

### Option 2: Supabase CLI
```bash
# Apply migration
supabase db push

# Or run specific file
supabase db execute -f docs/database-functions/equip_item.sql
```

### Option 3: Migration File
Create a new migration file:
```bash
supabase migration new add_equip_item_function
```

Then copy the SQL content into the migration file and apply:
```bash
supabase db push
```

## Testing Functions

Test functions directly in the SQL Editor:

```sql
-- Test equip_item
SELECT * FROM equip_item(
  'player-uuid'::UUID,
  'hero-uuid'::UUID,
  'equipment-uuid'::UUID,
  'weapon'
);
```

## Rollback

To remove a function:
```sql
DROP FUNCTION IF EXISTS equip_item(UUID, UUID, UUID, TEXT);
```

## Security

All functions use `SECURITY DEFINER` to run with the permissions of the function owner, but are granted only to `authenticated` users. Always validate player ownership within the function.
