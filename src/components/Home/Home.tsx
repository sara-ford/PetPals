import React, { useState, useEffect } from 'react';
import NavBar from '../NavBar/NavBar';
import './Home.scss';

const Home = () => {
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:3001/pets')
      .then(response => response.json())
      .then(data => setPets(data as any[]))
      .catch(error => console.error('Error fetching pets:', error));
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
  }, []);

  const toggleFavorite = (petId: any) => {
    setFavorites((prev: any) =>
      prev.includes(petId)
        ? prev.filter((id: any) => id !== petId)
        : [...prev, petId]
    );
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

  const closePetDetails = () => {
    setSelectedPet(null);
  };

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
      <NavBar />
      <div className="content">
        <h1>ברוך הבא לדף הבית!</h1>
        <div className="pet-grid">
          {pets.map(pet => (
            <div
              key={pet.id}
              className="pet-card"
              onClick={() => openPetDetails(pet)}
            >
              <img
                src={pet.image}
                alt={pet.name}
                className="pet-image"
              />
              <div className="pet-info">
                <h2>{pet.name}</h2>
                <p>סוג: {pet.type}</p>
                <p>מין: {pet.gender}</p>
                <p>גיל: {pet.age}</p>
                <p>סטטוס: {pet.status}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(pet.id);
                  }}
                  className="favorite-button"
                >
                  {favorites.includes(pet.id) ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedPet && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button
                onClick={closePetDetails}
                className="modal-close"
              >
                ×
              </button>
              <img
                src={selectedPet.image}
                alt={selectedPet.name}
                className="modal-image"
              />
              <h2>{selectedPet.name}</h2>
              <p>סוג: {selectedPet.type}</p>
              <p>מין: {selectedPet.gender}</p>
              <p>גיל: {selectedPet.age}</p>
              <p>סטטוס: {selectedPet.status}</p>
              <button
                onClick={() => toggleFavorite(selectedPet.id)}
                className="favorite-button"
              >
                {favorites.includes(selectedPet.id) ? '❤️' : '🤍'}
              </button>

              <h3>ביקורות</h3>
              {selectedPet.reviews && selectedPet.reviews.length > 0 ? (
                selectedPet.reviews.map((review: any) => (
                  <div key={review.id} className="review">
                    <p className="review-rating">דירוג: {review.rating}/5</p>
                    <p className="review-comment">{review.comment}</p>
                    {currentUser?.id === review.userId && (
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
