import axios from 'axios';
import TravellersListClient from './TravellersListClient';

interface Traveller {
  _id: string;
  name: string;
  avatarUrl: string | null;
  articlesAmount: number;
  description: string;
}

export const nextServer = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
});

export default async function TravellersList() {
  let travellers: Traveller[] = [];
  let totalItems = 0;

  try {
    const res = await nextServer.get('/users?page=1&perPage=12');
    if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
      travellers = res.data.data.data;
      totalItems = res.data.data.totalItems;
    }
  } catch (err) {
    console.error('Could not fetch travellers:', err);
  }

  return (
    <TravellersListClient
      initialTravellers={travellers}
      totalItems={totalItems}
    />
  );
}
