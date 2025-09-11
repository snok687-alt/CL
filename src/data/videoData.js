import axios from 'axios';

// ตั้งค่า axios
axios.defaults.timeout = 10000;

// Retry helper
const retry = async (fn, maxRetries = 2) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

// Simple cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getFromCache = (key) => {
  const item = cache.get(key);
  if (!item || Date.now() - item.time > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return item.data;
};

const setToCache = (key, data) => {
  if (cache.size > 50) cache.clear(); // Simple cleanup
  cache.set(key, { data, time: Date.now() });
};

// Core API call
const apiCall = async (params) => {
  const url = `/api/provide/vod/?ac=list&${params}`;
  return retry(() => axios.get(url));
};

// Format video data
const formatVideo = (item) => ({
  id: item.vod_id,
  title: item.vod_name || 'ไม่มีชื่อ',
  channelName: item.vod_director || item.type_name || 'ไม่ระบุ',
  views: parseInt(item.vod_hits) || 0,
  duration: parseInt(item.vod_duration) || 0,
  uploadDate: item.vod_year || item.vod_time || 'ไม่ระบุ',
  thumbnail: item.vod_pic || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=640&h=360&fit=crop',
  videoUrl: item.vod_play_url || '',
  description: item.vod_content || 'ไม่มีคำอธิบาย',
  category: item.type_name || item.vod_class || 'ทั่วไป',
  rawData: item
});

// Get videos with details
const getVideosWithDetails = async (ids) => {
  if (!ids.length) return [];
  
  try {
    const response = await retry(() => 
      axios.get(`/api/provide/vod/?ac=detail&ids=${ids.join(',')}`)
    );
    return (response.data?.list || []).map(formatVideo);
  } catch (error) {
    console.error('Error getting video details:', error);
    return [];
  }
};

// Main functions
export const fetchVideosFromAPI = async (category = '', searchQuery = '', limit = 20, page = 1) => {
  const cacheKey = `videos:${category}:${searchQuery}:${limit}:${page}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('t', category);
    if (searchQuery) params.set('wd', searchQuery);
    params.set('pg', page);
    params.set('limit', limit);

    const response = await apiCall(params.toString());
    const videoList = response.data?.list || [];
    
    if (!videoList.length) return [];

    const ids = videoList.map(item => item.vod_id).filter(Boolean);
    const videos = await getVideosWithDetails(ids);
    
    setToCache(cacheKey, videos);
    return videos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};

export const getVideoById = async (id) => {
  const cacheKey = `video:${id}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await retry(() => 
      axios.get(`/api/provide/vod/?ac=detail&ids=${id}`)
    );
    
    const videoData = response.data?.list?.[0];
    if (!videoData) return null;

    const video = formatVideo(videoData);
    setToCache(cacheKey, video);
    return video;
  } catch (error) {
    console.error('Error fetching video by ID:', error);
    return null;
  }
};

export const searchVideos = async (query, limit = 20) => {
  if (!query.trim()) return [];
  return fetchVideosFromAPI('', query, limit);
};

export const getVideosByCategory = async (category, limit = 20) => {
  if (!category || category === 'all') {
    return fetchVideosFromAPI('', '', limit);
  }
  return fetchVideosFromAPI(category, '', limit);
};

export const getRelatedVideos = async (currentVideoId, currentVideoCategory, currentVideoTitle, limit = 12) => {
  if (!currentVideoCategory) return [];

  try {
    // Get from same category
    const categoryVideos = await fetchVideosFromAPI(currentVideoCategory, '', limit * 2);
    
    // Filter out current video and limit results
    const related = categoryVideos
      .filter(video => video.id !== currentVideoId)
      .slice(0, limit);

    return related;
  } catch (error) {
    console.error('Error getting related videos:', error);
    return [];
  }
};

export const getMoreVideosInCategory = async (categoryName, excludeIds = [], page = 1, limit = 12) => {
  try {
    const videos = await fetchVideosFromAPI(categoryName, '', limit * 2, page);
    
    const filtered = videos
      .filter(video => !excludeIds.includes(video.id))
      .slice(0, limit);

    return {
      videos: filtered,
      hasMore: filtered.length >= limit
    };
  } catch (error) {
    console.error('Error getting more videos:', error);
    return { videos: [], hasMore: false };
  }
};

export const getCategories = async () => {
  const cacheKey = 'categories';
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await apiCall('limit=100');
    const videos = response.data?.list || [];
    
    const categories = [...new Set(
      videos
        .map(item => item.type_name || item.vod_class)
        .filter(Boolean)
    )].sort();

    setToCache(cacheKey, categories);
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    return ['ทั่วไป', 'บันเทิง', 'ข่าว', 'กีฬา'];
  }
};

// Helper functions for specific category
export const getAllVideosByCategory = async (categoryId, limit = 0) => {
  if (limit > 0) return getVideosByCategory(categoryId, limit);
  
  const allVideos = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && allVideos.length < 500) { // Safety limit
    const result = await getMoreVideosInCategory(
      categoryId, 
      allVideos.map(v => v.id), 
      page, 
      50
    );
    
    if (result.videos.length === 0) break;
    
    allVideos.push(...result.videos);
    hasMore = result.hasMore;
    page++;
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  return allVideos;
};

export const getAllVideos = async (limit = 20) => {
  return fetchVideosFromAPI('', '', limit);
};

export const checkAPIStatus = async () => {
  try {
    const response = await axios.get('/api/provide/vod/?ac=list&limit=1', { timeout: 5000 });
    return { status: 'ok', data: response.data };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
};