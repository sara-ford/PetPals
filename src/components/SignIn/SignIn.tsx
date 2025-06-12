import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './SignIn.scss';

interface SignInProps { }

const SignIn: FC<SignInProps> = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

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
          localStorage.setItem('user', JSON.stringify(userExists));
          setMessage(`ברוך הבא, ${userExists.name}!`);
          setTimeout(() => {
            navigate('/home');
          }, 1500);

        } else {
          setMessage('אינך קיים, נא להירשם.');
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

        <button type="submit" className="btn btn-primary w-100">התחבר</button>
      </form>
      {message && <p className="message text-center mt-3">{message}</p>}
    </div>
  );
};

export default SignIn;