'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { userAPI } from '@/src/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SetNewPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Pull email and otp from query params or localStorage if available
  useEffect(() => {
    const emailParam = searchParams.get('email') || (typeof window !== 'undefined' ? localStorage.getItem('resetEmail') || '' : '');
    const otpParam = searchParams.get('otp') || (typeof window !== 'undefined' ? localStorage.getItem('resetOtp') || '' : '');
    
    setFormData((prev) => ({
      ...prev,
      email: emailParam,
      otp: otpParam,
    }));
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      await userAPI.resetPassword({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });

      setSuccessMessage('Password reset successfully! Redirecting to login...');

      // Clean up temporary storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('resetEmail');
        localStorage.removeItem('resetOtp');
      }

      setTimeout(() => {
        router.push('/'); // Route to login page
      }, 2000);
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to reset password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-sm p-6 rounded-2xl border-2 border-[#5C3A31] bg-[#E8C6B5B2] shadow-xl text-zinc-900">
      <h1 className="text-2xl font-bold tracking-tight text-left text-[#171717]">
        Set new password
      </h1>
      <p className="text-xs text-left text-black mt-1 mb-4">
        *Must be at least 8 characters long.
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
        <p className="text-xs font-medium text-zinc-800">New Password</p>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Enter new password"
          className="w-full px-3.5 py-2 text-sm rounded-lg bg-white/70 border border-[#5C3A31]/30 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#5C3A31]"
          required
        />

        <p className="text-xs font-medium text-zinc-800">Confirm Password</p>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
          className="w-full px-3.5 py-2 text-sm rounded-lg bg-white/70 border border-[#5C3A31]/30 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#5C3A31]"
          required
        />

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-2 mt-2 text-sm font-medium text-white bg-[#5A3A33] rounded-lg hover:bg-[#744b41] transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Resetting password...' : 'Reset password'}
        </button>

        <div className="flex gap-2 pt-3 justify-center text-xs text-zinc-700">
          <p>Back to</p>
          <Link href="/" className="text-[#5A3A33] font-semibold hover:underline">Log in</Link>
        </div>
      </form>
    </div>
  );
}

export default function Home() {
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

      {/* Suspense Boundary for useSearchParams */}
      <Suspense fallback={<div className="text-zinc-800 text-sm">Loading reset form...</div>}>
        <SetNewPasswordContent />
      </Suspense>

    </main>
  );
}