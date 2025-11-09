import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Stethoscope(props: any) {
    const ref = useRef<THREE.Group>(null!);
    
    // Auto-rotation for a dynamic effect without complex controls
    useFrame((_state, delta) => {
        if(ref.current) {
            ref.current.rotation.y += delta * 0.2;
            ref.current.rotation.x += delta * 0.1;
        }
    });

    // A simple shape as a placeholder for the GLTF model
    return (
        <group ref={ref} {...props} dispose={null} scale={2.5}>
            <mesh>
                <torusKnotGeometry args={[1, 0.4, 128, 16]} />
                <meshStandardMaterial color="#0f9d92" roughness={0.3} metalness={0.5} />
            </mesh>
        </group>
    )
}

const Hero3D: React.FC = () => {
  return (
    <Canvas 
      dpr={[1, 2]} 
      camera={{ position: [0, 0, 10], fov: 45 }} 
      style={{ width: '100%', height: '100%' }} 
      gl={{ alpha: true }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#ff6b6b" />
      <pointLight position={[0, 5, -10]} intensity={1} color="#0f9d92" />
      
      <Stethoscope />
    </Canvas>
  );
};

export default Hero3D;
