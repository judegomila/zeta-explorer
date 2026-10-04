import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import ConceptText from '../components/ConceptText.jsx';
import { RH_LANDSCAPE_DAG } from '../data/rh-landscape-dag.js';
import { STATUS, ED } from '../styles/tokens.js';

/* The general RH dependency graph: equivalent formulations, partial results,
   records, analogues and standing walls, with citations. Column overview SVG
   (columns by node kind, status-colored boxes, typed edges; hover a box to
   isolate its edges) plus filterable node cards. One interface node links to
   the project graph at /project-dag. Documentation only; nothing here promotes
   a bound. Import-light: reads only src/data/rh-landscape-dag.js. */

const { nodes: NODES, edges: EDGES, legend: LEGEND } = RH_LANDSCAPE_DAG;
const BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));

const STATUS_COLOR = {
  open: STATUS.open.fg,
  proven: STATUS.proved.fg,
  claimed: STATUS.candidate.fg,
  disproved: STATUS.refuted.fg,
  evidence: STATUS.measured.fg,
  obstruction: STATUS.nogo.fg,
  project: ED.brassDeco,
};

const EDGE_COLOR = {
  equivalent: ED.series3,
  implies: ED.series6,
  'partial-toward': ED.series1,
  'blocked-by': STATUS.nogo.fg,
  supersedes: STATUS.candidate.fg,
  uses: ED.inkFaint,
  analog: ED.inkFaint,
  closes: ED.series5,
  feeds: ED.brassDeco,
};

const COLUMNS = [
  { id: 'results', label: 'partial results · records', kinds: ['partial-result', 'record', 'record-claim', 'conditional-result', 'evidence'] },
  { id: 'programs', label: 'programs · analogues', kinds: ['program', 'analog', 'project-link'] },
  { id: 'statements', label: 'RH and related statements', kinds: ['target', 'equivalent-formulation', 'stronger-statement', 'generalization', 'consequence'] },
  { id: 'walls', label: 'walls', kinds: ['wall'] },
];

const SECTIONS = [
  ['target', 'The target'],
  ['equivalent-formulation', 'Equivalent formulations'],
  ['stronger-statement', 'Stronger statements'],
  ['generalization', 'Generalizations'],
  ['consequence', 'Consequences'],
  ['record', 'Current records'],
  ['record-claim', 'Claimed records (not peer-reviewed)'],
  ['partial-result', 'Partial results'],
  ['conditional-result', 'Conditional results'],
  ['evidence', 'Evidence'],
  ['program', 'Programs'],
  ['analog', 'Analogues'],
  ['project-link', 'Link to this project'],
  ['wall', 'Walls (standing obstructions)'],
];

const BOX_W = 196;
const BOX_H = 22;
const ROW = 28;
const COL_GAP = 290;
const TOP = 40;

