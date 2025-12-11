import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { NavCommand } from '../types';

interface AstroNavProps {
  onComplete: (xp: number, stars: number) => void;
}

export const AstroNav: React.FC<AstroNavProps> = ({ onComplete }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [commands, setCommands] = useState<NavCommand[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [levelMessage, setLevelMessage] = useState("Program the rover to reach the gold coin!");
  const [level, setLevel] = useState(1);

  // Game State Refs
  const playerPos = useRef<{x: number, z: number, rot: number}>({ x: 0, z: 0, rot: 0 });
  const targetPos = useRef<{x: number, z: number}>({ x: 3, z: 0 }); // Logical grid coordinates
  
  // Three.js Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const playerRef = useRef<THREE.Mesh | null>(null);
  const goalRef = useRef<THREE.Mesh | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Generate random level
  const generateLevel = () => {
    // Grid is -5 to 5. Let's use logic range -4 to 4 to stay safe inside border
    const range = 4;
    
    let px = Math.floor(Math.random() * (range * 2 + 1)) - range;
    let pz = Math.floor(Math.random() * (range * 2 + 1)) - range;
    
    let tx = px;
    let tz = pz;

    // Ensure target is different from player
    while (tx === px && tz === pz) {
        tx = Math.floor(Math.random() * (range * 2 + 1)) - range;
        tz = Math.floor(Math.random() * (range * 2 + 1)) - range;
    }

    playerPos.current = { x: px, z: pz, rot: 0 };
    targetPos.current = { x: tx, z: tz };

    updatePositionsVisuals();
    setCommands([]);
    setLevelMessage(`Level ${level}: Route initiated!`);
  };

  const updatePositionsVisuals = () => {
      if (playerRef.current) {
          playerRef.current.position.set(playerPos.current.x, 0.5, playerPos.current.z);
          playerRef.current.rotation.y = playerPos.current.rot;
      }
      if (goalRef.current) {
          goalRef.current.position.set(targetPos.current.x, 0.5, targetPos.current.z);
      }
  };

  useEffect(() => {
    generateLevel();
  }, [level]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF); // White background
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(50, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 10, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap; // Hard shadows for toon look
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Grid - Custom visual
    const gridHelper = new THREE.GridHelper(10, 10, 0x000000, 0xDDDDDD);
    scene.add(gridHelper);

    // Player (Rover)
    const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    // Toon material effect using basic material with outline logic is complex in vanilla Three, 
    // sticking to standard bright materials with black edges
    const material = new THREE.MeshToonMaterial({ color: 0x00F0FF }); 
    const player = new THREE.Mesh(geometry, material);
    player.castShadow = true;
    
    // Add "eyes" to player to denote front
    const eyeGeo = new THREE.SphereGeometry(0.15);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const eye1 = new THREE.Mesh(eyeGeo, eyeMat);
    eye1.position.set(0.2, 0.2, 0.4);
    const eye2 = new THREE.Mesh(eyeGeo, eyeMat);
    eye2.position.set(-0.2, 0.2, 0.4);
    player.add(eye1); 
    player.add(eye2);

    scene.add(player);
    playerRef.current = player;

    // Goal (Coin)
    const coinGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32);
    const coinMat = new THREE.MeshToonMaterial({ color: 0xFFD600 });
    const goal = new THREE.Mesh(coinGeo, coinMat);
    goal.rotation.x = Math.PI / 2;
    goal.castShadow = true;
    
    // Add border to goal (simple torus trick)
    const torusGeo = new THREE.TorusGeometry(0.4, 0.05, 16, 100);
    const borderMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const border = new THREE.Mesh(torusGeo, borderMat);
    goal.add(border);

    scene.add(goal);
    goalRef.current = goal;

    updatePositionsVisuals();

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      
      if (goalRef.current) {
        goalRef.current.rotation.z += 0.05;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    const handleResize = () => {
        if (!mountRef.current || !camera || !renderer) return;
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []); // Run once on mount, logic handled by other effect

  const addCommand = (type: NavCommand['type']) => {
    if (isRunning) return;
    const newCmd: NavCommand = {
      id: Date.now().toString(),
      type,
      label: type === 'FORWARD' ? 'Move Forward' : type === 'LEFT' ? 'Turn Left' : type === 'RIGHT' ? 'Turn Right' : 'Jump'
    };
    setCommands([...commands, newCmd]);
  };

  const runProgram = async () => {
    if (isRunning || !playerRef.current) return;
    setIsRunning(true);
    
    // Reset visual position to start of level before running sequence (in case they retry)
    // Actually, we usually want to run FROM current spot? No, puzzle logic usually resets to start.
    playerRef.current.position.set(playerPos.current.x, 0.5, playerPos.current.z);
    playerRef.current.rotation.y = playerPos.current.rot;

    // Use a temp tracker for the simulation
    let simX = playerPos.current.x;
    let simZ = playerPos.current.z;
    let simRot = playerPos.current.rot;
    
    await new Promise(r => setTimeout(r, 500));

    for (const cmd of commands) {
      // Execute Visuals
      const duration = 500;
      const startPos = playerRef.current.position.clone();
      const startRot = playerRef.current.rotation.y;
      
      let targetP = startPos.clone();
      let targetR = startRot;

      if (cmd.type === 'FORWARD') {
         // Determine direction based on simRot
         // We need to normalize simRot to 0, PI/2, PI, -PI/2
         const rIndex = Math.round(simRot / (Math.PI/2)) % 4;
         
         // Fix movement logic for grid
         // Facing +Z (0) -> z + 1
         // Facing +X (-PI/2) -> x + 1 (ThreeJS rotation is counter clockwise positive)
         // Let's rely on standard sin/cos
         // initial rot 0. eye at +z. 
         const dz = Math.cos(simRot); 
         const dx = Math.sin(simRot);
         
         targetP.z += Math.round(dz);
         targetP.x += Math.round(dx);
         
         simX += Math.round(dx);
         simZ += Math.round(dz);
         
      } else if (cmd.type === 'LEFT') {
         targetR += Math.PI / 2;
         simRot += Math.PI / 2;
      } else if (cmd.type === 'RIGHT') {
         targetR -= Math.PI / 2;
         simRot -= Math.PI / 2;
      }

      const startTime = Date.now();
      await new Promise<void>((resolve) => {
          const animateStep = () => {
              const now = Date.now();
              const progress = Math.min((now - startTime) / duration, 1);
              
              if (cmd.type === 'FORWARD') {
                  playerRef.current!.position.lerpVectors(startPos, targetP, progress);
              } else {
                  playerRef.current!.rotation.y = startRot + (targetR - startRot) * progress;
              }

              if (progress < 1) {
                  requestAnimationFrame(animateStep);
              } else {
                  resolve();
              }
          };
          animateStep();
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // Check Win Condition
    // Round floats to ints
    const finalX = Math.round(playerRef.current.position.x);
    const finalZ = Math.round(playerRef.current.position.z);

    if (finalX === targetPos.current.x && finalZ === targetPos.current.z) {
      setLevelMessage("SUCCESS! +100 XP");
      onComplete(100, 1);
      setTimeout(() => {
          setLevel(l => l + 1); // Triggers generation
      }, 2000);
    } else {
      setLevelMessage("Mission Failed. Hit Reset!");
    }
    
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      {/* 3D View */}
      <div className="w-full md:w-2/3 h-1/2 md:h-full relative border-r-4 border-black" ref={mountRef}>
         <div className="absolute top-4 left-4 bg-white border-4 border-black p-4 rounded-xl shadow-hard z-10">
           <p className="font-comic font-bold text-xl">{levelMessage}</p>
         </div>
         <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded border-2 border-black text-sm font-comic">
            Use Mouse to Rotate & Zoom
         </div>
      </div>
      
      {/* Controls */}
      <div className="w-full md:w-1/3 h-1/2 md:h-full bg-toon-yellow p-6 flex flex-col border-t-4 md:border-t-0 border-black">
        <h2 className="text-3xl font-fredoka text-black mb-4 uppercase">Mission Control</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
           <button onClick={() => addCommand('FORWARD')} className="bg-white hover:bg-toon-green text-black border-4 border-black p-4 rounded-xl font-bold shadow-hard active:translate-y-1 active:shadow-none transition-all">
             FORWARD
           </button>
           <button onClick={() => addCommand('LEFT')} className="bg-white hover:bg-toon-cyan text-black border-4 border-black p-4 rounded-xl font-bold shadow-hard active:translate-y-1 active:shadow-none transition-all">
             TURN LEFT
           </button>
           <button onClick={() => addCommand('RIGHT')} className="bg-white hover:bg-toon-cyan text-black border-4 border-black p-4 rounded-xl font-bold shadow-hard active:translate-y-1 active:shadow-none transition-all">
             TURN RIGHT
           </button>
           <button onClick={() => setCommands([])} className="bg-toon-pink hover:bg-red-600 text-white border-4 border-black p-4 rounded-xl font-bold shadow-hard active:translate-y-1 active:shadow-none transition-all">
             RESET
           </button>
        </div>

        <div className="flex-1 bg-white border-4 border-black rounded-xl p-4 overflow-y-auto mb-4">
           {commands.length === 0 && <span className="text-gray-400 font-comic">Queue is empty...</span>}
           {commands.map((cmd, idx) => (
             <div key={cmd.id} className="bg-gray-100 mb-2 p-2 rounded border-2 border-gray-300 flex items-center">
                <span className="text-toon-purple font-black mr-3">{idx + 1}.</span>
                <span className="font-bold">{cmd.label}</span>
             </div>
           ))}
        </div>

        <button 
          onClick={runProgram}
          disabled={isRunning}
          className={`w-full py-4 rounded-xl font-fredoka text-2xl font-black border-4 border-black shadow-hard active:translate-y-1 active:shadow-none transition-all ${isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-toon-green hover:bg-green-400 text-black'}`}
        >
          {isRunning ? 'RUNNING...' : 'EXECUTE'}
        </button>
      </div>
    </div>
  );
};