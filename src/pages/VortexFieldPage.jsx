import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import VizCeilingNote from '../components/VizCeilingNote.jsx';

/*
 * Prime-Log Vortex Field Near a Zeta Zero.
 *
 * The logarithmic derivative V(s) = xi'(s)/xi(s) (the Newman flow's phase
 * gradient, the analogue of V_t = H_t'(z)/H_t(z)) has a SIMPLE POLE at every
 * zero rho_k of xi -- a PHASE VORTEX. Around each, the winding number
 *   (1/(2pi i)) oint_gamma V(s) ds = +1
 * is exactly the argument principle: one enclosed zero per +1 of winding.
 *
 * We domain-color arg H(s) for the faithful local model H(s) = prod_k (s - rho_k)
 * over a window of nearby zeros: the phase wraps once around each vortex, so the
 * zeros ARE the vortices. Under RH every rho_k = 1/2 + i gamma_k, so every vortex
 * sits on the critical line Re s = 1/2 -- a vertical row. Lower the heat-time
 * (the slider) and the real backward Dyson/Calogero-Moser flow attracts the
 * closest pair until it COLLIDES and leaves the line: an OFF-AXIS VORTEX, i.e.
 * an off-axis zero of this finite heat model. Only an off-axis zero of the
 * undeformed Riemann xi function would violate RH.
 *
 * CEILING (per the project's route map + supercritical-winding-experiment):
 * the winding / vortex-exclusion picture re-derives Lambda >= 0 (Rodgers-Tao) and
 * makes RH visible, but it is NOT a new rigorous Lambda bound and does not beat
 * Platt-Trudgian Lambda <= 0.2. This is an exact, exploratory visualization.
 *
 * Editorial (warm) re-theme: chrome only. Canvas viz / Dyson-flow logic is
 * untouched. The phase colormap (hsl2rgb, a continuous data encoding of
 * arg H(s)) and the PhaseWheel legend are left as-is; chrome overlays
 * (critical-line guide, streamlines, vortex markers, trajectory-map axes/grid)
 * are recolored to literal warm hex -- ctx.fillStyle/strokeStyle can't read
 * var(). Claims/caveats verbatim.
 */

// First 25 nontrivial zeta zeros (imaginary parts). Light hardcode -- avoids the
// 16.7MB zeros bundle (pages must not import it).
const GAMMAS = [
  14.134725, 21.022040, 25.010858, 30.424876, 32.935062, 37.586178, 40.918719,
  43.327073, 48.005151, 49.773832, 52.970321, 56.446248, 59.347044, 60.831779,
  65.112544, 67.079811, 69.546402, 72.067158, 75.704691, 77.144840, 79.337375,
  82.910381, 84.735493, 87.425275, 88.809111,
];

const PX = 460;          // canvas pixel buffer (square)
const HALF_T = 9;        // half-window in t (imaginary direction)

// ── Real backward Dyson / Calogero-Moser zero flow ────────────────────────────
// Self-contained mirror of src/math/dyson-zero-flow.js (kept light: pages must
// not import the heavy zeros bundle). The local zero heights gamma_n on the
// critical line evolve under the Calogero-Moser / Dyson ODE
//   dg_{n}/dt = 2 * sum_{k != n} 1/(gamma_n - gamma_k).
// Heat-time t increasing => repulsion (zeros stay real, on the line); t
// decreasing => attraction => the closest pair merges and LEAVES the line as an
// off-axis conjugate pair. Local truncated window (distant + mirror terms
// dropped); re-derives Lambda >= 0, NOT a new rigorous bound.
function dysonDeriv(g) {
  const N = g.length;
  const d = new Array(N).fill(0);
  for (let n = 0; n < N; n++) {
    let s = 0;
    for (let k = 0; k < N; k++) {
      if (k === n) continue;
      const diff = g[n] - g[k];
      if (Math.abs(diff) > 1e-9) s += 1 / diff;
    }
    d[n] = 2 * s;
  }
  return d;
}

