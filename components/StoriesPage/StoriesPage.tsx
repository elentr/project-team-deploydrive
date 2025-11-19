import TravellersStories from "@/components/TravellersStories/TravellersStories";
import { Story } from '@/types/story';

interface StoriesPageProps {
  stories: Story[];
  isAuthenticated?: boolean;
}

export default function StoriesPage({ 
  stories, 
  isAuthenticated = false 
}: StoriesPageProps) {
  return (
    <TravellersStories 
      stories={stories} 
      isAuthenticated={isAuthenticated}
    />
  );
}