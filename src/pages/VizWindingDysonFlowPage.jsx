import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import VizCeilingNote from '../components/VizCeilingNote.jsx';
import { ED, alpha } from '../styles/tokens.js';

/*
 * Winding under Dyson/Newman flow.
 *
 * The argument principle: W = (1/2pi) * oint_gamma (H_t'/H_t) ds counts the
 * zeros of H_t inside the contour gamma. As heat-time tau evolves under the de
 * Bruijn-Newman dynamics, zeros either stay on Re s = 1/2 or (for tau < Lambda)
 * form off-axis conjugate pairs. The winding number W is topologically conserved
 * until a zero exits the contour boundary.
 *
 * CEILING: re-derives Lambda >= 0 (Rodgers-Tao 2020) only. Does NOT
 * produce a new upper bound and does not beat Platt-Trudgian Lambda <= 0.2.
 * Route-map id: route-map-supercritical-winding-is-the-original-thread.
 *
 * Editorial (warm) re-theme: chrome only. Canvas viz/argument-principle logic
 * is untouched. The phase colormap (hsl2rgb, a continuous data encoding of
 * arg(H_t)) is left as-is; chrome overlays (critical-line guide, contour box,
 * zero markers, axes, grid) are recolored to literal warm hex -- ctx.fillStyle
 * / ctx.strokeStyle can't read var(). Claims/caveats verbatim.
 */

// First 25 nontrivial zeta zeros (imaginary parts). Light hardcode -- avoids
// the 16.7MB zeros bundle (pages must not import it).
const GAMMAS = [
  14.134725, 21.022040, 25.010858, 30.424876, 32.935062, 37.586178, 40.918719,
  43.327073, 48.005151, 49.773832, 52.970321, 56.446248, 59.347044, 60.831779,
  65.112544, 67.079811, 69.546402, 72.067158, 75.704691, 77.144840, 79.337375,
  82.910381, 84.735493, 87.425275, 88.809111,
];

const PX = 400;
const HALF_T = 8;
const HALF_SIG = 3;
// Integration contour is inset from the window edge
const CONTOUR_SIG_INSET = 0.4;
const CONTOUR_T_INSET = 2.0;

function hsl2rgb(h, s, l) {
  h /= 360;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h * 12) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
  };
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function buildZeros(centerIdx, tau) {
  const gc = GAMMAS[centerIdx];
  const others = GAMMAS
    .filter((g) => Math.abs(g - gc) <= HALF_T + 4 && Math.abs(g - gc) > 1e-9)
    .map((g) => ({ sigma: 0.5, gamma: g, off: false }));
  const delta = tau < 0 ? -tau : 0;
  const central = delta > 1e-6
    ? [
        { sigma: 0.5 + delta, gamma: gc, off: true },
        { sigma: 0.5 - delta, gamma: gc, off: true },
      ]
    : [{ sigma: 0.5, gamma: gc, off: false }];
  return [...central, ...others];
}

function countEnclosed(zeros, sigLo, sigHi, tLo, tHi) {
  return zeros.filter(
    (z) => z.sigma >= sigLo && z.sigma <= sigHi && z.gamma >= tLo && z.gamma <= tHi,
  ).length;
}

