import { createResearchModule } from './module-contract.js';

const SOURCE_COMMIT = '1a85a498d3de8a42bb7d7b18a916b9b603cfd688';
const EVENT_DIGEST = '4c24e9f9cdf8411292143f0e81281da86dabcf08ad0c20c6064bcdffd3da06c1';

export const FINITE_SUZUKI_CERTIFICATE = createResearchModule({
  schemaVersion: 1,
  id: 'finite-suzuki-certificate',
  route: '/rh-finite-suzuki-certificate',
  title: 'All-real finite Suzuki positivity through 10^7',
  updatedAt: '2026-10-30',
  status: 'certified-finite',
  reviewStatus: 'accepted',
  reviewScope: 'internal',
  rhStatus: 'open',
  summary:
    'Outward-rounded Arb certificates prove the exact origin value and positivity of Suzuki’s scalar constant-box function at every real point 0 < r <= log(10^7), including all intervals between prime-power events.',
  bodyPath: 'research/rh/modules/finite-suzuki-certificate.md',

  claimBoundary: {
    title: 'A complete finite scalar certificate, not an RH proof',
    statement:
      'The origin argument, block-prefix hull, 256-bit publication replay, and distinct 384-bit every-event checker together certify $\\Psi(r)>0$ for every real $0<r\\le\\log 10^7$.',
    doesNotClaim: [
      'This does not prove whole-even-form positivity; it certifies only the constant-box scalar direction.',
      'This does not provide an all-scale lower bound, control the future signed endpoint motion, or prove RH.',
      'No positive constant floor is asserted at the origin: $\\Psi(0)=0$ and the certified lower bound there is linear in $r$.',
      'The future hull and freezing budgets bound representation losses only; they do not bound future endpoint reserves or signed credits.',
      'The diagnostic value near 0.02752057335 at $q=3089$ is not identified as the exact minimum of $\\Psi$.',
      'The earlier $10^4$ and $10^6$ certificates are superseded only in finite coverage, not invalidated.',
    ],
  },

  theorem: {
    label: 'Certified finite theorem',
    statement:
      'With the scalar normalization and reserve definitions in the recurrence module, the following inequalities hold for every real point in the stated intervals.',
    hypotheses: [
      'The von Mangoldt event weight at $q=p^k$ is $\\log p/\\sqrt q$, not $k\\log p/\\sqrt q$.',
      'All sign decisions use outward-rounded python-flint/Arb intervals; floating-point samples are not acceptance evidence.',
      'The event certificate uses the exact block-prefix hull and decreasing conjugate-enclosure error from the reviewed recurrence reduction.',
      'The origin supplement retains 128 positive gamma-series terms and discards only a nonnegative tail.',
    ],
    equations: [
      {
        id: 'origin-value',
        label: 'Exact origin',
        tex: String.raw`\Psi(0)=0`,
      },
      {
        id: 'origin-linear-floor',
        label: 'Concave origin segment',
        tex: String.raw`\Psi(r)\ge \frac{r}{100\log(5/4)}\qquad\left(0\le r\le\log\frac54\right)`,
      },
      {
        id: 'finite-positive-floor',
        label: 'All-real finite floor',
        tex: String.raw`\Psi(r)>\frac1{100}\qquad\left(\log\frac54\le r\le\log 10^7\right)`,
        explanation:
          'Together these statements give strict positivity at every real point $0<r\\le\\log 10^7$, not merely at sampled events.',
      },
    ],
  },

  derivation: [
    {
      id: 'prefix-hull-lemma',
      title: 'Exact block-prefix hull',
      body:
        'For a block $a<b$, positivity and ordering of the actual event weights give two affine lower bounds for the accumulated moment. Their crossing reduces every intermediate prefix to two endpoints and one crossing evaluation.',
      equations: [
        {
          id: 'archimedean-convex-term',
          tex: String.raw`F(H)=2H\left[\log\!\left(\frac H2\right)-1\right]`,
        },
        {
          id: 'block-data',
          tex: String.raw`D=S_b-S_a,\quad Q=J_b-J_a,\quad \ell=\log q_{a+1},\quad u=\log q_b`,
        },
        {
          id: 'moment-hull',
          tex: String.raw`J_i-J_a\ge \max\{\ell t,\,Q-u(D-t)\},\qquad t=S_i-S_a`,
        },
        {
          id: 'hull-crossing',
          tex: String.raw`t_*=\frac{uD-Q}{u-\ell}\in(0,D)`,
        },
        {
          id: 'prefix-reserve-bound',
          tex: String.raw`R_i\ge\min\!\left\{R_a,R_b,J_a+\ell t_*-F(H_a+t_*)-4+T_\infty\right\}`,
          explanation:
            'Subtracting the decreasing error $\\epsilon(H_a)$ yields one lower bound for every exact reserve in the block. Single-transition blocks use their endpoints only.',
        },
      ],
      notes: [
        'The proof uses concavity on each side of the crossing. It does not assume that the reserves are monotone.',
        'A failed block is bisected; a failed singleton aborts. No event can be silently skipped.',
      ],
    },
    {
      id: 'outward-event-certificate',
      title: 'Outward-rounded event certificate',
      body:
        'An integer sieve enumerates all $q=p^k\\le10^7$. Arb accumulates the weighted count and first moment. Every accepted block has all lower enclosures strictly above the predetermined rational floor $1/100$.',
      equations: [
        {
          id: 'event-weight',
          tex: String.raw`w(q)=\frac{\log p}{\sqrt q}\qquad(q=p^k)`,
        },
      ],
      notes: [
        'The reviewed audit records both the 192-bit and 256-bit coarse event runs as passing. The compact publication package freezes the complete 256-bit certificate for the current default replay.',
        'The certificate contains 664,579 ordinary primes and 665,134 distinct prime-power events.',
        'It accepts 2,732 blocks, evaluates 2,733 distinct endpoints and 2,865 crossings including rejected parents, and ends at event 9,999,991.',
        'The smallest accepted block lower test is 0.0104853603880709749...; it is a diagnostic certificate value, not the actual minimum of $\\Psi$.',
        `The exact event-list digest is ${EVENT_DIGEST}.`,
      ],
    },
    {
      id: 'independent-every-event-replay',
      title: 'Distinct 384-bit every-event replay',
      body:
        'The independent checker uses a linear least-prime-factor sieve, direct integer prime-power classification, direct $\\log q$, and a directly evaluated digamma constant. It tests every event reserve without the coarse hull.',
      equations: [],
      notes: [
        'All 665,134 direct event tests pass and reproduce the same event digest.',
        'The smallest direct lower-test interval is near 0.02752057335 at $q=3089$; it is diagnostic rather than an identified global minimum of the continuous function.',
      ],
    },
    {
      id: 'all-interevent-points',
      title: 'Every real point between events',
      body:
        'On each actual cell the scalar function is bounded below by the corresponding exact event reserve. The final held cell reaches $\\log10^7$, so no grid interpolation or unsampled gap remains.',
      equations: [
        {
          id: 'cell-lower-bound',
          tex: String.raw`\Psi(r)\ge M_n\qquad\left(\log q_n\le r\le\log q_{n+1}\right)`,
        },
      ],
      notes: [],
    },
    {
      id: 'origin-concavity',
      title: 'Close the interval from the origin to log 2',
      body:
        'Before the first event the gamma-series expression is exact. Its second derivative is negative through $\\log(5/4)$ because the controlling polynomial is at most $-19/64$. Concavity and the certified endpoint value give the linear chord bound; 256 closed Arb cells then cover the remainder through $\\log2$.',
      equations: [
        {
          id: 'origin-expression',
          tex: String.raw`\Psi(r)=4e^{r/2}+br-4+\sum_{k\ge1}\frac{1-e^{-(2k+1/2)r}}{(2k+1/2)^2}`,
        },
        {
          id: 'origin-second-derivative',
          tex: String.raw`\Psi''(r)=e^{r/2}-\frac{e^{-5r/2}}{1-e^{-2r}}`,
        },
        {
          id: 'origin-polynomial-gate',
          tex: String.raw`e^{3r}-e^r-1\le\left(\frac54\right)^3-\frac54-1=-\frac{19}{64}<0`,
        },
      ],
      notes: [
        'The omitted gamma-series tail is nonnegative, so retaining 128 terms is a valid lower enclosure.',
        'The origin receipt records both 192-bit and 256-bit checks and 256 overlapping-endpoint cells.',
      ],
    },
  ],

  verification: {
    result:
      'PASS: the 256-bit block certificate and origin checks match their frozen receipts; the independently written 384-bit checker also passes every one of the 665,134 events.',
    scope:
      'Finite scalar positivity for every real $0<r\\le\\log10^7$, plus exact symbolic/scalar companion checks. Analytic proof conditions remain required; no future endpoint or RH claim is replayed.',
    reproducibilityStatus: 'current-replay',
    commands: [
      {
        label: 'Verify all publication file hashes',
        cwd: '.',
        command: 'shasum -a 256 -c research/rh/suzuki/PUBLICATION_SHA256SUMS',
        expected: 'Every listed module, proof note, checker, receipt, and review reports OK.',
      },
      {
        label: 'Replay the publication package and distinct checker',
        cwd: 'research/rh/suzuki',
        command: 'python replay.py --include-independent',
        expected:
          'PASS at cutoff 10,000,000; all frozen JSON fields agree except intentionally variable elapsed_seconds.',
      },
    ],
    artifacts: [
      {
        label: 'Canonical finite-theorem body',
        path: 'research/rh/modules/finite-suzuki-certificate.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: '4dc523d105722c74645eed93265147c8a58480d239195c8c03fbbb184c5b8cb2',
        sizeBytes: 4132,
      },
      {
        label: 'Portable replay launcher',
        path: 'research/rh/suzuki/replay.py',
        requiredForClaim: true,
        availability: 'available',
        sha256: '83c3a6bf376a3c0407c7c3d146ccedf9dfd63cb39780d147732858b5348177d3',
        sizeBytes: 3046,
      },
      {
        label: '256-bit block-hull producer',
        path: 'research/rh/suzuki/code/certify_coarse_reserve.py',
        requiredForClaim: true,
        availability: 'available',
        sha256: 'e9e83a7c0727b667459090d22db8774381edacb8dae2cbefc768f5bf9420762b',
        sizeBytes: 4254,
      },
      {
        label: 'Origin interval checker',
        path: 'research/rh/suzuki/code/check_origin_interval.py',
        requiredForClaim: true,
        availability: 'available',
        sha256: 'b4bc7cbd42a0eaa59ad7d2ca248e68b760e1ba474e18e082bae3aa6eb7adde3c',
        sizeBytes: 1427,
      },
      {
        label: 'Independent 384-bit every-event checker',
        path: 'research/rh/suzuki/code/independent_spf_and_direct_reserve.py',
        requiredForClaim: true,
        availability: 'available',
        sha256: 'd6e04e32993634a9de7682f49711684c421eea209836da83118a33b6ac7782f9',
        sizeBytes: 3167,
      },
      {
        label: 'Complete compressed 256-bit certificate',
        path: 'research/rh/suzuki/receipts/COARSE_RESERVE_10M_256BIT.json.gz',
        requiredForClaim: true,
        availability: 'available',
        sha256: '5043211b81a548d8e661a8aac26427564c0c0d79081a0dfba89214cb1d47e95d',
        sizeBytes: 279729,
        note:
          'Lossless deterministic gzip. It expands to 1,152,332 bytes with SHA-256 8d4347f8fdcfc78886ad648849f4baf2041b0e01dc342baba1a76f5dffefe18e.',
      },
      {
        label: 'Dual-precision origin receipt',
        path: 'research/rh/suzuki/receipts/ORIGIN_INTERVAL_192_256BIT.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: 'cbc466cd426b79bc70400a461890839ebbe370b2dbbd2a5d9e1203c1f6329159',
        sizeBytes: 1275,
      },
      {
        label: 'Independent 384-bit receipt',
        path: 'research/rh/suzuki/receipts/INDEPENDENT_SPF_DIRECT_384BIT.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: '8761ba88f4cb572dc88b4033fd0969a67d2b8e99a5b7fa02fa5c360bf705542b',
        sizeBytes: 2989,
      },
      {
        label: 'Publication replay receipt',
        path: 'research/rh/suzuki/receipts/PUBLICATION_PACKAGE_REPLAY_RESULT.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: '194938541e839aa16d5d3ca32f0a22e574cbeda4379b3a3cc6169fdf2a76b321',
        sizeBytes: 797,
      },
      {
        label: 'Independent finite-certificate review',
        path: 'research/rh/suzuki/reviews/finite-certificate-review.md',
        requiredForClaim: false,
        availability: 'available',
        sha256: '96f7661557aac63ebe174ac3917be5e4068ef11aef5c9ab0db5c2e0ce62b1950',
        sizeBytes: 17226,
      },
    ],
    replays: [
      {
        label: 'Publication package replay',
        method:
          'Run the portable launcher with its independent option after validating all transport hashes and the decompressed full certificate hash.',
        outcome:
          'All frozen JSON fields agree, ignoring only elapsed_seconds for the two timed computations.',
        command: 'python replay.py --include-independent',
        evidence: [
          'research/rh/suzuki/receipts/PUBLICATION_PACKAGE_REPLAY_RESULT.json',
          'research/rh/suzuki/receipts/COARSE_RESERVE_10M_256BIT.json.gz',
        ],
      },
      {
        label: 'Independent 384-bit direct event replay',
        method:
          'Use a distinct least-prime-factor sieve and direct every-event reserve tests without the block hull.',
        outcome:
          `All 665,134 events pass and reproduce digest ${EVENT_DIGEST}.`,
        command: 'python replay.py --include-independent',
        evidence: [
          'research/rh/suzuki/code/independent_spf_and_direct_reserve.py',
          'research/rh/suzuki/receipts/INDEPENDENT_SPF_DIRECT_384BIT.json',
        ],
      },
      {
        label: 'Origin dual-precision replay',
        method:
          'Recompute the concavity endpoint and cover the closed interval from log(5/4) through log 2 with overlapping Arb cells at 192 and 256 bits.',
        outcome:
          'Both precisions prove the linear origin bound and the 1/100 lower floor on the closed remainder.',
        evidence: [
          'research/rh/suzuki/code/check_origin_interval.py',
          'research/rh/suzuki/receipts/ORIGIN_INTERVAL_192_256BIT.json',
        ],
      },
    ],
    evidence: [
      {
        label: 'Publication SHA-256 manifest',
        kind: 'integrity-manifest',
        location: 'research/rh/suzuki/PUBLICATION_SHA256SUMS',
      },
      {
        label: 'Source and editorial provenance',
        kind: 'source-manifest',
        location: 'research/rh/suzuki/SOURCE_PROVENANCE.json',
      },
      {
        label: 'Exact block-prefix hull note',
        kind: 'proof-note',
        location: 'research/rh/suzuki/notes/coarse-prefix-hull.md',
      },
      {
        label: 'Ten-million finite extension',
        kind: 'proof-note',
        location: 'research/rh/suzuki/notes/finite-extension-10million.md',
      },
      {
        label: 'Origin interval proof',
        kind: 'proof-note',
        location: 'research/rh/suzuki/notes/origin-interval.md',
      },
      {
        label: 'Internal finite-certificate audit',
        kind: 'internal-review',
        location: 'research/rh/suzuki/reviews/finite-certificate-review.md',
        note: 'Internal mathematical review only; not external peer review or formal verification.',
      },
    ],
  },

  blockers: [
    {
      id: 'future-signed-endpoints',
      title: 'The future signed endpoint motion is uncontrolled',
      statement:
        'The finite certificate ends at $10^7$. Neither the summable positive debt nor the future interpolation/freezing losses bound the retained infinite signed credit sequence.',
      physicsAnalogy:
        'The computation certifies every position of a driven oscillator during a long finite time window and bounds future measurement/interpolation error, but it supplies no stability law for the unknown signed force applied afterward.',
      nextTest:
        'Establish a uniform lower bound for the future signed credit or coarse endpoint prefixes without replacing them by absolute values.',
    },
  ],

  provenance: {
    sourceManifestPath: 'research/rh/suzuki/SOURCE_PROVENANCE.json',
    evidenceManifestPath: 'research/rh/suzuki/CODE_AND_RECEIPTS_MANIFEST.json',
    sourceRefs: [
      {
        repository: 'judegomila/mathexplorer',
        branch: 'codex/rh-module-source-staging-2026-10-30',
        commit: SOURCE_COMMIT,
        access: 'private-repository',
        paths: [
          'content/rh-modules/finite-suzuki-certificate.md',
          'research/rh/suzuki/REPRODUCE.md',
          'research/rh/suzuki/SOURCE_PROVENANCE.json',
          'research/rh/suzuki/PUBLICATION_SHA256SUMS',
          'research/rh/suzuki/code/certify_coarse_reserve.py',
          'research/rh/suzuki/code/check_origin_interval.py',
          'research/rh/suzuki/code/independent_spf_and_direct_reserve.py',
          'research/rh/suzuki/receipts/COARSE_RESERVE_10M_256BIT.json.gz',
          'research/rh/suzuki/receipts/ORIGIN_INTERVAL_192_256BIT.json',
          'research/rh/suzuki/receipts/INDEPENDENT_SPF_DIRECT_384BIT.json',
          'research/rh/suzuki/receipts/PUBLICATION_PACKAGE_REPLAY_RESULT.json',
          'research/rh/suzuki/reviews/finite-certificate-review.md',
        ],
        note:
          'The module body was moved byte-identically to research/rh/modules in the app integration branch; its recorded SHA-256 is unchanged.',
      },
    ],
    curatorNote:
      'The publication slice was independently reviewed and replayed. Hashes establish file identity, while the mathematical scope comes from the proof notes and audit. Repository links require access to this private repository.',
  },

  failures: [],
  references: [
    'Masatoshi Suzuki, Aspects of the screw function corresponding to the Riemann zeta-function, Journal of the London Mathematical Society 108 (2023), Theorem 1.7.',
    'research/rh/modules/finite-suzuki-certificate.md — canonical scoped theorem statement.',
    'research/rh/suzuki/reviews/finite-certificate-review.md — internal independent audit.',
  ],
});

