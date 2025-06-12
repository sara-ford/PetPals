import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import './NavBar.scss';

interface NavBarProps {
  onShowPersonalInfo: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onShowPersonalInfo }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.status === 'admin') {
      setIsAdmin(true);
    }
  }, []);
  const cartItemCount = useSelector((state: RootState) => state.cart.items.length);

  return (
    <nav className="navbar">
      <div className="navbar-logo">🐶 Petpals</div>
      <ul className="navbar-links">
        <li><Link to="/">התחברות</Link></li>
        <li><Link to="/home">החיות שלנו</Link></li>
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
        {isAdmin && <li><Link to="/add-pet">הוסף חיה</Link></li>}
      </ul>
    </nav>
  );
};

export default NavBar;