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
// with zeta computed by Euler–Maclaurin continuation (a true analytic
// continuation, accurate throughout the t <= 100 window used here).
// Intertwiner strands are colored by arg xi(s), which is invariant under
// s -> 1-s (xi(s) = xi(1-s)), so a strand's color is well-defined from
// either endpoint.
//
// FIBER FREEZING — click a fiber to freeze it: its phase flow stops
// exactly, and its dual partner freezes with it (the s ↔ 1-s pair
// freezes as a unit).  This is the visual analogue of the paper's
// freeze–thaw calculus (§7.3): freezing the projective fiber coordinate
// ω gives the frozen pencil L_ω = W_ω* L W_ω.  Freezing is exact; the
// cost appears only at thaw (the Duhamel commutator).  The separate
// "freeze ω" toggle stops only the GLOBAL phase rotation (the frozen
// polarization W_ω — a unitary conjugation: preserves spectrum, no gain
// by itself) while per-fiber flow continues.
//
// HONESTY: the twistor geometry is the paper's auxiliary layer, rendered
// faithfully (true Hopf-fiber stereographic projection), and it proves
// nothing about zeta.  No Lambda bound, no RH claim.
//
// Perf: ~200 tubes total (3 latitude bands x 26 fibers x 2 sides, plus
// zero-fibers and strands), TubeGeometry 56x5, additive-blend shader
// with a flowing phase term (the visible twist).  Raycast picking uses
// fat low-segment proxy tubes with material.visible = false — zero draw
// calls, still raycastable.  No heavy imports — Z(t) and zeta(s) are
// computed live via a local Euler–Maclaurin evaluator (~150 terms/call,
// evaluated only on parameter rebuilds and readouts, never per frame).

import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import SafeCanvas from './SafeCanvas.jsx';
import { InlineMath } from './KaTeXMath.jsx';
import {
  riemannSiegelTheta,
  cMul, cAdd, cSub, cDiv, cLog, cAbs, ZETA_ZEROS,
} from '../math/zeta.js';
import { ED, TINT } from '../styles/tokens.js';

const TWO_PI = Math.PI * 2;
const mono = 'var(--ed-mono, "IBM Plex Mono", monospace)';

// ── palette ────────────────────────────────────────────────────────────────
const AMBER = new THREE.Color('#ffb454'); // Z(t) > 0  (warm family)
const BLUE = new THREE.Color('#5b8cff');  // Z(t) < 0  (cool family)
const WHITE = new THREE.Color('#ffffff');
const LEFT_AXIS = ED.brassDeco;   // brass — marks PT
const RIGHT_AXIS = ED.series5;  // violet — marks PT*

// ── zeta helpers (all light; no data bundles) ──────────────────────────────

// zeta(s) by Euler–Maclaurin: sum_{k<N} k^{-s} + N^{1-s}/(s-1) + N^{-s}/2
// + sum_j B_{2j}/(2j)! · s(s+1)…(s+2j-2) · N^{-s-2j+1}.  With N ~ 1.4|t|
// and 7 Bernoulli terms this is a true analytic continuation accurate to
// ~1e-10 throughout 0 < sigma < 1, |t| <= 150 — it replaces the Borwein
// eta series, whose error bound grows like e^{pi|t|/2} and fails past
// t ~ 60 at the 60-term overflow cap.
const B2K = [1 / 6, -1 / 30, 1 / 42, -1 / 30, 5 / 66, -691 / 2730, 7 / 6];
const FACT2K = [2, 24, 720, 40320, 3628800, 479001600, 87178291200];
function zetaEM(s) {
  const N = Math.max(24, Math.ceil(1.4 * Math.abs(s[1])) + 10);
  const out = [0, 0];
  for (let k = 1; k < N; k++) {
    const lk = Math.log(k);
    const m = Math.exp(-s[0] * lk);
    const ph = -s[1] * lk;
    out[0] += m * Math.cos(ph);
    out[1] += m * Math.sin(ph);
  }
  const lN = Math.log(N);
  const mN = Math.exp(-s[0] * lN);
  const NmS = [mN * Math.cos(-s[1] * lN), mN * Math.sin(-s[1] * lN)]; // N^{-s}
  let acc = cAdd(out, cDiv(cMul([N, 0], NmS), [s[0] - 1, s[1]]));     // + N^{1-s}/(s-1)
  acc = cAdd(acc, [NmS[0] / 2, NmS[1] / 2]);                          // + N^{-s}/2
  let poch = [s[0], s[1]];                 // s(s+1)…(s+2j-2), starts at s
  let Npow = cDiv(NmS, [N, 0]);            // N^{-s-(2j-1)}, starts at N^{-s-1}
  for (let j = 1; j <= 7; j++) {
    const c = B2K[j - 1] / FACT2K[j - 1];
    const term = cMul(poch, Npow);
    acc = cAdd(acc, [c * term[0], c * term[1]]);
    poch = cMul(poch, cMul([s[0] + 2 * j - 1, s[1]], [s[0] + 2 * j, s[1]]));
    Npow = cDiv(Npow, [N * N, 0]);
  }
  return acc;
}

