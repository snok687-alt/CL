// pages/ProfilePage.jsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Star, MapPin } from 'lucide-react';
import profiles from '../data/profiles';  // นำเข้าข้อมูลจากไฟล์เดียวกัน

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const profile = profiles.find((p) => p.id === parseInt(id));

  if (!profile) return <div>ไม่พบข้อมูล</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 pl-6 text-sm text-gray-500 hover:underline flex items-center"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        กลับ
      </button>

      <div className="bg-white p-6 rounded-lg shadow text-center">
        <img
          src={profile.image}
          alt={profile.name}
          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
        />
        <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
        <div className="flex justify-center gap-2 mt-2 text-gray-600">
          <Star size={18} className="text-yellow-400" />
          <span>{profile.rating} / 5.0</span>
        </div>

        <p className="mt-4 text-gray-700">{profile.description}</p>

        <div className="mt-6 text-left space-y-2">
          <div className="flex items-center gap-2">
            <Mail size={18} /> <span>{profile.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={18} /> <span>{profile.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={18} /> <span>{profile.location}</span>
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div className="w-30 h-50 bg-gray-300 rounded-sm border">nok</div>
          <div className="w-30 h-50 bg-gray-300 rounded-sm border ">nok</div>
          <div className="w-30 h-50 bg-gray-300 rounded-sm">nok</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;