import axios from 'axios';

// ຕັ້ງຄ່າ axios
axios.defaults.timeout = 10000;

// ຟັງຊັນຊ່ວຍໃນການລອງໃໝ່
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

// Cache ງ່າຍໆ ເພື່ອເກັບຂໍ້ມູນໄວ້ຊົ່ວຄາວ
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 ນາທີ

// ດຶງຂໍ້ມູນຈາກ cache
const getFromCache = (key) => {
  const item = cache.get(key);
  if (!item || Date.now() - item.time > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return item.data;
};

// ເກັບຂໍ້ມູນໃນ cache
const setToCache = (key, data) => {
  if (cache.size > 50) cache.clear(); // ລ້າງ cache ເມື່ອຫຼາຍເກີນໄປ
  cache.set(key, { data, time: Date.now() });
};

// ຟັງຊັນຫຼັກໃນການເອີ້ນ API
const apiCall = async (params) => {
  const url = `/api/?ac=list&${params}`;
  return retry(() => axios.get(url));
};

// ຟັງຊັນດຶງຍອດວິວຈາກເຊີບເວີ
const fetchViewsFromServer = async (videoIds) => {
  try {
    const response = await fetch('/api/views/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ video_ids: videoIds }),
    });
    
    const viewsData = await response.json();
    return viewsData;
  } catch (error) {
    console.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງຍອດວິວ:', error);
    return {};
  }
};

// ປັບປຸງຟັງຊັນ formatVideo - ຈັດຮູບແບບຂໍ້ມູນວິດີໂອ
const formatVideo = (item, serverViews = {}) => ({
  id: item.vod_id || item.id,
  title: item.vod_name || item.title || 'ບໍ່ມີຊື່',
  channelName: item.vod_director || item.director || item.type_name || 'ບໍ່ລະບຸ',
  actors: item.vod_actor ? item.vod_actor.split(',').map(actor => actor.trim()) : [],
  views: serverViews[item.vod_id || item.id] || parseInt(item.vod_hits || item.hits || 0),
  duration: parseInt(item.vod_duration || item.duration || 0),
  uploadDate: item.vod_year || item.year || item.vod_time || 'ບໍ່ລະບຸ',
  thumbnail: item.vod_pic || item.pic || '',
  videoUrl: item.vod_play_url || item.url || '',
  description: item.vod_content || item.content || 'ບໍ່ມີຄຳອະທິບາຍ',
  category: item.type_name || item.type || item.vod_class || 'ທົ່ວໄປ',
  type_id: item.type_id || item.tid || '0', 
  rawData: item
});

// ດຶງວິດີໂອພ້ອມລາຍລະອຽດ
const getVideosWithDetails = async (ids) => {
  if (!ids.length) return [];

  try {
    const response = await retry(() =>
      axios.get(`/api/?ac=detail&ids=${ids.join(',')}`)
    );
    return (response.data?.list || response.data?.data || []).map(formatVideo);
  } catch (error) {
    console.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງລາຍລະອຽດວິດີໂອ:', error);
    return [];
  }
};

// ຟັງຊັນຫຼັກ - ດຶງວິດີໂອຈາກ API
export const fetchVideosFromAPI = async (type_id = '', searchQuery = '', limit = 18, page = 1) => {
  const cacheKey = `videos:${type_id}:${searchQuery}:${limit}:${page}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const params = new URLSearchParams();
    if (type_id && type_id !== 'all') params.set('t', type_id);
    if (searchQuery) params.set('wd', searchQuery);
    params.set('pg', page);

    const response = await apiCall(params.toString());
    const videoList = response.data?.list || response.data?.data || [];

    if (!videoList.length) return [];

    const ids = videoList.map(item => item.vod_id || item.id).filter(Boolean);
    
    // ດຶງຍອດວິວຈາກເຊີບເວີ
    const serverViews = await fetchViewsFromServer(ids);
    
    const allVideos = await getVideosWithDetails(ids);
    
    // ລວມຍອດວິວຈາກເຊີບເວີ
    const videosWithServerViews = allVideos.map(video => ({
      ...video,
      views: serverViews[video.id] || video.views
    }));

    // ຈຳກັດຈຳນວນວິດີໂອທີ່ສົ່ງກັບ
    const videos = videosWithServerViews.slice(0, limit);

    setToCache(cacheKey, videos);
    return videos;
  } catch (error) {
    console.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງວິດີໂອ:', error);
    return [];
  }
};

// ດຶງວິດີໂອຕາມ ID
export const getVideoById = async (id) => {
  const cacheKey = `video:${id}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await retry(() =>
      axios.get(`/api/?ac=detail&ids=${id}`)
    );

    // ປັບຕາມໂຄງສ້າງ response ໃໝ່
    const videoData = response.data?.list?.[0] || response.data?.data?.[0];
    if (!videoData) return null;

    const video = formatVideo(videoData);
    setToCache(cacheKey, video);
    return video;
  } catch (error) {
    console.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງວິດີໂອຕາມ ID:', error);
    return null;
  }
};

