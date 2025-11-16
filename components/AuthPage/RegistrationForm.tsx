"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import styles from "./AuthPage.module.css";

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface ApiError {
  response?: { data?: { error?: string } };
}

export default function RegistrationForm() {
  const router = useRouter();

  const validationSchema = Yup.object<RegisterRequest>({
    name: Yup.string().required("Обов’язкове поле"),
    email: Yup.string().email("Некоректна пошта").required("Обов’язкове поле"),
    password: Yup.string().min(6).required("Обов’язкове поле"),
  });

  const mutation = useMutation<unknown, ApiError, RegisterRequest>({
    mutationFn: register,
    onSuccess: () => {
      toast.success("Реєстрація успішна!");
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error ?? "Помилка реєстрації");
    },
  });

  const handleSubmit = (
    values: RegisterRequest,
    { setSubmitting }: FormikHelpers<RegisterRequest>
  ) => {
    mutation.mutate(values, {
      onSettled: () => setSubmitting(false),
    });
  };

  return (
    <Formik<RegisterRequest>
      initialValues={{ name: "", email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, values }) => (
        <Form className={styles.form}>
          <div className={styles.formInfoInput}>
            <label className={styles.label}>Ім’я та Прізвище*</label>
            <Field
              name="name"
              className={`${styles.input}
                ${touched.name && errors.name ? styles.inputError : ""}
                ${values.name ? styles.inputFilled : ""}`}
            />
            <ErrorMessage
              name="name"
              component="div"
              className={styles.error}
            />
          </div>

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
            {mutation.isPending ? "Реєстрація..." : "Зареєструватись"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
