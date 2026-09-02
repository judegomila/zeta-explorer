// TwistorDualIntertwinerViz.jsx
//
// Projective twistor space PT, its dual PT*, and the intertwiner between
// them, with the Riemann zeta function mapped onto the fibration.
//
// LEFT  — PT:  the Robinson congruence: fibers of the Hopf fibration
//          S^3 -> S^2 stereographically projected to R^3 — circles on
//          nested tori around a central axis, twisting coherently.
// RIGHT — PT*: the mirrored congruence with OPPOSITE helicity
//          (z_2 phase conjugated, so the linking of every fiber pair
//          reverses sign).
// CENTER — the incidence correspondence Q = {([Z],[W]) : W·Z = 0},
//          drawn as animated strands pairing the fiber at s with the
//          fiber at 1-s.  Labelled I_K F+ = F- ∘ R — in the source
//          paper this identity is an O-status DESIGN REQUIREMENT,
//          not a known theorem.
//
// ZETA MAPPING — each fiber pair carries a point s = sigma + i t of the
// physical slice, t wrapped around the congruence axis.  On the critical
// line xi(1/2+it) is real; the fiber color family encodes the sign of
// the Riemann–Siegel Z(t) (same zeros / sign structure as xi on the
// line) and log|Z(t)| sets brightness and tube thickness, so every zero
// is a visible geometric event: the color family flips and the fiber
// necks down.  Off the line, hue = arg zeta(s) and brightness = log|zeta(s)|
// with zeta computed by the Borwein-accelerated eta series (a true
// analytic continuation, accurate for the t <= 60 window used here).
// Intertwiner strands are colored by arg xi(s), which is invariant under
// s -> 1-s (xi(s) = xi(1-s)), so a strand's color is well-defined from
// either endpoint.
//
// HONESTY: the twistor geometry is the paper's auxiliary layer, rendered
// faithfully (true Hopf-fiber stereographic projection), and it proves
// nothing about zeta.  No Lambda bound, no RH claim.
//
// Perf: ~160 tubes total (3 latitude bands x 26 fibers x 2 sides, plus
// zero-fibers and strands), TubeGeometry 56x5, additive-blend shader
// with a flowing phase term (the visible twist).  No heavy imports —
// Z(t) is computed live via riemannSiegelZ.

import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import SafeCanvas from './SafeCanvas.jsx';
import { InlineMath } from './KaTeXMath.jsx';
import {
  riemannSiegelZ, riemannSiegelTheta, zetaCriticalStrip,
  cMul, cAdd, cSub, cDiv, cLog, cAbs, ZETA_ZEROS,
} from '../math/zeta.js';

const TWO_PI = Math.PI * 2;
const mono = 'var(--ed-mono, "IBM Plex Mono", monospace)';

// ── palette ────────────────────────────────────────────────────────────────
const AMBER = new THREE.Color('#ffb454'); // Z(t) > 0  (warm family)
const BLUE = new THREE.Color('#5b8cff');  // Z(t) < 0  (cool family)
const WHITE = new THREE.Color('#ffffff');
const LEFT_AXIS = '#c9a05a';   // brass — marks PT
const RIGHT_AXIS = '#a58ae0';  // violet — marks PT*

// ── zeta helpers (all light; no data bundles) ──────────────────────────────

// Riemann–Siegel Z(t), extended below t = 2π (where the main-sum formula
// degenerates) by the exact identity Z(t) = Re[e^{iθ(t)} ζ(1/2+it)] with
// ζ from the Borwein-accelerated eta series.
function zHybrid(t) {
  if (t >= 7) return riemannSiegelZ(t);
  const th = riemannSiegelTheta(Math.max(t, 0.2));
  const z = zetaCriticalStrip([0.5, t], 60);
  return Math.cos(th) * z[0] - Math.sin(th) * z[1];
}

// Complex log-Gamma via Lanczos (g = 7), valid for Re(z) > 0 — always the
// case here since z = s/2 with sigma in (0, 1).
const LANCZOS = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028,
  771.32342877765313, -176.61502916214059, 12.507343278686905,
  -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
];
function cLogGamma(z) {
  const zm = [z[0] - 1, z[1]];
  let acc = [LANCZOS[0], 0];
  for (let i = 1; i < 9; i++) {
    acc = cAdd(acc, cDiv([LANCZOS[i], 0], [zm[0] + i, zm[1]]));
  }
  const tt = [zm[0] + 7.5, zm[1]];
  // 0.5 log(2π) + (z+0.5) log t − t + log acc
  let out = [0.5 * Math.log(TWO_PI), 0];
  out = cAdd(out, cMul([zm[0] + 0.5, zm[1]], cLog(tt)));
  out = cSub(out, tt);
  out = cAdd(out, cLog(acc));
  return out;
}

