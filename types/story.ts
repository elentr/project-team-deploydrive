export type Category = {
  id: string;
  name: string;
};

export type CreateStoryResponse = {
  id: string;
};

export type ApiStory = {
  _id: string;
  img: string;
  title: string;
  article: string;
  categoryName: string;
  date: string;
  ownerId: string | { _id: string; name: string; avatarUrl?: string };
  favoriteCount: number;
};

export interface Story {
  _id: string;
  category: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: number;
  img: string;
  avatar?: string;
  bookmarksCount?: number;
  isSaved?: boolean;
}

export const mapStory = (s: ApiStory): Story => {
  // Якщо ownerId - об'єкт з даними користувача
  const owner = typeof s.ownerId === 'object' ? s.ownerId : null;
  const author = owner?.name || "Автор";
  const avatar = owner?.avatarUrl || "/images/avatar.svg";

  return {
    _id: s._id,
    title: s.title,
    img: s.img, // URL зображення з бекенду
    description:
      s.article.length > 200 ? s.article.slice(0, 200) + "..." : s.article,
    category: s.categoryName,
    author,
    date: s.date,
    readTime: 1,
    avatar, // URL аватара з бекенду або заглушка
    bookmarksCount: s.favoriteCount,
    isSaved: false,
  };
};
