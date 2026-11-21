import React from 'react';
import { Link } from 'react-router-dom';
import PostLayout, { TheoremBox, Pull } from '../components/editorial/PostLayout.jsx';
import WireframeAnim from '../components/editorial/WireframeAnim.jsx';
import { FULL_ROUTE_MAP } from '../data/full-route-map-2026-06-19.js';
import { CH_WALL_FRONTIER } from '../data/ch-wall-frontier-verdict-2026-06-26.js';
import { ZETAEXPLORER_NO_GOS, FIELD_NO_GOS } from '../data/rh-no-go-theorems.js';
import { STATUS } from '../styles/tokens.js';
import { RH_DIRECTION_AUDIT as AUDIT } from '../data/rh-direction-audit-2026-09-30.js';
import { PROGRAM_STATUS_AS_OF, PROGRAM_STATUS_SUMMARY } from '../data/program-status-current.js';
import { AsOfLine, CurrentStatusList } from '../components/ProgramStatus.jsx';

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
  ['the operator "collapse"', 'the bare norm equivalence is refuted; the exact signed positivity target remains open'],
  ['pole-free positivity needs a separate pole-inclusive bridge for RH', 'all-support pole-free positivity already suffices'],
  ['every analytic strategy is ruled out by flow-blindness', 'the class must contain the negative-time deformations'],
];

