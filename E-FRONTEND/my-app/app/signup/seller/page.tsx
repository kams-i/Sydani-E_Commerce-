'use client';

import { useState } from 'react';
import { userAPI } from '@/src/lib/api';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'seller',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

    try {
      const response = await userAPI.signUp(formData);
      setSuccessMessage('Store account created successfully!');
      
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }

      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to create account. Please try again.'
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
          <p>Already have an account?</p>
          <button className="text-white px-3 py-1.5 text-xs rounded-lg bg-[#5C3A31] font-semibold hover:bg-[#744b41] transition-colors">
            Log in
          </button>
        </div>

      </div>


      {/* Transparent Sign Up Container with top spacing so it sits below the navbar */}
      <div className="relative z-10 w-full max-w-sm p-6 pt-24 sm:pt-28 rounded-2xl bg-transparent text-white">
        <h1 className="text-2xl font-bold tracking-tight text-left text-[#171717]">
          Seller Sign Up
        </h1>
        <p className="text-xs text-left text-zinc-300 mt-1 mb-4">
          Join Hair Haven and start selling today.
        </p>

        {/* Error / Success Feedback Banners */}
        {errorMessage && (
          <div className="mb-3 p-2 text-xs bg-red-600/90 text-white rounded-lg">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-3 p-2 text-xs bg-green-600/90 text-white rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Form Inputs & Actions */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <p className="text-xs font-medium text-zinc-200">Full Name</p>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full px-3.5 py-2 text-sm rounded-lg bg-white/15 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            required
          />

          <p className="text-xs font-medium text-zinc-200">Email</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="business@email.com"
            className="w-full px-3.5 py-2 text-sm rounded-lg bg-white/15 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            required
          />

          <p className="text-xs font-medium text-zinc-200">Phone</p>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+234 800 000 0000"
            className="w-full px-3.5 py-2 text-sm rounded-lg bg-white/15 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            required
          />

          <p className="text-xs font-medium text-zinc-200">Password</p>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
            className="w-full px-3.5 py-2 text-sm rounded-lg bg-white/15 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            required
          />

          {/* Hidden input to hold the seller role */}
          <input type="hidden" name="role" value="seller" />

          <button 
            type="submit" 
            disabled={loading}
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
            <a href="#" className="text-black font-medium hover:underline">Log in</a>
          </div>
        </form>
      </div>

    </main>
  );
}