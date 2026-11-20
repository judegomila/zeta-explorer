import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ZETAEXPLORER_NO_GOS, FIELD_NO_GOS } from '../data/rh-no-go-theorems.js';
import { STATUS } from '../styles/tokens.js';

/* No-go index — the standalone index of the no-go landscape (also rendered in
   context on /what-we-know §④). Linked from the home KPI. */

const KIND_COLOR = { theorem: STATUS.proved.fg, barrier: STATUS.nogo.fg, equivalence: STATUS.rhequiv.fg };

function NoGoCard({ n }) {
  return (
    <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, background: 'var(--paper2)', padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
        <strong style={{ color: 'var(--ink)', fontSize: 15 }}>{n.title}</strong>
        <span className="ed-mono" style={{ fontSize: 10, fontWeight: 700, color: KIND_COLOR[n.kind] || 'var(--ink-soft)', border: `1px solid ${KIND_COLOR[n.kind] || 'var(--hairline)'}`, borderRadius: 4, padding: '1px 6px' }}>{n.kind}</span>
        <span className="ed-mono" style={{ fontSize: 11, color: 'var(--faint)' }}>{n.by}</span>
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{n.statement}</div>
      {n.route && <div style={{ marginTop: 6, fontSize: 12.5 }}><Link to={n.route}>open →</Link></div>}
      {n.ref && <div className="ed-mono" style={{ marginTop: 6, fontSize: 10.5, color: 'var(--faint)' }}>{n.ref}</div>}
    </div>
  );
}

export default function NoGosPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div className="ed-lbl">the walls</div>
        <h1 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 38, lineHeight: 1.1, margin: '6px 0 10px', color: 'var(--ink)' }}>
          No-Go Theorems
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          The principal no-go and fundamental-limitation results bearing on RH — the ways a proof is known
          <em> not</em> to be reachable by a given method. This program's findings first, then the field's.
          A curated list, not a claim of exhaustiveness; none proves or disproves RH. The full context lives
          on <Link to="/what-we-know">What We Know</Link>.
        </p>
        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 22, margin: '26px 0 10px', color: 'var(--ink)' }}>
          Found by this program (explorezeta) — {ZETAEXPLORER_NO_GOS.length}
        </h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {ZETAEXPLORER_NO_GOS.map((n) => <NoGoCard key={n.title} n={n} />)}
        </div>
        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 22, margin: '28px 0 10px', color: 'var(--ink)' }}>
          Established results &amp; recognized barriers (the field) — {FIELD_NO_GOS.length}
        </h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {FIELD_NO_GOS.map((n) => <NoGoCard key={n.title} n={n} />)}
        </div>
        <div style={{ marginTop: 26, fontSize: 13.5 }}>
          <Link to="/what-we-know">What We Know →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/state-of-field">State of the Field →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/">← home</Link>
        </div>
      </div>
    </div>
  );
}