function short(s, n = 30) {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

function useLayout() {
  return useMemo(() => {
    const pos = {};
    let maxRows = 0;
    COLUMNS.forEach((c, ci) => {
      const col = NODES.filter((n) => c.kinds.includes(n.kind))
        .sort((a, b) => c.kinds.indexOf(a.kind) - c.kinds.indexOf(b.kind));
      col.forEach((n, ri) => { pos[n.id] = { x: 20 + ci * COL_GAP, y: TOP + ri * ROW }; });
      maxRows = Math.max(maxRows, col.length);
    });
    return { pos, width: 20 + COLUMNS.length * COL_GAP - (COL_GAP - BOX_W) + 20, height: TOP + maxRows * ROW + 20 };
  }, []);
}

function edgePath(a, b) {
  const sameCol = Math.abs(a.x - b.x) < 1;
  if (sameCol) {
    const x = a.x + BOX_W;
    const y1 = a.y + BOX_H / 2;
    const y2 = b.y + BOX_H / 2;
    const bend = 26 + Math.min(60, Math.abs(y2 - y1) / 6);
    return `M ${x} ${y1} C ${x + bend} ${y1}, ${x + bend} ${y2}, ${x} ${y2}`;
  }
  const leftToRight = a.x < b.x;
  const x1 = leftToRight ? a.x + BOX_W : a.x;
  const x2 = leftToRight ? b.x : b.x + BOX_W;
  const y1 = a.y + BOX_H / 2;
  const y2 = b.y + BOX_H / 2;
  const dx = (x2 - x1) / 2;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

function Overview({ active, hover, setHover }) {
  const { pos, width, height } = useLayout();
  return (
    <>
    <div className="ed-mono" style={{ fontSize: 10.5, color: 'var(--ink-faint)', textAlign: 'right', margin: '0 0 6px' }}>
      On narrow screens the graph scrolls sideways →
    </div>
    <div style={{ overflowX: 'auto', border: '1px solid var(--hairline)', borderRadius: 8, background: 'var(--paper)' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ minWidth: 880, width: '100%', display: 'block' }} role="img"
        aria-label="Column overview of the general Riemann Hypothesis dependency graph">
        <defs>
          {Object.entries(EDGE_COLOR).map(([t, c]) => (
            <marker key={t} id={`rhl-arrow-${t}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
            </marker>
          ))}
        </defs>
        {COLUMNS.map((c, ci) => (
          <text key={c.id} x={20 + ci * COL_GAP} y={22} fill="var(--faint)"
            style={{ font: '600 10px "IBM Plex Mono", monospace', letterSpacing: 1.4, textTransform: 'uppercase' }}>{c.label}</text>
        ))}
        {EDGES.map((e, i) => {
          const on = hover ? e.from === hover || e.to === hover : true;
          return (
            <path key={i} d={edgePath(pos[e.from], pos[e.to])} fill="none" stroke={EDGE_COLOR[e.type]}
              strokeWidth={hover && on ? 1.6 : 1} opacity={hover ? (on ? 0.9 : 0.06) : 0.28}
              markerEnd={hover && on ? `url(#rhl-arrow-${e.type})` : undefined} />
          );
        })}
        {NODES.map((n) => {
          const p = pos[n.id];
          const c = STATUS_COLOR[n.statusKind];
          const dim = !active.has(n.statusKind);
          return (
            <a key={n.id} href={`#${n.id}`} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}>
              <title>{`${n.label} — ${n.status}`}</title>
              <rect x={p.x} y={p.y} width={BOX_W} height={BOX_H} rx="5" fill="var(--paper2)" stroke={c}
                strokeWidth={hover === n.id ? 2.2 : n.id === 'rh' ? 2 : 1.1} opacity={dim ? 0.25 : 1} />
              <rect x={p.x} y={p.y} width={3.5} height={BOX_H} rx="1.5" fill={c} opacity={dim ? 0.25 : 0.9} />
              <text x={p.x + 9} y={p.y + 15} fill="var(--ink)" opacity={dim ? 0.3 : 1}
                style={{ font: `${n.id === 'rh' ? 700 : 500} 10.5px Georgia, serif` }}>{short(n.label)}</text>
            </a>
          );
        })}
      </svg>
    </div>
    </>
  );
}

function Legend() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginTop: 10, alignItems: 'center' }}>
      {Object.entries(LEGEND.statusKinds).map(([k, label]) => (
        <span key={k} className="ed-mono" style={{ fontSize: 10, fontWeight: 700, color: STATUS_COLOR[k] }}>■ {label}</span>
      ))}
      <span style={{ color: 'var(--faint)' }}>·</span>
      {Object.entries(LEGEND.edgeTypes).map(([t, desc]) => (
        <span key={t} className="ed-mono" title={desc} style={{ fontSize: 10, fontWeight: 700, color: EDGE_COLOR[t] }}>→ {t}</span>
      ))}
    </div>
  );
}

function EdgeList({ label, list, side }) {
  if (!list.length) return null;
  return (
    <div className="ed-mono" style={{ marginTop: 6, fontSize: 10.5, color: 'var(--faint)', lineHeight: 1.6 }}>
      <span style={{ fontWeight: 700 }}>{label} </span>
      {list.map((e, i) => {
        const other = BY_ID[side === 'out' ? e.to : e.from];
        return (
          <span key={i}>
            {i > 0 && ' · '}
            <span style={{ color: EDGE_COLOR[e.type], fontWeight: 700 }}>{e.type}</span>{' '}
            <a href={`#${other.id}`} style={{ color: 'var(--ink-soft)' }}>{other.label}</a>
            {e.note && <span> ({e.note})</span>}
          </span>
        );
      })}
    </div>
  );
}

