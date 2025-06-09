import React, { FC, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './SignIn.scss';
// ללל
interface SignInProps {}

const SignIn: FC<SignInProps> = () => {
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
        } else {
          setMessage('אינך קיים נא להירשם.');
        }
      } catch (error) {
        setMessage('אירעה שגיאה בשרת, נסה שוב מאוחר יותר.');
      }
    },
  });

  return (
    <div className="SignIn">
      <form onSubmit={formik.handleSubmit}>
        <h2>רישום משתמש</h2>

        <div>
          <label>שם:</label>
          <input
            name="name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          {formik.errors.name && <div className="error">{formik.errors.name}</div>}
        </div>

        <div>
          <label>אימייל:</label>
          <input
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.errors.email && <div className="error">{formik.errors.email}</div>}
        </div>

        <div>
          <label>סיסמה:</label>
          <input
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.errors.password && <div className="error">{formik.errors.password}</div>}
        </div>

        <button type="submit">התחבר / הירשם</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default SignIn;
