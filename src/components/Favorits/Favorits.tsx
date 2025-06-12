import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../../redux/cartSlice';
import { RootState } from '../../redux/store';
import './Favorits.scss';

const Favorites: FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  return (
    <div className="favorites-container">
      <h1>המעודפים שלי</h1>
      {cartItems.length === 0 ? (
        <p>לא בחרת מועדפים</p>
      ) : (
        <div className="cart-grid">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-image" />
              <div className="cart-info">
                <h2>{item.name}</h2>
                <p>סוג: {item.type}</p>
                <p>מין: {item.gender}</p>
                <p>גיל: {item.age}</p>
                <p>סטטוס: {item.status}</p>
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="remove-button"
                >
                  פחות מעודף
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;