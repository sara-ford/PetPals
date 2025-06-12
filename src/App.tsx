import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Toast } from 'react-bootstrap';
import { RootState, AppDispatch } from './redux/store';
import { clearMessage } from './redux/messageSlice';
import AuthContainer from './components/AuthContainer/AuthContainer';
import Home from './components/Home/Home';
import PersonalInfo from './components/PersonalInfo/PersonalInfo';
import Favorites from './components/Favorits/Favorits';
import NavBar from './components/NavBar/NavBar';
import AddPet from './components/AddPet/AddPet';
import './App.css';

const AppContent: React.FC = () => {
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const message = useSelector((state: RootState) => state.message.message);

  const isLoginPage = location.pathname === '/';

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  return (
    <>
      {!isLoginPage && (
        <NavBar onShowPersonalInfo={() => setShowPersonalInfo(true)} />
      )}

      {showPersonalInfo && (
        <PersonalInfo onClose={() => setShowPersonalInfo(false)} />
      )}

      {message && (
        <div className="toast-container">
          <Toast
            show={!!message}
            onClose={() => dispatch(clearMessage())}
            delay={3000}
            autohide
            className={message.type === 'success' ? 'toast-success' : 'toast-error'}
          >
            <Toast.Header>
              <strong className="me-auto">
                {message.type === 'success' ? 'הצלחה' : 'שגיאה'}
              </strong>
            </Toast.Header>
            <Toast.Body>{message.text}</Toast.Body>
          </Toast>
        </div>
      )}

      <Routes>
        <Route path="/" element={<AuthContainer />} />
        <Route path="/home" element={<Home onShowPersonalInfo={() => setShowPersonalInfo(true)} />} />
        <Route path="/personal-info" element={<PersonalInfo onClose={() => setShowPersonalInfo(false)} />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/add-pet" element={<AddPet />} />
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