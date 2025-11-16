"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import styles from "./AuthPage.module.css";
import { login } from "@/lib/api/clientApi";

interface LoginRequest {
  email: string;
  password: string;
}

interface ApiError {
  response?: { data?: { error?: string } };
}

export default function LoginForm() {
  const router = useRouter();

  const validationSchema = Yup.object<LoginRequest>({
    email: Yup.string().email("Некоректна пошта").required("Обов’язкове поле"),
    password: Yup.string().required("Обов’язкове поле"),
  });

  const mutation = useMutation<unknown, ApiError, LoginRequest>({
    mutationFn: login,
    onSuccess: () => {
      toast.success("Вхід успішний!");
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error ?? "Помилка входу");
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
