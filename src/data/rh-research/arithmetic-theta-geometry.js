import { createResearchModule } from './module-contract.js';

const tex = String.raw;
const CHECKPOINT = 'research-checkpoints/rh-arithmetic-theta-2026-11-20/geometric-compression';
const PUBLIC_TREE = 'https://github.com/judegomila/zeta-explorer/blob/main';
const EXTERNAL_COMMIT = 'c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2';
const HISTORICAL_COMMIT = '2c628f61cdee35e3af7a2e23da43eaaf716fb8dd';

const checkpointArtifact = (label, file, sha256, requiredForClaim = false) => ({
  label,
  path: `${CHECKPOINT}/${file}`,
  availability: 'available',
  requiredForClaim,
  sha256,
  href: `${PUBLIC_TREE}/${CHECKPOINT}/${file}`,
});

export const ARITHMETIC_THETA_GEOMETRY = createResearchModule({
  schemaVersion: 1,
  id: 'arithmetic-theta-geometry',
  route: '/rh-arithmetic-theta-geometry',
  title: 'Arithmetic theta geometry: a conditional reduction',
  updatedAt: '2026-11-20',
  status: 'conditional-reduction',
  rhStatus: 'open',
  reviewScope: 'internal',
  reviewStatus: 'conditional',
  summary:
    'Version 0.2 removes an unnecessary support-counting factor, identifies the exact minimum lattice cost, and locates the source’s selected arithmetic family and window endpoint. ' +
    'The twin-ladder completion criterion is an exact reformulation of the remaining prime-ramp estimate; RH remains open in this work.',
  bodyPath: 'research/rh/modules/arithmetic-theta-geometry.md',

  claimBoundary: {
    title: 'Sharper compression and source map; arithmetic validation remains open',
    statement:
      'This is a conditional research note, not a complete compression of an RH proof. ' +
      'The finite geometry, packing refinement, and lattice-cost equivalence are proved. ' +
      'Source constructors have been located, but their complete mathematical dependencies and a direct arithmetic realization of the twin-ladder form remain unverified here.',
    doesNotClaim: [
      'No RH proof, new general geometric theorem, or external peer review is claimed.',
      'Finite algebra checks and a static import inventory do not constitute a Lean build, axiom-closure audit, or independent kernel replay.',
    ],
  },

  theorem: {
    label: 'Finite frame and projection theorem',
    statement:
      'Actual Gram maps preserve a quantified amount of energy after source and ambient directions are removed. ' +
      'The constants reproduce the source’s Conclusion2Family; no uniform positive spectral gap is required.',
    hypotheses: [
      tex`Take a finite family of maps $T_u:E_u\to H$ between finite-dimensional complex Hilbert spaces; write $d_u=\dim E_u$, $N=\dim H$, and $R=\sum_ud_u>0$.`,
      tex`Let $D_*>0$ and $e,\eta,\kappa,\delta\ge0$. The actual blocks $G_{uv}=T_u^*T_v$ satisfy the displayed defect bounds.`,
      tex`Use orthogonal projections $P_u,\Pi$ with $\sum_u\operatorname{rank}(I-P_u)\le\kappa R$ and $\operatorname{rank}(I-\Pi)\le\delta D_*$. Assume $\beta>0$ and put $r=\operatorname{rank}\Pi$.`,
    ],
    equations: [
      {
        id: 'actual-gram-defects',
        label: 'Diagonal and off-diagonal hypotheses',
        tex: tex`\begin{aligned}\|G_{uu}-I\|_{\mathrm{HS}}^2&\le e d_u,\\ \|G_{uv}\|_{\mathrm{HS}}^2&\le(1+\eta)d_ud_v/D_*\quad(u\ne v).\end{aligned}`,
      },
      {
        id: 'frame-projection-constants',
        label: 'Exact projection-loss constants',
        tex: tex`\begin{aligned}\alpha&=1+\eta+(1+\sqrt e)^2D_*/R,\\ \beta&=1-\sqrt e-\kappa-\sqrt{\kappa e}-\sqrt{\delta\alpha}.\end{aligned}`,
      },
      {
        id: 'frame-trace-and-moment',
        label: 'Surviving energy',
        tex: tex`\begin{aligned}Q&=\Pi\left(\sum_uT_uP_uT_u^*\right)\Pi\succeq0,\\ \operatorname{tr}Q&\ge\beta R,\qquad \operatorname{tr}(Q^2)\le\alpha R^2/D_*.\end{aligned}`,
      },
      {
        id: 'source-shaped-rank-bound',
        label: 'Second moment and effective rank',
        tex: tex`\begin{aligned}\operatorname{tr}(Q^2)&\le\frac{\alpha(\operatorname{tr}Q)^2}{\beta^2D_*}\le\frac{N}{D_*}\frac{\alpha}{\beta^2}\frac{(\operatorname{tr}Q)^2}{r},\\ \operatorname{rank}Q&\ge\frac{(\operatorname{tr}Q)^2}{\operatorname{tr}(Q^2)}\ge\frac{\beta^2D_*}{\alpha}.\end{aligned}`,
        explanation: 'Zero eigenvalues are permitted. The source-shaped bound includes the harmless factor N/r.',
      },
    ],
  },

  derivation: [
    {
      id: 'frame-energy-accounting',
      title: 'Account for the complete frame energy',
      body:
        'The squared Hilbert–Schmidt norm sums every ordered Gram block. Cauchy–Schwarz then bounds both projection losses, retaining all cross terms.',
      equations: [
        {
          id: 'gram-energy-identity',
          tex: tex`S=\sum_uT_uT_u^*,\qquad \operatorname{tr}(S^2)=\sum_{u,v}\|T_u^*T_v\|_{\mathrm{HS}}^2`,
        },
      ],
    },
    {
      id: 'singular-schur-geometry',
      title: 'Interpret the Schur residual as squared distance',
      body:
        'For independently constructed maps into one positive Hilbert space, the Moore–Penrose inverse handles singular even blocks. ' +
        'Applying this to the intended Weil form still requires an arithmetic identification of every block.',
      equations: [
        {
          id: 'schur-gram-data',
          tex: tex`D=C_e^*C_e,\quad B=C_e^*C_o,\quad E=C_o^*C_o,\quad \Pi_e=C_eD^\dagger C_e^*`,
        },
        {
          id: 'squared-distance-residual',
          tex: tex`\begin{aligned}E-B^*D^\dagger B&=C_o^*(I-\Pi_e)C_o\succeq0,\\ y^*(E-B^*D^\dagger B)y&=\min_x\|C_oy-C_ex\|^2.\end{aligned}`,
        },
      ],
    },
    {
      id: 'packing-without-support-split',
      title: 'Count integral labels without splitting their zero coordinates',
      body:
        'Let E be a CM field of degree 2f and Phi one embedding from each conjugate pair. ' +
        'Take integers 0 ≤ j ≤ r, positive scales s_l, and a finite set A of distinct integral sequences with a_0 = 1 and a_l = 0 for l > j. ' +
        'The fixed initial coordinate and zero tail make the first j coordinates injective labels. The maximum below includes 1 even when j = 0.',
      equations: [
        {
          id: 'integral-label-packing-definitions',
          tex: tex`\begin{aligned}\Sigma_\sigma(a)&=\max\!\left(\{1\}\cup\{|\sigma(a_\ell)|/s_\ell:1\le\ell\le j\}\right),\\ K(a)&=\prod_{\sigma\in\Phi}\Sigma_\sigma(a),\qquad R_\ell=\max(1,s_\ell).\end{aligned}`,
        },
        {
          id: 'integral-label-packing-no-support-factor',
          tex: tex`\sum_{a\in A}K(a)^{-3r}\le\prod_{\ell=1}^{j}(18R_\ell)^{2f}`,
          explanation:
            'An integral nonzero difference has nonzero integer norm, giving multiplicative separation. ' +
            'Zero coordinates have weight one, so one product argument removes the source’s extra factor 2^j. The constant 18 already appears in its packing proof.',
        },
      ],
    },
    {
      id: 'exact-minimum-complete-cost',
      title: 'Separate the unavoidable index cost from anisotropy',
      body:
        'For an injective integral map of real Euclidean lattices of positive rank r, let N be the saturation of its image, I its index there, and s_l its positive singular values. ' +
        'The complete Hilbert–Schmidt cost equals log I plus an explicit nonnegative term. Rank-one multiplication by Q attains the unrestricted minimum. ' +
        'Uniform metric rescaling preserves the complete cost; arbitrary anisotropic changes can remove only the excess above log I.',
      equations: [
        {
          id: 'complete-cost-exact-slack',
          tex: tex`\begin{aligned}\mathcal C(T)&=\log\frac{\operatorname{covol}L}{\operatorname{covol}N}+\frac r2\log\frac{\|T\|_{\mathrm{HS}}^2}{r}\\ &=\log I+\frac r2\log\frac{r^{-1}\sum_{\ell=1}^r s_\ell^2}{(\prod_{\ell=1}^r s_\ell^2)^{1/r}}.\end{aligned}`,
        },
        {
          id: 'complete-cost-minimum',
          tex: tex`\min_{\substack{T\text{ injective integral}\\ I(T)\ge Q}}\mathcal C(T)=\log Q\qquad(Q\in\mathbb N,\ Q\ge1)`,
          explanation:
            'With freely chosen lattices and metrics, the proposed Q-index cost condition is equivalent to the scalar prime-ramp estimate. ' +
            'An independent estimate for the specified arithmetic construction is still required.',
        },
      ],
    },
  ],

  verification: {
    result: 'Four companion checkers cover frame geometry, lattice rounding, arithmetic packing, and the cost/window refinements. The new ladder checker records 21 passing exact checks.',
    scope:
      'General proofs are supplied in the manuscript and companion notes. The pinned static inventory reaches 175,187 project Lean files from Main; this is an import count, not a count of verified proof dependencies. No Lean compilation or independent kernel replay was performed.',
    reproducibilityStatus: 'partial',
    commands: [
      {
        label: 'Install the pinned algebra dependency',
        cwd: CHECKPOINT,
        command: 'python -m pip install -r requirements.txt',
      },
      {
        label: 'Frame identities and countercontrols',
        cwd: CHECKPOINT,
        command: 'python check_frame_geometry.py',
        expected: '10 exact checks pass.',
      },
      {
        label: 'Lattice and prime encoding checks',
        cwd: CHECKPOINT,
        command: 'python check_lattice_bridge.py',
        expected: '10 exact checks pass.',
      },
      {
        label: 'Integral labels and arithmetic compression',
        cwd: CHECKPOINT,
        command: 'python check_arithmetic_compression.py',
        expected: 'All exact arithmetic sanity checks pass; writes arithmetic_compression_checks.json.',
      },
      {
        label: 'Cost equivalence and window countercontrols',
        cwd: CHECKPOINT,
        command: 'python check_ladder_completion.py',
        expected: '21 exact checks pass; writes ladder_completion_check_results.json.',
      },
    ],
    artifacts: [
      {
        label: 'Geometric manuscript PDF',
        path: 'public/research/rh/arithmetic-theta-geometry/RH_Geometric_Compression.pdf',
        availability: 'available',
        requiredForClaim: true,
        sha256: 'e2688d1eb3efda83ae454aae83506076f1f72c44d9fcf20605582a52412e99bc',
        sizeBytes: 392672,
        href: '/research/rh/arithmetic-theta-geometry/RH_Geometric_Compression.pdf',
      },
      {
        label: 'Editable LaTeX manuscript',
        path: 'public/research/rh/arithmetic-theta-geometry/RH_Geometric_Compression.tex',
        availability: 'available',
        requiredForClaim: true,
        sha256: '16fa3863170c2fe34ebed401cd4eb143a32e9b415563f2f5bbb45abc57462e82',
        sizeBytes: 41352,
        href: '/research/rh/arithmetic-theta-geometry/RH_Geometric_Compression.tex',
      },
      {
        label: 'Canonical module note',
        path: 'research/rh/modules/arithmetic-theta-geometry.md',
        availability: 'available',
        requiredForClaim: true,
        sha256: '030000be2e15eb131726b38a307c2bba0948353c7802944008d7dafe8ae32203',
        href: `${PUBLIC_TREE}/research/rh/modules/arithmetic-theta-geometry.md`,
      },
      checkpointArtifact('Frame algebra report', 'FRAME_GEOMETRY_CHECKS.json', 'b731599cfcce6ab14c2caddbabf18eb171802690f7acc084a7b668f8207d431b'),
      checkpointArtifact('Lattice algebra report', 'LATTICE_BRIDGE_CHECKS.json', '7ad08875c25b69b872499112b4368f597669f93a72f80641d877e66b4e942e10'),
      checkpointArtifact('Arithmetic family and packing proof', 'ARITHMETIC_FAMILY.md', 'f2f9e3861ee8a9d5fa72f2dd892eb9185af3f806ba467ec7533d38967a87c32b'),
      checkpointArtifact('Exact cost and window bridge', 'LADDER_COMPLETION.md', '086fab4bb77b33c14b9cb138565bdff64a155ac2013bb283d339b2172592b061'),
      checkpointArtifact('S76 and selected Main route', 'S76_CLOSURE.md', 'e0fd4ecd0e62cc79b565ec3c94dcaa92f336b2b1a1e1a5645e9c816092a598a5'),
      checkpointArtifact('Selected source application map', 'S76_CLOSURE_MAP.json', 'a72f3bc45d44b5030b4691e2fda83a7a07a1f7259f9724e4a4740a274da081a6'),
      checkpointArtifact('Pinned static source inventory', 'SOURCE_SNAPSHOT.json', 'a2d49b258251faa8d42e14dfd572b15d69e709053311d9e45eec6841b5fb171d'),
      checkpointArtifact('Arithmetic compression check report', 'arithmetic_compression_checks.json', '266542a24db9a03d2e07b988b680422303706d13401f0e59888b310e19e5b362'),
      checkpointArtifact('Ladder completion check report', 'ladder_completion_check_results.json', '30e5acf9d1b571b806f2a2a830df3b8b387e3ddec1b4378b68c0fe6ca87efb38'),
      checkpointArtifact('Proof-obligation register', 'PROOF_OBLIGATIONS.md', 'afc967d6928d7cda5584164adde4b8f763f24ad5d000e4b3ca4fdd66023adac9', true),
      checkpointArtifact('Independent verification protocol', 'VERIFICATION_PROTOCOL.md', 'f9b4a734a292f9e229128d454c1cfa614babd4b3f7b05b0c3c01db3c806c40af'),
    ],
    replays: [],
    evidence: [
      {
        label: 'Located generic supplier and selected window route',
        kind: 'source-body inspection, not kernel verification',
        location: CHECKPOINT + '/S76_CLOSURE.md',
        href: PUBLIC_TREE + '/' + CHECKPOINT + '/S76_CLOSURE.md',
        note: 'The analytic level remains fixed; auxiliary arithmetic families may depend on epsilon when their comparison controls that same level.',
      },
      {
        label: 'Internal review and proof scope',
        kind: 'internal review',
        location: `${CHECKPOINT}/REVIEW.md`,
        href: `${PUBLIC_TREE}/${CHECKPOINT}/REVIEW.md`,
      },
    ],
  },

  failures: [],
  blockers: [
    {
      id: 'arithmetic-family-and-complete-cost',
      title: 'Validate the selected arithmetic route and its twin-ladder transport',
      statement:
        'The generic S76 supplier and a selected Main-family constructor have been located in source. ' +
        'Their deep arithmetic inputs, instance dependencies, and a direct map to the twin-ladder Weil form remain unverified here. ' +
        'The unrestricted lattice-cost condition is equivalent to the scalar RH target.',
      physicsAnalogy:
        'Coupled modes can each have positive self-energy while their interaction changes the combined energy. ' +
        'The squared-distance picture becomes valid only after the complete arithmetic form is identified with a positive energy.',
      nextTest:
        'Audit the selected kernel, arithmetic rows, mass and dimension normalization, uniform family estimates, and fixed-level window theorem. ' +
        'Then prove the precise whole-form transport into the twin-ladder test space.',
    },
  ],

  provenance: {
    sourceRefs: [
      {
        repository: 'leanprover-community/riemann-hypothesis',
        branch: 'commit-pinned source snapshot',
        commit: EXTERNAL_COMMIT,
        access: 'public',
        paths: [
          'src/Formalism/SharpRestriction/CuspSpanNormBounds/RelevantZeroGramTerms.lean',
          'src/Formalism/SharpRestriction/CuspSpanNormBounds/AdmissibleBoundsFromSource.lean',
          'src/Formalism/SharpRestriction/CuspSpanNormBounds/WeightedLatticeSum.lean',
          'src/Formalism/SharpRestriction/CuspSpanNormBounds/MinorIntegralityTorus.lean',
          'src/Formalism/SharpRestriction/CuspSpanNormBounds/KTwoCosetCount.lean',
          'src/Development/AbelianVarietyTheory/Proofs/FlagMeasures/OffK0Closed.lean',
          'src/Formalism/SharpRestriction/RamificationFrobenius/TotientGaloisClasses/TopWin.lean',
          'src/Formalism/LatticeSlopes/LatticeSlopesProofs/SlopeInequality.lean',
        ],
        note: 'Selected proof bodies and a pinned static import inventory were inspected. The src tree is unchanged from the earlier pin; theorem-term dependencies and independent replay remain unverified.',
      },
      {
        repository: 'judegomila/MathExplorer',
        branch: 'codex/rh-arithmetic-theta-completion-2026-11-20',
        commit: HISTORICAL_COMMIT,
        access: 'private-repository',
        paths: [`${CHECKPOINT}/RH_Geometric_Compression.tex`],
        note: 'Historical lineage only. The current public checkpoint contains the manuscript, proofs, audit, and checkers.',
      },
    ],
    curatorNote:
      'Version 0.2 supplies sharper finite reductions and a more precise source boundary. The window endpoint retains a fixed analytic level while auxiliary families may vary with epsilon. No historical novelty or complete RH proof is claimed.',
  },
});

export default ARITHMETIC_THETA_GEOMETRY;
