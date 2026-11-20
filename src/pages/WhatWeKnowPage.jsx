import React from 'react';
import { Link } from 'react-router-dom';
import PostLayout, { TheoremBox, Pull } from '../components/editorial/PostLayout.jsx';
import WireframeAnim from '../components/editorial/WireframeAnim.jsx';
import { FULL_ROUTE_MAP } from '../data/full-route-map-2026-06-19.js';
import { CH_WALL_FRONTIER } from '../data/ch-wall-frontier-verdict-2026-06-26.js';
import { ZETAEXPLORER_NO_GOS, FIELD_NO_GOS } from '../data/rh-no-go-theorems.js';
import { STATUS } from '../styles/tokens.js';

const KIND_COLOR = { theorem: STATUS.proved.fg, barrier: STATUS.nogo.fg, equivalence: STATUS.rhequiv.fg };

function NoGoList({ items }) {
  return (
    <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
      {items.map((n) => (
        <div key={n.title} style={{ border: '1px solid var(--hairline)', borderRadius: 8, background: 'var(--paper2)', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
            <strong style={{ color: 'var(--ink)', fontSize: 14.5 }}>{n.title}</strong>
            <span className="ed-mono" style={{ fontSize: 10, fontWeight: 700, color: KIND_COLOR[n.kind] || 'var(--ink-soft)', border: `1px solid ${KIND_COLOR[n.kind] || 'var(--hairline)'}`, borderRadius: 4, padding: '1px 6px' }}>{n.kind}</span>
            <span className="ed-mono" style={{ fontSize: 11, color: 'var(--faint)' }}>{n.by}</span>
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{n.statement}</div>
          {n.route && <div style={{ marginTop: 6, fontSize: 12.5 }}><Link to={n.route}>open →</Link></div>}
          {n.ref && <div className="ed-mono" style={{ marginTop: 6, fontSize: 10.5, color: 'var(--faint)' }}>{n.ref}</div>}
        </div>
      ))}
    </div>
  );
}

/*
 * What We Know — the consolidated, artifact of everything this project has
 * established about zeta, RH, and the primes. Reads the verdict modules; authored
 * connective prose. The discipline is calibrated clarity: no RH proof, no beat of
 * the Lambda record -- but a rigorously MAP of where the walls are and why.
 *
 * Editorial (warm) restyle of the legacy dark page. Every claim, count, and status
 * label is preserved verbatim.
 */

const ROUTE_COUNT = FULL_ROUTE_MAP.totalRoutes;

const OVERCLAIMS = [
  ['Λ ≤ 0.0X at height 10¹³', 'frozen κ_T at T₀=3000 applied at 10¹³ — a height-mismatch artifact'],
  ['Wiener–Hopf ‖K_a‖ ≤ 1/a', '‖K_a‖ actually ~ e^{aT}; the bound was false'],
  ['§27 collapse identity', 'block-positivity ⟺ K_a-PSD refuted by a scale-invariance argument'],
  ['Volterra "5000× margin"', 'a homogeneity artifact — measuring a scale-miscalibrated operator'],
  ['finite-N*=10⁴ "beat"', 'an ESTIMATE, not rigorous — C_H is undischargeable'],
  ['the operator "collapse"', 'RH-equivalent, a reformulation — not a reduction'],
];

export default function WhatWeKnowPage() {
  return (
    <PostLayout
      grade="NO-GO"
      meta={[`${ROUTE_COUNT} mapped routes`, 'calibrated clarity']}
      title="What We Know"
      dek={
        <>The consolidated, state of what this project has actually figured out about
        ζ, the Riemann Hypothesis, and the primes — where the walls are and why.</>
      }
      byline={['mathexplorer', 'no RH proof · no beat of the Λ record']}
      ticker={<span>no-go theorems · the remaining gap, located</span>}
      footer={<>
        Related: <Link to="/frontier-dag">The frontier DAG</Link>
        {' · '}<Link to="/route-map">The wall map</Link>
        {' · '}<Link to="/rigor-dashboard">Rigor Dashboard</Link>
        {' · '}<Link to="/prime-rigidity">Prime rigidity</Link>
        {' · '}<Link to="/vortex-field">Vortex field</Link>
        {' · '}<Link to="/obstruction-seam">Obstruction seam</Link>
        {' · '}<Link to="/flow-blindness-no-go">Flow-blindness no-go</Link>
        <br /><br />← <Link to="/">home</Link>
      </>}
    >
      <p className="lead">
        The discipline throughout is calibrated clarity — so the headline first:{' '}
        <strong>RH is not proved. The standalone repository presents
        Λ ≤ 0.1787854 as a computer-assisted candidate for an unconditional proof.
        The bound is not established, has been reviewed by Dan Romik, and is not RH.</strong> Across{' '}
        <strong>{ROUTE_COUNT} mapped routes</strong>, every surviving route from a positive
        Newman bound to RH is still open, RH-equivalent, or dead.
      </p>

      <figure style={{ maxWidth: 460, border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden', margin: '18px auto', background: 'var(--paper)' }}>
        <WireframeAnim kind="no-go-wall" />
      </figure>

      <h2>① Established results and the separately graded candidates</h2>
      <ul style={{ paddingLeft: 20, lineHeight: 1.75 }}>
        <li><strong>Standalone private-review Newman candidate:</strong> <strong>Λ ≤ 0.1787854</strong> is a computer-assisted candidate for an unconditional proof. Its package claims a compact-slab and final-time-half-strip closure, full material replay, corrected errors, and exact Polymath weld. The bound is not established, has been reviewed by Dan Romik, and is not RH.</li>
        <li><strong>Sharper Newman candidate:</strong> <strong>Λ ≤ 0.1758354</strong> — a computer-assisted candidate with four gates certified in Arb and a Lean-checked y-transfer reduction and Lemma B3. Unrefereed; not established. <Link to="/lambda-01758354-candidate">detail →</Link></li>
        <li><strong>Λ ≤ 0.14 completion contract:</strong> a conditional contract, <em>not a bound</em> — the freeze-calculus / [B_v, Π_p]-weld route reduces the strict value to exactly one open family: the enclosure |C_E,17| {'<'} 0.2796881955526147 on 690988 ≤ N ≤ 54799999. Nothing is claimed unless that family closes. <Link to="/permutation-architecture">detail →</Link></li>
        <li><strong>Literature grades:</strong> <strong>Λ ≥ 0</strong> (Rodgers–Tao 2020) and the peer-reviewed upper benchmark <strong>Λ ≤ 0.2</strong> (Platt–Trudgian 2021). RH ⟺ Λ = 0.</li>
        <li><strong>Route B (Burgers / Koksma–Hlawka lim-sup):</strong> an unconditional, GUE-free, pair-correlation-free proof that lim supₙ |t_c(N)| = 0 for the N-particle Calogero–Moser/Dyson flow that models the zeros. This subsidiary theorem does not close the bridge to RH.</li>
        <li><strong>The Θ-trap theorems:</strong> Θ ≤ 1/4 as an unconditional flow invariant; the exact identity dg/ds = −(4/g)(1−Θ); Corollary A1 (t_c^part ≤ g_min²/6). Rigorous CM-flow algebra.</li>
        <li><strong>The R2-T isolation constants</strong> closed in closed form: c* = √(2+√3) − 1 ≈ 0.9319 (single-shell) and, since 2026-08-28, the global asymmetric constant c_glob = c_half = 0.8980208880762339 (unique root of the half-lattice rate bound) — the deterministic frontier residual, resolved. Improves no Λ bound.</li>
      </ul>

      <div className="ed-thm" style={{ borderLeftColor: 'var(--brass)' }}>
        <div className="tlab">CURRENT FRONTIER (2026-09)</div>
        <ul style={{ paddingLeft: 20, lineHeight: 1.75, margin: 0 }}>
          <li><strong>Λ ≤ 0.17759432 y-thaw package</strong> — candidate-unrefereed; 4 of 8 obligations closed, O1 at Aristotle; a package value, not a bound. Detail: <Link to="/threads">Research Threads</Link>.</li>
          <li><strong>Route VII derived floor:</strong> the reachable-floor analysis puts the compute-derived floor at U ≈ 0.145–0.150; below it requires arithmetic input. Detail: <Link to="/frontier-dag">Frontier DAG</Link>.</li>
          <li><strong>Inertia-PCC verdict:</strong> the inertia route meets the same pair-correlation wall (λ_max(ρ) = 0.6231344958476320). Detail: <Link to="/threads">Research Threads</Link>.</li>
        </ul>
      </div>

      <h2>② The two frontier walls — fully characterized</h2>
      <p>
        Every surviving mapped route seeking to drive the positive bound all the way to
        Λ = 0 funnels into one of two RH-hard objects. Both have been driven to ground by
        deliberate skeptical push.
      </p>

      <div className="ed-thm" style={{ borderLeftColor: 'var(--terra, #b5563f)' }}>
        <div className="tlab" style={{ color: 'var(--terra, #b5563f)' }}>
          C_H WALL — {CH_WALL_FRONTIER.verdict}
        </div>
        <div>
          The finite-height approach reduces to one constant, C_Lip (gap-Lipschitz at the
          zero-collision). The Lipschitz route to bounding it is <strong>provably closed three ways</strong>:
          a Hölder-½ lower bound C_Lip ≥ C_shock/(2√W₁) → ∞; a linear-N norm-mismatch
          (the metric W₁ dilutes a 2-particle collision across all N); and every surrogate refuted.
          <strong> Genuine fallout:</strong> the famous ∫2/g² divergence is a
          pure coordinate artifact — in h = g² it cancels exactly to C_shock².
        </div>
      </div>

      <div className="ed-thm" style={{ borderLeftColor: 'var(--brass)' }}>
        <div className="tlab">§26 μ^pass / VOLTERRA — RH-EQUIVALENT</div>
        <div>
          The elegant "7+ conjectures collapse to one operator-norm bound ‖V‖≤1" idea is
          <strong> PCC-free</strong> (real, surprising) but <strong>not a reduction</strong>: the collapse
          identity was refuted, and the surviving target is RH-equivalent — confirmed now at the
          <em> operator</em> level. The endpoint-bridge measure is mass-feasible (budget 2,400–20,000× the
          deficit) but the required <em>sign-positivity</em>, derived from Φ alone, <strong>is</strong> K_a ≥ 0 itself.
        </div>
      </div>

      <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
        Detail: <Link to="/route-map">Route Map</Link> · <Link to="/rigor-dashboard">Rigor Dashboard</Link>
      </p>

      <h2>③ The meta-finding (the most valuable result)</h2>
      <p>
        Across {ROUTE_COUNT} routes, a uniform pattern: <strong>every promising route, under
        skeptical scrutiny, turns out to be either not rigorous (the C_H wall) or RH-equivalent
        (a reformulation).</strong> There is no hidden shortcut below RH anywhere in the map — only
        elegant restatements, each as hard as RH, and they all ultimately meet the same
        two-sided pair-correlation / GUE wall. Knowing <em>precisely</em> where the walls are,
        and that they are all the same wall, is the project's hardest-won knowledge.
      </p>

      <Pull>
        There is no hidden shortcut below RH anywhere in the map — only elegant restatements,
        each as hard as RH, all meeting the same wall.
      </Pull>

      <h2>④ The no-go landscape — the walls, ours and the field's</h2>
      <p style={{ color: 'var(--ink-soft)' }}>
        The principal no-go and fundamental-limitation results bearing on RH — the ways a proof is
        known <em>not</em> to be reachable by a given method. This program's own findings first, then the
        established results and recognized barriers from the wider field. A curated list of the principal
        results, not a claim of exhaustiveness; none proves or disproves RH.
        The same data module renders the standalone index at <Link to="/no-gos">/no-gos</Link>.
      </p>
      <h3 style={{ fontSize: 15, color: 'var(--ink)', marginTop: 16, marginBottom: 2 }}>Found by this program (explorezeta)</h3>
      <NoGoList items={ZETAEXPLORER_NO_GOS} />
      <h3 style={{ fontSize: 15, color: 'var(--ink)', marginTop: 20, marginBottom: 2 }}>Established results &amp; recognized barriers (the field)</h3>
      <NoGoList items={FIELD_NO_GOS} />

      <h2>⑤ The verification discipline — six overclaims caught and withdrawn</h2>
      <p style={{ color: 'var(--ink-soft)' }}>
        The map is trustworthy because confident-looking claims were independently refuted
        <em> before</em> they became results. The ledger:
      </p>
      <div style={{ display: 'grid', gap: 6 }}>
        {OVERCLAIMS.map(([claim, why]) => (
          <div key={claim} style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 12, fontSize: 14, padding: '6px 10px', background: 'var(--faint)', borderRadius: 4 }}>
            <span style={{ color: 'var(--terra, #b5563f)', textDecoration: 'line-through' }}>{claim}</span>
            <span style={{ color: 'var(--ink-soft)' }}>{why}</span>
          </div>
        ))}
      </div>

      <h2>⑥ About the primes specifically</h2>
      <ul style={{ paddingLeft: 20, lineHeight: 1.75 }}>
        <li><strong>Caustics = multiplicative resonances.</strong> In the log-phase field θ = t·log n, bright bands form where log(p_i/p_j) ≈ 2πk/t — the same oscillatory structure as the explicit formula's x^ρ kernel.</li>
        <li><strong>Prime rigidity is demonstrable.</strong> Real primes produce coherent caustics; randomize the logs and they dissolve into noise — a vivid face of "the primes are arithmetic, not random." <Link to="/prime-rigidity">(see it)</Link></li>
        <li><strong>Zeros are phase vortices</strong> of V_t = H_t′/H_t; winding ±1 = the argument principle; vortex-exclusion ⟺ RH. The winding-as-order-parameter re-derives Λ ≥ 0 cleanly but, does not go past it. <Link to="/vortex-field">(see it)</Link></li>
      </ul>

      <h2>One-sentence version</h2>
      <TheoremBox label="Bottom line">
        <p style={{ margin: 0 }}>
          The standalone repository presents
          <strong> Λ ≤ 0.1787854</strong> as a computer-assisted candidate for an
          unconditional proof; the bound is not established, has been reviewed by Dan Romik, and is not RH.
          A sharper candidate, <Link to="/lambda-01758354-candidate"><strong>Λ ≤ 0.1758354</strong></Link> (four
          Arb-certified gates + a Lean-checked y-transfer reduction and Lemma B3), is likewise unrefereed. The{' '}
          <Link to="/permutation-architecture"><strong>Λ ≤ 0.14</strong> completion contract</Link> is a
          conditional contract, not a bound — reduced to one open family. The exact global Twin Ladder
          residual inequality remains equivalent to RH, and RH itself remains open.
        </p>
      </TheoremBox>
    </PostLayout>
  );
}
