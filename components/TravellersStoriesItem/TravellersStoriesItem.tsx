"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "../Icon/Icon";
import type { Story } from "@/types/story";
import styles from "./TravellersStoriesItem.module.css";

interface Props {
  story: Story;
  isAuthenticated?: boolean;
}

export default function TravellersStoriesItem({
  story,
  isAuthenticated = false,
}: Props) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(Boolean(story.isSaved));
  const [bookmarksCount, setBookmarksCount] = useState(
    story.bookmarksCount ?? 0
  );
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const formattedDate = (() => {
    if (!story.date) return "";
    const date = new Date(story.date);
    if (Number.isNaN(date.getTime())) {
      return story.date;
    }
    return new Intl.DateTimeFormat("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  })();

  const bookmarkButtonClass = [
    styles.story__save,
    isSaved ? styles.saved : "",
  ]
    .join(" ")
    .trim();

  const handleBookmarkClick = async () => {
    if (isBookmarkLoading) return;

    if (!isAuthenticated) {
      router.push("/auth/register");
      return;
    }

    if (!apiBase) {
      alert("Не налаштовано NEXT_PUBLIC_API_URL.");
      return;
    }

    setIsBookmarkLoading(true);

    try {
      const method = isSaved ? "DELETE" : "POST";
      const response = await fetch(
        `${apiBase}/api/users/saved/${story._id}`,
        {
          method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body:
            method === "POST"
              ? JSON.stringify({ storyId: story._id })
              : undefined,
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth/register");
          return;
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Не вдалося оновити список збережених історій."
        );
      }

      setIsSaved((prev) => !prev);
      setBookmarksCount((prev) => {
        const delta = isSaved ? -1 : 1;
        const nextValue = prev + delta;
        return nextValue < 0 ? 0 : nextValue;
      });
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Сталася помилка. Спробуйте, будь ласка, ще раз."
      );
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  return (
    <article className={styles.story}>
      <Image
        src={story.img}
        alt={story.title}
        width={832}
        height={400}
        sizes="(min-width: 1440px) 33vw, (min-width: 768px) 50vw, 100vw"
        className={styles.story__img}
        priority={false}
      />

      <div className={styles.story__content}>
        <p className={styles.story__category}>{story.category}</p>

        <h3 className={styles.story__title}>{story.title}</h3>

        <div className={styles.meta}>
          <span className={styles.story__meta}>{formattedDate}</span>
          <span className={styles.favoriteCount}>{story.readTime} хв читати</span>
        </div>

        <p className={styles.story__text}>{story.description}</p>

        <div className={styles.story__author}>
          <Image
            src={story.avatar || "/images/avatar.svg"}
            alt={story.author}
            width={48}
            height={48}
            className={styles.story__avatar}
          />

          <div>
            <p className={styles.story__name}>{story.author}</p>
            <span className={styles.story__meta}>
              {bookmarksCount} збережень
            </span>
          </div>
        </div>

        <div className={styles.story__actions}>
          <Link href={`/stories/${story._id}`} className={styles.story__btn}>
            Переглянути статтю
          </Link>

          <button
            type="button"
            className={bookmarkButtonClass}
            onClick={handleBookmarkClick}
            disabled={isBookmarkLoading}
            aria-pressed={isSaved}
          >
            {isBookmarkLoading ? (
              <span className={styles.bookmarkLoader} aria-hidden="true" />
            ) : (
              <Icon
                name={isSaved ? "icon-bookmark-filled" : "icon-bookmark"}
                width={24}
                height={24}
                className={styles.icon__bookmark}
              />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
