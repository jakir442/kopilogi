"use client";

import { useGLTF } from "@react-three/drei";

import { Product3DViewer } from "../product-3d-viewer";

const MODEL_PATH = "/gambar/3d-model/french-fries.glb";

function FrenchFriesModel() {
  const { scene } = useGLTF(MODEL_PATH);

  return <primitive object={scene} scale={6} position={[0, -1.2, 0]} />;
}

export function FrenchFries3D() {
  return (
    <Product3DViewer>
      <FrenchFriesModel />
    </Product3DViewer>
  );
}

useGLTF.preload(MODEL_PATH);
