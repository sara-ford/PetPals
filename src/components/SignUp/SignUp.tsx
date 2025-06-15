import React, { FC, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './SignUp.scss';

interface SignUpProps {
  setIsRegistering: (value: boolean) => void;
}

const SignUp: FC<SignUpProps> = ({ setIsRegistering }) => {
  const [message, setMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('שדה חובה'),
      email: Yup.string().email('אימייל לא תקין').required('שדה חובה'),
      password: Yup.string()
        .required('שדה חובה')
        .min(8, 'לפחות 8 תווים')
        .matches(/[a-z]/, 'חייב לכלול אות קטנה')
        .matches(/[A-Z]/, 'חייב לכלול אות גדולה')
        .matches(/\d/, 'חייב לכלול מספר')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'חייב לכלול תו מיוחד'),
    }),
    onSubmit: async (values) => {
      try {
        // בדיקה אם משתמש עם האימייל כבר קיים
        const checkUserRes = await fetch(`http://localhost:3001/users?email=${values.email}`);
        const existingUsers = await checkUserRes.json();

        if (existingUsers.length > 0) {
          setMessage('אתה כבר קיים במערכת!');
          return;
        }

        // קבלת כל המשתמשים כדי לחשב את ה-id הבא
        const allUsersRes = await fetch('http://localhost:3001/users');
        const allUsers = await allUsersRes.json();
        const maxId = allUsers.length > 0 ? Math.max(...allUsers.map((user: any) => user.id)) : 0;
        const newId = maxId + 1;

        // הוספת המשתמש עם id חדש וסטטוס customer
        const res = await fetch('http://localhost:3001/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: newId,
            ...values,
            status: 'customer', // שימוש ב-status במקום role
          }),
        });

        if (res.ok) {
          const newUser = await res.json();
          setMessage(`נרשמת בהצלחה, ${newUser.name || values.name}!`);
          setTimeout(() => {
            console.log('Switching to SignIn');
            setIsRegistering(false); // מעבר לטופס ההתחברות
          }, 2000);
        } else {
          setMessage('שגיאה ברישום, נסה שוב.');
        }
      } catch (error) {
        setMessage('אירעה שגיאה בשרת, נסה שוב מאוחר יותר.');
        console.error('Error during signup:', error);
      }
    },
  });

  return (
    <div className="SignUp" style={{ direction: 'rtl' }}>
      <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
        <h3 className="text-center mb-4">רישום משתמש</h3>

        <div className="mb-3">
          <label className="form-label">שם:</label>
          <input
            name="name"
            type="text"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          {formik.errors.name && <div className="text-danger small">{formik.errors.name}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">אימייל:</label>
          <input
            name="email"
            type="email"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.errors.email && <div className="text-danger small">{formik.errors.email}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">סיסמה:</label>
          <input
            name="password"
            type="password"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.errors.password && <div className="text-danger small">{formik.errors.password}</div>}
        </div>

        <button type="submit" className="btn btn-success w-100">הירשם</button>
      </form>
      {message && <p className="message text-center mt-3">{message}</p>}
    </div>
  );
};

export default SignUp;