// Z(t) by the exact identity Z(t) = Re[e^{iθ(t)} ζ(1/2+it)] with ζ from
// the Euler–Maclaurin continuation.  More accurate than the truncated
// Riemann–Siegel main sum throughout t <= 100 (checked: Im[e^{iθ}ζ] stays
// below ~1e-11, i.e. Z comes out real to full precision, while the RS
// main sum drifts by ~1e-3 near t ~ 90), and it stays valid below t = 2π
// where the RS formula degenerates.
function zHybrid(t) {
  const th = riemannSiegelTheta(Math.max(t, 0.2));
  const z = zetaEM([0.5, t]);
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
  lg = cAdd(lg, cLog(zetaEM(s)));
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
  uniform float uDir;     // +1 left helicity, -1 dual helicity
  uniform float uDash;    // dash count around the circle
  uniform float uPulse;   // 0 = smooth flow, 1 = packet mode (strands)
  uniform float uFrozen;  // 1 = frozen: bright rim, steadier body
  uniform float uSyncAmp; // 1 = linking-pair sync pulse active
  uniform float uSyncT;   // shared clock for the sync pulse
  varying vec2 vUv;
  void main() {
    float w = 0.5 + 0.5 * sin(6.2831853 * (vUv.x * uDash - uDir * uTime));
    float flow = mix(0.55 + 0.45 * w * w,          // gentle flowing dashes
                     0.12 + 1.55 * pow(w, 10.0),   // bright moving packets
                     uPulse);
    flow = mix(flow, 0.9, 0.55 * uFrozen);         // frozen: near-solid body
    vec3 base = mix(uColor, vec3(1.0, 0.96, 0.85), 0.35 * uFrozen);
    float amp = uBrightness * (1.0 + 1.1 * uFrozen);
    amp *= 1.0 + uSyncAmp * (0.4 + 0.4 * sin(4.2 * uSyncT));
    gl_FragColor = vec4(base * amp * flow, 1.0);
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
      uFrozen: { value: 0 },
      uSyncAmp: { value: 0 },
      uSyncT: { value: 0 },
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
const OMEGA_RATE = 0.07;           // rad/s — global phase (turntable) rotation

// map t in [tMin, tMax] to the angle around the congruence axis
function angleOfT(t, tMin, tMax) {
  return TWO_PI * ((t - tMin) / Math.max(tMax - tMin, 1e-9));
}

// stable identity of an s ↔ 1-s fiber pair: latitude band + height t.
// Deliberately σ-independent, so frozen fibers persist across σ changes.
function fiberKey(eta, t) {
  return `${eta.toFixed(3)}|${t.toFixed(4)}`;
}

// side-independent list of fiber identities in the current window — used
// by the freeze bookkeeping (freeze-all, pruning, the debug hook) without
// touching GPU data.
function fiberMetaList(tMin, tMax, showZeros) {
  const metas = [];
  for (const { eta, n } of BANDS) {
    for (let j = 0; j < n; j++) {
      const t = tMin + (j / n) * (tMax - tMin);
      metas.push({ key: fiberKey(eta, t), t, eta, xiAng: (TWO_PI * j) / n, isZero: false });
    }
  }
  if (showZeros) {
    for (const g of ZETA_ZEROS) {
      if (g <= tMin || g >= tMax) continue;
      metas.push({ key: fiberKey(MID_BAND, g), t: g, eta: MID_BAND, xiAng: angleOfT(g, tMin, tMax), isZero: true });
    }
  }
  return metas;
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
  const z = zetaEM([sigmaSide, tSigned]);
  const mag = Math.max(cAbs(z), 1e-9);
  const phase = Math.atan2(z[1], z[0]);
  const hue = ((phase / TWO_PI) + 1.08) % 1;
  const b = THREE.MathUtils.clamp((Math.log10(mag) + 1.6) / 2.1, 0.05, 1);
  return { color: new THREE.Color().setHSL(hue, 0.8, 0.6), b };
}

// ── scene data (geometry + materials), rebuilt on parameter change ─────────
function buildScene(tMin, tMax, sigma, showStrands, showZeros) {
  const onLine = Math.abs(sigma - 0.5) < 0.004;
  const fibers = [];   // { geom, proxyGeom, mat, offsetX, side, key, t, eta, xiAng, curve, isZero }
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
          proxyGeom: new THREE.TubeGeometry(curve, 28, 0.06, 4, true),
          mat, offsetX, side,
          key: fiberKey(eta, t), t, eta, xiAng, curve, isZero: false,
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
          proxyGeom: new THREE.TubeGeometry(curve, 28, 0.06, 4, true),
          mat, offsetX: side * STRUCT_X, side,
          key: fiberKey(MID_BAND, g), t: g, eta: MID_BAND, xiAng, curve, isZero: true,
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

  return {
    fibers, zeroFibers, zeroMarkers, strands, mats, zerosInWindow, onLine,
    allFibers: [...fibers, ...zeroFibers], // shared by the per-frame loop (no per-frame allocs)
  };
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

function CongruenceScene({
  tMin, tMax, sigma, twistSpeed, showStrands, showZeros, resetSignal,
  frozenKeys, paused, stepSignal, freezeOmega, onFiberClick, onFiberHover,
}) {
  const halo = useHaloTexture();
  const data = useMemo(
    () => buildScene(tMin, tMax, sigma, showStrands, showZeros),
    [tMin, tMax, sigma, showStrands, showZeros],
  );

  // shared invisible material for the raycast proxies: material.visible =
  // false skips the render list entirely (zero draw calls) but Mesh.raycast
  // never consults it, so the fat proxy tubes stay clickable.
  const proxyMat = useMemo(() => new THREE.MeshBasicMaterial({ visible: false }), []);
  // soft additive sheath drawn over frozen fibers (reuses the proxy tube)
  const sheathMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: TINT.brass, transparent: true, opacity: 0.05,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  }), []);
  useEffect(() => () => { proxyMat.dispose(); sheathMat.dispose(); }, [proxyMat, sheathMat]);

  // dispose GPU resources of the previous build
  const prevRef = useRef(null);
  useEffect(() => {
    const disposeBuild = (b) => {
      for (const f of [...b.fibers, ...b.zeroFibers]) {
        f.geom.dispose();
        f.proxyGeom.dispose();
      }
      for (const s of b.strands) s.geom.dispose();
      for (const m of b.mats) m.dispose();
    };
    const prev = prevRef.current;
    if (prev && prev !== data) disposeBuild(prev);
    prevRef.current = data;
    return () => {
      // final unmount cleanup
      if (prevRef.current === data) {
        disposeBuild(data);
        prevRef.current = null;
      }
    };
  }, [data]);

  // freeze state -> shader uniforms (per fiber, both sides of a pair)
  useEffect(() => {
    const syncOn = frozenKeys.size === 2 ? 1 : 0;
    for (const f of data.allFibers) {
      const fr = frozenKeys.has(f.key) ? 1 : 0;
      f.mat.uniforms.uFrozen.value = fr;
      f.mat.uniforms.uSyncAmp.value = fr * syncOn;
    }
  }, [data, frozenKeys]);

  // bridging ribbon between the two frozen fibers on each side — drawn only
  // when EXACTLY two pairs are frozen (Hopf linking highlight).
  const ribbon = useMemo(() => {
    if (frozenKeys.size !== 2) return null;
    const all = data.allFibers;
    const geoms = [];
    const rmats = [];
    for (const side of [-1, +1]) {
      const pair = all.filter((f) => f.side === side && frozenKeys.has(f.key));
      if (pair.length !== 2) continue;
      const sample = (f) => {
        const pts = [];
        const p = new THREE.Vector3();
        for (let i = 0; i < 40; i++) {
          f.curve.getPoint(i / 40, p);
          pts.push(new THREE.Vector3(p.x + f.offsetX, p.y, p.z));
        }
        return pts;
      };
      const A = sample(pair[0]);
      const B = sample(pair[1]);
      let best = Infinity;
      let a = A[0];
      let b = B[0];
      for (const pa of A) {
        for (const pb of B) {
          const d2 = pa.distanceToSquared(pb);
          if (d2 < best) { best = d2; a = pa; b = pb; }
        }
      }
      const mid = a.clone().add(b).multiplyScalar(0.5);
      mid.y += 0.22 + 0.3 * a.distanceTo(b);
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const mat = makeFiberMaterial(new THREE.Color('#fff3cf'), 0.55, +1, 6, 1);
      mat.uniforms.uSyncAmp.value = 1; // pulse in sync with the frozen pair
      geoms.push(new THREE.TubeGeometry(curve, 40, 0.009, 5, false));
      rmats.push(mat);
    }
    return { geoms, mats: rmats };
  }, [data, frozenKeys]);
  const ribbonRef = useRef(null);
  ribbonRef.current = ribbon;
  useEffect(() => () => {
    if (ribbon) {
      for (const g of ribbon.geoms) g.dispose();
      for (const m of ribbon.mats) m.dispose();
    }
  }, [ribbon]);

  // animation clock: pause/step gate everything, the ω turntable is gated
  // separately by freezeOmega, frozen fibers skip their own uTime advance.
  const omegaRef = useRef(null);
  const stepConsumedRef = useRef(stepSignal);
  const syncRef = useRef(0);
  useFrame((_, delta) => {
    let d = Math.min(delta, 0.1);
    if (paused) {
      if (stepSignal !== stepConsumedRef.current) {
        stepConsumedRef.current = stepSignal;
        d = 1 / 60;                       // step exactly one frame
      } else {
        d = 0;
      }
    } else {
      stepConsumedRef.current = stepSignal;
    }
    syncRef.current += d;
    if (omegaRef.current && !freezeOmega) omegaRef.current.rotation.y += d * OMEGA_RATE;
    for (const f of data.allFibers) {
      if (!frozenKeys.has(f.key)) f.mat.uniforms.uTime.value += d * twistSpeed;
      f.mat.uniforms.uSyncT.value = syncRef.current;
    }
    for (const s of data.strands) {
      s.mat.uniforms.uTime.value += d * twistSpeed;
      s.mat.uniforms.uSyncT.value = syncRef.current;
    }
    const rb = ribbonRef.current;
    if (rb) {
      for (const m of rb.mats) {
        m.uniforms.uTime.value += d * Math.max(twistSpeed, 0.35);
        m.uniforms.uSyncT.value = syncRef.current;
      }
    }
  });

  // picking: throttled hover + click-to-freeze on the invisible proxies
  const hoverTsRef = useRef(0);
  const metaOf = (f) => ({ key: f.key, t: f.t, eta: f.eta, xiAng: f.xiAng, isZero: f.isZero });
  const hoverMove = (f, e) => {
    const now = performance.now();
    if (now - hoverTsRef.current < 70) return; // throttle raycast->React churn
    hoverTsRef.current = now;
    onFiberHover({ ...metaOf(f), x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };
  const bindPick = (f) => ({
    onClick: (e) => {
      if (e.delta > 8) return; // orbit drag, not a click
      e.stopPropagation();
      onFiberClick(metaOf(f));
    },
    onPointerOver: (e) => {
      e.stopPropagation();
      document.body.style.cursor = 'pointer';
      hoverMove(f, e);
    },
    onPointerMove: (e) => hoverMove(f, e),
    onPointerOut: () => {
      document.body.style.cursor = '';
      onFiberHover(null);
    },
  });

  const renderFiber = (f, i, prefix) => (
    <group key={`${prefix}${i}`} position={[f.offsetX, 0, 0]}>
      <mesh geometry={f.geom} material={f.mat} />
      <mesh geometry={f.proxyGeom} material={proxyMat} {...bindPick(f)} />
      {frozenKeys.has(f.key) && (
        <mesh geometry={f.proxyGeom} material={sheathMat} />
      )}
    </group>
  );

  return (
    <>
      <CameraRig resetSignal={resetSignal} />
      {/* everything sits in the ω group: the global phase rotation W_ω is a
          rigid (unitary) motion of the whole picture — freeze ω stops it */}
      <group ref={omegaRef}>
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

        {/* Robinson congruence + dual (render tube + invisible pick proxy) */}
        {data.fibers.map((f, i) => renderFiber(f, i, 'f'))}
        {data.zeroFibers.map((f, i) => renderFiber(f, i, 'z'))}
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
        {ribbon && ribbon.geoms.map((g, i) => (
          <mesh key={`r${i}`} geometry={g} material={ribbon.mats[i]} />
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
            <div style={{ color: 'var(--paper-3)', fontFamily: mono, fontSize: 12, whiteSpace: 'nowrap', textAlign: 'center', textShadow: '0 0 8px rgba(0,0,0,0.9)' }}>
              Q = {'{'}([Z],[W]) : W·Z = 0{'}'}
              <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>
                I<sub>K</sub> F₊ = F₋ ∘ R &nbsp;(design requirement — O-status)
              </div>
            </div>
          </Html>
        )}
        {ribbon && ribbon.geoms.length > 0 && (
          <Html position={[0, -2.75, 0]} center style={{ pointerEvents: 'none' }}>
            <div style={{ color: 'var(--tint-brass)', fontFamily: mono, fontSize: 11, whiteSpace: 'nowrap', textShadow: '0 0 8px rgba(0,0,0,0.9)', opacity: 0.85 }}>
              any two distinct Hopf fibers link exactly once
            </div>
          </Html>
        )}
      </group>

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

function Toggle({ on, onClick, children, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
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

// frozen-fiber readout: the fiber's value at the CURRENT σ (frozen fibers
// persist across σ changes; the geometry is frozen, the arithmetic is live)
function frozenReadout(meta, sigma, onLine) {
  if (onLine) {
    const Z = zHybrid(meta.t);
    return {
      value: `Z(t) = ${Z >= 0 ? '+' : '−'}${Math.abs(Z).toPrecision(4)}`,
      phase: `sign ${Z >= 0 ? '+' : '−'}`,
    };
  }
  const z = zetaEM([sigma, meta.t]);
  const mag = cAbs(z);
  const arg = Math.atan2(z[1], z[0]);
  return {
    value: `ζ(s) = ${z[0].toPrecision(3)} ${z[1] >= 0 ? '+' : '−'} ${Math.abs(z[1]).toPrecision(3)}i`,
    phase: `|ζ| = ${mag.toPrecision(3)} · arg = ${arg.toFixed(3)}`,
  };
}

// ── main component ─────────────────────────────────────────────────────────

export default function TwistorDualIntertwinerViz() {
  const [tMin, setTMin] = useState(2);
  const [tMax, setTMax] = useState(52);
  const [sigma, setSigma] = useState(0.5);
  const [twistSpeed, setTwistSpeed] = useState(0.55);
  const [showStrands, setShowStrands] = useState(true);
  const [showZeros, setShowZeros] = useState(true);
  const [resetSignal, setResetSignal] = useState(0);
  const [frozen, setFrozen] = useState(() => new Map()); // key -> meta
  const [paused, setPaused] = useState(false);
  const [stepSignal, setStepSignal] = useState(0);
  const [freezeOmega, setFreezeOmega] = useState(false);
  const [hover, setHover] = useState(null);

  const onLine = Math.abs(sigma - 0.5) < 0.004;
  const zerosInWindow = useMemo(
    () => ZETA_ZEROS.filter((g) => g > tMin && g < tMax),
    [tMin, tMax],
  );
  const metas = useMemo(
    () => fiberMetaList(tMin, tMax, showZeros),
    [tMin, tMax, showZeros],
  );
  const frozenKeys = useMemo(() => new Set(frozen.keys()), [frozen]);

  const resetCamera = useCallback(() => setResetSignal((n) => n + 1), []);

  const toggleFreeze = useCallback((meta) => {
    setFrozen((prev) => {
      const next = new Map(prev);
      if (next.has(meta.key)) next.delete(meta.key);
      else next.set(meta.key, meta);
      return next;
    });
    setHover(null);
  }, []);

  const freezeAll = useCallback(
    () => setFrozen(new Map(metas.map((m) => [m.key, m]))),
    [metas],
  );
  const thawAll = useCallback(() => setFrozen(new Map()), []);

  // frozen fibers persist across σ (keys are σ-independent) but a t-window
  // change regrids the fibers — prune entries with no surviving fiber.
  useEffect(() => {
    setFrozen((prev) => {
      const valid = new Set(metas.map((m) => m.key));
      let changed = false;
      const next = new Map();
      for (const [k, v] of prev) {
        if (valid.has(k)) next.set(k, v);
        else changed = true;
      }
      return changed ? next : prev;
    });
  }, [metas]);

  // debug hooks — WebGL raycast clicks are unreliable under automation, so
  // expose freeze-by-t (nearest outer-band or zero fiber) for testing.
  useEffect(() => {
    window.__twistorFreeze = (t) => {
      let best = null;
      let bd = Infinity;
      for (const m of metas) {
        if (m.eta !== 1.02 && !m.isZero) continue;
        const d = Math.abs(m.t - t);
        if (d < bd) { bd = d; best = m; }
      }
      if (best) toggleFreeze(best);
      return best ? best.t : null;
    };
    window.__twistorThawAll = thawAll;
    window.__twistorFreezeOmega = (v) => setFreezeOmega(!!v);
    return () => {
      delete window.__twistorFreeze;
      delete window.__twistorThawAll;
      delete window.__twistorFreezeOmega;
    };
  }, [metas, toggleFreeze, thawAll]);

  const frozenList = useMemo(
    () => [...frozen.values()].sort((a, b) => a.t - b.t),
    [frozen],
  );
  const hoverReadout = hover ? frozenReadout(hover, sigma, onLine) : null;

  return (
    <div>
      {/* controls */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 12 }}>
        <Ctl label={`t-window  [${tMin.toFixed(0)}, ${tMax.toFixed(0)}]`}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="range" min="2" max="80" step="1" value={tMin}
              onChange={(e) => setTMin(Math.min(+e.target.value, tMax - 10))} style={{ width: 110 }} />
            <input type="range" min="20" max="100" step="1" value={tMax}
              onChange={(e) => setTMax(Math.max(+e.target.value, tMin + 10))} style={{ width: 110 }} />
          </div>
        </Ctl>
        <Ctl label={onLine ? 'σ = 0.500 (critical line)' : `σ = ${sigma.toFixed(2)} (off-line)`}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="range" min="0.1" max="0.9" step="0.01" value={sigma}
              onChange={(e) => setSigma(+e.target.value)} style={{ width: 150, accentColor: onLine ? 'var(--series-3)' : 'var(--status-candidate)' }} />
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
        <Ctl label="animation">
          <div style={{ display: 'flex', gap: 6 }}>
            <Toggle on={!paused} onClick={() => setPaused((v) => !v)}>
              {paused ? '▶ play' : '❚❚ pause'}
            </Toggle>
            <Toggle
              on={false}
              title="advance exactly one frame (pauses if playing)"
              onClick={() => {
                setPaused(true);
                setStepSignal((n) => n + 1);
              }}
            >
              step ▸
            </Toggle>
          </div>
        </Ctl>
        <Ctl label="ω — global phase rotation">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Toggle on={freezeOmega} onClick={() => setFreezeOmega((v) => !v)}>
              freeze ω
            </Toggle>
            <span style={{ fontSize: 10, lineHeight: 1.4, maxWidth: 190, color: 'var(--faint, #8a7f6d)' }}>
              frozen polarization W<sub>ω</sub> — preserves spectrum; no gain by itself
            </span>
          </div>
        </Ctl>
        <Toggle on={showStrands} onClick={() => setShowStrands((v) => !v)}>intertwiner</Toggle>
        <Toggle on={showZeros} onClick={() => setShowZeros((v) => !v)}>zeros</Toggle>
        <Toggle on={false} onClick={resetCamera}>reset camera</Toggle>
      </div>

      {/* canvas + overlays (tooltip, frozen-fiber readout) */}
      <div style={{ position: 'relative', width: '100%', height: 580, borderRadius: 12, overflow: 'hidden', background: 'var(--paper)', border: '1px solid var(--hairline, #d5c9b2)' }}>
        <SafeCanvas camera={{ position: [0, 6.4, 7.6], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true }}>
          <color attach="background" args={['#0b0e14']} />
          <fog attach="fog" args={['#0b0e14', 14, 30]} />
          <CongruenceScene
            tMin={tMin} tMax={tMax} sigma={sigma} twistSpeed={twistSpeed}
            showStrands={showStrands} showZeros={showZeros} resetSignal={resetSignal}
            frozenKeys={frozenKeys} paused={paused} stepSignal={stepSignal}
            freezeOmega={freezeOmega} onFiberClick={toggleFreeze} onFiberHover={setHover}
          />
        </SafeCanvas>

        {/* hover tooltip (throttled upstream) */}
        {hover && hoverReadout && (
          <div style={{
            position: 'absolute', left: Math.min(hover.x + 14, 1050), top: hover.y + 10,
            pointerEvents: 'none', background: 'color-mix(in srgb, var(--paper) 92%, transparent)', border: '1px solid color-mix(in srgb, var(--rule) 35%, transparent)',
            borderRadius: 6, padding: '6px 9px', fontFamily: mono, fontSize: 11, color: 'var(--paper-3)', whiteSpace: 'nowrap', zIndex: 5,
          }}>
            <div>t = {hover.t.toFixed(4)}{hover.isZero ? ' (zeta zero)' : ''}</div>
            <div>s = {sigma.toFixed(3)} + {hover.t.toFixed(3)}i</div>
            <div>{hoverReadout.value}</div>
            <div style={{ opacity: 0.7 }}>{hoverReadout.phase} · click to {frozenKeys.has(hover.key) ? 'thaw' : 'freeze'}</div>
          </div>
        )}

        {/* frozen-fiber readout panel */}
        <div style={{
          position: 'absolute', top: 10, right: 10, width: 292, maxHeight: 420, overflowY: 'auto',
          background: 'color-mix(in srgb, var(--paper-2) 94%, transparent)', border: '1px solid var(--hairline, #d5c9b2)',
          borderRadius: 8, padding: '8px 10px', zIndex: 4,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: frozenList.length ? 6 : 0 }}>
            <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--faint, #8a7f6d)', fontFamily: mono, flex: 1, whiteSpace: 'nowrap' }}>
              frozen pairs ({frozenList.length})
            </span>
            <button onClick={freezeAll} style={{ fontSize: 9, fontFamily: mono, padding: '2px 6px', borderRadius: 5, border: '1px solid var(--hairline, #d5c9b2)', background: 'var(--paper2, #f6f1e7)', color: 'var(--ink-soft, #4a4238)', cursor: 'pointer' }}>
              freeze all
            </button>
            <button onClick={thawAll} style={{ fontSize: 9, fontFamily: mono, padding: '2px 6px', borderRadius: 5, border: '1px solid var(--hairline, #d5c9b2)', background: 'var(--paper2, #f6f1e7)', color: 'var(--ink-soft, #4a4238)', cursor: 'pointer' }}>
              thaw all
            </button>
          </div>
          {frozenList.length === 0 && (
            <div style={{ fontSize: 11, color: 'var(--faint, #8a7f6d)', lineHeight: 1.5 }}>
              click a fiber to freeze it with its dual partner — the s ↔ 1−s pair freezes as a unit
            </div>
          )}
          {frozenList.length === 2 && (
            <div style={{ fontSize: 10, fontFamily: mono, color: 'var(--terra-dk, #b05a2a)', marginBottom: 6, lineHeight: 1.45 }}>
              linking highlight: any two distinct Hopf fibers link exactly once
            </div>
          )}
          {frozenList.map((m) => {
            const r = frozenReadout(m, sigma, onLine);
            return (
              <div key={m.key} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '5px 0', borderTop: '1px solid color-mix(in srgb, var(--rule) 22%, transparent)' }}>
                <div style={{ flex: 1, fontFamily: mono, fontSize: 10.5, lineHeight: 1.5, color: 'var(--ink-soft, #4a4238)' }}>
                  <div style={{ fontWeight: 700 }}>
                    t = {m.t.toFixed(4)}{m.isZero ? ' · zeta zero' : ''}
                  </div>
                  <div>s = {sigma.toFixed(3)} + {m.t.toFixed(3)}i</div>
                  <div>1−s = {(1 - sigma).toFixed(3)} − {m.t.toFixed(3)}i</div>
                  <div>{r.value} · {r.phase}</div>
                  <div style={{ opacity: 0.75 }}>base (η, φ) = ({m.eta.toFixed(2)}, {m.xiAng.toFixed(3)} rad)</div>
                </div>
                <button
                  onClick={() => toggleFreeze(m)}
                  title="thaw this pair"
                  style={{ fontSize: 11, fontFamily: mono, padding: '1px 6px', borderRadius: 5, border: '1px solid var(--hairline, #d5c9b2)', background: 'var(--paper2, #f6f1e7)', color: 'var(--ink-soft, #4a4238)', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* legend */}
      <div className="card" style={{ marginTop: 12, padding: '12px 16px', background: 'var(--paper2, #f6f1e7)', border: '1px solid var(--hairline, #d5c9b2)', borderRadius: 8 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', rowGap: 6 }}>
          {onLine ? (
            <>
              <Swatch color="#ffb454" label="Z(t) > 0" />
              <Swatch color={ED.series1} label="Z(t) < 0" />
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
            thin fiber = |Z| small (necking at zeros) · strand hue = arg ξ(s) = arg ξ(1−s) ·
            hover a fiber for values · click to freeze the s ↔ 1−s pair
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
          the exact zero angles (Odlyzko ordinates, exact throughout the full{' '}
          <InlineMath tex={'t \\le 100'} /> window). Because the pairing{' '}
          <InlineMath tex={'s \\leftrightarrow 1-s'} /> is
          complex conjugation on the line and <InlineMath tex={'\\xi(s)=\\xi(1-s)'} />, the mirrored
          fibers carry <strong>identical colors</strong> — the functional equation is literally
          visible as the left–right color symmetry through the intertwiner.
        </p>
        <p style={{ margin: '0 0 8px 0' }}>
          <strong style={{ color: 'var(--ink, #1c1814)' }}>Off the line.</strong>{' '}
          Moving <InlineMath tex={'\\sigma'} /> colors the left side by the phase (hue) and{' '}
          <InlineMath tex={'\\log'} />-magnitude (brightness) of <InlineMath tex={'\\zeta(s)'} /> and
          the right side by <InlineMath tex={'\\zeta(1-s)'} />, computed by Euler–Maclaurin
          continuation — a true analytic continuation, accurate throughout this window
          (<InlineMath tex={'t \\le 100'} />); no proxy is used. The left–right color symmetry breaks,
          <em> except</em> through the intertwiner pairing{' '}
          <InlineMath tex={'\\sigma \\leftrightarrow 1-\\sigma'} />: each strand is colored by{' '}
          <InlineMath tex={'\\arg \\xi(s)'} />, which equals <InlineMath tex={'\\arg \\xi(1-s)'} />{' '}
          exactly, so the strand's hue is well-defined from either endpoint — that shared hue is the
          reflection <InlineMath tex={'R'} /> made visible.
        </p>
        <p style={{ margin: '0 0 8px 0' }}>
          <strong style={{ color: 'var(--ink, #1c1814)' }}>Fiber freezing.</strong>{' '}
          Click any fiber to freeze it: its phase flow stops and its partner on the dual side
          freezes with it — the <InlineMath tex={'s \\leftrightarrow 1-s'} /> pair freezes as a
          unit. Frozen fibers persist as <InlineMath tex={'\\sigma'} /> moves (the pair is indexed
          by <InlineMath tex={'t'} />; the readout re-evaluates at the current{' '}
          <InlineMath tex={'s'} />). When exactly two pairs are frozen, the linking is highlighted —
          any two distinct Hopf fibers link exactly once. Fiber freezing here is the visual
          analogue of the paper's freeze–thaw calculus (§7.3): freezing the projective fiber
          coordinate <InlineMath tex={'\\omega'} /> gives the frozen pencil{' '}
          <InlineMath tex={'L_\\omega = W_\\omega^* L W_\\omega'} />; freezing is exact; the cost
          appears only at thaw (the Duhamel commutator). The <strong>freeze ω</strong> toggle stops
          only the global phase rotation — the frozen polarization{' '}
          <InlineMath tex={'W_\\omega'} /> is a unitary conjugation, so it preserves the spectrum
          and yields no gain by itself — while per-fiber flow continues.
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
            zeta/xi values painted onto the fibers are computed facts. Fiber freezing is a
            visualization device mirroring the paper's §7.3 calculus, not a computation on any
            operator. No Λ bound, no RH claim.
          </div>
        </div>
      </div>
    </div>
  );
}
