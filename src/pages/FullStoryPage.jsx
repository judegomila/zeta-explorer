import React from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { LAMBDA_BOUNDS } from '../data/lambda-roadmap.js';
import { NEWMAN_LAMBDA_01787854_THEOREM } from '../data/newman-lambda-01787854-candidate.js';

const COLORS = {
  established: {
    fg: '#86efac',
    bg: 'rgba(34,197,94,0.10)',
    border: 'rgba(34,197,94,0.35)',
  },
  publicClaim: {
    fg: '#facc15',
    bg: 'rgba(234,179,8,0.10)',
    border: 'rgba(234,179,8,0.35)',
  },
  repository: {
    fg: '#67e8f9',
    bg: 'rgba(34,211,238,0.10)',
    border: 'rgba(34,211,238,0.35)',
  },
  open: {
    fg: '#fca5a5',
    bg: 'rgba(239,68,68,0.09)',
    border: 'rgba(239,68,68,0.35)',
  },
  model: {
    fg: '#a5b4fc',
    bg: 'rgba(99,102,241,0.10)',
    border: 'rgba(99,102,241,0.35)',
  },
};

const SECTIONS = [
  ['status', 'Current status'],
  ['lambda', 'RH and Λ'],
  ['model', 'Twin-ladder model'],
  ['v70', 'v70 corrections'],
  ['candidate', '0.1787854 theorem'],
  ['obligations', 'Closed interfaces'],
  ['bottom-line', 'Bottom line'],
];

function Badge({ tone = 'model', children }) {
  const color = COLORS[tone] || COLORS.model;
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 9px',
        borderRadius: 999,
        color: color.fg,
        background: color.bg,
        border: `1px solid ${color.border}`,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}

