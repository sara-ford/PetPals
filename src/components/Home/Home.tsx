import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../redux/cartSlice';
import { setMessage } from '../../redux/messageSlice';
import { RootState } from '../../redux/store';
import useFetchUsers from '../../Hooks/userRequestHook'; 

// Placeholder PetCard component (replace with actual implementation)
// const PetCard = ({ pet }: { pet: any }) => (
//   <div className="pet-card">
//     <img src={pet.image} alt={pet.name} className="pet-image" />
//     <div className="pet-info">
//       <h2>{pet.name}</h2>
//       <p>סוג: {pet.type}</p>
//       <p>מין: {pet.gender}</p>
//       <p>גיל: {pet.age}</p>
//       <p>סטטוס: {pet.status}</p>
//       <p>מחיר: {pet.price}</p>

//     </div>
//   </div>
// );

const Home = ({ onShowPersonalInfo }: { onShowPersonalInfo: () => void }) => {
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [editReviewId, setEditReviewId] = useState<string | null>(null);
  const [editComment, setEditComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const isAdmin = currentUser?.status === 'admin';
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const petsPerPage = 21;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet);
  const totalPages = Math.ceil(pets.length / petsPerPage);

// const updatedReviews = reviews.map((review: any) => ({
//   ...review,
//   username: users.find((user: any) => user.id === review.userId)?.name || 'משתמש אנונימי',
// }));
  useEffect(() => {
    let url = 'http://localhost:3001/pets';
    const params = [];
    if (statusFilter) params.push(`status=${encodeURIComponent(statusFilter)}`);
    if (typeFilter) params.push(`type=${encodeURIComponent(typeFilter)}`);
    if (params.length) url += `?${params.join('&')}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch pets');
        return response.json();
      })
      .then((data) => setPets(data))
      .catch((error) => {
        console.error('Error fetching pets:', error);
        dispatch(setMessage({ type: 'error', text: 'שגיאה בטעינת החיות' }));
      });
  }, [statusFilter, typeFilter, dispatch]);

  useEffect(() => {
    if (selectedPet) {
      setNewRating(0);
      setNewComment('');
      setShowReviewForm(false);
      setEditReviewId(null);
      setEditComment('');
    }
  }, [selectedPet]);

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
    const isInCart = cartItems.find((item: any) => item.id === pet.id);
    if (isInCart) {
      dispatch(removeFromCart(pet.id));
      dispatch(setMessage({ type: 'success', text: `החיה ${pet.name} הוסרה מהסל!` }));
    } else {
      dispatch(addToCart(cartItem));
      dispatch(setMessage({ type: 'success', text: `הופ! ${pet.name} ! בחביבים!` }));
    }
  };

  const openPetDetails = (pet: any) => {
    fetch(`http://localhost:3001/reviews?petId=${pet.id}`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch reviews');
        return response.json();
      })
     .then((reviews) => {
        const updatedReviews = reviews.map((review: any) => ({
          ...review,
          username: users.find((user: any) => user.id === review.userId)?.name || 'משתמש אנונימי',
        }));
        setSelectedPet({ ...pet, reviews: updatedReviews });
      }) 
      .catch((error) => {
        console.error('Error fetching reviews:', error);
        setSelectedPet({ ...pet, reviews: [] });
        dispatch(setMessage({ type: 'error', text: 'שגיאה בטעינת ביקורות' }));
      });
  };

  const closePetDetails = () => setSelectedPet(null);

  const handleDeletePet = async (petId: number) => {
    const confirmDelete = window.confirm('האם אתה בטוח שברצונך למחוק את החיה?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/pets/${petId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete pet');
      setPets((prevPets) => prevPets.filter((p) => p.id !== petId));
      if (selectedPet?.id === petId) {
        setSelectedPet(null);
      }
      dispatch(setMessage({ type: 'success', text: 'החיה נמחקה בהצלחה!' }));
    } catch (error) {
      console.error('Error deleting pet:', error);
      dispatch(setMessage({ type: 'error', text: 'שגיאה במחיקת החיה' }));
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/reviews/${reviewId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const updatedReviews = selectedPet.reviews.filter((r: any) => r.id !== reviewId);
        setSelectedPet({ ...selectedPet, reviews: updatedReviews });
        dispatch(setMessage({ type: 'success', text: 'הביקורת נמחקה בהצלחה!' }));
      } else {
        dispatch(setMessage({ type: 'error', text: 'שגיאה במחיקת הביקורת' }));
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      dispatch(setMessage({ type: 'error', text: 'שגיאה במחיקת הביקורת' }));
    }
  };

  const startEditReview = (review: any) => {
    setEditReviewId(review.id);
    setEditComment(review.comment);
  };

  const saveEditedReview = async (review: any) => {
    try {
      const updated = { ...review, comment: editComment };
      const res = await fetch(`http://localhost:3001/reviews/${review.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const saved = await res.json();
        setSelectedPet((prev: any) => ({
          ...prev,
          reviews: prev.reviews.map((r: any) => (r.id === saved.id ? saved : r)),
        }));
        setEditReviewId(null);
        setEditComment('');
        dispatch(setMessage({ type: 'success', text: 'הביקורת עודכנה בהצלחה!' }));
      } else {
        dispatch(setMessage({ type: 'error', text: 'שגיאה בעדכון הביקורת' }));
      }
    } catch (error) {
      console.error('Error updating review:', error);
      dispatch(setMessage({ type: 'error', text: 'שגיאה בעדכון הביקורת' }));
    }
  };

  const submitReview = async () => {
    if (!newRating) {
      dispatch(setMessage({ type: 'error', text: 'אנא בחר דירוג לביקורת' }));
      return;
    }
    if (!currentUser?.id) {
      dispatch(setMessage({ type: 'error', text: 'אנא התחבר כדי להוסיף ביקורת' }));
      return;
    }

    const newReview = {
      petId: selectedPet.id,
      userId: currentUser?.id,
      username: currentUser?.name || 'משתמש אנונימי',
      rating: newRating,
      comment: newComment || '',
    };

    try {
      const res = await fetch('http://localhost:3001/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
      if (res.ok) {
        const savedReview = await res.json();
        setSelectedPet((prev: any) => ({
          ...prev,
          reviews: [
            ...prev.reviews,
            { ...savedReview, username: currentUser?.name || 'משתמש אנונימי' },
          ],
        }));
        setNewRating(0);
        setNewComment('');
        setShowReviewForm(false);
        dispatch(setMessage({ type: 'success', text: 'הביקורת נוספה בהצלחה!' }));
      } else {
        dispatch(setMessage({ type: 'error', text: 'שגיאה בהוספת הביקורת' }));
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      dispatch(setMessage({ type: 'error', text: 'שגיאה בהוספת הביקורת' }));
    }
  };

  const renderStars = (rating: number, setRating: (value: number) => void) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
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
              onChange={(e) => setStatusFilter(e.target.value)}
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
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">הכל</option>
              <option value="כלב">כלב</option>
              <option value="חתול">חתול</option>
              <option value="תוכי">תוכי</option>
              <option value="אחר">אחר</option>
            </select>
          </div>
        </div>

        <div className="pet-grid">
          {currentPets.map((pet) => (
            <div key={pet.id} className="pet-card" onClick={() => openPetDetails(pet)}>
              <img src={pet.image || 'https://via.placeholder.com/250'} alt={pet.name} className="pet-image" />
              <div className="pet-info">
                <h3>{pet.name}</h3>
                <p>סוג: {pet.type}</p>
                <p>מין: {pet.gender}</p>
                <p>גיל: {pet.age}</p>
                <p>סטטוס: {pet.status}</p>
                <p>מחיר: {pet.price}</p>

                <div className="pet-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCart(pet);
                    }}
                    className="favorite-button"
                  >
                    {cartItems.find((item: any) => item.id === pet.id) ? (
                      <svg className="cart-icon filled" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    ) : (
                      <svg className="cart-icon" viewBox="0 0 24 24">
                        <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
                      </svg>
                    )}
                  </button>
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePet(pet.id);
                      }}
                      className="delete-button"
                    >
                      <svg className="icon" viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {selectedPet && (
          <div
            className="modal-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closePetDetails();
              }
            }}
          >
            <div className="modal-content">
              <button onClick={closePetDetails} className="modal-close">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
              <img src={selectedPet.image || 'https://via.placeholder.com/300'} alt={selectedPet.name} className="modal-image" />
              <h2>{selectedPet.name}</h2>
              <p>סוג: {selectedPet.type}</p>
              <p>מין: {selectedPet.gender}</p>
              <p>גיל: {selectedPet.age}</p>
              <p>סטטוס: {selectedPet.status}</p>
              <p>מחיר: {selectedPet.price}</p>

              <button onClick={() => toggleCart(selectedPet)} className="favorite-button">
                {cartItems?.find((item: any) => item.id === selectedPet.id) ? (
                  <svg className="icon filled" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  <svg className="icon" viewBox="0 0 24 24">
                    <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
                  </svg>
                )}
              </button>
              <h3>ביקורות</h3>
              {selectedPet.reviews && selectedPet.reviews.length > 0 ? (
                selectedPet.reviews.map((review: any) => (
                  <div key={review.id} className="review">
                    <p className="review-username">נכתב על ידי: {review.username}</p>
                    <div className="review-rating">
                      <span>דירוג: </span>
                      {renderStars(review.rating, () => { })}
                    </div>
                    {editReviewId === review.id ? (
                      <>
                        <textarea
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          rows={2}
                          className="edit-textarea"
                        />
                        <div className="review-actions">
                          <button
                            onClick={() => saveEditedReview(review)}
                            className="action-button save"
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16">
                              <path d="M17 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm3-10H5V5h10v4z" />
                            </svg>
                            שמור
                          </button>
                          <button
                            onClick={() => setEditReviewId(null)}
                            className="action-button cancel"
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16">
                              <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
                            </svg>
                            ביטול
                          </button>
                        </div>
                      </>
                    ) : (
                      review.comment && <p className="review-comment">{review.comment}</p>
                    )}
                    {String(currentUser?.id) === String(review.userId) && (
                      <div className="review-actions">
                        {editReviewId !== review.id && (
                          <>
                            <button
                              onClick={() => startEditReview(review)}
                              className="action-button edit"
                            >
                              <svg viewBox="0 0 24 24" width="16" height="16">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                              </svg>
                              ערוך
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="action-button delete"
                            >
                              <svg viewBox="0 0 24 24" width="16" height="16">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                              </svg>
                              מחק
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-reviews">אין ביקורות זמינות עבור חיה זו.</p>
              )}
              <div className="review-form">
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="toggle-review-form"
                >
                  {showReviewForm ? 'בטל הוספת ביקורת' : 'הוסף ביקורת'}
                </button>
                {showReviewForm && (
                  <div className="review-form-content">
                    <h4>ביקורת חדשה</h4>
                    <div className="rating-container">
                      <span>דירוג: </span>
                      {renderStars(newRating, setNewRating)}
                    </div>
                    <textarea
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="כתוב כאן את הביקורת שלך (אופציונלי)..."
                      className="review-textarea"
                    />
                    <button
                      onClick={submitReview}
                      className="submit-review"
                      disabled={!newRating}
                    >
                      שלח ביקורת
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;