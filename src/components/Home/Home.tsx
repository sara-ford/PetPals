import React from 'react';
import NavBar from '../NavBar/NavBar'; // ודא שהנתיב נכון

const Home = () => {
  return (
    <div>
      <NavBar /> 
      <div className="home-content">
        <h1>ברוך הבא לדף הבית!</h1>
      </div>
    </div>
  );
};

export default Home;
