import { createResearchModule } from './module-contract.js';

const tex = String.raw;
const SOURCE_COMMIT = 'a3879a8281c53a160f5789a6c6b3fee1380a0d22';
const SOURCE_TREE = 'd5fae555cc4d25283e972a267c593fa91446b5f3';
const BODY_SHA256 = '976652e8e2bf33f02c099ad9b6737e4e3dc410852eedd62ba1c7978c5aea26f5';
const PRODUCER_SHA256 = '8fad3f81f08b714052715c368bd6480764f7448347494d36ec50f2d38067406c';
const INDEPENDENT_SHA256 = '774b0121e863088495d1867281824a69f37bd6bdc30a14ddddf6df2096c63dc1';
const FAILED_TERMINAL_SHA256 = 'ac80ae840bc9fb057bc5858c8473aa30b82bb3a0be5693499512d5cb30e8980c';

export const PRIME_RETAINED_TAIL_CERTIFICATE = createResearchModule({
  schemaVersion: 1,
  id: 'prime-retained-tail-certificate',
  route: '/rh-prime-retained-tail-certificate',
  title: 'Prime-retained tail certificate through √(33/2)',
  updatedAt: '2026-10-30',
  status: 'certified-finite',
  reviewStatus: 'accepted',
  reviewScope: 'internal',
  rhStatus: 'open',
  summary:
    'A retained-prime inverse inequality and a safe rank-one head reduction repair the complete sufficient comparison at X = 33/2. The independently replayed 2049+72+72 gate proves actual reflection-even whole-form coercivity through λ = √(33/2), including the entire infinite tail, while preserving the failed diagonal-only route as a failed surrogate.',
  bodyPath: 'research/rh/modules/prime-retained-tail-certificate.md',

  claimBoundary: {
    title: 'A finite reflection-even theorem with an existential floor',
    statement:
      tex`There is a constant $\delta_*>0$ such that $q[f]\ge\delta_*\lVert f\rVert_2^2$ for every complex reflection-even form-domain vector supported in $[-\log\lambda,\log\lambda]$ whenever $1<\lambda\le\sqrt{33/2}$.`,
    doesNotClaim: [
      'The theorem gives no numerical value for the whole-form coercivity constant; LDL pivots are inertia diagnostics, not coordinate-free eigenvalue floors.',
      'It proves no odd-sector inequality, cofinal-support theorem, global-ground-state statement, or zero-free region.',
      'It does not claim that positivity stops at this endpoint and it does not prove RH.',
      'The earlier negative diagonal-inverse lower-surrogate value was not actual negative Weil energy.',
      'Internal acceptance records repository mathematical/source review and an isolated replay, not external peer review or proof-assistant formalization.',
    ],
  },

  theorem: {
    label: 'Actual whole-even coercivity through the prime-retained endpoint',
    statement:
      tex`Let $\lambda_* = \sqrt{33/2}$ and $I_*=[-\log\lambda_*,\log\lambda_*]$. There exists $\delta_*>0$ such that $q[f]\ge\delta_*\lVert f\rVert_{L^2(\mathbb R)}^2$ for every complex-valued reflection-even $f$ in the actual logarithmic form domain with $\operatorname{supp}f\subseteq I_*$. The same $\delta_*$ works for every $1<\lambda\le\lambda_*$ by isometric zero extension.`,
    hypotheses: [
      tex`Set $X=33/2$, $\lambda_* = \sqrt X$, $W=\log X$, and $I_*=[-W/2,W/2]$.`,
      tex`Use $\widehat f(t)=\int_{\mathbb R}f(x)e^{-itx}\,dx$ and require $\int_{\mathbb R}\log(2+|t|)|\widehat f(t)|^2dt<\infty$.`,
      tex`Reflection-even means $f(-x)=f(x)$ almost everywhere. Complex values and the constant mode are allowed; no mean-zero or candidate-dependent orthogonality condition is imposed.`,
      'The form is the actual completed Weil form on the reflection-even sector, with the archimedean, pole, exponential-kernel, and every supported prime-power translation term included.',
      'The head contains indices 0 through 2048 and is coupled to the entire infinite tail. The near/far split is only an estimate inside the proof, not a truncation of the theorem.',
      'All computer sign decisions use 1000-bit outward Arb intervals with assertions enabled. Midpoints can select elimination order but cannot certify a sign.',
    ],
    equations: [
      {
        id: 'support-endpoint',
        label: 'Exact support endpoint',
        tex: String.raw`X=\frac{33}{2},\qquad \lambda_*=\sqrt{\frac{33}{2}},\qquad W=\log\frac{33}{2},\qquad I_*=[-W/2,W/2]`,
      },
      {
        id: 'actual-form-domain',
        label: 'Actual logarithmic form domain',
        tex: String.raw`\mathcal V_{\lambda,+}=\left\{f\in L^2([-\log\lambda,\log\lambda]): f(-x)=f(x),\ \int_{\mathbb R}\log(2+|t|)|\widehat f(t)|^2dt<\infty\right\}`,
      },
      {
        id: 'actual-completed-even-form',
        label: 'Actual completed reflection-even Weil form',
        tex: String.raw`q[f]=\frac1{2\pi}\int_{\mathbb R}\!\left[\Re\psi\!\left(\frac54+\frac{it}{2}\right)-\log\pi\right]|\widehat f(t)|^2dt+2|\langle\cosh(x/2),f\rangle|^2-\langle f,K_0f\rangle-\langle f,Pf\rangle`,
        explanation:
          tex`Here $K_0(x,y)=e^{-|x-y|/2}$ and $P=\sum_{2\le n<X}\Lambda(n)n^{-1/2}(S_{\log n}+S_{-\log n})$, compressed by zero extension. The odd pole term vanishes exactly on this sector rather than being discarded from an odd claim.`,
      },
      {
        id: 'actual-prime-translation-operator',
        label: 'Every supported prime-power translation',
        tex: String.raw`P=\sum_{2\le n<X}\frac{\Lambda(n)}{\sqrt n}\left(S_{\log n}+S_{-\log n}\right)`,
        explanation:
          'At X = 33/2 the supported prime powers are 2, 3, 4, 5, 7, 8, 9, 11, 13, and 16; prime 17 is outside the support.',
      },
      {
        id: 'whole-even-conclusion',
        label: 'Coercive conclusion on all nested boxes',
        tex: String.raw`\exists\,\delta_*>0\quad\forall\,1<\lambda\le\sqrt{33/2}\quad\forall f\in\mathcal V_{\lambda,+}:\qquad q[f]\ge\delta_*\lVert f\rVert_2^2`,
      },
    ],
  },

  derivation: [
    {
      id: 'actual-tail-decomposition',
      title: 'Keep a positive piece of the actual prime tail',
      body:
        'Split the even box basis after N = 2048. The global gamma and compressed exponential-kernel estimates, together with the independently audited eighth-power norm envelope for the selfadjoint prime-translation operator, produce a lower bound on the entire actual tail. The positive correction B is retained rather than charging every direction with the worst prime norm.',
      equations: [
        {
          id: 'prime-envelope',
          tex: String.raw`\lVert P\rVert<3.820103192196<P_*:=\frac{477513}{125000}`,
        },
        {
          id: 'actual-tail-lower-bound',
          tex: String.raw`D\ge d+B,\qquad d=\operatorname{diag}_{j>N}(d_j),\qquad B=P_*I-P_{\rm tail},\qquad 0\le B\le2P_*I`,
        },
        {
          id: 'entire-tail-floor',
          tex: String.raw`d_j=\Re\psi\!\left(\frac54+\frac{i\pi j}{W}\right)-\log\pi-\Gamma_{\rm ref}(W)-\frac{H_K(W)}{N}-P_*,\qquad d_{N+1}>0.7061304911532`,
          explanation:
            'Monotonicity of the archimedean symbol proves that this is an entire-tail floor, not a sampled minimum. It is not the coercivity constant of the fully coupled form.',
        },
      ],
      notes: [
        'Selfadjointness, not positive semidefiniteness of the prime operator, justifies the even-power norm root.',
        'The gamma remainder and exponential-kernel estimates cover the entire tail compression.',
      ],
    },
    {
      id: 'retained-prime-inverse',
      title: 'Convert retained stiffness into a global inverse improvement',
      body:
        'Conjugating B by the positive diagonal d reduces the inverse comparison to scalar functional calculus. The exact rational coefficient 2/25 is below the verified admissible ceiling. Positive inverse order then improves the entire infinite-tail inverse without any squared-inverse argument.',
      equations: [
        {
          id: 'bounded-tail-operator',
          tex: String.raw`T=d^{-1/2}Bd^{-1/2},\qquad 0\le T\le\kappa I,\qquad \kappa=\frac{2P_*}{d_{\min}}`,
        },
        {
          id: 'scalar-inverse-inequality',
          tex: String.raw`\frac1{1+t}\le1-ct\quad(0\le t\le\kappa),\qquad 0\le c\le\frac1{1+\kappa},\qquad \frac1{1+\kappa}>0.0846036249`,
        },
        {
          id: 'retained-inverse-bound',
          tex: String.raw`D^{-1}\le(d+B)^{-1}\le d^{-1}-\frac2{25}d^{-1}Bd^{-1}`,
        },
      ],
      notes: [
        'The bounded operator T makes the functional-calculus step valid on the common closed-form domain although d and D are unbounded.',
        'This is the mathematical change from the failed diagonal-only comparison.',
      ],
    },
    {
      id: 'pay-every-near-far-charge',
      title: 'Charge every near/far prime interaction',
      body:
        'For a finite head vector v, split z = d⁻¹Cv at J = 16384. The previously audited far construction supplies a positive finite majorant F for every far coupling. Positive-semidefinite seminorm Cauchy–Schwarz followed by Young’s inequality controls the cross band; both the far coefficient matrix and its isotropic remainder receive the same factor r.',
      equations: [
        {
          id: 'far-majorant',
          tex: String.raw`F(v)=v^*\!\left(P_{\rm feature}^*HP_{\rm feature}+\operatorname{rem}I\right)v\ge\sum_{j>J}\frac{|(Cv)_j|^2}{d_j}`,
        },
        {
          id: 'tail-seminorm-bound',
          tex: String.raw`\langle z,Bz\rangle\ge\frac34E(v)-3\frac{2P_*}{d_{\rm far}}F(v),\qquad E(v)=\langle Yv,B_{nn}Yv\rangle,\quad Y=d_n^{-1}C_n`,
        },
        {
          id: 'complete-near-far-lower-bound',
          tex: String.raw`A-C^*D^{-1}C\ge A-\operatorname{Near}-rF+\frac3{50}E,\qquad r=1+\frac6{25}\frac{2P_*}{d_{\rm far}}=1.6583678812485898\ldots`,
        },
      ],
      notes: [
        'The estimate includes all prime cross-band interactions; it never assumes the invalid block inequality B ≥ diag(B_nn, 0).',
        'The 72 far features use exact phase classes, complete Abel charges, signed identity moments, and the full geometric remainder.',
      ],
    },
    {
      id: 'safe-rank-one-head-reduction',
      title: 'Retain a safe rank-one piece of the near-head Gram form',
      body:
        'The saved exact rational witness v₀ from the failed comparison fixes one algebraic direction, not an assumed eigenvector. Cauchy–Schwarz in the B_nn seminorm gives a valid rank-one lower bound for every head vector. The new term is a proved positive correction after the global cross-band estimate; the old artificial constant-coordinate lift stays removed.',
      equations: [
        {
          id: 'witness-energy',
          tex: String.raw`y_0=Yv_0,\qquad E_0=\langle y_0,B_{nn}y_0\rangle>0,\qquad e=Y^*B_{nn}y_0`,
        },
        {
          id: 'rank-one-gram-bound',
          tex: String.raw`Y^*B_{nn}Y\ge\frac{ee^*}{E_0},\qquad u=\sqrt{\frac{3}{50E_0}}\,e`,
        },
        {
          id: 'finite-lower-matrix',
          tex: String.raw`M=A-C_n^*d_n^{-1}C_n-r\!\left(\operatorname{rem}I+P_{\rm feature}^*HP_{\rm feature}\right)+uu^*\le A-C^*D^{-1}C`,
        },
      ],
      notes: [
        'The rank-one update raises the core displacement rank from four to at most six while the far feature rank remains 72.',
        'On the old witness the repaired lower value is positive, but the complete matrix gate—not this single direction—proves the theorem.',
      ],
    },
    {
      id: 'complete-outward-gate',
      title: 'Certify the complete finite Schur lower form',
      body:
        'The producer and an isolated independent replay rebuild the actual head, near couplings, retained-prime correction, far coefficient form, and structured Schur test at exact X = 33/2. Every sign is outward-rounded. Equality of every non-timing receipt field, including the full permutation, binds the independent execution to the frozen source package.',
      equations: [
        {
          id: 'finite-gate-dimensions',
          tex: String.raw`2049\ \text{corrected-core pivots}>0,\qquad72\ \text{coefficient pivots}>0,\qquad72\ \text{whitened-Schur pivots}>0`,
        },
        {
          id: 'gate-settings',
          tex: String.raw`X=\frac{33}{2},\qquad N=2048,\qquad J=16384,\qquad L=36,\qquad p=1000\ \text{bits}`,
        },
        {
          id: 'diagnostic-pivots',
          tex: String.raw`p_{\rm core,min}\approx1.2534317623\times10^{-77},\qquad p_{\rm Schur,min}\approx0.7814292450`,
          explanation:
            'These values diagnose signs and inertia in the chosen elimination coordinates; they are not numerical coercivity constants.',
        },
      ],
      notes: [
        'All 19 copied driver sources and all 115 copied isolated runtime files remained unchanged before and after the replay.',
        'The 33-mode dense preflight is implementation evidence, not a substitute for the complete 2049-mode gate.',
      ],
    },
    {
      id: 'lift-to-actual-whole-form',
      title: 'Pass from the finite gate to the entire form domain',
      body:
        'The positive finite lower matrix proves a positive actual head Schur complement. The entire tail has a strict lower floor, so bounded triangular block factorization gives an existential positive constant on the closed reflection-even form domain. Centered zero extension is an isometry and leaves the whole-line expression unchanged, so the same constant restricts to every smaller box.',
      equations: [
        {
          id: 'block-square-completion',
          tex: String.raw`q[v+w]=\langle Sv,v\rangle+q_D\!\left[w+D^{-1}Cv\right],\qquad S=A-C^*D^{-1}C>0`,
        },
        {
          id: 'existential-whole-form-floor',
          tex: String.raw`S\ge sI>0,\quad D\ge d_{\min}I>0\quad\Longrightarrow\quad\exists\delta_*>0:\ q\ge\delta_*I`,
        },
      ],
      notes: [
        'Finite Fourier polynomials are a form core; the bounded prime, pole, and exponential-kernel terms do not change the logarithmic domain.',
        'No continuity extrapolation in support and no identification of an LDL pivot with the final floor is used.',
      ],
    },
  ],

  verification: {
    result:
      'PASS: all 57 checksum-listed package payloads, all 19 driver dependency pins, the producer and independent complete receipts, and every non-timing mathematical field verify. Both complete executions certify 2049+72+72 positive pivots at X = 33/2; the failed diagonal-only route remains preserved.',
    scope:
      tex`Actual reflection-even whole-form coercivity for every $1<\lambda\le\sqrt{33/2}$ with an existential positive constant. No numerical full-form floor, odd-sector theorem, cofinal-support conclusion, external peer-review claim, or RH proof is reproduced.`,
    reproducibilityStatus: 'current-replay',
    commands: [
      {
        label: 'Verify every frozen package payload',
        cwd: 'research/rh/prime-retained-inverse',
        command: 'shasum -a 256 -c SHA256SUMS',
        expected: 'All 57 listed payloads print OK.',
      },
      {
        label: 'Verify source pins and producer/independent receipt equality',
        cwd: 'research/rh/prime-retained-inverse',
        command: 'python verify_source_slice.py',
        expected:
          'PASS_FROZEN_SOURCE_SLICE_AND_RECEIPT_COMPARISON with 50 copied evidence files, all 19 driver dependencies, and every non-timing mathematical field equal. It performs no full positivity run.',
      },
      {
        label: 'Replay only from a fresh disposable source-tree copy',
        cwd: '<disposable-copy-of-source-tree>',
        command: 'PYTHONPATH=/absolute/path/to/python-flint-0.9.0 python rh_attack_cycle_20261030/support_endpoint_X165/prime_retained_rankone_attempt/certify_prime_retained_rankone.py --full',
        expected:
          'A fresh complete receipt with all 2049+72+72 gates positive and all non-timing fields equal to the frozen receipts. Never run this command in the frozen package.',
      },
    ],
    artifacts: [
      {
        label: 'Canonical theorem and proof body',
        path: 'research/rh/modules/prime-retained-tail-certificate.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: BODY_SHA256,
        sizeBytes: 5807,
      },
      {
        label: 'Frozen package checksum manifest',
        path: 'research/rh/prime-retained-inverse/SHA256SUMS',
        requiredForClaim: true,
        availability: 'available',
        sha256: '621411104c987247f58884032073caffaa531145c7fe663a859be8cc65c096af',
        sizeBytes: 9396,
      },
      {
        label: 'Portable frozen-package verifier',
        path: 'research/rh/prime-retained-inverse/verify_source_slice.py',
        requiredForClaim: true,
        availability: 'available',
        sha256: '653e8ecb74b330298b2743e0be594b8beb5b5a835570b4d062f2ebf7955476f1',
        sizeBytes: 1937,
      },
      {
        label: 'Complete producer finite-gate receipt',
        path: 'research/rh/prime-retained-inverse/source-tree/rh_attack_cycle_20261030/support_endpoint_X165/prime_retained_rankone_attempt/PRIME_RETAINED_RANKONE_FULL_GATE.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: PRODUCER_SHA256,
        sizeBytes: 33194,
      },
      {
        label: 'Complete isolated independent receipt',
        path: 'research/rh/prime-retained-inverse/receipts/INDEPENDENT_FULL_GATE.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: INDEPENDENT_SHA256,
        sizeBytes: 33193,
      },
      {
        label: 'Exact whole-even theorem and domain proof',
        path: 'research/rh/prime-retained-inverse/source-tree/rh_attack_cycle_20261030/support_endpoint_X165/prime_retained_rankone_attempt/THEOREM_ACTUAL_WHOLE_EVEN_X165.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: '26bc2956663cd9baa15eb081285bd5c01a0e4677d676b3c4cc839670e16339f4',
        sizeBytes: 11373,
      },
      {
        label: 'Old failed diagonal-only terminal manifest',
        path: 'research/rh/prime-retained-inverse/source-tree/rh_attack_cycle_20261030/support_endpoint_X165/BOUNDED_ATTEMPT_TERMINAL_MANIFEST.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: FAILED_TERMINAL_SHA256,
        sizeBytes: 5704,
      },
      {
        label: 'Final theorem wording audit',
        path: 'research/rh/prime-retained-inverse/source-tree/rh_attack_cycle_20261030/support_endpoint_X165/prime_retained_rankone_attempt/independent_review/FINAL_THEOREM_MODULE_WORDING_AUDIT.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: 'a056f7524940d9c001ef8315e25ba268980311fd4711aabb0411a47241dcfc39',
        sizeBytes: 1571,
      },
    ],
    replays: [
      {
        label: 'Isolated complete prime-retained replay',
        method:
          'Copy the 19 pinned producer dependencies and an isolated python-flint 0.9.0 runtime, rebuild the actual head, near couplings, coefficient matrix, rank-one correction, and full structured sign gate, then compare every non-timing field and the complete permutation.',
        outcome:
          'PASS: every 2049 corrected-core, 72 coefficient-H, and 72 whitened-Schur pivot is positive; all 19 copied source files and 115 copied runtime files remain unchanged; every non-timing field agrees with the producer.',
        command: 'Run the pinned --full command only in a fresh disposable source-tree copy with assertions enabled.',
        evidence: [
          'research/rh/prime-retained-inverse/receipts/INDEPENDENT_FULL_GATE.json',
          'research/rh/prime-retained-inverse/source-tree/rh_attack_cycle_20261030/support_endpoint_X165/prime_retained_rankone_attempt/independent_review/COMPLETE_REPLAY_INDEPENDENT_AUDIT.json',
          'research/rh/prime-retained-inverse/source-tree/rh_attack_cycle_20261030/support_endpoint_X165/prime_retained_rankone_attempt/independent_review/INDEPENDENT_FULL_REPLAY.log',
        ],
      },
      {
        label: 'Independent internal mathematical and source audit',
        method:
          'Audit the tail inverse order, full near/far Young charge, rank-one Gram reduction, structured update, form-domain closure, and exact theorem wording independently of the producer receipt.',
        outcome:
          'PASS for the stated finite reflection-even theorem. This is internal review using the same mathematical implementation family, not external peer review, a second arithmetic library, or proof-assistant formalization.',
        evidence: [
          'research/rh/prime-retained-inverse/source-tree/rh_attack_cycle_20261030/support_endpoint_X165/prime_retained_rankone_attempt/independent_review/COMPLETE_PRIME_RETAINED_RANKONE_AUDIT.md',
          'research/rh/prime-retained-inverse/source-tree/rh_attack_cycle_20261030/support_endpoint_X165/near_tail_inverse_repair/PRIME_RETAINED_INVERSE_INDEPENDENT_AUDIT.md',
          'research/rh/prime-retained-inverse/source-tree/rh_attack_cycle_20261030/support_endpoint_X165/prime_retained_rankone_attempt/independent_review/FINAL_THEOREM_MODULE_WORDING_AUDIT.md',
        ],
      },
    ],
    evidence: [
      {
        label: 'Frozen package SHA-256 inventory',
        kind: 'integrity-manifest',
        location: 'research/rh/prime-retained-inverse/SHA256SUMS',
      },
      {
        label: 'Integration and replay manifest',
        kind: 'source-manifest',
        location: 'research/rh/prime-retained-inverse/INTEGRATION_MANIFEST.json',
      },
      {
        label: 'Exact theorem and block-form implication',
        kind: 'proof-note',
        location: 'research/rh/prime-retained-inverse/source-tree/rh_attack_cycle_20261030/support_endpoint_X165/prime_retained_rankone_attempt/THEOREM_ACTUAL_WHOLE_EVEN_X165.md',
      },
      {
        label: 'Independent complete audit',
        kind: 'internal-review',
        location: 'research/rh/prime-retained-inverse/source-tree/rh_attack_cycle_20261030/support_endpoint_X165/prime_retained_rankone_attempt/independent_review/COMPLETE_PRIME_RETAINED_RANKONE_AUDIT.md',
        note: 'Independent internal mathematical/source audit; not external peer review.',
      },
      {
        label: 'Preserved failed-route audit',
        kind: 'failure-analysis',
        location: 'research/rh/prime-retained-inverse/source-tree/rh_attack_cycle_20261030/support_endpoint_X165/independent_review/X165_FULL_FAILURE_AUDIT.md',
        note: 'Documents failure of the earlier sufficient lower surrogate, not actual negative Weil energy.',
      },
    ],
  },

  blockers: [
    {
      id: 'prime-retained-cofinal-support',
      title: 'The certified cavity is still finite',
      statement:
        tex`The theorem ends at $\lambda=\sqrt{33/2}$. RH-oriented use still requires a cofinal family of supports or a separate mechanism that controls the form as $\lambda\to\infty$.`,
      physicsAnalogy:
        'We have proved that one larger resonant cavity remains stiff after retaining a real piece of its boundary response. The thermodynamic limit can still develop a soft mode as the walls recede, so one stable finite cavity is not an infinite-volume theorem.',
      nextTest:
        'Seek support-uniform tail stiffness and Schur bounds, or a monotone continuation whose constants do not collapse along an unbounded sequence of boxes.',
    },
    {
      id: 'prime-retained-odd-sector',
      title: 'The orthogonal parity channel remains open',
      statement:
        tex`The certificate acts on $\mathcal V_{\lambda,+}$ only and supplies no lower bound for reflection-odd vectors.`,
      physicsAnalogy:
        'Closing the even polarization of a waveguide does not close the odd polarization. Symmetry decouples the channels, but it does not transfer a spectral gap between them.',
      nextTest:
        'Build and independently audit an odd-sector head/tail comparison or prove an exact parity-transfer principle for the completed form.',
    },
    {
      id: 'prime-retained-numerical-floor',
      title: 'The coercivity constant remains existential',
      statement:
        'The proof establishes a positive whole-form constant but does not extract a stable numerical value from the structured LDL coordinates and triangular completion.',
      physicsAnalogy:
        'A positive stiffness factorization proves that the structure resists every displacement, but its smallest elimination pivot is not the coordinate-free lowest normal-mode frequency.',
      nextTest:
        'Add condition-number-controlled spectral enclosures for the finite Schur form and completion map before advertising any numerical whole-form floor.',
    },
  ],

  provenance: {
    sourceManifestPath: 'research/rh/prime-retained-inverse/SOURCE_PROVENANCE.json',
    evidenceManifestPath: 'research/rh/prime-retained-inverse/INTEGRATION_MANIFEST.json',
    sourceRefs: [
      {
        repository: 'judegomila/mathexplorer',
        branch: 'codex/rh-prime-retained-source-2026-10-30',
        commit: SOURCE_COMMIT,
        access: 'private-repository',
        paths: [
          'research/rh/modules/prime-retained-tail-certificate.md',
          'research/rh/prime-retained-inverse/SHA256SUMS',
          'research/rh/prime-retained-inverse/SOURCE_PROVENANCE.json',
          'research/rh/prime-retained-inverse/INTEGRATION_MANIFEST.json',
          'research/rh/prime-retained-inverse/verify_source_slice.py',
          'research/rh/prime-retained-inverse/receipts/INDEPENDENT_FULL_GATE.json',
          'research/rh/prime-retained-inverse/source-tree/rh_attack_cycle_20261030/support_endpoint_X165/prime_retained_rankone_attempt/THEOREM_ACTUAL_WHOLE_EVEN_X165.md',
          'research/rh/prime-retained-inverse/source-tree/rh_attack_cycle_20261030/support_endpoint_X165/prime_retained_rankone_attempt/PRIME_RETAINED_RANKONE_FULL_GATE.json',
        ],
        note:
          `Private-repository source slice pinned at tree ${SOURCE_TREE}. Repository access is required; the app does not imply a public download.`,
      },
    ],
    curatorNote:
      'The package is an additions-only, hash-verified review unit. The app renders the complete canonical note while the structured overview exposes exact claim boundaries, proof gates, replay commands, and the preserved failure. Frozen numerical receipts remain byte-identical and numerical producers are not run in place.',
  },

  failures: [
    {
      id: 'x165-diagonal-inverse-surrogate',
      title: 'Failed diagonal-only inverse comparison at X = 33/2',
      surrogate:
        'The earlier diagonal-inverse sufficient lower comparison replaced the whole actual tail inverse by a diagonal worst-norm charge, discarding the positive retained-prime stiffness B from the comparison.',
      failureStage:
        tex`Its last corrected-core pivot failed, and the saved exact rational vector had lower-surrogate energy approximately $-3.93982120313\times10^{-77}$ even though its actual head energy was positive.`,
      implication:
        'That diagonal-only lower surrogate could not certify X = 33/2. The successful route changes the inverse inequality, charges every cross-band interaction, and keeps a safe rank-one piece of the retained-prime Gram form.',
      nonImplications: [
        'The negative lower-surrogate value is not a negative direction of the actual Weil form or actual Schur complement.',
        'It does not refute RH and is not a counterexample to any zeta-zero statement.',
        'It does not invalidate the earlier accepted sqrt(161/10) finite reflection-even certificate.',
        'The later positive value on the same witness is diagnostic; only the complete 2049+72+72 gate proves the new theorem.',
      ],
      evidence: [
        {
          label: 'Preserved old terminal manifest',
          kind: 'outward-interval-receipt',
          location: 'research/rh/prime-retained-inverse/source-tree/rh_attack_cycle_20261030/support_endpoint_X165/BOUNDED_ATTEMPT_TERMINAL_MANIFEST.json',
          note: `SHA-256 ${FAILED_TERMINAL_SHA256}; evidence for failure of a sufficient lower surrogate only.`,
        },
        {
          label: 'Independent full failure audit',
          kind: 'failure-analysis',
          location: 'research/rh/prime-retained-inverse/source-tree/rh_attack_cycle_20261030/support_endpoint_X165/independent_review/X165_FULL_FAILURE_AUDIT.md',
        },
        {
          label: 'Directional obstruction and correction audit',
          kind: 'failure-analysis',
          location: 'research/rh/prime-retained-inverse/source-tree/rh_attack_cycle_20261030/support_endpoint_X165/independent_review/X165_DIRECTIONAL_OBSTRUCTION_DELTA_AUDIT.md',
        },
      ],
    },
  ],

  references: [
    'research/rh/modules/prime-retained-tail-certificate.md — complete canonical theorem, retained-prime derivation, finite gate, replay scope, and nonclaims.',
    'research/rh/prime-retained-inverse/README.md — frozen package layout, safe verification, and disposable replay instructions.',
    'research/rh/prime-retained-inverse/source-tree/rh_attack_cycle_20261030/support_endpoint_X165/prime_retained_rankone_attempt/THEOREM_ACTUAL_WHOLE_EVEN_X165.md — exact operator, domain, quantifiers, and block-form implication.',
    'research/rh/prime-retained-inverse/source-tree/rh_attack_cycle_20261030/support_endpoint_X165/near_tail_inverse_repair/COUPLED_PRIME_RETAINED_INVERSE_AND_RANK_ONE_SPEC.md — global inverse, cross-band, and safe rank-one proof.',
    'research/rh/prime-retained-inverse/source-tree/rh_attack_cycle_20261030/support_endpoint_X165/prime_retained_rankone_attempt/independent_review/COMPLETE_PRIME_RETAINED_RANKONE_AUDIT.md — independent complete internal audit.',
  ],
});

