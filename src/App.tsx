import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthContainer from './components/AuthContainer/AuthContainer';
import Home from './components/Home/Home';


const App: React.FC = () => {
  return (
    <div>
      <AuthContainer />
      <Home />
    </div>
  );
};

export default App;
