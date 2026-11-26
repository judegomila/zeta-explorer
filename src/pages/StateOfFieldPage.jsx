import React from 'react';
import { SnapshotBanner, CurrentStatusList } from '../components/ProgramStatus.jsx';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ED } from '../styles/tokens.js';

/* State of the Field — a cited map of how RH is actually being approached in the
   wider mathematical community (2023–2026), and where this program engages each
   line. Sourced from a literature review; distinguishes proven results from
   conjectures/claims. Functional language, no overclaim. Rendered under
   .ed-root so the editorial theme applies. */

const PROGRAMS = [
  {
    key: 'zero-density',
    title: 'Zero-density & large values',
    leaders: 'Guth · Maynard · Tao',
    status: 'RIGOROUS — but capped below RH',
    color: ED.series3,
    idea:
      'Rather than prove no zeros lie off the line (RH), bound how many could. Guth–Maynard (2024) gave the first improvement on Huxley’s 1972 zero-density exponent in ~50 years (to 30/13 ≈ 2.31), via new large-value estimates for Dirichlet polynomials — yielding primes in shorter intervals.',
    obstruction:
      'It bounds the count of hypothetical off-line zeros; RH needs exactly zero — a categorically different statement. It has not even reached the (weaker-than-RH) Density Hypothesis. Maynard: “these aren’t the right techniques to solve the Riemann hypothesis itself.”',
    refs: 'arXiv:2405.20552 (2024); Tao, Exponent Database',
    engages: [
      { to: '/guth-maynard-scoping', label: 'Guth–Maynard scoping (this program)' },
      { to: '/zero-density-scoping', label: 'Zero-density scoping' },
    ],
  },
  {
    key: 'moments-rmt',
    title: 'Moments & Random Matrix Theory',
    leaders: 'Conrey · Keating · Snaith · Soundararajan · Radziwiłł · Arguin · Bourgade',
    status: 'PREDICTIVE — mostly assumes RH',
    color: ED.series1,
    idea:
      'Model ζ near height T by the characteristic polynomial of a random unitary matrix (dictionary N ↔ log T). Predicts moment asymptotics (Keating–Snaith 2000, CFKRS recipe) and the Fyodorov–Hiary–Keating law for the maximum of |ζ| — the latter now essentially confirmed (Annals 2024).',
    obstruction:
      'A statistical/heuristic model. Only the k=1 (1918) and k=2 (1926) moments are proven; no asymptotic for k ≥ 3 exists. It supports RH powerfully (Montgomery–Odlyzko GUE spacing) but assumes it in most statements and supplies no operator.',
    refs: 'Keating–Snaith (2000); Harper arXiv:1305.4618; Arguin et al; FHK arXiv:2007.00988, 2307.00982',
    engages: [
      { to: '/pair-correlation', label: 'Pair correlation (this program)' },
      { to: '/gue-comparison', label: 'GUE comparison' },
    ],
  },
  {
    key: 'lambda',
    title: 'The de Bruijn–Newman constant Λ',
    leaders: 'Rodgers · Tao · Polymath 15 · Platt · Trudgian',
    status: 'PROVEN 0 ≤ Λ ≤ 0.2 — RH ⟺ Λ ≤ 0',
    color: ED.brass,
    idea:
      'Heat-flow the ξ-function: H_t has only real zeros iff t ≥ Λ, and H₀ = ξ, so RH ⟺ Λ ≤ 0. Rodgers–Tao (2020) proved Λ ≥ 0; Polymath 15 + Platt–Trudgian’s verified height give Λ ≤ 0.2. This is the program’s home lane.',
    obstruction:
      'Rodgers–Tao’s Λ ≥ 0 means RH, if true, is “barely true” (Λ = 0 exactly). The only input that lowers the upper bound is more verified zero height — compute-bound, and it can never reach Λ ≤ 0 in finite computation (that would be proving RH).',
    refs: 'Rodgers–Tao arXiv:1801.05914 (Forum Math Pi 2020); Polymath 15 arXiv:1904.12438',
    engages: [
      { to: '/lambda-bounds', label: 'The bounds ledger (this program)' },
      { to: '/pt-floor-audit', label: 'What binds the floor' },
      { to: '/lambda-timeline', label: 'Λ timeline' },
    ],
  },
  {
    key: 'critical-line-proportion',
    title: 'Critical-line proportion / mollifiers',
    leaders: 'Levinson · Conrey · Pratt–Robles–Zaharescu–Zeindler',
    status: 'RIGOROUS — partial proportions, not RH',
    color: ED.series3,
    idea:
      'Prove that a positive proportion of the nontrivial zeros lie exactly on the critical line, via mollified moment computations. Levinson (1974) reached 1/3, Conrey (1989) reached 2/5, and the peer-reviewed record is 5/12 ≈ 0.4167 (Pratt–Robles–Zaharescu–Zeindler 2020). In August 2026 an external Claude/Anthropic project announced an unconditional ≥ 2/3 (0.6725, simple and on-line) result — Lean-checked and reviewed by Conrey and Goldston, but not peer-reviewed, so it is not adopted here as the record.',
    obstruction:
      'The mollifier method gives proportions strictly below 1; each gain costs a longer mollifier and the method saturates well short of 100%. Proving the proportion is exactly 1 is not RH either — RH requires every zero on the line, not almost all.',
    refs: 'Levinson (1974); Conrey (1989); Pratt–Robles–Zaharescu–Zeindler, Res. Math. Sci. (2020); external 2026 ≥2/3 announcement (unrefereed)',
    engages: [
      { to: '/critical-line-proportion', label: 'Critical-line proportion (this program)' },
    ],
  },
  {
    key: 'spectral',
    title: 'Spectral / Hilbert–Pólya',
    leaders: 'Connes · Berry–Keating · (de Branges, refuted)',
    status: 'CONCEPTUAL — equivalent to RH, open',
    color: ED.series5,
    idea:
      'Realize the zeros’ ordinates as eigenvalues of a self-adjoint operator; self-adjointness would force RH. Connes’ noncommutative-geometry program recasts Weil’s explicit formula as a trace formula and reduces RH to Weil positivity (with real refereed sub-results: archimedean positivity 2021; prolate-spectrum matching PNAS 2022).',
    obstruction:
      'A reformulation: the global positivity that would give RH is open and equivalent to RH. Berry–Keating H = xp reproduces only the mean zero density; de Branges’ Hilbert-space approach is refuted as formulated (Conrey–Li).',
    refs: 'Connes–Consani arXiv:2006.13771; Connes–Moscovici PNAS 2022; Conrey–Li arXiv:math/9812166',
    engages: [
      { to: '/berry-keating-xp', label: 'Berry–Keating H = xp (this program)' },
      { to: '/connes-adelic', label: 'Connes adelic' },
    ],
  },
  {
    key: 'positivity',
    title: 'Positivity criteria',
    leaders: 'Li · Weil · Beurling–Nyman · Báez-Duarte',
    status: 'EXACT EQUIVALENCES — as hard as RH',
    color: ED.accent,
    idea:
      'RH ⟺ a positivity or density condition: Li’s λ_n ≥ 0; Weil’s explicit-formula functional positive-semidefinite; the constant 1 in the L²-closure of dilated fractional-part functions (Beurling–Nyman / Báez-Duarte).',
    obstruction:
      'Each encodes but does not supply the arithmetic input. The λ_n are positive as far as computed with no proof; Beurling–Nyman decay under RH is only ~1/log n (weak numerically). Proving any is exactly proving RH.',
    refs: 'Bombieri–Lagarias (1999); Báez-Duarte arXiv:math/0202141',
    engages: [
      { to: '/collapse-chain', label: 'Volterra collapse (this program)' },
      { to: '/rh-equivalents', label: 'RH-equivalents' },
    ],
  },
];

