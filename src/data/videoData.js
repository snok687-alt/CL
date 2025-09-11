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
  const url = `/api/?ac=list&${params}`;
  return retry(() => axios.get(url));
};

// Format video data - ปรับตามโครงสร้าง API ใหม่
const formatVideo = (item) => ({
  id: item.vod_id || item.id,
  title: item.vod_name || item.title || 'ไม่มีชื่อ',
  channelName: item.vod_director || item.director || item.type_name || 'ไม่ระบุ',
  views: parseInt(item.vod_hits || item.hits || 0),
  duration: parseInt(item.vod_duration || item.duration || 0),
  uploadDate: item.vod_year || item.year || item.vod_time || 'ไม่ระบุ',
  thumbnail: item.vod_pic || item.pic || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=640&h=360&fit=crop',
  videoUrl: item.vod_play_url || item.url || '',
  description: item.vod_content || item.content || 'ไม่มีคำอธิบาย',
  category: item.type_name || item.type || item.vod_class || 'ทั่วไป',
  type_id: item.type_id || item.tid || '0', // เพิ่ม type_id
  rawData: item
});

// Get videos with details
const getVideosWithDetails = async (ids) => {
  if (!ids.length) return [];
  
  try {
    const response = await retry(() => 
      axios.get(`/api/?ac=detail&ids=${ids.join(',')}`)
    );
    return (response.data?.list || response.data?.data || []).map(formatVideo);
  } catch (error) {
    console.error('Error getting video details:', error);
    return [];
  }
};