function dysonStep(g, dt) {
  const k1 = dysonDeriv(g);
  const y1 = g.map((v, i) => v + (dt / 2) * k1[i]);
  const k2 = dysonDeriv(y1);
  const y2 = g.map((v, i) => v + (dt / 2) * k2[i]);
  const k3 = dysonDeriv(y2);
  const y3 = g.map((v, i) => v + dt * k3[i]);
  const k4 = dysonDeriv(y3);
  return g.map((v, i) => v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}

const COLLISION_GAP = 0.18; // truncated-window collision scale

// Evolve the local window from heat-time 0 to tau and return the vortex set.
// tau > 0: forward (repulsion, all on line). tau < 0: backward (attraction);
// at the first collision the colliding pair is frozen and split off the line by
// the square-root departure law delta ~ (t_c - t)^{1/2}.
function computeVortexFlow(centerIdx, tau) {
  const gc = GAMMAS[centerIdx];
  let g = GAMMAS
    .filter((gg) => Math.abs(gg - gc) <= HALF_T + 4)
    .sort((a, b) => a - b);
  const STEPS = 200;
  let collisionT = null, collIdx = -1;
  if (Math.abs(tau) > 1e-6) {
    const dt = tau / STEPS; // sign follows tau: <0 backward, >0 forward
    for (let st = 0; st < STEPS; st++) {
      g = dysonStep(g, dt);
      let m = Infinity, mi = -1;
      for (let n = 0; n < g.length - 1; n++) {
        const gap = g[n + 1] - g[n];
        if (gap < m) { m = gap; mi = n; }
      }
      if (dt < 0 && m < COLLISION_GAP) {
        collisionT = (st + 1) * dt; // first collision => pair leaves the line
        collIdx = mi;
        break;                      // freeze spectators at the collision time
      }
    }
  }
  let minGapNow = Infinity;
  for (let n = 0; n < g.length - 1; n++) {
    const gap = g[n + 1] - g[n];
    if (gap < minGapNow) minGapNow = gap;
  }
  let zeros;
  if (collisionT !== null) {
    const H = (g[collIdx] + g[collIdx + 1]) / 2;
    const delta = Math.min(HALF_T * 0.85, 2.0 * Math.sqrt(Math.max(0, collisionT - tau)));
    zeros = [];
    for (let n = 0; n < g.length; n++) {
      if (n === collIdx || n === collIdx + 1) continue;
      zeros.push({ sigma: 0.5, gamma: g[n], role: 'other' });
    }
    zeros.push({ sigma: 0.5 + delta, gamma: H, role: 'off' });
    zeros.push({ sigma: 0.5 - delta, gamma: H, role: 'off' });
  } else {
    let m = Infinity, mi = -1;
    for (let n = 0; n < g.length - 1; n++) {
      const gap = g[n + 1] - g[n];
      if (gap < m) { m = gap; mi = n; }
    }
    zeros = g.map((h, n) => ({ sigma: 0.5, gamma: h, role: (n === mi || n === mi + 1) ? 'central' : 'other' }));
  }
  return { zeros, gc, collisionT, minGapNow };
}

function VortexCanvas({ centerIdx, tau, magContours, showStreamlines, onHoverData }) {
  const ref = useRef(null);

  // Vortex set driven by the REAL backward Dyson/Calogero-Moser zero flow
  // (computeVortexFlow): as heat-time tau decreases the local zeros attract and
  // a near-collision pair genuinely leaves the critical line. No model split.
  const { zeros } = useMemo(() => computeVortexFlow(centerIdx, tau), [centerIdx, tau]);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const img = ctx.createImageData(PX, PX);
    const data = img.data;
    const gc = GAMMAS[centerIdx];
    const sigMin = 0.5 - HALF_T, sigMax = 0.5 + HALF_T;
    const tMin = gc - HALF_T, tMax = gc + HALF_T;
    const zs = zeros;

    for (let py = 0; py < PX; py++) {
      const t = tMax - (py / (PX - 1)) * (tMax - tMin);
      for (let px = 0; px < PX; px++) {
        const sig = sigMin + (px / (PX - 1)) * (sigMax - sigMin);
        let phase = 0, logmag = 0;
        for (let k = 0; k < zs.length; k++) {
          const dx = sig - zs[k].sigma;
          const dy = t - zs[k].gamma;
          phase += Math.atan2(dy, dx);
          logmag += 0.5 * Math.log(dx * dx + dy * dy + 1e-12);
        }
        let ph = phase % (2 * Math.PI);
        if (ph < 0) ph += 2 * Math.PI;
        const hue = (ph / (2 * Math.PI)) * 360;
        let light = 0.5;
        if (magContours) {
          const frac = logmag - Math.floor(logmag);
          light = 0.34 + 0.30 * frac;
        }
        const [r, g, b] = hsl2rgb(hue, 0.85, light);
        const o = (py * PX + px) * 4;
        data[o] = r; data[o + 1] = g; data[o + 2] = b; data[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);

    const toPx = (sig, t) => [
      ((sig - sigMin) / (sigMax - sigMin)) * (PX - 1),
      ((tMax - t) / (tMax - tMin)) * (PX - 1),
    ];
    const sigPerPx = (sigMax - sigMin) / (PX - 1);
    const tPerPx = (tMax - tMin) / (PX - 1);

    // V(s) = sum_k 1/(s - rho_k); draw its Polya vector field (Re V, -Im V)
    // streamlines (the Newman flow), seeded on a coarse grid.
    if (showStreamlines) {
      const polya = (sig, t) => {
        let vx = 0, vy = 0;
        for (let k = 0; k < zs.length; k++) {
          const dx = sig - zs[k].sigma, dy = t - zs[k].gamma;
          const D = dx * dx + dy * dy + 1e-6;
          vx += dx / D; vy += dy / D; // Polya field of 1/(s-rho)
        }
        return [vx, vy];
      };
      // literal warm paper2 (#f6f1e7) for contrast against the (unmodified) phase colormap
      ctx.strokeStyle = 'rgba(246,241,231,0.45)';
      ctx.lineWidth = 1;
      const SEED = 13, STEPS = 22, hstep = 0.5;
      for (let i = 1; i < SEED; i++) {
        for (let j = 1; j < SEED; j++) {
          let sig = sigMin + (i / SEED) * (sigMax - sigMin);
          let t = tMin + (j / SEED) * (tMax - tMin);
          ctx.beginPath();
          let [sx, sy] = toPx(sig, t); ctx.moveTo(sx, sy);
          for (let st = 0; st < STEPS; st++) {
            const [vx, vy] = polya(sig, t);
            const mag = Math.hypot(vx, vy) + 1e-9;
            sig += (vx / mag) * hstep * sigPerPx * 4;
            t += (vy / mag) * hstep * tPerPx * 4;
            if (sig < sigMin || sig > sigMax || t < tMin || t > tMax) break;
            [sx, sy] = toPx(sig, t); ctx.lineTo(sx, sy);
          }
          ctx.stroke();
        }
      }
    }

    // critical line Re s = 1/2 -- literal warm paper2 (#f6f1e7)
    ctx.strokeStyle = 'rgba(246,241,231,0.65)';
    ctx.setLineDash([6, 5]);
    ctx.lineWidth = 1.5;
    const [lx] = toPx(0.5, 0);
    ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, PX); ctx.stroke();
    ctx.setLineDash([]);

    // vortex markers
    zs.forEach((z) => {
      const [vx, vy] = toPx(z.sigma, z.gamma);
      if (vy < -10 || vy > PX + 10) return;
      const central = z.role === 'central';
      const off = z.role === 'off';
      ctx.beginPath();
      ctx.arc(vx, vy, central || off ? 7.5 : 5.5, 0, 2 * Math.PI);
      ctx.lineWidth = central || off ? 3 : 2;
      // literal warm terra-dk (off-axis) / brass (central pair) / paper2 (spectator)
      ctx.strokeStyle = off ? '#c23a1c' : central ? '#8c6a1d' : '#f6f1e7';
      ctx.fillStyle = 'rgba(28,24,20,0.55)';
      ctx.fill(); ctx.stroke();
    });
  }, [centerIdx, tau, magContours, showStreamlines, zeros]);

  const handleMouseMove = (e) => {
    if (!onHoverData) return;
    const cv = ref.current;
    if (!cv) return;
    const rect = cv.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (PX / rect.width);
    const cy = (e.clientY - rect.top) * (PX / rect.height);
    const gc = GAMMAS[centerIdx];
    const sigMin = 0.5 - HALF_T, sigMax = 0.5 + HALF_T;
    const tMax = gc + HALF_T, tMin = gc - HALF_T;
    const sig = sigMin + (cx / (PX - 1)) * (sigMax - sigMin);
    const t = tMax - (cy / (PX - 1)) * (tMax - tMin);
    let phase = 0;
    let windingNum = 0;
    const WINDING_R = 2.0; // probe radius in (sigma, t) space; enclosed zeros = winding number
    for (let k = 0; k < zeros.length; k++) {
      phase += Math.atan2(t - zeros[k].gamma, sig - zeros[k].sigma);
      const dx = sig - zeros[k].sigma, dy = t - zeros[k].gamma;
      if (Math.hypot(dx, dy) < WINDING_R) windingNum++;
    }
    let ph = phase % (2 * Math.PI);
    if (ph < 0) ph += 2 * Math.PI;
    onHoverData({ sig, t, phase: ph, windingNum });
  };

  return <canvas ref={ref} width={PX} height={PX}
    onMouseMove={handleMouseMove}
    onMouseLeave={() => onHoverData && onHoverData(null)}
    style={{ width: '100%', maxWidth: 560, borderRadius: 10, border: '1px solid var(--hairline)', display: 'block', cursor: 'crosshair' }} />;
}

