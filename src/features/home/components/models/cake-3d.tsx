"use client";

import { useGLTF } from "@react-three/drei";

import { Product3DViewer } from "../product-3d-viewer";

const MODEL_PATH = "/gambar/3d-model/cake.glb";

function CakeModel() {
  const { scene } = useGLTF(MODEL_PATH);

  return <primitive object={scene} scale={0.08} position={[0, -1.2, 0]} />;
}

export function Cake3D() {
  return (
    <Product3DViewer>
      <CakeModel />
    </Product3DViewer>
  );
}

useGLTF.preload(MODEL_PATH);
