import { createResearchModule } from './module-contract.js';

const tex = String.raw;
const SOURCE_COMMIT = '949a81bc614bb7ad1497c95088b62e61123833cd';
const BODY_SHA256 = 'd7c63dd2357431c8731cd45b28e2ae2aa71b969f4a04f811882d8a045288593d';

export const HISTORICAL_ROUTES = createResearchModule({
  schemaVersion: 1,
  id: 'historical-routes',
  route: '/rh-historical-routes',
  title: 'RH route atlas: results, obstructions, and failed surrogates',
  updatedAt: '2026-10-30',
  status: 'open',
  reviewStatus: 'accepted',
  reviewScope: 'internal',
  rhStatus: 'open',
  summary:
    'A mixed-status ledger of shifted bridges, information geometry, synchronization, heat collisions, finite theta boxes, discrete curvature, Hankel windows, arithmetic duals, Möbius reductions, gamma bulk, and Newman’s heat threshold. It keeps proved identities, conditional reductions, finite certificates, unavailable historical evidence, and failed surrogates visibly separate.',
  bodyPath: 'research/rh/modules/historical-routes.md',

  claimBoundary: {
    title: 'Eleven research routes, not one combined theorem',
    statement:
      'Every route below retains its own quantifiers, evidence state, and open condition. The atlas preserves useful negative results and historical certificates without composing them into a proof of RH or a new global zero-free theorem.',
    doesNotClaim: [
      'It does not prove RH, novelty, external peer review, or any new unconditional global zero-free region.',
      'It does not treat a failed sufficient lower bound as a negative direction of the actual Weil form.',
      'It does not treat a counterexample to an auxiliary heat, fluid, network, periodic-envelope, or curvature model as a counterexample to RH.',
      'It does not treat PRs 14–19 as merged dependencies; they are pinned, private-repository review sources.',
      'It does not claim to recover or freshly replay the unavailable approximately 1.1 GB PR 15 arithmetic certificate bundle.',
      'It does not extend PR 17 beyond real $|x|\le13$, $0\le\tau\le1/2$, or PR 18 beyond the bounded real box $[0,1/2]\times[200,220]$.',
      'It does not present a numerical spectral-support $\lambda$, Newman $\Lambda$, von Mangoldt $\Lambda(n)$, and the Möbius boundary $B$ as interchangeable quantities.',
      'It does not assert that the inspected delivered V7, synchronization, discrete-refinement, or thin-window sources have a verified remote publication.',
    ],
  },

  theorem: {
    label: 'Status-preserving route ledger',
    statement:
      'The atlas records exact identities and scoped finite results together with their missing global quantifiers. Its mathematical content is the collection of route-specific statements below; the overall status remains open because none supplies the required all-scale signed arithmetic estimate, cofinal actual-form floor, or exhaustive theta collision certificate.',
    hypotheses: [
      'Each displayed result is read only under the hypotheses and evidence boundary named in its route; route statuses must not be composed without a separate theorem.',
      'Private commit links and PRs 14–19 identify unmerged review sources. Access to this private repository is required.',
      'A recorded certificate is replayable only when its complete code and load-bearing inputs remain available; hashes establish byte identity rather than mathematical correctness.',
      'The historical cutoff is the inspected V7 research state at 2026-10-30T08:00:00Z; later Suzuki and spectral packages are separate review units.',
    ],
    equations: [
      {
        id: 'completed-xi-coordinate',
        label: 'Completed-function coordinate',
        tex: tex`\xi(s)=\frac12s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s),\qquad X(w)=\xi\!\left(\frac12+w\right)`,
      },
      {
        id: 'shift-threshold',
        label: 'Correct strict shifted comparison',
        tex: tex`|X(w-a)|<|X(w+a)|\ \ (\Re w>0)\quad\Longleftrightarrow\quad a\ge\sup_{X(\rho)=0}|\Re\rho|\qquad(a>0)`,
        explanation: 'The endpoint is included. Positivity for every positive shift is RH-equivalent, not proved by the atlas.',
      },
      {
        id: 'theta-finite-boxes',
        label: 'Two different finite theta results',
        tex: tex`H_\tau(x)>0\ \ (|x|\le13,\ 0\le\tau\le\tfrac12),\qquad H_t(x)+iH_x(t,x)\ne0\ \ ((t,x)\in[0,\tfrac12]\times[200,220])`,
        explanation: 'The first is real-axis positivity; the second is two-component field nonvanishing on another bounded real box.',
      },
      {
        id: 'historical-fixed-support',
        label: 'Recorded, presently unreplayable fixed-support certificate',
        tex: tex`Q_{6/5}\ge10^{-55}I`,
        explanation: 'This is a historical recorded full-domain result. Its approximately 1.1 GB replay bundle is unavailable.',
      },
      {
        id: 'conditional-mobius-boundary',
        label: 'PR 14 exact parameter inside a conditional analytic system',
        tex: tex`B=\frac{17497733}{20000000}=0.87488665`,
        explanation: 'The rational admissibility check is exact; the zero-free implication still imports analytic estimates and a closure lemma.',
      },
      {
        id: 'newman-coordinate',
        label: 'Newman heat threshold',
        tex: tex`\mathrm{RH}\Longleftrightarrow\Lambda\le0,\qquad \Lambda\ge0\ \text{(Rodgers--Tao)}`,
        explanation: 'Thus RH would give Newman Λ=0. This Λ is not support scale λ, von Mangoldt Λ(n), or boundary B.',
      },
    ],
  },

  derivation: [
    {
      id: 'twin-ladder',
      title: 'Twin ladder and the shifted bridge — conditional reduction',
      body:
        'The completed shift quotient and its de Branges kernel survive with endpoint and common-zero conventions intact. A zero packet gives an exact strict-threshold identity, but critical-line unimodularity, finite passive products, and an $X$-weighted contraction do not locate every zero. The hidden-square diagonal also has two-dimensional Lebesgue measure zero, so its positive one-dimensional integral is not automatically a channel of the original double integral.',
      equations: [
        {
          id: 'zero-packet',
          tex: tex`|Q_{\delta,\gamma}(w+a)|^2-|Q_{\delta,\gamma}(w-a)|^2=8a\Re(w)\bigl((\Re w)^2+(\Im w-\gamma)^2+a^2-\delta^2\bigr)`,
        },
      ],
      notes: [
        'Open: prove positivity of the actual completed kernel for every positive shift, with cancellations and tails intact.',
      ],
    },
    {
      id: 'information-criticality',
      title: 'Information geometry and critical tuning — identities plus no-go tests',
      body:
        'For the Gaussian two-rail Ornstein–Uhlenbeck model, the prefactor-one entropy decay rate is exactly $2\min(\sigma,1-\sigma)$ and balance is optimal. For the actual xi exponential family, the central member minimizes KL divergence. Neither statement controls complex cancellation. Finite independent prime ladders instead approach a Gaussian midpoint statistic; the proposed positive quadratic reweighting is already nonnormalizable, and a stabilized quartic law is not the theta density.',
      equations: [
        {
          id: 'sharp-entropy-rate',
          tex: tex`\mathrm{KL}(\nu_t\Vert\mu)\le e^{-2\min(\sigma,1-\sigma)t}\mathrm{KL}(\nu_0\Vert\mu)`,
        },
        {
          id: 'xi-kl-derivative',
          tex: tex`K(a)=\log\frac{X(a)}{X(0)},\qquad \frac d{da}\mathrm{KL}(\mu_a\Vert\mu_0)=aK''(a)`,
        },
      ],
      notes: [
        'Open: an exact comparison between the probability models and the actual signed arithmetic form.',
      ],
    },
    {
      id: 'synchronization',
      title: 'Synchronization and stochastic correspondences — conditional model',
      body:
        'A domain-correct infinite ladder with $K\ge\kappa I$ synchronizes exponentially, while the conservative bridge preserves difference energy. A separate finite Ornstein–Uhlenbeck construction exactly matches the Cauchy-phase mean and covariance, not its law or higher cumulants. Stable finite eigenvalue plots cannot control an infinite approximate spectrum, and chosen toy damping does not establish the signed arithmetic gain bound.',
      equations: [
        {
          id: 'difference-energy',
          tex: tex`\dot E_d=-2\langle d,Kd\rangle,\qquad K\ge\kappa I\Longrightarrow E_d(t)\le e^{-4\kappa t}E_d(0)`,
        },
        {
          id: 'signed-gain-target',
          tex: tex`G_L(\varepsilon)=\sup_{f\ne0}\frac{C_L[f]}{B_L[f]+\varepsilon\|f\|^2},\qquad G_L(\varepsilon)\le1\Longleftrightarrow Q_L\ge-\varepsilon I`,
        },
      ],
      notes: [
        'Open: realize the actual arithmetic coefficients and prove the gain bound for every support and arbitrarily small positive ε.',
      ],
    },
    {
      id: 'vortex-collision',
      title: 'Vortices, heat collisions, and winding — exact local theory, global gap',
      body:
        'The determinant evolution identity and the local collision index are exact. Reversing time gives the wrong sign for a forward positivity maximum principle, and an explicit heat polynomial exhibits a collision. A conditional adjacent-gap inequality works only when its trajectory lower bound is independently validated. On a bounded region, boundary winding equals the sum of collision indices; nonvanishing alone is not zero winding.',
      equations: [
        {
          id: 'determinant-evolution',
          tex: tex`(\partial_\tau+\partial_x^2)(H_x^2-HH_{xx})=2(H_{xx}^2-H_xH_{xxx})`,
        },
        {
          id: 'local-collision-index',
          tex: tex`\operatorname{ind}(h,h_x)=-\left\lfloor\frac m2\right\rfloor`,
        },
      ],
      notes: [
        'Open: exhaustive zero-winding boundary certificates, an all-real anchor, slabwise complex-zero confinement, and passage to time zero.',
      ],
    },
    {
      id: 'theta-finite',
      title: 'PR 17 and PR 18 — two finite, genuine theta certificates',
      body:
        'PR 17 uses moment monotonicity, both infinite tails, and Arb enclosures to prove real-axis positivity only on $|x|\le13$, $0\le\tau\le1/2$. PR 18 separately proves $H+iH_x$ nonzero with zero boundary winding on $[0,1/2]\times[200,220]$, including the complete time-zero edge. Neither result is a complex disk, an all-height result, or a statement that $H$ itself is nonzero on the second box.',
      equations: [
        {
          id: 'moment-monotonicity',
          tex: tex`\frac d{d\tau}\frac{M_2}{M_0}=\operatorname{Var}_\tau(u^2)\ge0`,
        },
      ],
      notes: [
        'Saved endpoint geometry passed fresh 384- and 512-bit checks; the actual-function generator was not rerun during this curation.',
      ],
    },
    {
      id: 'discrete-curvature',
      title: 'Discrete curvature and finite-prime rigidity — exact finite structure',
      body:
        'The interval-cell compression is an exact Toeplitz matrix and dyadic refinement preserves step-function energies. Any nonzero finite perturbation of strictly positive arithmetic delays eventually creates a negative finite matrix, under the stated no-zero-delay-compensation hypothesis. This rigidity theorem concerns a modified arithmetic model, not the true coefficients. Twelve saved finite perturbation brackets passed exact-rational checks; their coefficient generator was not rerun.',
      equations: [
        {
          id: 'toeplitz-compression',
          tex: tex`H_{h,m}=(q_{|i-j|}),\qquad q_d=\frac{\Psi((d+1)h)-2\Psi(dh)+\Psi((d-1)h)}h`,
        },
        {
          id: 'finite-threshold',
          tex: tex`0.000010685379<\varepsilon_*<0.000010685380\qquad(k=4,\ m=256)`,
        },
      ],
      notes: [
        'Open: an all-scale estimate for the true signed Schur residual.',
        'The latest delivered refinement has no verified remote publication link in this audit.',
      ],
    },
    {
      id: 'twistor-thin',
      title: 'Split twistor and thin Hankel continuation — finite signed windows',
      body:
        'The wide bridge is a right-half-plane contraction, but its constant angular mode leaves the scalar arithmetic ratio as the full norm obstruction. Signed certificates prove finite-window contractions for $H_{1/4,L}$ through $L\le8/5$. Absolute-kernel norms already fail at the first window and diverge across all windows; the cancellation-aware all-window condition remains tied to unproved matching of possible xi zeros.',
      equations: [
        {
          id: 'thin-hankel-bounds',
          tex: tex`\|H_{1/4,L}\|\le\frac{49999}{50000}\ (1<L\le\tfrac32),\qquad \|H_{1/4,L}\|\le\frac{1999999}{2000000}\ (1<L\le\tfrac85)`,
        },
      ],
      notes: [
        'These certify $I\pm H>0$, not positivity of the signed Hankel operator.',
        'The delivered extension was inspected but not freshly rerun or verified as published in the older twistor tree.',
      ],
    },
    {
      id: 'arithmetic-duals',
      title: 'Arithmetic positivity and null-symbol duals — historical certificate, missing replay',
      body:
        'PR 15 records a full-domain fixed-support lower bound with an analytic high complement. The complete frozen input package is unavailable, so the result remains historical rather than a current replay. The exact null-symbol dual is complete but not an effective all-support construction. A negative periodic relaxation or a negative redistributed-mass comparison is not an admissible negative Weil vector. PR 6 remains P0_INVALIDATED.',
      equations: [
        {
          id: 'fixed-support-dual',
          tex: tex`\inf_{\|f\|=1}Q_L[f]=\sup_{\text{finite }W}\inf_t\bigl(V_L(t)+W(t)\bigr),\qquad W(t)=\sum_jc_j\cos(a_jt),\ a_j>2L`,
        },
      ],
      notes: [
        'The approximately 1.1 GB PR 15 replay package is unavailable; repository metadata and small synthetic checks cannot reconstruct it.',
        'The $L=5/4$ negative lower surrogate does not establish actual operator negativity.',
      ],
    },
    {
      id: 'mobius-zero-free',
      title: 'Möbius energy and the 7/8 boundary — conditional imported bridge',
      body:
        'The pole-cancelling packet gives an exact Möbius-to-von-Mangoldt identity. The required all-scale signed energy estimate remains open. PR 14 exactly verifies a rational parameter below $7/8$ inside a specified admissibility system, but the zero-free implication still depends on imported analytic estimates and a closure lemma that this package does not independently prove. The exact phase-filter Gram identity has a surviving eigenvalue one and therefore supplies no worst-case contraction.',
      equations: [
        {
          id: 'mobius-identity',
          tex: tex`\sum_{d\ge1}\frac{\mu(d)}{\sqrt d}F(L-\log d)=\sum_{n\ge2}\frac{\Lambda(n)}{\sqrt n}k(\log n-L)`,
        },
        {
          id: 'landau-floor-implication',
          tex: tex`\epsilon_0(\lambda)\ge-C(1+\log\lambda)^m\lambda^p,\ p<1\quad\Longrightarrow\quad \zeta(s)\ne0\ \text{for }\Re s>\frac{1+p}{2}`,
        },
      ],
      notes: [
        '$p=3/4$ would reach the $7/8$ boundary and $p=0$ would imply RH; neither improved global floor is proved.',
      ],
    },
    {
      id: 'curvature-bulk-suzuki',
      title: 'Curvature, gamma bulk, and the Suzuki reserve — exact encodings, open sign',
      body:
        'The cylinder curvature identity exactly encodes the signed arithmetic distribution, but the curvature is not positive and Gauss–Bonnet cancels the desired boundary quantity. A genuine positive auxiliary-field representation exists for the gamma symbol only; prime translation deltas leave a signed boundary defect. The direct absolute-transport comparison grows at least like $\lambda/\sqrt{\log\lambda}$ and cannot yield a uniform floor. The scalar Suzuki reserve has an exact convex update whose sign is not fixed by convexity.',
      equations: [
        {
          id: 'curvature-encoding',
          tex: tex`g=e^{-2D(r)}(dr^2+d\theta^2),\qquad K_g\,dA_g=d\nu\,d\theta`,
        },
        {
          id: 'scalar-reserve-update',
          tex: tex`M_{n+1}-M_n=\int_{S_n}^{S_n+w_{n+1}}[r_{n+1}-u(s)]\,ds`,
        },
      ],
      notes: [
        'The current scalar recurrence and finite-event certificates live in separate Suzuki modules and are not replayed by this atlas.',
        'A V7 statement about arbitrarily small scalar returns under RH remains attributed to that inspected historical source rather than asserted as a new replay here.',
      ],
    },
    {
      id: 'newman-distinction',
      title: 'Newman Λ — a separate global heat threshold',
      body:
        'Newman $\Lambda$ is the threshold for all zeros of the heat-deformed function to be real. Positive-time finite capture is compatible with the known lower bound $\Lambda\ge0$ and does not prove RH. The repository’s $0.1787854$ candidate and $0.1875$ package retain their historical unestablished and unrefereed labels; this atlas does not freshly audit external state of the art or certify either value.',
      equations: [],
      notes: [
        'Spectral-support λ, Newman Λ, von Mangoldt Λ(n), and Möbius boundary B are four different coordinates.',
      ],
    },
  ],

  verification: {
    result:
      'The publication manifest verifies all nine curated foundation/atlas files. Internal mathematical review accepted the route-specific equations and scope labels. Three fresh checks cover saved finite signs, saved theta geometry, and document bytes only; no complete arithmetic or theta generator replay was performed.',
    scope:
      'Source and editorial audit of an historical mixed-status ledger. Reproducibility is partial: some remote branch packages are available, the PR 15 large bundle is unavailable, and several delivered sources have no verified remote publication link.',
    reproducibilityStatus: 'partial',
    commands: [
      {
        label: 'Verify every curated foundation and atlas byte',
        command: 'shasum -a 256 -c research/rh/foundation/PUBLICATION_SHA256SUMS',
        cwd: 'repository root',
        expected: 'All nine listed bodies, manifests, source excerpts, scope note, and review report OK.',
      },
    ],
    artifacts: [
      {
        label: 'Canonical historical route atlas',
        path: 'research/rh/modules/historical-routes.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: BODY_SHA256,
        sizeBytes: 34686,
      },
      {
        label: 'Route-specific evidence map',
        path: 'research/rh/foundation/historical-evidence-map.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: 'f76e7aec5f3f8b4b0e2d1877afef5a001186cddc6e674651b86717ab098f3373',
        sizeBytes: 23625,
      },
      {
        label: 'Historical curation QA',
        path: 'research/rh/foundation/historical-qa.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: '4667aeef1f98ec4b7afc107eed93e7a36012b3fb06560213be4f742b05b6a1ff',
        sizeBytes: 1525,
      },
      {
        label: 'Foundation source provenance',
        path: 'research/rh/foundation/SOURCE_PROVENANCE.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: '4e9421943f4e30ec2eae75ae71235bf4f65132bc2277aa81196d2f304e2ab69c',
        sizeBytes: 3502,
      },
      {
        label: 'Internal V7 mathematical review',
        path: 'research/rh/foundation/v7-mathematical-review.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: 'c66e58910e1a2cc1be1cc100dd7912eefaa54970e2c2fc9b5abc1793ae6b302e',
        sizeBytes: 4070,
      },
      {
        label: 'Publication scope boundary',
        path: 'research/rh/PUBLICATION_SCOPE_2026-10-30.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: '240172f513d7c5815ff236830eb3fad760e64f1f72992edb0a6cffe107a2dd26',
        sizeBytes: 3799,
      },
      {
        label: 'PR 15 Q_6/5 full replay bundle (approximately 1.1 GB)',
        path: 'research/rh/foundation/unavailable/pr15-q-6-5-full-replay-bundle',
        requiredForClaim: true,
        availability: 'unavailable',
        note: 'Historical recorded certificate only. The load-bearing large bundle remains unavailable; hashes and small checks do not reconstruct it.',
      },
    ],
    replays: [
      {
        label: 'Curated-byte verification',
        method: 'Check the SHA-256 publication manifest for all nine available files.',
        outcome: 'All nine entries match the source-staging commit exactly.',
        command: 'shasum -a 256 -c research/rh/foundation/PUBLICATION_SHA256SUMS',
        evidence: ['research/rh/foundation/PUBLICATION_SHA256SUMS'],
      },
      {
        label: 'Narrow fresh-check ledger',
        method:
          'Read-only curation reran twelve saved discrete brackets, saved theta endpoint geometry at 384 and 512 bits, and the collision-document manifest.',
        outcome:
          'The saved finite signs, saved geometry, and document bytes pass. Arithmetic coefficient and actual theta-function generators were not rerun.',
        evidence: [
          'research/rh/foundation/historical-qa.json',
          'research/rh/foundation/historical-evidence-map.json',
        ],
      },
    ],
    evidence: [
      {
        label: 'Canonical route atlas',
        kind: 'mixed-status mathematical record',
        location: 'research/rh/modules/historical-routes.md',
      },
      {
        label: 'Per-route status and replay ledger',
        kind: 'evidence map',
        location: 'research/rh/foundation/historical-evidence-map.json',
      },
      {
        label: 'Source-to-publication map',
        kind: 'provenance',
        location: 'research/rh/foundation/SOURCE_PROVENANCE.json',
      },
      {
        label: 'Immutable foundation source commit',
        kind: 'private source',
        location: SOURCE_COMMIT,
        href: `https://github.com/judegomila/mathexplorer/tree/${SOURCE_COMMIT}`,
        note: 'Private repository access required. The historical PRs named in the atlas remain unmerged review units.',
      },
      {
        label: 'PR 14 conditional Möbius bridge source',
        kind: 'private unmerged review source',
        location: 'pull/14 at 05cfffbbd673105bada9d45df1666ef4bd770764',
        href: 'https://github.com/judegomila/mathexplorer/pull/14',
        note: 'Exact parameter checks are available; the analytic zero-free implication remains conditional on imported estimates.',
      },
      {
        label: 'PR 15 arithmetic/information ledger',
        kind: 'private unmerged historical source',
        location: 'pull/15 at acf2a2cedb42a6388b16e89dd277766effc1e3e8',
        href: 'https://github.com/judegomila/mathexplorer/pull/15',
        note: 'The approximately 1.1 GB fixed-support replay package remains unavailable.',
      },
      {
        label: 'PR 17 finite central theta certificate',
        kind: 'private unmerged finite certificate',
        location: 'pull/17 at 006ebb4fa6b96c8c36af66544c6d9a8bcedf3ae4',
        href: 'https://github.com/judegomila/mathexplorer/pull/17',
        note: 'Real-axis positivity on its finite box only.',
      },
      {
        label: 'PR 18 finite genuine-field certificate',
        kind: 'private unmerged finite certificate',
        location: 'pull/18 at e4e3535c2457d6e94a1ffd089a008a2e40d0af4f',
        href: 'https://github.com/judegomila/mathexplorer/pull/18',
        note: 'H+iH_x nonvanishing on one bounded real parameter box; not global or complex zero-freeness.',
      },
      {
        label: 'PR 6 invalidated prolate checkpoint',
        kind: 'failed proof-item history',
        location: 'P0_INVALIDATED',
        href: 'https://github.com/judegomila/mathexplorer/pull/6',
        note: 'Preserved formulas and passing tests do not reinstate the invalidated proof item.',
      },
    ],
  },

  blockers: [
    {
      id: 'all-scale-signed-arithmetic',
      title: 'Control the actual signed arithmetic form at all scales',
      statement:
        'The common arithmetic gap is a signed all-scale estimate or cofinal actual-form floor with the required quantifiers. Finite windows, absolute values, periodic relaxations, and model damping do not provide it.',
      physicsAnalogy:
        'The routes have calibrated many components of the apparatus, but the load-bearing beam is the signed force balance across every scale. Replacing it by the sum of force magnitudes changes the structure being tested.',
      nextTest:
        'Prove a cancellation-aware cofinal floor or signed Schur/gain estimate for the actual coefficients without importing an RH-strength prime bound.',
    },
    {
      id: 'exhaustive-theta-boundaries',
      title: 'Turn finite theta boxes into an exhaustive continuation',
      statement:
        'The genuine finite theta certificates do not cover all heights. A global route needs zero-winding relative-error boundaries on an exhaustive family, an all-real anchor, complex-zero confinement, and passage to time zero.',
      physicsAnalogy:
        'Two pressure-tested chambers do not certify an infinite pipeline. The interfaces between every chamber and the limiting endpoint remain part of the pressure vessel.',
      nextTest:
        'Construct independently checkable boundary winding certificates on cofinal boxes, including the analytic confinement and convergence hypotheses.',
    },
    {
      id: 'historical-artifact-gap',
      title: 'Recover or supersede unavailable historical evidence',
      statement:
        'The PR 15 approximately 1.1 GB fixed-support bundle is unavailable, and several delivered refinements lack verified remote publication. Their status must remain historical or partial unless a complete new package is built.',
      physicsAnalogy:
        'A laboratory log can record that a load test passed, but without the sensor stream and calibration inputs it cannot be replayed. The record remains evidence, not a newly repeated experiment.',
      nextTest:
        'Either recover the exact load-bearing bytes or produce a smaller independently specified certificate with complete inputs, generators, receipts, and hashes.',
    },
  ],

  provenance: {
    sourceManifestPath: 'research/rh/foundation/SOURCE_PROVENANCE.json',
    evidenceManifestPath: 'research/rh/foundation/historical-evidence-map.json',
    sourceRefs: [
      {
        repository: 'judegomila/mathexplorer',
        branch: 'codex/rh-module-source-staging-2026-10-30',
        commit: SOURCE_COMMIT,
        access: 'private-repository',
        paths: [
          'research/rh/modules/historical-routes.md',
          'research/rh/foundation/SOURCE_PROVENANCE.json',
          'research/rh/foundation/historical-evidence-map.json',
          'research/rh/foundation/historical-qa.json',
          'research/rh/foundation/v7-mathematical-review.md',
          'research/rh/PUBLICATION_SCOPE_2026-10-30.md',
          'research/rh/foundation/PUBLICATION_SHA256SUMS',
        ],
        note:
          'Private repository access required. This additions-only source slice records historical and unmerged evidence without bundling absent large artifacts.',
      },
    ],
    curatorNote:
      'The atlas is intentionally mixed-status. Internal acceptance means the curation and scoped mathematics were reviewed; it is not external peer review, a global theorem, or a fresh replay of every historical package.',
  },

  failures: [
    {
      id: 'hidden-square-measure',
      title: 'The hidden-square diagonal has zero planar measure',
      surrogate:
        'Treat the positive comparison integral on the diagonal $u=v$ as a nonzero channel of the original two-dimensional integral.',
      failureStage:
        'The diagonal has two-dimensional Lebesgue measure zero. Without a new measure or exact identity, its one-dimensional positivity contributes no mass to the original double integral.',
      implication:
        'Paired-coordinate and divisor-block identities remain useful finite identities but do not establish global kernel positivity.',
      nonImplications: [
        'This is not a negative direction of the completed kernel.',
        'It does not refute the shifted RH-equivalent criterion.',
        'It does not rule out a different exact measure-theoretic decomposition.',
      ],
      evidence: [
        {
          label: 'Historical route atlas, twin-ladder section',
          kind: 'curated proof correction',
          location: 'research/rh/modules/historical-routes.md',
        },
      ],
    },
    {
      id: 'critical-fluid-substitute',
      title: 'Critical-fluid analogies do not reproduce theta cancellation',
      surrogate:
        'Infer the theta law or Lee–Yang property from a midpoint Gaussian prime ladder with positive quadratic or stabilizing quartic reweighting.',
      failureStage:
        'The positive quadratic reweighting is nonnormalizable at finite cutoff. The stabilized quartic law has the wrong kurtosis, and a finite prime approximant can violate the Lee–Yang cumulant constraint.',
      implication:
        'The information models need an exact arithmetic comparison before they can control the Weil form.',
      nonImplications: [
        'It does not refute the actual theta transform.',
        'It does not refute the valid Gaussian entropy or xi KL identities.',
        'It does not prove that every arithmetic interacting model fails.',
      ],
      evidence: [
        {
          label: 'Historical route atlas, information section',
          kind: 'failed surrogate record',
          location: 'research/rh/modules/historical-routes.md',
        },
      ],
    },
    {
      id: 'backward-heat-maximum-principle',
      title: 'The determinant source has the wrong time orientation',
      surrogate:
        'Use the positive Laguerre-difference source as a forward maximum-principle proof of collision exclusion after reversing heat time.',
      failureStage:
        'Time reversal changes the source sign. The explicit polynomial heat solution develops a collision and then nonreal roots.',
      implication:
        'A valid global heat route needs trajectory or winding data beyond the local determinant identity.',
      nonImplications: [
        'The polynomial countermodel is not the theta family.',
        'It does not refute the local collision-index theorem.',
        'It does not imply that the actual theta deformation has a collision.',
      ],
      evidence: [
        {
          label: 'Historical route atlas, vortex section',
          kind: 'exact countermodel',
          location: 'research/rh/modules/historical-routes.md',
        },
      ],
    },
    {
      id: 'absolute-hankel-domination',
      title: 'Absolute-kernel domination destroys the needed cancellation',
      surrogate:
        'Upper-bound the signed thin Hankel operator by the norm of its absolute kernel and extend the resulting bound to every window.',
      failureStage:
        'The absolute-kernel norm exceeds one at the first window and its all-window norms diverge for every positive width.',
      implication:
        'Only cancellation-aware estimates can address the thin all-window problem.',
      nonImplications: [
        'It does not show that the signed Hankel norm exceeds one.',
        'It does not invalidate the certified finite signed windows.',
        'It does not prove or disprove the required xi zero-divisor condition.',
      ],
      evidence: [
        {
          label: 'Historical route atlas, thin Hankel section',
          kind: 'failed majorant',
          location: 'research/rh/modules/historical-routes.md',
        },
      ],
    },
    {
      id: 'l-five-four-lower-surrogate',
      title: 'The negative L=5/4 lower surrogate is not an actual negative vector',
      surrogate:
        'Use redistributed diagnostic masses and an uncertified continuum comparison at 160 or 180 modes as a lower bound for the actual fixed-support form.',
      failureStage:
        'The frozen comparison is rigorously negative within its surrogate, but its continuum coupling error is not certified.',
      implication:
        'The specified extension method failed; actual operator negativity does not follow.',
      nonImplications: [
        'It is not a counterexample to RH.',
        'It does not prove the actual Weil form negative at L=5/4.',
        'It does not invalidate the historical L=6/5 recorded certificate.',
      ],
      evidence: [
        {
          label: 'PR 15 fixed-support ledger',
          kind: 'private unmerged historical source',
          location: 'research-checkpoints/rh-arithmetic-information-2026-10-21/FIXED_SUPPORT.md',
          href: 'https://github.com/judegomila/mathexplorer/pull/15',
        },
      ],
    },
    {
      id: 'periodic-null-symbol-relaxation',
      title: 'A negative dual relaxation is not an admissible Fourier square',
      surrogate:
        'Restrict null-symbol frequencies to a lattice and interpret the negative optimum of the periodic-envelope relaxation as negative Weil energy.',
      failureStage:
        'The relaxed negative measure need not equal $|\widehat f|^2$ for any function with the required compact support.',
      implication:
        'The exact fixed-support dual remains complete, but the chosen lattice relaxation is not an effective all-support certificate.',
      nonImplications: [
        'It does not construct a negative admissible test function.',
        'It does not refute the exact null-symbol duality.',
        'It does not determine the sign of the true fixed-support form.',
      ],
      evidence: [
        {
          label: 'PR 15 null-symbol analysis',
          kind: 'private unmerged relaxation audit',
          location: 'research-checkpoints/rh-arithmetic-information-2026-10-21/NULL_SYMBOL_DUALS.md',
          href: 'https://github.com/judegomila/mathexplorer/pull/15',
        },
      ],
    },
    {
      id: 'curvature-topology',
      title: 'Gauss–Bonnet cancels the desired arithmetic boundary term',
      surrogate:
        'Use the curvature cylinder topology or gamma-only positive bulk to infer an upper bound for the signed arithmetic discrepancy.',
      failureStage:
        'On the lifted triangle the total curvature equals $D(W)$ and the sloping-edge boundary curvature cancels it. The gamma bulk omits the signed prime boundary defect.',
      implication:
        'The geometry is an exact encoding, not a sign theorem for the actual arithmetic form.',
      nonImplications: [
        'It does not prove the true Weil form negative.',
        'It does not rule out nonlocal or coupled-field realizations.',
        'It does not invalidate the exact gamma auxiliary-field identity.',
      ],
      evidence: [
        {
          label: 'Historical route atlas, curvature and bulk section',
          kind: 'limited no-go theorem',
          location: 'research/rh/modules/historical-routes.md',
        },
      ],
    },
    {
      id: 'pr6-p0-invalidated',
      title: 'PR 6 remains P0_INVALIDATED',
      surrogate:
        'Treat preserved formulas or passing local tests in the prolate checkpoint as reinstating its invalidated proof item.',
      failureStage:
        'The repository’s formal status remains P0_INVALIDATED; no new proof audit in this atlas repairs that item.',
      implication:
        'PR 6 is retained as failed-route history and individual formulas require separate rechecking before reuse.',
      nonImplications: [
        'It does not declare every formula in PR 6 false.',
        'It does not affect the separate PR 14–19 results.',
        'It is not a claim about the truth or falsity of RH.',
      ],
      evidence: [
        {
          label: 'PR 6 status',
          kind: 'invalidated proof-item record',
          location: 'P0_INVALIDATED',
          href: 'https://github.com/judegomila/mathexplorer/pull/6',
        },
      ],
    },
  ],

  references: [
    'research/rh/modules/historical-routes.md — canonical mixed-status mathematical atlas.',
    'research/rh/foundation/historical-evidence-map.json — route-by-route sources, statuses, replay boundaries, and PR identities.',
    'research/rh/foundation/v7-mathematical-review.md — internal review of the included V7 arithmetic foundations.',
    'Masatoshi Suzuki, Aspects of the screw function corresponding to the Riemann zeta-function, arXiv:2206.03682.',
    'Brad Rodgers and Terence Tao, The de Bruijn–Newman constant is non-negative, arXiv:1801.05914.',
  ],
});

