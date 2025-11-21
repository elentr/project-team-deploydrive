'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import TravellersStories, { FetchResult } from '@/components/TravellersStories/TravellersStories';
import { Story, mapStory } from '@/types/story';
import css from './StoriesPage.module.css';

interface Category {
  _id: string;
  name: string;
}

interface Props {
  initialStories: Story[];
  initialHasMore: boolean;
  initialCategory?: string;
  categories: Category[];
}

export default function StoriesClient({
  initialStories,
  initialHasMore,
  initialCategory = '',
  categories = []
}: Props) {

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [currentStories, setCurrentStories] = useState<Story[]>(initialStories);
  const [currentHasMore, setCurrentHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentStories.length === 0 && activeCategory === '') {
        handleCategoryChange(''); 
    }
  }, []);

  const fetchStoriesFromApi = async (page: number, limit: number, category: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stories`,
        { params: { page, limit, category } }
      );
      
      const responseData = res.data.data || res.data; 
      const storiesList = responseData.stories || responseData.data || []; 

      return {
        data: storiesList.map(mapStory),
        hasNextPage: responseData.hasNextPage,
      };
    } catch (error) {
      console.error('Failed to load stories:', error);
      return null;
    }
  };

  const loadNextPage = async (page: number, limit: number) => {
    return await fetchStoriesFromApi(page, limit, activeCategory);
  };

  const handleCategoryChange = async (categoryId: string) => {
    setIsLoading(true);
    setActiveCategory(categoryId);

    const result = await fetchStoriesFromApi(1, 9, categoryId);

    if (result) {
      setCurrentStories(result.data);
      setCurrentHasMore(result.hasNextPage);
    } else {
      setCurrentStories([]);
      setCurrentHasMore(false);
    }
    setIsLoading(false);
  };

 
  return (
    <div>
      <div className={css.categories_mobile}>
        <select 
          className={css.custom_select}
          value={activeCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">Всі історії</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
<div className={css.categories_desktop}>
          <button
          onClick={() => handleCategoryChange('')}
           className={css.btnStyle}
        >
          Всі історії
        </button>

        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleCategoryChange(cat._id)}
            className={css.btnStyle}
          >
            {cat.name}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div>Завантаження...</div>
      ) : (
        <TravellersStories
          key={activeCategory} 
          initialStories={currentStories}
          initialHasMore={currentHasMore}
          fetchNextPage={loadNextPage}
        />
      )}
    </div>
  );
}