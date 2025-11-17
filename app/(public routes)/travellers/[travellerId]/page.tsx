import TravellerPage from '@/components/TravellerPage/TravellerPage';

export default function Traveller({
  params,
}: {
  params: { travellerId: string };
}) {
  return <TravellerPage params={params} />;
}
