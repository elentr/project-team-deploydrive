import { NextResponse } from "next/server";

import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api } from "../../../../api";

type ApiErrorResponse = {
  error?: string;
  message?: string;
};

// === GET /api/users/me ===
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  try {
    const res = await api.get<{
      user: { id: string; name: string; email: string };
    }>("/users/me", {
      headers: {
        Cookie: cookieStore.toString(),
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(res.data);
  } catch (error) {
    // Типобезпечна перевірка
    if (isAxiosError<ApiErrorResponse>(error)) {
      console.error(
        "Axios error /users/me:",
        error.response?.data || error.message
      );
      return NextResponse.json(
        {
          error:
            error.response?.data?.error || "Не вдалося отримати користувача",
        },
        { status: error.response?.status || 401 }
      );
    }

    // Неочікувана помилка (мережа, синтаксис тощо)
    console.error("Unexpected error /users/me:", error);
    return NextResponse.json(
      { error: "Внутрішня помилка сервера" },
      { status: 500 }
    );
  }
}

// === POST /api/users/me → додати в збережене (якщо id в body) ===
export async function POST(request: Request) {
  const cookieStore = await cookies();

  try {
    const body = await request.json();
    const storyId = body.id || body.storyId;

    if (!storyId) {
      return NextResponse.json(
        { error: "ID історії обов'язковий" },
        { status: 400 }
      );
    }

    const res = await api.post(`/users/saved/${storyId}`, body, {
      headers: {
        Cookie: cookieStore.toString(),
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError<ApiErrorResponse>(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || "Помилка збереження" },
        { status: error.response?.status || 400 }
      );
    }

    console.error("POST /users/saved error:", error);
    return NextResponse.json(
      { error: "Внутрішня помилка сервера" },
      { status: 500 }
    );
  }
}

// === DELETE /api/users/me → видалити зі збережених ===
export async function DELETE(request: Request) {
  const cookieStore = await cookies();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID обов'язковий" }, { status: 400 });
    }

    const res = await api.delete(`/users/saved/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError<ApiErrorResponse>(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || "Помилка видалення" },
        { status: error.response?.status || 400 }
      );
    }

    console.error("DELETE /users/saved error:", error);
    return NextResponse.json(
      { error: "Внутрішня помилка сервера" },
      { status: 500 }
    );
  }
}
