import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { GameProject } from '../types';

export const SavedGames: React.FC = () => {
    const [games, setGames] = useState<GameProject[]>([]);
    const [activeGame, setActiveGame] = useState<GameProject | null>(null);

    useEffect(() => {
        storageService.getAllGames().then(setGames);
    }, []);

    if (activeGame) {
        return (
            <div className="w-full h-full flex flex-col bg-gray-900">
                <div className="bg-toon-purple p-4 flex justify-between items-center border-b-4 border-black">
                    <h2 className="text-white font-fredoka text-2xl">{activeGame.name}</h2>
                    <button 
                        onClick={() => setActiveGame(null)}
                        className="bg-toon-pink text-white font-bold px-6 py-2 rounded-full border-4 border-black shadow-hard hover:scale-105 transition-transform"
                    >
                        CLOSE GAME
                    </button>
                </div>
                <iframe 
                    srcDoc={activeGame.code}
                    className="flex-1 w-full bg-white"
                    title={activeGame.name}
                    sandbox="allow-scripts allow-same-origin"
                />
            </div>
        );
    }

    return (
        <div className="w-full h-full p-8 overflow-y-auto">
            <h2 className="text-5xl font-fredoka text-black mb-12 text-center drop-shadow-sm">MY GAME CARTRIDGES</h2>
            
            {games.length === 0 ? (
                <div className="text-center mt-20">
                    <p className="text-2xl font-comic text-gray-500">No games found! Go to the Dream Generator to make one.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {games.map(game => (
                        <div 
                            key={game.id}
                            onClick={() => setActiveGame(game)}
                            className="bg-white border-4 border-black rounded-3xl p-6 shadow-hard cursor-pointer transition-transform hover:-translate-y-2 hover:shadow-hard-lg group"
                        >
                            <div className="h-40 bg-gray-100 rounded-xl mb-4 border-4 border-black flex items-center justify-center overflow-hidden relative group-hover:bg-toon-cyan/20">
                                {/* Simulated Game Art */}
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_#000_2px,_transparent_2px)] bg-[length:10px_10px]"></div>
                                <span className="text-6xl group-hover:scale-110 transition-transform">👾</span>
                            </div>
                            <h3 className="text-2xl font-black font-fredoka text-black mb-2">{game.name}</h3>
                            <p className="text-gray-500 font-comic font-bold text-sm uppercase">
                                {new Date(game.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};