const PEOPLE = [
  ['James Maynard', 'Oxford, Fields 2022 — Guth–Maynard zero-density (2024); prime gaps'],
  ['Terence Tao', 'UCLA, Fields 2006 — Rodgers–Tao Λ ≥ 0; Exponent Database'],
  ['Larry Guth', 'MIT — harmonic analysis; 2024 large-value estimates'],
  ['Kannan Soundararajan', 'Stanford — moments, resonance method, sharp bounds'],
  ['Maksym Radziwiłł', 'Caltech/UT Austin — short-interval multiplicativity; moments'],
  ['Kaisa Matomäki', 'Turku — Matomäki–Radziwiłł short intervals; Chowla progress'],
  ['Louis-Pierre Arguin', 'Oxford — Fyodorov–Hiary–Keating extreme values'],
  ['Alain Connes', 'IHÉS — noncommutative-geometry / trace-formula program'],
  ['Brian Conrey', 'AIM — proved >2/5 of zeros on the line (1989; refereed record now 5/12, PRZZ 2020); CFKRS moment conjectures'],
  ['Jon Keating · Nina Snaith', 'Oxford / Bristol — RMT–moments bridge; FHK'],
  ['Peter Sarnak', 'IAS — Katz–Sarnak zero statistics; families of L-functions'],
  ['Enrico Bombieri', 'IAS, Fields 1974 — RH for curves over finite fields; the Clay statement'],
];

