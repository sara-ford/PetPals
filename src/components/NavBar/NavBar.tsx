import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.scss';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">🐶 PuppyCare</div>
      <ul className="navbar-links">
        <li><Link to="/">התחברות</Link></li>
        <li><Link to="/home">דף הבית</Link></li>
        <li><Link to="/about">אודות</Link></li>
        <li><Link to="/contact">צור קשר</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;
