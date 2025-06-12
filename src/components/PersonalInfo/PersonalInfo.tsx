import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { PencilSquare } from 'react-bootstrap-icons'; // אייקון עריכה חמוד מ-bootstrap-icons
import './PersonalInfo.scss';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('שדה חובה'),
  email: Yup.string().email('אימייל לא תקין').required('שדה חובה'),
  password: Yup.string().min(6, 'לפחות 6 תווים').required('שדה חובה'),
});

const PersonalInfo = ({ onClose }: { onClose: () => void }) => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setFormData({
        name: parsed.name,
        email: parsed.email,
        password: parsed.password,
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      if (user) {
        const updatedUser = { ...user, ...formData };
        const res = await fetch(`http://localhost:3001/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser),
        });
        if (res.ok) {
          localStorage.setItem('user', JSON.stringify(updatedUser));
          alert('הפרטים נשמרו בהצלחה');
          setIsEditing(false);
          setUser(updatedUser);
        }
      }
    } catch (err: any) {
      const validationErrors: any = {};
      err.inner?.forEach((e: any) => {
        validationErrors[e.path] = e.message;
      });
      setErrors(validationErrors);
    }
  };

  if (!user) return null;

  return (
    <div className="personal-modal-overlay" onClick={onClose}>
      <div className="personal-modal-content" onClick={(e) => e.stopPropagation()}>
        {!isEditing ? (
          <div className="personal-view">
            <h2>הפרטים שלי</h2>
            <p><strong>שם:</strong> {user.name}</p>
            <p><strong>אימייל:</strong> {user.email}</p>
            <button
              className="edit-button-icon"
              onClick={() => setIsEditing(true)}
              aria-label="ערוך"
            >
              <PencilSquare size={20} />
            </button>
          </div>
        ) : (
          <form className="PersonalInfoForm">
            <h2>עריכת פרטים</h2>

            <label>שם:</label>
            <input name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <div className="error">{errors.name}</div>}

            <label>אימייל:</label>
            <input name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <div className="error">{errors.email}</div>}

            <label>סיסמה:</label>
            <input name="password" type="text" value={formData.password} onChange={handleChange} />
            {errors.password && <div className="error">{errors.password}</div>}

            <div className="button-row">
              <button type="button" className="save-button" onClick={handleSave}>שמור</button>
              <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>ביטול</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;
