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
    if (!containerRef.current) return;

    // Lock body scrolling
    document.body.style.overflow = 'hidden';

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

    const cyanLight = new THREE.PointLight(0x9de8ff, 3.5, 15);
    cyanLight.position.set(-4, 0, 3);
    scene.add(cyanLight);

    const lavenderLight = new THREE.PointLight(0xddd6ff, 2.5, 15);
    lavenderLight.position.set(4, -1, 3);
    scene.add(lavenderLight);

    // --- 3. Dynamic Copy Paper Canvas Texture ---
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Frosted white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 512, 512);

      // Red double margin line
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(90, 0);
      ctx.lineTo(90, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(96, 0);
      ctx.lineTo(96, 512);
      ctx.stroke();

      // Blue copy lines
      ctx.strokeStyle = '#cce0ff';
      ctx.lineWidth = 2.0;
      for (let y = 60; y < 512; y += 38) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
      }
    }
    const paperTexture = new THREE.CanvasTexture(canvas);

    // Paper Material with clearcoat & transparency
    const paperMaterial = new THREE.MeshPhysicalMaterial({
      map: paperTexture,
      transparent: true,
      opacity: 0.75,
      transmission: 0.5,
      roughness: 0.25,
      metalness: 0.05,
      ior: 1.45,
      thickness: 0.5,
      side: THREE.DoubleSide,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1
    });

    const penMetallicMat = new THREE.MeshStandardMaterial({
      color: 0x17202a,
      metalness: 0.9,
      roughness: 0.12
    });

    const penAccentMat = new THREE.MeshStandardMaterial({
      color: 0x9de8ff,
      metalness: 0.6,
      roughness: 0.2
    });

    const tipMaterial = new THREE.MeshStandardMaterial({
      color: 0xddf4ff,
      metalness: 0.95,
      roughness: 0.05
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- 4. Shattered Paper Procedural Grid Creation ---
    const paperGroup = new THREE.Group();
    rootGroup.add(paperGroup);

    const W = 3.6;
    const H = 5.0;

    // Helper to get polar grid coordinates clamped to bounds
    const getPaperVertex = (r: number, theta: number) => {
      if (r === 0) return new THREE.Vector3(0, 0, 0);
      
      let radius = 0;
      if (r === 1) radius = 0.3 + Math.random() * 0.15;
      else if (r === 2) radius = 0.95 + Math.random() * 0.25;
      else {
        // Clamp concentric ring 3 to rectangular boundary
        const cosVal = Math.cos(theta);
        const sinVal = Math.sin(theta);
        const limitX = W / 2;
        const limitY = H / 2;
        
        const rX = Math.abs(limitX / cosVal);
        const rY = Math.abs(limitY / sinVal);
        radius = Math.min(rX, rY);
      }
      
      return new THREE.Vector3(radius * Math.cos(theta), radius * Math.sin(theta), 0);
    };

    interface ShardInfo {
      mesh: THREE.Mesh;
      type: 'fly' | 'hinge';
      velocity: THREE.Vector3;
      rotSpeed: THREE.Vector3;
      centerOffset: THREE.Vector3;
      originAngle: number;
    }

    const shardList: ShardInfo[] = [];
    const sectors = 12; // Radial divisions

    // Build the concentric mesh layers
    for (let s = 0; s < sectors; s++) {
      const theta1 = (s / sectors) * Math.PI * 2;
      const theta2 = ((s + 1) / sectors) * Math.PI * 2;

      // Layer 0: Triangles meeting at Center
      const v0_0 = getPaperVertex(0, theta1);
      const v0_1 = getPaperVertex(1, theta1);
      const v0_2 = getPaperVertex(1, theta2);

      // Layer 1: inner rings (quads split into 2 triangles)
      const v1_0 = getPaperVertex(1, theta1);
      const v1_1 = getPaperVertex(2, theta1);
      const v1_2 = getPaperVertex(2, theta2);
      const v1_3 = getPaperVertex(1, theta2);

      // Layer 2: outer boundaries (quads split into 2 triangles)
      const v2_0 = getPaperVertex(2, theta1);
      const v2_1 = getPaperVertex(3, theta1);
      const v2_2 = getPaperVertex(3, theta2);
      const v2_3 = getPaperVertex(2, theta2);

      const addTriangle = (vA: THREE.Vector3, vB: THREE.Vector3, vC: THREE.Vector3, type: 'fly' | 'hinge', layer: number) => {
        const geom = new THREE.BufferGeometry();
        const vertices = new Float32Array([
          vA.x, vA.y, vA.z,
          vB.x, vB.y, vB.z,
          vC.x, vC.y, vC.z
        ]);
        
        // Map UV coordinates relative to absolute layout bounding box
        const uvs = new Float32Array([
          (vA.x + W/2) / W, (vA.y + H/2) / H,
          (vB.x + W/2) / W, (vB.y + H/2) / H,
          (vC.x + W/2) / W, (vC.y + H/2) / H
        ]);

        geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        geom.computeVertexNormals();

        const mesh = new THREE.Mesh(geom, paperMaterial);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        paperGroup.add(mesh);

        const centroid = new THREE.Vector3()
          .add(vA).add(vB).add(vC)
          .multiplyScalar(1 / 3);

        const originAngle = Math.atan2(centroid.y, centroid.x);
        const dir = new THREE.Vector3(centroid.x, centroid.y, 0).normalize();

        // Velocity profiles based on layer distance
        const velocity = new THREE.Vector3();
        const rotSpeed = new THREE.Vector3(
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5
        );

        if (type === 'fly') {
          const speed = layer === 0 ? 5.5 : 2.5;
          velocity.set(dir.x * speed * 0.8, dir.y * speed * 0.8, -4.0 - Math.random() * 3.0);
        }

        shardList.push({
          mesh,
          type,
          velocity,
          rotSpeed,
          centerOffset: centroid,
          originAngle
        });
      };

      // Create Shards
      addTriangle(v0_0, v0_1, v0_2, 'fly', 0);
      
      addTriangle(v1_0, v1_1, v1_2, 'fly', 1);
      addTriangle(v1_0, v1_2, v1_3, 'fly', 1);

      addTriangle(v2_0, v2_1, v2_2, 'hinge', 2);
      addTriangle(v2_0, v2_2, v2_3, 'hinge', 2);
    }

    // --- 5. Falling Pen Setup ---
    const penGroup = new THREE.Group();
    penGroup.position.set(0.1, 12, 0); // descent starting point
    penGroup.rotation.z = -0.15;
    scene.add(penGroup);

    const penBody = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.2, 16), penMetallicMat);
    penBody.castShadow = true;
    penGroup.add(penBody);

    const penClip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.6, 0.15), penAccentMat);
    penClip.position.set(0, 0.6, 0.17);
    penGroup.add(penClip);

    const penTip = new THREE.Mesh(new THREE.CylinderGeometry(0.001, 0.12, 0.45, 16), tipMaterial);
    penTip.position.y = -1.325;
    penTip.castShadow = true;
    penGroup.add(penTip);

    // Impact Sparks/Particles
    const particleCount = 25;
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
        rotSpeed: new THREE.Vector3(Math.random() * 0.4, Math.random() * 0.4, Math.random() * 0.4),
        active: false
      });
    }

    // --- 6. GSAP Timeline ---
    const animState = {
      impactProgress: 0,
      cameraShake: 0
    };

    let isImpacted = false;
    let impactTime = 0;

    const timeline = gsap.timeline({
      onComplete: () => {
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

    // Descent phase (0.35s)
    timeline.to(penGroup.position, {
      y: -0.2, // Pierces through the paper
      duration: 0.35,
      ease: 'power3.in',
      onComplete: () => {
        isImpacted = true;
        impactTime = clock.getElapsedTime();
        animState.cameraShake = 1.0;
        
        // Spawn sparks
        particles.forEach((p) => {
          p.mesh.position.set(0.1, -0.2, 0);
          p.mesh.visible = true;
          p.active = true;
          
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI * 0.45;
          const speed = 5.0 + Math.random() * 6.0;
          p.vel.set(
            Math.cos(theta) * Math.sin(phi) * speed,
            Math.sin(theta) * Math.sin(phi) * speed,
            Math.cos(phi) * speed + 3.0
          );
        });
      }
    });

    // Deceleration & Shatter Progress
    timeline.to(animState, {
      impactProgress: 1.0,
      duration: 0.38,
      ease: 'back.out(1.8)'
    });

    // Pen settles down slowly
    timeline.to(penGroup.position, {
      y: -0.9,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.38');

    // Camera shake dampening
    timeline.to(animState, {
      cameraShake: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, '-=0.5');

    // Hold the shattered page layout for remaining delay (3 seconds total splash screen)
    timeline.to({}, { duration: 1.8 });

    // --- 7. Frame Update loop ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      
      const elapsed = clock.getElapsedTime();

      if (isImpacted) {
        const progress = animState.impactProgress;
        
        // Physics Wobble / Rebound on Pen Tip
        const timeSinceImpact = elapsed - impactTime;
        if (timeSinceImpact > 0 && timeSinceImpact < 0.6) {
          const wobble = Math.sin(timeSinceImpact * 80) * 0.12 * Math.exp(-timeSinceImpact * 7);
          penGroup.rotation.z = -0.15 + wobble;
          penGroup.rotation.x = wobble * 0.5;
        }

        // Shards animation
        shardList.forEach((shard) => {
          if (shard.type === 'fly') {
            // Flying shards completely detach and fly away
            shard.mesh.position.copy(shard.velocity).multiplyScalar(progress * 0.6);
            // Apply gravity simulation
            shard.mesh.position.z += (progress * progress) * -3.0;
            
            // Rotate shards in flight
            shard.mesh.rotation.x = shard.rotSpeed.x * progress;
            shard.mesh.rotation.y = shard.rotSpeed.y * progress;
            shard.mesh.rotation.z = shard.rotSpeed.z * progress;
          } else {
            // Hinging outer shards fold back like a tear seam
            const hingeAngle = progress * 0.45;
            shard.mesh.rotation.z = shard.originAngle + (Math.sin(hingeAngle) * 0.1);
            shard.mesh.position.z = -progress * 0.22;
          }
        });

        // Particles trajectory updates
        const dt = Math.min(clock.getDelta(), 0.03);
        particles.forEach(p => {
          if (!p.active) return;
          p.mesh.position.addScaledVector(p.vel, dt);
          p.mesh.rotation.x += p.rotSpeed.x;
          p.mesh.rotation.y += p.rotSpeed.y;
          p.vel.y -= 9.8 * dt; // Gravity
          p.vel.multiplyScalar(0.96); // Drag
        });
      }

      // Camera Shake
      if (animState.cameraShake > 0.01) {
        const shake = animState.cameraShake * 0.15;
        camera.position.x = (Math.random() - 0.5) * shake;
        camera.position.y = 1.5 + (Math.random() - 0.5) * shake;
      } else {
        camera.position.x = 0;
        camera.position.y = 1.5;
      }

      // Floating paper prior to impact
      if (!isImpacted) {
        paperGroup.position.y = Math.sin(elapsed * 4) * 0.05;
        paperGroup.rotation.y = Math.cos(elapsed * 2) * 0.02;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize listener
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanups
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      timeline.kill();
      document.body.style.overflow = ''; // Unlock scroll
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
