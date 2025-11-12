//import css from "./TravellersStoriesItem.module.css";

// export default function TravellersStoriesItem() {
//   return (
//     <section>
//       <h3>TravellersStoriesItem</h3>
//     </section>
//   );
// }

import Image from "next/image";
import { Story } from "@/types/stories";

interface Props {
  story: Story;
}

export default function TravellersStoriesItem({ story }: Props) {
  return (
    <div
      className="w-[421px] h-[677px] rounded-[16px] border border-[var(--color-scheme-1-border)]
                 bg-[var(--color-scheme-2-foreground)] overflow-hidden flex flex-col"
    >
      <Image
        src={story.storyImage}
        alt={story.title}
        width={421}
        height={281}
        className="object-cover w-[421px] h-[281px]"
      />

      <div className="flex flex-col justify-between p-6 h-[397px]">

        <p className="text-sm text-blue-600 font-medium">{story.category}</p>

        <h3 className="text-lg font-semibold mt-2 line-clamp-2">
          {story.title}
        </h3>

        <p className="text-sm text-gray-600 mt-3 line-clamp-4">
          {story.article}
        </p>

      </div>
    </div>
  );
}

