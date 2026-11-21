import { createResearchModule } from './module-contract.js';

const tex = String.raw;
const CHECKPOINT = 'research-checkpoints/rh-arithmetic-theta-2026-11-20/geometric-compression';
const PUBLIC_TREE = 'https://github.com/judegomila/zeta-explorer/blob/main';
const EXTERNAL_COMMIT = '712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9';
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
    'Frame projections, squared distances, weighted packing, and lattice costs explain a finite geometric part of the arithmetic route. ' +
    'The twin ladder supplies an exact prime encoding; the arithmetic estimate needed to complete the proof remains open in this synthesis.',
  bodyPath: 'research/rh/modules/arithmetic-theta-geometry.md',

  claimBoundary: {
    title: 'Partial geometric compression; arithmetic completion remains open',
    statement:
      'This is a conditional research note, not a complete compression of an RH proof. ' +
      'The finite geometry is proved; the decisive arithmetic family, kernel and dimension estimates, and combined chain cost remain unproved here.',
    doesNotClaim: [
      'No RH proof, new general geometric theorem, or external peer review is claimed.',
      'Twenty exact algebra checks do not independently replay the complete Lean project, its ultimate S76 supplier, or its import closure.',
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
  ],

  verification: {
    result: 'The two companion reports record 20 passing exact algebra checks.',
    scope:
      'General proofs are supplied in the manuscript. Symbolic examples check constants, singular cases, rounding, and countercontrols; they do not certify the missing arithmetic family or RH.',
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
    ],
    artifacts: [
      {
        label: 'Geometric manuscript PDF',
        path: 'public/research/rh/arithmetic-theta-geometry/RH_Geometric_Compression.pdf',
        availability: 'available',
        requiredForClaim: true,
        sha256: '2e2dee16450610a920caf39344bb7d141c2bf7366950dc2632c4d8cdd2de527d',
        sizeBytes: 327434,
        href: '/research/rh/arithmetic-theta-geometry/RH_Geometric_Compression.pdf',
      },
      {
        label: 'Editable LaTeX manuscript',
        path: 'public/research/rh/arithmetic-theta-geometry/RH_Geometric_Compression.tex',
        availability: 'available',
        requiredForClaim: true,
        sha256: '5bb7c50548fe6f107b3ec116726cc2b3e8e5a0dbc750a948974d227b362b364e',
        sizeBytes: 27146,
        href: '/research/rh/arithmetic-theta-geometry/RH_Geometric_Compression.tex',
      },
      {
        label: 'Canonical module note',
        path: 'research/rh/modules/arithmetic-theta-geometry.md',
        availability: 'available',
        requiredForClaim: true,
        sha256: '54052fd8d0a87e6c6faa9e06d76e6333ffe642eb76b76d502d0a7bca7219d849',
        href: `${PUBLIC_TREE}/research/rh/modules/arithmetic-theta-geometry.md`,
      },
      checkpointArtifact('Frame algebra report', 'FRAME_GEOMETRY_CHECKS.json', 'b731599cfcce6ab14c2caddbabf18eb171802690f7acc084a7b668f8207d431b'),
      checkpointArtifact('Lattice algebra report', 'LATTICE_BRIDGE_CHECKS.json', '7ad08875c25b69b872499112b4368f597669f93a72f80641d877e66b4e942e10'),
    ],
    replays: [],
    evidence: [
      {
        label: 'Source dependency audit',
        kind: 'bounded source inspection',
        location: `${CHECKPOINT}/SOURCE_DEPENDENCY_AUDIT.md`,
        href: `${PUBLIC_TREE}/${CHECKPOINT}/SOURCE_DEPENDENCY_AUDIT.md`,
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
      title: 'Construct the arithmetic family and prove its complete cost bound',
      statement:
        'The canonical note states a sufficient lattice-index and metric-cost inequality for every fixed epsilon and all sufficiently large X. ' +
        'Its implication is proved; its independent arithmetic hypotheses remain open in this synthesis.',
      physicsAnalogy:
        'Coupled modes can each have positive self-energy while their interaction changes the combined energy. ' +
        'The squared-distance picture becomes valid only after the complete arithmetic form is identified with a positive energy.',
      nextTest:
        'Verify the actual integral structures, uniform kernel and dimension estimates, and the costed passage to the signed prime discrepancy. A positive lift norm alone is insufficient.',
    },
  ],

  provenance: {
    sourceRefs: [
      {
        repository: 'Deicyde/riemann-hypothesis',
        branch: 'commit-pinned source snapshot',
        commit: EXTERNAL_COMMIT,
        access: 'public',
        paths: [
          'src/Formalism/SharpRestriction/CuspSpanNormBounds/RelevantZeroGramTerms.lean',
          'src/Formalism/SharpRestriction/CuspSpanNormBounds/AdmissibleBoundsFromSource.lean',
          'src/Formalism/SharpRestriction/CuspSpanNormBounds/WeightedLatticeSum.lean',
          'src/Formalism/LatticeSlopes/LatticeSlopesProofs/SlopeInequality.lean',
        ],
        note: 'Selected definitions and proof bodies were inspected; this record does not certify the complete external formalization.',
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
      'This synthesis explains a finite geometric module and a conditional completion target. Attribution to the announced arithmetic route does not make the remaining estimate a result of this module.',
  },
});

export default ARITHMETIC_THETA_GEOMETRY;
