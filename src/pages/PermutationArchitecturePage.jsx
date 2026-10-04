import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader, InlineMath, BlockMath } from '../components/editorial/PostLayout.jsx';
import WireframeAnim from '../components/editorial/WireframeAnim.jsx';
import { IMP95077_FAR_LEDGER_DEGRADE_TABLE } from '../data/imp-95077-far-ledger-degrade-table.js';
import { IMP95026_PAPER_PACKET_CEILING_TRANSFER } from '../data/imp-95026-paper-packet-ceiling-transfer.js';
import {
  IMP95038_ENVELOPE_CURVE,
  IMP95038_CORNER_VALUES,
  IMP95038_V02,
} from '../data/imp-95038-envelope-treatment-comparison.js';
import {
  IMP95011_GATE2_OSCILLATION_PROBE,
  IMP95051_CORRELATION_GAIN_TABLE,
} from '../data/imp-95011-gate2-oscillation-probe.js';
import { SLAB_HYPOTHESIS } from '../data/imp-95046-slab-44-conditional-target.js';
import { ANCHOR_GATE, MISSING_EVALUATOR_INPUTS } from '../data/imp-95013-gate2-lane-a-blocked-on-spec.js';
import { IMP95096_JOINT_NEAR_FAR_VS_LAMBDA_MAX } from '../data/imp-95096-joint-near-far-vs-lambda-max-terminality.js';
import { IMP95092_FOUR_LEVER_FAR_CEILING_ELASTICITY_TABLE } from '../data/imp-95092-four-lever-far-ceiling-elasticity-table.js';
import { PERM_ARCH_SIEVE_UNIVERSALITY } from '../data/perm-arch-sieve-universality-no-go-2026-09-22.js';
import { IMP95519_LOCALIZED_BARRIER_SUM_NOGO } from '../data/imp-95519-localized-barrier-sum-prime-zero-nogo.js';
import { IMP95564_EFFECTIVE_ABSCISSA_AUDIT } from '../data/imp-95564-effective-abscissa-provenance-audit.js';
import { IMP95604_MEANSQUARE_POINTWISE_UPGRADE } from '../data/imp-95604-meansquare-pointwise-upgrade-foreclosure.js';
import { ED } from '../styles/tokens.js';

/* Permutation Architecture — the typed freeze calculus for the zeta twin ladder,
   the strict Λ ≤ 0.14 completion contract, and the one open family. Sourced
   verbatim-in-scope from "Permuting the Zeta Twin Ladder" (Gomila, 2026-08-24).
   Honest framing: Λ ≤ 0.14 is a conditional CONTRACT, not a proved bound; this
   page proves neither RH nor a new de Bruijn–Newman bound. Editorial theme. */

// The typed component calculus (E/A/C/O), from the paper's §3 table.
const COMPONENTS = [
  ['C', 'completion', 'adds polynomial + gamma factors', 'E'],
  ['R', 'reflection bridge', 'exchanges s and 1−s channels', 'E'],
  ['H_t', 'heat flow', 'changes analytic field & zero geometry', 'E'],
  ['P', 'prime masks / shells', 'projects coefficient support', 'E'],
  ['B_v', 'B / Fresnel transform', 'coefficient sums → stationary packets', 'E-local'],
  ['G_U', 'graph compression', 'direct sum → correlated sector', 'C'],
  ['I_K', 'twistor incidence transform', 'analytic states → cohomological data', 'O'],
  ['S', 'Schur elimination', 'removes a coercive tail', 'C'],
  ['M', 'modulus / majorant', 'complex correlated data → positive scalar', 'irreversible'],
  ['A_Γ', 'boundary count', 'values on a shell → winding / divisor data', 'C'],
];

const STATUS_META = {
  E: { color: ED.series3, label: 'E — exact theorem / identity' },
  'E-local': { color: ED.series3, label: 'E locally; bounds open' },
  A: { color: ED.series1, label: 'A — auxiliary abstraction' },
  C: { color: ED.brass, label: 'C — proved implication, open antecedent' },
  O: { color: ED.series5, label: 'O — unproved construction' },
  irreversible: { color: ED.accent, label: 'irreversible' },
};

// The five alternative sufficient gates (§4.8) — different exact decompositions.
const GATES = [
  ['Full cocycle', '|E₉₇| < 0.2796881955526244', 'complete rough-core + analytic-transfer charge'],
  ['18-moment carrier', '|C_E,17| + r_num < 0.2796881955526147', 'exact carrier remainder < 9.671×10⁻¹⁵'],
  ['Retained divisors', '|E_D| < 0.2691881955526244', 'all divisor branches d > 10⁶ (charged by 21/2000)'],
  ['Physical bulk', '|E_bulk| < 0.2777007631201920', 'the last ⌈N^{1/3}⌉ physical terms'],
  ['Cubic canonical sum', '|E_can| < 0.1835011530528975', 'a uniform 4th-order log-phase Taylor charge'],
];

// Even-class block kernel K(b,bp) = envE(min(b,bp), |b-bp|), K(b,b)=0, on the
// leading blocks {0,2,4} that capture the imp-95008 Perron eigenvalue to
// machine precision (imp-95098-perron-eigenvalue-closed-form.js).
const KERNEL_ENTRIES = {
  '0,2': 3.9197920255561178e-5, '2,0': 3.9197920255561178e-5,
  '0,4': 1.4905600807225833e-10, '4,0': 1.4905600807225833e-10,
  '2,4': 3.398047003867178e-8, '4,2': 3.398047003867178e-8,
  '0,0': 0, '2,2': 0, '4,4': 0,
};

// Near-Perron eigenvector weight share (|v_b|^2) at lambda_max=3.9197935113802585e-5.
const WEIGHT_PROFILE = [
  [0, 0.499999623],
  [2, 0.499999998],
  [4, 3.79056665e-7],
];

const KERNEL_LOG_LO = Math.log10(1.4905600807225833e-10);
const KERNEL_LOG_HI = Math.log10(3.9197920255561178e-5);

function kernelCellColor(val) {
  if (!val) return 'var(--paper2)';
  const t = Math.min(1, Math.max(0, (Math.log10(val) - KERNEL_LOG_LO) / (KERNEL_LOG_HI - KERNEL_LOG_LO)));
  const lo = [246, 241, 231]; // --paper2
  const hi = [194, 58, 28]; // --terra-dk
  const rgb = lo.map((c0, i) => Math.round(c0 + (hi[i] - c0) * t));
  return { bg: `rgb(${rgb.join(',')})`, t };
}

function StatusChip({ s }) {
  const m = STATUS_META[s] || STATUS_META.O;
  return (
    <span className="ed-mono" style={{ fontSize: 10, fontWeight: 700, color: m.color, border: `1px solid ${m.color}`, borderRadius: 4, padding: '1px 6px', whiteSpace: 'nowrap' }}>{s}</span>
  );
}

// Per-pair envelope comparison chart (imp-95038): the three successive
// far-bracket treatments plotted vs separation T, log-log, starting at the
// dominant corner V(0,2). Content/viz follow-up only.
function EnvelopeComparisonChart() {
  const W = 640;
  const H = 300;
  const padL = 54;
  const padR = 16;
  const padT = 14;
  const padB = 34;
  const cW = W - padL - padR;
  const cH = H - padT - padB;

  const logT = (t) => Math.log10(t);
  const tMin = logT(IMP95038_V02);
  const tMax = logT(IMP95038_ENVELOPE_CURVE[IMP95038_ENVELOPE_CURVE.length - 1].T);
  const yMax = logT(IMP95038_CORNER_VALUES.twoWindow);
  const yMin = logT(IMP95038_ENVELOPE_CURVE[IMP95038_ENVELOPE_CURVE.length - 1].exact);

  const xS = (t) => padL + cW * ((logT(t) - tMin) / (tMax - tMin));
  const yS = (v) => padT + cH * (1 - (logT(v) - yMin) / (yMax - yMin));

  const series = [
    { key: 'twoWindow', color: ED.brass, label: 'two-window (seventeenth)' },
    { key: 'threeWindow', color: ED.series1, label: 'three-window (eighteenth)' },
    { key: 'exact', color: ED.accent, label: 'exact closed form (nineteenth)' },
  ];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: W, display: 'block', margin: '0 auto' }}
      role="img"
      aria-label="Per-pair envelope bound psi(T): two-window, three-window, and exact closed form, plotted vs separation T on a log-log scale, dominant corner V(0,2) marked at the left edge"
    >
      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="var(--hairline)" strokeWidth={1} />
      {series.map((s) => {
        const points = IMP95038_ENVELOPE_CURVE.map((p) => `${xS(p.T)},${yS(p[s.key])}`).join(' ');
        return <polyline key={s.key} points={points} fill="none" stroke={s.color} strokeWidth={1.75} />;
      })}
      {/* dominant-corner marker */}
      <line x1={xS(IMP95038_V02)} y1={padT} x2={xS(IMP95038_V02)} y2={padT + cH} stroke="var(--faint)" strokeWidth={1} strokeDasharray="3,3" />
      <text x={xS(IMP95038_V02)} y={padT - 3} textAnchor="middle" fontFamily="var(--ed-mono)" fontSize="9.5" fill="var(--faint)">V(0,2)</text>
      <text x={padL} y={padT + cH + 22} fontFamily="var(--ed-mono)" fontSize="9.5" fill="var(--faint)">
        T = {IMP95038_V02.toFixed(3)}
      </text>
      <text x={padL + cW} y={padT + cH + 22} textAnchor="end" fontFamily="var(--ed-mono)" fontSize="9.5" fill="var(--faint)">
        T = {IMP95038_ENVELOPE_CURVE[IMP95038_ENVELOPE_CURVE.length - 1].T.toFixed(1)}
      </text>
      <text x={padL + cW / 2} y={padT + cH + 22} textAnchor="middle" fontFamily="var(--ed-mono)" fontSize="9.5" fill="var(--faint)">
        separation T (log scale)
      </text>
      <text x={6} y={padT + 8} fontFamily="var(--ed-mono)" fontSize="9.5" fill="var(--faint)">
        {IMP95038_CORNER_VALUES.twoWindow.toExponential(1)}
      </text>
      <text x={6} y={padT + cH} fontFamily="var(--ed-mono)" fontSize="9.5" fill="var(--faint)">
        {IMP95038_ENVELOPE_CURVE[IMP95038_ENVELOPE_CURVE.length - 1].exact.toExponential(1)}
      </text>
      {series.map((s, i) => (
        <g key={s.key} transform={`translate(${padL + 8}, ${padT + 12 + i * 13})`}>
          <line x1={0} y1={0} x2={16} y2={0} stroke={s.color} strokeWidth={2} />
          <text x={20} y={3} fontFamily="var(--ed-mono)" fontSize="10" fill="var(--ink-soft)">{s.label}</text>
        </g>
      ))}
    </svg>
  );
}

