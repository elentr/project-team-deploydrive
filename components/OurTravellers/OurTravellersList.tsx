import styles from './OurTravellersList.module.css';
import TravellerCard from '../TravellerCard/TravellerCard';
import type { Traveller } from '@/types/traveller';

interface Props {
  travellers: Traveller[];
}

export default function OurTravellersList({ travellers }: Props) {
  if (!travellers.length) return <p>Немає мандрівників.</p>;

  return (
    <ul className={styles.list}>
      {travellers.map(t => (
        <li key={t._id} className={styles.item}>
          <TravellerCard traveller={t} />
        </li>
      ))}
    </ul>
  );
}
