// HtCorridorCertificatesPage.jsx — feat/ht-corridor-certificates (2026-06-09)
//
// Interval-rigorous Rouché corridor certificates on the de Bruijn–Newman
// heat flow H_{0.18}, imported from the sister twin_ladder_rh_repo engine.
// Purely additive section: data lives in
// src/data/ht-corridor-certificates-2026-06.js.

import React from 'react';
import { Link } from 'react-router-dom';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import {
  htCorridorMeta,
  htCorridorCells,
  boundToolkit,
  normalizationPostMortem,
  scopeAssessment,
  crossLinks,
} from '../data/ht-corridor-certificates-2026-06.js';

const fmt = (x) => (x === null || x === undefined ? '—' : x.toExponential(3));

export default function HtCorridorCertificatesPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>{htCorridorMeta.title}</h1>
        <p>
          First interval-rigorous Rouché corridor certificates on the de Bruijn–Newman
          heat flow <InlineMath tex={'H_{0.18}'} /> in the standard (Polymath15/Tao)
          normalization, with strip height <InlineMath tex={'\\eta = 0.14142'} /> — the
          configuration whose conditional Newman-flow target is{' '}
          <InlineMath tex={'\\Lambda \\le t + \\eta^2/2 = 0.19'} />. Produced 2026-06-09
          by the sister <code>twin_ladder_rh_repo</code> certification engine.
        </p>
        <BlockMath
          tex={String.raw`H_t(x) = \int_0^\infty e^{tu^2}\,\Phi(u)\cos(xu)\,du,\qquad
\Phi(u) = \sum_{n\ge 1}\bigl(2\pi^2 n^4 e^{9u} - 3\pi n^2 e^{5u}\bigr)e^{-\pi n^2 e^{4u}}`}
        />
      </div>

      <section>
        <h2>Certified cells (t = {htCorridorMeta.t}, η = {htCorridorMeta.eta}, h = {htCorridorMeta.h})</h2>
        <p>
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
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>cell</th><th>xₙ(t)</th><th>u-mesh</th><th>boundary segs</th>
                <th>E (rigorous ≥ sup|H−G|)</th><th>m (rigorous ≤ inf|G|)</th>
                <th>winding(G)</th><th>V = E/m</th><th>status</th><th>runtime</th>
              </tr>
            </thead>
            <tbody>
              {htCorridorCells.map((c) => (
                <tr key={c.cell}>
                  <td>{c.cell}</td>
                  <td>{c.x.toFixed(4)}</td>
                  <td>{c.mesh}</td>
                  <td>{c.nSeg.toLocaleString()}</td>
                  <td>{fmt(c.E)}</td>
                  <td>{fmt(c.m)}</td>
                  <td>{c.winding ?? '—'}</td>
                  <td>{c.V === null ? '—' : fmt(c.V)}</td>
                  <td>{c.status}</td>
                  <td>{c.runtime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.9em', opacity: 0.8 }}>{htCorridorMeta.engineModulus}</p>
      </section>

      <section>
        <h2>The verified bound toolkit</h2>
        {boundToolkit.map((item) => (
          <div key={item.id} style={{ marginBottom: '1em' }}>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </div>
        ))}
        <BlockMath
          tex={String.raw`\frac{E_{\text{direct}}}{E_{\text{2-parts}}} = \frac{(h|z|)^2}{24},
\qquad \frac{E_{\text{3-parts}}}{E_{\text{2-parts}}} = \frac{16}{h|z|}`}
        />
      </section>

      <section>
        <h2>{normalizationPostMortem.title}</h2>
        <p>{normalizationPostMortem.body}</p>
        <BlockMath tex={String.raw`H_{\text{code},t}(z) = 2\,H_{\text{lit},4t}(2z)`} />
      </section>

      <section>
        <h2>{scopeAssessment.title}</h2>
        <h3>What it does establish</h3>
        <ul>
          {scopeAssessment.does.map((s, i) => (<li key={`d${i}`}>{s}</li>))}
        </ul>
        <h3>What it does not establish</h3>
        <ul>
          {scopeAssessment.doesNot.map((s, i) => (<li key={`n${i}`}>{s}</li>))}
        </ul>
      </section>

      <section>
        <h2>Related sections</h2>
        <ul>
          {crossLinks.map((l) => (
            <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
          ))}
        </ul>
      </section>
    </div>
  );
}
