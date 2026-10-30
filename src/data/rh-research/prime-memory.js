import { createResearchModule } from './module-contract.js';

const tex = String.raw;
const SOURCE_COMMIT = '1a85a498d3de8a42bb7d7b18a916b9b603cfd688';
const BODY_SHA256 = '1e793a7d2a49bc6140b9012cca6864418526109c98a906d1a32d9326d3c24496';

export const PRIME_MEMORY = createResearchModule({
  schemaVersion: 1,
  id: 'prime-memory',
  route: '/rh-prime-memory',
  title: 'Prime-only memory and finite credit variation',
  updatedAt: '2026-10-30',
  status: 'proved-analytic',
  reviewStatus: 'accepted',
  reviewScope: 'internal',
  rhStatus: 'open',
  summary:
    'Proper-power credits are absolutely summable, but their logarithmic predictor memory is not removable. A corrected ordinary-prime recurrence differs from the full reserve by a convergent correction and has finite weighted variation; the retained signed prime-credit prefix remains open.',
  bodyPath: 'research/rh/modules/prime-memory.md',

  claimBoundary: {
    title: 'A renormalization theorem, not the missing cancellation theorem',
    statement:
      'The internally reviewed argument separates summable proper-power and freezing errors from a corrected ordinary-prime credit sequence. It proves exact asymptotics and finite-variation estimates, but it does not lower-bound the retained signed credit prefix.',
    doesNotClaim: [
      'It does not prove that the ordinary-prime credits are absolutely summable or that their signed prefixes are bounded below.',
      'It does not turn finite block-freezing error into cancellation of the retained frozen block sums.',
      'It does not show that adjacent pairs or fixed prime-index residue classes carry opposite phases; their offsets converge while the same signed obstruction remains.',
      'It does not certify a new finite positivity range, enumerate primes near exp(512), or change the whole-even support endpoint.',
      'It does not independently rerun the finite-height computation behind the cited Fiori–Kadiri–Swidinsky prime-error theorem.',
      'Its storage no-go covers convergent regular or stable potentials, not arbitrary bounded nonlinear, singular, unstable, or time-dependent storage.',
      'It does not prove RH.',
    ],
  },

  theorem: {
    label: 'Prime-only renormalization and finite-variation theorem',
    statement:
      'For the actual von Mangoldt event weights, proper-power credits have finite absolute total while proper-power predictor memory equals r/2 plus an explicit constant and a decaying error. After retaining that memory in the ordinary-prime predictor, the full reserve and the corrected ordinary-prime credit prefix differ by a finite limit. The corrected credits have finite unweighted variation and the displayed critical weighted variation, so admissible fresh-head block freezing has finite total error. None of these estimates controls the signed frozen-block prefix.',
    hypotheses: [
      'The exact pre-event Suzuki recurrence and notation are those of the companion recurrence module; all weights are the actual von Mangoldt weights.',
      'The explicit unconditional estimate of Fiori–Kadiri–Swidinsky, Corollary 1.4, is used as a published theorem. Its underlying external finite-height computation is cited, not rerun here.',
      'The explicit relative predictor and variation estimates begin at r >= 512; the critical weighted bound also requires L >= max(512, 2B) and B > 2.',
      'A frozen block begins at a fresh ordinary-prime block head and has length K no larger than sqrt(p)/(log p)^B; an arbitrary cut through an existing block carries an additional boundary term.',
    ],
    equations: [
      {
        id: 'proper-power-memory',
        label: 'Exact memory split and asymptotic',
        tex: tex`B(r)=\sum_{\substack{p^k\le e^r\\k\ge2}}\frac{\log p}{p^{k/2}}=\sum_{n\le e^{r/2}}\frac{\Lambda(n)}n+\sum_{\substack{p^k\le e^r\\k\ge3\ \mathrm{odd}}}\frac{\log p}{p^{k/2}}=\frac r2+\kappa+O\!\left(r^2e^{-0.59\sqrt r}\right)`,
        explanation: tex`Here \kappa=-\gamma+\sum_p\log p/[\sqrt p(p-1)] and the series for \kappa converges absolutely.`,
      },
      {
        id: 'proper-power-credit-tail',
        label: 'Summable deleted credits',
        tex: tex`\sum_p\sum_{k\ge2}\lvert c_{p^k}\rvert<\infty`,
        explanation: 'Summability of the proper-power credits does not permit deletion of their unbounded predictor memory.',
      },
      {
        id: 'corrected-credit',
        label: 'Corrected ordinary-prime predictor',
        tex: tex`\widetilde H_p=\sum_{\substack{\ell<p\\\ell\ \mathrm{prime}}}\frac{\log\ell}{\sqrt\ell}+\frac12\log p+\kappa-b,\qquad \widetilde c_p=\frac{\log p}{\sqrt p}\log\frac{p}{(\widetilde H_p/2)^2}`,
      },
      {
        id: 'convergent-correction',
        label: 'Prime-only reduction',
        tex: tex`\sum_p\lvert c_p-\widetilde c_p\rvert<\infty,\qquad R(X)-\sum_{2<p\le X}\widetilde c_p\longrightarrow C_*\in\mathbb R`,
        explanation: 'This is convergence of a difference, not boundedness or convergence of either term separately.',
      },
      {
        id: 'naive-drift',
        label: 'Drift manufactured by deleting memory',
        tex: tex`\sum_{2<p\le X}\left(c_p^{(0)}-c_p\right)=\frac14(\log X)^2+\kappa\log X+C_0+o(1)`,
      },
      {
        id: 'unweighted-variation',
        label: 'Finite neighbor variation',
        tex: tex`\sum_{p_n\ge e^L}\lvert c_{n+1}-c_n\rvert\le(23L+34)e^{-L/2}`,
      },
      {
        id: 'critical-variation',
        label: 'Critical weighted variation',
        tex: tex`\sum_{p_n\ge e^L}\frac{\sqrt{p_n}}{(\log p_n)^B}\lvert c_{n+1}-c_n\rvert\le6L^{1-B}+\frac{17}{2(B-2)}L^{2-B}`,
      },
    ],
  },

  derivation: [
    {
      id: 'relative-predictor-envelope',
      title: 'Control the actual weighted state',
      body:
        'Exact partial summation expresses the weighted Chebyshev state in terms of E(x)=psi(x)-x. Splitting the integral and inserting the cited unconditional error estimate gives a relative predictor error smaller than one quarter for event logarithm r at least 512.',
      equations: [
        {
          id: 'weighted-state-identity',
          tex: tex`S(x)-2\sqrt x=-1+\frac{E(x)}{\sqrt x}+\frac12\int_1^xE(t)t^{-3/2}\,dt`,
        },
        {
          id: 'predictor-envelope',
          tex: tex`\left\lvert\frac{H(q-)}{2\sqrt q}-1\right\rvert\le10r^{3/2}e^{-0.59\sqrt r}+2e^{-r/4}<\frac14`,
        },
      ],
      notes: [
        'The cited prime-error theorem is unconditional, but this repository does not independently reproduce the external finite-height computation used in its proof.',
      ],
    },
    {
      id: 'proper-power-credit-tail',
      title: 'Sum the proper-power credit tail',
      body:
        'The relative predictor envelope makes the credit logarithm exponentially small. Stieltjes integration against theta(x) <= 3x treats squares, and an elementary higher-power count treats k >= 3, yielding an absolutely convergent proper-power credit correction.',
      equations: [
        {
          id: 'credit-log-bound',
          tex: tex`\left\lvert\log\frac{q}{(H/2)^2}\right\rvert\le30r^{3/2}e^{-0.59\sqrt r}`,
        },
      ],
    },
    {
      id: 'even-odd-memory-split',
      title: 'Keep the logarithmic memory counterterm',
      body:
        'Even exponents are exactly a weighted Mangoldt sum at e^(r/2), while the odd exponents form an absolutely convergent prime series. Abel summation identifies the constant in the weighted Mangoldt sum as -gamma, proving the r/2+kappa memory law.',
      equations: [
        {
          id: 'weighted-mangoldt-memory',
          tex: tex`\sum_{n\le y}\frac{\Lambda(n)}n=\log y+C+\frac{E(y)}y-\int_y^\infty E(t)t^{-2}\,dt,\qquad C=-\gamma`,
        },
      ],
      notes: [
        'Removing credits and removing predictor memory are different operations: the first has finite cost, while the second needs the explicit counterterm.',
      ],
    },
    {
      id: 'corrected-ordinary-prime-credit',
      title: 'Compare the full and corrected prime predictors',
      body:
        'The exact discrepancy between H(p-) and the corrected predictor is the decaying memory error. Both predictors exceed sqrt(p) on the tail, so the logarithmic mean-value theorem makes the credit discrepancy absolutely summable. Combining it with proper-power credits and convexity debt gives the finite limiting correction.',
      equations: [
        {
          id: 'credit-discrepancy-sum',
          tex: tex`\sum_p\lvert c_p-\widetilde c_p\rvert<\infty`,
        },
      ],
    },
    {
      id: 'naive-deletion-drift',
      title: 'Diagnose the naive deletion',
      body:
        'Deleting proper-power memory changes the logarithmic predictor at every ordinary prime. Taylor expansion has an absolutely summable remainder, while partial summation of the leading term produces a positive quadratic logarithmic drift. Favorable numerics for this naive recurrence therefore test a different system.',
      equations: [
        {
          id: 'exact-naive-difference',
          tex: tex`c_p^{(0)}-c_p=2\frac{\log p}{\sqrt p}\log\!\left(1+\frac{B}{H_p^{(0)}}\right)\ge0`,
        },
      ],
    },
    {
      id: 'continuous-flow-and-jumps',
      title: 'Separate continuous flow from prime jumps',
      body:
        'For the right-continuous corrected state, the credit is the pre-event value of a scalar flow f. Between ordinary primes H prime equals one half; at a prime H jumps by w. The exact derivative and downward jump control successive credit differences without invoking a prime-gap hypothesis.',
      equations: [
        {
          id: 'credit-flow',
          tex: tex`H(r)=\sum_{p\le e^r}\frac{\log p}{\sqrt p}+\frac r2+\kappa-b,\qquad f(r)=re^{-r/2}\left[r-2\log\frac{H(r)}2\right]`,
        },
        {
          id: 'flow-bounds',
          tex: tex`\lvert f'(r)\rvert\le\frac52re^{-r/2},\qquad f(r+)-f(r-)=-2w\log(1+w/H)`,
        },
      ],
    },
    {
      id: 'weighted-variation',
      title: 'Integrate the disjoint flow intervals',
      body:
        'Each neighbor difference is one prime jump plus the continuous integral to the next prime. Summing disjoint intervals with either an exponential weight or the critical weight e^(r/2)/r^B, and using theta(x) <= 3x, gives the finite total-variation bounds with the displayed constants.',
      equations: [
        {
          id: 'neighbor-decomposition',
          tex: tex`c_{n+1}-c_n=\bigl(f(r_n+)-f(r_n-)\bigr)+\int_{r_n}^{r_{n+1}}f'(r)\,dr`,
        },
      ],
    },
    {
      id: 'critical-block-freezing',
      title: 'Freeze fresh-head blocks with finite error',
      body:
        'Telescoping inside a consecutive block bounds its absolute error by block length times internal variation. The critical weighted bound makes the sum of all block errors finite, and the unfinished frozen contribution tends to zero. Fixed prime-index residue classes differ from equal shares by convergent offsets, so parity pairing retains the same unresolved signed phase rather than creating cancellation.',
      equations: [
        {
          id: 'block-error',
          tex: tex`\sum_{n=N}^{N+K-1}\lvert c_n-c_N\rvert\le K\sum_{m=N}^{N+K-2}\lvert c_{m+1}-c_m\rvert`,
        },
      ],
      notes: [
        'The tail must begin at a fresh block head. An arbitrary cut through an existing block adds a carry term.',
        'Finite variation is a control on representation error, not a lower bound for the retained signed block sum.',
      ],
    },
  ],

  verification: {
    result:
      'The source proofs and two independent internal reviews accept the scoped analytic theorems. The bundled exact-algebra and scalar receipts replay successfully, but they do not replace the analytic Stieltjes arguments or reproduce the external Fiori–Kadiri–Swidinsky finite-height computation.',
    scope:
      'Proof review covers the proper-power tail, logarithmic memory, corrected prime-only flow, naive-drift calculation, weighted variation, block freezing, and fixed-rank limitations. Machine checks cover pinned algebra and scalar gates only.',
    reproducibilityStatus: 'partial',
    commands: [
      {
        label: 'Verify every published Suzuki file hash',
        command: 'shasum -a 256 -c research/rh/suzuki/PUBLICATION_SHA256SUMS',
        cwd: 'repository root',
        expected: 'Every listed module, proof note, review, script, and receipt reports OK.',
      },
      {
        label: 'Replay the portable Suzuki package',
        command: 'python replay.py',
        cwd: 'research/rh/suzuki',
        expected: 'Prime-only algebra and variation receipts match every frozen JSON field.',
      },
    ],
    artifacts: [
      {
        label: 'Canonical prime-memory module',
        path: 'research/rh/modules/prime-memory.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: BODY_SHA256,
      },
      {
        label: 'Proper-power memory proof note',
        path: 'research/rh/suzuki/notes/proper-power-memory.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: '024a4dec3509502f193478357cc24a8207c108a6a073b48f44260ead36b8cc31',
      },
      {
        label: 'Prime-only reserve-flow note',
        path: 'research/rh/suzuki/notes/prime-only-flow.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: '4e25e7391ceea30e1bb4f9810464513d376d1407f0c2c7c59c92d89ae6e98c54',
      },
      {
        label: 'Weighted variation proof note',
        path: 'research/rh/suzuki/notes/weighted-credit-variation.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: '35c5eed40c0bc8e3c79a2c1de437b7f36cd98cdadef20374248074b8c9fef334',
      },
      {
        label: 'Independent prime-memory review',
        path: 'research/rh/suzuki/reviews/prime-memory-review.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: 'd43e6a28cd198153f698c566fcfdbfb2b72c19aa6e09e05db3e977a25085cc13',
      },
      {
        label: 'Independent credit-variation review',
        path: 'research/rh/suzuki/reviews/credit-variation-review.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: '59a39c3cda795d69f4b116953342056ce8857ca798e51a370c1d7fa1db3c8ff9',
      },
      {
        label: 'Prime-only algebra checker',
        path: 'research/rh/suzuki/code/check_prime_only_algebra.py',
        requiredForClaim: false,
        availability: 'available',
        sha256: '60425e59e6b39f7037170d55bed2cc047f73149ec976eff400e170d5c866f557',
      },
      {
        label: 'Variation constants checker',
        path: 'research/rh/suzuki/code/check_variation_constants.py',
        requiredForClaim: false,
        availability: 'available',
        sha256: 'ffa49b6c7c5fe987c4873468a08d5d400dfa8c95e411241b46cc383336ab26f8',
      },
      {
        label: 'Prime-only algebra receipt',
        path: 'research/rh/suzuki/receipts/PRIME_ONLY_ALGEBRA_256BIT.json',
        requiredForClaim: false,
        availability: 'available',
        sha256: '30adbfee615fb1ca4998591a13ff4e57ec29fd7aaf5204bed3216cba2509ba7e',
      },
      {
        label: 'Variation constants receipt',
        path: 'research/rh/suzuki/receipts/VARIATION_CHECKS_256BIT.json',
        requiredForClaim: false,
        availability: 'available',
        sha256: 'c0dced9252e0ddc10e8efcf5b0282cf47ecd60664ae6546015b83521decef0d3',
      },
    ],
    replays: [
      {
        label: 'Portable publication-package replay',
        method:
          'Run the pinned package launcher, which validates source/transport hashes before regenerating the algebra and scalar receipts in a fresh directory.',
        outcome:
          'The prime-only algebra and weighted-variation JSON fields matched their frozen receipts. Timing is not part of these receipts.',
        command: 'cd research/rh/suzuki && python replay.py',
        evidence: [
          'research/rh/suzuki/receipts/PUBLICATION_PACKAGE_REPLAY_RESULT.json',
          'research/rh/suzuki/receipts/PRIME_ONLY_ALGEBRA_256BIT.json',
          'research/rh/suzuki/receipts/VARIATION_CHECKS_256BIT.json',
        ],
      },
      {
        label: 'Independent mathematical review',
        method:
          'Separate audits rederived the memory, drift, flow, jump, variation, unfinished-block, rank-class, and storage statements and checked the pinned producer evidence scope.',
        outcome:
          'Both reviews accept the scoped analytic results and preserve the signed-prefix and external-computation limitations.',
        evidence: [
          'research/rh/suzuki/reviews/prime-memory-review.md',
          'research/rh/suzuki/reviews/credit-variation-review.md',
        ],
      },
    ],
    evidence: [
      {
        label: 'Canonical mathematical body',
        kind: 'proof',
        location: 'research/rh/modules/prime-memory.md',
      },
      {
        label: 'Curated source and review lineage',
        kind: 'provenance',
        location: 'research/rh/suzuki/SOURCE_PROVENANCE.json',
      },
      {
        label: 'Publication integrity manifest',
        kind: 'sha256-manifest',
        location: 'research/rh/suzuki/PUBLICATION_SHA256SUMS',
      },
      {
        label: 'Immutable source-staging commit',
        kind: 'private-source',
        location: SOURCE_COMMIT,
        href: `https://github.com/judegomila/mathexplorer/tree/${SOURCE_COMMIT}`,
        note: 'This source link requires access to the private repository.',
      },
      {
        label: 'Fiori–Kadiri–Swidinsky, Corollary 1.4',
        kind: 'external-theorem',
        location: 'Sharper bounds for the Chebyshev function',
        href: 'https://arxiv.org/html/2204.02588v3#S1.SS2',
        note:
          'Used as an unconditional published theorem. Its external finite-height computation is not independently replayed by this package.',
      },
    ],
  },

  blockers: [
    {
      id: 'signed-prime-credit-prefix',
      title: 'Lower-bound the retained signed prime-credit prefix',
      statement:
        'After all proved summable corrections, the unresolved quantity is the cumulative signed ordinary-prime or frozen-block credit. Finite variation controls how the signal may be compressed, not the sign of its cumulative integral.',
      physicsAnalogy:
        'The renormalization removes a finite self-energy and proves that the remaining drive changes smoothly. A smooth alternating force can still push an oscillator arbitrarily far in one direction unless its accumulated impulse is controlled.',
      nextTest:
        'Seek a number-theoretic lower bound for the completed fresh-head block prefixes that preserves sign, rather than applying absolute values or fixed-index parity pairing.',
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
          'content/rh-modules/prime-memory.md',
          'research/rh/suzuki/notes/proper-power-memory.md',
          'research/rh/suzuki/notes/prime-only-flow.md',
          'research/rh/suzuki/notes/weighted-credit-variation.md',
          'research/rh/suzuki/reviews/prime-memory-review.md',
          'research/rh/suzuki/reviews/credit-variation-review.md',
          'research/rh/suzuki/receipts/PRIME_ONLY_ALGEBRA_256BIT.json',
          'research/rh/suzuki/receipts/VARIATION_CHECKS_256BIT.json',
        ],
        note:
          'The body was moved byte-identically from content/rh-modules/prime-memory.md during app integration; its SHA-256 is unchanged. This source link requires access to the private repository.',
      },
    ],
    sourceManifestPath: 'research/rh/suzuki/SOURCE_PROVENANCE.json',
    evidenceManifestPath: 'research/rh/suzuki/CODE_AND_RECEIPTS_MANIFEST.json',
    curatorNote:
      'Original-to-published hashes, editorial transformations, and the byte-identical body relocation are recorded in SOURCE_PROVENANCE.json. Hash identity establishes provenance, not mathematical truth.',
  },

  failures: [
    {
      id: 'naive-proper-power-deletion',
      title: 'Deleting proper-power memory tests the wrong recurrence',
      surrogate:
        'Remove proper-power credits and also delete their predictor memory, replacing the corrected state by the ordinary-prime sum without the r/2+kappa counterterm.',
      failureStage:
        'The exact predictor difference accumulates a positive drift of one quarter log-squared X plus kappa log X and a constant, up to o(1).',
      implication:
        'Favorable behavior of the naively reduced recurrence cannot be transferred to the actual Suzuki reserve; the logarithmic memory counterterm must be retained.',
      nonImplications: [
        'This is not a counterexample to the corrected ordinary-prime recurrence or to RH.',
        'It does not make the proper-power credits non-summable.',
        'It does not prove that the corrected signed credit prefix is bounded below.',
      ],
      evidence: [
        {
          label: 'Naive-drift derivation',
          kind: 'proof',
          location: 'research/rh/modules/prime-memory.md',
        },
        {
          label: 'Independent memory audit',
          kind: 'review',
          location: 'research/rh/suzuki/reviews/prime-memory-review.md',
        },
      ],
    },
    {
      id: 'fixed-rank-pairing',
      title: 'Fixed-index parity does not create opposite phase',
      surrogate:
        'Pair adjacent credits, or split them into fixed prime-index residue classes, and treat near equality inside each class as cancellation.',
      failureStage:
        'Finite total variation proves that each fixed-rank class differs from an equal share of the full signed prefix by a convergent offset. The classes inherit the same unresolved phase rather than opposite phases.',
      implication:
        'Fixed-rank pairing is useful for stable representation but supplies no lower bound for the common signed prefix.',
      nonImplications: [
        'It does not prove that the full signed prime-credit prefix diverges to negative infinity.',
        'It does not exclude cancellation based on additional arithmetic structure outside fixed-index rank.',
        'It does not alter the accepted finite scalar certificate.',
      ],
      evidence: [
        {
          label: 'Rank-class limitation',
          kind: 'proof',
          location: 'research/rh/modules/prime-memory.md',
        },
        {
          label: 'Independent variation audit',
          kind: 'review',
          location: 'research/rh/suzuki/reviews/credit-variation-review.md',
        },
      ],
    },
  ],

  references: [
    'Fiori, Kadiri, and Swidinsky, Sharper bounds for the Chebyshev function, Corollary 1.4, arXiv:2204.02588v3.',
    'Suzuki scalar reserve recurrence and signed credit/debt decomposition, companion module in this repository.',
  ],
});

