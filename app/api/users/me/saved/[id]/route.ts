import { NextResponse } from "next/server";

import { cookies } from "next/headers";
import { logErrorResponse } from "@/app/api/_utils/utils;
import { isAxiosError } from "axios";
import { api } from "../../../../api";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Не авторизовано" },
        { status: 401 }
      );
    }

    const res = await api.get("/users/me", {
      headers: {
        Cookie: cookieStore.toString(),
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("GET /api/users/me error:", error);
    return NextResponse.json(
      { error: "Не вдалося отримати користувача" },
      { status: 401 }
    );
  }
}

export async function POST(request: Request, { params }: Props) {
  try {
    const cookieStore = await cookies();
    const { id } = await params;
    const body = await request.json();

    const res = await api.post(`/users/saved/${id}`, body, {
      headers: {
        Cookie: cookieStore.toString(),
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const cookieStore = await cookies();
    const { id } = await params;

    const res = await api.delete(`/users/saved/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
