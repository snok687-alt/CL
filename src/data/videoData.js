import axios from 'axios';

// กำหนด timeout และ retry settings
axios.defaults.timeout = 15000; // 15 วินาที

// ฟังก์ชัน retry สำหรับ request ที่ล้มเหลว
const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      console.warn(`Request failed (attempt ${i + 1}/${maxRetries}):`, error.message);
      
      if (i === maxRetries - 1) throw error;
      
      // เพิ่ม delay แบบ exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};

// ฟังก์ชันดึงข้อมูลวิดีโอแบบ batch (หลาย ID พร้อมกัน) - ปรับปรุงแล้ว
const fetchBatchVideoDetails = async (vodIds) => {
  try {
    if (!vodIds || vodIds.length === 0) return [];
    
    console.log('Fetching batch details for IDs:', vodIds);
    
    const idsParam = vodIds.join(',');
    const response = await retryRequest(
      () => axios.get(`/api/provide/vod/?ac=detail&ids=${idsParam}`),
      2,
      1000
    );
    
    const videoDataList = response.data?.list || [];
    console.log('Batch response received:', videoDataList.length, 'items');
    
    return videoDataList.map(videoData => ({
      id: videoData.vod_id,
      title: videoData.vod_name || 'ไม่มีชื่อ',
      channelName: videoData.vod_director || videoData.type_name || 'ไม่ระบุ',
      views: parseInt(videoData.vod_hits) || 0,
      duration: parseInt(videoData.vod_duration) || 0,
      uploadDate: videoData.vod_year || videoData.vod_time || 'ไม่ระบุ',
      thumbnail: videoData.vod_pic || '',
      videoUrl: videoData.vod_play_url || '',
      description: videoData.vod_content || 'ไม่มีคำอธิบาย',
      category: videoData.type_name || videoData.vod_class || 'ทั่วไป',
      rawData: videoData
    }));
  } catch (error) {
    console.error(`Error fetching batch details for videos:`, error);
    return [];
  }
};

// ฟังก์ชันแบ่ง array เป็น chunks
const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

// ฟังก์ชันดึงข้อมูลวิดีโอจาก API - ปรับปรุงแล้ว
// ฟังก์ชันดึงข้อมูลวิดีโอจาก API - เพิ่มพารามิเตอร์ page
export const fetchVideosFromAPI = async (category = '', searchQuery = '', limit = 20, page = 1) => {
  try {
    let url = '/api/provide/vod/?ac=list';
    const params = [];
    
    if (category && category !== 'all') {
      params.push(`t=${encodeURIComponent(category)}`);
    }
    
    if (searchQuery) {
      params.push(`wd=${encodeURIComponent(searchQuery)}`);
    }
    
    // เพิ่ม pagination parameter
    params.push(`pg=${page}`);
    
    // เพิ่ม limit parameter
    params.push(`limit=${limit}`);
    
    if (params.length > 0) {
      url += '&' + params.join('&');
    }
    
    console.log('Fetching video list from:', url);
    
    const response = await retryRequest(
      () => axios.get(url),
      3,
      1000
    );
    
    const videoList = response.data?.list || [];
    console.log('Found', videoList.length, 'videos in list');
    
    if (videoList.length === 0) {
      console.log('No videos found, trying alternative approach');
      return [];
    }
    
    // จำกัดจำนวนวิดีโอที่โหลด
    const limitedVideos = videoList.slice(0, Math.min(limit, videoList.length));
    const vodIds = limitedVideos.map(item => item.vod_id).filter(Boolean);
    
    if (vodIds.length === 0) {
      console.log('No valid video IDs found');
      return [];
    }
    
    // ดึงรายละเอียดวิดีโอ
    return await fetchBatchVideoDetails(vodIds);
    
  } catch (error) {
    console.error('Error fetching videos from API:', error);
    return [];
  }
};

// ฟังก์ชันสำหรับดึงวิดีโอโดย ID - ปรับปรุงแล้ว
export const getVideoById = async (id) => {
  try {
    if (!id) return null;
    
    console.log('Fetching video details for ID:', id);
    
    const response = await retryRequest(
      () => axios.get(`/api/provide/vod/?ac=detail&ids=${id}`),
      3,
      1000
    );
    
    const videoData = response.data?.list?.[0];
    
    if (!videoData) {
      console.log('No video data found for ID:', id);
      return null;
    }
    
    return {
      id: videoData.vod_id,
      title: videoData.vod_name || 'ไม่มีชื่อ',
      channelName: videoData.vod_director || videoData.type_name || 'ไม่ระบุ',
      views: parseInt(videoData.vod_hits) || 0,
      duration: parseInt(videoData.vod_duration) || 0,
      uploadDate: videoData.vod_year || videoData.vod_time || 'ไม่ระบุ',
      thumbnail: videoData.vod_pic || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=640&h=360&fit=crop',
      videoUrl: videoData.vod_play_url || '',
      description: videoData.vod_content || 'ไม่มีคำอธิบาย',
      category: videoData.type_name || videoData.vod_class || 'ทั่วไป',
      rawData: videoData
    };
  } catch (error) {
    console.error(`Error fetching details for video ${id}:`, error);
    return null;
  }
};

