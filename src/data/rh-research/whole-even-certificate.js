import { createResearchModule } from './module-contract.js';

const tex = String.raw;
const SOURCE_COMMIT = 'd011a853ffa177fcaedd741616370a38feb37e00';
const SOURCE_TREE = '5e56abd63ae89cc783144cab6b19d38514fe5bc9';
const ACCEPTED_CACHE_DIGEST = '7124e3da5214999afd3edbe57cbbda015f4d14ae6a5f7a7acfafd1330b6292fa';
const FAILED_CACHE_DIGEST = 'a16c51de67b2d0296ee0689f2201511e29c3a43705a8ab2f277360b66bf00faf';
const BODY_SHA256 = '881a736aa736b37b2b366e5cb61cf2033802eced1d144c98912cb4b0c4e05b11';

export const WHOLE_EVEN_CERTIFICATE = createResearchModule({
  schemaVersion: 1,
  id: 'whole-even-certificate',
  route: '/rh-whole-even-certificate',
  title: 'Whole-even Weil coercivity through √16.001',
  updatedAt: '2026-10-30',
  status: 'certified-finite',
  reviewStatus: 'accepted',
  reviewScope: 'internal',
  rhStatus: 'open',
  summary:
    'A complete outward-rounded Schur certificate proves coercive positivity of the actual reflection-even supported Weil form for every 1 < λ ≤ √(16001/1000), including its entire infinite Fourier tail. The positive coercivity floor is existential, and the separate X = 16.1 lower-surrogate failure is retained without promoting it to actual negativity.',
  bodyPath: 'research/rh/modules/whole-even-certificate.md',

  claimBoundary: {
    title: 'An actual finite-support even-form theorem, not RH',
    statement:
      tex`At the exact endpoint $X_*=16001/1000$ and $\lambda_*=\sqrt{X_*}$, the canonical reflection-even supported Weil form has a strictly positive coercivity constant. Centered zero extension gives the same bound on every smaller support.`,
    doesNotClaim: [
      'This does not prove positivity in the odd reflection sector, ground-state simplicity, or identification of a distinguished zeta-related candidate.',
      'This does not give a support-independent lower floor along a cofinal sequence of supports and therefore does not prove RH.',
      tex`The certified endpoint is the largest endpoint completed in this module, not a claim that positivity ends at $\lambda_*$.`,
      'The coercivity constant $c_*>0$ is existential. No LDL pivot, diagnostic interval, or tail diagonal is asserted to equal a numerical lower bound for the complete form.',
      'The negative $X=161/10$ whitened-surrogate pivot is a failure of a sufficient lower majorant, not actual form or operator negativity.',
      'The internal accepted status is neither external peer review nor proof-assistant formalization.',
    ],
  },

  theorem: {
    label: 'Certified reflection-even theorem',
    statement:
      tex`For the canonical closed supported Weil form below, there exists $c_*>0$ such that $q_{\lambda_*}[f]\ge c_*\lVert f\rVert_2^2$ for every complex reflection-even form-domain vector, and the same constant works for every smaller centered support.`,
    hypotheses: [
      tex`Set $X=\lambda^2$, $a=\log\lambda$, $W=2a=\log X$, and extend every function on $[-a,a]$ by zero.`,
      'Use the nonunitary Fourier transform and the logarithmically weighted canonical form domain displayed below; the associated operator is defined by the closed form, not by imposed boundary conditions.',
      'Reflection-even means $f(-y)=f(y)$; complex coefficients are allowed and every matrix test is Hermitian.',
      tex`The endpoint is exact: $X_*=16001/1000$, $W_*=\log(16001/1000)$, and $\lambda_*=\sqrt{16001/1000}$.`,
      tex`The finite head uses modes $0,\ldots,2048$ and the proof majorizes the entire complementary infinite tail, rather than a finite tail truncation.`,
      'All numerical sign decisions use outward Arb intervals at 1000-bit precision. Midpoints select pivot permutations only.',
    ],
    equations: [
      {
        id: 'support-parameterization',
        label: 'Exact support parameterization',
        tex: String.raw`X=\lambda^2,\qquad a=\log\lambda,\qquad W=2a=\log X,\qquad I_\lambda=[-a,a]`,
      },
      {
        id: 'fourier-normalization',
        label: 'Fourier convention',
        tex: String.raw`\widehat f(t)=\int_{\mathbb R}f(y)e^{-ity}\,dy,\qquad \lVert f\rVert_2^2=\frac1{2\pi}\int_{\mathbb R}|\widehat f(t)|^2\,dt`,
      },
      {
        id: 'canonical-form-domain',
        label: 'Canonical closed form domain',
        tex: String.raw`\mathcal V_\lambda=\left\{f\in L^2(I_\lambda):\int_{\mathbb R}\log(2+|t|)|\widehat f(t)|^2\,dt<\infty\right\}`,
      },
      {
        id: 'actual-supported-weil-form',
        label: 'Actual supported Weil form',
        tex: String.raw`q_\lambda[f]=\frac1{2\pi}\int_{\mathbb R}\alpha(t)|\widehat f(t)|^2\,dt+2\Re\int_0^W e^{r/2}R_f(r)\,dr-2\Re\sum_{2\le n<\lambda^2}\frac{\Lambda(n)}{\sqrt n}R_f(\log n)`,
        explanation:
          tex`Here $R_f(r)=\int_{\mathbb R}\overline{f(y)}f(y+r)\,dy$ and $\alpha(t)=\Re\psi(5/4+it/2)-\log\pi$. Endpoint atoms vanish because $R_f(W)=0$.`,
      },
      {
        id: 'reflection-even-domain',
        label: 'Even sector',
        tex: String.raw`H_{\lambda,+}=\{f:f(-y)=f(y)\},\qquad \mathcal V_{\lambda,+}=\mathcal V_\lambda\cap H_{\lambda,+}`,
      },
      {
        id: 'exact-endpoint',
        label: 'Certified endpoint',
        tex: String.raw`X_*=\frac{16001}{1000},\qquad \lambda_*=\sqrt{\frac{16001}{1000}}=4.00012499804693603277\ldots`,
      },
      {
        id: 'whole-even-coercivity',
        label: 'Coercive conclusion',
        tex: String.raw`\exists\,c_*>0\quad\forall f\in\mathcal V_{\lambda_*,+}:\qquad q_{\lambda_*}[f]\ge c_*\lVert f\rVert_2^2`,
      },
      {
        id: 'smaller-support-range',
        label: 'Centered-support inheritance',
        tex: String.raw`1<\lambda\le\lambda_*\quad\Longrightarrow\quad q_\lambda[f]\ge c_*\lVert f\rVert_2^2\qquad(f\in\mathcal V_{\lambda,+})`,
      },
    ],
  },

  derivation: [
    {
      id: 'normalization-and-domain',
      title: 'Fix the actual form before discretizing it',
      body:
        'The gamma multiplier grows logarithmically and is bounded below, while the finite prime translations and supported continuum kernel are bounded at fixed support. This makes the displayed expression the canonical closed semibounded form on the stated domain. The 5/4-gamma normalization already absorbs the decaying piece of the old pole kernel, so adding that kernel again would double count it.',
      equations: [
        {
          id: 'gamma-normalization-identity',
          tex: String.raw`\alpha(t)-m(t)=\frac1{t^2+1/4},\qquad m(t)=\Re\psi(1/4+it/2)-\log\pi`,
          explanation:
            tex`The inverse Fourier kernel is $e^{-|x-y|/2}$; subtracting it from $2\cosh((x-y)/2)$ leaves the $e^{|x-y|/2}$ continuum term used in the form.`,
        },
      ],
      notes: [
        'The operator is the one represented by this closed form. No ad hoc endpoint boundary conditions are introduced.',
        'Reflection preserves the form and its domain, and the proof applies to complex even vectors.',
      ],
    },
    {
      id: 'exact-support-and-basis',
      title: 'Parameterize the endpoint and split physical box modes',
      body:
        'At $X_*=16001/1000$, use the normalized even cosine basis and split after $N=2048$. The head has 2049 actual modes. The complement is infinite; it is never replaced by a finite-dimensional proxy.',
      equations: [
        {
          id: 'even-box-basis',
          tex: String.raw`e_0=W^{-1/2},\qquad e_k(y)=\sqrt{\frac2W}\cos\!\left(\frac{2\pi ky}{W}\right)\quad(k\ge1)`,
        },
        {
          id: 'operator-blocks',
          tex: String.raw`A_{\lambda_*,+}=\begin{pmatrix}A_h&K^*\\K&D\end{pmatrix},\qquad \operatorname{ran}P_N=\operatorname{span}\{e_0,\ldots,e_{2048}\}`,
          explanation:
            '$D$ is the entire infinite tail compression and $K$ is the actual head-to-tail coupling.',
        },
      ],
      notes: [
        'The ten active prime powers are $2,3,4,5,7,8,9,11,13,16$.',
        'Finite box modes lie in the actual operator domain, so the head/tail Schur argument is a form argument for the real operator.',
      ],
    },
    {
      id: 'uniform-infinite-tail',
      title: 'Prove a diagonal lower operator for the entire tail',
      body:
        'Audited gamma remainder and even tail-trace estimates, together with the exhaustive seven-step weighted-Schur prime norm envelope $P_*=3.80364$, give a positive diagonal operator below the complete tail. Monotonicity of the digamma series controls every future index, so the lower bound is not a sampled finite-tail minimum.',
      equations: [
        {
          id: 'tail-lower-operator',
          tex: String.raw`D\ge L:=\operatorname{diag}_{j>N}d_j>0`,
        },
        {
          id: 'tail-diagonal',
          tex: String.raw`d_j=\alpha(2\pi j/W)-\Gamma_{\rm ref}(W)-P_*-\frac{H_K(W)}N`,
        },
        {
          id: 'gamma-remainder',
          tex: String.raw`\Gamma_{\rm ref}(W)=1.853+\frac3{5W}+\frac45\frac{e^{-5W/2}}{1-e^{-2W}}`,
        },
        {
          id: 'continuum-tail-envelope',
          tex: String.raw`H_K(W)=\frac{W[W+2(1-e^{-W/2})]}{2\pi^2}`,
        },
        {
          id: 'first-tail-diagonal',
          tex: String.raw`d_{2049}>0.7311865968`,
          explanation:
            'This is a floor for the tail lower operator, not the asserted coercivity constant of the full coupled form.',
        },
      ],
      notes: [
        'The prime envelope comes from exhaustive weighted path enumeration for the whole translation operator, not a finite prime matrix.',
        'Since $d_j$ is increasing for every $j>2048$, the estimate includes the infinite tail.',
      ],
    },
    {
      id: 'inverse-energy-majorant',
      title: 'Bound the true inverse tail energy from above',
      body:
        tex`Positive inverse order gives $D^{-1}\le L^{-1}$. Every near row through $J=16384$ is evaluated directly. The remaining infinite rows are compressed only after a proved all-head upper majorant, retaining the nearly resonant signed phases and bounding every other phase by a global Abel allowance.`,
      equations: [
        {
          id: 'inverse-order',
          tex: String.raw`D\ge L>0\qquad\Longrightarrow\qquad D^{-1}\le L^{-1}`,
        },
        {
          id: 'whole-self-energy-majorant',
          tex: String.raw`K^*D^{-1}K\le K_{\rm near}^*L_{\rm near}^{-1}K_{\rm near}+P_f^*H_fP_f+\operatorname{rem}I`,
          explanation:
            'This is an upper majorant for the true inverse energy. It is not a claimed near/far decomposition of $D^{-1}$.',
        },
      ],
      notes: [
        'The retained nearly resonant ratios are $16,1/16,256,1/256$, with their signed moments.',
        'Forty-eight finite inverse-weight bands and the infinite final plateau are retained.',
        tex`The far proof uses the reviewed all-sequence bounds $B=3$ and $C_\beta=13/10$, including beta-error and geometric remainder terms.`,
        'The exact-$X=16$ quarter/half-phase shortcuts are not used at this endpoint.',
      ],
    },
    {
      id: 'complete-schur-gates',
      title: 'Certify the bordered Schur complement',
      body:
        'Subtract the directly evaluated near energy and isotropic remainder from the actual head, then factor the finite-rank far majorant. Two complete outward tests turn the tail majorant into positivity of the true head Schur complement.',
      equations: [
        {
          id: 'reduced-head',
          tex: String.raw`C=A_h-K_{\rm near}^*L_{\rm near}^{-1}K_{\rm near}-\operatorname{rem}I`,
        },
        {
          id: 'far-factor',
          tex: String.raw`H_f=FF^*,\qquad Z=F^*P_f`,
        },
        {
          id: 'two-positive-gates',
          tex: String.raw`C>0,\qquad I-ZC^{-1}Z^*>0`,
        },
        {
          id: 'true-schur-lower-bound',
          tex: String.raw`S=A_h-K^*D^{-1}K\ge C-Z^*Z>0`,
        },
      ],
      notes: [
        'All 2049 core pivots, all 72 coefficient-factor pivots, and all 72 final whitened-Schur pivots pass.',
        'The 72 far features do not turn the argument into a 72-mode verification: the head has 2049 modes and the bounded complement is infinite.',
      ],
    },
    {
      id: 'existential-coercivity',
      title: 'Lift Schur positivity to the full form',
      body:
        'Square completion separates the positive finite Schur matrix from the translated positive tail. A positive minimum eigenvalue exists for the finite Schur matrix, the infinite tail has a uniform positive floor, and the triangular completion map and its inverse are bounded. These facts produce an existential $c_*>0$ for the complete form.',
      equations: [
        {
          id: 'square-completion',
          tex: String.raw`q_{\lambda_*}[x+y]=\langle Sx,x\rangle+q_D[y+D^{-1}Kx]`,
        },
        {
          id: 'existential-floor-only',
          tex: String.raw`S>0,\quad D\ge d_{2049}I>0\quad\Longrightarrow\quad \exists c_*>0:\ q_{\lambda_*}[f]\ge c_*\lVert f\rVert_2^2`,
          explanation:
            'No reported minimum LDL pivot is substituted for $c_*$. LDL intervals certify the finite positivity gates; they are not a condition-number-corrected spectral floor for the coupled form.',
        },
      ],
      notes: [
        'The coercivity constant is deliberately existential at this enlarged endpoint.',
        tex`Centered zero extension preserves both the norm and the actual form, so the same inequality passes to every $1<\lambda\le\lambda_*$.`,
      ],
    },
    {
      id: 'outward-replay-gates',
      title: 'Recompute every retained phase and every gate',
      body:
        'The portable accepted replay verifies frozen source hashes, regenerates all retained-phase moments in a disposable checkout, compares all non-timing mathematical fields, and reruns the actual-entry, small, and full gates. Arb ball signs, not midpoint approximations, establish positivity.',
      equations: [
        {
          id: 'gate-counts',
          tex: String.raw`10437\ \text{moments};\qquad 2049+72+72\ \text{positive pivots}`,
        },
        {
          id: 'retained-moment-digest',
          tex: String.raw`\operatorname{SHA256}_{\rm canonical}=\texttt{7124e3da5214999a\ldots b6292fa}`,
        },
      ],
      notes: [
        'The accepted run uses python-flint 0.9.0 at fixed 1000-bit precision; the minimum reloaded moment accuracy is 942 bits.',
        'Minimum relative accuracies are 314 bits for the core, 939 bits for the coefficient factor, and 316 bits for the whitened Schur gate.',
        'Independent execution and source/mathematical review use the same Arb library; this is not a second arithmetic implementation or a formal proof.',
      ],
    },
    {
      id: 'x161-failed-surrogate-boundary',
      title: 'Retain the X = 16.1 obstruction without changing its meaning',
      body:
        'Fresh exact-support inputs and all 10,437 moments at $X=161/10$ pass their prerequisite checks. The complete producer core and coefficient factor are positive, but the first final whitened-Schur lower-surrogate pivot is strictly negative. Since the actual Schur complement is bounded below by this surrogate, a negative lower bound says only that this sufficient route no longer certifies positivity.',
      equations: [
        {
          id: 'failed-support',
          tex: String.raw`X=\frac{161}{10},\qquad \lambda=\sqrt{\frac{161}{10}}`,
        },
        {
          id: 'failed-first-whitened-pivot',
          tex: String.raw`p_1\in[-0.67466475329694705406237169670012908836\ldots\ \pm 1.20\times10^{-61}]`,
          explanation:
            'This interval is a strict failure of the sufficient lower surrogate, not a rounding ambiguity and not an eigenvalue of the actual Weil operator.',
        },
      ],
      notes: [
        'The producer failure is source-pinned and inspected; prerequisites and scalar-cache replay are complete.',
        'The optional full failed-case portable pipeline is packaged but was not newly executed, so this route retains partial reproducibility status inside the otherwise current accepted module.',
        'No proposed repair or higher-power extension is promoted to a theorem in this module.',
      ],
    },
  ],

  verification: {
    result:
      'PASS for the accepted endpoint: every source/hash gate, all 10,437 moment rows, the 2049-dimensional core, 72-dimensional coefficient factor, and 72-dimensional whitened Schur gate agree with the frozen receipts. The separate X=16.1 sufficient surrogate remains failed with only partial full-run reproduction.',
    scope:
      tex`Actual reflection-even supported-form coercivity for the finite support range $1<\lambda\le\sqrt{16001/1000}$, including the complete infinite Fourier tail. No odd-sector, cofinal-support, numerical full-form floor, actual-negativity, or RH conclusion is replayed.`,
    reproducibilityStatus: 'current-replay',
    commands: [
      {
        label: 'Verify the complete publication inventory',
        cwd: '.',
        command: 'shasum -a 256 -c research/rh/spectral/PUBLICATION_SHA256SUMS',
        expected: 'Every bundled module, source, note, receipt, manifest, and validation report prints OK.',
      },
      {
        label: 'Install the pinned numerical dependency',
        cwd: '.',
        command: 'python -m pip install -r research/rh/spectral/requirements.txt',
        expected: 'python-flint 0.9.0 is installed under Python 3.12; assertions must remain enabled.',
      },
      {
        label: 'Replay the accepted complete certificate',
        cwd: '.',
        command: 'python research/rh/spectral/replay.py --report /tmp/rh-accepted-replay.json',
        expected:
          'PASS_COMPLETE_CLEAN_REPRODUCTION; exactly 10,437 canonical moment rows and every 2049+72+72 gate agree with the frozen mathematical fields.',
      },
      {
        label: 'Optionally reproduce only the failed X = 16.1 surrogate',
        cwd: '.',
        command: 'python research/rh/spectral/replay.py --case failed --report /tmp/rh-failed-replay.json',
        expected:
          'FAILED_OR_INCONCLUSIVE at the sufficient whitened surrogate. Launcher success would reproduce that failure; it would not certify the larger support or prove actual negativity.',
      },
    ],
    artifacts: [
      {
        label: 'Canonical whole-even theorem and proof body',
        path: 'research/rh/modules/whole-even-certificate.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: BODY_SHA256,
        sizeBytes: 11180,
      },
      {
        label: 'Portable clean-checkout launcher',
        path: 'research/rh/spectral/replay.py',
        requiredForClaim: true,
        availability: 'available',
        sha256: 'f50e72d9cc1d804c4ee00f1e727ebfbab22f8e9299b2d5d2193bbcaa2490d896',
        sizeBytes: 9802,
      },
      {
        label: 'Exact runtime pin',
        path: 'research/rh/spectral/requirements.txt',
        requiredForClaim: false,
        availability: 'available',
        sha256: '4cef508304e84c21f73cf412712165dc26e40978cb784bc08a876948b559d90d',
        sizeBytes: 20,
      },
      {
        label: 'Ordered source, receipt, and case manifest',
        path: 'research/rh/spectral/manifest.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: '1b5cc0afddecf88f23074f7b60cc3aa7de707d07d217223d632e745224737303',
        sizeBytes: 15681,
      },
      {
        label: 'Accepted complete finite-head certificate',
        path: 'research/rh/spectral/reference/rh_attack_cycle_20261030/support_endpoint_continuity/GENERIC_FULL_EVEN_CERTIFICATE.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: '589f88eb475bd51023abacb58af4bbf473041b9c0610184c33561c5f14a396c2',
        sizeBytes: 30986,
      },
      {
        label: 'Accepted independent mathematical and source audit',
        path: 'research/rh/spectral/reference/rh_attack_cycle_20261030/independent_review/GENERIC_X16001_COMPLETE_EVEN_POSITIVITY_AUDIT.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: 'e46765602300ec44b16a87772e81a51f187cb73c2a5d822a1b080544476bdf78',
        sizeBytes: 10340,
      },
      {
        label: 'Accepted clean-checkout replay report',
        path: 'research/rh/spectral/validation/ACCEPTED_CLEAN_REPLAY.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: '0c056655f85782baef9385755bbb64dc671aa8bfd08b200d1964012cd929ce86',
        sizeBytes: 35739,
      },
      {
        label: 'Post-curation identity binding',
        path: 'research/rh/spectral/validation/POSTCURATION_IDENTITY.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: '721d3809e36f645143e96d90221692bf1fa146a8a8e9508391f509453947083e',
        sizeBytes: 2223,
        note:
          'Binds the clean numerical run to metadata-only publication edits; it explicitly does not claim a second numerical rerun after those edits.',
      },
      {
        label: 'Failed X = 16.1 producer certificate',
        path: 'research/rh/spectral/reference/rh_attack_cycle_20261030/support_endpoint_X161/GENERIC_FULL_EVEN_CERTIFICATE.json',
        requiredForClaim: false,
        availability: 'available',
        sha256: '852645d51afa4d663313b420c2310b73532bf264ada50032801ba21f97eb5ac8',
        sizeBytes: 30702,
        note:
          'Evidence for a failed sufficient surrogate only; it is not load-bearing evidence for the accepted endpoint and not evidence of actual negativity.',
      },
    ],
    replays: [
      {
        label: 'Accepted producer clean-checkout replay',
        method:
          'Verify the frozen inventory, copy exact sources to a disposable directory, regenerate all 10,437 moments, then execute seventh-power feasibility, literal actual-entry, small, and full certificate gates.',
        outcome:
          `PASS with canonical moment digest ${ACCEPTED_CACHE_DIGEST}; every non-timing mathematical field and all emitted source hashes agree.`,
        command: 'python research/rh/spectral/replay.py --report /tmp/rh-accepted-replay.json',
        evidence: [
          'research/rh/spectral/validation/ACCEPTED_CLEAN_REPLAY.json',
          'research/rh/spectral/validation/REPLAY_INPUT_MANIFEST.json',
          'research/rh/spectral/reference/rh_attack_cycle_20261030/support_endpoint_continuity/GENERIC_FULL_EVEN_CERTIFICATE.json',
        ],
      },
      {
        label: 'Independent accepted execution and mathematical review',
        method:
          'Independently regenerate the complete cache and compare every relevant full-certificate field, while separately auditing the analytic tail majorant and Schur implications.',
        outcome:
          'PASS for the accepted actual whole-even endpoint. This uses the same Arb library and is not a second arithmetic implementation or formal proof.',
        evidence: [
          'research/rh/spectral/reference/rh_attack_cycle_20261030/independent_review/generic_full_majorant_replay_workspace/INDEPENDENT_GENERIC_REPLAY_COMPARISON.json',
          'research/rh/spectral/reference/rh_attack_cycle_20261030/independent_review/generic_full_majorant_replay_workspace/INDEPENDENT_COMPLETE_CACHE_RECOMPUTATION.json',
          'research/rh/spectral/source-tree/rh_attack_cycle_20261030/independent_review/GENERIC_X16001_COMPLETE_EVEN_POSITIVITY_AUDIT.md',
        ],
      },
      {
        label: 'Metadata-curation identity check',
        method:
          'Hash all 17 executable source files and compare the preserved pre-curation input manifest with the documented metadata-only transforms.',
        outcome:
          'All executable bytes, case commands, moment digests, gate receipts, and theorem/audit status remain unchanged; no additional numerical rerun is claimed.',
        evidence: [
          'research/rh/spectral/validation/STATIC_TRANSPORT_CHECK.json',
          'research/rh/spectral/validation/POSTCURATION_IDENTITY.json',
        ],
      },
      {
        label: 'X = 16.1 failed-route reproduction boundary',
        method:
          'Inspect the source-pinned producer failure and independently replay its exact-support prerequisites and 10,437-row scalar cache. A complete optional portable failed-case pipeline is present but was not newly executed.',
        outcome:
          `PARTIAL: prerequisites and cache digest ${FAILED_CACHE_DIGEST} pass; the producer's first whitened lower-surrogate pivot is strictly negative. No actual negativity follows.`,
        command: 'python research/rh/spectral/replay.py --case failed --report /tmp/rh-failed-replay.json',
        evidence: [
          'research/rh/spectral/source-tree/rh_attack_cycle_20261030/support_endpoint_X161/FAILED_FULL_TEST.md',
          'research/rh/spectral/reference/rh_attack_cycle_20261030/independent_review/GENERIC_X161_PARAMETERIZATION_AND_FAILED_GATE_AUDIT.json',
          'research/rh/spectral/reference/rh_attack_cycle_20261030/support_endpoint_X161/GENERIC_FULL_EVEN_CERTIFICATE.json',
        ],
      },
    ],
    evidence: [
      {
        label: 'Publication SHA-256 manifest',
        kind: 'integrity-manifest',
        location: 'research/rh/spectral/PUBLICATION_SHA256SUMS',
      },
      {
        label: 'Source and editorial provenance',
        kind: 'source-manifest',
        location: 'research/rh/spectral/SOURCE_PROVENANCE.json',
      },
      {
        label: 'Complete majorant derivation',
        kind: 'proof-note',
        location: 'research/rh/spectral/source-tree/rh_attack_cycle_20261030/support_endpoint_continuity/GENERIC_FULL_MAJORANT_METHOD.md',
      },
      {
        label: 'Accepted whole-even audit',
        kind: 'internal-review',
        location: 'research/rh/spectral/source-tree/rh_attack_cycle_20261030/independent_review/GENERIC_X16001_COMPLETE_EVEN_POSITIVITY_AUDIT.md',
        note: 'Independent internal mathematical/source audit; not external peer review.',
      },
      {
        label: 'Accepted clean-checkout validation',
        kind: 'replay-report',
        location: 'research/rh/spectral/validation/ACCEPTED_CLEAN_REPLAY.json',
      },
      {
        label: 'Failed-support method and implication audit',
        kind: 'failed-route-audit',
        location: 'research/rh/spectral/source-tree/rh_attack_cycle_20261030/independent_review/GENERIC_X161_PARAMETERIZATION_AND_FAILED_GATE_AUDIT.md',
        note:
          'Supports only the failed-surrogate classification and its nonimplications; it is not evidence for actual negative energy.',
      },
    ],
  },

  blockers: [
    {
      id: 'cofinal-support-control',
      title: 'A fixed cavity is not the infinite-volume limit',
      statement:
        tex`The theorem controls every centered even support only up to $\lambda_*$. RH-oriented use would require a support-independent floor or another stable mechanism along a cofinal family, plus control of the distinguished branch as support grows.`,
      physicsAnalogy:
        'A resonator can be rigorously stable at every cavity size up to four units while its lowest mode still softens as the walls recede. A finite-cavity certificate does not establish a mass gap in the thermodynamic limit.',
      nextTest:
        tex`Prove a uniform family estimate along unbounded supports, or construct a monotone/compactness mechanism that prevents the even ground branch from collapsing as $\lambda\to\infty$.`,
    },
    {
      id: 'odd-sector-control',
      title: 'The odd reflection sector remains open',
      statement:
        tex`The current certificate is only for $H_{\lambda,+}$. It gives no positive lower bound for reflection-odd vectors.`,
      physicsAnalogy:
        'Certifying one polarization of a coupled field does not certify the orthogonal polarization; symmetry decouples the channels but does not transfer the gap.',
      nextTest:
        'Build and audit the corresponding odd-sector head/tail majorant or prove an analytic comparison that transfers positivity without losing the form domain.',
    },
    {
      id: 'ground-branch-identification',
      title: 'No distinguished global ground branch is selected',
      statement:
        'Finite positivity neither proves ground-state simplicity nor identifies convergence to the zeta-related candidate needed by the broader program.',
      physicsAnalogy:
        'Knowing that a Hamiltonian has positive energy in one finite box does not label which eigenstate continues adiabatically when the box changes.',
      nextTest:
        'Establish simplicity and stable continuation of the relevant ground branch, then connect it to a cofinal-support theorem.',
    },
  ],

  provenance: {
    sourceManifestPath: 'research/rh/spectral/SOURCE_PROVENANCE.json',
    evidenceManifestPath: 'research/rh/spectral/manifest.json',
    sourceRefs: [
      {
        repository: 'judegomila/mathexplorer',
        branch: 'codex/rh-module-source-staging-2026-10-30',
        commit: SOURCE_COMMIT,
        access: 'private-repository',
        paths: [
          'research/rh/modules/whole-even-certificate.md',
          'research/rh/spectral/REPRODUCE.md',
          'research/rh/spectral/SOURCE_PROVENANCE.json',
          'research/rh/spectral/manifest.json',
          'research/rh/spectral/PUBLICATION_SHA256SUMS',
          'research/rh/spectral/replay.py',
          'research/rh/spectral/source-tree/rh_attack_cycle_20261030/support_endpoint_continuity/GENERIC_FULL_MAJORANT_METHOD.md',
          'research/rh/spectral/source-tree/rh_attack_cycle_20261030/independent_review/GENERIC_X16001_COMPLETE_EVEN_POSITIVITY_AUDIT.md',
          'research/rh/spectral/reference/rh_attack_cycle_20261030/support_endpoint_continuity/GENERIC_FULL_EVEN_CERTIFICATE.json',
          'research/rh/spectral/validation/ACCEPTED_CLEAN_REPLAY.json',
          'research/rh/spectral/source-tree/rh_attack_cycle_20261030/support_endpoint_X161/FAILED_FULL_TEST.md',
          'research/rh/spectral/source-tree/rh_attack_cycle_20261030/independent_review/GENERIC_X161_PARAMETERIZATION_AND_FAILED_GATE_AUDIT.md',
        ],
        note:
          `Private-repository source slice pinned at tree ${SOURCE_TREE}. Access requires repository permission; the app record does not imply a public download.`,
      },
    ],
    curatorNote:
      'The accepted endpoint and failed larger-support route were curated as separate claims inside one module. Transport hashes establish file identity; the proof scope comes from the canonical body, derivation, receipts, and internal audits. The accepted replay is current, while the complete failed-case rerun remains explicitly partial.',
  },

  failures: [
    {
      id: 'x161-lower-surrogate',
      title: 'The X = 16.1 whitened lower surrogate fails',
      surrogate:
        'At $X=161/10$, the same finite-rank far-tail majorant asks for positivity of the final whitened sufficient matrix $I-ZC^{-1}Z^*$.',
      failureStage:
        tex`The producer core and coefficient factor pass, but the first final whitened pivot is enclosed near $-0.674664753296947054\ldots$ with radius $1.20\times10^{-61}$. The full producer result was inspected and source-pinned; prerequisites and the complete scalar cache were independently replayed, but the full failed matrix producer was not independently rerun.`,
      implication:
        'This particular sufficient lower-majorant route does not certify positivity at $X=161/10$ without a sharper bound or different factorization.',
      nonImplications: [
        'It does not prove that the actual Schur complement has a negative direction.',
        'It does not prove that the actual supported Weil form or its operator is negative.',
        tex`It does not establish a true positivity endpoint at $\sqrt{16001/1000}$.`,
        tex`It does not invalidate the accepted certificate below $\sqrt{16001/1000}$.`,
        'It does not promote any proposed directional repair or higher-power prerequisite to a completed theorem.',
      ],
      evidence: [
        {
          label: 'Failed full-test record',
          kind: 'failed-route-note',
          location: 'research/rh/spectral/source-tree/rh_attack_cycle_20261030/support_endpoint_X161/FAILED_FULL_TEST.md',
        },
        {
          label: 'Exact-parameterization and failed-gate audit',
          kind: 'internal-review',
          location: 'research/rh/spectral/source-tree/rh_attack_cycle_20261030/independent_review/GENERIC_X161_PARAMETERIZATION_AND_FAILED_GATE_AUDIT.md',
          note:
            'Records partial reproduction: complete producer failure inspected and pinned, with independently replayed prerequisites and cache.',
        },
        {
          label: 'Failed producer certificate',
          kind: 'outward-interval-receipt',
          location: 'research/rh/spectral/reference/rh_attack_cycle_20261030/support_endpoint_X161/GENERIC_FULL_EVEN_CERTIFICATE.json',
          note: 'A negative sufficient surrogate, not a receipt for actual operator negativity.',
        },
      ],
    },
  ],

  references: [
    'research/rh/modules/whole-even-certificate.md — canonical exact form, theorem, proof, replay boundary, and RH boundary.',
    'research/rh/spectral/source-tree/rh_attack_cycle_20261030/support_endpoint_continuity/GENERIC_FULL_MAJORANT_METHOD.md — full finite-head/infinite-tail majorant derivation.',
    'research/rh/spectral/source-tree/rh_attack_cycle_20261030/independent_review/GENERIC_X16001_COMPLETE_EVEN_POSITIVITY_AUDIT.md — independent internal accepted audit.',
    'research/rh/spectral/REPRODUCE.md — clean-checkout execution and comparison semantics.',
    'research/rh/spectral/source-tree/rh_attack_cycle_20261030/support_endpoint_X161/FAILED_FULL_TEST.md — retained failed-surrogate route.',
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

export const WHOLE_EVEN_CERTIFICATE_ASSERTIONS = Object.freeze([
  {
    name: 'whole-even record keeps RH open and limits acceptance to internal review',
    holds: () => WHOLE_EVEN_CERTIFICATE.rhStatus === 'open' &&
      WHOLE_EVEN_CERTIFICATE.reviewStatus === 'accepted' &&
      WHOLE_EVEN_CERTIFICATE.reviewScope === 'internal',
  },
  {
    name: 'whole-even theorem is a current finite certificate',
    holds: () => WHOLE_EVEN_CERTIFICATE.status === 'certified-finite' &&
      WHOLE_EVEN_CERTIFICATE.verification.reproducibilityStatus === 'current-replay',
  },
  {
    name: 'theorem pins the exact support range and actual form domain',
    holds: () => WHOLE_EVEN_CERTIFICATE.theorem.equations.some(
      (equation) => equation.id === 'exact-endpoint' && equation.tex.includes('16001'),
    ) && WHOLE_EVEN_CERTIFICATE.theorem.equations.some(
      (equation) => equation.id === 'canonical-form-domain' && equation.tex.includes('\\mathcal V_\\lambda'),
    ) && WHOLE_EVEN_CERTIFICATE.theorem.equations.some(
      (equation) => equation.id === 'actual-supported-weil-form' && equation.tex.includes('\\Lambda(n)'),
    ),
  },
  {
    name: 'proof includes the complete infinite tail and all three gate counts',
    holds: () => {
      const text = JSON.stringify(WHOLE_EVEN_CERTIFICATE);
      return text.includes('entire infinite tail') && text.includes('2049 core pivots') &&
        text.includes('72 coefficient-factor pivots') && text.includes('72 final whitened-Schur pivots');
    },
  },
  {
    name: 'coercivity floor remains existential rather than pivot-derived',
    holds: () => WHOLE_EVEN_CERTIFICATE.claimBoundary.doesNotClaim.some(
      (item) => /No LDL pivot/.test(item),
    ) && WHOLE_EVEN_CERTIFICATE.derivation.some(
      (step) => step.id === 'existential-coercivity' && /existential/.test(step.body),
    ),
  },
  {
    name: 'accepted replay pins all moments and its canonical digest',
    holds: () => {
      const text = JSON.stringify(WHOLE_EVEN_CERTIFICATE.verification);
      return text.includes('10,437') && text.includes(ACCEPTED_CACHE_DIGEST);
    },
  },
  {
    name: 'all load-bearing artifacts are present and hashed',
    holds: () => WHOLE_EVEN_CERTIFICATE.verification.artifacts
      .filter((artifact) => artifact.requiredForClaim)
      .every((artifact) => artifact.availability === 'available' && /^[a-f0-9]{64}$/.test(artifact.sha256)),
  },
  {
    name: 'X16.1 remains a partial failed surrogate with explicit nonimplications',
    holds: () => WHOLE_EVEN_CERTIFICATE.failures.some(
      (failure) => failure.id === 'x161-lower-surrogate' &&
        /sufficient lower-majorant/.test(failure.implication) &&
        failure.nonImplications.some((item) => /actual supported Weil form/.test(item)) &&
        failure.nonImplications.some((item) => /true positivity endpoint/.test(item)),
    ) && WHOLE_EVEN_CERTIFICATE.verification.replays.some(
      (replay) => replay.label.includes('failed-route') && replay.outcome.startsWith('PARTIAL:'),
    ),
  },
  {
    name: 'body, source commit, and source tree are immutable pins',
    holds: () => WHOLE_EVEN_CERTIFICATE.verification.artifacts.some(
      (artifact) => artifact.path === 'research/rh/modules/whole-even-certificate.md' &&
        artifact.sha256 === BODY_SHA256,
    ) && WHOLE_EVEN_CERTIFICATE.provenance.sourceRefs[0].commit === SOURCE_COMMIT &&
      WHOLE_EVEN_CERTIFICATE.provenance.sourceRefs[0].note.includes(SOURCE_TREE),
  },
  {
    name: 'remaining family-level blockers preserve the RH gap',
    holds: () => WHOLE_EVEN_CERTIFICATE.blockers.some(
      (blocker) => blocker.id === 'cofinal-support-control',
    ) && WHOLE_EVEN_CERTIFICATE.blockers.some(
      (blocker) => blocker.id === 'odd-sector-control',
    ) && WHOLE_EVEN_CERTIFICATE.blockers.some(
      (blocker) => blocker.id === 'ground-branch-identification',
    ),
  },
  {
    name: 'whole-even runtime prose preserves representative TeX commands',
    holds: () => [
      [WHOLE_EVEN_CERTIFICATE.claimBoundary.statement, [tex`\lambda`, tex`\sqrt`]],
      [WHOLE_EVEN_CERTIFICATE.theorem.statement, [tex`\lambda`, tex`\ge`, tex`\lVert`]],
      [WHOLE_EVEN_CERTIFICATE.theorem.hypotheses.join('\n'), [tex`\log`, tex`\ldots`]],
      [WHOLE_EVEN_CERTIFICATE.theorem.equations.find(
        (equation) => equation.id === 'actual-supported-weil-form',
      )?.explanation || '', [tex`\int`, tex`\mathbb`, tex`\overline`]],
      [WHOLE_EVEN_CERTIFICATE.derivation.find(
        (step) => step.id === 'normalization-and-domain',
      )?.equations.find(
        (equation) => equation.id === 'gamma-normalization-identity',
      )?.explanation || '', [tex`\cosh`]],
      [WHOLE_EVEN_CERTIFICATE.derivation.find(
        (step) => step.id === 'inverse-energy-majorant',
      )?.body || '', [tex`\le`]],
      [WHOLE_EVEN_CERTIFICATE.verification.scope, [tex`\lambda`, tex`\le`, tex`\sqrt`]],
      [WHOLE_EVEN_CERTIFICATE.blockers.find(
        (blocker) => blocker.id === 'cofinal-support-control',
      )?.nextTest || '', [tex`\lambda`, tex`\to`, tex`\infty`]],
      [WHOLE_EVEN_CERTIFICATE.failures[0]?.failureStage || '', [tex`\ldots`, tex`\times`]],
    ].every(([value, tokens]) => tokens.every((token) => value.includes(token))),
  },
  {
    name: 'whole-even runtime text contains no destructive ASCII controls',
    holds: () => collectRuntimeStrings(WHOLE_EVEN_CERTIFICATE).every(
      (value) => !/[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f]/.test(value),
    ),
  },
]);

export default WHOLE_EVEN_CERTIFICATE;
