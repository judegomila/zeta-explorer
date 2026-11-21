import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import PostLayout, { TheoremBox, Pull, InlineMath, GradeChip } from '../components/editorial/PostLayout.jsx';
import { RESULTS_COUNT, GRADE_META } from '../data/graded-results.js';
import { ZETAEXPLORER_NO_GOS, FIELD_NO_GOS } from '../data/rh-no-go-theorems.js';
import { FULL_ROUTE_MAP } from '../data/full-route-map-2026-06-19.js';

/* /guide — a progressive on-ramp to the Riemann Hypothesis and this project's
   attack on it. Assembled, not re-authored: every number is imported live from
   the source-of-truth data modules (RESULTS_COUNT, FULL_ROUTE_MAP, the no-go
   arrays) so the guide can never drift from the pages it summarizes. New prose is
   limited to Act 1 (plain-language RH) and the bridge sentences between acts.
   Honesty rules apply verbatim: PT Λ≤0.2 is the peer-reviewed SOTA, candidates
   are not bounds, RH is open, no false QED, functional language only. */

const ZetaStripLive = lazy(() => import('../components/ZetaStripLive.jsx'));

const noGoCount = ZETAEXPLORER_NO_GOS.length + FIELD_NO_GOS.length;

// Act 4 — attack families. Historical (the field) + this project's engagement.
// Prose is bridge-level; the deep content lives at the linked pages.
const ATTACK_FAMILIES = [
  {
    name: 'Zero-density / large sieve',
    field: 'Bound how many zeros can lie off the line (Bohr–Landau → Guth–Maynard 2024).',
    here: 'Λ-inert: density gives "few off line", never "none".',
    to: '/zero-density-scoping',
  },
  {
    name: 'Moments & random-matrix theory',
    field: 'Montgomery pair-correlation; ζ statistics match GUE eigenvalues (Montgomery–Odlyzko, Keating–Snaith).',
    here: 'The pair-correlation (PCC) wall recurs across every closure route.',
    to: '/pair-correlation',
  },
  {
    name: 'Critical-line proportion (mollifiers)',
    field: 'Proportion of zeros on the line: Levinson 1/3 → Conrey 2/5 → PRZZ 5/12 (2020).',
    here: 'The one non-circular door left open by our rigidity theorem — but it gives proportion, not "every zero".',
    to: '/critical-line-proportion',
  },
  {
    name: 'Spectral / Hilbert–Pólya',
    field: 'Realize the zeros as eigenvalues of a self-adjoint operator (de Branges, Connes adelic, Berry–Keating).',
    here: 'Flow-blindness: no soft operator hypothesis forces reality of the zeros.',
    to: '/connes-adelic',
  },
  {
    name: 'Positivity criteria',
    field: 'Reformulate RH as a positivity: Li, Weil explicit formula, Beurling–Nyman, Báez-Duarte.',
    here: 'Weil positivity on our span equals the Lagarias–Pick criterion — RH-equivalent, not a lever.',
    to: '/rh-equivalents',
  },
  {
    name: 'de Bruijn–Newman Λ (this project’s main line)',
    field: 'RH ⇔ Λ ≤ 0 (heat-flow deformation of ξ); Rodgers–Tao 2018 proved Λ ≥ 0; Platt–Trudgian Λ ≤ 0.2.',
    here: 'The twin-ladder / weld / y-transfer program: candidates toward a lower Λ, and the walls that cap them.',
    to: '/lambda-bounds',
  },
];

