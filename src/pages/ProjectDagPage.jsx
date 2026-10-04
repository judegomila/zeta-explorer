import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import ConceptText from '../components/ConceptText.jsx';
import { PROJECT_ATTEMPTS_DAG } from '../data/project-attempts-dag.js';
import { RH_LANDSCAPE_DAG } from '../data/rh-landscape-dag.js';
import { STATUS, ED } from '../styles/tokens.js';

/* The project attempts DAG — every route, certificate, candidate, refutation
   and no-go theorem of this project, grouped by lane, with typed edges and
   cross-links to the general RH graph (/rh-landscape-dag) by anchor id.
   Column overview SVG (one column per lane + a landscape-anchor column; hover
   a box to isolate its edges) plus filterable node cards. Documentation only;
   grades verbatim from the source modules; nothing here promotes a bound;
   NO QED. Import-light: reads only the two DAG data modules. */

const { nodes: NODES, edges: EDGES, legend: LEGEND, groups: GROUPS } = PROJECT_ATTEMPTS_DAG;
const BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));
const LAND_BY_ID = Object.fromEntries(RH_LANDSCAPE_DAG.nodes.map((n) => [n.id, n]));
const LAND_REFS = [...new Set(EDGES.flatMap((e) => [e.from, e.to]).filter((id) => !BY_ID[id]))]
  .sort((a, b) => LAND_BY_ID[a].label.localeCompare(LAND_BY_ID[b].label));

const STATUS_COLOR = {
  proved: STATUS.proved.fg,
  certified: STATUS.certified.fg,
  'double-precision': STATUS.measured.fg,
  result: STATUS.proved.fg,
  conditional: STATUS.conditional.fg,
  candidate: STATUS.candidate.fg,
  open: STATUS.open.fg,
  measured: STATUS.measured.fg,
  'no-go': STATUS.nogo.fg,
  'rh-equivalent': STATUS.rhequiv.fg,
  refuted: STATUS.refuted.fg,
  superseded: STATUS.neutral.fg,
  external: STATUS.neutral.fg,
  program: '#5a5a7a',
};
const LANDSCAPE_COLOR = ED.inkFaint;

const EDGE_COLOR = {
  feeds: ED.series1,
  uses: ED.inkFaint,
  'reduces-to': ED.series5,
  'blocked-by': STATUS.nogo.fg,
  supersedes: STATUS.candidate.fg,
  equivalent: ED.series3,
  refutes: STATUS.refuted.fg,
  'rules-out': ED.brassDeco,
  closes: ED.series6,
};

const BOX_W = 172;
const BOX_H = 21;
const ROW = 26;
const COL_GAP = 196;
const TOP = 44;

