"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import css from "./AddStoryForm.module.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createStory, fetchCategories } from "@/lib/api/api";
import type { Category, CreateStoryResponse } from "@/types/story";
import { useStoryDraft, initialDraft } from "@/lib/store/storyStore";
import { Modal } from "@/components/CreateStoryErrorModal/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loader from "../Loader/Loader";

interface InitialData {
  id: string;
  title: string;
  categoryId: string;
  shortDescription: string;
  body: string;
  imageUrl: string;
}

interface StoryFormProps {
  onSuccess: (id?: string) => void;
  onCancel: () => void;
  initialData?: InitialData;
}

export default function StoryForm({
  onSuccess,
  onCancel,
  initialData,
}: StoryFormProps) {
  const qc = useQueryClient();
  const { draft, setDraft, clearDraft } = useStoryDraft();
  const [errorOpen, setErrorOpen] = useState(false);
  const isEditMode = !!initialData;

  const validationSchema = Yup.object({
    storyImage: isEditMode
      ? Yup.mixed()
          .test(
            "fileType",
            "Файл має бути у форматі JPEG, PNG або WEBP",
            (value) => {
              if (!value) return true;
              const file = value as File;
              return ["image/jpeg", "image/png", "image/webp"].includes(
                file.type
              );
            }
          )
          .test("fileSize", "Файл завеликий — максимум 2MB", (value) => {
            if (!value) return true;
            const file = value as File;
            return file.size <= 2 * 1024 * 1024;
          })
      : Yup.mixed()
          .required("Додайте фото до історії")
          .test(
            "fileType",
            "Файл має бути у форматі JPEG, PNG або WEBP",
            (value) => {
              if (!value) return false;
              const file = value as File;
              return ["image/jpeg", "image/png", "image/webp"].includes(
                file.type
              );
            }
          )
          .test("fileSize", "Файл завеликий — максимум 2MB", (value) => {
            if (!value) return false;
            const file = value as File;
            return file.size <= 2 * 1024 * 1024;
          }),

    title: Yup.string()
      .trim()
      .max(80, "Максимум 80 символів")
      .required("Вкажіть заголовок"),

    body: Yup.string()
      .trim()
      .max(2500, "Опис занадто великий — максимум 2500 символів")
      .required("Додайте опис історії"),

    categoryId: Yup.string().required("Оберіть категорію"),
  });
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);

  const autoResize = () => {
    const el = bodyRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    autoResize();
  }, []);

  const { data: categories, isLoading: isCategoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: (fd: FormData) => createStory(fd),
    onSuccess: (data: CreateStoryResponse) => {
      qc.invalidateQueries({ queryKey: ["myStories"] });
      clearDraft();
      onSuccess(data.id);
    },
    onError: () => setErrorOpen(true),
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formik = useFormik({
    initialValues: {
      storyImage: initialData ? null : (draft.storyImage ?? null),
      title: initialData?.title ?? draft.title ?? initialDraft.title,
      categoryId:
        initialData?.categoryId ?? draft.categoryId ?? initialDraft.categoryId,
      shortDescription:
        initialData?.shortDescription ?? draft.shortDescription ?? "",
      body: initialData?.body ?? draft.body ?? initialDraft.body,
    },
    enableReinitialize: false,
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      const fd = new FormData();

      if (values.storyImage) fd.append("storyImage", values.storyImage);
      fd.append("title", values.title.trim());
      fd.append("category", values.categoryId);
      fd.append("article", values.body.trim());

      if (isEditMode && initialData?.id) {
        fd.append("id", initialData.id);
      }

      mutation.mutate(fd);
    },
  });

  const previewUrl = useMemo(() => {
    if (formik.values.storyImage) {
      return URL.createObjectURL(formik.values.storyImage);
    }

    if (isEditMode && initialData?.imageUrl) {
      return initialData.imageUrl;
    }
    return null;
  }, [formik.values.storyImage, isEditMode, initialData]);

  useEffect(() => {
    if (!previewUrl || formik.values.storyImage) return;
    return () => {
      if (typeof previewUrl === "string" && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, formik.values.storyImage]);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const isSaveDisabled = !formik.isValid || !formik.dirty || mutation.isPending;

  function updateDraft(update: Partial<typeof draft>) {
    setTimeout(() => {
      setDraft(update);
    }, 0);
  }
  const shortDescLength = formik.values.shortDescription?.length ?? 0;
  return (
    <form className={css.form} onSubmit={formik.handleSubmit}>
      {/* Обкладинка */}
      <div className={css.formGroup}>
        <label className={css.label}>Обкладинка статті</label>

        <div className={css.coverRow}>
          <div className={css.coverPreview}>
            {previewUrl ? (
              <img src={previewUrl} alt="Превʼю" className={css.coverImg} />
            ) : (
              <img
                src="/images/avatar.webp.webp"
                alt="Дефолтне фото"
                className={css.coverImg}
              />
            )}
          </div>

          <button
            type="button"
            className={css.uploadBtn}
            onClick={() => fileInputRef.current?.click()}
          >
            Завантажити фото
          </button>

          <input
            ref={fileInputRef}
            id="storyImage"
            name="storyImage"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className={css.fileHidden}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              formik.setFieldValue("storyImage", file);
              if (!isEditMode) {
                updateDraft({ storyImage: file });
              }
            }}
            onBlur={formik.handleBlur}
          />
        </div>

        {formik.touched.storyImage && formik.errors.storyImage && (
          <span className={css.error}>
            {formik.errors.storyImage as string}
          </span>
        )}
      </div>

      {/* Заголовок */}
      <div className={css.formGroup}>
        <label htmlFor="title" className={css.label}>
          Заголовок
        </label>
        <input
          id="title"
          name="title"
          className={css.input}
          placeholder="Введіть заголовок"
          value={formik.values.title}
          onChange={(e) => {
            formik.handleChange(e);
            if (!isEditMode) {
              updateDraft({ title: e.target.value });
            }
          }}
          onBlur={formik.handleBlur}
          required
        />
        {formik.touched.title && formik.errors.title && (
          <span className={css.error}>{formik.errors.title}</span>
        )}
      </div>

      {/* Категорії */}
      <div className={css.formGroup}>
        <label htmlFor="categoryId" className={css.label}>
          Категорія
        </label>

        <select
          id="categoryId"
          name="categoryId"
          className={css.select}
          disabled={isCategoriesLoading}
          value={formik.values.categoryId}
          onChange={(e) => {
            formik.handleChange(e);
            if (!isEditMode) {
              updateDraft({ categoryId: e.target.value });
            }
          }}
          onBlur={formik.handleBlur}
        >
          <option value="" disabled>
            {isCategoriesLoading ? "Завантаження..." : "Категорія"}
          </option>
          {Array.isArray(categories) &&
            categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>

        {formik.touched.categoryId && formik.errors.categoryId && (
          <span className={css.error}>{formik.errors.categoryId}</span>
        )}
      </div>

      {/* Короткий опис */}
      <div className={css.formGroup}>
        <label htmlFor="shortDescription" className={css.label}>
          Короткий опис
        </label>
        <input
          id="shortDescription"
          name="shortDescription"
          className={css.input}
          placeholder="Введіть короткий опис"
          value={formik.values.shortDescription}
          onChange={(e) => {
            formik.handleChange(e);
            if (!isEditMode) {
              updateDraft({ shortDescription: e.target.value });
            }
          }}
          onBlur={formik.handleBlur}
          maxLength={61}
          required
        />

        <div className={css.hintRow}>
          {formik.touched.shortDescription && formik.errors.shortDescription ? (
            <span className={css.error}>{formik.errors.shortDescription}</span>
          ) : (
            <span className={css.hint}>Лишилося символів: </span>
          )}

          {hydrated && (
            <span className={css.counter}>{61 - shortDescLength}</span>
          )}
        </div>
      </div>

      {/* Історія */}
      <div className={css.formGroup}>
        <label htmlFor="body" className={css.label}>
          Текст історії
        </label>
        <textarea
          ref={bodyRef}
          id="body"
          name="body"
          className={css.textarea}
          placeholder="Ваша історія тут"
          value={formik.values.body}
          rows={1}
          onChange={(e) => {
            formik.handleChange(e);
            if (!isEditMode) {
              updateDraft({ body: e.target.value });
            }
            autoResize();
          }}
          onBlur={formik.handleBlur}
        />
        {formik.touched.body && formik.errors.body && (
          <span className={css.error}>{formik.errors.body}</span>
        )}
      </div>

      {/* Дії */}
      <div className={css.actionsWrap}>
        {mutation.isPending ? (
          <Loader />
        ) : (
          <button
            type="submit"
            className={css.submitBtn}
            disabled={isSaveDisabled}
          >
            Зберегти
          </button>
        )}

        <button type="button" className={css.cancelBtn} onClick={onCancel}>
          Відмінити
        </button>
      </div>

      <Modal
        open={errorOpen}
        title="Помилка збереження"
        description="Спробуйте ще раз пізніше."
        onClose={() => setErrorOpen(false)}
      />
    </form>
  );
}
