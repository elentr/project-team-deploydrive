"use client";

import { use } from "react";
import AuthPage from "@/components/AuthPage/AuthPage";

export default function AuthPageRoute({
  params,
}: {
  params: Promise<{ authType: string }>;
}) {
  const { authType } = use(params);
  const type = authType === "login" ? "login" : "register";

  return <AuthPage type={type} />;
}
