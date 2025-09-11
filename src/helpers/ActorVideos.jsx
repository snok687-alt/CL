import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import { getVideosByActor } from '../data/videoData';

const ActorVideos = () => {
  const { actorName } = useParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(50); // แสดง 50 วิดีโอแรก

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const videoData = await getVideosByActor(decodeURIComponent(actorName), 200); // ดึงมากสุด 200 วิดีโอ
        setVideos(videoData);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [actorName]);

  const loadMoreVideos = () => {
    // โหลดวิดีโอเพิ่มทั้งหมด
    setDisplayCount(videos.length);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden shadow-md">
                <div className="aspect-[16/9] bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 pl-2 text-base text-gray-500 hover:text-gray-700 flex items-center transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        กลับ
      </button>

      <h1 className="text-2xl font-bold mb-6">วิดีโอของ {decodeURIComponent(actorName)}</h1>

      {videos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">ไม่พบวิดีโอสำหรับนักแสดงนี้</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {videos.slice(0, displayCount).map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

          {displayCount < videos.length && (
            <div className="text-center mt-8">
              <button
                onClick={loadMoreVideos}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-colors"
              >
                โหลดเพิ่มทั้งหมด ({videos.length - displayCount} วิดีโอ)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ActorVideos;