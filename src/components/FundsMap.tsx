import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Distribution {
  region: string;
  amount: number;
  color: string;
  position: { x: number; y: number; z: number };
}

interface FundsMapProps {
  distributions: Distribution[];
}

const FundsMap: React.FC<FundsMapProps> = ({ distributions }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglError, setWebglError] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  // Détection WebGL
  const checkWebGL = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    // Vérification des dimensions du conteneur
    const updateDimensions = () => {
      if (mountRef.current) {
        setDimensions({
          width: mountRef.current.clientWidth,
          height: mountRef.current.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (!mountRef.current || webglError) return;

    // Vérification WebGL
    if (!checkWebGL()) {
      setWebglError(true);
      return;
    }

    // Initialisation Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      dimensions.width / dimensions.height, 
      0.1, 
      1000
    );
    
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (error) {
      console.error('Error creating WebGL context:', error);
      setWebglError(true);
      return;
    }

    renderer.setSize(dimensions.width, dimensions.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Création du plan de base
    const planeGeometry = new THREE.PlaneGeometry(10, 6);
    const planeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x1F2937, 
      side: THREE.DoubleSide,
      transparent: true, 
      opacity: 0.1 
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    // Grille de référence
    const gridHelper = new THREE.GridHelper(10, 10, 0x4B5563, 0x4B5563);
    scene.add(gridHelper);

    // Création des barres de distribution
    const bars: THREE.Mesh[] = [];
    const maxAmount = Math.max(...distributions.map(d => d.amount), 1);

    distributions.forEach(dist => {
      const height = (dist.amount / maxAmount) * 3;
      const barGeometry = new THREE.CylinderGeometry(0.3, 0.3, height, 32);
      const barMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(dist.color),
        emissive: new THREE.Color(dist.color).multiplyScalar(0.2),
        shininess: 30
      });
      const bar = new THREE.Mesh(barGeometry, barMaterial);
      
      bar.position.set(dist.position.x, height / 2, dist.position.z);
      scene.add(bar);
      bars.push(bar);

      // Effet de halo
      const haloGeometry = new THREE.CylinderGeometry(0.35, 0.35, height + 0.1, 32);
      const haloMaterial = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(dist.color),
        transparent: true,
        opacity: 0.3
      });
      const halo = new THREE.Mesh(haloGeometry, haloMaterial);
      halo.position.copy(bar.position);
      scene.add(halo);
    });

    // Éclairage
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    camera.position.set(0, 5, 8);
    camera.lookAt(0, 0, 0);

    // Animation
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // Rotation douce
      scene.rotation.y += 0.005;
      
      // Animation des barres
      bars.forEach((bar, i) => {
        const pulse = Math.sin(Date.now() * 0.001 + i) * 0.1 + 1;
        bar.scale.set(pulse, 1, pulse);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Nettoyage
    return () => {
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [distributions, dimensions, webglError]);

  if (webglError) {
    return (
      <div className="flex items-center justify-center w-full h-96 bg-gray-100 rounded-lg">
        <div className="text-center p-6 bg-white rounded shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">WebGL Non Supporté</h3>
          <p className="text-gray-600">
            Votre navigateur ne supporte pas WebGL. Veuillez utiliser Chrome, Firefox ou Edge.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mountRef} 
      className="w-full h-96 rounded-lg overflow-hidden bg-gray-900"
    />
  );
};

export default FundsMap;