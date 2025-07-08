import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Donation {
  lat: number;
  lng: number;
  amount: number;
  project: string;
  donor?: string;
}

interface Globe3DProps {
  donations: Donation[];
}

const Globe3D: React.FC<Globe3DProps> = ({ donations }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [webGLAvailable, setWebGLAvailable] = useState<boolean | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Détection WebGL améliorée
  const detectWebGL = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      
      if (!gl) {
        console.error('WebGL non supporté');
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Erreur détection WebGL:', err);
      return false;
    }
  };

  // Fallback 2D
  const Globe2DFallback = ({ donations }: { donations: Donation[] }) => {
    const getColorByProject = (project: string) => {
      const colors: Record<string, string> = {
        education: '#4285f4',
        health: '#ea4335',
        environment: '#34a853',
        water: '#00bcd4',
        disaster: '#ff9800',
        other: '#fbbc05',
      };
      return colors[project.toLowerCase()] || colors.other;
    };

    return (
      <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" 
          alt="Carte du monde"
          className="w-full h-full object-contain opacity-70"
        />
        {donations.map((donation, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${(donation.lng + 180) / 360 * 100}%`,
              top: `${(90 - donation.lat) / 180 * 100}%`,
              backgroundColor: getColorByProject(donation.project),
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 8px ${getColorByProject(donation.project)}`
            }}
          />
        ))}
      </div>
    );
  };

  // Message d'erreur WebGL
  const WebGLErrorFallback = () => (
    <div className="flex flex-col items-center justify-center h-96 bg-gray-900 rounded-lg p-6 text-center">
      <div className="text-6xl mb-4">🌍</div>
      <h3 className="text-xl font-semibold mb-2">WebGL non supporté</h3>
      <p className="mb-4">
        Votre navigateur ne supporte pas WebGL, nécessaire pour afficher le globe 3D.
      </p>
      <div className="space-y-2 text-sm">
        <p>Essayez avec :</p>
        <ul className="list-disc list-inside">
          <li>Google Chrome (dernière version)</li>
          <li>Mozilla Firefox (dernière version)</li>
          <li>Microsoft Edge (dernière version)</li>
        </ul>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
      >
        Réessayer
      </button>
    </div>
  );

  useEffect(() => {
    // Vérifier WebGL avant d'initialiser Three.js
    const webGLSupported = detectWebGL();
    setWebGLAvailable(webGLSupported);
    
    if (!webGLSupported) {
      setLoading(false);
      return;
    }

    if (!mountRef.current) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let globe: THREE.Mesh;
    let cloudMesh: THREE.Mesh;
    let animationFrameId: number;
    let donationMarkers: THREE.Group;
    let lastFrameTime = 0;

    try {
      // Initialisation de la scène
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000011);

      // Configuration de la caméra
      camera = new THREE.PerspectiveCamera(
        75,
        dimensions.width / dimensions.height,
        0.1,
        1000
      );
      camera.position.z = 5;

      // Configuration du rendu avec gestion d'erreur
      try {
        renderer = new THREE.WebGLRenderer({ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        });
      } catch (err) {
        console.error('Erreur création renderer:', err);
        setError('Impossible d\'initialiser le rendu 3D');
        setLoading(false);
        return;
      }

      renderer.setSize(dimensions.width, dimensions.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mountRef.current.appendChild(renderer.domElement);

      // Contrôles de la souris
      let mouseX = 0, mouseY = 0;
      let targetX = 0, targetY = 0;
      
      const handleMouseMove = (event: MouseEvent) => {
        if (!mountRef.current) return;
        const rect = mountRef.current.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      };
      
      document.addEventListener('mousemove', handleMouseMove);

      // Création de textures procédurales
      const createEarthTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return null;
        
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1e3a8a');
        gradient.addColorStop(0.3, '#3b82f6');
        gradient.addColorStop(0.5, '#10b981');
        gradient.addColorStop(0.7, '#059669');
        gradient.addColorStop(1, '#1e3a8a');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#059669';
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const radius = Math.random() * 30 + 10;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        return new THREE.CanvasTexture(canvas);
      };

      const createCloudTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return null;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const radius = Math.random() * 20 + 5;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        return new THREE.CanvasTexture(canvas);
      };

      // Création des marqueurs de dons
      const createDonationMarkers = (donations: Donation[]) => {
        const group = new THREE.Group();
        
        const getColorByProject = (project: string) => {
          const colors: Record<string, number> = {
            education: 0x4285f4,
            health: 0xea4335,
            environment: 0x34a853,
            water: 0x00bcd4,
            disaster: 0xff9800,
            other: 0xfbbc05,
          };
          return colors[project.toLowerCase()] || colors.other;
        };

        donations.forEach((donation) => {
          const phi = (90 - donation.lat) * (Math.PI / 180);
          const theta = (donation.lng + 180) * (Math.PI / 180);
          const radius = 2.1;
          
          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi);
          const z = radius * Math.sin(phi) * Math.sin(theta);
          
          const size = Math.max(0.02, Math.min(0.15, donation.amount / 1000));
          
          const geometry = new THREE.SphereGeometry(size, 16, 16);
          const material = new THREE.MeshBasicMaterial({
            color: getColorByProject(donation.project),
            transparent: true,
            opacity: 0.8,
          });
          
          const marker = new THREE.Mesh(geometry, material);
          marker.position.set(x, y, z);
          group.add(marker);
        });
        
        return group;
      };

      // Initialisation du globe
      const initializeGlobe = (earthTexture: THREE.Texture | null) => {
        // Création du globe
        const globeGeometry = new THREE.SphereGeometry(2, 64, 64);
        const globeMaterial = new THREE.MeshPhongMaterial({ 
          map: earthTexture || createEarthTexture(),
          shininess: 100
        });
        globe = new THREE.Mesh(globeGeometry, globeMaterial);
        scene.add(globe);

        // Ajout des marqueurs
        donationMarkers = createDonationMarkers(donations);
        scene.add(donationMarkers);

        // Éclairage
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);

        // Nuages
        const cloudGeometry = new THREE.SphereGeometry(2.03, 64, 64);
        const cloudMaterial = new THREE.MeshLambertMaterial({
          map: createCloudTexture(),
          transparent: true,
          opacity: 0.3,
        });
        cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
        scene.add(cloudMesh);

        // Animation
        const animate = () => {
          animationFrameId = requestAnimationFrame(animate);
          
          // Limiter à 30 FPS
          const now = performance.now();
          if (now - lastFrameTime < 1000 / 30) return;
          lastFrameTime = now;

          // Rotation automatique
          globe.rotation.y += 0.002;
          if (cloudMesh) cloudMesh.rotation.y += 0.003;
          
          // Interaction souris
          targetX = mouseX * 0.3;
          targetY = mouseY * 0.3;
          
          globe.rotation.x += (targetY - globe.rotation.x) * 0.05;
          globe.rotation.y += (targetX - globe.rotation.y) * 0.05;
          
          if (cloudMesh) {
            cloudMesh.rotation.x += (targetY - cloudMesh.rotation.x) * 0.05;
            cloudMesh.rotation.y += (targetX - cloudMesh.rotation.y) * 0.05;
          }
          
          // Animation des marqueurs
          donationMarkers.children.forEach((marker, i) => {
            const time = Date.now() * 0.001;
            marker.scale.setScalar(1 + Math.sin(time + i) * 0.3);
            
            const material = (marker as THREE.Mesh).material as THREE.MeshBasicMaterial;
            material.opacity = 0.7 + Math.sin(time * 2 + i) * 0.3;
          });
          
          renderer.render(scene, camera);
        };
        
        animate();
        setLoading(false);
      };

      // Chargement des textures
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
        (texture) => initializeGlobe(texture),
        undefined,
        () => initializeGlobe(null) // Fallback si échec
      );

      // Gestion du redimensionnement
      const handleResize = () => {
        if (!mountRef.current) return;
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        
        setDimensions({ width, height });
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      
      window.addEventListener('resize', handleResize);
      handleResize(); // Initial call

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('mousemove', handleMouseMove);
        
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        
        // Nettoyage Three.js
        if (renderer) renderer.dispose();
        if (scene) {
          scene.traverse(object => {
            if (object instanceof THREE.Mesh) {
              if (object.geometry) object.geometry.dispose();
              if (object.material) {
                if (Array.isArray(object.material)) {
                  object.material.forEach(m => m.dispose());
                } else {
                  object.material.dispose();
                }
              }
            }
          });
        }
      };
    } catch (err) {
      console.error('Erreur Three.js:', err);
      setError(`Erreur lors de l'initialisation 3D: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      setLoading(false);
    }
  }, [donations, dimensions]);

  // Affichage conditionnel
  if (webGLAvailable === false) {
    return <Globe2DFallback donations={donations} />;
  }

  if (error) {
    return <WebGLErrorFallback />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-900 rounded-lg">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Chargement du globe 3D...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96">
      <div 
        ref={mountRef} 
        className="w-full h-full rounded-lg overflow-hidden bg-gray-900"
        style={{ cursor: 'grab' }}
      />
      <div className="absolute bottom-4 left-4 text-white text-sm bg-black bg-opacity-50 rounded px-2 py-1">
        Cliquez et déplacez pour tourner le globe
      </div>
    </div>
  );
};

export default Globe3D;