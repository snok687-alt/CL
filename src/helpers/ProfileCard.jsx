import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileCard = ({ profile, isDarkMode = false }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [expandedPosition, setExpandedPosition] = useState({ top: 0, left: 0 });
  const [expandedStyle, setExpandedStyle] = useState({});
  const [arrowClass, setArrowClass] = useState('arrow-center');
  const cardRef = useRef(null);
  const expandedRef = useRef(null);

  const handleClick = () => {
    navigate(`/profile/${encodeURIComponent(profile.name)}`);
  };

  // อัพเดทตำแหน่งการแสดงภาพขยาย
  useEffect(() => {
    if (!isHovered || !cardRef.current) return;

    const updateExpandedPosition = () => {
      const cardRect = cardRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      
      // คำนวณตำแหน่งให้แสดงด้านล่างของโปรไฟล์
      const top = cardRect.bottom + scrollY + 10;
      const left = cardRect.left + (cardRect.width / 2);
      
      setExpandedPosition({ top, left });

      // ตรวจสอบและปรับตำแหน่งให้ไม่ถูกตัดที่ขอบหน้าจอ
      const expandedWidth = 192; // w-48 = 192px
      const viewportWidth = window.innerWidth;
      const expandedHalfWidth = expandedWidth / 2;
      
      let adjustedLeft = left;
      let newArrowClass = 'arrow-center';

      // ตรวจสอบขอบซ้าย (เหลือที่ว่างน้อยกว่า 10px)
      if (left - expandedHalfWidth < 10) {
        adjustedLeft = expandedHalfWidth + 10;
        newArrowClass = 'arrow-left';
      }
      // ตรวจสอบขอบขวา (เหลือที่ว่างน้อยกว่า 10px)
      else if (left + expandedHalfWidth > viewportWidth - 10) {
        adjustedLeft = viewportWidth - expandedHalfWidth - 10;
        newArrowClass = 'arrow-right';
      }

      setExpandedStyle({
        top: `${top}px`,
        left: `${adjustedLeft}px`,
        transform: 'translateX(-50%)'
      });

      setArrowClass(newArrowClass);
    };

    updateExpandedPosition();
    window.addEventListener('resize', updateExpandedPosition);
    window.addEventListener('scroll', updateExpandedPosition);
    
    return () => {
      window.removeEventListener('resize', updateExpandedPosition);
      window.removeEventListener('scroll', updateExpandedPosition);
    };
  }, [isHovered]);

  // เพิ่ม useEffect เพื่อปิดภาพขยายเมื่อ scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsHovered(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic classes based on theme
  const hoverBgClass = isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const borderClass = isDarkMode ? 'border-gray-600 hover:border-blue-400' : 'border-gray-200 hover:border-blue-400';
  const textClass = isDarkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-800 hover:text-blue-600';

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      className={`profile-card cursor-pointer hover:shadow-lg transition-all duration-300 text-center rounded-lg ${hoverBgClass} relative`}
    >
      <div className="relative group">
        <img
          src={profile.image}
          alt={profile.name}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = '';
            setImageLoaded(true);
          }}
          className={`profile-image w-14 h-16 md:w-16 md:h-18 rounded-md mx-auto object-cover border-1 ${borderClass} transition-all duration-300 ${
            isHovered ? 'scale-90 opacity-80' : 'group-hover:scale-105'
          }`}
        />
        
        {/* Expanded Image - แสดงด้านล่าง */}
        {isHovered && imageLoaded && (
          <div
            ref={expandedRef}
            className="expanded-image-container fixed z-50 pointer-events-none"
            style={expandedStyle}
          >
            <div className="expanded-image-wrapper bg-white dark:bg-gray-800 rounded-lg shadow-2xl pt-2 relative">
              <img
                src={profile.image}
                alt={profile.name}
                className="expanded-image w-40 h-48 md:w-48 md:h-64 object-cover rounded-md"
              />
              {/* ลูกศรชี้บอกตำแหน่ง - ปรับตามขอบ */}
              <div 
                className={`absolute -top-2 w-3 h-3 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-600 ${arrowClass}`}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      <h3 className={`text-sm md:text-base font-semibold truncate px-1 transition-colors ${textClass}`}>
        {profile.name}
      </h3>
    </div>
  );
};

export default ProfileCard;