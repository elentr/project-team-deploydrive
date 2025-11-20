//app/(auth routes)/auth/[authType]/page.tsx

'use client';

import { use } from 'react';
import AuthPage from '@/components/AuthPage/AuthPage';

export default function AuthPageRoute({
  params,
}: {
  params: Promise<{ authType: string }>;
}) {
  const { authType } = use(params);

  const type: 'login' | 'register' =
    authType === 'login' ? 'login' : 'register';

  return <AuthPage type={type} />;
}