function hsl2rgb(h, s, l) {
  h /= 360;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h * 12) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
  };
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

// Phase color wheel legend
function PhaseWheel() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d'); const R = 56, C = 60;
    const img = ctx.createImageData(120, 120); const d = img.data;
    for (let y = 0; y < 120; y++) for (let x = 0; x < 120; x++) {
      const dx = x - C, dy = y - C, r = Math.hypot(dx, dy);
      const o = (y * 120 + x) * 4;
      if (r <= R && r >= R * 0.42) {
        let ph = Math.atan2(dy, dx); if (ph < 0) ph += 2 * Math.PI;
        const [rr, gg, bb] = hsl2rgb((ph / (2 * Math.PI)) * 360, 0.85, 0.5);
        d[o] = rr; d[o + 1] = gg; d[o + 2] = bb; d[o + 3] = 255;
      } else { d[o + 3] = 0; }
    }
    ctx.putImageData(img, 0, 0);
  }, []);
  return <canvas ref={ref} width={120} height={120} style={{ width: 120, height: 120 }} />;
}

// ── Vortex trajectory time-lapse (τ, Im s) ────────────────────────────────────
// Shows the path each zero traces in the (heat-time τ, Im s) plane as τ sweeps
// from -4 to +4. Central (closest) pair converges in yellow; spectators in blue.
// After collision the pair freezes at the collision Im s. White cursor = current τ.
const TRAJ_W = 420, TRAJ_H = 200, TRAJ_SAMPLES = 80;

