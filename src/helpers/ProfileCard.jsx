import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileCard = ({ profile }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profiles/${profile.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer hover:shadow-lg transition-all duration-300 text-center rounded-lg hover:bg-gray-50"
    >
      <img
        src={profile.image}
        alt={profile.name}
        className="w-14 h-14 md:w-16 md:h-16 rounded-full mx-auto object-cover border-2 border-gray-200 hover:border-blue-400 transition-colors"
      />
      <h3 className="text-sm md:text-base font-semibold text-gray-800 mt-2 truncate px-1">{profile.name}</h3>
    </div>
  );
};

export default ProfileCard;