function short(s, n = 27) {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

function useLayout() {
  return useMemo(() => {
    const pos = {};
    let maxRows = 0;
    const cols = [...GROUPS.map((g) => ({ id: g.id, label: g.label.split(' · ')[0].split(':')[0], ids: NODES.filter((n) => n.group === g.id).map((n) => n.id) })),
      { id: 'landscape', label: 'landscape anchors', ids: LAND_REFS }];
    cols.forEach((c, ci) => {
      c.ids.forEach((id, ri) => { pos[id] = { x: 16 + ci * COL_GAP, y: TOP + ri * ROW }; });
      maxRows = Math.max(maxRows, c.ids.length);
    });
    return { cols, pos, width: 16 + cols.length * COL_GAP - (COL_GAP - BOX_W) + 16, height: TOP + maxRows * ROW + 16 };
  }, []);
}

function edgePath(a, b) {
  if (Math.abs(a.x - b.x) < 1) {
    const x = a.x + BOX_W;
    const y1 = a.y + BOX_H / 2;
    const y2 = b.y + BOX_H / 2;
    const bend = 18 + Math.min(40, Math.abs(y2 - y1) / 8);
    return `M ${x} ${y1} C ${x + bend} ${y1}, ${x + bend} ${y2}, ${x} ${y2}`;
  }
  const ltr = a.x < b.x;
  const x1 = ltr ? a.x + BOX_W : a.x;
  const x2 = ltr ? b.x : b.x + BOX_W;
  const y1 = a.y + BOX_H / 2;
  const y2 = b.y + BOX_H / 2;
  const dx = (x2 - x1) / 2;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

function wrapLabel(s, max = 24) {
  const words = s.split(' ');
  const lines = [''];
  words.forEach((w) => {
    const cur = lines[lines.length - 1];
    if ((cur + ' ' + w).trim().length > max && lines.length < 2) lines.push(w);
    else lines[lines.length - 1] = (cur + ' ' + w).trim();
  });
  return lines.map((l) => short(l, max + 2));
}

function Overview({ active, hover, setHover }) {
  const { cols, pos, width, height } = useLayout();
  return (
    <>
    <div className="ed-mono" style={{ fontSize: 10.5, color: 'var(--ink-faint)', textAlign: 'right', margin: '0 0 6px' }}>
      On narrow screens the graph scrolls sideways →
    </div>
    <div style={{ overflowX: 'auto', border: '1px solid var(--hairline)', borderRadius: 8, background: 'var(--paper)' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ minWidth: 1200, width: '100%', display: 'block' }} role="img"
        aria-label="Column overview of the project attempts dependency graph">
        <defs>
          {Object.entries(EDGE_COLOR).map(([t, c]) => (
            <marker key={t} id={`pdag-arrow-${t}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
            </marker>
          ))}
        </defs>
        {cols.map((c, ci) => (
          <text key={c.id} fill="var(--faint)" style={{ font: '600 8.6px "IBM Plex Mono", monospace', letterSpacing: 0.8, textTransform: 'uppercase' }}>
            {wrapLabel(c.label).map((line, li) => (
              <tspan key={li} x={16 + ci * COL_GAP} y={16 + li * 11}>{line}</tspan>
            ))}
          </text>
        ))}
        {EDGES.map((e, i) => {
          const on = hover ? e.from === hover || e.to === hover : true;
          return (
            <path key={i} d={edgePath(pos[e.from], pos[e.to])} fill="none" stroke={EDGE_COLOR[e.type]}
              strokeWidth={hover && on ? 1.6 : 0.9} opacity={hover ? (on ? 0.9 : 0.04) : 0.16}
              markerEnd={hover && on ? `url(#pdag-arrow-${e.type})` : undefined} />
          );
        })}
        {LAND_REFS.map((id) => {
          const p = pos[id];
          const n = LAND_BY_ID[id];
          return (
            <a key={id} href={`/rh-landscape-dag#${id}`} onMouseEnter={() => setHover(id)} onMouseLeave={() => setHover(null)}>
              <title>{`${n.label} — general DAG anchor`}</title>
              <rect x={p.x} y={p.y} width={BOX_W} height={BOX_H} rx="10" fill="var(--paper)" stroke={LANDSCAPE_COLOR}
                strokeDasharray="3 2" strokeWidth={hover === id ? 2 : 1} />
              <text x={p.x + 9} y={p.y + 14} fill="var(--ink-soft)" style={{ font: 'italic 500 10px Georgia, serif' }}>{short(n.label)}</text>
            </a>
          );
        })}
        {NODES.map((n) => {
          const p = pos[n.id];
          const c = STATUS_COLOR[n.statusKind];
          const dim = !active(n);
          return (
            <a key={n.id} href={`#${n.id}`} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}>
              <title>{`${n.label} — ${n.status}`}</title>
              <rect x={p.x} y={p.y} width={BOX_W} height={BOX_H} rx="5" fill="var(--paper2)" stroke={c}
                strokeWidth={hover === n.id ? 2.2 : 1.1} opacity={dim ? 0.22 : 1} />
              <rect x={p.x} y={p.y} width={3.5} height={BOX_H} rx="1.5" fill={c} opacity={dim ? 0.22 : 0.9} />
              <text x={p.x + 8} y={p.y + 14} fill="var(--ink)" opacity={dim ? 0.3 : 1} style={{ font: '500 10px Georgia, serif' }}>{short(n.label)}</text>
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
      <span className="ed-mono" style={{ fontSize: 10, fontWeight: 700, color: LANDSCAPE_COLOR }}>◌ general-DAG anchor</span>
      <span style={{ color: 'var(--faint)' }}>·</span>
      {Object.entries(LEGEND.edgeTypes).map(([t, desc]) => (
        <span key={t} className="ed-mono" title={desc} style={{ fontSize: 10, fontWeight: 700, color: EDGE_COLOR[t] }}>→ {t}</span>
      ))}
    </div>
  );
}

function Ref({ id }) {
  if (BY_ID[id]) return <a href={`#${id}`} style={{ color: 'var(--ink-soft)' }}>{BY_ID[id].label}</a>;
  return (
    <Link to={`/rh-landscape-dag#${id}`} style={{ color: LANDSCAPE_COLOR, fontStyle: 'italic' }}>
      {LAND_BY_ID[id].label} ↗
    </Link>
  );
}

function EdgeList({ label, list, side }) {
  if (!list.length) return null;
  return (
    <div className="ed-mono" style={{ marginTop: 6, fontSize: 10.5, color: 'var(--faint)', lineHeight: 1.6 }}>
      <span style={{ fontWeight: 700 }}>{label} </span>
      {list.map((e, i) => (
        <span key={i}>
          {i > 0 && ' · '}
          <span style={{ color: EDGE_COLOR[e.type], fontWeight: 700 }}>{e.type}</span>{' '}
          <Ref id={side === 'out' ? e.to : e.from} />
          {e.note && <span> ({e.note})</span>}
        </span>
      ))}
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
        {n.date && <span className="ed-mono" style={{ fontSize: 10.5, color: 'var(--faint)' }}>{n.date}</span>}
        <span className="ed-mono" style={{ fontSize: 10, color: 'var(--faint)' }}>{n.kind}</span>
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.55 }}><ConceptText text={n.summary} max={4} /></div>
      <div className="ed-mono" style={{ marginTop: 6, fontSize: 10.5, color: 'var(--faint)' }}>source · {n.source}</div>
      <EdgeList label="out:" list={out} side="out" />
      <EdgeList label="in:" list={inc} side="in" />
      {n.route && <div style={{ marginTop: 6, fontSize: 12.5 }}><Link to={n.route}>page →</Link></div>}
    </div>
  );
}

const chip = (color, on) => ({
  fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 4, cursor: 'pointer',
  border: `1px solid ${color}`, color: on ? 'var(--paper)' : color, background: on ? color : 'transparent',
});

export default function ProjectDagPage() {
  const statuses = Object.keys(LEGEND.statusKinds);
  const [activeStatus, setActiveStatus] = useState(() => new Set(statuses));
  const [group, setGroup] = useState('all');
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  const toggle = (k) => setActiveStatus((prev) => {
    const next = new Set(prev);
    if (next.has(k)) next.delete(k); else next.add(k);
    return next;
  });
  const active = (n) => activeStatus.has(n.statusKind) && (group === 'all' || n.group === group);
  const counts = Object.fromEntries(statuses.map((k) => [k, NODES.filter((n) => n.statusKind === k).length]));

  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>project dag · {NODES.length} nodes · {EDGES.length} edges · {LAND_REFS.length} general-DAG anchors · as of {PROJECT_ATTEMPTS_DAG.date}</span>} />
      <div className="ed-full" style={{ maxWidth: '86rem', padding: '28px 34px 70px' }}>
        <div className="ed-lbl">what this project tried, and where each attempt stands</div>
        <h1 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 38, lineHeight: 1.1, margin: '6px 0 10px', color: 'var(--ink)' }}>
          Project attempts DAG
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: '60rem', lineHeight: 1.6 }}>
          Every route, certificate, candidate, refutation and no-go theorem of the project, grouped into {GROUPS.length} lanes,
          with typed edges. Dashed boxes are anchors in the <Link to="/rh-landscape-dag">general RH DAG</Link>; each
          project node that feeds, uses or is blocked by a standard statement or wall links there by id. Status
          labels are taken from the source modules. {PROJECT_ATTEMPTS_DAG.status}
        </p>

        <Overview active={active} hover={hover} setHover={setHover} />
        <Legend />

        <div style={{ margin: '22px 0 6px', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span className="ed-lbl" style={{ marginRight: 4 }}>filter by status</span>
          {statuses.map((k) => (
            <button key={k} type="button" className="ed-mono" onClick={() => toggle(k)} style={chip(STATUS_COLOR[k], activeStatus.has(k))}>
              {k} · {counts[k]}
            </button>
          ))}
          <button type="button" className="ed-mono" onClick={() => setActiveStatus(new Set(statuses))} style={chip('var(--ink-soft)', false)}>all</button>
          <button type="button" className="ed-mono" onClick={() => setActiveStatus(new Set())} style={chip('var(--ink-soft)', false)}>none</button>
        </div>
        <div style={{ margin: '6px 0 8px', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span className="ed-lbl" style={{ marginRight: 4 }}>lane</span>
          {[{ id: 'all', label: 'all lanes' }, ...GROUPS].map((g) => (
            <button key={g.id} type="button" className="ed-mono" onClick={() => setGroup(g.id)} style={chip(ED.inkFaint, group === g.id)}>
              {g.label.split(' · ')[0]}
            </button>
          ))}
        </div>

        {GROUPS.map((g) => {
          const list = NODES.filter((n) => n.group === g.id && active(n));
          if (!list.length) return null;
          return (
            <section key={g.id}>
              <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 22, margin: '26px 0 6px', color: 'var(--ink)' }}>
                {g.label} <span className="ed-mono" style={{ fontSize: 12, color: 'var(--faint)' }}>{list.length}</span>
              </h2>
              <p style={{ fontSize: 13, color: 'var(--faint)', margin: '0 0 10px' }}>{g.blurb}</p>
              <div style={{ display: 'grid', gap: 10 }}>
                {list.map((n) => <NodeCard key={n.id} n={n} />)}
              </div>
            </section>
          );
        })}

        <div style={{ marginTop: 26, fontSize: 13.5 }}>
          <Link to="/rh-landscape-dag">General RH DAG →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/frontier-dag">Frontier DAG (open objects) →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/program-dag">Program DAG (permutation program history) →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/no-gos">No-go theorems →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/">← home</Link>
        </div>
      </div>
    </div>
  );
}
