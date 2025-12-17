"use client";

import dynamic from "next/dynamic";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

// Dynamically import Globe (client-side only)
const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
});

export default function GlobeComponent() {
  const globeEl = useRef<any>(null);
  const [globeReady, setGlobeReady] = useState(false);

  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1;
        controls.enableZoom = false;
      }

      globeEl.current.pointOfView({ lat: 23.5, lng: 0, altitude: 1.5 }, 2000);
      globeEl.current.scene().background = new THREE.Color("#F9FAFB");
      globeEl.current.renderer().setPixelRatio(window.devicePixelRatio);
    }
  }, [globeReady]);

  const countries = [
    { name: "USA", lat: 37.1, lng: -95.7 },
    { name: "Germany", lat: 51.2, lng: 10.4 },
    { name: "Switzerland", lat: 46.8, lng: 8.2 },
    { name: "Japan", lat: 36.2, lng: 138.3 },
  ];

  const pointsData = countries.map((country) => ({
    lat: country.lat,
    lng: country.lng,
    size: 0.15,
    color: "red",
    label: country.name,
  }));

  return (
    <div className="w-full h-full">
      <Globe
        ref={globeEl}
        globeImageUrl="/earthmap.jpg"
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointLabel="label"
        onGlobeReady={() => setGlobeReady(true)}
        height={500}
        width={500}
        animateIn={false}
        showAtmosphere={false}
      />
    </div>
  );
}
