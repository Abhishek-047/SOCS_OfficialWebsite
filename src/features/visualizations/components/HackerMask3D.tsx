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

      const W = 150; 
      const H = 190; 

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

      // --- 4. Animation Loop ---
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
