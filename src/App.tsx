import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthContainer from './components/AuthContainer/AuthContainer';

import SignIn from './components/SignIn/SignIn';


const App: React.FC = () => {
 return (
    <div>
      < AuthContainer/>
    </div>
  );
};

export default App;