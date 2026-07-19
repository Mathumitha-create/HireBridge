import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const DIDAvatar = ({ text, isSpeaking, onSpeakingComplete, avatarUrl }) => {
    const [videoUrl, setVideoUrl] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasError, setHasError] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (text && isSpeaking) {
            generateVideo(text);
        }
    }, [text, isSpeaking]);

    const speakWithTTS = (inputText) => {
        if (typeof window === 'undefined') {
            if (onSpeakingComplete) onSpeakingComplete();
            return;
        }

        const synth = window.speechSynthesis;
        const Utterance = window.SpeechSynthesisUtterance;

        if (!synth || !Utterance) {
            if (onSpeakingComplete) onSpeakingComplete();
            return;
        }

        try {
            synth.cancel();
            const utterance = new Utterance(inputText);
            utterance.lang = 'en-US';
            utterance.rate = 1;
            utterance.pitch = 1;

            const voices = synth.getVoices?.() || [];
            const preferredVoice = voices.find(v => /en-US/i.test(v.lang) && /male|guy|david|mark|ryan/i.test(v.name));
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }

            utterance.onend = () => {
                if (onSpeakingComplete) onSpeakingComplete();
            };

            utterance.onerror = () => {
                if (onSpeakingComplete) onSpeakingComplete();
            };

            synth.speak(utterance);
        } catch (e) {
            // Swallow TTS errors to avoid red console noise during demos
            if (onSpeakingComplete) onSpeakingComplete();
        }
    };

    const generateVideo = async (inputText) => {
        setIsGenerating(true);
        setHasError(false);
        try {
            const response = await axios.post('/api/did/talk', {
                scriptText: inputText,
                avatarUrl: avatarUrl || undefined,
            });

            const data = response.data || {};

            // Backend is currently hard-wired to fallback mode.
            // If a real videoUrl ever arrives in future, we'll play it;
            // otherwise we treat this as a normal static-avatar flow.
            if (data.videoUrl && !data.fallback) {
                setVideoUrl(data.videoUrl);
            } else {
                setHasError(true);
                speakWithTTS(inputText);
            }
        } catch (error) {
            // Graceful fallback to TTS when D-ID is unavailable
            console.log('Using text-to-speech fallback (D-ID unavailable)');
            setHasError(true);
            speakWithTTS(inputText);
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        if (videoUrl && videoRef.current) {
            videoRef.current.play();

            videoRef.current.onended = () => {
                if (onSpeakingComplete) {
                    onSpeakingComplete();
                }
            };
        }
    }, [videoUrl]);

    return (
        <div className="relative w-full h-full">
            {isGenerating && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-20 h-20 rounded-full bg-[#5B5BFF]/30 animate-pulse mb-3"></div>
                    <p className="text-xs text-white/70 tracking-wide">Preparing interviewer...</p>
                </div>
            )}

            {videoUrl ? (
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    muted={false}
                    controls={false}
                />
            ) : (
                <div className="relative w-full h-full">
                    <img
                        src={avatarUrl || (hasError ? '/interviewer.png' : '/interviewer.png')}
                        alt="AI Interviewer"
                        className="w-full h-full object-cover"
                    />
                    {hasError && (
                        <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-[10px] text-white/80">
                            Voice-only mode
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DIDAvatar;
