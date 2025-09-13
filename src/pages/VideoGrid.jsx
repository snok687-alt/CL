import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { getCategoryName } from '../routes/Router';
import { getVideosByCategory, searchVideos, getMoreVideosInCategory } from '../data/videoData';

const VideoCardSkeleton = ({ isDarkMode }) => (
  <div
    className={`rounded-md overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}
  >
    {/* รูปภาพ Skeleton */}
    <div className="relative aspect-[6/5] bg-gray-600 animate-pulse"></div>

    {/* เนื้อหา Skeleton */}
    <div className="px-2 py-1 space-y-1">
      <div
        className={`h-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} w-5/6 animate-pulse`}
      ></div>
      <div className="flex items-center justify-around text-xs space-x-2">
        <div
          className={`h-3 w-10 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} animate-pulse`}
        ></div>
        <div
          className={`h-3 w-1 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} animate-pulse`}
        ></div>
        <div
          className={`h-3 w-14 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} animate-pulse`}
        ></div>
      </div>
    </div>
  </div>
);


const VideoGrid = ({ title, filter }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const { searchTerm, isDarkMode } = useOutletContext();
  const location = useLocation();
  const loadingRef = useRef(false);

  const isCategoryPage = location.pathname.startsWith('/category/');
  const categoryId = isCategoryPage ? location.pathname.split('/').pop() : null;

  // กำหนดจำนวนวิดีโอต่อหน้าเป็น 18
  const VIDEOS_PER_PAGE = 18;

  // Load initial videos
// ลดความซับซ้อนของ loadInitialVideos
const loadInitialVideos = useCallback(async () => {
  if (loadingRef.current) return;
  loadingRef.current = true;
  setLoading(true);

  try {
    const videosData = await getVideosByCategory(categoryId, VIDEOS_PER_PAGE);
    setVideos(videosData);
    setHasMore(videosData.length >= VIDEOS_PER_PAGE);
  } catch (error) {
    console.error('Error loading videos:', error);
    setVideos([]);
  } finally {
    setLoading(false);
    loadingRef.current = false;
  }
}, [categoryId, VIDEOS_PER_PAGE]);

  // Load more videos
  const loadMoreVideos = useCallback(async () => {
    if (loadingMore || !hasMore || loadingRef.current || searchTerm?.trim()) return;

    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      const result = await getMoreVideosInCategory(
        categoryId,
        videos.map(v => v.id),
        nextPage,
        VIDEOS_PER_PAGE // ใช้ VIDEOS_PER_PAGE แทนค่าคงที่
      );

      if (result.videos.length > 0) {
        setVideos(prev => [...prev, ...result.videos]);
        setPage(nextPage);
        setHasMore(result.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more videos:', error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, categoryId, videos, page, searchTerm, VIDEOS_PER_PAGE]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore || searchTerm?.trim()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreVideos();
        }
      },
      { threshold: 0.1 } // ลด threshold เพื่อให้โหลดเร็วขึ้น
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [loadMoreVideos, hasMore, searchTerm]);

  // Load videos when params change
  useEffect(() => {
    const timeoutId = setTimeout(loadInitialVideos, searchTerm ? 300 : 0);
    return () => clearTimeout(timeoutId);
  }, [loadInitialVideos, searchTerm]);

  // Display title logic
  let displayTitle = title;
  if (searchTerm?.trim()) {
    displayTitle = `ค้นหา "${searchTerm}" ใน ${getCategoryName(categoryId)}`;
  } else if (isCategoryPage) {
    displayTitle = getCategoryName(categoryId);
  }

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen p-1 md:p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-2 md:gap-4">
            {/* แสดง 18 skeleton cards */}
            {Array.from({ length: VIDEOS_PER_PAGE }).map((_, index) => (
              <VideoCardSkeleton key={index} isDarkMode={isDarkMode} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-1 md:p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto">
        {videos.length === 0 ? (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-lg mb-2">
              {searchTerm?.trim() ? 'ไม่พบผลลัพธ์การค้นหา' : 'ไม่พบวิดีโอในหมวดหมู่นี้'}
            </p>
          </div>
        ) : (
          <>
            {searchTerm?.trim() && (
              <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                พบ {videos.length} วิดีโอ
              </p>
            )}

            <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 md:gap-4">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>

            {/* Loading More Skeleton */}
            {loadingMore && (
              <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4 mt-4">
                {/* แสดง 18 skeleton cards สำหรับการโหลดเพิ่ม */}
                {Array.from({ length: VIDEOS_PER_PAGE }).map((_, index) => (
                  <VideoCardSkeleton key={`skeleton-${index}`} isDarkMode={isDarkMode} />
                ))}
              </div>
            )}

            {/* Scroll Sentinel */}
            {hasMore && !searchTerm?.trim() && (
              <div id="scroll-sentinel" className="h-10 w-full"></div>
            )}

            {/* End message */}
            {!hasMore && videos.length > 0 && (
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