import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import VideoPlayer from '../pages/VideoPlayer';
import VideoGrid from '../pages/VideoGrid';
import SearchResults from '../pages/SearchResults';
import ProfilePage from '../helpers/ProfilePage';
import ActorVideos from '../helpers/ActorVideos';

// ข้อมูลหมวดหมู่
const categories = [
  { id: '32', name: '国产视频' },
  { id: '33', name: '国产主播' },
  { id: '34', name: '91大神' },
  { id: '35', name: '热门事件' },
  { id: '36', name: '传媒自拍' },
  { id: '38', name: '日本有码' },
  { id: '39', name: '日本无码' },
  { id: '40', name: '日韩主播' },
  { id: '41', name: '动漫肉番' },
  { id: '42', name: '女同性恋' },
  { id: '43', name: '中文字幕' },
  { id: '44', name: '强奸乱伦' },
  { id: '45', name: '熟女人妻' },
  { id: '46', name: '制服诱惑' },
  { id: '47', name: 'AV解说' },
  { id: '48', name: '女星换脸' },
  { id: '49', name: '百万三区' },
  { id: '50', name: '欧美精品' }
];

// Helper functions
export const getCategoryName = (categoryId) => {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : `หมวดหมู่ ${categoryId}`;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<SearchResults />} />
          <Route path="category/:categoryId" element={<VideoGrid />} />
          <Route path="watch/:videoId" element={<VideoPlayer />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="actor/:actorName" element={<ActorVideos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;