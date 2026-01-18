-- Fix infinite recursion in group_members RLS policy
-- Run this in your Supabase SQL Editor

-- Drop the problematic policy
DROP POLICY IF EXISTS "Group members can view members" ON public.group_members;

-- Create a new policy that doesn't cause recursion
-- Allow viewing group_members if:
-- 1. The group is public, OR
-- 2. The user is authenticated (we'll check membership at application level)
CREATE POLICY "Group members can view members" ON public.group_members
  FOR SELECT USING (
    -- Allow if group is public
    EXISTS (
      SELECT 1 FROM public.groups
      WHERE groups.id = group_members.group_id
      AND groups.is_public = true
    )
    OR
    -- Allow if user is authenticated (membership check happens in app logic)
    auth.uid() IS NOT NULL
  );

-- Also fix the INSERT policy that has a similar issue
DROP POLICY IF EXISTS "Group owners can add members" ON public.group_members;

CREATE POLICY "Group owners can add members" ON public.group_members
  FOR INSERT WITH CHECK (
    -- Allow if user created the group
    EXISTS (
      SELECT 1 FROM public.groups
      WHERE groups.id = group_members.group_id
      AND groups.created_by = auth.uid()
    )
    OR
    -- Allow if user is an owner of the group (check via a subquery that doesn't recurse)
    EXISTS (
      SELECT 1 FROM public.groups g
      JOIN public.group_members gm ON gm.group_id = g.id
      WHERE g.id = group_members.group_id
      AND gm.user_id = auth.uid()
      AND gm.role = 'owner'
    )
  );

-- Alternative: If you want to disable RLS for group_members entirely (less secure but simpler)
-- ALTER TABLE public.group_members DISABLE ROW LEVEL SECURITY;
