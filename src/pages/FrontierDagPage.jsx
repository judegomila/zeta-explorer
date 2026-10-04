import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import ConceptText from '../components/ConceptText.jsx';
import { NODES, EDGES, FRONTIER_DAG } from '../data/frontier-dag.js';
import { STATUS, ED } from '../styles/tokens.js';

/* The frontier DAG — the live dependency graph of named open objects: what
   closes what, what gates what, what promotes what, as of the data module's
   asOf date. Hand-layout SVG (fixed positions), warm palette, status-colored
   nodes. The historical insight DAG (how the ideas were found) is the
   separate, unmodified page at /rh-dag. Documentation only; nothing here
   promotes a bound. */

const NODE_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));

// Node color by statusKind (warm palette, mirrors the atlas/status legend).
const STATUS_COLOR = {
  open: STATUS.open.fg,
  progress: ED.brassDeco,
  aristotle: STATUS.certified.fg,
  result: STATUS.proved.fg,
  candidate: STATUS.candidate.fg,
  contract: STATUS.neutral.fg,
  nogo: STATUS.nogo.fg,
  external: STATUS.neutral.fg,
};

const EDGE_COLOR = { closes: ED.series3, gates: ED.brassDeco, promotes: ED.series5 };

// Short in-box tag per node (the full grade text lives in the list below).
const TAG = {
  'copositive-strip': 'in progress',
  'weld-ladder-floor': 'open',
  'h4-identification-residual': 'open · allowance 1.8149',
  'g4-batching': 'built · 21.1 CPU-days',
  'window1-cert': 'in progress · 0.058% certified',
  'h4-family': 'open — the one family',
  'contract-014': 'contract-not-a-bound',
  'o1-sharp-mass': 'at Aristotle (job38)',
  'o2-slab': 'open · cheapest',
  'o4-tail': 'open · measured only',
  'o6-assembly': 'gated: O1 ∧ O2 ∧ O4',
  'ythaw-01775943': 'candidate-unrefereed',
  'zr-hypothesis': 'open · last hypothesis',
  'frozen-rung-pt': 'half theorem · half conditional',
  'route7-cost-curve': 'in progress · 2-pt calibration',
  't0-program-floor': 'no-go below U ≈ 0.145–0.150',
  'verified-height': 'external HPC',
  'pt-02-floor': 'refereed-sound',
  'route-i-uniform-n-gap': 'Arb · pending referee',
};

// Hand layout: fixed positions + explicit name-line wrapping (~18 nodes).
const W = 214;
const H = 66;
const LAYOUT = {
  'copositive-strip': { x: 24, y: 46, lines: ['Copositive strip', 'certificate'] },
  'weld-ladder-floor': { x: 278, y: 46, lines: ['Weld-ladder floor', '(multi-packet class)'] },
  'h4-identification-residual': { x: 532, y: 46, lines: ['(H4) identification', 'residual · imp-95008'] },
  'g4-batching': { x: 24, y: 150, lines: ['G4 family batching', '(tier-2 chirp)'] },
  'window1-cert': { x: 278, y: 150, lines: ['Window-1 continuum', 'certificate'] },
  'h4-family': { x: 786, y: 98, lines: ['(H4) the one open family', '|C_E,17| < 0.27969'] },
  'contract-014': { x: 1040, y: 98, lines: ['Λ ≤ 0.14 completion', 'contract (not a bound)'] },
  'o1-sharp-mass': { x: 24, y: 278, lines: ['O1 · sharp-mass', 'y-monotonicity'] },
  'o2-slab': { x: 24, y: 364, lines: ['O2 · barrier/winding', 'slab at y = 0.1808'] },
  'o4-tail': { x: 24, y: 450, lines: ['O4 · analytic tail', 'N > 3,840,000'] },
  'o6-assembly': { x: 278, y: 364, lines: ['O6 · criterion', 'assembly'] },
  'ythaw-01775943': { x: 532, y: 364, lines: ['Λ ≤ 0.17759432', 'y-thaw package'] },
  'zr-hypothesis': { x: 24, y: 568, lines: ['(ZR) zero-repulsion', 'hypothesis'] },
  'frozen-rung-pt': { x: 278, y: 568, lines: ['Frozen-rung ⟺', 'Platt–Trudgian'] },
  'route7-cost-curve': { x: 24, y: 684, lines: ['Route VII cost curve', '(t↓0 pricing)'] },
  't0-program-floor': { x: 278, y: 684, lines: ['t↓0 diagonal', 'program floor'] },
  'verified-height': { x: 24, y: 800, lines: ['Verified zero height', '(external HPC)'] },
  'pt-02-floor': { x: 278, y: 800, lines: ['Λ ≤ 0.2 floor', '(Platt–Trudgian 2021)'] },
  'route-i-uniform-n-gap': { x: 786, y: 800, lines: ['Route I uniform-N gap', 'T_a[σ₂] on 2a ≤ ln 3'] },
};

