import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { serialize } from 'cookie';

// --- THIS IS THE FIX ---
// Point directly to the backend service.
const API_URL = 'http://backend:8000/api';
// --- END OF FIX ---

export async function POST(request: Request) {
  try {
    // 1. Get the refresh token
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token found' }, { status: 401 });
    }

    // 2. Forward the refresh token to Django
    const apiResponse = await fetch(`${API_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    // 3. Check if the refresh was successful
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      const response = NextResponse.json(
        { error: errorData.detail || 'Token refresh failed' },
        { status: apiResponse.status }
      );
      
      // Clear cookies on failure
      response.headers.append('Set-Cookie', serialize('access_token', '', { maxAge: -1, path: '/' }));
      response.headers.append('Set-Cookie', serialize('refresh_token', '', { maxAge: -1, path: '/' }));
      
      return response;
    }

    // 4. Extract the *new* access token
    const { access } = await apiResponse.json();

    if (!access) {
      return NextResponse.json(
        { error: 'Invalid token response from API' },
        { status: 500 }
      );
    }

    // 5. Set the new access token
    const accessTokenCookie = serialize('access_token', access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 15,
      path: '/',
    });

    // 6. Send a success response
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