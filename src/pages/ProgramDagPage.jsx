import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { NODES, EDGES, PROGRAM_DAG } from '../data/program-dag.js';
import { ED, STATUS } from '../styles/tokens.js';

/* The program DAG — the complete retrospective graph of the freeze/
   permutation-calculus program: every attempt, result, merge and pivot,
   outcome-colored, with a chronological outcome ledger below. Hand-layout
   SVG (fixed positions), warm palette. The live open-object graph is
   /frontier-dag; the historical insight DAG is /rh-dag. Documentation only;
   grades verbatim; nothing here promotes a bound; NO QED. */

const NODE_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));

// Node color by outcome (green won, red ruled-out, purple merged,
// amber open/in-progress, grey pivoted).
const OUTCOME_COLOR = {
  won: ED.series3,
  'ruled-out': STATUS.nogo.fg,
  merged: ED.series5,
  open: STATUS.open.fg,
  'in-progress': STATUS.candidate.fg,
  pivoted: ED.inkFaint,
};

const EDGE_COLOR = {
  'led-to': ED.series1,
  'refuted-by': STATUS.nogo.fg,
  'pivoted-to': ED.inkFaint,
  'merged-into': ED.series5,
  closes: ED.series3,
  gates: ED.brassDeco,
};

// Hand layout: fixed positions + explicit name-line wrapping (45 nodes).
const W = 216;
const H = 64;
const X = (c) => 24 + c * 250;
const LAYOUT = {
  // architecture & no-gos
  'frozen-rung-prop': { x: X(0), y: 46, lines: ['Frozen-rung ⟺ PT', 'proposition + 13pp proof'] },
  'flow-blindness': { x: X(1), y: 46, lines: ['Flow-blindness no-go', '+ T3⟺strip dictionary'] },
  // atlas families
  'fam-isometric': { x: X(0), y: 150, lines: ['25! orders / fiber forms', '/ DFT — no-gain'] },
  'fam-bicomplex-twistor': { x: X(0), y: 234, lines: ['Bicomplex / twistor', 'rotations — no improvement'] },
  'fam-early-moduli': { x: X(1), y: 150, lines: ['Early componentwise', 'moduli — FORBIDDEN'] },
  'fam-graph-compression': { x: X(1), y: 234, lines: ['Graph compressions', '(possible gain)'] },
  'majorant-obstruction': { x: X(2), y: 150, lines: ['Shell-decoupled', 'majorant route'] },
  'fam-moving-rouche': { x: X(2), y: 234, lines: ['Moving-reference', 'Rouché gluing pilot'] },
  'gate-ranking': { x: X(3), y: 150, lines: ['Gate ranking: Gate 2', 'recommended; 3–5 weak'] },
  // probe chain
  'gate2-frozen-spec': { x: X(0), y: 346, lines: ['Gate-2 frozen spec', '(eqs 8–20)'] },
  'lane-a-blocked': { x: X(1), y: 346, lines: ['Lane-A anchor gate', 'BLOCKED-ON-SPEC'] },
  'archive-hunt': { x: X(2), y: 346, lines: ['Companion archive:', 'never downloaded'] },
  'archive-free-pivot': { x: X(3), y: 346, lines: ['Archive-free G1/G3', 'pivot (paper §12.1)'] },
  'g3-pilot': { x: X(4), y: 346, lines: ['G3 first-window pilot', 'PASS 12.8% / 30.8%'] },
  // certification chain
  'raw-tiling': { x: X(0), y: 458, lines: ['Raw tiling — 7.2e26 cells', '/ 1.6e5 CPU-days'] },
  'envelope-pivot': { x: X(1), y: 458, lines: ['Envelope-scale pivot', 'REFUTED (witnessed)'] },
  'tier1-certifier': { x: X(2), y: 458, lines: ['Tier-1 certifier built', '378 CPU-days priced'] },
  'tier2-chirp': { x: X(3), y: 458, lines: ['Tier-2 chirp level', '17.9× → 21.1 CPU-days'] },
  'window1-run': { x: X(4), y: 458, lines: ['Window-1 continuum', 'certificate run'] },
  // freeze-tuple levers
  'cutoff-tensor': { x: X(0), y: 570, lines: ['Cutoff-tensor scan', 'KEEP-P97-FROZEN'] },
  'gu-word-composition': { x: X(1), y: 570, lines: ['G_U in the eq-43', 'barrier word'] },
  // weld ladder
  'weld-gap-41x': { x: X(0), y: 682, lines: ['Far-bracket gap', 'measured 41.3×'] },
  'weld-gap-281x': { x: X(1), y: 682, lines: ['Gap attributed', 'and cut to 2.81×'] },
  'weld-vx': { x: X(2), y: 682, lines: ['THEOREM VX strip', 'closure at 0.235'] },
  'weld-psd-route': { x: X(2), y: 766, lines: ['Operator-inequality', '(PSD) route'] },
  'weld-wd-dissolution': { x: X(3), y: 682, lines: ['LEMMA WD copositive', 'dissolution 12-D → 9-D'] },
  'weld-two-point': { x: X(4), y: 682, lines: ['Two-point class closed', '(55,398-cell cover)'] },
  'weld-triple-cover': { x: X(5), y: 682, lines: ['Triple cover: top', 'sub-band closed only'] },
  'weld-referee': { x: X(6), y: 682, lines: ['Referee pass 20–52:', 'all sound-with-caveats'] },
  // 0.1399 lane & collar
  'campaign-01399': { x: X(0), y: 878, lines: ['0.1399 campaign design', '(T-P1 ranked first)'] },
  'tp1-tail-repricing': { x: X(1), y: 878, lines: ['T-P1 tail lane: K1 clear,', 'K2 eliminates (N1* = 220.5M)'] },
  'collar-split': { x: X(2), y: 878, lines: ['Prop-4.3 collar:', 'eliminated twice over'] },
  'ythaw-salvage': { x: X(3), y: 878, lines: ['y-thaw salvage found', '(0.17759432)'] },
  // y-thaw package
  'ythaw-stage12': { x: X(4), y: 990, lines: ['Stages 1+2: S0 note', '+ re-sweep clean'] },
  'ythaw-o5-o3': { x: X(5), y: 990, lines: ['O5 + O3 certified', '(our toolchain)'] },
  'ythaw-o1-aristotle': { x: X(5), y: 1074, lines: ['O1 at Aristotle', '(job38, wave 6)'] },
  'ythaw-package': { x: X(6), y: 990, lines: ['Λ ≤ 0.17759432 package', '(candidate-unrefereed)'] },
  // inertia-pcc & route vii
  'inertia-pcc': { x: X(5), y: 1186, lines: ['Inertia × PCC Q:', 'the same wall again'] },
  'route7-floor': { x: X(6), y: 1186, lines: ['Route VII cost curve:', 'floor U ≈ 0.145–0.150'] },
  // formalization
  'aristotle-wave1': { x: X(0), y: 1298, lines: ['Aristotle wave 1', '5/5 kernel-verified'] },
  'aristotle-waves23': { x: X(1), y: 1298, lines: ['Waves 2–3', '10/10 kernel-verified'] },
  'aristotle-wave4': { x: X(2), y: 1298, lines: ['Wave 4 close-out', '15/15 ALL FAITHFUL'] },
  'entirelp-parked': { x: X(3), y: 1382, lines: ['entirelp + weld_cc_rm', 'OUT_OF_BUDGET, parked'] },
  'aristotle-wave5': { x: X(3), y: 1298, lines: ['Wave 5: l2 detection', 'modulus delivered'] },
  'aristotle-wave6': { x: X(4), y: 1298, lines: ['Wave 6 in flight', '(sequential slot)'] },
  'zr-promotion': { x: X(5), y: 1298, lines: ['Frozen-rung ⟺ PT', 'promotion: (ZR)-gated'] },
};

