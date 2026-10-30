import { createResearchModule } from './module-contract.js';

const SOURCE_COMMIT = '1a85a498d3de8a42bb7d7b18a916b9b603cfd688';

export const SUZUKI_RECURRENCE = createResearchModule({
  schemaVersion: 1,
  id: 'suzuki-recurrence',
  route: '/rh-suzuki-recurrence',
  title: 'Suzuki scalar criterion and the signed reserve recurrence',
  updatedAt: '2026-10-30',
  status: 'proved-analytic',
  reviewStatus: 'accepted',
  reviewScope: 'internal',
  rhStatus: 'open',
  summary:
    'The constant-box Weil direction admits an exact prime-power reserve recurrence. ' +
    'Its positive convexity debt is summable; the lower bound for the remaining signed-credit prefixes is still open.',
  bodyPath: 'research/rh/modules/suzuki-recurrence.md',
  claimBoundary: {
    title: 'Exact analytic reduction, not the missing arithmetic bound',
    statement:
      'The normalization, event-reserve equivalence, conjugate enclosure, signed-credit/debt recurrence, ' +
      'and summable-debt estimate are proved within their stated hypotheses. The all-scale signed-credit lower bound is not proved.',
    doesNotClaim: [
      'It does not prove nonnegativity of $\\Psi(r)$ at all scales or prove RH.',
      'It does not prove positivity of the whole even Weil form; the constant box is one direction only.',
      'It does not make either $M_n$ or $R_n$ monotone. A genuine reserve decrease occurs between $q=4$ and $q=5$.',
      'It does not justify subtracting future positive debt while ignoring future negative signed credits.',
      'It does not assert a fixed positive margin for large $r$.',
    ],
  },
  theorem: {
    label: 'Exact scalar reserve reduction and summable-debt theorem',
    statement:
      'For the actual von Mangoldt normalization, the constant-box energy equals $2\\Psi(W)/W$. ' +
      'All-real scalar nonnegativity $\\Psi(r)\\ge0$ for every $r\\ge\\log2$ is equivalent to nonnegativity of every exact reserve $M_n$. ' +
      'An explicit closed reserve $R_n$ encloses $M_n$, evolves as signed credit minus positive debt, ' +
      'and the full future positive debt is summable. Consequently, using the established one-sided Landau bridge, ' +
      'RH is equivalent to a finite lower bound for the accumulated signed credits; that lower bound remains open.',
    hypotheses: [
      'Use Suzuki’s actual $\\Psi$ normalization with $\\Lambda(p^k)=\\log p$ and the screw function equal to $-\\Psi$.',
      'Order all distinct prime powers and work on $r\\ge\\log 2$; the endpoint hinge vanishes at an event.',
      'For the explicit debt tail use only the elementary bound $\\psi(x)\\le 3x$ and a starting state $H_0\\ge 6e$.',
      'The final RH-equivalence statement uses the separately established one-sided Landau criterion for $D(r)$.',
    ],
    equations: [
      {
        id: 'constant-box-identity',
        label: 'Actual constant-box identity',
        tex: String.raw`\Psi(W)=\frac{W}{2}\,q_W[e_0]`,
        explanation: 'Finite scalar positivity tests this normalized constant-box direction, not every even test function.',
      },
      {
        id: 'event-reserve-equivalence',
        label: 'Exact event reduction',
        tex: String.raw`\Psi(r)\ge 0\ (r\ge\log 2)\quad\Longleftrightarrow\quad M_n\ge 0\ \text{for every }n`,
      },
      {
        id: 'closed-enclosure',
        label: 'Closed conjugate enclosure',
        tex: String.raw`R_n-\epsilon(H_n)\le M_n\le R_n-\frac{4}{25}(H_n/2)^{-5}`,
      },
      {
        id: 'credit-debt-update',
        label: 'Signed credit minus positive debt',
        tex: String.raw`R_{n+1}-R_n=c_q-d_q,\qquad \frac{w^2}{H+w}\le d_q\le\frac{w^2}{H}`,
      },
      {
        id: 'debt-tail',
        label: 'All-future positive-debt bound',
        tex: String.raw`\sum_{\mathrm{events\ after}\ H_0}d_q\le 12(1+H_0^{-1})^2\frac{\log(H_0/6)+1}{H_0}`,
      },
    ],
  },
  derivation: [
    {
      id: 'actual-normalization',
      title: 'Fix the arithmetic normalization',
      body:
        'Define the gamma term and the prime-power triangular sum in Suzuki’s sign convention. ' +
        'The endpoint contribution is zero when the event lies at the right endpoint.',
      equations: [
        {
          id: 'psi-definition',
          tex: String.raw`\begin{aligned}a&=\frac{\psi_0(5/4)-\log\pi}{2},\qquad b=a-2,\qquad \alpha_k=2k+\tfrac12,\\ T(r)&=\sum_{k\ge1}\frac{1-e^{-\alpha_k r}}{\alpha_k^2},\qquad T_\infty=\frac{\psi_0'(5/4)}4,\\ D(r)&=\sum_{n\le e^r}\frac{\Lambda(n)}{\sqrt n}(r-\log n)-4(e^{r/2}-1)+2r,\\ \Psi(r)&=ar+T(r)-D(r).\end{aligned}`,
        },
      ],
      notes: ['Suzuki’s known global nonnegativity criterion is cited, not reproved or claimed as new.'],
    },
    {
      id: 'constant-box-form',
      title: 'Derive the actual constant-box form identity',
      body:
        'The normalized box has triangular overlap correlation. Positive termwise integration of the gamma kernel ' +
        'gives the conformal primitive, while the signed arithmetic pairing gives the triangular prime-power term.',
      equations: [
        {
          id: 'gamma-diagonal',
          tex: String.raw`A_{00}=2a+\frac1W\int_0^W sK(s)\,ds+\int_W^\infty K(s)\,ds,\qquad K(s)=2\sum_{k\ge1}e^{-\alpha_k s}`,
        },
        {
          id: 'gamma-primitive',
          tex: String.raw`\frac W2A_{00}=aW+T(W),\qquad \Psi(W)=\frac W2q_W[e_0]`,
        },
      ],
      notes: ['The box belongs to the logarithmic Fourier form domain; no periodic wraparound or discarded endpoint term is used.'],
    },
    {
      id: 'event-reserve',
      title: 'Reduce every real cell to an exact event reserve',
      body:
        'The cell expression is a strictly convex function minus its event slope. Its affine continuation majorizes ' +
        'the true scalar function globally, so the convex-conjugate minimum is both necessary and sufficient.',
      equations: [
        {
          id: 'event-state',
          tex: String.raw`r_n=\log q_n,\quad w_n=\frac{\Lambda(q_n)}{\sqrt{q_n}},\quad S_n=\sum_{j\le n}w_j,\quad J_n=\sum_{j\le n}w_jr_j,\quad H_n=S_n-b`,
        },
        {
          id: 'convex-conjugate-definitions',
          tex: String.raw`\begin{aligned}r_0&=\log2,\qquad C(r)=4e^{r/2}+br-4+T(r),\\ C^*(s)&=\sup_{r\ge r_0}\{sr-C(r)\},\qquad M_n=J_n-C^*(S_n),\\ u(s)&=(C^*)'(s)=\underset{r\ge r_0}{\operatorname{argmax}}\{sr-C(r)\}.\end{aligned}`,
        },
        {
          id: 'cell-and-reserve',
          tex: String.raw`\Psi(r)=C(r)-S_nr+J_n\ge M_n,\qquad M_n=J_n-C^*(S_n)`,
        },
        {
          id: 'exact-m-update',
          tex: String.raw`M_{n+1}-M_n=\int_{S_n}^{S_n+w_{n+1}}\bigl(r_{n+1}-u(s)\bigr)\,ds`,
        },
        {
          id: 'strict-convexity',
          tex: String.raw`C''(r)=e^{r/2}-\frac{e^{-5r/2}}{1-e^{-2r}}>0\qquad(r\ge r_0)`,
        },
      ],
      notes: ['Strict convexity does not determine the sign of the update.'],
    },
    {
      id: 'closed-conjugate',
      title: 'Enclose the nonlinear conjugate by a closed reserve',
      body:
        'Split the bounded gamma tail from the elementary exponential conjugate. Bounds on the true maximizer and ' +
        'monotonicity of the omitted tail place the exact reserve between two explicit expressions.',
      equations: [
        {
          id: 'interior-maximizer-gate',
          tex: String.raw`\delta_0=\frac8{15}2^{-5/2},\qquad H_1-\delta_0>2\sqrt2`,
          explanation:
            'This verified first-event inequality places every constrained conjugate maximizer in the interior; it is a proof gate, not a numerical positivity claim for all scales.',
        },
        {
          id: 'closed-reserve',
          tex: String.raw`R_n=J_n-2H_n\left[\log(H_n/2)-1\right]-4+T_\infty,\qquad H_n=S_n-b`,
        },
        {
          id: 'gamma-error',
          tex: String.raw`\epsilon(H)=\frac4{25}\frac{x_-(H)^{-5/2}}{1-x_-(H)^{-2}},\qquad x_-(H)=\left(\frac{H-\delta_0}{2}\right)^2`,
        },
      ],
    },
    {
      id: 'signed-credit-debt',
      title: 'Separate signed arithmetic credit from positive convexity debt',
      body:
        'Exact subtraction of consecutive closed reserves produces a signed term depending on the entire weighted ' +
        'history and a nonnegative Bregman-type remainder with two-sided elementary bounds.',
      equations: [
        {
          id: 'next-event-abbreviations',
          tex: String.raw`q=q_{n+1},\qquad H=H_n,\qquad w=\frac{\Lambda(q)}{\sqrt q}`,
        },
        {
          id: 'credit-debt-definitions',
          tex: String.raw`c_q=w\log\frac{q}{(H/2)^2},\qquad d_q=2H\left[(1+w/H)\log(1+w/H)-w/H\right]`,
        },
      ],
      notes: ['A short ordinary-prime gap alone does not determine the credit sign.'],
    },
    {
      id: 'summable-debt',
      title: 'Charge the entire positive debt to adjacent state intervals',
      body:
        'The elementary Chebyshev bound implies a decreasing envelope for each event debt. Adjacent $H$-intervals ' +
        'convert the infinite sum to an explicit convergent integral.',
      equations: [
        {
          id: 'weighted-count-bound',
          tex: String.raw`S(x)\le 6\sqrt{x}-3,\qquad w\le\frac{12\log(H/6)}{H}`,
        },
        {
          id: 'debt-integral',
          tex: String.raw`d_q\le g(H)w,\qquad g(t)=\frac{12\log(t/6)}{t^2}`,
        },
      ],
      notes: ['This estimate uses no prime number theorem, zero hypothesis, or positivity assumption for the credits.'],
    },
    {
      id: 'landau-credit-reduction',
      title: 'Identify the exact remaining RH-strength statement',
      body:
        'Because the positive debt has finite total, lower boundedness of the reserve is equivalent to lower ' +
        'boundedness of the cumulative signed credits. A reserve lower bound gives a one-sided polynomial upper ' +
        'bound for $D(r)$, and the established Landau bridge then yields RH.',
      equations: [
        {
          id: 'prefix-decomposition',
          tex: String.raw`R_N=R_1+G_N-\sum_{n<N}d_{q_{n+1}},\qquad G_N=\sum_{n<N}c_{q_{n+1}}`,
        },
        {
          id: 'equivalent-targets',
          tex: String.raw`\mathrm{RH}\quad\Longleftrightarrow\quad \inf_N R_N> -\infty\quad\Longleftrightarrow\quad \inf_N G_N> -\infty`,
        },
      ],
      notes: ['This equivalence isolates the missing theorem; it does not supply the lower bound.'],
    },
  ],
  verification: {
    result:
      'The mathematical source and independent review accept the stated analytic argument. Hash and replay checks ' +
      'verify the published bytes and associated algebraic receipts, not the proof by themselves.',
    scope:
      'Internal line-by-line proof review plus publication-hash and companion symbolic/scalar replay. External peer review and formal verification are not claimed.',
    reproducibilityStatus: 'partial',
    commands: [
      {
        label: 'Verify the focused Suzuki publication package',
        command: 'npm run audit:rh-suzuki',
        cwd: '.',
        expected: 'Every publication hash and cross-manifest identity passes.',
      },
      {
        label: 'Replay the bundled scalar and algebra checks',
        command: 'python replay.py',
        cwd: 'research/rh/suzuki',
        expected: 'The scoped frozen JSON fields reproduce; analytic proof review remains a separate obligation.',
      },
    ],
    artifacts: [
      {
        label: 'Canonical recurrence module body',
        path: 'research/rh/modules/suzuki-recurrence.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: '46453c52806db3757535fb10aca6875b219e2a024c5c4b9b9351f2a0ac5a6e30',
        sizeBytes: 5498,
      },
      {
        label: 'Normalization and constant-box proof note',
        path: 'research/rh/suzuki/notes/normalization-and-constant-box.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: '3c498e3e949f50f7691fca4bd8c56d4963ffc222dbd433abb995532863843127',
        sizeBytes: 8026,
      },
      {
        label: 'Closed reserve and summable-debt proof note',
        path: 'research/rh/suzuki/notes/closed-reserve-and-debt.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: '8294f9598408fd0f47502cd7214ad17a24b88ff7025d684c1b2cd5f8ab62d1a0',
        sizeBytes: 12371,
      },
      {
        label: 'Independent reserve/Bregman review',
        path: 'research/rh/suzuki/reviews/reserve-bregman-review.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: '9d51a4256496afec2266c3e22c67a82450ff617d8c18f2fcd504c933bfa2536f',
        sizeBytes: 7027,
      },
    ],
    replays: [
      {
        label: 'Independent internal proof review',
        method:
          'A separate mathematical audit checked the normalization, interior-maximizer gate, conjugate comparison, ' +
          'credit/debt algebra, summable tail, and the exact scope of the Landau reduction.',
        outcome: 'Accepted within the stated analytic scope; the signed-credit lower bound remains open.',
        evidence: [
          'research/rh/suzuki/reviews/reserve-bregman-review.md',
          'research/rh/suzuki/SOURCE_PROVENANCE.json',
        ],
      },
    ],
    evidence: [
      {
        label: 'Publication SHA-256 manifest',
        kind: 'checksum manifest',
        location: 'research/rh/suzuki/PUBLICATION_SHA256SUMS',
      },
      {
        label: 'Curated source-to-publication mapping',
        kind: 'provenance',
        location: 'research/rh/suzuki/SOURCE_PROVENANCE.json',
      },
      {
        label: 'Suzuki Theorem 1.7 author preprint',
        kind: 'primary reference',
        location: 'arXiv:2206.03682v4',
        href: 'https://arxiv.org/html/2206.03682v4#S1',
        note: 'The known global nonnegativity criterion is attributed, not claimed as a new theorem.',
      },
    ],
  },
  blockers: [
    {
      id: 'signed-credit-prefix',
      title: 'Lower-bound the cumulative signed credits',
      statement:
        'Prove $\\inf_N G_N> -\\infty$ for the exact actual-prime-power credits, without replacing their sign by an absolute-value estimate or importing an RH-strength weighted-prime bound.',
      physicsAnalogy:
        'The positive convexity debt is a finite amount of friction. The unresolved signed credits are the drive force: ' +
        'bounding total friction cannot stop an indefinitely negative drive from draining the reserve.',
      nextTest:
        'Seek an exact summation-by-parts, entropy, or compensated-storage identity for the signed prefix $G_N$ that preserves the weighted Chebyshev error sign.',
    },
  ],
  provenance: {
    sourceRefs: [
      {
        repository: 'judegomila/mathexplorer',
        branch: 'codex/rh-module-source-staging-2026-10-30',
        commit: SOURCE_COMMIT,
        access: 'private-repository',
        paths: [
          'content/rh-modules/suzuki-recurrence.md',
          'research/rh/suzuki/notes/normalization-and-constant-box.md',
          'research/rh/suzuki/notes/closed-reserve-and-debt.md',
          'research/rh/suzuki/reviews/reserve-bregman-review.md',
          'research/rh/suzuki/SOURCE_PROVENANCE.json',
          'research/rh/suzuki/PUBLICATION_SHA256SUMS',
        ],
        note:
          'Private-repository access is required. The canonical body was moved byte-identically to research/rh/modules; its SHA-256 is unchanged and the relocation is recorded in SOURCE_PROVENANCE.json.',
      },
    ],
    sourceManifestPath: 'research/rh/suzuki/SOURCE_PROVENANCE.json',
    curatorNote:
      'Source hashes establish byte identity, not mathematical truth. Internal acceptance records scoped proof review, not peer review or formal verification.',
  },
  failures: [],
  references: [
    'M. Suzuki, Aspects of the screw function corresponding to the Riemann zeta-function, JLMS 108 (2023), Theorem 1.7.',
    'The project one-sided Landau criterion for the arithmetic term D(r), used only for the equivalence of lower-bounded signed credit and RH.',
  ],
});

