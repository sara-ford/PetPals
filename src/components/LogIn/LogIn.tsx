import React, { FC, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './LogIn.scss';

const LogIn: FC = () => {
  const [message, setMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('אימייל לא תקין').required('שדה חובה'),
      password: Yup.string().min(6, 'לפחות 6 תווים').required('שדה חובה'),
    }),
    onSubmit: async (values) => {
      try {
        const res = await fetch("http://localhost:3001/users");
        const users = await res.json();

        const userExists = users.find(
          (user: any) =>
            user.email === values.email && user.password === values.password
        );

        if (userExists) {
          setMessage(`ברוכה הבאה, ${userExists.name}!`);
          // כאן אפשר להוסיף לוגיקה נוספת, כמו הפניה לדף אחר
        } else {
          setMessage('אימייל או סיסמה שגויים, נסה שוב.');
        }
      } catch (error) {
        setMessage('אירעה שגיאה בשרת, נסה שוב מאוחר יותר.');
      }
    },
  });

  return (
    <div className="Login" style={{ direction: 'rtl' }}>
      <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
        <h3 className="text-center mb-4">התחברות</h3>

        <div className="mb-3">
          <label className="form-label">אימייל:</label>
          <input
            name="email"
            type="email"
            className="form-control"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur} // הוספתי כדי שהתיקוף יעבוד עם onBlur
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-danger small">{formik.errors.email}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">סיסמה:</label>
          <input
            name="password"
            type="password"
            className="form-control"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur} // הוספתי כדי שהתיקוף יעבוד עם onBlur
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-danger small">{formik.errors.password}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-100">התחבר</button>
      </form>
      {message && <p className="message" style={{ textAlign: 'center' }}>{message}</p>}
    </div>
  );
};

export default LogIn;