import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfileDetails, getProfileImages, getProfileVideos } from '../data/videoData';

// ໜ້າສະແດງລາຍລະອຽດຂອງນັກສະແດງແຕ່ລະຄົນ
const ProfilePage = ({ isDarkMode = false }) => {
  const { profileName } = useParams();
  const navigate = useNavigate();
  
  // State ສຳລັບເກັບຂໍ້ມູນຕ່າງໆ
  const [profile, setProfile] = useState(null);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);

  // ດຶງຂໍ້ມູນທັງໝົດເມື່ອ component ໂຫຼດຄັ້ງແຮກ
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const decodedName = decodeURIComponent(profileName);
        // ດຶງຂໍ້ມູນພ້ອມກັນທັງສາມປະເພດ
        const [profileData, imageData, videoData] = await Promise.all([
          getProfileDetails(decodedName),
          getProfileImages(decodedName),
          getProfileVideos(decodedName)
        ]);
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

  // ຟັງຊັນສຳລັບການກົດເບິ່ງວິດີໂອ
  const handleVideoClick = (videoId) => navigate(`/watch/${videoId}`);
  
  // ຟັງຊັນສຳລັບການກົດເບິ່ງຮູບໃຫຍ່
  const handleImageClick = (index) => { 
    setSelectedImageIndex(index); 
    setShowImageModal(true); 
  };
  
  // ຟັງຊັນສຳລັບປິດ Modal
  const handleCloseModal = () => setShowImageModal(false);
  
  // ຟັງຊັນສຳລັບເບິ່ງຮູບກ່ອນໜ້າ
  const handlePrevImage = () => setSelectedImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  
  // ຟັງຊັນສຳລັບເບິ່ງຮູບຕໍ່ໄປ
  const handleNextImage = () => setSelectedImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);

  // ກຳນົດ CSS class ສຳລັບໂໝດສີແຕ່ງ
  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-100';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const secondaryTextClass = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const cardBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const skeletonClass = isDarkMode ? 'bg-gray-700' : 'bg-gray-300';
  const buttonClass = isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600';

  // ສະແດງ skeleton loading ຂະນະຂໍ້ມູນຍັງບໍ່ໂຫຼດ
  if (loading) {
    return (
      <div className={`max-w-screen-2xl mx-auto animate-pulse space-y-2 min-h-screen ${bgClass}`}>
        {/* Skeleton ສຳລັບພື້ນຫຼັງ */}
        <div className={`h-72 w-full ${skeletonClass}`} />
        
        {/* Skeleton ສຳລັບຂໍ້ມູນໂປຣໄຟລ໌ */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
          <div className="xl:col-span-2 space-y-2 px-4">
            {[...Array(4)].map((_, i) => 
              <div key={i} className={`${i === 0 ? 'w-1/2' : i === 1 ? 'w-1/3' : i === 2 ? 'w-full' : 'w-3/4'} h-6 rounded ${skeletonClass}`} />
            )}
          </div>
        </div>
        
        {/* Skeleton ສຳລັບຮູບພາບ */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 px-2">
          {[...Array(8)].map((_, i) => 
            <div key={i} className={`h-48 rounded-lg ${skeletonClass}`} />
          )}
        </div>
        
        {/* Skeleton ສຳລັບວິດີໂອ */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
          {[...Array(6)].map((_, i) => 
            <div key={i} className={`h-40 rounded-lg ${skeletonClass}`} />
          )}
        </div>
      </div>
    );
  }

  // ສະແດງຂໍ້ຄວາມເມື່ອບໍ່ພົບໂປຣໄຟລ໌
  if (!profile) {
    return (
      <div className={`p-8 max-w-screen-2xl mx-auto text-center min-h-screen ${bgClass}`}>
        <h1 className={`text-2xl font-bold ${textClass}`}>ບໍ່ພົບຂໍ້ມູນໂປຣໄຟລ໌</h1>
        <p className={secondaryTextClass}>ບໍ່ສາມາດໂຫຼດຂໍ້ມູນສຳລັບ {profileName} ໄດ້</p>
      </div>
    );
  }

  // ກຳນົດຮູບພາບທີ່ຈະສະແດງ (4 ຮູບແຮກ ຫຼື ທັງໝົດ)
  const displayedImages = showAllImages ? images : images.slice(0, 4);

  return (
    <div className={`relative max-w-screen-2xl mx-auto xl:px-2 min-h-screen ${bgClass}`}>
      {/* ພື້ນຫຼັງທີ່ມີຮູບໂປຣໄຟລ໌ແບບເບິ່ງ */}
      <div className={`absolute inset-0 -z-10 ${isDarkMode ? 'opacity-10' : 'opacity-20'} blur-sm`} 
        style={{
          backgroundImage: `url(${profile.image})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center'
        }} />

      <div className="flex flex-col xl:flex-row gap-1">
        {/* ຂໍ້ມູນໂປຣໄຟລ໌ (ຝັ່ງຊ້າຍ) */}
        <div className="w-full xl:w-1/3 space-y-2">
          {/* ການ໌ດຂໍ້ມູນຫຼັກ */}
          <div className={`flex flex-col md:flex-row xl:flex-col gap-2 items-center p-4 rounded-lg ${cardBgClass} shadow-md`}>
            {/* ຮູບໂປຣໄຟລ໌ */}
            <img 
              src={profile.image} 
              alt={profile.name} 
              className="w-32 h-32 md:w-40 md:h-40 xl:w-48 xl:h-48 object-cover rounded-full md:rounded-md shadow-lg"
              onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop'} 
            />
            
            {/* ຂໍ້ມູນພື້ນຖານ */}
            <div className="space-y-1 text-center md:text-left xl:text-center">
              <h1 className={`text-xl font-bold ${textClass}`}>{profile.name}</h1>
              
              {/* ສະແດງຂໍ້ມູນເພີ່ມເຕີມຕ່າງໆ */}
              {['age', 'height', 'weight', 'nationality', 'other', 'videoCount'].map((key) => 
                profile[key] && (
                  <p key={key} className={`text-xs ${secondaryTextClass}`}>
                    {key === 'videoCount' 
                      ? `ຈຳນວນວິດີໂອ: ${profile[key]} ເລື່ອງ`
                      : `${
                          key === 'age' ? 'ອາຍຸ' : 
                          key === 'height' ? 'ຄວາມສູງ' : 
                          key === 'weight' ? 'ນ້ຳໜັກ' : 
                          key === 'nationality' ? 'ສັນຊາດ' : 
                          'ອື່ນໆ'
                        }: ${profile[key]}`
                    }
                  </p>
                )
              )}
            </div>
          </div>

          {/* ການ໌ດຂໍ້ມູນເພີ່ມເຕີມ */}
          <div className={`p-4 rounded-lg ${cardBgClass} shadow-md`}>
            <h2 className={`text-xl font-semibold mb-2 ${textClass}`}>ຂໍ້ມູນເພີ່ມເຕີມ</h2>
            <p className={`leading-relaxed text-sm ${secondaryTextClass}`}>{profile.bio}</p>
          </div>
        </div>

        {/* ຮູບພາບ ແລະ ວິດີໂອ (ຝັ່ງຂວາ) */}
        <div className="w-full xl:w-2/3 xl:max-h-screen xl:overflow-y-auto no-scrollbar">
          
          {/* ສ່ວນຮູບພາບ */}
          <div className={`p-4 rounded-lg ${cardBgClass} shadow-md mb-4`}>
            <h2 className={`text-xl font-semibold mb-4 text-center ${textClass}`}>ຮູບພາບ</h2>
            
            {/* ແຖວຮູບພາບ */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
              {displayedImages.map((img, index) => (
                <div key={index} className="cursor-pointer" onClick={() => handleImageClick(index)}>
                  <img 
                    src={img} 
                    alt={`profile-img-${index}`} 
                    className={`rounded-md w-full h-40 md:h-48 object-cover ${borderClass} border transition-transform hover:scale-105`}
                    loading="lazy" 
                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop'} 
                  />
                </div>
              ))}
            </div>
            
            {/* ປຸ່ມເບິ່ງຮູບເພີ່ມເຕີມ */}
            {images.length > 4 && !showAllImages && (
              <div className="mt-4 text-center">
                <button 
                  className={`px-4 py-2 rounded text-white ${buttonClass}`} 
                  onClick={() => setShowAllImages(true)}
                >
                  ເບິ່ງຮູບເພີ່ມເຕີມ ({images.length - 4} ຮູບ)
                </button>
              </div>
            )}
            
            {/* ປຸ່ມກ້ອນກັບ */}
            {showAllImages && (
              <div className="mt-4 text-center">
                <button 
                  className={`px-4 py-2 rounded text-white ${buttonClass}`} 
                  onClick={() => setShowAllImages(false)}
                >
                  ກ້ອນກັບ
                </button>
              </div>
            )}
          </div>

          {/* ສ່ວນວິດີໂອ */}
          <div className={`p-4 rounded-lg ${cardBgClass} shadow-md`}>
            <h2 className={`text-xl font-semibold mb-4 text-center ${textClass}`}>ວິດີໂອ</h2>
            
            {/* ແຖວວິດີໂອ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {videos.map((video) => (
                <div 
                  key={video.id} 
                  className={`rounded-md hover:shadow-lg transition overflow-hidden cursor-pointer ${cardBgClass} ${isDarkMode ? 'shadow-gray-800' : 'shadow'}`}
                  onClick={() => handleVideoClick(video.id)}
                >
                  {/* ຮູບ thumbnail ຂອງວິດີໂອ */}
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-40 object-cover"
                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop'} 
                  />
                  
                  {/* ຂໍ້ມູນວິດີໂອ */}
                  <div className="p-3">
                    <h3 className={`font-semibold text-sm truncate ${textClass}`}>{video.title}</h3>
                    <p className={`text-xs ${secondaryTextClass}`}>{video.views} views • {video.duration} min</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal ສຳລັບການເບິ່ງຮູບໃຫຍ່ */}
      {showImageModal && (
        <ImageModal 
          images={images} 
          selectedImageIndex={selectedImageIndex} 
          onClose={handleCloseModal} 
          onPrev={handlePrevImage} 
          onNext={handleNextImage} 
          isDarkMode={isDarkMode} 
        />
      )}
    </div>
  );
};

// ຄອມໂປເນັນ Modal ສຳລັບການເບິ່ງຮູບໃຫຍ່
const ImageModal = ({ images, selectedImageIndex, onClose, onPrev, onNext, isDarkMode }) => {
  
  // ຈັດການການກົດປຸ່ມແປ້ນພິມ
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') onPrev();           // ລູກສອນຊ້າຍ - ຮູບກ່ອນ
    else if (e.key === 'ArrowRight') onNext();     // ລູກສອນຂວາ - ຮູບຕໍ່ໄປ
    else if (e.key === 'Escape') onClose();        // ESC - ປິດ Modal
  }, [onPrev, onNext, onClose]);

  // ລົງທະບຽນ event listener ເມື່ອ Modal ເປີດ
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // ປ້ອງກັນການ scroll ພື້ນຫຼັງ
    
    // ລົບ event listener ເມື່ອ Modal ປິດ
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDarkMode ? 'bg-black/80' : 'bg-black/70'}`} 
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-full w-full" onClick={e => e.stopPropagation()}>
        
        {/* ປຸ່ມປິດ Modal */}
        <button 
          className="absolute -top-12 right-0 text-white text-3xl z-10 p-2 rounded-full bg-black/50" 
          onClick={onClose}
        >
          &times;
        </button>
        
        <div className="relative">
          {/* ຮູບພາບຫຼັກ */}
          <img 
            src={images[selectedImageIndex]} 
            alt={`profile-image-${selectedImageIndex}`} 
            className="max-w-full max-h-screen object-contain rounded mx-auto"
            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop'} 
          />
          
          {/* ປຸ່ມເປັ່ງແປງຮູບ (ສະແດງເມື່ອມີຮູບຫຼາຍກວ່າ 1 ຮູບ) */}
          {images.length > 1 && (
            <>
              {/* ປຸ່ມຮູບກ່ອນ (Desktop) */}
              <button 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hidden md:block" 
                onClick={onPrev}
              >
                &#10094;
              </button>
              
              {/* ປຸ່ມຮູບຕໍ່ໄປ (Desktop) */}
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hidden md:block" 
                onClick={onNext}
              >
                &#10095;
              </button>
              
              {/* ປຸ່ມສຳລັບມືຖື */}
              <div className="md:hidden flex justify-center mt-4 space-x-4">
                <button 
                  className="bg-black/50 text-white p-2 rounded-full" 
                  onClick={onPrev}
                >
                  &#10094;
                </button>
                <button 
                  className="bg-black/50 text-white p-2 rounded-full" 
                  onClick={onNext}
                >
                  &#10095;
                </button>
              </div>
            </>
          )}
        </div>
        
        {/* ສະແດງລຳດັບຮູບປະຈຸບັນ */}
        <div className="text-white text-center mt-4">
          {selectedImageIndex + 1} / {images.length}
        </div>
        
        {/* ຄຳແນະນຳການນຳໃຊ້ */}
        <div className="text-white/70 text-center mt-2 text-sm">
          ໃຊ້ນິ້ວເລື່ອນຊ້າຍຂວາເພື່ອປ່ຽນຮູບ • ກົດ ESC ເພື່ອປິດ
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;