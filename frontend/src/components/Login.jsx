import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const Login = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState('login'); // 'login' | 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); 

        try {
            if (mode === 'signup') {
                const userCred = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCred.user;

                // Store basic profile in Firestore for analytics / personalization
                await setDoc(doc(db, 'users', user.uid), {
                    uid: user.uid,
                    email: user.email,
                    fullName: fullName || null,
                    authType: 'email_password',
                    createdAt: new Date().toISOString(),
                });
            } else {
                // Login flow: ensure a Firestore user document also exists
                const userCred = await signInWithEmailAndPassword(auth, email, password);
                const user = userCred.user;

                const userRef = doc(db, 'users', user.uid);
                const snap = await getDoc(userRef);
                if (!snap.exists()) {
                    await setDoc(userRef, {
                        uid: user.uid,
                        email: user.email,
                        fullName: null,
                        authType: 'email_password',
                        createdAt: new Date().toISOString(),
                    });
                }
            }

            // On successful auth, send user to role selection / home
            navigate('/home');
        } catch (err) {
            console.error('Auth error:', err);
            const code = err.code;
            if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
                setError('Incorrect email or password. Please try again.');
            } else if (code === 'auth/email-already-in-use') {
                setError('This email is already registered. Please log in instead.');
            } else if (code === 'auth/weak-password') {
                setError('Password must be at least 6 characters.');
            } else if (code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else if (code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Please wait a moment and try again.');
            } else {
                setError('Unable to authenticate. Please check your details and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-[#0B1020] font-['Inter'] text-white">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
                style={{ backgroundImage: "url('/office-bg.png')" }}
            >
                <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full items-center justify-center px-4">
                <div className="w-full max-w-md rounded-4xl border border-white/5 bg-[#121624]/80 shadow-2xl backdrop-blur-2xl p-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-lg font-bold">
                                H
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold tracking-[0.25em] text-white/40 uppercase">HireBridge Studio</span>
                                <span className="text-xs text-white/70">Secure Candidate Access</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] font-semibold tracking-[0.2em] text-white/50 uppercase">AUTH ONLINE</span>
                        </div>
                    </div>

                    {/* Mode Toggle */}
                    <div className="mb-6 flex rounded-full bg-black/40 p-1 border border-white/10">
                        <button
                            type="button"
                            onClick={() => setMode('login')}
                            className={`flex-1 rounded-full px-3 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase transition-all ${mode === 'login'
                                    ? 'bg-white text-black shadow-[0_0_18px_rgba(255,255,255,0.25)]'
                                    : 'text-white/40'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('signup')}
                            className={`flex-1 rounded-full px-3 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase transition-all ${mode === 'signup'
                                    ? 'bg-white text-black shadow-[0_0_18px_rgba(255,255,255,0.25)]'
                                    : 'text-white/40'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'signup' && (
                            <div>
                                <label className="block text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full rounded-2xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#5B5BFF]"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full rounded-2xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#5B5BFF]"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter a secure password"
                                required
                                className="w-full rounded-2xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#5B5BFF]"
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full rounded-full bg-white py-3 text-[11px] font-bold tracking-[0.24em] text-black uppercase shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : mode === 'login' ? 'Enter Studio' : 'Create Account'}
                        </button>
                    </form>

                    <p className="mt-4 text-[10px] text-white/30 text-center tracking-[0.18em] uppercase">
                        Your credentials are used only to personalize your interview experience.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;