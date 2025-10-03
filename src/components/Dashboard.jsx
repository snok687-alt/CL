// Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const searchTimeout = useRef(null);

  const isVideoPage = location.pathname.startsWith('/watch');
  const isSearchPage = location.pathname === '/search';
  const isProfilePage = location.pathname.startsWith('/profile'); // ກວດສອບໜ້າໂປຣໄຟລ໌

  const handleSearchChange = (term) => {
    setSearchTerm(term);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      if (term.trim() !== '') {
        if (isSearchPage) {
          window.dispatchEvent(new CustomEvent('searchUpdated', { detail: term }));
        } else {
          navigate('/search', { state: { searchTerm: term } });
        }
      } else {
        // ເມື່ອຄົ້ນຫາແບບຄຳວ່າງ
        if (isSearchPage) {
          window.dispatchEvent(new CustomEvent('searchUpdated', { detail: '' }));
          
          // ກວດສອບວ່າມາຈາກໝວດໝູ່ໃດຫຼືບໍ່
          const cameFromCategory = location.state?.fromCategory;
          if (cameFromCategory) {
            // ກັບຄືນໄປໝວດໝູ່ເດີມ
            navigate(cameFromCategory);
          } else {
            // ກັບຄືນໄປໜ້າຫຼັກ
            navigate('/');
          }
        }
        // ຫາກຢູ່ໜ້າໝວດໝູ່ແລ້ວ ບໍ່ຕ້ອງເຮັດຫຍັງ
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
      
      // ຖ້າເປັນໜ້າວິດີໂອ ແລະ ໜ້າຈໍໃຫຍ່, ບໍ່ຕ້ອງຈັບການເລື່ອນ
      if (isVideoPage && isLargeScreen) {
        setIsHeaderVisible(true);
        return;
      }
      
      // ຖ້າເປັນໜ້າ profile, ບໍ່ຕ້ອງຈັບການເລື່ອນ
      if (isProfilePage) {
        return;
      }
      
      // ຖ້າເລື່ອນລົງ (scroll down) ແລະ ເລື່ອນໄປແລ້ວຫຼາຍກວ່າ 50px
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsHeaderVisible(false);
      } 
      // ຖ້າເລື່ອນຂຶ້ນ (scroll up)
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
  }, [isVideoPage, isProfilePage, isLargeScreen]); // ເພີ່ມ dependencies

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
      {/* ສະແດງ Header ເມື່ອບໍ່ແມ່ນໜ້າ profile ຫຼື video page (ຍົກເວັ້ນ large screen) */}
      {!isProfilePage && (!isVideoPage || (isVideoPage && isLargeScreen)) && (
        <Header
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          isVisible={isHeaderVisible}
        />
      )}

      <main className={`flex-grow ${isVideoPage ? 'pt-0' : ''}`}>
        {/* ສົ່ງ isDarkMode ໄປຫາ child components ຜ່ານ context */}
        <Outlet context={{ searchTerm, isDarkMode, setSearchTerm }} />
      </main>
    </div>
  );
};

export default Dashboard;