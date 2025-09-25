import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getActorProfile,
  getActorGalleryImages,
} from '../data/actorData';
import { getVideosByActor } from '../data/videoData';

const ProfilePage = ({ isDarkMode = false }) => {
  const { profileName } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);

  // Theme styles
  const bg = 'bg-gray-100';
  const text = 'text-white';
  const textSec =  'text-white';
  const skeleton = 'bg-gray-300';
  const btn = 'bg-blue-500 hover:bg-blue-600';

  // Event handlers
  const goToVideo = (id) => navigate(`/watch/${id}`);
  const openImage = (i) => { setSelectedImageIndex(i); setShowImageModal(true); };
  const closeModal = () => setShowImageModal(false);
  const prevImage = () => setSelectedImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  const nextImage = () => setSelectedImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const name = decodeURIComponent(profileName);
        const profileData = getActorProfile(name);
        const imageData = getActorGalleryImages(name).filter(img => img?.trim());
        const videoData = await getVideosByActor(name);

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

  if (loading) {
    return (
      <div className={`max-w-screen-2xl mx-auto animate-pulse space-y-2 min-h-screen ${bg}`}>
        <div className={`h-72 w-full ${skeleton}`} />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 px-2">
          {Array(8).fill().map((_, i) => <div key={i} className={`h-48 rounded-lg ${skeleton}`} />)}
        </div>
      </div>
    );
  }
  if (!profile) {
    return (
      <div className={`p-8 max-w-screen-2xl mx-auto text-center min-h-screen ${bg}`}>
        <h1 className={`text-2xl font-bold ${text}`}>ไม่พบข้อมูลโปรไฟล์</h1>
        <p className={textSec}>ไม่สามารถโหลดข้อมูลสำหรับ {profileName} ได้</p>
      </div>
    );
  }
  const displayedImages = showAllImages ? images : images.slice(0, 4);
  return (
    <div className="relative max-w-screen-2xl mx-auto xl:px-2 min-h-screen">
      {/* Background with dark overlay for better text visibility */}
      <div className="fixed inset-0 w-full h-full overflow-hidden">
        {/* รูปพื้นหลังหลัก */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${profile.backgroundImage || profile.profileImage})`,
            filter: 'blur(0px)',
            transform: 'scale(1.05)'
          }}
        />
        {/* Dark Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/70" />
        {/* Additional gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>
      {/* Content Container */}
      <div className="relative z-10">
        <div className="flex flex-col xl:flex-row gap-4">
          {/* Profile Info */}
          <div className="md:flex flex-col md:justify-center items-center md:min-h-screen w-full xl:w-1/3 space-y-4 md:mt-0 space-x-0">
            <div className={`flex md:flex-row gap-x-2 p-4 items-center justify-between md:items-start space-x-3.5`}>
              <div className="relative flex-shrink-0">
                <img src={profile.profileImage} alt={profile.name}
                  className="w-52 h-auto md:w-64 md:h-auto object-cover rounded-lg shadow-xl ring-1 ring-white/10"
                  onError={(e) => e.target.src = `https://picsum.photos/400/400?random=${profile.name.charCodeAt(0)}`} />
                {profile.hasProfile && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg">✓</div>
                )}
              </div>
              <div className="space-y-4 text-left md:text-left">
                <h1 className={`text-xl font-bold ${text} drop-shadow-lg text-shadow-lg`}>{profile.name}</h1>
                {profile.alternativeName && <p className={`text-base ${textSec} italic drop-shadow-md`}>{profile.alternativeName}</p>}
                {['age', 'height', 'weight', 'nationality', 'other'].map(key =>
                  profile[key] && profile[key] !== 'ไม่ระบุ' && (
                    <p key={key} className={`text-base ${textSec} drop-shadow-md font-medium`}>
                      {key === 'age'
                        ? '年龄'
                        : key === 'height'
                          ? '身高'
                          : key === 'weight'
                            ? '体重'
                            : key === 'nationality'
                              ? '国籍'
                              : '其他'}: {profile[key]}
                    </p>
                  )
                )}
                <p className={`text-base ${textSec} font-semibold drop-shadow-md`}>จำนวนวิดีโอ: {profile.videoCount} เรื่อง</p>
              </div>
            </div>
            <div className={`p-4 rounded-lg`}>
              <h2 className={`text-xl font-semibold mb-2 ${text} drop-shadow-lg`}>ข้อมูลเพิ่มเติม</h2>
              <p className={`leading-relaxed text-base ${textSec} drop-shadow-md`}>{profile.bio}</p>
            </div>
          </div>
          {/* Images & Videos */}
          <div className="w-full xl:w-2/3 xl:max-h-screen xl:overflow-y-auto no-scrollbar">
            {images.length > 0 && (
              <div className={`p-2 pt-6 rounded-lg`}>
                <h2 className={`text-xl font-semibold mb-4 text-left ${text} drop-shadow-lg`}>图片</h2>
                <div className="columns-2 md:columns-4 gap-2 space-y-2">
                  {displayedImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`profile-img-${index}`}
                      loading="lazy"
                      className="w-full mb-2 rounded-lg object-cover break-inside-avoid"
                      onClick={() => openImage(index)}
                    />
                  ))}
                </div>
                {images.length > 4 && (
                  <div className="mt-4 text-center">
                    <button className={`px-4 py-2 rounded-md text-white transition-colors shadow-lg  ${btn}`}
                      onClick={() => setShowAllImages(!showAllImages)}>
                      {showAllImages ? 'ย่อกลับ' : `รูปเพิ่มเติม (${images.length - 4} รูป)`}
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className={`px-2 rounded-lg `}>
              <h2 className={`text-2xl font-bold mb-4 text-left ${text} drop-shadow-lg`}>视频</h2>
              {videos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {videos.map((video) => (
                    <div key={video.id} onClick={() => goToVideo(video.id)}
                      className={`rounded-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group bg-black/30 hover:bg-black/40`}>
                      <div className="relative overflow-hidden">
                        {video.thumbnail?.trim() ? (
                          <img src={video.thumbnail} alt={video.title}
                            className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => e.target.src = `https://picsum.photos/400/300?random=${video.id}`} />
                        ) : (
                          <div className="w-full h-48 bg-gray-300/20 backdrop-blur flex items-center justify-center">
                            <span className={`${textSec} drop-shadow`}>ไม่มีภาพตัวอย่าง</span>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className={`font-semibold text-sm line-clamp-2 mb-1 ${text} transition-colors drop-shadow-md`}>
                          {video.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className={`text-xs ${textSec} drop-shadow`}>{video.views.toLocaleString()} ครั้ง</p>
                          {video.uploadDate && <p className={`text-xs ${textSec} drop-shadow`}>{video.uploadDate}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 ${textSec}`}>
                  <p className="drop-shadow-md">ไม่มีวิดีโอที่สามารถแสดงได้</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && images.length > 0 && (
        <ImageModal
          images={images}
          selectedImageIndex={selectedImageIndex}
          onClose={closeModal}
          onPrev={prevImage}
          onNext={nextImage}
          isDarkMode={isDarkMode}
          actorName={profile.name}
        />
      )}
    </div>
  );
};

// Image Modal Component
// Updated Image Modal Component with larger image display
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
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95`}
      onClick={onClose}>
      <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
        {/* Close button */}
        <button className="absolute top-4 right-4 text-white text-4xl z-30 p-3 rounded-full bg-black/80 hover:bg-black/90 transition-colors backdrop-blur-sm"
          onClick={onClose}>&times;</button>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/80 hover:bg-black/90 text-white p-4 rounded-full text-2xl transition-colors backdrop-blur-sm z-20"
              onClick={onPrev}>&#10094;</button>
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/80 hover:bg-black/90 text-white p-4 rounded-full text-2xl transition-colors backdrop-blur-sm z-20"
              onClick={onNext}>&#10095;</button>
          </>
        )}
        {/* Image container with improved sizing */}
        <div className="relative flex items-center justify-center w-full h-full p-16">
          <img
            src={images[selectedImageIndex]}
            alt={`${actorName} - รูปที่ ${selectedImageIndex + 1}`}
            className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
            style={{
              minWidth: '50vw',
              minHeight: '50vh'
            }}
            onError={(e) => e.target.src = `https://picsum.photos/800/1200?random=${actorName.charCodeAt(0) + selectedImageIndex}`}
          />
        </div>

        {/* Image counter and instructions */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center z-20">
          <div className="text-white text-xl font-medium">
            {selectedImageIndex + 1} / {images.length}
          </div>
          <div className="text-white/80 text-sm drop-shadow bg-black/50 px-4 rounded backdrop-blur-sm">
            กด ESC เพื่อปิด
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;