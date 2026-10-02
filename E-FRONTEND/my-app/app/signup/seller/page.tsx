'use client';

import { useEffect, useRef, useState } from 'react';
import { userAPI } from '@/src/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PasswordInput from '@/src/components/password-input';

const ROLE = 'seller' as const;

type ApiError = {
  response?: { data?: { message?: string } };
};

const inputClass =
  'w-full px-3.5 py-2 text-sm rounded-lg bg-white/15 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/50';
const labelClass = 'text-xs font-medium text-zinc-200';

export default function SellerSignUpPage() {
  const router = useRouter();
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Clear the pending redirect if the page unmounts first
  useEffect(() => {
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || successMessage) return;

    setErrorMessage('');
    setSuccessMessage('');

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      role: ROLE,
    };

    if (payload.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await userAPI.signUp(payload);
      setSuccessMessage('Store account created successfully!');

      if (response.data?.token) {
        try {
          localStorage.setItem('token', response.data.token);
        } catch {
          // Storage can be unavailable (private mode, blocked cookies); sign-up still succeeded
        }
      }

      redirectTimer.current = setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setErrorMessage(
        apiError.response?.data?.message || 'Failed to create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[url('/cf90ad141a93d7fdc1013b58efa3619dbee55ffc.jpg')] bg-cover bg-center bg-no-repeat">
      {/* Dark overlay so text stays readable over the background photo */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {/* Floating Navbar: Clean logo only on mobile, styled card on desktop */}
      <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-8 sm:right-8 z-20 max-w-7xl mx-auto flex items-center justify-between sm:rounded-2xl sm:border-2 sm:border-[#5C3A31] sm:bg-[#D2CFC6] sm:px-6 sm:py-4 sm:shadow-lg text-zinc-900">
        {/* Logo and App Name */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/Icon.png"
            alt="Hair Haven logo"
            width={32}
            height={32}
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
          />
          <span className="text-lg sm:text-xl font-bold tracking-tight text-white sm:text-[#171717]">
            Hair Haven
          </span>
        </div>

        {/* Right Side: Account Prompt (Hidden on mobile, shown on desktop) */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-700">
          <p>Already have an account?</p>
          <Link
            href="/"
            className="text-white px-3 py-1.5 text-xs rounded-lg bg-[#5C3A31] font-semibold hover:bg-[#744b41] transition-colors inline-block text-center"
          >
            Log in
          </Link>
        </div>
      </div>

      {/* Sign Up Container with top spacing so it sits below the navbar */}
      <div className="relative z-10 w-full max-w-sm p-6 pt-24 sm:pt-28 rounded-2xl bg-transparent text-white">
        <h1 className="text-2xl font-bold tracking-tight text-left text-white">
          Seller Sign Up
        </h1>
        <p className="text-xs text-left text-zinc-300 mt-1 mb-4">
          Join Hair Haven and start selling today.
        </p>

        {/* Error / Success Feedback Banners */}
        {errorMessage && (
          <div role="alert" className="mb-3 p-2 text-xs bg-red-600/90 text-white rounded-lg">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div role="status" className="mb-3 p-2 text-xs bg-green-600/90 text-white rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Form Inputs & Actions */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <label htmlFor="fullName" className={labelClass}>
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            autoComplete="name"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={inputClass}
            required
          />

          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="business@email.com"
            className={inputClass}
            required
          />

          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+234 800 000 0000"
            pattern="[+0-9\s]{10,16}"
            title="Enter a valid phone number, e.g. +234 800 000 0000"
            className={inputClass}
            required
          />

          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
            minLength={8}
            className={inputClass}
            required
          />

          <button
            type="submit"
            disabled={loading || !!successMessage}
            className="w-full py-2 mt-2 text-sm font-medium text-white bg-[#5A3A33] rounded-lg hover:bg-[#744b41] transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <button
            type="button"
            className="w-full py-2 text-sm font-medium text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            Sign up with Google
          </button>

          <div className="flex gap-2 pt-3 justify-center text-xs text-zinc-300">
            <p>Already have an account?</p>
            <Link href="/" className="text-white font-medium hover:underline">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
