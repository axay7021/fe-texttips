'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export const signUpAction = async (formData: FormData) => {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
    asResponse: true,
    headers: await headers(),
  });

  redirect('/');
};

export async function handleLogout() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect('/auth/sign-in');
}
