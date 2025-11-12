"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const handleLogin = () => {
    alert("Вхід виконано!");
    setIsErrorOpen(false);
  };

  const handleRegister = () => {
    alert("Реєстрація виконана!");
    setIsErrorOpen(false);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <button onClick={() => setOpen(true)}>Вийти</button>
        <button onClick={() => setIsErrorOpen(true)}>Помилка збереження</button>

        {open && (
          <ConfirmModal
            title="Ви точно хочете вийти?"
            message="Ми будемо сумувати за вами!"
            confirmButtonText="Вийти"
            cancelButtonText="Відмінити"
            onCancel={() => setOpen(false)}
            onConfirm={() => {
              alert("Вихід підтверджено!");
              setOpen(false);
            }}
          />
        )}

        {isErrorOpen && (
          <ConfirmModal
            title="Помилка під час збереження"
            message="Щоб зберегти статтю вам треба увійти, якщо ще немає облікового запису зареєструйтесь"
            confirmButtonText="Зареєструватись"
            cancelButtonText="Увійти"
            onConfirm={handleRegister}
            onCancel={() => setIsErrorOpen(false)}
          />
        )}
      </main>
    </div>
  );
}
