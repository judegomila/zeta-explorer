// HtFiniteWindowPage.jsx — ht-finite-window-section (2026-06)
//
// The capstone of the de Bruijn–Newman corridor track: the exterior census
// upgrading the 8 per-cell corridor certificates to an EXACT zero count, plus
// the two negative results that close the corridor route to a Λ record.
// Purely additive section: data lives in
// src/data/ht-finite-window-census-2026-06.js.
//
// Editorial (warm) re-theme: full-width shell, identical structure/data.

import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import {
  censusMeta,
  censusGaps,
  exactCount,
  crossChecks,
  negativeResults,
  vTrueScaling,
  scopeAssessment,
  honestStatus,
  crossLinks,
} from '../data/ht-finite-window-census-2026-06.js';

const fmt = (x) => (x === null || x === undefined ? '—' : x.toExponential(3));

const MONO = 'var(--ed-mono, var(--font-mono))';

const cardLabel = {
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  color: 'var(--faint)',
  marginBottom: 6,
};

// Editorial card: warm paper background + hairline border, colored left rule.
function cardBaseLeft(color) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: '16px 18px',
  };
}

const thStyle = { padding: '6px 8px' };
const tdStyle = { padding: '6px 8px' };

export default function HtFiniteWindowPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        {/* ── Header ────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>{censusMeta.title}</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.6, maxWidth: 760 }}>
            The 8 per-cell{' '}
            <Link to="/ht-corridor-certificates">corridor certificates</Link> prove{' '}
            <em>one</em> zero each; this exterior census proves there are{' '}
            <em>no others</em> anywhere in the window — upgrading the result to an
            exact count. In the standard (Polymath15/Tao) normalization, with{' '}
            <InlineMath tex={'t = 0.18'} />, <InlineMath tex={'\\eta = 0.14142'} />:
          </p>
          <BlockMath
            tex={String.raw`H_{0.18}\text{ has \textbf{exactly 8 zeros} in }[0,\,86.792]\times[-\eta,\eta],\ \text{all real.}`}
          />
          <BlockMath
            tex={String.raw`H_t(x) = \int_0^\infty e^{tu^2}\,\Phi(u)\cos(xu)\,du`}
          />
          <p style={{ fontSize: 13, color: 'var(--faint)', lineHeight: 1.55, maxWidth: 760 }}>
            {censusMeta.engineModulus}
          </p>
          <div
            className="card"
            style={{ ...cardBaseLeft('var(--brass-dk)'), marginTop: '1em' }}
          >
            <div style={cardLabel}>{honestStatus.tier}</div>
            <div style={{ fontWeight: 700, fontSize: 14, margin: '2px 0 6px', color: 'var(--brass-dk)' }}>
              {honestStatus.label}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
              {honestStatus.body}
            </div>
          </div>
        </div>

        {/* ── The exterior census ──────────────────────────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 8, marginBottom: 12 }}>The exterior census</h2>
        <div className="card" style={{ ...cardBaseLeft('var(--green)'), marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            Outside the 8 corridors, certify <InlineMath tex={'|H_t| > 0'} /> across
            the full strip <InlineMath tex={'[-\\eta,\\eta]'} /> by tiling each
            inter-corridor gap and subdividing adaptively, routed by{' '}
            <InlineMath tex={'|z|'} />: direct interval quadrature of{' '}
            <InlineMath tex={'H_t'} /> below <InlineMath tex={'x = 10'} /> (where the
            bridge's <InlineMath tex={'1/z^k'} /> form is singular), and the
            Lipschitz-and-net bound{' '}
            <InlineMath tex={'|H_t| \\ge |G(c)| - r\\,\\sup|G\'| - E'} /> above. The
            strip-wide bound at mesh-step {censusMeta.meshStep} is{' '}
            <InlineMath tex={`E = ${censusMeta.E.toExponential(3)}`} /> — below the
            gap-edge <InlineMath tex={'|G|'} /> even at the high cells.
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: 12, fontFamily: MONO, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: 'var(--faint)', textAlign: 'left' }}>
                  <th style={thStyle}>gap (Re interval)</th>
                  <th style={thStyle}>boxes</th>
                  <th style={thStyle}>worst certified margin</th>
                </tr>
              </thead>
              <tbody>
                {censusGaps.map((g) => (
                  <tr key={`${g.reLo}-${g.reHi}`} style={{ borderTop: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                    <td style={tdStyle}>
                      [{g.reLo.toFixed(3)}, {g.reHi.toFixed(3)}]
                    </td>
                    <td style={tdStyle}>{g.boxes.toLocaleString()}</td>
                    <td style={tdStyle}>{fmt(g.worstMargin)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, color: 'var(--faint)', marginTop: 10, lineHeight: 1.55 }}>
            {censusMeta.nGaps} gaps, {censusMeta.totalBoxes.toLocaleString()} boxes,
            all certified zero-free, ≈ {censusMeta.runtimeSeconds} s. The worst
            margin shrinks with <InlineMath tex={'x'} /> as{' '}
            <InlineMath tex={'\\inf|G| \\sim e^{-\\pi x/8}'} />; it stays positive
            throughout.
          </p>
        </div>

        {/* ── Exact count ──────────────────────────────────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>{exactCount.title}</h2>
        <div className="card" style={{ ...cardBaseLeft('var(--brass)'), marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{exactCount.body}</p>
          <BlockMath tex={exactCount.windingRule} />
          <p style={{ fontSize: 12, color: 'var(--faint)', lineHeight: 1.55 }}>{exactCount.validation}</p>
        </div>

        {/* ── Cross checks ─────────────────────────────────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>
          Three independent confirmations of &ldquo;exactly 8, all real&rdquo;
        </h2>
        <div style={{ display: 'grid', gap: 14, marginBottom: 24 }}>
          {crossChecks.map((c) => (
            <div key={c.title} className="card" style={cardBaseLeft('var(--blue)')}>
              <h3 style={{ fontSize: 14, margin: '0 0 6px' }}>{c.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>{c.detail}</p>
            </div>
          ))}
        </div>

        {/* ── Negative results ─────────────────────────────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>{negativeResults.title}</h2>
        <div className="card" style={{ ...cardBaseLeft('var(--terra-dk)'), marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{negativeResults.intro}</p>
        </div>
        <div style={{ display: 'grid', gap: 14, marginBottom: 16 }}>
          {negativeResults.items.map((item) => (
            <div key={item.id} className="card" style={cardBaseLeft('var(--terra-dk)')}>
              <h3 style={{ fontSize: 14, margin: '0 0 6px' }}>{item.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>{item.detail}</p>
            </div>
          ))}
        </div>
        <div className="card" style={{ ...cardBaseLeft('var(--terra-dk)'), marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            Measured true Rouché ratio{' '}
            <InlineMath tex={'V_{\\mathrm{true}} = \\sup|H_t - G_t| / \\inf|G_t|'} />{' '}
            on the cell boundary — fixed vs analytic-conductor-normalized geometry,
            anchored to coincide at cell 1. Both grow; normalization does not help:
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: 12, fontFamily: MONO, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: 'var(--faint)', textAlign: 'left' }}>
                  <th style={thStyle}>cell</th>
                  <th style={thStyle}>γ</th>
                  <th style={thStyle}>V_true (fixed η)</th>
                  <th style={thStyle}>V_true (normalized η ~ 1/L)</th>
                </tr>
              </thead>
              <tbody>
                {vTrueScaling.map((r) => (
                  <tr key={r.cell} style={{ borderTop: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                    <td style={tdStyle}>{r.cell}</td>
                    <td style={tdStyle}>{r.gamma.toFixed(2)}</td>
                    <td style={tdStyle}>{fmt(r.vFixed)}</td>
                    <td style={tdStyle}>{fmt(r.vNormalized)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Scope assessment ─────────────────────────────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>{scopeAssessment.title}</h2>
        <div className="card" style={{ ...cardBaseLeft('var(--brass-dk)'), marginBottom: 24 }}>
          <h3 style={{ fontSize: 13, color: 'var(--green)', margin: '0 0 8px' }}>What it does establish</h3>
          <ul style={{ margin: '0 0 16px 18px', padding: 0, fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            {scopeAssessment.does.map((s, i) => (
              <li key={`d${i}`} style={{ marginBottom: 6 }}>{s}</li>
            ))}
          </ul>
          <h3 style={{ fontSize: 13, color: 'var(--terra-dk)', margin: '0 0 8px' }}>What it does not establish</h3>
          <ul style={{ margin: '0 0 16px 18px', padding: 0, fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            {scopeAssessment.doesNot.map((s, i) => (
              <li key={`n${i}`} style={{ marginBottom: 6 }}>{s}</li>
            ))}
          </ul>
          <h3 style={{ fontSize: 13, color: 'var(--brass-dk)', margin: '0 0 8px' }}>The one open direction</h3>
          <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            {scopeAssessment.openDirection}
          </p>
        </div>

        {/* ── Related sections ──────────────────────────────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>Related sections</h2>
        <div className="card" style={{ ...cardBaseLeft('var(--brass)'), marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {crossLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                style={{ fontSize: 12, color: 'var(--brass-dk)', textDecoration: 'none' }}
              >
                → {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Footer / provenance ───────────────────────────────────────── */}
        <footer
          style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: '1px solid var(--hairline)',
            fontSize: 12,
            color: 'var(--faint)',
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: 'var(--ink-soft)' }}>Provenance:</strong> Computed {censusMeta.date} by the sister{' '}
          <code>twin_ladder_rh_repo</code> certification engine (branch{' '}
          <code>exp/corridor-audit-v0</code>).{' '}
          <strong style={{ color: 'var(--green)' }}>These results are RIGOROUS</strong> — certified interval arithmetic
          (python-flint arb/acb ball arithmetic), no floating-point sampling, no GRH input.
          Unlike the finite-N beat (ESTIMATE, gated on C_H), this exact zero count is an
          unconditional theorem.
          <div style={{ marginTop: 12 }}>
            <Link to="/" style={{ color: 'var(--terra-dk)', textDecoration: 'none' }}>← the atlas</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