// ฟังก์ชันสำหรับค้นหาวิดีโอ - ปรับปรุงแล้ว
export const searchVideos = async (query, limit = 20) => {
  try {
    if (!query || query.trim() === '') {
      console.log('Empty search query');
      return [];
    }
    
    console.log('Searching videos for query:', query);
    
    const response = await retryRequest(
      () => axios.get(`/api/provide/vod/?ac=list&wd=${encodeURIComponent(query)}&limit=${limit}`),
      3,
      1000
    );
    
    const videoList = response.data?.list || [];
    console.log('Search found', videoList.length, 'results');
    
    if (videoList.length === 0) return [];
    
    const vodIds = videoList.slice(0, limit).map(item => item.vod_id).filter(Boolean);
    
    if (vodIds.length === 0) return [];
    
    return await fetchBatchVideoDetails(vodIds);
  } catch (error) {
    console.error('Error searching videos:', error);
    return [];
  }
};

// ฟังก์ชันสำหรับดึงวิดีโอตามหมวดหมู่ - ปรับปรุงแล้ว
export const getVideosByCategory = async (category, limit = 20) => {
  try {
    if (!category || category === 'all') {
      return await getAllVideos(limit);
    }
    
    console.log('Fetching videos for category:', category);
    
    const response = await retryRequest(
      () => axios.get(`/api/provide/vod/?ac=list&t=${encodeURIComponent(category)}&limit=${limit}`),
      3,
      1000
    );
    
    const videoList = response.data?.list || [];
    console.log('Category search found', videoList.length, 'results');
    
    if (videoList.length === 0) {
      console.log('No videos found for category, trying alternative search');
      return await searchVideos(category, limit);
    }
    
    const vodIds = videoList.slice(0, limit).map(item => item.vod_id).filter(Boolean);
    
    if (vodIds.length === 0) return [];
    
    return await fetchBatchVideoDetails(vodIds);
  } catch (error) {
    console.error('Error fetching videos by category:', error);
    return [];
  }
};

// เพิ่มฟังก์ชันนี้ในไฟล์ data/videoData.js

// ฟังก์ชันใหม่สำหรับโหลดวิดีโอหลายหน้าพร้อมกัน
export const getAllVideosWithPagination = async (startPage = 1, pageCount = 1, limit = 18) => {
  try {
    console.log(`Loading pages ${startPage} to ${startPage + pageCount - 1}, limit per page: ${limit}`);
    
    const allVideos = [];
    const seenIds = new Set();
    let totalPagesProcessed = 0;
    let hasMorePages = true;

    // โหลดหลายหน้าพร้อมกัน แต่แบ่งเป็นกลุมเล็กๆ เพื่อไม่ให้เซิร์ฟเวอร์ล้น
    const batchSize = 3; // โหลดครั้งละ 3 หน้า
    
    for (let batchStart = startPage; batchStart < startPage + pageCount; batchStart += batchSize) {
      const batchEnd = Math.min(batchStart + batchSize - 1, startPage + pageCount - 1);
      const batchPromises = [];
      
      // สร้าง promises สำหรับ batch นี้
      for (let page = batchStart; page <= batchEnd; page++) {
        batchPromises.push(
          retryRequest(
            () => axios.get(`/api/provide/vod/?ac=list&pg=${page}&limit=${limit}`),
            2,
            1000
          ).catch(error => {
            console.warn(`Failed to load page ${page}:`, error.message);
            return { data: { list: [] } }; // return empty result on failure
          })
        );
      }
      
      try {
        console.log(`Processing batch: pages ${batchStart}-${batchEnd}`);
        
        // รอให้ทุก request ในกลุ่มนี้เสร็จ
        const batchResults = await Promise.allSettled(batchPromises);
        
        // ประมวลผลแต่ละหน้าในกลุ่ม
        for (let i = 0; i < batchResults.length; i++) {
          const result = batchResults[i];
          const currentPage = batchStart + i;
          
          if (result.status === 'fulfilled') {
            const videoList = result.value.data?.list || [];
            console.log(`Page ${currentPage}: found ${videoList.length} videos`);
            
            if (videoList.length === 0) {
              console.log(`Page ${currentPage}: No videos found, might be end of data`);
              hasMorePages = false;
              continue;
            }
            
            // เก็บ video IDs ที่ไม่ซ้ำ
            const pageVideoIds = videoList
              .map(item => item.vod_id)
              .filter(id => id && !seenIds.has(id))
              .slice(0, limit);
            
            if (pageVideoIds.length > 0) {
              // ดึงรายละเอียดแบบ batch
              try {
                const batchDetails = await fetchBatchVideoDetails(pageVideoIds);
                
                // กรองวิดีโอที่ได้รายละเอียดครบถ้วน
                const validVideos = batchDetails.filter(video => 
                  video && video.id && !seenIds.has(video.id)
                );
                
                // เพิ่มใน Set เพื่อป้องกันซ้ำ
                validVideos.forEach(video => seenIds.add(video.id));
                allVideos.push(...validVideos);
                
                console.log(`Page ${currentPage}: added ${validVideos.length} valid videos`);
                
              } catch (detailError) {
                console.error(`Error fetching details for page ${currentPage}:`, detailError);
                
                // หาก batch detail ล้มเหลว ให้ใช้ข้อมูลพื้นฐาน
                const basicVideos = videoList
                  .filter(item => item.vod_id && !seenIds.has(item.vod_id))
                  .slice(0, limit)
                  .map(item => {
                    seenIds.add(item.vod_id);
                    return {
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
                    };
                  });
                
                allVideos.push(...basicVideos);
                console.log(`Page ${currentPage}: added ${basicVideos.length} basic videos as fallback`);
              }
            }
            
            totalPagesProcessed++;
          } else {
            console.warn(`Page ${currentPage}: Request failed`);
          }
        }
        
        // หยุดชั่วคราวระหว่างกลุ่ม
        if (batchEnd < startPage + pageCount - 1) {
          await new Promise(resolve => setTimeout(resolve, 800));
        }
        
      } catch (error) {
        console.error(`Error processing batch ${batchStart}-${batchEnd}:`, error);
      }
    }

    // เรียงลำดับผลลัพธ์ตามจำนวนการดู
    const sortedVideos = allVideos
      .filter((video, index, self) => 
        video && video.id && self.findIndex(v => v.id === video.id) === index
      )
      .sort((a, b) => {
        // เรียงตามจำนวนการดู
        const viewsA = parseInt(a.views) || 0;
        const viewsB = parseInt(b.views) || 0;
        
        if (viewsB !== viewsA) {
          return viewsB - viewsA;
        }
        
        // หากจำนวนการดูเท่ากัน เรียงตามความใหม่
        const timeA = new Date(a.uploadDate || 0).getTime();
        const timeB = new Date(b.uploadDate || 0).getTime();
        return timeB - timeA;
      });

    console.log(`
      Total pages processed: ${totalPagesProcessed}/${pageCount}
      Total unique videos loaded: ${sortedVideos.length}
      Has more pages: ${hasMorePages && totalPagesProcessed === pageCount}
    `);

    return {
      videos: sortedVideos,
      hasMore: hasMorePages && totalPagesProcessed === pageCount,
      totalPagesLoaded: totalPagesProcessed,
      totalVideos: sortedVideos.length
    };
    
  } catch (error) {
    console.error('Error in getAllVideosWithPagination:', error);
    return {
      videos: [],
      hasMore: false,
      totalPagesLoaded: 0,
      totalVideos: 0
    };
  }
};

