import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AuthContainer from './components/AuthContainer/AuthContainer';
import Home from './components/Home/Home';
import PersonalInfo from './components/PersonalInfo/PersonalInfo';
import Favorites from './components/Favorits/Favorits';
import NavBar from './components/NavBar/NavBar';

const AppContent: React.FC = () => {
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const location = useLocation();

  // בודק אם הנתיב הנוכחי הוא דף ההתחברות
  const isLoginPage = location.pathname === '/';

  return (
    <>
      {!isLoginPage && (
        <NavBar onShowPersonalInfo={() => setShowPersonalInfo(true)} />
      )}

      {showPersonalInfo && (
        <PersonalInfo onClose={() => setShowPersonalInfo(false)} />
      )}

      <Routes>
        <Route path="/" element={<AuthContainer />} />
        <Route path="/home" element={<Home onShowPersonalInfo={() => setShowPersonalInfo(true)} />} />
        <Route path="/personal-info" element={<PersonalInfo onClose={() => setShowPersonalInfo(false)} />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;