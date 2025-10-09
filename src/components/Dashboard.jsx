// Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const [currentCategory, setCurrentCategory] = useState(null); // เก็บหมวดหมู่ปัจจุบัน
  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const searchTimeout = useRef(null);

  const isVideoPage = location.pathname.startsWith('/watch');
  const isSearchPage = location.pathname === '/search';
  const isProfilePage = location.pathname.startsWith('/profile');
  const isCategoryPage = location.pathname.startsWith('/category/');

  // อัพเดทหมวดหมู่ปัจจุบันเมื่อเปลี่ยนหน้า
  useEffect(() => {
    if (isCategoryPage) {
      const categoryId = location.pathname.split('/').pop();
      setCurrentCategory(categoryId);
    } else if (isSearchPage) {
      // เก็บหมวดหมู่จาก state ถ้ามี
      const fromCategory = location.state?.fromCategory;
      if (fromCategory) {
        setCurrentCategory(fromCategory);
      }
    }
  }, [location, isCategoryPage, isSearchPage]);

  const handleSearchChange = (term) => {
    setSearchTerm(term);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      if (term.trim() !== '') {
        // ส่งข้อมูลหมวดหมู่ปัจจุบันไปกับ navigation
        const navigateState = { 
          searchTerm: term,
          fromCategory: currentCategory || (isCategoryPage ? location.pathname.split('/').pop() : null)
        };

        if (isSearchPage) {
          window.dispatchEvent(new CustomEvent('searchUpdated', { 
            detail: { 
              searchTerm: term,
              fromCategory: currentCategory
            } 
          }));
        } else {
          navigate('/search', { state: navigateState });
        }
      } else {
        // เมื่อค้นหาแบบคำว่าง
        if (isSearchPage) {
          window.dispatchEvent(new CustomEvent('searchUpdated', { 
            detail: { 
              searchTerm: '',
              fromCategory: currentCategory
            } 
          }));
          
          // กลับไปยังหมวดหมู่เดิม
          if (currentCategory) {
            navigate(`/category/${currentCategory}`);
          } else {
            // กลับไปหน้าหลัก
            navigate('/');
          }
        }
      }
    }, 500);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (isVideoPage && isLargeScreen) {
        setIsHeaderVisible(true);
        return;
      }
      
      if (isProfilePage) {
        return;
      }
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsHeaderVisible(false);
      } 
      else if (currentScrollY < lastScrollY.current) {
        setIsHeaderVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [isVideoPage, isProfilePage, isLargeScreen]);

  useEffect(() => {
    const handleHeaderToggle = (e) => {
      setIsHeaderVisible(e.detail === 'show');
    };

    window.addEventListener('toggleHeader', handleHeaderToggle);
    return () => window.removeEventListener('toggleHeader', handleHeaderToggle);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'
      }`}
    >
      {!isProfilePage && (!isVideoPage || (isVideoPage && isLargeScreen)) && (
        <Header
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          isVisible={isHeaderVisible}
          currentCategory={currentCategory}
        />
      )}

      <main className={`flex-grow ${isVideoPage ? 'pt-0' : ''}`}>
        <Outlet context={{ 
          searchTerm, 
          isDarkMode, 
          setSearchTerm,
          currentCategory 
        }} />
      </main>
    </div>
  );
};

export default Dashboard;