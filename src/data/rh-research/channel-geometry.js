import { createResearchModule } from './module-contract.js';

const tex = String.raw;
const SOURCE_BRANCH = 'codex/rh-channel-geometry-source-2026-10-30';
const SOURCE_COMMIT = 'a9e52e234e104a1b64b5fce6d2c108519b18eb8f';
const SOURCE_TREE = 'dc967ce1539d1fb067ee772b3ec453e159ef8162';
const SOURCE_PARENT = '942ba1760c4ef54a519750ab91c37a661c31e0ce';

export const CHANNEL_GEOMETRY = createResearchModule({
  schemaVersion: 1,
  id: 'channel-geometry',
  route: '/rh-channel-geometry',
  title: 'Coherent channels, superwires, and triangle geometry',
  updatedAt: '2026-10-30',
  status: 'proved-analytic',
  reviewStatus: 'accepted',
  reviewScope: 'internal',
  rhStatus: 'open',
  summary:
    'A fixed-envelope family of separated good carriers can be assembled into one sparse positive span while retaining every coherent cross term. ' +
    'The exact paired-packet and Suzuki screw-kernel identities, together with generic Hermitian triangle algebra, expose the remaining all-channel Schur obstruction; seven tempting shortcuts are recorded as failures.',
  bodyPath: 'research/rh/modules/channel-geometry.md',

  claimBoundary: {
    title: 'Restricted sparse span, not complement coverage',
    statement:
      'The reviewed result proves a large sparse positive span for one fixed smooth envelope family, with the annular precursor restricted to T=X=exp(2b). ' +
      'It also proves exact paired-packet, screw-kernel, two-channel, and triangle identities. ' +
      'The neighboring, exceptional, low-frequency, dense, and omitted channel directions remain uncontrolled.',
    doesNotClaim: [
      'It does not prove positivity on the whole physical complement, a nested or cofinal exhaustion, a global coercivity floor, a zero-free region, or RH.',
      'It does not promote the original general-carrier-height or band-compression statements; the source-specific broad annular final audit was not recovered.',
      'It does not prove that triangle tests suffice for four or more coherently coupled channels.',
      tex`It does not extend or re-certify the separate accepted whole-even endpoint $\lambda\le\sqrt{33/2}$.`,
      'It does not treat the synthetic algebra checks as actual-prime or actual-Weil numerical certificates.',
      tex`The physical-head projection conclusion imports the accepted action estimate $\lVert H_\ell P_\ell\rVert=O(\ell^{-2})$; the complete transitive proof tree is not bundled here.`,
    ],
  },

  theorem: {
    label: 'Restricted coherent sparse-span theorem with exact channel tests',
    statement:
      'For a fixed finite-dimensional smooth even envelope space and sufficiently large packet separation, a positive-density set of individually good carriers contains an exponentially large separated subset whose full coherent span remains positive. ' +
      'All carrier cross terms and the complete signed physical form are retained. Exact two-channel and triangle formulas then identify, but do not solve, the missing all-channel Schur inequality.',
    hypotheses: [
      tex`Fix $0<\delta<(\log2)/2$, a complex finite-dimensional smooth even space $U\subset C_c^\infty(-\delta,\delta)$, and a fixed neutralizing envelope $\chi$ with $m_{1/2}(\chi)\ne0$.`,
      tex`Use the actual even physical form, retain every prime power, and set $T=X=e^{2b}$ for the independently recovered annular precursor.`,
      tex`Choose a maximal $L$-separated subset of the good-carrier set, first with $L=e^b$ and fixed integration-by-parts order $K>1$.`,
      tex`The projected conclusion assumes the accepted action norm $\lVert H_\ell P_\ell\rVert=O(\ell^{-2})$ on the finite physical head.`,
      tex`For the fixed-$\varepsilon$ extension, keep $0<\varepsilon<2$ fixed and choose $K>\max\{1,\varepsilon^{-1},(3-\varepsilon)/2\}$.`,
      tex`The finite all-channel Schur equivalence is stated for an orthogonal block decomposition with $D>0$. The two-channel criterion assumes nonnegative diagonals; the normalized triangle test assumes strictly positive diagonals and includes the pairwise conditions $r_{ij}\le1$.`,
    ],
    equations: [
      {
        id: 'paired-pullback',
        label: 'Exact paired-packet pullback',
        tex: tex`J_b^*H_\ell J_b=A-\Delta_b-C_b,\qquad C_b=\sum_{j\ge0}e^{-(5+4j)b}|c_{5/2+2j}\rangle\langle c_{5/2+2j}|`,
        explanation: 'All prime powers are retained and the positive correction is subtracted once from the complete coherent vector.',
      },
      {
        id: 'annular-good-carrier',
        label: 'Reviewed fixed-envelope annular precursor',
        tex: tex`|G_b|/T\ge 1-C_\delta r/b,\qquad H_\ell[J_bN_tu]\ge\frac18\log T\,\lVert u\rVert^2`,
        explanation: tex`This statement is restricted to $T=X=e^{2b}$ and fixed $U$; it is not a general carrier-height theorem.`,
      },
      {
        id: 'coherent-sparse-span',
        label: 'Complete coherent sparse-span bounds',
        tex: tex`\frac14S\le\|\Psi_b\|^2\le S,\qquad H_\ell[J_b\Psi_b]\ge\frac1{16}\log T\,S,\qquad \dim\operatorname{span}\ge rm\ge\frac{re^b}{4}`,
      },
      {
        id: 'physical-projection-transfer',
        label: 'Conditional physical-head transfer',
        tex: tex`H_\ell[Q_\ell J_b\Psi_b]\ge\frac1{32}\log T\,S\ge\frac1{32}\log T\,\lVert Q_\ell J_b\Psi_b\rVert^2`,
        explanation: 'This uses the imported action-norm theorem, not a small Rayleigh quotient or a gamma-coordinate surrogate.',
      },
      {
        id: 'fixed-epsilon-extension',
        label: 'Fixed epsilon dimension extension',
        tex: tex`L=e^{\varepsilon b},\qquad m\ge\frac{e^{(2-\varepsilon)b}}4,\qquad K>\max\{1,\varepsilon^{-1},(3-\varepsilon)/2\}`,
      },
      {
        id: 'suzuki-box-test',
        label: 'Exact centered-box channel identity',
        tex: tex`q(b_a,b_b)=2[\Psi(a+b)-\Psi(|a-b|)]`,
      },
      {
        id: 'triangle-phase-test',
        label: 'Exact normalized triangle determinant',
        tex: tex`\det z=1-r_{12}^2-r_{23}^2-r_{31}^2+2r_{12}r_{23}r_{31}\cos\Phi`,
      },
      {
        id: 'remaining-schur-obligation',
        label: 'Unproved all-channel obligation',
        tex: tex`E-B^*D^{-1}B\ge0`,
        explanation: 'This is the blocker exposed by the channel decomposition, not a conclusion of the theorem.',
      },
    ],
  },

  derivation: [
    {
      id: 'exact-paired-reduction',
      title: 'Pull the actual form back to paired packets',
      body:
        'Disjoint reflected packets give an isometry into the physical even window. ' +
        'The large pole and continuous-prime main term cancel exactly, as do the matching small-pole and gamma cross terms, leaving the actual annular operator and a positive trace-class correction.',
      equations: [
        {
          id: 'paired-isometry',
          tex: tex`J_b\psi=\frac{\psi(\cdot+b)+\psi(\cdot-b)}{\sqrt2},\qquad b>\delta,\qquad \ell=b+2\delta`,
        },
        {
          id: 'annular-excess',
          tex: tex`X_b=\frac12\sum_{|\log n-2b|<2\delta}\frac{\Lambda(n)}{\sqrt n}(S_{\log n-2b}+S_{\log n-2b}^*),\qquad \Delta_b=X_b-e^b|c_{1/2}\rangle\langle c_{1/2}|`,
        },
        {
          id: 'tail-enclosure',
          tex: tex`0\le C_b-C_{b,J}\le\frac{2\delta e^{-(5+4J)(b-\delta)}}{1-e^{-4(b-\delta)}}I`,
        },
      ],
      notes: ['A lower approximation to the subtracted positive correction cannot replace the required upper enclosure.'],
    },
    {
      id: 'fixed-envelope-annular-mean-square',
      title: 'Find many individually safe carriers',
      body:
        'Exact-neutral modulation preserves a fixed smooth envelope and its logarithmic gamma energy. ' +
        'The classical Montgomery–Vaughan mean-value theorem, applied entrywise and summed before Markov, controls the annular matrix on most carriers.',
      equations: [
        {
          id: 'neutral-modulation',
          tex: tex`N_tu=u(x)\cos(tx)-\frac{m_{1/2}(u\cos(t\cdot))}{m_{1/2}(\chi)}\chi(x)`,
        },
        {
          id: 'mean-square',
          tex: tex`\int_T^{2T}\lVert\mathcal D_b(t)\rVert_F^2dt\le C_\delta rTb,\qquad T=e^{2b}`,
        },
        {
          id: 'good-set',
          tex: tex`G_b=\{t\in[T,2T]:\lVert\operatorname{Re}_H\mathcal D_b(t)\rVert\le\tfrac12\log T\}`,
        },
      ],
      notes: [
        'The common carrier phase is retained; no independent random-prime phases are introduced.',
        'The unavailable broad annular audit is not replaced by this restricted precursor.',
      ],
    },
    {
      id: 'coherent-assembly',
      title: 'Pay every off-diagonal carrier interaction',
      body:
        'Smooth packet separation gives rapid decay in the carrier difference for the Gram, gamma, and translated prime overlaps. ' +
        'A maximal separated subset converts that decay into a uniform block row-sum bound, so positivity holds for arbitrary complex combinations across all chosen carriers.',
      equations: [
        {
          id: 'cross-block-decay',
          tex: tex`F_b=A-X_b,\qquad |F_b[N_tu,N_sv]|\le C_K(\log T+M_b)\big[(1+|t-s|)^{-K}+T^{-K}\big]\lVert u\rVert\lVert v\rVert`,
        },
        {
          id: 'packing',
          tex: tex`\frac{T}{4L}\le m\le\frac TL+1,\qquad \sup_j\sum_{k\ne j}(1+|t_j-t_k|)^{-K}\le2\zeta(K)L^{-K}`,
        },
        {
          id: 'row-sum-budget',
          tex: tex`\mathcal E_b\le C_K(\log T+M_b)\big[2\zeta(K)L^{-K}+mT^{-K}\big]=o(1)`,
        },
      ],
      notes: ['Absolute values are used only after carrier oscillation supplies off-diagonal decay; the diagonal arithmetic cancellation is not discarded.'],
    },
    {
      id: 'physical-head-transfer',
      title: 'Project away the accepted finite physical head',
      body:
        'The sharp joint operator correction is applied once to the total coherent vector. ' +
        'This preserves dimension by positivity and injectivity even though projection may destroy the neutral moment condition.',
      equations: [
        {
          id: 'joint-projection-correction',
          tex: tex`\lVert P_\ell H_\ell+H_\ell P_\ell-P_\ell H_\ell P_\ell\rVert\le\frac2{\sqrt3}\eta_\ell,\qquad \eta_\ell=O(\ell^{-2})`,
        },
      ],
      notes: ['The immediate action theorem and audit are bundled; the full transitive domain/Gram/action tree is not.'],
    },
    {
      id: 'curvature-and-screw-kernel',
      title: 'Keep curvature weights and Suzuki normalization exact',
      body:
        'The arithmetic curvature measure packages prime atoms and the continuous main term, but the physical form weights it by oscillatory correlations. ' +
        'For smooth compactly supported tests, Suzuki’s published screw-kernel identity supplies the exact polarization; it does not make those weights positive.',
      equations: [
        {
          id: 'curvature-measure',
          tex: tex`d\nu(r)=\sum_{n\ge2}\frac{\Lambda(n)}{\sqrt n}\delta_{\log n}(dr)-e^{r/2}dr,\qquad K_g\,dA_g=d\nu(r)\,d\theta`,
        },
        {
          id: 'screw-kernel',
          tex: tex`K_\Psi(x,y)=\Psi(x)+\Psi(y)-\Psi(x-y),\qquad q(f,g)=\iint K_\Psi(x,y)\overline{f'(x)}g'(y)\,dx\,dy`,
        },
      ],
      notes: ['Separating the distributional origin terms would change the operator.'],
    },
    {
      id: 'two-and-three-channel-tests',
      title: 'Resolve two channels and expose the triangle phase',
      body: tex`Centered boxes give exact two-channel entries; the displayed two-channel criterion applies once both signed diagonals are nonnegative. For strictly positive diagonals, a normalized three-channel Hermitian matrix is positive exactly when its pairwise conditions $r_{ij}\le1$ and phase-sensitive determinant pass. The product phase is gauge invariant, but no identity with geometric holonomy is established.`,
      equations: [
        {
          id: 'two-channel-criterion',
          tex: tex`\big[\Psi(a+b)-\Psi(|a-b|)\big]^2\le\Psi(2a)\Psi(2b)`,
        },
        {
          id: 'positive-floor-test',
          tex: tex`Z-\mu G\succeq0`,
          explanation: 'A claimed physical floor must be tested against the true Gram, not against the signed matrix alone.',
        },
      ],
      notes: ['Every triangle can pass while a four-channel collective mode is negative.'],
    },
  ],

  verification: {
    result:
      'Independent internal reviews accept the restricted analytic theorem, exact identities, and stated countermodels. ' +
      'Publication hashes and lightweight synthetic replays bind the app to those reviewed bytes; they do not replace proof review.',
    scope:
      'The sparse-span producer, paired-packet identity, triangle/channel analysis, restricted annular precursor, and immediate physical-head action theorem are bundled with internal audits. ' +
      'The broad annular audit and the full transitive action proof tree are explicitly unavailable in this slice.',
    reproducibilityStatus: 'partial',
    commands: [
      {
        label: 'Verify the focused channel-geometry publication package',
        command: 'npm run audit:rh-channel-geometry',
        cwd: '.',
        expected: 'The source commit, tree, provenance manifest, canonical body, and every curated source hash match.',
      },
      {
        label: 'Replay both synthetic algebra checkers in disposable copies',
        command: 'node scripts/verify-rh-channel-geometry-publication.mjs --replay',
        cwd: '.',
        expected: 'Both disposable outputs are byte-identical to their checked-in JSON receipts; the frozen source tree is unchanged.',
      },
    ],
    artifacts: [
      {
        label: 'Canonical channel-geometry module body',
        path: 'research/rh/modules/channel-geometry.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: 'bcda63ebc745d6363fc1ac407312035af011af25acc61404923a60147ae592f8',
        sizeBytes: 17040,
      },
      {
        label: 'Curated source provenance manifest',
        path: 'research/rh/channel-geometry/SOURCE_PROVENANCE.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: 'c8e5c20e32ee513aec009c1958316fa8aa9eb15bcda686f2c70543c393579b69',
        sizeBytes: 14195,
      },
      {
        label: 'Analytic dependency boundary',
        path: 'research/rh/channel-geometry/ANALYTIC_DEPENDENCIES.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: '75a439c6a2e1353a9554387cc14aa41e45a59331f52924480476cd2deafecffe',
        sizeBytes: 4572,
      },
      {
        label: 'Independent sparse-span audit',
        path: 'research/rh/channel-geometry/source-tree/rh_attack_cycle_20261030/superwire_channel_attack/SPARSE_CARRIER_SPAN_INDEPENDENT_AUDIT.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: 'f406d4f5c4d7088732dc717cfaaf0f067846bd42a86dd5655abc44922b19466a',
        sizeBytes: 11355,
      },
      {
        label: 'Independent triangle/channel audit',
        path: 'research/rh/channel-geometry/source-tree/rh_attack_cycle_20261030/triangle_channel_bridge/INDEPENDENT_AUDIT.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: '1940059dde9db0c605b41536d8d98932e9cf93879cfeb8659a875ec5faaf77e0',
        sizeBytes: 5878,
      },
      {
        label: 'Synthetic replay record',
        path: 'research/rh/channel-geometry/qa/SYNTHETIC_REPLAY.json',
        requiredForClaim: false,
        availability: 'available',
        sha256: '91ba99b873d5c41a036f5e6ffe56e91d4049e765f3a91f03623a6bd9ea864804',
        sizeBytes: 664,
      },
    ],
    replays: [
      {
        label: 'Independent restricted theorem review',
        method:
          'Separate audits checked the exact paired cancellation, fixed-envelope annular precursor, coherent row-sum assembly, physical projection boundary, and triangle algebra.',
        outcome:
          'Accepted within the restricted fixed-envelope sparse-span scope; the broad annular and complete complement claims remain unavailable or open.',
        evidence: [
          'research/rh/channel-geometry/source-tree/rh_attack_cycle_20261030/superwire_channel_attack/SPARSE_CARRIER_SPAN_INDEPENDENT_AUDIT.md',
          'research/rh/channel-geometry/source-tree/rh_attack_cycle_20261030/triangle_channel_bridge/INDEPENDENT_AUDIT.md',
          'research/rh/channel-geometry/qa/INTEGRATION_BODY_AUDIT.md',
        ],
      },
      {
        label: 'Byte-identical synthetic algebra replay',
        method:
          'Both deterministic Python checkers were run against disposable output and compared with their checked-in JSON receipts.',
        outcome:
          'Both synthetic receipts reproduced byte-identically; neither replay evaluates actual prime data or certifies an actual Weil vector.',
        evidence: ['research/rh/channel-geometry/qa/SYNTHETIC_REPLAY.json'],
      },
    ],
    evidence: [
      {
        label: 'Source-to-publication provenance',
        kind: 'provenance manifest',
        location: 'research/rh/channel-geometry/SOURCE_PROVENANCE.json',
      },
      {
        label: 'Scoped integration-body review',
        kind: 'internal mathematical review',
        location: 'research/rh/channel-geometry/qa/INTEGRATION_BODY_AUDIT.md',
      },
      {
        label: 'Montgomery–Vaughan mean-value theorem',
        kind: 'primary reference',
        location: 'Corollary 3, equation (1.11)',
        href: 'https://personal.science.psu.edu/rcv4/personal/Publications/s2-8-1-73.pdf',
        note: 'Used as a published standard input, not claimed as a new result.',
      },
      {
        label: 'Suzuki screw-function theory',
        kind: 'primary reference',
        location: 'arXiv:2206.03682',
        href: 'https://arxiv.org/abs/2206.03682',
        note: 'The screw-kernel identities and RH equivalences are attributed published inputs; their global hypotheses are not proved here.',
      },
    ],
  },

  blockers: [
    {
      id: 'all-channel-schur-bound',
      title: 'Control the omitted coherent channel block',
      statement:
        tex`Prove $E-B^*D^{-1}B\ge0$ for the actual physical-complement decomposition with the true form domain, Gram normalization, inverse hypotheses, and signed arithmetic tails intact.`,
      physicsAnalogy:
        'The selected carriers are stable resonant cavities, but the untested modes share a coupling bus. ' +
        'Measuring each cavity or each triangle cannot rule out a collective instability carried by the full bus.',
      nextTest:
        'Seek a signed arithmetic covariance or scale-by-scale Schur estimate that preserves complex phase and controls exceptional, neighboring, and low-frequency channels together.',
    },
    {
      id: 'cofinal-coverage',
      title: 'Upgrade a sparse span to no-escape complement coverage',
      statement:
        'Construct a nested or otherwise cofinal family whose controlled directions exhaust the physical complement without losing a uniform lower bound.',
      physicsAnalogy:
        'A crystal can support many clean conduction lanes while still hiding a defect band between them. ' +
        'The sparse theorem builds more lanes; it does not yet close every gap in momentum space.',
      nextTest:
        'Quantify the neighboring-carrier gaps and exceptional-set leakage in a common physical Gram, then test whether a cancellation-aware block decomposition can absorb them.',
    },
  ],

  provenance: {
    sourceRefs: [
      {
        repository: 'judegomila/mathexplorer',
        branch: SOURCE_BRANCH,
        commit: SOURCE_COMMIT,
        access: 'private-repository',
        paths: [
          'research/rh/modules/channel-geometry.md',
          'research/rh/channel-geometry/SOURCE_PROVENANCE.json',
          'research/rh/channel-geometry/ANALYTIC_DEPENDENCIES.md',
          'research/rh/channel-geometry/qa/INTEGRATION_BODY_AUDIT.md',
          'research/rh/channel-geometry/qa/SYNTHETIC_REPLAY.json',
          'research/rh/channel-geometry/source-tree/rh_attack_cycle_20261030/superwire_channel_attack/SPARSE_CARRIER_SPAN_INDEPENDENT_AUDIT.md',
          'research/rh/channel-geometry/source-tree/rh_attack_cycle_20261030/triangle_channel_bridge/INDEPENDENT_AUDIT.md',
        ],
        note:
          `Private-repository access is required. The source-only commit is additions-only from parent ${SOURCE_PARENT}; ` +
          `its exact tree is ${SOURCE_TREE}.`,
      },
    ],
    sourceManifestPath: 'research/rh/channel-geometry/SOURCE_PROVENANCE.json',
    curatorNote:
      'The source slice records original and curated hashes plus privacy-only transformations. ' +
      'Hash identity establishes provenance, not mathematical truth. Internal acceptance is neither external peer review nor formal verification.',
  },

  failures: [
    {
      id: 'intensity-without-phase',
      title: 'Entrywise intensity discards the decisive phase',
      surrogate:
        'Replace coherent bridge amplitudes by their entrywise absolute squares and infer the sign of the Schur complement from those intensities.',
      failureStage:
        tex`Two bridge matrices with identical entrywise intensities have Gram top eigenvalues $4/3$ and $2/3$, so $I-B^*B$ has different signs.`,
      implication:
        'A valid channel bound must retain complex amplitude covariance or an equivalent phase-sensitive invariant.',
      nonImplications: [
        'This synthetic model is not a negative actual Weil vector.',
        'It does not prove that every intensity-based auxiliary estimate is useless.',
        'It does not alter the proved sparse-span theorem.',
      ],
      evidence: [
        {
          label: 'Exact channel algebra checks',
          kind: 'synthetic countermodel',
          location: 'research/rh/channel-geometry/source-tree/rh_attack_cycle_20261030/superwire_channel_attack/CHANNEL_ALGEBRA_EXACT_CHECKS.json',
        },
      ],
    },
    {
      id: 'lossless-implies-contraction',
      title: 'Lossless evolution does not make the channel map contractive',
      surrogate:
        'Use unitarity of a larger block evolution, or a Julia/Halmos dilation, to infer that the internal coupling has norm at most one.',
      failureStage:
        tex`The block Hamiltonian $\left(\begin{smallmatrix}0&C\\C^*&0\end{smallmatrix}\right)$ generates unitary evolution for arbitrary finite $C$, including $\lVert C\rVert>1$; the usual dilation already assumes contraction.`,
      implication:
        'Contraction must come from an independent signed estimate, not from losslessness alone.',
      nonImplications: [
        'It does not show that the actual channel coupling is expansive.',
        'It does not refute unitary dilation theory under its hypotheses.',
        'It does not affect the separated-carrier row-sum proof.',
      ],
      evidence: [
        {
          label: 'Channel shortcut audit',
          kind: 'exact finite-dimensional counterexample',
          location: 'research/rh/modules/channel-geometry.md',
        },
      ],
    },
    {
      id: 'positive-scalar-implies-kernel',
      title: 'A positive scalar function need not define a positive channel kernel',
      surrogate:
        tex`Treat $F(t)\ge0$ as sufficient for positivity of $K_F(x,y)=F(x)+F(y)-F(x-y)$.`,
      failureStage:
        tex`For $F(t)=t^4$, the two-channel determinant equals $-192$.`,
      implication:
        'Kernel positivity needs its own conditional-negative-type or arithmetic argument.',
      nonImplications: [
        'This generic example does not refute Suzuki’s special arithmetic theorem.',
        'It does not establish negativity of the actual Suzuki kernel.',
        'It does not disprove scalar nonnegativity of the arithmetic screw function.',
      ],
      evidence: [
        {
          label: 'Triangle/channel source and audit',
          kind: 'exact counterexample',
          location: 'research/rh/channel-geometry/source-tree/rh_attack_cycle_20261030/triangle_channel_bridge/TRIANGLE_TO_SIGNED_CHANNEL_TEST.md',
        },
      ],
    },
    {
      id: 'gauss-bonnet-controls-energy',
      title: 'Triangle-angle cancellation does not control the weighted form',
      surrogate:
        'Transfer an unweighted Gauss–Bonnet curvature cancellation directly to the correlation-weighted channel energy.',
      failureStage:
        'The actual form carries oscillatory correlation weights, and the sloping edge of the proposed coordinate triangle is not geodesic; its geodesic-curvature term cancels the interior contribution.',
      implication:
        'A geometric route must reproduce the actual weights and boundary terms rather than use unweighted total curvature.',
      nonImplications: [
        'It does not rule out every geometric formulation of the signed form.',
        'It does not refute the exact arithmetic curvature identity.',
        'It does not identify triangle phase with holonomy.',
      ],
      evidence: [
        {
          label: 'Arithmetic curvature audit',
          kind: 'geometric obstruction analysis',
          location: 'research/rh/channel-geometry/source-tree/rh_attack_cycle_20261030/curvature_bulk/ARITHMETIC_CURVATURE_AUDIT.md',
        },
      ],
    },
    {
      id: 'triangle-tests-suffice',
      title: 'Every three-channel test can pass while four channels fail',
      surrogate:
        'Infer positivity of the complete channel matrix from positivity of every one-, two-, and three-channel principal block.',
      failureStage:
        tex`The four-channel matrix with diagonal $1$ and off-diagonal $-2/5$ has positive triple eigenvalues but full eigenvalue $-1/5$ and Schur remainder $-7/5$.`,
      implication:
        'Triangle tests are exact diagnostics but do not close the collective all-channel Schur bound.',
      nonImplications: [
        'The abstract matrix is not a negative actual Weil vector.',
        'It is not a counterexample to RH.',
        'It does not show that the actual four-channel matrix fails.',
        'It does not reduce the value of the exact triangle phase formula.',
      ],
      evidence: [
        {
          label: 'Exact triangle algebra checks',
          kind: 'synthetic four-channel countermodel',
          location: 'research/rh/channel-geometry/source-tree/rh_attack_cycle_20261030/triangle_channel_bridge/EXACT_ALGEBRA_CHECKS.json',
        },
      ],
    },
    {
      id: 'absolute-transport-budget',
      title: 'Absolute optimal transport has a divergent budget',
      surrogate:
        'Bound the signed prime excess by an absolute transport distance to the continuum reference and charge it to logarithmic gamma energy.',
      failureStage:
        tex`For the actual annular atom count and mass, every such coupling obeys $M_b\tau_b\ge c_\delta e^b/(b+1)$ eventually.`,
      implication:
        'An absolute-value transport majorant cannot close the required signed lower bound; phase covariance must be retained.',
      nonImplications: [
        'The divergent estimate is not a lower bound on the true signed Rayleigh quotient.',
        'It does not prove an actual negative physical direction.',
        'It does not refute cancellation-aware transport or covariance identities.',
      ],
      evidence: [
        {
          label: 'Neutral transport analysis and audit',
          kind: 'failed analytic majorant',
          location: 'research/rh/channel-geometry/source-tree/rh_attack_cycle_20261030/neutral_transport_bound_attempt/TWO_NEUTRAL_PRIME_EXCESS_ROUTES.md',
        },
      ],
    },
    {
      id: 'variation-to-gamma-energy',
      title: 'Variation cannot be uniformly charged to logarithmic gamma energy',
      surrogate:
        tex`Seek a uniform estimate that absorbs the correlation variation $\lVert R_\psi'\rVert_1$ into the logarithmic gamma energy.`,
      failureStage:
        tex`A smooth exact-neutral modulated family has variation of order $t$ while its gamma energy is only of order $\log t$.`,
      implication:
        'This uniform variation route cannot control the signed prime excess on high carriers.',
      nonImplications: [
        'It does not prove the signed prime excess is large on that family.',
        'It does not refute the coherent sparse-span estimate.',
        'It does not rule out a phase-sensitive frequency-local estimate.',
      ],
      evidence: [
        {
          label: 'Neutral transport independent audit',
          kind: 'exact-neutral counterfamily',
          location: 'research/rh/channel-geometry/source-tree/rh_attack_cycle_20261030/neutral_transport_bound_attempt/NEUTRAL_TRANSPORT_INDEPENDENT_AUDIT.md',
        },
      ],
    },
  ],

  references: [
    'H. L. Montgomery and R. C. Vaughan, Hilbert’s inequality, Journal of the London Mathematical Society (1974), Corollary 3.',
    'M. Suzuki, Aspects of the screw function corresponding to the Riemann zeta-function, Journal of the London Mathematical Society 108 (2023).',
    'Anton M. Graf, Ke Lin, MyeongSeo Kim, Joonas Keski-Rahkonen, Alvar Daza, and Eric J. Heller, Chaos-Assisted Dynamical Tunneling in Flat Band Superwires, Entropy 26(6), 492 (2024), DOI: 10.3390/e26060492, arXiv:2404.19074, https://pmc.ncbi.nlm.nih.gov/articles/PMC11203167/. Used only as physical motivation for retaining coherent channel amplitudes.',
  ],
});

