// frontend/src/services/auth.service.ts

export interface StudentRegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  student_id: string;
  department_name: string;
  father_name: string;
  mother_name: string;
  phone_number: string;
}

export interface StaffRegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  profile: {
    staff_id: string;
    phone_number: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';

function parseValidationError(errorData: any, parentKey: string = ''): string {
  if (!errorData) {
    return 'Registration failed';
  }
  if (typeof errorData === 'string') {
    return errorData;
  }
  if (Array.isArray(errorData)) {
    return errorData.join(', ');
  }
  if (typeof errorData === 'object') {
    const messages = Object.keys(errorData)
      .map((key) => {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        return parseValidationError(errorData[key], newKey);
      })
      .join('; ');
    return messages || 'Registration failed. Please check your inputs.';
  }
  return 'An unknown error occurred.';
}

export async function registerStudent(
  data: StudentRegisterData,
  photo: File,
  idCard: File
) {
  const formData = new FormData();
  (Object.keys(data) as Array<keyof StudentRegisterData>).forEach((key) => {
    formData.append(key, data[key]);
  });
  formData.append('photo', photo);
  formData.append('id_card', idCard);

  const response = await fetch(`${API_URL}/auth/register/student/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(parseValidationError(errorData));
  }
  return response.json();
}

export async function registerStaff(data: StaffRegisterData) {
  const response = await fetch(`${API_URL}/auth/register/staff/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(parseValidationError(errorData));
  }
  return response.json();
}

export async function login(credentials: LoginCredentials) {
  const response = await fetch('/proxy/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }
  return response.json();
}

export async function logout() {
  const response = await fetch('/proxy/auth/logout', {
    method: 'POST',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Logout failed');
  }
  return response.json();
}

export async function getMe() {
  const response = await fetch('/proxy/auth/me');

  if (!response.ok) {
    throw new Error('User not authenticated');
  }
  return response.json();
}

export async function refreshToken() {
  const response = await fetch('/proxy/auth/refresh', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }
  return response.json();
}