// ฟังก์ชันเสริมสำหรับตรวจสอบคุณภาพข้อมูล
export const validateAndCleanVideos = (videos) => {
  return videos
    .filter(video => {
      // ตรวจสอบข้อมูลพื้นฐาน
      if (!video || !video.id) return false;
      if (!video.title || video.title.trim() === '') return false;
      
      // ตรวจสอบข้อมูลเพิ่มเติม
      if (video.title.length > 200) video.title = video.title.substring(0, 200) + '...';
      if (!video.thumbnail || video.thumbnail === '') {
        video.thumbnail = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=640&h=360&fit=crop';
      }
      
      return true;
    })
    .map(video => ({
      ...video,
      views: parseInt(video.views) || 0,
      duration: parseInt(video.duration) || 0,
      uploadDate: video.uploadDate || 'ไม่ระบุ',
      channelName: video.channelName || 'ไม่ระบุ',
      description: video.description || 'ไม่มีคำอธิบาย',
      category: video.category || 'ทั่วไป'
    }));
};

// ฟังก์ชันเสริมสำหรับการจัดการ cache ขั้นสูง (เฉพาะสำหรับหน้าหลัก)
export const homepageVideoCache = {
  data: null,
  timestamp: null,
  ttl: 30 * 60 * 1000, // 30 นาที
  
  get() {
    if (!this.data || !this.timestamp) return null;
    if (Date.now() - this.timestamp > this.ttl) {
      this.clear();
      return null;
    }
    return this.data;
  },
  
  set(videos) {
    this.data = videos;
    this.timestamp = Date.now();
    console.log(`Cached ${videos.length} videos for homepage`);
  },
  
  clear() {
    this.data = null;
    this.timestamp = null;
  },
  
  isValid() {
    return this.data && this.timestamp && (Date.now() - this.timestamp <= this.ttl);
  }
};