function StatusChip({ status, color }) {
  return (
    <span
      className="ed-mono"
      style={{
        fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, color,
        border: `1px solid ${color}`, borderRadius: 4, padding: '1px 7px', whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
}

export default function StateOfFieldPage() {
  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>the wider field · RH is unproven · new arithmetic input needed</span>} />
      <div className="ed-full" style={{ maxWidth: '60rem', padding: '28px 34px 70px' }}>
        <div className="ed-lbl">the wider field</div>
        <h1 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 38, lineHeight: 1.1, margin: '6px 0 12px', color: 'var(--ink)' }}>
          State of the Field
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          How the Riemann Hypothesis is actually being approached in the wider mathematical community
          (2023–2026), and where this program engages each line. The Riemann Hypothesis is{' '}
          <strong>unproven</strong>: there is no peer-reviewed proof and no credible claim of one. The
          real progress of the 2020s is <em>adjacent</em> — sharper control over where zeros could stray,
          confirmation of their statistics, and a pinning of RH to a knife-edge — and the field’s own
          leaders say current methods cannot reach RH without genuinely new arithmetic input.
        </p>

        <SnapshotBanner date="2026-08-27">The survey entries below end at that date. Two later items from outside this project are listed here from the repository record; neither is refereed.</SnapshotBanner>
        <CurrentStatusList ids={['zero-free', 'lambda-third-party-0107965']} />

        <div style={{ borderLeft: '3px solid var(--brass)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '22px 0 6px' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>the unifying obstruction</div>
          <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            Every soft/analytic/statistical method is <strong>flow-blind</strong>: it reproduces the
            <em> average</em> behaviour of the zeros (density, GUE spacing, mean moments) but cannot force
            <em> individual</em> zeros onto the line. The positivity and spectral criteria are provably
            <em> equivalent</em> to RH, so they relocate the difficulty rather than remove it. This is the
            analytic analogue of the sieve-theory parity barrier — and it is exactly this program’s own{' '}
            <Link to="/flow-blindness-no-go">flow-blindness no-go</Link>: no soft hypothesis proves RH;
            arithmetic input is required.
          </p>
        </div>

        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 24, margin: '34px 0 4px', color: 'var(--ink)' }}>
          The live programs
        </h2>

        {PROGRAMS.map((p) => (
          <section key={p.key} style={{ border: '1px solid var(--hairline)', borderRadius: 10, background: 'var(--paper2)', padding: '18px 20px', margin: '16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <h3 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 20, margin: 0, color: 'var(--ink)' }}>{p.title}</h3>
              <StatusChip status={p.status} color={p.color} />
            </div>
            <div className="ed-mono" style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 4 }}>{p.leaders}</div>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '12px 0 0' }}>{p.idea}</p>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '10px 0 0' }}>
              <strong style={{ color: 'var(--ink)' }}>Obstruction. </strong>{p.obstruction}
            </p>
            <div className="ed-mono" style={{ fontSize: 11, color: 'var(--faint)', marginTop: 10 }}>{p.refs}</div>
            <div style={{ marginTop: 12 }}>
              <span className="ed-lbl" style={{ marginRight: 8 }}>engaged here</span>
              {p.engages.map((e, i) => (
                <React.Fragment key={e.to}>
                  {i > 0 && <span style={{ color: 'var(--faint)' }}> · </span>}
                  <Link to={e.to} style={{ fontSize: 13.5, fontWeight: 600 }}>{e.label}</Link>
                </React.Fragment>
              ))}
            </div>
          </section>
        ))}

        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 24, margin: '34px 0 4px', color: 'var(--ink)' }}>
          Who is working on it
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px 20px', marginTop: 12 }} className="ed-people-grid">
          {PEOPLE.map(([name, what]) => (
            <div key={name} style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--ink)' }}>{name}</strong> — {what}
            </div>
          ))}
        </div>

        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 24, margin: '34px 0 4px', color: 'var(--ink)' }}>
          Honest verdict
        </h2>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          Not close. The strongest 2020s advances either bound how <em>rare</em> violations could be
          (Guth–Maynard), confirm the <em>statistics</em> zeros would have (FHK, moments), or pin RH to
          Λ = 0 (Rodgers–Tao) — none is a route to RH. Most promising rigorous frontier: zero-density /
          large values, though structurally capped short of RH. Most serious conceptual attempt: Connes’
          spectral program, though equivalent to RH. Considered non-viable as stated: de Branges’ approach
          (refuted), naive Hilbert–Pólya operators (mean density only), Jensen–Pólya hyperbolicity as an RH
          route. The certified numerical record is height <strong>3×10¹²</strong> (Platt–Trudgian 2021,
          12.36 trillion zeros); it and the Λ upper bound advance only with more verified height, which is
          compute-bound and cannot cross zero.
        </p>

        <p style={{ fontSize: 12.5, color: 'var(--faint)', lineHeight: 1.6, marginTop: 22, borderTop: '1px solid var(--hairline)', paddingTop: 14 }}>
          Sources include: Guth–Maynard arXiv:2405.20552; Rodgers–Tao arXiv:1801.05914; Polymath 15
          arXiv:1904.12438; Platt–Trudgian arXiv:2004.09765; Fyodorov–Hiary–Keating arXiv:2007.00988 /
          2307.00982; Connes–Consani arXiv:2006.13771; Conrey–Li arXiv:math/9812166; Griffin–Ono–Rolen–Zagier
          arXiv:1902.07321. This page summarises external work by others and separates proven results from
          conjectures and unrefereed claims; it is not itself a result of this program.
        </p>

        <div style={{ marginTop: 24 }}>
          <Link to="/atlas">← the atlas</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/state-of-program">this program’s state ↗</Link>
        </div>
      </div>
    </div>
  );
}
