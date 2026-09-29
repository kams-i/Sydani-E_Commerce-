'use client';

import { useState } from 'react';
import { userAPI } from '@/src/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await userAPI.requestOtp({ email });
      setSuccessMessage('Reset instructions sent! Redirecting to OTP verification...');

      // Save email temporarily for the OTP verification page
      if (typeof window !== 'undefined') {
        localStorage.setItem('resetEmail', email);
      }

      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to send reset code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[url('/cf90ad141a93d7fdc1013b58efa3619dbee55ffc.jpg')] bg-cover bg-center bg-no-repeat">

      {/* Floating Navbar: Clean logo only on mobile, styled card on desktop */}
      <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-8 sm:right-8 z-20 max-w-7xl mx-auto flex items-center justify-between sm:rounded-2xl sm:border-2 sm:border-[#5C3A31] sm:bg-[#D2CFC6] sm:px-6 sm:py-4 sm:shadow-lg text-zinc-900">

        {/* Logo and App Name */}
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src="/Icon.png"
            alt="Hair Haven Logo"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
          />
          <span className="text-lg sm:text-xl font-bold tracking-tight text-[#171717]">Hair Haven</span>
        </div>

        {/* Right Side: Account Prompt (Hidden on mobile, shown on desktop) */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-700">
          <p>Remember your password?</p>
          <Link href="/" className="text-white px-3 py-1.5 text-xs rounded-lg bg-[#5C3A31] font-semibold hover:bg-[#744b41] transition-colors">
            Log in
          </Link>
        </div>

      </div>


      {/* Forgot Password Container with Light Background */}
      <div className="relative z-10 w-full max-w-sm p-6 rounded-2xl border-2 border-[#5C3A31] bg-[#E8C6B5B2] shadow-xl text-zinc-900">
        <h1 className="text-2xl font-bold tracking-tight text-left text-[#171717]">
          Forgot password?
        </h1>
        <p className="text-xs text-left text-zinc-700 mt-1 mb-4">
          No worries, we'll send you reset instructions.
        </p>

        {/* Error / Success Feedback Banners */}
        {errorMessage && (
          <div className="mb-3 p-2 text-xs bg-red-600 text-white rounded-lg">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-3 p-2 text-xs bg-green-700 text-white rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Form Inputs & Actions */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <p className="text-xs font-medium text-zinc-800">Email</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3.5 py-2 text-sm rounded-lg bg-white/70 border border-[#5C3A31]/30 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#5C3A31]"
            required
          />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2 mt-2 text-sm font-medium text-white bg-[#5A3A33] rounded-lg hover:bg-[#744b41] transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending instructions...' : 'Reset password'}
          </button>

          <div className="flex gap-2 pt-3 justify-center text-xs text-zinc-700">
            <p>Back to</p>
            <Link href="/" className="text-[#5A3A33] font-semibold hover:underline">Log in</Link>
          </div>
        </form>
      </div>

    </main>
  );
}