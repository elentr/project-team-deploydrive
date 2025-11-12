//import css from "./StoriesPage.module.css";

// export default function StoriesPage() {
//   return (
//     <section>
//       <h3>StoriesPage</h3>
//     </section>
//   );
// }

"use client";

import TravellersStories from "../TravellersStories/TravellersStories"

export default function StoriesPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Історії Мандрівників
      </h1>
      <TravellersStories />
    </section>
  );
}