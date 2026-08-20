'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
    const pagesMeshList: THREE.Mesh[] = [];
    const pageCount = 9;
    for (let i = 0; i < pageCount; i++) {
      const pagePivot = new THREE.Group();
      pagePivot.position.set(0, 0, 0);
      bookGroup.add(pagePivot);
      pagesPivotList.push(pagePivot);

      // Create high-segment count plane for dynamic folding/bending
      const pageGeo = new THREE.PlaneGeometry(2.4, 3.4, 16, 2);
      // Translate vertices to anchor at left edge
      pageGeo.translate(1.2, 0, 0);

      const pageMesh = new THREE.Mesh(pageGeo, pageMaterial);
      pageMesh.position.set(0, 0, 0.01 * i);
      pageMesh.castShadow = true;
      pageMesh.receiveShadow = true;
      pagePivot.add(pageMesh);
      pagesMeshList.push(pageMesh);
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
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // 1. Position book covers at open state
      leftCoverPivot.rotation.y = -Math.PI * 0.88;
      rightCoverPivot.rotation.y = Math.PI * 0.88;

      // 2. Fan page rotations
      pagesPivotList.forEach((pivot, index) => {
        const pageRatio = index / (pageCount - 1);
        pivot.rotation.y = -Math.PI * 0.8 * pageRatio;
      });

      // 3. Fully scale up and position stationery items around book
      stationeryList.forEach((item) => {
        item.mesh.scale.setScalar(0.95);
        item.mesh.position.copy(item.basePos);
        item.mesh.position.y += 2.2;
      });

      // 4. Position camera in standard static perspective open composition
      camera.position.set(-2.5, -0.5, 12);
      camera.lookAt(new THREE.Vector3(1.2, -0.4, 0));

      renderer.render(scene, camera);
      setIsLoaded(true);

      const handleResize = () => {
        if (!containerRef.current) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        renderer.render(scene, camera);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (containerRef.current && renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    }

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

    // GSAP ScrollTrigger state object
    const animState = {
      openProgress: 0,
      pageTurn: 0,
      stationeryRise: 0,
      cameraPath: 0,
    };

    const scrollMax = 900; 

    // Create GSAP ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: () => `+=${scrollMax}`,
      scrub: 1.0, // Smooth scrubbing LERP
      onUpdate: (self) => {
        const progress = self.progress;

        // 0% to 20%: CLOSED BOOK (approaching)
        // 20% to 40%: BOOK OPENS
        if (progress <= 0.2) {
          animState.openProgress = 0;
        } else if (progress <= 0.45) {
          animState.openProgress = (progress - 0.2) / 0.25; 
        } else {
          animState.openProgress = 1;
        }

        // 40% to 65%: PAGES FLIP
        if (progress <= 0.4) {
          animState.pageTurn = 0;
        } else if (progress <= 0.65) {
          animState.pageTurn = (progress - 0.4) / 0.25; 
        } else {
          animState.pageTurn = 1;
        }

        // 60% to 85%: STATIONERY EMERGES
        if (progress <= 0.55) {
          animState.stationeryRise = 0;
        } else if (progress <= 0.85) {
          animState.stationeryRise = (progress - 0.55) / 0.3; 
        } else {
          animState.stationeryRise = 1;
        }

        // Camera path across full scroll (0 to 1)
        animState.cameraPath = progress;
      }
    });

    // Mark loaded
    setIsLoaded(true);

    // --- 6. Frame Animation Loop ---
    const clock = new THREE.Clock();
    const currentLookAt = new THREE.Vector3(0, 0, 0);

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Cinematic slow-damped scroll & mouse coordinates LERP
      scrollY += (targetScrollY - scrollY) * 0.045;
      mouseX += (targetMouseX - mouseX) * 0.035;
      mouseY += (targetMouseY - mouseY) * 0.035;

      const scrollRatio = animState.cameraPath;

      // Book Animation based on scroll + entry reveal
      const revealProgress = Math.min(elapsed * 0.65, 1.0); 
      // Open cover progress
      const openRatio = Math.max(animState.openProgress, revealProgress * 0.05);

      // Left cover rotates from 0 to -160 degrees
      leftCoverPivot.rotation.y = -openRatio * (Math.PI * 0.88);
      // Book Right cover rotates from 0 to +160 degrees
      rightCoverPivot.rotation.y = openRatio * (Math.PI * 0.88);

      // Page Flipping Logic: spread pages like a fan
      pagesPivotList.forEach((pivot, index) => {
        const pageRatio = index / (pageCount - 1);
        
        // Seq flip thresholds
        const pageStart = pageRatio * 0.5;
        const pageFlipProgress = Math.max(0, Math.min((animState.pageTurn - pageStart) / 0.5, 1.0));
        
        // Fan out a bit initially, then fully flip to the left
        const baseFan = -0.08 * pageRatio * openRatio;
        const flipRotation = -pageFlipProgress * (Math.PI * 0.8);
        
        // Add tiny flutter wave
        const flutter = Math.sin(elapsed * 4 + index) * 0.012 * (1 - pageFlipProgress) * openRatio;
        pivot.rotation.y = baseFan + flipRotation + flutter;
      });

      // Page Bending / Organic Curling Deformation Loop
      pagesMeshList.forEach((mesh, index) => {
        const angle = pagesPivotList[index].rotation.y;
        // Bending factor is maximal when the page is mid-turn
        const flipProgress = Math.abs(angle) / (Math.PI * 0.88);
        const bendFactor = Math.sin(flipProgress * Math.PI) * 0.32 * (1 - animState.cameraPath * 0.3);

        const pos = mesh.geometry.attributes.position;
        for (let j = 0; j < pos.count; j++) {
          const x = pos.getX(j); 
          const normX = x / 2.4; 
          const curve = Math.sin(normX * Math.PI) * bendFactor;
          pos.setZ(j, curve);
        }
        mesh.geometry.attributes.position.needsUpdate = true;
        mesh.geometry.computeVertexNormals();
      });

      // Slowly rotate the book group
      bookGroup.rotation.y = Math.sin(elapsed * 0.25) * 0.15 + (mouseX * 0.4);
      bookGroup.rotation.x = -0.2 + Math.sin(elapsed * 0.1) * 0.08 + (mouseY * 0.3);
      bookGroup.position.y = -0.5 + Math.sin(elapsed * 0.75) * 0.06;

      // Stationery floats upward out of book as it opens
      stationeryList.forEach((item, index) => {
        const itemStagger = (index / stationeryList.length) * 0.4;
        const emergenceRatio = Math.max(0, Math.min((animState.stationeryRise - itemStagger) / 0.6, 1.0));
        
        // Rise and scale
        const riseOffset = emergenceRatio * 2.2;
        const floatY = Math.sin(elapsed * item.speed + item.phase) * item.rangeY;
        
        item.mesh.position.y = item.basePos.y + floatY + riseOffset;
        item.mesh.position.x = item.basePos.x + Math.sin(elapsed * 0.3 + index) * 0.15;
        
        // Rotate slowly
        item.mesh.rotation.x += 0.005;
        item.mesh.rotation.y += 0.008;

        // Hide items initially, scale up as they emerge
        item.mesh.scale.setScalar(emergenceRatio * 0.95);

        // Transit some items close to lens on scroll transition (above 80% scroll)
        if (scrollRatio > 0.8) {
          const transitProgress = (scrollRatio - 0.8) / 0.2; 
          if (index === 0) {
            // First item (Pen) zooms close past front right of camera
            item.mesh.position.z += (11.0 - item.mesh.position.z) * 0.15 * transitProgress;
            item.mesh.position.x += (-2.0 - item.mesh.position.x) * 0.15 * transitProgress;
            item.mesh.position.y += (1.0 - item.mesh.position.y) * 0.15 * transitProgress;
          } else if (index === 1) {
            // Second item (Pencil) zooms close past front left of camera
            item.mesh.position.z += (10.0 - item.mesh.position.z) * 0.15 * transitProgress;
            item.mesh.position.x += (-5.0 - item.mesh.position.x) * 0.15 * transitProgress;
            item.mesh.position.y += (-1.5 - item.mesh.position.y) * 0.15 * transitProgress;
          }
        }
      });

      // Flying sheets of paper orbiting the book
      paperList.forEach((paper, index) => {
        const orbitAngle = paper.baseAngle + (elapsed * paper.speed * 0.18) + (animState.cameraPath * 1.2);
        
        paper.mesh.position.x = bookGroup.position.x + Math.cos(orbitAngle) * paper.radius;
        paper.mesh.position.z = bookGroup.position.z + Math.sin(orbitAngle) * paper.radius;
        paper.mesh.position.y = paper.heightOffset + Math.sin(elapsed * 0.8 + index) * 0.3;

        paper.mesh.rotation.y = -orbitAngle + Math.PI / 2 + Math.sin(elapsed * 1.5 + index) * 0.15;
        paper.mesh.rotation.x = Math.sin(elapsed * 0.7 + index) * 0.2;
      });

      // Rotate glass ribbons
      glassRibbons.forEach((ribbon, index) => {
        ribbon.rotation.x = elapsed * 0.08 * (index === 0 ? 1 : -1);
        ribbon.rotation.y = elapsed * 0.05;
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
        crystal.mesh.position.y = crystal.basePos.y + Math.sin(elapsed * 0.6 + crystal.phase) * 0.12;
      });

      // Mouse Parallax on root group
      rootGroup.position.x += (mouseX * 2.2 - rootGroup.position.x) * 0.06;
      rootGroup.position.y += (-mouseY * 1.8 - rootGroup.position.y) * 0.06;

      // Scroll camera zoom & pan LERP paths
      const targetCamZ = 16 - (scrollRatio * 6.0);
      const targetCamX = -scrollRatio * 4.5;
      const targetCamY = -scrollRatio * 1.8;

      camera.position.z += (targetCamZ - camera.position.z) * 0.055;
      camera.position.x += (targetCamX - camera.position.x) * 0.055;
      camera.position.y += (targetCamY - camera.position.y) * 0.055;

      const targetLookAt = new THREE.Vector3(scrollRatio * 2.0, -scrollRatio * 0.8, 0);
      currentLookAt.lerp(targetLookAt, 0.055);
      camera.lookAt(currentLookAt);

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
      trigger.kill();
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
