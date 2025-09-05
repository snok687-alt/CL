import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { getCategoryName, getFilterName } from '../utils/Category';
import { fetchVideosFromAPI, getVideosByCategory, searchVideos, getMoreVideosInCategory, getAllVideosByCategory } from '../data/videoData';

// Skeleton Loading Component
const VideoCardSkeleton = ({ isDarkMode }) => (
  <div className={`rounded-lg overflow-hidden shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
    <div className="relative aspect-[3/4] bg-gray-600 animate-pulse"></div>
    <div className="p-3">
      <div className={`h-4 bg-gray-600 rounded mb-2 animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
      <div className={`h-3 bg-gray-600 rounded mb-1 animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
      <div className={`h-3 bg-gray-600 rounded w-2/3 animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
    </div>
  </div>
);

const VideoGrid = ({ title, filter }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingAllData, setLoadingAllData] = useState(false);
  const [backgroundLoadProgress, setBackgroundLoadProgress] = useState(0);
  const { searchTerm, isDarkMode } = useOutletContext();
  const location = useLocation();
  const backgroundLoadRef = useRef(null);

  // ตรวจสอบว่าเป็น path category หรือไม่
  const isCategoryPage = location.pathname.startsWith('/category/');
  const isHomePage = location.pathname === '/';
  const categoryId = isCategoryPage ? location.pathname.split('/').pop() : null;

  // ฟังก์ชันโหลดวิดีโอครั้งแรก
  const loadInitialVideos = useCallback(async () => {
    setLoading(true);
    setBackgroundLoadProgress(0);

    try {
      let videosData = [];

      if (searchTerm && searchTerm.trim() !== '') {
        // กรณีค้นหา
        if (isCategoryPage) {
          const allCategoryVideos = await getVideosByCategory(categoryId);
          videosData = allCategoryVideos.filter(video =>
            video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            video.channelName.toLowerCase().includes(searchTerm.toLowerCase())
          );
        } else if (filter && filter !== 'all') {
          const allFilterVideos = await fetchVideosFromAPI(filter);
          videosData = allFilterVideos.filter(video =>
            video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            video.channelName.toLowerCase().includes(searchTerm.toLowerCase())
          );
        } else {
          videosData = await searchVideos(searchTerm);
        }
        setHasMore(false);
      } else {
        // กรณีไม่ค้นหา - โหลด 18 วิดีโอแรกเสมอ
        if (isCategoryPage) {
          // หน้า category - โหลด 18 วิดีโอแรก
          videosData = await getVideosByCategory(categoryId, 18);
          setHasMore(true);
          
          // เริ่มโหลดข้อมูลทั้งหมดของหมวดหมู่นี้ในพื้นหลัง
          setTimeout(() => {
            loadAllCategoryDataInBackground(categoryId);
          }, 500);
        } else if (isHomePage) {
          // หน้าหลัก - โหลด 18 วิดีโอแรก
          videosData = await fetchVideosFromAPI('', '', 18);
          setHasMore(true);
          
          // เริ่มโหลดข้อมูลทั้งหมดในพื้นหลัง
          setTimeout(() => {
            loadAllDataInBackground();
          }, 500);
        } else if (filter && filter !== 'all') {
          // หน้า filter - โหลด 18 วิดีโอแรก
          videosData = await fetchVideosFromAPI(filter, '', 18);
          setHasMore(true);
        } else {
          // หน้าอื่นๆ - โหลด 18 วิดีโอแรก
          videosData = await fetchVideosFromAPI('', '', 18);
          setHasMore(false);
        }
      }

      setVideos(videosData);

    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, searchTerm, isCategoryPage, categoryId, isHomePage]);

  // ฟังก์ชันโหลดข้อมูลทั้งหมดของหมวดหมู่ในพื้นหลัง
  const loadAllCategoryDataInBackground = useCallback(async (categoryId) => {
    if (loadingAllData) return;

    // ยกเลิกการโหลดเดิมถ้ามี
    if (backgroundLoadRef.current) {
      backgroundLoadRef.current.cancel = true;
    }

    setLoadingAllData(true);
    setBackgroundLoadProgress(0);
    
    const controller = { cancel: false };
    backgroundLoadRef.current = controller;

    console.log(`Starting to load all data for category ${categoryId} in background...`);

    try {
      let allCategoryVideos = [...videos]; // เริ่มจากวิดีโอที่โหลดมาแล้ว
      let page = 2; // เริ่มจากหน้าสองเพราะหน้าแรกโหลดแล้ว
      let hasMorePages = true;
      const maxPages = 50; // จำกัดจำนวนหน้าสูงสุด
      let totalLoaded = videos.length;

      while (hasMorePages && page <= maxPages && !controller.cancel) {
        try {
          console.log(`Loading page ${page} for category ${categoryId}...`);
          
          // ใช้ getMoreVideosInCategory เพื่อโหลดข้อมูลทีละหน้า
          const result = await getMoreVideosInCategory(
            categoryId, 
            allCategoryVideos.map(v => v.id), 
            page, 
            24 // โหลดทีละ 24 วิดีโอต่อหน้า
          );

          if (result.videos.length > 0 && !controller.cancel) {
            // กรองวิดีโอที่ซ้ำ
            const newVideos = result.videos.filter(newVideo => 
              !allCategoryVideos.some(existingVideo => existingVideo.id === newVideo.id)
            );
            
            if (newVideos.length > 0) {
              allCategoryVideos = [...allCategoryVideos, ...newVideos];
              totalLoaded += newVideos.length;
              
              // อัปเดตวิดีโอที่แสดงแบบ real-time ทุกครั้งที่โหลดได้ใหม่
              setVideos(allCategoryVideos);
              
              // อัปเดตความคืบหน้า
              const progress = Math.min(100, Math.round((page / maxPages) * 100));
              setBackgroundLoadProgress(progress);
            }
            
            hasMorePages = result.hasMore;
            page++;
            
            console.log(`Loaded ${newVideos.length} new videos from page ${page-1}, total: ${allCategoryVideos.length}`);
          } else {
            hasMorePages = false;
          }

          // หยุดชั่วคราวระหว่างหน้าเพื่อไม่ให้ server ล้น
          if (!controller.cancel) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (error) {
          console.error(`Error loading page ${page} for category ${categoryId}:`, error);
          hasMorePages = false;
        }
      }

      if (!controller.cancel) {
        console.log(`Background loading for category ${categoryId} completed. Total videos: ${allCategoryVideos.length}`);
        setBackgroundLoadProgress(100);
      }

    } catch (error) {
      console.error('Error in background category loading:', error);
    } finally {
      if (!controller.cancel) {
        setLoadingAllData(false);
        setHasMore(false); // ตั้งค่าให้ไม่โหลดเพิ่มหลังจากโหลดข้อมูลทั้งหมดแล้ว
      }
    }
  }, [videos, loadingAllData]);

  // ฟังก์ชันโหลดข้อมูลทั้งหมดในพื้นหลัง (เฉพาะหน้าหลัก)
  const loadAllDataInBackground = useCallback(async () => {
    if (!isHomePage || loadingAllData) return;

    // ยกเลิกการโหลดเดิมถ้ามี
    if (backgroundLoadRef.current) {
      backgroundLoadRef.current.cancel = true;
    }

    setLoadingAllData(true);
    setBackgroundLoadProgress(0);
    
    const controller = { cancel: false };
    backgroundLoadRef.current = controller;

    console.log('Starting to load all data in background for homepage...');

    try {
      let allVideos = [...videos]; // เริ่มจากวิดีโอที่โหลดมาแล้ว
      let page = 2; // เริ่มจากหน้าสองเพราะหน้าแรกโหลดแล้ว
      let hasMorePages = true;
      const maxPages = 20;
      let totalLoaded = videos.length;

      while (hasMorePages && page <= maxPages && !controller.cancel) {
        try {
          console.log(`Loading page ${page} for homepage...`);
          
          const moreVideos = await fetchVideosFromAPI('', '', 18, page);
          
          if (moreVideos.length > 0 && !controller.cancel) {
            // กรองวิดีโอที่ซ้ำ
            const newVideos = moreVideos.filter(newVideo => 
              !allVideos.some(existingVideo => existingVideo.id === newVideo.id)
            );
            
            if (newVideos.length > 0) {
              allVideos = [...allVideos, ...newVideos];
              totalLoaded += newVideos.length;
              
              // อัปเดตวิดีโอที่แสดงแบบ real-time
              setVideos(allVideos);
              
              // อัปเดตความคืบหน้า
              const progress = Math.min(100, Math.round((page / maxPages) * 100));
              setBackgroundLoadProgress(progress);
            }
            
            hasMorePages = moreVideos.length >= 18;
            page++;
            
            console.log(`Loaded ${newVideos.length} new videos from page ${page-1}, total: ${allVideos.length}`);
          } else {
            hasMorePages = false;
          }

          // หยุดชั่วคราวระหว่างหน้า
          if (!controller.cancel) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (error) {
          console.error(`Error loading page ${page} for homepage:`, error);
          hasMorePages = false;
        }
      }

      if (!controller.cancel) {
        console.log(`Background loading for homepage completed. Total videos: ${allVideos.length}`);
        setBackgroundLoadProgress(100);
      }

    } catch (error) {
      console.error('Error in background loading:', error);
    } finally {
      if (!controller.cancel) {
        setLoadingAllData(false);
        setHasMore(false);
      }
    }
  }, [isHomePage, loadingAllData, videos]);

  // ฟังก์ชันโหลดวิดีโอเพิ่มเติม (สำหรับเมื่อผู้ใช้เลื่อนลง)
  const loadMoreVideos = useCallback(async () => {
    if (loadingMore || !hasMore || loadingAllData) return;

    setLoadingMore(true);

    try {
      let moreVideos = [];

      if (isCategoryPage) {
        const result = await getMoreVideosInCategory(
          categoryId,
          videos.map(v => v.id),
          2, // หน้า 2 เป็นหน้าแรกที่โหลดเพิ่ม
          12
        );
        moreVideos = result.videos;
        setHasMore(result.hasMore);
      } else if (filter && filter !== 'all') {
        moreVideos = await fetchVideosFromAPI(filter, '', 12, 2);
        setHasMore(moreVideos.length >= 12);
      }

      if (moreVideos.length > 0) {
        setVideos(prevVideos => [...prevVideos, ...moreVideos]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more videos:', error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, loadingAllData, isCategoryPage, categoryId, filter, videos]);

  // ตั้งค่า Intersection Observer สำหรับ infinite scroll
  useEffect(() => {
    if (loadingAllData || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loadingAllData) {
          loadMoreVideos();
        }
      },
      { threshold: 0.5 }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [loadMoreVideos, hasMore, loadingMore, loadingAllData]);

  // โหลดวิดีโอครั้งแรกเมื่อพารามิเตอร์เปลี่ยน
  useEffect(() => {
    // ยกเลิกการโหลดพื้นหลังถ้ามี
    if (backgroundLoadRef.current) {
      backgroundLoadRef.current.cancel = true;
    }

    const timeoutId = setTimeout(loadInitialVideos, searchTerm ? 300 : 0);
    return () => {
      clearTimeout(timeoutId);
      if (backgroundLoadRef.current) {
        backgroundLoadRef.current.cancel = true;
      }
    };
  }, [loadInitialVideos, searchTerm]);

  // ตั้งชื่อ title ตามสถานะ
  let displayTitle = title;
  if (searchTerm && searchTerm.trim() !== '') {
    if (isCategoryPage) {
      const categoryName = getCategoryName(categoryId);
      displayTitle = `ค้นหา "${searchTerm}" ใน ${categoryName}`;
    } else if (filter && filter !== 'all') {
      const filterName = getFilterName(filter);
      displayTitle = `ค้นหา "${searchTerm}" ใน ${filterName}`;
    } else {
      displayTitle = `ผลการค้นหาสำหรับ: "${searchTerm}"`;
    }
  } else if (isCategoryPage) {
    const categoryName = getCategoryName(categoryId);
    displayTitle = categoryName;
  } else if (isHomePage) {
    displayTitle = "วิดีโอทั้งหมด";
  }

  // แสดง Skeleton Loading ครั้งแรก
  if (loading) {
    return (
      <div className={`min-h-screen p-2 md:p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className={`h-8 w-64 rounded mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          </div>
          <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-2 md:gap-4">
            {Array.from({ length: 18 }).map((_, index) => (
              <VideoCardSkeleton key={index} isDarkMode={isDarkMode} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-2 md:p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {displayTitle}
          </h1>
          {loadingAllData && (
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2"></div>
                กำลังโหลดเพิ่ม... {backgroundLoadProgress}%
              </div>
            </div>
          )}
        </div>

        {videos.length === 0 ? (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-lg mb-2">
              {searchTerm && searchTerm.trim() !== ''
                ? 'ไม่พบผลลัพธ์การค้นหา'
                : 'ไม่พบวิดีโอ'}
            </p>
          </div>
        ) : (
          <>
            {searchTerm && searchTerm.trim() !== '' && (
              <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                พบ {videos.length} วิดีโอ
              </p>
            )}
            
            <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
              {videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    isDarkMode={isDarkMode}
                  />
              ))}
            </div>

            {/* Loading More Skeleton (เมื่อผู้ใช้เลื่อนลง) */}
            {loadingMore && (
              <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4 mt-4">
                {Array.from({ length: 12 }).map((_, index) => (
                  <VideoCardSkeleton key={`skeleton-${index}`} isDarkMode={isDarkMode} />
                ))}
              </div>
            )}

            {/* แสดง Skeleton ตอนโหลดในพื้นหลัง */}
            {loadingAllData && !loadingMore && (
              <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4 mt-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <VideoCardSkeleton key={`background-skeleton-${index}`} isDarkMode={isDarkMode} />
                ))}
              </div>
            )}

            {/* Scroll Sentinel สำหรับตรวจจับเมื่อเลื่อนถึงล่าง */}
            {hasMore && !loadingAllData && <div id="scroll-sentinel" className="h-10 w-full"></div>}

            {/* แสดงข้อความเมื่อโหลดครบทั้งหมดแล้ว */}
            {!hasMore && videos.length > 0 && !loadingAllData && (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <p>โหลดวิดีโอครบทั้งหมดแล้ว ({videos.length} วิดีโอ)</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VideoGrid;