// imp-95063: Gate-2 oscillation-probe (imp-95011) regime map — the surrogate
// per-unit-N increment L under the smooth (sqrt N phase) vs raw (N phase)
// hypotheses, on a log scale against the batching-kill threshold, plus the
// decoupled-mass correlation-gain range (imp-95051). Content/viz follow-up only.
function OscillationRegimeMapChart() {
  const W = 640;
  const H = 150;
  const padL = 54;
  const padR = 16;
  const padT = 10;
  const padB = 28;
  const cW = W - padL - padR;
  const cH = H - padT - padB;

  const BATCHING_L_KILL = 1e-2;
  const { smooth, raw } = IMP95011_GATE2_OSCILLATION_PROBE.regimeMap;
  const rows = [
    { label: 'smooth (phase ~ √N)', L: smooth.surrogateMaxL, color: ED.series3, survives: smooth.batchingSurvives },
    { label: 'raw (phase ~ N)', L: raw.surrogateMaxL, color: ED.accent, survives: raw.batchingSurvives },
  ];
  const logMin = Math.log10(1e-5);
  const logMax = Math.log10(1.5);
  const xS = (v) => padL + cW * ((Math.log10(v) - logMin) / (logMax - logMin));
  const rowH = cH / rows.length;

  const gain = IMP95051_CORRELATION_GAIN_TABLE.smoothRegime;

  return (
    <>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ maxWidth: W, display: 'block', margin: '0 auto' }}
        role="img"
        aria-label="Gate-2 oscillation-probe regime map: surrogate per-unit-N increment L for the smooth and raw phase hypotheses on a log scale, against the batching failure threshold 1e-2"
      >
        <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="var(--hairline)" strokeWidth={1} />
        <line x1={xS(BATCHING_L_KILL)} y1={padT} x2={xS(BATCHING_L_KILL)} y2={padT + cH} stroke="var(--faint)" strokeWidth={1} strokeDasharray="3,3" />
        <text x={xS(BATCHING_L_KILL)} y={padT - 2} textAnchor="middle" fontFamily="var(--ed-mono)" fontSize="9.5" fill="var(--faint)">L_kill = 1e-2</text>
        {rows.map((r, i) => {
          const y = padT + i * rowH;
          const barW = Math.max(2, xS(r.L) - padL);
          return (
            <g key={r.label}>
              <rect x={padL} y={y + rowH * 0.22} width={barW} height={rowH * 0.56} fill={r.color} opacity={0.75} />
              <text x={4} y={y + rowH * 0.55} fontFamily="var(--ed-mono)" fontSize="10.5" fill="var(--ink-soft)">{r.label}</text>
              <text x={xS(r.L) + 5} y={y + rowH * 0.55} fontFamily="var(--ed-mono)" fontSize="10" fill={r.color}>
                L={r.L.toExponential(2)} ({r.survives ? 'survives' : 'rules out batching'})
              </text>
            </g>
          );
        })}
      </svg>
      <p style={{ fontSize: 12.5, color: 'var(--faint)', lineHeight: 1.55, margin: '4px 0 0', textAlign: 'center' }}>
        decoupled-mass correlation gain (imp-95051, smooth regime, {gain.count} cells): mean{' '}
        {gain.mean.toFixed(3)}, range [{gain.min.toFixed(3)}, {gain.max.toFixed(3)}] — strictly below 1 throughout, the
        cancellation the enclosure depends on.
      </p>
    </>
  );
}

// imp-95078: four-lever sensitivity map for the imp-95026 far-ceiling
// transfer assessment (theta/sigma/beta/isolation-Q scans), each a small
// line panel against the model point and the pre-seventeenth 4 reference;
// the theta panel additionally marks the s* = 2.9484 exact-proof break
// line (converted to theta* = s* - sigma = 1.9484 at the model sigma = 1).
// Content/viz follow-up only; promotes no bound.
function FarCeilingLeverScanChart() {
  const { thetaScan, sigmaScan, betaScan, isolationScan, breakBoundaryS } = IMP95026_PAPER_PACKET_CEILING_TRANSFER.reference;
  const S_STAR = breakBoundaryS;
  const MODEL_SIGMA = 1;

  const panels = [
    { key: 'theta', label: 'θ (σ=1 fixed)', scan: thetaScan, modelX: 10, breakX: S_STAR - MODEL_SIGMA },
    { key: 'sigma', label: 'σ (θ=10 fixed)', scan: sigmaScan, modelX: 1, breakX: null },
    { key: 'beta', label: 'β (σ=1,θ=10 fixed)', scan: betaScan, modelX: 0.333, breakX: null },
    { key: 'isolation', label: 'c (isolation Q lever)', scan: isolationScan, modelX: 1, breakX: null },
  ];

  const W = 300;
  const H = 170;
  const padL = 40;
  const padR = 10;
  const padT = 10;
  const padB = 26;
  const cW = W - padL - padR;
  const cH = H - padT - padB;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
      {panels.map((p) => {
        const xs = Object.keys(p.scan).map(Number);
        const ys = Object.values(p.scan);
        const xMin = Math.min(...xs, p.breakX ?? Infinity);
        const xMax = Math.max(...xs);
        const yMin = 0;
        const yMax = Math.max(...ys) * 1.05;
        const xS = (x) => padL + cW * ((x - xMin) / (xMax - xMin));
        const yS = (y) => padT + cH * (1 - (y - yMin) / (yMax - yMin));
        const points = xs.map((x, i) => `${xS(x)},${yS(ys[i])}`).join(' ');
        return (
          <div key={p.key}>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              width="100%"
              style={{ maxWidth: W, display: 'block', margin: '0 auto' }}
              role="img"
              aria-label={`far coefficient vs ${p.label}, model point and pre-seventeenth 4 reference marked`}
            >
              <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="var(--hairline)" strokeWidth={1} />
              {p.breakX !== null && p.breakX >= xMin && p.breakX <= xMax && (
                <>
                  <line x1={xS(p.breakX)} y1={padT} x2={xS(p.breakX)} y2={padT + cH} stroke="var(--terra-dk)" strokeWidth={1} strokeDasharray="3,3" />
                  <text x={xS(p.breakX)} y={padT - 2} textAnchor="middle" fontFamily="var(--ed-mono)" fontSize="8.5" fill="var(--terra-dk)">s*</text>
                </>
              )}
              <polyline points={points} fill="none" stroke={ED.series1} strokeWidth={1.75} />
              {xs.map((x, i) => (
                <circle key={x} cx={xS(x)} cy={yS(ys[i])} r={p.modelX === x ? 3 : 1.6} fill={p.modelX === x ? ED.series2 : ED.series1} />
              ))}
              <text x={padL} y={padT + cH + 16} fontFamily="var(--ed-mono)" fontSize="9" fill="var(--faint)">{xMin.toFixed(2)}</text>
              <text x={padL + cW} y={padT + cH + 16} textAnchor="end" fontFamily="var(--ed-mono)" fontSize="9" fill="var(--faint)">{xMax.toFixed(2)}</text>
              <text x={2} y={padT + 8} fontFamily="var(--ed-mono)" fontSize="8.5" fill="var(--faint)">{yMax.toFixed(2)}</text>
              <text x={2} y={padT + cH} fontFamily="var(--ed-mono)" fontSize="8.5" fill="var(--faint)">0</text>
            </svg>
            <p style={{ fontSize: 11.5, color: 'var(--faint)', textAlign: 'center', margin: '2px 0 0' }}>
              c<sub>Far</sub> vs {p.label} <span style={{ color: 'var(--accent)' }}>● model point</span>
            </p>
          </div>
        );
      })}
    </div>
  );
}

// imp-95126: signed tornado chart for the imp-95092 four-lever far-ceiling
// elasticity table, ranked by |E_x|: theta > sigma > Q > beta. Bars extend
// left (negative, cFar shrinks) or right (positive, cFar grows) of a center
// zero line. Presentation only; no bound claim.
const IMP95092_SHORT_LABEL = {
  'theta (drives s = sigma + theta)': 'θ',
  sigma: 'σ',
  'isolation Q = (c D^(1-beta)/v) 2^(-(1-beta))': 'Q',
  beta: 'β',
};

function FourLeverElasticityTornadoChart() {
  const rows = [...IMP95092_FOUR_LEVER_FAR_CEILING_ELASTICITY_TABLE.table].sort(
    (a, b) => Math.abs(b.elasticity) - Math.abs(a.elasticity)
  );
  const W = 420;
  const rowH = 34;
  const padL = 40;
  const padR = 56;
  const padT = 10;
  const padB = 10;
  const H = padT + padB + rows.length * rowH;
  const cW = W - padL - padR;
  const cx = padL + cW / 2;
  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.elasticity))) * 1.15;
  const xScale = (cW / 2) / maxAbs;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: W, display: 'block', margin: '0 auto' }}
      role="img"
      aria-label="Signed tornado chart of the four-lever far-ceiling elasticities ranked by magnitude: theta -1.271, sigma -0.944, isolation Q +0.885, beta -0.099"
    >
      <line x1={cx} y1={padT} x2={cx} y2={H - padB} stroke="var(--hairline)" strokeWidth={1} />
      {rows.map((r, i) => {
        const y = padT + i * rowH;
        const barW = Math.abs(r.elasticity) * xScale;
        const neg = r.elasticity < 0;
        const x = neg ? cx - barW : cx;
        const color = neg ? ED.accent : ED.series1;
        return (
          <g key={r.lever}>
            <text x={cx} y={y + 12} textAnchor="middle" fontFamily="var(--ed-mono)" fontSize="11" fill="var(--ink)">
              {IMP95092_SHORT_LABEL[r.lever] || r.lever}
            </text>
            <rect x={x} y={y + 16} width={barW} height={rowH - 22} fill={color} opacity={0.75} rx={2} />
            <text
              x={neg ? x - 6 : x + barW + 6}
              y={y + rowH / 2 + 7}
              textAnchor={neg ? 'end' : 'start'}
              fontFamily="var(--ed-mono)"
              fontSize="10.5"
              fill={color}
            >
              {r.elasticity.toFixed(3)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// imp-95087: three-regime band chart for the imp-95026 paper-packet transfer
// assessment over s = sigma + theta -- BREAKS (exact-proof, sharp boundary
// s* = 2.948383274238082), DEGRADES (low-s corner, ledger margin thin) and
// TRANSFERS (ledger stays below the pre-seventeenth 4, margin widens with s).
// Only the BREAKS boundary is sharp; the degrade-to-full-margin transition is
// continuous, so it is rendered as a gradient rather than a second hard line.
// Presentation only; no bound claim.
function TransferRegimeBandChart() {
  const { breakBoundaryS } = IMP95026_PAPER_PACKET_CEILING_TRANSFER.reference;
  const sStar = breakBoundaryS;
  const rows = IMP95077_FAR_LEDGER_DEGRADE_TABLE.table;
  const sMin = 0;
  const sMax = rows[rows.length - 1].s + 1; // one past the model point s = 11
  const pct = (s) => (100 * (s - sMin)) / (sMax - sMin);

  return (
    <div>
      <div style={{ position: 'relative', height: 40, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--hairline)' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct(sStar)}%`, background: 'var(--terra-dk)' }} />
        <div
          style={{
            position: 'absolute',
            left: `${pct(sStar)}%`,
            top: 0,
            bottom: 0,
            right: 0,
            background: 'linear-gradient(90deg, var(--brass-deco) 0%, var(--series-1) 100%)',
          }}
        />
        {rows.map((r) => (
          <div
            key={r.theta}
            title={`theta=${r.theta}, s=${r.s}: cFar=${r.cFar.toFixed(4)}, ledger=${r.ledgerFactor.toFixed(2)}x`}
            style={{ position: 'absolute', left: `${pct(r.s)}%`, top: 4, bottom: 4, width: 1, background: 'rgba(255,255,255,0.6)' }}
          />
        ))}
      </div>
      <div style={{ position: 'relative', height: 16, fontFamily: 'var(--ed-mono)', fontSize: 10, color: 'var(--faint)' }}>
        <span style={{ position: 'absolute', left: 0 }}>{sMin}</span>
        <span style={{ position: 'absolute', left: `${pct(sStar)}%`, transform: 'translateX(-50%)' }}>s*={sStar.toFixed(3)}</span>
        <span style={{ position: 'absolute', left: `${pct(3)}%`, transform: 'translateX(-50%)' }}>s=3</span>
        <span style={{ position: 'absolute', left: `${pct(11)}%`, transform: 'translateX(-50%)' }}>s=11</span>
        <span style={{ position: 'absolute', right: 0 }}>{sMax}</span>
      </div>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 12, color: 'var(--ink-soft)', margin: '10px 0 0' }}>
        <span><span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--terra-dk)', marginRight: 6, borderRadius: 2 }} />BREAKS (s &lt; s*): exact-substitution proof invalid, falls back to eighteenth-window envelope</span>
        <span><span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--brass-deco)', marginRight: 6, borderRadius: 2 }} />DEGRADES (s near s*): ledger factor ~4.48x at s=3</span>
        <span><span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--series-1)', marginRight: 6, borderRadius: 2 }} />TRANSFERS (s large): ledger factor up to ~14.72x at s=11</span>
      </div>
    </div>
  );
}

// imp-95122: the imp-95096 joint near/far Pareto line beta(alpha) =
// K(0,2)(2 - alpha), with the alpha = 1 bracket-class endpoint (cNear = 2,
// beta = lambda_max) marked and the alpha > 1 out-of-class region (cNear > 2)
// shaded. Assessment visualization only; no bound change.
function JointNearFarParetoChart() {
  const { paretoLine, lambdaMax } = IMP95096_JOINT_NEAR_FAR_VS_LAMBDA_MAX.reference;
  const W = 340;
  const H = 210;
  const padL = 46;
  const padR = 14;
  const padT = 30;
  const padB = 32;
  const cW = W - padL - padR;
  const cH = H - padT - padB;

  const aMin = 1;
  const aMax = 2;
  const yMax = lambdaMax * 1.05;
  const xS = (a) => padL + cW * ((a - aMin) / (aMax - aMin));
  const yS = (b) => padT + cH * (1 - b / yMax);
  const points = paretoLine.map((p) => `${xS(p.alpha)},${yS(p.beta)}`).join(' ');

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: W, display: 'block', margin: '0 auto' }}
      role="img"
      aria-label="Joint near/far Pareto line beta(alpha) = K(0,2)(2-alpha): the alpha=1 in-class endpoint at beta=lambda_max, and the shaded alpha>1 out-of-class region where cNear>2"
    >
      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="var(--hairline)" strokeWidth={1} />
      {/* out-of-class region, alpha > 1 (cNear > 2) */}
      <rect x={xS(aMin)} y={padT} width={cW} height={cH} fill={ED.series2} opacity={0.08} />
      <text x={xS(1.5)} y={padT + 14} textAnchor="middle" fontFamily="var(--ed-mono)" fontSize="9" fill="var(--terra-dk)">
        out-of-class (c&#8345;&#8360;&#8340;&#8342; &gt; 2)
      </text>
      {/* bracket-class boundary at alpha = 1 */}
      <line x1={xS(1)} y1={padT} x2={xS(1)} y2={padT + cH} stroke="var(--terra-dk)" strokeWidth={1.5} strokeDasharray="3,3" />
      <polyline points={points} fill="none" stroke={ED.series1} strokeWidth={1.75} />
      {paretoLine.map((p) => (
        <circle
          key={p.alpha}
          cx={xS(p.alpha)}
          cy={yS(p.beta)}
          r={p.alpha === 1 ? 3.5 : 1.8}
          fill={p.alpha === 1 ? ED.series2 : ED.series1}
        />
      ))}
      <text x={xS(1)} y={padT - 6} textAnchor="middle" fontFamily="var(--ed-mono)" fontSize="9" fill={ED.accent}>
        alpha=1, beta=lambda_max
      </text>
      {/* axis labels */}
      {paretoLine.map((p) => (
        <text key={`a-${p.alpha}`} x={xS(p.alpha)} y={padT + cH + 14} textAnchor="middle" fontFamily="var(--ed-mono)" fontSize="8.5" fill="var(--faint)">
          {p.alpha.toFixed(2)}
        </text>
      ))}
      <text x={padL + cW / 2} y={H - 4} textAnchor="middle" fontFamily="var(--ed-mono)" fontSize="9" fill="var(--faint)">
        alpha (cNear = 2 alpha)
      </text>
      <text x={4} y={padT + 4} fontFamily="var(--ed-mono)" fontSize="8.5" fill="var(--faint)">{yMax.toExponential(2)}</text>
      <text x={4} y={padT + cH} fontFamily="var(--ed-mono)" fontSize="8.5" fill="var(--faint)">0</text>
      <text
        x={-(padT + cH / 2)}
        y={12}
        transform="rotate(-90)"
        textAnchor="middle"
        fontFamily="var(--ed-mono)"
        fontSize="9"
        fill="var(--faint)"
      >
        beta(alpha)
      </text>
    </svg>
  );
}

