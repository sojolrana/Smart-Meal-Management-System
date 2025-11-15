import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

const API_URL = 'http://backend:8000';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // --- THIS IS THE FIX ---
    // Get the original Host header from the browser's request
    const host = request.headers.get('host');
    // --- END OF FIX ---

    const apiResponse = await fetch(`${API_URL}/api/auth/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Host': host || 'meal.sojolrana.com', // Pass the original host
      },
      body: JSON.stringify({ email, password }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("Django API Error:", errorText);
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorData.detail || 'Login failed' },
          { status: apiResponse.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: "Received non-JSON response from backend", details: errorText },
          { status: apiResponse.status }
        );
      }
    }

    // ... (rest of file is unchanged) ...
    const { access, refresh } = await apiResponse.json();

    if (!access || !refresh) {
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

    const refreshTokenCookie = serialize('refresh_token', refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    const response = NextResponse.json(
      { message: 'Login successful' },
      { status: 200 }
    );

    response.headers.append('Set-Cookie', accessTokenCookie);
    response.headers.append('Set-Cookie', refreshTokenCookie);

    return response;
    
  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}