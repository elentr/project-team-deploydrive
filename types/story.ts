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
  ownerId: string;
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

export const mapStory = (s: ApiStory): Story => ({
  _id: s._id,
  title: s.title,
  img: s.img,
  description:
    s.article.length > 200 ? s.article.slice(0, 200) + "..." : s.article,
  category: s.categoryName,
  author: "Автор", // заглушка, якщо немає автора з бекенду
  date: s.date,
  readTime: 1,
  avatar: "/images/avatar.png",
  bookmarksCount: s.favoriteCount,
  isSaved: false,
});
