# Fix RLS Infinite Recursion Error

## Problem
You're seeing this error:
```
'infinite recursion detected in policy for relation "group_members"'
```

This happens because the RLS policy on `group_members` checks `group_members` itself, creating an infinite loop.

## Solution

### Option 1: Fix the RLS Policies (Recommended)

1. Open your Supabase Dashboard
2. Go to SQL Editor
3. Run the SQL from `fix-rls-policies.sql` file

This will:
- Remove the recursive policy
- Create a new policy that checks group visibility instead of membership recursively
- Fix the INSERT policy as well

### Option 2: Temporarily Disable RLS (For Testing Only)

If you need a quick fix for testing, you can temporarily disable RLS on `group_members`:

```sql
ALTER TABLE public.group_members DISABLE ROW LEVEL SECURITY;
```

**Warning:** This is less secure and should only be used for development/testing.

### Option 3: Use Service Role Key (Not Recommended)

You could use the service role key in your app, but this bypasses all security and is NOT recommended for production.

## After Fixing

1. Refresh your application
2. The error should stop appearing
3. Memory detail pages should load correctly

## What Caused This?

The original policy was:
```sql
CREATE POLICY "Group members can view members" ON public.group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm  -- This checks group_members to see if you can view group_members!
      WHERE gm.group_id = group_members.group_id
      AND gm.user_id = auth.uid()
    )
  );
```

This creates infinite recursion because:
- To check if you can view `group_members`, it checks `group_members`
- Which checks if you can view `group_members`
- Which checks `group_members` again...
- And so on forever!

The fix checks the `groups` table's `is_public` status instead, which doesn't cause recursion.