const CLUSTER_LABELS = [
  { y: 30, text: 'gate-2 · the 0.14 contract lane' },
  { y: 262, text: 'y-thaw · the 0.17759432 package' },
  { y: 552, text: 'frozen-rung ⟺ pt · the promotion lane' },
  { y: 668, text: 'route vii · the t↓0 diagonal' },
  { y: 784, text: 'the unconditional floor' },
  { y: 784, x: 786, text: 'route i · krein toeplitz certificate' },
];

function edgePath(from, to) {
  const a = LAYOUT[from];
  const b = LAYOUT[to];
  const x1 = a.x + W;
  const y1 = a.y + H / 2;
  const x2 = b.x;
  const y2 = b.y + H / 2;
  const dx = Math.max(30, (x2 - x1) / 2);
  return { d: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`, mx: (x1 + x2) / 2, my: (y1 + y2) / 2 - 5 };
}

function DagSvg() {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--hairline)', borderRadius: 8, background: 'var(--paper)' }}>
      <svg viewBox="0 0 1280 890" style={{ minWidth: 1100, width: '100%', display: 'block' }} role="img"
        aria-label="Dependency graph of the named open frontier objects">
        <defs>
          {Object.entries(EDGE_COLOR).map(([m, c]) => (
            <marker key={m} id={`fdag-arrow-${m}`} viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
            </marker>
          ))}
        </defs>

        {CLUSTER_LABELS.map((c) => (
          <text key={c.text} x={c.x ?? 24} y={c.y} style={{ font: '600 10px "IBM Plex Mono", monospace', letterSpacing: 1.5, textTransform: 'uppercase' }} fill="var(--faint)">
            {c.text}
          </text>
        ))}

        {EDGES.map((e, i) => {
          if (!LAYOUT[e.from] || !LAYOUT[e.to]) return null;
          const p = edgePath(e.from, e.to);
          const c = EDGE_COLOR[e.meaning];
          return (
            <g key={i}>
              <path d={p.d} fill="none" stroke={c} strokeWidth="1.4" opacity="0.75" markerEnd={`url(#fdag-arrow-${e.meaning})`} />
              <text x={p.mx} y={p.my} textAnchor="middle" style={{ font: '600 9.5px "IBM Plex Mono", monospace' }} fill={c}>
                {e.meaning}
              </text>
            </g>
          );
        })}

        {NODES.map((n) => {
          const L = LAYOUT[n.id];
          if (!L) return null; // node added to frontier-dag.js without a hand position
          const c = STATUS_COLOR[n.statusKind] || 'var(--ink-soft)';
          return (
            <g key={n.id}>
              <title>{`${n.name} — ${n.status}`}</title>
              <rect x={L.x} y={L.y} width={W} height={H} rx="8" fill="var(--paper2)" stroke={c} strokeWidth="1.4" />
              <rect x={L.x} y={L.y} width={4} height={H} rx="2" fill={c} opacity="0.85" />
              <text x={L.x + 12} y={L.y + 16} style={{ font: '700 8.5px "IBM Plex Mono", monospace', letterSpacing: 0.4 }} fill={c}>
                {TAG[n.id]}
              </text>
              {L.lines.map((line, li) => (
                <text key={li} x={L.x + 12} y={L.y + 33 + li * 15} style={{ font: '600 12px Georgia, serif' }} fill="var(--ink)">
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
  const statuses = [
    ['open', 'open'],
    ['progress', 'in progress'],
    ['aristotle', 'at Aristotle'],
    ['result', 'result'],
    ['candidate', 'candidate-unrefereed'],
    ['contract', 'contract-not-a-bound'],
    ['nogo', 'no-go'],
    ['external', 'external'],
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginTop: 10, alignItems: 'center' }}>
      {statuses.map(([k, label]) => (
        <span key={k} className="ed-mono" style={{ fontSize: 10, fontWeight: 700, color: STATUS_COLOR[k] }}>
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

function ClosesIfCard({ n }) {
  const c = STATUS_COLOR[n.statusKind] || 'var(--ink-soft)';
  const downstream = EDGES.filter((e) => e.from === n.id).map((e) => ({ ...e, node: NODE_BY_ID[e.to] }));
  return (
    <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, background: 'var(--paper2)', padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
        <strong style={{ color: 'var(--ink)', fontSize: 15 }}>{n.name}</strong>
        <span className="ed-mono" style={{ fontSize: 10, fontWeight: 700, color: c, border: `1px solid ${c}`, borderRadius: 4, padding: '1px 6px' }}>
          {TAG[n.id]}
        </span>
        <span className="ed-mono" style={{ fontSize: 10.5, color: 'var(--faint)' }}>{n.source}</span>
      </div>
      <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55 }}><ConceptText text={n.status} max={4} /></div>
      {n.closesIf && (
        <div style={{ marginTop: 8, fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.55 }}>
          <span className="ed-mono" style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.8, color: 'var(--series-3)' }}>IF THIS LANDS </span>
          <ConceptText text={n.closesIf} max={4} />
        </div>
      )}
      {n.externalCorroboration && (
        <div style={{ marginTop: 8, fontSize: 13, color: 'var(--ink)', lineHeight: 1.55, borderLeft: '3px solid var(--series-1)', paddingLeft: 10 }}>
          <span className="ed-mono" style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.8, color: 'var(--series-1)' }}>EXTERNAL CORROBORATION </span>
          {n.externalCorroboration}
        </div>
      )}
      {downstream.length > 0 && (
        <div className="ed-mono" style={{ marginTop: 8, fontSize: 10.5, color: 'var(--faint)' }}>
          {downstream.map((d) => `${d.meaning} → ${d.node.name}${d.note ? ` (${d.note})` : ''}`).join(' · ')}
        </div>
      )}
      {n.route && <div style={{ marginTop: 6, fontSize: 12.5 }}><Link to={n.route}>open →</Link></div>}
    </div>
  );
}

export default function FrontierDagPage() {
  const openObjects = NODES.filter((n) => n.kind === 'open-object');
  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>frontier dag · {NODES.length} nodes · {EDGES.length} edges · as of {FRONTIER_DAG.asOf}</span>} />
      <div className="ed-full" style={{ maxWidth: '80rem', padding: '28px 34px 70px' }}>
        <div className="ed-lbl">what closes what</div>
        <h1 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 38, lineHeight: 1.1, margin: '6px 0 10px', color: 'var(--ink)' }}>
          The Frontier DAG
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: '56rem', lineHeight: 1.6 }}>
          The live dependency graph of the named open objects on the current frontier: which open object
          closes, gates, or promotes which downstream statement. Grades are verbatim from the source
          modules; nothing on this page promotes a bound. Λ ≤ 0.2 (Platt–Trudgian 2021) is the
          peer-reviewed benchmark, and its only unconditional input is verified zero height. For how the
          program's <em>ideas</em> depend on each other historically, see{' '}
          <Link to="/rh-dag">the historical insight DAG</Link> — this page tracks the open objects, not
          the insights.
        </p>
        <p style={{ fontSize: 14.5, margin: '2px 0 14px' }}>
          <Link to="/program-dag"><strong>The complete history →</strong></Link>
          <span style={{ color: 'var(--ink-soft)' }}>
            {' '}the full retrospective program DAG: every attempt, refutation, merge and pivot behind these open objects.
          </span>
        </p>

        <DagSvg />
        <Legend />

        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 22, margin: '30px 0 10px', color: 'var(--ink)' }}>
          What closes if this lands — the {openObjects.length} open objects
        </h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {openObjects.map((n) => <ClosesIfCard key={n.id} n={n} />)}
        </div>

        <div style={{ marginTop: 26, fontSize: 13.5 }}>
          <Link to="/viz-cost-floor">The cost-floor geometry (route vii) →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/program-dag">The Program DAG (complete history) →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/rh-dag">The historical insight DAG →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/atlas">The Atlas →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/what-we-know">What We Know →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/">← home</Link>
        </div>
      </div>
    </div>
  );
}
