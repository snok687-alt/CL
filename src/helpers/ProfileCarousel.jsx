// components/ProfileCarousel.jsx

import React, { useRef, useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import profiles from '../data/profiles';  // นำเข้าข้อมูลจากไฟล์เดียวกัน

const ProfileCarousel = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    ref.addEventListener('scroll', checkScroll);
    return () => ref.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollByAmount = 300;

  return (
    <div className="relative max-w-2xl mt-2 mx-auto">
      <div className="relative">
        {/* ปุ่มซ้าย */}
        {canScrollLeft && (
          <button
            onClick={() => (scrollRef.current.scrollLeft -= scrollByAmount)}
            className="absolute left-0 top-1/3 -translate-y-1/3 z-10 bg-white border border-gray-200 shadow-lg hover:bg-gray-100 transition rounded-full p-2"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {/* ตัวแถวแนวนอน */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scroll-smooth space-x-2 no-scrollbar px-2"
        >
          {profiles.map((profile) => (
            <div key={profile.id} className="flex-shrink-0 w-16">
              <ProfileCard profile={profile} />
            </div>
          ))}
        </div>

        {/* ปุ่มขวา */}
        {canScrollRight && (
          <button
            onClick={() => (scrollRef.current.scrollLeft += scrollByAmount)}
            className="absolute right-0 top-1/3 -translate-y-1/3 z-10 bg-white border border-gray-200 shadow-lg hover:bg-gray-100 transition rounded-full p-2"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileCarousel;