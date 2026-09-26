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
          <p>Already have an account?</p>
          <button className="text-white px-3 py-1.5 text-xs rounded-lg bg-[#5C3A31] font-semibold hover:bg-[#744b41] transition-colors">
            Sign up
          </button>
        </div>

      </div>


      {/* Transparent Login Container */}
      <div className="relative z-10 w-full max-w-sm p-6 rounded-2xl bg-transparent text-white">
        <h1 className="text-2xl font-bold tracking-tight text-left text-[#171717]">
          Log in
        </h1>
        <p className="text-xs text-left text-zinc-300 mt-1 mb-5">
          Welcome back! Please enter your details.
        </p>

        {/* Form Inputs & Actions */}
        <div className="flex flex-col gap-3.5">
          <p className="text-xs font-medium text-zinc-200">Email</p>
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-3.5 py-2 text-sm rounded-lg bg-white/15 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/50"
          />

          <p className="text-xs font-medium text-zinc-200">Password</p>
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3.5 py-2 text-sm rounded-lg bg-white/15 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/50"
          />

          <div className="flex items-center justify-between text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <input type="checkbox" name="remember" id="remember" className="accent-zinc-500" />
              <label htmlFor="remember">Remember for 30 days</label>
            </div>
            <a href="#" className="hover:underline">Forgot Password?</a>
          </div>

          <button className="w-full py-2 mt-1 text-sm font-medium text-white bg-[#5A3A33] rounded-lg hover:bg-zinc-200 transition-colors">
            Sign In
          </button>

          <button className="w-full py-2 text-sm font-medium text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            Sign In with Google
          </button>

          <div className="flex gap-2 pt-3 justify-center text-xs text-zinc-300">
            <p>Don't have an account?</p>
            <a href="#" className="text-black font-medium hover:underline">Sign Up</a>
          </div>
        </div>
      </div>

    </main>
  );
}