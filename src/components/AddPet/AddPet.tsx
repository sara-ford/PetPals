import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddPet.scss';

const AddPet = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    type: '',
    gender: '',
    age: '',
    status: '',
    imageLink: '',
    imageFile: '', // base64
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.status !== 'admin') {
      navigate('/home');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, imageFile: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const finalImage = form.imageFile || form.imageLink;

  try {
    // שליפת כל החיות הקיימות כדי לחשב ID הבא
    const res = await fetch('http://localhost:3001/pets');
    const pets = await res.json();

    // מציאת ה-id הגבוה ביותר
    const maxId = pets.reduce((max: number, pet: any) => {
      const idNum = parseInt(pet.id, 10);
      return idNum > max ? idNum : max;
    }, 0);
    const nextId = (maxId + 1).toString();

    // הכנת גוף הבקשה
    const newPet: any = {
      id: nextId,
      name: form.name,
      type: form.type,
      gender: form.gender,
      age: parseInt(form.age),
      status: form.status,
      image: finalImage
    };

    // אם הסטטוס הוא "למכירה", דרוש גם מחיר — נבקש אותו או נגדיר ברירת מחדל
    if (form.status === 'למכירה') {
      const price = prompt('הזן מחיר לחיה:');
      newPet.price = parseInt(price || '0');
    }

    // שליחת הבקשה
    await fetch('http://localhost:3001/pets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPet),
    });

    navigate('/home');
  } catch (err) {
    console.error('שגיאה בהוספת חיה:', err);
  }


  };

  return (
    <div className="add-pet-container">
      <h2>הוסף חיה חדשה</h2>
      <form onSubmit={handleSubmit} className="add-pet-form">
        <input type="text" name="name" placeholder="שם" value={form.name} onChange={handleChange} required />
        <input type="text" name="type" placeholder="סוג" value={form.type} onChange={handleChange} required />
        <select name="gender" value={form.gender} onChange={handleChange} required>
          <option value="">בחר מין</option>
          <option value="זכר">זכר</option>
          <option value="נקבה">נקבה</option>
        </select>
        <input type="number" name="age" placeholder="גיל" value={form.age} onChange={handleChange} required />

        <select name="status" value={form.status} onChange={handleChange} required>
          <option value="">בחר סטטוס</option>
          <option value="למכירה">למכירה</option>
          <option value="למסירה">למסירה</option>
        </select>

        <label>קישור לתמונה (אם לא מעלים מהמחשב):</label>
        <input type="text" name="imageLink" placeholder="קישור לתמונה" value={form.imageLink} onChange={handleChange} />

        <label>או העלאת תמונה מהמחשב:</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {form.imageFile && <img src={form.imageFile} alt="preview" style={{ maxWidth: '200px', marginTop: '10px' }} />}
        {!form.imageFile && form.imageLink && <img src={form.imageLink} alt="preview" style={{ maxWidth: '200px', marginTop: '10px' }} />}

        <button type="submit">הוסף חיה</button>
      </form>
    </div>
  );
};

export default AddPet;
