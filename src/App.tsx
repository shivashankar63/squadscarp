import React, { useState, useEffect } from 'react'
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
  Grid3x3,
  Palette,
  Type,
  Filter,
  Layers,
  Crop,
  RotateCw,
  Download,
  Save,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Menu,
  Calendar as CalendarIcon,
  Tag,
  ZoomIn,
  Eye,
  Maximize,
  Upload,
  FileImage,
  AlertCircle as AlertCircleIcon,
} from 'lucide-react'
import { 
  createMemory, 
  uploadFile, 
  getMemories, 
  getMemoryById,
  getGroups, 
  searchGroups,
  likeMemory,
  deleteMemory as deleteMemoryFromDB,
  updateMemory as updateMemoryInDB,
} from './lib/database'
import { supabase } from './lib/supabase'

type Page =
  | 'landing'
  | 'home'
  | 'explore'
  | 'dashboard'
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
  | 'addCollaborator'
  | 'addMemory'
  | 'newPost'
  | 'newNote'
  | 'addMilestone'
  | 'newReflection'
  | 'addMoment'
  | 'createTemplate'
  | 'newScrapbook'
  | 'newStory'
  | 'addToCalendar'
  | 'addFavorite'
  | 'starMemory'
  | 'addYear'
  | 'memoryDetail'

