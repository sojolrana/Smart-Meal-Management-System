// frontend/src/components/auth/StaffRegisterForm.tsx

'use client';

import { useState, FormEvent } from 'react';
import { registerStaff, StaffRegisterData } from '@/services/auth.service';

export default function StaffRegisterForm() {
  const [formData, setFormData] = useState<StaffRegisterData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    profile: {
      staff_id: '',
      phone_number: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name in formData.profile) {
      setFormData((prev) => ({
        ...prev,
        profile: { ...prev.profile, [name]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await registerStaff(formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 text-center bg-green-100 text-green-800 rounded-md">
        <h3 className="text-lg font-medium">Registration Successful!</h3>
        <p className="mt-2 text-sm">
          Your account has been created. Please wait for an administrator to
          approve your account.
        </p>
      </div>
    );
  }

  const inputClass =
    'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900';

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            id="first_name" name="first_name" type="text" required
            className={inputClass} onChange={handleChange} value={formData.first_name}
          />
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            id="last_name" name="last_name" type="text" required
            className={inputClass} onChange={handleChange} value={formData.last_name}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            id="email" name="email" type="email" required
            className={inputClass} onChange={handleChange} value={formData.email}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password" name="password" type="password" required
            className={inputClass} onChange={handleChange} value={formData.password}
          />
        </div>

        <div>
          <label htmlFor="staff_id" className="block text-sm font-medium text-gray-700">
            Staff ID <span className="text-red-500">*</span>
          </label>
          <input
            id="staff_id" name="staff_id" type="text" required
            className={inputClass} onChange={handleChange} value={formData.profile.staff_id}
          />
        </div>
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone_number" name="phone_number" type="tel" required
            className={inputClass} onChange={handleChange} value={formData.profile.phone_number}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering...
            </>
          ) : (
            'Register as Staff'
          )}
        </button>
      </div>
    </form>
  );
}