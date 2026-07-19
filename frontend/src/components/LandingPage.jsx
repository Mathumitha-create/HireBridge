import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black font-['Inter'] text-white">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/office-bg.png')",
                }}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 flex w-full items-center justify-between px-12 py-8 animate-fade-in">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-xl font-bold backdrop-blur-md border border-white/20">
                        H
                    </div>
                    <span className="text-sm font-semibold tracking-[0.2em]">HIREBRIDGE STUDIO</span>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-1.5 backdrop-blur-md">
                    <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                    <span className="text-[10px] font-bold tracking-widest text-white/50">AI ENGINE ONLINE</span>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex h-[calc(100vh-160px)] flex-col items-center justify-center px-6 text-center">
                {/* Top Badge */}
                <div className="mb-8 animate-fade-in [animation-delay:200ms]">
                    <span className="rounded-full border border-blue-500/30 bg-blue-500/5 px-6 py-1.5 text-[10px] font-bold tracking-[0.3em] text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        THE EXECUTIVE STANDARD
                    </span>
                </div>

                {/* Main Heading */}
                <h1 className="mb-6 text-7xl font-black tracking-tighter sm:text-8xl md:text-9xl animate-fade-in [animation-delay:400ms]">
                    <span>HIRE</span>
                    <span className="text-gradient">BRIDGE</span>
                </h1>

                {/* Tagline */}
                <p className="mb-12 max-w-2xl text-lg font-light italic text-white/60 animate-fade-in [animation-delay:600ms]">
                    "Where placement preparation meets <span className="font-semibold not-italic text-white">technical excellence</span>."
                </p>

                {/* Primary CTA */}
                <div className="animate-fade-in [animation-delay:800ms]">
                    <button
                        className="glow-on-hover group relative flex items-center justify-center overflow-hidden rounded-full bg-white px-10 py-4 transition-all duration-300 cursor-pointer"
                        onClick={() => navigate('/login')}
                    >
                        <span className="text-sm font-bold tracking-widest text-black">ENTER ASSESSMENT STUDIO</span>
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="absolute bottom-10 left-0 right-0 z-10 flex justify-center animate-fade-in [animation-delay:1000ms]">
                <span className="text-[10px] font-medium tracking-[0.4em] text-white/20">SYSTEM VERSION 4.0.2-B</span>
            </footer>
        </div>
    );
};

export default LandingPage;