function collectRuntimeStrings(value, strings = []) {
  if (typeof value === 'string') {
    strings.push(value);
    return strings;
  }
  if (!value || typeof value !== 'object') return strings;
  if (Array.isArray(value)) {
    value.forEach((item) => collectRuntimeStrings(item, strings));
    return strings;
  }
  Object.values(value).forEach((item) => collectRuntimeStrings(item, strings));
  return strings;
}

export const PRIME_RETAINED_TAIL_CERTIFICATE_ASSERTIONS = Object.freeze([
  {
    name: 'prime-retained certificate is accepted only internally and keeps RH open',
    holds: () => PRIME_RETAINED_TAIL_CERTIFICATE.reviewStatus === 'accepted' &&
      PRIME_RETAINED_TAIL_CERTIFICATE.reviewScope === 'internal' &&
      PRIME_RETAINED_TAIL_CERTIFICATE.rhStatus === 'open',
  },
  {
    name: 'prime-retained theorem is a current finite certificate',
    holds: () => PRIME_RETAINED_TAIL_CERTIFICATE.status === 'certified-finite' &&
      PRIME_RETAINED_TAIL_CERTIFICATE.verification.reproducibilityStatus === 'current-replay',
  },
  {
    name: 'exact endpoint and actual form domain are structured',
    holds: () => PRIME_RETAINED_TAIL_CERTIFICATE.theorem.equations.some(
      (equation) => equation.id === 'support-endpoint' && equation.tex.includes('33'),
    ) && PRIME_RETAINED_TAIL_CERTIFICATE.theorem.equations.some(
      (equation) => equation.id === 'actual-form-domain' && equation.tex.includes('\\log(2+|t|)'),
    ) && PRIME_RETAINED_TAIL_CERTIFICATE.theorem.equations.some(
      (equation) => equation.id === 'actual-prime-translation-operator' && equation.tex.includes('\\Lambda(n)'),
    ),
  },
  {
    name: 'retained-prime inverse and full cross-band bounds are explicit',
    holds: () => ['actual-tail-lower-bound', 'retained-inverse-bound', 'complete-near-far-lower-bound']
      .every((id) => PRIME_RETAINED_TAIL_CERTIFICATE.derivation.some(
        (step) => step.equations.some((equation) => equation.id === id),
      )),
  },
  {
    name: 'safe rank-one correction is a Gram lower bound',
    holds: () => PRIME_RETAINED_TAIL_CERTIFICATE.derivation.some(
      (step) => step.equations.some(
        (equation) => equation.id === 'rank-one-gram-bound' && equation.tex.includes('\\ge'),
      ),
    ) && JSON.stringify(PRIME_RETAINED_TAIL_CERTIFICATE.derivation).includes(
      'after the global cross-band estimate',
    ),
  },
  {
    name: 'complete 2049+72+72 gate and integrity counts are preserved',
    holds: () => PRIME_RETAINED_TAIL_CERTIFICATE.derivation.some(
      (step) => step.equations.some((equation) => equation.id === 'finite-gate-dimensions'),
    ) && PRIME_RETAINED_TAIL_CERTIFICATE.verification.replays.some(
      (replay) => replay.outcome.includes('2049') && replay.outcome.includes('115'),
    ),
  },
  {
    name: 'whole-form coercivity constant remains existential',
    holds: () => PRIME_RETAINED_TAIL_CERTIFICATE.claimBoundary.doesNotClaim.some(
      (claim) => claim.includes('no numerical value'),
    ) && JSON.stringify(PRIME_RETAINED_TAIL_CERTIFICATE).includes(
      'inertia diagnostics',
    ),
  },
  {
    name: 'failed diagonal-only route is not promoted to actual negativity',
    holds: () => PRIME_RETAINED_TAIL_CERTIFICATE.failures.length === 1 &&
      PRIME_RETAINED_TAIL_CERTIFICATE.failures[0].nonImplications.some(
        (claim) => claim.includes('not a negative direction of the actual Weil form'),
      ) && PRIME_RETAINED_TAIL_CERTIFICATE.verification.artifacts.some(
        (artifact) => artifact.sha256 === FAILED_TERMINAL_SHA256,
      ),
  },
  {
    name: 'producer and independent receipts are both hash pinned',
    holds: () => [PRODUCER_SHA256, INDEPENDENT_SHA256].every(
      (hash) => PRIME_RETAINED_TAIL_CERTIFICATE.verification.artifacts.some(
        (artifact) => artifact.sha256 === hash && artifact.requiredForClaim,
      ),
    ),
  },
  {
    name: 'all load-bearing artifacts are available and hashed',
    holds: () => PRIME_RETAINED_TAIL_CERTIFICATE.verification.artifacts
      .filter((artifact) => artifact.requiredForClaim)
      .every((artifact) => artifact.availability === 'available' && /^[a-f0-9]{64}$/.test(artifact.sha256)),
  },
  {
    name: 'representative runtime prose preserves TeX commands',
    holds: () => [
      [PRIME_RETAINED_TAIL_CERTIFICATE.claimBoundary.statement, [tex`\delta`, tex`\ge`, tex`\lVert`]],
      [PRIME_RETAINED_TAIL_CERTIFICATE.theorem.statement, [tex`\sqrt`, tex`\operatorname`, tex`\lVert`]],
      [PRIME_RETAINED_TAIL_CERTIFICATE.verification.scope, [tex`\lambda`, tex`\le`, tex`\sqrt`]],
      [PRIME_RETAINED_TAIL_CERTIFICATE.blockers[0].statement, [tex`\lambda`, tex`\sqrt`, tex`\to`]],
      [PRIME_RETAINED_TAIL_CERTIFICATE.failures[0].failureStage, [tex`\times`]],
    ].every(([value, tokens]) => tokens.every((token) => value.includes(token))),
  },
  {
    name: 'prime-retained runtime text contains no destructive ASCII controls',
    holds: () => collectRuntimeStrings(PRIME_RETAINED_TAIL_CERTIFICATE).every(
      (value) => !/[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f]/.test(value),
    ),
  },
]);

export default PRIME_RETAINED_TAIL_CERTIFICATE;
