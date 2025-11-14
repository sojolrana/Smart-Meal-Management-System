// frontend/src/app/proxy/auth/logout/route.ts

import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(request: Request) {
  const accessTokenCookie = serialize('access_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1,
    path: '/',
  });

  const refreshTokenCookie = serialize('refresh_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1,
    path: '/',
  });

  const response = NextResponse.json(
    { message: 'Logout successful' },
    { status: 200 }
  );

  response.headers.append('Set-Cookie', accessTokenCookie);
  response.headers.append('Set-Cookie', refreshTokenCookie);

  return response;
}