// Main functions
export const fetchVideosFromAPI = async (type_id = '', searchQuery = '', limit = 20, page = 1) => {
  const cacheKey = `videos:${type_id}:${searchQuery}:${limit}:${page}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const params = new URLSearchParams();
    if (type_id && type_id !== 'all') params.set('t', type_id); // ใช้ type_id ที่ตรงกับ API
    if (searchQuery) params.set('wd', searchQuery);
    params.set('pg', page);
    params.set('limit', limit);

    const response = await apiCall(params.toString());
    // ปรับตามโครงสร้าง response ใหม่
    const videoList = response.data?.list || response.data?.data || [];
    
    if (!videoList.length) return [];

    const ids = videoList.map(item => item.vod_id || item.id).filter(Boolean);
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
      axios.get(`/api/?ac=detail&ids=${id}`)
    );
    
    // ปรับตามโครงสร้าง response ใหม่
    const videoData = response.data?.list?.[0] || response.data?.data?.[0];
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

export const getVideosByCategory = async (type_id, limit = 20) => {
  if (!type_id || type_id === 'all') {
    return fetchVideosFromAPI('', '', limit);
  }
  return fetchVideosFromAPI(type_id, '', limit);
};

// videoData.js - แก้ไขฟังก์ชัน getRelatedVideos
export const getRelatedVideos = async (currentVideoId, currentVideoTypeId, currentVideoTitle, limit = 12) => {
  if (!currentVideoTypeId) return [];

  try {
    // ใช้ type_id ในการค้นหาวิดีโอในหมวดหมู่เดียวกัน
    const categoryVideos = await fetchVideosFromAPI(currentVideoTypeId, '', limit * 2);
    
    // กรองวิดีโอปัจจุบันออกและจำกัดจำนวน
    const related = categoryVideos
      .filter(video => video.id !== currentVideoId)
      .slice(0, limit);

    return related;
  } catch (error) {
    console.error('Error getting related videos:', error);
    return [];
  }
};

export const getMoreVideosInCategory = async (type_id, excludeIds = [], page = 1, limit = 12) => {
  try {
    const videos = await fetchVideosFromAPI(type_id, '', limit * 2, page);
    
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
    const videos = response.data?.list || response.data?.data || [];
    
    // สร้าง array ของหมวดหมู่จาก type_id และ type_name
    const categoryMap = new Map();
    
    videos.forEach(item => {
      const typeId = item.type_id || item.tid;
      const typeName = item.type_name || item.type;
      
      if (typeId && typeName) {
        categoryMap.set(typeId, typeName);
      }
    });
    
    // แปลง Map เป็น array ของ object
    const categories = Array.from(categoryMap, ([id, name]) => ({
      id,
      name
    })).sort((a, b) => a.id - b.id);

    setToCache(cacheKey, categories);
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    // หมวดหมู่เริ่มต้นตาม type_id
    return [
      { id: '1', name: '伦理片' },
      { id: '2', name: '悬疑片' },
      { id: '3', name: '战争片' },
      { id: '4', name: '犯罪片' },
      { id: '5', name: '剧情片' },
      { id: '6', name: '恐怖片' },
      { id: '7', name: '科幻片' },
      { id: '8', name: '爱情片' },
      { id: '9', name: '喜剧片' },
      { id: '10', name: '动作片' },
      { id: '11', name: '奇幻片' },
      { id: '12', name: '冒险片' },
      { id: '13', name: '惊悚片' },
      { id: '14', name: '动画片' },
      { id: '15', name: '记录片' }
    ];
  }
};

export const getAllVideosByCategory = async (type_id, limit = 0) => {
  if (limit > 0) return getVideosByCategory(type_id, limit);
  
  const allVideos = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && allVideos.length < 500) {
    const result = await getMoreVideosInCategory(
      type_id, 
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
    const response = await axios.get('/api/?ac=list&limit=1', { timeout: 5000 });
    return { status: 'ok', data: response.data };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
};


// นักแสดง

// videoData.js - เพิ่มฟังก์ชันเหล่านี้

// ฟังก์ชันดึงข้อมูลนักแสดงทั้งหมด
export const getActors = async (limit = 50) => {
  const cacheKey = `actors:${limit}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    // ดึงวิดีโอจำนวนมากเพื่อแยกนักแสดง
    const videos = await fetchVideosFromAPI('', '', 200);
    
    // สร้าง Map เพื่อเก็บนักแสดงที่ไม่ซ้ำกัน
    const actorMap = new Map();
    
    videos.forEach(video => {
      // ใช้ channelName เป็นชื่อนักแสดง (อาจต้องปรับตามโครงสร้างข้อมูลจริง)
      const actorName = video.channelName;
      if (actorName && actorName !== 'ไม่ระบุ') {
        if (!actorMap.has(actorName)) {
          actorMap.set(actorName, {
            id: actorName, // ใช้ชื่อเป็น ID ชั่วคราว
            name: actorName,
            image: video.thumbnail, // ใช้ thumbnail จากวิดีโอแรกที่พบ
            videoCount: 1
          });
        } else {
          // อัปเดตจำนวนวิดีโอ
          actorMap.get(actorName).videoCount++;
        }
      }
    });
    
    // แปลง Map เป็น array และเรียงลำดับ
    const actors = Array.from(actorMap.values())
      .sort((a, b) => b.videoCount - a.videoCount)
      .slice(0, limit);
    
    setToCache(cacheKey, actors);
    return actors;
  } catch (error) {
    console.error('Error getting actors:', error);
    return [];
  }
};

// ฟังก์ชันดึงวิดีโอตามนักแสดง
export const getVideosByActor = async (actorName, limit = 50) => {
  const cacheKey = `videosByActor:${actorName}:${limit}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    // ดึงวิดีโอทั้งหมดแล้วกรองตามนักแสดง
    const allVideos = await fetchVideosFromAPI('', '', 200);
    
    // กรองวิดีโอตามนักแสดง
    const actorVideos = allVideos
      .filter(video => video.channelName === actorName)
      .slice(0, limit);
    
    setToCache(cacheKey, actorVideos);
    return actorVideos;
  } catch (error) {
    console.error('Error getting videos by actor:', error);
    return [];
  }
};