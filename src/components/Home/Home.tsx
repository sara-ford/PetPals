import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../redux/cartSlice';
import './Home.scss';
import { RootState } from '../../redux/store';



const Home = ({ onShowPersonalInfo }: { onShowPersonalInfo: () => void }) => {
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    console.log(currentUser);

  }, []);

  useEffect(() => {
    let url = 'http://localhost:3001/pets';
    const params = [];
    if (statusFilter) params.push(`status=${encodeURIComponent(statusFilter)}`);
    if (typeFilter) params.push(`type=${encodeURIComponent(typeFilter)}`);
    if (params.length) url += `?${params.join('&')}`;

    fetch(url)
      .then(response => response.json())
      .then(data => setPets(data))
      .catch(error => console.error('Error fetching pets:', error));
  }, [statusFilter, typeFilter]);

  const toggleCart = (pet: any) => {
    const cartItem = {
      id: pet.id,
      name: pet.name,
      type: pet.type,
      image: pet.image,
      gender: pet.gender,
      age: pet.age,
      status: pet.status,
    };
    const isInCart = cartItems.find(item => item.id === pet.id);
    if (isInCart) {
      dispatch(removeFromCart(pet.id));
    } else {
      dispatch(addToCart(cartItem));
    }
  };

  const openPetDetails = (pet: any) => {
    fetch(`http://localhost:3001/reviews?petId=${pet.id}`)
      .then(response => response.json())
      .then(reviews => setSelectedPet({ ...pet, reviews }))
      .catch(error => {
        console.error('Error fetching reviews:', error);
        setSelectedPet({ ...pet, reviews: [] });
      });
  };

  const closePetDetails = () => setSelectedPet(null);

  const handleDeleteReview = async (reviewId: string) => {
    await fetch(`http://localhost:3001/reviews/${reviewId}`, {
      method: 'DELETE',
    });

    const updatedReviews = selectedPet.reviews.filter((r: any) => r.id !== reviewId);
    setSelectedPet({ ...selectedPet, reviews: updatedReviews });
  };

  const handleEditReview = (review: any) => {
    const newComment = prompt('עדכן את הביקורת שלך:', review.comment);
    if (!newComment) return;

    fetch(`http://localhost:3001/reviews/${review.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...review, comment: newComment }),
    })
      .then(res => res.json())
      .then((updatedReview) => {
        const updatedReviews = selectedPet.reviews.map((r: any) =>
          r.id === updatedReview.id ? updatedReview : r
        );
        setSelectedPet({ ...selectedPet, reviews: updatedReviews });
      });
  };

  return (
    <div className="home-container">
      <div className="content">
        <h1>ברוך הבא לדף הבית!</h1>

        <div className="filters">
          <div className="filter-group">
            <label htmlFor="status-filter">סינון לפי סטטוס:</label>
            <select id="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">הכל</option>
              <option value="למסירה">למסירה</option>
              <option value="למכירה">למכירה</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="type-filter">סינון לפי סוג:</label>
            <select id="type-filter" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">הכל</option>
              <option value="כלב">כלב</option>
              <option value="חתול">חתול</option>
              <option value="תוכי">תוכי</option>
              <option value="אחר">אחר</option>
            </select>
          </div>
        </div>

        <div className="pet-grid">
          {pets.map(pet => (
            <div key={pet.id} className="pet-card" onClick={() => openPetDetails(pet)}>
              <img src={pet.image} alt={pet.name} className="pet-image" />
              <div className="pet-info">
                <h2>{pet.name}</h2>
                <p>סוג: {pet.type}</p>
                <p>מין: {pet.gender}</p>
                <p>גיל: {pet.age}</p>
                <p>סטטוס: {pet.status}</p>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    toggleCart(pet);
                  }}
                  className="favorite-button"
                >
                  {cartItems.find(item => item.id === pet.id) ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedPet && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={closePetDetails} className="modal-close">×</button>
              <img src={selectedPet.image} alt={selectedPet.name} className="modal-image" />
              <h2>{selectedPet.name}</h2>
              <p>סוג: {selectedPet.type}</p>
              <p>מין: {selectedPet.gender}</p>
              <p>גיל: {selectedPet.age}</p>
              <p>סטטוס: {selectedPet.status}</p>
              <button
                onClick={() => toggleCart(selectedPet)}
                className="favorite-button"
              >
                {cartItems.find(item => item.id === selectedPet.id) ? '❤️' : '🤍'}
              </button>

              <h3>ביקורות</h3>
              {selectedPet.reviews && selectedPet.reviews.length > 0 ? (
                selectedPet.reviews.map((review: any) => (
                  <div key={review.id} className="review">
                    <p className="review-rating">דירוג: {review.rating}/5</p>
                    <p className="review-comment">{review.comment}</p>
                    {String(currentUser?.id) === String(review.userId) && (
                      <div className="review-actions">
                        <button onClick={() => handleEditReview(review)}>✏️ ערוך</button>
                        <button onClick={() => handleDeleteReview(review.id)}>🗑️ מחק</button>
                      </div>
                    )}

                  </div>
                ))
              ) : (
                <p className="no-reviews">אין ביקורות זמינות עבור חיה זו.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
