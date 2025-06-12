import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthContainer from './components/AuthContainer/AuthContainer';
import Home from './components/Home/Home';
import AddPet from './components/AddPet/AddPet';


const App: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AuthContainer />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add-pet" element={<AddPet />} />

      </Routes>
    </div>
  );
};

export default App;