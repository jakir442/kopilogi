"use client";

import { useGLTF } from "@react-three/drei";

import { Product3DViewer } from "../product-3d-viewer";

const MODEL_PATH = "/gambar/3d-model/coffeecup-v3.glb";

function IceCoffeeModel() {
  const { scene } = useGLTF(MODEL_PATH);

  return <primitive object={scene} scale={0.4} position={[0, -1.2, 0]} />;
}

export function IceCoffee3D() {
  return (
    <Product3DViewer>
      <IceCoffeeModel />
    </Product3DViewer>
  );
}

useGLTF.preload(MODEL_PATH);
