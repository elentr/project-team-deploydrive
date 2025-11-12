import Image from "next/image";
import styles from "./ConfirmModal.module.css";
import React, { useEffect } from "react";

interface ConfirmModalProps {
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title = "Ви точно хочете вийти?",
  message = "Ми будемо сумувати за вами!",
  confirmButtonText = "Вийти",
  cancelButtonText = "Відмінити",
  onCancel,
  onConfirm,
}) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel?.();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Закриття по кліку на бекдроп
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel?.();
    }
  };

  const handleConfirm = async () => {
    try {
      console.log("Надсилається запит на бекенд...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Запит виконано успішно");
      onConfirm?.(); // виклик колбека після успішної дії
    } catch (error) {
      console.error("Помилка при надсиланні запиту", error);
    }
  };

  const isError = title?.includes("Помилка");

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={isError ? styles.modalError : styles.modalExit}>
        {/* Іконка закриття */}
        <button
          className={styles.closeButton}
          onClick={onCancel}
          aria-label="Закрити"
        >
          <img src="/icons/Vector.svg" alt="Закрити" width={14} height={14} />
        </button>

        {/* Section Title */}
        <div
          className={
            isError ? styles.sectionTitleError : styles.sectionTitleExit
          }
        >
          <h3 className={isError ? styles.headingError : styles.headingExit}>
            {title}
          </h3>
          <p className={isError ? styles.textError : styles.textExit}>
            {message}
          </p>
        </div>

        {/* Кнопки */}
        <div className={styles.form}>
          <button
            onClick={onCancel}
            className={isError ? styles.cancelBtnError : styles.cancelBtnExit}
          >
            <span
              className={`${styles.textButton} ${styles.textButtonCancel} ${styles.textButtonDark}`}
            >
              {cancelButtonText}
            </span>
          </button>
          <button
            onClick={onConfirm}
            className={isError ? styles.confirmBtnError : styles.confirmBtnExit}
          >
            <span
              className={`${styles.textButton} ${
                isError ? styles.textButtonLogin : styles.textButtonExit
              } ${isError ? styles.textButtonDark : styles.textButtonLight}`}
            >
              {confirmButtonText}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
