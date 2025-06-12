import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import './NavBar.scss';

interface NavBarProps {
  onShowPersonalInfo: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onShowPersonalInfo }) => {
  const cartItemCount = useSelector((state: RootState) => state.cart.items.length);

  return (
    <nav className="navbar">
      <div className="navbar-logo">🐶 Petpals</div>
      <ul className="navbar-links">
        <li><Link to="/">התחברות</Link></li>
        <li><Link to="/home">דף הבית</Link></li>
        <li><Link to="/about">החיות שלנו</Link></li>
        <li>
          <Link to="/favorites">
           מועדפים{cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </Link>
        </li>
        <li>
          <a
            href="#"
            className="link-button"
            onClick={(e) => {
              e.preventDefault();
              onShowPersonalInfo();
            }}
          >
            הפרטים שלי
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;