// arg xi(s) with xi(s) = 1/2 s(s-1) π^{-s/2} Γ(s/2) ζ(s), computed in the
// log domain (|xi| underflows fast in t; the phase does not).
function xiPhase(sigma, t) {
  const s = [sigma, t];
  let lg = [Math.log(0.5), 0];
  lg = cAdd(lg, cLog(s));
  lg = cAdd(lg, cLog([sigma - 1, t]));
  lg = cSub(lg, cMul([sigma / 2, t / 2], [Math.log(Math.PI), 0]));
  lg = cAdd(lg, cLogGamma([sigma / 2, t / 2]));
  lg = cAdd(lg, cLog(zetaCriticalStrip(s, 60)));
  return lg[1]; // Im log xi = arg xi (up to 2π)
}

// ── Hopf fiber, stereographically projected ────────────────────────────────
//
// Fiber over the S^2 point indexed by (eta, xiAng):
//   z1 = cos(eta) e^{i(φ+xiAng)},  z2 = sin(eta) e^{i·handed·φ}
// in S^3 ⊂ C^2, projected from the pole x4 = 1:
//   P = (x1, x3, x2) / (1 − x4)   (torus axis mapped to three.js +Y).
// handed = −1 conjugates z2, reversing every pairwise linking number:
// the opposite-helicity (dual) congruence.
class HopfFiberCurve extends THREE.Curve {
  constructor(eta, xiAng, handed, scale) {
    super();
    this.eta = eta;
    this.xiAng = xiAng;
    this.handed = handed;
    this.scale = scale;
    this.ce = Math.cos(eta);
    this.se = Math.sin(eta);
  }
  getPoint(u, target = new THREE.Vector3()) {
    const phi = TWO_PI * u;
    const x1 = this.ce * Math.cos(phi + this.xiAng);
    const x2 = this.ce * Math.sin(phi + this.xiAng);
    const x3 = this.se * Math.cos(phi);
    const x4 = this.handed * this.se * Math.sin(phi);
    const d = Math.max(1 - x4, 0.06); // stereographic denominator (guarded)
    const k = this.scale / d;
    return target.set(x1 * k, x3 * k, x2 * k);
  }
}

// ── flowing-phase shader (the visible twist along each circle) ─────────────
const FIBER_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const FIBER_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uBrightness;
  uniform float uTime;
  uniform float uDir;    // +1 left helicity, -1 dual helicity
  uniform float uDash;   // dash count around the circle
  uniform float uPulse;  // 0 = smooth flow, 1 = packet mode (strands)
  varying vec2 vUv;
  void main() {
    float w = 0.5 + 0.5 * sin(6.2831853 * (vUv.x * uDash - uDir * uTime));
    float flow = mix(0.55 + 0.45 * w * w,          // gentle flowing dashes
                     0.12 + 1.55 * pow(w, 10.0),   // bright moving packets
                     uPulse);
    vec3 col = uColor * uBrightness * flow;
    gl_FragColor = vec4(col, 1.0);
  }