// ฟังก์ชันเสริมสำหรับการโหลดข้อมูลแบบ progressive (โหลดแต่น้อย แล้วค่อยเพิ่ม)
export const getProgressiveAllVideos = async (initialPages = 5, maxPages = 50) => {
  try {
    // ตรวจสอบ cache ก่อน
    const cachedData = homepageVideoCache.get();
    if (cachedData) {
      console.log('Using cached homepage data');
      return cachedData;
    }
    
    console.log(`Starting progressive loading: initial ${initialPages} pages, max ${maxPages} pages`);
    
    // โหลดข้อมูลเริ่มต้น
    const initialResult = await getAllVideosWithPagination(1, initialPages, 18);
    
    if (initialResult.videos.length === 0) {
      console.warn('No initial videos loaded');
      return initialResult;
    }
    
    console.log(`Initial load complete: ${initialResult.videos.length} videos from ${initialPages} pages`);
    
    // Cache ข้อมูลเริ่มต้น
    homepageVideoCache.set(initialResult);
    
    // ถ้ามีข้อมูลเพิ่มเติม และต้องการโหลดต่อ
    if (initialResult.hasMore && initialPages < maxPages) {
      // โหลดเพิ่มในพื้นหลัง (ไม่รอ)
      setTimeout(async () => {
        try {
          console.log('Starting background loading for remaining pages...');
          const remainingPages = maxPages - initialPages;
          const backgroundResult = await getAllVideosWithPagination(
            initialPages + 1, 
            remainingPages, 
            18
          );
          
          if (backgroundResult.videos.length > 0) {
            // รวมข้อมูลใหม่กับข้อมูลเดิม
            const combinedVideos = [
              ...initialResult.videos,
              ...backgroundResult.videos
            ].filter((video, index, self) => 
              self.findIndex(v => v.id === video.id) === index
            );
            
            // อัปเดต cache
            const combinedResult = {
              videos: combinedVideos,
              hasMore: backgroundResult.hasMore,
              totalPagesLoaded: initialPages + backgroundResult.totalPagesLoaded,
              totalVideos: combinedVideos.length
            };
            
            homepageVideoCache.set(combinedResult);
            console.log(`Background loading complete: total ${combinedVideos.length} videos`);
          }
        } catch (error) {
          console.error('Background loading failed:', error);
        }
      }, 2000);
    }
    
    return initialResult;
    
  } catch (error) {
    console.error('Error in progressive loading:', error);
    return {
      videos: [],
      hasMore: false,
      totalPagesLoaded: 0,
      totalVideos: 0
    };
  }
};

// อัปเดตฟังก์ชัน getAllVideos ให้ใช้ progressive loading สำหรับหน้าหลัก
export const getAllVideos = async (limit = 20, useProgressive = false) => {
  try {
    if (useProgressive) {
      const result = await getProgressiveAllVideos(15, 100);
      return result.videos.slice(0, limit);
    }
    
    // ใช้วิธีเดิมสำหรับการโหลดปกติ
    console.log('Fetching all videos, limit:', limit);
    
    const response = await retryRequest(
      () => axios.get(`/api/provide/vod/?ac=list&limit=${limit}`),
      3,
      1000
    );
    
    const videoList = response.data?.list || [];
    console.log('All videos found:', videoList.length);
    
    if (videoList.length === 0) return [];
    
    const vodIds = videoList.slice(0, limit).map(item => item.vod_id).filter(Boolean);
    
    if (vodIds.length === 0) return [];
    
    return await fetchBatchVideoDetails(vodIds);
  } catch (error) {
    console.error('Error fetching all videos:', error);
    return [];
  }
};