export const CHANNEL_GEOMETRY_ASSERTIONS = Object.freeze([
  {
    name: 'channel geometry cites the verified flat-band superwire primary source',
    holds: () => CHANNEL_GEOMETRY.references.some((reference) =>
      reference.includes('Chaos-Assisted Dynamical Tunneling in Flat Band Superwires') &&
      reference.includes('arXiv:2404.19074') &&
      reference.includes('https://pmc.ncbi.nlm.nih.gov/articles/PMC11203167/')) &&
      !CHANNEL_GEOMETRY.references.some((reference) =>
        reference.includes('Interacting electrons in topological superwires')),
  },
  {
    name: 'channel geometry is an internally reviewed analytic theorem with RH open',
    holds: () => CHANNEL_GEOMETRY.status === 'proved-analytic' &&
      CHANNEL_GEOMETRY.reviewStatus === 'accepted' &&
      CHANNEL_GEOMETRY.reviewScope === 'internal' &&
      CHANNEL_GEOMETRY.rhStatus === 'open',
  },
  {
    name: 'channel geometry pins the exact source commit and canonical body',
    holds: () => CHANNEL_GEOMETRY.provenance.sourceRefs.length === 1 &&
      CHANNEL_GEOMETRY.provenance.sourceRefs[0].branch === SOURCE_BRANCH &&
      CHANNEL_GEOMETRY.provenance.sourceRefs[0].commit === SOURCE_COMMIT &&
      SOURCE_TREE === 'dc967ce1539d1fb067ee772b3ec453e159ef8162' &&
      SOURCE_PARENT === '942ba1760c4ef54a519750ab91c37a661c31e0ce' &&
      CHANNEL_GEOMETRY.provenance.sourceRefs[0].note.includes(SOURCE_TREE) &&
      CHANNEL_GEOMETRY.provenance.sourceRefs[0].note.includes(SOURCE_PARENT) &&
      CHANNEL_GEOMETRY.verification.artifacts.some((artifact) =>
        artifact.path === 'research/rh/modules/channel-geometry.md' &&
        artifact.sha256 === 'bcda63ebc745d6363fc1ac407312035af011af25acc61404923a60147ae592f8'),
  },
  {
    name: 'channel geometry keeps the fixed-envelope T equals X scope explicit',
    holds: () => CHANNEL_GEOMETRY.theorem.hypotheses.some((hypothesis) =>
      hypothesis.includes('T=X=e^{2b}')) &&
      CHANNEL_GEOMETRY.claimBoundary.doesNotClaim.some((claim) =>
        /general-carrier-height|general carrier-height/.test(claim)),
  },
  {
    name: 'channel geometry renders the load-bearing coherent span bounds',
    holds: () => CHANNEL_GEOMETRY.theorem.equations.some((equation) =>
      equation.id === 'coherent-sparse-span' &&
      equation.tex.includes('\\frac14S') &&
      equation.tex.includes('\\frac1{16}\\log T')) &&
      CHANNEL_GEOMETRY.theorem.equations.some((equation) =>
        equation.id === 'physical-projection-transfer' && equation.tex.includes('\\frac1{32}\\log T')),
  },
  {
    name: 'channel geometry exposes rather than resolves the all-channel Schur blocker',
    holds: () => CHANNEL_GEOMETRY.theorem.equations.some((equation) =>
      equation.id === 'remaining-schur-obligation' &&
      equation.tex.includes('E-B^*D^{-1}B\\ge0') &&
      /not a conclusion/.test(equation.explanation)) &&
      CHANNEL_GEOMETRY.blockers.some((blocker) => blocker.id === 'all-channel-schur-bound'),
  },
  {
    name: 'channel geometry keeps analytic availability partial',
    holds: () => CHANNEL_GEOMETRY.verification.reproducibilityStatus === 'partial' &&
      /full transitive action proof tree/.test(CHANNEL_GEOMETRY.verification.scope) &&
      CHANNEL_GEOMETRY.claimBoundary.doesNotClaim.some((claim) => /broad annular final audit/.test(claim)),
  },
  {
    name: 'channel geometry records all seven failed shortcuts',
    holds: () => CHANNEL_GEOMETRY.failures.length === 7 &&
      [
        'intensity-without-phase',
        'lossless-implies-contraction',
        'positive-scalar-implies-kernel',
        'gauss-bonnet-controls-energy',
        'triangle-tests-suffice',
        'absolute-transport-budget',
        'variation-to-gamma-energy',
      ].every((id) => CHANNEL_GEOMETRY.failures.some((failure) => failure.id === id)),
  },
  {
    name: 'channel geometry does not promote synthetic failures to actual negativity',
    holds: () => CHANNEL_GEOMETRY.failures
      .filter((failure) => ['intensity-without-phase', 'triangle-tests-suffice'].includes(failure.id))
      .every((failure) => failure.nonImplications.some((item) => /not a negative actual Weil vector|does not show that the actual/.test(item))),
  },
  {
    name: 'channel geometry keeps the separate finite endpoint unchanged',
    holds: () => CHANNEL_GEOMETRY.claimBoundary.doesNotClaim.some((claim) =>
      claim.includes('\\lambda\\le\\sqrt{33/2}') && /does not extend or re-certify/i.test(claim)),
  },
]);