`;

function makeFiberMaterial(color, brightness, dir, dash, pulse) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: color.clone() },
      uBrightness: { value: brightness },
      uTime: { value: 0 },
      uDir: { value: dir },
      uDash: { value: dash },
      uPulse: { value: pulse },
    },
    vertexShader: FIBER_VERT,
    fragmentShader: FIBER_FRAG,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

// ── congruence layout constants ────────────────────────────────────────────
// S^2 latitude bands -> nested tori.  The inner band's projected circles
// bunch tightly around the core circle, so it gets fewer fibers and a
// lower additive weight to avoid blowing out the center.
const BANDS = [
  { eta: 0.32, n: 10, w: 0.18 },
  { eta: 0.66, n: 26, w: 0.42 },
  { eta: 1.02, n: 26, w: 0.95 },
];
const FIBERS_PER_BAND = 26; // strand/mid-band angular resolution
const STRUCT_SCALE = 0.62;
const STRUCT_X = 3.05;             // ± offset of PT / PT*
const MID_BAND = 0.66;

// map t in [tMin, tMax] to the angle around the congruence axis
function angleOfT(t, tMin, tMax) {
  return TWO_PI * ((t - tMin) / Math.max(tMax - tMin, 1e-9));
}

// pick the point on a fiber closest to the other structure (strand anchor)
function strandAnchor(curve, offsetX, facing) {
  let best = null;
  let bestX = facing > 0 ? -Infinity : Infinity;
  const p = new THREE.Vector3();
  for (let i = 0; i < 64; i++) {
    curve.getPoint(i / 64, p);
    if ((facing > 0 && p.x > bestX) || (facing < 0 && p.x < bestX)) {
      bestX = p.x;
      best = p.clone();
    }
  }
  best.x += offsetX;
  return best;
}

// color + brightness for one fiber, honest on/off-line split.
// tSigned carries the side's own point: s = sigma+it on the left,
// 1-s = (1-sigma)-it on the right.
function fiberShade(onLine, sigmaSide, t, tSigned) {
  if (onLine) {
    const Z = zHybrid(t);
    const mag = Math.max(Math.abs(Z), 1e-6);
    const b = THREE.MathUtils.clamp((Math.log10(mag) + 1.9) / 2.4, 0.04, 1);
    return { color: (Z >= 0 ? AMBER : BLUE).clone(), b };
  }
  const z = zetaCriticalStrip([sigmaSide, tSigned], 60);
  const mag = Math.max(cAbs(z), 1e-9);
  const phase = Math.atan2(z[1], z[0]);
  const hue = ((phase / TWO_PI) + 1.08) % 1;
  const b = THREE.MathUtils.clamp((Math.log10(mag) + 1.6) / 2.1, 0.05, 1);
  return { color: new THREE.Color().setHSL(hue, 0.8, 0.6), b };
}

// ── scene data (geometry + materials), rebuilt on parameter change ─────────
function buildScene(tMin, tMax, sigma, showStrands, showZeros) {
  const onLine = Math.abs(sigma - 0.5) < 0.004;
  const fibers = [];   // { geom, mat }
  const anchors = { left: new Map(), right: new Map() }; // tKey -> Vector3
  const mats = [];

  for (const side of [-1, +1]) {
    const handed = side < 0 ? +1 : -1;        // dual side: opposite helicity
    const offsetX = side * STRUCT_X;
    const sigmaSide = side < 0 ? sigma : 1 - sigma;
    const tSign = side < 0 ? +1 : -1;         // dual side lives at 1-s (t -> -t)
    for (const { eta, n, w } of BANDS) {
      for (let j = 0; j < n; j++) {
        const xiAng = (TWO_PI * j) / n;
        const t = tMin + (j / n) * (tMax - tMin);
        const curve = new HopfFiberCurve(eta, xiAng, handed, STRUCT_SCALE);
        // dual side evaluates its own point 1-s = (1-sigma) - it
        const { color, b } = fiberShade(onLine, sigmaSide, t, tSign * t);
        const radius = 0.011 + 0.028 * b;
        const mat = makeFiberMaterial(color, w * (0.09 + 0.38 * b), handed, 9, 0);
        mats.push(mat);
        fibers.push({
          geom: new THREE.TubeGeometry(curve, 56, radius, 5, true),
          mat, offsetX,
        });
        if (eta === MID_BAND) {
          (side < 0 ? anchors.left : anchors.right)
            .set(j, strandAnchor(curve, offsetX, side < 0 ? +1 : -1));
        }
      }
    }
  }

  // zero fibers: bright white thin circles at the exact zero angles
  const zerosInWindow = ZETA_ZEROS.filter((g) => g > tMin && g < tMax);
  const zeroFibers = [];
  const zeroMarkers = [];
  if (showZeros) {
    for (const g of zerosInWindow) {
      const xiAng = angleOfT(g, tMin, tMax);
      for (const side of [-1, +1]) {
        const handed = side < 0 ? +1 : -1;
        const curve = new HopfFiberCurve(MID_BAND, xiAng, handed, STRUCT_SCALE);
        const mat = makeFiberMaterial(new THREE.Color('#ffedc2'), 0.38, handed, 22, 0);
        mats.push(mat);
        zeroFibers.push({
          geom: new THREE.TubeGeometry(curve, 56, 0.0065, 5, true),
          mat, offsetX: side * STRUCT_X,
        });
        zeroMarkers.push(strandAnchor(curve, side * STRUCT_X, side < 0 ? +1 : -1));
      }
    }
  }

  // intertwiner strands: pair fiber(s) with fiber(1-s) — every 2nd mid fiber
  const strands = [];
  if (showStrands) {
    for (let j = 0; j < FIBERS_PER_BAND; j += 2) {
      const a = anchors.left.get(j);
      const b = anchors.right.get(j);
      if (!a || !b) continue;
      const t = tMin + (j / FIBERS_PER_BAND) * (tMax - tMin);
      const mid1 = new THREE.Vector3(a.x * 0.35, a.y * 0.35 + 2.15, a.z * 0.35);
      const mid2 = new THREE.Vector3(b.x * 0.35, b.y * 0.35 + 2.15, b.z * 0.35);
      const curve = new THREE.CubicBezierCurve3(a, mid1, mid2, b);
      let color;
      if (onLine) {
        color = (zHybrid(t) >= 0 ? AMBER : BLUE).clone().lerp(WHITE, 0.08);
      } else {
        // arg xi(s) is invariant under s -> 1-s: one well-defined strand hue
        const ph = xiPhase(sigma, t);
        color = new THREE.Color().setHSL(((ph / TWO_PI) % 1 + 1.08) % 1, 0.7, 0.62);
      }
      const mat = makeFiberMaterial(color, 0.95, +1, 5, 1); // packet mode
      mats.push(mat);
      strands.push({ geom: new THREE.TubeGeometry(curve, 64, 0.014, 5, false), mat });
    }
  }

  return { fibers, zeroFibers, zeroMarkers, strands, mats, zerosInWindow, onLine };
}

// ── R3F scene ──────────────────────────────────────────────────────────────

function useHaloTexture() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null;
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,0.75)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.18)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
}

function CameraRig({ resetSignal }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 6.4, 7.6);
    camera.lookAt(0, 0, 0);
  }, [resetSignal, camera]);
  return null;
}

function CongruenceScene({ tMin, tMax, sigma, twistSpeed, showStrands, showZeros, resetSignal }) {
  const halo = useHaloTexture();
  const data = useMemo(
    () => buildScene(tMin, tMax, sigma, showStrands, showZeros),
    [tMin, tMax, sigma, showStrands, showZeros],
  );

  // dispose GPU resources of the previous build
  const prevRef = useRef(null);
  useEffect(() => {
    const prev = prevRef.current;
    if (prev && prev !== data) {
      for (const f of [...prev.fibers, ...prev.zeroFibers, ...prev.strands]) {
        f.geom.dispose();
      }
      for (const m of prev.mats) m.dispose();
    }
    prevRef.current = data;
    return () => {
      // final unmount cleanup
      if (prevRef.current === data) {
        for (const f of [...data.fibers, ...data.zeroFibers, ...data.strands]) {
          f.geom.dispose();
        }
        for (const m of data.mats) m.dispose();
        prevRef.current = null;
      }
    };
  }, [data]);

  useFrame((_, delta) => {
    for (const m of data.mats) {
      m.uniforms.uTime.value += delta * twistSpeed;
    }
  });

  return (
    <>
      <CameraRig resetSignal={resetSignal} />
      {/* faint halos anchoring the two spaces */}
      {halo && [-1, +1].map((side) => (
        <sprite key={side} position={[side * STRUCT_X, 0, -0.5]} scale={[7.4, 7.4, 1]}>
          <spriteMaterial
            map={halo}
            color={side < 0 ? LEFT_AXIS : RIGHT_AXIS}
            transparent
            opacity={0.035}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      ))}

      {/* central axes of PT and PT* (brass vs violet base hue) */}
      {[-1, +1].map((side) => (
        <mesh key={side} position={[side * STRUCT_X, 0, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 4.6, 6]} />
          <meshBasicMaterial
            color={side < 0 ? LEFT_AXIS : RIGHT_AXIS}
            transparent
            opacity={0.55}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Robinson congruence + dual */}
      {data.fibers.map((f, i) => (
        <mesh key={`f${i}`} position={[f.offsetX, 0, 0]} geometry={f.geom} material={f.mat} />
      ))}
      {data.zeroFibers.map((f, i) => (
        <mesh key={`z${i}`} position={[f.offsetX, 0, 0]} geometry={f.geom} material={f.mat} />
      ))}
      {data.zeroMarkers.map((p, i) => (
        <mesh key={`m${i}`} position={p}>
          <sphereGeometry args={[0.028, 10, 10]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.55}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      {data.strands.map((s, i) => (
        <mesh key={`s${i}`} geometry={s.geom} material={s.mat} />
      ))}

      {/* labels */}
      <Html position={[-STRUCT_X, 2.75, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{ color: LEFT_AXIS, fontFamily: mono, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', textShadow: '0 0 8px rgba(0,0,0,0.9)' }}>
          PT &nbsp;<span style={{ fontWeight: 400, opacity: 0.75 }}>twistor space · s</span>
        </div>
      </Html>
      <Html position={[STRUCT_X, 2.75, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{ color: RIGHT_AXIS, fontFamily: mono, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', textShadow: '0 0 8px rgba(0,0,0,0.9)' }}>
          PT* &nbsp;<span style={{ fontWeight: 400, opacity: 0.75 }}>dual · 1−s</span>
        </div>
      </Html>
      {showStrands && (
        <Html position={[0, 3.05, 0]} center style={{ pointerEvents: 'none' }}>
          <div style={{ color: '#e8e2d5', fontFamily: mono, fontSize: 12, whiteSpace: 'nowrap', textAlign: 'center', textShadow: '0 0 8px rgba(0,0,0,0.9)' }}>
            Q = {'{'}([Z],[W]) : W·Z = 0{'}'}
            <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>
              I<sub>K</sub> F₊ = F₋ ∘ R &nbsp;(design requirement — O-status)
            </div>
          </div>
        </Html>
      )}

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.55}
        minDistance={3.5}
        maxDistance={26}
      />
    </>
  );
}

// ── warm-styled control chrome ─────────────────────────────────────────────

function Ctl({ label, children }) {
  return (
    <div className="card" style={{ padding: '8px 12px', background: 'var(--paper2, #f6f1e7)', border: '1px solid var(--hairline, #d5c9b2)', borderRadius: 8 }}>
      <label style={{ display: 'block', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--faint, #8a7f6d)', fontFamily: mono, marginBottom: 5 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Toggle({ on, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px', borderRadius: 6, cursor: 'pointer',
        border: '1px solid var(--hairline, #d5c9b2)',
        background: on ? 'var(--brass-dk, #9a7b3f)' : 'var(--paper2, #f6f1e7)',
        color: on ? '#fff' : 'var(--ink-soft, #4a4238)',
        fontFamily: mono, fontSize: 12,
      }}
    >
      {children}
    </button>
  );
}

const Swatch = ({ color, label }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 16 }}>
    <span style={{ width: 12, height: 12, borderRadius: 3, background: color, display: 'inline-block', boxShadow: `0 0 6px ${color}` }} />
    <span style={{ fontSize: 12, color: 'var(--ink-soft, #4a4238)' }}>{label}</span>
  </span>
);

// ── main component ─────────────────────────────────────────────────────────

export default function TwistorDualIntertwinerViz() {
  const [tMin, setTMin] = useState(2);
  const [tMax, setTMax] = useState(52);
  const [sigma, setSigma] = useState(0.5);
  const [twistSpeed, setTwistSpeed] = useState(0.55);
  const [showStrands, setShowStrands] = useState(true);
  const [showZeros, setShowZeros] = useState(true);
  const [resetSignal, setResetSignal] = useState(0);

  const onLine = Math.abs(sigma - 0.5) < 0.004;
  const zerosInWindow = useMemo(
    () => ZETA_ZEROS.filter((g) => g > tMin && g < tMax),
    [tMin, tMax],
  );

  const resetCamera = useCallback(() => setResetSignal((n) => n + 1), []);

  return (
    <div>
      {/* controls */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 12 }}>
        <Ctl label={`t-window  [${tMin.toFixed(0)}, ${tMax.toFixed(0)}]`}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="range" min="2" max="40" step="1" value={tMin}
              onChange={(e) => setTMin(Math.min(+e.target.value, tMax - 10))} style={{ width: 110 }} />
            <input type="range" min="20" max="60" step="1" value={tMax}
              onChange={(e) => setTMax(Math.max(+e.target.value, tMin + 10))} style={{ width: 110 }} />
          </div>
        </Ctl>
        <Ctl label={onLine ? 'σ = 0.500 (critical line)' : `σ = ${sigma.toFixed(2)} (off-line)`}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="range" min="0.1" max="0.9" step="0.01" value={sigma}
              onChange={(e) => setSigma(+e.target.value)} style={{ width: 150, accentColor: onLine ? '#2e7d4f' : '#b05a2a' }} />
            <button onClick={() => setSigma(0.5)}
              style={{ fontSize: 10, fontFamily: mono, padding: '3px 7px', borderRadius: 5, border: '1px solid var(--hairline, #d5c9b2)', background: 'var(--paper2, #f6f1e7)', color: 'var(--ink-soft, #4a4238)', cursor: 'pointer' }}>
              ½
            </button>
          </div>
        </Ctl>
        <Ctl label={`twist speed ${twistSpeed.toFixed(2)}`}>
          <input type="range" min="0" max="1.6" step="0.05" value={twistSpeed}
            onChange={(e) => setTwistSpeed(+e.target.value)} style={{ width: 120 }} />
        </Ctl>
        <Toggle on={showStrands} onClick={() => setShowStrands((v) => !v)}>intertwiner</Toggle>
        <Toggle on={showZeros} onClick={() => setShowZeros((v) => !v)}>zeros</Toggle>
        <Toggle on={false} onClick={resetCamera}>reset camera</Toggle>
      </div>

      {/* canvas */}
      <div style={{ width: '100%', height: 580, borderRadius: 12, overflow: 'hidden', background: '#0b0e14', border: '1px solid var(--hairline, #d5c9b2)' }}>
        <SafeCanvas camera={{ position: [0, 6.4, 7.6], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true }}>
          <color attach="background" args={['#0b0e14']} />
          <fog attach="fog" args={['#0b0e14', 14, 30]} />
          <CongruenceScene
            tMin={tMin} tMax={tMax} sigma={sigma} twistSpeed={twistSpeed}
            showStrands={showStrands} showZeros={showZeros} resetSignal={resetSignal}
          />
        </SafeCanvas>
      </div>

      {/* legend */}
      <div className="card" style={{ marginTop: 12, padding: '12px 16px', background: 'var(--paper2, #f6f1e7)', border: '1px solid var(--hairline, #d5c9b2)', borderRadius: 8 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', rowGap: 6 }}>
          {onLine ? (
            <>
              <Swatch color="#ffb454" label="Z(t) > 0" />
              <Swatch color="#5b8cff" label="Z(t) < 0" />
              <Swatch color="#ffffff" label={`zeta zero (${zerosInWindow.length} in window)`} />
            </>
          ) : (
            <>
              <Swatch color="linear-gradient(90deg,#ff6a6a,#ffd76a,#6aff9e,#6ab8ff,#c86aff)" label="hue = arg ζ(s)" />
              <Swatch color="#ffffff" label="white fibers = critical-line zeros (reference)" />
            </>
          )}
          <Swatch color={LEFT_AXIS} label="PT axis" />
          <Swatch color={RIGHT_AXIS} label="PT* axis" />
          <span style={{ fontSize: 12, color: 'var(--ink-soft, #4a4238)' }}>
            thin fiber = |Z| small (necking at zeros) · strand hue = arg ξ(s) = arg ξ(1−s)
          </span>
        </div>
        {zerosInWindow.length > 0 && (
          <div style={{ marginTop: 8, fontSize: 11, fontFamily: mono, color: 'var(--faint, #8a7f6d)' }}>
            zeros in window: {zerosInWindow.map((g) => g.toFixed(2)).join('  ·  ')}
          </div>
        )}
      </div>

      {/* caption */}
      <div style={{ marginTop: 12, fontSize: 13, lineHeight: 1.75, color: 'var(--ink-soft, #4a4238)' }}>
        <p style={{ margin: '0 0 8px 0' }}>
          <strong style={{ color: 'var(--ink, #1c1814)' }}>What is shown.</strong>{' '}
          Left: the <strong>Robinson congruence</strong> — the fibers of the Hopf fibration{' '}
          <InlineMath tex={'S^3 \\to S^2'} /> stereographically projected to{' '}
          <InlineMath tex={'\\mathbb{R}^3'} />: {BANDS.reduce((a, bnd) => a + bnd.n, 0)} circles on{' '}
          {BANDS.length} nested tori around a common axis, each linking every other exactly once.
          This is the geometric picture of a single twistor in projective twistor space{' '}
          <InlineMath tex={'\\mathbb{PT}'} />. Right: the same congruence with{' '}
          <strong>opposite helicity</strong> (the <InlineMath tex={'z_2'} /> phase is conjugated,
          reversing every linking number) — the dual space <InlineMath tex={'\\mathbb{PT}^*'} />.
          The animated flow along each circle is the fiber phase — the twist of the congruence;
          it reverses handedness between the two sides.
        </p>
        <p style={{ margin: '0 0 8px 0' }}>
          <strong style={{ color: 'var(--ink, #1c1814)' }}>The zeta mapping.</strong>{' '}
          The height <InlineMath tex={'t'} /> of the physical slice{' '}
          <InlineMath tex={'s = \\sigma + it'} /> is wrapped once around each congruence axis
          (the seam where <InlineMath tex={'t_{\\max}'} /> rejoins <InlineMath tex={'t_{\\min}'} /> is an
          artifact of the wrapping, not a zero). On the critical line{' '}
          <InlineMath tex={'\\xi(\\tfrac12+it)'} /> is real; fibers are colored by the sign of the
          Riemann–Siegel <InlineMath tex={'Z(t)'} /> (same zeros and sign structure as{' '}
          <InlineMath tex={'\\xi'} /> there), with brightness and tube thickness set by{' '}
          <InlineMath tex={'\\log|Z(t)|'} />. <strong>Each zero is a visible geometric event</strong>:
          the color family flips between amber and blue and the fiber necks down; white fibers mark
          the exact zero angles. Because the pairing <InlineMath tex={'s \\leftrightarrow 1-s'} /> is
          complex conjugation on the line and <InlineMath tex={'\\xi(s)=\\xi(1-s)'} />, the mirrored
          fibers carry <strong>identical colors</strong> — the functional equation is literally
          visible as the left–right color symmetry through the intertwiner.
        </p>
        <p style={{ margin: '0 0 8px 0' }}>
          <strong style={{ color: 'var(--ink, #1c1814)' }}>Off the line.</strong>{' '}
          Moving <InlineMath tex={'\\sigma'} /> colors the left side by the phase (hue) and{' '}
          <InlineMath tex={'\\log'} />-magnitude (brightness) of <InlineMath tex={'\\zeta(s)'} /> and
          the right side by <InlineMath tex={'\\zeta(1-s)'} />, computed with the Borwein-accelerated
          eta series — a true analytic continuation, accurate throughout this window
          (<InlineMath tex={'t \\le 60'} />); no proxy is used. The left–right color symmetry breaks,
          <em> except</em> through the intertwiner pairing{' '}
          <InlineMath tex={'\\sigma \\leftrightarrow 1-\\sigma'} />: each strand is colored by{' '}
          <InlineMath tex={'\\arg \\xi(s)'} />, which equals <InlineMath tex={'\\arg \\xi(1-s)'} />{' '}
          exactly, so the strand's hue is well-defined from either endpoint — that shared hue is the
          reflection <InlineMath tex={'R'} /> made visible.
        </p>
        <div className="card" style={{ marginTop: 10, padding: '10px 14px', background: 'var(--paper2, #f6f1e7)', border: '1px solid var(--hairline, #d5c9b2)', borderLeft: '3px solid var(--terra-dk, #b05a2a)', borderRadius: 8 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--faint, #8a7f6d)', fontFamily: mono, marginBottom: 5 }}>
            Honesty note
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.7 }}>
            The strands render the incidence correspondence{' '}
            <InlineMath tex={'Q = \\{([Z],[W]) : W \\cdot Z = 0\\}'} /> and the intertwiner equation{' '}
            <InlineMath tex={'I_K F_+ = F_- \\circ R'} /> — in the source paper this equation is an
            O-status <strong>design requirement, not a known theorem</strong>. The twistor geometry
            is the paper's auxiliary layer: the Robinson congruence, its dual, and the incidence
            strands are rendered faithfully, but the geometry proves nothing about zeta. Only the
            zeta/xi values painted onto the fibers are computed facts. No Λ bound, no RH claim.
          </div>
        </div>
      </div>
    </div>
  );
}