// ฟังก์ชันสำหรับดึงวิดีโอที่เกี่ยวข้อง - ปรับปรุงใหม่หมด
// ฟังก์ชันสำหรับดึงวิดีโอที่เกี่ยวข้อง - ปรับปรุงใหม่ให้เฉพาะหมวดหมู่เดียวกัน
export const getRelatedVideos = async (currentVideoId, currentVideoCategory, currentVideoTitle, limit = 12) => {
  try {
    if (!currentVideoId) return [];
    
    console.log('Fetching related videos for:', { 
      currentVideoId, 
      currentVideoCategory, 
      currentVideoTitle: currentVideoTitle?.substring(0, 50) 
    });
    
    let allRelatedVideos = [];
    const seenIds = new Set([currentVideoId]);

    // หากไม่มีหมวดหมู่ ให้ return ว่างเปล่า
    if (!currentVideoCategory || currentVideoCategory.trim() === '') {
      console.log('No category provided, returning empty results');
      return [];
    }

    // กลยุทธ์หลัก: ค้นหาจากหมวดหมู่เดียวกันเท่านั้น
    try {
      console.log(`Searching for videos in category: ${currentVideoCategory}`);
      
      // ลองหลายวิธีในการค้นหาหมวดหมู่
      const categoryStrategies = [
        // ใช้ type_name ตรงๆ
        `t=${encodeURIComponent(currentVideoCategory)}`,
        // ใช้ vod_class
        `class=${encodeURIComponent(currentVideoCategory)}`,
        // ค้นหาจากคำค้นหา (สำหรับกรณีที่หมวดหมู่เป็นชื่อ)
        `wd=${encodeURIComponent(currentVideoCategory)}`,
        // ลองใช้ type_id หากมี (จากที่เราเห็นในข้อมูล API มี type_id 20, 40-53)
        currentVideoCategory.includes('伦理片') ? 't=20' : 
        currentVideoCategory.includes('悬疑片') ? 't=40' :
        currentVideoCategory.includes('战争片') ? 't=41' :
        currentVideoCategory.includes('犯罪片') ? 't=42' :
        currentVideoCategory.includes('剧情片') ? 't=43' :
        currentVideoCategory.includes('恐怖片') ? 't=44' :
        currentVideoCategory.includes('科幻片') ? 't=45' :
        currentVideoCategory.includes('爱情片') ? 't=46' :
        currentVideoCategory.includes('喜剧片') ? 't=47' :
        currentVideoCategory.includes('动作片') ? 't=48' :
        currentVideoCategory.includes('奇幻片') ? 't=49' :
        currentVideoCategory.includes('冒险片') ? 't=50' :
        currentVideoCategory.includes('惊悚片') ? 't=51' :
        currentVideoCategory.includes('动画片') ? 't=52' :
        currentVideoCategory.includes('记录片') ? 't=53' : null
      ].filter(Boolean);

      // ลองแต่ละกลยุทธ์จนกว่าจะได้วิดีโอครบตามที่ต้องการ
      for (const strategy of categoryStrategies) {
        if (allRelatedVideos.length >= limit) break;
        
        try {
          console.log(`Trying category strategy: ${strategy}`);
          
          // เพิ่ม pagination เพื่อให้ได้วิดีโอหลากหลายในหมวดหมู่เดียวกัน
          const pages = [1, 2, 3]; // ลองดึงจาก 3 หน้าแรก
          
          for (const page of pages) {
            if (allRelatedVideos.length >= limit) break;
            
            const response = await retryRequest(
              () => axios.get(`/api/provide/vod/?ac=list&${strategy}&pg=${page}&limit=${limit * 2}`),
              2,
              1000
            );
            
            const categoryList = response.data?.list || [];
            console.log(`Category strategy page ${page} found: ${categoryList.length} videos`);
            
            if (categoryList.length > 0) {
              // กรองเอาแต่วิดีโอที่ยังไม่เห็น และอยู่ในหมวดหมู่เดียวกัน
              const filteredVideos = categoryList.filter(item => {
                if (!item.vod_id || seenIds.has(item.vod_id)) return false;
                
                // ตรวจสอบว่าอยู่ในหมวดหมู่เดียวกันหรือไม่
                const itemCategory = item.type_name || item.vod_class || '';
                return itemCategory === currentVideoCategory;
              });
              
              const idsToFetch = filteredVideos
                .slice(0, limit - allRelatedVideos.length)
                .map(item => {
                  seenIds.add(item.vod_id);
                  return item.vod_id;
                });
              
              if (idsToFetch.length > 0) {
                const batchVideos = await fetchBatchVideoDetails(idsToFetch);
                // กรองอีกครั้งหลังจากได้ detail เพื่อให้แน่ใจว่าเป็นหมวดหมู่เดียวกัน
                const sameCategoryVideos = batchVideos.filter(video => 
                  video.category === currentVideoCategory || 
                  video.rawData?.type_name === currentVideoCategory
                );
                
                allRelatedVideos.push(...sameCategoryVideos);
                console.log(`Added ${sameCategoryVideos.length} videos from category strategy page ${page}`);
                
                // เพิ่ม delay เล็กน้อยเพื่อไม่ให้ server ล้น
                await new Promise(resolve => setTimeout(resolve, 300));
              }
            }
          }
          
          // หากได้วิดีโอครบแล้วจากกลยุทธ์นี้ ไม่ต้องลองกลยุทธ์อื่น
          if (allRelatedVideos.length >= limit) break;
          
        } catch (error) {
          console.warn(`Category strategy failed: ${strategy}`, error.message);
          continue; // ลองกลยุทธ์ถัดไป
        }
      }
      
    } catch (error) {
      console.warn('All category strategies failed:', error.message);
    }

    // หากยังได้วิดีโอไม่เพียงพอ ให้ลองค้นหาจากคำสำคัญในชื่อ (แต่ยังคงกรองตามหมวดหมู่)
    if (allRelatedVideos.length < limit && currentVideoTitle) {
      try {
        // แยกคำสำคัญจากชื่อ
        const keywords = currentVideoTitle
          .replace(/[^\u0E00-\u0E7Fa-zA-Z0-9\s]/g, ' ')
          .split(/\s+/)
          .filter(word => word.length >= 2)
          .slice(0, 2); // ลดเหลือ 2 คำเพื่อความแม่นยำ
        
        for (const keyword of keywords) {
          if (allRelatedVideos.length >= limit) break;
          
          console.log(`Searching by keyword in same category: ${keyword}`);
          
          const response = await retryRequest(
            () => axios.get(`/api/provide/vod/?ac=list&wd=${encodeURIComponent(keyword)}&limit=${limit * 2}`),
            2,
            1000
          );
          
          const keywordList = response.data?.list || [];
          
          if (keywordList.length > 0) {
            // กรองเฉพาะวิดีโอในหมวดหมู่เดียวกันเท่านั้น
            const sameCategoryItems = keywordList.filter(item => {
              if (!item.vod_id || seenIds.has(item.vod_id)) return false;
              const itemCategory = item.type_name || item.vod_class || '';
              return itemCategory === currentVideoCategory;
            });
            
            const idsToFetch = sameCategoryItems
              .slice(0, limit - allRelatedVideos.length)
              .map(item => {
                seenIds.add(item.vod_id);
                return item.vod_id;
              });
            
            if (idsToFetch.length > 0) {
              const batchVideos = await fetchBatchVideoDetails(idsToFetch);
              const sameCategoryVideos = batchVideos.filter(video => 
                video.category === currentVideoCategory ||
                video.rawData?.type_name === currentVideoCategory
              );
              
              allRelatedVideos.push(...sameCategoryVideos);
              console.log(`Added ${sameCategoryVideos.length} videos from keyword: ${keyword} in same category`);
            }
          }
        }
      } catch (error) {
        console.warn('Keyword search in same category failed:', error.message);
      }
    }

    // จัดเรียงผลลัพธ์ตามความเกี่ยวข้อง (จำนวนการดูและความใหม่)
    const finalRelatedVideos = allRelatedVideos
      .filter((video, index, self) => 
        video && video.id && self.findIndex(v => v.id === video.id) === index
      )
      .sort((a, b) => {
        // เรียงตามจำนวนการดูก่อน
        const viewsA = parseInt(a.views) || 0;
        const viewsB = parseInt(b.views) || 0;
        
        if (viewsB !== viewsA) {
          return viewsB - viewsA;
        }
        
        // หากจำนวนการดูเท่ากัน เรียงตามความใหม่
        const timeA = new Date(a.uploadDate || 0).getTime();
        const timeB = new Date(b.uploadDate || 0).getTime();
        return timeB - timeA;
      })
      .slice(0, limit);

    console.log(`Found ${finalRelatedVideos.length}/${limit} related videos in category: ${currentVideoCategory}`);
    
    // หากไม่พบวิดีโอเลย แสดงว่าหมวดหมู่นี้มีวิดีโอน้อย
    if (finalRelatedVideos.length === 0) {
      console.log(`No related videos found in category: ${currentVideoCategory}`);
    }

    return finalRelatedVideos;

  } catch (error) {
    console.error('Error fetching related videos:', error);
    return [];
  }
};

