import React, { useState } from 'react'
import {
  Home,
  Users,
  Camera,
  Pen,
  Image,
  MessagesSquare,
  BarChart3,
  Sparkles,
  HelpCircle,
  LogOut,
  Search,
  Plus,
  Video,
  MapPin,
  Smile,
  MoreHorizontal,
  Star,
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  Lightbulb,
  Gift,
  Edit3,
  BookOpen,
  Calendar,
  Clock,
  Award,
  X,
  Settings,
  Maximize2,
  TrendingUp,
  UserPlus,
  Bell,
  ChevronDown,
  Edit2,
  ArrowLeft,
} from 'lucide-react'

type Page =
  | 'landing'
  | 'home'
  | 'discover'
  | 'create'
  | 'profile'
  | 'settings'
  | 'years'
  | 'editMemories'
  | 'memoryFeed'
  | 'notesStickers'
  | 'lifePath'
  | 'reflections'
  | 'memoryLane'
  | 'captureMoments'
  | 'creativeMemories'
  | 'scrapbookShowcase'
  | 'memoryMoments'
  | 'craftStory'
  | 'share'
  | 'calendar'
  | 'favorites'
  | 'starred'

// Persistent Navigation Sidebar Component
function PersistentNavSidebar({
  currentPage,
  onNavigate,
}: {
  currentPage: Page
  onNavigate: (page: Page) => void
}) {
  // Only show items in persistent sidebar that are NOT accessible from home page
  // Home page has: Create, Edit Memories, Collaborators, Memory Feed, Notes & Stickers, 
  // Life-Path, Reflections, Year 1 vs Year 4, Memory Lane, Capture Moments, Creative Memories,
  // Scrapbook Showcase, Memory Moments, Craft Story
  // So persistent sidebar should only have: Home, Share, Calendar, Favorites, Starred, Settings
  const navItems = [
    { icon: Home, page: 'home' as Page, label: 'Home' },
    { icon: Share2, page: 'share' as Page, label: 'Share' },
    { icon: Calendar, page: 'calendar' as Page, label: 'Calendar' },
    { icon: Heart, page: 'favorites' as Page, label: 'Favorites' },
    { icon: Star, page: 'starred' as Page, label: 'Starred' },
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-4 z-50 overflow-y-auto">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = currentPage === item.page
        return (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
              isActive
                ? 'bg-pink-400 text-white'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            title={item.label}
          >
            <Icon className="w-5 h-5" />
          </button>
        )
      })}
      <div className="flex-1"></div>
      <button
        onClick={() => onNavigate('settings')}
        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
          currentPage === 'settings'
            ? 'bg-pink-400 text-white'
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
        }`}
        title="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>
      <button
        className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
        title="Log Out"
      >
        <LogOut className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  )
}

function ScrapbookLanding({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Right side abstract graphic area - grouped shapes cluster */}
      <div className="absolute right-0 top-0 bottom-0 w-2/3 pointer-events-none flex items-center justify-center">
        <div className="relative w-full h-full max-w-2xl max-h-2xl">
          {/* Central cluster of large circles - grouped together */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {/* Large circles - overlapping cluster */}
            <div className="absolute -top-20 -left-16 w-48 h-48 bg-pink-300 rounded-full opacity-50 border-2 border-white/40 shadow-xl" style={{ animation: 'float 6s ease-in-out infinite' }}></div>
            <div className="absolute -top-8 -left-8 w-44 h-44 bg-orange-300 rounded-full opacity-45 border-2 border-white/40 shadow-xl" style={{ animation: 'float 5s ease-in-out infinite 1s' }}></div>
            <div className="absolute top-4 left-4 w-52 h-52 bg-yellow-300 rounded-full opacity-40 border-2 border-white/40 shadow-xl" style={{ animation: 'float 7s ease-in-out infinite 0.5s' }}></div>
            <div className="absolute top-16 -left-12 w-40 h-40 bg-blue-300 rounded-full opacity-35 border-2 border-white/40 shadow-xl" style={{ animation: 'float 6.5s ease-in-out infinite 1.5s' }}></div>
            <div className="absolute -top-12 left-8 w-36 h-36 bg-purple-300 rounded-full opacity-40 border-2 border-white/40 shadow-xl" style={{ animation: 'float 5.5s ease-in-out infinite 0.8s' }}></div>
            
            {/* Hexagons and octagons - grouped around circles */}
            <div className="absolute -top-12 -left-24 w-32 h-32 bg-pink-400 opacity-40" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', animation: 'float 5.5s ease-in-out infinite 1.5s', border: '2px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}></div>
            <div className="absolute top-8 -left-20 w-28 h-28 bg-orange-400 opacity-45" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)', animation: 'float 6.5s ease-in-out infinite', border: '2px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}></div>
            <div className="absolute top-24 left-12 w-24 h-24 bg-pink-300 opacity-38" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', animation: 'float 4.5s ease-in-out infinite 2s', border: '2px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}></div>
            <div className="absolute -top-4 left-20 w-26 h-26 bg-yellow-400 opacity-35" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', animation: 'float 5.8s ease-in-out infinite 1s', border: '2px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}></div>
            
            {/* Triangles - scattered around cluster */}
            <div className="absolute -top-28 -left-12 w-0 h-0 opacity-40" style={{ borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderBottom: '24px solid #f472b6', animation: 'float 4s ease-in-out infinite', transform: 'rotate(45deg)' }}></div>
            <div className="absolute -top-8 left-16 w-0 h-0 opacity-45" style={{ borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: '20px solid #fb923c', animation: 'float 5s ease-in-out infinite 1s', transform: 'rotate(-30deg)' }}></div>
            <div className="absolute top-12 -left-8 w-0 h-0 opacity-35" style={{ borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '18px solid #facc15', animation: 'float 6s ease-in-out infinite 0.5s', transform: 'rotate(60deg)' }}></div>
            <div className="absolute top-28 left-20 w-0 h-0 opacity-40" style={{ borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderBottom: '28px solid #f9a8d4', animation: 'float 4.5s ease-in-out infinite 1.5s', transform: 'rotate(-45deg)' }}></div>
            <div className="absolute -top-16 left-24 w-0 h-0 opacity-38" style={{ borderLeft: '11px solid transparent', borderRight: '11px solid transparent', borderBottom: '19px solid #a78bfa', animation: 'float 5.2s ease-in-out infinite 0.9s', transform: 'rotate(30deg)' }}></div>
            
            {/* Rectangles - grouped around cluster */}
            <div className="absolute -top-24 left-4 w-20 h-14 bg-orange-300 opacity-40 rotate-12" style={{ animation: 'float 5.5s ease-in-out infinite', border: '2px solid rgba(255,255,255,0.4)', boxShadow: '0 3px 6px rgba(0,0,0,0.12)' }}></div>
            <div className="absolute top-4 -left-16 w-14 h-18 bg-pink-300 opacity-45 -rotate-6" style={{ animation: 'float 6s ease-in-out infinite 1s', border: '2px solid rgba(255,255,255,0.4)', boxShadow: '0 3px 6px rgba(0,0,0,0.12)' }}></div>
            <div className="absolute top-20 left-24 w-16 h-12 bg-yellow-300 opacity-35 rotate-45" style={{ animation: 'float 4.5s ease-in-out infinite 0.5s', border: '2px solid rgba(255,255,255,0.4)', boxShadow: '0 3px 6px rgba(0,0,0,0.12)' }}></div>
            <div className="absolute -top-8 -left-28 w-18 h-13 bg-purple-300 opacity-38 -rotate-18" style={{ animation: 'float 5.8s ease-in-out infinite 0.6s', border: '2px solid rgba(255,255,255,0.4)', boxShadow: '0 3px 6px rgba(0,0,0,0.12)' }}></div>
            
            {/* Small circles - accent around cluster */}
            <div className="absolute -top-28 left-0 w-20 h-20 bg-orange-400 rounded-full opacity-40 border-2 border-white/50" style={{ animation: 'float 4s ease-in-out infinite' }}></div>
            <div className="absolute -top-4 -left-20 w-16 h-16 bg-pink-400 rounded-full opacity-45 border-2 border-white/50" style={{ animation: 'float 5s ease-in-out infinite 1s' }}></div>
            <div className="absolute top-16 left-16 w-22 h-22 bg-yellow-400 rounded-full opacity-35 border-2 border-white/50" style={{ animation: 'float 6s ease-in-out infinite 0.5s' }}></div>
            <div className="absolute top-32 -left-4 w-18 h-18 bg-pink-300 rounded-full opacity-40 border-2 border-white/50" style={{ animation: 'float 4.5s ease-in-out infinite 1.5s' }}></div>
            <div className="absolute -top-16 left-28 w-14 h-14 bg-purple-300 rounded-full opacity-38 border-2 border-white/50" style={{ animation: 'float 5.3s ease-in-out infinite 0.8s' }}></div>
            
            {/* Medium circles - fill gaps */}
            <div className="absolute top-0 -left-32 w-28 h-28 bg-pink-200 rounded-full opacity-35 border border-white/40" style={{ animation: 'float 5.4s ease-in-out infinite 0.9s' }}></div>
            <div className="absolute top-36 left-32 w-24 h-24 bg-orange-200 rounded-full opacity-32 border border-white/40" style={{ animation: 'float 6.4s ease-in-out infinite 1.4s' }}></div>
            <div className="absolute -top-20 left-32 w-24 h-24 bg-yellow-200 rounded-full opacity-30 border border-white/40" style={{ animation: 'float 4.8s ease-in-out infinite 0.6s' }}></div>
            
            {/* Subtle layered paper effect - soft shadows */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-pink-200 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute top-8 left-8 w-56 h-56 bg-orange-200 rounded-full opacity-18 blur-2xl"></div>
            <div className="absolute top-16 left-16 w-60 h-60 bg-yellow-200 rounded-full opacity-15 blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-20">
          <div className="w-10 h-8 bg-pink-400 rounded-lg flex items-center justify-center shadow-md">
            <Edit3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg text-gray-600 font-light">SquadScrapbook</span>
        </div>

        {/* Hero section */}
        <div className="max-w-xl">
          <h1 className="text-6xl font-light text-gray-700 mb-8 leading-tight">Capture your</h1>

          <p className="text-gray-600 text-lg mb-10 leading-relaxed">
            Collaborate to create a scrapbook of memories, showcase your group's unique story.
          </p>

          <button
            className="bg-pink-400 text-white px-10 py-4 rounded-full text-lg font-light hover:bg-pink-500 transition-colors shadow-md"
            onClick={onStart}
          >
            Join now
          </button>
        </div>
      </div>

      {/* Upgrade button - positioned top right */}
      <button className="absolute top-8 right-8 bg-white px-6 py-2 rounded-lg text-xs font-medium text-gray-700 shadow-md hover:shadow-lg transition-shadow z-20">
        UPGRADE PLAN
      </button>
    </div>
  )
}

function ScrapbookHomeContent({
  onDiscover,
  onCreate,
  onProfile,
  onYears,
  onSettings,
  onEditMemories,
  onMemoryFeed,
  onNotesStickers,
  onLifePath,
  onReflections,
  onMemoryLane,
  onCaptureMoments,
  onCreativeMemories,
  onScrapbookShowcase,
  onMemoryMoments,
  onCraftStory,
}: {
  onDiscover: () => void
  onCreate: () => void
  onProfile: () => void
  onYears: () => void
  onSettings: () => void
  onEditMemories: () => void
  onMemoryFeed: () => void
  onNotesStickers: () => void
  onLifePath: () => void
  onReflections: () => void
  onMemoryLane: () => void
  onCaptureMoments: () => void
  onCreativeMemories: () => void
  onScrapbookShowcase: () => void
  onMemoryMoments: () => void
  onCraftStory: () => void
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Welcome to</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-900 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            <Home className="w-5 h-5" />
            Your Scrapbook
          </button>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={onCreate}
          >
            <Camera className="w-5 h-5" />
            Create Memories
          </button>

          <div className="pt-6 pb-2">
            <h3 className="text-xs font-bold text-gray-900 uppercase px-4 mb-2">Highlights</h3>
            <button
              onClick={onEditMemories}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Pen className="w-4 h-4" />
              <span className="text-sm">Edit Memories</span>
            </button>
            <button
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={onProfile}
            >
              <Users className="w-4 h-4" />
              <span className="text-sm">Collaborators</span>
            </button>
            <button
              onClick={onMemoryFeed}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Image className="w-4 h-4" />
              <span className="text-sm">Memory Feed</span>
            </button>
            <button
              onClick={onNotesStickers}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <MessagesSquare className="w-4 h-4" />
              <span className="text-sm">Notes & Stickers</span>
            </button>
            <button
              onClick={onLifePath}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm">Life-Path</span>
            </button>
            <button
              onClick={onReflections}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">Reflections</span>
            </button>
          </div>

          <div className="pt-4 pb-2">
            <h3 className="text-xs font-bold text-gray-900 uppercase px-4 mb-2">Milestones</h3>
            <button
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={onYears}
            >
              <div className="w-4 h-4 bg-gradient-to-br from-orange-400 to-red-400 rounded"></div>
              <span className="text-sm">Year 1 vs Year 4</span>
            </button>
            <button
              onClick={onMemoryLane}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-4 h-4 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full"></div>
              <span className="text-sm">Memory Lane</span>
            </button>
            <button
              onClick={onCaptureMoments}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-4 h-4 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full"></div>
              <span className="text-sm">Capture Moments</span>
            </button>
            <button
              onClick={onCreativeMemories}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-4 h-4 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full"></div>
              <span className="text-sm">Creative Memories</span>
            </button>
          </div>
        </nav>

        <div className="border-t border-gray-200 p-4 space-y-1">
          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={onSettings}
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm">Support & Tips</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Memories..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center text-white hover:bg-red-600 transition-colors"
              onClick={onYears}
              aria-label="Open years view"
            >
              <Video className="w-4 h-4" />
            </button>
            <button
              className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center text-white hover:bg-red-600 transition-colors"
              onClick={onCreate}
              aria-label="Create memory"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              className="w-9 h-9 bg-pink-300 rounded-lg flex items-center justify-center text-white hover:bg-pink-400 transition-colors"
              onClick={onDiscover}
              aria-label="Open discover page"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              className="flex items-center gap-2 ml-2 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={onProfile}
            >
              <span className="text-sm font-medium text-gray-700">Group</span>
              <div className="w-7 h-7 bg-gray-400 rounded-full"></div>
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="col-span-2 space-y-4">
            {/* Create Post */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
                <input
                  type="text"
                  placeholder="What memories do you want to share?"
                  className="flex-1 px-4 py-2.5 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm border border-gray-200"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Image className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Smile className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm transition-colors">
                  Share
                </button>
              </div>
            </div>

            {/* Post 1 - with image */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">Team is excited to share!</h3>
                      <p className="text-xs text-gray-500">Just now</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-800 mb-4 text-sm leading-relaxed">
                  Our group just created a beautiful scrapbook showcasing our adventures over the
                  years. Can't wait to add more memories together.
                </p>
              </div>
              <div className="relative bg-gradient-to-br from-amber-900 via-stone-800 to-neutral-900 h-72">
                <div className="absolute inset-0 flex items-center justify-center gap-4 p-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-32 h-40 border border-white/20"></div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-32 h-40 border border-white/20"></div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-32 h-40 border border-white/20"></div>
                </div>
              </div>
              <div className="p-5 flex items-center justify-between border-t border-gray-100">
                <button className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">Like</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                  <span className="text-sm font-medium">Share</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors">
                  <Video className="w-4 h-4" />
                  <span className="text-sm font-medium">Add to</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">3</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-purple-500 transition-colors">
                  <Bookmark className="w-4 h-4" />
                  <span className="text-sm font-medium">Save</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">3</span>
                </button>
              </div>
            </div>

            {/* Post 2 - Stickers */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">New stickers available!</h3>
                    <p className="text-xs text-gray-500">Tuesday, 16 August 3:00 AM</p>
                  </div>
                </div>
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
              <p className="text-gray-800 mb-4 text-sm">What memories should we add next?</p>
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="aspect-square bg-gradient-to-br from-yellow-200 to-amber-300 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-8 h-8 text-yellow-700" />
                </div>
                <div className="aspect-square bg-gradient-to-br from-pink-200 to-rose-300 rounded-xl flex items-center justify-center">
                  <Heart className="w-8 h-8 text-pink-700" fill="currentColor" />
                </div>
                <div className="aspect-square bg-gradient-to-br from-red-300 via-orange-300 via-yellow-300 via-green-300 via-blue-300 to-purple-300 rounded-xl"></div>
                <div className="aspect-square bg-gradient-to-br from-blue-200 to-indigo-300 rounded-xl flex items-center justify-center">
                  <Camera className="w-8 h-8 text-blue-700" />
                </div>
                <div className="aspect-square bg-gradient-to-br from-purple-200 to-pink-300 rounded-xl flex items-center justify-center">
                  <Gift className="w-8 h-8 text-purple-700" />
                </div>
              </div>
              <div className="flex items-center gap-6 text-xs text-gray-600 pt-3 border-t border-gray-100">
                <button className="flex items-center gap-1.5 hover:text-pink-500">
                  <Heart className="w-3.5 h-3.5" /> Like · <span className="font-medium">12</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-blue-500">
                  <MessageCircle className="w-3.5 h-3.5" /> Comment · <span className="font-medium">4</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-green-500">
                  <Share2 className="w-3.5 h-3.5" /> Share · <span className="font-medium">1</span>
                </button>
              </div>
            </div>

            {/* Post 3 - Alex Johnson */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Alex Johnson</h3>
                    <p className="text-xs text-gray-500">Monday, 15 August 3:00 PM</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-800 mb-4 text-sm leading-relaxed">
                I can't wait to see everyone's photos from the trip! Let's make this scrapbook
                amazing together.
              </p>
              <div className="flex items-center gap-6 text-xs text-gray-600 pt-3 border-t border-gray-100">
                <button className="flex items-center gap-1.5 hover:text-pink-500">
                  <Heart className="w-3.5 h-3.5" /> Like · <span className="font-medium">20</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-blue-500">
                  <MessageCircle className="w-3.5 h-3.5" /> Comment · <span className="font-medium">5</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-green-500">
                  <Share2 className="w-3.5 h-3.5" /> Share · <span className="font-medium">0</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Your Scrapbook */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Your scrapbook</h3>
              <div className="space-y-2">
                {[
                  {
                    icon: '📚',
                    title: 'Scrapbook Showcase',
                    subtitle: 'See your memories unfold',
                    color: 'from-pink-100 to-rose-100',
                    onClick: onScrapbookShowcase,
                  },
                  {
                    icon: '📅',
                    title: 'Year 1 vs Year 4',
                    subtitle: 'Time changes everything',
                    color: 'from-blue-100 to-cyan-100',
                    onClick: onYears,
                  },
                  {
                    icon: '📸',
                    title: 'Memory Moments',
                    subtitle: 'Capture the essence',
                    color: 'from-purple-100 to-pink-100',
                    onClick: onMemoryMoments,
                  },
                  {
                    icon: '✏️',
                    title: 'Craft your story',
                    subtitle: 'Unleash your creativity',
                    color: 'from-orange-100 to-amber-100',
                    onClick: onCraftStory,
                  },
                  {
                    icon: '🛤️',
                    title: 'Life-Path Journey',
                    subtitle: 'Trace your memories',
                    color: 'from-green-100 to-emerald-100',
                    onClick: onLifePath,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    onClick={item.onClick}
                    className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                  >
                    <div
                      className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-lg`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Join the Conversation */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Join the Conversation</h3>
              <div className="space-y-2">
                {[
                  { name: 'Memory Makers', color: 'from-pink-400 to-rose-500' },
                  { name: 'Travel Adventures', color: 'from-blue-400 to-cyan-500' },
                  { name: 'Shared', color: 'from-orange-400 to-amber-500' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-full`}></div>
                    <span className="text-sm text-gray-800 font-medium">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Memory Groups */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Memory Groups</h3>
              <div className="space-y-2">
                {[
                  { name: 'Create your', color: 'from-green-400 to-emerald-500' },
                  { name: 'Capture your', color: 'from-purple-400 to-pink-500' },
                  { name: 'Share your', color: 'from-yellow-400 to-orange-500' },
                  { name: 'Collaborative', color: 'from-indigo-400 to-purple-500' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-full`}></div>
                    <span className="text-sm text-gray-800 font-medium">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Group Memories */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Group Memories</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900">Year 1 vs Year 4</p>
                      <p className="text-xs text-gray-500">Creative Journey</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700">Share your favorite</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900">Memory Lane</p>
                      <p className="text-xs text-gray-500">Walk Through Memories</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700">Reflect on past adventures</p>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Upcoming Events</h3>
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-3 border border-pink-100">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Photo Challenge</p>
                  <p className="text-xs text-gray-600">Capture this week's</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-gray-900 mb-1.5">Next Week</p>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Collaboration Station</p>
                  <p className="text-xs text-gray-600">Work together on the</p>
                </div>
              </div>
            </div>

            {/* Upcoming Memories - Calendar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Upcoming Memories</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-center text-xs font-bold text-gray-600">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(31)].map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square flex items-center justify-center text-xs rounded ${
                        i === 3 || i === 19 ? 'bg-pink-500 text-white font-bold' : 'text-gray-700'
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Plan your next adventure!</p>
                  <p className="text-xs text-gray-500">Join us for a fun-filled day!</p>
                </div>
              </div>
            </div>

            {/* Explore Timeline */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Explore your timeline</h3>
              <div className="space-y-2">
                {[
                  'Team Adventures',
                  'Memory Makers',
                  'Shared',
                  'Creative Souls',
                  'Memory Lane',
                  'Yearly Highlights',
                  'Past and Present',
                  'Time Capsule',
                  'Storytellers Unite',
                  'Creative',
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DiscoverPage({
  onHome,
  onCreate,
  onProfile,
  onMemoryFeed,
  onDiscover,
  onLifePath,
  onShare,
  onCapture,
  onCalendar,
  onFavorites,
  onStarred,
}: {
  onHome: () => void
  onCreate: () => void
  onProfile: () => void
  onMemoryFeed: () => void
  onDiscover: () => void
  onLifePath: () => void
  onShare: () => void
  onCapture: () => void
  onCalendar: () => void
  onFavorites: () => void
  onStarred: () => void
}) {
  void onHome
  void onCreate
  void onProfile
  void onMemoryFeed
  void onDiscover
  void onLifePath
  void onShare
  void onCapture
  void onCalendar
  void onFavorites
  void onStarred
  const [selectedProject, setSelectedProject] = useState(0)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const projects = [
    {
      id: 1,
      title: 'Creating Lasting Memories',
      subtitle: 'Team Adventure',
      progress: 75,
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=400&fit=crop',
      team: 'Team',
      duration: '3h',
      rating: 4.9,
      description:
        'This collaborative course helps you craft a beautiful scrapbook, blending creativity and shared experiences.',
    },
    {
      id: 2,
      title: 'Memory Lane',
      subtitle: 'Creative Group',
      progress: 50,
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop',
      team: 'Team',
      duration: '2h',
      rating: 4.8,
      description: 'Walk down memory lane with your creative group and preserve special moments.',
    },
    {
      id: 3,
      title: 'Year 1 vs Year 4',
      subtitle: 'Team Spirit',
      progress: 30,
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=400&fit=crop',
      team: 'Team',
      duration: '4h',
      rating: 4.7,
      description: 'Compare and celebrate your journey from year 1 to year 4.',
    },
    {
      id: 4,
      title: 'Capture Every Moment',
      subtitle: 'Creative Collaboration',
      progress: 50,
      image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=400&fit=crop',
      team: 'Team',
      duration: '3h',
      rating: 4.9,
      description: 'A creative collaboration to capture and preserve every special moment.',
    },
  ]

  const currentProject = projects[selectedProject]

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Upgrade Modal Overlay */}
      {showUpgradeModal && (
        <div className="absolute inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl relative">
            {/* Close button */}
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              aria-label="Close upgrade modal"
            >
              ×
            </button>

            {/* Floating decorative bubbles */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-pink-200 rounded-full opacity-40"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-200 rounded-full opacity-30"></div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-300 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-2xl font-light text-gray-700 mb-2">Upgrade to Pro</h2>
              <p className="text-gray-400 mb-6">
                Unlock unlimited memories and premium features
              </p>

              <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
                  <span className="text-gray-600 text-sm">Unlimited scrapbooks</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
                  <span className="text-gray-600 text-sm">Advanced editing tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
                  <span className="text-gray-600 text-sm">Collaborative features</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
                  <span className="text-gray-600 text-sm">Priority support</span>
                </div>
              </div>

              <button className="w-full bg-pink-300 text-white py-3 rounded-full font-light text-lg hover:bg-pink-400 transition-colors shadow-lg mb-3">
                Upgrade Now
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full text-gray-400 py-2 text-sm hover:text-gray-600 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Projects List */}
        <div className="w-2/5 bg-white p-8 overflow-y-auto max-h-screen">
          <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-light text-gray-700">Your Memories</h1>
            <button className="flex items-center gap-2 bg-pink-300 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-400 transition-colors flex-shrink-0">
              <Clock className="w-4 h-4" />
              Timeline
            </button>
          </div>

          <div className="space-y-4 pb-8">
            {projects.map((project, index) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(index)}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                  selectedProject === index ? 'bg-gray-50 shadow-md' : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-gray-700 font-light text-base">{project.title}</h3>
                      <p className="text-gray-600 text-sm">{project.subtitle}</p>
                    </div>
                    <BookOpen className="w-5 h-5 text-gray-500" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-pink-300 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-xs">{project.progress}% complete</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Detail - Right Side */}
        <div className="flex-1 bg-gray-50 relative">
          {/* Scrollable content preview */}
          <div className="h-screen overflow-y-auto">
            <div className="p-8 pt-20 pb-20">
              {/* Hero Image Area */}
              <div className="w-full h-80 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl mb-8 overflow-hidden relative">
                <img src={currentProject.image} alt={currentProject.title} className="w-full h-full object-cover" />
              </div>

              {/* Content Preview */}
              <h2 className="text-2xl font-light text-gray-700 mb-6">{currentProject.title}</h2>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-600 text-sm">{currentProject.team}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <Clock className="w-4 h-4" />
                  {currentProject.duration}
                </div>
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <Star className="w-4 h-4 fill-current text-yellow-400" />
                  {currentProject.rating}/5.0
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-light text-gray-700 mb-3">Course Overview</h3>
                <p className="text-gray-600 leading-relaxed">{currentProject.description}</p>
              </div>

              {/* Extra content to demonstrate scrolling */}
              <div className="mb-8">
                <h3 className="text-lg font-light text-gray-700 mb-3">What You'll Learn</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-300 rounded-full mt-2"></div>
                    <p className="text-gray-600 text-sm">
                      How to organize and curate your favorite memories
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-300 rounded-full mt-2"></div>
                    <p className="text-gray-600 text-sm">Creative techniques for scrapbook design</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-300 rounded-full mt-2"></div>
                    <p className="text-gray-600 text-sm">Collaboration tools for team projects</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-300 rounded-full mt-2"></div>
                    <p className="text-gray-600 text-sm">
                      Tips for preserving and sharing your scrapbook
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-white text-gray-600 py-3 rounded-full text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
                  Start Project
                </button>
                <button className="flex-1 bg-pink-300 text-white py-3 rounded-full text-sm font-medium hover:bg-pink-400 transition-colors">
                  View Gallery
                </button>
              </div>
            </div>
          </div>

          {/* Light dimmed overlay - now much more transparent */}
          <div className="absolute inset-0 bg-white bg-opacity-30 pointer-events-none z-10"></div>

          {/* Upgrade button - clickable */}
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="fixed top-8 right-8 bg-white px-6 py-2 rounded-lg text-xs font-medium text-gray-700 shadow-md hover:shadow-lg transition-shadow z-20 pointer-events-auto"
          >
            UPGRADE PLAN
          </button>
        </div>
      </div>
    </div>
  )
}

function CreateMemoryPage({
  onHome,
  onSettings,
}: {
  onHome: () => void
  onSettings: () => void
}) {
  void onHome
  void onSettings
  const [memoryType, setMemoryType] = useState('photos')
  const [showForm, setShowForm] = useState(true)

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Main Content */}
      <div className="flex-1 bg-white relative">
        {/* Top Bar */}
        <div className="absolute top-0 right-0 p-6 flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={onSettings}>
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Maximize2 className="w-5 h-5 text-gray-600" />
          </button>
          <div className="w-10 h-10 bg-gray-300 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Form Content */}
        {showForm && (
          <div className="max-w-4xl mx-auto p-12 pt-24 overflow-y-auto max-h-screen">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-light text-gray-900">Create new memory</h1>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Memory Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Memory type
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setMemoryType('photos')}
                      className={`flex items-center gap-2 ${
                        memoryType === 'photos' ? 'text-red-500' : 'text-gray-400'
                      }`}
                    >
                      <div className="w-2 h-2 bg-current rounded-full"></div>
                      <span className="text-sm">Photos</span>
                    </button>
                    <button
                      onClick={() => setMemoryType('notes')}
                      className={`flex items-center gap-2 ${
                        memoryType === 'notes' ? 'text-red-500' : 'text-gray-400'
                      }`}
                    >
                      <div className="w-2 h-2 bg-current rounded-full"></div>
                      <span className="text-sm">Notes</span>
                    </button>
                    <button
                      onClick={() => setMemoryType('stickers')}
                      className={`flex items-center gap-2 ${
                        memoryType === 'stickers' ? 'text-red-500' : 'text-gray-400'
                      }`}
                    >
                      <div className="w-2 h-2 bg-current rounded-full"></div>
                      <span className="text-sm">Stickers</span>
                    </button>
                  </div>
                </div>

                {/* Memory Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Memory title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Enter memory title"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Select category"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Add tags"
                  />
                </div>

                {/* Source */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Enter source"
                  />
                </div>

                {/* Mood */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Select mood"
                  />
                </div>

                {/* Story */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Story</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Tell your story..."
                  />
                </div>

                {/* Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-300 cursor-pointer transition-colors">
                    <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Memory details</h3>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="YYYY-MM-DD"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Enter location"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Add notes..."
                  />
                </div>

                {/* Additional Section */}
                <div className="pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Additional</h3>

                  {/* Highlights */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                      placeholder="Add highlights"
                    />
                  </div>

                  {/* Collaborators */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Collaborators
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                      placeholder="Add collaborators"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors">
                    Save memory
                  </button>
                  <button className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors">
                    Discard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ProfilePage({ onHome, onSettings }: { onHome: () => void; onSettings: () => void }) {
  const [activeTab] = useState('profile')
  void activeTab
  void onSettings

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">Profile</h1>

        <div className="bg-white rounded-3xl shadow-sm p-8 max-w-5xl">
          <div className="flex gap-8">
            {/* Left Column - Profile Info */}
            <div className="w-64 flex-shrink-0">
              {/* Profile Picture with grid overlay effect */}
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 mx-auto relative overflow-hidden">
                  {/* Grid pattern overlay to simulate the photo grid effect */}
                  <div className="absolute inset-0 grid grid-cols-3 gap-0.5 p-2">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="bg-white/40 rounded-sm"></div>
                    ))}
                  </div>
                  {/* Semi-transparent overlay to create the "premium lock" effect */}
                  <div className="absolute inset-0 bg-white/50"></div>
                </div>
              </div>

              {/* Profile Title */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Creative Collective</h2>
                <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Shared Memories
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-800">5</div>
                  <div className="text-xs text-gray-600">My</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-800">2</div>
                  <div className="text-xs text-gray-600">Contributors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-800">12</div>
                  <div className="text-xs text-gray-600">Active</div>
                </div>
              </div>

              {/* Memory Stats */}
              <div className="space-y-3 mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Memory Stats</h3>

                <div className="bg-pink-50 rounded-xl p-4 flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-pink-300" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-600">Photos added</div>
                    <div className="text-lg font-semibold text-gray-700">3</div>
                  </div>
                </div>

                <div className="bg-pink-50 rounded-xl p-4 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-pink-300" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-600">Hours spent</div>
                    <div className="text-lg font-semibold text-gray-700">120</div>
                  </div>
                </div>

                <div className="bg-pink-50 rounded-xl p-4 flex items-center gap-3 relative">
                  <Star className="w-5 h-5 text-pink-300" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-600">Milestones</div>
                    <div className="text-lg font-semibold text-gray-700">7</div>
                  </div>
                  <button className="absolute top-2 right-2 text-xs text-gray-600 bg-white px-2 py-0.5 rounded-full text-[10px] border border-gray-200">
                    UPGRADE PLAN
                  </button>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Highlights</h3>

                <div className="bg-pink-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-pink-300" />
                      <span className="text-sm text-gray-700">Memory Keeper</span>
                    </div>
                    <span className="text-xs text-gray-600">5/10</span>
                  </div>
                  <div className="text-xs text-gray-600">Capture 5 milestones</div>
                </div>

                <div className="bg-pink-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-pink-300" />
                      <span className="text-sm text-gray-700">Event Creator</span>
                    </div>
                    <span className="text-xs text-gray-600">3/5/25</span>
                  </div>
                  <div className="text-xs text-gray-600">Add 200 more photos</div>
                </div>
              </div>
            </div>

            {/* Right Column - Collaborators & Team */}
            <div className="flex-1">
              {/* Collaborators */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Collaborators</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <span className="text-sm text-gray-700">Emily Johnson</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors">
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                      <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                        <UserPlus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <span className="text-sm text-gray-700">Michael Smith</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors">
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                      <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                        <UserPlus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <button className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                    Explore
                  </button>
                </div>
              </div>

              {/* Team */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Team</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <span className="text-sm text-gray-700">Sarah Lee</span>
                    </div>
                    <button className="text-sm text-gray-600 hover:text-gray-800">View</button>
                  </div>

                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <span className="text-sm text-gray-700">David Brown</span>
                    </div>
                    <button className="text-sm text-gray-600 hover:text-gray-800">View</button>
                  </div>

                  <button className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                    +Invite AI
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-pink-300 text-white rounded-full hover:bg-pink-400 transition-colors font-medium">
                    Invite Team
                  </button>
                  <button className="flex-1 py-3 bg-pink-300 text-white rounded-full hover:bg-pink-400 transition-colors font-medium">
                    Share Memories
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsPage({ onHome }: { onHome: () => void }) {
  const [title, setTitle] = useState('Your Scrapbook')
  const [email, setEmail] = useState('')
  const [privacy, setPrivacy] = useState('public')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-700">Scrapbook Settings</h1>
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors">
              <Search className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-9 h-9 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-9 h-9 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors">
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="max-w-4xl">
          {/* Scrapbook Title Section */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                <button className="absolute -top-1 -right-1 w-7 h-7 bg-pink-400 rounded-full flex items-center justify-center shadow-sm">
                  <Edit2 className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-2">Title</div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg font-medium text-gray-700 bg-transparent border-none outline-none"
                  />
                  <button className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors">
                    <Edit2 className="w-4 h-4 text-pink-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Team Members Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-medium text-gray-700 mb-5">Team Members</h2>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                    <span className="text-sm text-gray-700">Alex Johnson</span>
                  </div>
                  <span className="text-xs text-gray-600">creator</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                    <span className="text-sm text-gray-700">Emily Chen</span>
                  </div>
                  <span className="text-xs text-gray-600 relative">
                    editor
                    <span className="absolute -top-1 -right-8 text-[10px] bg-white px-2 py-0.5 rounded border border-gray-200">
                      UPGRADE PLAN
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                    <span className="text-sm text-gray-700">Michael Smith</span>
                  </div>
                  <span className="text-xs text-gray-600">editor</span>
                </div>
              </div>

              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Enter email to invite"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-sm text-gray-600 placeholder-gray-400 border-none outline-none"
                />
              </div>

              <button className="w-full py-2.5 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors text-sm font-medium mb-4">
                Add
              </button>

              <div className="bg-gray-50 rounded-lg p-4 flex items-start justify-between gap-3">
                <p className="text-xs text-gray-600 flex-1">Keep your scrapbook fresh. Want to remove this?</p>
                <button className="px-4 py-1.5 bg-white text-gray-400 rounded-lg hover:bg-gray-100 transition-colors text-xs whitespace-nowrap">
                  Delete Scrapbook
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Basic Plan Section */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-base font-medium text-gray-700 mb-4">Basic plan</h2>
                <p className="text-xs text-gray-600 mb-4">
                  Capture up to 50 memories monthly. Need more?
                </p>
                <button className="w-full py-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                  Upgrade
                </button>
              </div>

              {/* Privacy Options Section */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-base font-medium text-gray-700 mb-4">Privacy options</h2>
                <p className="text-xs text-gray-600 mb-4">Control who sees your scrapbook</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPrivacy('public')}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      privacy === 'public'
                        ? 'bg-pink-400 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Public
                  </button>
                  <button
                    onClick={() => setPrivacy('private')}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      privacy === 'private'
                        ? 'bg-pink-400 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Private
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="bg-white rounded-full shadow-lg px-6 py-3 flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScrapbookYearsPage({ onHome }: { onHome: () => void }) {
  const years = [
    {
      year: 'Year 1',
      photos: [
        { id: 1, alt: 'Festival', bgColor: 'bg-orange-300' },
        { id: 2, alt: 'Forest', bgColor: 'bg-green-400' },
        { id: 3, alt: 'Mountain', bgColor: 'bg-blue-300' },
      ],
      highlights: [
        { title: 'First summer festival together', date: 'June 2018' },
        { title: 'Hiking adventure', date: 'April 2019' },
      ],
    },
    {
      year: 'Year 4',
      photos: [
        { id: 4, alt: 'Beach', bgColor: 'bg-amber-200' },
        { id: 5, alt: 'Campfire', bgColor: 'bg-orange-400' },
        { id: 6, alt: 'Snow', bgColor: 'bg-gray-200' },
      ],
      highlights: [
        { title: 'Beach day reunion', date: 'July 2022' },
        { title: 'Wedding celebration', date: 'September 2022' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-12 max-w-6xl mx-auto">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-1.5 h-6 bg-gray-800 rounded"></div>
            <div className="w-1.5 h-6 bg-gray-800 rounded"></div>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Squad Scrapbook</h1>
        </div>
      </div>

      {/* Years Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {years.map((yearData, index) => (
          <div key={index} className="bg-white rounded-3xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-6">{yearData.year}</h2>

            {/* Photos Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {yearData.photos.map((photo) => (
                <div
                  key={photo.id}
                  className={`aspect-square ${photo.bgColor} rounded-2xl overflow-hidden relative group cursor-pointer transition-transform hover:scale-105`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                </div>
              ))}
            </div>

            {/* Highlights */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Highlights</h3>
              <div className="space-y-2">
                {yearData.highlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 rounded-xl px-4 py-3 flex items-start justify-between hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <span className="text-sm text-gray-600 flex-1">{highlight.title}</span>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-3">
                      {highlight.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Edit Memories Page
function EditMemoriesPage({ onHome }: { onHome: () => void }) {
  const [selectedMemory, setSelectedMemory] = useState(0)
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'photos'>('date')
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'popular'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const allMemories = [
    { id: 1, title: 'Summer Beach Trip', date: '2024-07-15', photos: 24, likes: 45 },
    { id: 2, title: 'Birthday Celebration', date: '2024-06-20', photos: 18, likes: 32 },
    { id: 3, title: 'Hiking Adventure', date: '2024-05-10', photos: 31, likes: 67 },
    { id: 4, title: 'Family Reunion', date: '2024-08-01', photos: 42, likes: 89 },
    { id: 5, title: 'Graduation Day', date: '2024-04-15', photos: 15, likes: 23 },
  ]

  // Filter and sort memories
  let filteredMemories = [...allMemories]

  // Search filter
  if (searchQuery) {
    filteredMemories = filteredMemories.filter((m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  // Category filter
  if (filterBy === 'recent') {
    filteredMemories = filteredMemories.filter((m) => {
      const date = new Date(m.date)
      const now = new Date()
      const daysDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      return daysDiff <= 30
    })
  } else if (filterBy === 'popular') {
    filteredMemories = filteredMemories.filter((m) => m.likes >= 40)
  }

  // Sort
  filteredMemories.sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortBy === 'likes') {
      return b.likes - a.likes
    } else {
      return b.photos - a.photos
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Edit Memories</h1>
          <p className="text-gray-600">Manage and edit your scrapbook memories</p>
        </div>

        {/* Search, Filter and Sort Controls */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memories..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
            />
          </div>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as 'all' | 'recent' | 'popular')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          >
            <option value="all">All Memories</option>
            <option value="recent">Recent (30 days)</option>
            <option value="popular">Popular (40+ likes)</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'likes' | 'photos')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          >
            <option value="date">Sort by Date</option>
            <option value="likes">Sort by Likes</option>
            <option value="photos">Sort by Photos</option>
          </select>
          <div className="text-sm text-gray-600">
            {filteredMemories.length} memories
          </div>
        </div>

        {filteredMemories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No memories found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemories.map((memory) => (
              <div
                key={memory.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedMemory(memory.id)}
              >
                <div className="w-full h-48 bg-gradient-to-br from-pink-200 to-orange-200 rounded-xl mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{memory.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{memory.date}</span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Image className="w-4 h-4" /> {memory.photos}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" /> {memory.likes}
                    </span>
                  </div>
                </div>
                {selectedMemory === memory.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                    <button className="w-full py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors">
                      Edit Memory
                    </button>
                    <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Memory Feed Page
function MemoryFeedPage({ onHome }: { onHome: () => void }) {
  const feedItems = [
    { id: 1, user: 'Sarah', action: 'added a photo', time: '2h ago', image: 'bg-pink-200' },
    { id: 2, user: 'Mike', action: 'commented on', time: '4h ago', image: 'bg-orange-200' },
    { id: 3, user: 'Emma', action: 'liked', time: '6h ago', image: 'bg-yellow-200' },
    { id: 4, user: 'Alex', action: 'shared a memory', time: '8h ago', image: 'bg-blue-200' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Memory Feed</h1>
          <p className="text-gray-600">See all activity from your scrapbook</p>
        </div>

        <div className="space-y-4">
          {feedItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 ${item.image} rounded-full`}></div>
                <div className="flex-1">
                  <p className="text-gray-800">
                    <span className="font-semibold">{item.user}</span> {item.action} a memory
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{item.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Notes & Stickers Page
function NotesStickersPage({ onHome }: { onHome: () => void }) {
  const [selectedTab, setSelectedTab] = useState<'notes' | 'stickers'>('notes')
  const stickers = ['⭐', '❤️', '🎉', '📸', '🎨', '✨', '🌟', '💫', '🎊', '🎈', '🎁', '🏆']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Notes & Stickers</h1>
          <p className="text-gray-600">Add personal notes and fun stickers to your memories</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setSelectedTab('notes')}
              className={`pb-3 px-4 font-medium ${
                selectedTab === 'notes' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-600'
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setSelectedTab('stickers')}
              className={`pb-3 px-4 font-medium ${
                selectedTab === 'stickers' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-600'
              }`}
            >
              Stickers
            </button>
          </div>

          {selectedTab === 'notes' ? (
            <div className="space-y-4">
              <textarea
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Write your note here..."
              />
              <button className="px-6 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors">
                Save Note
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose a Sticker</h3>
              <div className="grid grid-cols-6 gap-4">
                {stickers.map((sticker, i) => (
                  <button
                    key={i}
                    className="w-16 h-16 text-4xl bg-gray-50 rounded-xl hover:bg-pink-50 transition-colors flex items-center justify-center"
                  >
                    {sticker}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Life-Path Page
function LifePathPage({ onHome }: { onHome: () => void }) {
  const milestones = [
    { year: '2024', title: 'New Adventures', description: 'Started new journey', color: 'bg-pink-300' },
    { year: '2023', title: 'Growth Year', description: 'Personal development', color: 'bg-orange-300' },
    { year: '2022', title: 'First Steps', description: 'Beginning of the story', color: 'bg-yellow-300' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Life-Path Journey</h1>
          <p className="text-gray-600">Trace your memories through time</p>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200"></div>
          <div className="space-y-8">
            {milestones.map((milestone, i) => (
              <div key={i} className="flex items-start gap-6 relative">
                <div className={`w-16 h-16 ${milestone.color} rounded-full flex items-center justify-center text-white font-bold z-10`}>
                  {milestone.year.slice(-2)}
                </div>
                <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Reflections Page
function ReflectionsPage({ onHome }: { onHome: () => void }) {
  const reflections = [
    { id: 1, title: 'Summer Reflections', date: '2024-08-01', content: 'What an amazing summer...' },
    { id: 2, title: 'Growth Thoughts', date: '2024-07-15', content: 'I learned so much...' },
    { id: 3, title: 'Gratitude Journal', date: '2024-06-20', content: 'Grateful for...' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Reflections</h1>
          <p className="text-gray-600">Your personal thoughts and reflections</p>
        </div>

        <div className="space-y-4">
          {reflections.map((reflection) => (
            <div key={reflection.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{reflection.title}</h3>
                <span className="text-sm text-gray-500">{reflection.date}</span>
              </div>
              <p className="text-gray-600">{reflection.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Memory Lane Page
function MemoryLanePage({ onHome }: { onHome: () => void }) {
  const memories = [
    { month: 'January', year: '2024', count: 12, color: 'bg-pink-300' },
    { month: 'February', year: '2024', count: 8, color: 'bg-orange-300' },
    { month: 'March', year: '2024', count: 15, color: 'bg-yellow-300' },
    { month: 'April', year: '2024', count: 20, color: 'bg-blue-300' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Memory Lane</h1>
          <p className="text-gray-600">Walk through your memories chronologically</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memories.map((memory, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{memory.month}</h3>
                  <p className="text-gray-600">{memory.year}</p>
                </div>
                <div className={`w-16 h-16 ${memory.color} rounded-full flex items-center justify-center text-white font-bold text-2xl`}>
                  {memory.count}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(memory.count)].map((_, j) => (
                  <div key={j} className={`aspect-square ${memory.color} rounded-lg opacity-60`}></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Capture Moments Page
function CaptureMomentsPage({ onHome }: { onHome: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Capture Moments</h1>
          <p className="text-gray-600">Quick capture for special moments</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center mb-6">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Click to capture or drag photos here</p>
            <button className="px-6 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors">
              Choose Photos
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gradient-to-br from-pink-200 to-orange-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Creative Memories Page
function CreativeMemoriesPage({ onHome }: { onHome: () => void }) {
  const templates = [
    { name: 'Collage', icon: '🎨', color: 'bg-pink-300' },
    { name: 'Timeline', icon: '📅', color: 'bg-orange-300' },
    { name: 'Story', icon: '📖', color: 'bg-yellow-300' },
    { name: 'Gallery', icon: '🖼️', color: 'bg-blue-300' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Creative Memories</h1>
          <p className="text-gray-600">Express your creativity with templates</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <div className={`w-20 h-20 ${template.color} rounded-xl flex items-center justify-center text-4xl mb-4 mx-auto`}>
                {template.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center">{template.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Scrapbook Showcase Page
function ScrapbookShowcasePage({ onHome }: { onHome: () => void }) {
  const scrapbooks = [
    { title: 'Summer 2024', photos: 45, color: 'bg-pink-300' },
    { title: 'Family Reunion', photos: 32, color: 'bg-orange-300' },
    { title: 'Travel Diary', photos: 67, color: 'bg-yellow-300' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Scrapbook Showcase</h1>
          <p className="text-gray-600">See your memories unfold</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scrapbooks.map((scrapbook, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              <div className={`h-48 ${scrapbook.color}`}></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{scrapbook.title}</h3>
                <p className="text-gray-600">{scrapbook.photos} photos</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Memory Moments Page
function MemoryMomentsPage({ onHome }: { onHome: () => void }) {
  const moments = [
    { time: 'Morning', icon: '🌅', count: 8 },
    { time: 'Afternoon', icon: '☀️', count: 12 },
    { time: 'Evening', icon: '🌆', count: 15 },
    { time: 'Night', icon: '🌙', count: 5 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Memory Moments</h1>
          <p className="text-gray-600">Capture the essence of different times</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {moments.map((moment, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center">
              <div className="text-6xl mb-4">{moment.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{moment.time}</h3>
              <p className="text-gray-600">{moment.count} memories</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Craft Your Story Page
function CraftStoryPage({ onHome }: { onHome: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Craft Your Story</h1>
          <p className="text-gray-600">Unleash your creativity</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Story Title</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your story title"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Story</label>
            <textarea
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Write your story here..."
            />
          </div>
          <button className="px-6 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors">
            Save Story
          </button>
        </div>
      </div>
    </div>
  )
}

// Share Page
function SharePage({ onHome }: { onHome: () => void }) {
  const [shareMethod, setShareMethod] = useState<'link' | 'email' | 'social'>('link')
  const shareableLink = 'https://squadscrapbook.com/memories/abc123'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Share Memories</h1>
          <p className="text-gray-600">Share your scrapbook with friends and family</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setShareMethod('link')}
              className={`pb-3 px-4 font-medium ${
                shareMethod === 'link' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-600'
              }`}
            >
              Share Link
            </button>
            <button
              onClick={() => setShareMethod('email')}
              className={`pb-3 px-4 font-medium ${
                shareMethod === 'email' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-600'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setShareMethod('social')}
              className={`pb-3 px-4 font-medium ${
                shareMethod === 'social' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-600'
              }`}
            >
              Social Media
            </button>
          </div>

          {shareMethod === 'link' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shareable Link</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={shareableLink}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button className="px-6 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors">
                  Copy Link
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" id="public" className="rounded" />
                <label htmlFor="public">Make this scrapbook public</label>
              </div>
            </div>
          )}

          {shareMethod === 'email' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
              />
              <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
              <textarea
                rows={4}
                placeholder="Add a personal message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
              />
              <button className="px-6 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors">
                Send Email
              </button>
            </div>
          )}

          {shareMethod === 'social' && (
            <div>
              <p className="text-gray-600 mb-4">Share to social media platforms</p>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center">
                  <div className="text-3xl mb-2">📘</div>
                  <span className="text-sm font-medium text-gray-700">Facebook</span>
                </button>
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center">
                  <div className="text-3xl mb-2">🐦</div>
                  <span className="text-sm font-medium text-gray-700">Twitter</span>
                </button>
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center">
                  <div className="text-3xl mb-2">📷</div>
                  <span className="text-sm font-medium text-gray-700">Instagram</span>
                </button>
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center">
                  <div className="text-3xl mb-2">💼</div>
                  <span className="text-sm font-medium text-gray-700">LinkedIn</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Calendar Page
function CalendarPage({ onHome }: { onHome: () => void }) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const memoriesByDate = [
    { date: '2024-08-15', count: 5, title: 'Beach Day' },
    { date: '2024-08-20', count: 3, title: 'Birthday Party' },
    { date: '2024-08-25', count: 8, title: 'Family Reunion' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Memory Calendar</h1>
          <p className="text-gray-600">View your memories by date</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">August 2024</h2>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <ChevronDown className="w-4 h-4 rotate-90" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <ChevronDown className="w-4 h-4 -rotate-90" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-center text-xs font-bold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {[...Array(31)].map((_, i) => {
                  const day = i + 1
                  const dateStr = `2024-08-${String(day).padStart(2, '0')}`
                  const hasMemory = memoriesByDate.some((m) => m.date === dateStr)
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(new Date(dateStr))}
                      className={`aspect-square flex flex-col items-center justify-center text-xs rounded-lg transition-colors ${
                        hasMemory
                          ? 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {day}
                      {hasMemory && <div className="w-1 h-1 bg-pink-500 rounded-full mt-1"></div>}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Memories on Selected Date</h3>
            <div className="space-y-3">
              {memoriesByDate
                .filter((m) => m.date === selectedDate.toISOString().split('T')[0])
                .map((memory, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-800">{memory.title}</p>
                    <p className="text-sm text-gray-600">{memory.count} photos</p>
                  </div>
                ))}
              {memoriesByDate.filter((m) => m.date === selectedDate.toISOString().split('T')[0]).length === 0 && (
                <p className="text-gray-500 text-sm">No memories on this date</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Favorites Page
function FavoritesPage({ onHome }: { onHome: () => void }) {
  const favorites = [
    { id: 1, title: 'Summer Beach Trip', date: '2024-07-15', likes: 45, color: 'bg-pink-200' },
    { id: 2, title: 'Birthday Celebration', date: '2024-06-20', likes: 32, color: 'bg-orange-200' },
    { id: 3, title: 'Hiking Adventure', date: '2024-05-10', likes: 67, color: 'bg-yellow-200' },
    { id: 4, title: 'Family Reunion', date: '2024-08-01', likes: 89, color: 'bg-blue-200' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Favorites</h1>
          <p className="text-gray-600">Your favorite memories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className={`w-full h-48 ${favorite.color} relative`}>
                <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-pink-50 transition-colors">
                  <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{favorite.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{favorite.date}</span>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                    <span>{favorite.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Starred Page
function StarredPage({ onHome }: { onHome: () => void }) {
  const starred = [
    { id: 1, title: 'Creating Lasting Memories', subtitle: 'Team Adventure', progress: 75, color: 'bg-pink-300' },
    { id: 2, title: 'Memory Lane', subtitle: 'Creative Group', progress: 50, color: 'bg-orange-300' },
    { id: 3, title: 'Year 1 vs Year 4', subtitle: 'Team Spirit', progress: 30, color: 'bg-yellow-300' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Starred Memories</h1>
          <p className="text-gray-600">Your starred and important memories</p>
        </div>

        <div className="space-y-4">
          {starred.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className={`w-24 h-24 ${item.color} rounded-lg flex-shrink-0`}></div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.subtitle}</p>
                    </div>
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pink-300 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{item.progress}% complete</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Wrapper component with persistent navigation
function PageWithNav({
  children,
  currentPage,
  onNavigate,
}: {
  children: React.ReactNode
  currentPage: Page
  onNavigate: (page: Page) => void
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <PersistentNavSidebar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="flex-1 ml-20">{children}</div>
    </div>
  )
}

export default function ScrapbookHome() {
  const [page, setPage] = useState<Page>('landing')

  if (page === 'landing') {
    return <ScrapbookLanding onStart={() => setPage('home')} />
  }

  // Helper to wrap pages with navigation
  const withNav = (pageContent: React.ReactNode) => (
    <PageWithNav currentPage={page} onNavigate={setPage}>
      {pageContent}
    </PageWithNav>
  )

  if (page === 'discover') {
    return withNav(
      <DiscoverPage
        onHome={() => setPage('home')}
        onCreate={() => setPage('create')}
        onProfile={() => setPage('profile')}
        onMemoryFeed={() => setPage('memoryFeed')}
        onDiscover={() => setPage('discover')}
        onLifePath={() => setPage('lifePath')}
        onShare={() => setPage('share')}
        onCapture={() => setPage('captureMoments')}
        onCalendar={() => setPage('calendar')}
        onFavorites={() => setPage('favorites')}
        onStarred={() => setPage('starred')}
      />
    )
  }

  if (page === 'create') {
    return withNav(<CreateMemoryPage onHome={() => setPage('home')} onSettings={() => setPage('settings')} />)
  }

  if (page === 'profile') {
    return withNav(<ProfilePage onHome={() => setPage('home')} onSettings={() => setPage('settings')} />)
  }

  if (page === 'settings') {
    return withNav(<SettingsPage onHome={() => setPage('home')} />)
  }

  if (page === 'years') {
    return withNav(<ScrapbookYearsPage onHome={() => setPage('home')} />)
  }

  if (page === 'editMemories') {
    return withNav(<EditMemoriesPage onHome={() => setPage('home')} />)
  }

  if (page === 'memoryFeed') {
    return withNav(<MemoryFeedPage onHome={() => setPage('home')} />)
  }

  if (page === 'notesStickers') {
    return withNav(<NotesStickersPage onHome={() => setPage('home')} />)
  }

  if (page === 'lifePath') {
    return withNav(<LifePathPage onHome={() => setPage('home')} />)
  }

  if (page === 'reflections') {
    return withNav(<ReflectionsPage onHome={() => setPage('home')} />)
  }

  if (page === 'memoryLane') {
    return withNav(<MemoryLanePage onHome={() => setPage('home')} />)
  }

  if (page === 'captureMoments') {
    return withNav(<CaptureMomentsPage onHome={() => setPage('home')} />)
  }

  if (page === 'creativeMemories') {
    return withNav(<CreativeMemoriesPage onHome={() => setPage('home')} />)
  }

  if (page === 'scrapbookShowcase') {
    return withNav(<ScrapbookShowcasePage onHome={() => setPage('home')} />)
  }

  if (page === 'memoryMoments') {
    return withNav(<MemoryMomentsPage onHome={() => setPage('home')} />)
  }

  if (page === 'craftStory') {
    return withNav(<CraftStoryPage onHome={() => setPage('home')} />)
  }

  if (page === 'share') {
    return withNav(<SharePage onHome={() => setPage('home')} />)
  }

  if (page === 'calendar') {
    return withNav(<CalendarPage onHome={() => setPage('home')} />)
  }

  if (page === 'favorites') {
    return withNav(<FavoritesPage onHome={() => setPage('home')} />)
  }

  if (page === 'starred') {
    return withNav(<StarredPage onHome={() => setPage('home')} />)
  }

  return withNav(
    <ScrapbookHomeContent
      onDiscover={() => setPage('discover')}
      onCreate={() => setPage('create')}
      onProfile={() => setPage('profile')}
      onYears={() => setPage('years')}
      onSettings={() => setPage('settings')}
      onEditMemories={() => setPage('editMemories')}
      onMemoryFeed={() => setPage('memoryFeed')}
      onNotesStickers={() => setPage('notesStickers')}
      onLifePath={() => setPage('lifePath')}
      onReflections={() => setPage('reflections')}
      onMemoryLane={() => setPage('memoryLane')}
      onCaptureMoments={() => setPage('captureMoments')}
      onCreativeMemories={() => setPage('creativeMemories')}
      onScrapbookShowcase={() => setPage('scrapbookShowcase')}
      onMemoryMoments={() => setPage('memoryMoments')}
      onCraftStory={() => setPage('craftStory')}
    />
  )
}