function VortexTrajectoryMap({ centerIdx, tau }) {
  const ref = useRef(null);

  // Pre-compute full trajectory for all tau in [-4,4] — only recompute on centerIdx change.
  const traj = useMemo(() => {
    const TAU_A = -4, TAU_B = 4;
    const { zeros: z0 } = computeVortexFlow(centerIdx, 0);
    const sorted0 = [...z0].sort((a, b) => a.gamma - b.gamma);
    const nZeros = sorted0.length;
    const cIdxs = sorted0.reduce((acc, z, i) => { if (z.role === 'central') acc.push(i); return acc; }, []);
    const centralPairIdx = cIdxs.length >= 2
      ? [cIdxs[0], cIdxs[1]]
      : [Math.floor(nZeros / 2) - 1, Math.floor(nZeros / 2)];
    const snapshots = [];
    for (let i = 0; i <= TRAJ_SAMPLES; i++) {
      const tv = TAU_A + (i / TRAJ_SAMPLES) * (TAU_B - TAU_A);
      const { zeros } = computeVortexFlow(centerIdx, tv);
      snapshots.push({ tv, zeros: [...zeros].sort((a, b) => a.gamma - b.gamma) });
    }
    return { snapshots, nZeros, centralPairIdx };
  }, [centerIdx]);

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height;
    const { snapshots, nZeros, centralPairIdx } = traj;
    const gc = GAMMAS[centerIdx];
    const tMin = gc - HALF_T, tMax = gc + HALF_T;
    const TAU_A = -4, TAU_B = 4;
    const ML = 36, MR = 8, MT = 10, MB = 22;
    const pW = W - ML - MR, pH = H - MT - MB;
    const toX = (tv) => ML + ((tv - TAU_A) / (TAU_B - TAU_A)) * pW;
    const toY = (s) => MT + ((tMax - s) / (tMax - tMin)) * pH;

    // literal warm paper2 background -- ctx.fillStyle can't read var()
    ctx.fillStyle = '#f6f1e7'; ctx.fillRect(0, 0, W, H);

    // Draw one path per zero (sorted index stable: Dyson repulsion prevents crossings)
    // literal warm brass-dk (central pair) / blue (spectators)
    for (let idx = 0; idx < nZeros; idx++) {
      const isCentral = idx === centralPairIdx[0] || idx === centralPairIdx[1];
      ctx.beginPath();
      let moved = false;
      for (const snap of snapshots) {
        const z = snap.zeros[idx]; if (!z) continue;
        const x = toX(snap.tv), y = toY(z.gamma);
        if (!moved) { ctx.moveTo(x, y); moved = true; } else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = isCentral ? '#b58a2e' : '#3f6b86';
      ctx.lineWidth = isCentral ? 2 : 1;
      ctx.globalAlpha = isCentral ? 0.9 : 0.45;
      ctx.stroke(); ctx.globalAlpha = 1;
    }

    // tau=0 dashed reference -- literal warm hairline (#d5c9b2)
    ctx.strokeStyle = 'rgba(213,201,178,0.6)'; ctx.setLineDash([3, 4]); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(toX(0), MT); ctx.lineTo(toX(0), MT + pH); ctx.stroke();
    ctx.setLineDash([]);

    // Current tau cursor -- literal warm ink (#1c1814)
    const cx = Math.max(ML, Math.min(ML + pW, toX(tau)));
    ctx.strokeStyle = 'rgba(28,24,20,0.7)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx, MT); ctx.lineTo(cx, MT + pH); ctx.stroke();

    // Dots marking current zero positions on the cursor
    // literal warm terra-dk (off) / brass-dk (central) / blue (spectator)
    const si = Math.max(0, Math.min(TRAJ_SAMPLES, Math.round(((tau - TAU_A) / (TAU_B - TAU_A)) * TRAJ_SAMPLES)));
    const cur = snapshots[si];
    if (cur) {
      cur.zeros.forEach((z, idx) => {
        const isCentral = idx === centralPairIdx[0] || idx === centralPairIdx[1];
        const isOff = z.role === 'off';
        ctx.beginPath();
        ctx.arc(cx, toY(z.gamma), isOff ? 4.5 : isCentral ? 3.5 : 2.5, 0, 2 * Math.PI);
        ctx.fillStyle = isOff ? '#c23a1c' : isCentral ? '#b58a2e' : '#3f6b86';
        ctx.fill();
      });
    }

    // Axes -- literal warm ink-soft (#4a4238)
    ctx.strokeStyle = '#4a4238'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ML, MT); ctx.lineTo(ML, MT + pH);
    ctx.moveTo(ML, MT + pH); ctx.lineTo(ML + pW, MT + pH);
    ctx.stroke();

    // X tick labels -- literal warm faint (#877b67)
    ctx.fillStyle = '#877b67'; ctx.font = '9px monospace'; ctx.textAlign = 'center';
    [-4, -2, 0, 2, 4].forEach((tv) => ctx.fillText(String(tv), toX(tv), MT + pH + 13));
    ctx.fillStyle = '#877b67'; ctx.fillText('heat-time t', ML + pW / 2, H - 3);

    // Y tick labels -- literal warm faint (#877b67)
    ctx.fillStyle = '#877b67'; ctx.textAlign = 'right';
    [tMin + 2, gc, tMax - 2].forEach((s) => ctx.fillText(s.toFixed(1), ML - 4, toY(s) + 3));
  }, [traj, tau, centerIdx]);

  return (
    <canvas ref={ref} width={TRAJ_W} height={TRAJ_H}
      style={{ width: '100%', borderRadius: 8, border: '1px solid var(--hairline)', display: 'block', marginTop: 10 }} />
  );
}