// imp-95083: schematic (u, v) geometry for the imp-95046 rectangular-slab (4.4)
// hypothesis feeding Theorem 4.5's 0.1399 row — the compact box, the Lemma 4.4
// interpolating wedge it is stated to supply, and the short final join that
// seals the seam to the tail lane (imp-95047). Illustrative only: this diagram
// asserts no new bound and certifies none of the four SLAB_CERTIFICATION_REQUIREMENTS.
function SlabGeometryChart() {
  const W = 460;
  const H = 190;
  const padL = 34;
  const padR = 14;
  const padT = 14;
  const padB = 26;
  const cW = W - padL - padR;
  const cH = H - padT - padB;

  const { yStar } = SLAB_HYPOTHESIS;
  const uMin = 0;
  const uMax = 2.6; // X -> 0, X+1 -> 1, tail lane runs out to ~2.6
  const xU = (u) => padL + cW * ((u - uMin) / (uMax - uMin));
  const yV = (v) => padT + cH * (1 - v); // v in [0, 1]

  const boxX0 = xU(0);
  const boxX1 = xU(1);
  const boxYTop = yV(1);
  const boxYBot = yV(yStar);

  return (
    <>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ maxWidth: W, display: 'block', margin: '0 auto' }}
        role="img"
        aria-label="Schematic (u, v) geometry of the imp-95046 rectangular-slab hypothesis: the compact box [X, X+1] x [y*, 1], the Lemma 4.4 interpolating wedge, and the short final join to the tail lane at u = X+1"
      >
        {/* tail lane, u >= X+1 */}
        <rect x={boxX1} y={boxYTop} width={xU(uMax) - boxX1} height={boxYBot - boxYTop} fill="var(--paper2)" stroke="none" />
        {/* the box [X, X+1] x [y*, 1] */}
        <rect x={boxX0} y={boxYTop} width={boxX1 - boxX0} height={boxYBot - boxYTop} fill={ED.series1} opacity={0.16} stroke={ED.series1} strokeWidth={1.5} />
        {/* Lemma 4.4 wedge: interpolates from the box interior out to u = X+1, narrowing toward v = y* */}
        <polygon
          points={`${xU(0.55)},${boxYTop} ${boxX1},${boxYTop} ${boxX1},${boxYBot} ${xU(0.55)},${boxYBot}`}
          fill={ED.brassDeco}
          opacity={0.22}
        />
        <line x1={xU(0.55)} y1={boxYTop} x2={boxX1} y2={boxYTop} stroke={ED.brassDeco} strokeWidth={1.5} strokeDasharray="4,3" />
        <line x1={xU(0.55)} y1={boxYBot} x2={boxX1} y2={boxYBot} stroke={ED.brassDeco} strokeWidth={1.5} strokeDasharray="4,3" />
        {/* short final join: narrow seam strip right at u = X+1 */}
        <rect x={boxX1 - 3} y={boxYTop} width={xU(1.18) - boxX1 + 3} height={boxYBot - boxYTop} fill={ED.series2} opacity={0.3} />
        {/* y* boundary line, carried across the whole diagram */}
        <line x1={padL} y1={boxYBot} x2={xU(uMax)} y2={boxYBot} stroke="var(--faint)" strokeWidth={1} strokeDasharray="2,3" />
        <text x={padL - 4} y={boxYBot + 3} textAnchor="end" fontFamily="var(--ed-mono)" fontSize="9.5" fill="var(--faint)">y*</text>
        <text x={padL - 4} y={boxYTop + 3} textAnchor="end" fontFamily="var(--ed-mono)" fontSize="9.5" fill="var(--faint)">v=1</text>
        {/* u-axis landmarks */}
        <text x={boxX0} y={boxYBot + 16} textAnchor="middle" fontFamily="var(--ed-mono)" fontSize="9.5" fill="var(--ink-soft)">X</text>
        <text x={boxX1} y={boxYBot + 16} textAnchor="middle" fontFamily="var(--ed-mono)" fontSize="9.5" fill="var(--ink-soft)">X+1</text>
        {/* labels */}
        <text x={xU(0.28)} y={boxYTop - 5} textAnchor="middle" fontFamily="var(--ed-mono)" fontSize="10" fill={ED.series1}>box: H_τ ≠ 0, τ∈[0,t*]</text>
        <text x={xU(0.7)} y={boxYBot + 16} textAnchor="middle" fontFamily="var(--ed-mono)" fontSize="9.5" fill={ED.brass}>Lemma 4.4 wedge → τ=t*</text>
        <text x={xU(1.18)} y={boxYTop - 5} textAnchor="middle" fontFamily="var(--ed-mono)" fontSize="9.5" fill={ED.accent}>short join</text>
        <text x={xU(1.9)} y={(boxYTop + boxYBot) / 2 + 3} textAnchor="middle" fontFamily="var(--ed-mono)" fontSize="10" fill="var(--faint)">tail lane (imp-95047)</text>
      </svg>
      <p style={{ fontSize: 11.5, color: 'var(--faint)', textAlign: 'center', margin: '2px 0 0' }}>
        schematic (u, v) slice — box, wedge, and short join are illustrative only; none of the four
        SLAB_CERTIFICATION_REQUIREMENTS is discharged by this diagram or the frozen spec.
      </p>
    </>
  );
}

