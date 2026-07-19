import React, { useState, useEffect } from 'react';

const CodeEditor = ({ initialCode, questionType, onCodeSubmit }) => {
    const [code, setCode] = useState(initialCode || '');
    const [isEditing, setIsEditing] = useState(false);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        setCode(initialCode || '');
        setIsEditing(false);
        setFeedback(null);
    }, [initialCode]);

    const handleTest = () => {
        // Simulate testing the code
        setFeedback({
            status: 'info',
            message: 'Code captured. Explain your solution verbally when ready.'
        });
        
        // Pass the code to parent component
        if (onCodeSubmit) {
            onCodeSubmit(code);
        }
    };

    const handleReset = () => {
        setCode(initialCode || '');
        setFeedback(null);
    };

    return (
        <div className="mt-4 rounded-2xl bg-[#0a0e1a] border border-white/10 overflow-hidden">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#12182b] border-b border-white/10">
                <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#5B5BFF]">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                    <span className="text-[10px] font-bold tracking-widest text-white uppercase">
                        {questionType === 'debugging' ? '🐛 Debug Mode' : '💻 Code Editor'}
                    </span>
                    {isEditing && (
                        <span className="text-[8px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full uppercase font-bold">
                            Editing
                        </span>
                    )}
                </div>
                
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#5B5BFF]/20 text-[#5B5BFF] rounded-lg hover:bg-[#5B5BFF]/30 transition-all"
                    >
                        {isEditing ? '✓ Done' : '✏️ Edit'}
                    </button>
                    
                    {isEditing && (
                        <button
                            onClick={handleReset}
                            className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-all"
                        >
                            ↺ Reset
                        </button>
                    )}
                    
                    <button
                        onClick={handleTest}
                        className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        Submit Code
                    </button>
                </div>
            </div>

            {/* Code Editor Area */}
            <div className="relative">
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={!isEditing}
                    spellCheck="false"
                    className="w-full h-64 p-4 bg-[#0a0e1a] text-white/90 font-mono text-[13px] leading-relaxed resize-none focus:outline-none disabled:cursor-default overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                    style={{
                        tabSize: 4,
                        MozTabSize: 4,
                    }}
                />
                
                {/* Line numbers overlay (visual only) */}
                <div className="absolute top-0 left-0 p-4 pointer-events-none select-none">
                    <div className="font-mono text-[13px] leading-relaxed text-white/20">
                        {code.split('\n').map((_, i) => (
                            <div key={i}>{i + 1}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Feedback Area */}
            {feedback && (
                <div className={`px-4 py-3 border-t border-white/10 ${
                    feedback.status === 'success' ? 'bg-emerald-500/10' :
                    feedback.status === 'error' ? 'bg-red-500/10' :
                    'bg-blue-500/10'
                }`}>
                    <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${
                            feedback.status === 'success' ? 'text-emerald-400' :
                            feedback.status === 'error' ? 'text-red-400' :
                            'text-blue-400'
                        }`}>
                            {feedback.status === 'success' ? '✓' : 
                             feedback.status === 'error' ? '✗' : 'ℹ'}
                        </div>
                        <div className="flex-1">
                            <p className="text-[12px] text-white/80 font-medium">
                                {feedback.message}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="px-4 py-3 bg-[#12182b]/50 border-t border-white/10">
                <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 mt-0.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <div className="flex-1">
                        <p className="text-[11px] text-white/40 leading-relaxed">
                            {questionType === 'debugging' 
                                ? 'Click Edit to modify the code. Identify the bug, fix it, then Submit Code and explain your reasoning verbally.'
                                : 'Click Edit to write your solution. Complete the implementation, then Submit Code and explain your approach verbally.'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
