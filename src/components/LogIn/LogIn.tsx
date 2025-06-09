import React, { FC } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './LogIn.scss';

interface LogInProps {}

const LogIn: FC<LogInProps> = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('אימייל לא תקין').required('שדה חובה'),
      password: Yup.string().min(6, 'לפחות 6 תווים').required('שדה חובה'),
    }),
    onSubmit: (values) => {
      alert(`מתחבר עם:\n${JSON.stringify(values, null, 2)}`);
    },
  });

  return (
    <div className="Login">
      <form onSubmit={formik.handleSubmit}>
        <h2>התחברות</h2>

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

        <button type="submit">התחבר</button>
      </form>
    </div>
  );
};

export default LogIn;
