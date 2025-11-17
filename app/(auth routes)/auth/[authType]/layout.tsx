"use client";

import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import AuthProfileEditProvider from "@/components/AuthProfileEditProvider/AuthProfileEditProvider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TanStackProvider>
      <AuthProvider>
        <AuthProfileEditProvider>{children}</AuthProfileEditProvider>
      </AuthProvider>
    </TanStackProvider>
  );
}
