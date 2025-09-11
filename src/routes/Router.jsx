import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import VideoPlayer from '../pages/VideoPlayer';
import VideoGrid from '../pages/VideoGrid';
import SearchResults from '../pages/SearchResults';
import ProfilePage from '../helpers/ProfilePage';
import ProfileCarousel from '../helpers/ProfileCarousel';

// ข้อมูลหมวดหมู่
const categories = [
  { id: '20', name: '巨乳' }, { id: '40', name: '自拍' }, { id: '41', name: '偷情' },
  { id: '42', name: '偷拍' }, { id: '43', name: '萝莉' }, { id: '44', name: '动漫' },
  { id: '45', name: '强奸' }, { id: '46', name: '迷奸' }, { id: '47', name: '乱伦' },
  { id: '48', name: '虐待' }, { id: '49', name: '网红' }, { id: '50', name: '制服' },
  { id: '51', name: '麻豆' }, { id: '52', name: '果冻' }, { id: '53', name: 'SM' },
  { id: '54', name: '重口' }, { id: '55', name: '处女' }, { id: '56', name: '熟女' },
  { id: '57', name: '换妻' }, { id: '58', name: '明星' }, { id: '59', name: '人妻' },
  { id: '60', name: '孕妇' }, { id: '61', name: '人妖' }, { id: '62', name: '人兽' },
  { id: '63', name: '爆菊' }, { id: '64', name: '潮喷' }, { id: '65', name: '剧情' },
  { id: '66', name: '无码' }, { id: '67', name: '日韩' }, { id: '68', name: '精品' }
];

// Helper functions
export const getCategoryName = (categoryId) => {
  const map = {
    '20': '伦理片', '40': '悬疑片', '41': '战争片', '42': '犯罪片', '43': '剧情片',
    '44': '恐怖片', '45': '科幻片', '46': '爱情片', '47': '喜剧片', '48': '动作片', 
    '49': '奇幻片', '50': '冒险片', '51': '惊悚片', '52': '动画片', '53': '记录片'
  };
  return map[categoryId] || `หมวดหมู่ ${categoryId}`;
};

export const getFilterName = (filter) => {
  const map = {
    'trending': 'กำลังฮิต', 'education': 'การศึกษา', 'travel': 'ท่องเที่ยว',
    'cooking': 'ทำอาหาร', 'music': 'ดนตรี', 'news': 'ข่าว'
  };
  return map[filter] || filter;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<VideoGrid title="วิดีโอทั้งหมด" filter="all" />} />
          
          {/* สร้าง routes สำหรับหมวดหมู่แบบ dynamic */}
          {categories.map(({ id, name }) => (
            <Route 
              key={id}
              path={`category/${id}`} 
              element={<VideoGrid title={name} filter="all" />} 
            />
          ))}
          
          <Route path="search" element={<SearchResults />} />
          <Route path="watch/:videoId" element={<VideoPlayer />} />
          <Route path="profiles/:id" element={<ProfilePage />} />
          <Route path="test-profiles" element={<ProfileCarousel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;