const CLUSTER_LABELS = [
  { y: 30, text: 'architecture & no-gos · 2026-07-31 → 08-14' },
  { y: 134, text: 'the permutation atlas families · 2026-08-27 → 08-28' },
  { y: 330, text: 'the gate-2 probe chain · 2026-09-02 → 09-09' },
  { y: 442, text: 'the certification chain · 2026-09-02 → in progress' },
  { y: 554, text: 'freeze-tuple levers · 2026-09-07' },
  { y: 666, text: 'the weld ladder · 2026-09-02 → 09-09' },
  { y: 862, text: 'the 0.1399 lane & the collar · 2026-09-07 → 09-09' },
  { y: 974, text: 'the y-thaw package · 2026-09-10 → open' },
  { y: 1170, text: 'inertia-pcc & route vii · 2026-09-14' },
  { y: 1282, text: 'formalization · the aristotle waves' },
];

function edgePath(from, to) {
  const a = LAYOUT[from];
  const b = LAYOUT[to];
  const forward = b.x >= a.x + W;
  const x1 = forward ? a.x + W : a.x + W / 2;
  const y1 = forward ? a.y + H / 2 : (b.y > a.y ? a.y + H : a.y);
  const x2 = forward ? b.x : b.x + W / 2;
  const y2 = forward ? b.y + H / 2 : (b.y > a.y ? b.y : b.y + H);
  // Same-lane hop between adjacent columns: the 34px gap can't fit a label.
  const showLabel = !(forward && Math.abs(y2 - y1) < 30 && x2 - x1 < 70);
  const dx = Math.max(30, (x2 - x1) / 2);
  if (forward) {
    return { d: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`, mx: (x1 + x2) / 2, my: (y1 + y2) / 2 - 5, showLabel };
  }
  const dy = Math.max(24, Math.abs(y2 - y1) / 2) * (y2 > y1 ? 1 : -1);
  return { d: `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`, mx: (x1 + x2) / 2, my: (y1 + y2) / 2 - 5, showLabel };
}

function DagSvg() {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--hairline)', borderRadius: 8, background: 'var(--paper)' }}>
      <svg viewBox="0 0 2020 1480" style={{ minWidth: 1900, display: 'block' }} role="img"
        aria-label="Complete retrospective graph of the freeze/permutation-calculus program">
        <defs>
          {Object.entries(EDGE_COLOR).map(([m, c]) => (
            <marker key={m} id={`pdag-arrow-${m}`} viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
            </marker>
          ))}
        </defs>

        {CLUSTER_LABELS.map((c) => (
          <text key={c.y} x={24} y={c.y} style={{ font: '600 10px "IBM Plex Mono", monospace', letterSpacing: 1.5, textTransform: 'uppercase' }} fill="var(--faint)">
            {c.text}
          </text>
        ))}

        {EDGES.map((e, i) => {
          const p = edgePath(e.from, e.to);
          const c = EDGE_COLOR[e.meaning];
          return (
            <g key={i}>
              <path d={p.d} fill="none" stroke={c} strokeWidth="1.3" opacity="0.7" markerEnd={`url(#pdag-arrow-${e.meaning})`} />
              {p.showLabel && (
                <text x={p.mx} y={p.my} textAnchor="middle" style={{ font: '600 9px "IBM Plex Mono", monospace' }} fill={c}>
                  {e.meaning}
                </text>
              )}
            </g>
          );
        })}

        {NODES.map((n) => {
          const L = LAYOUT[n.id];
          const c = OUTCOME_COLOR[n.outcome] || 'var(--ink-soft)';
          return (
            <g key={n.id}>
              <title>{`${n.name} — ${n.grade}`}</title>
              <rect x={L.x} y={L.y} width={W} height={H} rx="8" fill="var(--paper2)" stroke={c} strokeWidth="1.4" />
              <rect x={L.x} y={L.y} width={4} height={H} rx="2" fill={c} opacity="0.85" />
              <text x={L.x + 12} y={L.y + 15} style={{ font: '700 8.5px "IBM Plex Mono", monospace', letterSpacing: 0.4 }} fill={c}>
                {n.outcome} · {n.date.slice(5)}
              </text>
              {L.lines.map((line, li) => (
                <text key={li} x={L.x + 12} y={L.y + 32 + li * 15} style={{ font: '600 11.5px Georgia, serif' }} fill="var(--ink)">
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Legend() {
  const outcomes = [
    ['won', 'won'],
    ['ruled-out', 'ruled out'],
    ['merged', 'merged'],
    ['pivoted', 'pivoted'],
    ['open', 'open'],
    ['in-progress', 'in progress'],
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginTop: 10, alignItems: 'center' }}>
      {outcomes.map(([k, label]) => (
        <span key={k} className="ed-mono" style={{ fontSize: 10, fontWeight: 700, color: OUTCOME_COLOR[k] }}>
          ■ {label}
        </span>
      ))}
      <span style={{ color: 'var(--faint)' }}>·</span>
      {Object.entries(EDGE_COLOR).map(([m, c]) => (
        <span key={m} className="ed-mono" style={{ fontSize: 10, fontWeight: 700, color: c }}>
          → {m}
        </span>
      ))}
    </div>
  );
}

function LedgerRow({ n }) {
  const c = OUTCOME_COLOR[n.outcome] || 'var(--ink-soft)';
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', padding: '9px 2px', borderTop: '1px solid var(--hairline)' }}>
      <span className="ed-mono" style={{ fontSize: 11, color: 'var(--faint)', flex: '0 0 5.2rem' }}>{n.date}</span>
      <span className="ed-mono" style={{ fontSize: 9.5, fontWeight: 700, color: c, border: `1px solid ${c}`, borderRadius: 4, padding: '1px 6px', flex: '0 0 6.2rem', textAlign: 'center' }}>
        {n.outcome}
      </span>
      <span style={{ fontSize: 13.5, lineHeight: 1.5 }}>
        <strong style={{ color: 'var(--ink)' }}>{n.name}.</strong>{' '}
        <span style={{ color: 'var(--ink-soft)' }}>{n.grade}</span>
        <span className="ed-mono" style={{ fontSize: 10.5, color: 'var(--faint)' }}> — {n.source}</span>
        {n.route && <>{' '}<Link to={n.route} className="ed-mono" style={{ fontSize: 11 }}>{n.route} →</Link></>}
      </span>
    </div>
  );
}

export default function ProgramDagPage() {
  const byDate = [...NODES].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  const counts = NODES.reduce((m, n) => ((m[n.outcome] = (m[n.outcome] || 0) + 1), m), {});
  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>program dag · {NODES.length} nodes · {EDGES.length} edges · as of {PROGRAM_DAG.asOf}</span>} />
      <div className="ed-full" style={{ maxWidth: '84rem', padding: '28px 34px 70px' }}>
        <div className="ed-lbl">everything the program tried</div>
        <h1 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 38, lineHeight: 1.1, margin: '6px 0 10px', color: 'var(--ink)' }}>
          The Program DAG
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: '58rem', lineHeight: 1.6 }}>
          The complete retrospective graph of the freeze/permutation-calculus program: every attempt,
          result, merge and pivot — {counts.won || 0} won, {counts['ruled-out'] || 0} ruled out,{' '}
          {counts.merged || 0} merged, {counts.pivoted || 0} pivoted, {(counts.open || 0) + (counts['in-progress'] || 0)} open
          or in progress. Grades are verbatim from the source modules and the formalization ledger;
          nothing on this page promotes a bound. Λ ≤ 0.2 (Platt–Trudgian 2021) is the peer-reviewed
          benchmark. The <em>live</em> open-object graph is <Link to="/frontier-dag">the frontier DAG</Link>;
          how the program&apos;s ideas were found is <Link to="/rh-dag">the historical insight DAG</Link> —
          this page is the full history, failures included.
        </p>

        <DagSvg />
        <Legend />

        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 22, margin: '30px 0 4px', color: 'var(--ink)' }}>
          The chronological outcome ledger
        </h2>
        <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', margin: '0 0 8px' }}>
          One line per node, oldest first. Dates are the source module&apos;s repository landing date
          (or the ledger entry&apos;s own date).
        </p>
        <div style={{ borderBottom: '1px solid var(--hairline)' }}>
          {byDate.map((n) => <LedgerRow key={n.id} n={n} />)}
        </div>

        <div style={{ marginTop: 26, fontSize: 13.5 }}>
          <Link to="/frontier-dag">The frontier DAG (the live open objects) →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/threads">Research Threads →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/rh-dag">The historical insight DAG →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/">← home</Link>
        </div>
      </div>
    </div>
  );
}
