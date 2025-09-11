import React, { useRef, useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import profiles from '../data/profiles';

const ProfileCarousel = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
  }, []);

  const scrollByAmount = 300;

  return (
    <div className="relative max-w-7xl mx-auto">
      <div className="relative">
        {/* ปุ่มซ้าย */}
        {canScrollLeft && (
          <button
            onClick={() => (scrollRef.current.scrollLeft -= scrollByAmount)}
            className="absolute left-0 top-1/3 -translate-y-1/3 z-10 bg-white border border-gray-200 shadow-lg hover:bg-gray-100 transition rounded-full"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}

        {/* ตัวแถวแนวนอน */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scroll-smooth no-scrollbar pt-2"
        >
          {profiles.map((profile) => (
            <div key={profile.id} className="flex-shrink-0 w-15 md:w-16 lg:w-20">
              <ProfileCard profile={profile} />
            </div>
          ))}
        </div>

        {/* ปุ่มขวา */}
        {canScrollRight && (
          <button
            onClick={() => (scrollRef.current.scrollLeft += scrollByAmount)}
            className="absolute right-0 top-1/3 -translate-y-1/3 z-10 bg-white border border-gray-200 shadow-lg hover:bg-gray-100 transition rounded-full"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileCarousel;