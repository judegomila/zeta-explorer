import { createResearchModule } from './module-contract.js';

const tex = String.raw;
const SOURCE_COMMIT = '5864e2066640d2f7df21714e8aa14f4e4b7d56e7';
const SOURCE_TREE = '978347f62e926c975b19464754df7c534366c56c';
const BASE_SOURCE_COMMIT = 'd011a853ffa177fcaedd741616370a38feb37e00';
const BODY_SHA256 = '5342748924a4ff217157d6e931880d6e97e5a16d474752518c428ca69a855a1f';
const REPLAY_SHA256 = '05586d72a8253e098a37339b6ba51046419dde1e39297091fb74636222175c2b';

export const SPECTRAL_DENOMINATOR_REPAIR = createResearchModule({
  schemaVersion: 1,
  id: 'spectral-denominator-repair',
  route: '/rh-spectral-denominator-repair',
  title: 'Denominator repair: whole-even coercivity through √16.1',
  updatedAt: '2026-10-30',
  status: 'certified-finite',
  reviewStatus: 'accepted',
  reviewScope: 'internal',
  rhStatus: 'open',
  summary:
    'A distinct eighth-power whole-prime bound repairs the sufficient head–tail comparison at X = 161/10. The complete outward-rounded 2049+72+72 gate proves actual reflection-even coercivity through λ = √(161/10), with an existential positive constant, while preserving the earlier seventh-power failure as a failed surrogate rather than actual negativity.',
  bodyPath: 'research/rh/modules/spectral-denominator-repair.md',

  claimBoundary: {
    title: 'A repaired finite-support theorem, not a rewrite and not RH',
    statement:
      tex`For the canonical reflection-even supported Weil form, there is a constant $c_*>0$ such that $q_\lambda[f]\ge c_*\lVert f\rVert_2^2$ for every $1<\lambda\le\sqrt{161/10}$ on the full zero-extension logarithmic Fourier form domain.`,
    doesNotClaim: [
      'This follow-up does not rewrite the frozen √(16001/1000) certificate or erase the failed seventh-power X = 16.1 sufficient surrogate.',
      'The earlier negative whitened pivot did not prove a negative direction of the actual Weil form; it remains evidence only that one sufficient lower comparison failed.',
      'The constant is existential. The smallest LDL pivot, the tail diagonal, and other diagnostics are not advertised as a numerical coercivity floor for the complete coupled form.',
      'No odd-sector theorem, distinguished-ground-state identification, cofinal-support estimate, or proof of RH follows.',
      'Internal acceptance records repository mathematical/source review and replay, not external peer review or proof-assistant formalization.',
    ],
  },

  theorem: {
    label: 'Certified eighth-power denominator-repair theorem',
    statement:
      tex`Let $q_\lambda$ be the canonical supported Weil form below. For every $1<\lambda\le\sqrt{161/10}$ there exists the same $c_*>0$ such that $q_\lambda[f]\ge c_*\lVert f\rVert_2^2$ for every complex reflection-even form-domain vector $f$.`,
    hypotheses: [
      tex`Set $X=\lambda^2$, $a=\log\lambda$, $W=2a=\log X$, and extend functions on $[-a,a]$ by zero.`,
      tex`Use $\widehat f(t)=\int_{\mathbb R}f(x)e^{-itx}\,dx$ and the domain $\int_{\mathbb R}\log(2+|t|)|\widehat f(t)|^2dt<\infty$.`,
      tex`The endpoint is exact: $X=161/10$ and $\lambda=\sqrt{161/10}$.`,
      'Reflection-even means f(−x) = f(x); complex coefficients are allowed and the finite gates are Hermitian.',
      'The 2049-mode head is coupled to the entire infinite tail. The far-tail majorant and its remainder are the unchanged conservative objects from the frozen base package.',
      'Every numerical sign decision is made with outward Arb intervals at 1000-bit precision; midpoints may select elimination order but never establish a sign.',
    ],
    equations: [
      {
        id: 'repair-support-parameterization',
        label: 'Exact repaired support',
        tex: String.raw`X=\frac{161}{10},\qquad \lambda_*=\sqrt{\frac{161}{10}},\qquad W=\log\frac{161}{10}`,
      },
      {
        id: 'repair-form-domain',
        label: 'Canonical form domain',
        tex: String.raw`\mathcal V_{\lambda,+}=\left\{f\in L^2([-\log\lambda,\log\lambda]): f(-x)=f(x),\ \int_{\mathbb R}\log(2+|t|)|\widehat f(t)|^2dt<\infty\right\}`,
      },
      {
        id: 'repair-actual-form',
        label: 'Actual supported Weil form',
        tex: String.raw`q_\lambda[f]=\frac1{2\pi}\int_{\mathbb R}\!\left[\Re\psi\!\left(\frac54+\frac{it}2\right)-\log\pi\right]|\widehat f(t)|^2dt+2\Re\int_0^W e^{s/2}R_f(s)ds-2\Re\sum_{2\le n<\lambda^2}\frac{\Lambda(n)}{\sqrt n}R_f(\log n)`,
        explanation:
          tex`Here $R_f(s)=\int_{\mathbb R}\overline{f(x)}f(x+s)\,dx$. The $5/4$ gamma normalization already accounts for the old pole correction, and endpoint atoms have zero overlap.`,
      },
      {
        id: 'repair-coercive-conclusion',
        label: 'Whole-even conclusion',
        tex: String.raw`\exists\,c_*>0\quad\forall\,1<\lambda\le\sqrt{161/10}\quad\forall f\in\mathcal V_{\lambda,+}:\qquad q_\lambda[f]\ge c_*\lVert f\rVert_2^2`,
      },
    ],
  },

  derivation: [
    {
      id: 'preserve-failed-seventh-power-route',
      title: 'Keep the failed seventh-power comparison in its original state',
      body:
        'At the same physical support, the previous certificate had a positive 2049-dimensional core and positive 72-dimensional coefficient factor, but its first final whitened lower-surrogate pivot was rigorously negative. That was a real failure of a sufficient comparison, not a negative vector of the actual form. The repair changes neither the support nor the actual head and coupling data.',
      equations: [
        {
          id: 'preserved-failed-pivot',
          tex: String.raw`p_1^{(7)}=-0.674664753296947\ldots<0`,
          explanation:
            'The superscript labels the seventh-power sufficient route. This diagnostic is not an eigenvalue or energy of the actual Weil operator.',
        },
      ],
      notes: [
        'The earlier failed receipt remains byte-preserved in the frozen base package.',
        'No old source is relabeled as a numerical mistake and no failed-route evidence is deleted.',
      ],
    },
    {
      id: 'eighth-power-whole-prime-bound',
      title: 'Strengthen the whole-prime norm envelope',
      body:
        'An exact rational eighth-power path enumeration controls the entire supported prime-translation operator. It yields a smaller rational norm envelope and therefore lifts every tail denominator by one exact amount. This is a whole-operator bound, not a truncation of a Fourier matrix.',
      equations: [
        {
          id: 'old-new-prime-envelopes',
          tex: String.raw`P_{\rm old}=\frac{3805113}{10^6},\qquad P_{\rm new}=\frac{3790593}{10^6}`,
        },
        {
          id: 'exact-denominator-lift',
          tex: String.raw`\Delta=P_{\rm old}-P_{\rm new}=\frac{363}{25000}=0.014520`,
        },
      ],
      notes: [
        'The exhaustive receipt has 2,409,206 terminal rational states and 26,978 exact support breakpoints.',
        'The stronger prime bound is a load-bearing prerequisite, but it is not by itself the positivity theorem.',
      ],
    },
    {
      id: 'minimal-inverse-order-repair',
      title: 'Improve only the near inverse weights',
      body:
        'The stronger prime envelope raises the complete tail diagonal lower operator. Exact improved reciprocal weights are used for the near indices 2049 through 16384. For every farther index, the old monotone step profile still dominates the new reciprocal denominator, so the old all-head far majorant and remainder remain conservative without alteration.',
      equations: [
        {
          id: 'new-tail-lower-operator',
          tex: String.raw`D\ge\operatorname{diag}(d_{{\rm new},j})>0,\qquad d_{{\rm new},j}=d_{{\rm old},j}+\Delta`,
        },
        {
          id: 'old-far-majorant-remains-valid',
          tex: String.raw`\frac1{d_{{\rm new},j}}\le\frac1{d_{{\rm old},j}}\le\omega_{{\rm old},j}\qquad(j>16384)`,
        },
        {
          id: 'new-tail-floor',
          tex: String.raw`\inf_{j\ge2049}d_{{\rm new},j}>0.7425026529`,
          explanation:
            'This is a floor for the whole tail lower operator, not the numerical coercivity constant of the full coupled form.',
        },
      ],
      notes: [
        'No near-resonant channel is deleted and no moment is moved to another support.',
        'No unproved Loewner comparison between newly assembled signed coefficient matrices is used.',
      ],
    },
    {
      id: 'complete-repaired-schur-gate',
      title: 'Run the complete head and infinite-tail Schur gate',
      body:
        'The repaired sufficient head subtracts the complete near inverse charge, the unchanged majorized entire far tail, and the unchanged outward remainder. Factoring the far coefficient majorant reduces positivity to three complete outward-rounded gates.',
      equations: [
        {
          id: 'repaired-head-matrix',
          tex: String.raw`M=A_{\rm head}-\sum_{j=2049}^{16384}\frac{K_j^*K_j}{d_{{\rm new},j}}-P^*H_{\rm far}P-\varepsilon I`,
        },
        {
          id: 'repaired-schur-gates',
          tex: String.raw`C>0,\qquad H_{\rm far}>0,\qquad I-QC^{-1}Q^*>0,\qquad Q=F^*P,\ H_{\rm far}=FF^*`,
        },
        {
          id: 'repaired-gate-counts',
          tex: String.raw`2049\ \text{core pivots}+72\ \text{coefficient pivots}+72\ \text{whitened-Schur pivots}>0`,
        },
      ],
      notes: [
        'The energy anchor is zero and no positivity-producing rank-one lift is present.',
        'The smallest whitened pivot near 0.219924 is a sign diagnostic only, not a full-form eigenvalue floor.',
      ],
    },
    {
      id: 'lift-to-whole-even-coercivity',
      title: 'Lift the finite sign gates to the actual infinite-dimensional form',
      body:
        'The positive finite Schur lower form and the strictly positive entire-tail comparison give coercivity by block-form square completion. The finite Schur minimum, tail floor, and bounded triangular completion map provide an existential positive constant. Centered zero extension then passes the same constant to every smaller support.',
      equations: [
        {
          id: 'repaired-square-completion',
          tex: String.raw`q_{\lambda_*}[x+y]=\langle Sx,x\rangle+q_D[y+D^{-1}Kx],\qquad S=A_{\rm head}-K^*D^{-1}K>0`,
        },
        {
          id: 'repaired-existential-floor',
          tex: String.raw`S>0,\quad D\ge d_*I>0\quad\Longrightarrow\quad\exists c_*>0:\ q_{\lambda_*}[f]\ge c_*\lVert f\rVert_2^2`,
        },
      ],
      notes: [
        'The theorem is for the entire reflection-even form domain, not a finite Galerkin subspace.',
        'Zero-extension nesting is centered and norm preserving.',
      ],
    },
    {
      id: 'clean-overlay-replay',
      title: 'Bind the repair to the frozen base package',
      body:
        'The clean launcher creates a disposable overlay, verifies base and delta source hashes, regenerates the old and new prime receipts and all same-support moments, and reruns the small and complete gates. It compares all mathematical fields while excluding timing fields from equality checks.',
      equations: [
        {
          id: 'repair-replay-counts',
          tex: String.raw`10437\ \text{moment rows};\qquad 2049+72+72\ \text{positive gates};\qquad 428.85750794410706\ \text{seconds}`,
        },
      ],
      notes: [
        'The clean overlay used Python 3.12.14 and python-flint 0.9.0 with assertions enabled.',
        'The same-support cache digest is reused and checked; no X = 16.001 moment is substituted.',
        'The replay is a packaging/reproduction check alongside the separate independent internal mathematical/source audit.',
      ],
    },
  ],

  verification: {
    result:
      'PASS: 21 checksum-listed payloads, exact base dependency, the eighth-power prime receipt, all 10,437 same-support moment rows, and the complete 2049+72+72 repaired gates are bound to the accepted receipts. The earlier seventh-power lower-surrogate failure remains separately preserved.',
    scope:
      tex`Actual reflection-even supported-form coercivity for $1<\lambda\le\sqrt{161/10}$ with an existential positive constant. No numerical full-form floor, odd-sector theorem, cofinal-support result, external peer-review claim, or RH conclusion is replayed.`,
    reproducibilityStatus: 'current-replay',
    commands: [
      {
        label: 'Verify the separate repair publication inventory',
        cwd: '.',
        command: 'shasum -a 256 -c research/rh/spectral-repair/PUBLICATION_SHA256SUMS',
        expected: 'Every one of the 21 checksum-listed payload files prints OK.',
      },
      {
        label: 'Verify the app-bound publication contract',
        cwd: '.',
        command: 'node scripts/verify-rh-spectral-repair-publication.mjs',
        expected: 'Prints PASS with 21 payload files, the exact endpoint, 10,437 moments, and 2049+72+72 gates.',
      },
      {
        label: 'Replay the complete disposable repair overlay',
        cwd: '.',
        command: 'python research/rh/spectral-repair/replay.py --report /tmp/rh-repair-replay.json',
        expected:
          'PASS_COMPLETE_CLEAN_REPAIR_REPRODUCTION with assertions enabled; the destination report path must not already exist.',
      },
    ],
    artifacts: [
      {
        label: 'Canonical repair theorem and proof body',
        path: 'research/rh/modules/spectral-denominator-repair.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: BODY_SHA256,
        sizeBytes: 7013,
      },
      {
        label: 'Separate clean-overlay launcher',
        path: 'research/rh/spectral-repair/replay.py',
        requiredForClaim: true,
        availability: 'available',
        sha256: '8b96d457f1d9bb264137136fb9b915e5f6958aa32ede366371b3f8f012fc6563',
        sizeBytes: 5650,
      },
      {
        label: 'Repair/base dependency manifest',
        path: 'research/rh/spectral-repair/manifest.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: '5a470ac83c3f4d6d62164e835b9da6ca857cf9c440bb78ee5c4282f8d5ea2fd8',
        sizeBytes: 7922,
      },
      {
        label: 'Complete repaired finite gate receipt',
        path: 'research/rh/spectral-repair/reference/rh_attack_cycle_20261030/support_endpoint_X161_power8_repair/REPAIRED_FULL_EVEN_CERTIFICATE.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: '2b7edf024d6e8b0192d0bf5267f04a887daa99b9fcadbed72780d4c02302d992',
        sizeBytes: 31807,
      },
      {
        label: 'Independent complete reflection-even acceptance',
        path: 'research/rh/spectral-repair/reference/rh_attack_cycle_20261030/independent_review/GENERIC_X161_POWER8_COMPLETE_EVEN_POSITIVITY_AUDIT.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: '807899c0259a066005cbb0e49bd08f64ddf83e9772df6102439b5d58c4d37da8',
        sizeBytes: 15560,
      },
      {
        label: 'Complete clean-overlay replay receipt',
        path: 'research/rh/spectral-repair/validation/COMPLETE_CLEAN_REPAIR_REPLAY.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: REPLAY_SHA256,
        sizeBytes: 37588,
      },
      {
        label: 'Source and editorial provenance',
        path: 'research/rh/spectral-repair/SOURCE_PROVENANCE.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: '21ac5bab0d6e3fb281cda6dd0024d70f42fcb3b304bb7c0acc3b7db697c204f7',
        sizeBytes: 2934,
      },
    ],
    replays: [
      {
        label: 'Complete clean repair overlay',
        method:
          'Verify the frozen base and repair manifests, assemble a disposable overlay, regenerate old/new prime receipts and all same-support moments, run the small and full repaired gates, and compare every mathematical field.',
        outcome:
          'PASS_COMPLETE_CLEAN_REPAIR_REPRODUCTION in 428.85750794410706 seconds; 10,437 rows and every 2049+72+72 sign gate agree.',
        command: 'python research/rh/spectral-repair/replay.py --report /tmp/rh-repair-replay.json',
        evidence: [
          'research/rh/spectral-repair/validation/COMPLETE_CLEAN_REPAIR_REPLAY.json',
          'research/rh/spectral-repair/validation/STATIC_SOURCE_TRANSPORT_CHECK.json',
        ],
      },
      {
        label: 'Independent internal complete execution and audit',
        method:
          'Independently replay the eighth-power prerequisite and complete repaired gate, compare all nontiming fields, and audit the tail-order and block-Schur implication.',
        outcome:
          'PASS for actual reflection-even coercivity through √(161/10). This uses the same Arb implementation and is not external peer review, formal verification, or a second arithmetic library.',
        evidence: [
          'research/rh/spectral-repair/reference/rh_attack_cycle_20261030/independent_review/GENERIC_X161_POWER8_COMPLETE_EVEN_POSITIVITY_AUDIT.json',
          'research/rh/spectral-repair/reference/rh_attack_cycle_20261030/independent_review/generic_X161_power8_replay_workspace/INDEPENDENT_COMPLETE_REPAIRED_COMPARISON.json',
        ],
      },
    ],
    evidence: [
      {
        label: 'Repair publication SHA-256 manifest',
        kind: 'integrity-manifest',
        location: 'research/rh/spectral-repair/PUBLICATION_SHA256SUMS',
      },
      {
        label: 'Independent whole-even acceptance',
        kind: 'internal-review',
        location: 'research/rh/spectral-repair/reference/rh_attack_cycle_20261030/independent_review/GENERIC_X161_POWER8_COMPLETE_EVEN_POSITIVITY_AUDIT.md',
        note: 'Independent internal mathematical/source audit; not external peer review.',
      },
      {
        label: 'Producer implication note',
        kind: 'proof-note',
        location: 'research/rh/spectral-repair/source-tree/rh_attack_cycle_20261030/support_endpoint_X161_power8_repair/PRODUCER_RESULT_AND_REPAIR_IMPLICATION.md',
      },
      {
        label: 'Clean overlay validation',
        kind: 'replay-report',
        location: 'research/rh/spectral-repair/validation/COMPLETE_CLEAN_REPAIR_REPLAY.json',
      },
    ],
  },

  blockers: [
    {
      id: 'repair-cofinal-support',
      title: 'The repaired cavity is still finite',
      statement:
        tex`The theorem stops at $\lambda=\sqrt{161/10}$. RH-oriented use still requires control along an unbounded, cofinal family of supports or another mechanism that prevents the coercivity constant from collapsing.`,
      physicsAnalogy:
        'A resonator that stays gapped after one sharper boundary-layer calculation is still a finite cavity. The thermodynamic limit can soften even when every tested box is stable.',
      nextTest:
        'Extract support-uniform analytic bounds from the repaired denominator mechanism or identify a monotone continuation that survives as the walls recede.',
    },
    {
      id: 'repair-odd-sector',
      title: 'The orthogonal parity channel remains open',
      statement:
        tex`The certificate acts only on $\mathcal V_{\lambda,+}$. It supplies no lower bound on reflection-odd vectors.`,
      physicsAnalogy:
        'Closing the even polarization of a waveguide does not close the odd polarization; symmetry decouples channels but does not transfer their spectral gaps.',
      nextTest:
        'Construct and audit an odd-sector head/tail comparison or prove an exact parity-transfer principle on the canonical form domain.',
    },
    {
      id: 'repair-floor-not-explicit',
      title: 'The full-form constant is existential',
      statement:
        'The proof establishes a positive complete-form constant but does not extract a stable numerical value from the conditioned LDL data.',
      physicsAnalogy:
        'A positive stiffness test in nonorthogonal coordinates proves the structure resists displacement, but the smallest elimination pivot is not the coordinate-free normal-mode frequency.',
      nextTest:
        'Add condition-number-controlled spectral enclosures for the finite Schur form and the triangular completion map before advertising any numerical full-form floor.',
    },
  ],

  provenance: {
    sourceManifestPath: 'research/rh/spectral-repair/SOURCE_PROVENANCE.json',
    evidenceManifestPath: 'research/rh/spectral-repair/manifest.json',
    sourceRefs: [
      {
        repository: 'judegomila/mathexplorer',
        branch: 'codex/rh-module-source-staging-2026-10-30',
        commit: SOURCE_COMMIT,
        access: 'private-repository',
        paths: [
          'research/rh/modules/spectral-denominator-repair.md',
          'research/rh/spectral-repair/PUBLICATION_SHA256SUMS',
          'research/rh/spectral-repair/SOURCE_PROVENANCE.json',
          'research/rh/spectral-repair/manifest.json',
          'research/rh/spectral-repair/replay.py',
          'research/rh/spectral-repair/source-tree/rh_attack_cycle_20261030/support_endpoint_X161_power8_repair/PRODUCER_RESULT_AND_REPAIR_IMPLICATION.md',
          'research/rh/spectral-repair/reference/rh_attack_cycle_20261030/independent_review/GENERIC_X161_POWER8_COMPLETE_EVEN_POSITIVITY_AUDIT.md',
          'research/rh/spectral-repair/validation/COMPLETE_CLEAN_REPAIR_REPLAY.json',
        ],
        note:
          `Private-repository source slice pinned at tree ${SOURCE_TREE}. Repository access is required; the app does not imply a public download.`,
      },
      {
        repository: 'judegomila/mathexplorer',
        branch: 'codex/rh-module-source-staging-2026-10-30',
        commit: BASE_SOURCE_COMMIT,
        access: 'private-repository',
        paths: [
          'research/rh/modules/whole-even-certificate.md',
          'research/rh/spectral/manifest.json',
          'research/rh/spectral/replay.py',
          'research/rh/spectral/reference/rh_attack_cycle_20261030/support_endpoint_X161/GENERIC_FULL_EVEN_CERTIFICATE.json',
        ],
        note:
          'Frozen prerequisite package containing the earlier accepted √16.001 result and failed seventh-power X = 16.1 sufficient surrogate.',
      },
    ],
    curatorNote:
      'The repair is a separate review unit stacked on the frozen spectral package. Publication hashes establish byte identity; the theorem boundary comes from the canonical proof note, full receipts, independent internal audit, and block-form argument. No prior failure record was removed or reclassified.',
  },

  failures: [
    {
      id: 'preserved-x161-seventh-power-surrogate',
      title: 'Preserved seventh-power X = 16.1 surrogate failure',
      surrogate:
        'The frozen seventh-power whole-prime envelope fed the same-support finite-rank far-tail lower comparison and final whitened sufficient Schur matrix.',
      failureStage:
        tex`The 2049-dimensional core and 72-dimensional coefficient factor passed, but the first final whitened pivot was rigorously enclosed near $-0.674664753296947\ldots$.`,
      implication:
        'That earlier sufficient comparison could not certify the endpoint. The new eighth-power repair is a distinct stronger comparison, not a reinterpretation of the failed matrix.',
      nonImplications: [
        'The old negative pivot did not prove an actual negative vector, negative Schur complement, or negative Weil operator.',
        'It did not invalidate the frozen √(16001/1000) certificate.',
        'Its preservation does not conflict with a later distinct sufficient lower comparison passing at the same support.',
        'Neither the failed route nor its repair proves RH.',
      ],
      evidence: [
        {
          label: 'Frozen failed producer certificate',
          kind: 'outward-interval-receipt',
          location: 'research/rh/spectral/reference/rh_attack_cycle_20261030/support_endpoint_X161/GENERIC_FULL_EVEN_CERTIFICATE.json',
          note: 'Evidence for failure of a sufficient lower surrogate only.',
        },
        {
          label: 'Repair acceptance preserving the failure boundary',
          kind: 'internal-review',
          location: 'research/rh/spectral-repair/reference/rh_attack_cycle_20261030/independent_review/GENERIC_X161_POWER8_COMPLETE_EVEN_POSITIVITY_AUDIT.md',
        },
      ],
    },
  ],

  references: [
    'research/rh/modules/spectral-denominator-repair.md — complete canonical theorem, repair derivation, replay scope, and nonclaims.',
    'research/rh/modules/whole-even-certificate.md — frozen √16.001 theorem and original failed X = 16.1 surrogate boundary.',
    'research/rh/spectral-repair/README.md — separate delta-package layout and clean replay instructions.',
    'research/rh/spectral-repair/reference/rh_attack_cycle_20261030/independent_review/GENERIC_X161_POWER8_COMPLETE_EVEN_POSITIVITY_AUDIT.md — terminal independent internal acceptance.',
    'research/rh/spectral-repair/source-tree/rh_attack_cycle_20261030/support_endpoint_X161_power8_repair/PRODUCER_RESULT_AND_REPAIR_IMPLICATION.md — producer gate and block-form implication.',
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

export const SPECTRAL_DENOMINATOR_REPAIR_ASSERTIONS = Object.freeze([
  {
    name: 'spectral repair is accepted only internally and keeps RH open',
    holds: () => SPECTRAL_DENOMINATOR_REPAIR.reviewStatus === 'accepted' &&
      SPECTRAL_DENOMINATOR_REPAIR.reviewScope === 'internal' &&
      SPECTRAL_DENOMINATOR_REPAIR.rhStatus === 'open',
  },
  {
    name: 'spectral repair is a current finite certificate',
    holds: () => SPECTRAL_DENOMINATOR_REPAIR.status === 'certified-finite' &&
      SPECTRAL_DENOMINATOR_REPAIR.verification.reproducibilityStatus === 'current-replay',
  },
  {
    name: 'repaired theorem pins the exact endpoint and actual form domain',
    holds: () => SPECTRAL_DENOMINATOR_REPAIR.theorem.equations.some(
      (equation) => equation.id === 'repair-support-parameterization' && equation.tex.includes('161'),
    ) && SPECTRAL_DENOMINATOR_REPAIR.theorem.equations.some(
      (equation) => equation.id === 'repair-form-domain' && equation.tex.includes('\\mathcal V'),
    ) && SPECTRAL_DENOMINATOR_REPAIR.theorem.equations.some(
      (equation) => equation.id === 'repair-actual-form' && equation.tex.includes('\\Lambda(n)'),
    ),
  },
  {
    name: 'eighth-power repair records the exact 0.014520 lift',
    holds: () => SPECTRAL_DENOMINATOR_REPAIR.derivation.some(
      (step) => step.equations.some(
        (equation) => equation.id === 'exact-denominator-lift' &&
          equation.tex.includes('363') && equation.tex.includes('0.014520'),
      ),
    ),
  },
  {
    name: 'far majorant remains conservatively unchanged',
    holds: () => JSON.stringify(SPECTRAL_DENOMINATOR_REPAIR.derivation).includes(
      'old all-head far majorant and remainder remain conservative without alteration',
    ) && SPECTRAL_DENOMINATOR_REPAIR.derivation.some(
      (step) => step.equations.some((equation) => equation.id === 'old-far-majorant-remains-valid'),
    ),
  },
  {
    name: 'complete proof records all 2049+72+72 positive gates',
    holds: () => JSON.stringify(SPECTRAL_DENOMINATOR_REPAIR).includes('2049+72+72') &&
      SPECTRAL_DENOMINATOR_REPAIR.derivation.some(
        (step) => step.equations.some((equation) => equation.id === 'repaired-gate-counts'),
      ),
  },
  {
    name: 'full-form coercivity floor stays existential',
    holds: () => SPECTRAL_DENOMINATOR_REPAIR.claimBoundary.doesNotClaim.some(
      (claim) => claim.includes('existential') && claim.includes('not advertised'),
    ) && JSON.stringify(SPECTRAL_DENOMINATOR_REPAIR.derivation).includes('sign diagnostic only'),
  },
  {
    name: 'old seventh-power failure is preserved without actual-negativity claim',
    holds: () => SPECTRAL_DENOMINATOR_REPAIR.failures.length === 1 &&
      SPECTRAL_DENOMINATOR_REPAIR.failures[0].nonImplications.some(
        (claim) => claim.includes('did not prove an actual negative vector'),
      ) && SPECTRAL_DENOMINATOR_REPAIR.failures[0].implication.includes('distinct stronger comparison'),
  },
  {
    name: 'clean overlay receipt and timing are pinned',
    holds: () => SPECTRAL_DENOMINATOR_REPAIR.verification.artifacts.some(
      (artifact) => artifact.sha256 === REPLAY_SHA256 && artifact.requiredForClaim,
    ) && SPECTRAL_DENOMINATOR_REPAIR.verification.replays.some(
      (replay) => replay.outcome.includes('428.85750794410706'),
    ),
  },
  {
    name: 'all load-bearing repair artifacts are available and hashed',
    holds: () => SPECTRAL_DENOMINATOR_REPAIR.verification.artifacts
      .filter((artifact) => artifact.requiredForClaim)
      .every((artifact) => artifact.availability === 'available' && /^[a-f0-9]{64}$/.test(artifact.sha256)),
  },
  {
    name: 'repair runtime prose preserves representative TeX commands',
    holds: () => [
      [SPECTRAL_DENOMINATOR_REPAIR.claimBoundary.statement, [tex`\lambda`, tex`\ge`, tex`\lVert`]],
      [SPECTRAL_DENOMINATOR_REPAIR.theorem.statement, [tex`\sqrt`, tex`\lVert`]],
      [SPECTRAL_DENOMINATOR_REPAIR.verification.scope, [tex`\lambda`, tex`\le`, tex`\sqrt`]],
      [SPECTRAL_DENOMINATOR_REPAIR.blockers[0].statement, [tex`\lambda`, tex`\sqrt`]],
      [SPECTRAL_DENOMINATOR_REPAIR.failures[0].failureStage, [tex`\ldots`]],
    ].every(([value, tokens]) => tokens.every((token) => value.includes(token))),
  },
  {
    name: 'repair runtime text contains no destructive ASCII controls',
    holds: () => collectRuntimeStrings(SPECTRAL_DENOMINATOR_REPAIR).every(
      (value) => !/[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f]/.test(value),
    ),
  },
]);

export default SPECTRAL_DENOMINATOR_REPAIR;
