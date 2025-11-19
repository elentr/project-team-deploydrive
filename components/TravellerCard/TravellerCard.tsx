import Image from 'next/image';
import type { Traveller } from '@/types/traveller';
import styles from './TravellerCard.module.css';
import { useRouter } from 'next/navigation';

interface TravellerCardProps {
  traveller: Traveller;
}

export default function TravellerCard({ traveller }: TravellerCardProps) {
  const { _id, name, avatarUrl, description, articlesAmount } = traveller;
  const router = useRouter();
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={avatarUrl || '/images/headeravatar.webp'}
          alt={name}
          width={150}
          height={150}
          className={styles.avatar}
        />
      </div>

      <h3 className={styles.name}>{name}</h3>
      <h3 className={styles.job}>{articlesAmount} Статей</h3>

      <p className={styles.description}>
        {description?.length > 100
          ? description.slice(0, 100) + '...'
          : description}
      </p>

      <button
        className={styles.button}
        type="button"
        onClick={() => router.push(`/travellers/${_id}`)}
      >
        Переглянути профіль
      </button>
    </div>
  );
}
