import React from 'react';
import { UserProfile, GameMode } from '../types';

interface NavBarProps {
  user: UserProfile;
  currentMode: GameMode;
  onNavigate: (mode: GameMode) => void;
}

export const NavBar: React.FC<NavBarProps> = ({ user, currentMode, onNavigate }) => {
  return (
    <nav className="w-full h-20 bg-toon-yellow border-b-4 border-black flex items-center justify-between px-6 fixed top-0 left-0 z-40 shadow-hard">
      <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => onNavigate(GameMode.MENU)}>
        <div className="w-12 h-12 bg-white border-4 border-black rounded-full flex items-center justify-center group-hover:bg-toon-cyan transition-colors">
          <span className="text-black font-black font-fredoka text-2xl">M</span>
        </div>
        <span className="text-2xl font-fredoka text-black tracking-wide group-hover:scale-105 transition-transform">MAX<span className="text-toon-purple">CODER</span></span>
      </div>

      <div className="flex items-center space-x-4 md:space-x-8">
         <div className="hidden md:flex items-center space-x-2 bg-white px-4 py-2 rounded-full border-4 border-black shadow-hard-sm">
            <span className="text-black font-comic font-bold uppercase text-sm">Player</span>
            <span className="text-toon-purple font-black font-fredoka text-xl">{user.username}</span>
         </div>
         
         <div className="flex items-center space-x-2 bg-toon-green px-4 py-2 rounded-full border-4 border-black shadow-hard-sm transform rotate-2">
            <span className="text-black font-black text-sm">LVL</span>
            <span className="text-black font-black font-fredoka text-xl">{user.level}</span>
         </div>

         <div className="flex items-center space-x-2 bg-toon-pink px-4 py-2 rounded-full border-4 border-black shadow-hard-sm transform -rotate-2">
            <span className="text-white text-xl">★</span>
            <span className="text-white font-black font-fredoka text-xl">{user.stars}</span>
         </div>
      </div>
    </nav>
  );
};