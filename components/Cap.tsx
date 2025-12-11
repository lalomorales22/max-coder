import React, { useState, useEffect } from 'react';

interface CapProps {
  message: string;
  mood?: 'happy' | 'thinking' | 'alert';
}

export const Cap: React.FC<CapProps> = ({ message, mood = 'happy' }) => {
  const [displayMessage, setDisplayMessage] = useState('');
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    if (message) {
        setDisplayMessage(message);
        setVisible(true);
    }
  }, [message]);

  const getEyeColor = () => {
    switch (mood) {
      case 'thinking': return 'bg-yellow-400';
      case 'alert': return 'bg-red-500';
      default: return 'bg-toon-cyan';
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-end animate-float">
      <div className="relative w-28 h-28 mr-4 shrink-0 transition-transform hover:scale-110">
        {/* Robot Head - Bold Borders */}
        <div className="absolute inset-0 bg-white rounded-full border-4 border-black shadow-hard flex flex-col items-center justify-center overflow-hidden z-10">
          {/* Antenna */}
          <div className="absolute -top-6 w-2 h-8 bg-black"></div>
          <div className="absolute -top-8 w-6 h-6 rounded-full bg-toon-pink border-4 border-black"></div>
          
          {/* Eyes */}
          <div className="flex space-x-2 mb-2 w-full justify-center px-4 bg-black py-3">
            <div className={`w-8 h-8 rounded-full ${getEyeColor()} border-2 border-white`}></div>
            <div className={`w-8 h-8 rounded-full ${getEyeColor()} border-2 border-white`}></div>
          </div>
          
          {/* Mouth */}
          <div className="w-12 h-3 bg-black rounded-full overflow-hidden relative mt-1">
             <div className="absolute left-0 top-0 h-full w-full bg-toon-yellow/50 animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Dialogue Bubble */}
      <div className="relative bg-white border-4 border-black p-6 rounded-3xl rounded-bl-none max-w-sm shadow-hard mb-12">
        <button 
            onClick={() => setVisible(false)}
            className="absolute -top-4 -right-4 w-8 h-8 bg-toon-pink border-4 border-black rounded-full flex items-center justify-center text-white font-bold hover:scale-110 transition-transform"
        >
            X
        </button>
        <p className="font-comic font-bold text-lg text-black leading-snug">
          {displayMessage}
        </p>
      </div>
    </div>
  );
};