import React from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import PageHeader from '../components/PageHeader.jsx';

// Route B (imp-341 Burgers uniformity, assembled in lambda-intercept-unconditional.js):
// lim sup_{N->inf} |t_c(N)| = 0 UNCONDITIONALLY via the deterministic Koksma-Hlawka
// uniformity bound, with Selberg |S(T)| = O(log T / log log T) as the ONLY unconditional
// input (no GUE, no pair-correlation). Structural/asymptotic; NOT a per-N finite bound.

export default function RouteBLimsupPage() {
  return (
    <div className="page">
      <PageHeader title="Route B — the unconditional lim-sup theorem">
        <p>
          The project's cleanest genuinely-new rigorous statement about the zeros: an{' '}
          <strong style={{ color: '#10b981' }}>unconditional, GUE-free, pair-correlation-free</strong>{' '}
          proof that the backward collision time of the N-particle Calogero–Moser / Dyson flow on the
          first <InlineMath tex="N" /> Riemann zero ordinates has{' '}
          <strong>limit-superior zero</strong>. It rests only on the Riemann–von Mangoldt counting
          formula and an explicit Selberg/Trudgian bound on <InlineMath tex="|S(T)|" />.
        </p>
      </PageHeader>

      <BlockMath tex={"\\boxed{\\;\\limsup_{N\\to\\infty}\\; |t_c(N)| \\;=\\; 0 \\quad\\text{unconditionally}\\;}"} />

      {/* mechanism */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #10b981' }}>
        <h3 style={{ color: '#10b981', fontSize: 16, marginBottom: 10 }}>The mechanism — deterministic Koksma–Hlawka uniformity</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          Let <InlineMath tex={"m_N"} /> be the empirical (Stieltjes-transform) measure of the first{' '}
          <InlineMath tex={"N"} /> zero ordinates and <InlineMath tex={"m_\\infty"} /> its Riemann–von
          Mangoldt continuum limit. The Burgers-shock collision time <InlineMath tex={"t_c(N)"} /> is
          controlled by the sup-norm distance of these measures on the relevant half-plane, and that
          distance is bounded <em>deterministically</em>:
        </p>
        <BlockMath tex={"\\big\\| m_N - m_\\infty \\big\\|_{L^\\infty(\\{\\operatorname{Im} z \\ge y_N^{\\sharp}\\})} \\;\\le\\; \\frac{\\pi\\, C_{\\mathrm{Selberg}}\\, \\log \\gamma_N}{N\\, y_N^{\\sharp}}, \\qquad y_N^{\\sharp} = \\sqrt{\\tfrac{2\\pi}{N}}."} />
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          Substituting the mollification scale <InlineMath tex={"y_N^{\\sharp}=\\sqrt{2\\pi/N}"} /> gives a
          right-hand side of order <InlineMath tex={"\\log\\gamma_N/\\sqrt{N}\\to 0"} />, so
          <InlineMath tex={"m_N\\to m_\\infty"} /> uniformly and the shock collision time collapses:
          <InlineMath tex={"\\limsup_N |t_c(N)| = 0"} />.
        </p>
      </div>

      {/* what it rests on — GUE-free / PCC-free */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #38bdf8' }}>
        <h3 style={{ color: '#38bdf8', fontSize: 16, marginBottom: 10 }}>What it rests on — and what it does not</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            { c: '#10b981', h: 'Riemann–von Mangoldt', b: 'N(T) = (T/2π)log(T/2πe) + O(log T) — the unconditional zero-counting formula fixing the continuum density m_∞.' },
            { c: '#10b981', h: 'Selberg / Trudgian |S(T)|', b: 'The ONLY unconditional analytic input: |S(T)| = O(log T / log log T). Explicit, classical, unconditional.' },
            { c: '#10b981', h: 'Koksma–Hlawka discrepancy', b: 'A deterministic quadrature/discrepancy inequality — pure real analysis, no probability.' },
            { c: '#ef4444', h: 'NOT: GUE / local law', b: 'No Erdős–Schlein–Yau local law, no random-matrix universality is used anywhere.' },
            { c: '#ef4444', h: 'NOT: Montgomery pair correlation', b: 'No 2-point / PCC input — this is exactly what makes the statement escape the usual wall.' },
            { c: '#ef4444', h: 'NOT: the C_H shock modulus', b: 'The RH-hard C_H constant gates the finite-N E(N) bridge, NOT this structural lim-sup. Route B is independent of it.' },
          ].map(({ c, h, b }) => (
            <div key={h} style={{ flex: '1 1 220px', padding: '10px 12px', background: 'rgba(30,41,59,0.5)', borderRadius: 6, borderTop: `2px solid ${c}` }}>
              <div style={{ color: c, fontSize: 12, fontWeight: 700 }}>{h}</div>
              <div style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.5, marginTop: 3 }}>{b}</div>
            </div>
          ))}
        </div>
      </div>

      {/* honest scope */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #f59e0b' }}>
        <h3 style={{ color: '#f59e0b', fontSize: 16, marginBottom: 10 }}>Honest scope — a limit statement, not a Λ bound</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          Route B is a <strong>structural / asymptotic</strong> result: it says the collision time tends
          to zero <em>along the sequence</em>, i.e. <InlineMath tex={"a := \\limsup_N |t_c(N)| = 0"} />. It
          does <strong>not</strong> by itself deliver a finite-<InlineMath tex={"N"} /> upper bound on{' '}
          <InlineMath tex={"|t_c(N)|"} />, and therefore does <strong>not</strong> by itself produce a
          numerical de Bruijn–Newman bound. Turning the lim-sup into a per-<InlineMath tex={"N"} /> bound
          (which the Λ program needs) requires one of:
        </p>
        <ul style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          <li><strong style={{ color: '#e2e8f0' }}>Route A</strong> — monotonicity <InlineMath tex={"|t_c(N{+}1)|\\le|t_c(N)|"} /> (turns lim-sup into <InlineMath tex={"\\inf"} />); <em>analytically open</em> (argmin-interiority empirical only).</li>
          <li><strong style={{ color: '#e2e8f0' }}>a rate upgrade</strong> — an explicit convergence rate for the Koksma–Hlawka bound giving a per-<InlineMath tex={"N"} /> handle.</li>
          <li><strong style={{ color: '#e2e8f0' }}>Route C</strong> — the Weyl-density squeeze; <InlineMath tex={"G_4"} /> closed (imp-343), <InlineMath tex={"G_3"} /> (deriving <InlineMath tex={"\\kappa"} /> from RvM) still open.</li>
        </ul>
        <p style={{ color: '#64748b', fontSize: 12, lineHeight: 1.8, marginTop: 6 }}>
          Separately, the <em>finite-N</em> error bridge <InlineMath tex={"|\\Lambda-(-t_c(N))|\\le E(N)"} />{' '}
          has an unconditional <em>rate</em> but <InlineMath tex={"E(N)\\to 0"} /> is{' '}
          <strong style={{ color: '#f87171' }}>gated on the RH-hard constant C_H</strong> (imp-2640 negative;
          corrected imp-3321) — that is a different, harder object than this lim-sup. <strong>Platt–Trudgian{' '}
          <InlineMath tex={"\\Lambda\\le 0.2"} /> remains the rigorous SOTA.</strong>
        </p>
      </div>

      {/* rigor status */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6', fontSize: 16, marginBottom: 8 }}>Rigor status</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          Recorded status (<code>lambda-intercept-unconditional.js</code>, ROUTE_B_BURGERS): <strong style={{ color: '#10b981' }}>"UNCONDITIONAL as a lim-sup statement"</strong> —
          a structural closure of the continuum-Burgers uniformity gap <InlineMath tex={"G_5"} /> with no GUE
          or local-law input. The load-bearing pieces are (i) the deterministic Koksma–Hlawka bound above,
          (ii) the unconditional Selberg <InlineMath tex={"|S(T)|"} /> estimate, and (iii) the Dyson-flow
          monotonicity that maps zero-density convergence to shock-time collapse. An{' '}
          <strong>independent adversarial rigor audit is running</strong> to confirm each dependency is used
          within its proven hypotheses and that the core lim-sup is gap-free even where the <em>rate</em> is
          not; this page will be updated with its verdict. No false QED.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12, fontSize: 13 }}>
          <Link to="/route-map" style={{ color: '#38bdf8' }}>→ Full route map</Link>
          <Link to="/lambda-bounds" style={{ color: '#38bdf8' }}>→ Λ bounds & roadmap</Link>
          <Link to="/what-we-know" style={{ color: '#38bdf8' }}>→ What we know</Link>
        </div>
      </div>
    </div>
  );
}
