"use client";
import { useRouter } from "next/navigation";
import StoryForm from "@/components/AddStoryForm/AddStoryForm";
import css from "./CreateStory.module.css";

export default function CreateStory() {
  const router = useRouter();
  return (
    <div className="container">
      <h1 className={css.title}>Створити нову історію</h1>
      <StoryForm
        onSuccess={(storyId) => router.push(`/stories/${storyId}`)}
        onCancel={() => router.back()}
      />
    </div>
  );
}
