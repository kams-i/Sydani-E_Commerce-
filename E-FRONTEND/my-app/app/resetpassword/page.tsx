export const dynamic = 'force-dynamic';
'use client';

import { useState, useRef, useEffect } from 'react';
import { userAPI } from '@/src/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const queryEmail = searchParams.get('email') || (typeof window !== 'undefined' ? localStorage.getItem('resetEmail') || '' : '');
    setEmail(queryEmail);
  }, [searchParams]);

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return; // Only allow numbers

    const newValues = [...otpValues];
    newValues[index] = value;
    setOtpValues(newValues);

    // Auto-focus next input if current field has a value
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpValues.join('');

    if (fullOtp.length < 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    if (!email) {
      setErrorMessage('Email address is missing. Please restart the password reset process.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await userAPI.verifyOtp({ email, otp: fullOtp });
      setSuccessMessage('OTP verified successfully!');

      // Save OTP and email temporarily for the set-new-password page
      if (typeof window !== 'undefined') {
        localStorage.setItem('resetEmail', email);
        localStorage.setItem('resetOtp', fullOtp);
      }

      setTimeout(() => {
        router.push(`/set-new-password?email=${encodeURIComponent(email)}&otp=${fullOtp}`);
      }, 1000);
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || 'Invalid or expired OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setErrorMessage('Email address is missing.');
      return;
    }

    setResending(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await userAPI.requestOtp({ email });
      setSuccessMessage('A new verification code has been sent to your email.');
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to resend code. Please try again.'
      );
    } finally {
      setResending(false);
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


      {/* OTP Verification Container */}
      <div className="relative z-10 w-full max-w-sm p-6 rounded-2xl border-2 border-[#5C3A31] bg-[#E8C6B5B2] shadow-xl text-zinc-900">
        <h1 className="text-2xl font-bold tracking-tight text-left text-[#171717]">
          Enter OTP code
        </h1>
        <p className="text-xs text-left text-zinc-700 mt-1 mb-4">
          Please enter the 6-digit verification code sent to your email.
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
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <p className="text-xs font-medium text-zinc-800">Verification Code</p>

          {/* 6 Individual Box Inputs */}
          <div className="flex justify-between gap-2">
            {otpValues.map((value, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={value}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-11 h-12 text-center text-lg font-bold rounded-lg bg-white/70 border border-[#5C3A31]/30 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#5C3A31]"
              />
            ))}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2 mt-2 text-sm font-medium text-white bg-[#5A3A33] rounded-lg hover:bg-[#744b41] transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying code...' : 'Verify code'}
          </button>

          <div className="flex items-center justify-between pt-2 text-xs text-zinc-700">
            <button 
              type="button" 
              onClick={handleResend}
              disabled={resending}
              className="text-[#5A3A33] font-medium hover:underline disabled:opacity-50"
            >
              {resending ? 'Resending...' : 'Resend code'}
            </button>
            <div className="flex gap-1">
              <p>Back to</p>
              <Link href="/" className="text-[#5A3A33] font-semibold hover:underline">Log in</Link>
            </div>
          </div>
        </form>
      </div>

    </main>
  );
}