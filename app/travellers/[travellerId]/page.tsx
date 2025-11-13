import TravellerPageClient from "./TravellerPage.client";
import { notFound } from "next/navigation";

async function getInitialTravellerData(
  travellerId: string
): Promise<InitialData | null> {
  try {
    const res = await fetch(
      `${process.env.API_DATA_BASE_URL}/api/users/${travellerId}?page=1`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default async function TravellerPage({
  params,
}: {
  params: { travellerId: string };
}) {
  const { travellerId } = await params;

  const initialData = await getInitialTravellerData(travellerId);

  if (!initialData || !initialData.user) {
    notFound();
  }

  const initialTraveller = initialData.user;
  const initialStories = initialData.stories?.data || [];
  const initialHasNextPage = initialData.stories?.hasNextPage || false;

  return (
    <TravellerPageClient
      travellerId={travellerId}
      initialTraveller={initialTraveller}
      initialStories={initialStories}
      initialHasNextPage={initialHasNextPage}
    />
  );
}
