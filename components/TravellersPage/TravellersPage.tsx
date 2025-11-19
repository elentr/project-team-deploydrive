import TravellersList from "../TravellersList/TravellersList";
import css from "./TravellersPage.module.css";

export default function TravellersPage() {
  return (
    <section className={css.container}>
      <h2 className={css.title}>Мандрівники</h2>
      <TravellersList />
    </section>
  );
}