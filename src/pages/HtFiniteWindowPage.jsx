// HtFiniteWindowPage.jsx — ht-finite-window-section (2026-06)
//
// The capstone of the de Bruijn–Newman corridor track: the exterior census
// upgrading the 8 per-cell corridor certificates to an EXACT zero count, plus
// the two negative results that close the corridor route to a Λ record.
// Purely additive section: data lives in
// src/data/ht-finite-window-census-2026-06.js.

import React from 'react';
import { Link } from 'react-router-dom';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import {
  censusMeta,
  censusGaps,
  exactCount,
  crossChecks,
  negativeResults,
  vTrueScaling,
  scopeAssessment,
  crossLinks,
} from '../data/ht-finite-window-census-2026-06.js';

const fmt = (x) => (x === null || x === undefined ? '—' : x.toExponential(3));

export default function HtFiniteWindowPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>{censusMeta.title}</h1>
        <p>
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
        <p style={{ fontSize: '0.9em', opacity: 0.8 }}>{censusMeta.engineModulus}</p>
      </div>

      <section>
        <h2>The exterior census</h2>
        <p>
          Outside the 8 corridors, certify <InlineMath tex={'|H_t| > 0'} /> across
          the full strip <InlineMath tex={'[-\\eta,\\eta]'} /> by tiling each
          inter-corridor gap and subdividing adaptively, routed by{' '}
          <InlineMath tex={'|z|'} />: direct interval quadrature of{' '}
          <InlineMath tex={'H_t'} /> below <InlineMath tex={'x = 10'} /> (where the
          bridge’s <InlineMath tex={'1/z^k'} /> form is singular), and the
          Lipschitz-and-net bound{' '}
          <InlineMath tex={'|H_t| \\ge |G(c)| - r\\,\\sup|G\'| - E'} /> above. The
          strip-wide bound at mesh-step {censusMeta.meshStep} is{' '}
          <InlineMath tex={`E = ${censusMeta.E.toExponential(3)}`} /> — below the
          gap-edge <InlineMath tex={'|G|'} /> even at the high cells.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>gap (Re interval)</th>
                <th>boxes</th>
                <th>worst certified margin</th>
              </tr>
            </thead>
            <tbody>
              {censusGaps.map((g) => (
                <tr key={`${g.reLo}-${g.reHi}`}>
                  <td>
                    [{g.reLo.toFixed(3)}, {g.reHi.toFixed(3)}]
                  </td>
                  <td>{g.boxes.toLocaleString()}</td>
                  <td>{fmt(g.worstMargin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.9em', opacity: 0.8 }}>
          {censusMeta.nGaps} gaps, {censusMeta.totalBoxes.toLocaleString()} boxes,
          all certified zero-free, ≈ {censusMeta.runtimeSeconds} s. The worst
          margin shrinks with <InlineMath tex={'x'} /> as{' '}
          <InlineMath tex={'\\inf|G| \\sim e^{-\\pi x/8}'} />; it stays positive
          throughout.
        </p>
      </section>

      <section>
        <h2>{exactCount.title}</h2>
        <p>{exactCount.body}</p>
        <BlockMath tex={exactCount.windingRule} />
        <p style={{ fontSize: '0.9em', opacity: 0.8 }}>{exactCount.validation}</p>
      </section>

      <section>
        <h2>Three independent confirmations of “exactly 8, all real”</h2>
        {crossChecks.map((c) => (
          <div key={c.title} style={{ marginBottom: '1em' }}>
            <h3>{c.title}</h3>
            <p>{c.detail}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>{negativeResults.title}</h2>
        <p>{negativeResults.intro}</p>
        {negativeResults.items.map((item) => (
          <div key={item.id} style={{ marginBottom: '1em' }}>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </div>
        ))}
        <p>
          Measured true Rouché ratio{' '}
          <InlineMath tex={'V_{\\mathrm{true}} = \\sup|H_t - G_t| / \\inf|G_t|'} />{' '}
          on the cell boundary — fixed vs analytic-conductor-normalized geometry,
          anchored to coincide at cell 1. Both grow; normalization does not help:
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>cell</th>
                <th>γ</th>
                <th>V_true (fixed η)</th>
                <th>V_true (normalized η ~ 1/L)</th>
              </tr>
            </thead>
            <tbody>
              {vTrueScaling.map((r) => (
                <tr key={r.cell}>
                  <td>{r.cell}</td>
                  <td>{r.gamma.toFixed(2)}</td>
                  <td>{fmt(r.vFixed)}</td>
                  <td>{fmt(r.vNormalized)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>{scopeAssessment.title}</h2>
        <h3>What it does establish</h3>
        <ul>
          {scopeAssessment.does.map((s, i) => (
            <li key={`d${i}`}>{s}</li>
          ))}
        </ul>
        <h3>What it does not establish</h3>
        <ul>
          {scopeAssessment.doesNot.map((s, i) => (
            <li key={`n${i}`}>{s}</li>
          ))}
        </ul>
        <h3>The one open direction</h3>
        <p>{scopeAssessment.openDirection}</p>
      </section>

      <section>
        <h2>Related sections</h2>
        <ul>
          {crossLinks.map((l) => (
            <li key={l.to}>
              <Link to={l.to}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </section>

      <footer style={{ marginTop: '2em', paddingTop: '1em', borderTop: '1px solid rgba(128,128,128,0.3)', fontSize: '0.85em', opacity: 0.75 }}>
        <strong>Provenance:</strong> Computed {censusMeta.date} by the sister{' '}
        <code>twin_ladder_rh_repo</code> certification engine (branch{' '}
        <code>exp/corridor-audit-v0</code>).{' '}
        <strong>These results are RIGOROUS</strong> — certified interval arithmetic
        (python-flint arb/acb ball arithmetic), no floating-point sampling, no GRH input.
        Unlike the finite-N beat (ESTIMATE, gated on C_H), this exact zero count is an
        unconditional theorem.
      </footer>
    </div>
  );
}
