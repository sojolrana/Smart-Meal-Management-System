import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = 'http://backend:8000';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    
    // --- THIS IS THE FIX ---
    const host = request.headers.get('host');
    // --- END OF FIX ---

    const apiResponse = await fetch(`${API_URL}/api/auth/me/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Host': host || 'meal.sojolrana.com', // Pass the original host
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