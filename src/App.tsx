import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Toast } from 'react-bootstrap';
import { RootState, AppDispatch } from './redux/store';
import { clearMessage } from './redux/messageSlice';
import AuthContainer from './components/AuthContainer/AuthContainer';
import NavBar from './components/NavBar/NavBar';
import './App.css';
const Home = lazy(() => import('./components/Home/Home'));
const PersonalInfo = lazy(() => import('./components/PersonalInfo/PersonalInfo'));
const Favorites = lazy(() => import('./components/Favorits/Favorits'));
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
    <Suspense fallback={<div>טוען...</div>}>
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
        {/*
        <Route path="/pets/:id" element={<PetDetails />} />
        */}
        <Route path="/home" element={<Home onShowPersonalInfo={() => setShowPersonalInfo(true)} />} />
        <Route path="/personal-info" element={<PersonalInfo onClose={() => setShowPersonalInfo(false)} />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/add-pet" element={<AddPet />} />
      </Routes>
    </Suspense>
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