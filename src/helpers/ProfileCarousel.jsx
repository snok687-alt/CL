import React, { useRef, useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getActors } from '../data/videoData';

const ProfileCarousel = ({ isDarkMode = false }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลนักแสดงจาก API
  useEffect(() => {
    const fetchActors = async () => {
      try {
        setLoading(true);
        const actorData = await getActors(20); // ดึงนักแสดง 20 คนแรก
        setActors(actorData);
      } catch (error) {
        console.error('Error fetching actors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActors();
  }, []);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', checkScroll);
      return () => ref.removeEventListener('scroll', checkScroll);
    }
  }, [actors]); // ตรวจสอบใหม่เมื่อข้อมูลนักแสดงเปลี่ยนแปลง

  const scrollByAmount = 300;

  // Dynamic classes for theming
  const skeletonClass = isDarkMode ? 'bg-gray-700' : 'bg-gray-300';
  const buttonBgClass = isDarkMode ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 shadow-gray-900/20' : 'bg-white border-gray-200 shadow-lg hover:bg-gray-100';
  const buttonTextClass = isDarkMode ? 'text-gray-300' : 'text-gray-700';

  if (loading) {
    return (
      <div className="relative max-w-7xl mx-auto">
        <div className="flex overflow-x-auto pt-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-15 md:w-16 lg:w-20 mx-2">
              <div className="animate-pulse">
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${skeletonClass} mx-auto`}></div>
                <div className={`h-4 ${skeletonClass} rounded mt-2 mx-2`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto">
      <div className="relative">
        {/* ปุ่มซ้าย */}
        {canScrollLeft && (
          <button
            onClick={() => (scrollRef.current.scrollLeft -= scrollByAmount)}
            className={`absolute left-0 top-1/3 -translate-y-1/3 z-10 ${buttonBgClass} transition rounded-full p-1`}
            aria-label="เลื่อนซ้าย"
          >
            <ChevronLeft className={`w-6 h-6 ${buttonTextClass}`} />
          </button>
        )}

        {/* ตัวแถวแนวนอน */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scroll-smooth no-scrollbar pt-2"
        >
          {actors.map((actor) => (
            <div key={actor.id} className="flex-shrink-0 w-15 md:w-16 lg:w-20">
              <ProfileCard profile={actor} isDarkMode={isDarkMode} />
            </div>
          ))}
        </div>

        {/* ปุ่มขวา */}
        {canScrollRight && (
          <button
            onClick={() => (scrollRef.current.scrollLeft += scrollByAmount)}
            className={`absolute right-0 top-1/3 -translate-y-1/3 z-10 ${buttonBgClass} transition rounded-full p-1`}
            aria-label="เลื่อนขวา"
          >
            <ChevronRight className={`w-6 h-6 ${buttonTextClass}`} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileCarousel;