export default function Bottombar() {
    return (
        <footer className="w-full bg-[#5A3A33] text-white pt-6 pb-10 border-t border-[#5C3A31]/40 mt-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col gap-8">

                {/* Learn more link top center */}
                <div className="text-center">
                    <a href="#" className="text-sm font-semibold underline underline-offset-4 hover:text-[#D2CFC6] transition-colors">
                        Learn more about us
                    </a>
                </div>

                {/* Footer Columns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">

                    {/* Column 1: App Promo Box */}
                    <div className="md:col-span-1 bg-white text-zinc-900 p-5 rounded-xl shadow-md flex items-center justify-center">
                        <img
                            src="/Frame 315.png"
                            alt="App Promo"
                            className="w-full h-auto object-contain"
                        />
                    </div>

                    {/* Column 2: Help & Information */}
                    <div className="flex flex-col gap-2.5 text-xs">
                        <p className="font-bold tracking-wider text-white/90">HELP & INFORMATION</p>
                        <a href="#" className="text-white/70 hover:text-white transition-colors">Help</a>
                        <a href="#" className="text-white/70 hover:text-white transition-colors">Track order</a>
                        <a href="#" className="text-white/70 hover:text-white transition-colors">Delivery & returns</a>
                        <a href="#" className="text-white/70 hover:text-white transition-colors">Sitemap</a>
                    </div>

                    {/* Column 3: About */}
                    <div className="flex flex-col gap-2.5 text-xs">
                        <p className="font-bold tracking-wider text-white/90">ABOUT</p>
                        <a href="#" className="text-white/70 hover:text-white transition-colors">About us</a>
                        <a href="#" className="text-white/70 hover:text-white transition-colors">Corporate responsibility</a>
                        <a href="#" className="text-white/70 hover:text-white transition-colors">Careers at Hair Haven</a>
                    </div>

                    {/* Column 4: More From Hair Haven */}
                    <div className="flex flex-col gap-2.5 text-xs">
                        <p className="font-bold tracking-wider text-white/90">MORE FROM HAIR HAVEN</p>
                        <a href="#" className="text-white/70 hover:text-white transition-colors">Hair Haven App</a>
                        <a href="#" className="text-white/70 hover:text-white transition-colors">Gift vouchers</a>
                        <a href="#" className="text-white/70 hover:text-white transition-colors">Black Friday</a>
                    </div>

                    {/* Column 5: Shopping From */}
                    <div className="flex flex-col gap-3 text-xs">
                        <p className="font-bold tracking-wider text-white/90">SHOPPING FROM:</p>
                        <div className="flex items-center gap-2 text-white/80">
                            <span>You're in 🇳🇬</span>
                            <span className="text-white font-bold cursor-pointer hover:underline">| CHANGE</span>
                        </div>
                        <p className="text-white/60 pt-1">Some other countries:</p>
                        <div className="grid grid-cols-4 gap-2 text-base">
                            <span>🇦🇺</span><span>🇵🇾</span><span>🇮🇪</span><span>🇲🇾</span>
                            <span>🇦🇺</span><span>🇵🇾</span><span>🇮🇪</span><span>🇲🇾</span>
                        </div>
                    </div>

                </div>

            </div>
        </footer>
    );
}