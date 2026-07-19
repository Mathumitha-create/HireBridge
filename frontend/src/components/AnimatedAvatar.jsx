import React, { useState, useEffect, useRef } from 'react';

const AnimatedAvatar = ({ text, isSpeaking, currentCharIndex }) => {
    const [isBlinking, setIsBlinking] = useState(false);
    const [visemeIndex, setVisemeIndex] = useState(0);
    const [transform, setTransform] = useState({ x: 0, y: 0, r: 0, s: 1 });
    const [breathing, setBreathing] = useState(0);
    const audioSyncRef = useRef(null);
    const lastWordRef = useRef('');

    // 3x3 Grid Mapping
    const visemeMap = [
        { row: 0, col: 0 }, // 0: Neutral
        { row: 0, col: 1 }, // 1: Ah (Open)
        { row: 0, col: 2 }, // 2: Oh (Round)
        { row: 1, col: 1 }, // 3: Oo (Pucker)
        { row: 1, col: 0 }, // 4: Ee (Wide)
        { row: 1, col: 2 }, // 5: Mid/Dental
        { row: 2, col: 0 }, // 6: F/V (Labiodental)
        { row: 2, col: 1 }, // 7: M/P/B (Pressed)
        { row: 2, col: 2 }, // 8: Smile (End)
    ];

    // Natural idle breathing & blinking
    useEffect(() => {
        let blinkTimeout;
        const blink = () => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 120);
            blinkTimeout = setTimeout(blink, 3000 + Math.random() * 4000);
        };
        blink();

        const breatheInterval = setInterval(() => {
            setBreathing(prev => (prev + 0.05) % (Math.PI * 2));
        }, 30);

        return () => {
            clearTimeout(blinkTimeout);
            clearInterval(breatheInterval);
        };
    }, []);

    // Syllable-Driven Viseme Engine
    useEffect(() => {
        if (!isSpeaking || currentCharIndex === -1 || !text) {
            // Smooth transition back to neutral/smile
            const timeout = setTimeout(() => setVisemeIndex(text ? 8 : 0), 200);
            return () => clearTimeout(timeout);
        }

        const currentWord = text.substring(currentCharIndex).split(' ')[0].toLowerCase().replace(/[.,!?]/g, '');
        if (currentWord === lastWordRef.current) return;
        lastWordRef.current = currentWord;

        // Phoneme extraction logic
        const playPhonemes = async () => {
            const phonemes = [];
            for (let i = 0; i < currentWord.length; i++) {
                const char = currentWord[i];
                const next = currentWord[i + 1];

                if (['a', 'e', 'i'].includes(char)) phonemes.push(1);
                else if (['o'].includes(char)) phonemes.push(2);
                else if (['u', 'w'].includes(char)) phonemes.push(3);
                else if (['f', 'v'].includes(char)) phonemes.push(6);
                else if (['m', 'p', 'b'].includes(char)) phonemes.push(7);
                else if (['s', 'z', 'l', 't', 'd'].includes(char)) phonemes.push(5);
                else phonemes.push(4);
            }

            // High-speed syllable reproduction
            let pIndex = 0;
            const step = () => {
                if (pIndex >= phonemes.length || !isSpeaking) return;

                const target = phonemes[pIndex];
                setVisemeIndex(target);

                // Audio-reactive micro-movements (Head nods on stress)
                if (target === 1 || target === 2) {
                    setTransform(prev => ({
                        ...prev,
                        y: 1.5, // Natural jaw drop micro-nod
                        s: 1.01 // Cheek expansion
                    }));
                } else {
                    setTransform(prev => ({ ...prev, y: 0, s: 1 }));
                }

                pIndex++;
                setTimeout(step, 60 + Math.random() * 30); // Dynamic phoneme duration
            };
            step();
        };

        playPhonemes();

    }, [currentCharIndex, isSpeaking, text]);

    const currentPos = visemeMap[visemeIndex];

    return (
        <div className="relative w-full h-full flex items-center justify-center rounded-[40px] overflow-hidden shadow-2xl bg-[#06080E]">
            {/* The Spritesheet Container */}
            <div
                className="absolute w-[300%] h-[300%] transition-opacity duration-300"
                style={{
                    top: `-${currentPos.row * 100}%`,
                    left: `-${currentPos.col * 100}%`,
                    transform: `
                        scale(${(1.02 + Math.sin(breathing) * 0.003) * transform.s}) 
                        translateY(${transform.y}px)
                        rotate(${Math.sin(breathing * 0.5) * 0.1}deg)
                    `,
                    transition: 'top 0.05s steps(1), left 0.05s steps(1), transform 0.1s ease-out'
                }}
            >
                <img
                    src="/interviewer_v3.png"
                    alt="AI Interviewer"
                    className="w-full h-full object-cover contrast-[1.08] brightness-[1.02] saturate-[1.05]"
                />
            </div>

            {/* Realistic Blinking Overlay (Perfectly synced with base image) */}
            <div className="absolute inset-0 pointer-events-none z-10">
                {/* Left Eyelid */}
                <div
                    className="absolute transition-all duration-100 ease-out"
                    style={{
                        top: '29.4%', left: '43.1%', width: '3.9%',
                        height: isBlinking ? '1.8%' : '0%',
                        background: 'rgba(45, 35, 30, 0.98)',
                        borderRadius: '100%', filter: 'blur(2px)',
                        transform: `scale(${transform.s})`
                    }}
                />
                {/* Right Eyelid */}
                <div
                    className="absolute transition-all duration-100 ease-out"
                    style={{
                        top: '29.4%', left: '52.7%', width: '3.9%',
                        height: isBlinking ? '1.8%' : '0%',
                        background: 'rgba(45, 35, 30, 0.98)',
                        borderRadius: '100%', filter: 'blur(2px)',
                        transform: `scale(${transform.s})`
                    }}
                />
            </div>

            {/* Cinematic Lighting & Polish */}
            <div className="absolute inset-0 pointer-events-none z-20">
                {/* Shallow depth of field simulation */}
                <div className="absolute inset-0 bg-radial-vignette opacity-40"></div>

                {/* Professional Spotlight */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-spotlight"></div>

                {/* Grain for film-like texture */}
                <div className="absolute inset-0 opacity-[0.03] bg-noise pointer-events-none"></div>
            </div>

            {/* Frame & Status Signal */}
            <div className="absolute inset-x-0 top-8 flex justify-center z-30 opacity-60">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md">
                    <div className={`h-1.5 w-1.5 rounded-full ${isSpeaking ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                    <span className="text-[9px] font-bold tracking-widest text-white/70 uppercase">
                        {isSpeaking ? 'Direct Audio Stream' : 'Connection Active'}
                    </span>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .bg-radial-vignette {
                    background: radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.6) 100%);
                }
                .bg-radial-spotlight {
                    background: radial-gradient(circle at center, rgba(91, 91, 255, 0.08) 0%, transparent 60%);
                }
                .bg-noise {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                }
                @keyframes waveform {
                    0%, 100% { transform: scaleY(0.6); opacity: 0.4; }
                    50% { transform: scaleY(1.4); opacity: 0.8; }
                }
                .animate-waveform {
                    animation: waveform 0.2s ease-in-out infinite;
                }
            `}} />
        </div>
    );
};

export default AnimatedAvatar;
