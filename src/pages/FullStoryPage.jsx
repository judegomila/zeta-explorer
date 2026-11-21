import React from 'react';
import { Link } from 'react-router-dom';
import PostLayout, { Pull, InlineMath, BlockMath } from '../components/editorial/PostLayout.jsx';
import { LAMBDA_BOUNDS } from '../data/lambda-roadmap.js';
import { NEWMAN_LAMBDA_01787854_CANDIDATE } from '../data/newman-lambda-01787854-candidate.js';

/* Editorial (post reading-view) presentation of the Twin-Ladder / Λ program
   narrative. All claims, numbers, bounds, dates, and clarity caveats are
   preserved verbatim from the prior dark-app page; this file only restyles the
   presentation into the warm editorial theme. No new claim is introduced. */

// Warm-theme accent per evidence tone (mirrors the old dark palette semantics).
const TONE = {
  established: 'var(--green)', // peer-reviewed
  publicClaim: 'var(--brass)', // public, unrefereed
  repository: 'var(--blue)', // candidate
  open: 'var(--terra-dk)', // open / superseded
  model: 'var(--faint)', // structural model
};

function Badge({ tone = 'model', children }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: 'var(--ed-mono)',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.4,
        color: TONE[tone],
        border: `1px solid ${TONE[tone]}`,
        borderRadius: 4,
        padding: '2px 8px',
      }}
    >
      {children}
    </span>
  );
}

