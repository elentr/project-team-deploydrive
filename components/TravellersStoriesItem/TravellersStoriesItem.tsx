"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    styles.bookmarkButton,
    isSaved ? styles.bookmarkButtonActive : "",
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
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={story.img}
          alt={story.title}
          fill
          sizes="(min-width: 768px) 400px, 100vw"
          className={styles.image}
        />
        <span className={styles.categoryBadge}>{story.category}</span>
      </div>

      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.metaItem}>{formattedDate}</span>
          <span className={styles.dot} />
          <span className={styles.metaItem}>{story.readTime} хв</span>
        </div>

        <h3 className={styles.title}>{story.title}</h3>

        <p className={styles.description}>{story.description}</p>
      </div>

      <div className={styles.authorBox}>
        <Image
          src={story.avatar || "/images/avatar.svg"}
          alt={story.author}
          width={40}
          height={40}
          sizes="40px"
          className={styles.avatar}
        />
        <div>
          <p className={styles.authorName}>{story.author}</p>
          <p className={styles.authorRole}>Автор статті</p>
        </div>
      </div>

      <div className={styles.footer}>
        <Link href={`/stories/${story._id}`} className={styles.primaryButton}>
          Переглянути статтю
        </Link>

        <div className={styles.bookmarkWrapper}>
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
              <Image
                src={
                  isSaved ? "/icons/bookmark-filled.svg" : "/icons/bookmark.svg"
                }
                alt="Додати в збережені"
                width={24}
                height={24}
                className={styles.bookmarkIcon}
              />
            )}
          </button>
          <span className={styles.bookmarkCount}>{bookmarksCount}</span>
        </div>
      </div>
    </article>
  );
}