function Card({ tone = 'model', children, style = {} }) {
  const color = COLORS[tone] || COLORS.model;
  return (
    <div
      style={{
        padding: '18px 20px',
        borderRadius: 12,
        color: '#cbd5e1',
        background: color.bg,
        border: `1px solid ${color.border}`,
        lineHeight: 1.7,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Section({ id, number, title, children }) {
  return (
    <section id={id} style={{ marginTop: 52, scrollMarginTop: 76 }}>
      <div style={{ borderBottom: '1px solid #1e293b', paddingBottom: 10, marginBottom: 20 }}>
        <div style={{ color: '#64748b', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
          § {number}
        </div>
        <h2
          style={{
            color: '#e2e8f0',
            fontFamily: 'var(--font-mono)',
            fontSize: 24,
            margin: '4px 0 0',
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Paragraph({ children }) {
  return <p style={{ color: '#cbd5e1', fontSize: 15, lineHeight: 1.75 }}>{children}</p>;
}

function StatusCard({ tone, label, value, detail, href, route }) {
  const body = (
    <Card tone={tone} style={{ height: '100%', boxSizing: 'border-box' }}>
      <Badge tone={tone}>{label}</Badge>
      <div
        style={{
          color: COLORS[tone].fg,
          fontFamily: 'var(--font-mono)',
          fontSize: 21,
          fontWeight: 800,
          marginTop: 12,
        }}
      >
        {value}
      </div>
      <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 8 }}>{detail}</div>
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

function Contents() {
  return (
    <aside
      className="full-story-contents"
      style={{
        position: 'sticky',
        top: 16,
        width: 210,
        flexShrink: 0,
        alignSelf: 'flex-start',
        padding: 16,
        border: '1px solid #1e293b',
        borderRadius: 10,
        background: 'rgba(15,23,42,0.78)',
      }}
    >
      <div
        style={{
          color: '#64748b',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: 0.6,
          marginBottom: 10,
          textTransform: 'uppercase',
        }}
      >
        Contents
      </div>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {SECTIONS.map(([id, label], index) => (
          <li key={id} style={{ marginTop: index === 0 ? 0 : 8 }}>
            <a
              href={`#${id}`}
              onClick={(event) => {
                event.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              style={{
                color: '#94a3b8',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                textDecoration: 'none',
              }}
            >
              <span style={{ color: '#475569' }}>{String(index + 1).padStart(2, '0')}.</span>{' '}
              {label}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function CurrentStatus() {
  const peerReviewed = LAMBDA_BOUNDS.find((entry) => entry.id === 'platt-trudgian-2021');
  const publicClaim = LAMBDA_BOUNDS.find((entry) => entry.id === 'mosaic-public-preprint-01875');
  const theorem = LAMBDA_BOUNDS.find(
    (entry) => entry.id === 'local-fixed-height-candidate-01787854',
  );

  return (
    <Section id="status" number={1} title="Three evidence grades, kept separate">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
        }}
      >
        <StatusCard
          tone="established"
          label="peer reviewed"
          value={peerReviewed?.label || 'Λ ≤ 0.2'}
          detail="Published, peer-reviewed benchmark. The stronger repository theorem is graded separately because it is unpublished and unpeer-reviewed."
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
          label="repository theorem · unreviewed"
          value={theorem?.label || 'Repository theorem: Λ ≤ 0.1787854'}
          detail="The sealed computer-assisted proof closes its theorem interfaces. It remains unpublished and unpeer-reviewed."
          route={theorem?.route}
        />
      </div>
      <Paragraph>
        These rows are intentionally not collapsed into a single “best known” number. A public
        package, a theorem proved in this repository, and a peer-reviewed theorem have different
        evidentiary status.
      </Paragraph>
      <Card tone="open">
        <strong style={{ color: '#f87171' }}>
          Superseded program claim: <InlineMath tex="\Lambda\le 3.06\times10^{-5}" /> is not a
          rigorous bound.
        </strong>{' '}
        The July 2026 audit found that the current surrogate error{' '}
        <InlineMath tex="E(N)" /> floors at its fixed-strip truncation term instead of tending to
        zero. The required <InlineMath tex="C_H" /> / G6a shock modulus is RH-equivalent and open;
        the truncation constant is uncertified; and the collision-time leg still uses a proxy with
        an invalidated quantitative rate. The unconditional content that survives is an inert
        proxy limit, not a bound on <InlineMath tex="\Lambda" />. It therefore does not displace the
        peer-reviewed <InlineMath tex="\Lambda\le0.2" /> benchmark.
      </Card>
    </Section>
  );
}

function LambdaContext() {
  return (
    <Section id="lambda" number={2} title="RH and the de Bruijn–Newman constant">
      <Paragraph>
        With the completed zeta function
        <InlineMath tex="\;\xi(s)=\tfrac12s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s)\;" />,
        the Riemann Hypothesis says that every non-trivial zero has real part
        <InlineMath tex="\;1/2" />. The de Bruijn–Newman deformation is
      </Paragraph>
      <BlockMath tex="H_t(z)=\int_0^\infty e^{t u^2}\Phi(u)\cos(zu)\,du,\qquad \Lambda:=\inf\{t:H_t\text{ has only real zeros}\}." />
      <Paragraph>
        The classical bridge is
        <InlineMath tex="\;\mathrm{RH}\Longleftrightarrow\Lambda\le0" />. Rodgers–Tao proved
        <InlineMath tex="\;\Lambda\ge0" />, hence
        <InlineMath tex="\;\mathrm{RH}\Longleftrightarrow\Lambda=0" />. A finite computation or
        a model collision time is not automatically a bound on <InlineMath tex="\Lambda" />; a
        valid result also needs the full approximation, height, endpoint, and heat-flow criterion
        weld.
      </Paragraph>
    </Section>
  );
}

function TwinLadderModel() {
  return (
    <Section id="model" number={3} title="What the twin-ladder model contributes">
      <Paragraph>
        The arithmetic ladder comes from the exact prime-power expansion
      </Paragraph>
      <BlockMath tex="\log\zeta(s)=\sum_p\sum_{m\ge1}\frac{p^{-ms}}{m},\qquad -\frac{\zeta'}{\zeta}(s)=\sum_p\sum_{m\ge1}(\log p)\,p^{-ms}." />
      <Paragraph>
        Thus the natural delays are <InlineMath tex="\;m\log p" />. Their integer relations are
        governed by unique factorization: the prime logarithms are linearly independent over the
        rationals, while prime-power rungs deliberately contain integer multiples. The “twin”
        construction couples this arithmetic ladder to the completed kernel through explicit
        bridges. It is a useful coordinate system and research program, not by itself a physical
        network realization or a proof of RH.
      </Paragraph>

      <Card tone="model">
        <strong style={{ color: '#e2e8f0' }}>Corrected transfer-function reading.</strong>{' '}
        For <InlineMath tex="S_{21}(s)=\zeta(2s)/\zeta(s)" />, a generic zero of
        <InlineMath tex="\zeta(s)" /> is a pole of <InlineMath tex="S_{21}" />. A transmission zero
        comes from an uncancelled zero of <InlineMath tex="\zeta(2s)" />. The functional-equation
        factor can be placed in the formal two-channel matrix
        <BlockMath tex="S_\chi(s)=\frac12\begin{pmatrix}1+\chi(s)&1-\chi(s)\\[2pt]1-\chi(s)&1+\chi(s)\end{pmatrix}." />
        This matrix is unitary wherever <InlineMath tex="|\chi|=1" />, because its eigenvalues are
        <InlineMath tex="1" /> and <InlineMath tex="\chi" />. That boundary identity still does not
        establish a causal passive realization or identify scattering zeros with zeta zeros.
      </Card>
    </Section>
  );
}

function V70Corrections() {
  return (
    <Section id="v70" number={4} title="v70 shift-bridge corrections">
      <Paragraph>
        Center the completed function and measure the furthest horizontal zero displacement by
      </Paragraph>
      <BlockMath tex="X(w):=\xi\!\left(\tfrac12+w\right),\qquad \Delta:=\sup_{X(\lambda)=0}|\Re\lambda|." />
      <Paragraph>
        The corrected fixed-shift statement in the v70 draft is a strict interior threshold:
      </Paragraph>
      <BlockMath tex="\bigl[\,|X(w-a)|<|X(w+a)|\ \text{for every }\Re w>0\,\bigr]\Longleftrightarrow a\ge\Delta." />
      <Paragraph>
        The endpoint <InlineMath tex="a=\Delta" /> belongs to this strict interior statement.
        However, it must not be conflated with an exact fixed-<InlineMath tex="a" /> criterion for
        positive semidefiniteness of the whole kernel. Common shifted zeros can create zero rows,
        which semidefiniteness permits. The safe all-shifts statement is
      </Paragraph>
      <BlockMath tex="\bigl[\,K_a\succeq0\ \text{for every }a>0\,\bigr]\Longleftrightarrow\Delta=0\Longleftrightarrow\mathrm{RH}." />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 14,
          marginTop: 18,
        }}
      >
        <Card tone="model">
          <strong style={{ color: '#e2e8f0' }}>Common-zero correction</strong>
          <BlockMath tex="\operatorname{ord}^{\rm pole}_{\lambda-a}R_a=\bigl[m(\lambda)-m(\lambda-2a)\bigr]_+,\qquad R_a(w)=\frac{X(w-a)}{X(w+a)}." />
          Negative-index counts must use residual, uncancelled pole order rather than counting every
          shifted denominator zero.
        </Card>
        <Card tone="model">
          <strong style={{ color: '#e2e8f0' }}>Half-plane Blaschke correction</strong>
          <BlockMath tex="B_\alpha(w)=\frac{w-\alpha}{w+\overline{\alpha}},\qquad \Re\alpha>0." />
          This is the right-half-plane factor with a zero at <InlineMath tex="\alpha" /> and unit
          boundary modulus. A right-half-plane pole contributes the inverse factor, subject to the
          residual-order caveat above.
        </Card>
      </div>
      <Paragraph>
        These are structural reductions. The v70 paper explicitly remains a research-program
        draft; proving the all-shifts positivity target non-circularly is still RH-hard.
      </Paragraph>
    </Section>
  );
}

function RepositoryTheoremEvidence() {
  const theorem = NEWMAN_LAMBDA_01787854_THEOREM;
  const target = theorem.exactTarget;
  const finite = theorem.finiteEvidence;
  const tail = theorem.tailEvidence;

  return (
    <Section id="candidate" number={5} title="What the 0.1787854 repository theorem proves">
      <Card tone="repository">
        <Badge tone="repository">repository-proved · computer-assisted · peerReviewed=false</Badge>
        <BlockMath tex={target.identityTex} />
        The headline value is an exact rational assembly, not a rounded fit. The proof is pinned to
        root commit <code>{theorem.identity.packageCommit.slice(0, 12)}</code>, immutable release{' '}
        <code>{theorem.identity.releaseCommit.slice(0, 12)}</code>, and a SHA-256 seal.
      </Card>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
          marginTop: 14,
        }}
      >
        <Card tone="model">
          <strong style={{ color: '#e2e8f0' }}>Finite range</strong>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 19, marginTop: 8 }}>
            {finite.firstN.toLocaleString()}–{finite.lastN.toLocaleString()}
          </div>
          {finite.rowCount.toLocaleString()} contiguous rows; no stored gaps, duplicates, nonpositive
          rows, or UNCERT rows.
        </Card>
        <Card tone="model">
          <strong style={{ color: '#e2e8f0' }}>Finite margin</strong>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 19, marginTop: 8 }}>
            ≥ {finite.finiteMarginLowerBoundLiteral}
          </div>
          Direct-Dini ratio {finite.dini.worstCertifiedRatioLiteral} &lt; 1 at 180 and 256 bits.
        </Card>
        <Card tone="model">
          <strong style={{ color: '#e2e8f0' }}>Tail gate</strong>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 19, marginTop: 8 }}>
            {tail.checksPassed}/{tail.checksTotal}
          </div>
          Conservative slack &gt; {tail.slackLowerBound}; contraction upper bound{' '}
          {tail.contractionUpperBoundLiteral} &lt; 1.
        </Card>
      </div>

      <Paragraph>
        The root assembly checks these numerical certificates together with the closed compact
        slab, final-time half-strip, Platt–Trudgian verified height, and exact Polymath criterion
        weld. The resulting theorem is unpublished and unpeer-reviewed, and its positive bound
        does not imply RH.
      </Paragraph>
      <Link
        to="/newman-lambda-01787854-candidate"
        style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)', fontSize: 13 }}
      >
        Open the complete theorem certificate and replay record →
      </Link>
    </Section>
  );
}

function ClosedInterfaces() {
  return (
    <Section id="obligations" number={6} title="The eight formerly open interfaces">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 12,
        }}
      >
        {NEWMAN_LAMBDA_01787854_THEOREM.closedAuditItems.map((item, index) => (
          <Card key={item.title} tone="repository">
            <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
              <span style={{ color: '#22d3ee', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <strong style={{ color: '#e2e8f0' }}>{item.title}</strong>
            </div>
            <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 8 }}>
              {item.detail}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function BottomLine() {
  return (
    <Section id="bottom-line" number={7} title="Bottom line">
      <Card tone="open">
        <div style={{ color: '#e2e8f0', fontSize: 21, fontWeight: 800 }}>
          No current Twin Ladder Explorer result proves RH or <InlineMath tex="\Lambda=0" />.
        </div>
        <Paragraph>
          The defensible outputs are: a corrected v70 structural model, clearer zero/pole and
          positivity bookkeeping, a reproducible public <InlineMath tex="0.1875" /> package with
          an explicitly noted local repair, and a stronger <InlineMath tex="0.1787854" />
          computer-assisted theorem proved in the root repository. That theorem is unpublished
          and unpeer-reviewed. The global Twin Ladder residual inequality remains exactly
          equivalent to RH, so no current result proves <InlineMath tex="\Lambda=0" />.
        </Paragraph>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <Link to="/lambda-bounds" style={{ color: '#a5b4fc' }}>
            Bounds and evidence ledger
          </Link>
          <Link to="/twin-ladder" style={{ color: '#a5b4fc' }}>
            Twin-ladder v70
          </Link>
          <Link to="/shift-bridge-positivity" style={{ color: '#a5b4fc' }}>
            Shift-bridge threshold
          </Link>
        </div>
      </Card>
    </Section>
  );
}

export default function FullStoryPage() {
  return (
    <div className="page" style={{ maxWidth: 1320, margin: '0 auto', padding: '24px 20px 80px' }}>
      <style>{`
        @media (max-width: 800px) {
          .full-story-layout {
            display: block !important;
          }
          .full-story-contents {
            position: static !important;
            width: auto !important;
            margin-top: 20px;
          }
          .full-story-contents ol {
            display: flex;
            flex-wrap: wrap;
            gap: 8px 14px;
          }
          .full-story-contents li {
            margin-top: 0 !important;
          }
        }
      `}</style>
      <HonestCeilingBanner />
      <div
        style={{
          padding: '30px 34px',
          border: '1px solid rgba(99,102,241,0.35)',
          borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.14), rgba(15,23,42,0.42))',
          marginTop: 18,
        }}
      >
        <div
          style={{
            color: '#a5b4fc',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: 0.8,
            textTransform: 'uppercase',
          }}
        >
          Evidence-graded research narrative
        </div>
        <h1 style={{ color: '#e2e8f0', fontSize: 39, margin: '10px 0 12px' }}>
          The Twin-Ladder / Λ Program
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: 16, lineHeight: 1.75, margin: 0, maxWidth: 900 }}>
          A corrected account of what is classical, what v70 derives inside a research draft,
          what the certificate packages compute, and which logical welds remain open.
        </p>
      </div>

      <div className="full-story-layout" style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        <Contents />
        <main style={{ flex: 1, minWidth: 0, maxWidth: 920 }}>
          <CurrentStatus />
          <LambdaContext />
          <TwinLadderModel />
          <V70Corrections />
          <RepositoryTheoremEvidence />
          <ClosedInterfaces />
          <BottomLine />
        </main>
      </div>
    </div>
  );
}
