'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Story } from '@/types/story';
import css from './TravellersStoriesItem.module.css';
import Icon from '../Icon/Icon';
import Link from 'next/link';
import { Modal } from '../CreateStoryErrorModal/Modal';

interface TravellersStoriesItemProps {
  story: Story;
  isAuthenticated: boolean;
  isMyStory?: boolean;
  onRemoveSavedStory?: (id: string) => void; // ⬅ додаємо!
}

export default function TravellersStoriesItem({
  story,
  isAuthenticated,
  onRemoveSavedStory,
  isMyStory,
}: TravellersStoriesItemProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSaved, setIsSaved] = useState<boolean>(story.isSaved ?? false);
  const [favoriteCount, setFavoriteCount] = useState<number>(
    story.bookmarksCount ?? 0
  );
  const [loading, setLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    setIsSaved(story.isSaved ?? false);
  }, [story.isSaved]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    if (loading) return;

    const prevSaved = isSaved;
    const prevCount = favoriteCount;
    const nextSaved = !prevSaved;

    // оптимістичне оновлення UI в самій картці
    setIsSaved(nextSaved);
    setFavoriteCount(prevCount + (nextSaved ? 1 : -1));

    // видалення картки зі сторінки, якщо "unfavorite"
    if (!nextSaved && onRemoveSavedStory) {
      onRemoveSavedStory(story._id);
    }
    setLoading(true);

    const prevSavedMe = queryClient.getQueryData<Story[]>(['savedStoriesMe']);

    try {
      const API = process.env.NEXT_PUBLIC_API_URL;
      if (!API) {
        throw new Error('API URL не налаштовано');
      }

      const method = nextSaved ? 'POST' : 'DELETE';
      const response = await fetch(
        `${API}/api/users/saved/${story._id}`,
        {
          method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: method === 'POST' ? JSON.stringify({ storyId: story._id }) : undefined,
        }
      );

      if (!response.ok) {
        throw new Error('Не вдалося оновити збережені історії');
      }

      if (nextSaved) {
        // пушимо цю історію в кеш savedStoriesMe
        queryClient.setQueryData<Story[] | undefined>(
          ['savedStoriesMe'],
          prev => {
            if (!prev) return [story];
            if (prev.some(prevOne => prevOne._id === story._id)) return prev;
            return [...prev, story];
          }
        );
      } else {
        // прибираємо історію з кешу savedStoriesMe
        queryClient.setQueryData<Story[] | undefined>(
          ['savedStoriesMe'],
          prev =>
            prev ? prev.filter(prevOne => prevOne._id !== story._id) : prev
        );
        // видалити картку зі сторінки
        if (onRemoveSavedStory) {
          onRemoveSavedStory(story._id);
        }
      }
      queryClient.invalidateQueries({ queryKey: ['savedStoriesByUser'] });
      queryClient.invalidateQueries({ queryKey: ['savedStoriesMe'] });
    } catch (error) {
      console.error(error);

      // відкат UI якщо зламається
      setIsSaved(prevSaved);
      setFavoriteCount(prevCount);

      // відкат кешу savedStoriesMe якщо зламається
      queryClient.setQueryData(['savedStoriesMe'], prevSavedMe);

      toast.error('Не вдалося оновити збережені історії');
    } finally {
      setLoading(false);
    }
  };

  function formatDate(dateString: string) {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  }
  const categoryName = story.category ?? 'Без категорії';
  return (
    <>
      <li className={css.story}>
        <Image
          src={story.img}
          alt={story.title}
          width={400}
          height={200}
          className={css.story__img}
          unoptimized={story.img?.startsWith('http')}
          onError={(e) => {
            const fallbackSrc = '/images/avatar.svg';
            if (e.currentTarget.src !== fallbackSrc && !e.currentTarget.src.endsWith(fallbackSrc)) {
              e.currentTarget.src = fallbackSrc;
            }
          }}
        />

        <div className={css.story__content}>
          <p className={css.story__category}>{categoryName}</p>
          <h3 className={css.story__title}>{story.title}</h3>
          <p className={css.story__text}>{story.description}</p>

          <div className={css.story__author}>
            <Image
              src={story.avatar || '/images/avatar.svg'}
              alt="Автор"
              width={48}
              height={48}
              className={css.story__avatar}
              unoptimized={story.avatar?.startsWith('http')}
              onError={(e) => {
                const fallbackSrc = '/images/avatar.svg';
                if (e.currentTarget.src !== fallbackSrc && !e.currentTarget.src.endsWith(fallbackSrc)) {
                  e.currentTarget.src = fallbackSrc;
                }
              }}
            />
            <div className={css.story__info}>
              <p className={css.story__name}>{story.author}</p>
              <div className={css.meta}>
                <span className={css.story__meta}>
                  {formatDate(story.date)}
                </span>
                <span className={css.favoriteCount}>{favoriteCount}</span>
                <Icon name="icon-bookmark" className={css.icon} />
              </div>
            </div>
          </div>
          <div className={css.story__actions}>
            <Link href={`/stories/${story._id}`} className={css.story__btn}>
              Переглянути статтю
            </Link>

            {/* Якщо моя історія → EDIT */}
            {isMyStory ? (
              <button
                onClick={() => router.push(`/stories/${story._id}/edit`)}
                className={css.story__save}
              >
                <Icon name="icon-edit" className={css.iconEdit} />
              </button>
            ) : (
              <button
                onClick={handleToggleFavorite}
                disabled={loading}
                className={`${css.story__save} ${isSaved ? css.saved : ''}`}
              >
                <Icon
                  name="icon-bookmark"
                  className={`${isSaved ? css.icon__saved : css.icon__bookmark}`}
                />
              </button>
            )}
          </div>
        </div>
      </li>
      <Modal
        open={isAuthModalOpen}
        title="Помилка під час збереження"
        description="Щоб зберегти статтю вам треба увійти, якщо ще немає облікового запису — зареєструйтесь."
        onClose={() => {
          setIsAuthModalOpen(false);
          router.push('/auth/register');
        }}
      />
    </>
  );
}