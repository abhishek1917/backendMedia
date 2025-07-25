import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { Play, Eye, Clock } from 'lucide-react'

const VideoCard = ({ video }) => {
  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  const formatDuration = (duration) => {
    return duration
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-200 overflow-hidden">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {formatDuration(video.duration)}
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Play className="w-12 h-12 text-white fill-current" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Channel Avatar & Info */}
        <div className="flex items-start space-x-3">
          <img 
            src={video.owner.avatar} 
            alt={video.owner.fullname}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          
          <div className="flex-1 min-w-0">
            {/* Title */}
            <Link 
              to={`/video/${video._id}`}
              className="block font-semibold text-gray-900 hover:text-primary-600 transition-colors duration-200 line-clamp-2"
            >
              {video.title}
            </Link>
            
            {/* Channel Name */}
            <Link 
              to={`/channel/${video.owner.username}`}
              className="text-gray-600 hover:text-gray-900 text-sm mt-1 block"
            >
              {video.owner.fullname}
            </Link>
            
            {/* Views & Date */}
            <div className="flex items-center text-gray-500 text-sm mt-1 space-x-2">
              <div className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                {formatViews(video.views)} views
              </div>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mt-3 line-clamp-2">
          {video.description}
        </p>
      </div>
    </div>
  )
}

export default VideoCard