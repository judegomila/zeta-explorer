import React from 'react';
import { Link } from 'react-router-dom';
import PostLayout, { TheoremBox, Figure, Pull, BlockMath, InlineMath } from '../components/editorial/PostLayout.jsx';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import ConceptTerm from '../components/ConceptTerm.jsx';
import { ED, TINT } from '../styles/tokens.js';

/* New explanation page: the Λ ≤ 0.1758354 candidate certificate. Functional
   language, post reading-view. Content is the four-gate barrier certificate. */

export default function LambdaCandidate01758354Page() {
  return (
    <PostLayout
      grade="CANDIDATE"
      meta={['2026-08-18', 'computer-assisted', 'unrefereed']}
      title={<>Λ ≤ 0.1758354 — a four-gate barrier certificate</>}
      dek={<>A revised mollifier and an extended finite lane certify a de Bruijn–Newman bound of 0.1758354, below the 0.1787854 candidate. Four gates, each machine-checked in interval arithmetic; the y-transfer reduction and Lemma B3 are Lean-checked. This is not a refereed result and does not displace Platt–Trudgian.</>}
      byline={['Barrier program · exploreriemann', 'candidate — not SOTA']}
      ticker={<span>candidate · Λ ≤ <b>&nbsp;0.1758354</b></span>}
      footer={<>Related: <Link to="/newman-lambda-01787854-candidate">Λ ≤ 0.1787854 package</Link> · <Link to="/lambda-bounds">the bounds ledger</Link> · <Link to="/pt-floor-audit">what binds the floor</Link><br /><br />← <Link to="/">the atlas</Link></>}
    >
      <p className="lead">The <ConceptTerm slug="de-bruijn-newman-constant">de Bruijn–Newman constant</ConceptTerm> Λ satisfies <ConceptTerm slug="riemann-hypothesis">RH</ConceptTerm> ⇔ Λ ≤ 0, with <ConceptTerm slug="newman-conjecture">Rodgers–Tao</ConceptTerm> giving Λ ≥ 0 and <ConceptTerm slug="platt-trudgian-verified-height">Platt–Trudgian</ConceptTerm> the rigorous upper bound Λ ≤ 0.2. This note records a computer-assisted candidate <InlineMath tex="\Lambda \le 0.1758354" />, obtained from the <ConceptTerm slug="barrier-method">mollified-barrier method</ConceptTerm> with a revised <ConceptTerm slug="barrier-mollifier">mollifier</ConceptTerm> and a longer verified <ConceptTerm slug="route-vii-lane">lane</ConceptTerm>. It is below the earlier 0.1787854 candidate. It has not been refereed.</p>

      <AnimationEmbed id="four-gate-lambda" />

      <h2>The certificate</h2>
      <p>The bound is a barrier argument: on a strip of height X, the mollified function stays away from zero, and a tail estimate controls the rest. It reduces to four independent gates, each discharged by an <ConceptTerm slug="arb-interval-certificate">interval-arithmetic (Arb)</ConceptTerm> computation over an explicit grid.</p>

      <TheoremBox label="Certificate (four gates)">
        <p>If all four gates below hold at the certified parameters, then <InlineMath tex="\Lambda \le 0.1758354" />.</p>
      </TheoremBox>

      <BlockMath tex="\underbrace{\text{finite lane}}_{5.3\times10^6\ \text{windows}}\ \wedge\ \underbrace{\text{tail } D<1}_{\text{endpoint-cap bound}}\ \wedge\ \underbrace{\text{barrier reuse}}_{\text{containment in the certified box}}\ \wedge\ \underbrace{\text{y-transfer } B<\text{margin}}_{\text{excision budget}}" />

      <Figure caption={<>The margin ledger. The y-transfer excision budget B ≈ 2.5×10⁻⁴ sits below the available margin 1.87×10⁻³ — the gate closes with room to spare.</>}>
        <svg width="100%" height="150" viewBox="0 0 420 150" fill="none">
          <line x1="30" y1="110" x2="400" y2="110" stroke={ED.rule} strokeWidth="1" />
          <rect x="30" y="70" width="300" height="18" fill={TINT.green} stroke={ED.series3} strokeWidth="1" />
          <text x="34" y="64" fontFamily="IBM Plex Mono" fontSize="10" fill={ED.series3}>available margin 1.87e-3</text>
          <rect x="30" y="92" width="40" height="12" fill={TINT.terra} stroke={ED.accent} strokeWidth="1" />
          <text x="74" y="102" fontFamily="IBM Plex Mono" fontSize="10" fill={ED.accent}>excision budget B ≈ 2.5e-4</text>
          <text x="30" y="132" fontFamily="IBM Plex Mono" fontSize="10" fill={ED.inkFaint}>B &lt; margin ⇒ gate closes</text>
        </svg>
      </Figure>

      <h2>What was hard</h2>
      <p>The naive termwise monotonicity that the <ConceptTerm slug="y-transfer">y-transfer</ConceptTerm> gate seemed to need is <em>false</em> — double cancellations break it. The fix replaces termwise bounds with profile-sector cells and an excision budget: the total mass removed by the transfer is bounded by B, and B is smaller than the finite-lane margin. This dissolved an apparent <InlineMath tex="2^{287}" /> enumeration into 20,546 explicit profiles.</p>

      <p>The tail gate <InlineMath tex="D<1" /> was the second obstruction. Raising the finite/tail cutoff to <InlineMath tex="N^\ast = 6\times10^6" /> closes it (D = 0.880); at the earlier cutoff 3.84×10⁶ the tail did not certify (D = 1.129). The verified zero height X is unchanged.</p>

      <Pull>The y-transfer reduction and Lemma B3 are Lean-checked; the Polymath Theorem 1.2 instantiation is not in Lean, and the gates themselves are Arb interval computations. Neither step is a referee.</Pull>

      <h2>Status</h2>
      <p>This is a <ConceptTerm slug="project-lambda-candidate">candidate</ConceptTerm>: the y-transfer reduction and Lemma B3 are <ConceptTerm slug="lean-formalization">formalized in Lean</ConceptTerm>, the numerics are interval-rigorous, and an internal composition audit (2026-09-28) found every interface consistent: ε_cap ≤ 2.668×10⁻⁷ at this candidate's own parameters, tightened gate 1.6225×10⁻³ &gt; 0, checked by the fail-closed script <code>scripts/lambda-01758354-gate.mjs</code>. It has not been externally reviewed. It is the lowest value the barrier method currently reaches, below <Link to="/newman-lambda-01787854-candidate">the 0.1787854 package</Link>, and consistent with the finding that the <Link to="/pt-floor-audit">verified height binds the floor</Link>.</p>
      <p>The y-transfer gate — the hardest of the four — has an Arb PASS certificate: <code>verify_ydini_genmoll.c</code> at 256-bit over all 20,546 profiles gives a certified excision budget <InlineMath tex="B = 2.4957\times10^{-4}" />, a factor 7.5 inside the finite-lane margin <InlineMath tex="1.872\times10^{-3}" /> (run 2026-08-02, partials reproduced bit-identical 2026-09-22). That discharges the y-Dini/excision <em>computation</em>; the composition audit (deriving ε_cap at these parameters) and independent referee review remain outstanding. It is not a bound; Platt–Trudgian Λ ≤ 0.2 remains the accepted benchmark.</p>
    </PostLayout>
  );
}
