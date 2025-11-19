import { notFound } from 'next/navigation';
import { Traveller } from '@/types/traveller';
import { Story } from '@/types/story';
import TravellerPageClient from './TravellerPage.client';

interface InitialData {
  user: Traveller | null;
  stories?: {
    data: Story[];
    hasNextPage: boolean;
  };
}

async function getInitialTravellerData(
  travellerId: string
): Promise<InitialData | null> {
  const res = await fetch(
    `${process.env.API_DATA_BASE_URL}/api/users/${travellerId}?page=1`, // або відповідно яка зміна в .env
    { cache: 'no-store' }
  );
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export default async function TravellerPage({
  params,
}: {
  params: { travellerId: string };
}) {
  const { travellerId } = await params;

  const initialData = await getInitialTravellerData(travellerId);

  if (!initialData?.user) notFound();

  return (
    <TravellerPageClient
      travellerId={travellerId}
      initialTraveller={initialData.user}
      initialStories={initialData.stories?.data ?? []}
      initialHasNextPage={initialData.stories?.hasNextPage ?? false}
    />
  );
}
