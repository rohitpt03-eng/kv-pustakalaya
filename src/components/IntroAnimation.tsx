'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // --- 1. Scene & Camera ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf4f8fc);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 9);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    containerRef.current.appendChild(renderer.domElement);

    // --- 2. Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const cyanLight = new THREE.PointLight(0x9de8ff, 3.0, 15);
    cyanLight.position.set(-4, 0, 3);
    scene.add(cyanLight);

    // --- 3. Sharded Paper & Pen Meshes ---
    // Frosted Paper Glass Material
    const paperMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      transmission: 0.8,
      roughness: 0.15,
      metalness: 0.05,
      ior: 1.45,
      thickness: 1.0,
      side: THREE.DoubleSide,
      clearcoat: 1.0
    });

    const penMetallicMat = new THREE.MeshStandardMaterial({
      color: 0x17202a,
      metalness: 0.85,
      roughness: 0.15
    });

    const penAccentMat = new THREE.MeshStandardMaterial({
      color: 0x9de8ff,
      metalness: 0.6,
      roughness: 0.2
    });

    const tipMaterial = new THREE.MeshStandardMaterial({
      color: 0xddf4ff,
      metalness: 0.9,
      roughness: 0.1
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // A. Build Sharded Paper
    const paperGroup = new THREE.Group();
    rootGroup.add(paperGroup);

    const W = 3.6;
    const H = 5.0;

    // Define vertices around the rectangle perimeter
    const boundaryPoints = [
      new THREE.Vector3(-W/2, H/2, 0),    // 0: Top-Left
      new THREE.Vector3(0, H/2, 0),       // 1: Top-Center
      new THREE.Vector3(W/2, H/2, 0),     // 2: Top-Right
      new THREE.Vector3(W/2, 0, 0),       // 3: Right-Center
      new THREE.Vector3(W/2, -H/2, 0),    // 4: Bottom-Right
      new THREE.Vector3(0, -H/2, 0),      // 5: Bottom-Center
      new THREE.Vector3(-W/2, -H/2, 0),   // 6: Bottom-Left
      new THREE.Vector3(-W/2, 0, 0),      // 7: Left-Center
    ];

    // Create 8 sharded triangles meeting at a central point (0,0,0)
    const shards: {
      mesh: THREE.Mesh;
      baseCenter: THREE.Vector3;
      dir: THREE.Vector3;
      angle: number;
    }[] = [];

    for (let i = 0; i < 8; i++) {
      const p1 = boundaryPoints[i];
      const p2 = boundaryPoints[(i + 1) % 8];
      
      const geom = new THREE.BufferGeometry();
      
      // Initial positions
      const vertices = new Float32Array([
        0, 0, 0,        // Center vertex
        p1.x, p1.y, p1.z,
        p2.x, p2.y, p2.z
      ]);

      geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geom.computeVertexNormals();

      const mesh = new THREE.Mesh(geom, paperMaterial);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      paperGroup.add(mesh);

      // Radial direction vector pointing outward from center
      const avgX = (p1.x + p2.x) / 2;
      const avgY = (p1.y + p2.y) / 2;
      const dir = new THREE.Vector3(avgX, avgY, 0).normalize();
      const angle = Math.atan2(avgY, avgX);

      shards.push({
        mesh,
        baseCenter: new THREE.Vector3(0, 0, 0),
        dir,
        angle
      });
    }

    // B. Build the Falling Pen
    const penGroup = new THREE.Group();
    penGroup.position.set(0, 12, 0); // Start high
    penGroup.rotation.z = -0.15;    // Slight slant for dynamic entry
    scene.add(penGroup);

    // Pen Body Cylinder
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.2, 16), penMetallicMat);
    body.castShadow = true;
    penGroup.add(body);

    // Pen Clip
    const clip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.6, 0.15), penAccentMat);
    clip.position.set(0, 0.6, 0.17);
    penGroup.add(clip);

    // Tip Cone
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.001, 0.12, 0.45, 16), tipMaterial);
    tip.position.y = -1.325;
    tip.castShadow = true;
    penGroup.add(tip);

    // C. Burst Particles (sparks/small paper shards on impact)
    const particleCount = 20;
    const particleGeometry = new THREE.OctahedronGeometry(0.06, 0);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x9de8ff });
    const particles: { mesh: THREE.Mesh; vel: THREE.Vector3; rotSpeed: THREE.Vector3; active: boolean }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const pMesh = new THREE.Mesh(particleGeometry, particleMaterial);
      pMesh.visible = false;
      scene.add(pMesh);
      particles.push({
        mesh: pMesh,
        vel: new THREE.Vector3(),
        rotSpeed: new THREE.Vector3(Math.random() * 0.2, Math.random() * 0.2, Math.random() * 0.2),
        active: false
      });
    }

    // --- 4. Animation Timeline ---
    const animState = {
      impactProgress: 0, // 0 to 1 after impact
      cameraShake: 0
    };

    let isImpacted = false;

    const timeline = gsap.timeline({
      onComplete: () => {
        // Smoothly fade out overlay after completion
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.35,
          onComplete: () => {
            setIsOverlayVisible(false);
            onComplete();
          }
        });
      }
    });

    // 1st phase: Fast Pen descent (takes ~0.35s)
    timeline.to(penGroup.position, {
      y: -0.15, // Pierces through the paper slightly
      duration: 0.38,
      ease: 'power3.in',
      onComplete: () => {
        isImpacted = true;
        animState.cameraShake = 1.0;
        
        // Trigger burst particles
        particles.forEach((p, idx) => {
          p.mesh.position.set(0, 0, 0);
          p.mesh.visible = true;
          p.active = true;
          
          // Random semi-hemispherical direction
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI * 0.4;
          const speed = 4.5 + Math.random() * 5.0;
          p.vel.set(
            Math.cos(theta) * Math.sin(phi) * speed,
            Math.sin(theta) * Math.sin(phi) * speed,
            Math.cos(phi) * speed + 2.0
          );
        });
      }
    });

    // 2nd phase: Impact reaction deceleration, paper bending, and settling (takes ~0.8s)
    timeline.to(animState, {
      impactProgress: 1.0,
      duration: 0.35,
      ease: 'back.out(2.5)'
    });

    // Slow slide-through settling of the pen
    timeline.to(penGroup.position, {
      y: -0.85,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.35');

    // Camera shake dampening
    timeline.to(animState, {
      cameraShake: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, '-=0.5');

    // --- 5. Frame Render loop ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      
      const elapsed = clock.getElapsedTime();

      // Apply procedural shattering to paper shards post-impact
      if (isImpacted) {
        const progress = animState.impactProgress;
        
        shards.forEach((shard) => {
          const posAttr = shard.mesh.geometry.attributes.position;
          
          // Outward push displacement
          const pushDistance = progress * 0.35;
          const downPush = progress * -0.9; // Downward tear z-axis
          
          // Update the center vertex of each triangular shard
          // Index 0 in our buffer attribute represents the center vertex (0,0,0)
          posAttr.setX(0, shard.dir.x * pushDistance);
          posAttr.setY(0, shard.dir.y * pushDistance);
          posAttr.setZ(0, downPush);
          
          // Slightly curl the shards backwards
          shard.mesh.rotation.z = shard.angle + Math.sin(progress * Math.PI * 0.5) * 0.12;

          posAttr.needsUpdate = true;
          shard.mesh.geometry.computeVertexNormals();
        });

        // Update burst particles
        const dt = Math.min(clock.getDelta(), 0.03);
        particles.forEach(p => {
          if (!p.active) return;
          p.mesh.position.addScaledVector(p.vel, dt);
          p.mesh.rotation.x += p.rotSpeed.x;
          p.mesh.rotation.y += p.rotSpeed.y;
          // Apply gravity
          p.vel.y -= 9.8 * dt;
          
          // Slow down particles
          p.vel.multiplyScalar(0.95);
        });
      }

      // Camera Shake execution
      if (animState.cameraShake > 0.01) {
        const shake = animState.cameraShake * 0.12;
        camera.position.x = (Math.random() - 0.5) * shake;
        camera.position.y = 1.5 + (Math.random() - 0.5) * shake;
      } else {
        camera.position.x = 0;
        camera.position.y = 1.5;
      }

      // Ambient floating
      if (!isImpacted) {
        paperGroup.position.y = Math.sin(elapsed * 4) * 0.05;
        paperGroup.rotation.y = Math.cos(elapsed * 2) * 0.02;
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- 6. Resize listener ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // --- 7. Cleanup ---
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      timeline.kill();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (!isOverlayVisible) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#f4f8fc] w-screen h-screen overflow-hidden select-none pointer-events-auto"
      style={{ willChange: 'opacity' }}
    />
  );
}
