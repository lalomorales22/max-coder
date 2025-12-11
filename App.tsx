import React, { useState, useEffect } from 'react';
import { NavBar } from './components/NavBar';
import { AstroNav } from './components/AstroNav';
import { VelocityTyping } from './components/VelocityTyping';
import { DreamGenerator } from './components/DreamGenerator';
import { SavedGames } from './components/SavedGames';
import { LandingPage } from './components/LandingPage';
import { storageService } from './services/storageService';
import { UserProfile, GameMode } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.MENU);

  // Check if a user was previously logged in (simple session persistence logic could go here, 
  // but for now we'll require a "Login" each reload to show the splash page as requested)
  // Or, if we want auto-login:
  /*
  useEffect(() => {
    // Logic to check localstorage for last user ID could go here
  }, []);
  */

  const handleLogin = async (username: string) => {
    try {
      const userData = await storageService.loginUser(username);
      setUser(userData);
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  const handleUpdateStats = async (xpGain: number, starGain: number) => {
    if (!user) return;
    const newUser = {
      ...user,
      xp: user.xp + xpGain,
      stars: user.stars + starGain,
      level: Math.floor((user.xp + xpGain) / 100) + 1
    };
    setUser(newUser);
    await storageService.saveUser(newUser);
    await storageService.logAction('LEVEL_COMPLETE', `User ${user.username} gained ${xpGain} XP`);
  };

  if (!user) {
      return <LandingPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (gameMode) {
      case GameMode.DREAM_GENERATOR:
        return <DreamGenerator onGameCreated={() => handleUpdateStats(50, 1)} userId={user.id} />;
      case GameMode.ASTRO_NAV:
        return <AstroNav onComplete={handleUpdateStats} />;
      case GameMode.VELOCITY_TYPING:
        return <VelocityTyping onComplete={handleUpdateStats} user={user} />;
      case GameMode.SAVED_GAMES:
        return <SavedGames />;
      case GameMode.MENU:
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-8">
            <h1 className="text-6xl md:text-8xl font-black font-fredoka text-black mb-12 drop-shadow-sm text-center transform -rotate-2">
              MISSION SELECT
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full">
              {/* Circle 1 */}
              <div 
                onClick={() => setGameMode(GameMode.DREAM_GENERATOR)}
                className="group aspect-square rounded-full bg-toon-purple border-4 border-black shadow-hard cursor-pointer flex flex-col items-center justify-center p-8 transition-transform hover:scale-105 hover:shadow-hard-lg hover:-rotate-3"
              >
                <div className="text-6xl mb-4 group-hover:animate-bounce">✨</div>
                <h3 className="text-2xl font-black font-fredoka text-white text-center">DREAM MAKER</h3>
              </div>

              {/* Circle 2 */}
              <div 
                onClick={() => setGameMode(GameMode.ASTRO_NAV)}
                className="group aspect-square rounded-full bg-toon-cyan border-4 border-black shadow-hard cursor-pointer flex flex-col items-center justify-center p-8 transition-transform hover:scale-105 hover:shadow-hard-lg hover:rotate-3"
              >
                 <div className="text-6xl mb-4 group-hover:animate-pulse">🚀</div>
                <h3 className="text-2xl font-black font-fredoka text-black text-center">ASTRO NAV</h3>
              </div>

              {/* Circle 3 */}
              <div 
                onClick={() => setGameMode(GameMode.VELOCITY_TYPING)}
                className="group aspect-square rounded-full bg-toon-green border-4 border-black shadow-hard cursor-pointer flex flex-col items-center justify-center p-8 transition-transform hover:scale-105 hover:shadow-hard-lg hover:-rotate-3"
              >
                 <div className="text-6xl mb-4 group-hover:animate-spin">⌨️</div>
                <h3 className="text-2xl font-black font-fredoka text-black text-center">SPEED TYPING</h3>
              </div>

              {/* Circle 4 */}
              <div 
                onClick={() => setGameMode(GameMode.SAVED_GAMES)}
                className="group aspect-square rounded-full bg-toon-yellow border-4 border-black shadow-hard cursor-pointer flex flex-col items-center justify-center p-8 transition-transform hover:scale-105 hover:shadow-hard-lg hover:rotate-3"
              >
                 <div className="text-6xl mb-4 group-hover:animate-bounce">👾</div>
                <h3 className="text-2xl font-black font-fredoka text-black text-center">MY GAMES</h3>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-screen h-screen bg-white text-black overflow-hidden flex flex-col">
      <NavBar user={user} currentMode={gameMode} onNavigate={setGameMode} />
      
      {/* Main Content Area */}
      <main className="flex-1 pt-20 relative overflow-y-auto overflow-x-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;