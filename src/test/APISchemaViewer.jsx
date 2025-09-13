import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Helper function to determine the data type of a value
const getType = (value) => {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  return typeof value;
};

// --- Main Component ---
const APISchemaDetailViewer = () => {
  const [videoList, setVideoList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define the new API base URL
  const API_BASE_URL = 'https://cors-anywhere.herokuapp.com/https://api.bwzyz.com/api.php/provide/vod/at/json/';

  // Function to fetch details for given video IDs
  const fetchDetails = async (ids) => {
    if (ids.length === 0) return [];
    try {
      // Use the new API endpoint for details
      const res = await axios.get(`${API_BASE_URL}?ac=detail&ids=${ids.join(',')}`);
      return res.data?.list || [];
    } catch (err) {
      console.error('Error fetching details:', err);
      // Return empty array on error to prevent crashes
      return [];
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Fetch the initial list of videos
        const listRes = await axios.get(`${API_BASE_URL}?ac=list&pg=1`);
        const list = listRes.data?.list || [];

        if (list.length === 0) {
          setError('ไม่พบข้อมูลวิดีโอจาก API');
          setLoading(false);
          return;
        }

        // 2. Get IDs from the list (limit to 10 for performance)
        const ids = list.map(item => item.vod_id).filter(Boolean).slice(0, 10);

        // 3. Fetch detailed data for those IDs
        const detailData = await fetchDetails(ids);
        setVideoList(detailData);

      } catch (err) {
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับ API: ' + err.message);
        console.error('API connection error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []); // Empty dependency array means this runs once on mount

  // Function to handle exporting data to a JSON file
  const handleExportJSON = () => {
    const jsonString = JSON.stringify(videoList, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'video_details.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --- Render Logic ---
  return (
    <div className="p-6 max-w-7xl mx-auto text-sm bg-white text-gray-900">
      <h1 className="text-2xl font-bold mb-4">🧾 รายละเอียดวิดีโอจาก API (bwzyz.com)</h1>

      {loading && <p>⏳ กำลังโหลดข้อมูล...</p>}
      {error && <p className="text-red-600 mb-4 font-semibold">{error}</p>}

      {!loading && !error && videoList.length > 0 && (
        <>
          <button
            className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleExportJSON}
          >
            ⬇️ ดาวน์โหลดข้อมูล (JSON)
          </button>

          {videoList.map((item, index) => (
            <div key={item.vod_id || index} className="mb-10 border border-gray-300 rounded p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">🎞️ {item.vod_name || `วิดีโอที่ ${index + 1}`} (ID: {item.vod_id})</h2>
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
                    // Highlight important fields
                    const isImportant = key === 'vod_actor' || key === 'vod_director';
                    return (
                      <tr key={key} className={isImportant ? 'bg-yellow-100' : ''}>
                        <td className={`p-2 border font-mono ${isImportant ? 'font-bold text-blue-800' : 'text-blue-700'}`}>
                          {key === 'vod_actor' && '🎭 '}
                          {key === 'vod_director' && '🎬 '}
                          {key}
                        </td>
                        <td className="p-2 border text-green-700">{getType(value)}</td>
                        <td className="p-2 border font-mono whitespace-pre-wrap break-all bg-gray-50 max-w-[600px]">
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
          ))}
        </>
      )}
    </div>
  );
};

export default APISchemaDetailViewer;