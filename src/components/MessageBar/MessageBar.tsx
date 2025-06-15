import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { setMessage } from '../../redux/messageSlice';
import './MessageBar.scss';

const MessageBar = () => {
  const message = useSelector((state: RootState) => state.message);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message.text) {
      setVisible(true);
      const timeout = setTimeout(() => {
        setVisible(false);
        dispatch(setMessage({ type: '', text: '' }));
      }, 4000); // נעלם אחרי 4 שניות
      return () => clearTimeout(timeout);
    }
  }, [message, dispatch]);

  if (!visible || !message.text) return null;

  return (
    <div className={`message-bar ${message.type}`}>
      {message.text}
    </div>
  );
};

export default MessageBar;
