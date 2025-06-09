import React from 'react';
import NavBar from '../NavBar/NavBar'; // ודא שהנתיב נכון

const Home = () => {
  return (
    <div>
      <NavBar /> {/* כאן ה־NavBar */}
      <div className="home-content">
        <h1>ברוך הבא לדף הבית!</h1>
        <p>כאן תוכל לנהל את הכל.</p>
      </div>
    </div>
  );
};

export default Home;
