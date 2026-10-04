// HtCorridorCertificatesPage.jsx — feat/ht-corridor-certificates (2026-06-09)
//
// Interval-rigorous Rouché corridor certificates on the de Bruijn–Newman
// heat flow H_{0.18}, imported from the sister twin_ladder_rh_repo engine.
// Purely additive section: data lives in
// src/data/ht-corridor-certificates-2026-06.js.
//
// Editorial (warm) re-theme, 2026-08-19: full-width shell, identical
// structure/data/claims — every number, caveat, and formula kept verbatim.

import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import {
  htCorridorMeta,
  htCorridorCells,
  boundToolkit,
  normalizationPostMortem,
  scopeAssessment,
  honestStatus,
  crossLinks,
} from '../data/ht-corridor-certificates-2026-06.js';

const fmt = (x) => (x === null || x === undefined ? '—' : x.toExponential(3));

const mono = 'var(--ed-mono, var(--font-mono))';

function cardBaseLeft(color) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: '16px 18px',
  };
}

const cardLabel = {
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  color: 'var(--faint)',
  marginBottom: 6,
};

export default function HtCorridorCertificatesPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>{htCorridorMeta.title}</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            First interval-rigorous Rouché corridor certificates on the de Bruijn–Newman
            heat flow <InlineMath tex={'H_{0.18}'} /> in the standard (Polymath15/Tao)
            normalization, with strip height <InlineMath tex={'\\eta = 0.14142'} /> — the
            configuration whose conditional Newman-flow target is{' '}
            <InlineMath tex={'\\Lambda \\le t + \\eta^2/2 = 0.19'} />. Produced 2026-06-09
            by the sister <code>twin_ladder_rh_repo</code> certification engine.
          </p>
          <div style={{ marginTop: 16, maxWidth: 760 }}>
            <BlockMath
              tex={String.raw`H_t(x) = \int_0^\infty e^{tu^2}\,\Phi(u)\cos(xu)\,du,\qquad
\Phi(u) = \sum_{n\ge 1}\bigl(2\pi^2 n^4 e^{9u} - 3\pi n^2 e^{5u}\bigr)e^{-\pi n^2 e^{4u}}`}
            />
          </div>
          <div style={{ ...cardBaseLeft('var(--brass-dk)'), marginTop: 16, maxWidth: 760 }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--brass-dk)', fontWeight: 700 }}>
              {honestStatus.tier}
            </div>
            <div style={{ fontWeight: 600, margin: '6px 0', color: 'var(--ink)' }}>{honestStatus.label}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{honestStatus.body}</div>
          </div>
        </div>

        {/* ── Certified cells ─────────────────────────────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>
          Certified cells (t = {htCorridorMeta.t}, η = {htCorridorMeta.eta}, h = {htCorridorMeta.h})
        </h2>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, marginBottom: 16 }}>
          Each <strong>PIN</strong> row is an unconditional theorem:{' '}
          <InlineMath tex={'H_{0.18}'} /> has exactly one zero inside the
          conjugation-symmetric rectangle{' '}
          <InlineMath tex={'|\\mathrm{Re}\\,x - x_n| \\le h,\\ |\\mathrm{Im}\\,x| \\le \\eta'} />,
          and by Schwarz symmetry that zero is <em>real</em>. The Rouché ratio is{' '}
          <InlineMath tex={'V = E/m'} /> with{' '}
          <InlineMath tex={'E \\ge \\sup_\\Gamma |H_t - G_t|'} /> (rigorous Hermite bound on
          the bridge surrogate) and <InlineMath tex={'m \\le \\inf_\\Gamma |G_t|'} />{' '}
          (Lipschitz-and-net lower bound); <InlineMath tex={'V < 1'} /> transfers the
          surrogate's single zero to <InlineMath tex={'H_t'} />.
        </p>
        <div className="card" style={{ background: 'var(--paper2)', border: '1px solid var(--hairline)', borderRadius: 8, padding: 12, marginBottom: 12, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: mono }}>
            <thead>
              <tr style={{ background: 'color-mix(in srgb, var(--brass-deco) 10%, transparent)', color: 'var(--ink)' }}>
                <th style={{ padding: '8px 10px', textAlign: 'left' }}>cell</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>xₙ(t)</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>u-mesh</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>boundary segs</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>E (rigorous ≥ sup|H−G|)</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>m (rigorous ≤ inf|G|)</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>winding(G)</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>V = E/m</th>
                <th style={{ padding: '8px 10px', textAlign: 'center' }}>status</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>runtime</th>
              </tr>
            </thead>
            <tbody>
              {htCorridorCells.map((c) => (
                <tr key={c.cell} style={{ borderTop: '1px solid var(--hairline)' }}>
                  <td style={{ padding: '6px 10px', textAlign: 'left', color: 'var(--brass-dk)', fontWeight: 700 }}>{c.cell}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'right', color: 'var(--ink-soft)' }}>{c.x.toFixed(4)}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'right', color: 'var(--faint)' }}>{c.mesh}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'right', color: 'var(--faint)' }}>{c.nSeg.toLocaleString()}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'right', color: 'var(--ink-soft)' }}>{fmt(c.E)}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'right', color: 'var(--ink-soft)' }}>{fmt(c.m)}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'right', color: 'var(--blue)' }}>{c.winding ?? '—'}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'right', color: 'var(--ink-soft)' }}>{c.V === null ? '—' : fmt(c.V)}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                    <span style={{
                      fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                      textTransform: 'uppercase', padding: '2px 8px', borderRadius: 10,
                      background: 'color-mix(in srgb, var(--series-3) 14%, transparent)', color: 'var(--green)',
                      border: '1px solid color-mix(in srgb, var(--series-3) 40%, transparent)',
                    }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: '6px 10px', textAlign: 'right', color: 'var(--faint)' }}>{c.runtime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 12, color: 'var(--faint)', marginBottom: 24 }}>{htCorridorMeta.engineModulus}</p>

        {/* ── Bound toolkit ────────────────────────────────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>The verified bound toolkit</h2>
        <div style={{ display: 'grid', gap: 14, marginBottom: 16 }}>
          {boundToolkit.map((item) => (
            <div key={item.id} className="card" style={cardBaseLeft('var(--brass)')}>
              <h3 style={{ fontSize: 16, margin: '0 0 6px' }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>{item.detail}</p>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 760, marginBottom: 24 }}>
          <BlockMath
            tex={String.raw`\frac{E_{\text{direct}}}{E_{\text{2-parts}}} = \frac{(h|z|)^2}{24},
\qquad \frac{E_{\text{3-parts}}}{E_{\text{2-parts}}} = \frac{16}{h|z|}`}
          />
        </div>

        {/* ── Normalization post-mortem ───────────────────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>{normalizationPostMortem.title}</h2>
        <div className="card" style={{ ...cardBaseLeft('var(--terra-dk)'), marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>{normalizationPostMortem.body}</p>
        </div>
        <div style={{ maxWidth: 620, marginBottom: 24 }}>
          <BlockMath tex={String.raw`H_{\text{code},t}(z) = 2\,H_{\text{lit},4t}(2z)`} />
        </div>

        {/* ── Scope assessment ─────────────────────────────────────────── */}
        <h2 className="ed-h2" style={{ marginTop: 24, marginBottom: 12 }}>{scopeAssessment.title}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div className="card" style={cardBaseLeft('var(--green)')}>
            <div style={cardLabel}>What it does establish</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
              {scopeAssessment.does.map((s, i) => (<li key={`d${i}`} style={{ marginBottom: 8 }}>{s}</li>))}
            </ul>
          </div>
          <div className="card" style={cardBaseLeft('var(--terra-dk)')}>
            <div style={cardLabel}>What it does not establish</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
              {scopeAssessment.doesNot.map((s, i) => (<li key={`n${i}`} style={{ marginBottom: 8 }}>{s}</li>))}
            </ul>
          </div>
        </div>

        {/* ── Related sections ─────────────────────────────────────────── */}
        <div className="card" style={cardBaseLeft('var(--brass)')}>
          <div style={cardLabel}>Related sections</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
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

        <footer style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid var(--hairline)', fontSize: 12, color: 'var(--faint)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--ink-soft)' }}>Provenance:</strong> Computed {htCorridorMeta.date} by the sister{' '}
          <code>twin_ladder_rh_repo</code> certification engine (branch{' '}
          <code>exp/corridor-audit-v0</code>).{' '}
          <strong style={{ color: 'var(--ink-soft)' }}>These results are RIGOROUS</strong> — certified interval arithmetic
          (python-flint arb/acb ball arithmetic), no floating-point sampling, no GRH input.
          Unlike the finite-N beat (ESTIMATE, gated on C_H), these corridor certificates
          are unconditional theorems.
        </footer>

        <div style={{ marginTop: 24 }}>
          <Link to="/" style={{ fontSize: 13, color: 'var(--terra-dk)', textDecoration: 'none' }}>← the atlas</Link>
        </div>
      </div>
    </div>
  );
}
