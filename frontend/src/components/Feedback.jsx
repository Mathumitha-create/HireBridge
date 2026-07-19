import React from 'react';

const Feedback = ({ evaluation, onRestart }) => {
    if (!evaluation) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0B1020]">
                <div className="w-24 h-24 mb-10 relative">
                    <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#5B5BFF] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Compiling Assessment</h2>
                <p className="text-slate-500 font-medium tracking-wide">Evaluating your professional performance...</p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-[#0B1020] overflow-y-auto">
            {/* Background with Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B1020]/80 via-[#0B1020]/90 to-[#0B1020]"></div>

            {/* Content */}
            <div className="relative z-10 min-h-screen px-8 lg:px-20 py-16">
                <div className="max-w-[1400px] mx-auto">

                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-16">
                        <div className="space-y-3">
                            <span className="text-[11px] font-bold text-[#5B5BFF] uppercase tracking-[0.4em] block">
                                SESSION INSIGHT REPORT
                            </span>
                            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                                PERFORMANCE<br />DASHBOARD
                            </h1>
                            <p className="text-lg md:text-xl text-slate-400 font-medium tracking-tight mt-4">
                                Technical Assessment for Software Developer
                            </p>
                        </div>

                        {/* Score Card */}
                        <div className="bg-[#1a2332]/80 backdrop-blur-xl px-16 py-12 rounded-[2rem] border border-[#5B5BFF]/20 text-center min-w-[320px]">
                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4">
                                {evaluation.rating || 'OVERALL SCORE'}
                            </span>
                            <div className="flex items-center justify-center">
                                <span className="text-7xl md:text-8xl font-black text-white tracking-tighter leading-none">
                                    {evaluation.score || 0}
                                </span>
                                <span className="text-3xl md:text-4xl font-black text-[#5B5BFF] ml-2 mt-4">%</span>
                            </div>
                            
                            {/* Additional Metrics */}
                            {(evaluation.totalQuestions || evaluation.answeredQuestions) && (
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <div className="text-xs text-slate-400 mb-2">
                                        Questions Answered: {evaluation.answeredQuestions || 0} / {evaluation.totalQuestions || 0}
                                    </div>
                                    {evaluation.interviewDuration && (
                                        <div className="text-xs text-slate-400">
                                            Duration: {evaluation.interviewDuration} minutes
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

                        {/* Skill Scores - Only show if available */}
                        {(evaluation.technicalScore || evaluation.communicationScore || evaluation.problemSolvingScore) && (
                            <div className="bg-[#1a2332]/60 backdrop-blur-xl rounded-[2rem] p-10 border-t-4 border-blue-500/40 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                                
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-8">
                                        <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>

                                    <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">
                                        SKILL BREAKDOWN
                                    </h3>

                                    <div className="space-y-6">
                                        {evaluation.technicalScore !== undefined && (
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-slate-300 font-medium">Technical Knowledge</span>
                                                    <span className="text-white font-bold">{evaluation.technicalScore}/10</span>
                                                </div>
                                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500" style={{width: `${(evaluation.technicalScore / 10) * 100}%`}}></div>
                                                </div>
                                            </div>
                                        )}
                                        {evaluation.communicationScore !== undefined && (
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-slate-300 font-medium">Communication</span>
                                                    <span className="text-white font-bold">{evaluation.communicationScore}/10</span>
                                                </div>
                                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500" style={{width: `${(evaluation.communicationScore / 10) * 100}%`}}></div>
                                                </div>
                                            </div>
                                        )}
                                        {evaluation.problemSolvingScore !== undefined && (
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-slate-300 font-medium">Problem Solving</span>
                                                    <span className="text-white font-bold">{evaluation.problemSolvingScore}/10</span>
                                                </div>
                                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-purple-500" style={{width: `${(evaluation.problemSolvingScore / 10) * 100}%`}}></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Key Assets Card */}
                        <div className="bg-[#1a2332]/60 backdrop-blur-xl rounded-[2rem] p-10 border-t-4 border-emerald-500/40 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-8">
                                    <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>

                                <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">
                                    KEY ASSETS
                                </h3>

                                <ul className="space-y-5">
                                    {evaluation.strengths && evaluation.strengths.map((strength, i) => (
                                        <li key={i} className="flex items-start gap-4">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></div>
                                            <p className="text-slate-300 text-lg font-medium leading-relaxed">
                                                {strength}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Optimization Opportunities Card */}
                        <div className="bg-[#1a2332]/60 backdrop-blur-xl rounded-[2rem] p-10 border-t-4 border-amber-500/40 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mb-8">
                                    <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>

                                <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">
                                    OPTIMIZATION OPPORTUNITIES
                                </h3>

                                <ul className="space-y-5">
                                    {evaluation.improvements && evaluation.improvements.map((improvement, i) => (
                                        <li key={i} className="flex items-start gap-4">
                                            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 shrink-0"></div>
                                            <p className="text-slate-300 text-lg font-medium leading-relaxed">
                                                {improvement}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Expert Conclusion */}
                    <div className="bg-[#1a2332]/60 backdrop-blur-xl rounded-[2.5rem] p-14 relative overflow-hidden mb-12">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5B5BFF]/5 rounded-full blur-3xl -mr-48 -mt-48"></div>

                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black text-[#5B5BFF] uppercase tracking-[0.4em] mb-6">
                                EXPERT CONCLUSION
                            </h3>
                            <p className="text-xl md:text-2xl font-bold text-white leading-tight tracking-tight">
                                <span className="text-[#5B5BFF] text-4xl block mb-3">"</span>
                                {evaluation.recommendation}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-6 pb-16">
                        <button
                            onClick={onRestart}
                            className="group px-12 py-6 bg-white text-slate-950 font-black text-lg rounded-2xl hover:bg-[#5B5BFF] hover:text-white transition-all duration-500 hover:scale-105 shadow-2xl flex items-center gap-4"
                        >
                            <svg className="w-6 h-6 transition-transform group-hover:rotate-180 duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Start New Evaluation
                        </button>

                        <button
                            onClick={() => window.location.href = '/home'}
                            className="px-12 py-6 bg-[#1a2332]/80 backdrop-blur-xl border-2 border-white/10 text-white font-black text-lg rounded-2xl hover:bg-[#1a2332] hover:border-[#5B5BFF]/50 transition-all duration-500 hover:scale-105 shadow-2xl"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
