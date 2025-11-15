import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

const API_URL = 'http://backend:8000';

// --- NEW HELPER FUNCTION ---
// This will find the correct error message from Django
function getDjangoErrorMessage(errorData: any): string {
  if (typeof errorData === 'object' && errorData !== null) {
    // This is our custom "is_approved" error
    if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
      return errorData.non_field_errors.join(' ');
    }
    // This is the default "Invalid email/password" error
    if (errorData.detail) {
      return errorData.detail;
    }
  }
  return 'Login failed. Please check your credentials.';
}
// --- END HELPER FUNCTION ---

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    const host = request.headers.get('host');

    const apiResponse = await fetch(`${API_URL}/api/auth/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Host': host || 'meal.sojolrana.com',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("Django API Error:", errorText);
      try {
        const errorData = JSON.parse(errorText);
        // --- THIS IS THE FIX ---
        // Use our new helper function to get the *real* error
        const message = getDjangoErrorMessage(errorData);
        return NextResponse.json(
          { error: message },
          { status: apiResponse.status }
        );
        // --- END OF FIX ---
      } catch (e) {
        return NextResponse.json(
          { error: "Received non-JSON response from backend" },
          { status: apiResponse.status }
        );
      }
    }

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