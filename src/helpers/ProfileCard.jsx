// components/ProfileCard.jsx

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
      className="cursor-pointer hover:shadow-xl transition text-center border-gray-100 hover:border-gray-200"
    >
      <img
        src={profile.image}
        alt={profile.name}
        className="w-16 h-16 rounded-full mx-auto  object-cover border-2 border-gray-200"
      />
      <h3 className="text-xs font-semibold text-gray-800">{profile.name}</h3>
    </div>
  );
};

export default ProfileCard;
