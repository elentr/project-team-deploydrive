import Link from "next/link";
import css from "./MessageNoStories.module.css";

interface NoStoriesProps {
  text: string;
  buttonText: string;
  route: string;
}

export default function MessageNoStories({
  text,
  buttonText,
  route,
}: NoStoriesProps) {
  return (
    <div className={css.wrapper}>
      <p className={css.text}>{text}</p>
      <Link href={route} className={css.button}>
        {buttonText}
      </Link>
    </div>
  );
}
