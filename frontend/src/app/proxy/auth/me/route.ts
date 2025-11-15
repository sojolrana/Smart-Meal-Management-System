import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// --- THIS IS THE FIX ---
// Point directly to the backend service.
const API_URL = 'http://backend:8000/api';
// --- END OF FIX ---

export async function GET(request: Request) {
  try {
    // 1. Get the access token from the browser's cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    // 2. Forward the request to the Django 'me' endpoint
    const apiResponse = await fetch(`${API_URL}/auth/me/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!apiResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: apiResponse.status }
      );
    }

    // 3. Return the user data
    const userData = await apiResponse.json();
    return NextResponse.json(userData, { status: 200 });

  } catch (error) {
    console.error('Me proxy error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}