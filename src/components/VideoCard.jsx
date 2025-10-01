// VideoCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

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

  // คอมโพเนนต์ไอคอนไฟแบบ SVG
  const FireIcon = () => (
    <div className="mo-fire">
      <svg
        version="1.1"
        viewBox="0 0 125 189.864"
        preserveAspectRatio="xMidYMid meet"
      >
        <path className="flame-main" fill="#F36E21" d="M76.553,186.09c0,0-10.178-2.976-15.325-8.226s-9.278-16.82-9.278-16.82s-0.241-6.647-4.136-18.465
          c0,0,3.357,4.969,5.103,9.938c0,0-5.305-21.086,1.712-30.418c7.017-9.333,0.571-35.654-2.25-37.534c0,0,13.07,5.64,19.875,47.54
          c6.806,41.899,16.831,45.301,6.088,53.985"/>
        <path className="flame-main one" fill="#F6891F" d="M61.693,122.257c4.117-15.4,12.097-14.487-11.589-60.872c0,0,32.016,10.223,52.601,63.123
          c20.585,52.899-19.848,61.045-19.643,61.582c0.206,0.537-19.401-0.269-14.835-18.532S57.576,137.656,61.693,122.257z"/>
        <path className="flame-main two" fill="#FFD04A" d="M81.657,79.192c0,0,11.549,24.845,3.626,40.02c-7.924,15.175-21.126,41.899-0.425,64.998
          C84.858,184.21,125.705,150.905,81.657,79.192z"/>
        <path className="flame-main three" fill="#FDBA16" d="M99.92,101.754c0,0-23.208,47.027-12.043,80.072c0,0,32.741-16.073,20.108-45.79
          C95.354,106.319,99.92,114.108,99.92,101.754z"/>
        <path className="flame-main four" fill="#F36E21" d="M103.143,105.917c0,0,8.927,30.753-1.043,46.868c-9.969,16.115-14.799,29.041-14.799,29.041
          S134.387,164.603,103.143,105.917z"/>
        <path className="flame-main five" fill="#FDBA16" d="M62.049,104.171c0,0-15.645,67.588,10.529,77.655C98.753,191.894,69.033,130.761,62.049,104.171z" />
        <path className="flame" fill="#F36E21" d="M101.011,112.926c0,0,8.973,10.519,4.556,16.543C99.37,129.735,106.752,117.406,101.011,112.926z" />
        <path className="flame one" fill="#F36E21" d="M55.592,126.854c0,0-3.819,13.29,2.699,16.945C64.038,141.48,55.907,132.263,55.592,126.854z" />
        <path className="flame two" fill="#F36E21" d="M54.918,104.595c0,0-3.959,6.109-1.24,8.949C56.93,113.256,52.228,107.329,54.918,104.595z" />
      </svg>
    </div>
  );

  const viewData = formatViews(video.views);

  return (
    <div
      className={`rounded-md overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 animate-fadeInUp ${isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      onClick={handleVideoClick}
    >
      <div className="relative aspect-[6/4] bg-gray-700 overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full  hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={handleImageError}
        />
        <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 opacity-0 hover:opacity-100 group">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300 border border-white/20">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
        </div>

        {viewData.isPopular && (
          <div className="absolute top-1 right-1">
            <div className={`flex items-center px-1 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${viewData.level === 'mega'
              ? 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white border-purple-300/30'
              : 'bg-gradient-to-r from-orange-500/80 to-red-600/80 text-white border-orange-300/30'
              }`}>
              <div className="mr-1 -mt-1 fire-icon-container">
                <FireIcon />
              </div>
              {viewData.level === 'mega' ? 'HOT 🔥' : '热门'}
            </div>
          </div>
        )}
      </div>

      <div className="px-2 py-1">
        <p className={`font-medium text-xs leading-tight truncate whitespace-nowrap overflow-hidden ${isDarkMode ? 'text-white' : 'text-black'
          }`} title={video.title}>
          {video.title}
        </p>

        <div className={`flex items-center justify-around text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
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
                : isDarkMode ? 'text-gray-500' : 'text-gray-400'
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