"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { ReactNode } from "react";

type Product3DViewerProps = {
  children: ReactNode;
  scale?: number;
  heightClassName?: string;
  cameraPosition?: [number, number, number];
  target?: [number, number, number];
};

function LoadingObject() {
  return (
    <mesh position={[0, -0.5, 0]}>
      <cylinderGeometry args={[0.8, 0.8, 1.8, 32]} />
      <meshStandardMaterial color='#6f4e37' roughness={0.35} />
    </mesh>
  );
}

export function Product3DViewer({
  children,
  heightClassName = "h-[360px] sm:h-[460px] md:h-[520px] lg:h-[580px]",
  cameraPosition = [0, 0, 5],
  target = [0, -0.3, 0],
}: Product3DViewerProps) {
  return (
    <div className={`relative w-full ${heightClassName}`}>
      <Canvas
        camera={{ position: cameraPosition, fov: 35 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[4, 5, 4]} intensity={2.5} />
        <directionalLight position={[-4, 3, 2]} intensity={1.5} />
        <directionalLight position={[0, -2, 4]} intensity={0.6} />

        <Suspense fallback={<LoadingObject />}>{children}</Suspense>

        <OrbitControls
          makeDefault
          enableZoom
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.7}
          zoomSpeed={0.7}
          minDistance={3}
          maxDistance={8}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI - 0.15}
          target={target}
        />
      </Canvas>

      <div className='pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[10px] text-white/40 backdrop-blur-sm sm:text-xs'>
        Drag untuk memutar · Scroll untuk zoom
      </div>
    </div>
  );
}
