import React, { useState, useEffect, lazy, Suspense } from 'react';
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
import PetDetails from './components/PetDetails/PetDetails';

import './App.css';
const AddPet = lazy(() => import('./components/AddPet/AddPet'));

const AppContent: React.FC = () => {
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const message = useSelector((state: RootState) => state.message);

  const isLoginPage = location.pathname === '/';

  useEffect(() => {
    if (message.text) {
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

      {message.text && (
        <div className="toast-container">
          <Toast
            show={!!message.text}
            onClose={() => dispatch(clearMessage())}
            delay={3000}
            autohide
            className={message.type === 'success' ? 'toast-success' : 'toast-error'}
          >
            <Toast.Header closeButton={false}> {/* Disable default close button */}
              <strong className="me-auto">
                {message.type === 'success'
                  ? 'הצלחה'
                  : message.type === 'error'
                  ? 'שגיאה'
                  : ''}
              </strong>
              <button
                type="button"
                className="btn-close"
                onClick={() => dispatch(clearMessage())}
                aria-label="סגור"
              />
            </Toast.Header>
            <Toast.Body>{message.text}</Toast.Body>
          </Toast>
        </div>
      )}


      <Routes>
        <Route path="/" element={<AuthContainer />} />
        <Route path="/pets/:id" element={<PetDetails />} />
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