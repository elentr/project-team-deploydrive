'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';
import type { User } from '@/types/user';
import styles from './AuthPage.module.css';

const schema = Yup.object({
  email: Yup.string().email('Некоректна пошта').required('Введіть пошту'),
  password: Yup.string()
    .min(8, 'Мінімум 8 символів')
    .required('Введіть пароль'),
});

export default function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore(s => s.setUser);

  const mutation = useMutation<
    User,
    AxiosError<{ message: string }>,
    { email: string; password: string }
  >({
    mutationFn: login,
    onSuccess: user => {
      setUser(user);
      toast.success(`З поверненням, ${user.name || 'мандрівнику'}! 🌍`);
      router.replace('/');
    },
    onError: error => {
      const msg = error.response?.data?.message || 'Невірна пошта або пароль';
      toast.error(msg);
    },
  });

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        mutation.mutate(values, {
          onSettled: () => setSubmitting(false),
        });
      }}
    >
      {({ isSubmitting, touched, errors, values }) => (
        <Form className={styles.form}>
          <div className={styles.formInfoInput}>
            <label className={styles.label}>Пошта*</label>
            <Field
              name="email"
              type="email"
              className={`${styles.input}
                ${touched.email && errors.email ? styles.inputError : ''}
                ${values.email && !errors.email ? styles.inputFilled : ''}`}
            />
            <ErrorMessage
              name="email"
              component="div"
              className={styles.error}
            />
          </div>

          <div className={styles.formInfoInput}>
            <label className={styles.label}>Пароль*</label>
            <Field
              name="password"
              type="password"
              className={`${styles.input}
                ${touched.password && errors.password ? styles.inputError : ''}
                ${values.password && !errors.password ? styles.inputFilled : ''}`}
            />
            <ErrorMessage
              name="password"
              component="div"
              className={styles.error}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || mutation.isPending}
            className={styles.submitBtn}
          >
            {mutation.isPending ? 'Вхід...' : 'Увійти'}
          </button>
        </Form>
      )}
    </Formik>
  );
}