// ฟังก์ชันใหม่: ดึงวิดีโอเพิ่มเติมในหมวดหมู่เดียวกัน (สำหรับ infinite scroll)
// ฟังก์ชันสำหรับดึงวิดีโอเพิ่มเติมในหมวดหมู่เดียวกัน
export const getMoreVideosInCategory = async (categoryName, excludeIds = [], page = 1, limit = 12) => {
  try {
    if (!categoryName || categoryName.trim() === '') {
      return { videos: [], hasMore: false };
    }

    console.log(`Getting more videos in category: ${categoryName}, page: ${page}`);
    
    // ใช้ categoryName เป็น parameter โดยตรง
    const response = await retryRequest(
      () => axios.get(`/api/provide/vod/?ac=list&t=${encodeURIComponent(categoryName)}&pg=${page}&limit=${limit * 3}`),
      2,
      1000
    );
    
    const videoList = response.data?.list || [];
    console.log(`Category ${categoryName} page ${page} found: ${videoList.length} videos`);
    
    if (videoList.length === 0) {
      return { videos: [], hasMore: false };
    }
    
    // กรองวิดีโอที่ไม่ได้อยู่ในหมวดหมู่เดียวกันและวิดีโอที่ยกเว้น
    const filteredVideos = videoList.filter(item => {
      if (!item.vod_id) return false;
      if (excludeIds.includes(item.vod_id)) return false;
      
      // ตรวจสอบว่าอยู่ในหมวดหมู่เดียวกัน
      const itemCategory = item.type_name || item.vod_class || '';
      return itemCategory === categoryName;
    });
    
    // จำกัดจำนวนตาม limit
    const limitedVideos = filteredVideos.slice(0, limit);
    
    if (limitedVideos.length === 0) {
      return { videos: [], hasMore: videoList.length >= limit * 3 };
    }
    
    // ดึงรายละเอียดวิดีโอ
    const vodIds = limitedVideos.map(item => item.vod_id);
    const detailedVideos = await fetchBatchVideoDetails(vodIds);
    
    // ตรวจสอบว่ามีหน้าถัดไปหรือไม่
    const hasMore = videoList.length >= limit * 3;
    
    return {
      videos: detailedVideos,
      hasMore: hasMore
    };

  } catch (error) {
    console.error('Error getting more videos in category:', error);
    return { videos: [], hasMore: false };
  }
};

