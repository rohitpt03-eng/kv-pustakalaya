'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ThreeDDeskStudio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 520;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 5.2);

    const isMobile = window.innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.5));
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff4e0, 2.0);
    mainLight.position.set(4, 6, 4);
    mainLight.castShadow = !isMobile;
    if (!isMobile) {
      mainLight.shadow.mapSize.width = 1024;
      mainLight.shadow.mapSize.height = 1024;
      mainLight.shadow.bias = -0.001;
    }
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.6);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    const warmPoint = new THREE.PointLight(0xf59e0b, 2.5, 8);
    warmPoint.position.set(0, -0.5, 2);
    scene.add(warmPoint);

    // 3. Root Interactive Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // --- ASSET 1: Premium Hardcover Notebook / Textbook ---
    const bookGroup = new THREE.Group();
    const coverMat = new THREE.MeshPhongMaterial({
      color: 0x1e3a8a,
      shininess: 60,
      specular: 0x60a5fa
    });
    const pageMat = new THREE.MeshPhongMaterial({
      color: 0xfef9c3,
      shininess: 10
    });
    const goldFoilMat = new THREE.MeshPhongMaterial({
      color: 0xf59e0b,
      shininess: 90,
      specular: 0xffedd5
    });

    // Book pages block
    const pagesGeo = new THREE.BoxGeometry(1.6, 2.2, 0.28);
    const pagesMesh = new THREE.Mesh(pagesGeo, pageMat);
    pagesMesh.castShadow = !isMobile;
    bookGroup.add(pagesMesh);

    // Spine & covers
    const frontCover = new THREE.Mesh(new THREE.BoxGeometry(1.64, 2.26, 0.04), coverMat);
    frontCover.position.z = 0.16;
    frontCover.castShadow = !isMobile;
    bookGroup.add(frontCover);

    const backCover = new THREE.Mesh(new THREE.BoxGeometry(1.64, 2.26, 0.04), coverMat);
    backCover.position.z = -0.16;
    backCover.castShadow = !isMobile;
    bookGroup.add(backCover);

    const spineCover = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.26, 0.36), goldFoilMat);
    spineCover.position.x = -0.82;
    bookGroup.add(spineCover);

    // Decorative golden bookmark ribbon
    const ribbonMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 2.3, 0.02), goldFoilMat);
    ribbonMesh.position.set(0.3, 0, 0.185);
    bookGroup.add(ribbonMesh);

    bookGroup.position.set(-1.1, 0.1, 0);
    bookGroup.rotation.set(0.35, 0.45, -0.15);
    mainGroup.add(bookGroup);

    // --- ASSET 2: Open Flying / Floating Study Book with curved pages ---
    const openBookGroup = new THREE.Group();
    const openPageL = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.4, 0.04), pageMat);
    openPageL.position.set(-0.5, 0, 0);
    openPageL.rotation.y = 0.25;
    openPageL.castShadow = !isMobile;
    openBookGroup.add(openPageL);

    const openPageR = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.4, 0.04), pageMat);
    openPageR.position.set(0.5, 0, 0);
    openPageR.rotation.y = -0.25;
    openPageR.castShadow = !isMobile;
    openBookGroup.add(openPageR);

    const openSpine = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.42, 16), goldFoilMat);
    openSpine.rotation.z = Math.PI / 2;
    openSpine.rotation.y = Math.PI / 2;
    openBookGroup.add(openSpine);

    openBookGroup.position.set(1.4, 0.9, -0.6);
    openBookGroup.rotation.set(-0.3, -0.6, 0.2);
    openBookGroup.scale.set(0.75, 0.75, 0.75);
    mainGroup.add(openBookGroup);

    // --- ASSET 3: Luxury Metallic Fountain Pen & Stylus ---
    const penGroup = new THREE.Group();
    const barrelMat = new THREE.MeshPhongMaterial({ color: 0x0f172a, shininess: 100, specular: 0x94a3b8 });
    const clipMat = new THREE.MeshPhongMaterial({ color: 0xf59e0b, shininess: 120, specular: 0xffffff });
    const nibMat = new THREE.MeshPhongMaterial({ color: 0xe2e8f0, shininess: 150, specular: 0xffffff });

    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.7, 24), barrelMat);
    barrel.castShadow = !isMobile;
    penGroup.add(barrel);

    const goldRing = new THREE.Mesh(new THREE.CylinderGeometry(0.074, 0.074, 0.08, 24), clipMat);
    goldRing.position.y = 0.3;
    penGroup.add(goldRing);

    const nib = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.28, 24), nibMat);
    nib.position.y = 0.98;
    nib.castShadow = !isMobile;
    penGroup.add(nib);

    const clip = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.7, 0.07), clipMat);
    clip.position.set(0, -0.3, 0.09);
    penGroup.add(clip);

    penGroup.position.set(1.1, -0.3, 0.7);
    penGroup.rotation.set(0.6, 0.2, -0.75);
    mainGroup.add(penGroup);

    // --- ASSET 4: Geometrical Precision Ruler & Drafting Set ---
    const rulerMat = new THREE.MeshPhongMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
      shininess: 90
    });
    const ruler = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.4, 0.02), rulerMat);
    ruler.position.set(0.2, -0.7, -0.4);
    ruler.rotation.set(0.2, -0.3, 1.1);
    ruler.castShadow = !isMobile;
    mainGroup.add(ruler);

    // --- ASSET 5: Digital CSC Smart Token / Security Shield ---
    const tokenGroup = new THREE.Group();
    const badgeGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.08, 32);
    const badgeMat = new THREE.MeshPhongMaterial({ color: 0x10b981, shininess: 100, specular: 0x6ee7b7 });
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.rotation.x = Math.PI / 2;
    badgeMesh.castShadow = !isMobile;
    tokenGroup.add(badgeMesh);

    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.04, 16, 32), goldFoilMat);
    tokenGroup.add(outerRing);

    tokenGroup.position.set(-1.6, -0.8, 0.4);
    tokenGroup.rotation.set(0.2, 0.4, -0.1);
    mainGroup.add(tokenGroup);

    // --- ASSET 6: Floating Particle Sparks / Knowledge Spheres ---
    const particleCount = isMobile ? 12 : 28;
    const particleGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const particleMat = new THREE.MeshPhongMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.6
    });
    const particles: THREE.Mesh[] = [];

    for (let i = 0; i < particleCount; i++) {
      const p = new THREE.Mesh(particleGeo, particleMat);
      p.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3
      );
      p.userData = {
        speedY: 0.005 + Math.random() * 0.01,
        seed: Math.random() * Math.PI * 2
      };
      particles.push(p);
      mainGroup.add(p);
    }

    // 4. Mouse Interactivity
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 5. Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Group Parallax tilt
      mainGroup.rotation.y = mouseX * 0.35 + Math.sin(elapsed * 0.4) * 0.05;
      mainGroup.rotation.x = -mouseY * 0.25 + Math.cos(elapsed * 0.3) * 0.04;

      // Subtle dynamic floating per object
      bookGroup.position.y = 0.1 + Math.sin(elapsed * 1.4) * 0.08;
      bookGroup.rotation.z = -0.15 + Math.cos(elapsed * 1.1) * 0.04;

      openBookGroup.position.y = 0.9 + Math.sin(elapsed * 1.6 + 1.0) * 0.07;
      openBookGroup.rotation.y = -0.6 + Math.sin(elapsed * 0.9) * 0.06;

      penGroup.position.y = -0.3 + Math.cos(elapsed * 1.8) * 0.06;
      penGroup.rotation.z = -0.75 + Math.sin(elapsed * 1.3) * 0.05;

      tokenGroup.position.y = -0.8 + Math.sin(elapsed * 1.5 + 2.0) * 0.06;
      tokenGroup.rotation.y += 0.015;

      // Floating particles
      particles.forEach((p) => {
        p.position.y += Math.sin(elapsed * 2.0 + p.userData.seed) * 0.003;
      });

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    // 6. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full rounded-3xl bg-slate-50/80 border border-slate-100 p-2 shadow-xl overflow-hidden backdrop-blur-sm">
      <div 
        ref={containerRef} 
        className={`w-full h-[380px] sm:h-[460px] md:h-[500px] rounded-2xl overflow-hidden relative bg-gradient-to-b from-transparent to-sky-50/30 transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Floating Studio Indicator Badge */}
      <div className="absolute bottom-5 left-5 right-5 p-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-md flex items-center justify-between pointer-events-none border border-white/60">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-600"></span>
          </span>
          <span className="text-xs font-black text-slate-800 tracking-tight">Interactive 3D Stationery Desk</span>
        </div>
        <span className="text-[11px] text-sky-800 font-bold flex items-center gap-1">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C8.69 2 6 4.69 6 8v8c0 3.31 2.69 6 6 6s6-2.69 6-6V8c0-3.31-2.69-6-6-6zm4 14c0 2.21-1.79 4-4 4s-4-1.79-4-4V8c0-2.21 1.79-4 4-4s4 1.79 4 4v8zM11 6h2v5h-2z"/>
          </svg>
          Move cursor to inspect
        </span>
      </div>

      {/* Mini Overlay Tag */}
      <div className="absolute top-5 left-5 px-3 py-1 rounded-full bg-slate-900/85 text-white text-[10px] font-extrabold backdrop-blur-sm flex items-center gap-1.5 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        <span>Authentic Classmate & NCERT Stock</span>
      </div>
    </div>
  );
}
