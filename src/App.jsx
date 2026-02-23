import React, { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Stars, Sphere, useTexture } from "@react-three/drei";

// MiniGlobe Gallery — Vercel-ready Vite + React single-page app
// - Tailwind classes assumed available via src/index.css
// - Public image URLs only (no APIs/keys)

const EARTH_TEX =
  "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-dashboard-pro/assets/img/earth.jpg";

const HERO_DEFAULT =
  "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1800&q=80";

const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    alt: "Mountains",
  },
  {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    alt: "Forest",
  },
  {
    src: "https://images.unsplash.com/photo-1520975958225-5d8b39f16e5b?auto=format&fit=crop&w=1200&q=80",
    alt: "City",
  },
  {
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    alt: "Desert",
  },
  {
    src: "https://images.unsplash.com/photo-1451188502541-13943edb6acb?auto=format&fit=crop&w=1200&q=80",
    alt: "Earth from space",
  },
  {
    src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
    alt: "Coastline",
  },
];

const CITIES = [
  {
    name: "New York",
    country: "USA",
    lat: 40.7128,
    lon: -74.006,
    fact: "A global hub for finance, arts, and food — with 800+ languages spoken across the city.",
    img: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "London",
    country: "UK",
    lat: 51.5074,
    lon: -0.1278,
    fact: "Built on the Thames, London blends centuries of history with a huge creative tech scene.",
    img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Tokyo",
    country: "Japan",
    lat: 35.6762,
    lon: 139.6503,
    fact: "A neon-meets-tradition megacity famous for rail punctuality and incredible neighborhoods.",
    img: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Sydney",
    country: "Australia",
    lat: -33.8688,
    lon: 151.2093,
    fact: "Harbor views, ocean culture, and the iconic Opera House define this sunny coastal city.",
    img: "https://images.unsplash.com/photo-1506973035872-a4f23f7d2f54?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Nairobi",
    country: "Kenya",
    lat: -1.2921,
    lon: 36.8219,
    fact: "Known as the ‘Green City in the Sun’ — with a national park right next to the skyline.",
    img: "https://images.unsplash.com/photo-1612464798191-c273a67d279b?auto=format&fit=crop&w=1200&q=80",
  },
];

function latLonToVec3(lat, lon, r = 1) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  const x = -r * Math.sin(phi) * Math.cos(theta);
  const z = r * Math.sin(phi) * Math.sin(theta);
  const y = r * Math.cos(phi);
  return [x, y, z];
}

function Marker({ pos, label, active, onClick }) {
  return (
    <group position={pos}>
      <mesh onClick={onClick}>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshStandardMaterial
          emissive={active ? "#a7f3d0" : "#60a5fa"}
          color={active ? "#10b981" : "#3b82f6"}
        />
      </mesh>
      <Html center distanceFactor={10}>
        <button
          onClick={onClick}
          className={
            "select-none rounded-full px-2 py-0.5 text-[10px] font-medium shadow-md ring-1 ring-white/15 backdrop-blur " +
            (active
              ? "bg-emerald-400/90 text-slate-900"
              : "bg-slate-900/70 text-white hover:bg-slate-900/85")
          }
        >
          {label}
        </button>
      </Html>
    </group>
  );
}

function Earth() {
  const tex = useTexture(EARTH_TEX);
  return (
    <meshStandardMaterial
      roughness={0.9}
      metalness={0.05}
      map={tex}
      color="white"
    />
  );
}