export default function WhatWeKnowPage() {
  return (
    <PostLayout
      grade="NO-GO"
      meta={[`${ROUTE_COUNT} mapped routes`, `as of ${PROGRAM_STATUS_AS_OF}`]}
      title="What We Know"
      dek={
        <>The consolidated, state of what this project has actually figured out about
        ζ, the Riemann Hypothesis, and the primes — where the walls are and why.</>
      }
      byline={['exploreriemann', 'no RH proof · no refereed bound of this project']}
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
        The headline first: <strong>{PROGRAM_STATUS_SUMMARY}</strong> Across{' '}
        <strong>{ROUTE_COUNT} mapped routes</strong>, every surviving route from a positive
        Newman bound to RH is still open, RH-equivalent, or dead.
      </p>
      <AsOfLine />

      <h2>Status as of {PROGRAM_STATUS_AS_OF}</h2>
      <p>
        Each entry names the file of the repository that supports it. The full list, including the Lean
        formalisations, the Observatory and the repository, is at{' '}
        <Link to="/state-of-program">/state-of-program</Link>; the selected results are at{' '}
        <Link to="/key-results">/key-results</Link>.
      </p>
      <CurrentStatusList ids={['lambda-conditional-0116091', 'lambda-candidates-unconditional', 'lambda-route-p-0144997',
        'lambda-third-party-0107965', 'zero-free', 'direct-attempts', 'obstruction-controls']} />

      <h2>Research direction audit · {AUDIT.date}</h2>
      <p><strong>{AUDIT.recommendation}</strong> {AUDIT.reason}</p>
      <p>This is a research priority judgment, not a claim that a proof is close.</p>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead><tr><th scope="col">Direction</th><th scope="col">Assessment and next step</th></tr></thead>
          <tbody>{AUDIT.routes.map((r) => (
            <tr key={r.name}><th scope="row">{r.name}</th><td><strong>{r.status}.</strong> {r.next}</td></tr>
          ))}</tbody>
        </table>
      </div>
      <ul>{AUDIT.corrections.map((c) => <li key={c}>{c}</li>)}</ul>
      <p><a href="https://arxiv.org/pdf/2006.13771#page=51" target="_blank" rel="noreferrer">Criterion: Connes–Consani, Appendix C, Proposition C.1</a>.</p>

      <figure style={{ maxWidth: 460, border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden', margin: '18px auto', background: 'var(--paper)' }}>
        <WireframeAnim kind="no-go-wall" />
      </figure>

      <h2>① Established results and the separately graded candidates</h2>
      <ul style={{ paddingLeft: 20, lineHeight: 1.75 }}>
        <li><strong>Standalone Newman candidate:</strong> <strong>Λ ≤ 0.1787854</strong> is a computer-assisted candidate for an unconditional proof. Its package claims a compact-slab and final-time-half-strip closure, full material replay, corrected errors, and exact Polymath weld. The bound is not established; it has been reviewed by Dan Romik and is publicly posted, not refereed. It is not RH.</li>
        <li><strong>Sharper Newman candidate:</strong> <strong>Λ ≤ 0.1758354</strong> — a computer-assisted candidate with four gates certified in Arb and a Lean-checked y-transfer reduction and Lemma B3. Unrefereed; not established. <Link to="/lambda-01758354-candidate">detail →</Link></li>
        <li><strong>Λ ≤ 0.14 completion contract:</strong> a conditional contract, <em>not a bound</em> — the freeze-calculus / [B_v, Π_p]-weld route reduces the strict value to exactly one open family: the enclosure |C_E,17| {'<'} 0.2796881955526147 on 690988 ≤ N ≤ 54799999. Nothing is claimed unless that family closes. <Link to="/permutation-architecture">detail →</Link></li>
        <li><strong>Literature grades:</strong> <strong>Λ ≥ 0</strong> (Rodgers–Tao 2020) and the peer-reviewed upper benchmark <strong>Λ ≤ 0.2</strong> (Platt–Trudgian 2021). RH ⟺ Λ = 0.</li>
        <li><strong>Route B (Burgers / Koksma–Hlawka lim-sup):</strong> an unconditional, GUE-free, pair-correlation-free proof that lim supₙ |t_c(N)| = 0 for the N-particle Calogero–Moser/Dyson flow that models the zeros. This subsidiary theorem does not close the bridge to RH.</li>
        <li><strong>The Θ-trap theorems:</strong> Θ ≤ 1/4 as an unconditional flow invariant; the exact identity dg/ds = −(4/g)(1−Θ); Corollary A1 (t_c^part ≤ g_min²/6). Rigorous CM-flow algebra.</li>
        <li><strong>The R2-T isolation constants</strong> closed in closed form: c* = √(2+√3) − 1 ≈ 0.9319 (single-shell) and, since 2026-08-28, the global asymmetric constant c_glob = c_half = 0.8980208880762339 (unique root of the half-lattice rate bound) — the deterministic frontier residual, resolved. Improves no Λ bound.</li>
      </ul>

      <div className="ed-thm" style={{ borderLeftColor: 'var(--brass)' }}>
        <div className="tlab">FRONTIER ITEMS OF 2026-09 (superseded as the leading items; see the status list above)</div>
        <ul style={{ paddingLeft: 20, lineHeight: 1.75, margin: 0 }}>
          <li><strong>Λ ≤ 0.17759432 y-thaw package</strong> — a package value, not a bound. 2 of its 6 obligations are closed (O3, O5); O1, O2, O4, O6 are open (record of 2026-09-22). The theorem behind O1 is Lean-checked with its gates G1–G4 as hypotheses; the gate computation is not done. Detail: <Link to="/threads">Research Threads</Link>.</li>
          <li><strong>Route VII derived floor:</strong> the reachable-floor analysis of 2026-09 put the compute-derived floor at U ≈ 0.145–0.150, with arithmetic input required below it. The later conditional value 0.116091 uses such an input (the unrefereed half-plane Re s &gt; 7/8). Detail: <Link to="/frontier-dag">Frontier DAG</Link>.</li>
          <li><strong>Inertia-PCC verdict:</strong> the inertia route meets the same pair-correlation wall (λ_max(ρ) = 0.6231344958476320). Detail: <Link to="/threads">Research Threads</Link>.</li>
        </ul>
      </div>

      <h2>② Two major obstacles in the historical route map</h2>
      <p>
        The collision estimates and exact kernel positivity are major unresolved objects.
        Their appearance in several routes does not prove that every possible RH approach
        encounters the same barrier.
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
        <div className="tlab">§26 μ^pass / VOLTERRA — CORRECTED SCOPE</div>
        <div>
          The bare Volterra norm equivalence was refuted. The continuum diagonal has zero
          product measure, so a positive comparison kernel must be introduced separately.
          For a finite matrix K=P+S with P positive definite, the exact condition is
          I+P⁻¹ᐟ²SP⁻¹ᐟ² ≥ 0. Bounding the norm of that signed residual by 1 is sufficient,
          but generally stronger than positivity.
        </div>
      </div>

      <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
        Detail: <Link to="/route-map">Route Map</Link> · <Link to="/rigor-dashboard">Rigor Dashboard</Link>
      </p>

      <h2>③ What the comparisons establish</h2>
      <p>
        Across {ROUTE_COUNT} mapped routes, keep exact identities, finite certificates,
        numerical diagnostics, and open implications separate. An RH-equivalent target can
        still be useful if it enables a new estimate or construction. Failure of one estimate
        does not prove that every alternative is impossible, and pair correlation is not an
        established prerequisite for the arithmetic positivity criterion.
      </p>

      <Pull>
        The strongest next step is an independently checkable positivity certificate for the exact arithmetic form.
      </Pull>

      <h2>④ The no-go landscape — the walls, ours and the field's</h2>
      <p style={{ color: 'var(--ink-soft)' }}>
        The principal no-go and fundamental-limitation results bearing on RH — the ways a proof is
        known <em>not</em> to be reachable by a given method. This program's own findings first, then the
        established results and recognized barriers from the wider field. A curated list of the principal
        results, not a claim of exhaustiveness; none proves or disproves RH.
        The same data module renders the standalone index at <Link to="/no-gos">/no-gos</Link>.
      </p>
      <h3 style={{ fontSize: 15, color: 'var(--ink)', marginTop: 16, marginBottom: 2 }}>Found by this program (exploreriemann)</h3>
      <NoGoList items={ZETAEXPLORER_NO_GOS} />
      <h3 style={{ fontSize: 15, color: 'var(--ink)', marginTop: 20, marginBottom: 2 }}>Established results &amp; recognized barriers (the field)</h3>
      <NoGoList items={FIELD_NO_GOS} />

      <h2>⑤ The verification discipline — overclaims corrected</h2>
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
          As of {PROGRAM_STATUS_AS_OF}: the smallest value recorded here is{' '}
          <Link to="/lambda-0116091"><strong>Λ ≤ 0.116091488672439</strong></Link>, conditional on two unrefereed
          results (the half-plane Re s &gt; 7/8 and D. J. Raymond’s chain), on the Platt–Trudgian verified height and
          on internal certificates; it is not an established bound.
          <strong> Λ ≤ 0.1787854</strong> is a computer-assisted candidate for an
          unconditional proof; the bound is not established, has been reviewed by Dan Romik, and is not RH.
          A smaller candidate, <Link to="/lambda-01758354-candidate"><strong>Λ ≤ 0.1758354</strong></Link> (four
          Arb-certified gates + a Lean-checked y-transfer reduction and Lemma B3), is likewise unrefereed. The{' '}
          <Link to="/permutation-architecture"><strong>Λ ≤ 0.14</strong> completion contract</Link> is a
          conditional contract, not a bound — reduced to one open family. The exact global Twin Ladder
          residual inequality remains equivalent to RH, and RH itself remains open.
        </p>
      </TheoremBox>
    </PostLayout>
  );
}