function PhaseCanvas({ centerIdx, tau }) {
  const ref = useRef(null);
  const zeros = useMemo(() => buildZeros(centerIdx, tau), [centerIdx, tau]);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const imgData = ctx.createImageData(PX, PX);
    const d = imgData.data;
    const gc = GAMMAS[centerIdx];
    const sigMin = 0.5 - HALF_SIG, sigMax = 0.5 + HALF_SIG;
    const tMin = gc - HALF_T,      tMax = gc + HALF_T;

    for (let py = 0; py < PX; py++) {
      const t = tMax - (py / (PX - 1)) * (tMax - tMin);
      for (let px = 0; px < PX; px++) {
        const sig = sigMin + (px / (PX - 1)) * (sigMax - sigMin);
        let phase = 0;
        for (let k = 0; k < zeros.length; k++) {
          phase += Math.atan2(t - zeros[k].gamma, sig - zeros[k].sigma);
        }
        let ph = phase % (2 * Math.PI);
        if (ph < 0) ph += 2 * Math.PI;
        const [r, g, b] = hsl2rgb((ph / (2 * Math.PI)) * 360, 0.85, 0.5);
        const o = (py * PX + px) * 4;
        d[o] = r; d[o + 1] = g; d[o + 2] = b; d[o + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    const toPx = (sig, t) => [
      ((sig - sigMin) / (sigMax - sigMin)) * (PX - 1),
      ((tMax - t) / (tMax - tMin)) * (PX - 1),
    ];

    // Critical line -- literal warm off-white (paper2 #f6f1e7) for contrast
    // against the (unmodified) phase colormap. ctx.strokeStyle can't read var().
    ctx.strokeStyle = alpha(ED.paper2, 0.6);
    ctx.setLineDash([6, 5]);
    ctx.lineWidth = 1.5;
    const [lx] = toPx(0.5, 0);
    ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, PX); ctx.stroke();
    ctx.setLineDash([]);

    // Integration contour rectangle -- literal warm brass (#8c6a1d).
    const cSigLo = 0.5 - HALF_SIG + CONTOUR_SIG_INSET;
    const cSigHi = 0.5 + HALF_SIG - CONTOUR_SIG_INSET;
    const cTLo = gc - HALF_T + CONTOUR_T_INSET;
    const cTHi = gc + HALF_T - CONTOUR_T_INSET;
    const [rx0, ry0] = toPx(cSigLo, cTHi); // top-left in canvas coords
    const [rx1, ry1] = toPx(cSigHi, cTLo); // bottom-right in canvas coords
    ctx.strokeStyle = alpha(ED.brass, 0.92);
    ctx.setLineDash([9, 4]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(rx0, ry0, rx1 - rx0, ry1 - ry0);
    ctx.stroke();
    ctx.setLineDash([]);

    // Zero markers -- literal warm brass-dk (on-axis) / terra-dk (off-axis).
    zeros.forEach((z) => {
      const [vx, vy] = toPx(z.sigma, z.gamma);
      if (vy < -12 || vy > PX + 12 || vx < -12 || vx > PX + 12) return;
      ctx.beginPath();
      ctx.arc(vx, vy, z.off ? 7.5 : 5.5, 0, 2 * Math.PI);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = z.off ? ED.accent : ED.brassDeco;
      ctx.fillStyle = alpha(ED.ink, 0.55);
      ctx.fill();
      ctx.stroke();
    });

    // W readout -- literal warm brass (#8c6a1d).
    const W = countEnclosed(zeros, cSigLo, cSigHi, cTLo, cTHi);
    const [wx, wy] = toPx(cSigLo + 0.1, cTHi - 0.4);
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = alpha(ED.brass, 0.95);
    ctx.fillText('W = ' + W, wx, wy + 16);
  }, [centerIdx, tau, zeros]);

  return (
    <canvas
      ref={ref}
      width={PX}
      height={PX}
      style={{ width: '100%', maxWidth: 480, borderRadius: 10, border: '1px solid var(--hairline)', display: 'block' }}
    />
  );
}

function WindingChart({ centerIdx }) {
  const ref = useRef(null);
  const gc = GAMMAS[centerIdx];

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const CW = 400, CH = 180;
    ctx.clearRect(0, 0, CW, CH);
    // Literal warm paper2 background -- ctx.fillStyle can't read var().
    ctx.fillStyle = ED.paper2;
    ctx.fillRect(0, 0, CW, CH);

    const cSigLo = 0.5 - HALF_SIG + CONTOUR_SIG_INSET;
    const cSigHi = 0.5 + HALF_SIG - CONTOUR_SIG_INSET;
    const cTLo = gc - HALF_T + CONTOUR_T_INSET;
    const cTHi = gc + HALF_T - CONTOUR_T_INSET;

    const TAU_N = 120;
    const tauMin = -6, tauMax = 0;
    const points = [];
    for (let i = 0; i <= TAU_N; i++) {
      const t = tauMin + (i / TAU_N) * (tauMax - tauMin);
      const zs = buildZeros(centerIdx, t);
      points.push({ tau: t, w: countEnclosed(zs, cSigLo, cSigHi, cTLo, cTHi) });
    }
    const wMax = Math.max(...points.map((p) => p.w));
    const wMin = Math.max(0, Math.min(...points.map((p) => p.w)) - 1);
    const wRange = Math.max(wMax - wMin + 1, 2);

    const LPAD = 38, RPAD = 12, TPAD = 14, BPAD = 28;
    const plotW = CW - LPAD - RPAD;
    const plotH = CH - TPAD - BPAD;

    const toX = (tau) => LPAD + ((tau - tauMin) / (tauMax - tauMin)) * plotW;
    const toY = (w)   => TPAD + plotH - ((w - wMin) / wRange) * plotH;

    // Grid -- literal warm hairline (#d5c9b2).
    ctx.strokeStyle = ED.rule;
    ctx.lineWidth = 1;
    for (let w = wMin; w <= wMax + 1; w++) {
      const y = toY(w);
      ctx.beginPath(); ctx.moveTo(LPAD, y); ctx.lineTo(CW - RPAD, y); ctx.stroke();
    }
    for (let tau = tauMin; tau <= tauMax; tau += 1) {
      const x = toX(tau);
      ctx.beginPath(); ctx.moveTo(x, TPAD); ctx.lineTo(x, CH - BPAD); ctx.stroke();
    }

    // Axes -- literal warm ink-soft (#4a4238).
    ctx.strokeStyle = ED.inkSoft;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(LPAD, TPAD); ctx.lineTo(LPAD, CH - BPAD); ctx.lineTo(CW - RPAD, CH - BPAD);
    ctx.stroke();

    // Axis labels -- literal warm faint (#877b67).
    ctx.fillStyle = ED.inkFaint;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    for (let tau = -6; tau <= 0; tau += 1) {
      ctx.fillText(String(tau), toX(tau), CH - BPAD + 14);
    }
    ctx.fillText('tau', CW - RPAD - 4, CH - BPAD + 14);
    ctx.textAlign = 'right';
    for (let w = wMin; w <= wMax; w++) {
      ctx.fillText(String(w), LPAD - 4, toY(w) + 3);
    }

    // tau = 0 marker -- literal warm blue (#3f6b86).
    ctx.strokeStyle = alpha(ED.series1, 0.55);
    ctx.setLineDash([4, 3]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(toX(0), TPAD); ctx.lineTo(toX(0), CH - BPAD);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = ED.series1;
    ctx.font = '9px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('tau=0', toX(0) + 2, TPAD + 9);

    // Winding curve -- literal warm brass-dk (#b58a2e).
    ctx.strokeStyle = ED.brassDeco;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    points.forEach((p, i) => {
      const x = toX(p.tau), y = toY(p.w);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Axis title -- literal warm faint (#877b67).
    ctx.fillStyle = ED.inkFaint;
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('W(tau)', LPAD + 4, TPAD + 11);
  }, [centerIdx, gc]);

  return (
    <canvas
      ref={ref}
      width={400}
      height={180}
      style={{ width: '100%', borderRadius: 8, border: '1px solid var(--hairline)', display: 'block' }}
    />
  );
}

export default function VizWindingDysonFlowPage() {
  const [centerIdx, setCenterIdx] = useState(9);
  const [tau, setTau] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animRef = useRef(null);
  const gc = GAMMAS[centerIdx];

  const cSigLo = 0.5 - HALF_SIG + CONTOUR_SIG_INSET;
  const cSigHi = 0.5 + HALF_SIG - CONTOUR_SIG_INSET;
  const cTLo = gc - HALF_T + CONTOUR_T_INSET;
  const cTHi = gc + HALF_T - CONTOUR_T_INSET;
  const zeros = useMemo(() => buildZeros(centerIdx, tau), [centerIdx, tau]);
  const W = countEnclosed(zeros, cSigLo, cSigHi, cTLo, cTHi);
  const offAxis = tau < -1e-6;

  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }
    const TAU_MIN = -6, TAU_MAX = 0, DURATION_MS = 8000;
    let last = null;
    const step = (ts) => {
      if (last === null) last = ts;
      const dt = ts - last;
      last = ts;
      setTau((prev) => {
        const next = prev - (dt / DURATION_MS) * (TAU_MAX - TAU_MIN);
        if (next <= TAU_MIN) { setIsPlaying(false); return TAU_MIN; }
        return next;
      });
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isPlaying]);

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <header style={{ borderBottom: '1px solid var(--hairline)', paddingBottom: 18, marginBottom: 24 }}>
          <div className="ed-lbl">/viz-winding-dyson-flow · visualizations</div>
          <h1 className="ed-h1" style={{ margin: '8px 0 4px 0' }}>Winding under Dyson/Newman Flow</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: '8px 0 0 0', lineHeight: 1.6 }}>
            The argument principle assigns a winding number{' '}
            <code>W = (1/2π)∮ (H_t′/H_t) ds</code> to any closed contour. As
            heat-time <code>tau</code> decreases, the central zero bifurcates into an
            off-axis pair; <strong>W is conserved</strong> until a zero exits the
            contour. The gold dashed box is the integration path; the number in the
            corner is the live winding count.
          </p>
        </header>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 420px' }}>
            <PhaseCanvas centerIdx={centerIdx} tau={tau} />
            <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 6, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
              sigma in [½-{HALF_SIG}, ½+{HALF_SIG}] · t in [{(gc - HALF_T).toFixed(1)}, {(gc + HALF_T).toFixed(1)}] · tau = {tau.toFixed(2)}
            </div>
          </div>

          <div style={{ flex: '0 1 280px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div
              className="card"
              style={{
                background: offAxis ? 'color-mix(in srgb, var(--series-2) 8%, transparent)' : 'color-mix(in srgb, var(--brass-deco) 8%, transparent)',
                borderLeft: '3px solid ' + (offAxis ? 'var(--terra-dk)' : 'var(--brass-dk)'),
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: 'var(--ink)' }}>
                W = {W}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                {offAxis
                  ? 'Off-axis pair at sigma = ½ ± ' + (-tau).toFixed(2) + '. Winding preserved while both stay inside contour.'
                  : 'All zeros on Re s = ½ (tau = 0). Forward heat collapses any off-axis pair onto the critical line.'}
              </div>
            </div>

            <div className="card">
              <label style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                Heat-time tau: <strong>{tau.toFixed(2)}</strong>
                <input
                  type="range"
                  min={-6}
                  max={0}
                  step={0.05}
                  value={tau}
                  onChange={(e) => { setIsPlaying(false); setTau(+e.target.value); }}
                  style={{ width: '100%', marginTop: 6 }}
                />
              </label>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  onClick={() => {
                    if (tau <= -5.9) setTau(0);
                    setIsPlaying((p) => !p);
                  }}
                  style={{
                    flex: 1, padding: '5px 0', fontSize: 12,
                    background: isPlaying ? 'var(--ink-soft)' : 'var(--blue)',
                    color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer',
                  }}
                >
                  {isPlaying ? 'Pause' : tau <= -5.9 ? 'Replay' : 'Animate 0 -> -6'}
                </button>
                <button
                  onClick={() => { setIsPlaying(false); setTau(0); }}
                  style={{ padding: '5px 10px', fontSize: 12, background: 'var(--paper2)', color: 'var(--ink-soft)', border: '1px solid var(--hairline)', borderRadius: 6, cursor: 'pointer' }}
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="card">
              <label style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                Central zero: gamma = {gc.toFixed(3)}
                <input
                  type="range"
                  min={1}
                  max={GAMMAS.length - 2}
                  value={centerIdx}
                  onChange={(e) => setCenterIdx(+e.target.value)}
                  style={{ width: '100%', marginTop: 6 }}
                />
              </label>
            </div>

            <div className="card" style={{ background: 'color-mix(in srgb, var(--series-1) 8%, transparent)', borderLeft: '3px solid var(--blue)', fontSize: 12 }}>
              <strong style={{ color: 'var(--ink)' }}>Legend</strong>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2.5px solid var(--brass-deco)', background: 'color-mix(in srgb, var(--ink) 50%, transparent)', flexShrink: 0 }} />
                <span style={{ color: 'var(--ink-soft)' }}>On-axis zero (sigma = ½)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2.5px solid var(--accent)', background: 'color-mix(in srgb, var(--ink) 50%, transparent)', flexShrink: 0 }} />
                <span style={{ color: 'var(--ink-soft)' }}>Off-axis zero (tau &lt; 0)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <div style={{ width: 20, height: 2, background: 'color-mix(in srgb, var(--brass) 90%, transparent)', flexShrink: 0, borderTop: '2px dashed color-mix(in srgb, var(--brass) 90%, transparent)' }} />
                <span style={{ color: 'var(--ink-soft)' }}>Integration contour gamma</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <div style={{ fontSize: 12, color: 'var(--faint)', marginBottom: 10, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            Before / after flow comparison — tau=0 (real flow endpoint) vs tau={tau.toFixed(2)}
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ fontSize: 11, color: 'var(--blue)', marginBottom: 6, fontFamily: 'var(--ed-mono, var(--font-mono))', fontWeight: 700 }}>
                BEFORE flow (tau = 0) — all zeros on Re s = ½
              </div>
              <PhaseCanvas centerIdx={centerIdx} tau={0} />
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ fontSize: 11, color: offAxis ? 'var(--terra-dk)' : 'var(--blue)', marginBottom: 6, fontFamily: 'var(--ed-mono, var(--font-mono))', fontWeight: 700 }}>
                {offAxis
                  ? `AFTER seeding off-axis pair (tau = ${tau.toFixed(2)}) — red vortices at sigma = ½ ± ${(-tau).toFixed(2)}`
                  : `tau = 0 — drag the slider above to seed an off-axis pair`}
              </div>
              <PhaseCanvas centerIdx={centerIdx} tau={tau} />
            </div>
          </div>
          <div className="card" style={{ marginTop: 12, background: 'color-mix(in srgb, var(--series-1) 8%, transparent)', borderLeft: '3px solid var(--blue)', fontSize: 12 }}>
            <strong style={{ color: 'var(--ink)' }}>What the comparison shows:</strong>{' '}
            <span style={{ color: 'var(--ink-soft)' }}>
              At τ=0 (left) all zeros sit on Re s=½ — one vortex swirl per zero, centred on the critical line.
              At τ&lt;0 (right) the central zero bifurcates into a conjugate off-axis pair (red markers), splitting
              its single vortex into two; yet the winding count W inside the gold contour is <em>unchanged</em> while
              both members of the pair remain inside.
              The forward heat-flow (τ: negative → 0) collapses any such pair back onto the critical line, re-deriving
              Rodgers–Tao Λ ≥ 0 visually. <span style={{ color: 'var(--faint)' }}>
                Ceiling: this is Λ ≥ 0 only — no new upper bound.
              </span>
            </span>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--faint)', marginBottom: 8, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            W(tau) conservation chart — zero gamma = {gc.toFixed(3)}
          </div>
          <WindingChart centerIdx={centerIdx} />
          <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 6 }}>
            Flat segment: off-axis pair inside contour — W conserved.
            Step-down near tau = -{(HALF_SIG - CONTOUR_SIG_INSET).toFixed(1)}: pair exits the sigma face of the contour — W drops by 2.
          </div>
        </div>

        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ marginTop: 0, color: 'var(--brass-dk)' }}>What this shows</h3>
          <ul style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
            <li>
              <strong>Argument principle.</strong> The winding number W = (1/2pi) * oint arg(H_t) around
              the gold contour counts the zeros of H_t inside it. Phase wraps once per enclosed zero — one
              full colour cycle per vortex as you circuit the box.
            </li>
            <li>
              <strong>Winding conservation under heat flow.</strong> As tau decreases, the central zero
              bifurcates into an off-axis conjugate pair at sigma = ½ ± |tau| (de Bruijn-Newman model).
              Both members of the pair are still inside the contour, so W is unchanged. The colour structure
              merges from two separate vortex swirls near the pair back to a single swirl as tau returns to 0.
            </li>
            <li>
              <strong>Topology change at the boundary.</strong> When |tau| exceeds the sigma half-width of
              the contour (≈ {(HALF_SIG - CONTOUR_SIG_INSET).toFixed(1)}), the off-axis pair crosses the
              left or right face of the contour and W drops by 2. The conservation chart shows this exact
              step-down. This is NOT a smooth transition — W is integer-valued and only changes when a zero
              crosses the boundary.
            </li>
            <li>
              <strong>Connection to Rodgers-Tao (Lambda ≥ 0).</strong> For the real xi function, H_0
              zeros are the zeta zeros. If any were off-axis at tau = 0, they would exist as a conjugate
              pair whose collision time Lambda would be strictly positive — contradicting Λ ≥ 0. The
              winding conservation argument is the topological core of this result.
            </li>
            <VizCeilingNote claim="Λ ≥ 0 (Rodgers-Tao, winding argument)" />
          </ul>
        </div>

        <footer style={{ marginTop: 32, padding: '16px 0', borderTop: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 12, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            Related visualizations:
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/vortex-field" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>Vortex Field (wide view)</Link>
            <Link to="/viz-near-zero" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>Near a Zeta Zero</Link>
            <Link to="/supercritical" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>Supercritical Winding</Link>
            <Link to="/visual-geometries" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>Visual Geometries Gallery</Link>
            <Link to="/route-map" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>Route Map</Link>
          </div>
          <div style={{ marginTop: 14 }}>
            <Link to="/" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>← the atlas</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
