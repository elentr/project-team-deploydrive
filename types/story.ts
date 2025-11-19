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
  category?: string;
  categoryName?: string;
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

export const mapStory = (s: ApiStory, baseUrl?: string, categoryName?: string): Story => {
  const owner = typeof s.ownerId === 'object' ? s.ownerId : null;
  const author = owner?.name || "Автор";
  
  let avatar = owner?.avatarUrl || "/images/avatar.svg";
  if (avatar && !avatar.startsWith('http') && !avatar.startsWith('/') && baseUrl) {
    avatar = `${baseUrl}/${avatar}`;
  }

  let img = s.img || '';
  if (img && !img.startsWith('http') && baseUrl) {
    img = img.startsWith('/') 
      ? `${baseUrl}${img}` 
      : `${baseUrl}/${img}`;
  }

  return {
    _id: s._id,
    title: s.title,
    img,
    description:
      s.article.length > 200 ? s.article.slice(0, 200) + "..." : s.article,
    category: categoryName || s.categoryName || s.category || 'Без категорії',
    author,
    date: s.date,
    readTime: 1,
    avatar,
    bookmarksCount: s.favoriteCount,
    isSaved: false,
  };
};
