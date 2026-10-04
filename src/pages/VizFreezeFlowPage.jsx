import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader, InlineMath } from '../components/editorial/PostLayout.jsx';
import {
  FREEZE_FLOW_WITNESS,
  DEFECT_PACKETS,
  PACKET_PRIMES,
  MODULUS_FIRST,
  MODULUS_LAST,
  E97_COMPLEX,
  ORDER_RATIO,
} from '../data/viz-freeze-flow-phasors.js';
import { ED } from '../styles/tokens.js';

/* /viz-freeze-flow — the eq-42 normal form of the permutation architecture
   rendered as accurate flow geometry. ACCURACY RULE: the 25 phasors are the
   REAL complex defect packets D_j of the eq-(13) telescope, evaluated by the
   project's native Gate-2 evaluator at the recorded window-1 pilot sup
   witness (see viz-freeze-flow-phasors.js provenance). The two bars and
   their ratio are computed from those literals — nothing is illustrative
   except layout. The only display-scaled element (the phasor-grid arrow
   lengths, √-scaled so small packets stay visible) is labeled as such; the
   head-to-tail chains and the bars are in true linear scale. */

// ── the eq-42 normal form stages (verbatim word order from the paper/page) ────
const STAGES = [
  { key: 'complete', label: 'complete', type: 'E' },
  { key: 'correlate', label: 'correlate', type: 'E' },
  { key: 'heat', label: 'heat + masks', type: 'E' },
  { key: 'transform', label: 'exact transform', type: 'E' },
  { key: 'recombine', label: 'recombination', type: 'E' },
  { key: 'schur', label: 'Schur closure', type: 'C' },
  { key: 'modulus', label: 'ONE modulus', type: 'irreversible' },
];
const TYPE_COLOR = { E: ED.series3, C: ED.brassDeco, irreversible: ED.series2 };

// packet magnitudes/phases (derived once from the real literals)
const PACKETS = DEFECT_PACKETS.map(([re, im], i) => ({
  re,
  im,
  mag: Math.hypot(re, im),
  arg: Math.atan2(im, re),
  p: PACKET_PRIMES[i],
}));
const MAX_MAG = Math.max(...PACKETS.map((q) => q.mag));

// geometry
const W = 920;
const LANE_H = 240;
const BAR_H = 92;
const H = 2 * LANE_H + BAR_H + 46;
const CHAIN_X0 = 470; // where the head-to-tail chains start
const CHAIN_SCALE = 1350; // px per unit modulus (true linear scale, both lanes + bars)

function chainPath(points) {
  return `M ${points.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' L ')}`;
}

// cumulative head-to-tail chain of the true packets (normal-form lane)
const SUM_CHAIN = (() => {
  const pts = [[0, 0]];
  let x = 0;
  let y = 0;
  for (const q of PACKETS) {
    x += q.re;
    y += q.im; // math y up; flip when drawing
    pts.push([x, y]);
  }
  return pts;
})();

// aligned chain of magnitudes (the wrong-order lane: |·| taken per packet ⇒
// all phase discarded ⇒ geometrically a straight line of length Σ|D_j|)
const MAG_CHAIN = (() => {
  const pts = [[0, 0]];
  let x = 0;
  for (const q of PACKETS) {
    x += q.mag;
    pts.push([x, 0]);
  }
  return pts;
})();

