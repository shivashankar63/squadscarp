# Supabase Setup Instructions

## Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Name: `media`
5. Make it **Public** (for images/videos to be accessible)
6. Click **Create bucket**

## Step 2: Set Up Database Schema

1. Go to **SQL Editor** in your Supabase Dashboard
2. Copy the contents of `database-schema.sql`
3. Paste and run it in the SQL Editor
4. This will create all necessary tables, indexes, and security policies

## Step 3: Configure Storage Policies

Run this SQL in the SQL Editor to allow public read access to media:

```sql
-- Allow public read access to media bucket
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'media');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'media' 
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own uploads
CREATE POLICY "Users can update own uploads" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own uploads" ON storage.objects
FOR DELETE USING (
  bucket_id = 'media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## Step 4: Environment Variables

The `.env` file has been created with your credentials:
- `VITE_SUPABASE_URL`: Your project URL
- `VITE_SUPABASE_ANON_KEY`: Your publishable key

**Important**: Never commit the `.env` file to git (it's already in `.gitignore`)

## Step 5: Test the Connection

The app is now configured to use Supabase. You can test by:
1. Running `npm run dev`
2. The app will automatically connect to your Supabase project
3. Try uploading a memory with an image

## Database Tables Created

- **users**: User profiles
- **groups**: Scrapbook groups
- **group_members**: Group membership and roles
- **memories**: Memory entries with images/videos
- **favorites**: User's favorite memories
- **starred_memories**: User's starred memories

## File Storage

- Images and videos are stored in the `media` bucket
- Files are organized by folder (e.g., `memories/`, `groups/`)
- Public URLs are generated automatically

## Security

- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data or public groups
- File uploads are restricted to authenticated users
