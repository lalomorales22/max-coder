import React, { useState } from 'react';
import { generateGameCode } from '../services/geminiService';
import { storageService } from '../services/storageService';
import { Cap } from './Cap';

interface DreamGeneratorProps {
  onGameCreated: () => void;
  userId: string;
}

export const DreamGenerator: React.FC<DreamGeneratorProps> = ({ onGameCreated, userId }) => {
  const [prompt, setPrompt] = useState('');
  const [gameName, setGameName] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedGame, setGeneratedGame] = useState<{ code: string, explanation: string } | null>(null);
  const [capMessage, setCapMessage] = useState("Upload a drawing or describe your dream game!");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setCapMessage("Ooh! I see a drawing. What are the rules?");
    }
  };

  const handleGenerate = async () => {
    if ((!prompt && !selectedImage) || !gameName) {
      setCapMessage("I need a Game Name and a Description!");
      return;
    }

    setIsLoading(true);
    setCapMessage("Analyzing schematics... Building logic gates...");

    try {
      const result = await generateGameCode(prompt, selectedImage);
      setGeneratedGame(result);
      setCapMessage(result.explanation);
      
      // Save the game
      await storageService.saveGame({
          id: Date.now().toString(),
          name: gameName,
          code: result.code,
          createdAt: Date.now(),
          type: 'dream',
          userId: userId
      });

      onGameCreated(); 
    } catch (error) {
      console.error(error);
      setCapMessage("Mission Abort! Communication error with the AI Core.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-white">
      {/* Input Side */}
      <div className={`transition-all duration-500 ${generatedGame ? 'w-1/3' : 'w-full'} p-8 flex flex-col justify-center items-center relative overflow-y-auto`}>
        
        <div className="max-w-2xl w-full">
            <h2 className="text-5xl font-fredoka text-black mb-2 transform -rotate-1">DREAM MAKER</h2>
            <p className="text-black mb-8 font-comic text-xl bg-toon-yellow inline-block px-2 border-2 border-black transform rotate-1">Turn your ideas into playable games instantly.</p>

            <div className="bg-white p-6 rounded-3xl border-4 border-black shadow-hard mb-6 relative">
                 {/* Decorative Circle */}
                 <div className="absolute -top-6 -left-6 w-12 h-12 bg-toon-pink rounded-full border-4 border-black z-0"></div>

                 <div className="mb-6 relative z-10">
                    <label className="block text-black font-bold font-fredoka text-xl mb-2">Game Title</label>
                    <input 
                        type="text"
                        className="w-full bg-gray-50 border-4 border-black rounded-xl p-4 text-black focus:bg-toon-cyan/20 focus:outline-none font-bold"
                        placeholder="Super Space Jump..."
                        value={gameName}
                        onChange={(e) => setGameName(e.target.value)}
                    />
                </div>

                <label className="block mb-4 cursor-pointer group relative z-10">
                    <span className="text-black font-bold font-fredoka text-xl mb-2 block">Upload Sketch (Optional)</span>
                    <div className="border-4 border-dashed border-black rounded-xl p-8 text-center bg-gray-50 group-hover:bg-toon-green/20 transition-colors">
                        {selectedImage ? (
                            <span className="text-toon-purple font-bold">{selectedImage.name}</span>
                        ) : (
                            <span className="text-gray-500 font-comic font-bold">Click to upload a photo of your drawing</span>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>
                </label>

                <div className="mb-6 relative z-10">
                    <label className="block text-black font-bold font-fredoka text-xl mb-2">How do you play?</label>
                    <textarea 
                        className="w-full bg-gray-50 border-4 border-black rounded-xl p-4 text-black focus:bg-toon-cyan/20 focus:outline-none h-32 font-comic text-lg"
                        placeholder="e.g. A platformer where the floor is lava and I need to collect stars..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>

                <button 
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className={`w-full py-4 rounded-xl font-fredoka text-2xl font-black text-black border-4 border-black shadow-hard transition-all transform hover:-translate-y-1 active:translate-y-0 active:shadow-none ${isLoading ? 'bg-gray-300 animate-pulse' : 'bg-toon-cyan hover:bg-cyan-300'}`}
                >
                    {isLoading ? 'BUILDING...' : 'LAUNCH GAME'}
                </button>
            </div>
        </div>
      </div>

      {/* Preview Side */}
      {generatedGame && (
        <div className="w-2/3 bg-gray-100 border-l-4 border-black relative flex flex-col">
            <div className="bg-toon-purple p-3 flex justify-between items-center px-4 border-b-4 border-black">
                <span className="text-white font-fredoka text-lg tracking-wider">{gameName || "GAME_PREVIEW.exe"}</span>
                <div className="flex space-x-2">
                    <div className="w-4 h-4 rounded-full bg-white border-2 border-black"></div>
                    <div className="w-4 h-4 rounded-full bg-white border-2 border-black"></div>
                </div>
            </div>
            <iframe 
                srcDoc={generatedGame.code}
                className="w-full h-full bg-white"
                title="Generated Game"
                sandbox="allow-scripts allow-same-origin" // Security
            />
        </div>
      )}

      <Cap message={capMessage} mood={isLoading ? 'thinking' : generatedGame ? 'happy' : 'alert'} />
    </div>
  );
};