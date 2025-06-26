import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { addToCart, removeFromCart } from '../../redux/cartSlice';
import { setMessage } from '../../redux/messageSlice';
import { RootState } from '../../redux/store';
import { useApiFetch } from '../../Hooks/useFetchDataHook';
import './Home.scss';

interface HomeProps {
  onShowPersonalInfo: () => void;
}

const Home: React.FC<HomeProps> = ({ onShowPersonalInfo }) => {
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pets, setPets] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const limit = 21;
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdmin = currentUser?.status === 'admin';

  const url = `http://localhost:3001/pets?page=${page}&limit=${limit}${statusFilter ? `&status=${encodeURIComponent(statusFilter)}` : ''}${typeFilter ? `&type=${encodeURIComponent(typeFilter)}` : ''}`;
  const { data: petsData, loading, error } = useApiFetch<any[]>(url);

  useEffect(() => {
    if (error) {
      dispatch(setMessage({ type: 'error', text: 'שגיאה בטעינת החיות' }));
      setHasMore(false);
    }
    if (petsData) {
      if (page === 1) {
        setPets(petsData);
      } else {
        setPets(prev => [...prev, ...petsData]);
      }
      setHasMore(petsData.length === limit);
    }
  }, [petsData, error, dispatch, page]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [statusFilter, typeFilter]);

  const toggleCart = (pet: any) => {
    const isInCart = cartItems.find(item => item.id === pet.id);
    if (isInCart) {
      dispatch(removeFromCart(pet.id));
      dispatch(setMessage({ type: 'success', text: `החיה ${pet.name} הוסרה מהסל!` }));
    } else {
      dispatch(addToCart(pet));
      dispatch(setMessage({ type: 'success', text: `החיה ${pet.name} נוספה לסל!` }));
    }
  };

  const openPetDetails = (pet: any) => {
    navigate(`/pets/${pet.id}`);
  };

  const handleDeletePet = async (petId: string) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את החיה?')) return;
    try {
      await fetch(`http://localhost:3001/pets/${petId}`, { method: 'DELETE' });
      setPets(prev => prev.filter(p => p.id !== petId));
      dispatch(setMessage({ type: 'success', text: 'החיה נמחקה בהצלחה!' }));
    } catch {
      dispatch(setMessage({ type: 'error', text: 'שגיאה במחיקת החיה' }));
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-title">מצא את החבר הכי טוב שלך!</h1>
          <p className="hero-subtitle">גלה חיות מחמד מקסימות שמחכות לבית חם</p>
          <a href="#pets" className="hero-button">ראה את החיות שלנו</a>
        </div>
      </div>

      <div className="content" id="pets">
        <h2 className="section-title">החיות שלנו</h2>

        <div className="filters">
          <div className="filter-group">
            <label htmlFor="status-filter">סינון לפי סטטוס:</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">הכל</option>
              <option value="למסירה">למסירה</option>
              <option value="למכירה">למכירה</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="type-filter">סינון לפי סוג:</label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="">הכל</option>
              <option value="כלב">כלב</option>
              <option value="חתול">חתול</option>
              <option value="תוכי">תוכי</option>
              <option value="אחר">אחר</option>
            </select>
          </div>
        </div>

        <InfiniteScroll
          dataLength={pets.length}
          next={() => setPage(prev => prev + 1)}
          hasMore={hasMore}
          loader={<p className="loading">טוען חיות נוספות...</p>}
          endMessage={<p className="end-message">אין עוד חיות להציג</p>}
          className="pet-grid"
        >
          {pets.map(pet => (
            <div key={pet.id} className="pet-card" onClick={() => openPetDetails(pet)}>
              <img src={pet.image || 'https://via.placeholder.com/250'} alt={pet.name} className="pet-image" />
              <div className="pet-info">
                <h3>{pet.name}</h3>
                <p>סוג: {pet.type}</p>
                <p>מין: {pet.gender}</p>
                <p>גיל: {pet.age}</p>
                <p>סטטוס: {pet.status}</p>
                <div className="pet-actions">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleCart(pet);
                    }}
                    className="favorite-button"
                  >
                    {cartItems.find(item => item.id === pet.id) ? (
                      <svg className="cart-icon filled" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                 C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
                 c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    ) : (
                      <svg className="cart-icon" viewBox="0 0 24 24">
                        <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09
                 C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5
                 c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32
                 C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55
                 l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5
                 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87
                 C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5
                 0 2.89-3.14 5.74-7.9 10.05z" />
                      </svg>
                    )}
                  </button>

                  {isAdmin && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDeletePet(pet.id);
                      }}
                      className="delete-button"
                    >
                      <svg className="icon" viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z
                 M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                      </svg>
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Home;
