import React, { useRef, useMemo } from 'react';
// FIX: Explicitly import ThreeElements and extend the JSX namespace to fix type errors.
// This helps TypeScript recognize react-three-fiber's custom JSX elements.
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: ThreeElements['group']
      primitive: ThreeElements['primitive']
      ambientLight: ThreeElements['ambientLight']
      directionalLight: ThreeElements['directionalLight']
      pointLight: ThreeElements['pointLight']
    }
  }
}

// A more sophisticated, procedurally generated model fitting the medical theme.
function DnaHelix(props: any) {
    const ref = useRef<THREE.Group>(null!);
    
    // Create the geometry for the DNA helix once
    const { strands, rungs } = useMemo(() => {
        const points = [];
        const numPoints = 60;
        const radius = 1.5;
        const height = 8;

        // Create points for one strand
        for (let i = 0; i < numPoints; i++) {
            const t = (i / (numPoints - 1)) * height - height / 2;
            const angle = 2.0 * t;
            points.push(new THREE.Vector3(radius * Math.cos(angle), t, radius * Math.sin(angle)));
        }

        const curve = new THREE.CatmullRomCurve3(points);
        const strandGeometry = new THREE.TubeGeometry(curve, 64, 0.1, 8, false);
        
        // Define materials using the app's color palette
        const strandMaterial = new THREE.MeshStandardMaterial({ color: '#0f9d92', roughness: 0.4, metalness: 0.6 });
        const rungMaterial1 = new THREE.MeshStandardMaterial({ color: '#ff6b6b', roughness: 0.6, metalness: 0.2 });
        const rungMaterial2 = new THREE.MeshStandardMaterial({ color: '#f4b400', roughness: 0.6, metalness: 0.2 });
        const sphereGeometry = new THREE.SphereGeometry(0.15, 16, 16);

        // Create the two strands
        const strand1 = new THREE.Mesh(strandGeometry, strandMaterial);
        const strand2 = strand1.clone();
        strand2.rotation.y = Math.PI;

        // Create the connecting rungs
        const rungs = new THREE.Group();
        for (let i = 5; i < numPoints - 5; i += 3) {
            const p1 = curve.getPointAt(i / (numPoints - 1));
            const p2 = new THREE.Vector3(-p1.x, p1.y, -p1.z);

            const rungPath = new THREE.LineCurve3(p1, p2);
            const rungGeometry = new THREE.TubeGeometry(rungPath, 1, 0.05, 8, false);
            const rung = new THREE.Mesh(rungGeometry, i % 2 === 0 ? rungMaterial1 : rungMaterial2);
            rungs.add(rung);
            
            const sphere1 = new THREE.Mesh(sphereGeometry, strandMaterial);
            sphere1.position.copy(p1);
            rungs.add(sphere1);

            const sphere2 = new THREE.Mesh(sphereGeometry, strandMaterial);
            sphere2.position.copy(p2);
            rungs.add(sphere2);
        }

        return { strands: [strand1, strand2], rungs };
    }, []);

    // Animation loop
    useFrame((_state, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta * 0.25;
        }
    });

    return (
        <group ref={ref} {...props} dispose={null} scale={0.8} rotation={[0.2, 0, 0]}>
            {strands.map((strand, i) => <primitive key={i} object={strand} />)}
            <primitive object={rungs} />
        </group>
    );
}

const Hero3D: React.FC = () => {
  return (
    <Canvas 
      dpr={[1, 2]} 
      camera={{ position: [0, 0, 12], fov: 45 }} 
      style={{ width: '100%', height: '100%' }} 
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={1.0} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, 0, -10]} intensity={0.5} color="#ff6b6b" />
      <pointLight position={[0, -10, 5]} intensity={0.5} color="#0f9d92" />
      
      <DnaHelix />
    </Canvas>
  );
};

export default Hero3D;
