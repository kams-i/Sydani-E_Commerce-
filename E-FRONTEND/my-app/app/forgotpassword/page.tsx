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
                    <a href="/" className="text-white px-3 py-1.5 text-xs rounded-lg bg-[#5C3A31] font-semibold hover:bg-[#744b41] transition-colors">
                        Log in
                    </a>
                </div>

            </div>


            {/* Forgot Password Container with Light Background */}
            <div className="relative z-10 w-full max-w-sm p-6 rounded-2xl border-2 border-[#5C3A31] bg-[#E8C6B5B2] shadow-xl text-zinc-900">
                <h1 className="text-2xl font-bold tracking-tight text-left text-[#171717]">
                    Forgot password?
                </h1>
                <p className="text-xs text-left text-zinc-700 mt-1 mb-5">
                    No worries, we'll send you reset instructions.
                </p>

                {/* Form Inputs & Actions */}
                <div className="flex flex-col gap-3.5">
                    <p className="text-xs font-medium text-zinc-800">Email</p>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-3.5 py-2 text-sm rounded-lg bg-white/70 border border-[#5C3A31]/30 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#5C3A31]"
                    />

                    <button className="w-full py-2 mt-2 text-sm font-medium text-white bg-[#5A3A33] rounded-lg hover:bg-[#744b41] transition-colors">
                        Reset password
                    </button>

                    <div className="flex gap-2 pt-3 justify-center text-xs text-zinc-700">
                        <p>Back to</p>
                        <a href="/" className="text-[#5A3A33] font-semibold hover:underline">Log in</a>
                    </div>
                </div>
            </div>

        </main>
    );
}