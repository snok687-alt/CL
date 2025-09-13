import React from 'react';
import { useNavigate } from 'react-router-dom';

const VideoCard = ({ video, onClick, isDarkMode }) => {
  const navigate = useNavigate();

  const handleVideoClick = () => {
    if (onClick) {
      onClick(video);
    } else {
      navigate(`/watch/${video.id}`);
    }
  };

// ຄຳນວນຍອດເບິ່ງ - ใช้ข้อมูลจาก props โดยตรง
const formatViews = (views) => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M ดู`;
  if (views >= 1000) return `${(views / 1000).toFixed(0)}K ดู`;
  return `${views} ดู`;
};

  // ฟังก์ชันตรวจสอบว่าภาพโหลดสำเร็จหรือไม่
  const handleImageError = (e) => {
    e.target.src = '';
  };

  return (
    <div
      className={`rounded-md overflow-hidden shadow-md hover:shadow-lg py-1 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      onClick={handleVideoClick}
    >
      <div className="relative aspect-[6/5] bg-gray-700 overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={handleImageError}
        />
        <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 opacity-0 hover:opacity-100 group">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300 border border-white/20">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className=" px-2 pt-1">
        <p className={`font-medium text-xs leading-tight truncate whitespace-nowrap overflow-hidden ${isDarkMode ? 'text-white' : 'text-black'
          }`} title={video.title}>
          {video.title}
        </p>

        <div className={`flex items-center justify-around text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
          <span className='text-sx'>{formatViews(video.views)}</span>
          <span className="mx-1.5">•</span>
          <span className='text-sx'>{video.uploadDate}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;