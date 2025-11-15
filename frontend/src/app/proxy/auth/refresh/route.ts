// frontend/src/app/proxy/auth/refresh/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { serialize } from 'cookie';

const API_URL = 'http://backend:8000';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token found' }, { status: 401 });
    }
    
    const host = request.headers.get('host');

    const apiResponse = await fetch(`${API_URL}/api/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Host': host || 'meal.sojolrana.com',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      const response = NextResponse.json(
        { error: errorData.detail || 'Token refresh failed' },
        { status: apiResponse.status }
      );
      
      response.headers.append('Set-Cookie', serialize('access_token', '', { maxAge: -1, path: '/' }));
      response.headers.append('Set-Cookie', serialize('refresh_token', '', { maxAge: -1, path: '/' }));
      
      return response;
    }

    const { access } = await apiResponse.json();

    if (!access) {
      return NextResponse.json(
        { error: 'Invalid token response from API' },
        { status: 500 }
      );
    }

    const accessTokenCookie = serialize('access_token', access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 15,
      path: '/',
    });

    const response = NextResponse.json(
      { message: 'Token refreshed successfully' },
      { status: 200 }
    );

    response.headers.append('Set-Cookie', accessTokenCookie);

    return response;

  } catch (error) {
    console.error('Refresh proxy error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}