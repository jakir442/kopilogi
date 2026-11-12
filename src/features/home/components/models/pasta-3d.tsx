"use client";

import { useGLTF } from "@react-three/drei";

import { Product3DViewer } from "../product-3d-viewer";

const MODEL_PATH = "/gambar/3d-model/pasta.glb";

function PastaModel() {
  const { scene } = useGLTF(MODEL_PATH);

  return <primitive object={scene} scale={0.3} position={[0, -1.2, 0]} />;
}

export function Pasta3D() {
  return (
    <Product3DViewer>
      <PastaModel />
    </Product3DViewer>
  );
}

useGLTF.preload(MODEL_PATH);
