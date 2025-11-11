import css from "./TravellerInfo.module.css";

interface TravellerInfoProps {
  traveller: {
    name: string;
    photo: string;
    info: string;
  };
}

export default function TravellerInfo({ traveller }: TravellerInfoProps) {
  return (
    <div className={css.wrap}>
      <img
        src={traveller.photo}
        alt={`Фото ${traveller.name}`}
        className={css.photo}
      />
      <div className={css.info}>
        <h3 className={css.title}>{traveller.name}</h3>
        <p className={css.text}>{traveller.info}</p>
      </div>
    </div>
  );
}