export const FINITE_SUZUKI_CERTIFICATE_ASSERTIONS = Object.freeze([
  {
    name: 'finite Suzuki record keeps RH open and review scope internal',
    holds: () => FINITE_SUZUKI_CERTIFICATE.rhStatus === 'open' &&
      FINITE_SUZUKI_CERTIFICATE.reviewStatus === 'accepted' &&
      FINITE_SUZUKI_CERTIFICATE.reviewScope === 'internal',
  },
  {
    name: 'finite Suzuki result is a current finite certificate',
    holds: () => FINITE_SUZUKI_CERTIFICATE.status === 'certified-finite' &&
      FINITE_SUZUKI_CERTIFICATE.verification.reproducibilityStatus === 'current-replay',
  },
  {
    name: 'all load-bearing finite artifacts are present and hashed',
    holds: () => FINITE_SUZUKI_CERTIFICATE.verification.artifacts
      .filter((artifact) => artifact.requiredForClaim)
      .every((artifact) => artifact.availability === 'available' && /^[a-f0-9]{64}$/.test(artifact.sha256)),
  },
  {
    name: 'finite theorem includes exact origin and one-over-one-hundred floor',
    holds: () => FINITE_SUZUKI_CERTIFICATE.theorem.equations.some(
      (equation) => equation.id === 'origin-value' && equation.tex.includes('\\Psi(0)=0'),
    ) && FINITE_SUZUKI_CERTIFICATE.theorem.equations.some(
      (equation) => equation.id === 'finite-positive-floor' && equation.tex.includes('\\frac1{100}'),
    ),
  },
  {
    name: 'finite replay pins cutoff event counts and digest',
    holds: () => {
      const text = JSON.stringify(FINITE_SUZUKI_CERTIFICATE);
      return text.includes('665,134') && text.includes('664,579') && text.includes(EVENT_DIGEST);
    },
  },
  {
    name: 'finite record says scalar only and preserves signed future gap',
    holds: () => FINITE_SUZUKI_CERTIFICATE.claimBoundary.doesNotClaim.some(
      (item) => /whole-even-form positivity/.test(item),
    ) && FINITE_SUZUKI_CERTIFICATE.blockers.some(
      (blocker) => blocker.id === 'future-signed-endpoints',
    ),
  },
  {
    name: 'finite body and source commit are pinned',
    holds: () => FINITE_SUZUKI_CERTIFICATE.verification.artifacts.some(
      (artifact) => artifact.path === 'research/rh/modules/finite-suzuki-certificate.md' &&
        artifact.sha256 === '4dc523d105722c74645eed93265147c8a58480d239195c8c03fbbb184c5b8cb2',
    ) && FINITE_SUZUKI_CERTIFICATE.provenance.sourceRefs[0].commit === SOURCE_COMMIT,
  },
]);

export default FINITE_SUZUKI_CERTIFICATE;