export default function VizFreezeFlowPage() {
  const [tick, setTick] = useState(0);
  const raf = useRef();

  useEffect(() => {
    let t0;
    const loop = (ts) => {
      if (t0 === undefined) t0 = ts;
      setTick((ts - t0) / 1000);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  // common carrier rotation (display only — a shared e^{iΩτ} multiplies every
  // packet, which changes NO modulus and NO relative phase; labeled below)
  const carrier = (tick * 0.5) % (2 * Math.PI);
  // flow progress through the pipeline, looping every 9 s
  const prog = (tick % 9) / 9;
  // chain draw progress (packets land one by one during the recombination phase)
  const nDrawn = Math.max(1, Math.min(25, Math.floor(prog * 40)));

  const stageW = (W - 40) / STAGES.length;

  // phasor-grid renderer (√-scaled lengths, labeled); lane 0 = wrong order,
  // lane 1 = normal form. In lane 0 the packets are shown ALREADY collapsed to
  // magnitudes (phase discarded: all arrows point along +x).
  const renderPhasorGrid = (laneY, collapsed) => {
    const cols = 13;
    const cell = 30;
    const gx0 = 60;
    const gy0 = laneY + 66;
    return PACKETS.map((q, i) => {
      const cx = gx0 + (i % cols) * cell;
      const cy = gy0 + Math.floor(i / cols) * (cell + 16);
      const len = 4 + 20 * Math.sqrt(q.mag / MAX_MAG); // √-scaled (labeled)
      const ang = collapsed ? 0 : q.arg + carrier;
      const dx = len * Math.cos(ang);
      const dy = -len * Math.sin(ang);
      const color = collapsed ? ED.accent : ED.series1;
      return (
        <g key={`${collapsed}-${i}`}>
          <title>{`D_${i + 1} (p = ${q.p}): |D| = ${q.mag.toExponential(3)}, arg = ${q.arg.toFixed(3)} rad${collapsed ? ' — phase DISCARDED by the early modulus' : ''}`}</title>
          <circle cx={cx} cy={cy} r="1.4" fill="var(--faint)" />
          <line x1={cx} y1={cy} x2={cx + dx} y2={cy + dy} stroke={color} strokeWidth="1.7" strokeLinecap="round" />
          <circle cx={cx + dx} cy={cy + dy} r="1.9" fill={color} />
        </g>
      );
    });
  };

  // chains (true scale)
  const wrongChainPts = MAG_CHAIN.slice(0, nDrawn + 1).map(([x, y]) => [CHAIN_X0 + x * CHAIN_SCALE, LANE_H * 0.5 + 105 - y * CHAIN_SCALE]);
  const sumChainPts = SUM_CHAIN.slice(0, nDrawn + 1).map(([x, y]) => [CHAIN_X0 + x * CHAIN_SCALE, LANE_H * 1.5 + 66 - y * CHAIN_SCALE]);

  const barX0 = 60;
  const barY0 = 2 * LANE_H + 40;
  const rex = FREEZE_FLOW_WITNESS.rexExact;

  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>freeze-flow normal form · real defect packets · ratio {ORDER_RATIO.toFixed(4)} computed, not illustrative</span>} />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <div className="ed-lbl">idea geometry · 3 of 3</div>
        <h1 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 36, lineHeight: 1.12, margin: '6px 0 12px', color: 'var(--ink)' }}>
          The Normal Form as Flow Geometry
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: '58rem', lineHeight: 1.6 }}>
          Every admissible word of the <Link to="/permutation-architecture">permutation architecture</Link> has the
          correlation-preserving, modulus-last <strong>normal form</strong> (paper eq. 42): complete → correlate →
          heat + masks → exact transform → recombination → Schur → <em>one</em> scalar bound. The ordering rule
          (paper eq. 7) is the modulus barrier: <InlineMath tex="\left|\sum_j z_j\right| \le \sum_j |z_j|" /> — an
          early modulus discards relative phase irreversibly. Below, the rule is rendered with{' '}
          <strong>real packets</strong>: the 25 complex defects <InlineMath tex="D_j" /> of the eq-(13) prime
          telescope, evaluated by the project&rsquo;s native Gate-2 evaluator at the recorded window-1 pilot sup
          witness (<span className="ed-mono" style={{ fontSize: 12 }}>w = 0.524470030380</span>, chart 690988,
          x ≈ 6.0000039166×10¹²). The two bars and their ratio are computed from those numbers.
        </p>

        <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, background: 'var(--paper)', overflow: 'hidden' }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }} role="img"
            aria-label="The modulus-last normal form versus the forbidden modulus-first order, with real defect packets">

            {/* stage strip */}
            {STAGES.map((s, i) => {
              const x = 20 + i * stageW;
              const active = Math.floor(prog * STAGES.length) === i;
              const c = TYPE_COLOR[s.type];
              return (
                <g key={s.key}>
                  <rect x={x + 3} y={8} width={stageW - 6} height={26} rx="6" fill={active ? 'var(--paper3)' : 'var(--paper2)'} stroke={c} strokeWidth={active ? 1.8 : 1} />
                  <text x={x + stageW / 2} y={25} textAnchor="middle" style={{ font: `${active ? 700 : 600} 9.5px "IBM Plex Mono", monospace` }} fill={c}>{s.label}</text>
                  {i < STAGES.length - 1 && (
                    <text x={x + stageW - 1} y={25} textAnchor="middle" style={{ font: '11px "IBM Plex Mono", monospace' }} fill="var(--faint)">→</text>
                  )}
                </g>
              );
            })}
            {/* traveling packet dot along the strip */}
            <circle cx={23 + prog * (W - 46)} cy={40} r="3" fill="var(--terra-dk)" />
            <line x1={20} y1={40} x2={W - 20} y2={40} stroke="var(--hairline)" strokeWidth="1" />

            {/* ── lane 0: the FORBIDDEN order (modulus first) ── */}
            <rect x={16} y={54} width={W - 32} height={LANE_H - 12} rx="8" fill="var(--paper2)" opacity="0.55" />
            <text x={30} y={76} style={{ font: '700 11px "IBM Plex Mono", monospace', letterSpacing: 1 }} fill={ED.accent}>
              FORBIDDEN ORDER — modulus hits the packets first (early |·|)
            </text>
            <text x={30} y={92} style={{ font: '10.5px "IBM Plex Mono", monospace' }} fill="var(--faint)">
              each D_j → |D_j| — every arrow forced onto the positive axis: relative phase destroyed
            </text>
            {renderPhasorGrid(54, true)}
            {/* magnitude chain: a straight line (true scale) */}
            <path d={chainPath(wrongChainPts)} fill="none" stroke={ED.accent} strokeWidth="2.4" strokeLinecap="round" />
            {wrongChainPts.length > 1 && (
              <g>
                <circle cx={wrongChainPts[wrongChainPts.length - 1][0]} cy={wrongChainPts[wrongChainPts.length - 1][1]} r="3" fill={ED.series2} />
                <text x={CHAIN_X0} y={LANE_H * 0.5 + 127} style={{ font: '600 10.5px "IBM Plex Mono", monospace' }} fill={ED.accent}>
                  Σ|D_j| = {MODULUS_FIRST.toFixed(9)} — the triangle-inequality ceiling
                </text>
              </g>
            )}

            {/* ── lane 1: the NORMAL FORM (recombine first, modulus last) ── */}
            <rect x={16} y={LANE_H + 54} width={W - 32} height={LANE_H - 12} rx="8" fill="var(--paper2)" opacity="0.55" />
            <text x={30} y={LANE_H + 76} style={{ font: '700 11px "IBM Plex Mono", monospace', letterSpacing: 1 }} fill={ED.series3}>
              NORMAL FORM (eq. 42) — recombine the complex packets first, ONE modulus last
            </text>
            <text x={30} y={LANE_H + 92} style={{ font: '10.5px "IBM Plex Mono", monospace' }} fill="var(--faint)">
              the 25 packets keep their phases (arrows rotate with a common carrier — relative phase fixed)
            </text>
            {renderPhasorGrid(LANE_H + 54, false)}
            {/* head-to-tail complex sum chain (true scale): visible cancellation */}
            <path d={chainPath(sumChainPts)} fill="none" stroke={ED.series1} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
            {/* resultant E97 */}
            {nDrawn >= 25 && (
              <g>
                <line x1={sumChainPts[0][0]} y1={sumChainPts[0][1]} x2={sumChainPts[25][0]} y2={sumChainPts[25][1]} stroke={ED.series3} strokeWidth="2.6" />
                <circle cx={sumChainPts[25][0]} cy={sumChainPts[25][1]} r="3.2" fill={ED.series3} />
              </g>
            )}
            <text x={CHAIN_X0} y={LANE_H * 1.5 + 92} style={{ font: '600 10.5px "IBM Plex Mono", monospace' }} fill={ED.series3}>
              |Σ D_j| = |E97| = {MODULUS_LAST.toFixed(9)}  (E97 = {E97_COMPLEX.re.toFixed(6)} + {E97_COMPLEX.im.toFixed(6)}i)
            </text>
            <text x={CHAIN_X0} y={LANE_H * 1.5 + 108} style={{ font: '10px "IBM Plex Mono", monospace' }} fill="var(--faint)">
              head-to-tail chain, TRUE scale — the bends are the cancellation
            </text>

            {/* ── the modulus bars (shared true scale) ── */}
            <text x={barX0} y={barY0 - 6} style={{ font: '700 11px "IBM Plex Mono", monospace', letterSpacing: 1 }} fill="var(--ink-soft)">
              THE ONE-MODULUS STAGE — both lanes collapsed to a magnitude (same scale)
            </text>
            <rect x={barX0} y={barY0 + 4} width={MODULUS_FIRST * CHAIN_SCALE} height="17" rx="3" fill={ED.series2} opacity="0.85" />
            <text x={barX0 + MODULUS_FIRST * CHAIN_SCALE + 8} y={barY0 + 17} style={{ font: '600 10.5px "IBM Plex Mono", monospace' }} fill={ED.accent}>
              {MODULUS_FIRST.toFixed(9)} (modulus first)
            </text>
            <rect x={barX0} y={barY0 + 27} width={MODULUS_LAST * CHAIN_SCALE} height="17" rx="3" fill={ED.series3} opacity="0.9" />
            <text x={barX0 + MODULUS_LAST * CHAIN_SCALE + 8} y={barY0 + 40} style={{ font: '600 10.5px "IBM Plex Mono", monospace' }} fill={ED.series3}>
              {MODULUS_LAST.toFixed(9)} (modulus last)
            </text>
            {/* Rex marker */}
            <line x1={barX0 + rex * CHAIN_SCALE} y1={barY0} x2={barX0 + rex * CHAIN_SCALE} y2={barY0 + 48} stroke="var(--ink)" strokeWidth="1.4" strokeDasharray="4 3" />
            <text x={barX0 + rex * CHAIN_SCALE + 6} y={barY0 + 58} style={{ font: '600 10px "IBM Plex Mono", monospace' }} fill="var(--ink)">
              Rex = {rex} (eq. 19 target)
            </text>
            <text x={barX0} y={barY0 + 62} style={{ font: '700 12px "IBM Plex Mono", monospace' }} fill="var(--ink)">
              computed ratio Σ|D_j| / |Σ D_j| = {ORDER_RATIO.toFixed(7)}
            </text>
          </svg>
        </div>

        <p style={{ fontSize: 12.5, color: 'var(--faint)', lineHeight: 1.6, marginTop: 8 }}>
          Display notes (everything else is true-scale): the phasor-grid arrow <em>lengths</em> are √-scaled so the
          10⁻⁴-size packets stay visible (true magnitudes in the tooltips); the arrows rotate with a shared carrier
          e<sup>iΩτ</sup>, which changes no modulus and no relative phase. The chains and both bars share one linear
          scale ({CHAIN_SCALE} px per unit).
        </p>

        <div style={{ borderLeft: '3px solid var(--terra-dk)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '12px 16px', margin: '18px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>what this shows — and what it does not</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
            The eq-7 ordering rule is why the architecture forbids early componentwise moduli (&ldquo;FORBIDDEN when
            correlation is needed&rdquo; in the permutation atlas): at this real evaluation point the early modulus
            costs a factor <strong>{ORDER_RATIO.toFixed(4)}</strong> — and the wrong-order value{' '}
            {MODULUS_FIRST.toFixed(6)} reproduces the recorded sampled window-1 pilot sup to 4×10⁻⁹ (this witness
            maximizes exactly that quantity; the witness w is recorded to 12 digits), while
            the normal-form value {MODULUS_LAST.toFixed(6)} keeps 26% more margin under Rex. Data grade:{' '}
            <strong>measured</strong> (dd evaluation, telescope identity to 2.6×10⁻¹⁴, cross-checked against the
            independent eval_E97 path). The picture proves no bound and makes no RH claim; it renders one ordering
            lemma with one real data point. Λ ≤ 0.2 (Platt–Trudgian) remains the rigorous benchmark. NO QED.
          </p>
        </div>

        <div style={{ marginTop: 22, fontSize: 13.5 }}>
          <Link to="/permutation-architecture">Permutation Architecture →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/viz-window-landscape">The window-1 landscape →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/viz-cost-floor">The cost floor →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/visualizations">All visualizations →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/">← home</Link>
        </div>
      </div>
    </div>
  );
}