export const PRIME_MEMORY_ASSERTIONS = Object.freeze([
  {
    name: 'prime-memory is an internally reviewed analytic theorem with RH open',
    holds: () => PRIME_MEMORY.status === 'proved-analytic' &&
      PRIME_MEMORY.reviewStatus === 'accepted' &&
      PRIME_MEMORY.reviewScope === 'internal' &&
      PRIME_MEMORY.rhStatus === 'open',
  },
  {
    name: 'canonical body hash and immutable source commit are pinned',
    holds: () => PRIME_MEMORY.verification.artifacts.some(
      (artifact) => artifact.path === PRIME_MEMORY.bodyPath && artifact.sha256 === BODY_SHA256,
    ) && PRIME_MEMORY.provenance.sourceRefs[0].commit === SOURCE_COMMIT,
  },
  {
    name: 'proper-power credits and memory are kept logically distinct',
    holds: () => PRIME_MEMORY.theorem.equations.some(
      (equation) => equation.id === 'proper-power-credit-tail' && equation.tex.includes('c_{p^k}'),
    ) && PRIME_MEMORY.theorem.equations.some(
      (equation) => equation.id === 'proper-power-memory' && equation.tex.includes('\\frac r2+\\kappa'),
    ),
  },
  {
    name: 'external finite-height computation boundary is explicit',
    holds: () => PRIME_MEMORY.claimBoundary.doesNotClaim.some(
      (claim) => /Fiori.*Kadiri.*Swidinsky/i.test(claim),
    ) && PRIME_MEMORY.verification.evidence.some(
      (item) => item.kind === 'external-theorem' && /not independently replayed/i.test(item.note),
    ),
  },
  {
    name: 'remaining signed-credit prefix is the open blocker',
    holds: () => PRIME_MEMORY.blockers.some(
      (blocker) => blocker.id === 'signed-prime-credit-prefix' && /signed/i.test(blocker.statement),
    ),
  },
  {
    name: 'naive deletion and fixed-rank pairing failures retain non-implications',
    holds: () => PRIME_MEMORY.failures.length === 2 && PRIME_MEMORY.failures.every(
      (failure) => failure.nonImplications.length >= 3,
    ),
  },
  {
    name: 'partial reproducibility does not masquerade as a finite certificate',
    holds: () => PRIME_MEMORY.verification.reproducibilityStatus === 'partial' &&
      PRIME_MEMORY.status !== 'certified-finite',
  },
]);

export default PRIME_MEMORY;