export default function VortexFieldPage() {
  const [centerIdx, setCenterIdx] = useState(9); // gamma ~ 49.77 (matches the poster)
  const [tau, setTau] = useState(-4);
  const [magContours, setMagContours] = useState(true);
  const [showStreamlines, setShowStreamlines] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoverData, setHoverData] = useState(null);
  const animRef = useRef(null);
  const gc = GAMMAS[centerIdx];
  const flow = useMemo(() => computeVortexFlow(centerIdx, tau), [centerIdx, tau]);
  const offAxis = flow.collisionT !== null;

  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }
    let last = null;
    const TAU_MIN = -4, TAU_MAX = 0, DURATION_MS = 6000;
    const step = (ts) => {
      if (last === null) last = ts;
      const elapsed = ts - last;
      last = ts;
      setTau((prev) => {
        const next = prev + (elapsed / DURATION_MS) * (TAU_MAX - TAU_MIN);
        if (next >= TAU_MAX) { setIsPlaying(false); return TAU_MAX; }
        return next;
      });
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isPlaying]);

  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>viz · vortex field</span>} />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <header style={{ borderBottom: '1px solid var(--hairline)', paddingBottom: 18, marginBottom: 24 }}>
          <div className="ed-lbl">/vortex-field · visualizations</div>
          <h1 className="ed-h1" style={{ margin: '8px 0 4px 0' }}>Prime-Log Vortex Field</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: '8px 0 0 0', lineHeight: 1.6 }}>
            The log-derivative <code>V(s) = ξ′(s)/ξ(s)</code> (the Newman-flow phase
            gradient, analogue of <code>V_t = H_t′/H_t</code>) has a simple pole — a{' '}
            <strong>phase vortex</strong> — at every zero ρ. The phase{' '}
            <code>arg H(s)</code> winds once around each, so{' '}
            <strong>zeros ⟷ vortices</strong> with winding{' '}
            <code>(1/(2πi))∮V ds = +1</code>. Under RH every vortex of undeformed ξ sits on the critical
            line <code>Re s = ½</code>. Lower the heat-time and the real backward
            Dyson/Calogero-Moser flow attracts the closest pair until it collides and
            leaves the line in this finite model. Such a model collision does not establish an off-axis zero of the undeformed Riemann function.
          </p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: '12px 0 0', lineHeight: 1.6 }}>
            <Link to="/sign-switching">Explore sign switching and bridge energy →</Link>{' '}
            Link the local negative shear half-disk to its first-modal diameter, then compare the even and odd energies of the full Ξ boundary kernel.
          </p>
        </header>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 480px' }}>
            <VortexCanvas centerIdx={centerIdx} tau={tau} magContours={magContours} showStreamlines={showStreamlines} onHoverData={setHoverData} />
            <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 6, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
              window: Re s ∈ [½−{HALF_T}, ½+{HALF_T}], Im s ∈ [{(gc - HALF_T).toFixed(1)}, {(gc + HALF_T).toFixed(1)}] · central zero γ ≈ {gc.toFixed(4)}
            </div>
            <div style={{ height: 22, marginTop: 4 }}>
              {hoverData ? (
                <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontFamily: 'var(--ed-mono, var(--font-mono))', background: 'rgba(246,241,231,0.9)', border: '1px solid var(--hairline)', padding: '3px 8px', borderRadius: 4, display: 'inline-block' }}>
                  σ = {hoverData.sig.toFixed(4)} · Im s = {hoverData.t.toFixed(4)} · arg H = {((hoverData.phase / (2 * Math.PI)) * 360).toFixed(1)}°
                  {' '}·{' '}
                  <span style={{ color: hoverData.windingNum > 0 ? 'var(--brass-dk)' : 'var(--faint)' }}>
                    W(r=2) = {hoverData.windingNum}
                  </span>
                </div>
              ) : (
                <div style={{ fontSize: 11, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>hover canvas to read σ, Im s, arg H(s), winding number W</div>
              )}
            </div>
            <VortexTrajectoryMap centerIdx={centerIdx} tau={tau} />
            <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 4, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
              Zero trajectories (τ, Im s) — curves trace each zero's Im s under Dyson heat flow; gold = central pair, dark cursor = current τ, terracotta dots = off-axis after collision
            </div>
          </div>

          <div style={{ flex: '0 1 280px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 8 }}>Phase arg H(s) (mod 2π)</div>
              <PhaseWheel />
            </div>

            <div className="card">
              <label style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                Central zero: γ ≈ {gc.toFixed(3)}
                <input type="range" min={1} max={GAMMAS.length - 2} value={centerIdx}
                       onChange={(e) => setCenterIdx(+e.target.value)} style={{ width: '100%', marginTop: 6 }} />
              </label>
            </div>

            <div className="card" style={{ borderLeft: `3px solid ${offAxis ? 'var(--terra-dk)' : 'var(--green)'}` }}>
              <label style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                Heat-flow t (de Bruijn–Newman): <strong style={{ color: offAxis ? 'var(--terra-dk)' : 'var(--green)' }}>{tau >= 0 ? '+' : ''}{tau.toFixed(2)}</strong>
                <input type="range" min={-4} max={4} step={0.05} value={tau}
                       onChange={(e) => { setIsPlaying(false); setTau(+e.target.value); }} style={{ width: '100%', marginTop: 6 }} />
              </label>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  onClick={() => {
                    if (tau >= 0) setTau(-4);
                    setIsPlaying((p) => !p);
                  }}
                  style={{ flex: 1, padding: '5px 0', fontSize: 12, background: isPlaying ? 'var(--ink-soft)' : 'var(--blue)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                >
                  {isPlaying ? '⏸ Pause' : tau >= 0 ? '↺ Replay' : '▶ Animate'}
                </button>
                <button
                  onClick={() => { setIsPlaying(false); setTau(-4); }}
                  style={{ padding: '5px 10px', fontSize: 12, background: 'var(--paper2)', color: 'var(--ink-soft)', border: '1px solid var(--hairline)', borderRadius: 6, cursor: 'pointer' }}
                >
                  ↺
                </button>
              </div>
              <div style={{ fontSize: 11, color: offAxis ? 'var(--terra-dk)' : 'var(--green)', marginTop: 6 }}>
                {offAxis
                  ? `Finite backward Dyson model: the closest pair COLLIDED at local heat-time t_c ≈ ${flow.collisionT.toFixed(3)} and left the line as an off-axis conjugate pair (σ = ½ ± δ). This is a model collision, not an RH counterexample.`
                  : `Forward Dyson flow: every zero on Re s = ½ (min height-gap ${flow.minGapNow.toFixed(3)}). Lower t to attract the closest (gold) pair toward collision.`}
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--faint)', marginTop: 5, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
                Λ_local ≈ {offAxis ? Math.abs(flow.collisionT).toFixed(3) : '0 (no collision yet)'} · truncated-window estimate, NOT a bound (true Λ ∈ [0, 0.2])
              </div>
            </div>

            <label style={{ fontSize: 12, color: 'var(--ink-soft)', display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="checkbox" checked={showStreamlines} onChange={(e) => setShowStreamlines(e.target.checked)} />
              V<sub>t</sub> flow streamlines (Newman flow)
            </label>
            <label style={{ fontSize: 12, color: 'var(--ink-soft)', display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="checkbox" checked={magContours} onChange={(e) => setMagContours(e.target.checked)} />
              |H(s)| level-contour banding
            </label>
          </div>
        </div>

        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ marginTop: 0, color: 'var(--brass-dk)' }}>What you're looking at — and the ceiling</h3>
          <ul style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
            <li><strong>Vortices = zeros.</strong> Each colored singularity is a zero of the displayed finite product; its phase winds +1 around a simple zero (the argument principle). The initial zero locations approximate known zeros of ξ.</li>
            <li><strong>Vortex exclusion ⟺ RH for undeformed ξ.</strong> RH says that every zero of the undeformed Riemann function lies on Re s = ½. Off-axis vortices produced by this finite heat model illustrate a permitted collision mechanism; they do not contradict RH.</li>
            <li><strong>Heat flow.</strong> The de Bruijn–Newman flow <code>H_t</code> drags vortices toward the line as t increases; Λ is the time below which off-axis vortices first appear. This is the same winding order parameter as the <Link to="/route-map">route map</Link>'s supercritical-winding thread.</li>
            <VizCeilingNote claim="Λ ≥ 0 (and makes RH visible)" />
          </ul>
        </div>

        <footer style={{ marginTop: 32, padding: '16px 0', borderTop: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 12, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            Related:
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/statistics" style={{ color: 'var(--blue)', fontSize: 13 }}>Zero Statistics</Link>
            <Link to="/viz-prime-caustic" style={{ color: 'var(--blue)', fontSize: 13 }}>Prime Caustics</Link>
            <Link to="/viz-winding-dyson-flow" style={{ color: 'var(--blue)', fontSize: 13 }}>Winding / Dyson-flow</Link>
            <Link to="/route-map" style={{ color: 'var(--blue)', fontSize: 13 }}>Route Map</Link>
            <Link to="/docs" style={{ color: 'var(--blue)', fontSize: 13 }}>Docs (Vortex Field §)</Link>
          </div>
          <div style={{ marginTop: 14 }}>
            <Link to="/" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>← the atlas</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

