import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../redux/cartSlice';
import { setMessage } from '../../redux/messageSlice';
import { RootState } from '../../redux/store';
import { useApiFetch } from '../../Hooks/useFetchDataHook';
import './PetDetails.scss';

const PetDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const currentUser = useSelector((state: RootState) => state.user.user);

  const isAdmin = currentUser?.status === 'admin';

  const { data: pet, loading: petLoading, error: petError } = useApiFetch<any>(`http://localhost:3001/pets/${id}`);
  const { data: reviews, loading: reviewsLoading, error: reviewsError } = useApiFetch<any[]>(`http://localhost:3001/reviews?petId=${id}`);
  const { data: users, loading: usersLoading, error: usersError } = useApiFetch<any[]>(`http://localhost:3001/users`);

  useEffect(() => {
    if (petError) dispatch(setMessage({ type: 'error', text: 'שגיאה בטעינת החיה' }));
    if (reviewsError) dispatch(setMessage({ type: 'error', text: 'שגיאה בטעינת הביקורות' }));
    if (usersError) dispatch(setMessage({ type: 'error', text: 'שגיאה בטעינת המשתמשים' }));
  }, [petError, reviewsError, usersError, dispatch]);

  const toggleCart = () => {
    if (!pet) return;
    const isInCart = cartItems.find(item => item.id === pet.id);
    if (isInCart) {
      dispatch(removeFromCart(pet.id));
      dispatch(setMessage({ type: 'success', text: `${pet.name} הוסרה מהסל` }));
    } else {
      dispatch(addToCart(pet));
      dispatch(setMessage({ type: 'success', text: `${pet.name} נוספה לסל` }));
    }
  };

  const submitReview = async () => {
    if (!newRating) return dispatch(setMessage({ type: 'error', text: 'בחר דירוג' }));
    if (!currentUser?.id) return dispatch(setMessage({ type: 'error', text: 'התחבר כדי להוסיף ביקורת' }));

    const review = {
      petId: pet.id,
      userId: currentUser.id,
      username: currentUser.name || 'אנונימי',
      rating: newRating,
      comment: newComment
    };

    try {
      const res = await fetch(`http://localhost:3001/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
      if (res.ok) {
        dispatch(setMessage({ type: 'success', text: 'הביקורת נוספה בהצלחה' }));
        setNewRating(0);
        setNewComment('');
      }
    } catch {
      dispatch(setMessage({ type: 'error', text: 'שגיאה בהוספת הביקורת' }));
    }
  };

  const renderStars = (rating: number, setRating?: (n: number) => void) => (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <span
          key={i}
          className={i <= rating ? 'filled' : ''}
          onClick={() => setRating && setRating(i)}
        >★</span>
      ))}
    </div>
  );

  if (petLoading) return <p>טוען...</p>;

  if (!pet) return <p>לא נמצאה חיה</p>;

  return (
    <div className="pet-details-container">
      <div className="pet-main">
        <img src={pet.image || 'https://via.placeholder.com/300'} alt={pet.name} />
        <div className="info">
          <h2>{pet.name}</h2>
          <p>סוג: {pet.type}</p>
          <p>מין: {pet.gender}</p>
          <p>גיל: {pet.age}</p>
          <p>סטטוס: {pet.status}</p>
          <button onClick={toggleCart}>
            {cartItems.find(item => item.id === pet.id) ? 'הסר מהסל' : 'הוסף לסל'}
          </button>
        </div>
      </div>
      <div className="reviews">
        <h3>ביקורות</h3>
        {reviews && reviews.length ? reviews.map(r => (
          <div key={r.id}>
            <p><strong>{users?.find(u => u.id === r.userId)?.name || 'אנונימי'}:</strong> {r.comment}</p>
            {renderStars(r.rating)}
          </div>
        )) : <p>אין ביקורות</p>}
        <div className="add-review">
          <h4>הוסף ביקורת</h4>
          {renderStars(newRating, setNewRating)}
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="כתוב ביקורת"
          />
          <button onClick={submitReview}>שלח</button>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