export default function GuidePage() {
  return (
    <PostLayout
      grade="GUIDE"
      meta={['start here', 'no prior background assumed']}
      title="A guide to the Riemann Hypothesis"
      dek="What it says, why it is hard, every major line of attack — the field's and this project's — and exactly where each one stops. Nothing here is claimed beyond what is established: Platt–Trudgian Λ ≤ 0.2 is the accepted bound and RH is open."
      byline={['exploreriemann', 'assembled from the graded results, route map, and no-go ledger']}
      ticker={<span>{RESULTS_COUNT} graded results · {FULL_ROUTE_MAP.totalRoutes} closure routes · {noGoCount} no-go findings · PT Λ≤0.2 SOTA · RH open</span>}
      footer={<>
        Go deeper: <Link to="/atlas">the atlas</Link>{' · '}
        <Link to="/state-of-field">state of the field</Link>{' · '}
        <Link to="/what-we-know">what we know</Link>{' · '}
        <Link to="/no-gos">the walls</Link>{' · '}
        <Link to="/results">graded results</Link>{' · '}
        <Link to="/frontier-dag">the frontier</Link>
      </>}
    >
      {/* ACT 1 — what RH is (the one genuinely new, beginner-first section) */}
      <h2>1 · What the hypothesis says</h2>
      <p className="lead">
        The Riemann zeta function <InlineMath tex="\zeta(s)" /> starts life as the sum
        {' '}<InlineMath tex="1 + \tfrac{1}{2^s} + \tfrac{1}{3^s} + \tfrac{1}{4^s} + \cdots" />,
        and extends to a function defined for almost every complex number <InlineMath tex="s" />.
        It is zero at the negative even integers (the "trivial" zeros), and it has infinitely
        many other zeros — the ones that matter — all lying in the vertical strip where the real
        part of <InlineMath tex="s" /> is between 0 and 1.
      </p>
      <p>
        The Riemann Hypothesis is a single sentence about where those zeros sit:
      </p>
      <TheoremBox label="Riemann Hypothesis (1859)">
        <p style={{ margin: 0 }}>
          Every nontrivial zero of <InlineMath tex="\zeta(s)" /> has real part exactly{' '}
          <InlineMath tex="\tfrac{1}{2}" /> — they all lie on one vertical line, the
          "critical line".
        </p>
      </TheoremBox>
      <p>
        That is the whole statement. The picture below is the object itself: the zeta function
        on the critical strip, with the zeros marked. RH is the claim that they never stray off
        the centre line.
      </p>
      <Suspense fallback={<div style={{ height: 220 }} />}>
        <ZetaStripLive />
      </Suspense>

      {/* ACT 2 — why it matters */}
      <h2>2 · Why it matters</h2>
      <p>
        The zeros of <InlineMath tex="\zeta" /> control the distribution of the prime numbers:
        the closer the zeros are to the critical line, the more regular the primes. RH is
        equivalent to the sharpest possible error term in the prime-counting function, and to a
        long list of other statements across analysis and number theory — Li's criterion, the
        Beurling–Nyman approximation, Robin's inequality, and more. Proving any one of these
        proves RH; that web of equivalences is mapped at{' '}
        <Link to="/rh-equivalents">rh-equivalents</Link>.
      </p>

      {/* ACT 3 — why it is hard */}
      <h2>3 · Why it is hard</h2>
      <p>
        A century of work has produced deep partial results but no proof, and this project's own
        analysis makes the obstruction precise. The recurring wall is that the "soft" structural
        properties of <InlineMath tex="\zeta" /> — symmetry, positivity, growth — are preserved
        by deformations that <em>break</em> RH, so no soft hypothesis alone can force the zeros
        onto the line. A proof has to inject genuinely arithmetic input (the Euler product / the
        explicit formula), which the soft machinery never touches. This is the{' '}
        <Link to="/flow-blindness-no-go">flow-blindness no-go</Link>, and it reappears as the
        pair-correlation wall throughout the route map.
      </p>
      <Pull>The properties that make ζ tractable are exactly the ones a deformation can keep while moving a zero off the line. That is the wall, stated once.</Pull>

      {/* ACT 4 — the attacks */}
      <h2>4 · The lines of attack</h2>
      <p>
        Below are the major attack families — the field's classical programs and how this
        project has engaged each. The pattern is consistent: each is powerful, and each stops at
        the same place.
      </p>
      <div style={{ display: 'grid', gap: 12, margin: '1rem 0' }}>
        {ATTACK_FAMILIES.map((f) => (
          <Link key={f.name} to={f.to} className="ed-tile" style={{ display: 'block' }}>
            <h3 style={{ marginBottom: 6 }}>{f.name}</h3>
            <p style={{ margin: '0 0 4px' }}>{f.field}</p>
            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--faint)' }}><b>Here:</b> {f.here}</p>
          </Link>
        ))}
      </div>
      <p>
        The fuller catalog — with references, status chips, and the exact obstruction for each —
        is at <Link to="/state-of-field">state of the field</Link>; this project's own routes
        across six clusters are at <Link to="/atlas">the atlas</Link> and{' '}
        <Link to="/route-map">the route map</Link>.
      </p>

      {/* ACT 5 — the frontier and the honest walls */}
      <h2>5 · The frontier, and the walls</h2>
      <p>
        This project attacks RH mainly through the de Bruijn–Newman constant{' '}
        <InlineMath tex="\Lambda" />, where <InlineMath tex="\text{RH} \iff \Lambda \le 0" />.
        The peer-reviewed state of the art is <InlineMath tex="\Lambda \le 0.2" />{' '}
        (Platt–Trudgian), with <InlineMath tex="\Lambda \ge 0" /> proved (Rodgers–Tao). This
        project's lower candidate values — {' '}
        <Link to="/lambda-01758354-candidate">0.1758354</Link>,{' '}
        <Link to="/newman-lambda-01787854-candidate">0.1787854</Link>, the y-thaw package —
        are computer-assisted and <em>unrefereed</em>: they are candidates, not bounds. The smallest
        value recorded here, <Link to="/lambda-0116091">0.116091488672439</Link>, is conditional on two
        unrefereed results (the zero-free half-plane <InlineMath tex="\Re s > 7/8" /> and D. J. Raymond's
        decreasing-barrier chain); it is not an established bound. Status as of 2026-11-20:{' '}
        <Link to="/state-of-program">state of the program</Link>.
      </p>
      <p>
        The honest current state is that every mapped route reduces to one of three things —
        the amount of verified zero height, the pair-correlation wall, or a statement equivalent
        to RH itself. A native-span rigidity theorem this program proved shows that no
        rearrangement of its own machinery escapes that; the single non-circular door left open
        is the mollifier / critical-line-proportion frontier, which the machinery has no object
        for. See <Link to="/pt-floor-audit">the verified-height floor audit</Link> and{' '}
        <Link to="/no-gos">the {noGoCount} no-go findings</Link>.
      </p>

      <h2>How to read every claim here</h2>
      <p>
        Nothing on this site is asserted beyond its verification level. Each result carries a
        verbatim grade:
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '0.75rem 0' }}>
        {GRADE_META.map((g) => (
          <GradeChip key={g.grade} grade={g.grade}>{g.grade}</GradeChip>
        ))}
      </div>
      <p style={{ fontSize: 13.5, color: 'var(--faint)' }}>
        A grade never promotes: a candidate stays a candidate until refereed, a contract
        establishes no bound, a no-go closes a route family. The full graded ledger is at{' '}
        <Link to="/results">results</Link>. Platt–Trudgian <InlineMath tex="\Lambda \le 0.2" />{' '}
        remains the accepted bound; RH is open.
      </p>
    </PostLayout>
  );
}