function Card({ tone = 'model', children, style = {} }) {
  return (
    <div
      style={{
        background: 'var(--paper2)',
        border: '1px solid var(--hair2)',
        borderLeft: `3px solid ${TONE[tone]}`,
        borderRadius: 8,
        padding: '16px 18px',
        lineHeight: 1.65,
        fontSize: 15,
        color: 'var(--ink-soft)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function StatusCard({ tone, label, value, detail, href, route }) {
  const body = (
    <Card tone={tone} style={{ height: '100%', boxSizing: 'border-box' }}>
      <Badge tone={tone}>{label}</Badge>
      <div
        style={{
          color: TONE[tone],
          fontFamily: 'var(--ed-mono)',
          fontSize: 20,
          fontWeight: 800,
          marginTop: 12,
        }}
      >
        {value}
      </div>
      <div style={{ color: 'var(--faint)', fontSize: 13, marginTop: 8 }}>{detail}</div>
    </Card>
  );

  if (route) {
    return (
      <Link to={route} style={{ color: 'inherit', textDecoration: 'none' }}>
        {body}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
        {body}
      </a>
    );
  }
  return body;
}

function Grid({ min = 220, children, style = {} }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`,
        gap: 14,
        margin: '18px 0',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHead({ number, title }) {
  return (
    <>
      <div
        style={{
          color: 'var(--faint)',
          fontFamily: 'var(--ed-mono)',
          fontSize: 11,
          letterSpacing: '.12em',
          marginTop: 44,
        }}
      >
        § {number}
      </div>
      <h2 style={{ margin: '4px 0 12px' }}>{title}</h2>
    </>
  );
}

function CurrentStatus() {
  const peerReviewed = LAMBDA_BOUNDS.find((entry) => entry.id === 'platt-trudgian-2021');
  const publicClaim = LAMBDA_BOUNDS.find((entry) => entry.id === 'mosaic-public-preprint-01875');
  const candidateEntry = LAMBDA_BOUNDS.find(
    (entry) => entry.id === 'local-fixed-height-candidate-01787854',
  );
  const sharperCandidateEntry = LAMBDA_BOUNDS.find(
    (entry) => entry.id === 'local-sharper-candidate-01758354',
  );
  const contractEntry = LAMBDA_BOUNDS.find(
    (entry) => entry.id === 'permutation-completion-contract-014',
  );

  return (
    <>
      <SectionHead number={1} title="Evidence grades, kept separate" />
      <p className="lead">
        These rows are intentionally not collapsed into a single &ldquo;best known&rdquo; number. A public
        package, two candidates, a completion contract, and a peer-reviewed theorem have different
        evidentiary status, so they are graded and displayed apart.
      </p>
      <Grid min={220}>
        <StatusCard
          tone="established"
          label="peer reviewed"
          value={peerReviewed?.label || 'Λ ≤ 0.2'}
          detail="Published, peer-reviewed upper bound (Platt–Trudgian 2021). Everything below is graded separately because its bound is not established."
        />
        <StatusCard
          tone="publicClaim"
          label="public, unrefereed"
          value={publicClaim?.label || 'Claim: Λ ≤ 0.1875'}
          detail="A public certificate package and ledger entry. Local reconstruction repairs an omitted finite tile, but that is not peer review."
          href={publicClaim?.href}
        />
        <StatusCard
          tone="repository"
          label="computer-assisted candidate"
          value="Candidate: Λ ≤ 0.1787854"
          detail="A candidate for an unconditional proof. The bound is not established; reviewed by Dan Romik, publicly posted, unrefereed; not RH."
          route={candidateEntry?.route}
        />
        <StatusCard
          tone="repository"
          label="computer-assisted candidate"
          value="Candidate: Λ ≤ 0.1758354"
          detail="A sharper candidate below 0.1787854: four independent gates machine-checked in Arb interval arithmetic, with the y-transfer reduction and Lemma B3 Lean-checked. Unrefereed; the bound is not established; not RH."
          route={sharperCandidateEntry?.route || '/lambda-01758354-candidate'}
        />
        <StatusCard
          tone="open"
          label="completion contract — not a bound"
          value="Contract: Λ ≤ 0.14"
          detail="A conditional contract, NOT a proved bound: Λ ≤ 0.14 would follow if its zero-free statements hold. It reduces to ONE open family — |C_E,17| < 0.2796881955526147 on 690988 ≤ N ≤ 54799999 — with the [B_v,Π_p] weld as the decisive object."
          route={contractEntry?.route || '/permutation-architecture'}
        />
      </Grid>
      <div className="ed-thm" style={{ borderLeftColor: 'var(--terra-dk)' }}>
        <div className="tlab" style={{ color: 'var(--terra-dk)' }}>Superseded program claim</div>
        <p style={{ fontSize: 15 }}>
          <strong style={{ color: 'var(--terra-dk)' }}>
            <InlineMath tex="\Lambda\le 3.06\times10^{-5}" /> is not a rigorous bound.
          </strong>{' '}
          The July 2026 audit found that the current surrogate error{' '}
          <InlineMath tex="E(N)" /> floors at its fixed-strip truncation term instead of tending to
          zero. The required <InlineMath tex="C_H" /> / G6a shock modulus is RH-equivalent and open;
          the truncation constant is uncertified; and the collision-time leg still uses a proxy with
          an invalidated quantitative rate. The unconditional content that survives is an inert
          proxy limit, not a bound on <InlineMath tex="\Lambda" />. It therefore does not displace the
          peer-reviewed <InlineMath tex="\Lambda\le0.2" /> benchmark.
        </p>
      </div>
    </>
  );
}

function LambdaContext() {
  return (
    <>
      <SectionHead number={2} title="RH and the de Bruijn–Newman constant" />
      <p>
        With the completed zeta function{' '}
        <InlineMath tex="\xi(s)=\tfrac12s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s)" />, the Riemann
        Hypothesis says that every non-trivial zero has real part <InlineMath tex="1/2" />. The
        de Bruijn–Newman deformation is
      </p>
      <BlockMath tex="H_t(z)=\int_0^\infty e^{t u^2}\Phi(u)\cos(zu)\,du,\qquad \Lambda:=\inf\{t:H_t\text{ has only real zeros}\}." />
      <p>
        The classical bridge is <InlineMath tex="\mathrm{RH}\Longleftrightarrow\Lambda\le0" />.
        Rodgers–Tao proved <InlineMath tex="\Lambda\ge0" />, hence{' '}
        <InlineMath tex="\mathrm{RH}\Longleftrightarrow\Lambda=0" />. A finite computation or a model
        collision time is not automatically a bound on <InlineMath tex="\Lambda" />; a valid result
        also needs the full approximation, height, endpoint, and heat-flow criterion weld.
      </p>
    </>
  );
}

function TwinLadderModel() {
  return (
    <>
      <SectionHead number={3} title="What the twin-ladder model contributes" />
      <p>The arithmetic ladder comes from the exact prime-power expansion</p>
      <BlockMath tex="\log\zeta(s)=\sum_p\sum_{m\ge1}\frac{p^{-ms}}{m},\qquad -\frac{\zeta'}{\zeta}(s)=\sum_p\sum_{m\ge1}(\log p)\,p^{-ms}." />
      <p>
        Thus the natural delays are <InlineMath tex="m\log p" />. Their integer relations are
        governed by unique factorization: the prime logarithms are linearly independent over the
        rationals, while prime-power rungs deliberately contain integer multiples. The
        &ldquo;twin&rdquo; construction couples this arithmetic ladder to the completed kernel
        through explicit bridges. It is a useful coordinate system and research program, not by
        itself a physical network realization or a proof of RH.
      </p>

      <Card tone="model">
        <strong style={{ color: 'var(--ink)' }}>Corrected transfer-function reading.</strong>{' '}
        For <InlineMath tex="S_{21}(s)=\zeta(2s)/\zeta(s)" />, a generic zero of{' '}
        <InlineMath tex="\zeta(s)" /> is a pole of <InlineMath tex="S_{21}" />. A transmission zero
        comes from an uncancelled zero of <InlineMath tex="\zeta(2s)" />. The functional-equation
        factor can be placed in the formal two-channel matrix
        <BlockMath tex="S_\chi(s)=\frac12\begin{pmatrix}1+\chi(s)&1-\chi(s)\\[2pt]1-\chi(s)&1+\chi(s)\end{pmatrix}." />
        This matrix is unitary wherever <InlineMath tex="|\chi|=1" />, because its eigenvalues are{' '}
        <InlineMath tex="1" /> and <InlineMath tex="\chi" />. That boundary identity still does not
        establish a causal passive realization or identify scattering zeros with zeta zeros.
      </Card>
    </>
  );
}

function V70Corrections() {
  return (
    <>
      <SectionHead number={4} title="shift-bridge corrections" />
      <p>
        Center the completed function and measure the furthest horizontal zero displacement by
      </p>
      <BlockMath tex="X(w):=\xi\!\left(\tfrac12+w\right),\qquad \Delta:=\sup_{X(\lambda)=0}|\Re\lambda|." />
      <p>The corrected fixed-shift statement in the twin-ladder draft is a strict interior threshold:</p>
      <BlockMath tex="\bigl[\,|X(w-a)|<|X(w+a)|\ \text{for every }\Re w>0\,\bigr]\Longleftrightarrow a\ge\Delta." />
      <p>
        The endpoint <InlineMath tex="a=\Delta" /> belongs to this strict interior statement.
        However, it must not be conflated with an exact fixed-<InlineMath tex="a" /> criterion for
        positive semidefiniteness of the whole kernel. Common shifted zeros can create zero rows,
        which semidefiniteness permits. The safe all-shifts statement is
      </p>
      <BlockMath tex="\bigl[\,K_a\succeq0\ \text{for every }a>0\,\bigr]\Longleftrightarrow\Delta=0\Longleftrightarrow\mathrm{RH}." />

      <Grid min={260}>
        <Card tone="model">
          <strong style={{ color: 'var(--ink)' }}>Common-zero correction</strong>
          <BlockMath tex="\operatorname{ord}^{\rm pole}_{\lambda-a}R_a=\bigl[m(\lambda)-m(\lambda-2a)\bigr]_+,\qquad R_a(w)=\frac{X(w-a)}{X(w+a)}." />
          Negative-index counts must use residual, uncancelled pole order rather than counting every
          shifted denominator zero.
        </Card>
        <Card tone="model">
          <strong style={{ color: 'var(--ink)' }}>Half-plane Blaschke correction</strong>
          <BlockMath tex="B_\alpha(w)=\frac{w-\alpha}{w+\overline{\alpha}},\qquad \Re\alpha>0." />
          This is the right-half-plane factor with a zero at <InlineMath tex="\alpha" /> and unit
          boundary modulus. A right-half-plane pole contributes the inverse factor, subject to the
          residual-order caveat above.
        </Card>
      </Grid>
      <p>
        These are structural reductions. The twin-ladder paper explicitly remains a research-program
        draft; proving the all-shifts positivity target non-circularly is still RH-hard.
      </p>
    </>
  );
}

function RepositoryCandidateEvidence() {
  const candidate = NEWMAN_LAMBDA_01787854_CANDIDATE;
  const target = candidate.exactTarget;
  const finite = candidate.finiteEvidence;
  const tail = candidate.tailEvidence;

  return (
    <>
      <SectionHead number={5} title="What the standalone 0.1787854 candidate claims" />
      <Card tone="repository">
        <Badge tone="repository">candidate · computer-assisted · bound not established · not RH</Badge>
        <BlockMath tex={target.identityTex} />
        The headline value is an exact rational assembly, not a rounded fit. The candidate package is pinned to
        candidate commit <code>{candidate.identity.packageCommit.slice(0, 12)}</code>, immutable release{' '}
        <code>{candidate.identity.releaseCommit.slice(0, 12)}</code>, and a SHA-256 seal.
      </Card>

      <Grid min={220}>
        <Card tone="model">
          <strong style={{ color: 'var(--ink)' }}>Finite range</strong>
          <div style={{ fontFamily: 'var(--ed-mono)', fontSize: 19, marginTop: 8, color: 'var(--ink)' }}>
            {finite.firstN.toLocaleString()}–{finite.lastN.toLocaleString()}
          </div>
          {finite.rowCount.toLocaleString()} contiguous rows; no stored gaps, duplicates, nonpositive
          rows, or UNCERT rows.
        </Card>
        <Card tone="model">
          <strong style={{ color: 'var(--ink)' }}>Finite margin</strong>
          <div style={{ fontFamily: 'var(--ed-mono)', fontSize: 19, marginTop: 8, color: 'var(--ink)' }}>
            ≥ {finite.finiteMarginLowerBoundLiteral}
          </div>
          Direct-Dini ratio {finite.dini.worstCertifiedRatioLiteral} &lt; 1 at 180 and 256 bits.
        </Card>
        <Card tone="model">
          <strong style={{ color: 'var(--ink)' }}>Tail gate</strong>
          <div style={{ fontFamily: 'var(--ed-mono)', fontSize: 19, marginTop: 8, color: 'var(--ink)' }}>
            {tail.checksPassed}/{tail.checksTotal}
          </div>
          Conservative slack &gt; {tail.slackLowerBound}; contraction upper bound{' '}
          {tail.contractionUpperBoundLiteral} &lt; 1.
        </Card>
      </Grid>

      <p>
        The standalone v3 assembly presents these numerical certificates together with claimed compact-slab
        and final-time-half-strip closures, the Platt–Trudgian verified height, and an exact Polymath
        criterion weld. Together they form a computer-assisted candidate for an unconditional
        proof. The bound is not established and has been reviewed by Dan Romik. It is not RH.
      </p>
      <p>
        <Link
          to="/newman-lambda-01787854-candidate"
          className="ed-mono"
          style={{ color: 'var(--brass)', fontSize: 13 }}
        >
          Open the candidate package and replay record →
        </Link>
      </p>
    </>
  );
}

function CandidateInterfaces() {
  return (
    <>
      <SectionHead number={6} title="The candidate's eight supplied interfaces" />
      <p>
        These are claims and artifacts supplied by the candidate package, not independently established
        theorems. Their mathematics and source-to-proof correspondence remain external-review obligations.
      </p>
      <Grid min={280}>
        {NEWMAN_LAMBDA_01787854_CANDIDATE.closedAuditItems.map((item, index) => (
          <Card key={item.title} tone="repository">
            <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
              <span style={{ color: 'var(--blue)', fontFamily: 'var(--ed-mono)', fontWeight: 800 }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <strong style={{ color: 'var(--ink)' }}>{item.title}</strong>
            </div>
            <div style={{ color: 'var(--faint)', fontSize: 13, marginTop: 8 }}>
              {item.detail}
            </div>
          </Card>
        ))}
      </Grid>
    </>
  );
}

function BottomLine() {
  return (
    <>
      <SectionHead number={7} title="Bottom line" />
      <div className="ed-thm" style={{ borderLeftColor: 'var(--terra-dk)' }}>
        <div className="tlab" style={{ color: 'var(--terra-dk)' }}>No QED</div>
        <p style={{ fontSize: 19, fontWeight: 800, color: 'var(--ink)', margin: '0 0 12px' }}>
          No current Twin Ladder Explorer result proves RH or <InlineMath tex="\Lambda=0" />.
        </p>
        <p style={{ fontSize: 15 }}>
          The defensible outputs are: a corrected twin-ladder structural model, clearer zero/pole and
          positivity bookkeeping, a reproducible public <InlineMath tex="0.1875" /> package with
          an explicitly noted local repair, an <InlineMath tex="0.1787854" /> unrefereed
          computer-assisted candidate for an unconditional proof in the standalone repository (reviewed
          by Dan Romik, publicly posted), a sharper{' '}
          <Link to="/lambda-01758354-candidate"><InlineMath tex="0.1758354" /></Link>{' '}
          candidate, and a <Link to="/permutation-architecture"><InlineMath tex="0.14" /> completion
          contract</Link> — a contract, not a bound, with one open family. The candidates&rsquo; bounds
          are not established and neither is RH. The global Twin Ladder residual inequality remains exactly
          equivalent to RH, so no current result proves <InlineMath tex="\Lambda=0" />.
        </p>
      </div>
    </>
  );
}

export default function FullStoryPage() {
  return (
    <PostLayout
      grade="MAP"
      meta={['evidence-graded research narrative', 'Twin-Ladder / Λ program']}
      title="The Twin-Ladder / Λ Program"
      dek="A corrected account of what is classical, what twin-ladder derives inside a research draft, what the certificate packages compute, and which logical welds remain open."
      byline={['twin-ladder · exploreriemann', 'no new bound · not RH']}
      ticker={<span>Λ candidates unrefereed · no QED</span>}
      footer={<>
        Related: <Link to="/lambda-bounds">Bounds and evidence ledger</Link>
        {' · '}<Link to="/twin-ladder">Twin-ladder</Link>
        {' · '}<Link to="/shift-bridge-positivity">Shift-bridge threshold</Link>
        {' · '}<Link to="/state-of-program">State of the Program</Link>
        <br /><br />← <Link to="/">the atlas</Link>
      </>}
    >
      <div className="ed-thm" style={{ borderLeftColor: 'var(--green)' }}>
        <div className="tlab" style={{ color: 'var(--green)' }}>Ceiling</div>
        <p style={{ fontSize: 15 }}>
          <strong style={{ color: 'var(--ink)' }}>
            Peer-reviewed benchmark: Platt-Trudgian Λ ≤ 0.2 — this program did NOT produce it.
          </strong>{' '}
          Rodgers-Tao Λ ≥ 0 is the lower side. A public unrefereed package claims Λ ≤ 0.1875 and is
          listed in the Optimization Problems ledger; a local audit repaired an omitted finite sweep.
          The standalone repository presents Λ ≤ 0.1787854 as a computer-assisted candidate for an
          unconditional proof; the bound is not established, has been reviewed by Dan Romik, is
          publicly posted, and is not RH.{' '}
          <Link to="/state-of-program" style={{ color: 'var(--green)', fontWeight: 600 }}>
            See the State of the Program
          </Link>{' '}
          for the one canonical summary.
        </p>
      </div>

      <CurrentStatus />
      <LambdaContext />
      <TwinLadderModel />
      <V70Corrections />
      <Pull>a public package, a candidate, and a peer-reviewed theorem have different evidentiary status</Pull>
      <RepositoryCandidateEvidence />
      <CandidateInterfaces />
      <BottomLine />

      <h2>Where the story is now (2026-09)</h2>
      <p>
        The candidate ladder above ends at 0.1758354; the program has since assembled a{' '}
        <strong>Λ ≤ 0.17759432 y-thaw package</strong> (candidate-unrefereed; O3 and O5
        closed, O1, O2, O4, O6 open; a package value, not a bound) and derived a{' '}
        <strong>Route VII compute floor U ≈ 0.145–0.150</strong> — below it requires arithmetic
        input. The dated narrative continues on <Link to="/threads">/threads</Link>; the frontier
        graph of 2026-09-14 is <Link to="/frontier-dag">/frontier-dag</Link>. Since 2026-10-09 the smallest
        recorded value is <Link to="/lambda-0116091">0.116091488672439</Link>, conditional on two unrefereed
        results; status as of 2026-11-20 is at <Link to="/state-of-program">/state-of-program</Link>.
      </p>
    </PostLayout>
  );
}