export const HISTORICAL_ROUTES_ASSERTIONS = Object.freeze([
  {
    name: 'historical atlas remains open and internally reviewed',
    holds: () => HISTORICAL_ROUTES.status === 'open' &&
      HISTORICAL_ROUTES.rhStatus === 'open' &&
      HISTORICAL_ROUTES.reviewStatus === 'accepted' &&
      HISTORICAL_ROUTES.reviewScope === 'internal',
  },
  {
    name: 'historical atlas pins its canonical body and source commit',
    holds: () => HISTORICAL_ROUTES.verification.artifacts.some(
      (artifact) => artifact.path === HISTORICAL_ROUTES.bodyPath && artifact.sha256 === BODY_SHA256,
    ) && HISTORICAL_ROUTES.provenance.sourceRefs[0].commit === SOURCE_COMMIT,
  },
  {
    name: 'historical atlas preserves all eleven mixed-status routes',
    holds: () => HISTORICAL_ROUTES.derivation.length === 11,
  },
  {
    name: 'historical PR15 bundle remains explicitly unavailable',
    holds: () => HISTORICAL_ROUTES.verification.artifacts.some(
      (artifact) => artifact.availability === 'unavailable' &&
        artifact.requiredForClaim && /1\.1 GB/.test(artifact.label),
    ),
  },
  {
    name: 'historical atlas keeps PR14 implication conditional',
    holds: () => HISTORICAL_ROUTES.derivation.some(
      (step) => step.id === 'mobius-zero-free' && /imported analytic estimates/.test(step.body),
    ),
  },
  {
    name: 'historical atlas keeps both theta boxes finite and distinct',
    holds: () => HISTORICAL_ROUTES.claimBoundary.doesNotClaim.some(
      (claim) => /PR 17/.test(claim) && /PR 18/.test(claim),
    ),
  },
  {
    name: 'historical atlas preserves L=5/4 surrogate nonimplications',
    holds: () => HISTORICAL_ROUTES.failures.some(
      (failure) => failure.id === 'l-five-four-lower-surrogate' &&
        failure.nonImplications.some((item) => /actual Weil form negative/.test(item)),
    ),
  },
  {
    name: 'historical atlas keeps PR6 invalidated',
    holds: () => HISTORICAL_ROUTES.failures.some(
      (failure) => failure.id === 'pr6-p0-invalidated' && failure.failureStage.includes('P0_INVALIDATED'),
    ),
  },
  {
    name: 'historical atlas distinguishes four overloaded coordinates',
    holds: () => HISTORICAL_ROUTES.claimBoundary.doesNotClaim.some(
      (claim) => claim.includes('spectral-support') && claim.includes('von Mangoldt') && claim.includes('boundary'),
    ),
  },
  {
    name: 'historical atlas labels V7 and delivered refinements partially reproducible',
    holds: () => HISTORICAL_ROUTES.verification.reproducibilityStatus === 'partial' &&
      HISTORICAL_ROUTES.claimBoundary.doesNotClaim.some((claim) => /verified remote publication/.test(claim)),
  },
]);

export default HISTORICAL_ROUTES;
