import { useState, useEffect } from 'react'
import VideoCard from '../components/Video/VideoCard'
import VideoGrid from '../components/Video/VideoGrid'
import SearchBar from '../components/Search/SearchBar'
import FilterTabs from '../components/Filter/FilterTabs'

// Sample video data
const sampleVideos = [
  {
    _id: '1',
    title: 'React Tutorial for Beginners',
    description: 'Learn React from scratch with this comprehensive tutorial',
    thumbnail: 'https://img.youtube.com/vi/SqcY0GlETPk/maxresdefault.jpg',
    duration: '45:30',
    views: 125000,
    createdAt: '2024-01-15',
    owner: {
      username: 'techguru',
      fullname: 'Tech Guru',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    _id: '2',
    title: 'JavaScript ES6 Features',
    description: 'Explore the latest JavaScript ES6 features and syntax',
    thumbnail: 'https://img.youtube.com/vi/NCwa_xi0Uuc/maxresdefault.jpg',
    duration: '32:15',
    views: 89000,
    createdAt: '2024-01-12',
    owner: {
      username: 'jsmaster',
      fullname: 'JS Master',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    _id: '3',
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js',
    thumbnail: 'https://img.youtube.com/vi/fBNz5xF-Kx4/maxresdefault.jpg',
    duration: '1:12:45',
    views: 67000,
    createdAt: '2024-01-10',
    owner: {
      username: 'nodedev',
      fullname: 'Node Developer',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    _id: '4',
    title: 'CSS Grid Layout Masterclass',
    description: 'Master CSS Grid with practical examples and projects',
    thumbnail: 'https://img.youtube.com/vi/jV8B24rSN5o/maxresdefault.jpg',
    duration: '28:20',
    views: 45000,
    createdAt: '2024-01-08',
    owner: {
      username: 'cssexpert',
      fullname: 'CSS Expert',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    _id: '5',
    title: 'MongoDB Database Design',
    description: 'Learn how to design efficient MongoDB databases',
    thumbnail: 'https://img.youtube.com/vi/ZS_kXvOeQ5Y/maxresdefault.jpg',
    duration: '55:10',
    views: 78000,
    createdAt: '2024-01-05',
    owner: {
      username: 'dbarchitect',
      fullname: 'DB Architect',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    _id: '6',
    title: 'Docker for Developers',
    description: 'Containerize your applications with Docker',
    thumbnail: 'https://img.youtube.com/vi/3c-iBn73dDE/maxresdefault.jpg',
    duration: '41:35',
    views: 92000,
    createdAt: '2024-01-03',
    owner: {
      username: 'devops_pro',
      fullname: 'DevOps Pro',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  }
]

const categories = ['All', 'Programming', 'Web Development', 'Database', 'DevOps', 'Frontend']

const Home = () => {
  const [videos, setVideos] = useState(sampleVideos)
  const [filteredVideos, setFilteredVideos] = useState(sampleVideos)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    filterVideos()
  }, [activeCategory, searchQuery])

  const filterVideos = () => {
    let filtered = videos

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(video => 
        video.title.toLowerCase().includes(activeCategory.toLowerCase()) ||
        video.description.toLowerCase().includes(activeCategory.toLowerCase())
      )
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.owner.fullname.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredVideos(filtered)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to VideoTube
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Discover amazing videos from creators around the world
        </p>
        
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Filter Tabs */}
      <FilterTabs 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Stats */}
      <div className="mb-8 flex items-center justify-between">
        <div className="text-gray-600">
          Showing {filteredVideos.length} videos
        </div>
        <div className="text-sm text-gray-500">
          Total views: {videos.reduce((sum, video) => sum + video.views, 0).toLocaleString()}
        </div>
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <VideoGrid videos={filteredVideos} />
      )}

      {/* No results */}
      {!loading && filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No videos found</div>
          <div className="text-gray-400">Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  )
}

export default Home


