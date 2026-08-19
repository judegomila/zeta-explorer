import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { CRITICAL_LINE_PROPORTION as RECORDS, RH_TARGET } from '../data/critical-line-proportion.js';

/* The critical-line-proportion dimension: κ = proportion of nontrivial zeros PROVEN
   on Re s = 1/2. RH ⟺ κ = 100%. Sibling to the Λ-bound timeline. All values are
   peer-reviewed literature results (not project claims). */

const pct = (p) => (p == null ? null : (p * 100));
const current = RECORDS.filter((r) => r.proportion != null).slice(-1)[0];

export default function CriticalLineProportionPage() {
  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>record: ≥ {pct(current.proportion).toFixed(2)}% on the line</span>} />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div className="ed-lbl">the critical-line proportion</div>
        <h1 className="ed-h1" style={{ fontSize: 'clamp(26px,3.6vw,38px)', marginTop: 6 }}>
          Zeros proven <em className="ed-terra">on the line</em>
        </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 17, maxWidth: '60ch', marginTop: 12 }}>
          A second classical dimension of progress on the Riemann Hypothesis, distinct from the de Bruijn–Newman Λ
          bound and from verified zero height: the proportion <b>κ</b> of nontrivial zeros <em>proven</em> to lie on
          the critical line Re s = ½. RH is exactly the statement that <b>κ = 100%</b>. The current unconditional
          record is <b>≥ {pct(current.proportion).toFixed(2)}%</b> ({current.label.replace(/^≥\s*/, '')}, {current.authors.join(', ')}, {current.year}).
        </p>

        {/* progress bar 0 -> current -> 100 */}
        <div style={{ margin: '34px 0 40px' }}>
          <div className="ed-lbl" style={{ marginBottom: 10 }}>0% → current record → 100% (RH)</div>
          <div style={{ position: 'relative', height: 26, background: 'var(--paper2)', border: '1px solid var(--hairline)', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${pct(current.proportion)}%`, background: 'var(--brass)', opacity: 0.35 }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${pct(current.proportion)}%`, width: 2, background: 'var(--brass-dk)' }} />
          </div>
          <div style={{ position: 'relative', height: 20, fontFamily: 'var(--ed-mono)', fontSize: 11, color: 'var(--faint)' }}>
            <span style={{ position: 'absolute', left: 0 }}>0%</span>
            <span style={{ position: 'absolute', left: `${pct(current.proportion)}%`, transform: 'translateX(-50%)', color: 'var(--brass-dk)' }}>
              {pct(current.proportion).toFixed(1)}% (2020)
            </span>
            <span style={{ position: 'absolute', right: 0, color: 'var(--terra-dk)' }}>100% = RH</span>
          </div>
        </div>

        {/* records table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: 'var(--paper2)', textAlign: 'left' }}>
              <th style={{ padding: '8px 10px', borderBottom: '1px solid var(--hairline)', fontFamily: 'var(--ed-mono)', fontSize: 11, color: 'var(--faint)' }}>YEAR</th>
              <th style={{ padding: '8px 10px', borderBottom: '1px solid var(--hairline)', fontFamily: 'var(--ed-mono)', fontSize: 11, color: 'var(--faint)' }}>RECORD</th>
              <th style={{ padding: '8px 10px', borderBottom: '1px solid var(--hairline)', fontFamily: 'var(--ed-mono)', fontSize: 11, color: 'var(--faint)' }}>WHO</th>
              <th style={{ padding: '8px 10px', borderBottom: '1px solid var(--hairline)', fontFamily: 'var(--ed-mono)', fontSize: 11, color: 'var(--faint)' }}>METHOD</th>
            </tr>
          </thead>
          <tbody>
            {RECORDS.map((r, i) => (
              <tr key={i} style={{ background: r.current ? 'rgba(140,106,29,0.06)' : 'transparent' }}>
                <td style={{ padding: '10px', borderBottom: '1px solid var(--hairline)', fontFamily: 'var(--ed-mono)', color: 'var(--ink-soft)', verticalAlign: 'top' }}>{r.year}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid var(--hairline)', fontFamily: 'var(--ed-mono)', color: r.current ? 'var(--brass-dk)' : 'var(--ink)', fontWeight: 600, verticalAlign: 'top', whiteSpace: 'nowrap' }}>{r.label}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid var(--hairline)', color: 'var(--ink)', verticalAlign: 'top' }}>{r.authors.join(', ')}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid var(--hairline)', color: 'var(--ink-soft)', verticalAlign: 'top' }}>
                  {r.method}
                  <div style={{ fontFamily: 'var(--ed-mono)', fontSize: 11, color: 'var(--faint)', marginTop: 4 }}>{r.citation}</div>
                </td>
              </tr>
            ))}
            <tr style={{ background: 'rgba(217,80,46,0.05)' }}>
              <td style={{ padding: '10px', fontFamily: 'var(--ed-mono)', color: 'var(--terra-dk)', fontWeight: 600 }}>goal</td>
              <td style={{ padding: '10px', fontFamily: 'var(--ed-mono)', color: 'var(--terra-dk)', fontWeight: 600, whiteSpace: 'nowrap' }}>{RH_TARGET.label}</td>
              <td style={{ padding: '10px', color: 'var(--ink-soft)' }} colSpan={2}>κ = 100% is the Riemann Hypothesis. The 100% − {pct(current.proportion).toFixed(2)}% gap is what remains open on this axis.</td>
            </tr>
          </tbody>
        </table>

        <div className="ed-thm" style={{ borderLeftColor: 'var(--brass)', marginTop: 30 }}>
          <div className="tlab">Scope</div>
          <p>These are rigorous, unconditional <em>lower bounds</em> on the proportion of zeros on the line — a
            different axis from the Λ bound (Platt–Trudgian Λ ≤ 0.2, the rigorous benchmark) and from verified zero
            height (X ≈ 3×10¹²). None of them proves RH; RH is the limit κ → 100%. This project's twin-ladder work
            targets the Λ / verified-height axis, not this proportion.</p>
        </div>

        <div className="ed-postfoot" style={{ marginTop: 34 }}>
          Related: <Link to="/lambda-timeline">the Λ-bound timeline</Link> · <Link to="/pt-floor-audit">what binds the Λ floor</Link>
          {' · '}<Link to="/route-map">the wall map</Link><br /><br />← <Link to="/">the atlas</Link>
        </div>
      </div>
    </div>
  );
}
