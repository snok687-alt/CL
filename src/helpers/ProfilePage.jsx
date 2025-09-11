import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Star, MapPin } from 'lucide-react';
import profiles from '../data/profiles';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const profile = profiles.find((p) => p.id === parseInt(id));

  if (!profile) return <div>ไม่พบข้อมูล</div>;

  return (
    <div className="max-w-6xl mx-auto px-4">
      <button
        onClick={() => navigate('/')}
        className="mb-6 pl-2 text-base text-gray-500 hover:text-gray-700 flex items-center transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        กลับ
      </button>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-8">
          {/* ข้อมูลโปรไฟล์ */}
          <div className="md:w-1/2 text-center md:text-left">
            <img
              src={profile.image}
              alt={profile.name}
              className="w-40 h-40 rounded-full mx-auto md:mx-0 mb-6 object-cover border-4 border-white shadow-md"
            />
            <h2 className="text-3xl font-bold text-gray-800">{profile.name}</h2>
            <div className="flex justify-center md:justify-start gap-2 mt-2 text-gray-600 items-center">
              <Star size={20} className="text-yellow-400" />
              <span className="text-lg">{profile.rating} / 5.0</span>
            </div>

            <p className="mt-6 text-gray-700 text-lg leading-relaxed">{profile.description}</p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-lg">
                <Mail size={20} className="text-blue-500" /> 
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-lg">
                <Phone size={20} className="text-green-500" /> 
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-lg">
                <MapPin size={20} className="text-red-500" /> 
                <span>{profile.location}</span>
              </div>
            </div>
          </div>

          {/* ตัวอย่างผลงาน */}
          <div className="md:w-1/2">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">ผลงาน</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="h-48 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <span className="text-gray-500">ผลงาน 1</span>
              </div>
              <div className="h-48 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <span className="text-gray-500">ผลงาน 2</span>
              </div>
              <div className="h-48 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <span className="text-gray-500">ผลงาน 3</span>
              </div>
              <div className="h-48 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <span className="text-gray-500">ผลงาน 4</span>
              </div>
              <div className="h-48 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <span className="text-gray-500">ผลงาน 5</span>
              </div>
              <div className="h-48 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <span className="text-gray-500">ผลงาน 6</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;