// ฟังก์ชันดึงหมวดหมู่ทั้งหมด - ปรับปรุงแล้ว
export const getCategories = async () => {
  try {
    console.log('Fetching categories');
    
    // ลองดึงจากหลายแหล่ง
    const responses = await Promise.allSettled([
      axios.get('/api/provide/vod/?ac=list&limit=100'),
      axios.get('/api/provide/vod/?ac=list&pg=2&limit=50'),
      axios.get('/api/provide/vod/?ac=videolist') // บาง API อาจใช้ path นี้
    ]);
    
    const allVideos = [];
    responses.forEach((response, index) => {
      if (response.status === 'fulfilled') {
        const videoList = response.value.data?.list || [];
        allVideos.push(...videoList);
        console.log(`Source ${index + 1} provided ${videoList.length} videos`);
      }
    });
    
    // สกัดหมวดหมู่จากวิดีโอที่มี
    const categories = [...new Set(
      allVideos
        .map(item => item.type_name || item.vod_class)
        .filter(Boolean)
        .filter(cat => cat.length > 0 && cat !== 'undefined')
    )].sort();
    
    console.log('Categories found:', categories.length, categories);
    return categories;
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return ['ทั่วไป', 'บันเทิง', 'ข่าว', 'กีฬา']; // fallback categories
  }
};

// ฟังก์ชันตรวจสอบสถานะ API
export const checkAPIStatus = async () => {
  try {
    const response = await axios.get('/api/provide/vod/?ac=list&limit=1', { timeout: 5000 });
    return {
      status: 'ok',
      data: response.data
    };
  } catch (error) {
    console.error('API Status check failed:', error);
    return {
      status: 'error',
      error: error.message
    };
  }
};

// ในไฟล์ videoData.js - เพิ่มฟังก์ชันนี้
export const getAllVideosByCategory = async (categoryId, limit = 0) => {
  try {
    console.log('Getting all videos for category:', categoryId);
    
    // ใช้ฟังก์ชันที่มีอยู่แล้ว
    if (limit > 0) {
      // ถ้ามี limit ให้ใช้ฟังก์ชันปกติ
      return await getVideosByCategory(categoryId, limit);
    }
    
    // ถ้า limit เป็น 0 ให้ดึงทั้งหมดโดยการไล่ดูหลายหน้า
    let allVideos = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      try {
        // ใช้ getMoreVideosInCategory เพื่อดึงข้อมูลทีละหน้า
        const result = await getMoreVideosInCategory(
          categoryId, 
          allVideos.map(v => v.id), 
          page, 
          50 // ดึงทีละ 50 วิดีโอ
        );
        
        if (result.videos.length > 0) {
          allVideos = [...allVideos, ...result.videos];
          hasMore = result.hasMore;
          page++;
          
          // หยุดชั่วคราวระหว่างหน้าเพื่อไม่ให้ server ล้น
          await new Promise(resolve => setTimeout(resolve, 300));
        } else {
          hasMore = false;
        }
      } catch (error) {
        console.error(`Error loading page ${page} for category ${categoryId}:`, error);
        hasMore = false;
      }
    }
    
    console.log(`Loaded ${allVideos.length} videos for category ${categoryId}`);
    return allVideos;
    
  } catch (error) {
    console.error('Error getting all videos by category:', error);
    return [];
  }
};


// ใน videoData.js - เพิ่มฟังก์ชันเหล่านี้

// ฟังก์ชันดึงวิดีโอโดยผู้สร้างเฉพาะ
export const getVideosByCreator = async (creatorName, limit = 20) => {
  try {
    console.log('Searching videos by creator:', creatorName);
    
    // ค้นหาจากชื่อผู้สร้างในฟิลด์ vod_director
    const response = await retryRequest(
      () => axios.get(`/api/provide/vod/?ac=list&wd=${encodeURIComponent(creatorName)}&limit=${limit * 2}`),
      2,
      1000
    );
    
    const videoList = response.data?.list || [];
    console.log('Found', videoList.length, 'potential videos by creator');
    
    if (videoList.length === 0) return [];
    
    // กรองเฉพาะวิดีโอที่ผู้สร้างตรงกัน
    const filteredVideos = videoList.filter(item => {
      const director = item.vod_director || '';
      return director.includes(creatorName);
    });
    
    const vodIds = filteredVideos
      .slice(0, limit)
      .map(item => item.vod_id)
      .filter(Boolean);
    
    if (vodIds.length === 0) return [];
    
    return await fetchBatchVideoDetails(vodIds);
  } catch (error) {
    console.error('Error fetching videos by creator:', error);
    return [];
  }
};

