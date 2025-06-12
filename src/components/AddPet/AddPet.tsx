import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { setMessage } from '../../redux/messageSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './AddPet.scss';

const validationSchema = Yup.object({
  name: Yup.string().required('שדה חובה'),
  type: Yup.string().required('שדה חובה'),
  gender: Yup.string().required('שדה חובה'),
  age: Yup.number().min(0, 'גיל לא תקין').required('שדה חובה'),
  status: Yup.string().required('שדה חובה'),
  imageLink: Yup.string().url('כתובת URL לא תקינה').when('imageFile', {
    is: (imageFile: string) => !imageFile,
    then: (schema) => schema.required('חובה לספק קישור לתמונה או להעלות קובץ'),
  }),
  imageFile: Yup.string(),
  price: Yup.number().when('status', {
    is: 'למכירה',
    then: (schema) => schema.min(0, 'מחיר לא תקין').required('מחיר חובה עבור חיה למכירה'),
  }),
});

const AddPet: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.status !== 'admin') {
      dispatch(setMessage({ type: 'error', text: 'רק מנהלים יכולים להוסיף חיות' }));
      navigate('/home');
    }
  }, [user, navigate, dispatch]);

  const formik = useFormik({
    initialValues: {
      name: '',
      type: '',
      gender: '',
      age: 0,
      status: '',
      imageLink: '',
      imageFile: '',
      price: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const finalImage = values.imageFile || values.imageLink;
        const newPet = {
          name: values.name,
          type: values.type,
          gender: values.gender,
          age: values.age,
          status: values.status,
          image: finalImage,
          ...(values.status === 'למכירה' && { price: values.price }),
        };

        const res = await fetch('http://localhost:3001/pets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPet),
        });

        if (res.ok) {
          dispatch(setMessage({ type: 'success', text: `החיה ${values.name} נוספה בהצלחה!` }));
          navigate('/home');
        } else {
          dispatch(setMessage({ type: 'error', text: 'שגיאה בהוספת החיה' }));
        }
      } catch (error) {
        dispatch(setMessage({ type: 'error', text: 'שגיאה בהוספת החיה, נסה שוב מאוחר יותר' }));
      }
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        formik.setFieldValue('imageFile', reader.result as string);
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="add-pet-container">
      <h2>הוסף חיה חדשה</h2>
      <form onSubmit={formik.handleSubmit} className="add-pet-form">
        <div className="form-group">
          <label>שם:</label>
          <input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            className="form-control"
            required
          />
          {formik.errors.name && <div className="text-danger">{formik.errors.name}</div>}
        </div>

        <div className="form-group">
          <label>סוג:</label>
          <input
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            className="form-control"
            required
          />
          {formik.errors.type && <div className="text-danger">{formik.errors.type}</div>}
        </div>

        <div className="form-group">
          <label>מין:</label>
          <select
            name="gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
            className="form-control"
            required
          >
            <option value="">בחר מין</option>
            <option value="זכר">זכר</option>
            <option value="נקבה">נקבה</option>
          </select>
          {formik.errors.gender && <div className="text-danger">{formik.errors.gender}</div>}
        </div>

        <div className="form-group">
          <label>גיל:</label>
          <input
            name="age"
            type="number"
            value={formik.values.age}
            onChange={formik.handleChange}
            className="form-control"
            required
          />
          {formik.errors.age && <div className="text-danger">{formik.errors.age}</div>}
        </div>

        <div className="form-group">
          <label>סטטוס:</label>
          <select
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            className="form-control"
            required
          >
            <option value="">בחר סטטוס</option>
            <option value="למכירה">למכירה</option>
            <option value="למסירה">למסירה</option>
          </select>
          {formik.errors.status && <div className="text-danger">{formik.errors.status}</div>}
        </div>

        {formik.values.status === 'למכירה' && (
          <div className="form-group">
            <label>מחיר:</label>
            <input
              name="price"
              type="number"
              value={formik.values.price}
              onChange={formik.handleChange}
              className="form-control"
              required
            />
            {formik.errors.price && <div className="text-danger">{formik.errors.price}</div>}
          </div>
        )}

        <div className="form-group">
          <label>קישור לתמונה:</label>
          <input
            name="imageLink"
            value={formik.values.imageLink}
            onChange={formik.handleChange}
            className="form-control"
          />
          {formik.errors.imageLink && <div className="text-danger">{formik.errors.imageLink}</div>}
        </div>

        <div className="form-group">
          <label>העלאת תמונה:</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="form-control" />
          {formik.errors.imageFile && <div className="text-danger">{formik.errors.imageFile}</div>}
        </div>

        {imagePreview && (
          <img src={imagePreview} alt="preview" style={{ maxWidth: '200px', marginTop: '10px' }} />
        )}

        <button type="submit" className="btn btn-primary">
          הוסף חיה
        </button>
      </form>
    </div>
  );
};

export default AddPet;