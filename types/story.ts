export type Category = {
id: string;
name: string;
};


export type CreateStoryResponse = {
id: string; 
};


export interface Story {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: string;
  ownerId: string;
  date: string;
  favoriteCount: number;
}