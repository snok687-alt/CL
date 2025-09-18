import React, { useRef, useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getActors } from '../data/videoData';

// ຄອມໂປເນັນສຳລັບສະແດງລາຍການນັກສະແດງແບບເລື່ອນໄດ້
const ProfileCarousel = ({ isDarkMode = false }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);

  // ດຶງຂໍ້ມູນນັກສະແດງຈາກ API
  useEffect(() => {
    const fetchActors = async () => {
      try {
        setLoading(true);
        const actorData = await getActors(20); // ດຶງນັກສະແດງ 20 ຄົນແຮກ
        setActors(actorData);
      } catch (error) {
        console.error('Error fetching actors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActors();
  }, []);

  // ຕວດສອບວ່າສາມາດເລື່ອນໄດ້ຫຼືບໍ່
  const checkScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  // ລົງທະບຽນ event listener ສຳລັບການ scroll
  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', checkScroll);
      return () => ref.removeEventListener('scroll', checkScroll);
    }
  }, [actors]); // ຕວດສອບໃໝ່ເມື່ອຂໍ້ມູນນັກສະແດງປ່ຽນແປງ

  // ລະຍະທາງການເລື່ອນແຕ່ລະຄັ້ງ (pixel)
  const scrollByAmount = 300;

  // CSS class ສຳລັບໂໝດສີແຕ່ງ
  const skeletonClass = isDarkMode ? 'bg-gray-700' : 'bg-gray-300';
  const buttonBgClass = isDarkMode ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 shadow-gray-900/20' : 'bg-white border-gray-200 shadow-lg hover:bg-gray-100';
  const buttonTextClass = isDarkMode ? 'text-gray-300' : 'text-gray-700';

  // ສະແດງ skeleton loading ຂະນະຂໍ້ມູນຍັງບໍ່ໂຫຼດ
  if (loading) {
    return (
      <div className="relative max-w-7xl mx-auto">
        <div className="flex overflow-x-auto no-scrollbar pt-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-15 md:w-16 lg:w-20 mx-2">
              <div className="animate-pulse">
                {/* Skeleton ສຳລັບຮູບໂປຣໄຟລ໌ */}
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${skeletonClass} mx-auto`}></div>
                {/* Skeleton ສຳລັບຊື່ */}
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
        {/* ປຸ່ມເລື່ອນຊ້າຍ - ສະແດງເມື່ອສາມາດເລື່ອນຊ້າຍໄດ້ */}
        {canScrollLeft && (
          <button
            onClick={() => (scrollRef.current.scrollLeft -= scrollByAmount)}
            className={`absolute left-0 top-1/3 -translate-y-1/3 z-10 ${buttonBgClass} transition rounded-full p-1`}
            aria-label="ເລື່ອນຊ້າຍ"
          >
            <ChevronLeft className={`w-6 h-6 ${buttonTextClass}`} />
          </button>
        )}

        {/* ຕົວແຖວແນວນອນສຳລັບສະແດງນັກສະແດງ */}
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

        {/* ປຸ່ມເລື່ອນຂວາ - ສະແດງເມື່ອສາມາດເລື່ອນຂວາໄດ້ */}
        {canScrollRight && (
          <button
            onClick={() => (scrollRef.current.scrollLeft += scrollByAmount)}
            className={`absolute right-0 top-1/3 -translate-y-1/3 z-10 ${buttonBgClass} transition rounded-full p-1`}
            aria-label="ເລື່ອນຂວາ"
          >
            <ChevronRight className={`w-6 h-6 ${buttonTextClass}`} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileCarousel;