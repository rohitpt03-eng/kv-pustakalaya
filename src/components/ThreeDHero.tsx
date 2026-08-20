'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ThreeDHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- 1. Scene & Renderer Setup ---
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf4f8fc, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    containerRef.current.appendChild(renderer.domElement);

    // --- 2. Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Icy White Key Light
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    // Liquid Cyan Fill Light
    const cyanLight = new THREE.PointLight(0x9de8ff, 2.5, 30);
    cyanLight.position.set(-6, -2, 5);
    scene.add(cyanLight);

    // Soft Lavender Accent Light
    const lavenderLight = new THREE.PointLight(0xddd6ff, 2.0, 30);
    lavenderLight.position.set(6, 4, 3);
    scene.add(lavenderLight);

    // Crystal Blue Backlight
    const blueLight = new THREE.SpotLight(0xddf4ff, 3.0, 40, Math.PI / 4, 0.5, 1);
    blueLight.position.set(0, 8, -10);
    scene.add(blueLight);

    // --- 3. Premium Glass & Paper Materials ---
    // Liquid Glass Material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      transmission: 0.9,
      roughness: 0.08,
      metalness: 0.1,
      ior: 1.52,
      thickness: 1.5,
      specularIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      side: THREE.DoubleSide,
    });

    // Crystalline Diamond Material
    const crystalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xeef8ff,
      transparent: true,
      opacity: 0.45,
      transmission: 0.95,
      roughness: 0.03,
      metalness: 0.2,
      ior: 2.42, // High diamond refraction index
      thickness: 2.0,
      clearcoat: 1.0,
      side: THREE.DoubleSide,
    });

    // Book Cover Material (Leather/Navy)
    const coverMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x17202a,
      roughness: 0.35,
      metalness: 0.15,
      clearcoat: 0.2,
    });

    // Book Pages Material (Paper)
    const pageMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.85,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });

    // Colored Plastics for Stationery
    const pencilBodyMat = new THREE.MeshStandardMaterial({ color: 0xb9d9ff, roughness: 0.3 });
    const pencilTipMat = new THREE.MeshStandardMaterial({ color: 0xffeab3, roughness: 0.6 });
    const pencilGraphiteMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.9 });
    const penMetallicMat = new THREE.MeshStandardMaterial({ color: 0x9de8ff, metalness: 0.8, roughness: 0.1 });

    // --- 4. Geometry Creators (Procedural 3D) ---
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // A. The Book Assembly Group
    const bookGroup = new THREE.Group();
    bookGroup.position.set(2.2, -0.5, 0); // Positioned center-right initially
    rootGroup.add(bookGroup);

    // Book Left Cover Pivot
    const leftCoverPivot = new THREE.Group();
    leftCoverPivot.position.set(0, 0, 0);
    bookGroup.add(leftCoverPivot);

    const leftCoverMesh = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.6, 0.12), coverMaterial);
    leftCoverMesh.position.set(-1.25, 0, 0);
    leftCoverMesh.castShadow = true;
    leftCoverMesh.receiveShadow = true;
    leftCoverPivot.add(leftCoverMesh);

    // Book Right Cover Pivot
    const rightCoverPivot = new THREE.Group();
    rightCoverPivot.position.set(0, 0, 0);
    bookGroup.add(rightCoverPivot);

    const rightCoverMesh = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.6, 0.12), coverMaterial);
    rightCoverMesh.position.set(1.25, 0, 0);
    rightCoverMesh.castShadow = true;
    rightCoverMesh.receiveShadow = true;
    rightCoverPivot.add(rightCoverMesh);

    // Spine
    const spineMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 3.6, 0.12), coverMaterial);
    spineMesh.position.set(0, 0, -0.06);
    bookGroup.add(spineMesh);

    // Pages Pivot List
    const pagesPivotList: THREE.Group[] = [];
    const pageCount = 9;
    for (let i = 0; i < pageCount; i++) {
      const pagePivot = new THREE.Group();
      pagePivot.position.set(0, 0, 0);
      bookGroup.add(pagePivot);
      pagesPivotList.push(pagePivot);

      // Create slightly curved/folded page geometry
      const pageGeo = new THREE.BoxGeometry(2.4, 3.4, 0.01);
      const pageMesh = new THREE.Mesh(pageGeo, pageMaterial);
      // Offset so rotation is at the page spine boundary
      pageMesh.position.set(1.2, 0, 0.01 * i);
      pageMesh.castShadow = true;
      pageMesh.receiveShadow = true;
      pagePivot.add(pageMesh);
    }

    // B. Floating Stationery Ecosystem
    const stationeryGroup = new THREE.Group();
    rootGroup.add(stationeryGroup);

    // Helper: Create a Pencil Mesh
    const createPencil = () => {
      const pencil = new THREE.Group();
      // Body
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.4, 8), pencilBodyMat);
      body.castShadow = true;
      pencil.add(body);
      // Sharp wood tip
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.001, 0.08, 0.25, 8), pencilTipMat);
      tip.position.y = 0.825;
      tip.castShadow = true;
      pencil.add(tip);
      // Lead lead tip
      const lead = new THREE.Mesh(new THREE.CylinderGeometry(0.001, 0.024, 0.08, 8), pencilGraphiteMat);
      lead.position.y = 0.92;
      pencil.add(lead);
      // Eraser ring (ferrule)
      const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.082, 0.12, 8), penMetallicMat);
      ferrule.position.y = -0.76;
      pencil.add(ferrule);
      // Eraser
      const eraser = new THREE.Mesh(new THREE.CylinderGeometry(0.076, 0.076, 0.14, 8), new THREE.MeshStandardMaterial({ color: 0xffb3b3, roughness: 0.6 }));
      eraser.position.y = -0.89;
      pencil.add(eraser);

      return pencil;
    };

    // Helper: Create a Pen Mesh
    const createPen = () => {
      const pen = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.075, 1.6, 12), penMetallicMat);
      body.castShadow = true;
      pen.add(body);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.078, 0.5, 12), glassMaterial);
      cap.position.y = 0.4;
      pen.add(cap);
      const clip = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.35, 0.08), penMetallicMat);
      clip.position.set(0, 0.4, 0.11);
      pen.add(clip);

      return pen;
    };

    // Spawn 5 floating pencils & pens around
    const stationeryList: { mesh: THREE.Group; speed: number; rangeY: number; phase: number; basePos: THREE.Vector3 }[] = [];
    for (let i = 0; i < 6; i++) {
      const isPen = i % 2 === 0;
      const mesh = isPen ? createPen() : createPencil();
      const scaleVal = 0.75 + Math.random() * 0.4;
      mesh.scale.set(scaleVal, scaleVal, scaleVal);

      // Distribute in a ring around center-right
      const angle = (i / 6) * Math.PI * 2;
      const radius = 2.8 + Math.random() * 1.5;
      const basePos = new THREE.Vector3(
        2.2 + Math.cos(angle) * radius,
        -0.5 + (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 4
      );
      mesh.position.copy(basePos);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      
      stationeryGroup.add(mesh);
      stationeryList.push({
        mesh,
        speed: 0.8 + Math.random() * 0.7,
        rangeY: 0.3 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        basePos
      });
    }

    // C. Flying Sheets of Paper
    const paperList: { mesh: THREE.Mesh; speed: number; phase: number; radius: number; baseAngle: number; heightOffset: number }[] = [];
    const paperGeo = new THREE.PlaneGeometry(0.5, 0.7, 4, 4);
    const paperMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.8,
      side: THREE.DoubleSide,
    });

    for (let i = 0; i < 8; i++) {
      const mesh = new THREE.Mesh(paperGeo, paperMat);
      mesh.castShadow = true;
      // Add subtle curve to sheets
      const pos = mesh.geometry.attributes.position;
      for (let j = 0; j < pos.count; j++) {
        const x = pos.getX(j);
        const y = pos.getY(j);
        pos.setZ(j, Math.sin(x * 2) * 0.08 * Math.cos(y * 2));
      }
      mesh.geometry.computeVertexNormals();

      scene.add(mesh);

      const baseAngle = (i / 8) * Math.PI * 2;
      const radius = 3.5 + Math.random() * 2;
      const heightOffset = -1 + Math.random() * 3;
      paperList.push({
        mesh,
        speed: 0.5 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        radius,
        baseAngle,
        heightOffset
      });
    }

    // D. Liquid Glass Ribbons & Blobs
    const glassRibbons: THREE.Mesh[] = [];
    const torusKnotGeo = new THREE.TorusKnotGeometry(1.6, 0.12, 100, 16, 2, 3);
    const knotMesh1 = new THREE.Mesh(torusKnotGeo, glassMaterial);
    knotMesh1.position.set(2.2, -0.6, -1.5);
    knotMesh1.scale.set(1.2, 1.2, 1.2);
    scene.add(knotMesh1);
    glassRibbons.push(knotMesh1);

    const knotMesh2 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.9, 0.08, 80, 12, 3, 4), glassMaterial);
    knotMesh2.position.set(-3.5, 1.5, -4);
    scene.add(knotMesh2);
    glassRibbons.push(knotMesh2);

    // Floating Glass Spheres/Blobs
    const blobsList: { mesh: THREE.Mesh; basePos: THREE.Vector3; phase: number; speed: number; range: number }[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.35, 32, 32);
    for (let i = 0; i < 7; i++) {
      const blob = new THREE.Mesh(sphereGeo, glassMaterial);
      const size = 0.5 + Math.random() * 0.8;
      blob.scale.set(size, size, size);
      
      const basePos = new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 7,
        -2 + (Math.random() - 0.5) * 6
      );
      blob.position.copy(basePos);
      scene.add(blob);
      blobsList.push({
        mesh: blob,
        basePos,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.5,
        range: 0.4 + Math.random() * 0.5
      });
    }

    // E. Diamond Crystal Shapes (Subtle refractions)
    const crystalsList: { mesh: THREE.Mesh; basePos: THREE.Vector3; rotationSpeed: THREE.Vector3; phase: number }[] = [];
    const octaGeo = new THREE.OctahedronGeometry(0.3, 0);
    for (let i = 0; i < 9; i++) {
      const crystal = new THREE.Mesh(octaGeo, crystalMaterial);
      const scaleVal = 0.6 + Math.random() * 0.8;
      crystal.scale.set(scaleVal, scaleVal, scaleVal);

      const basePos = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        2 - Math.random() * 7
      );
      crystal.position.copy(basePos);
      scene.add(crystal);
      crystalsList.push({
        mesh: crystal,
        basePos,
        rotationSpeed: new THREE.Vector3(
          0.005 + Math.random() * 0.015,
          0.005 + Math.random() * 0.015,
          0.005 + Math.random() * 0.015
        ),
        phase: Math.random() * Math.PI * 2
      });
    }

    // --- 5. Interactive Parallax & Scroll Integration ---
    let scrollY = 0;
    let targetScrollY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) - 0.5;
      targetMouseY = (e.clientY / window.innerHeight) - 0.5;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Mark loaded
    setIsLoaded(true);

    // --- 6. Frame Animation Loop ---
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Smooth scroll & mouse damping
      scrollY += (targetScrollY - scrollY) * 0.08;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Normalize scroll bounds
      const scrollMax = 900; // Trigger full open in first 900px scroll
      const scrollRatio = Math.min(scrollY / scrollMax, 1.0);

      // Book Animation based on scroll + entry reveal
      const revealProgress = Math.min(elapsed * 0.7, 1.0); // 0 to 1 open in first 1.5s
      const openRatio = Math.max(scrollRatio, revealProgress); 

      // Left cover rotates from 0 to -160 degrees
      leftCoverPivot.rotation.y = -openRatio * (Math.PI * 0.88);
      // Book Right cover rotates from 0 to +160 degrees
      rightCoverPivot.rotation.y = openRatio * (Math.PI * 0.88);

      // Page Flipping Logic: spread pages like a fan
      pagesPivotList.forEach((pivot, index) => {
        // Distribute rotation between left (-160 deg) and right (0 deg) cover states
        const pageRatio = index / (pageCount - 1);
        const targetRotation = -openRatio * (Math.PI * 0.88) * pageRatio;
        
        // Add tiny flutter wave
        const flutter = Math.sin(elapsed * 4 + index) * 0.015 * (1 - openRatio);
        pivot.rotation.y = targetRotation + flutter;
      });

      // Slowly rotate the book group
      bookGroup.rotation.y = Math.sin(elapsed * 0.25) * 0.15 + (mouseX * 0.4);
      bookGroup.rotation.x = -0.2 + Math.sin(elapsed * 0.1) * 0.08 + (mouseY * 0.3);
      bookGroup.position.y = -0.5 + Math.sin(elapsed * 0.75) * 0.06;

      // Stationery floats upward out of book as it opens
      stationeryList.forEach((item, index) => {
        // Base rise effect linked to book openRatio
        const riseOffset = openRatio * 1.5;
        
        // Floating wave animation
        const floatY = Math.sin(elapsed * item.speed + item.phase) * item.rangeY;
        
        item.mesh.position.y = item.basePos.y + floatY + riseOffset;
        item.mesh.position.x = item.basePos.x + Math.sin(elapsed * 0.3 + index) * 0.15;
        
        // Slow rotation
        item.mesh.rotation.x += 0.005;
        item.mesh.rotation.y += 0.008;
      });

      // Flying sheets of paper orbiting the book
      paperList.forEach((paper, index) => {
        const orbitAngle = paper.baseAngle + (elapsed * paper.speed * 0.18) + (openRatio * 1.2);
        
        // Orbit position math
        paper.mesh.position.x = bookGroup.position.x + Math.cos(orbitAngle) * paper.radius;
        paper.mesh.position.z = bookGroup.position.z + Math.sin(orbitAngle) * paper.radius;
        paper.mesh.position.y = paper.heightOffset + Math.sin(elapsed * 0.8 + index) * 0.3;

        // Orient paper mesh along orbit tangent
        paper.mesh.rotation.y = -orbitAngle + Math.PI / 2 + Math.sin(elapsed * 1.5 + index) * 0.15;
        paper.mesh.rotation.x = Math.sin(elapsed * 0.7 + index) * 0.2;
      });

      // Rotate glass ribbons
      glassRibbons.forEach((ribbon, index) => {
        ribbon.rotation.x = elapsed * 0.08 * (index === 0 ? 1 : -1);
        ribbon.rotation.y = elapsed * 0.05;
        // Parallax offset
        ribbon.position.x += (targetMouseX * 0.01 - ribbon.position.x) * 0.01;
      });

      // Float glass blobs
      blobsList.forEach((blob) => {
        blob.mesh.position.y = blob.basePos.y + Math.sin(elapsed * blob.speed + blob.phase) * blob.range;
        blob.mesh.position.x = blob.basePos.x + Math.cos(elapsed * 0.2 + blob.phase) * 0.1;
      });

      // Rotate and float diamond crystals
      crystalsList.forEach((crystal) => {
        crystal.mesh.rotation.x += crystal.rotationSpeed.x;
        crystal.mesh.rotation.y += crystal.rotationSpeed.y;
        crystal.mesh.rotation.z += crystal.rotationSpeed.z;
        // Hover float
        crystal.mesh.position.y = crystal.basePos.y + Math.sin(elapsed * 0.6 + crystal.phase) * 0.12;
      });

      // Mouse Parallax on root group
      rootGroup.position.x = mouseX * 2.2;
      rootGroup.position.y = -mouseY * 1.8;

      // Scroll camera zoom / path
      // Move camera closer and pan left as the user scrolls
      camera.position.z = 16 - (scrollRatio * 4.5);
      camera.position.x = -scrollRatio * 3.5;
      camera.lookAt(new THREE.Vector3(scrollRatio * 1.5, -scrollRatio * 0.5, 0));

      renderer.render(scene, camera);
    };

    animate();

    // --- 7. Window Resizing ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // --- 8. Cleanups ---
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
      {/* 3D WebGL Canvas container */}
      <div 
        ref={containerRef} 
        className={`w-full h-full transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
