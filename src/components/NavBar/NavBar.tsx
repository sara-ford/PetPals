import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { clearUser } from '../../redux/userSlice';
import { clearCart } from '../../redux/cartSlice';
import { setMessage } from '../../redux/messageSlice';
import './NavBar.scss';

interface NavBarProps {
  onShowPersonalInfo: () => void;
}

const NavBar: FC<NavBarProps> = ({ onShowPersonalInfo }) => {
  const cartItemCount = useSelector((state: RootState) => state.cart.items.length);
  const user = useSelector((state: RootState) => state.user.user);
  const isAdmin = user?.status === 'admin';
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(clearCart());
    dispatch(setMessage({ type: 'success', text: 'התנתקת בהצלחה!' }));
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">🐶 Petpals</div>
      <ul className="navbar-links">
        {user ? (
          <>
            <li className="user-greeting">
              שלום, <span className="user-name">{user.name}</span>
            </li>
            <li>
              <a
                href="#"
                className="link-button logout-button"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                התנתק
              </a>
            </li>
          </>
        ) : (
          <li><Link to="/">התחברות</Link></li>
        )}
        <li><Link to="/home">החיות שלנו</Link></li>
        <li>
          <Link to="/favorites">
           המעודפים שלי{cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
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