// ฟังก์ชันดึงข้อมูลโปรไฟล์จากวิดีโอ
export const getProfilesFromVideos = async (limit = 20) => {
  try {
    // ดึงวิดีโอล่าสุด
    const videos = await getAllVideos(50);
    
    // สกัดชื่อผู้สร้างจากวิดีโอ
    const creators = [...new Set(
      videos
        .map(video => video.channelName)
        .filter(name => name && name !== 'ไม่ระบุ')
    )].slice(0, limit);
    
    // สร้างโปรไฟล์จากผู้สร้าง
    const profiles = creators.map((creator, index) => {
      // สุ่ม rating
      const rating = (4 + Math.random()).toFixed(1);
      
      return {
        id: index + 1,
        name: creator,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(creator)}&background=random`,
        rating: rating,
        description: `ผู้สร้างเนื้อหาในแพลตฟอร์ม`,
        email: `contact${index + 1}@example.com`,
        phone: `08${Math.floor(10000000 + Math.random() * 90000000)}`,
        location: 'ประเทศไทย',
        category: creator
      };
    });
    
    return profiles;
  } catch (error) {
    console.error('Error generating profiles from videos:', error);
    return [];
  }
};

// ใน videoData.js - เพิ่มฟังก์ชันเหล่านี้

// ฟังก์ชันดึงวิดีโอเฉพาะจากหมวดหมู่ 20
export const getVideosByCategory20 = async (limit = 20) => {
  try {
    console.log('Fetching videos from category 20...');
    
    const response = await retryRequest(
      () => axios.get(`/api/provide/vod/?ac=list&t=20&limit=${limit}`),
      2,
      1000
    );
    
    const videoList = response.data?.list || [];
    console.log('Found', videoList.length, 'videos in category 20');
    
    if (videoList.length === 0) return [];
    
    const vodIds = videoList
      .map(item => item.vod_id)
      .filter(Boolean);
    
    if (vodIds.length === 0) return [];
    
    return await fetchBatchVideoDetails(vodIds);
  } catch (error) {
    console.error('Error fetching videos from category 20:', error);
    return [];
  }
};

// ฟังก์ชันดึงวิดีโอทั้งหมดจากหมวดหมู่ 20
export const getAllVideosByCategory20 = async (limit = 0) => {
  try {
    console.log('Getting all videos for category 20...');
    
    let allVideos = [];
    let page = 1;
    let hasMore = true;
    const usedThumbnails = new Set(); // เก็บ thumbnail ที่ใช้แล้ว
    
    while (hasMore && (limit === 0 || allVideos.length < limit)) {
      try {
        const response = await retryRequest(
          () => axios.get(`/api/provide/vod/?ac=list&t=20&pg=${page}&limit=50`),
          2,
          1000
        );
        
        const videoList = response.data?.list || [];
        
        if (videoList.length === 0) {
          hasMore = false;
          break;
        }
        
        // ดึงรายละเอียดวิดีโอ
        const vodIds = videoList.map(item => item.vod_id).filter(Boolean);
        const detailedVideos = await fetchBatchVideoDetails(vodIds);
        
        // กรองวิดีโอที่ thumbnail ไม่ซ้ำ
        const uniqueVideos = detailedVideos.filter(video => {
          if (!video.thumbnail || usedThumbnails.has(video.thumbnail)) {
            return false;
          }
          usedThumbnails.add(video.thumbnail);
          return true;
        });
        
        allVideos = [...allVideos, ...uniqueVideos];
        
        if (videoList.length < 50) {
          hasMore = false;
        }
        
        page++;
        
        // หยุดชั่วคราวระหว่างหน้าเพื่อไม่ให้ server ล้น
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (error) {
        console.error(`Error loading page ${page} for category 20:`, error);
        hasMore = false;
      }
    }
    
    // จำกัดจำนวนตาม limit
    if (limit > 0) {
      allVideos = allVideos.slice(0, limit);
    }
    
    console.log(`Loaded ${allVideos.length} unique videos for category 20`);
    return allVideos;
    
  } catch (error) {
    console.error('Error getting all videos by category 20:', error);
    return [];
  }
};

// ฟังก์ชันค้นหาวิดีโอโดยนักแสดงในหมวดหมู่ 20
export const searchVideosByActorInCategory20 = async (actorName, limit = 20) => {
  try {
    console.log('Searching videos by actor in category 20:', actorName);
    
    // ค้นหาจากชื่อนักแสดงในหมวดหมู่ 20
    const response = await retryRequest(
      () => axios.get(`/api/provide/vod/?ac=list&t=20&wd=${encodeURIComponent(actorName)}`),
      2,
      1000
    );
    
    const videoList = response.data?.list || [];
    console.log('Found', videoList.length, 'videos for actor in category 20:', actorName);
    
    if (videoList.length === 0) return [];
    
    // กรองเฉพาะวิดีโอที่มีนักแสดงตรงกัน
    const filteredVideos = videoList.filter(item => {
      const actorFields = [
        item.vod_actor,
        item.vod_director,
        item.vod_douban_actor,
        item.vod_douban_director
      ];
      
      return actorFields.some(field => 
        field && field.includes(actorName)
      );
    });
    
    const vodIds = filteredVideos
      .slice(0, limit)
      .map(item => item.vod_id)
      .filter(Boolean);
    
    if (vodIds.length === 0) return [];
    
    const detailedVideos = await fetchBatchVideoDetails(vodIds);
    
    // กรองวิดีโอที่ thumbnail ไม่ซ้ำ
    const usedThumbnails = new Set();
    const uniqueVideos = detailedVideos.filter(video => {
      if (!video.thumbnail || usedThumbnails.has(video.thumbnail)) {
        return false;
      }
      usedThumbnails.add(video.thumbnail);
      return true;
    });
    
    return uniqueVideos;
  } catch (error) {
    console.error('Error searching videos by actor in category 20:', error);
    return [];
  }
};

