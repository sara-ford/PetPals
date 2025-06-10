import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthContainer from './components/AuthContainer/AuthContainer';
import Home from './components/Home/Home';

const App: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AuthContainer />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;