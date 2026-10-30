import { createResearchModule } from './module-contract.js';

const tex = String.raw;
const SOURCE_COMMIT = '949a81bc614bb7ad1497c95088b62e61123833cd';
const BODY_SHA256 = '121e75c25d5c42a5de23359ccad92c5486ba93c26d71419f79002cbaec9c4648';

export const ARITHMETIC_FOUNDATION = createResearchModule({
  schemaVersion: 1,
  id: 'arithmetic-foundation',
  route: '/rh-arithmetic-foundation',
  title: 'Arithmetic foundation: Landau continuation and exact shells',
  updatedAt: '2026-10-30',
  status: 'conditional-reduction',
  reviewStatus: 'accepted',
  reviewScope: 'internal',
  rhStatus: 'open',
  summary:
    'An exact discrepancy transform, one-sided Landau theorem, triangular-shell reconstruction, prime-power reduction, and centered Vaughan identity isolate the missing signed remainder estimate. The reductions are proved; that global estimate is not.',
  bodyPath: 'research/rh/modules/arithmetic-foundation.md',

  claimBoundary: {
    title: 'Exact reductions with an explicitly unproved arithmetic hypothesis',
    statement:
      'The Laplace, Landau, shell, prime-power, and Vaughan steps are internally reviewed analytic results. A uniform all-real upper bound for the signed centered remainder $J(x)$ would imply a zero-free region, and its endpoint case would imply RH, but no such new bound is established here.',
    doesNotClaim: [
      'It does not prove the required one-sided discrepancy or signed $J(x)$ estimate.',
      'It does not prove a new zero-free strip or RH.',
      'A shell estimate on one grid or geometric progression does not imply the required estimate for every sufficiently large real center.',
      'Replacing the signed Type-I/Type-II interaction by separate absolute values retains exponent $1/2$ and does not close the argument.',
      'The exact lattice-quadrature constants improve bookkeeping only; they do not supply arithmetic cancellation.',
      'It does not use, recover, or make reproducible the unavailable historical 1.1 GB certificate package.',
      'Internal acceptance is not external peer review or proof-assistant verification.',
    ],
  },

  theorem: {
    label: 'Conditional one-sided Landau and all-real shell theorem',
    statement:
      'Fix $0\\le\\alpha<1/2$. If fixed $C>0$, $m\\ge0$, and $W_0\\ge0$ bound the exact discrepancy from above for every real $W\\ge W_0$, then $\\zeta$ has no zero in $\\Re s>1/2+\\alpha$; at $\\alpha=0$, functional-equation reflection gives RH. The same implication follows from an eventual upper bound of that exponent for every real triangular-shell center, after exact positive reconstruction. These hypotheses are not proved in this module.',
    hypotheses: [
      'The discrepancy uses the exact von Mangoldt weights and the strict cutoff $n<e^W$; an endpoint event has zero hinge weight, so replacing $<$ by $\\le$ changes nothing.',
      'The constants $C>0$, $m\\ge0$, and $W_0\\ge0$ are fixed, and the bound holds for every real $W\\ge W_0$, not a sampled subsequence.',
      'The exponent satisfies $0\\le\\alpha<1/2$.',
      'For the shell implication, $h=\\log2$ and the bound holds uniformly for every sufficiently large real shell center.',
      'The centered Vaughan identity uses $x\\ge2$, $U,V\\ge1$, $UV\\le x/2$, and $V<x/2$; the concrete open target chooses $U=V=\\lfloor x^{3/8}\\rfloor$ for $x\\ge16$.',
    ],
    equations: [
      {
        id: 'exact-discrepancy',
        label: 'Exact arithmetic-continuum discrepancy',
        tex: tex`D(W)=\sum_{n<e^W}\frac{\Lambda(n)}{\sqrt n}(W-\log n)-\int_0^W e^{r/2}(W-r)\,dr`,
      },
      {
        id: 'one-sided-hypothesis',
        label: 'Conditional all-real hypothesis',
        tex: tex`D(W)\le C(1+W)^m e^{\alpha W}\qquad\text{for every real }W\ge W_0`,
      },
      {
        id: 'zero-free-conclusion',
        label: 'Conditional conclusion',
        tex: tex`\zeta(s)\ne0\qquad\left(\Re s>\frac12+\alpha\right)`,
        explanation:
          'At $\\alpha=0$, reflection through the functional equation rules out nontrivial zeros on the other side and yields RH.',
      },
      {
        id: 'exact-shell',
        label: 'Exact triangular shell',
        tex: tex`S_h(W)=\sum_n\frac{\Lambda(n)}{\sqrt n}(h-|\log n-W|)_+-c_he^{W/2},\quad h=\log2,\quad c_h=8\bigl(\cosh(h/2)-1\bigr)`,
      },
      {
        id: 'open-signed-target',
        label: 'Missing signed arithmetic theorem',
        tex: tex`J(x)\le C(1+\log x)^m x^{3/8-\varepsilon}\quad\text{for every sufficiently large real }x,\qquad 0<\varepsilon\le\frac38`,
        explanation:
          'This target is open. If proved, it would give nonvanishing in $\\Re s>7/8-\\varepsilon$; the endpoint $\\varepsilon=3/8$ would imply RH.',
      },
    ],
  },

  derivation: [
    {
      id: 'laplace-transform',
      title: 'Compute the exact Laplace transform',
      body:
        'The elementary Chebyshev bound gives exponential order one half, so termwise integration is justified for $\\Re q>1/2$. The zeta-pole principal part cancels exactly. Positivity of zeta on the real interval above one and negativity on the real interval between zero and one show local holomorphy near each positive real $q$ without assuming a nonreal zero-free half-plane.',
      equations: [
        {
          id: 'continuum-integral',
          tex: tex`\int_0^W e^{r/2}(W-r)\,dr=4e^{W/2}-2W-4`,
        },
        {
          id: 'laplace-transform-formula',
          tex: tex`\int_0^\infty D(W)e^{-qW}\,dW=\frac1{q^2}\left[-\frac{\zeta'(q+1/2)}{\zeta(q+1/2)}-\frac1{q-1/2}\right]=M(q)`,
        },
      ],
      notes: [
        'The apparent pole at $q=1/2$ is removable; its cancellation is not a zero-free hypothesis.',
      ],
    },
    {
      id: 'landau-boundary-lemma',
      title: 'Use the nonnegative Laplace boundary obstruction',
      body:
        'For a nonnegative locally integrable function, holomorphy across its finite real convergence boundary would make the leftward Taylor series a sum of nonnegative moments. Tonelli would then force convergence strictly to the left of the abscissa, a contradiction.',
      equations: [
        {
          id: 'nonnegative-taylor-series',
          tex: tex`\mathcal L_f(s_1-h)=\sum_{n\ge0}\frac{h^n}{n!}\int_0^\infty W^n f(W)e^{-s_1W}\,dW`,
        },
      ],
    },
    {
      id: 'one-sided-continuation',
      title: 'Convert the assumed upper bound into zero-freeness',
      body:
        'After increasing $m$ to an integer, subtract the discrepancy from its assumed majorant on the tail. The resulting $f$ is nonnegative. If its convergence boundary lay to the right of $\\alpha$, the explicit rational transform and $M$ would continue it through that positive real point, contradicting the lemma. Holomorphy of $M$ on the resulting half-plane excludes every zeta zero there because its logarithmic-derivative residue has nonzero multiplicity.',
      equations: [
        {
          id: 'majorant-transform',
          tex: tex`R(q)=C\sum_{k=0}^m\binom mk\frac{k!}{(q-\alpha)^{k+1}}`,
        },
        {
          id: 'tail-transform',
          tex: tex`\mathcal L_f(q)=R(q)-M(q)-E(q)`,
          explanation: '$E$ is the entire transform of the omitted compact initial interval.',
        },
      ],
      notes: [
        'At $\\alpha=0$ the proof uses only real $q>0$; it makes no assertion at $q=0$.',
      ],
    },
    {
      id: 'shell-and-reconstruction',
      title: 'Pass to exact shells and reconstruct every real center',
      body:
        'A second difference turns every hinge into a compact triangular tent and evaluates the continuum term exactly. On each residue class modulo $h$, the discrepancy is recovered from its initial data and a positive combination of shell values. Compactness makes the initial data uniform across all residues. This is why an all-real shell estimate suffices and a single sampled progression does not.',
      equations: [
        {
          id: 'shell-second-difference',
          tex: tex`S_h(W)=D(W+h)-2D(W)+D(W-h)`,
        },
        {
          id: 'positive-reconstruction',
          tex: tex`d_n=d_0+n(d_1-d_0)+\sum_{j=1}^{n-1}(n-j)S_h(v+jh)`,
          explanation:
            'Every coefficient of a shell value is nonnegative. At exponent zero the reconstruction costs at most two additional polynomial powers.',
        },
        {
          id: 'grid-chord-loss',
          tex: tex`\text{possible cell excess}\ \le\ \frac18e^{(b+\delta)/2}\delta^2`,
          explanation:
            tex`The distributional inequality $D^{\prime\prime}\ge-e^{W/2}$ alone does not make fixed-grid sampling exponent-preserving.`,
        },
      ],
    },
    {
      id: 'proper-power-cost',
      title: 'Remove higher prime powers at polynomial cost',
      body:
        'Splitting the shell into ordinary primes and proper prime powers gives a nonnegative remainder. Direct support counting, with the actual weight $\\log p$ and only a larger logarithm used for the upper estimate, makes the proper-power contribution polynomial in $W$. Thus prime and prime-power one-sided targets are equivalent when fixed polynomial factors are allowed.',
      equations: [
        {
          id: 'proper-power-bound',
          tex: tex`0\le R_h(W)\le2h\log(2x)\lfloor\log_2(2x)\rfloor=O\bigl((1+W)^2\bigr),\qquad x=e^W`,
        },
      ],
      notes: [
        'No prime number theorem is used in this reduction.',
      ],
    },
    {
      id: 'centered-vaughan',
      title: 'Preserve the signed Vaughan interaction and center once',
      body:
        'The exact convolution split retains the signed Type-I and Type-II contributions. Second-order lattice quadrature evaluates the easy pieces with explicit constants. Subtracting the continuum main term exactly once leaves the centered bilinear term and a rigorous remainder; no cancellation assumption is hidden in the algebra.',
      equations: [
        {
          id: 'tent-weight',
          tex: tex`w_x(t)=t^{-1/2}\bigl(h-|\log(t/x)|\bigr)_+`,
        },
        {
          id: 'vaughan-explicit-constants',
          tex: tex`c=c_h=8\bigl(\cosh(h/2)-1\bigr),\quad c_1=8h\sinh(h/2)-32\bigl(\cosh(h/2)-1\bigr),\quad C_w=4\sqrt2+2+h,\quad C_\ell=8h+2\sqrt2\,h^2`,
          explanation: 'These are the exact continuum moments and derivative-variation constants used in the centered identity and its rigorous remainder.',
        },
        {
          id: 'second-order-quadrature',
          tex: tex`\left|\sum_{n\ge1}g(n)-\int_0^\infty g(t)\,dt\right|\le\frac1{16}\operatorname{Var}(g')`,
          explanation:
            tex`Here $g$ is continuous and compactly supported inside $(0,\infty)$, and its weak derivative has bounded variation. The constant $1/16$ is sharp in this class.`,
        },
        {
          id: 'vaughan-identity',
          tex: tex`\Lambda=\mu_{\le U}*\log-\mu_{\le U}*1*\Lambda_{\le V}+\Lambda_{\le V}+\mu_{>U}*1*\Lambda_{>V}`,
        },
        {
          id: 'finite-i4-definition',
          tex: tex`I_4=\sum_{a>U}\mu(a)\sum_{c>V}\Lambda(c)\sum_{b\ge1}w_x(abc)`,
          explanation: 'The tent support makes this triple sum finite.',
        },
        {
          id: 'centered-shell-identity',
          tex: tex`S_h(\log x)=I_4+\sqrt x\,B(x;U,V)+R`,
        },
        {
          id: 'centered-main-term',
          tex: tex`B(x;U,V)=cM(U)[\log x-A(V)]+c_1M(U)-cL(U)-c`,
        },
        {
          id: 'centering-sums',
          tex: tex`M(U)=\sum_{a\le U}\frac{\mu(a)}a,\qquad L(U)=\sum_{a\le U}\frac{\mu(a)\log a}a,\qquad A(V)=\sum_{c\le V}\frac{\Lambda(c)}c`,
        },
        {
          id: 'rigorous-easy-remainder',
          tex: tex`|R|\le\frac{U(U+1)[C_w\log(2x)+C_\ell]}{32x^{3/2}}+\frac{C_wU(U+1)V(V+1)\log V}{64x^{3/2}}`,
        },
      ],
    },
    {
      id: 'missing-signed-estimate',
      title: 'Locate the one surviving arithmetic theorem',
      body:
        'With $U=V=\\lfloor x^{3/8}\\rfloor$, the explicit easy remainder is only logarithmic. The remaining $J(x)$ combines the signed bilinear sum with its exact centering. Its desired one-sided saving is the open theorem; taking absolute values of its pieces returns square-root scale and loses the needed exponent.',
      equations: [
        {
          id: 'grouped-vaughan-coefficient',
          tex: tex`\beta_V(d)=\sum_{\substack{c\mid d\\c>V}}\Lambda(c),\qquad 0\le\beta_V(d)\le\log d`,
        },
        {
          id: 'exact-signed-remainder',
          tex: tex`J(x)=\sum_{a>U}\mu(a)\sum_{d>V}\beta_V(d)w_x(ad)+\sqrt x\!\left\{cM(U)[\log x-A(V)]+c_1M(U)-cL(U)-c\right\}`,
          explanation:
            'The tent support makes both sums finite. This combined signed quantity—not either term estimated separately—is the load-bearing open target.',
        },
        {
          id: 'concrete-remainder',
          tex: tex`|R|\le\frac{x^{-3/4}}{16}[C_w\log(2x)+C_\ell]+\frac{3C_w}{128}\log x=O(\log x)`,
        },
        {
          id: 'absolute-value-loss',
          tex: tex`|I_4|\le2\sqrt2\,h\sqrt x\log(2x)\left[1+\log\frac{2x}{UV}\right]`,
          explanation:
            'This is the precise no-go for the separate absolute-value route: it retains exponent $1/2$.',
        },
      ],
      notes: [
        'The comparison boundary $7/8$ is illustrative and is not asserted as a new literature record.',
      ],
    },
  ],

  verification: {
    result:
      'The complete derivations in the curated body and byte-identical V7 source excerpts passed scoped internal mathematical review. These are analytic implications, so no finite numerical replay can establish the missing $J(x)$ estimate.',
    scope:
      'Source review covers the exact discrepancy transform, real-boundary Landau lemma, conditional zero-free implication, triangular-shell identity, all-real reconstruction, proper-power cost, Vaughan algebra, quadrature constants, centered remainder, and the absolute-value obstruction.',
    reproducibilityStatus: 'not-applicable',
    commands: [
      {
        label: 'Verify the published foundation bytes',
        command: 'shasum -a 256 -c research/rh/foundation/PUBLICATION_SHA256SUMS',
        cwd: 'repository root',
        expected: 'All nine curated foundation/history files report OK.',
      },
    ],
    artifacts: [
      {
        label: 'Canonical arithmetic-foundation body',
        path: 'research/rh/modules/arithmetic-foundation.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: BODY_SHA256,
        sizeBytes: 5548,
      },
      {
        label: 'Byte-identical Landau source excerpt',
        path: 'research/rh/foundation/source/03-landau.tex',
        requiredForClaim: true,
        availability: 'available',
        sha256: 'b5c8b6617d01527d0a41cbfa815116472f2779ae832e56a05497c96415d0ea5f',
        sizeBytes: 6726,
      },
      {
        label: 'Byte-identical shell and Vaughan source excerpt',
        path: 'research/rh/foundation/source/04-05-shell-vaughan.tex',
        requiredForClaim: true,
        availability: 'available',
        sha256: '46531637e10062586cde04ab1af6078a2f7da29d936fe76f0d72a969272c399a',
        sizeBytes: 12057,
      },
      {
        label: 'Scoped V7 mathematical review',
        path: 'research/rh/foundation/v7-mathematical-review.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: 'c66e58910e1a2cc1be1cc100dd7912eefaa54970e2c2fc9b5abc1793ae6b302e',
        sizeBytes: 4070,
      },
      {
        label: 'Foundation source-provenance manifest',
        path: 'research/rh/foundation/SOURCE_PROVENANCE.json',
        requiredForClaim: false,
        availability: 'available',
        sha256: '4e9421943f4e30ec2eae75ae71235bf4f65132bc2277aa81196d2f304e2ab69c',
        sizeBytes: 3502,
      },
      {
        label: 'Publication-scope boundary',
        path: 'research/rh/PUBLICATION_SCOPE_2026-10-30.md',
        requiredForClaim: false,
        availability: 'available',
        sha256: '240172f513d7c5815ff236830eb3fad760e64f1f72992edb0a6cffe107a2dd26',
        sizeBytes: 3799,
      },
    ],
    replays: [
      {
        label: 'Internal analytic source review',
        method:
          'A separate reviewer read the frozen manuscript sections, checked the normalization, hypotheses, algebra, signs, and finite-versus-conditional boundaries, and compared changed sources with the previous edition.',
        outcome:
          'PASS for the stated scope. The review is not external peer review, independent reimplementation, or proof-assistant verification.',
        evidence: [
          'research/rh/foundation/v7-mathematical-review.md',
          'research/rh/foundation/SOURCE_PROVENANCE.json',
        ],
      },
    ],
    evidence: [
      {
        label: 'Canonical mathematical body',
        kind: 'proof',
        location: 'research/rh/modules/arithmetic-foundation.md',
      },
      {
        label: 'Exact source-to-publication mapping',
        kind: 'provenance',
        location: 'research/rh/foundation/SOURCE_PROVENANCE.json',
      },
      {
        label: 'Foundation publication checksum manifest',
        kind: 'sha256-manifest',
        location: 'research/rh/foundation/PUBLICATION_SHA256SUMS',
      },
      {
        label: 'Immutable private source commit',
        kind: 'private-source',
        location: SOURCE_COMMIT,
        href: `https://github.com/judegomila/mathexplorer/tree/${SOURCE_COMMIT}`,
        note: 'This link requires access to the private repository.',
      },
    ],
  },

  blockers: [
    {
      id: 'signed-centered-vaughan-remainder',
      title: 'Prove the all-real signed $J(x)$ bound',
      statement:
        'The unresolved step is a one-sided bound for the exactly centered signed Type-I/Type-II remainder $J(x)$, uniform for every sufficiently large real $x$. Separate absolute estimates destroy the cancellation and retain square-root scale.',
      physicsAnalogy:
        'The exact identities reduce the system to a balanced interferometer: the large arms cancel only through their relative phase. Measuring each arm by its absolute energy discards that phase and leaves the full square-root background.',
      nextTest:
        'Seek a sign-preserving bilinear or dispersion estimate for $J(x)$ with a fixed power saving, first verifying uniformity over all real shell centers rather than a single logarithmic lattice.',
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
          'research/rh/modules/arithmetic-foundation.md',
          'research/rh/foundation/source/03-landau.tex',
          'research/rh/foundation/source/04-05-shell-vaughan.tex',
          'research/rh/foundation/v7-mathematical-review.md',
          'research/rh/foundation/SOURCE_PROVENANCE.json',
          'research/rh/foundation/PUBLICATION_SHA256SUMS',
          'research/rh/PUBLICATION_SCOPE_2026-10-30.md',
        ],
        note:
          'The two TeX excerpts are byte-identical to their inspected V7 source files. The published review removes only delegation wording, as recorded in the provenance manifest. Private-repository access is required.',
      },
    ],
    sourceManifestPath: 'research/rh/foundation/SOURCE_PROVENANCE.json',
    curatorNote:
      'The V7 research cutoff is 2026-10-30 08:00 UTC. This module publishes the scoped arithmetic derivations, not a complete manuscript distribution and not a recovery of unavailable historical artifacts.',
  },

  failures: [
    {
      id: 'single-grid-shell-sampling',
      title: 'One logarithmic grid leaves the other phases uncontrolled',
      surrogate:
        'Prove the shell estimate only on one progression $W=W_0+nh$ and infer the required discrepancy bound between its sampled centers.',
      failureStage:
        tex`Positive reconstruction works residue class by residue class. The inequality $D^{\prime\prime}\ge-e^{W/2}$ still permits cell-chord excess of order $e^{W/2}\delta^2$, so a fixed grid need not preserve an exponent below one half.`,
      implication:
        'The shell hypothesis must be uniform over every sufficiently large real center, or an additional phase-uniform interpolation theorem must be proved.',
      nonImplications: [
        'This does not disprove the all-real shell criterion.',
        'It does not show that a finer or adaptively certified grid can never be upgraded by extra estimates.',
        'It does not imply a zeta zero off the critical line.',
      ],
      evidence: [
        {
          label: 'Exact shell reconstruction proof',
          kind: 'proof',
          location: 'research/rh/modules/arithmetic-foundation.md',
        },
        {
          label: 'V7 shell source excerpt',
          kind: 'source',
          location: 'research/rh/foundation/source/04-05-shell-vaughan.tex',
        },
      ],
    },
    {
      id: 'absolute-value-vaughan-bound',
      title: 'Separate absolute values erase the needed cancellation',
      surrogate:
        'Bound the Vaughan bilinear term and its centering terms independently by absolute values, improving only lattice constants and easy remainders.',
      failureStage:
        tex`The direct bound for $I_4$ remains $\sqrt x$ times logarithms, and bounding $B$ separately has the same scale. That exponent is exactly the threshold the conditional theorem needs to beat.`,
      implication:
        'Progress must control the signed interaction in the combined centered remainder $J(x)$ rather than repeatedly estimating its components independently.',
      nonImplications: [
        'This does not prove that the actual signed remainder is large or negative.',
        'It does not refute RH or any zero-free region.',
        'It does not invalidate the exact Vaughan identity or the improved quadrature bounds.',
      ],
      evidence: [
        {
          label: 'Absolute-value obstruction derivation',
          kind: 'proof',
          location: 'research/rh/modules/arithmetic-foundation.md',
        },
        {
          label: 'Centered Vaughan source excerpt',
          kind: 'source',
          location: 'research/rh/foundation/source/04-05-shell-vaughan.tex',
        },
      ],
    },
  ],

  references: [
    'E. Landau, the real-boundary singularity principle for Laplace transforms of nonnegative functions; the proof used here is included in full.',
    'R. C. Vaughan, classical convolution decomposition of the von Mangoldt function; the exact cutoff algebra used here is included in full.',
    'research/rh/foundation/v7-mathematical-review.md — scoped internal mathematical source review.',
  ],
});