export const SUZUKI_RECURRENCE_ASSERTIONS = Object.freeze([
  {
    name: 'Suzuki recurrence keeps RH explicitly open',
    holds: () => SUZUKI_RECURRENCE.rhStatus === 'open' &&
      SUZUKI_RECURRENCE.claimBoundary.doesNotClaim.some((claim) => /prove RH/i.test(claim)),
  },
  {
    name: 'Suzuki recurrence is an internally reviewed analytic theorem',
    holds: () => SUZUKI_RECURRENCE.status === 'proved-analytic' &&
      SUZUKI_RECURRENCE.reviewStatus === 'accepted' &&
      SUZUKI_RECURRENCE.reviewScope === 'internal' &&
      SUZUKI_RECURRENCE.verification.reproducibilityStatus === 'partial',
  },
  {
    name: 'Suzuki recurrence pins canonical body and source commit',
    holds: () => SUZUKI_RECURRENCE.verification.artifacts.some((artifact) =>
      artifact.path === 'research/rh/modules/suzuki-recurrence.md' &&
      artifact.sha256 === '46453c52806db3757535fb10aca6875b219e2a024c5c4b9b9351f2a0ac5a6e30') &&
      SUZUKI_RECURRENCE.provenance.sourceRefs.every((source) => source.commit === SOURCE_COMMIT),
  },
  {
    name: 'Suzuki recurrence preserves the signed-credit blocker',
    holds: () => SUZUKI_RECURRENCE.blockers.some((blocker) =>
      blocker.id === 'signed-credit-prefix' && /inf_N G_N/.test(blocker.statement)),
  },
  {
    name: 'Suzuki recurrence does not upgrade scalar work to whole-even positivity',
    holds: () => SUZUKI_RECURRENCE.claimBoundary.doesNotClaim.some((claim) => /whole even Weil form/i.test(claim)),
  },
  {
    name: 'Suzuki recurrence renders b and the limiting gamma tail explicitly',
    holds: () => SUZUKI_RECURRENCE.derivation.some((step) =>
      step.id === 'actual-normalization' && step.equations.some((equation) =>
        equation.id === 'psi-definition' && equation.tex.includes('b=a-2') &&
        equation.tex.includes('T_\\infty=\\frac{\\psi_0\'(5/4)}4'))),
  },
  {
    name: 'Suzuki recurrence renders C, C star, and the constrained maximizer u',
    holds: () => SUZUKI_RECURRENCE.derivation.some((step) =>
      step.id === 'event-reserve' && step.equations.some((equation) =>
        equation.id === 'convex-conjugate-definitions' && equation.tex.includes('C(r)=') &&
        equation.tex.includes('C^*(s)') && equation.tex.includes('u(s)') &&
        equation.tex.includes('r\\ge r_0'))),
  },
  {
    name: 'Suzuki recurrence renders H state and next-event abbreviation',
    holds: () => SUZUKI_RECURRENCE.derivation.some((step) =>
      step.id === 'event-reserve' && step.equations.some((equation) =>
        equation.id === 'event-state' && equation.tex.includes('H_n=S_n-b'))) &&
      SUZUKI_RECURRENCE.derivation.some((step) =>
        step.id === 'signed-credit-debt' && step.equations.some((equation) =>
          equation.id === 'next-event-abbreviations' && equation.tex.includes('H=H_n'))),
  },
  {
    name: 'Suzuki recurrence renders delta zero and the first-event interior gate',
    holds: () => SUZUKI_RECURRENCE.derivation.some((step) =>
      step.id === 'closed-conjugate' && step.equations.some((equation) =>
        equation.id === 'interior-maximizer-gate' && equation.tex.includes('\\delta_0=') &&
        equation.tex.includes('H_1-\\delta_0>2\\sqrt2') &&
        /proof gate/.test(equation.explanation) && /not a numerical positivity claim/.test(equation.explanation))),
  },
  {
    name: 'Suzuki recurrence keeps the exact event and debt-tail scopes visible',
    holds: () => SUZUKI_RECURRENCE.theorem.hypotheses.some((hypothesis) =>
      hypothesis.includes('r\\ge\\log 2')) &&
      SUZUKI_RECURRENCE.theorem.hypotheses.some((hypothesis) =>
        hypothesis.includes('H_0\\ge 6e')),
  },
  {
    name: 'Suzuki recurrence states the exact all-real scalar equivalence',
    holds: () => SUZUKI_RECURRENCE.theorem.statement.includes(
      'All-real scalar nonnegativity $\\Psi(r)\\ge0$ for every $r\\ge\\log2$',
    ) && SUZUKI_RECURRENCE.theorem.equations.some((equation) =>
      equation.id === 'event-reserve-equivalence' && equation.tex.includes('r\\ge\\log 2')),
  },
  {
    name: 'Suzuki recurrence next-event shorthand uses the actual successor event',
    holds: () => SUZUKI_RECURRENCE.derivation.some((step) =>
      step.id === 'signed-credit-debt' && step.equations.some((equation) =>
        equation.id === 'next-event-abbreviations' && equation.tex.includes('q=q_{n+1}') &&
        equation.tex.includes('H=H_n') && equation.tex.includes('w=\\frac{\\Lambda(q)}{\\sqrt q}'))),
  },
]);

export default SUZUKI_RECURRENCE;
