import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileCard = ({ profile, isDarkMode = false, rank = 0 }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [expandedStyle, setExpandedStyle] = useState({});
  const [tapCount, setTapCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const tapTimeoutRef = useRef(null);
  const cardRef = useRef(null);
  const expandedRef = useRef(null);

  // ตรวจว่าหน้าจอเป็นมือถือหรือไม่
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // คำนวณตำแหน่งรูปขยาย
  useEffect(() => {
    if (!isHovered || !cardRef.current) return;

    const updateExpandedPosition = () => {
      const cardRect = cardRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const top = cardRect.bottom + scrollY + 10;
      const left = cardRect.left + cardRect.width / 2;
      const expandedWidth = 192;
      const viewportWidth = window.innerWidth;
      const expandedHalfWidth = expandedWidth / 2;
      let adjustedLeft = left;

      if (left - expandedHalfWidth < 10) {
        adjustedLeft = expandedHalfWidth + 10;
      } else if (left + expandedHalfWidth > viewportWidth - 10) {
        adjustedLeft = viewportWidth - expandedHalfWidth - 10;
      }

      setExpandedStyle({
        top: `${top}px`,
        left: `${adjustedLeft}px`,
        transform: 'translateX(-50%)',
      });
    };

    updateExpandedPosition();
    window.addEventListener('resize', updateExpandedPosition);
    window.addEventListener('scroll', updateExpandedPosition);
    return () => {
      window.removeEventListener('resize', updateExpandedPosition);
      window.removeEventListener('scroll', updateExpandedPosition);
    };
  }, [isHovered]);

  // ปิดภาพขยายเมื่อ scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsHovered(false);
      setTapCount(0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // จัดการคลิกบนมือถือ/เดสก์ท็อป
  const handleCardClick = () => {
    if (isMobile) {
      if (tapCount === 0) {
        setIsHovered(true);
        setTapCount(1);
        tapTimeoutRef.current = setTimeout(() => {
          setTapCount(0);
          setIsHovered(false);
        }, 3000);
      } else {
        clearTimeout(tapTimeoutRef.current);
        setTapCount(0);
        setIsHovered(false);
        navigate(`/profile/${encodeURIComponent(profile.name)}`);
      }
    } else {
      navigate(`/profile/${encodeURIComponent(profile.name)}`);
    }
  };

  const hoverBgClass = isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const borderClass = isDarkMode ? 'border-gray-600 hover:border-blue-400' : 'border-gray-200 hover:border-blue-400';
  const textClass = isDarkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-800 hover:text-blue-600';

  const rankColors = {
    1: {
      primary: 'yellow',
      secondary: 'orange',
      accent: 'red',
      border: 'border-yellow-400',
      shadow: 'shadow-yellow-500/50',
      text: 'text-yellow-300',
      icon: '⭐'
    },
    2: {
      primary: 'gray',
      secondary: 'slate',
      accent: 'blue',
      border: 'border-gray-400',
      shadow: 'shadow-gray-500/50',
      text: 'text-gray-300',
      icon: '✨'
    },
    3: {
      primary: 'orange',
      secondary: 'amber',
      accent: 'yellow',
      border: 'border-orange-400',
      shadow: 'shadow-orange-500/50',
      text: 'text-orange-300',
      icon: '🔥'
    }
  };

  const isTopThree = rank > 0 && rank <= 3;
  const rankStyle = rankColors[rank];

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      className={`profile-card cursor-pointer hover:shadow-lg transition-all duration-300 text-center rounded-lg ${hoverBgClass} relative pt-2 ${isTopThree ? 'relative overflow-visible' : ''}`}
    >
      <div className="relative group">
        {/* ป้าย HOT อันดับ 1-3 */}
        {isTopThree && (
          <div className="absolute -top-3 left-0 z-10 p-0 flex justify-center">
            <div className={`
              w-5 h-5 flex items-center justify-center rounded-full text-md font-bold text-white 
              shadow-lg dark:border-gray-800
              transform transition-all duration-700 ease-in-out
              group-hover:scale-125 group-hover:-translate-y-1
              hover:shadow-xl hover:ring-2 hover:ring-white/50
              animate-bounce-gentle
              ${rank === 1 ? 'animate-pulse-gold' : rank === 2 ? 'animate-pulse-silver' : 'animate-pulse-bronze'}
            `}>
              {rank === 1 ? '👑' : rank === 2 ? '🥈' : '🥉'}
            </div>
          </div>
        )}

        {/* Border Animations */}
        {isTopThree && (
          <>
            <div className={`absolute inset-0 rounded-full opacity-75 ${
              rank === 1 ? 'animate-ping-gold' : rank === 2 ? 'animate-ping-silver' : 'animate-ping-bronze'
            }`}>
              <div className={`w-full h-full rounded-full blur-sm ${
                rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                rank === 2 ? 'bg-gradient-to-r from-gray-400 to-blue-400' :
                'bg-gradient-to-r from-orange-400 to-amber-500'
              }`}></div>
            </div>
            <div className="absolute inset-[-2px] rounded-full animate-rotate-border opacity-90">
              <div className={`w-full h-full rounded-full ${
                rank === 1 ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500' :
                rank === 2 ? 'bg-gradient-to-r from-gray-400 via-slate-500 to-blue-500' :
                'bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500'
              }`}></div>
            </div>
            <div className={`absolute inset-[-1px] rounded-full ${
              rank === 1 ? 'animate-pulse-ring-gold' :
              rank === 2 ? 'animate-pulse-ring-silver' :
              'animate-pulse-ring-bronze'
            }`}>
              <div className={`w-full h-full rounded-full border-2 ${
                rank === 1 ? 'border-yellow-400' :
                rank === 2 ? 'border-gray-400' :
                'border-orange-400'
              }`}></div>
            </div>
          </>
        )}

        {/* รูปภาพโปรไฟล์ */}
        <img
          src={profile.image}
          alt={profile.name}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = '';
            setImageLoaded(true);
          }}
          className={`profile-image w-16 h-16 md:w-18 md:h-18 rounded-full object-cover object-top mx-auto border-2 transition-all duration-300 ${
            isTopThree ? `${rankStyle.border} ${rankStyle.shadow} shadow-lg relative z-10` : borderClass
          } ${isHovered ? 'scale-90 opacity-80' : 'group-hover:scale-105'}`}
        />

        {/* Sparkles */}
        {isTopThree && (
          <>
            <div className={`absolute top-0 right-1 w-2 h-2 rounded-full opacity-0 ${
              rank === 1 ? 'bg-red-300 animate-sparkle-1' :
              rank === 2 ? 'bg-blue-300 animate-sparkle-1' :
              'bg-orange-300 animate-sparkle-1'
            }`}></div>
            <div className={`absolute bottom-2 left-0 w-1.5 h-1.5 rounded-full opacity-0 ${
              rank === 1 ? 'bg-orange-300 animate-sparkle-2' :
              rank === 2 ? 'bg-gray-300 animate-sparkle-2' :
              'bg-amber-300 animate-sparkle-2'
            }`}></div>
            <div className={`absolute top-3 -right-1 w-1 h-1 rounded-full opacity-0 ${
              rank === 1 ? 'bg-red-300 animate-sparkle-3' :
              rank === 2 ? 'bg-slate-300 animate-sparkle-3' :
              'bg-yellow-300 animate-sparkle-3'
            }`}></div>
          </>
        )}

        {/* ภาพขยาย */}
        {isHovered && imageLoaded && (
          <div
            ref={expandedRef}
            className="expanded-image-container fixed z-50 cursor-pointer"
            style={expandedStyle}
          >
            <div className="expanded-image-wrapper bg-white dark:bg-gray-800 rounded-lg shadow-2xl relative overflow-hidden">
              {isTopThree && (
                <div className="absolute top-2 left-[-24px] z-20 transform -rotate-45">
                  <div className={`w-22 text-center py-1 text-xs font-bold text-white ${
                    rank === 1 ? 'bg-red-500' :
                    rank === 2 ? 'bg-orange-500' :
                    'bg-yellow-500'
                  } shadow-md drop-shadow-md`}>
                    👑 HOT {rank}
                  </div>
                </div>
              )}

              <img
                src={profile.image}
                alt={profile.name}
                className="expanded-image w-40 h-48 md:w-48 md:h-64 object-cover pointer-events-none"
              />

              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                <h3 className="font-bold text-sm truncate">{profile.name}</h3>
                <p className="text-xs truncate">{profile.videoCount} 部作品</p>
                {isTopThree && (
                  <p className={`text-xs font-semibold mt-1 ${rankStyle.text}`}>
                    🏆 热门演员 #{rank}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <h3 className={`text-sm md:text-base font-semibold truncate px-1 transition-colors ${textClass} ${
        isTopThree ? 'relative z-10' : ''
      }`}>
        {profile.name}
        {isTopThree && (
          <span className={`inline-block ml-1 animate-pulse ${
            rank === 1 ? 'text-yellow-500' :
            rank === 2 ? 'text-gray-400' :
            'text-orange-500'
          }`}>
            {rankStyle.icon}
          </span>
        )}
      </h3>
    </div>
  );
};

export default ProfileCard;