// Persistent Navigation Sidebar Component
function PersistentNavSidebar({
  currentPage,
  onNavigate,
}: {
  currentPage: Page
  onNavigate: (page: Page) => void
}) {
  // Persistent sidebar navigation items
  const navItems = [
    { icon: Home, page: 'home' as Page, label: 'Home' },
    { icon: Search, page: 'explore' as Page, label: 'Explore' },
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

// Toast Notification System
type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => {
        const icons = {
          success: CheckCircle,
          error: XCircle,
          info: Info,
          warning: AlertCircle,
        }
        const colors = {
          success: 'bg-green-500',
          error: 'bg-red-500',
          info: 'bg-blue-500',
          warning: 'bg-yellow-500',
        }
        const Icon = icons[toast.type]
        return (
          <div
            key={toast.id}
            className={`${colors[toast.type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md animate-slideIn`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <p className="flex-1 font-medium">{toast.message}</p>
            <button
              onClick={() => onRemove(toast.id)}
              className="hover:bg-white/20 rounded-lg p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

// Confirmation Dialog Component
function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'danger'
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scaleIn">
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-full ${type === 'danger' ? 'bg-red-100' : 'bg-yellow-100'}`}>
            <AlertCircle className={`w-6 h-6 ${type === 'danger' ? 'text-red-600' : 'text-yellow-600'}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`px-6 py-2.5 text-white rounded-xl transition-colors font-medium ${
              type === 'danger'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-yellow-500 hover:bg-yellow-600'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

// Empty State Components
function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  illustration,
}: {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  illustration?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {illustration || (Icon && (
        <div className="mb-6 p-6 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full">
          <Icon className="w-16 h-16 text-pink-500" />
        </div>
      ))}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform duration-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

// Skeleton Loader Components
function SkeletonCard() {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 overflow-hidden">
      <div className="h-48 bg-gray-200 skeleton"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded skeleton mb-3"></div>
        <div className="h-4 bg-gray-200 rounded skeleton mb-4 w-3/4"></div>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded skeleton w-24"></div>
          <div className="h-4 bg-gray-200 rounded skeleton w-24"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded-xl skeleton mt-4"></div>
      </div>
    </div>
  )
}

// SkeletonMemory component for future use in memory grids
// function SkeletonMemory() {
//   return (
//     <div className="rounded-3xl overflow-hidden shadow-xl">
//       <div className="h-72 bg-gray-200 skeleton"></div>
//       <div className="absolute bottom-0 left-0 right-0 p-5">
//         <div className="h-4 bg-white/30 rounded-full skeleton w-20 mb-3"></div>
//         <div className="h-6 bg-white/30 rounded skeleton mb-2"></div>
//         <div className="h-4 bg-white/30 rounded skeleton w-24"></div>
//       </div>
//     </div>
//   )
// }

function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }
  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`${sizeClasses[size]} text-pink-500 spinner`} />
    </div>
  )
}

// Explore Page - Search for groups (Landing page showing different dashboards)
function ExplorePage({ 
  onViewDashboard, 
  onBack,
  showToast,
}: { 
  onViewDashboard: (groupName: string) => void
  onBack: () => void
  showToast: (message: string, type?: ToastType) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all')
  const [availableGroups, setAvailableGroups] = useState<Array<{
    id: number | string
    name: string
    members: number
    memories: number
    description: string
    image: string
    isPublic: boolean
    category: string
    dateCreated: string
  }>>([])

  // Load groups from database
  useEffect(() => {
    const loadGroups = async () => {
      setIsLoading(true)
      try {
        let result
        if (searchQuery.trim()) {
          result = await searchGroups(searchQuery)
        } else {
          result = await getGroups(true) // Get only public groups
        }

        const { data, error } = result

        if (error) {
          console.error('Error loading groups:', error)
          // Fallback to default groups if database is not set up
          setAvailableGroups([
            { id: 1, name: 'Squad Scrapbook', members: 12, memories: 145, description: 'Our amazing journey together', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop', isPublic: true, category: 'friends', dateCreated: '2023-01-15' },
            { id: 2, name: 'College Friends', members: 8, memories: 89, description: 'Memories from college days', image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop', isPublic: true, category: 'education', dateCreated: '2022-08-20' },
            { id: 3, name: 'Family Moments', members: 15, memories: 234, description: 'Family gatherings and celebrations', image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=400&h=300&fit=crop', isPublic: true, category: 'family', dateCreated: '2023-06-10' },
            { id: 4, name: 'Travel Buddies', members: 6, memories: 67, description: 'Adventures around the world', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', isPublic: true, category: 'travel', dateCreated: '2023-03-05' },
            { id: 5, name: 'Childhood Friends', members: 5, memories: 123, description: 'Growing up together', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop', isPublic: true, category: 'friends', dateCreated: '2022-12-01' },
          ])
        } else if (data && data.length > 0) {
          // Transform database records to match component format
          setAvailableGroups(data.map((g: any) => ({
            id: g.id,
            name: g.name,
            members: g.members_count || 0,
            memories: g.memories_count || 0,
            description: g.description || '',
            image: g.image_url || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
            isPublic: g.is_public,
            category: g.category || 'general',
            dateCreated: g.created_at?.split('T')[0] || '',
          })))
        } else {
          // Fallback to default groups if database is not set up or no data
          console.log('Using fallback groups - database may not be configured or empty')
          setAvailableGroups([
            { id: 1, name: 'Squad Scrapbook', members: 12, memories: 145, description: 'Our amazing journey together', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop', isPublic: true, category: 'friends', dateCreated: '2023-01-15' },
            { id: 2, name: 'College Friends', members: 8, memories: 89, description: 'Memories from college days', image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop', isPublic: true, category: 'education', dateCreated: '2022-08-20' },
            { id: 3, name: 'Family Moments', members: 15, memories: 234, description: 'Family gatherings and celebrations', image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=400&h=300&fit=crop', isPublic: true, category: 'family', dateCreated: '2023-06-10' },
            { id: 4, name: 'Travel Buddies', members: 6, memories: 67, description: 'Adventures around the world', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', isPublic: true, category: 'travel', dateCreated: '2023-03-05' },
            { id: 5, name: 'Childhood Friends', members: 5, memories: 123, description: 'Growing up together', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop', isPublic: true, category: 'friends', dateCreated: '2022-12-01' },
          ])
        }
      } catch (error) {
        console.error('Error loading groups:', error)
        // Even on error, set fallback groups so page can load
        setAvailableGroups([
          { id: 1, name: 'Squad Scrapbook', members: 12, memories: 145, description: 'Our amazing journey together', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop', isPublic: true, category: 'friends', dateCreated: '2023-01-15' },
          { id: 2, name: 'College Friends', members: 8, memories: 89, description: 'Memories from college days', image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop', isPublic: true, category: 'education', dateCreated: '2022-08-20' },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadGroups()
  }, [searchQuery, selectedCategory, selectedDateRange])

  const searchSuggestions = availableGroups
    .filter((group) => group.name.toLowerCase().includes(searchQuery.toLowerCase()) && group.isPublic)
    .slice(0, 5)
    .map((group) => group.name)

  const filteredGroups = availableGroups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory
    const matchesDate = selectedDateRange === 'all' || true // Simplified date filtering
    return matchesSearch && matchesCategory && matchesDate && group.isPublic
  })
  
  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])
  
  const addToRecentSearches = (query: string) => {
    if (query.trim() && !recentSearches.includes(query)) {
      const updated = [query, ...recentSearches].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
    }
  }

  // Simulate loading when searching
  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
        if (searchQuery.trim()) {
          addToRecentSearches(searchQuery)
        }
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 page-transition">
      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-pink-600 mb-8 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Explore Memories
          </h1>
          <p className="text-xl text-gray-600 mb-8">Search for groups and discover beautiful shared memories</p>
          
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for group names (e.g., Squad Scrapbook, College Friends...)"
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300 shadow-lg"
              />
            </div>
            <p className="text-sm text-gray-500 mt-3">Try: "Squad Scrapbook", "College Friends", "Travel Buddies"</p>
          </div>
        </div>

        {searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Searching...</span>
                </div>
              ) : filteredGroups.length > 0 ? (
                `Found ${filteredGroups.length} Group${filteredGroups.length > 1 ? 's' : ''}`
              ) : (
                'No Groups Found'
              )}
            </h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:scale-105"
                    onClick={() => onViewDashboard(group.name)}
                  >
                    <div className="h-48 relative overflow-hidden">
                      <img src={group.image} alt={group.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1">{group.name}</h3>
                        <p className="text-sm text-white/90">{group.description}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{group.members} members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Image className="w-4 h-4" />
                          <span>{group.memories} memories</span>
                        </div>
                      </div>
                      <button className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold">
                        View Dashboard
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20">
                <EmptyState
                  icon={Search}
                  title="No groups found"
                  description="We couldn't find any groups matching your search. Try a different term or browse popular groups below."
                  actionLabel="Browse Popular Groups"
                  onAction={() => setSearchQuery('')}
                />
              </div>
            )}
          </div>
        )}

        {!searchQuery && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Public Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableGroups.filter(g => g.isPublic).map((group) => (
                <div
                  key={group.id}
                  className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:scale-105"
                  onClick={() => onViewDashboard(group.name)}
                >
                  <div className="h-48 relative overflow-hidden">
                    <img src={group.image} alt={group.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{group.name}</h3>
                      <p className="text-sm text-white/90">{group.description}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{group.members} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Image className="w-4 h-4" />
                        <span>{group.memories} memories</span>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold">
                      View Dashboard
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Lightbox Component for Image Viewing
function Lightbox({
  isOpen,
  onClose,
  image,
  title,
  description,
}: {
  isOpen: boolean
  onClose: () => void
  image: string
  title?: string
  description?: string
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      <div
        className="relative max-w-7xl max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors p-2"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={image}
          alt={title || 'Memory image'}
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />
        {(title || description) && (
          <div className="mt-4 text-center text-white">
            {title && <h3 className="text-xl font-bold mb-2">{title}</h3>}
            {description && <p className="text-gray-300">{description}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

// Form Input Component with Validation
function FormInput({
  label,
  value,
  onChange,
  error,
  maxLength,
  type = 'text',
  placeholder,
  required = false,
  ariaLabel,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  maxLength?: number
  type?: string
  placeholder?: string
  required?: boolean
  ariaLabel?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-pink-500 focus:border-pink-300'
        }`}
        aria-label={ariaLabel || label}
        aria-invalid={!!error}
        aria-describedby={error ? `${label}-error` : undefined}
      />
      <div className="flex items-center justify-between mt-1">
        {error && (
          <p id={`${label}-error`} className="text-sm text-red-600 flex items-center gap-1" role="alert">
            <AlertCircleIcon className="w-4 h-4" />
            {error}
          </p>
        )}
        {maxLength && (
          <p className={`text-xs ml-auto ${value.length > maxLength * 0.9 ? 'text-orange-600' : 'text-gray-500'}`}>
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
}

// Drag and Drop File Upload Component
function DragDropUpload({
  onFilesSelected,
  accept = 'image/*',
  maxFiles = 5,
}: {
  onFilesSelected: (files: File[]) => void
  accept?: string
  maxFiles?: number
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).slice(0, maxFiles)
    setUploadedFiles(files)
    onFilesSelected(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, maxFiles)
      setUploadedFiles(files)
      onFilesSelected(files)
    }
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
        isDragging
          ? 'border-pink-500 bg-pink-50'
          : 'border-gray-300 hover:border-pink-300'
      } cursor-pointer`}
      role="button"
      tabIndex={0}
      aria-label="Upload files by dragging and dropping or clicking"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          document.getElementById('file-upload-input')?.click()
        }
      }}
    >
      <input
        id="file-upload-input"
        type="file"
        multiple
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
        aria-label="File upload input"
      />
      <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? 'text-pink-500' : 'text-gray-400'}`} />
      <p className="text-sm text-gray-600 mb-1">
        {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
      </p>
      <p className="text-xs text-gray-500">
        {uploadedFiles.length > 0
          ? `${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''} selected`
          : `Max ${maxFiles} files`}
      </p>
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
              <FileImage className="w-4 h-4" />
              <span className="flex-1 truncate">{file.name}</span>
              <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)}KB</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Beautiful Memory Dashboard - Visible when group is found
function MemoryDashboard({ 
  groupName, 
  onBack, 
  onExplore,
  showToast,
  showConfirm,
  onViewMemory,
}: { 
  groupName: string
  onBack: () => void
  onExplore: () => void
  showToast: (message: string, type?: ToastType) => void
  showConfirm: (config: {
    title: string
    message: string
    onConfirm: () => void
    confirmText?: string
    cancelText?: string
    type?: 'warning' | 'danger'
  }) => void
  onViewMemory?: (memoryId: string) => void
}) {
  const [selectedMemory, setSelectedMemory] = useState<number | string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [layout, setLayout] = useState<'grid' | 'masonry' | 'timeline'>('masonry')
  const [isLoading, setIsLoading] = useState(true)
  const [lightboxImage, setLightboxImage] = useState<{ image: string; title: string; description?: string } | null>(null)
  const [hoveredMemory, setHoveredMemory] = useState<number | string | null>(null)
  const [featuredMemories, setFeaturedMemories] = useState<Array<{
    id: number | string
    title: string
    date: string
    likes: number
    image: string
    category: string
    description?: string
  }>>([])
  const isOwnDashboard = groupName === 'Your Scrapbook'
  
  // Load memories from database
  useEffect(() => {
    const loadMemories = async () => {
      setIsLoading(true)
      try {
        // Get group ID from group name (for now, we'll search by name or use a default)
        // In a real app, you'd have a group ID mapping
        const { data: groups, error: groupError } = await getGroups(true)
        
        let groupId: string | undefined
        if (!groupError && groups && groups.length > 0) {
          const foundGroup = groups.find((g: any) => g.name === groupName)
          groupId = foundGroup?.id
        }

        const { data, error } = await getMemories(groupId)
        
        // Always set some memories - use database data if available, otherwise use fallback
        if (!error && data && data.length > 0) {
          // Transform database records to match component format
          setFeaturedMemories(data.map((m: any) => ({
            id: m.id,
            title: m.title,
            date: m.date || m.created_at?.split('T')[0] || '',
            likes: m.likes || 0,
            image: m.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
            category: m.category || 'General',
            description: m.description || m.story,
          })))
        } else {
          // Fallback to default memories if database is not set up or no data
          console.log('Using fallback memories - database may not be configured or empty')
          setFeaturedMemories([
            { id: 1, title: 'Summer Beach Trip', date: '2024-07-15', likes: 45, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', category: 'Travel' },
            { id: 2, title: 'Birthday Celebration', date: '2024-06-20', likes: 32, image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop', category: 'Celebration' },
            { id: 3, title: 'Hiking Adventure', date: '2024-05-10', likes: 67, image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=600&fit=crop', category: 'Adventure' },
            { id: 4, title: 'Family Reunion', date: '2024-08-01', likes: 89, image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&h=600&fit=crop', category: 'Family' },
            { id: 5, title: 'Graduation Day', date: '2024-05-25', likes: 120, image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop', category: 'Milestone' },
            { id: 6, title: 'Wedding Anniversary', date: '2024-06-10', likes: 95, image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop', category: 'Love' },
            { id: 7, title: 'Mountain Sunset', date: '2024-07-22', likes: 78, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', category: 'Nature' },
            { id: 8, title: 'City Lights', date: '2024-08-05', likes: 56, image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop', category: 'Urban' },
            { id: 9, title: 'Beach Sunset', date: '2024-07-30', likes: 103, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', category: 'Travel' },
          ])
        }
      } catch (error) {
        console.error('Error loading memories:', error)
        // Even on error, set fallback memories so page can load
        setFeaturedMemories([
          { id: 1, title: 'Summer Beach Trip', date: '2024-07-15', likes: 45, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', category: 'Travel' },
          { id: 2, title: 'Birthday Celebration', date: '2024-06-20', likes: 32, image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop', category: 'Celebration' },
          { id: 3, title: 'Hiking Adventure', date: '2024-05-10', likes: 67, image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=600&fit=crop', category: 'Adventure' },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadMemories()
  }, [groupName])

  const editingTools = [
    { id: 'filter', icon: Filter, label: 'Filters', colors: ['sepia', 'vintage', 'blackwhite', 'warm', 'cool'] },
    { id: 'text', icon: Type, label: 'Add Text', fonts: ['serif', 'sans', 'script', 'bold'] },
    { id: 'sticker', icon: Sparkles, label: 'Stickers', stickers: ['❤️', '⭐', '🎉', '🌟', '💫', '🎈', '🎁', '🌈'] },
    { id: 'crop', icon: Crop, label: 'Crop', ratios: ['1:1', '4:3', '16:9', 'free'] },
    { id: 'rotate', icon: RotateCw, label: 'Rotate', angles: [90, 180, 270] },
    { id: 'effects', icon: Palette, label: 'Effects', effects: ['blur', 'brightness', 'contrast', 'saturate'] },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 page-transition">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600 font-medium">Loading memories...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 page-transition">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-indigo-500/5"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(236,72,153,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-all hover:scale-105 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">
                {isOwnDashboard ? 'Back to Home' : 'Back to Explore'}
              </span>
            </button>
            {isOwnDashboard && (
              <button
                onClick={onExplore}
                className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-lg rounded-xl hover:bg-pink-50 transition-all shadow-lg hover:shadow-xl text-gray-700 hover:text-pink-600"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm font-medium">Explore More</span>
              </button>
            )}
          </div>
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 tracking-tight">
              {groupName}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 font-light">A collection of precious moments captured in time</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={onExplore}
                className="px-10 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white rounded-2xl hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 transition-all font-semibold text-base sm:text-lg shadow-2xl hover:shadow-pink-500/50 hover:scale-105 transform duration-300"
              >
                Explore More Dashboards
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Memory Gallery Grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-20">
        <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">Featured Memories</h2>
            <p className="text-gray-600 text-base">Discover our most cherished moments</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Layout Options */}
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md rounded-2xl p-1.5 shadow-lg border border-gray-100">
              <button
                onClick={() => setLayout('grid')}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  layout === 'grid' 
                    ? 'bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600 shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
                title="Grid View"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLayout('masonry')}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  layout === 'masonry' 
                    ? 'bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600 shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
                title="Masonry View"
              >
                <Layers className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLayout('timeline')}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  layout === 'timeline' 
                    ? 'bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600 shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
                title="Timeline View"
              >
                <Calendar className="w-5 h-5" />
              </button>
            </div>
            {/* Edit Mode Toggle - Only show for own dashboard */}
            {isOwnDashboard && (
              <button
                onClick={() => setEditMode(!editMode)}
                className={`px-5 py-2.5 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  editMode
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-500/30'
                    : 'bg-white/90 backdrop-blur-md text-gray-700 border border-gray-100 hover:bg-pink-50 hover:border-pink-200'
                }`}
              >
                <Edit3 className="w-4 h-4 inline mr-2" />
                <span className="text-sm">{editMode ? 'Exit Edit' : 'Edit Mode'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Editing Tools Panel - Only show for own dashboard */}
        {editMode && isOwnDashboard && (
          <div className="mb-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Creative Editing Tools</h3>
              {selectedMemory && (
                <button
                  onClick={() => {
                    setSelectedMemory(null)
                    setSelectedTool(null)
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {editingTools.map((tool) => {
                const ToolIcon = tool.icon
                return (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
                    className={`p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 hover:scale-105 ${
                      selectedTool === tool.id
                        ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-rose-50 text-pink-600 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-50 hover:shadow-md'
                    }`}
                  >
                    <ToolIcon className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-xs font-semibold">{tool.label}</p>
                  </button>
                )
              })}
            </div>

            {/* Tool Options */}
            {selectedTool && selectedMemory && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                {selectedTool === 'filter' && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Apply Filter</p>
                    <div className="flex gap-3">
                      {editingTools.find(t => t.id === 'filter')?.colors?.map((color) => (
                        <button
                          key={color}
                          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium capitalize"
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {selectedTool === 'text' && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Add Text</p>
                    <input
                      type="text"
                      placeholder="Enter text..."
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 mb-3"
                    />
                    <div className="flex gap-3">
                      {editingTools.find(t => t.id === 'text')?.fonts?.map((font) => (
                        <button
                          key={font}
                          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium capitalize"
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {selectedTool === 'sticker' && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Add Sticker</p>
                    <div className="flex gap-3 flex-wrap">
                      {editingTools.find(t => t.id === 'sticker')?.stickers?.map((sticker) => (
                        <button
                          key={sticker}
                          className="text-3xl p-2 hover:bg-pink-100 rounded-lg transition-colors"
                        >
                          {sticker}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {selectedTool === 'crop' && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Crop Ratio</p>
                    <div className="flex gap-3">
                      {editingTools.find(t => t.id === 'crop')?.ratios?.map((ratio) => (
                        <button
                          key={ratio}
                          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium"
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {selectedTool === 'rotate' && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Rotate</p>
                    <div className="flex gap-3">
                      {editingTools.find(t => t.id === 'rotate')?.angles?.map((angle) => (
                        <button
                          key={angle}
                          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium"
                        >
                          {angle}°
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {selectedTool === 'effects' && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Effects</p>
                    <div className="flex gap-3">
                      {editingTools.find(t => t.id === 'effects')?.effects?.map((effect) => (
                        <button
                          key={effect}
                          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium capitalize"
                        >
                          {effect}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-3 mt-6">
                  <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform duration-200">
                    <Save className="w-4 h-4 inline mr-2" />
                    Apply
                  </button>
                  <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold hover:scale-105 transform duration-200">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Memory Grid - Layout based on selection */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden shadow-xl">
                <div className="h-72 bg-gray-200 skeleton"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className={
            layout === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'
              : layout === 'timeline'
              ? 'space-y-6'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'
          }>
            {featuredMemories.map((memory, index) => {
            const heights = ['h-64', 'h-80', 'h-72', 'h-96', 'h-64', 'h-80', 'h-72', 'h-64', 'h-80']
            const height = layout === 'masonry' ? heights[index % heights.length] : layout === 'timeline' ? 'h-48' : 'h-72'
            const isSelected = selectedMemory === memory.id
            
            return (
              <div
                key={memory.id}
                className={`group relative ${height} ${layout === 'timeline' ? 'flex' : ''} rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-[1.03] hover:-translate-y-1 ${
                  isSelected && editMode ? 'ring-4 ring-pink-500 ring-offset-2 scale-105 z-10' : ''
                }`}
                onClick={() => {
                  if (editMode) {
                    setSelectedMemory(memory.id)
                  } else if (onViewMemory) {
                    onViewMemory(String(memory.id))
                  }
                }}
              >
                <img
                  src={memory.image}
                  alt={memory.title}
                  className={`${layout === 'timeline' ? 'w-48 h-full' : 'w-full h-full'} object-cover group-hover:scale-110 transition-transform duration-700 ease-out`}
                />
                {/* Enhanced gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/60 transition-all duration-500"></div>
                
                {/* Content overlay */}
                <div className={`absolute ${layout === 'timeline' ? 'left-48 right-0' : 'bottom-0 left-0 right-0'} p-5 sm:p-6 z-10`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1.5 bg-white/25 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/40 shadow-lg">
                      {memory.category}
                    </span>
                    <div className="flex items-center gap-2">
                      {editMode && isOwnDashboard && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedMemory(memory.id)
                            setSelectedTool('filter')
                          }}
                          className="p-2 bg-white/25 backdrop-blur-md rounded-xl hover:bg-white/35 transition-all duration-200 shadow-lg hover:scale-110"
                          title="Edit Memory"
                        >
                          <Edit3 className="w-4 h-4 text-white" />
                        </button>
                      )}
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/20 backdrop-blur-md rounded-full">
                        <Heart className="w-4 h-4 fill-white text-white" />
                        <span className="text-sm font-semibold text-white">{memory.likes}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 group-hover:text-pink-200 transition-colors duration-300 leading-tight">
                    {memory.title}
                  </h3>
                  <p className="text-sm text-white/90 font-medium">{memory.date}</p>
                </div>
                
                {/* Enhanced hover overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 via-purple-500/0 to-indigo-500/0 group-hover:from-pink-500/15 group-hover:via-purple-500/10 group-hover:to-indigo-500/10 transition-all duration-500"></div>
                
                {/* Hover Preview - Quick Actions */}
                {hoveredMemory === memory.id && !editMode && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (onViewMemory) {
                          onViewMemory(String(memory.id))
                        } else {
                          setLightboxImage({ image: memory.image, title: memory.title, description: memory.category })
                        }
                      }}
                      className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl hover:bg-white transition-all duration-200 shadow-xl hover:scale-110 flex items-center gap-2 text-gray-700 font-semibold"
                      aria-label="View memory details"
                    >
                      <ZoomIn className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation()
                        try {
                          const { error } = await likeMemory(String(memory.id))
                          if (error) throw error
                          showToast('Memory liked!', 'success')
                          // Update local state
                          setFeaturedMemories(prev => prev.map(m => 
                            m.id === memory.id ? { ...m, likes: (m.likes || 0) + 1 } : m
                          ))
                        } catch (error: any) {
                          console.error('Error liking memory:', error)
                          showToast('Failed to like memory', 'error')
                        }
                      }}
                      className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl hover:bg-pink-100 transition-all duration-200 shadow-xl hover:scale-110 flex items-center gap-2 text-pink-600 font-semibold"
                      aria-label="Like memory"
                    >
                      <Heart className="w-4 h-4" />
                      Like
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        showToast('Memory shared!', 'success')
                      }}
                      className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl hover:bg-blue-100 transition-all duration-200 shadow-xl hover:scale-110 flex items-center gap-2 text-blue-600 font-semibold"
                      aria-label="Share memory"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                )}
                
                {/* Edit overlay - Only show for own dashboard */}
                {editMode && isOwnDashboard && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedMemory(memory.id)
                      }}
                      className="p-2.5 bg-white/95 backdrop-blur-md rounded-xl hover:bg-pink-100 transition-all duration-200 shadow-xl hover:scale-110 border border-white/50"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation()
                        showConfirm({
                          title: 'Delete Memory',
                          message: 'Are you sure you want to delete this memory? This action cannot be undone.',
                          onConfirm: async () => {
                            try {
                              const { error } = await deleteMemoryFromDB(String(memory.id))
                              if (error) throw error
                              showToast('Memory deleted successfully', 'success')
                              // Remove from local state
                              setFeaturedMemories(prev => prev.filter(m => m.id !== memory.id))
                            } catch (error: any) {
                              console.error('Error deleting memory:', error)
                              showToast('Failed to delete memory', 'error')
                            }
                          },
                          confirmText: 'Delete',
                          cancelText: 'Cancel',
                          type: 'danger',
                        })
                      }}
                      className="p-2.5 bg-white/95 backdrop-blur-md rounded-xl hover:bg-red-100 transition-all duration-200 shadow-xl hover:scale-110 border border-white/50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      className="p-2.5 bg-white/95 backdrop-blur-md rounded-xl hover:bg-blue-100 transition-all duration-200 shadow-xl hover:scale-110 border border-white/50"
                      title="Download"
                    >
                      <Download className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
              {featuredMemories.length}+
            </div>
            <div className="text-gray-600 font-semibold text-sm sm:text-base">Memories</div>
          </div>
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {featuredMemories.reduce((sum, m) => sum + m.likes, 0)}+
            </div>
            <div className="text-gray-600 font-semibold text-sm sm:text-base">Total Likes</div>
          </div>
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              6
            </div>
            <div className="text-gray-600 font-semibold text-sm sm:text-base">Categories</div>
          </div>
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-2">
              2024
            </div>
            <div className="text-gray-600 font-semibold text-sm sm:text-base">Year</div>
          </div>
        </div>
      </div>
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
  onDashboard,
  onExplore,
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
  onDashboard: () => void
  onExplore: () => void
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
            onClick={onDashboard}
          >
            <Grid3x3 className="w-5 h-5" />
            Memory Dashboard
          </button>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={onExplore}
          >
            <Search className="w-5 h-5" />
            Explore Groups
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
  showToast,
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
  showToast?: (message: string, type?: ToastType) => void
}) {
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
                <button 
                  onClick={() => onCreate()}
                  className="flex-1 bg-white text-gray-600 py-3 rounded-full text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors hover:scale-105"
                >
                  Start Project
                </button>
                <button 
                  onClick={() => {
                    if (showToast) showToast(`Opening ${currentProject.title} gallery`, 'info')
                    onHome()
                  }}
                  className="flex-1 bg-pink-300 text-white py-3 rounded-full text-sm font-medium hover:bg-pink-400 transition-colors hover:scale-105"
                >
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
  showToast,
}: {
  onHome: () => void
  onSettings: () => void
  showToast: (message: string, type?: ToastType) => void
}) {
  const [memoryType, setMemoryType] = useState('photos')
  const [showForm, setShowForm] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tags: '',
    source: '',
    mood: '',
    story: '',
    date: '',
    location: '',
    notes: '',
    highlights: '',
    collaborators: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters'
    }
    
    if (formData.story.length > 1000) {
      newErrors.story = 'Story must be less than 1000 characters'
    }
    
    if (formData.notes.length > 500) {
      newErrors.notes = 'Notes must be less than 500 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    try {
      // Upload files first if any
      let imageUrl = ''
      let videoUrl = ''

      if (uploadedFiles.length > 0) {
        const imageFiles = uploadedFiles.filter(file => file.type.startsWith('image/'))
        const videoFiles = uploadedFiles.filter(file => file.type.startsWith('video/'))

        if (imageFiles.length > 0) {
          const { url, error } = await uploadFile(imageFiles[0], 'memories')
          if (error) throw error
          imageUrl = url || ''
        }

        if (videoFiles.length > 0) {
          const { url, error } = await uploadFile(videoFiles[0], 'memories')
          if (error) throw error
          videoUrl = url || ''
        }
      }

      // Create memory in database
      const { error } = await createMemory({
        title: formData.title,
        description: formData.story,
        category: formData.category || 'General',
        date: formData.date || new Date().toISOString().split('T')[0],
        location: formData.location,
        story: formData.story,
        notes: formData.notes,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        mood: formData.mood,
        source: formData.source,
        highlights: formData.highlights,
        image_url: imageUrl,
        video_url: videoUrl,
        likes: 0,
      })

      if (error) throw error

      showToast('Memory created successfully!', 'success')
      
      // Reset form
      setFormData({
        title: '',
        category: '',
        tags: '',
        source: '',
        mood: '',
        story: '',
        date: '',
        location: '',
        notes: '',
        highlights: '',
        collaborators: '',
      })
      setUploadedFiles([])
      setErrors({})
    } catch (error: any) {
      console.error('Error creating memory:', error)
      showToast(error.message || 'Failed to create memory', 'error')
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Main Content */}
      <div className="flex-1 bg-white relative">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={onHome}
            className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-all hover:scale-105 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
          
          {/* Right side buttons */}
          <div className="flex items-center gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Story
                    <span className="text-xs text-gray-500 ml-2">
                      {formData.story.length}/1000
                    </span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.story}
                    onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                    maxLength={1000}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                      errors.story
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-pink-500 focus:border-pink-300'
                    }`}
                    placeholder="Tell your story..."
                    aria-label="Story"
                    aria-invalid={!!errors.story}
                    aria-describedby={errors.story ? 'story-error' : undefined}
                  />
                  {errors.story && (
                    <p id="story-error" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
                      <AlertCircleIcon className="w-4 h-4" />
                      {errors.story}
                    </p>
                  )}
                </div>

                {/* Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                  <DragDropUpload
                    onFilesSelected={setUploadedFiles}
                    accept="image/*"
                    maxFiles={5}
                  />
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                    <span className="text-xs text-gray-500 ml-2">
                      {formData.notes.length}/500
                    </span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    maxLength={500}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                      errors.notes
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-pink-500 focus:border-pink-300'
                    }`}
                    placeholder="Add notes..."
                    aria-label="Notes"
                    aria-invalid={!!errors.notes}
                    aria-describedby={errors.notes ? 'notes-error' : undefined}
                  />
                  {errors.notes && (
                    <p id="notes-error" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
                      <AlertCircleIcon className="w-4 h-4" />
                      {errors.notes}
                    </p>
                  )}
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
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label="Save memory"
                  >
                    Save memory
                  </button>
                  <button
                    onClick={() => {
                      setFormData({
                        title: '',
                        category: '',
                        tags: '',
                        source: '',
                        mood: '',
                        story: '',
                        date: '',
                        location: '',
                        notes: '',
                        highlights: '',
                        collaborators: '',
                      })
                      setErrors({})
                      setUploadedFiles([])
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    aria-label="Discard changes"
                  >
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

function ProfilePage({ onHome, onSettings, onAddCollaborator, showToast }: { onHome: () => void; onSettings: () => void; onAddCollaborator: () => void; showToast?: (message: string, type?: ToastType) => void }) {
  const [activeTab] = useState('profile')
  const handleInvite = () => {
    if (showToast) showToast('Invitation sent!', 'success')
  }
  const handleShare = () => {
    if (showToast) showToast('Memories shared!', 'success')
  }
  const handleView = (name: string) => {
    if (showToast) showToast(`Viewing ${name}'s profile`, 'info')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Main Content */}
      <div className="p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Collaborators
            </h1>
            <p className="text-gray-600">Manage your team and shared memories</p>
          </div>
          <button
            onClick={onAddCollaborator}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <UserPlus className="w-5 h-5" />
            Add Collaborator
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8 max-w-5xl hover:shadow-2xl transition-all duration-300">
          <div className="flex gap-8">
            {/* Left Column - Profile Info */}
            <div className="w-64 flex-shrink-0">
              {/* Profile Picture with grid overlay effect */}
              <div className="relative mb-6 group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 mx-auto relative overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {/* Grid pattern overlay to simulate the photo grid effect */}
                  <div className="absolute inset-0 grid grid-cols-3 gap-0.5 p-2">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="bg-white/40 rounded-sm animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                  </div>
                  {/* Semi-transparent overlay to create the "premium lock" effect */}
                  <div className="absolute inset-0 bg-white/30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="w-12 h-12 text-white/80" />
                  </div>
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
              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="text-center p-3 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl hover:scale-105 transition-transform cursor-pointer">
                  <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">5</div>
                  <div className="text-xs text-gray-700 font-medium mt-1">My</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl hover:scale-105 transition-transform cursor-pointer">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">2</div>
                  <div className="text-xs text-gray-700 font-medium mt-1">Contributors</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl hover:scale-105 transition-transform cursor-pointer">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">12</div>
                  <div className="text-xs text-gray-700 font-medium mt-1">Active</div>
                </div>
              </div>

              {/* Memory Stats */}
              <div className="space-y-3 mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Memory Stats</h3>

                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 flex items-center gap-3 hover:shadow-lg transition-all cursor-pointer group border border-pink-200/50">
                  <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 font-medium">Photos added</div>
                    <div className="text-xl font-bold text-gray-800">3</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 flex items-center gap-3 hover:shadow-lg transition-all cursor-pointer group border border-purple-200/50">
                  <div className="p-2 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-lg group-hover:scale-110 transition-transform">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 font-medium">Hours spent</div>
                    <div className="text-xl font-bold text-gray-800">120</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 flex items-center gap-3 relative hover:shadow-lg transition-all cursor-pointer group border border-amber-200/50">
                  <div className="p-2 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-lg group-hover:scale-110 transition-transform">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 font-medium">Milestones</div>
                    <div className="text-xl font-bold text-gray-800">7</div>
                  </div>
                  <button className="absolute top-2 right-2 text-xs text-gray-700 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] border border-gray-300 hover:bg-white hover:scale-110 transition-all font-medium">
                    UPGRADE
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
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl hover:shadow-lg transition-all cursor-pointer group border border-pink-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                        EJ
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-800 block">Emily Johnson</span>
                        <span className="text-xs text-gray-500">Active now</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleInvite()}
                        className="w-9 h-9 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all"
                        title="Invite to memory"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                      <button 
                        onClick={() => handleView('Emily Johnson')}
                        className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 hover:scale-110 transition-all"
                        title="View profile"
                      >
                        <UserPlus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:shadow-lg transition-all cursor-pointer group border border-blue-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                        MS
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-800 block">Michael Smith</span>
                        <span className="text-xs text-gray-500">2h ago</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleInvite()}
                        className="w-9 h-9 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all"
                        title="Invite to memory"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                      <button 
                        onClick={() => handleView('Michael Smith')}
                        className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 hover:scale-110 transition-all"
                        title="View profile"
                      >
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
                    <button 
                      onClick={() => handleView('Sarah Lee')}
                      className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      View
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <span className="text-sm text-gray-700">David Brown</span>
                    </div>
                    <button 
                      onClick={() => handleView('Sarah Lee')}
                      className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      View
                    </button>
                  </div>

                  <button className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                    +Invite AI
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => onAddCollaborator()}
                    className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full hover:from-pink-600 hover:to-rose-600 transition-all font-medium shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Invite Team
                  </button>
                  <button 
                    onClick={() => handleShare()}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full hover:from-purple-600 hover:to-indigo-600 transition-all font-medium shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
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

function SettingsPage({ onHome, showToast }: { onHome: () => void; showToast: (message: string, type?: ToastType) => void }) {
  const [title, setTitle] = useState('Your Scrapbook')
  const [email, setEmail] = useState('')
  const [privacy, setPrivacy] = useState('public')
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Alex Johnson', role: 'creator', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop' },
    { id: 2, name: 'Emily Chen', role: 'editor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
    { id: 3, name: 'Michael Smith', role: 'editor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  ])

  const handleAddMember = async () => {
    if (!email.trim()) {
      showToast('Please enter an email address', 'error')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address', 'error')
      return
    }

    // Check if email already exists
    if (teamMembers.some(member => member.name.toLowerCase().includes(email.split('@')[0]))) {
      showToast('This person is already a team member', 'error')
      return
    }

    // Add new member (in real app, this would call the database)
    const newMember = {
      id: teamMembers.length + 1,
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1) + ' ' + email.split('@')[1].split('.')[0].charAt(0).toUpperCase() + email.split('@')[1].split('.')[0].slice(1),
      role: 'editor' as const,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=pink&color=fff&size=100`,
    }

    setTeamMembers([...teamMembers, newMember])
    showToast(`Invitation sent to ${email}`, 'success')
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Main Content */}
      <div className="p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
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
                <img 
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop" 
                  alt="Scrapbook"
                  className="w-20 h-20 rounded-full object-cover border-2 border-pink-200"
                />
                <button className="absolute -top-1 -right-1 w-7 h-7 bg-pink-400 rounded-full flex items-center justify-center shadow-sm hover:bg-pink-500 transition-colors">
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
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-9 h-9 rounded-full object-cover border-2 border-gray-200"
                      />
                      <span className="text-sm text-gray-700">{member.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">{member.role}</span>
                      {member.role !== 'creator' && (
                        <button
                          onClick={() => {
                            setTeamMembers(teamMembers.filter(m => m.id !== member.id))
                            showToast(`${member.name} removed from team`, 'success')
                          }}
                          className="text-red-400 hover:text-red-600 transition-colors"
                          title="Remove member"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Enter email to invite"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && email.trim()) {
                      handleAddMember()
                    }
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-sm text-gray-600 placeholder-gray-400 border-none outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <button 
                onClick={handleAddMember}
                disabled={!email.trim()}
                className="w-full py-2.5 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors text-sm font-medium mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
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

function ScrapbookYearsPage({ onHome, onAddYear, showToast }: { onHome: () => void; onAddYear: () => void; showToast?: (message: string, type?: ToastType) => void }) {
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8">
      {/* Header */}
      <div className="mb-12 max-w-6xl mx-auto">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Year 1 vs Year 4
            </h1>
            <p className="text-gray-600">Compare your journey through the years</p>
          </div>
          <button
            onClick={onAddYear}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Year
          </button>
        </div>
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
          <div key={index} className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <h2 className="text-lg font-semibold text-gray-700 mb-6">{yearData.year}</h2>

            {/* Photos Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {yearData.photos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => {
                    if (showToast) showToast(`Viewing ${photo.alt} from ${yearData.year}`, 'info')
                  }}
                  className={`aspect-square ${photo.bgColor} rounded-2xl overflow-hidden relative group cursor-pointer transition-transform hover:scale-105`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2 text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 px-2 py-1 rounded">
                    {photo.alt}
                  </div>
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
                    onClick={() => {
                      if (showToast) showToast(`Viewing ${highlight.title}`, 'info')
                    }}
                    className="bg-gray-50 rounded-xl px-4 py-3 flex items-start justify-between hover:bg-pink-50 hover:border-pink-200 border border-transparent transition-all cursor-pointer group"
                  >
                    <span className="text-sm text-gray-600 flex-1 group-hover:text-pink-700 transition-colors">{highlight.title}</span>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-3 group-hover:text-pink-600 transition-colors">
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
function EditMemoriesPage({ onHome, onAddMemory, showToast, showConfirm, onViewMemory }: { onHome: () => void; onAddMemory: () => void; showToast?: (message: string, type?: ToastType) => void; showConfirm?: (config: { title: string; message: string; onConfirm: () => void; confirmText?: string; cancelText?: string; type?: 'warning' | 'danger' }) => void; onViewMemory?: (memoryId: string) => void }) {
  const [selectedMemory, setSelectedMemory] = useState(0)
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'photos'>('date')
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'popular'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const allMemories = [
    { id: 1, title: 'Summer Beach Trip', date: '2024-07-15', photos: 24, likes: 45, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop' },
    { id: 2, title: 'Birthday Celebration', date: '2024-06-20', photos: 18, likes: 32, image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop' },
    { id: 3, title: 'Hiking Adventure', date: '2024-05-10', photos: 31, likes: 67, image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=600&fit=crop' },
    { id: 4, title: 'Family Reunion', date: '2024-08-01', photos: 42, likes: 89, image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&h=600&fit=crop' },
    { id: 5, title: 'Graduation Day', date: '2024-04-15', photos: 15, likes: 23, image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop' },
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Edit Memories
            </h1>
            <p className="text-gray-600">Manage and edit your scrapbook memories</p>
          </div>
          <button
            onClick={onAddMemory}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Memory
          </button>
        </div>

        {/* Search, Filter and Sort Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memories..."
              className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300 text-sm shadow-md hover:shadow-lg transition-all"
            />
          </div>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as 'all' | 'recent' | 'popular')}
            className="px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300 text-sm shadow-md hover:shadow-lg transition-all font-medium"
          >
            <option value="all">All Memories</option>
            <option value="recent">Recent (30 days)</option>
            <option value="popular">Popular (40+ likes)</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'likes' | 'photos')}
            className="px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300 text-sm shadow-md hover:shadow-lg transition-all font-medium"
          >
            <option value="date">Sort by Date</option>
            <option value="likes">Sort by Likes</option>
            <option value="photos">Sort by Photos</option>
          </select>
          <div className="px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-sm font-semibold shadow-lg">
            {filteredMemories.length} memories
          </div>
        </div>

        {filteredMemories.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No memories found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemories.map((memory, index) => {
              const gradients = [
                'from-pink-400 via-rose-400 to-orange-400',
                'from-purple-400 via-pink-400 to-rose-400',
                'from-blue-400 via-cyan-400 to-teal-400',
                'from-amber-400 via-orange-400 to-red-400',
                'from-indigo-400 via-purple-400 to-pink-400',
              ]
              const gradient = gradients[index % gradients.length]
              return (
                <div
                  key={memory.id}
                  className={`bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 cursor-pointer group ${
                    selectedMemory === memory.id ? 'ring-4 ring-pink-400 scale-105' : 'hover:scale-105'
                  }`}
                  onClick={() => {
                    if (onViewMemory) {
                      onViewMemory(String(memory.id))
                    } else {
                      setSelectedMemory(selectedMemory === memory.id ? 0 : memory.id)
                    }
                  }}
                >
                  <div className={`w-full h-48 bg-gradient-to-br ${gradient} rounded-xl mb-4 relative overflow-hidden group-hover:scale-110 transition-transform duration-300`}>
                    <img src={memory.image} alt={memory.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                        <Calendar className="w-4 h-4 text-gray-600 inline mr-1" />
                        <span className="text-xs font-medium text-gray-700">{memory.date}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors">
                    {memory.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 px-3 py-1 bg-pink-50 rounded-full">
                        <Image className="w-4 h-4 text-pink-600" />
                        <span className="text-sm font-semibold text-pink-600">{memory.photos}</span>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 bg-rose-50 rounded-full">
                        <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                        <span className="text-sm font-semibold text-rose-600">{memory.likes}</span>
                      </div>
                    </div>
                  </div>
                  {selectedMemory === memory.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 animate-in slide-in-from-top-2">
                      <button 
                        onClick={() => {
                          if (showToast) showToast('Opening editor...', 'info')
                          onAddMemory()
                        }}
                        className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-medium shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        Edit Memory
                      </button>
                      <button 
                        onClick={() => {
                          if (showConfirm) {
                            showConfirm({
                              title: 'Delete Memory',
                              message: `Are you sure you want to delete "${memory.title}"? This action cannot be undone.`,
                              onConfirm: async () => {
                                try {
                                  const { error } = await deleteMemoryFromDB(String(memory.id))
                                  if (error) throw error
                                  if (showToast) showToast('Memory deleted successfully', 'success')
                                  setSelectedMemory(0)
                                  // Reload memories would happen here
                                } catch (error: any) {
                                  if (showToast) showToast('Failed to delete memory', 'error')
                                }
                              },
                              confirmText: 'Delete',
                              cancelText: 'Cancel',
                              type: 'danger',
                            })
                          }
                        }}
                        className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-red-100 hover:text-red-700 transition-all font-medium hover:scale-105"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// Memory Feed Page
function MemoryFeedPage({ onHome, onNewPost, showToast }: { onHome: () => void; onNewPost: () => void; showToast?: (message: string, type?: ToastType) => void }) {
  const feedItems = [
    { id: 1, user: 'Sarah', action: 'added a photo', time: '2h ago', image: 'bg-gradient-to-br from-pink-400 to-rose-400', icon: Image, color: 'pink', photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop' },
    { id: 2, user: 'Mike', action: 'commented on', time: '4h ago', image: 'bg-gradient-to-br from-orange-400 to-amber-400', icon: MessageCircle, color: 'orange', photo: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop' },
    { id: 3, user: 'Emma', action: 'liked', time: '6h ago', image: 'bg-gradient-to-br from-yellow-400 to-amber-400', icon: Heart, color: 'yellow', photo: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=600&fit=crop' },
    { id: 4, user: 'Alex', action: 'shared a memory', time: '8h ago', image: 'bg-gradient-to-br from-blue-400 to-cyan-400', icon: Share2, color: 'blue', photo: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&h=600&fit=crop' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Memory Feed
            </h1>
            <p className="text-gray-600">See all activity from your scrapbook</p>
          </div>
          <button
            onClick={onNewPost}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            New Post
          </button>
        </div>

        <div className="space-y-4">
          {feedItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 ${item.image} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 text-lg">
                      <span className="font-bold text-gray-900">{item.user}</span>{' '}
                      <span className="text-gray-600">{item.action}</span> a memory
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-500">{item.time}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (showToast) showToast(`Viewing ${item.user}'s memory`, 'info')
                      // Navigate to memory view
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg hover:scale-105"
                  >
                    View
                  </button>
                </div>
                {item.photo && (
                  <div className="mt-4 rounded-xl overflow-hidden">
                    <img src={item.photo} alt={`${item.user}'s memory`} className="w-full h-64 object-cover" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Notes & Stickers Page
function NotesStickersPage({ onHome, onNewNote, showToast }: { onHome: () => void; onNewNote: () => void; showToast?: (message: string, type?: ToastType) => void }) {
  const [selectedTab, setSelectedTab] = useState<'notes' | 'stickers'>('notes')
  const [noteText, setNoteText] = useState('')
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null)
  const stickers = ['⭐', '❤️', '🎉', '📸', '🎨', '✨', '🌟', '💫', '🎊', '🎈', '🎁', '🏆', '🎯', '🔥', '💎', '🌈', '🚀', '🎪', '🎭', '🎬']

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Notes & Stickers
            </h1>
            <p className="text-gray-600">Add personal notes and fun stickers to your memories</p>
          </div>
          <button
            onClick={onNewNote}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            New Note
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex gap-4 mb-6 border-b-2 border-gray-200">
            <button
              onClick={() => setSelectedTab('notes')}
              className={`pb-3 px-6 font-semibold transition-all ${
                selectedTab === 'notes'
                  ? 'text-pink-600 border-b-3 border-pink-500 bg-gradient-to-b from-pink-50 to-transparent rounded-t-lg'
                  : 'text-gray-600 hover:text-pink-500'
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setSelectedTab('stickers')}
              className={`pb-3 px-6 font-semibold transition-all ${
                selectedTab === 'stickers'
                  ? 'text-pink-600 border-b-3 border-pink-500 bg-gradient-to-b from-pink-50 to-transparent rounded-t-lg'
                  : 'text-gray-600 hover:text-pink-500'
              }`}
            >
              Stickers
            </button>
          </div>

          {selectedTab === 'notes' ? (
            <div className="space-y-4">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full h-64 p-6 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300 text-gray-700 placeholder-gray-400 shadow-inner bg-gray-50/50"
                placeholder="Write your note here... ✨"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{noteText.length}/1000 characters</span>
                <button 
                  onClick={() => {
                    if (!noteText.trim()) {
                      if (showToast) showToast('Please write a note first', 'error')
                      return
                    }
                    if (showToast) showToast('Note saved successfully!', 'success')
                    setNoteText('')
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Save Note
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Choose a Sticker</h3>
              {selectedSticker && (
                <div className="mb-4 p-4 bg-pink-50 rounded-xl border-2 border-pink-200">
                  <p className="text-sm text-gray-600 mb-2">Selected sticker:</p>
                  <div className="text-4xl">{selectedSticker}</div>
                  <button
                    onClick={() => {
                      if (showToast) showToast(`Sticker ${selectedSticker} added!`, 'success')
                      setSelectedSticker(null)
                    }}
                    className="mt-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm"
                  >
                    Add to Memory
                  </button>
                </div>
              )}
              <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                {stickers.map((sticker, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSticker(sticker)}
                    className={`w-16 h-16 text-4xl bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl hover:from-pink-100 hover:to-purple-100 transition-all flex items-center justify-center shadow-md hover:shadow-xl hover:scale-125 hover:rotate-12 border-2 ${
                      selectedSticker === sticker ? 'border-pink-500 scale-125' : 'border-transparent hover:border-pink-300'
                    }`}
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
function LifePathPage({ onHome, onAddMilestone, showToast }: { onHome: () => void; onAddMilestone: () => void; showToast?: (message: string, type?: ToastType) => void }) {
  const milestones = [
    { year: '2024', title: 'New Adventures', description: 'Started new journey', color: 'bg-pink-300' },
    { year: '2023', title: 'Growth Year', description: 'Personal development', color: 'bg-orange-300' },
    { year: '2022', title: 'First Steps', description: 'Beginning of the story', color: 'bg-yellow-300' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-5xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Life-Path Journey
            </h1>
            <p className="text-gray-600">Trace your memories through time</p>
          </div>
          <button
            onClick={onAddMilestone}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Milestone
          </button>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-400 via-purple-400 to-blue-400 rounded-full"></div>
          <div className="space-y-8">
            {milestones.map((milestone, i) => {
              const gradients = [
                'from-pink-400 to-rose-400',
                'from-orange-400 to-amber-400',
                'from-yellow-400 to-amber-400',
              ]
              const gradient = gradients[i % gradients.length]
              return (
                <div key={i} className="flex items-start gap-6 relative group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center text-white font-bold z-10 shadow-lg group-hover:scale-125 transition-transform duration-300`}>
                    {milestone.year.slice(-2)}
                  </div>
                  <div 
                    onClick={() => {
                      if (showToast) showToast(`Viewing ${milestone.title}`, 'info')
                    }}
                    className="flex-1 bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 group-hover:scale-105 cursor-pointer"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{milestone.year}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Reflections Page
function ReflectionsPage({ onHome, onNewReflection, showToast }: { onHome: () => void; onNewReflection: () => void; showToast?: (message: string, type?: ToastType) => void }) {
  const reflections = [
    { id: 1, title: 'Summer Reflections', date: '2024-08-01', content: 'What an amazing summer...' },
    { id: 2, title: 'Growth Thoughts', date: '2024-07-15', content: 'I learned so much...' },
    { id: 3, title: 'Gratitude Journal', date: '2024-06-20', content: 'Grateful for...' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Reflections
            </h1>
            <p className="text-gray-600">Your personal thoughts and reflections</p>
          </div>
          <button
            onClick={onNewReflection}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            New Reflection
          </button>
        </div>

        <div className="space-y-4">
          {reflections.map((reflection, index) => {
            const gradients = [
              'from-pink-400 to-rose-400',
              'from-purple-400 to-indigo-400',
              'from-blue-400 to-cyan-400',
            ]
            const gradient = gradients[index % gradients.length]
            return (
              <div
                key={reflection.id}
                onClick={() => {
                  if (showToast) showToast(`Opening ${reflection.title}`, 'info')
                }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${gradient} group-hover:scale-150 transition-transform`}></div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors">{reflection.title}</h3>
                  </div>
                  <div className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full">
                    <span className="text-sm font-medium text-gray-700">{reflection.date}</span>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{reflection.content}</p>
                <div className="mt-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span className="text-xs text-gray-500">Reflection</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Memory Lane Page
function MemoryLanePage({ onHome, onAddMemory, showToast }: { onHome: () => void; onAddMemory: () => void; showToast?: (message: string, type?: ToastType) => void }) {
  const memories = [
    { month: 'January', year: '2024', count: 12, color: 'bg-pink-300' },
    { month: 'February', year: '2024', count: 8, color: 'bg-orange-300' },
    { month: 'March', year: '2024', count: 15, color: 'bg-yellow-300' },
    { month: 'April', year: '2024', count: 20, color: 'bg-blue-300' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Memory Lane
            </h1>
            <p className="text-gray-600">Walk through your memories chronologically</p>
          </div>
          <button
            onClick={onAddMemory}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Memory
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memories.map((memory, i) => {
            const gradients = [
              'from-pink-400 to-rose-400',
              'from-orange-400 to-amber-400',
              'from-yellow-400 to-amber-400',
              'from-blue-400 to-cyan-400',
            ]
            const gradient = gradients[i % gradients.length]
            return (
              <div
                key={i}
                onClick={() => {
                  if (showToast) showToast(`Viewing ${memory.month} ${memory.year} memories`, 'info')
                }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors">{memory.month}</h3>
                    <p className="text-gray-600">{memory.year}</p>
                  </div>
                  <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                    {memory.count}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(Math.min(memory.count, 8))].map((_, j) => (
                    <div key={j} className={`aspect-square bg-gradient-to-br ${gradient} rounded-lg opacity-60 hover:opacity-100 transition-opacity`}></div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Capture Moments Page
function CaptureMomentsPage({ onHome, onCapture, showToast }: { onHome: () => void; onCapture: () => void; showToast?: (message: string, type?: ToastType) => void }) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const fileArray = Array.from(files)
      const imageUrls = fileArray.map(file => URL.createObjectURL(file))
      setUploadedImages([...uploadedImages, ...imageUrls])
      if (showToast) showToast(`${fileArray.length} photo(s) selected`, 'success')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'))
      const imageUrls = fileArray.map(file => URL.createObjectURL(file))
      setUploadedImages([...uploadedImages, ...imageUrls])
      if (showToast) showToast(`${fileArray.length} photo(s) added`, 'success')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Capture Moments
            </h1>
            <p className="text-gray-600">Quick capture for special moments</p>
          </div>
          <button
            onClick={onCapture}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Camera className="w-5 h-5" />
            Capture Now
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            multiple
            className="hidden"
          />
          <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-pink-300 rounded-xl p-12 text-center mb-6 hover:border-pink-400 hover:bg-pink-50/50 transition-all cursor-pointer group"
          >
            <Camera className="w-16 h-16 text-pink-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-gray-700 mb-2 font-medium">Click to capture or drag photos here</p>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              Choose Photos
            </button>
          </div>
          {uploadedImages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Selected Photos ({uploadedImages.length})</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {uploadedImages.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt={`Upload ${i + 1}`} className="w-full aspect-square object-cover rounded-xl shadow-lg" />
                    <button
                      onClick={() => {
                        setUploadedImages(uploadedImages.filter((_, idx) => idx !== i))
                        if (showToast) showToast('Photo removed', 'info')
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  if (showToast) showToast('Photos captured successfully!', 'success')
                  setUploadedImages([])
                }}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                Save All Photos
              </button>
            </div>
          )}
          <div className="grid grid-cols-3 gap-4">
            {[...Array(Math.max(0, 6 - uploadedImages.length))].map((_, i) => {
              const gradients = [
                'from-pink-400 to-rose-400',
                'from-orange-400 to-amber-400',
                'from-purple-400 to-pink-400',
                'from-blue-400 to-cyan-400',
                'from-yellow-400 to-orange-400',
                'from-indigo-400 to-purple-400',
              ]
              const gradient = gradients[i % gradients.length]
              return (
                <div key={i} className={`aspect-square bg-gradient-to-br ${gradient} rounded-xl hover:scale-110 transition-transform cursor-pointer shadow-lg hover:shadow-xl opacity-50`}></div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Creative Memories Page
function CreativeMemoriesPage({ onHome, onCreateTemplate, showToast }: { onHome: () => void; onCreateTemplate: () => void; showToast?: (message: string, type?: ToastType) => void }) {
  const templates = [
    { name: 'Collage', icon: '🎨', color: 'bg-pink-300' },
    { name: 'Timeline', icon: '📅', color: 'bg-orange-300' },
    { name: 'Story', icon: '📖', color: 'bg-yellow-300' },
    { name: 'Gallery', icon: '🖼️', color: 'bg-blue-300' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Creative Memories
            </h1>
            <p className="text-gray-600">Express your creativity with templates</p>
          </div>
          <button
            onClick={onCreateTemplate}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Create Template
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template, i) => {
            const gradients = [
              'from-pink-400 to-rose-400',
              'from-orange-400 to-amber-400',
              'from-yellow-400 to-amber-400',
              'from-blue-400 to-cyan-400',
            ]
            const gradient = gradients[i % gradients.length]
            return (
              <div
                key={i}
                onClick={() => {
                  if (showToast) showToast(`Creating ${template.name} template...`, 'info')
                  onCreateTemplate()
                }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:scale-105"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-4xl mb-4 mx-auto shadow-lg group-hover:scale-125 transition-transform`}>
                  {template.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 text-center group-hover:text-pink-600 transition-colors">{template.name}</h3>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Scrapbook Showcase Page
function ScrapbookShowcasePage({ onHome, onNewScrapbook, showToast }: { onHome: () => void; onNewScrapbook: () => void; showToast?: (message: string, type?: ToastType) => void }) {
  const scrapbooks = [
    { title: 'Summer 2024', photos: 45, color: 'bg-pink-300' },
    { title: 'Family Reunion', photos: 32, color: 'bg-orange-300' },
    { title: 'Travel Diary', photos: 67, color: 'bg-yellow-300' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">Scrapbook Showcase</h1>
            <p className="text-gray-600">See your memories unfold</p>
          </div>
          <button
            onClick={onNewScrapbook}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            New Scrapbook
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scrapbooks.map((scrapbook, i) => (
            <div 
              key={i} 
              onClick={() => {
                if (showToast) showToast(`Opening ${scrapbook.title}`, 'info')
              }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl transition-all cursor-pointer group hover:scale-105"
            >
              <div className={`h-48 ${scrapbook.color} group-hover:opacity-90 transition-opacity`}></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">{scrapbook.title}</h3>
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
function MemoryMomentsPage({ onHome, onAddMoment, showToast }: { onHome: () => void; onAddMoment: () => void; showToast?: (message: string, type?: ToastType) => void }) {
  const moments = [
    { time: 'Morning', icon: '🌅', count: 8 },
    { time: 'Afternoon', icon: '☀️', count: 12 },
    { time: 'Evening', icon: '🌆', count: 15 },
    { time: 'Night', icon: '🌙', count: 5 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-5xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">Memory Moments</h1>
            <p className="text-gray-600">Capture the essence of different times</p>
          </div>
          <button
            onClick={onAddMoment}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Moment
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {moments.map((moment, i) => (
            <div 
              key={i} 
              onClick={() => {
                if (showToast) showToast(`Viewing ${moment.time} memories`, 'info')
              }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center hover:shadow-xl transition-all cursor-pointer group hover:scale-105"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{moment.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">{moment.time}</h3>
              <p className="text-gray-600">{moment.count} memories</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Craft Your Story Page
function CraftStoryPage({ onHome, onNewStory, showToast }: { onHome: () => void; onNewStory: () => void; showToast?: (message: string, type?: ToastType) => void }) {
  const [storyTitle, setStoryTitle] = useState('')
  const [storyContent, setStoryContent] = useState('')
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">Craft Your Story</h1>
            <p className="text-gray-600">Unleash your creativity</p>
          </div>
          <button
            onClick={onNewStory}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Edit3 className="w-5 h-5" />
            New Story
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Story Title</label>
            <input
              type="text"
              value={storyTitle}
              onChange={(e) => setStoryTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your story title"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Story</label>
            <textarea
              rows={12}
              value={storyContent}
              onChange={(e) => setStoryContent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Write your story here..."
            />
            <div className="mt-2 text-sm text-gray-500 text-right">{storyContent.length}/5000 characters</div>
          </div>
          <button 
            onClick={() => {
              if (!storyTitle.trim() || !storyContent.trim()) {
                if (showToast) showToast('Please fill in both title and story', 'error')
                return
              }
              if (showToast) showToast('Story saved successfully!', 'success')
              setStoryTitle('')
              setStoryContent('')
            }}
            className="px-6 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors hover:scale-105"
          >
            Save Story
          </button>
        </div>
      </div>
    </div>
  )
}

// Share Page
function SharePage({ onHome, onShare, showToast }: { onHome: () => void; onShare: () => void; showToast?: (message: string, type?: ToastType) => void }) {
  const [shareMethod, setShareMethod] = useState<'link' | 'email' | 'social'>('link')
  const [shareableLink] = useState('https://squadscrapbook.com/memories/abc123')
  const [emailAddress, setEmailAddress] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">Share Memories</h1>
            <p className="text-gray-600">Share your scrapbook with friends and family</p>
          </div>
          <button
            onClick={onShare}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Share2 className="w-5 h-5" />
            Share Now
          </button>
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
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(shareableLink)
                    if (showToast) showToast('Link copied to clipboard!', 'success')
                  }}
                  className="px-6 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors hover:scale-105"
                >
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
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="Enter email address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
              />
              <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
              <textarea
                rows={4}
                placeholder="Add a personal message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
              />
              <button 
                onClick={() => {
                  if (!emailAddress.trim()) {
                    if (showToast) showToast('Please enter an email address', 'error')
                    return
                  }
                  if (showToast) showToast(`Email sent to ${emailAddress}`, 'success')
                  setEmailAddress('')
                }}
                className="px-6 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors hover:scale-105"
              >
                Send Email
              </button>
            </div>
          )}

          {shareMethod === 'social' && (
            <div>
              <p className="text-gray-600 mb-4">Share to social media platforms</p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    if (showToast) showToast('Sharing to Facebook...', 'info')
                  }}
                  className="p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-center hover:scale-105"
                >
                  <div className="text-3xl mb-2">📘</div>
                  <span className="text-sm font-medium text-gray-700">Facebook</span>
                </button>
                <button 
                  onClick={() => {
                    if (showToast) showToast('Sharing to Twitter...', 'info')
                  }}
                  className="p-4 border border-gray-300 rounded-lg hover:bg-cyan-50 hover:border-cyan-300 transition-colors text-center hover:scale-105"
                >
                  <div className="text-3xl mb-2">🐦</div>
                  <span className="text-sm font-medium text-gray-700">Twitter</span>
                </button>
                <button 
                  onClick={() => {
                    if (showToast) showToast('Sharing to Instagram...', 'info')
                  }}
                  className="p-4 border border-gray-300 rounded-lg hover:bg-pink-50 hover:border-pink-300 transition-colors text-center hover:scale-105"
                >
                  <div className="text-3xl mb-2">📷</div>
                  <span className="text-sm font-medium text-gray-700">Instagram</span>
                </button>
                <button 
                  onClick={() => {
                    if (showToast) showToast('Sharing to LinkedIn...', 'info')
                  }}
                  className="p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-center hover:scale-105"
                >
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

// Memory Detail Page
function MemoryDetailPage({
  memoryId,
  onBack,
  showToast,
  showConfirm,
}: {
  memoryId: string | null
  onBack: () => void
  showToast: (message: string, type?: ToastType) => void
  showConfirm: (config: {
    title: string
    message: string
    onConfirm: () => void
    confirmText?: string
    cancelText?: string
    type?: 'warning' | 'danger'
  }) => void
}) {
  const [memory, setMemory] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedDescription, setEditedDescription] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])

  useEffect(() => {
    let isMounted = true // Prevent state updates if component unmounts
    
    async function fetchMemory() {
      if (!memoryId) {
        if (isMounted) setIsLoading(false)
        return
      }
      if (isMounted) setIsLoading(true)
      
      const { data, error } = await getMemoryById(memoryId)
      
      // Only update state if component is still mounted
      if (!isMounted) return
      
      if (error) {
        // Don't show error toast for RLS recursion errors (they'll spam)
        if (error.code !== '42P17') {
          showToast('Error fetching memory details', 'error')
        }
        // Only log once, not repeatedly
        if (error.code === '42P17') {
          console.warn('RLS policy recursion error. Please fix database policies.')
        } else {
          console.error('Error fetching memory details:', error)
        }
        setMemory(null)
      } else {
        setMemory(data)
        setEditedTitle(data?.title || '')
        setEditedDescription(data?.description || '')
        // Assuming image_url can be a comma-separated string or an array of URLs
        if (data?.image_url) {
          setImageUrls(data.image_url.split(',').filter(Boolean))
        } else {
          setImageUrls([])
        }
      }
      setIsLoading(false)
    }
    
    fetchMemory()
    
    // Cleanup function
    return () => {
      isMounted = false
    }
  }, [memoryId, showToast])

  const handleSave = async () => {
    if (!memory || !memoryId) return
    setIsLoading(true)

    const newImageUrls: string[] = [...imageUrls]
    for (const file of uploadedFiles) {
      const { url, error } = await uploadFile(file, 'memory_images')
      if (error) {
        showToast(`Error uploading file: ${file.name}`, 'error')
        setIsLoading(false)
        return
      }
      if (url) {
        newImageUrls.push(url)
      }
    }

    const updates: Partial<any> = {
      title: editedTitle,
      description: editedDescription,
      image_url: newImageUrls.join(','), // Store as comma-separated string
    }

    const { error } = await updateMemoryInDB(memoryId, updates)
    if (error) {
      showToast('Error saving memory', 'error')
      console.error('Error saving memory:', error)
    } else {
      showToast('Memory saved successfully!', 'success')
      setIsEditing(false)
      setUploadedFiles([])
      // Re-fetch memory to update UI with new data
      const { data: updatedMemory, error: fetchError } = await getMemoryById(memoryId)
      if (!fetchError && updatedMemory) {
        setMemory(updatedMemory)
        if (updatedMemory.image_url) {
          setImageUrls(updatedMemory.image_url.split(',').filter(Boolean))
        } else {
          setImageUrls([])
        }
      }
    }
    setIsLoading(false)
  }

  const handleDeleteImage = (urlToDelete: string) => {
    showConfirm({
      title: 'Delete Image',
      message: 'Are you sure you want to delete this image? This action cannot be undone.',
      onConfirm: async () => {
        if (!memory || !memoryId) return
        setIsLoading(true)
        const updatedImageUrls = imageUrls.filter(url => url !== urlToDelete)
        const updates: Partial<any> = {
          image_url: updatedImageUrls.join(','),
        }
        const { error } = await updateMemoryInDB(memoryId, updates)
        if (error) {
          showToast('Error deleting image', 'error')
          console.error('Error deleting image:', error)
        } else {
          showToast('Image deleted successfully!', 'success')
          setImageUrls(updatedImageUrls)
        }
        setIsLoading(false)
      },
      type: 'danger',
    })
  }

  const handleFilesSelected = (files: File[]) => {
    setUploadedFiles((prev) => [...prev, ...files])
    showToast(`${files.length} file(s) selected for upload`, 'info')
  }

  if (isLoading && !memory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
        <span className="ml-3 text-gray-700">Loading memory...</span>
      </div>
    )
  }

  if (!memory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8 text-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
        <div className="text-center py-12">
          <AlertCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Memory Not Found</h2>
          <p className="text-gray-600 mb-6">The memory you are looking for does not exist or could not be loaded.</p>
          <button onClick={onBack} className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all font-semibold">Go Back</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Dashboard</span>
      </button>

      <div className="mb-8 flex items-center justify-between">
        <div>
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-4xl font-bold bg-transparent border-b-2 border-pink-300 focus:outline-none focus:border-pink-500 mb-2"
            />
          ) : (
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {memory.title}
            </h1>
          )}
          {isEditing ? (
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-pink-500 text-gray-600"
              rows={2}
            />
          ) : (
            <p className="text-gray-600">{memory.description}</p>
          )}
        </div>
        {isEditing ? (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
              disabled={isLoading}
            >
              <Save className="w-5 h-5" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                setEditedTitle(memory.title)
                setEditedDescription(memory.description || '')
                setUploadedFiles([])
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Edit3 className="w-5 h-5" />
            Edit Memory
          </button>
        )}
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Memory Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <img src={url} alt={`Memory image ${index + 1}`} className="w-full h-64 object-cover" />
              {isEditing && (
                <button
                  onClick={() => handleDeleteImage(url)}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                  title="Delete Image"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Images</h3>
            <DragDropUpload onFilesSelected={handleFilesSelected} />
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-3">Files to Upload:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {uploadedFiles.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <span>{file.name}</span>
                      <button
                        onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4 text-gray-700">
          <p>
            <span className="font-semibold">Category:</span> {memory.category}
          </p>
          <p>
            <span className="font-semibold">Date:</span> {memory.date}
          </p>
          {memory.location && (
            <p>
              <span className="font-semibold">Location:</span> {memory.location}
            </p>
          )}
          {memory.story && (
            <p>
              <span className="font-semibold">Story:</span> {memory.story}
            </p>
          )}
          {memory.notes && (
            <p>
              <span className="font-semibold">Notes:</span> {memory.notes}
            </p>
          )}
          {memory.tags && memory.tags.length > 0 && (
            <p>
              <span className="font-semibold">Tags:</span> {memory.tags.join(', ')}
            </p>
          )}
          {memory.mood && (
            <p>
              <span className="font-semibold">Mood:</span> {memory.mood}
            </p>
          )}
          {memory.source && (
            <p>
              <span className="font-semibold">Source:</span> {memory.source}
            </p>
          )}
          {memory.highlights && (
            <p>
              <span className="font-semibold">Highlights:</span> {memory.highlights}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// Calendar Page
function CalendarPage({ onHome, onAddToCalendar, showToast }: { onHome: () => void; onAddToCalendar: () => void; showToast?: (message: string, type?: ToastType) => void }) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const memoriesByDate = [
    { date: '2024-08-15', count: 5, title: 'Beach Day' },
    { date: '2024-08-20', count: 3, title: 'Birthday Party' },
    { date: '2024-08-25', count: 8, title: 'Family Reunion' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">Memory Calendar</h1>
            <p className="text-gray-600">View your memories by date</p>
          </div>
          <button
            onClick={onAddToCalendar}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add to Calendar
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      if (currentMonth === 0) {
                        setCurrentMonth(11)
                        setCurrentYear(currentYear - 1)
                      } else {
                        setCurrentMonth(currentMonth - 1)
                      }
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronDown className="w-4 h-4 rotate-90" />
                  </button>
                  <button 
                    onClick={() => {
                      if (currentMonth === 11) {
                        setCurrentMonth(0)
                        setCurrentYear(currentYear + 1)
                      } else {
                        setCurrentMonth(currentMonth + 1)
                      }
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
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
                      onClick={() => {
                        const newDate = new Date(dateStr)
                        setSelectedDate(newDate)
                        if (hasMemory && showToast) {
                          const memory = memoriesByDate.find(m => m.date === dateStr)
                          showToast(`${memory?.count || 0} memories on this date`, 'info')
                        }
                      }}
                      className={`aspect-square flex flex-col items-center justify-center text-xs rounded-lg transition-colors ${
                        hasMemory
                          ? 'bg-pink-100 text-pink-700 hover:bg-pink-200 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${selectedDate.toISOString().split('T')[0] === dateStr ? 'ring-2 ring-pink-500' : ''}`}
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
function FavoritesPage({ onHome, onAddFavorite, showToast }: { onHome: () => void; onAddFavorite: () => void; showToast?: (message: string, type?: ToastType) => void }) {
  const [favorites, setFavorites] = useState([
    { id: 1, title: 'Summer Beach Trip', date: '2024-07-15', likes: 45, color: 'bg-pink-200', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', isFavorite: true },
    { id: 2, title: 'Birthday Celebration', date: '2024-06-20', likes: 32, color: 'bg-orange-200', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop', isFavorite: true },
    { id: 3, title: 'Hiking Adventure', date: '2024-05-10', likes: 67, color: 'bg-yellow-200', image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=600&fit=crop', isFavorite: true },
    { id: 4, title: 'Family Reunion', date: '2024-08-01', likes: 89, color: 'bg-blue-200', image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&h=600&fit=crop', isFavorite: true },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">Favorites</h1>
            <p className="text-gray-600">Your favorite memories</p>
          </div>
          <button
            onClick={onAddFavorite}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Heart className="w-5 h-5" />
            Add Favorite
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <div 
              key={favorite.id} 
              onClick={() => {
                if (showToast) showToast(`Viewing ${favorite.title}`, 'info')
              }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer group hover:scale-105"
            >
              <div className={`w-full h-48 ${favorite.color} relative overflow-hidden`}>
                <img src={favorite.image} alt={favorite.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    setFavorites(favorites.filter(f => f.id !== favorite.id))
                    if (showToast) showToast('Removed from favorites', 'success')
                  }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-pink-50 transition-colors z-10"
                >
                  <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">{favorite.title}</h3>
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
function StarredPage({ onHome, onStarMemory, showToast }: { onHome: () => void; onStarMemory: () => void; showToast?: (message: string, type?: ToastType) => void }) {
  const [starred, setStarred] = useState([
    { id: 1, title: 'Creating Lasting Memories', subtitle: 'Team Adventure', progress: 75, color: 'bg-pink-300', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop', isStarred: true },
    { id: 2, title: 'Memory Lane', subtitle: 'Creative Group', progress: 50, color: 'bg-orange-300', image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop', isStarred: true },
    { id: 3, title: 'Year 1 vs Year 4', subtitle: 'Team Spirit', progress: 30, color: 'bg-yellow-300', image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&h=600&fit=crop', isStarred: true },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-8">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">Starred Memories</h1>
            <p className="text-gray-600">Your starred and important memories</p>
          </div>
          <button
            onClick={onStarMemory}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Star className="w-5 h-5" />
            Star Memory
          </button>
        </div>

        <div className="space-y-4">
          {starred.map((item) => (
            <div 
              key={item.id} 
              onClick={() => {
                if (showToast) showToast(`Viewing ${item.title}`, 'info')
              }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl transition-all cursor-pointer group hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className={`w-24 h-24 ${item.color} rounded-lg flex-shrink-0 overflow-hidden group-hover:scale-110 transition-transform`}>
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.subtitle}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setStarred(starred.filter(s => s.id !== item.id))
                        if (showToast) showToast('Unstarred memory', 'success')
                      }}
                      className="p-1 hover:bg-yellow-50 rounded-lg transition-colors"
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pink-300 rounded-full transition-all"
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

// Add Detail Pages
function AddCollaboratorPage({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('contributor')

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-2xl mx-auto p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Add Collaborator
          </h1>
          <p className="text-gray-600">Invite someone to collaborate on your scrapbook</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter collaborator name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300"
              >
                <option value="contributor">Contributor</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                onClick={onBack}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold"
              >
                Cancel
              </button>
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl">
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AddMemoryPage({ onBack }: { onBack: () => void }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [tags, setTags] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-3xl mx-auto p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Add Memory
          </h1>
          <p className="text-gray-600">Create a new memory for your scrapbook</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Memory Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter memory title"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this memory..."
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., vacation, family, summer"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Photos</label>
              <div className="border-2 border-dashed border-pink-300 rounded-xl p-8 text-center hover:bg-pink-50 transition-colors cursor-pointer">
                <Image className="w-12 h-12 text-pink-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                onClick={onBack}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold"
              >
                Cancel
              </button>
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl">
                Save Memory
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NewNotePage({ onBack }: { onBack: () => void }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [sticker, setSticker] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-2xl mx-auto p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            New Note
          </h1>
          <p className="text-gray-600">Add a note or sticker to your memories</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Note Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Note Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note..."
                rows={8}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Add Sticker</label>
              <div className="grid grid-cols-6 gap-3">
                {['😊', '❤️', '⭐', '🎉', '🌟', '💫', '🎈', '🎁', '🌈', '✨', '💝', '🎊'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setSticker(emoji)}
                    className={`text-3xl p-3 rounded-xl hover:bg-pink-50 transition-colors ${
                      sticker === emoji ? 'bg-pink-100 ring-2 ring-pink-400' : ''
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                onClick={onBack}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold"
              >
                Cancel
              </button>
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl">
                Save Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NewPostPage({ onBack }: { onBack: () => void }) {
  const [content, setContent] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-2xl mx-auto p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            New Post
          </h1>
          <p className="text-gray-600">Share something with your scrapbook community</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="space-y-6">
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                rows={8}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
                <Image className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
                <Video className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
                <MapPin className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
                <Smile className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                onClick={onBack}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold"
              >
                Cancel
              </button>
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AddFavoritePage({ onBack }: { onBack: () => void }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [likedMemories, setLikedMemories] = useState<Set<number>>(new Set())
  const memories = [
    { id: 1, title: 'Summer Beach Trip', date: '2024-07-15', likes: 45, color: 'bg-pink-200', description: 'A wonderful day at the beach with friends and family', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop' },
    { id: 2, title: 'Birthday Celebration', date: '2024-06-20', likes: 32, color: 'bg-orange-200', description: 'Celebrating another year of amazing memories', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop' },
    { id: 3, title: 'Hiking Adventure', date: '2024-05-10', likes: 67, color: 'bg-yellow-200', description: 'Exploring nature trails and beautiful landscapes', image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=600&fit=crop' },
    { id: 4, title: 'Family Reunion', date: '2024-08-01', likes: 89, color: 'bg-blue-200', description: 'Reconnecting with loved ones after so long', image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&h=600&fit=crop' },
    { id: 5, title: 'Graduation Day', date: '2024-05-25', likes: 120, color: 'bg-purple-200', description: 'A milestone achievement worth celebrating', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop' },
    { id: 6, title: 'Wedding Anniversary', date: '2024-06-10', likes: 95, color: 'bg-green-200', description: 'Another year of love and happiness together', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop' },
  ]

  const filteredMemories = memories.filter((memory) =>
    memory.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleLike = (id: number) => {
    setLikedMemories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Browse Memories
          </h1>
          <p className="text-gray-600">Like memories to add them to your favorites</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memories..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredMemories.map((memory) => {
            const isLiked = likedMemories.has(memory.id)
            return (
              <div
                key={memory.id}
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`h-48 ${memory.color} relative`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-pink-600 transition-colors">
                        {memory.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">{memory.date}</p>
                      <p className="text-gray-600">{memory.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(memory.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium ${
                          isLiked
                            ? 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-pink-600 text-pink-600' : ''}`} />
                        <span>{isLiked ? 'Liked' : 'Like'}</span>
                        {isLiked && <span className="ml-1 text-xs">✓ Added to Favorites</span>}
                      </button>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Heart className="w-4 h-4 text-pink-400" />
                        <span className="text-sm">{memory.likes} likes</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-gray-600 hover:text-pink-600 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StarMemoryPage({ onBack }: { onBack: () => void }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [starredMemories, setStarredMemories] = useState<Set<number>>(new Set())
  const memories = [
    { id: 1, title: 'Creating Lasting Memories', subtitle: 'Team Adventure', progress: 75, color: 'bg-pink-300', description: 'A collaborative journey through our shared experiences', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop' },
    { id: 2, title: 'Memory Lane', subtitle: 'Creative Group', progress: 50, color: 'bg-orange-300', description: 'Walking down the path of beautiful moments', image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop' },
    { id: 3, title: 'Year 1 vs Year 4', subtitle: 'Team Spirit', progress: 30, color: 'bg-yellow-300', description: 'Comparing our growth and transformation over time', image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&h=600&fit=crop' },
    { id: 4, title: 'Summer Collection', subtitle: 'Vacation Memories', progress: 90, color: 'bg-blue-300', description: 'Sunny days and warm memories from summer trips', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' },
    { id: 5, title: 'Family Moments', subtitle: 'Special Times', progress: 65, color: 'bg-purple-300', description: 'Cherished moments with the people we love most', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop' },
    { id: 6, title: 'Adventure Series', subtitle: 'Travel Stories', progress: 40, color: 'bg-green-300', description: 'Exploring new places and creating unforgettable stories', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop' },
  ]

  const filteredMemories = memories.filter((memory) =>
    memory.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleStar = (id: number) => {
    setStarredMemories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Browse Memories
          </h1>
          <p className="text-gray-600">Star memories to mark them as important</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memories..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredMemories.map((memory) => {
            const isStarred = starredMemories.has(memory.id)
            return (
              <div
                key={memory.id}
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`h-48 ${memory.color} relative overflow-hidden`}>
                  <img src={memory.image} alt={memory.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-pink-600 transition-colors">
                        {memory.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">{memory.subtitle}</p>
                      <p className="text-gray-600 mb-3">{memory.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-xs">
                          <div
                            className="h-full bg-pink-300 rounded-full"
                            style={{ width: `${memory.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{memory.progress}% complete</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleStar(memory.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium ${
                        isStarred
                          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${isStarred ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                      <span>{isStarred ? 'Starred' : 'Star'}</span>
                      {isStarred && <span className="ml-1 text-xs">✓ Added</span>}
                    </button>
                    <button className="px-4 py-2 text-gray-600 hover:text-pink-600 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function AddMilestonePage({ onBack }: { onBack: () => void }) {
  const [year, setYear] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-2xl mx-auto p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Add Milestone
          </h1>
          <p className="text-gray-600">Mark an important moment in your journey</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g., 2024"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Milestone Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter milestone title"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this milestone..."
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button
                onClick={onBack}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold"
              >
                Cancel
              </button>
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl">
                Add Milestone
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NewReflectionPage({ onBack }: { onBack: () => void }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-2xl mx-auto p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 mb-6 transition-all hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            New Reflection
          </h1>
          <p className="text-gray-600">Capture your thoughts and reflections</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter reflection title"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Reflection</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your reflection..."
                rows={10}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button
                onClick={onBack}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold"
              >
                Cancel
              </button>
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl">
                Save Reflection
              </button>
            </div>
          </div>
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

// Landing Page Component
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

export default function ScrapbookHome() {
  const [page, setPage] = useState<Page>('landing')
  const [selectedGroupName, setSelectedGroupName] = useState<string>('')
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmDialogConfig, setConfirmDialogConfig] = useState<{
    title: string
    message: string
    onConfirm: () => void
    confirmText?: string
    cancelText?: string
    type?: 'warning' | 'danger'
  } | null>(null)
  
  // Toast helper functions
  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }
  
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }
  
  const showConfirm = (config: {
    title: string
    message: string
    onConfirm: () => void
    confirmText?: string
    cancelText?: string
    type?: 'warning' | 'danger'
  }) => {
    setConfirmDialogConfig(config)
    setShowConfirmDialog(true)
  }
  
  // Handle page transitions with animation
  const handlePageChange = (newPage: Page) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setPage(newPage)
      setIsTransitioning(false)
    }, 150)
  }

  if (page === 'landing') {
    return (
      <div className={isTransitioning ? 'opacity-0 transition-opacity duration-150' : 'opacity-100 transition-opacity duration-300'}>
        <ScrapbookLanding onStart={() => handlePageChange('home')} />
      </div>
    )
  }

  // Helper to wrap pages with navigation
  const withNav = (pageContent: React.ReactNode) => (
    <PageWithNav currentPage={page} onNavigate={handlePageChange}>
      <div className={isTransitioning ? 'opacity-0 transition-opacity duration-150' : 'opacity-100 transition-opacity duration-300'}>
        {pageContent}
      </div>
    </PageWithNav>
  )

  if (page === 'home') {
    return withNav(
      <ScrapbookHomeContent
        onDiscover={() => handlePageChange('discover')}
        onCreate={() => handlePageChange('create')}
        onProfile={() => handlePageChange('profile')}
        onYears={() => handlePageChange('years')}
        onSettings={() => handlePageChange('settings')}
        onEditMemories={() => handlePageChange('editMemories')}
        onMemoryFeed={() => handlePageChange('memoryFeed')}
        onNotesStickers={() => handlePageChange('notesStickers')}
        onLifePath={() => handlePageChange('lifePath')}
        onReflections={() => handlePageChange('reflections')}
        onMemoryLane={() => handlePageChange('memoryLane')}
        onCaptureMoments={() => handlePageChange('captureMoments')}
        onCreativeMemories={() => handlePageChange('creativeMemories')}
        onScrapbookShowcase={() => handlePageChange('scrapbookShowcase')}
        onMemoryMoments={() => handlePageChange('memoryMoments')}
        onCraftStory={() => handlePageChange('craftStory')}
        onDashboard={() => {
          setSelectedGroupName('Your Scrapbook')
          handlePageChange('dashboard')
        }}
        onExplore={() => handlePageChange('explore')}
      />
    )
  }

  if (page === 'explore') {
    return (
      <div className={isTransitioning ? 'opacity-0 transition-opacity duration-150' : 'opacity-100 transition-opacity duration-300'}>
        <ExplorePage
          onViewDashboard={(groupName) => {
            setSelectedGroupName(groupName)
            handlePageChange('dashboard')
            showToast(`Viewing ${groupName}`, 'success')
          }}
          onBack={() => handlePageChange('home')}
          showToast={showToast}
        />
      </div>
    )
  }

  if (page === 'dashboard') {
    const dashboardContent = (
      <MemoryDashboard
        groupName={selectedGroupName || 'Your Scrapbook'}
        onBack={() => {
          if (selectedGroupName === 'Your Scrapbook') {
            handlePageChange('home')
          } else {
            handlePageChange('explore')
          }
        }}
        onExplore={() => handlePageChange('explore')}
        showToast={showToast}
        showConfirm={showConfirm}
        onViewMemory={(memoryId) => {
          setSelectedMemoryId(memoryId)
          handlePageChange('memoryDetail')
        }}
      />
    )
    
    // If dashboard is "Your Scrapbook", wrap with nav for editing access
    if (selectedGroupName === 'Your Scrapbook') {
      return withNav(dashboardContent)
    }
    
    // Otherwise, it's a public dashboard from explore - no nav, no editing
    return dashboardContent
  }

  if (page === 'discover') {
    return withNav(
      <DiscoverPage
        onHome={() => handlePageChange('home')}
        onCreate={() => handlePageChange('create')}
        onProfile={() => handlePageChange('profile')}
        onMemoryFeed={() => handlePageChange('memoryFeed')}
        onDiscover={() => handlePageChange('discover')}
        onLifePath={() => handlePageChange('lifePath')}
        onShare={() => handlePageChange('share')}
        onCapture={() => handlePageChange('captureMoments')}
        onCalendar={() => handlePageChange('calendar')}
        onFavorites={() => handlePageChange('favorites')}
        onStarred={() => handlePageChange('starred')}
        showToast={showToast}
      />
    )
  }

  if (page === 'create') {
    return withNav(<CreateMemoryPage onHome={() => {
          handlePageChange('home')
        }} onSettings={() => handlePageChange('settings')} showToast={showToast} />)
  }

  if (page === 'profile') {
    return withNav(
      <ProfilePage
        onHome={() => handlePageChange('home')}
        onSettings={() => handlePageChange('settings')}
        onAddCollaborator={() => handlePageChange('addCollaborator')}
        showToast={showToast}
      />
    )
  }

  if (page === 'settings') {
    return withNav(<SettingsPage onHome={() => {
          handlePageChange('home')
        }} showToast={showToast} />)
  }

  if (page === 'years') {
    return withNav(<ScrapbookYearsPage onHome={() => {
          handlePageChange('home')
        }} onAddYear={() => handlePageChange('addYear')} showToast={showToast} />)
  }

  if (page === 'editMemories') {
    return withNav(<EditMemoriesPage onHome={() => {
      handlePageChange('home')
    }} onAddMemory={() => handlePageChange('addMemory')} showToast={showToast} showConfirm={showConfirm} />)
  }

  if (page === 'memoryFeed') {
    return withNav(<MemoryFeedPage onHome={() => {
          handlePageChange('home')
        }} onNewPost={() => handlePageChange('newPost')} showToast={showToast} />)
  }

  if (page === 'notesStickers') {
    return withNav(<NotesStickersPage onHome={() => {
          handlePageChange('home')
        }} onNewNote={() => handlePageChange('newNote')} showToast={showToast} />)
  }

  if (page === 'lifePath') {
    return withNav(<LifePathPage onHome={() => {
          handlePageChange('home')
        }} onAddMilestone={() => handlePageChange('addMilestone')} showToast={showToast} />)
  }

  if (page === 'reflections') {
    return withNav(<ReflectionsPage onHome={() => {
          handlePageChange('home')
        }} onNewReflection={() => handlePageChange('newReflection')} showToast={showToast} />)
  }

  if (page === 'memoryLane') {
    return withNav(<MemoryLanePage onHome={() => {
          handlePageChange('home')
        }} onAddMemory={() => handlePageChange('addMemory')} showToast={showToast} />)
  }

  if (page === 'captureMoments') {
    return withNav(<CaptureMomentsPage onHome={() => {
          handlePageChange('home')
        }} onCapture={() => handlePageChange('addMemory')} showToast={showToast} />)
  }

  if (page === 'creativeMemories') {
    return withNav(<CreativeMemoriesPage onHome={() => {
          handlePageChange('home')
        }} onCreateTemplate={() => handlePageChange('createTemplate')} />)
  }

  if (page === 'scrapbookShowcase') {
    return withNav(<ScrapbookShowcasePage onHome={() => {
          handlePageChange('home')
        }} onNewScrapbook={() => handlePageChange('newScrapbook')} showToast={showToast} />)
  }

  if (page === 'memoryMoments') {
    return withNav(<MemoryMomentsPage onHome={() => {
          setPage('home')
        }} onAddMoment={() => setPage('addMoment')} />)
  }

  if (page === 'craftStory') {
    return withNav(<CraftStoryPage onHome={() => {
          handlePageChange('home')
        }} onNewStory={() => handlePageChange('newStory')} showToast={showToast} />)
  }

  if (page === 'share') {
    return withNav(<SharePage onHome={() => {
          handlePageChange('home')
        }} onShare={() => {}} showToast={showToast} />)
  }

  if (page === 'calendar') {
    return withNav(<CalendarPage onHome={() => {
          handlePageChange('home')
        }} onAddToCalendar={() => handlePageChange('addToCalendar')} showToast={showToast} />)
  }

  if (page === 'favorites') {
    return withNav(<FavoritesPage onHome={() => {
          handlePageChange('home')
        }} onAddFavorite={() => handlePageChange('addFavorite')} showToast={showToast} />)
  }

  if (page === 'starred') {
    return withNav(<StarredPage onHome={() => {
          handlePageChange('home')
        }} onStarMemory={() => handlePageChange('starMemory')} showToast={showToast} />)
  }

  // Add Detail Pages
  if (page === 'addCollaborator') {
    return withNav(<AddCollaboratorPage onBack={() => setPage('profile')} />)
  }

  if (page === 'addMemory') {
    return withNav(<AddMemoryPage onBack={() => setPage('editMemories')} />)
  }

  if (page === 'newPost') {
    return withNav(<NewPostPage onBack={() => setPage('memoryFeed')} />)
  }

  if (page === 'newNote') {
    return withNav(<NewNotePage onBack={() => setPage('notesStickers')} />)
  }

  if (page === 'addMilestone') {
    return withNav(<AddMilestonePage onBack={() => setPage('lifePath')} />)
  }

  if (page === 'newReflection') {
    return withNav(<NewReflectionPage onBack={() => setPage('reflections')} />)
  }

  if (page === 'addMoment') {
    return withNav(<AddMemoryPage onBack={() => setPage('memoryMoments')} />)
  }

  if (page === 'createTemplate') {
    return withNav(<AddMemoryPage onBack={() => setPage('creativeMemories')} />)
  }

  if (page === 'newScrapbook') {
    return withNav(<AddMemoryPage onBack={() => setPage('scrapbookShowcase')} />)
  }

  if (page === 'newStory') {
    return withNav(<AddMemoryPage onBack={() => setPage('craftStory')} />)
  }

  if (page === 'addToCalendar') {
    return withNav(<AddMemoryPage onBack={() => setPage('calendar')} />)
  }

  if (page === 'addFavorite') {
    return withNav(<AddFavoritePage onBack={() => setPage('favorites')} />)
  }

  if (page === 'starMemory') {
    return withNav(<StarMemoryPage onBack={() => setPage('starred')} />)
  }

  if (page === 'addYear') {
    return withNav(<AddMilestonePage onBack={() => handlePageChange('years')} />)
  }

  if (page === 'memoryDetail') {
    return withNav(
      <MemoryDetailPage
        memoryId={selectedMemoryId}
        onBack={() => {
          // Go back to previous page (could be dashboard, editMemories, etc.)
          if (selectedGroupName) {
            handlePageChange('dashboard')
          } else {
            handlePageChange('editMemories')
          }
        }}
        showToast={showToast}
        showConfirm={showConfirm}
      />
    )
  }

  // Default to landing page (should not reach here)
  return <ScrapbookLanding onStart={() => handlePageChange('home')} />
}
