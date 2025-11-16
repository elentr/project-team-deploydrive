"use client";

import css from "./EditPage.module.css";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";
import { getStories } from "@/lib/api/clientApi";
import { useQuery } from "@tanstack/react-query";
import StoryForm from "@/components/AddStoryForm/AddStoryForm";
import type { Story } from "@/types/story";

const EditStory = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;

  const { data: stories, isLoading } = useQuery<Story[]>({
    queryKey: ["stories"],
    queryFn: () => getStories(),
  });

  if (isLoading) return <Loader />;

  const story = stories?.find((s) => s._id === id);

  const initialData = story
    ? {
        id: story._id,
        title: story.title,
        categoryId: story.category,
        shortDescription: story.article.slice(0, 60),
        body: story.article,
        imageUrl: story.img,
      }
    : undefined;

  return (
    <div className="container">
      <h1 className={css.title}>Редагувати історію</h1>
      <StoryForm
        initialData={initialData}
        onSuccess={() => {
          alert("Історію успішно відредаговано!");
          router.push(`/stories/${id}`);
        }}
        onCancel={() => router.back()}
      />
    </div>
  );
};

export default EditStory;
