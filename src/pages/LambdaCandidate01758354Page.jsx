import React from 'react';
import { Link } from 'react-router-dom';
import PostLayout, { TheoremBox, Figure, Pull, BlockMath, InlineMath } from '../components/editorial/PostLayout.jsx';
import AnimationEmbed from '../components/AnimationEmbed.jsx';

/* New explanation page: the Λ ≤ 0.1758354 candidate certificate. Functional
   language, post reading-view. Content is the four-gate barrier certificate. */

export default function LambdaCandidate01758354Page() {
  return (
    <PostLayout
      grade="CANDIDATE"
      meta={['2026-08-18', 'computer-assisted', 'unrefereed']}
      title={<>Λ ≤ 0.1758354 — a four-gate barrier certificate</>}
      dek={<>A revised mollifier and an extended finite lane certify a de Bruijn–Newman bound of 0.1758354, below the 0.1787854 candidate. Four gates, each machine-checked in interval arithmetic; the reduction is Lean-checked. This is not a refereed result and does not displace Platt–Trudgian.</>}
      byline={['Barrier program · mathexplorer', 'candidate — not SOTA']}
      ticker={<span>candidate · Λ ≤ <b>&nbsp;0.1758354</b></span>}
      footer={<>Related: <Link to="/newman-lambda-01787854-candidate">Λ ≤ 0.1787854 package</Link> · <Link to="/lambda-bounds">the bounds ledger</Link> · <Link to="/pt-floor-audit">what binds the floor</Link><br /><br />← <Link to="/">the atlas</Link></>}
    >
      <p className="lead">The de Bruijn–Newman constant Λ satisfies RH ⇔ Λ ≤ 0, with Rodgers–Tao giving Λ ≥ 0 and Platt–Trudgian the rigorous upper bound Λ ≤ 0.2. This note records a computer-assisted candidate <InlineMath tex="\Lambda \le 0.1758354" />, obtained from the mollified-barrier method with a revised mollifier and a longer verified lane. It is below the earlier 0.1787854 candidate. It has not been refereed.</p>

      <AnimationEmbed id="four-gate-lambda" />

      <h2>The certificate</h2>
      <p>The bound is a barrier argument: on a strip of height X, the mollified function stays away from zero, and a tail estimate controls the rest. It reduces to four independent gates, each discharged by an interval-arithmetic (Arb) computation over an explicit grid.</p>

      <TheoremBox label="Certificate (four gates)">
        <p>If all four gates below hold at the certified parameters, then <InlineMath tex="\Lambda \le 0.1758354" />.</p>
      </TheoremBox>

      <BlockMath tex="\underbrace{\text{finite lane}}_{5.3\times10^6\ \text{windows}}\ \wedge\ \underbrace{\text{tail } D<1}_{\text{Euler–Maclaurin}}\ \wedge\ \underbrace{\text{barrier reuse}}_{\text{monotone in } t}\ \wedge\ \underbrace{\text{y-transfer } B<\text{margin}}_{\text{excision budget}}" />

      <Figure caption={<>The margin ledger. The y-transfer excision budget B ≈ 2.5×10⁻⁴ sits below the available margin 1.87×10⁻³ — the gate closes with room to spare.</>}>
        <svg width="100%" height="150" viewBox="0 0 420 150" fill="none">
          <line x1="30" y1="110" x2="400" y2="110" stroke="#d5c9b2" strokeWidth="1" />
          <rect x="30" y="70" width="300" height="18" fill="#e7efe4" stroke="#4c7a4a" strokeWidth="1" />
          <text x="34" y="64" fontFamily="IBM Plex Mono" fontSize="10" fill="#4c7a4a">available margin 1.87e-3</text>
          <rect x="30" y="92" width="40" height="12" fill="#f6e0d8" stroke="#c23a1c" strokeWidth="1" />
          <text x="74" y="102" fontFamily="IBM Plex Mono" fontSize="10" fill="#c23a1c">excision budget B ≈ 2.5e-4</text>
          <text x="30" y="132" fontFamily="IBM Plex Mono" fontSize="10" fill="#877b67">B &lt; margin ⇒ gate closes</text>
        </svg>
      </Figure>

      <h2>What was hard</h2>
      <p>The naive termwise monotonicity that the y-transfer gate seemed to need is <em>false</em> — double cancellations break it. The fix replaces termwise bounds with profile-sector cells and an excision budget: the total mass removed by the transfer is bounded by B, and B is smaller than the finite-lane margin. This dissolved an apparent <InlineMath tex="2^{287}" /> enumeration into 20,546 explicit profiles.</p>

      <p>The tail gate <InlineMath tex="D<1" /> was the second obstruction. Extending the verified strip height to <InlineMath tex="N^\ast = 6\times10^6" /> closes it; at the earlier height the tail did not certify.</p>

      <Pull>The reduction to the four gates is Lean-checked; the gates themselves are Arb interval computations. Neither step is a referee. Λ ≤ 0.2 remains the state of the art.</Pull>

      <h2>Status</h2>
      <p>This is a candidate: the reduction is formalized, the numerics are interval-rigorous, but the pipeline has not been independently audited end to end. It is the lowest value the barrier method currently reaches, below <Link to="/newman-lambda-01787854-candidate">the 0.1787854 package</Link>, and consistent with the finding that the <Link to="/pt-floor-audit">verified height binds the floor</Link>.</p>
    </PostLayout>
  );
}
