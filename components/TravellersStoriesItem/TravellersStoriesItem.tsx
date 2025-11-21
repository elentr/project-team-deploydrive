'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import styles from './TravellersStoriesItem.module.css';
import { Story } from '@/types/story';
import { Traveller } from '@/types/traveller';
import { useAuthStore } from '@/lib/store/authStore';
import {
  favouriteAdd,
  favouriteRemove,
  updateStoryLikes,
} from '@/lib/api/clientApi';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import Loader from '../Loader/Loader';

interface Props {
  story: Story;
  travellersMap?: Map<string, Traveller>;
}

const categories = [
  { _id: '68fb50c80ae91338641121f0', name: 'Азія' },
  { _id: '68fb50c80ae91338641121f1', name: 'Гори' },
  { _id: '68fb50c80ae91338641121f2', name: 'Європа' },
  { _id: '68fb50c80ae91338641121f3', name: 'Америка' },
  { _id: '68fb50c80ae91338641121f4', name: 'Африка' },
  { _id: '68fb50c80ae91338641121f6', name: 'Пустелі' },
  { _id: '68fb50c80ae91338641121f7', name: 'Балкани' },
  { _id: '68fb50c80ae91338641121f8', name: 'Кавказ' },
  { _id: '68fb50c80ae91338641121f9', name: 'Океанія' },
];

const fetchUserById = async (id: string): Promise<Traveller> => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`
  );
  return data.data.user;
};

export default function TravellersStoriesItem({ story, travellersMap }: Props) {
  const router = useRouter();
  const { user, isAuthenticated, setUser } = useAuthStore();

  const authorFromMap = travellersMap?.get(story.ownerId);

  const { data: authorFromApi } = useQuery({
    queryKey: ['user', story.ownerId],
    queryFn: () => fetchUserById(story.ownerId),
    enabled: !authorFromMap && !!story.ownerId,
    staleTime: 1000 * 60 * 10,
  });

  const author = authorFromMap || authorFromApi;

  const isOwner = user?._id === story.ownerId;
  const isSaved = user?.savedStories?.includes(story._id) ?? false;

  const [likes, setLikes] = useState(story.favoriteCount ?? 0);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const categoryName =
    categories.find(c => c._id === story.category)?.name || 'Категорія';

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
    onError: error => console.error(error),
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
    onError: error => console.error(error),
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
      const date = new Date(d);
      if (isNaN(date.getTime())) return d;
      return new Intl.DateTimeFormat('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
    } catch {
      return d;
    }
  };

  const authorName = author?.name || story.author || 'Невідомий автор';
  const authorAvatar =
    author?.avatarUrl || story.avatar || '/images/avatar.webp.webp';

  const isLoading = addFavMutation.isPending || removeFavMutation.isPending;

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={story.img || '/images/placeholder.jpg'}
          alt={story.title || 'Історія'}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className={styles.info}>
        <span className={styles.category}>{categoryName}</span>

        <h3 className={styles.title}>{story.title}</h3>

        <p className={styles.description}>
          {story.article.length > 90
            ? story.article.slice(0, 90) + '...'
            : story.article}
        </p>

        <div className={styles.authorBox}>
          <Image
            src={authorAvatar}
            alt={authorName}
            width={48}
            height={48}
            className={styles.avatar}
          />
          <div>
            <span className={styles.name}>{authorName}</span>
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
            disabled={!isOwner && isLoading}
            title={isOwner ? 'Редагувати' : isSaved ? 'Видалити' : 'Зберегти'}
          >
            <svg width="24" height="24" className={styles.bookmark}>
              <use
                href={
                  isOwner ? '/icons.svg#icon-edit' : '/icons.svg#icon-bookmark'
                }
              />
            </svg>
            {!isOwner && isLoading && (
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
