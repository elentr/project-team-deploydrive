import styles from './OurTravellersList.module.css';
import TravellerCard from '../TravellerCard/TravellerCard';
import type { Traveller } from '@/types/traveller';

interface Props {
  travellers: Traveller[];
}

export default function OurTravellersList({ travellers }: Props) {
  if (!travellers.length) return <p>Немає мандрівників.</p>;

  const uniqueTravellers = Array.from(
    new Map(travellers.map(t => [t._id, t])).values()
  );

  return (
    <ul className={styles.list}>
      {uniqueTravellers.map(t => (
        <li key={t._id} className={styles.item}>
          <TravellerCard traveller={t} />
        </li>
      ))}
    </ul>
  );
}
