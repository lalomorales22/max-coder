import React, { useState, useEffect, useRef } from 'react';
import { TYPING_CHALLENGES, CODING_LANGUAGES } from '../constants';
import { storageService } from '../services/storageService';
import { UserProfile } from '../types';

interface VelocityTypingProps {
  onComplete: (xp: number, stars: number) => void;
  user: UserProfile; // Need user ID to save results
}

export const VelocityTyping: React.FC<VelocityTypingProps> = ({ onComplete, user }) => {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset state when language changes
    setUserInput('');
    setStartTime(null);
    setElapsedTime(0);
    setWpm(0);
    setCompleted(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [selectedLang]);

  // Timer Effect
  useEffect(() => {
    if (startTime && !completed) {
        timerRef.current = window.setInterval(() => {
            const now = Date.now();
            const elapsedSecs = (now - startTime) / 1000;
            setElapsedTime(elapsedSecs);
            
            // Live WPM Calc
            const words = userInput.length / 5;
            const minutes = elapsedSecs / 60;
            if (minutes > 0) {
                setWpm(Math.round(words / minutes));
            }
        }, 1000);
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, completed, userInput]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!selectedLang) return;
    if (!startTime) setStartTime(Date.now());
    
    const value = e.target.value;
    setUserInput(value);
    
    const targetCode = TYPING_CHALLENGES[selectedLang].code;

    // Use trimmed comparison to forgive trailing whitespace differences
    if (value.trim() === targetCode.trim()) {
      handleSuccess(value);
    }
  };

  const handleSuccess = async (finalInput: string) => {
    if (!selectedLang || completed) return;
    if (timerRef.current) clearInterval(timerRef.current);
    
    const targetCode = TYPING_CHALLENGES[selectedLang].code;
    const endTime = Date.now();
    const durationInMinutes = (endTime - (startTime || endTime)) / 60000;
    
    // Calculate words based on standard 5 chars per word
    const words = finalInput.length / 5; 
    const finalWpm = Math.round(words / (durationInMinutes || 0.001)); 
    
    setWpm(finalWpm);
    setCompleted(true);
    
    // Save Result
    await storageService.saveTypingResult({
        id: crypto.randomUUID(),
        userId: user.id,
        language: selectedLang,
        wpm: finalWpm,
        accuracy: 100, // Assuming correct since they finished
        timestamp: Date.now()
    });

    onComplete(50, 1);
  };

  const formatTime = (secs: number) => {
      const mins = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  const renderCode = () => {
    if (!selectedLang) return null;
    const targetCode = TYPING_CHALLENGES[selectedLang].code;

    return targetCode.split('').map((char, index) => {
      let color = 'text-gray-400';
      if (index < userInput.length) {
        color = userInput[index] === char ? 'text-toon-green' : 'text-toon-pink bg-black';
      }
      return (
        <span key={index} className={`font-mono text-xl md:text-2xl ${color}`}>
          {char}
        </span>
      );
    });
  };

  // Language Selection Screen
  if (!selectedLang) {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-8 overflow-y-auto">
            <h1 className="text-4xl font-fredoka text-black mb-2 text-center uppercase">Test Your Typing Speed</h1>
            <h2 className="text-5xl font-fredoka text-toon-purple mb-12 drop-shadow-sm transform -rotate-1 text-center font-black">CHOOSE YOUR WEAPON</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl w-full">
                {CODING_LANGUAGES.map((lang, idx) => (
                    <button
                        key={lang}
                        onClick={() => setSelectedLang(lang)}
                        className={`
                            p-8 rounded-xl border-4 border-black shadow-hard text-2xl font-black font-fredoka transition-transform hover:-translate-y-2 hover:shadow-hard-lg
                            ${idx % 3 === 0 ? 'bg-toon-cyan' : idx % 3 === 1 ? 'bg-toon-purple text-white' : 'bg-toon-yellow'}
                        `}
                    >
                        {lang}
                    </button>
                ))}
            </div>
        </div>
    );
  }

  // Typing Interface
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
      {/* HUD Bar */}
      <div className="flex justify-between items-center w-full max-w-5xl mb-6 bg-toon-yellow border-4 border-black p-4 rounded-2xl shadow-hard">
        <button onClick={() => setSelectedLang(null)} className="bg-white border-4 border-black px-4 py-2 font-bold hover:translate-y-1">
            ← BACK
        </button>
        
        <div className="flex gap-8">
            <div className="flex flex-col items-center">
                <span className="text-xs font-black uppercase">Time</span>
                <span className="text-2xl font-mono font-bold">{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-xs font-black uppercase">WPM</span>
                <span className="text-2xl font-mono font-bold text-toon-purple">{wpm}</span>
            </div>
        </div>

        <h2 className="text-2xl font-fredoka text-black uppercase hidden md:block">{selectedLang}</h2>
      </div>
      
      <div className="bg-white border-4 border-black p-6 md:p-8 rounded-3xl shadow-hard w-full max-w-5xl flex flex-col md:flex-row gap-6">
        
        {/* Code Display */}
        <div className="flex-1 bg-black p-6 rounded-xl border-4 border-gray-800 relative overflow-hidden">
          <pre className="whitespace-pre-wrap break-words">{renderCode()}</pre>
        </div>

        {/* Input Area */}
        <div className="flex-1 flex flex-col">
            <textarea
                value={userInput}
                onChange={handleInput}
                className="w-full h-64 md:h-full bg-gray-100 text-black font-mono text-xl p-4 rounded-xl border-4 border-black focus:outline-none focus:ring-4 focus:ring-toon-cyan resize-none"
                placeholder="Type the code exactly..."
                autoFocus
                disabled={completed}
            />
        </div>
      </div>

      {completed && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-toon-yellow border-4 border-black p-12 rounded-full shadow-hard text-center animate-bounce-slow max-w-md w-full">
            <p className="text-4xl text-black font-fredoka mb-4">AWESOME!</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white border-4 border-black p-2 rounded-xl">
                    <p className="text-sm font-bold">WPM</p>
                    <p className="text-3xl font-black text-toon-purple">{wpm}</p>
                </div>
                <div className="bg-white border-4 border-black p-2 rounded-xl">
                    <p className="text-sm font-bold">TIME</p>
                    <p className="text-3xl font-black">{formatTime(elapsedTime)}</p>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <button 
                    onClick={() => { setSelectedLang(null); }}
                    className="bg-white hover:bg-toon-green text-black font-black text-xl py-3 px-8 rounded-xl border-4 border-black shadow-hard transition-transform hover:-translate-y-1"
                >
                    NEW CHALLENGE
                </button>
                <button 
                    onClick={() => {
                         setUserInput('');
                         setCompleted(false);
                         setStartTime(null);
                         setElapsedTime(0);
                         setWpm(0);
                    }}
                    className="bg-toon-cyan hover:bg-cyan-400 text-black font-black text-xl py-3 px-8 rounded-xl border-4 border-black shadow-hard transition-transform hover:-translate-y-1"
                >
                    RETRY
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};