const ARITHMETIC_INLINE_TEX_RUNTIME_TEXT = [
  ...ARITHMETIC_FOUNDATION.derivation.flatMap((step) => [
    step.body,
    ...(step.notes ?? []),
    ...step.equations.flatMap((equation) => [equation.explanation ?? '']),
  ]),
  ...ARITHMETIC_FOUNDATION.failures.flatMap((failure) => [
    failure.surrogate,
    failure.failureStage,
    failure.implication,
    ...failure.nonImplications,
  ]),
].join('\n');

function hasRuntimeControlCharacter(value) {
  if (typeof value === 'string') return /[\u0000-\u001f\u007f]/u.test(value);
  if (Array.isArray(value)) return value.some(hasRuntimeControlCharacter);
  if (value && typeof value === 'object') return Object.values(value).some(hasRuntimeControlCharacter);
  return false;
}

export const ARITHMETIC_FOUNDATION_ASSERTIONS = Object.freeze([
  {
    name: 'arithmetic foundation is conditional and keeps RH open',
    holds: () => ARITHMETIC_FOUNDATION.status === 'conditional-reduction' &&
      ARITHMETIC_FOUNDATION.rhStatus === 'open' &&
      ARITHMETIC_FOUNDATION.reviewStatus === 'accepted' &&
      ARITHMETIC_FOUNDATION.reviewScope === 'internal',
  },
  {
    name: 'one-sided theorem pins fixed constants and every real W',
    holds: () => {
      const text = [
        ARITHMETIC_FOUNDATION.theorem.statement,
        ...ARITHMETIC_FOUNDATION.theorem.hypotheses,
      ].join(' ');
      return text.includes('C>0') && text.includes('m\\ge0') &&
        text.includes('every real $W\\ge W_0$') && text.includes('\\alpha<1/2');
    },
  },
  {
    name: 'signed centered remainder remains the open blocker',
    holds: () => ARITHMETIC_FOUNDATION.blockers.some(
      (blocker) => blocker.id === 'signed-centered-vaughan-remainder' && /signed/i.test(blocker.statement),
    ) && ARITHMETIC_FOUNDATION.derivation.some(
      (step) => step.id === 'missing-signed-estimate' && step.equations.some(
        (equation) => equation.id === 'exact-signed-remainder' && equation.tex.includes('\\beta_V(d)w_x(ad)'),
      ),
    ),
  },
  {
    name: 'single-grid and absolute-value routes retain explicit nonimplications',
    holds: () => ARITHMETIC_FOUNDATION.failures.length === 2 &&
      ARITHMETIC_FOUNDATION.failures.every((failure) => failure.nonImplications.length >= 3),
  },
  {
    name: 'analytic derivations do not masquerade as a numerical replay',
    holds: () => ARITHMETIC_FOUNDATION.verification.reproducibilityStatus === 'not-applicable' &&
      ARITHMETIC_FOUNDATION.status !== 'certified-finite',
  },
  {
    name: 'canonical body and immutable source commit are pinned',
    holds: () => ARITHMETIC_FOUNDATION.verification.artifacts.some(
      (artifact) => artifact.path === ARITHMETIC_FOUNDATION.bodyPath && artifact.sha256 === BODY_SHA256,
    ) && ARITHMETIC_FOUNDATION.provenance.sourceRefs[0].commit === SOURCE_COMMIT,
  },
  {
    name: 'module does not promote the conditional implication to RH',
    holds: () => ARITHMETIC_FOUNDATION.claimBoundary.doesNotClaim.some(
      (claim) => /new zero-free strip or RH/i.test(claim),
    ) && ARITHMETIC_FOUNDATION.theorem.equations.some(
      (equation) => equation.id === 'open-signed-target' && /open/i.test(equation.explanation),
    ),
  },
  {
    name: 'arithmetic foundation preserves inline TeX commands at JavaScript runtime',
    holds: () => [
      tex`\prime`,
      tex`\ge`,
      tex`\delta`,
      tex`\sqrt`,
      tex`\infty`,
    ].every((command) => ARITHMETIC_INLINE_TEX_RUNTIME_TEXT.includes(command)),
  },
  {
    name: 'arithmetic foundation runtime strings contain no control characters',
    holds: () => !hasRuntimeControlCharacter(ARITHMETIC_FOUNDATION),
  },
  {
    name: 'centered Vaughan display includes constants finite I4 and quadrature hypotheses',
    holds: () => {
      const step = ARITHMETIC_FOUNDATION.derivation.find((item) => item.id === 'centered-vaughan');
      const constants = step?.equations.find((equation) => equation.id === 'vaughan-explicit-constants');
      const quadrature = step?.equations.find((equation) => equation.id === 'second-order-quadrature');
      const i4 = step?.equations.find((equation) => equation.id === 'finite-i4-definition');
      return constants?.tex.includes('c=c_h') && constants.tex.includes('c_1=8h\\sinh') &&
        constants.tex.includes('C_w=4\\sqrt2+2+h') && constants.tex.includes('C_\\ell=8h+2\\sqrt2') &&
        quadrature?.tex.includes(tex`\operatorname{Var}(g')`) && /weak derivative has bounded variation/.test(quadrature.explanation) &&
        i4?.tex.includes('\\sum_{a>U}') && i4.tex.includes('\\sum_{c>V}') && i4.tex.includes('\\sum_{b\\ge1}');
    },
  },
]);

export default ARITHMETIC_FOUNDATION;