function NodeCard({ n }) {
  const c = STATUS_COLOR[n.statusKind];
  const out = EDGES.filter((e) => e.from === n.id);
  const inc = EDGES.filter((e) => e.to === n.id);
  return (
    <div id={n.id} style={{ border: '1px solid var(--hairline)', borderLeft: `4px solid ${c}`, borderRadius: 8, background: 'var(--paper2)', padding: '12px 15px', scrollMarginTop: 80 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
        <strong style={{ color: 'var(--ink)', fontSize: 15 }}>{n.label}</strong>
        <span className="ed-mono" style={{ fontSize: 10, fontWeight: 700, color: c, border: `1px solid ${c}`, borderRadius: 4, padding: '1px 6px' }}>{n.status}</span>
        <span className="ed-mono" style={{ fontSize: 10.5, color: 'var(--faint)' }}>{n.date}</span>
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.55 }}><ConceptText text={n.summary} max={4} /></div>
      <div className="ed-mono" style={{ marginTop: 6, fontSize: 10.5, color: 'var(--faint)' }}>source · {n.source}</div>
      <EdgeList label="out:" list={out} side="out" />
      <EdgeList label="in:" list={inc} side="in" />
      {(n.route || n.id === 'project-lambda-candidate') && (
        <div style={{ marginTop: 6, fontSize: 12.5, display: 'flex', gap: 14 }}>
          {n.route && <Link to={n.route}>page →</Link>}
          {n.id === 'project-lambda-candidate' && <Link to="/project-dag">project DAG →</Link>}
        </div>
      )}
    </div>
  );
}

export default function RhLandscapeDagPage() {
  const all = Object.keys(LEGEND.statusKinds);
  const [active, setActive] = useState(() => new Set(all));
  const [hover, setHover] = useState(null);
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);
  const toggle = (k) => setActive((prev) => {
    const next = new Set(prev);
    if (next.has(k)) next.delete(k); else next.add(k);
    return next;
  });
  const shown = NODES.filter((n) => active.has(n.statusKind));

  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>rh landscape · {NODES.length} nodes · {EDGES.length} edges · as of {RH_LANDSCAPE_DAG.date}</span>} />
      <div className="ed-full" style={{ maxWidth: '84rem', padding: '28px 34px 70px' }}>
        <div className="ed-lbl">the problem, not the project</div>
        <h1 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 38, lineHeight: 1.1, margin: '6px 0 10px', color: 'var(--ink)' }}>
          The Riemann Hypothesis: general DAG
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: '58rem', lineHeight: 1.6 }}>
          The literature-level dependency graph of RH: statements proved equivalent to it, what it implies,
          the partial results and records on each axis, the analogues where an RH-type statement is proved, and
          the standing obstructions each line of attack meets. Every node carries a citation. {RH_LANDSCAPE_DAG.status}
        </p>
        <p style={{ fontSize: 14.5, margin: '2px 0 14px' }}>
          <Link to="/project-dag"><strong>This project&rsquo;s attempts DAG →</strong></Link>
          <span style={{ color: 'var(--ink-soft)' }}> the detailed graph of the project&rsquo;s routes, certificates and no-go theorems, cross-linked to the anchors on this page.</span>
        </p>

        <Overview active={active} hover={hover} setHover={setHover} />
        <Legend />

        <div style={{ margin: '22px 0 8px', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span className="ed-lbl" style={{ marginRight: 4 }}>filter by status</span>
          {all.map((k) => (
            <button key={k} type="button" onClick={() => toggle(k)} className="ed-mono"
              style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 4, cursor: 'pointer',
                border: `1px solid ${STATUS_COLOR[k]}`, color: active.has(k) ? 'var(--paper)' : STATUS_COLOR[k],
                background: active.has(k) ? STATUS_COLOR[k] : 'transparent' }}>
              {LEGEND.statusKinds[k]} · {NODES.filter((n) => n.statusKind === k).length}
            </button>
          ))}
          <button type="button" className="ed-mono" onClick={() => setActive(new Set(all))}
            style={{ fontSize: 10.5, padding: '3px 9px', borderRadius: 4, cursor: 'pointer', border: '1px solid var(--hairline)', background: 'transparent', color: 'var(--ink-soft)' }}>
            all
          </button>
        </div>

        {SECTIONS.map(([kind, title]) => {
          const list = shown.filter((n) => n.kind === kind);
          if (!list.length) return null;
          return (
            <section key={kind}>
              <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 22, margin: '26px 0 10px', color: 'var(--ink)' }}>
                {title} <span className="ed-mono" style={{ fontSize: 12, color: 'var(--faint)' }}>{list.length}</span>
              </h2>
              <p style={{ fontSize: 13, color: 'var(--faint)', margin: '-4px 0 10px' }}>{LEGEND.kinds[kind]}</p>
              <div style={{ display: 'grid', gap: 10 }}>
                {list.map((n) => <NodeCard key={n.id} n={n} />)}
              </div>
            </section>
          );
        })}

        <div style={{ marginTop: 26, fontSize: 13.5 }}>
          <Link to="/project-dag">Project attempts DAG →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/frontier-dag">Frontier DAG (open objects) →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/program-dag">Program DAG (permutation program history) →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/rh-equivalents">RH equivalents →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/">← home</Link>
        </div>
      </div>
    </div>
  );
}
