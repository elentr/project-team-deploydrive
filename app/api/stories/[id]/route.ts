import { cookies } from "next/headers";

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params; // <-- ГОЛОВНЕ ВИПРАВЛЕННЯ

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stories/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const error = await res.json();
      return Response.json(error, { status: res.status });
    }

    const data = await res.json();
    return Response.json(data, { status: 200 });
  } catch (err) {
    return Response.json(
      { message: "Internal server error", error: `${err}` },
      { status: 500 }
    );
  }
}
