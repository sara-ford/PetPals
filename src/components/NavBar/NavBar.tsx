import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.scss';

const NavBar = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.status === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo">🐶 Petpals</div>
      <ul className="navbar-links">
        <li><Link to="/">התחברות</Link></li>
        <li><Link to="/home">דף הבית</Link></li>
        <li><Link to="/about">החיות שלנו</Link></li>
        <li><Link to="/contact">מועדפים</Link></li>
        <li><Link to="/about">הפרטים שלי</Link></li>
        {isAdmin && <li><Link to="/add-pet">הוסף חיה</Link></li>}
      </ul>
    </nav>
  );
};

export default NavBar;