function Globe({ activeCity, onPick }) {
  const markers = useMemo(
    () =>
      CITIES.map((c) => ({
        ...c,
        pos: latLonToVec3(c.lat, c.lon, 1.02),
      })),
    []
  );

  return (
    <group>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 2, 2]} intensity={1.2} />
      <Stars radius={40} depth={12} count={1400} factor={3} fade speed={0.8} />

      <Sphere args={[1, 64, 64]}>
        <Earth />
      </Sphere>

      <Sphere args={[1.03, 64, 64]}>
        <meshStandardMaterial transparent opacity={0.08} color="#93c5fd" />
      </Sphere>

      {markers.map((m) => (
        <Marker
          key={m.name}
          pos={m.pos}
          label={m.name}
          active={activeCity?.name === m.name}
          onClick={() => onPick(m)}
        />
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={2.1}
        maxDistance={3.2}
        rotateSpeed={0.7}
      />
    </group>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/8 px-4 py-3 ring-1 ring-white/12">
      <div className="text-[11px] text-white/60">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-white/90">{value}</div>
    </div>
  );
}

export default function App() {
  const [activeCity, setActiveCity] = useState(CITIES[0]);
  const [hero, setHero] = useState(HERO_DEFAULT);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      <div className="relative min-h-screen overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${hero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/60 to-slate-950" />

        <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 pt-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm grid place-items-center shadow-lg">
              <span className="text-lg">🌍</span>
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide text-white/95">
                MiniGlobe Gallery
              </div>
              <div className="text-xs text-white/60">Pick a city • swap the scene</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/65">
            <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
              @react-three/fiber
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
              drei
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
              Tailwind
            </span>
          </div>
        </header>

        <main className="relative z-10 mx-auto max-w-6xl px-4 pb-28 pt-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="relative h-[520px] w-full overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/12 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-white/0" />
                <div className="absolute left-4 top-4 z-10 rounded-2xl bg-slate-950/45 px-3 py-2 text-xs text-white/70 ring-1 ring-white/10 backdrop-blur">
                  Click markers: New York, London, Tokyo, Sydney, Nairobi
                </div>
                <Canvas camera={{ position: [0, 0, 2.6], fov: 45 }}>
                  <Globe activeCity={activeCity} onPick={setActiveCity} />
                </Canvas>
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="h-[520px] rounded-3xl bg-white/10 ring-1 ring-white/15 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-white/60">Selected city</div>
                      <div className="text-xl font-semibold leading-tight">
                        {activeCity.name}
                      </div>
                      <div className="text-sm text-white/70">{activeCity.country}</div>
                    </div>
                    <button
                      onClick={() => setHero(activeCity.img)}
                      className="rounded-2xl bg-white/10 px-3 py-2 text-xs font-medium ring-1 ring-white/15 hover:bg-white/15"
                      title="Use city image as background"
                    >
                      Set as hero
                    </button>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-white/12">
                    <img
                      src={activeCity.img}
                      alt={activeCity.name}
                      className="h-44 w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl bg-slate-950/40 p-4 ring-1 ring-white/10">
                      <div className="text-xs text-white/60">Quick note</div>
                      <div className="mt-1 text-sm text-white/80 leading-relaxed">
                        {activeCity.fact}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <InfoPill label="Latitude" value={activeCity.lat.toFixed(4)} />
                      <InfoPill label="Longitude" value={activeCity.lon.toFixed(4)} />
                      <InfoPill label="Markers" value="5" />
                      <InfoPill label="Gallery" value="6" />
                    </div>

                    <div className="text-xs text-white/55">
                      Tip: click any gallery tile below to swap the hero background.
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 z-20">
          <div className="mx-auto max-w-6xl px-4 pb-4">
            <div className="rounded-3xl bg-slate-950/55 ring-1 ring-white/12 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between px-5 pt-4">
                <div>
                  <div className="text-sm font-semibold">Gallery strip</div>
                  <div className="text-xs text-white/60">Tap an image to set the background</div>
                </div>
                <button
                  onClick={() => setHero(HERO_DEFAULT)}
                  className="text-xs rounded-2xl bg-white/10 px-3 py-2 ring-1 ring-white/15 hover:bg-white/15"
                >
                  Reset
                </button>
              </div>

              <div className="px-5 pb-5 pt-3">
                <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {GALLERY.map((g) => (
                    <button
                      key={g.src}
                      onClick={() => setHero(g.src)}
                      className={
                        "group relative h-20 w-32 flex-none overflow-hidden rounded-2xl ring-1 transition " +
                        (hero === g.src
                          ? "ring-emerald-300/60"
                          : "ring-white/12 hover:ring-white/25")
                      }
                      title={g.alt}
                    >
                      <img
                        src={g.src}
                        alt={g.alt}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
