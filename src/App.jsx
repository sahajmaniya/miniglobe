import React, { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  Stars,
  Sphere,
  useTexture,
} from "@react-three/drei";

const EARTH_TEX =
  "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg";

const HERO_DEFAULT =
  "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1800&q=80";

const GALLERY = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1520975958225-5d8b39f16e5b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1451188502541-13943edb6acb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
];

const CITIES = [
  { name: "New York", lat: 40.7128, lon: -74.006 },
  { name: "London", lat: 51.5074, lon: -0.1278 },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { name: "Sydney", lat: -33.8688, lon: 151.2093 },
  { name: "Nairobi", lat: -1.2921, lon: 36.8219 },
];

function latLonToVec3(lat, lon, r = 1) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  const x = -r * Math.sin(phi) * Math.cos(theta);
  const z = r * Math.sin(phi) * Math.sin(theta);
  const y = r * Math.cos(phi);
  return [x, y, z];
}

function Earth() {
  const texture = useTexture(EARTH_TEX);
  return <meshStandardMaterial map={texture} />;
}

function Marker({ position, label, active, onClick }) {
  return (
    <group position={position}>
      <mesh onClick={onClick}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color={active ? "#10b981" : "#3b82f6"} />
      </mesh>
      <Html center distanceFactor={10}>
        <div className="text-[10px] bg-black/70 px-2 py-0.5 rounded-full">
          {label}
        </div>
      </Html>
    </group>
  );
}

function Globe({ active, setActive }) {
  const markers = useMemo(
    () =>
      CITIES.map((c) => ({
        ...c,
        position: latLonToVec3(c.lat, c.lon, 1.05),
      })),
    []
  );

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 2, 2]} />
      <Stars />

      <Sphere args={[1, 64, 64]}>
        <Earth />
      </Sphere>

      {markers.map((m) => (
        <Marker
          key={m.name}
          position={m.position}
          label={m.name}
          active={active?.name === m.name}
          onClick={() => setActive(m)}
        />
      ))}

      <OrbitControls enablePan={false} />
    </>
  );
}

export default function App() {
  const [activeCity, setActiveCity] = useState(CITIES[0]);
  const [hero, setHero] = useState(HERO_DEFAULT);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${hero})` }}
      />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 p-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[500px] bg-white/5 rounded-3xl overflow-hidden">
          <Canvas camera={{ position: [0, 0, 2.6] }}>
            <Suspense
              fallback={
                <Html center>
                  <div className="text-xs bg-black/60 px-3 py-1 rounded-xl">
                    Loading globe...
                  </div>
                </Html>
              }
            >
              <Globe active={activeCity} setActive={setActiveCity} />
            </Suspense>
          </Canvas>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6">
          <h2 className="text-xl font-semibold">{activeCity.name}</h2>
          <p className="text-sm text-white/70 mt-2">
            Latitude: {activeCity.lat} <br />
            Longitude: {activeCity.lon}
          </p>
          <button
            onClick={() => setHero(GALLERY[0])}
            className="mt-4 px-4 py-2 bg-white/20 rounded-xl text-sm"
          >
            Change Background
          </button>
        </div>
      </div>

      <div className="relative z-10 mt-6 px-6 pb-10 flex gap-4 overflow-x-auto">
        {GALLERY.map((img) => (
          <img
            key={img}
            src={img}
            onClick={() => setHero(img)}
            className="h-24 w-36 object-cover rounded-xl cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
}
