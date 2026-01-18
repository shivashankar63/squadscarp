# Sample Data Guide

## ✅ Sample Data Created

I've created comprehensive sample data for your application with images, profile pictures, and all properties filled in.

### 📁 Files Created

- `src/lib/sample-data.ts` - Contains all sample data

### 📊 Sample Data Includes

#### 1. **Sample Memories** (9 memories)
Each memory includes:
- ✅ Title
- ✅ Description
- ✅ Category (Travel, Celebration, Adventure, Family, Milestone, Love, Nature, Urban)
- ✅ Date
- ✅ Location
- ✅ Story (detailed description)
- ✅ Notes
- ✅ Tags (array)
- ✅ Mood
- ✅ Source
- ✅ Highlights
- ✅ Image URL (high-quality Unsplash images)
- ✅ Likes count

#### 2. **Sample Groups** (5 groups)
Each group includes:
- ✅ Name
- ✅ Description
- ✅ Image URL
- ✅ Public/Private status
- ✅ Category
- ✅ Members count
- ✅ Memories count

#### 3. **Sample Users** (5 users)
Each user includes:
- ✅ Name
- ✅ Email
- ✅ Avatar URL (profile pictures)

### 🎨 Images Used

All images are from Unsplash and include:
- Beach scenes
- Birthday parties
- Hiking adventures
- Family gatherings
- Graduation ceremonies
- Wedding anniversaries
- Mountain sunsets
- City lights
- Group photos

### 🔧 How to Use Sample Data

#### Option 1: Seed Database (Recommended)
Run this in your browser console or create a button:

```javascript
import { seedSampleData } from './lib/database'
await seedSampleData()
```

#### Option 2: Use in Components
Import and use directly:

```typescript
import { sampleMemories, sampleGroups, sampleUsers } from './lib/sample-data'
```

### 📝 Sample Data Properties

**Memories:**
- Categories: Travel, Celebration, Adventure, Family, Milestone, Love, Nature, Urban
- Locations: Miami, New York, Yosemite, Chicago, Boston, Paris, Aspen, San Francisco, Malibu
- Moods: Happy, Excited, Accomplished, Grateful, Proud, Romantic, Peaceful, Inspired, Relaxed
- Tags: Multiple relevant tags per memory

**Groups:**
- Squad Scrapbook (friends, 12 members, 145 memories)
- College Friends (education, 8 members, 89 memories)
- Family Moments (family, 15 members, 234 memories)
- Travel Buddies (travel, 6 members, 67 memories)
- Childhood Friends (friends, 5 members, 123 memories)

**Users:**
- Emily Johnson (with profile picture)
- Michael Smith (with profile picture)
- Sarah Lee (with profile picture)
- David Brown (with profile picture)
- Alex Johnson (with profile picture)

### ✨ Features

- ✅ All properties filled
- ✅ Realistic data
- ✅ High-quality images
- ✅ Profile pictures
- ✅ Diverse categories
- ✅ Rich descriptions
- ✅ Proper formatting

### 🚀 Next Steps

1. **Seed the database** with sample data
2. **Test all features** with real-looking data
3. **Customize** the sample data to match your needs
4. **Add more** sample data as needed

All sample data is ready to use! 🎉
