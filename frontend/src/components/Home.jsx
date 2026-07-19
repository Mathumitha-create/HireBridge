import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [selectedFocus, setSelectedFocus] = useState('Software Developer');
    const [resumeFile, setResumeFile] = useState(null);
    const [uploadError, setUploadError] = useState('');
    const [isValidating, setIsValidating] = useState(false);

    const focusAreas = [
        'Software Developer',
        'Data Analyst',
        'AI / ML Engineer',
        'HR / Management'
    ];

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        setUploadError('');

        if (!file) {
            return;
        }

        // Validate file type
        if (file.type !== 'application/pdf') {
            setUploadError('Invalid file format. Please upload a PDF file only.');
            setResumeFile(null);
            event.target.value = '';
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            setUploadError('File size exceeds 5MB. Please upload a smaller file.');
            setResumeFile(null);
            event.target.value = '';
            return;
        }

        // Validate resume content via backend
        setIsValidating(true);
        const formData = new FormData();
        formData.append('resume', file);

        try {
            const response = await fetch('/api/validate-resume', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok || !data.valid) {
                setUploadError(data.error || 'This does not appear to be a valid resume.');
                setResumeFile(null);
                event.target.value = '';
                setIsValidating(false);
                return;
            }

            // File is valid resume
            setResumeFile(file);
            setUploadError('');
            setIsValidating(false);

        } catch (error) {
            console.error('Resume validation error:', error);
            setUploadError('Failed to validate resume. Please check your connection and try again.');
            setResumeFile(null);
            event.target.value = '';
            setIsValidating(false);
        }
    };

    const removeFile = () => {
        setResumeFile(null);
        setUploadError('');
        // Reset the file input
        const fileInput = document.getElementById('resume-upload');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleStartAssessment = async () => {
        if (!resumeFile) {
            setUploadError('⚠️ You must upload a resume to proceed with the assessment.');
            return;
        }

        // Read PDF as text so Interview can pass it to Gemini
        try {
            const arrayBuffer = await resumeFile.arrayBuffer();
            // Send to backend to extract text (reuse validate-resume endpoint response)
            const formData = new FormData();
            formData.append('resume', resumeFile);
            const res = await fetch('/api/extract-resume-text', {
                method: 'POST',
                body: formData,
            });
            let resumeText = '';
            if (res.ok) {
                const data = await res.json();
                resumeText = data.text || '';
            }
            navigate('/interview', {
                state: {
                    role: selectedFocus,
                    resumeText,
                    resumeFileName: resumeFile.name,
                },
            });
        } catch (err) {
            console.error('Failed to extract resume text:', err);
            // Navigate anyway — interview will work without resume text
            navigate('/interview', { state: { role: selectedFocus, resumeText: '', resumeFileName: resumeFile.name } });
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#0B1020] font-['Inter'] text-white overflow-hidden">
            {/* Left Section (60%) */}
            <div className="relative hidden w-3/5 lg:block">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
                    style={{ backgroundImage: "url('/home-bg.png')" }}
                >
                    {/* Gradient Overlay from right to left */}
                    <div className="absolute inset-0 bg-gradient-to-l from-[#0B1020] via-[#0B1020]/80 to-transparent"></div>
                    <div className="absolute inset-0 backdrop-blur-[1px]"></div>
                </div>

                {/* Left Content */}
                <div className="relative z-10 flex h-full flex-col justify-end p-16 animate-fade-in">
                    <div className="mb-4">
                        <span className="rounded-full border border-white/20 bg-white/5 px-4 py-1 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">
                            Professional Selection
                        </span>
                    </div>

                    <h1 className="mb-4 text-5xl font-black tracking-tight leading-tight xl:text-6xl">
                        TAILORED TO <br />
                        <span className="text-gradient">YOUR CAREER</span>
                    </h1>

                    <p className="max-w-md text-base font-light leading-relaxed text-white/60">
                        Our AI recruiter adapts difficulty and specialized questioning based on your career focus and injected resume context.
                    </p>
                </div>
            </div>

            {/* Right Section (40%) */}
            <div className="relative flex w-full flex-col items-center justify-center bg-[#0B1020] p-6 lg:w-2/5 lg:p-10">
                <div className="w-full max-w-md animate-fade-in [animation-delay:200ms]">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold tracking-tight text-white mb-1 uppercase lg:text-2xl">Session Profile</h2>
                        <p className="text-xs text-white/40 italic font-light tracking-wide lg:text-sm">
                            "Configure your assessment parameters below."
                        </p>
                    </div>

                    <div className="space-y-6 lg:space-y-8">
                        {/* Focus Area Selection */}
                        <div>
                            <label className="mb-3 block text-[9px] font-bold tracking-[0.3em] text-white/30 uppercase">
                                Select Focus Area
                            </label>
                            <div className="grid grid-cols-1 gap-2 lg:gap-3">
                                {focusAreas.map((area) => (
                                    <button
                                        key={area}
                                        onClick={() => setSelectedFocus(area)}
                                        className={`group relative flex w-full items-center justify-between rounded-xl border px-5 py-3 transition-all duration-300 ${selectedFocus === area
                                            ? 'border-[#5B5BFF]/50 bg-[#5B5BFF]/10 shadow-[0_0_20px_rgba(91,91,255,0.1)]'
                                            : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10'
                                            }`}
                                    >
                                        <span className={`text-xs font-medium transition-colors lg:text-sm ${selectedFocus === area ? 'text-white' : 'text-white/50 group-hover:text-white/80'
                                            }`}>
                                            {area}
                                        </span>
                                        {selectedFocus === area && (
                                            <div className="h-1.5 w-1.5 rounded-full bg-[#5B5BFF] shadow-[0_0_8px_#5B5BFF]"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Resume Upload */}
                        <div>
                            <label className="mb-3 block text-[9px] font-bold tracking-[0.3em] text-white/30 uppercase">
                                Context Injection (Resume)
                            </label>


                            {isValidating ? (
                                <div className="rounded-2xl border border-[#5B5BFF]/30 bg-[#5B5BFF]/5 p-6 animate-fade-in">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-[#5B5BFF]"></div>
                                        <div className="text-center">
                                            <p className="text-xs font-semibold text-white/80 lg:text-sm">Validating Resume...</p>
                                            <p className="mt-0.5 text-[10px] text-white/40">Checking document content</p>
                                        </div>
                                    </div>
                                </div>
                            ) : !resumeFile ? (
                                <label
                                    htmlFor="resume-upload"
                                    className="group cursor-pointer rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.04] hover:border-white/10 block"
                                >
                                    <input
                                        id="resume-upload"
                                        type="file"
                                        accept=".pdf,application/pdf"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/40 group-hover:text-white/60 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-semibold text-white/80 group-hover:text-white lg:text-sm">Attach PDF Document</p>
                                            <p className="mt-0.5 text-[10px] text-white/30">Enable personalized questioning</p>
                                        </div>
                                    </div>
                                </label>
                            ) : (
                                <div className="rounded-2xl border border-[#5B5BFF]/30 bg-[#5B5BFF]/5 p-4 animate-fade-in">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5B5BFF]/20">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#5B5BFF]">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                    <polyline points="14 2 14 8 20 8"></polyline>
                                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                                    <polyline points="10 9 9 9 8 9"></polyline>
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-white truncate lg:text-sm">{resumeFile.name}</p>
                                                <p className="text-[10px] text-white/40 mt-0.5">{(resumeFile.size / 1024).toFixed(2)} KB</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={removeFile}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/40 transition-all hover:bg-red-500/20 hover:text-red-400"
                                            title="Remove file"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {uploadError && (
                                <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 animate-fade-in shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                    <div className="flex items-start gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 flex-shrink-0 mt-0.5">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                        </svg>
                                        <p className="text-xs text-red-400 font-medium">{uploadError}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Primary CTA */}
                        <div className="pt-2">
                            <button
                                onClick={handleStartAssessment}
                                className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-[#5B5BFF] to-[#8b5cf6] px-6 py-4 shadow-[0_0_30px_rgba(91,91,255,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(91,91,255,0.5)]"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-white uppercase lg:text-sm">
                                    Start Full Assessment
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
