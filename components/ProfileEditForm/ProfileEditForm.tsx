//components / ProfileEditForm / ProfileEditForm.tsx;

'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { updateUserProfile, sendVerifyEmail } from '@/lib/api/clientApi';
import toast from 'react-hot-toast';

export default function ProfileEditForm() {
  const user = useAuthStore(s => s.user);
  const setUser = useAuthStore(s => s.setUser);

  const [form, setForm] = useState({
    name: user?.name || '',
    description: user?.description || '',
    email: user?.email || '',
    avatarUrl: user?.avatarUrl || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('email', form.email);
    fd.append('avatarUrl', form.avatarUrl);

    try {
      const updated = await updateUserProfile(fd);

      setUser(updated);
      toast.success('Профіль оновлено!');

      if (user?.email !== form.email) {
        await sendVerifyEmail(form.email);
        toast.success('На нову пошту надіслано лист для підтвердження');
      }
    } catch (err) {
      console.log(err);
      toast.error('Помилка при оновленні профілю');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Редагувати профіль</h2>

      <label>
        Ім’я:
        <input name="name" value={form.name} onChange={handleChange} />
      </label>

      <label>
        Опис:
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </label>

      <label>
        Електронна пошта:
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
      </label>

      <label>
        Аватар (URL):
        <input
          name="avatarUrl"
          value={form.avatarUrl}
          onChange={handleChange}
        />
      </label>

      <button type="submit">Зберегти</button>
    </form>
  );
}
