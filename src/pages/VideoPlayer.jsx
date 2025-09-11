import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { getVideoById, getRelatedVideos, getMoreVideosInCategory } from '../data/videoData';
import Hls from 'hls.js';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const relatedContainerRef = useRef(null);
  const { isDarkMode } = useOutletContext();

  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Related videos infinite scroll
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedPage, setRelatedPage] = useState(1);
  const [hasMoreRelated, setHasMoreRelated] = useState(true);

  // Auto-hide header on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        window.dispatchEvent(new CustomEvent('toggleHeader', { detail: 'hide' }));
      } else if (currentScrollY < lastScrollY) {
        window.dispatchEvent(new CustomEvent('toggleHeader', { detail: 'show' }));
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Process video URL
  const processVideoUrl = useCallback((playUrl) => {
    if (!playUrl) return null;

    const patterns = [
      /(https?:\/\/[^$]+\.m3u8[^$]*)/i,
      /(https?:\/\/[^$]+\.mp4[^$]*)/i,
      /\$([^$]+\.m3u8[^$]*)/i,
      /\$([^$]+\.mp4[^$]*)/i
    ];

    for (const pattern of patterns) {
      const match = playUrl.match(pattern);
      if (match) {
        let url = match[1] || match[0];
        return url.replace(/\$+/g, '').trim();
      }
    }
    return null;
  }, []);

  // Load video player
  const loadVideo = useCallback(async (videoUrl) => {
    const videoElement = videoRef.current;
    if (!videoElement || !videoUrl) return;

    setVideoLoading(true);

    // Cleanup previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    try {
      if (Hls.isSupported()) {
        const hls = new Hls({
          debug: false,
          enableWorker: true,
          manifestLoadingTimeOut: 10000,
          levelLoadingTimeOut: 10000,
          fragLoadingTimeOut: 20000,
        });

        hlsRef.current = hls;
        hls.loadSource(videoUrl);
        hls.attachMedia(videoElement);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setVideoLoading(false);
          videoElement.play().catch(() => setVideoLoading(false));
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data);
          if (data.fatal) {
            setError('ไม่สามารถเล่นวีดีโอได้');
            setVideoLoading(false);
          }
        });
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = videoUrl;
        videoElement.addEventListener('loadedmetadata', () => {
          setVideoLoading(false);
          videoElement.play().catch(() => setVideoLoading(false));
        });
        videoElement.addEventListener('error', () => {
          setError('ไม่สามารถเล่นวีดีโอได้');
          setVideoLoading(false);
        });
      } else {
        setError('เบราว์เซอร์ไม่รองรับรูปแบบวีดีโอนี้');
        setVideoLoading(false);
      }
    } catch (err) {
      setError('ไม่สามารถโหลดวีดีโอได้');
      setVideoLoading(false);
    }
  }, []);

  // Load more related videos - ปรับปรุงเพื่อโหลดแบบต่อเนื่องจนหมด
  const loadMoreRelated = useCallback(async () => {
    if (relatedLoading || !hasMoreRelated || !video?.type_id) return;

    setRelatedLoading(true);

    try {
      const result = await getMoreVideosInCategory(
        video.type_id,
        relatedVideos.map(v => v.id), // exclude IDs ที่มีอยู่แล้ว (ไม่รวม current video id เพราะกรองใน useEffect แล้ว)
        relatedPage + 1,
        18 // โหลด 18 วิดีโอต่อครั้ง
      );

      if (result.videos.length > 0) {
        // กรองวิดีโอปัจจุบันออก (double check)
        const filteredNewVideos = result.videos.filter(v => v.id !== video.id);
        
        if (filteredNewVideos.length > 0) {
          setRelatedVideos(prev => [...prev, ...filteredNewVideos]);
          setRelatedPage(prevPage => prevPage + 1);
        }
        
        setHasMoreRelated(result.hasMore && filteredNewVideos.length > 0);
      } else {
        setHasMoreRelated(false);
      }
    } catch (error) {
      console.error('Error loading more related videos:', error);
      setHasMoreRelated(false);
    } finally {
      setRelatedLoading(false);
    }
  }, [relatedLoading, hasMoreRelated, video, relatedVideos, relatedPage]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMoreRelated || relatedLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreRelated();
        }
      },
      { threshold: 0.1 }
    );

    const container = relatedContainerRef.current;
    if (!container) return;

    // สร้าง sentinel element สำหรับตรวจจับการเลื่อนถึงล่าง
    const sentinel = document.createElement('div');
    sentinel.id = 'scroll-sentinel';
    sentinel.style.height = '1px';
    container.appendChild(sentinel);
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      if (container && container.contains(sentinel)) {
        container.removeChild(sentinel);
      }
    };
  }, [loadMoreRelated, hasMoreRelated, relatedLoading, relatedVideos.length]);

  // Fetch video data
  useEffect(() => {
    const fetchVideoData = async () => {
      if (!videoId) return;

      setLoading(true);
      setError(null);
      setRelatedVideos([]);
      setRelatedPage(1);
      setHasMoreRelated(true);

      try {
        const videoData = await getVideoById(videoId);
        if (!videoData) throw new Error('ไม่พบวีดีโอนี้');

        const videoUrl = processVideoUrl(videoData.videoUrl || videoData.rawData?.vod_play_url);
        setVideo({ ...videoData, videoUrl });

        if (videoUrl) {
          setTimeout(() => loadVideo(videoUrl), 100);
        } else {
          setVideoLoading(false);
          setError('ไม่พบไฟล์วีดีโอ');
        }
      } catch (err) {
        setError(err.message || 'ไม่สามารถโหลดวีดีโอได้');
        setVideoLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [videoId, processVideoUrl, loadVideo]);

  // Fetch related videos - ปรับปรุงให้ใช้ type_id อย่างถูกต้อง
  useEffect(() => {
    const fetchRelated = async () => {
      if (!video?.id || !video?.type_id) {
        return;
      }

      console.log(`Loading related videos for type_id: ${video.type_id}, current video: ${video.id}`);

      try {
        // เริ่มต้นโหลดวิดีโอจากหมวดหมู่เดียวกัน
        const initialResult = await getMoreVideosInCategory(
          video.type_id,
          [video.id], // exclude current video
          1, // หน้าแรก
          18 // โหลด 18 วิดีโอแรก
        );

        if (initialResult.videos.length > 0) {
          // กรองวิดีโอปัจจุบันออกอีกครั้ง (เพื่อความแน่ใจ)
          const filteredRelated = initialResult.videos.filter(relatedVideo => relatedVideo.id !== video.id);
          
          setRelatedVideos(filteredRelated);
          setHasMoreRelated(initialResult.hasMore);
          setRelatedPage(1);
          
          console.log(`Loaded ${filteredRelated.length} related videos, hasMore: ${initialResult.hasMore}`);
        } else {
          console.log('No related videos found for this category');
          setRelatedVideos([]);
          setHasMoreRelated(false);
        }
      } catch (error) {
        console.error('Error loading related videos:', error);
        setRelatedVideos([]);
        setHasMoreRelated(false);
      }
    };

    // โหลดหลังจากวิดีโอหลักโหลดเสร็จแล้ว
    if (video && !videoLoading) {
      fetchRelated();
    }
  }, [video, videoLoading]);

  // Helper functions
  const removeHtmlTags = (html) => html ? html.replace(/<[^>]*>/g, '') : '';
  const truncateDescription = (text, maxLength = 150) => {
    const cleanText = removeHtmlTags(text);
    return cleanText.length <= maxLength ? cleanText : cleanText.substring(0, maxLength) + '...';
  };

  const handleVideoClick = useCallback((clickedVideo) => {
    navigate(`/watch/${clickedVideo.id}`);
  }, [navigate]);

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="max-w-full mx-auto md:mt-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-2/3 space-y-4">
              <div className="relative w-full aspect-video bg-gray-800 animate-pulse" />
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4 animate-pulse" />
                <div className="flex gap-2 items-center mb-2">
                  <div className="h-4 w-24 bg-gray-600 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-600 rounded animate-pulse" />
                </div>
                <div className="h-4 bg-gray-600 rounded w-full mb-2 animate-pulse" />
              </div>
            </div>
            <div className="w-full lg:w-1/3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="h-6 w-2/3 mb-4 bg-gray-600 rounded animate-pulse" />
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 12 }).map((_, idx) => (
                    <div key={idx} className="space-y-2 animate-pulse">
                      <div className="aspect-video bg-gray-700 rounded" />
                      <div className="h-3 w-5/6 bg-gray-600 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !video) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'
        }`}>
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg mb-4">{error || 'ไม่พบวีดีโอนี้'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Back
        </button>
      </div>
    );
  }

  const cleanDescription = removeHtmlTags(video.description);
  const shouldTruncate = cleanDescription.length > 150;
  const displayDescription = showFullDescription ? cleanDescription : truncateDescription(cleanDescription);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="max-w-full mx-auto md:mt-4 md:ml-4 lg:p-1">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-x-8">

          {/* Video Player Section */}
          <div className="w-full lg:w-2/3">
            <div className="relative w-full aspect-video bg-black overflow-hidden shadow-lg">
              {videoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                    <p className="text-white text-sm">กำลังโหลดวีดีโอ...</p>
                  </div>
                </div>
              )}
              <video
                ref={videoRef}
                controls
                className="w-full h-full"
                poster={video.thumbnail}
                playsInline
                preload="metadata"
              />
            </div>

            {/* Video Info */}
            <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h1 className="text-xl md:text-2xl font-bold mb-2">{video.title}</h1>

              <div className="flex flex-wrap items-center text-sm mb-2">
                <span className="mr-3">{video.channelName}</span>
                <span className="mr-3">•</span>
                <span>{video.views.toLocaleString()} ครั้ง</span>
                <span className="mx-3">•</span>
                <span>{video.uploadDate}</span>
                <span className="mx-3">•</span>
                <span className={`px-2 py-1 rounded-full text-xs ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                  {video.category} (ID: {video.type_id})
                </span>
              </div>

              {video.rawData?.vod_actor && (
                <p className="mb-2">
                  <strong>นักแสดง: </strong>{video.rawData.vod_actor}
                </p>
              )}

              <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                <p className="whitespace-pre-line mb-2">{displayDescription}</p>
                {shouldTruncate && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className={`text-sm font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                      } transition-colors`}
                  >
                    {showFullDescription ? 'แสดงน้อยลง' : 'แสดงเพิ่มเติม'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Related Videos Section */}
          <div className="w-full lg:w-1/3">
            <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800 lg:bg-transparent' : 'bg-white lg:bg-transparent'}`}>
              <h3 className={`text-xl font-bold mb-1 py-3 pl-2 sticky top-0 ${isDarkMode ? 'bg-gradient-to-r from-gray-900 to-transparent' : 'bg-gradient-to-r from-gray-100 to-transparent'
                }`}>
                วีดีโอที่เกี่ยวข้อง ({relatedVideos.length}{hasMoreRelated ? '+' : ''})
              </h3>

              <div
                ref={relatedContainerRef}
                className="grid grid-cols-3 md:grid-cols-3 gap-2 max-h-screen px-2 overflow-y-auto"
              >
                {relatedVideos.map((relatedVideo, index) => (
                  <div key={`${relatedVideo.id}-${index}`} className="transform transition-transform duration-300 hover:scale-105">
                    <VideoCard
                      video={relatedVideo}
                      onClick={handleVideoClick}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                ))}

                {/* Loading indicator - ปรับให้แสดงผลดีขึ้น */}
                {relatedLoading && (
                  <>
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div key={`loading-${idx}`} className="animate-pulse space-y-2">
                        <div className="aspect-video bg-gray-700 rounded" />
                        <div className="h-3 w-5/6 bg-gray-600 rounded" />
                        <div className="h-2 w-3/4 bg-gray-600 rounded" />
                      </div>
                    ))}
                  </>
                )}

                {/* Load more button - เพิ่มปุ่มสำหรับโหลดเพิ่มเมื่อมีปัญหา scroll */}
                {hasMoreRelated && !relatedLoading && relatedVideos.length > 0 && (
                  <div className="col-span-3 flex justify-center py-4">
                    <button
                      onClick={loadMoreRelated}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-black'
                      }`}
                    >
                      โหลดเพิ่มเติม ({relatedVideos.length} วิดีโอ)
                    </button>
                  </div>
                )}

                {/* End of related videos message */}
                {!hasMoreRelated && relatedVideos.length > 0 && (
                  <div className="col-span-3 text-center py-4">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      โหลดวีดีโอครบทั้งหมดแล้ว
                    </p>
                  </div>
                )}

                {/* No related videos message */}
                {relatedVideos.length === 0 && !relatedLoading && (
                  <div className="col-span-3 text-center py-8">
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ไม่มีวีดีโอที่เกี่ยวข้องในขณะนี้
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;