// ຄົ້ນຫາວິດີໂອ
export const searchVideos = async (query, limit = 18) => {
  if (!query.trim()) return [];
  return fetchVideosFromAPI('', query, limit);
};

// ດຶງວິດີໂອຕາມໝວດໝູ່
export const getVideosByCategory = async (type_id, limit = 18) => {
  if (!type_id || type_id === 'all') {
    return fetchVideosFromAPI('', '', limit);
  }
  return fetchVideosFromAPI(type_id, '', limit);
};

// ດຶງວິດີໂອທີ່ກ່ຽວຂ້ອງ
export const getRelatedVideos = async (currentVideoId, currentVideoTypeId, currentVideoTitle, limit = 18) => {
  if (!currentVideoTypeId) return [];

  try {
    // ໃຊ້ type_id ໃນການຄົ້ນຫາວິດີໂອໃນໝວດໝູ່ຄືກັນ
    const categoryVideos = await fetchVideosFromAPI(currentVideoTypeId, '', limit);

    // ກອງວິດີໂອປັດຈຸບັນອອກແລະຈຳກັດຈຳນວນ
    const related = categoryVideos
      .filter(video => video.id !== currentVideoId)
      .slice(0, limit);

    return related;
  } catch (error) {
    console.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງວິດີໂອທີ່ກ່ຽວຂ້ອງ:', error);
    return [];
  }
};

// ດຶງວິດີໂອເພີ່ມເຕີມໃນໝວດໝູ່
export const getMoreVideosInCategory = async (type_id, excludeIds = [], page = 1, limit = 18) => {
  try {
    const videos = await fetchVideosFromAPI(type_id, '', limit, page);

    // ກອງວິດີໂອທີ່ບໍ່ໄດ້ຢູ່ໃນ excludeIds
    const filtered = videos.filter(video => !excludeIds.includes(video.id));
    
    // ເຮັນລຳດັບຕາມຍອດວິວຈາກສູງໄປຕ່ຳ
    const sortedByViews = filtered.sort((a, b) => b.views - a.views);

    return {
      videos: sortedByViews,
      hasMore: videos.length === limit // ກວດສອບວ່າຍັງມີວິດີໂອເຫຼືອຫຼື່ບໍ່
    };
  } catch (error) {
    console.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງວິດີໂອເພີ່ມເຕີມ:', error);
    return { videos: [], hasMore: false };
  }
};

