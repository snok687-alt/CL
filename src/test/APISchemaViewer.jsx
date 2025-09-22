import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

// Helper function to determine the data type of a value
const getType = (value) => {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  return typeof value;
};

// Function to calculate image similarity (simple hash comparison)
const calculateImageSimilarity = (img1, img2) => {
  // Simple implementation - in real app you'd use proper image comparison
  if (img1 === img2) return 100;
  
  // Extract filename for comparison
  const filename1 = img1.split('/').pop();
  const filename2 = img2.split('/').pop();
  
  if (filename1 === filename2) return 100;
  
  // Simple string similarity (for demonstration)
  const longer = Math.max(filename1.length, filename2.length);
  let matches = 0;
  
  for (let i = 0; i < longer; i++) {
    if (filename1[i] === filename2[i]) matches++;
  }
  
  return Math.round((matches / longer) * 100);
};

// --- Main Component ---
const APISchemaDetailViewer = () => {
  const [videoList, setVideoList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVideos, setTotalVideos] = useState(0);
  const [showAllData, setShowAllData] = useState(false);
  const [groupedVideos, setGroupedVideos] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [similarityThreshold, setSimilarityThreshold] = useState(85);
  const [uploadedImages, setUploadedImages] = useState([]);
  const fileInputRef = useRef(null);

  const API_BASE_URL = '/api';

  const fetchVideoList = async (page = 1) => {
    try {
      const res = await axios.get(`${API_BASE_URL}?ac=list&pg=${page}`, {
        timeout: 20000
      });
      
      const data = res.data;
      console.log('API Response:', data);
      
      if (data && data.list) {
        return {
          list: data.list,
          total: data.total || data.list.length,
          page: data.page || page,
          pagecount: data.pagecount || Math.ceil((data.total || data.list.length) / 10)
        };
      } else if (data && data.data) {
        return {
          list: data.data,
          total: data.total || data.data.length,
          page: data.page || page,
          pagecount: data.pagecount || Math.ceil((data.total || data.data.length) / 10)
        };
      } else {
        throw new Error('โครงสร้างข้อมูลไม่ถูกต้อง');
      }
    } catch (err) {
      console.error('Error fetching video list:', err);
      throw err;
    }
  };

  const fetchDetails = async (ids) => {
    if (ids.length === 0) return [];
    try {
      const res = await axios.get(`${API_BASE_URL}?ac=detail&ids=${ids.join(',')}`, {
        timeout: 30000
      });
      return res.data?.list || res.data?.data || [];
    } catch (err) {
      console.error('Error fetching details:', err);
      return [];
    }
  };

  const fetchAllVideos = async (page = 1, accumulatedVideos = []) => {
    try {
      const result = await fetchVideoList(page);
      const currentList = result.list;
      
      if (currentList.length === 0) {
        return accumulatedVideos;
      }

      const ids = currentList.map(item => item.vod_id || item.id).filter(Boolean);
      const detailedVideos = await fetchDetails(ids);
      const newVideos = [...accumulatedVideos, ...detailedVideos];
      
      if (page < result.pagecount && newVideos.length < 500) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return fetchAllVideos(page + 1, newVideos);
      } else {
        return newVideos;
      }
    } catch (err) {
      console.error(`Error fetching page ${page}:`, err);
      return accumulatedVideos;
    }
  };

  // Group videos by image similarity
  const groupVideosByImageSimilarity = (videos, threshold = 85) => {
    const groups = {};
    const processed = new Set();
    
    videos.forEach((video, index) => {
      if (processed.has(video.vod_id) || !video.vod_pic) return;
      
      const groupKey = `group_${index}`;
      groups[groupKey] = [video];
      processed.add(video.vod_id);
      
      // Find similar images
      videos.forEach(otherVideo => {
        if (!processed.has(otherVideo.vod_id) && otherVideo.vod_pic) {
          const similarity = calculateImageSimilarity(video.vod_pic, otherVideo.vod_pic);
          if (similarity >= threshold) {
            groups[groupKey].push(otherVideo);
            processed.add(otherVideo.vod_id);
          }
        }
      });
    });
    
    return groups;
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  // Find videos matching uploaded images
  const findMatchingVideos = () => {
    if (uploadedImages.length === 0 || videoList.length === 0) return {};
    
    const matches = {};
    
    uploadedImages.forEach((uploadedImage, index) => {
      matches[`upload_${index}`] = {
        image: uploadedImage,
        videos: videoList.filter(video => {
          if (!video.vod_pic) return false;
          const similarity = calculateImageSimilarity(uploadedImage.preview, video.vod_pic);
          return similarity >= similarityThreshold;
        })
      };
    });
    
    return matches;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (showAllData) {
          const allVideos = await fetchAllVideos();
          setVideoList(allVideos);
          setTotalVideos(allVideos.length);
          
          // Group videos by image similarity
          const grouped = groupVideosByImageSimilarity(allVideos, similarityThreshold);
          setGroupedVideos(grouped);
        } else {
          const result = await fetchVideoList(currentPage);
          const ids = result.list.map(item => item.vod_id || item.id).filter(Boolean).slice(0, 20);
          
          const detailedVideos = await fetchDetails(ids);
          setVideoList(detailedVideos);
          setTotalPages(result.pagecount);
          setTotalVideos(result.total);
          
          const grouped = groupVideosByImageSimilarity(detailedVideos, similarityThreshold);
          setGroupedVideos(grouped);
        }

      } catch (err) {
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับ API: ' + err.message);
        console.error('API connection error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, showAllData, similarityThreshold]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(videoList, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `video_details_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleViewMode = () => {
    setShowAllData(!showAllData);
    setCurrentPage(1);
  };

  const renderPagination = () => {
    if (showAllData || totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 my-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          ← ก่อนหน้า
        </button>
        
        <span className="px-3 py-2 bg-blue-100 rounded">
          หน้า {currentPage} จาก {totalPages}
        </span>
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          ถัดไป →
        </button>
      </div>
    );
  };

  // Filter videos based on selected category
  const filteredVideos = selectedCategory === 'all' 
    ? videoList 
    : groupedVideos[selectedCategory] || [];

  const uploadedMatches = findMatchingVideos();

  return (
    <div className="p-6 max-w-7xl mx-auto text-sm bg-white text-gray-900">
      <h1 className="text-2xl font-bold mb-4">🧾 รายละเอียดวิดีโอจาก API (bwzyz.com)</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={toggleViewMode}
          className={`px-4 py-2 rounded ${
            showAllData 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {showAllData ? '📋 แสดงแบบแบ่งหน้า' : '📊 แสดงทั้งหมด'}
        </button>

        <button
          onClick={handleExportJSON}
          disabled={videoList.length === 0}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          ⬇️ ดาวน์โหลด JSON
        </button>

        <div className="flex items-center space-x-2">
          <label className="text-sm">เกณฑ์ความคล้ายภาพ:</label>
          <input
            type="range"
            min="50"
            max="100"
            value={similarityThreshold}
            onChange={(e) => setSimilarityThreshold(parseInt(e.target.value))}
            className="w-20"
          />
          <span className="text-sm">{similarityThreshold}%</span>
        </div>

        <div className="px-4 py-2 bg-gray-100 rounded">
          📊 รวม: {totalVideos} วิดีโอ
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="mb-6 p-4 bg-yellow-50 rounded border border-yellow-200">
        <h3 className="font-semibold mb-3">🖼️ อัปโหลดรูปภาพเพื่อค้นหาวิดีโอที่คล้ายกัน</h3>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          multiple
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 mb-3"
        >
          📁 เลือกรูปภาพ
        </button>

        {uploadedImages.length > 0 && (
          <div className="mt-3">
            <h4 className="font-medium mb-2">รูปภาพที่อัปโหลด:</h4>
            <div className="flex flex-wrap gap-2">
              {uploadedImages.map((img, index) => (
                <img
                  key={index}
                  src={img.preview}
                  alt={img.name}
                  className="w-16 h-16 object-cover rounded border"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Selection */}
      {Object.keys(groupedVideos).length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold mb-3">📁 หมวดหมู่ตามความคล้ายภาพ</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded ${
                selectedCategory === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-blue-300'
              }`}
            >
              ทั้งหมด ({videoList.length})
            </button>
            
            {Object.entries(groupedVideos).map(([key, videos]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1 rounded ${
                  selectedCategory === key 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-blue-300'
                }`}
              >
                กลุ่ม {key.replace('group_', '')} ({videos.length})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Image Matches */}
      {Object.keys(uploadedMatches).length > 0 && (
        <div className="mb-6 p-4 bg-green-50 rounded">
          <h3 className="font-semibold mb-3">✅ วิดีโอที่ตรงกับรูปภาพที่อัปโหลด</h3>
          {Object.entries(uploadedMatches).map(([key, match]) => (
            <div key={key} className="mb-4">
              <div className="flex items-center mb-2">
                <img src={match.image.preview} alt="Uploaded" className="w-12 h-12 object-cover rounded mr-3" />
                <span>พบ {match.videos.length} วิดีโอที่คล้ายกัน</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg">⏳ กำลังโหลดข้อมูล...</p>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-100 border border-red-300 rounded mb-6">
          <p className="text-red-600 font-semibold mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            🔄 ลองใหม่
          </button>
        </div>
      )}

      {renderPagination()}

      {!loading && !error && filteredVideos.length > 0 && (
        <div className="space-y-6">
          {filteredVideos.map((item, index) => (
            <div key={item.vod_id || index} className="border border-gray-300 rounded p-4 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    🎞️ {item.vod_name || `วิดีโอที่ ${index + 1}`} 
                  </h2>
                  <p className="text-sm text-gray-600">ID: {item.vod_id}</p>
                </div>
                {item.vod_pic && (
                  <img
                    src={item.vod_pic}
                    alt="Thumbnail"
                    className="w-16 h-16 object-cover rounded ml-4"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border w-1/4">ฟิลด์ (Field)</th>
                      <th className="p-2 border w-1/6">ประเภท (Type)</th>
                      <th className="p-2 border w-auto">ค่า (Value)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(item).map(([key, value]) => {
                      const isImportant = [
                        'vod_actor', 'vod_director', 'vod_name', 
                        'vod_id', 'vod_pic', 'vod_play_url'
                      ].includes(key);
                      
                      return (
                        <tr key={key} className={isImportant ? 'bg-yellow-50' : ''}>
                          <td className={`p-2 border font-mono ${
                            isImportant ? 'font-bold text-blue-800' : 'text-blue-700'
                          }`}>
                            {key === 'vod_actor' && '🎭 '}
                            {key === 'vod_director' && '🎬 '}
                            {key === 'vod_name' && '📺 '}
                            {key === 'vod_pic' && '🖼️ '}
                            {key === 'vod_play_url' && '🔗 '}
                            {key}
                          </td>
                          <td className="p-2 border text-green-700 font-mono text-xs">
                            {getType(value)}
                          </td>
                          <td className="p-2 border font-mono whitespace-pre-wrap break-words bg-gray-50 max-w-[600px] text-xs">
                            {typeof value === 'object' && value !== null
                              ? JSON.stringify(value, null, 2)
                              : String(value)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {renderPagination()}
    </div>
  );
};

export default APISchemaDetailViewer;