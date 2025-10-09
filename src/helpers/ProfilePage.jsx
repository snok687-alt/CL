import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getActorProfile, getActorGalleryImages, getActorsData } from '../data/actorData';
import { getVideosByActor, getVideoById } from '../data/videoData';
import Hls from 'hls.js';
import FireIcon from '../hook/Fire_Icon'

const ProfilePage = ({ isDarkMode = false, isTopActor = false }) => {
  const { profileName } = useParams();
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const slideIntervalRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [sortBy, setSortBy] = useState('views');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSlidePaused, setIsSlidePaused] = useState(false);
  const [actorRank, setActorRank] = useState(0);
  const [visibleImages, setVisibleImages] = useState([]); // ภาพที่แสดงอยู่
  const [fadingIndex, setFadingIndex] = useState(null);   // index ของภาพที่กำลังหายไป


  // Constants
  const bg = 'bg-gray-100';
  const text = 'text-white';
  const textSec = 'text-white';
  const skeleton = 'bg-gray-300';
  const btn = '';
  const actorRankColors = ['bg-red-600', 'bg-orange-500', 'bg-yellow-400'];
  const rankColors = actorRankColors;

  const formatViewCount = (views) => {
    if (views >= 1_000_000_000) {
      return (views / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    } else if (views >= 1_000_000) {
      return (views / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (views >= 1_000) {
      return (views / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
      return views.toString();
    }
  };


  // Calculations
  const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);
  const hottestVideos = [...videos].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

  const calculateActorRank = useCallback(() => {
    try {
      const allActors = getActorsData(50);
      const actorsWithTotalViews = allActors.map(actor => ({
        ...actor,
        totalViews: actor.videoCount * 1000
      }));
      const sortedActors = [...actorsWithTotalViews].sort((a, b) => b.totalViews - a.totalViews);
      const currentActorIndex = sortedActors.findIndex(actor => actor.name === profileName);
      return currentActorIndex >= 0 && currentActorIndex < 3 ? currentActorIndex + 1 : 0;
    } catch (error) {
      return 0;
    }
  }, [profileName]);

  const getSortedVideos = useCallback(() => {
    const sortedVideos = [...videos];
    switch (sortBy) {
      case 'views':
        sortedVideos.sort((a, b) => sortOrder === 'desc' ? (b.views || 0) - (a.views || 0) : (a.views || 0) - (b.views || 0));
        break;
      case 'date':
        sortedVideos.sort((a, b) => sortOrder === 'desc' ? new Date(b.uploadDate) - new Date(a.uploadDate) : new Date(a.uploadDate) - new Date(b.uploadDate));
        break;
      case 'title':
        sortedVideos.sort((a, b) => sortOrder === 'desc' ? (b.title || '').localeCompare(a.title || '') : (a.title || '').localeCompare(b.title || ''));
        break;
      default: break;
    }
    return sortedVideos;
  }, [videos, sortBy, sortOrder]);

  const startSlideShow = useCallback(() => {
    if (images.length <= 4 || showAllImages || isSlidePaused) return;
    if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
    slideIntervalRef.current = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % images.length);
    }, 5000);
  }, [images.length, showAllImages, isSlidePaused]);

  const stopSlideShow = useCallback(() => {
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
      slideIntervalRef.current = null;
    }
  }, []);

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
      if (match) return (match[1] || match[0]).replace(/\$+/g, '').trim();
    }
    return null;
  }, []);

  const loadVideo = useCallback(async (videoUrl) => {
    const videoElement = videoRef.current;
    if (!videoElement || !videoUrl) return;

    setVideoLoading(true);
    setVideoError(null);
    if (hlsRef.current) hlsRef.current.destroy();

    try {
      if (Hls.isSupported()) {
        const hls = new Hls({ debug: false, enableWorker: true });
        hlsRef.current = hls;
        hls.loadSource(videoUrl);
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setVideoLoading(false);
          videoElement.play().catch(() => setVideoLoading(false));
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            setVideoError('ไม่สามารถเล่นวิดีโอได้');
            setVideoLoading(false);
          }
        });
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = videoUrl;
        videoElement.addEventListener('loadedmetadata', () => {
          setVideoLoading(false);
          videoElement.play().catch(() => setVideoLoading(false));
        });
      } else {
        setVideoError('เบราว์เซอร์ไม่รองรับรูปแบบวิดีโอนี้');
        setVideoLoading(false);
      }
    } catch (err) {
      setVideoError('ไม่สามารถโหลดวิดีโอได้');
      setVideoLoading(false);
    }
  }, []);

  const playVideo = async (videoId) => {
    try {
      const videoData = await getVideoById(videoId);
      if (!videoData) {
        setVideoError('ไม่พบวิดีโอนี้');
        return;
      }

      const videoUrl = processVideoUrl(videoData.videoUrl || videoData.rawData?.vod_play_url);
      if (!videoUrl) {
        setVideoError('ไม่พบไฟล์วิดีโอ');
        return;
      }

      setPlayingVideo({ ...videoData, videoUrl });
      setTimeout(() => {
        loadVideo(videoUrl);
        if (window.innerWidth < 768) {
          document.getElementById('video-player-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (error) {
      setVideoError('เกิดข้อผิดพลาดในการโหลดวิดีโอ');
    }
  };

  const stopVideo = () => {
    if (hlsRef.current) hlsRef.current.destroy();
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = '';
    }
    setPlayingVideo(null);
    setVideoError(null);
  };

  // Event handlers
  const openImage = (i) => {
    setSelectedImageIndex(i);
    setShowImageModal(true);
    stopSlideShow();
  };
  const closeModal = () => {
    setShowImageModal(false);
    if (!showAllImages && images.length > 4) startSlideShow();
  };
  const prevImage = () => setSelectedImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  const nextImage = () => setSelectedImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);

  const handleSortChange = (newSortBy) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const handleShowAllImages = () => {
    const newShowAllImages = !showAllImages;
    setShowAllImages(newShowAllImages);
    if (newShowAllImages) {
      stopSlideShow();
    } else {
      setCurrentSlideIndex(0);
      setIsSlidePaused(false);
      if (images.length > 4) startSlideShow();
    }
  };

  const pauseSlideShow = useCallback(() => {
    setIsSlidePaused(true);
    stopSlideShow();
  }, [stopSlideShow]);

  const resumeSlideShow = useCallback(() => {
    setIsSlidePaused(false);
    if (images.length > 4 && !showAllImages && !playingVideo) {
      startSlideShow();
    }
  }, [images.length, showAllImages, playingVideo, startSlideShow]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const name = decodeURIComponent(profileName);
        const [profileData, imageData, videoData] = await Promise.all([
          getActorProfile(name),
          getActorGalleryImages(name).filter(img => img?.trim()),
          getVideosByActor(name)
        ]);
        setProfile(profileData);
        setImages(imageData);
        setVideos(videoData);
        setActorRank(calculateActorRank());
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [profileName, calculateActorRank]);

  useEffect(() => {
    if (images.length <= 4 || showAllImages || isSlidePaused) return;

    let i = 0;
    setVisibleImages(images.slice(i, i + 4));

    slideIntervalRef.current = setInterval(() => {
      setFadingIndex(0); // เริ่มลบภาพแรก

      setTimeout(() => {
        // ลบภาพแรก แล้วเพิ่มภาพใหม่เข้าไป
        i = (i + 1) % images.length;
        const nextImageIndex = (i + 3) % images.length;
        setVisibleImages(prev => {
          const updated = [...prev.slice(1), images[nextImageIndex]];
          return updated;
        });
        setFadingIndex(null); // รีเซ็ต fade
      }, 800); // รอให้ fade-out animation จบ (800ms)
    }, 5000);

    return () => clearInterval(slideIntervalRef.current);
  }, [images, showAllImages, isSlidePaused]);


  useEffect(() => {
    setCurrentSlideIndex(0);
    setIsSlidePaused(false);
  }, [profileName]);

  useEffect(() => {
    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
      stopSlideShow();
    };
  }, []);

  if (loading) {
    return (
      <div className={`relative max-w-screen-2xl mx-auto xl:px-2 min-h-screen animate-pulse ${bg}`}>
        {/* Fake Background */}
        <div className="fixed inset-0 w-full h-full overflow-hidden">
          <div className="absolute inset-0 bg-gray-300 dark:bg-gray-800" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Layout */}
        <div className="relative z-10 flex flex-col xl:flex-row gap-4 py-6">
          {/* Left: Profile Info Skeleton */}
          <div className="w-full xl:w-1/3 space-y-6 px-4">
            <div className="flex flex-row items-center gap-4">
              <div className="w-52 md:w-64 h-auto aspect-[3/4] bg-gray-300 rounded-lg" />
              <div className='space-y-3 text-left -mr-10'>
                <div className="w-32 h-5 bg-gray-300 rounded" />
                <div className="w-24 h-4 bg-gray-300 rounded" />
                <div className="w-32 h-4 bg-gray-300 rounded" />
                <div className="w-32 h-4 bg-gray-300 rounded" />
                <div className="w-28 h-4 bg-gray-300 rounded" />
                <div className="w-20 h-4 bg-gray-300 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-3/4 h-5 bg-gray-300 rounded" />
              <div className="w-full h-16 bg-gray-300 rounded" />
            </div>
          </div>

          {/* Right: Gallery + Videos Skeleton */}
          <div className="w-full xl:w-2/3 space-y-6 px-4">
            {/* Image Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Array(4).fill().map((_, i) => (
                <div key={i} className="w-full aspect-[3/4] bg-gray-300 rounded-lg" />
              ))}
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array(6).fill().map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="w-full aspect-video bg-gray-300 rounded-lg" />
                  <div className="w-3/4 h-4 bg-gray-300 rounded" />
                  <div className="w-1/2 h-3 bg-gray-300 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!profile) {
    return (
      <div className={`p-8 max-w-screen-2xl mx-auto text-center min-h-screen ${bg}`}>
        <h1 className={`text-2xl font-bold ${text}`}>未找到资料</h1>
        <p className={textSec}>无法加载{profileName} 的资料</p>
      </div>
    );
  }

  const getDisplayedImages = () => {
    if (showAllImages) return images;
    const displayed = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentSlideIndex + i) % images.length;
      displayed.push(images[index]);
    }
    return displayed;
  };

  const displayedImages = showAllImages ? images : visibleImages;
  const sortedVideos = getSortedVideos();

  return (
    <div className="relative max-w-screen-2xl mx-auto xl:px-2 min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${profile.backgroundImage || profile.profileImage})` }} />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex flex-col xl:flex-row gap-4">
          {/* Profile Info */}
          {!playingVideo && (
            <div className="md:flex flex-col md:justify-center items-center md:min-h-screen w-full xl:w-1/3 space-y-4 md:mt-0 space-x-0">
              <div className={`flex md:flex-row gap-x-2 p-4 items-center justify-between md:items-start space-x-3.5`}>
                <div className="relative flex-shrink-0 overflow-hidden">
                  {(isTopActor || actorRank > 0) && (
                    <div className="absolute top-2 left-[-24px] z-20 transform -rotate-45">
                      <div className={`w-22 text-center py-1 px-2 text-xs font-bold text-white ${actorRank > 0 ? actorRankColors[actorRank - 1] : 'bg-red-600'} shadow-md drop-shadow-md rounded border border-white/30`}>
                        {actorRank > 0 ? `👑 HOT ${actorRank}` : '👑 HOT ACTOR'}
                      </div>
                    </div>
                  )}
                  <img src={profile.profileImage} alt={profile.name}
                    className="w-52 h-auto md:w-64 md:h-auto object-cover rounded-lg shadow-xl ring-1 ring-white/10"
                    onError={(e) => e.target.src = `https://picsum.photos/400/400?random=${profile.name.charCodeAt(0)}`} />
                  {profile.hasProfile && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg">✓</div>
                  )}
                </div>
                <div className="space-y-4 text-left">
                  <h1 className={`text-xl font-bold ${text} drop-shadow-lg text-shadow-lg`}>{profile.name}</h1>
                  {profile.alternativeName && <p className={`text-base ${textSec} italic drop-shadow-md`}>{profile.alternativeName}</p>}
                  <div className={`text-base ${textSec} font-semibold drop-shadow-md bg-black/30 px-2 py-1 rounded-lg`}>
                    总观看次数: {totalViews.toLocaleString()}
                    {totalViews >= 1000 && (
                      <div className="-mt-1 -mr-1 fire-icon-container">
                        <FireIcon />
                      </div>
                    )}
                  </div>

                  {actorRank > 0 && (
                    <p className={`text-base font-semibold drop-shadow-md px-2 py-1 rounded-lg text-white ${actorRankColors[actorRank - 1]}`}>
                      🏆 热门演员排名 # {actorRank}
                    </p>
                  )}
                  {['age', 'height', 'weight', 'nationality', 'other'].map(key =>
                    profile[key] && profile[key] !== 'ไม่ระบุ' && (
                      <p key={key} className={`text-base ${textSec} drop-shadow-md font-medium`}>
                        {key === 'age' ? '年龄' : key === 'height' ? '身高' : key === 'weight' ? '体重' : key === 'nationality' ? '国籍' : '其他'}: {profile[key]}
                      </p>
                    )
                  )}
                  <p className={`text-base ${textSec} font-semibold drop-shadow-md`}>视频数量: {profile.videoCount} 部</p>
                </div>
              </div>
              <div className={`p-4 rounded-lg`}>
                <h2 className={`text-xl font-semibold mb-2 ${text} drop-shadow-lg`}>更多信息</h2>
                <p className={`leading-relaxed text-base ${textSec} drop-shadow-md`}>{profile.bio}</p>
              </div>
            </div>
          )}

          {/* Video Player */}
          {playingVideo && (
            <div id="video-player-section" className="flex items-center justify-center w-full xl:w-1/3">
              <div className="sticky">
                <button onClick={stopVideo} className="absolute top-0 right-0 text-white text-3xl z-50 transition-colors w-10 h-10 flex items-top justify-top">&times;</button>
                <div className="relative w-full aspect-video bg-black overflow-hidden shadow-lg rounded-sm">
                  {videoLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                      <div className="flex flex-col items-center text-white">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        <p className="text-sm mt-2">正在加载视频...</p>
                      </div>
                    </div>
                  )}
                  {videoError ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
                      <div className="text-center">
                        <p className="mb-4">{videoError}</p>
                        <button onClick={stopVideo} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg">关</button>
                      </div>
                    </div>
                  ) : (
                    <video ref={videoRef} controls className="w-full h-full" poster={playingVideo.thumbnail} playsInline preload="metadata" />
                  )}
                </div>
                <div className="bg-black/50 backdrop-blur rounded-lg p-2">
                  <h3 className={`font-bold text-lg ${text} mb-2`}>{playingVideo.title}</h3>
                  <div className="flex flex-wrap items-center text-sm text-gray-300 gap-2">
                    <span>{playingVideo.channelName}</span><span>•</span>
                    {playingVideo.views > 0 && <><span>
                      {playingVideo.views.toLocaleString()} 次观看
                    </span><span>•</span>
                    </>}
                    <span>{playingVideo.uploadDate}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Images & Videos */}
          <div className={`w-full ${playingVideo ? 'xl:w-2/3' : 'xl:w-2/3'} xl:max-h-screen xl:overflow-y-auto no-scrollbar`}>
            {images.length > 0 && !playingVideo && (
              <div className={`p-2 pt-6 rounded-lg`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-semibold text-left ${text} drop-shadow-lg`}>图片</h2>
                  {!showAllImages && images.length > 4 && (
                    <div className={`text-xs ${textSec} bg-black/30 px-2 py-1 rounded flex items-center gap-2`}>
                      {isSlidePaused ? (
                        <>
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          已暂停
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          自动轮播中... {(() => {
                            const firstIndex = images.findIndex(img => img === visibleImages[0]) + 1;
                            const lastIndex = firstIndex + visibleImages.length - 1;
                            return `${firstIndex}-${lastIndex}/${images.length}`;
                          })()}
                        </>
                      )}

                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2" onMouseEnter={pauseSlideShow} onMouseLeave={resumeSlideShow}>
                  {displayedImages.map((img, index) => {
                    const actualIndex = showAllImages ? index : (currentSlideIndex + index) % images.length;
                    return (
                      <div key={showAllImages ? index : `slide-${currentSlideIndex}-${index}`} className="relative break-inside-avoid mb-2">
                        <img src={img} alt={`profile-img-${index}`} loading="lazy"
                          className="w-full rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => openImage(actualIndex)} onMouseEnter={pauseSlideShow} />
                      </div>
                    );
                  })}
                </div>
                {images.length > 4 && (
                  <div className="mt-4 text-center">
                    <button
                      className={`px-4 py-2 rounded-md text-white transition-colors shadow-lg ${btn} border-b`}
                      onClick={handleShowAllImages}
                    >
                      {showAllImages
                        ? `收起 (显示 4 张) ↑`
                        : `更多图片（${images.length} 张） ↓`}
                    </button>
                  </div>
                )}

              </div>
            )}

            <div className={`px-2 rounded-lg`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <h2 className={`text-2xl font-bold text-left ${text} drop-shadow-lg mb-2 sm:mb-0`}>视频</h2>
                <div className="flex justify-between items-center space-x-2">
                  <span className={`text-sm ${textSec} drop-shadow`}>排序方式:</span>
                  <div className="flex bg-black/30 backdrop-blur rounded-lg p-1">
                    {['views', 'date', 'title'].map((type) => (
                      <button key={type} onClick={() => handleSortChange(type)}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${sortBy === type ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white border-b'
                          }`}>
                        {type === 'views' ? '观看次数' : type === 'date' ? '日期' : '标题'} {sortBy === type && (sortOrder === 'desc' ? '↓' : '↑')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {sortedVideos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {sortedVideos.map((video, index) => {
                    const hotVideoIndex = hottestVideos.findIndex(hotVideo => hotVideo.id === video.id);
                    const isHotVideo = hotVideoIndex !== -1;
                    return (
                      <div key={video.id} onClick={(e) => { e.stopPropagation(); playVideo(video.id); }}
                        className={`rounded-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group bg-black/30 hover:bg-black/40 relative`}>
                        {isHotVideo && (
                          <div className="absolute top-2 left-[-24px] z-20 transform -rotate-45">
                            <div className={`w-22 text-center py-1 text-xs font-bold text-white ${rankColors[hotVideoIndex]} shadow-md drop-shadow-md`}>
                              👑 HOT {hotVideoIndex + 1}
                            </div>
                          </div>
                        )}
                        <div className="relative overflow-hidden">
                          {video.thumbnail?.trim() ? (
                            <img src={video.thumbnail} alt={video.title}
                              className="w-full md:h-50 object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => e.target.src = `https://picsum.photos/400/300?random=${video.id}`} />
                          ) : (
                            <div className="w-full h-48 bg-gray-300/20 backdrop-blur flex items-center justify-center">
                              <span className={`${textSec} drop-shadow`}>没有预览图</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className={`font-semibold text-sm line-clamp-2 mb-1 ${text} transition-colors drop-shadow-md`}>{video.title}</h3>
                          <div className="flex items-center justify-between">
                            <div className='flex flex-row items-center gap-1'>
                              {video.views >= 1000 && (
                                <div className="-mt-1 -mr-1 fire-icon-container">
                                  <FireIcon />
                                </div>
                              )}
                              <p className={`text-xs ${textSec} drop-shadow`}>
                                {formatViewCount(video.views)} 次观看
                              </p>
                            </div>

                            {video.uploadDate && <p className={`text-xs ${textSec} drop-shadow`}>{video.uploadDate}</p>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={`text-center py-8 ${textSec}`}><p className="drop-shadow-md">没有可显示的视频</p></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && images.length > 0 && (
        <ImageModal images={images} selectedImageIndex={selectedImageIndex} onClose={closeModal} onPrev={prevImage} onNext={nextImage} isDarkMode={isDarkMode} actorName={profile.name} />
      )}
    </div>
  );
};

// Image Modal Component
const ImageModal = ({ images, selectedImageIndex, onClose, onPrev, onNext, isDarkMode, actorName }) => {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') onPrev();
    else if (e.key === 'ArrowRight') onNext();
    else if (e.key === 'Escape') onClose();
  }, [onPrev, onNext, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95`} onClick={onClose}>
      <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-white text-4xl z-30 p-3 rounded-full bg-black/80 hover:bg-black/90 transition-colors backdrop-blur-sm" onClick={onClose}>&times;</button>
        {images.length > 1 && (
          <>
            <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/80 hover:bg-black/90 text-white p-4 rounded-full text-2xl transition-colors backdrop-blur-sm z-20" onClick={onPrev}>&#10094;</button>
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/80 hover:bg-black/90 text-white p-4 rounded-full text-2xl transition-colors backdrop-blur-sm z-20" onClick={onNext}>&#10095;</button>
          </>
        )}
        <div className="relative flex items-center justify-center w-full h-full p-16">
          <img src={images[selectedImageIndex]} alt={`${actorName} - รูปที่ ${selectedImageIndex + 1}`}
            className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
            style={{ minWidth: '50vw', minHeight: '50vh' }}
            onError={(e) => e.target.src = `https://picsum.photos/800/1200?random=${actorName.charCodeAt(0) + selectedImageIndex}`} />
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center z-20">
          <div className="text-white text-xl font-medium">{selectedImageIndex + 1} / {images.length}</div>
          <div className="text-white/80 text-sm drop-shadow bg-black/50 px-4 rounded backdrop-blur-sm">按下 ESC 键以关闭窗口</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;