// frontend/src/components/auth/StudentRegisterForm.tsx

'use client';

import { useState, FormEvent } from 'react';
import { registerStudent, StudentRegisterData } from '@/services/auth.service';

const fileInputClass =
  'block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100';

export default function StudentRegisterForm() {
  const [formData, setFormData] = useState<StudentRegisterData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    student_id: '',
    department_name: '',
    father_name: '',
    mother_name: '',
    phone_number: '',
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [idCard, setIdCard] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (name === 'photo') {
        setPhoto(files[0]);
      } else if (name === 'id_card') {
        setIdCard(files[0]);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!photo || !idCard) {
      setError('Please upload both a photo and an ID card.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await registerStudent(formData, photo, idCard);
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
          approve your account before you can log in.
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
            id="email" name="email" type="email" autoComplete="email" required
            className={inputClass} onChange={handleChange} value={formData.email}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password" name="password" type="password" autoComplete="new-password" required
            className={inputClass} onChange={handleChange} value={formData.password}
          />
        </div>
      </div>

      <hr />
      <h4 className="text-lg font-medium text-gray-800">Student Details</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">
            Student ID <span className="text-red-500">*</span>
          </label>
          <input
            id="student_id" name="student_id" type="text" required
            className={inputClass} onChange={handleChange} value={formData.student_id}
          />
        </div>
        <div>
          <label htmlFor="department_name" className="block text-sm font-medium text-gray-700">
            Department Name <span className="text-red-500">*</span>
          </label>
          <input
            id="department_name" name="department_name" type="text" required
            className={inputClass} onChange={handleChange} value={formData.department_name}
          />
        </div>
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone_number" name="phone_number" type="tel" required
            className={inputClass} onChange={handleChange} value={formData.phone_number}
          />
        </div>
        <div>
          <label htmlFor="father_name" className="block text-sm font-medium text-gray-700">
            Father&apos;s Name
          </label>
          <input
            id="father_name" name="father_name" type="text"
            className={inputClass} onChange={handleChange} value={formData.father_name}
          />
        </div>
        <div>
          <label htmlFor="mother_name" className="block text-sm font-medium text-gray-700">
            Mother&apos;s Name
          </label>
          <input
            id="mother_name" name="mother_name" type="text"
            className={inputClass} onChange={handleChange} value={formData.mother_name}
          />
        </div>
      </div>

      <hr />
      <h4 className="text-lg font-medium text-gray-800">File Uploads</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
            Your Photo (512x512) <span className="text-red-500">*</span>
          </label>
          <input
            id="photo" name="photo" type="file" required
            className={fileInputClass} accept="image/png, image/jpeg, image/gif" onChange={handleFileChange}
          />
        </div>
        <div>
          <label htmlFor="id_card" className="block text-sm font-medium text-gray-700">
            Student ID Card <span className="text-red-500">*</span>
          </label>
          <input
            id="id_card" name="id_card" type="file" required
            className={fileInputClass} accept="image/png, image/jpeg, image/gif" onChange={handleFileChange}
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
            'Register as Student'
          )}
        </button>
      </div>
    </form>
  );
}