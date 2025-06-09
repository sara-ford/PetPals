import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthContainer from './components/AuthContainer/AuthContainer';
import Home from './components/Home/Home';
import NavBar from './components/NavBar/NavBar';

const App: React.FC = () => {
  return (
    <Router>
      <NavBar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthContainer />} />
        <Route path="/about" element={<div>דף מידע</div>} />
      </Routes>
    </Router>
  );
};

export default App;
