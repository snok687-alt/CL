// VideoCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FireIcon from '../hook/Fire_Icon'

const VideoCard = ({ video, onClick, isDarkMode }) => {
  const navigate = useNavigate();

  const recordView = async (videoId) => {
    try {
      await fetch('/api/views/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ video_id: videoId }),
      });
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการบันทึกการดู:', error);
    }
  };

  const handleVideoClick = () => {
    recordView(video.id);
    if (onClick) {
      onClick(video);
    } else {
      navigate(`/watch/${video.id}`);
    }
  };

  const formatViews = (views) => {
    const viewCount = views || 0;
    if (viewCount >= 1000000) {
      return {
        text: `${(viewCount / 1000000).toFixed(1)}M 看`,
        isPopular: true,
        level: 'mega'
      };
    }
    if (viewCount >= 1000) {
      return {
        text: `${(viewCount / 1000).toFixed(0)}K 看`,
        isPopular: true,
        level: 'popular'
      };
    }
    return {
      text: `${viewCount} 看`,
      isPopular: false,
      level: 'normal'
    };
  };

  const handleImageError = (e) => {
    e.target.src = '';
  };

  const viewData = formatViews(video.views);

  return (
    <div
      className={`rounded-md overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 animate-fadeInUp ${isDarkMode ? 'bg-white' : 'bg-white'
        }`}
      onClick={handleVideoClick}
    >
      <div className="relative aspect-[6/4] bg-gray-700 overflow-hidden group">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500  group-hover:scale-125"
          loading="lazy"
          decodeing="async"
          onError={handleImageError}
        />

        {viewData.isPopular && (
          <div className="absolute top-1 right-1">
            <div className={`flex items-center pr-0 rounded-full text-xs font-semibold ${viewData.level === 'mega'
                ? 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white border-purple-300/30'
                : ''
              }`}>
              <div className="-mr-1 -mt-1 fire-icon-container">
                <FireIcon />
              </div>
              {viewData.level === 'mega' ? 'HOT 🔥' : ''}
            </div>
          </div>
        )}
      </div>

      <div className="px-2 py-1">
        <p className={`font-medium text-xs leading-tight truncate whitespace-nowrap overflow-hidden ${isDarkMode ? 'text-gray-900 ' : 'text-black'
          }`} title={video.title}>
          {video.title}
        </p>

        <div className={`flex items-center justify-between text-xs ${isDarkMode ? 'text-gray-900' : 'text-gray-400'
          }`}>
          <div className="flex items-center">
            {viewData.isPopular && (
              <div className="-mt-1 -mr-1 fire-icon-container">
                <FireIcon />
              </div>
            )}
            <span className={`text-xs ${viewData.isPopular ? 'font-semibold' : ''} ${viewData.level === 'mega'
              ? 'text-purple-400'
              : viewData.level === 'popular'
                ? 'text-orange-400'
                : isDarkMode ? 'text-gray-900' : 'text-gray-400'
              }`}>
              {viewData.text}
            </span>
          </div>
          <span className="mx-1.5">•</span>
          <span className='text-xs'>{video.uploadDate}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;