# Database Setup Guide

## ✅ What's Been Set Up

1. **Supabase Client** - `src/lib/supabase.ts`
   - Connected to your project: `https://mjaegejcflpwjubuoqtv.supabase.co`
   - Uses your publishable key for client-side operations

2. **Database Service Layer** - `src/lib/database.ts`
   - Functions for CRUD operations on memories, groups, users
   - File upload/download functions for images and videos
   - Authentication functions

3. **Database Schema** - `database-schema.sql`
   - Complete SQL schema with tables, indexes, and security policies
   - Ready to run in Supabase SQL Editor

4. **Environment Variables** - `.env`
   - Your Supabase credentials are configured

## 🚀 Next Steps

### Step 1: Create Storage Bucket in Supabase

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Storage** → **New bucket**
4. Name: `media`
5. Make it **Public**
6. Click **Create**

### Step 2: Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Open `database-schema.sql` file
3. Copy all SQL code
4. Paste into SQL Editor
5. Click **Run**

This creates:
- `users` table
- `groups` table  
- `memories` table
- `group_members` table
- `favorites` table
- `starred_memories` table
- All indexes and security policies

### Step 3: Set Up Storage Policies

Run this in SQL Editor:

```sql
-- Allow public read access
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'media');

-- Allow authenticated uploads
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'media' 
  AND auth.role() = 'authenticated'
);

-- Allow users to update/delete their uploads
CREATE POLICY "Users can manage own uploads" ON storage.objects
FOR ALL USING (
  bucket_id = 'media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Step 4: Test the Connection

1. Run `npm run dev`
2. The app will automatically connect to Supabase
3. Try creating a memory with an image upload

## 📁 File Structure

```
src/
  lib/
    supabase.ts      # Supabase client configuration
    database.ts      # Database service functions
```

## 🔐 Security Notes

- The `.env` file is in `.gitignore` (won't be committed)
- Row Level Security (RLS) is enabled on all tables
- Only authenticated users can upload files
- Public groups are viewable by everyone
- Private groups are only accessible to members

## 📊 Database Functions Available

### Memories
- `getMemories(groupId?)` - Get all memories or by group
- `getMemoryById(id)` - Get single memory
- `createMemory(memory)` - Create new memory
- `updateMemory(id, updates)` - Update memory
- `deleteMemory(id)` - Delete memory
- `likeMemory(id)` - Increment likes

### Groups
- `getGroups(isPublic?)` - Get all groups or public only
- `getGroupById(id)` - Get single group
- `searchGroups(query)` - Search groups by name
- `createGroup(group)` - Create new group
- `updateGroup(id, updates)` - Update group

### Files
- `uploadFile(file, folder, fileName?)` - Upload single file
- `uploadMultipleFiles(files, folder)` - Upload multiple files
- `deleteFile(filePath)` - Delete file from storage

### Users
- `getCurrentUser()` - Get authenticated user
- `signUp(email, password, name?)` - Register new user
- `signIn(email, password)` - Sign in
- `signOut()` - Sign out

## 🎯 Integration Status

✅ Supabase client installed and configured
✅ Database service layer created
✅ File upload functions ready
✅ Schema SQL prepared
✅ Environment variables set

⏳ Next: Run SQL schema in Supabase Dashboard
⏳ Next: Create storage bucket
⏳ Next: Test file uploads
