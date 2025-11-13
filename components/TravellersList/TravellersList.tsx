import css from "./TravellersList.module.css";
import axios from "axios";
import ShowMore from "./TravellersListClient";

interface Traveller {
  _id: string;
  name: string;
  avatarUrl: string | null;
  articlesAmount: number;
  description: string;
}

export const nextServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  withCredentials: true,
});

export default async function TravellersList() {
  let travellers: Traveller[] = [];

  try {
    const res = await nextServer.get("/users");
    if (res.data && Array.isArray(res.data.data.data)) {
      travellers = res.data.data.data;
    }
  } catch (err) {
    console.error("Could not fetch travellers:", err);
  }

  return (
    <section className={css.container}>
      <h3 className={css.title}>Мандрівники</h3>
      <ShowMore travellers={travellers} />
    </section>
  );
}
