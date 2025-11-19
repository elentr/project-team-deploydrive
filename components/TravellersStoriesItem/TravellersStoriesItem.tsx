'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './TravellersStoriesItem.module.css';
import { Story } from '@/types/story';
import { Traveller } from '@/types/traveller';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import {
  favouriteAdd,
  favouriteRemove,
  updateStoryLikes,
} from '@/lib/api/clientApi';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import Loader from '../Loader/Loader';

interface Props {
  story: Story;
  travellersMap: Map<string, Traveller>;
}

export default function TravellersStoriesItem({ story, travellersMap }: Props) {
  const author = travellersMap.get(story.ownerId);
  const { user, isAuthenticated, setUser } = useAuthStore();
  const router = useRouter();

  const isOwner = user?._id === story.ownerId;

  const isSaved = user?.savedStories?.includes(story._id) ?? false;
  const [likes, setLikes] = useState(story.favoriteCount ?? 0);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const addFavMutation = useMutation({
    mutationFn: async () =>
      Promise.all([
        favouriteAdd(story._id),
        updateStoryLikes(story._id, String(likes + 1)),
      ]),
    onSuccess: ([_, updated]) => {
      if (!user) return;
      const currentSaved = user.savedStories || [];

      setUser({ ...user, savedStories: [...currentSaved, story._id] });
      setLikes(updated?.data?.favoriteCount ?? likes + 1);
    },
    onError: (error: AxiosError<{ error: string }>) => {
      console.error('Error adding favorite:', error.response?.data?.error);
    },
  });

  const removeFavMutation = useMutation({
    mutationFn: async () =>
      Promise.all([
        favouriteRemove(story._id),
        updateStoryLikes(story._id, String(likes - 1)),
      ]),
    onSuccess: ([_, updated]) => {
      if (!user) return;
      const currentSaved = user.savedStories || [];

      setUser({
        ...user,
        savedStories: currentSaved.filter(id => id !== story._id),
      });
      setLikes(updated?.data?.favoriteCount ?? likes - 1);
    },
    onError: (error: AxiosError<{ error: string }>) => {
      console.error('Error removing favorite:', error.response?.data?.error);
    },
  });

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isOwner) {
      router.push(`/stories/edit/${story._id}`);
      return;
    }
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    if (addFavMutation.isPending || removeFavMutation.isPending) return;
    isSaved ? removeFavMutation.mutate() : addFavMutation.mutate();
  };

  const handleLogin = () => {
    router.push('/auth/login');
    closeLoginModal();
  };

  const handleRegister = () => {
    router.push('/auth/register');
    closeLoginModal();
  };

  const formatDate = (d: string) => {
    if (!d) return '';
    try {
      const [y, m, day] = d.split('T')[0].split('-');
      return `${day}.${m}.${y}`;
    } catch {
      return d;
    }
  };

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={story.img || '/images/placeholder.jpg'}
          alt={story.title}
          fill
          className={styles.image}
        />
      </div>

      <div className={styles.info}>
        <span className={styles.category}>{story.category}</span>

        <h3 className={styles.title}>{story.title}</h3>

        <p className={styles.description}>
          {story.article.length > 90
            ? story.article.slice(0, 90) + '...'
            : story.article}
        </p>

        {author && (
          <div className={styles.authorBox}>
            <Image
              src={author.avatarUrl || '/images/avatar.png'}
              alt={author.name}
              width={48}
              height={48}
              className={styles.avatar}
            />
            <div>
              <span className={styles.name}>{author.name}</span>
              <div className={styles.autorWrapp}>
                <span className={styles.date}>{formatDate(story.date)}</span>
                <span className={styles.dot}>&#183;</span>
                <span className={styles.save}>{likes}</span>
                <svg width="24" height="24" className={styles.bookmarkLittle}>
                  <use href="/icons.svg#icon-bookmark" />
                </svg>
              </div>
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <Link href={`/stories/${story._id}`} className={styles.button}>
            Переглянути статтю
          </Link>

          <button
            onClick={handleSave}
            className={`${styles.bookmarkBtn} ${
              isSaved && !isOwner ? styles.favorButtonPush : ''
            }`}
            type="button"
            disabled={addFavMutation.isPending || removeFavMutation.isPending}
          >
            <svg width="24" height="24" className={styles.bookmark}>
              <use
                href={
                  isOwner ? '/icons.svg#icon-edit' : '/icons.svg#icon-bookmark'
                }
              />
            </svg>
            {(addFavMutation.isPending || removeFavMutation.isPending) && (
              <div className={styles.loaderWrapper}>
                <Loader />
              </div>
            )}
          </button>
        </div>
      </div>

      {isLoginModalOpen && (
        <ConfirmModal
          title="Помилка під час збереження"
          message="Щоб зберегти статтю вам треба увійти. Якщо ще немає облікового запису — зареєструйтесь."
          confirmButtonText="Зареєструватись"
          cancelButtonText="Увійти"
          onConfirm={handleRegister}
          onCancel={handleLogin}
        />
      )}
    </article>
  );
}
