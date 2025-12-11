import React, { useState } from 'react';

interface LandingPageProps {
  onLogin: (username: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="w-screen h-screen bg-white flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '40px 40px' }}>
      </div>
      
      {/* Floating Shapes */}
      <div className="absolute top-20 left-20 text-8xl animate-bounce-slow opacity-50">🚀</div>
      <div className="absolute bottom-20 right-20 text-8xl animate-bounce-slow delay-1000 opacity-50">💻</div>

      <div className="relative z-10 max-w-2xl w-full bg-toon-yellow border-4 border-black p-8 md:p-12 rounded-[3rem] shadow-hard transform rotate-1">
        
        <div className="text-center mb-12">
            <div className="inline-block bg-white border-4 border-black px-6 py-2 rounded-full shadow-hard-sm mb-6 transform -rotate-2">
                <span className="font-comic font-bold text-xl uppercase tracking-widest">Welcome Cadet</span>
            </div>
            <h1 className="text-7xl md:text-8xl font-black font-fredoka text-black leading-none mb-2">
                MAX<span className="text-white text-stroke-black">CODER</span>
            </h1>
            <p className="font-comic font-bold text-xl md:text-2xl mt-4">The Vibe Coding Platform for Future Tech Leaders</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="relative">
                <label className="block font-fredoka font-bold text-2xl mb-2 ml-4">What's your name?</label>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white border-4 border-black rounded-2xl p-6 text-3xl font-bold font-fredoka focus:outline-none focus:ring-4 focus:ring-toon-cyan shadow-hard-sm"
                    placeholder="e.g. Captain Code"
                    autoFocus
                />
            </div>

            <button 
                type="submit"
                disabled={!username.trim()}
                className="w-full bg-toon-green hover:bg-green-400 disabled:bg-gray-400 text-black font-black text-3xl py-6 rounded-2xl border-4 border-black shadow-hard transition-all transform hover:-translate-y-2 active:translate-y-0 active:shadow-none"
            >
                START MISSION
            </button>
        </form>

        <div className="mt-8 text-center font-comic font-bold text-sm opacity-60">
            Powered by Gemini AI • 100% Fun
        </div>
      </div>
    </div>
  );
};