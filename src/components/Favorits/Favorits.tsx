import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../../redux/cartSlice';
import { setMessage } from '../../redux/messageSlice';
import { RootState } from '../../redux/store';
import './Favorits.scss';

const Favorites: FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const handleRemove = (id: number, name: string) => {
    dispatch(removeFromCart(id));
    dispatch(setMessage({ type: 'success', text: `החיה ${name} הוסרה מהסל!` }));
  };

  return (
    <div className="favorites-container">
      <h1>הסל שלי</h1>
      {cartItems.length === 0 ? (
        <p>הסל שלך ריק.</p>
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
                  onClick={() => handleRemove(item.id, item.name)}
                  className="remove-button"
                >
                  הסר מהסל
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