export default function PermutationArchitecturePage() {
  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>freeze calculus · Λ ≤ 0.14 is a contract, not a bound</span>} />
      <div className="ed-full" style={{ maxWidth: '60rem', padding: '28px 34px 70px' }}>
        <div className="ed-lbl">architecture</div>
        <h1 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 36, lineHeight: 1.12, margin: '6px 0 12px', color: 'var(--ink)' }}>
          Permutation Architecture &amp; the Freeze Calculus
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          The twin-ladder program organised as a <strong>typed calculus of components</strong> and admissible
          compositions: which rearrangements are equivalent, which create commutator defects, and which destroy
          useful cancellation by taking a modulus too early. It fixes a <strong>conditional contract</strong> for
          the strict sub-0.14 route — reducing the whole route to <em>one</em> explicit open family — and records
          five alternative sufficient gates. This is an architecture and a contract:{' '}
          <strong>it proves neither RH nor a new bound on the de Bruijn–Newman constant Λ.</strong>{' '}
          Platt–Trudgian <InlineMath tex="\Lambda \le 0.2" /> remains the rigorous benchmark.
        </p>

        <div style={{ borderLeft: '3px solid var(--terra-dk)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '16px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>honest status — sieve-algebra universality, Theorem U (2026-09-22)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            {PERM_ARCH_SIEVE_UNIVERSALITY.verdict}
          </p>
        </div>
        <div style={{ borderLeft: '3px solid var(--terra)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '16px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>honest status — imp-95519 localized barrier sum, precise no-go (2026-09-19)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            {IMP95519_LOCALIZED_BARRIER_SUM_NOGO.verdict}
          </p>
        </div>
        <div style={{ borderLeft: '3px solid var(--terra)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '16px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>honest status — imp-95519 zero-side σ_B abscissa dichotomy</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            {PERM_ARCH_SIEVE_UNIVERSALITY.imp95519Caveat}
          </p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '10px 0 0' }}>
            <strong>Update (imp-95564):</strong> {IMP95564_EFFECTIVE_ABSCISSA_AUDIT.netVerdict}
          </p>
        </div>
        <div style={{ borderLeft: '3px solid var(--terra)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '16px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>honest status — imp-95604 mean-square-to-pointwise transfer, closed vs undecided (2026-09-22)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            {IMP95604_MEANSQUARE_POINTWISE_UPGRADE.netVerdict}
          </p>
        </div>

        <div style={{ maxWidth: 460, border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden', margin: '16px 0 4px', background: 'var(--paper)' }}>
          <WireframeAnim kind="gram-matrix" />
        </div>

        {/* Typed component calculus */}
        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 24, margin: '32px 0 6px', color: 'var(--ink)' }}>The typed component calculus</h2>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          Every component is a typed map <InlineMath tex="\mathsf{T}:(\text{state},\text{domain},\text{metric},\text{divisor})\to(\cdots)" />.
          A word is <em>proof-admissible</em> only if it preserves the scalar divisor (or supplies an exact one-way
          characteristic implication) and every commutator, tail, projection and boundary defect fits one
          non-duplicated error ledger. Four status labels are used throughout:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '10px 0 14px' }}>
          {['E', 'A', 'C', 'O'].map((s) => (
            <span key={s} className="ed-mono" style={{ fontSize: 11, color: STATUS_META[s].color, border: `1px solid ${STATUS_META[s].color}`, borderRadius: 4, padding: '2px 8px' }}>{STATUS_META[s].label}</span>
          ))}
        </div>
        <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: 'var(--paper2)', textAlign: 'left', color: 'var(--faint)' }}>
                <th style={{ padding: '8px 12px' }}>Symbol</th><th style={{ padding: '8px 12px' }}>Component</th><th style={{ padding: '8px 12px' }}>Type-changing effect</th><th style={{ padding: '8px 12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {COMPONENTS.map(([sym, name, effect, status]) => (
                <tr key={sym} style={{ borderTop: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                  <td style={{ padding: '7px 12px', fontFamily: 'var(--ed-mono)', color: 'var(--ink)' }}>{sym}</td>
                  <td style={{ padding: '7px 12px' }}>{name}</td>
                  <td style={{ padding: '7px 12px' }}>{effect}</td>
                  <td style={{ padding: '7px 12px' }}><StatusChip s={status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Two no-go principles */}
        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 24, margin: '32px 0 6px', color: 'var(--ink)' }}>Two ordering principles</h2>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          <strong>The modulus barrier.</strong> For complex packets, <InlineMath tex="\left|\sum_j z_j\right| \le \sum_j |z_j|" /> —
          applying a modulus before a correlated sum discards relative phase and is not invertible. So: <em>recombine
          direct/dual packets and shells first; take a modulus last.</em>{' '}
          <strong>The no-gain rule.</strong> An isometric change of coordinates (bicomplex direct sum, unitary twistor
          rotation, exact Fourier transform) preserves norms, spectra and zero multiplicity — so it cannot by itself
          improve a zero-free margin. It helps only when followed by a nontrivial invariant compression, a positivity
          theorem, or a coercive elimination. This is the operator-language form of the program's{' '}
          <Link to="/flow-blindness-no-go">flow-blindness no-go</Link>.
        </p>
        <div style={{ borderLeft: '3px solid var(--terra)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '12px 16px', margin: '10px 0' }}>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
            The permutation defect lemma makes this quantitative: reordering contractions by a permutation π costs at
            most <InlineMath tex="\|T_\pi - T_{\mathrm{id}}\| \le \sum_{(i,j)\in\mathrm{Inv}(\pi)} \|[T_i,T_j]\|" />.
            Commuting pairs are free; the whole architecture reduces to the small set of nonzero commutators and
            irreversible steps.
          </p>
        </div>

        {/* The 0.14 completion contract */}
        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 24, margin: '32px 0 6px', color: 'var(--ink)' }}>The strict Λ ≤ 0.14 completion contract</h2>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          Freeze the exact row at{' '}
          <InlineMath tex="t_0 = \tfrac{24727519}{200000000} = 0.123637595" />,{' '}
          <InlineMath tex="y_0 = 0.1809" />, <InlineMath tex="X = 6.000000185827\times10^{9}" />, so that
        </p>
        <BlockMath tex="\Lambda \le t_0 + \tfrac{y_0^2}{2} = \tfrac{7}{50} = 0.14 \quad\text{(if three zero-free statements hold).}" />
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          The Platt–Trudgian verified height 3000175332800 supplies the first statement, and a project certificate
          closes the rational intermediate box for the third — within its declared replay scope. Everything else (the
          25-defect prime telescope, the exact five-shell identity, a directed gamma atlas of 356,468 cells, the
          carrier remainder, and one positive-width source cell at <InlineMath tex="N=690988" />) is <strong>closed within
          declared scope</strong>. The contract reduces the strict sub-0.14 route to exactly one thing.
        </p>
        <div style={{ borderLeft: '3px solid var(--terra-dk)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '12px 16px', margin: '10px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>provenance gap (recorded 2026-09-02)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
            The source-cell anchor value <span className="ed-mono" style={{ fontSize: 12 }}>|E₉₇| = 0.2141254901198318</span> at{' '}
            <InlineMath tex="x_* = X + \sqrt{1-y_0^2}" /> was produced by the paper's reference-[19] replay
            (<span className="ed-mono" style={{ fontSize: 12 }}>strict_sub014_extension_v1</span>), which has not been
            located in any project repository or workspace. An independent native evaluator built for this program
            reproduces the 400-bit certified window-placement margins digit-for-digit but does not reproduce the anchor
            value under either candidate parameter row — so the value is currently <strong>unreplayable</strong> pending
            recovery of the producing archive (or its conventions), and the real Gate-2 probe stays gated on a genuine
            anchor reproduction. Full diagnosis: <span className="ed-mono" style={{ fontSize: 12 }}>native/gate2-lane-a/README.md</span>.
          </p>
        </div>
        <div style={{ borderLeft: '3px solid var(--green)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '12px 16px', margin: '10px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>status after 2026-09 (contract lane)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
            Since the provenance note above: the archive-free G3 first-window pilot <strong>passed</strong>;
            the window-1 pilot certificate covers 800 of 1,381,977 q-units with 0 failures (window-1
            certification in progress); and the tier-2 certification pricing stands at 21.1 CPU-days
            (a 17.9× reduction over tier-1). Status only — no bound is promoted. Detail:{' '}
            <Link to="/threads" style={{ color: 'var(--brass-dk)' }}>the gate2-contract thread</Link>
            {' · '}<Link to="/frontier-dag" style={{ color: 'var(--brass-dk)' }}>/frontier-dag</Link>.
          </p>
        </div>
        <div style={{ borderLeft: '3px solid var(--brass)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>the one open family — the remaining gap</div>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            A single correlated lower-edge scalar inequality on the range{' '}
            <strong><InlineMath tex="690988 \le N \le 54799999" /></strong>: the global statement{' '}
            <InlineMath tex="|C_{E,17}| < 0.27968819555261474" /> for every window parameter and both sides of every
            seam. A uniform atlas at that width would need more than <InlineMath tex="7.2\times10^{26}" /> cells, so raw
            tiling is not viable — the remaining problem is a uniform correlated enclosure, not more computation.
            Until it is closed, <strong>Λ ≤ 0.14 is a contract, not a promoted bound.</strong>
          </p>
        </div>
        <div style={{ borderLeft: '3px solid var(--ink-soft)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>Gate-2 completion-contract status (imp-95012 frozen spec)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 6px' }}>
            <strong>Closed.</strong> One anchor cell: <InlineMath tex="N = 690988" />,{' '}
            <InlineMath tex="|x - x_*| \le 1/40000000000" />, measured{' '}
            <InlineMath tex="|E_{97}| = 0.2141254901198318 < 0.27968819555261474" /> — a documented reserve of{' '}
            <InlineMath tex="0.0655627054327926" /> against the exact allowance <InlineMath tex="R_{ex}" />.
          </p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 6px' }}>
            <strong>Open.</strong> The same global inequality <InlineMath tex="|C_{E,17}| < 0.27968819555261474" />{' '}
            uniformly over the family <InlineMath tex="690988 \le N \le 54799999" />, every window parameter, and both
            seam sides — the one open family this page's route atlas is aimed at closing.
          </p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            <strong>Offline.</strong> Two named sub-gaps stand between the anchor cell and a family-wide arithmetic
            verdict: <span className="ed-mono" style={{ fontSize: 12 }}>imp-95011-sub-arithmetic-carrier-scan</span>{' '}
            (the true sampled sup and per-unit-N increment L over the family, ~1e3 log-spaced N, both seam sides) and{' '}
            <span className="ed-mono" style={{ fontSize: 12 }}>imp-95014-sub-arb-prec128-lane</span> (an arbitrary-precision
            float-vs-Arb cross-check of the Lane B evaluator). Both are structural demonstrations on a surrogate carrier
            today, not arithmetic measurements of <InlineMath tex="C_{E,17}" />; neither has run. This records status
            only — no bound is promoted, no gap is closed.
          </p>
          <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden', marginTop: 10 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--paper2)', textAlign: 'left', color: 'var(--faint)' }}>
                  <th style={{ padding: '8px 12px' }}>Named heavy-compute ticket</th>
                  <th style={{ padding: '8px 12px' }}>Evaluator requirement</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    'imp-95011-sub-arithmetic-carrier-scan',
                    'Arithmetic C_E,17 over ~1e3 log-spaced N in [690988, 54799999], (N,N+1) and (N,N+2) pairs, both seam sides, ~5 window parameters (~2e4 O(N) evaluations); reports the real per-unit-N increment L and the real sampled sup.',
                  ],
                  [
                    'imp-95014-sub-arb-prec128-lane',
                    'Arb acb interval arithmetic at prec 128 (192-bit spot audits), Gram-form Lane B skeleton, per tmp/verify_ydini_genmoll.c, on a 1-2 percent subsample of the imp-95011 Lane-A evaluations plus the anchor cell; gate is crossCheck < 1e-9.',
                  ],
                ].map(([ticket, req]) => (
                  <tr key={ticket} style={{ borderTop: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                    <td style={{ padding: '7px 12px', fontFamily: 'var(--ed-mono)', fontSize: 11.5, whiteSpace: 'nowrap' }}>{ticket}</td>
                    <td style={{ padding: '7px 12px' }}>{req}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '10px 0 0' }}>
            <strong>BLOCKED-ON-SPEC (imp-95013).</strong> A standalone native Lane-A scanner for the anchor cell above
            is gated on reproducing{' '}
            <InlineMath tex={`|E_{97}|(${ANCHOR_GATE.N}) = ${ANCHOR_GATE.requiredE97Peak}`} /> to double-double
            precision before any scan output is trusted, and cannot be built in-repo today: {MISSING_EVALUATOR_INPUTS.length} arithmetic
            evaluator inputs are absent — {MISSING_EVALUATOR_INPUTS.map((m) => m.key).join(', ')}. Only the structural
            imp-95012 spec is present; no surrogate substitution is made.
          </p>
        </div>

        <div style={{ borderLeft: '3px solid var(--terra-dk)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>Gate-2 oscillation-probe regime map (imp-95011)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            The 18-moment carrier's batching premise hinges on which phase regime it lives in: a stationary-phase
            (smooth, phase <InlineMath tex="\sim\sqrt{N}" />) carrier keeps the per-unit-N increment decades below the
            failure threshold, while an unsmoothed prime-alias comb (raw, phase <InlineMath tex="\sim N" />) blows through
            it. The surrogate scan below shows the two hypotheses straddle the threshold — the decision is genuinely
            open, not pre-settled.
          </p>
          <OscillationRegimeMapChart />
        </div>

        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          The decisive analytic object is <strong>one noncommuting weld</strong>: the Fresnel/B-transform and a prime
          projection do not commute, <InlineMath tex="[\mathcal{B}_v,\Pi_p]\neq 0" />. The nonzero aliases are shifted
          Fresnel–Airy transition packets whose correlated sum must stay coupled through the five shells or the 25
          defects — that commutator, not the already-paired smooth interior, is where the route lives.
        </p>
        <div style={{ borderLeft: '3px solid var(--brass)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>alias-packet coupling — quantitative structure</div>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            Each nonzero alias contributes a Fresnel–Airy transition packet with amplitude set by two exact scales: the
            prime-comb weight <InlineMath tex="w(h)" /> at frequency <InlineMath tex="h/p" /> and the phase curvature{' '}
            <InlineMath tex="\lambda" /> of the shifted stationary point <InlineMath tex="u = v/(k - h/p)" />. Away from
            curvature degeneracy each packet obeys the stationary-phase bound{' '}
            <InlineMath tex="|I_h| \le C\, w(h)\, \lambda^{-1/2}" />; where two stationary points coalesce (near the fold)
            it passes through the Airy regime <InlineMath tex="|I_h| \le C\, w(h)\, \lambda^{-1/3}" />. Because the five
            shells carry Fourier-disjoint supports (the exact five-shell identity), cross-shell products drop out of the
            correlated sum, so the coupling collapses to an intra-shell <InlineMath tex="\ell^2" /> sum over{' '}
            <InlineMath tex="h" />, repeated across the five shells and 25 defects — not the <InlineMath tex="\ell^1" />{' '}
            termwise sum, which is too coarse to fit the 0.0655627 reserve.
          </p>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '10px 0 0' }}>
            <strong>Named sub-gap:</strong> the one quantity still un-enclosed is the uniform aliased second moment{' '}
            <InlineMath tex="\sum_{h\neq 0} w(h)^2\, \lambda(h)^{-2/3}" /> (Airy-regime majorant), bounded uniformly over{' '}
            <InlineMath tex="690988 \le N \le 54799999" /> and both seam sides. A uniform bound on that single scalar
            closes the correlated coupling; without it the weld <InlineMath tex="[\mathcal{B}_v,\Pi_p]\neq 0" /> stays
            open. No bound is promoted.
          </p>
        </div>

        <div style={{ borderLeft: '3px solid var(--brass)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>assessment — the single van der Corput / stationary-phase majorant is refuted (imp-95006)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            The tempting non-tiling route is a <em>single</em> uniform second-derivative (van der Corput) or
            stationary-phase majorant of the shifted Fresnel–Airy alias packets across the whole window
            <InlineMath tex="\,690988 \le N \le 54799999" />. The reserve is tight: the measured correlated peak of
            <InlineMath tex="\,|C_{E,17}|" /> sits at <InlineMath tex="\approx 0.2141255" />, leaving only
            <InlineMath tex="\,0.0655627 = 0.27968819555261474 - 0.2141255\," /> of enclosure budget to the strict target.
          </p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            <strong>Obstruction.</strong> After the stationary-phase reduction, a van der Corput bound is an
            <em> amplitude</em> majorant: it dominates each packet by its envelope mass and then triangle-sums across
            the five shells, giving an enclosure width no smaller than
            <InlineMath tex="\,\sum_g \lVert Z_g\rVert_1 - |C_{E,17}|" />. But the value <InlineMath tex="\approx 0.2141" />
            is achieved through inter-shell phase cancellation (the five-shell identity, the anti-Hermitian complement),
            so the discarded cancellation mass is <em>positive and non-small</em> — the same structural loss that makes
            raw tiling diverge. A shell-decoupled majorant therefore cannot fit the <InlineMath tex="0.0655627" />
            reserve; it reproduces the divergence it was meant to avoid. <strong>Named sub-gap:</strong> a uniform
            enclosure must retain the correlated phase <em>across</em> shells rather than majorize per shell — either
            through the noncommuting weld <InlineMath tex="[\mathcal{B}_v,\Pi_p]" /> (bound the correlated alias coupling
            directly, imp-95008) or through a <em>coercive</em> quadratic form on the five-shell sum (the physical-bulk /
            cubic-canonical gates, imp-95007), not an envelope bound. This does not promote Λ ≤ 0.14; it closes the
            single-majorant family as a rigorous obstruction and routes the reserve to the correlated-phase gates.
          </p>
        </div>

        <div style={{ borderLeft: '3px solid var(--brass)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>conditional alias-coupling reduction (imp-95008)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            Two unconditional lemmas structure the weld. First, the exact alias decomposition: with{' '}
            <InlineMath tex="\Pi_p = \tfrac1p\sum_{h=0}^{p-1} M_h" /> the arithmetic-progression comb, every linear
            operator satisfies <InlineMath tex="[\mathcal{B},\Pi_p] = \tfrac1p\sum_{h\neq 0}[\mathcal{B},M_h]" /> —
            the h = 0 component contributes zero commutator defect identically, so "the smooth interior pairs exactly"
            is an operator identity, not an estimate. Second, a bounded-overlap collapse: alias images whose supports
            (in any one orthonormal picture) have overlap multiplicity K obey{' '}
            <InlineMath tex="\|\sum_h a_h\|^2 \le K \sum_h \|a_h\|^2" />, an exact Pythagorean equality at K = 1.
            Applied to the doubly-indexed family <InlineMath tex="[\mathcal{B},M_h]f_g" /> this collapses the
            five-shell correlated weld to <em>single-shell</em> packet masses times the one constant K, and with the
            packet majorant above it gives{' '}
            <InlineMath tex="\|[\mathcal{B},\Pi_p]f\|^2 \le C^2 K \big[\textstyle\sum_{h\neq0} w(h)^2\lambda(h)^{-2/3}\big]\,\|f\|^2" />{' '}
            — the named sub-gap scalar is the exact quadratic controller of the weld. In the equidistributed regime of
            the equal-weight prime comb the route improves on the ℓ¹ triangle sum by{' '}
            <InlineMath tex="\sqrt{(p-1)/K}" /> (≈ 9.8 at p = 97, K = 1); with K ≥ 2 and mass concentrated on one
            alias it can lose to ℓ¹.
          </p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            <strong>Precision on the earlier ℓ² claim:</strong> the proved Fourier-disjointness covers the shell index
            g only; the ℓ² collapse over the alias index h additionally requires alias-support disjointness, which
            fails exactly where adjacent stationary points <InlineMath tex="u = v/(k - h/p)" /> coalesce — the Airy
            fold. <strong>Open residuals:</strong> the fold-overlap multiplicity K, the named scalar itself (uniform
            over the window and both seam sides), and the passage from this ℓ² weld bound to the pointwise scalar{' '}
            <InlineMath tex="|C_{E,17}|" /> (shells are evaluated at a point, so a duality step with its own constant
            is still required). Cross-checked on a finite Fresnel model in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95008-weld-alias-l2-collapse.js</code>.
            This promotes no bound.
          </p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '10px 0 0' }}>
            <strong>Follow-up — the fold geometry is inverted (unconditional):</strong> the shifted denominators{' '}
            <InlineMath tex="k - h/p" /> form an exactly <InlineMath tex="(1/p)" />-separated set with{' '}
            <InlineMath tex="|k - h/p| \ge 1/p" /> (a curvature floor, so no single Airy packet amplitude exceeds{' '}
            <InlineMath tex="C\,w(h)\,p^{1/3}" />), and the stationary-point spacing{' '}
            <InlineMath tex="|u - u'| = v|d - d'|/(dd')" /> <em>grows</em> toward the curvature floor. Adjacent-alias
            supports therefore become disjoint at the fold end (provably so in the fold-most dyadic block at p = 97);
            overlap accrues only at the high-curvature end, with the per-block bracket{' '}
            <InlineMath tex="K(\Delta) \le 1 + \lfloor 8cp\,\Delta^{2-\beta}/v \rfloor" />. Under the quadratic-Fresnel
            curvature normalization <InlineMath tex="\lambda = |k - h/p|" />, the named scalar has the N-free
            worst-case-curvature majorant{' '}
            <InlineMath tex="2p^{-4/3}\textstyle\sum_{j \le (p-1)/2} j^{-2/3} \approx 0.03811" /> at p = 97 (the
            floor-only cap is 0.21540), so the window-uniformity demand reduces to one normalization constant in the
            separable case. The paper-phase normalization, the packet-width constants, and the ℓ²-to-pointwise step
            remain open. Cross-checked in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95008-alias-separation-curvature-floor.js</code>.
            This promotes no bound.
          </p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '10px 0 0' }}>
            <strong>Follow-up — the ℓ²-to-pointwise duality step has an exact constant (unconditional):</strong> for any
            finite orthonormal system, <InlineMath tex="\sup\{|v(x)| : v \in H_W,\ \|v\| \le 1\} = \sqrt{K_W(x,x)}" />{' '}
            with <InlineMath tex="K_W(x,x) = \sum_{i \in W} |\varphi_i(x)|^2" /> the diagonal reproducing kernel (an
            inverse Christoffel function), attained at the normalized kernel — so no better generic duality step exists.
            In the DFT picture <InlineMath tex="K_W(n,n) = |W|/L \le 1" /> at <em>every</em> point (the seam-side /
            window quantifier is exact and free at this step), and the coordinate picture gives constant exactly 1 with
            no hypothesis; by the trace identity the average of <InlineMath tex="K_W(x,x)" /> is{' '}
            <InlineMath tex="|W|/L" /> in every orthonormal picture. Chained with the conditional closed form above, the
            strict open-family target holds iff the residual constant product{' '}
            <InlineMath tex="Q = \sqrt{K_W(x,x)}\, C \sqrt{K}\, \|f\|" /> stays below{' '}
            <InlineMath tex="0.27968\ldots/\sqrt{\bar S} \approx 1.4327" /> — strictly above 1, so the pointwise step is
            not the binding constraint. (1.4327 is the canonical value of{' '}
            <InlineMath tex="R_{ex}/\sqrt{\bar S}" /> at <InlineMath tex="R_{ex} = 0.27968819555261474" /> and{' '}
            <InlineMath tex="\sqrt{\bar S} = 0.19522203" />; an earlier ticket draft quoted 1.39930, which is not
            reproducible from these inputs — see the imp-95556 reconciliation in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95519-localized-barrier-sum-prime-zero-nogo.js</code>.)
            What remains of the former duality residual is finite: identifying{' '}
            <InlineMath tex="C_{E,17}" /> as a weld evaluation in a specific orthonormal picture with explicit
            normalization, and the Christoffel diagonal of the 18-mode carrier system at the seam points (18 numbers per
            point). At unit constants the ℓ¹ pointwise route caps at 1.7977 (above the target); the ℓ²+duality route
            caps at <InlineMath tex="\sqrt{\bar S} \approx 0.1952" />. Cross-checked in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95008-evaluation-christoffel-duality.js</code>.
            This promotes no bound.
          </p>
        </div>

        <div style={{ borderLeft: '3px solid var(--brass)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>far-bracket ceiling ledger (imp-95008, reference θ = 10)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            Three ceiling-side moves reduce the far coefficient <InlineMath tex="c_{\text{Far}}" /> from the
            starting value 4, floors left untouched at every step:
          </p>
          <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--paper2)', textAlign: 'left', color: 'var(--faint)' }}>
                  <th style={{ padding: '8px 12px' }}>Move</th><th style={{ padding: '8px 12px' }}>From</th><th style={{ padding: '8px 12px' }}>To</th><th style={{ padding: '8px 12px' }}>Factor</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['seventeenth (exponent-split)', '4', '2.9469476400572421', '1.3573366372815172'],
                  ['eighteenth (width-pinned three-window)', '2.9469476400572421', '0.7741509917026236', '3.8066832848407173'],
                  ['nineteenth (exact-pair correlation)', '0.7741509917026236', '0.2717408057586117', '2.8488580857094559'],
                ].map(([move, from, to, factor]) => (
                  <tr key={move} style={{ borderTop: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                    <td style={{ padding: '7px 12px', color: 'var(--ink)' }}>{move}</td>
                    <td style={{ padding: '7px 12px', fontFamily: 'var(--ed-mono)', fontSize: 11.5 }}>{from}</td>
                    <td style={{ padding: '7px 12px', fontFamily: 'var(--ed-mono)', fontSize: 11.5 }}>{to}</td>
                    <td style={{ padding: '7px 12px', fontFamily: 'var(--ed-mono)', fontSize: 11.5 }}>{factor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '8px 0 0' }}>
            The three factors compose to <InlineMath tex="4/0.2717408057586117 = 14.719909248937805" />. The
            headline θ = 10 gap moves 8.001968970787363 → 2.8088338309749887 and the fixed-97 gap moves
            642.1998717107592 → 225.42360917596611. Floors are unchanged by these moves; ceiling optimality is
            not claimed — the outer parity factor 2 and the tightness of the substitution point remain as named
            open slack. Cross-checked in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95008-exact-pair-correlation-ceiling.js</code>.
            This promotes no bound.
          </p>
        </div>

        <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>ceiling-vs-floor gap meter (imp-95008, floors untouched)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            Each bar shows the current ceiling/floor gap as a fraction of the seventeenth-continuation starting
            gap (8.001968970787363× / 642.1998717107592×). Only the ceiling side has moved; the witness floors
            are unchanged throughout.
          </p>
          {[
            ['headline θ = 10', '8.001968970787363', '2.8064020394026787', 35.0714],
            ['fixed-97', '642.1998717107592', '225.22844518052122', 35.0714],
          ].map(([label, start, current, pct]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '5px 0' }}>
              <span className="ed-mono" style={{ fontSize: 11, width: 92, color: 'var(--ink-soft)' }}>{label}</span>
              <div style={{ flex: 1, background: 'var(--paper2)', borderRadius: 3, height: 10, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: 'var(--brass)' }} />
              </div>
              <span className="ed-mono" style={{ fontSize: 10.5, width: 210, textAlign: 'right', color: 'var(--ink-soft)' }}>
                {start}× → {current}×
              </span>
            </div>
          ))}
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '8px 0 0' }}>
            Both gaps have shrunk by the identical factor 2.851327× since the seventeenth-continuation baseline,
            because the same three composed ceiling-side moves (seventeenth through twenty-second continuations)
            apply to both the headline and fixed-97 tracking. No bound is promoted; Platt–Trudgian Λ ≤ 0.2 remains
            SOTA.
          </p>
        </div>

        <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>per-pair envelope bound ψ(T): three treatments (imp-95038, θ = 10)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            The same three ceiling-side moves plotted as curves (log-log, fixed width ratio ρ = ρ<sub>cap</sub>(2) =
            2<sup>-1/3</sup>) rather than as a single point at the dominant corner. All three envelopes decay in
            separation T; the exact closed form (red) sits strictly below the three-window envelope (blue), which
            sits strictly below the two-window envelope (gold), at every plotted T ≥ V(0,2).
          </p>
          <EnvelopeComparisonChart />
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '8px 0 0' }}>
            The gap between the curves widens with T: the two older treatments carry the window/Cauchy-Schwarz
            T<sup>1/2-s</sup> asymptotics, while the exact form carries the true T<sup>-s</sup> decay, so the
            ceiling tightening compounds away from the corner. Floors are unchanged by this comparison; the plot
            does not assert optimality of the exact envelope. Cross-checked in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95038-envelope-treatment-comparison.js</code>.
          </p>
        </div>

        <div style={{ borderLeft: '3px solid var(--terra-dk)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>status — far-bracket ceiling (imp-95008)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            Within the MAJ(σ, θ) envelope class, the per-pair correlation bound at the substituted point is now
            exact (zero inequality slack survives Lemmas CC/RM/PF) — but that is sharpness of one envelope
            treatment, not a claim that the MAJ class itself is optimal. The headline θ = 10 far-bracket gap
            still stands at 2.8088338309749887× (floor 0.096745062937484763 vs ceiling 0.2717408057586117),
            and the packet-envelope constants (c, β, σ, θ, A_d) have not been transferred from this model family
            to the PAPER's packets. Also open: the curvature ceiling D retained by the window, the paper phase
            curvature normalization, and residual (c) — the ℓ²-weld-bound to pointwise |C<sub>E,17</sub>| passage.
            No bound is promoted; Platt–Trudgian Λ ≤ 0.2 remains SOTA.
          </p>
        </div>

        <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>continuation chain map: thirteenth–nineteenth (imp-95008)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            Each row executes one named lever left open by the previous row, alternating floor-side (widening the
            witness lower bound) and ceiling-side (tightening the achieved upper bound) moves:
          </p>
          <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: 'var(--paper2)', textAlign: 'left', color: 'var(--faint)' }}>
                  <th style={{ padding: '8px 10px' }}>#</th><th style={{ padding: '8px 10px' }}>Module</th><th style={{ padding: '8px 10px' }}>Lever</th><th style={{ padding: '8px 10px' }}>Side</th><th style={{ padding: '8px 10px' }}>Surviving residual</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['13th', 'multirate-witness-floor', 'per-packet rates (Theorem R/Lemma S)', 'floor', 'multi-rate Theorem N antennas untested'],
                  ['14th', 'multirate-antenna-ceiling', 'multi-rate antenna calculus (Theorem T/U/W)', 'ceiling', 'occupied-block packets not covered'],
                  ['15th', 'occupied-block-append-floor', 'occupied-block single append (Theorem Z/P)', 'floor + ceiling', 'factor-15 ladder certification slack'],
                  ['16th', 'corner-cancellation-envelope', 'cancellation-aware corner envelope (Lemmas Q1-Q3/Theorem Q)', 'ceiling', 'exact parabola bound is the remaining append-lever certificate'],
                  ['17th', 'exponent-split-far-ceiling', 'parametric exponent split (Lemma T-STAR/Theorem Y-STAR)', 'ceiling', 'outer parity factor 2; Lemma T constant tightness'],
                  ['18th', 'width-pinned-three-window-ceiling', 'grid-pinned width ratio + three-window interpolation (Lemma RHO/3W)', 'ceiling', 'parity factor 2; ~2.85x corner slack; asymptotic half-exponent'],
                  ['19th', 'exact-pair-correlation-ceiling', 'exact closed-form pair correlation (Lemma CC/RM/PF)', 'ceiling', 'parity factor 2 (now dominant); substitution-point tightness'],
                ].map(([n, mod, lever, side, residual]) => (
                  <tr key={n} style={{ borderTop: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                    <td style={{ padding: '6px 10px', color: 'var(--ink)' }}>{n}</td>
                    <td style={{ padding: '6px 10px', fontFamily: 'var(--ed-mono)', fontSize: 10.5 }}>{mod}</td>
                    <td style={{ padding: '6px 10px' }}>{lever}</td>
                    <td style={{ padding: '6px 10px' }}>{side}</td>
                    <td style={{ padding: '6px 10px' }}>{residual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '8px 0 0' }}>
            Module file names are prefixed <code className="ed-mono" style={{ fontSize: 11 }}>src/data/imp-95008-</code>
            and suffixed <code className="ed-mono" style={{ fontSize: 11 }}>.js</code>. No row promotes a bound;
            Platt–Trudgian Λ ≤ 0.2 remains SOTA throughout.
          </p>
        </div>

        <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>Theorem P ladder-cell efficiency: fifteenth vs sixteenth continuation (imp-95008)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            Cell count needed to certify a given append-gain bound, naive (fifteenth continuation, Theorem Z/P)
            versus pair-cancellation-aware (sixteenth continuation, Lemmas Q1-Q3/Theorem Q):
          </p>
          <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: 'var(--paper2)', textAlign: 'left', color: 'var(--faint)' }}>
                  <th style={{ padding: '8px 10px' }}>Continuation</th><th style={{ padding: '8px 10px' }}>Envelope</th><th style={{ padding: '8px 10px' }}>Certified bound</th><th style={{ padding: '8px 10px' }}>Cells needed</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['15th', 'naive (independent cells)', '6e-4', '10,353,470'],
                  ['16th', 'paired (cancellation-aware)', '6e-4', '40,628'],
                  ['16th', 'paired (cancellation-aware), terminal', '4.13e-5', '189,614'],
                ].map(([n, envelope, bound, cells]) => (
                  <tr key={`${n}-${bound}`} style={{ borderTop: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                    <td style={{ padding: '6px 10px', color: 'var(--ink)' }}>{n}</td>
                    <td style={{ padding: '6px 10px' }}>{envelope}</td>
                    <td style={{ padding: '6px 10px', fontFamily: 'var(--ed-mono)' }}>{bound}</td>
                    <td style={{ padding: '6px 10px', fontFamily: 'var(--ed-mono)', textAlign: 'right' }}>{cells}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '8px 0 0' }}>
            At the same 6e-4 tolerance, pairing cancels enough to certify with 255x fewer cells (40,628 vs
            10,353,470). Pushed to its terminal bound 4.13e-5 — 14.53x tighter than 6e-4 — the paired envelope
            still only needs 189,614 cells: 55x fewer than the naive envelope needed for the looser 6e-4 bound.
            Sourced from{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95008-occupied-block-append-floor.js</code>{' '}
            and <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95008-corner-cancellation-envelope.js</code>.
            No bound is promoted; Platt–Trudgian Λ ≤ 0.2 remains SOTA.
          </p>
        </div>

        <div style={{ borderLeft: '3px solid var(--brass)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>twentieth–twenty-second continuations (imp-95008): per-pair closure, proof-domain widen, aggregation lever</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            The nineteenth continuation left the non-parity residual bundled into three named slacks: (b1) per-pair
            corner-substitution tightness, (b2) intra-class block-mass AM-GM routing, and (b3) sup<sub>b</sub>{' '}
            routing of Ω. Three follow-on moves resolve them:
          </p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            <strong>Twentieth (Theorem CA + Lemma EQ):</strong> proves the Lemma X separation floor V(b, j) is the
            exact infimum of the pair separation over each cell, attained in closure at the same corner where the
            Lemma RHO width-ratio cap binds — so (b1) CLOSES with zero slack: no per-pair ceiling improvement exists
            in the continuous family. Corollary R2 quantifies (without applying) a fixed-97 grid-only slack: the
            dominant cell's exhaustive-enumeration sup is 0.8258474234948617× the substituted envelope. Cross-checked
            in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95008-substitution-corner-attainment.js</code>.
          </p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            <strong>Twenty-first (Lemma RM-D):</strong> relaxes the nineteenth width-ratio monotonicity guard to the
            range Theorem Y-EXACT actually needs, dropping the exact-proof break boundary from{' '}
            s* = 2.9483832742380818 to s** = 2.4095981617415205 — a proof-domain widening, not a numeric ledger
            change; the likely-paper point s = 3 gains a 14.73× larger margin (0.0239 → 0.3513). Cross-checked in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95008-rm-domain-refined-low-s-extension.js</code>.
          </p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            <strong>Twenty-second (Lemma SW + Theorem Y-PERRON):</strong> replaces the unweighted sup-row-sum
            aggregation pullout with a weighted-Schur aggregation certified by a machine-precision Rayleigh
            (λ<sub>max</sub>) sandwich of width 2.3e-16, executing and consuming (b2)+(b3) — measured gain
            1.0008665157515448× (0.0866%). This is the first move in the chain that moves the tracked far ceiling:
            0.2717408057586117 → 0.27150554192989773, headline θ = 10 gap 2.8088338309749887× → 2.8064020394026787×,
            fixed-97 gap 225.42360917596611× → 225.22844518052122×; floors untouched. The surviving residual
            1.4032010197013394 is pinned to the witness-side E-realization step (named sub-gap
            imp-95008-subgap-witness-Erealization-split). Cross-checked in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95008-perron-weighted-far-routing.js</code>.
            No bound is promoted; Platt–Trudgian Λ ≤ 0.2 remains SOTA.
          </p>
        </div>

        <div style={{ borderLeft: '3px solid var(--terra-dk)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>status — surviving residual after (b2)+(b3) closure (imp-95008)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            Of the three non-parity slacks named after the nineteenth continuation, (b1) CLOSED at the twentieth move
            (Theorem CA + Lemma EQ, zero slack) and (b2)+(b3) CLOSED together at the twenty-second move (Lemma SW +
            Theorem Y-PERRON, weighted-Schur aggregation certified to machine precision). No named non-parity slack
            remains open on the aggregation side. The one surviving residual on the witness side is the
            E-realization step, sized at 1.4032010197013394× (named sub-gap
            imp-95008-subgap-witness-Erealization-split) — this is not shrunk by any of the twentieth–twenty-second
            moves and is the binding obstruction to closing the far-bracket gap further within this envelope family.
            No bound is promoted; Platt–Trudgian Λ ≤ 0.2 remains SOTA.
          </p>
        </div>

        <div style={{ borderLeft: '3px solid var(--terra-dk)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>status — E-realization split refines the residual into two coupled channels (imp-95008, twenty-third continuation)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            The twenty-third continuation (Lemmas ES + PB, Theorem ER) executes the E-realization sub-gap and
            factors the surviving residual 1.4032010197013394 exactly by parity channel:
            r = 1 / (2 × attainment × occupancy × parity-balance), with per-pair envelope attainment
            0.6014409758412518, occupancy 0.6163838457278105, and parity balance measured near-exhausted at
            0.9611824921094692. Each factor is certified below 1 conditional on MAJ(σ, θ) (envelope caps,
            the Lemma SW quadratic-form bound, and Cauchy–Schwarz respectively), so no factor hides
            compensation. The residual now lives in exactly two COUPLED channels — per-pair envelope
            attainment and occupancy — with the aggregation and parity-balance levers closed or
            near-exhausted. The surviving open question is named
            imp-95008-subgap-attainment-occupancy-tradeoff: prove or refute a bound
            attainment × occupancy ≤ γ &lt; 1 over MAJ witnesses, or exhibit a witness family driving the
            product to 1. Cross-checked in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95008-witness-erealization-split.js</code>.
            No bound is promoted; Platt–Trudgian Λ ≤ 0.2 remains SOTA.
          </p>
        </div>

        <div style={{ borderLeft: '3px solid var(--terra-dk)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>status — paper-packet transfer of the far-ceiling ledger (imp-95026)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            imp-95026 derives how the far coefficient depends on the packet constants (σ, θ, β, and the
            isolation constant Q) and scans a neighborhood of the model point — it does <strong>not</strong> instantiate
            the actual Section 4.5 packet definition, which is not pinned in this repository. What the scan shows: the
            amplitude A<sub>d</sub> cancels out of the ledger entirely; the ledger stays below the pre-seventeenth 4
            everywhere scanned (worst point 0.8924623374689161 at θ = 2); it degrades roughly 3× at low θ (θ ≈ 2 →
            ceiling ≈ 0.89 instead of 0.2717408057586117); and the nineteenth-continuation exact-substitution proof
            itself breaks below the sharp threshold σ + θ = 2.948383274238082, falling back to the eighteenth-window
            envelope. This is a <strong>sensitivity map</strong> over plausible paper constants, not a single
            instantiated paper-packet number — the remaining step is reading (σ, θ, β, c, v, D) off the paper text.
            No bound is promoted; Platt–Trudgian Λ ≤ 0.2 remains SOTA. This same "paper Section 4.5 packet constants
            unpinned" sub-gap is inherited and restated verbatim by imp-95075, imp-95092, imp-95093, imp-95097, and
            imp-95100 below — it is one shared residual, counted once here, not once per restating module.
          </p>
        </div>

        <div style={{ margin: '20px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>four-lever sensitivity map (imp-95078, from imp-95026)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            The imp-95026 theta/sigma/beta/isolation-Q scans of the far coefficient c<sub>Far</sub>, plotted against
            each lever with the model point marked (red dot). The θ panel additionally marks the sharp exact-proof
            break line s* = 2.948383274238082 (as θ* = s* − σ = 1.948 at the model σ = 1) — the nineteenth-continuation
            substitution proof needs σ + θ above this line.
          </p>
          <FarCeilingLeverScanChart />
        </div>

        <div style={{ margin: '20px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>signed tornado chart — four-lever elasticity ranking (imp-95126, from imp-95092)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            The same four levers on one dimensionless elasticity <InlineMath tex="E_x = (\partial c_{\text{Far}}/\partial x)(x_0/c_{\text{Far},0})" />,
            ranked by |E<sub>x</sub>|: θ (−1.271) &gt; σ (−0.944) &gt; Q (+0.885) &gt; β (−0.099). Bars run left of the
            zero line where c<sub>Far</sub> <strong>shrinks</strong> with the lever (θ, σ, β) and right where it{' '}
            <strong>grows</strong> (the isolation constant Q). θ is the strongest transfer-risk lever, amplified by
            the large model θ = 10; σ and Q are comparable; β is an order of magnitude weaker.
          </p>
          <FourLeverElasticityTornadoChart />
        </div>

        <div style={{ margin: '20px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>far-ledger degrade scan (imp-95077, σ = 1, θ = 2..10)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            A row-by-row sensitivity scan of the far coefficient <InlineMath tex="c_{\text{Far}}" /> and the ledger
            factor <InlineMath tex="4/c_{\text{Far}}" /> over every integer θ in the imp-95026 low-θ neighborhood,
            distinct from the reference θ = 10 ledger above.
          </p>
          <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--paper2)', textAlign: 'left', color: 'var(--faint)' }}>
                  <th style={{ padding: '8px 12px' }}>θ</th>
                  <th style={{ padding: '8px 12px' }}>s = σ+θ</th>
                  <th style={{ padding: '8px 12px' }}>c<sub>Far</sub></th>
                  <th style={{ padding: '8px 12px' }}>4/c<sub>Far</sub></th>
                </tr>
              </thead>
              <tbody>
                {IMP95077_FAR_LEDGER_DEGRADE_TABLE.table.map((row) => (
                  <tr key={row.theta} style={{ borderTop: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                    <td style={{ padding: '7px 12px', color: 'var(--ink)' }}>{row.theta}</td>
                    <td style={{ padding: '7px 12px', fontFamily: 'var(--ed-mono)', fontSize: 11.5 }}>{row.s}</td>
                    <td style={{ padding: '7px 12px', fontFamily: 'var(--ed-mono)', fontSize: 11.5 }}>{row.cFar.toFixed(4)}</td>
                    <td style={{ padding: '7px 12px', fontFamily: 'var(--ed-mono)', fontSize: 11.5 }}>{row.ledgerFactor.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '8px 0 0' }}>
            c<sub>Far</sub> falls monotonically (0.8925 → 0.2717) and the ledger factor rises monotonically
            (4.482 → 14.720) across this range — a 3.284× span, quantifying the imp-95026 Finding 3 "~3× margin
            shrink at low θ". Every row still clears the pre-seventeenth 4 (worst row θ = 2 beats it by 4.48×).
            Sensitivity scan over an unpinned θ, not an instantiated paper number; promotes no bound; NO QED.
            Cross-checked in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95077-far-ledger-degrade-table.js</code>.
          </p>
        </div>

        <div style={{ margin: '20px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>transfer-regime bands over s = σ+θ (imp-95087, from imp-95026/95077)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            The imp-95026 transfer assessment resolves into three regimes over the decay exponent s = σ+θ: below the
            sharp threshold s* = 2.948383274238082 the nineteenth-continuation exact-substitution proof BREAKS
            (falls back to the eighteenth-window envelope); above s* the ledger TRANSFERS — it stays below the
            pre-seventeenth 4 everywhere scanned — but DEGRADES near the boundary, recovering its full margin only
            as s grows. Only the BREAKS boundary is sharp; the degrade-to-full-margin transition is continuous, so
            it is shown as a gradient rather than a second hard line. Tick marks mark every scanned integer θ from
            imp-95077 (hover for cFar and ledger factor).
          </p>
          <TransferRegimeBandChart />
        </div>

        <div style={{ margin: '20px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>even/odd block kernel heatmap (imp-95101, reference θ = 10)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            The imp-95008 Lemma SW aggregation constant λ<sub>max</sub> is the Perron eigenvalue of the symmetric
            even-class block kernel <InlineMath tex="K(b,b') = \mathrm{env}_E(\min(b,b'),\,|b-b'|)" />, <InlineMath tex="K(b,b)=0" />.
            To machine precision it is captured by the leading 3×3 submatrix on blocks {'{0, 2, 4}'} (imp-95098):
          </p>
          <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, padding: 14, overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ width: 44 }} />
                    {[0, 2, 4].map((bp) => (
                      <th key={bp} className="ed-mono" style={{ fontSize: 11, color: 'var(--faint)', padding: '4px 10px', fontWeight: 400 }}>b'={bp}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[0, 2, 4].map((b) => (
                    <tr key={b}>
                      <th className="ed-mono" style={{ fontSize: 11, color: 'var(--faint)', padding: '4px 10px', textAlign: 'right', fontWeight: 400 }}>b={b}</th>
                      {[0, 2, 4].map((bp) => {
                        const val = KERNEL_ENTRIES[`${b},${bp}`];
                        const isDominant = (b === 0 && bp === 2) || (b === 2 && bp === 0);
                        const c = kernelCellColor(val);
                        return (
                          <td key={bp} style={{ padding: 0 }}>
                            <div
                              className="ed-mono"
                              title={val ? `K(${b},${bp}) = ${val}` : `K(${b},${bp}) = 0 (diagonal)`}
                              style={{
                                width: 88, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 10.5, color: val ? (c.t > 0.45 ? 'var(--paper)' : 'var(--ink)') : 'var(--faint)',
                                background: val ? c.bg : 'var(--paper2)',
                                border: isDominant ? '2px solid var(--terra-dk)' : '1px solid var(--hairline)',
                                boxSizing: 'border-box',
                              }}
                            >
                              {val ? val.toExponential(2) : '0'}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ minWidth: 230 }}>
              <div className="ed-lbl" style={{ marginBottom: 6, fontSize: 11 }}>near-Perron weight profile</div>
              {WEIGHT_PROFILE.map(([b, share]) => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '5px 0' }}>
                  <span className="ed-mono" style={{ fontSize: 11, width: 42, color: 'var(--ink-soft)' }}>b={b}</span>
                  <div style={{ flex: 1, background: 'var(--paper2)', borderRadius: 3, height: 10, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.max(share * 100, 0.6)}%`, height: '100%', background: 'var(--terra-dk)' }} />
                  </div>
                  <span className="ed-mono" style={{ fontSize: 10.5, width: 78, textAlign: 'right', color: 'var(--ink-soft)' }}>{(share * 100).toPrecision(3)}%</span>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '8px 0 0' }}>
            The eigenvector at λ<sub>max</sub> = 3.9197935113802585e-5 splits weight essentially evenly between
            blocks 0 and 2 (49.9999623% / 49.9999998%), with block 4 carrying only 3.79×10⁻⁵ percent — the
            Perron vector is, to nine significant figures, the symmetric mode of the dominant (0, 2) bond
            <InlineMath tex="\,a=\mathrm{env}_E(0,2)=3.9197920255561178\times10^{-5}" /> alone; the (0,4) and (2,4)
            bonds contribute only a second-order block-4 resolvent shift. Cross-checked in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95098-perron-eigenvalue-closed-form.js</code>.
            This visualizes an existing constant; no bound is changed.
          </p>
        </div>

        <div style={{ borderLeft: '3px solid var(--terra-dk)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>status — the joint near/far lever is out-of-class and un-priced (imp-95096)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            imp-95096 asks whether pricing the diagonal norms jointly with the far mass can certify a far
            coefficient below λ<sub>max</sub>. It can: the exact two-block Pareto line
            β(α) = K(0, 2)(2 − α) drops strictly below λ<sub>max</sub> for every α &gt; 1. But the near
            coefficient is c<sub>Near</sub> = 2α, and the Theorem K bracket class requires c<sub>Near</sub> ≤ 2,
            i.e. α ≤ 1 — the Gram-sharp parity factor 2 (imp-95018) pins α at exactly 1, the endpoint where
            β(1) = λ<sub>max</sub> exactly. So the sandwich <strong>is</strong> the terminal aggregation
            certificate for the bracket class; any sub-λ<sub>max</sub> trade lives strictly outside it. The
            trade is also un-priced: it swaps a known far reduction for a near-currency inflation
            Σd<sub>b</sub> that the carried literals do not bake, so its net effect on the headline gap
            cannot be computed here (named sub-gap imp-95096-subgap-near-currency-ratio). This is
            <strong> not a bound improvement</strong> — it changes no ledger number and promotes no bound.
            Cross-checked in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95096-joint-near-far-vs-lambda-max-terminality.js</code>.
            No bound is promoted; Platt–Trudgian Λ ≤ 0.2 remains SOTA.
          </p>
          <div style={{ marginTop: 10 }}>
            <JointNearFarParetoChart />
            <p style={{ fontSize: 11.5, color: 'var(--faint)', textAlign: 'center', margin: '4px 0 0' }}>
              β(α) = K(0,2)(2 − α), two-block model{' '}
              <span style={{ color: 'var(--accent)' }}>● in-class endpoint (α=1)</span>
            </p>
          </div>
        </div>

        {/* Five alternative gates */}
        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 24, margin: '32px 0 6px', color: 'var(--ink)' }}>Five alternative sufficient gates</h2>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          The one open family has several exact representations. Their allowances belong to different decompositions and
          <strong> must not be added to, or subtracted from, one another</strong>. The first two are cleanest for promotion.
        </p>
        <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--paper2)', textAlign: 'left', color: 'var(--faint)' }}>
                <th style={{ padding: '8px 12px' }}>Gate</th><th style={{ padding: '8px 12px' }}>Strict sufficient target</th><th style={{ padding: '8px 12px' }}>What is already removed</th>
              </tr>
            </thead>
            <tbody>
              {GATES.map(([g, target, removed]) => (
                <tr key={g} style={{ borderTop: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                  <td style={{ padding: '7px 12px', color: 'var(--ink)', fontWeight: 600 }}>{g}</td>
                  <td style={{ padding: '7px 12px', fontFamily: 'var(--ed-mono)', fontSize: 11.5 }}>{target}</td>
                  <td style={{ padding: '7px 12px' }}>{removed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* The permutation atlas (§9) */}
        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 24, margin: '32px 0 6px', color: 'var(--ink)' }}>The permutation atlas — every family classified</h2>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          Every admissible word has the correlation-preserving, modulus-last <strong>normal form</strong>:
          complete → direct/dual correlate → heat + prime masks → exact transform → shell or graph
          recombination → Schur closure (if used) → one scalar bound (rendered as accurate flow geometry —
          with the 25 real defect packets of a window-1 evaluation — at{' '}
          <Link to="/viz-freeze-flow">the freeze-flow visualization</Link>). Against that normal form, every
          rearrangement family is classified by its exact invariant — so "try every permutation" is closed,
          not combinatorial:
        </p>
        <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--paper2)', textAlign: 'left', color: 'var(--faint)' }}>
                <th style={{ padding: '8px 12px' }}>Permutation family</th><th style={{ padding: '8px 12px' }}>Exact invariant</th><th style={{ padding: '8px 12px' }}>Proof consequence</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['All 25! prime orders', 'R₉₇ and E₉₇', 'choose order for conditioning only'],
                ['Divisor / 25-defect / five-shell / Heat–Euler fiber forms', 'the same scalar cocycle', 'alternative coordinates; budgets cannot be added'],
                ['DFT / real-phase chirp / block isometries', 'coefficient ℓ² norm', 'common remainder transports exactly; center still open'],
                ['Independent bicomplex sectors', 'maximum sector residual', 'no improvement'],
                ['Unitary twistor rotations', 'spectrum and residual norm', 'no improvement'],
                ['Graph compressions', 'correlated average residual', 'POSSIBLE GAIN — conditional on characteristic invariance and complement gap'],
                ['Core/tail basis rotations', 'singular values & Schur expression', 'no missing tail gap is created'],
                ['Early componentwise moduli', 'no recoverable complex sum', 'FORBIDDEN when correlation is needed'],
              ].map(([f, inv, c]) => (
                <tr key={f} style={{ borderTop: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                  <td style={{ padding: '7px 12px', color: 'var(--ink)', fontWeight: 600 }}>{f}</td>
                  <td style={{ padding: '7px 12px' }}>{inv}</td>
                  <td style={{ padding: '7px 12px', fontWeight: /POSSIBLE|FORBIDDEN/.test(c) ? 600 : 400, color: /POSSIBLE/.test(c) ? 'var(--series-3)' : /FORBIDDEN/.test(c) ? 'var(--accent)' : undefined }}>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, marginTop: 10 }}>
          The only families with possible gain are <strong>graph compressions</strong> (the §6.2 correlated
          graph isometry, where the anti-Hermitian parts can genuinely cancel — the operator analogue of
          retaining both ladder phases — gated on characteristic invariance and a Schur complement gap) and
          the <strong>moving-reference Rouché gluing</strong> (the reference Q need not sit in a fixed
          half-plane; overlapping analytic phase charts glue by winding). Everything isometric or
          "information-preserving" alone — bicomplex sectors, twistor rotations, exact Fourier moves — is
          provably no-gain; heat methods enter only through the proof-bearing freeze–thaw closures
          (characteristic bridge, tail coercivity + Schur closure, the Duhamel heat/cutoff commutator, and
          the shell-and-collision thaw theorem).
        </p>

        {/* The route atlas (§10) */}
        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 24, margin: '32px 0 6px', color: 'var(--ink)' }}>The route atlas — eight stacks, readiness-ranked</h2>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          Two rankings differ: the closest route to a <em>checkable new theorem</em> is not the shortest route
          to RH. The L-function functor and the bicomplex–twistor interface are <strong>enabling tests, not
          additional proof mechanisms</strong> — neither has a conclusion until it feeds one of these rows:
        </p>
        <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--paper2)', textAlign: 'left', color: 'var(--faint)' }}>
                <th style={{ padding: '8px 10px' }}>#</th><th style={{ padding: '8px 12px' }}>Route</th><th style={{ padding: '8px 12px' }}>Exact payoff if completed</th><th style={{ padding: '8px 12px' }}>Decisive open theorem</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['1', 'Global P97 barrier', 'non-effective Λ < 0.14 from strict source completion', 'uniform correlated center / shifted-alias packet enclosure'],
                ['2', 'Enlarged slab + new tail', 'explicit Λ ≤ 0.1399', 'certify the rectangular-slab inheritance (4.4) and the new final-time tail (4.5)'],
                ['3', 'Hermite–Biehler / de Branges', 'fixed-time bound; at t = 0, RH', 'arithmetic HB contraction and half-plane exhaustion'],
                ['4', 'Weil-positive characteristic system', 'RH at t = 0', 'classical Weil positivity with a global limit theorem'],
                ['5', 'Argument-principle exhaustion', 'fixed-time real-rootedness; at t = 0, RH', 'uniform near-axis and infinite-tail control'],
                ['6', 'Collision-free heat dynamics', 'descent from a real-rooted time to target time', 'exclude every collision and escape at infinity'],
                ['7', 'Self-adjoint characteristic pencil', 'RH if the determinant is Ξ', 'noncircular characteristic identity and tail closure'],
                ['8', 'Diagonal t ↓ 0 family', 'RH from complete rows with endpoints tending to zero', 'a global certificate at every row'],
              ].map(([n, r, p, d]) => (
                <tr key={n} style={{ borderTop: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                  <td style={{ padding: '7px 10px', fontFamily: 'var(--ed-mono)' }}>{n}</td>
                  <td style={{ padding: '7px 12px', color: 'var(--ink)', fontWeight: 600 }}>{r}</td>
                  <td style={{ padding: '7px 12px' }}>{p}</td>
                  <td style={{ padding: '7px 12px' }}>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ borderLeft: '3px solid var(--blue, #3f6b86)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '12px 16px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>a second explicit target — the conditional 0.1399 row</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
            Route 2 trades the single cocycle weld for two sharply delimited tasks: with{' '}
            <InlineMath tex="y_* = 33/200,\ t_* = 10103/80000" />, a rectangular-slab inheritance lemma plus a
            directed proof of <InlineMath tex="H_{t_*}(x+iy) \ne 0" /> on the enlarged region would give{' '}
            <InlineMath tex="\Lambda \le 0.1399" />. Neither hypothesis is certified by the present project —
            an exact research target, not a reported improvement. An external larger-slab preprint [20] is
            tracked only as an audit-comparison target for this row — the paper explicitly states it is not
            an antecedent of Theorem 4.5 or of any claimed project status. Certified exclusions also close several
            tempting shortcuts: independent macro budgets discard essential cancellation; generic low-rank
            rough transforms cannot close the residual; raw tiling needs &gt; 7.2×10²⁶ cells. The missing
            producer must use the specific paired heat–log family and batch the integer windows analytically.
            This row does <strong>not</strong> presuppose the Gate-2 open family <InlineMath tex="690988 \le N \le 54799999" /> from
            Route 1 above: it trades that single cocycle weld for the slab-plus-tail pair instead, so it is
            tracked, certified, and could resolve on its own timeline, independent of Gate-2.
          </p>
          <SlabGeometryChart />
        </div>

        {/* Formalization status */}
        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 24, margin: '32px 0 6px', color: 'var(--ink)' }}>Machine-verified (Lean 4, Aristotle wave 1)</h2>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          Five components of this architecture were autoformalized (Harmonic Aristotle) and kernel-verified
          against mathlib v4.28 — <code>lake build</code> green, zero <code>sorry</code>/<code>axiom</code>, every theorem on the three standard
          axioms, and an independent statement-faithfulness review rating all five faithful with non-vacuous
          hypothesis packages. Sources: <code>formalization/lean-aristotle/permutation-calculus/</code>.
        </p>
        <ul style={{ paddingLeft: 20, lineHeight: 1.7, fontSize: 14, color: 'var(--ink-soft)' }}>
          <li><strong>Permutation-defect lemma</strong> (Lemma 3.1): <code className="ed-mono" style={{ fontSize: 12 }}>norm_permProd_sub_one_le_sum</code> — for contractions and any permutation π, ‖T_π − T_id‖ ≤ Σ over inversions of the commutator norms; plus the weighted noncontractive form and the bubble-chain combinatorial core. Unconditional.</li>
          <li><strong>Anti-Hermitian strip bound</strong> (Prop 2.1): <code className="ed-mono" style={{ fontSize: 12 }}>abs_im_le_of_represented</code> (|Im x| ≤ η) and <code className="ed-mono" style={{ fontSize: 12 }}>deBruijnNewman_le_of_global_representation</code> (Λ ≤ t + η²/2) — the latter is by design a conditional wrapper: (G) global representation and (S) the de Bruijn strip contraction enter as explicit named hypotheses, exactly as in the paper.</li>
          <li><strong>Five-shell identity</strong> (eqs. 11–12): <code className="ed-mono" style={{ fontSize: 12 }}>five_shell_identity</code> — E₉₇ = (1−A)Y₄(0) − A·ΣZ_g(0), <em>unconditional</em>, with the disjoint-Fourier-support orthogonality proved, not assumed.</li>
          <li><strong>The §4.7 implication chain</strong>: <code className="ed-mono" style={{ fontSize: 12 }}>theorem4_chain</code> — from hypotheses (H0)–(H6), including the essential (H3) R_ex ≤ m₉₇ − |A₉₇|ε_tr and the strict open weld (H4) ‖E₉₇‖ &lt; R_ex, derives winding 0 (a continuous-logarithm predicate, derived not assumed) and concludes Theorem 4.1(ii) at the exact row constants. The (H6) argument-principle packaging is dischargeable against a separately kernel-verified general argument principle on rectangles.</li>
          <li><strong>Twistor heat compatibility</strong> (Lemma 6.1): <code className="ed-mono" style={{ fontSize: 12 }}>heat_compat_on_range</code> — I_K Â₊ = Â₋ I_K on ran F₊ from the paper's three intertwining relations.</li>
        </ul>
        <p style={{ fontSize: 13, color: 'var(--faint)', lineHeight: 1.6 }}>
          Autoformalization caveat (unchanged from the frozen-rung set): proofs are kernel-verified; faithfulness
          of statements to the intended mathematics was independently reviewed but is not a referee. The open
          weld ‖E₉₇‖ &lt; R_ex — the one open family above — remains an <em>assumed</em> input to the chain: nothing
          here promotes Λ ≤ 0.14.
        </p>

        {/* Status + links */}
        <div style={{ borderLeft: '3px solid var(--green)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '26px 0 8px' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>honest status</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            The prime telescope, five-shell identity, gamma atlas, carrier remainder and one source cell are closed in
            their declared scopes. The global correlated inequality on <InlineMath tex="690988 \le N \le 54799999" /> is
            open on every window parameter and both seam sides. Therefore Λ ≤ 0.14 is not promoted; it is a conditional
            contract for the sharpest route currently mapped. Not a proof of RH, which requires <InlineMath tex="\Lambda \le 0" />.
          </p>
        </div>

        <div style={{ marginTop: 20, fontSize: 13.5 }}>
          <span className="ed-lbl" style={{ marginRight: 8 }}>related</span>
          <Link to="/twin-ladder">Twin ladder</Link><span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/frozen-rung-pt-equivalence">Frozen-rung ⟺ Platt–Trudgian</Link><span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/twistor">Twistor framework (geometric layer)</Link><span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/lambda-bounds">Λ bounds ledger</Link><span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/flow-blindness-no-go">Flow-blindness no-go</Link><span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/atlas">The atlas</Link>
        </div>
      </div>
    </div>
  );
}
