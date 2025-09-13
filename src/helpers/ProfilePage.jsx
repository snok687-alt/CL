import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfileDetails, getProfileImages, getProfileVideos } from '../data/videoData';

const ProfilePage = ({ isDarkMode = false }) => {
  const { profileName } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const decodedName = decodeURIComponent(profileName);
        const profileData = await getProfileDetails(decodedName);
        const imageData = await getProfileImages(decodedName);
        const videoData = await getProfileVideos(decodedName);

        setProfile(profileData);
        setImages(imageData);
        setVideos(videoData);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profileName]);

  const handleVideoClick = (videoId) => {
    navigate(`/watch/${videoId}`);
  };

  // คลาสพื้นฐานสำหรับพื้นหลังและข้อความ (ใช้ตัวแปรเดิม)
  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-100';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const secondaryTextClass = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const cardBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const skeletonClass = isDarkMode ? 'bg-gray-700' : 'bg-gray-300';

  if (loading) {
    return (
      <div className={`p-8 max-w-screen-2xl mx-auto animate-pulse space-y-10 min-h-screen ${bgClass}`}>
        {/* โครงสร้างโหลด */}
        <div className={`h-72 w-full rounded-lg ${skeletonClass}`} />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className={`w-full h-48 rounded-full ${skeletonClass}`}></div>
          <div className="xl:col-span-2 space-y-4">
            <div className={`w-1/2 h-6 rounded ${skeletonClass}`} />
            <div className={`w-1/3 h-6 rounded ${skeletonClass}`} />
            <div className={`w-full h-4 rounded ${skeletonClass}`} />
            <div className={`w-3/4 h-4 rounded ${skeletonClass}`} />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`h-48 rounded-lg ${skeletonClass}`}></div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-40 rounded-lg ${skeletonClass}`}></div>
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={`p-8 max-w-screen-2xl mx-auto text-center min-h-screen ${bgClass}`}>
        <h1 className={`text-2xl font-bold ${textClass}`}>ไม่พบข้อมูลโปรไฟล์</h1>
        <p className={secondaryTextClass}>ไม่สามารถโหลดข้อมูลสำหรับ {profileName} ได้</p>
      </div>
    );
  }

  return (
    <div className={`relative max-w-screen-2xl mx-auto px-4 xl:px-8 py-6 min-h-screen ${bgClass}`}>
      {/* Background เบลอ */}
      <div
        className={`absolute inset-0 -z-10 ${isDarkMode ? 'opacity-10' : 'opacity-20'} blur-sm`}
        style={{
          backgroundImage: `url(${profile.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Layout หลัก */}
      <div className="flex flex-col xl:flex-row gap-5">
        {/* ซ้าย: รูป + ข้อมูล */}
        <div className="w-full xl:w-1/3 space-y-6">
          {/* รูปโปรไฟล์ + ข้อมูลส่วนตัว */}
          <div className={`flex flex-row md:flex-col md:justify-around gap-2 items-center md:items-center p-4 rounded-lg ${cardBgClass} shadow-md`}>
            <img
              src={profile.image}
              alt={profile.name}
              className="w-50 h-65 md:w-75 md:h-100 xl:max-w-sm object-cover rounded-md shadow-lg"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop';
              }}
            />
            <div className="space-y-1 text-center md:text-left">
              <h1 className={`text-xl font-bold ${textClass}`}>{profile.name}</h1>
              <p className={`text-sx ${secondaryTextClass}`}>อายุ: {profile.age}</p>
              <p className={`text-sx ${secondaryTextClass}`}>ส่วนสูง: {profile.height}</p>
              <p className={`text-sx ${secondaryTextClass}`}>น้ำหนัก: {profile.weight}</p>
              <p className={`text-sx ${secondaryTextClass}`}>สัญชาติ: {profile.nationality}</p>
              <p className={`text-sx ${secondaryTextClass}`}>อื่นๆ: {profile.other}</p>
              <p className={`text-sx ${secondaryTextClass}`}>จำนวนวิดีโอ: {profile.videoCount} เรื่อง</p>
            </div>
          </div>

          {/* ข้อมูลเพิ่มเติม */}
          <div className={`p-4 rounded-lg ${cardBgClass} shadow-md`}>
            <h2 className={`text-xl font-semibold mb-2 ${textClass}`}>ข้อมูลเพิ่มเติม</h2>
            <p className={`leading-relaxed text-base ${secondaryTextClass}`}>{profile.bio}</p>
          </div>
        </div>

        {/* ขวา: รูปภาพ + วิดีโอ */}
        <div className="w-full xl:w-2/3 space-y-6">
          {/* Section รูปภาพ */}
          <div className={`flex flex-col items-center p-4 rounded-lg ${cardBgClass} shadow-md`}>
            <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>รูปภาพ</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-2">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`profile-img-${index}`}
                  className={`rounded-md w-50 h-65 object-cover ${borderClass} border`}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop';
                  }}
                />
              ))}
            </div>
          </div>

          {/* Section วิดีโอ */}
          <div className={`flex flex-col items-center p-4 rounded-lg ${cardBgClass} shadow-md`}>
            <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>วิดีโอ</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl mx-auto">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className={`rounded-md hover:shadow-lg transition overflow-hidden cursor-pointer ${cardBgClass} ${isDarkMode ? 'shadow-gray-800' : 'shadow'}`}
                  onClick={() => handleVideoClick(video.id)}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop';
                    }}
                  />
                  <div className="p-3">
                    <h3 className={`font-semibold text-sm truncate ${textClass}`}>
                      {video.title}
                    </h3>
                    <p className={`text-xs ${secondaryTextClass}`}>{video.views} views • {video.duration} min</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;