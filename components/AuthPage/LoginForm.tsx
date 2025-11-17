"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { login as loginApi } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import styles from "./AuthPage.module.css";
import { useAuthStore } from "@/lib/store/authStore";

interface LoginRequest {
  email: string;
  password: string;
}

type ApiErrorShape = {
  message?: string;
  error?: string;
  data?: { message?: string };
};

export default function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const validationSchema = Yup.object<LoginRequest>({
    email: Yup.string().email("Некоректна пошта").required("Обов’язкове поле"),
    password: Yup.string().required("Обов’язкове поле"),
  });

  const mutation = useMutation<any, AxiosError<ApiErrorShape>, LoginRequest>({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setUser(data);
      toast.success("Логін успішний!");
      router.push("/");
    },
    onError: (error) => {
      const data = error.response?.data;
      const msg =
        data?.message || data?.error || data?.data?.message || "Помилка логіна";
      toast.error(msg);
    },
  });

  const handleSubmit = (
    values: LoginRequest,
    { setSubmitting }: FormikHelpers<LoginRequest>
  ) => {
    mutation.mutate(values, {
      onSettled: () => setSubmitting(false),
    });
  };

  return (
    <Formik<LoginRequest>
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, values }) => (
        <Form className={styles.form}>
          <div className={styles.formInfoInput}>
            <label className={styles.label}>Пошта*</label>
            <Field
              name="email"
              type="email"
              className={`${styles.input}
                ${touched.email && errors.email ? styles.inputError : ""}
                ${values.email ? styles.inputFilled : ""}`}
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
                ${touched.password && errors.password ? styles.inputError : ""}
                ${values.password ? styles.inputFilled : ""}`}
            />
            <ErrorMessage
              name="password"
              component="div"
              className={styles.error}
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Перевірка даних..." : "Увійти"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
