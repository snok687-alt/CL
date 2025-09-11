import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { getCategoryName } from '../routes/Router';
import { getVideosByCategory, searchVideos, getMoreVideosInCategory } from '../data/videoData';

const VideoCardSkeleton = ({ isDarkMode }) => (
  <div className={`rounded-lg overflow-hidden shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
    <div className="relative aspect-[16/9] bg-gray-600 animate-pulse"></div>
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
  const [page, setPage] = useState(1);
  
  const { searchTerm, isDarkMode } = useOutletContext();
  const location = useLocation();
  const loadingRef = useRef(false);
  
  const isCategoryPage = location.pathname.startsWith('/category/');
  const categoryId = isCategoryPage ? location.pathname.split('/').pop() : null;

  // Load initial videos
  const loadInitialVideos = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setVideos([]);
    setPage(1);
    setHasMore(true);

    try {
      let videosData = [];
      const limit = 12;

      if (searchTerm?.trim()) {
        const allVideos = await getVideosByCategory(categoryId, 50);
        videosData = allVideos.filter(video =>
          video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.channelName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setHasMore(false);
      } else {
        videosData = await getVideosByCategory(categoryId, limit);
        setHasMore(videosData.length >= limit);
      }

      setVideos(videosData);
    } catch (error) {
      console.error('Error loading videos:', error);
      setVideos([]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [searchTerm, isCategoryPage, categoryId]);

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
        18
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
  }, [loadingMore, hasMore, categoryId, videos, page, searchTerm]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore || searchTerm?.trim()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreVideos();
        }
      },
      { threshold: 0.5 }
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
      <div className={`min-h-screen p-2 md:p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto">
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
        <div className="flex items-center justify-between">
        </div>

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
            
            <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
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
                {Array.from({ length: 18 }).map((_, index) => (
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