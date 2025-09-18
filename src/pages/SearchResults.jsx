import React, { useEffect, useState } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { searchVideos, getVideosByCategory } from '../data/videoData';

const SearchResults = () => {
  // ດຶງຂໍ້ມູນຈາກ React Router
  const location = useLocation();
  const { isDarkMode, searchTerm, setSearchTerm } = useOutletContext();
  
  // State ສຳລັບຈັດການຂໍ້ມູນ
  const [results, setResults] = useState([]); // ເກັບຜົນການຄ້ນຫາ
  const [loading, setLoading] = useState(true); // ສະຖານະການໂຫລດ

  // ດຶງຄຳຄ້ນຫາຈາກຫຼາຍແຫຼ່ງ
  const searchQuery = location.state?.searchTerm || // ຈາກ navigation state
    new URLSearchParams(location.search).get('q') || // ຈາກ URL query parameter
    searchTerm || // ຈາກ context
    ''; // ຄ່າເລີ່ມຕົ້ນ

  // ກວດສອບວ່າຢູ່ໜ້າແລກ ແລະ ບໍ່ມີການຄ້ນຫາ
  const isHomePage = location.pathname === '/' && !searchQuery;

  // Effect ສຳລັບໂຫລດຂໍ້ມູນເມື່ອມີການປ່ຽນແປງ
  useEffect(() => {
    if (isHomePage) {
      // ຖ້າເປັນໜ້າແລກ, ໂຫລດວິດີໂອຈາກໝວດໝູ່ ID 32
      loadCategoryVideos('32');
    } else if (searchQuery) {
      // ຖ້າມີຄຳຄ້ນຫາ, ອັບເດດ search term ແລະ ຄ້ນຫາ
      setSearchTerm(searchQuery);
      performSearch(searchQuery);
    } else {
      // ຖ້າບໍ່ມີເງື່ອນໄຂໃດໆ, ລຶບຂໍ້ມູນ
      setResults([]);
      setLoading(false);
    }
    
    // Cleanup function ສຳລັບຍົກເລີກ API calls ທີ່ບໍ່ຈຳເປັນ
    return () => {
      // ປົກກະຕິຈະໃຊ້ AbortController ໃນນີ້
    };
  }, [searchQuery, setSearchTerm, isHomePage]);

  /**
   * ໂຫລດວິດີໂອຈາກໝວດໝູ່ທີ່ກຳນົດ
   * @param {string} categoryId - ID ຂອງໝວດໝູ່
   */
  const loadCategoryVideos = async (categoryId) => {
    setLoading(true);
    try {
      const categoryVideos = await getVideosByCategory(categoryId);
      setResults(categoryVideos);
    } catch (error) {
      console.error('Error loading category videos:', error);
      setResults([]); // ຖ້າມີ error, ເຊັດຜົນລັບເປັນ array ວ່າງ
    } finally {
      setLoading(false); // ເສັດ loading ເປັນ false ເມື່ອເສັດແລ້ວ
    }
  };

  /**
   * ດຳເນີນການຄ້ນຫາວິດີໂອ
   * @param {string} query - ຄຳຄ້ນຫາ
   */
  const performSearch = async (query) => {
    setLoading(true);

    try {
      const searchResults = await searchVideos(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Error searching videos:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect ສຳລັບຟັງ event ຈາກໜ້າອື່ນໆ
  useEffect(() => {
    /**
     * ຈັດການ custom event ເມື່ອມີການອັບເດດການຄ້ນຫາ
     * @param {CustomEvent} event - Event ທີ່ມີຂໍ້ມູນຄຳຄ້ນຫາໃໝ່
     */
    const handleSearchUpdated = (event) => {
      const newSearchTerm = event.detail;
      setSearchTerm(newSearchTerm);
      performSearch(newSearchTerm);
    };

    // ລົງທະບຽນ event listener
    window.addEventListener('searchUpdated', handleSearchUpdated);

    // ລຶບ event listener ເມື່ອ component unmount
    return () => {
      window.removeEventListener('searchUpdated', handleSearchUpdated);
    };
  }, []);

  // ສະແດງໜ້າ loading
  if (loading) {
    return (
      <div className={`min-h-screen p-4 md:p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            {/* Loading spinner */}
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {isHomePage ? 'กำลังโหลดวิดีโอ...' : 'กำลังค้นหาวิดีโอ...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ສະແດງເນື້ອຫາຫຼັກ
  return (
    <div className={`min-h-screen p-4 md:p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto">
        {/* ຫົວຂໍ້ຫຼັກ */}
        <h1 className={`text-xl md:text-2xl text-start font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          {isHomePage ? '国产视频' : searchQuery ? `ผลการค้นหาสำหรับ: "${searchQuery}"` : 'ค้นหาวิดีโอ'}
        </h1>

        {/* ສະແດງຜົນລັບ ຫຼື ຂໍ້ຄວາມເມື່ອບໍ່ມີຂໍ້ມູນ */}
        {results.length === 0 && !isHomePage ? (
          // ບໍ່ພົບຜົນການຄ້ນຫາ
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-lg mb-2">ไม่พบผลลัพธ์การค้นหา</p>
            <p className="text-sm">ลองใช้คำค้นหาอื่นหรือลองค้นด้วยแท็ก</p>
          </div>
        ) : results.length === 0 && isHomePage ? (
          // ບໍ່ມີວິດີໂອໃນໝວດໝູ່
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-lg mb-2">ไม่มีวิดีโอในหมวดหมู่นี้</p>
          </div>
        ) : results.length === 0 ? (
          // ເລີ່ມຕົ້ນການຄ້ນຫາ
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-lg mb-2">เริ่มต้นการค้นหา</p>
            <p className="text-sm">พิมพ์คำค้นหาในช่องด้านบนเพื่อค้นหาวิดีโอ</p>
          </div>
        ) : (
          <>
            {/* ສະແດງຈຳນວນຜົນລັບ (ສຳລັບການຄ້ນຫາເທົ່ານັ້ນ) */}
            {!isHomePage && (
              <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                พบ {results.length} วิดีโอ
              </p>
            )}
            
            {/* Grid ສະແດງວິດີໂອ */}
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
              {results.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;