// ດຶງລາຍການໝວດໝູ່
export const getCategories = async () => {
  const cacheKey = 'categories';
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await apiCall('limit=100');
    const videos = response.data?.list || response.data?.data || [];

    // ສ້າງ array ຂອງໝວດໝູ່ຈາກ type_id ແລະ type_name
    const categoryMap = new Map();

    videos.forEach(item => {
      const typeId = item.type_id || item.tid;
      const typeName = item.type_name || item.type;

      if (typeId && typeName) {
        categoryMap.set(typeId, typeName);
      }
    });

    // ແປງ Map ເປັນ array ຂອງ object
    const categories = Array.from(categoryMap, ([id, name]) => ({
      id,
      name
    })).sort((a, b) => a.id - b.id);

    setToCache(cacheKey, categories);
    return categories;
  } catch (error) {
    console.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງໝວດໝູ່:', error);
    // ໝວດໝູ່ເລີ່ມຕົ້ນ
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

// ດຶງວິດີໂອທັງໝົດໃນໝວດໝູ່
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

// ດຶງວິດີໂອທັງໝົດ
export const getAllVideos = async (limit = 18) => {
  return fetchVideosFromAPI('', '', limit);
};

// ກວດສອບສະຖານະ API
export const checkAPIStatus = async () => {
  try {
    const response = await axios.get('/api/?ac=list&limit=1', { timeout: 5000 });
    return { status: 'ok', data: response.data };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
};

// === ຟັງຊັນສຳລັບນັກສະແດງ ===

// ດຶງຂໍ້ມູນນັກສະແດງທັງໝົດ
export const getActors = async (limit = 50) => {
  const cacheKey = `actors:${limit}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    // ດຶງວິດີໂອຈຳນວນຫຼາຍເພື່ອແຍກນັກສະແດງ
    const videos = await fetchVideosFromAPI('', '', 200);

    // ສ້າງ Map ເພື່ອເກັບນັກສະແດງທີ່ບໍ່ຊ້ຳກັນ
    const actorMap = new Map();

    videos.forEach(video => {
      // ໃຊ້ channelName ເປັນຊື່ນັກສະແດງ (ອາດຕ້ອງປັບຕາມໂຄງສ້າງຂໍ້ມູນຈິງ)
      const actorName = video.channelName;
      if (actorName && actorName !== 'ບໍ່ລະບຸ') {
        if (!actorMap.has(actorName)) {
          actorMap.set(actorName, {
            id: actorName, // ໃຊ້ຊື່ເປັນ ID ຊົ່ວຄາວ
            name: actorName,
            image: video.thumbnail, // ໃຊ້ thumbnail ຈາກວິດີໂອແຮກທີ່ພົບ
            videoCount: 1
          });
        } else {
          // ອັບເດດຈຳນວນວິດີໂອ
          actorMap.get(actorName).videoCount++;
        }
      }
    });

    // ແປງ Map ເປັນ array ແລະເຮັນລຳດັບ
    const actors = Array.from(actorMap.values())
      .sort((a, b) => b.videoCount - a.videoCount)
      .slice(0, limit);

    setToCache(cacheKey, actors);
    return actors;
  } catch (error) {
    console.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນນັກສະແດງ:', error);
    return [];
  }
};

// ດຶງວິດີໂອຕາມນັກສະແດງ
export const getVideosByActor = async (actorName, limit = 50) => {
  const cacheKey = `videosByActor:${actorName}:${limit}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    // ດຶງວິດີໂອທັງໝົດແລ້ວກອງຕາມນັກສະແດງ
    const allVideos = await fetchVideosFromAPI('', '', 200);

    // ກອງວິດີໂອຕາມນັກສະແດງ
    const actorVideos = allVideos
      .filter(video => video.channelName === actorName)
      .slice(0, limit);

    setToCache(cacheKey, actorVideos);
    return actorVideos;
  } catch (error) {
    console.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງວິດີໂອຂອງນັກສະແດງ:', error);
    return [];
  }
};

// ດຶງຂໍ້ມູນລາຍລະອຽດຂອງນັກສະແດງ
export const getProfileDetails = async (actorName) => {
  try {
    // ດຶງວິດີໂອທັງໝົດຂອງນັກສະແດງຄົນນີ້
    const videos = await getVideosByActor(actorName, 50);
    
    if (videos.length === 0) {
      return {
        name: actorName,
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
        age: 'ບໍ່ລະບຸ',
        height: 'ບໍ່ລະບຸ',
        weight: 'ບໍ່ລະບຸ',
        nationality: 'ບໍ່ລະບຸ',
        other: 'ບໍ່ລະບຸ',
        bio: `ບໍ່ມີຂໍ້ມູນເພີ່ມເຕີມເກີ່ຍວກັບ ${actorName}`,
        videoCount: 0
      };
    }

    // ໃຊ້ຂໍ້ມູນຈາກວິດີໂອແຮກເພື່ອສ້າງໂປຣໄຟລ໌
    const firstVideo = videos[0];
    
    return {
      name: actorName,
      image: firstVideo.thumbnail,
      age: 'ບໍ່ລະບຸ',
      height: 'ບໍ່ລະບຸ',
      weight: 'ບໍ່ລະບຸ',
      nationality: 'ບໍ່ລະບຸ',
      other: 'ບໍ່ລະບຸ',
      bio: `${actorName} ເປັນນັກສະແດງທີ່ມີຜົນງານທັງໝົດ ${videos.length} ເລື່ອງ ໃນໝວດໝູ່ ${firstVideo.category}`,
      videoCount: videos.length
    };
  } catch (error) {
    console.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນລາຍລະອຽດ:', error);
    return {
      name: actorName,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
      age: 'ບໍ່ລະບຸ',
      height: 'ບໍ່ລະບຸ',
      weight: 'ບໍ່ລະບຸ',
      nationality: 'ບໍ່ລະບຸ',
      other: 'ບໍ່ລະບຸ',
      bio: `ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນຂອງ ${actorName}`,
      videoCount: 0
    };
  }
};

// ດຶງຮູບພາບຂອງນັກສະແດງ
export const getProfileImages = async (actorName) => {
  try {
    // ດຶງວິດີໂອຂອງນັກສະແດງ
    const videos = await getVideosByActor(actorName, 20);
    
    // ສ້າງອາຣເຣຂອງຮູບ thumbnail ຈາກວິດີໂອ
    const images = videos.map(video => video.thumbnail).filter(Boolean);
    
    // ຫາກບໍ່ມີຮູບ ໃຫ້ໃຊ້ຮູບ default
    if (images.length === 0) {
      return ['https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop'];
    }
    
    return images;
  } catch (error) {
    console.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງຮູບພາບ:', error);
    return ['https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop'];
  }
};

// ດຶງວິດີໂອຂອງນັກສະແດງສຳລັບໂປຣໄຟລ໌
export const getProfileVideos = async (actorName) => {
  try {
    // ດຶງວິດີໂອຂອງນັກສະແດງ
    return await getVideosByActor(actorName, 12);
  } catch (error) {
    console.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງວິດີໂອໂປຣໄຟລ໌:', error);
    return [];
  }
};