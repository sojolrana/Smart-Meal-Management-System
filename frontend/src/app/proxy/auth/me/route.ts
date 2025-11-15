import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// --- THIS IS THE FIX ---
const API_URL = 'http://backend:8000';
// --- END OF FIX ---

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    // This will now correctly fetch: http://backend:8000/api/auth/me/
    const apiResponse = await fetch(`${API_URL}/api/auth/me/`, {
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