import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileCard = ({ profile, isDarkMode = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${encodeURIComponent(profile.name)}`);
  };

  // Dynamic classes based on theme
  const hoverBgClass = isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const borderClass = isDarkMode ? 'border-gray-600 hover:border-blue-400' : 'border-gray-200 hover:border-blue-400';
  const textClass = isDarkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-800 hover:text-blue-600';

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer hover:shadow-lg transition-all duration-300 text-center rounded-full ${hoverBgClass}`}
    >
      <div className="relative group">
        <img
          src={profile.image}
          alt={profile.name}
          className={`w-14 h-14 md:w-16 md:h-16 rounded-full mx-auto object-cover border-2 ${borderClass} transition-colors group-hover:scale-105 transform duration-200`}
          onError={(e) => {
            e.target.src = '';
          }}
        />
      </div>
      <h3 className={`text-sm md:text-base font-semibold pt-1 truncate px-1 transition-colors ${textClass}`}>
        {profile.name}
      </h3>
    </div>
  );
};

export default ProfileCard;