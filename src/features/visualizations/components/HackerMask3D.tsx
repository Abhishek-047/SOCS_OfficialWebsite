"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";

/**
 * 3D Hacker Mask Visualization - Globe Logic Edition
 * Uses the same architecture as Globe3D:
 * 1. Continents/Features are represented by Dots.
 * 2. Empty spaces/Skin are represented by a Grid/Wireframe.
 * 3. Flat but 3D (Subtle curvature, no egg shape).
 */
export function HackerMask3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth || 300;
    let height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 280;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const maskRoot = new THREE.Group();
    maskRoot.position.y = 10; 
    maskRoot.position.x = 0; // Moved closer to the card on the left
    scene.add(maskRoot);

    const colorPrimary = new THREE.Color(0xc8ff00); // Neon Green

    // --- 1. Load Mask Silhouette for Feature Sampling ---
    const maskImg = new Image();
    maskImg.crossOrigin = "Anonymous";
    maskImg.src = "/assets/mask.png";

    let frameId: number;

    maskImg.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const Res = 150; // Increased resolution
      canvas.width = Res;
      canvas.height = Res;
      ctx.drawImage(maskImg, 0, 0, Res, Res);
      const data = ctx.getImageData(0, 0, Res, Res).data;

      const positions: number[] = [];
      const colors: number[] = [];

      const W = 80; 
      const H = 98; 

      const getZ = (x: number, y: number) => {
        const nx = Math.abs(x);
        const normX = x / (W / 2);
        const normY = y / (H / 2);
        const dd = Math.sqrt(normX * normX + normY * normY);
        let zz = Math.cos(dd * Math.PI * 0.35) * 10;

        // --- Refined Balanced Nose Logic ---
        
        return zz;
      };

      const hologramGroup = new THREE.Group();
      maskRoot.add(hologramGroup);

      // --- 3. Generate Feature Dots ---
      for (let y = 0; y < Res; y++) {
        for (let x = 0; x < Res; x++) {
          const u = x / (Res - 1);
          const v = (y / (Res - 1)); // Clean sampling
          
          const posX = (u - 0.5) * W;
          const posY = (0.5 - v) * H;
          const nx = Math.abs(posX);
          const ny = posY;

          const idx = (y * Res + x) * 4;
          const r = data[idx];

          const isFeature = r > 160; 
          const isNoseFeature = nx < 4 && ny > -10 && ny < 15;
          
          if (isFeature || isNoseFeature) {
            let posZ = getZ(posX, ny);
            positions.push(posX, ny, posZ + 0.5); 
            colors.push(colorPrimary.r, colorPrimary.g, colorPrimary.b);
          }
        }
      }

      const pointsGeo = new THREE.BufferGeometry();
      pointsGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      pointsGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const pointsMat = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      });

      const featurePoints = new THREE.Points(pointsGeo, pointsMat);
      hologramGroup.add(featurePoints);

      // --- 4. Generate Holographic Pedestal (The "Plate/Box" part) ---
      const pedestalPositions: number[] = [];
      const pW = 110; 
      const pD = 110; 
      const pY = -70; 
      const pThick = 12; 
      const pDensity = 100; 

      // Top and Bottom Surfaces
      for (let i = 0; i <= pDensity; i++) {
        for (let j = 0; j <= pDensity; j++) {
          const px = (i / pDensity - 0.5) * pW;
          const pz = (j / pDensity - 0.5) * pD;
          
          // Only show dots on edges or every Nth dot for a grid look
          const isEdge = i === 0 || i === pDensity || j === 0 || j === pDensity;
          const isGrid = i % 4 === 0 && j % 4 === 0;

          if (isEdge || isGrid) {
            pedestalPositions.push(px, pY, pz);           // Top face
            pedestalPositions.push(px, pY - pThick, pz);  // Bottom face
          }
        }
      }

      // Vertical Edges (Pillars)
      const pulsePoints = [
        [-pW/2, -pD/2], [pW/2, -pD/2],
        [-pW/2, pD/2], [pW/2, pD/2]
      ];
      pulsePoints.forEach(([ex, ez]) => {
        for (let h = 0; h <= 10; h++) {
          const hy = pY - (h / 10) * pThick;
          pedestalPositions.push(ex, hy, ez);
        }
      });

      // --- 5. Holographic Rig (Pillar & Projector Box) ---
      const rigX = pW/2.2; // Left corner
      const rigZ = -pD/2;  // Front corner
      const rigHeight = 120; 
      
      // Vertical Pillar (3D Solid Bar)
      const pS = 4; // Pillar Section Size
      for (let h = 0; h <= 50; h++) {
        const hy = pY + (h / 50) * rigHeight;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
             // 3x3 core dots for a thicker column look
             const px = rigX + (i - 1.5) * pS;
             const pz = rigZ + (j - 1.5) * pS;
             pedestalPositions.push(px, hy, pz);
          }
        }
      }

      // Projector Box at Top (3D Rotated towards mask)
      const bS = 20; // Box Size
      const bY = pY + rigHeight;
      const rotY = -0.9; // Turn left
      const rotX = 0.4;  // Tilt down
      
      for (let i = 0; i <= 8; i++) {
        for (let j = 0; j <= 8; j++) {
          for (let k = 0; k <= 8; k++) {
             if (i === 0 || i === 8 || j === 0 || j === 8 || k === 0 || k === 8) {
                // Initial relative coords
                let rx = (i/8 - 0.5) * bS;
                let ry = (j/8 - 0.5) * bS;
                let rz = (k/8 - 0.5) * bS;

                // Rotate around X (Tilt down)
                const ry1 = ry * Math.cos(rotX) - rz * Math.sin(rotX);
                const rz1 = ry * Math.sin(rotX) + rz * Math.cos(rotX);
                ry = ry1; rz = rz1;

                // Rotate around Y (Turn left)
                const rx2 = rx * Math.cos(rotY) + rz * Math.sin(rotY);
                const rz2 = -rx * Math.sin(rotY) + rz * Math.cos(rotY);
                rx = rx2; rz = rz2;

                pedestalPositions.push(rigX + rx, bY + ry, rigZ + rz);
             }
          }
        }
      }

      const pedestalGeo = new THREE.BufferGeometry();
      pedestalGeo.setAttribute('position', new THREE.Float32BufferAttribute(pedestalPositions, 3));
      
      const pedestalMat = new THREE.PointsMaterial({
        color: 0xc8ff00,
        size: 1.5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      });

      const pedestalPoints = new THREE.Points(pedestalGeo, pedestalMat);
      maskRoot.add(pedestalPoints);

      // --- 6. Digital Light Beams (Projector Beams) ---
      const beamDotsCount = 100;
      const numRays = 6;
      const beamPositions = new Float32Array(numRays * beamDotsCount * 3);
      const beamColors = new Float32Array(numRays * beamDotsCount * 3);
      const beamProgress = new Float32Array(numRays * beamDotsCount);

      const beamTargets = [
        new THREE.Vector3(0, 10, 0),
        new THREE.Vector3(15, -10, 0),
        new THREE.Vector3(-15, -10, 0),
        new THREE.Vector3(0, -30, 0),
        new THREE.Vector3(8, 25, 0),
        new THREE.Vector3(-8, 25, 0)
      ];

      const beamSource = new THREE.Vector3(rigX, bY, rigZ);

      for (let r = 0; r < numRays; r++) {
        for (let i = 0; i < beamDotsCount; i++) {
          const idx = (r * beamDotsCount + i) * 3;
          beamProgress[r * beamDotsCount + i] = Math.random();
          
          const target = beamTargets[r];
          const progress = beamProgress[r * beamDotsCount + i];
          
          const pos = new THREE.Vector3().lerpVectors(beamSource, target, progress);
          beamPositions[idx] = pos.x;
          beamPositions[idx + 1] = pos.y;
          beamPositions[idx + 2] = pos.z;

          const intensity = Math.pow(1 - progress, 2) * 0.5;
          beamColors[idx] = colorPrimary.r * intensity;
          beamColors[idx+1] = colorPrimary.g * intensity;
          beamColors[idx+2] = colorPrimary.b * intensity;
        }
      }

      const beamGeo = new THREE.BufferGeometry();
      beamGeo.setAttribute('position', new THREE.BufferAttribute(beamPositions, 3));
      beamGeo.setAttribute('color', new THREE.BufferAttribute(beamColors, 3));
      
      const beamMat = new THREE.PointsMaterial({
        size: 0.6,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });

      const beams = new THREE.Points(beamGeo, beamMat);
      maskRoot.add(beams);

      // --- Animation Loop ---
      const render = () => {
        frameId = requestAnimationFrame(render);
        
        // 1. Static Scene Orientation
        maskRoot.rotation.y = -0.4;
        maskRoot.rotation.x = 0.1; 

        // 2. Dynamic Hologram Animation (Rotate & Float)
        const time = Date.now();
        if (hologramGroup) {
          hologramGroup.rotation.y += 0.01;
          hologramGroup.position.y = Math.sin(time * 0.0015) * 8;
        }

        // 3. Beam Animation (Scroll & Flicker)
        const posAttr = beamGeo.getAttribute('position') as THREE.BufferAttribute;
        for (let r = 0; r < numRays; r++) {
          const target = beamTargets[r].clone();
          if (hologramGroup) {
             target.y += hologramGroup.position.y;
          }

          for (let i = 0; i < beamDotsCount; i++) {
            const dotIdx = r * beamDotsCount + i;
            const idx = dotIdx * 3;
            
            // Increment progress for scrolling
            beamProgress[dotIdx] = (beamProgress[dotIdx] + 0.005) % 1.0;
            const p = beamProgress[dotIdx];
            
            const pos = new THREE.Vector3().lerpVectors(beamSource, target, p);
            posAttr.setXYZ(dotIdx, pos.x, pos.y, pos.z);
            
            // Flicker effect: slightly vary size or color intensity
            const intensity = Math.pow(1 - p, 2) * (0.4 + Math.random() * 0.3);
            beamColors[idx] = colorPrimary.r * intensity;
            beamColors[idx+1] = colorPrimary.g * intensity;
            beamColors[idx+2] = colorPrimary.b * intensity;
          }
        }
        posAttr.needsUpdate = true;
        beamGeo.getAttribute('color').needsUpdate = true;

        renderer.render(scene, camera);
      };
      render();

      gsap.from(maskRoot.scale, {
        x: 0, y: 0, z: 0,
        duration: 1.5,
        ease: "power4.out"
      });
    };

    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative" />
  );
}
