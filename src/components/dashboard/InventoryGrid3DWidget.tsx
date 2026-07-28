"use client";

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Html } from '@react-three/drei';
import * as THREE from 'three';

interface BatchVoxelProps {
  position: [number, number, number];
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
  price: number;
  id: string;
}

function BatchVoxel({ position, status, price, id }: BatchVoxelProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);

  // Warna dinamis berbasis status risiko Bellman 
  const colorMap = {
    OPTIMAL: '#00f3ff', // Cyan
    WARNING: '#ffb700', // Amber
    CRITICAL: '#ff0055', // Red Neon
  };

  // Efek denyut lembut (pulsing animation) untuk status CRITICAL 
  useFrame((state) => {
    if (status === 'CRITICAL' && meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Box 
      ref={meshRef} 
      args={[0.8, 0.8, 0.8]} 
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <meshStandardMaterial
        color={colorMap[status]}
        emissive={colorMap[status]}
        emissiveIntensity={status === 'CRITICAL' ? 0.8 : 0.2}
        roughness={0.2}
        metalness={0.8}
      />
      {hovered && (
        <Html distanceFactor={15} center>
          <div className="bg-slate-900 border border-slate-700 text-slate-100 text-xs p-3 rounded-lg shadow-2xl whitespace-nowrap pointer-events-none select-none z-50">
            <div className="font-bold text-sm mb-1">{id}</div>
            <div className="flex items-center justify-between gap-4 mb-1">
              <span className="text-slate-400">Status:</span>
              <span style={{ color: colorMap[status] }} className="font-semibold">{status}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">P* (Optimal):</span>
              <span className="font-mono text-emerald-400 font-medium">Rp {price.toLocaleString()}</span>
            </div>
          </div>
        </Html>
      )}
    </Box>
  );
}

export function InventoryGrid3DWidget() {
  // Generate a mock warehouse grid
  const batches = useMemo(() => {
    const items: BatchVoxelProps[] = [];
    let idCounter = 1;
    // 4 shelves (x), 5 rows (z), 3 height (y)
    for (let x = -3; x <= 3; x += 2) {
      for (let z = -4; z <= 4; z += 2) {
        for (let y = 0; y < 3; y++) {
          const rand = Math.random();
          let status: 'OPTIMAL' | 'WARNING' | 'CRITICAL' = 'OPTIMAL';
          let price = 20000;
          
          if (rand > 0.85) {
            status = 'CRITICAL';
            price = 14000;
          } else if (rand > 0.6) {
            status = 'WARNING';
            price = 18000;
          }

          items.push({
            id: `BATCH-${1000 + idCounter}`,
            position: [x, y * 1.0 + 0.5, z],
            status,
            price
          });
          idCounter++;
        }
      }
    }
    return items;
  }, []);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full relative" id="voxel-grid-3d">
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          3D Spatial Inventory Grid
        </h3>
        <p className="text-sm text-slate-400">
          Real-time batch expiry risk visualization.
        </p>
      </div>
      
      <div className="absolute top-6 right-6 z-10">
        <div className="flex gap-4 text-xs font-medium bg-slate-900/80 backdrop-blur-sm p-2 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f3ff] shadow-[0_0_8px_#00f3ff]"></span>
            <span className="text-slate-300">Optimal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb700] shadow-[0_0_8px_#ffb700]"></span>
            <span className="text-slate-300">Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff0055] shadow-[0_0_8px_#ff0055] animate-pulse"></span>
            <span className="text-slate-300">Critical</span>
          </div>
        </div>
      </div>

      <div className="w-full min-h-[400px] h-full">
        <Canvas dpr={[1, 1.5]} camera={{ position: [8, 6, 10], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <OrbitControls 
            autoRotate 
            autoRotateSpeed={0.5} 
            enableZoom={true} 
            maxPolarAngle={Math.PI / 2 - 0.05} // Prevent going below ground
          />
          
          {batches.map((batch) => (
            <BatchVoxel key={batch.id} {...batch} />
          ))}
          
          <gridHelper args={[20, 20, '#334155', '#1e293b']} position={[0, 0, 0]} />
        </Canvas>
      </div>
    </div>
  );
}