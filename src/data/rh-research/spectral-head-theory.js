import { createResearchModule } from './module-contract.js';

const tex = String.raw;
const SOURCE_COMMIT = 'ce6ab5bfd3329dabc1b4effeafecd63c79c617ff';
const BODY_SHA256 = '4f2ae023c08d8b5aad261f7e63d088ed0dfc4abbbb2d905cfe14a5bc27370247';

export const SPECTRAL_HEAD_THEORY = createResearchModule({
  schemaVersion: 1,
  id: 'spectral-head-theory',
  route: '/rh-spectral-head-theory',
  title: 'Spectral head theory: actual low-action modes',
  updatedAt: '2026-10-30',
  status: 'proved-estimate',
  reviewStatus: 'accepted',
  reviewScope: 'internal',
  rhStatus: 'open',
  summary:
    'Actual proved estimate / partial availability: an internally reviewed analytic proof chain constructs a large supported spectral head whose Weil-operator action and physical off-head coupling decay faster than any fixed logarithmic power. The complementary sector remains uncontrolled.',
  bodyPath: 'research/rh/modules/spectral-head-theory.md',

  claimBoundary: {
    title: 'An actual near-null head, not a complement theorem',
    statement: tex`For each fixed $r>0$, and all sufficiently large $\lambda$, the literal arithmetic image $\mathcal F_\lambda$ lies in $\operatorname{Dom}(H_\lambda)$ and satisfies $\|H_\lambda F\|\le C_r(1+\log\lambda)^{-r}\|F\|$. The construction keeps the source-origin and source-endpoint traces and proves an explicit rank lower bound. Availability is partial analytic source review: there is no numerical or executable replay.`,
    doesNotClaim: [
      'It does not prove a lower bound for the correctly projected complementary diagonal or its inverse-weighted Schur charge.',
      'It does not prove whole-even positivity, complement coercivity, or a finite-support spectral certificate.',
      tex`It does not claim that the whole transition head $\chi\ge1/2$ is near-null; the concentration-deficit selection is essential.`,
      tex`It does not make the constants or the sufficiently-large-$\lambda$ onset effective, and $r$ cannot grow with $\lambda$.`,
      'It does not identify an actual Weil ground space, prove a global or cofinal lower bound, or prove RH.',
      'Internal acceptance is not external peer review, proof-assistant verification, or a complete recursive archive of every classical input.',
    ],
  },

  theorem: {
    label: 'Actual near-null spectral-head theorem',
    statement: tex`Fix $r>0$, put $w=1+\log\lambda$, and use the positive-phase prolate modes with concentration deficit at most $a_\lambda=\lambda^{-4}w^{-(3+2r)}$. For all sufficiently large $\lambda$, their literal evenly reflected arithmetic images form a large subspace on which the actual supported Weil operator has norm at most $C_rw^{-r}$.`,
    hypotheses: [
      tex`The support parameter satisfies $\lambda>1$, $\ell=\log\lambda$, and the fixed-support Weil form uses the stated $5/4$ normalization on $X_\lambda=L^2_{\mathrm{even}}[-\ell,\ell]$.`,
      tex`The additive prolate convention is $c=2\pi\lambda^2$, with full additive norm one, signed eigenvalues $\chi_n$, and concentration deficits $\delta_n=1-|\chi_n|^2$.`,
      tex`The decay exponent $r>0$ is fixed before taking $\lambda$ sufficiently large; the proof does not permit $r=r(\lambda)$.`,
      'The selected current source/audit chain and its admitted classical analytic inputs are exactly those recorded in the dependency inventory.',
      'Unconditional Mertens/PNT and Chebyshev estimates are used; no RH-strength arithmetic cancellation is assumed.',
    ],
    equations: [
      {
        id: 'critical-head-definition',
        label: 'Critical power-four/logarithmic head',
        tex: tex`a_\lambda=\lambda^{-4}w^{-(3+2r)},\quad G_\lambda=\operatorname{span}\{e_n:\chi_n>0,\ \delta_n\le a_\lambda\}\cap\mathbf1^\perp,\quad \mathcal F_\lambda=E_{\rm even}G_\lambda`,
      },
      {
        id: 'actual-head-action',
        label: 'Actual supported action',
        tex: tex`\mathcal F_\lambda\subset\operatorname{Dom}(H_\lambda),\qquad \|H_\lambda F\|\le C_rw^{-r}\|F\|\quad(F\in\mathcal F_\lambda)`,
      },
      {
        id: 'spectral-head-rank',
        label: 'Guaranteed rank',
        tex: tex`\dim\mathcal F_\lambda\ge\lambda^2-\frac4{\pi^2}(\log\lambda)^2-\frac{3+2r}{\pi^2}\log\lambda\log(1+\log\lambda)-C_r\log\lambda`,
      },
      {
        id: 'physical-off-head-bridge',
        label: 'Physical head and off-head bounds',
        tex: tex`P_{\rm phys}(H_\lambda+M)P_{\rm phys}\ge(M-C_rw^{-r})P_{\rm phys},\qquad\|(I-P_{\rm phys})H_\lambda P_{\rm phys}\|\le C_rw^{-r}`,
        explanation:
          'These are actual physical logarithmic-L2 projector bounds. They do not control the complementary diagonal block.',
      },
    ],
  },

  derivation: [
    {
      id: 'exact-form-and-arithmetic-image',
      title: 'Fix the exact form, transforms, and literal arithmetic map',
      body:
        'The proof keeps the angular transform on logarithmic-window functions distinct from the additive transform on prolate sources. The continuum term already contains the old pole correction, and the finite arithmetic sum defines a literal map rather than an asserted isometry or ground-space projector.',
      equations: [
        {
          id: 'fixed-support-weil-form',
          tex: tex`q_\lambda(f,h)=\int a_\Gamma(t)\overline{\widehat f(t)}\widehat h(t)\,dt+\int_0^\infty e^{s/2}\{R_{f,h}(s)+R_{f,h}(-s)\}\,ds-\sum_{n\ge2}\frac{\Lambda(n)}{\sqrt n}\{R_{f,h}(\log n)+R_{f,h}(-\log n)\}`,
          explanation:
            'The form domain requires the stated logarithmic Fourier weight; no global ordinary-L2 Weil closure is asserted.',
        },
        {
          id: 'additive-fourier-convention',
          tex: tex`(C_\lambda g)(t)=\int_{-\lambda}^{\lambda}g(s)e^{2\pi ist}\,ds,\qquad(\mathcal F_{\rm add}v)(t)=\int_{\mathbb R}v(s)e^{2\pi ist}\,ds`,
        },
        {
          id: 'literal-arithmetic-image',
          tex: tex`(E_{\rm raw}g)(x)=e^{x/2}\sum_{1\le n<\lambda e^{-x}}g(ne^x),\qquad E_{\rm even}g=\tfrac12\{E_{\rm raw}g(x)+E_{\rm raw}g(-x)\}`,
        },
      ],
      notes: [
        'Only finitely many prime-power translations overlap at fixed support.',
        'No extra pole kernel is appended in the 5/4 normalization.',
      ],
    },
    {
      id: 'coordinate-gram-only',
      title: 'Establish the actual coordinate Gram without mistaking it for energy',
      body:
        'Paired sharp-source Poisson summation, the positive-head compression, the collar/channel lemmas, and the complete origin correction give an injective output-normalization estimate for every mean-zero source in the signed positive threshold head. This estimate is deliberately not promoted to an energy theorem.',
      equations: [
        {
          id: 'actual-coordinate-gram',
          tex: tex`\|E_{\rm even}g\|\ge\frac{\|g\|}{40\sqrt2\lambda}`,
        },
        {
          id: 'paired-poisson-identity',
          tex: tex`2L_{\rm even}g=P_v(I+C_\lambda)g+T_{\rm even}g-g(0)r_{\rm even}`,
        },
        {
          id: 'complete-origin-correction',
          tex: tex`\|r_{\rm even}\|^2=(2\lambda)^{-1}\int_1^{\lambda^2}|M_1(R)|^2\,dR=o(\lambda)`,
        },
      ],
      notes: [
        'The Poisson identity is a legitimate paired limit, not absolute convergence of an unpaired Fourier lattice series.',
        'The Gram estimate supplies injectivity and normalization only.',
      ],
    },
    {
      id: 'uniform-prolate-inputs',
      title: 'Close the uniform prolate row and origin estimates',
      body:
        'A fixed polynomial deficit window, a fixed deep split, KRD layer cake, endpoint control, and the exact concentration-defect diagonal yield the row and origin estimates needed by the trace repairs. No source trace is assumed zero.',
      equations: [
        {
          id: 'uniform-deficit-window',
          tex: tex`\lambda^{-5}\le a\le\lambda^{-3},\qquad b=\lambda^{-11}`,
        },
        {
          id: 'row-and-trace-control',
          tex: tex`\sum_{\delta_n\le a}|e_n(\lambda)|^2(\nu_n-\nu_{\rm ref})^2\le C\lambda c^2aw^3,\qquad|g(\lambda)|^2\le C\lambda aw\|g\|^2`,
        },
        {
          id: 'exact-origin-defect-bound',
          tex: tex`|g(0)|^2\le\frac{2a}{\pi^2\lambda}\|g\|^2`,
        },
      ],
      notes: [
        'The fixed split avoids applying a fixed-exponent theorem with a parameter-dependent exponent.',
        'The origin estimate comes directly from the defect diagonal, not a missing origin-trace lemma.',
      ],
    },
    {
      id: 'source-repairs-and-two-tails',
      title: 'Pay for endpoint and origin repairs at the correct bandwidth',
      body:
        'A bandwidth-scale endpoint profile and a compact origin corrector place the repaired source in the declared radical class. The origin corrector has zero visible arithmetic image, while the endpoint image is charged explicitly. Both reflected exterior tails remain in the estimate.',
      equations: [
        {
          id: 'repaired-source',
          tex: tex`v=g-b_gp-d_g\eta_\lambda,\qquad b_g=g(\lambda),\quad d_g=g(0),\quad h=(4\lambda)^{-1}`,
        },
        {
          id: 'visible-repair-identity',
          tex: tex`F_v=F_g-b_gF_p`,
        },
        {
          id: 'two-tail-profile',
          tex: tex`a_v(s)=\frac1{2\sqrt2}\sum_{m\ge1}R_mU_v(s),\qquad U_v(s)=\sqrt{2\lambda}e^{s/2}(\mathcal F_{\rm add}v)(\lambda e^s)`,
        },
        {
          id: 'weighted-two-tail-bound',
          tex: tex`\|e^sa_v\|\le C\sqrt a\,w^{3/2}\|g\|`,
        },
      ],
      notes: [
        'Making the endpoint repair arbitrarily thinner would increase its Fourier derivative cost.',
        'The two-tail profile is the full evenly reflected arithmetic image, not one additive mode.',
      ],
    },
    {
      id: 'actual-action-transfer',
      title: 'Transfer the radical tail estimate to the actual supported action',
      body:
        'The paired radical form annihilates the full repaired arithmetic image by the Weil explicit formula. A separate Carleman/continuum/prime theorem converts the exterior tails into an actual operator-action bound, and the endpoint-repair image is charged rather than discarded.',
      equations: [
        {
          id: 'tail-to-window-action',
          tex: tex`\|H_\lambda F_v\|\le C\lambda\|e^sa_v\|`,
        },
        {
          id: 'endpoint-repair-action',
          tex: tex`F_p\in\operatorname{Dom}(H_\lambda),\qquad\|H_\lambda F_p\|\le C\sqrt{\lambda w}`,
        },
        {
          id: 'pre-normalized-action',
          tex: tex`\|H_\lambda F_g\|\le C\lambda\sqrt a\,w^{3/2}\|g\|`,
        },
        {
          id: 'normalized-uniform-action',
          tex: tex`\frac{\|H_\lambda F_g\|}{\|F_g\|}\le C\lambda^2\sqrt a\,w^{3/2}`,
        },
      ],
      notes: [
        'The action theorem includes both exterior tails and the growing cross-prime charge.',
        'A small quadratic energy by itself would not imply the operator-action estimate.',
      ],
    },
    {
      id: 'rank-and-physical-projection',
      title: 'Count the selected head and state the physical bridge',
      body:
        'The checked KRD prefix supplies positive-phase labels at the critical cutoff. The mean constraint costs one dimension, injectivity preserves the count, and the actual action bound yields the physical diagonal and off-head estimates. None of these steps controls the complementary diagonal.',
      equations: [
        {
          id: 'krd-positive-prefix',
          tex: tex`n\le\lfloor4\lambda^2\rfloor-7-\frac2{\pi^2}\log(200\lambda^2+25)\log(10/a_\lambda),\qquad n\equiv0\pmod4`,
        },
      ],
      notes: [
        'Karnik–Romberg–Davenport Corollaries 3–4 are used in the stated normalization.',
        'The lower bound is a guaranteed rank, not an exact dimension formula.',
      ],
    },
  ],

  verification: {
    result:
      'PASS for the frozen publication bytes and the internally reviewed 18-unit analytic dependency chain. This is partial source availability, not an executable or numerical replay.',
    scope:
      'Hash and dependency verification covers the canonical theorem body, 18 selected proof-use sources, 18 audit notes, and 18 audit/source-hash receipts. Classical proofs and auxiliary scalar-check outputs referenced by those audits are not exhaustively bundled.',
    reproducibilityStatus: 'partial',
    commands: [
      {
        label: 'Verify the scoped spectral-head publication',
        cwd: '.',
        command: 'node scripts/verify-rh-spectral-head-publication.mjs',
        expected:
          'All 58 published hashes, the 18-unit dependency graph, provenance, scope boundaries, and source/audit pairing pass.',
      },
      {
        label: 'Verify raw publication hashes',
        cwd: '.',
        command: 'shasum -a 256 -c research/rh/spectral-head/PUBLICATION_SHA256SUMS',
        expected: 'Every listed canonical body, source, audit note, and receipt reports OK.',
      },
    ],
    artifacts: [
      {
        label: 'Canonical spectral-head theorem body',
        path: 'research/rh/modules/spectral-head-theory.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: BODY_SHA256,
        sizeBytes: 15174,
      },
      {
        label: 'Proof-use dependency inventory',
        path: 'research/rh/spectral-head/DEPENDENCY_INVENTORY.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: 'e37d720c68f81af7ee25784ae6914c8a96670361aa2b9278353897b785f8804d',
        sizeBytes: 41622,
      },
      {
        label: 'Source and editorial provenance',
        path: 'research/rh/spectral-head/SOURCE_PROVENANCE.json',
        requiredForClaim: true,
        availability: 'available',
        sha256: '89716e9874921c109c44df5ac5b271eb677ab4fb4bffb0449c6d3be723cd6c13',
        sizeBytes: 2501,
      },
      {
        label: 'Availability and replay-scope README',
        path: 'research/rh/spectral-head/README.md',
        requiredForClaim: false,
        availability: 'available',
        sha256: '508ec208d43ccb3ee82f9ad891c0e1a22e9ed1bdea99264032473e6e1bbccd96',
        sizeBytes: 3560,
      },
      {
        label: 'Publication SHA-256 manifest',
        path: 'research/rh/spectral-head/PUBLICATION_SHA256SUMS',
        requiredForClaim: false,
        availability: 'available',
        sha256: '1a625c474e5267b2dc994c35ce20e00f856b23c6fee174d0dc7c8c73c0fde01f',
        sizeBytes: 11100,
      },
    ],
    replays: [],
    evidence: [
      {
        label: 'Frozen publication integrity manifest',
        kind: 'integrity-manifest',
        location: 'research/rh/spectral-head/PUBLICATION_SHA256SUMS',
      },
      {
        label: 'Current proof-use dependency graph',
        kind: 'dependency-inventory',
        location: 'research/rh/spectral-head/DEPENDENCY_INVENTORY.json',
      },
      {
        label: 'Source and scope provenance',
        kind: 'source-manifest',
        location: 'research/rh/spectral-head/SOURCE_PROVENANCE.json',
      },
      {
        label: 'KRD concentration prefix input',
        kind: 'primary-literature',
        location: 'Karnik–Romberg–Davenport, arXiv:2006.00427v2, Corollaries 3–4',
        href: 'https://arxiv.org/pdf/2006.00427v2',
        note: 'The cited normalization and constants were checked; this package does not re-prove the paper.',
      },
    ],
  },

  blockers: [
    {
      id: 'whole-complement',
      title: 'The complementary sector has no proved floor',
      statement:
        'The current chain supplies neither a lower bound for the correctly projected complementary diagonal nor the inverse-weighted Schur charge needed to combine it with the near-null head.',
      physicsAnalogy:
        'We have isolated a large light sector and shown that it barely couples outward, but the heavy sector could still contain an unstable negative mode. Weak mixing does not determine the heavy-sector potential.',
      nextTest:
        'Prove a complement coercivity or inverse-weighted Schur estimate in the same physical logarithmic-L2 coordinates, without replacing the actual projector by an additive-coordinate surrogate.',
    },
    {
      id: 'ineffective-onset',
      title: 'The asymptotic onset is ineffective',
      statement:
        'The theorem holds eventually for each fixed decay exponent, but the proof does not produce a usable support threshold or a numerical spectral floor.',
      physicsAnalogy:
        'The renormalized low-energy law is established in the asymptotic regime, but the crossover scale into that regime has not been calibrated.',
      nextTest:
        'Quantify every eventual threshold in the prolate, channel, Mertens/PNT, and action-transfer inputs before comparing with finite-support certificates.',
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
          'research/rh/modules/spectral-head-theory.md',
          'research/rh/spectral-head/DEPENDENCY_INVENTORY.json',
          'research/rh/spectral-head/SOURCE_PROVENANCE.json',
          'research/rh/spectral-head/PUBLICATION_SHA256SUMS',
        ],
        note:
          'The focused source unit was independently reviewed and transported as additions only. Repository links require authorized private-repository access.',
      },
    ],
    sourceManifestPath: 'research/rh/spectral-head/SOURCE_PROVENANCE.json',
    evidenceManifestPath: 'research/rh/spectral-head/DEPENDENCY_INVENTORY.json',
    curatorNote:
      'The app maps the frozen provenance label proved-identity to the more precise proved-estimate result class: the accepted result is an actual operator estimate, not merely an identity. The full checksum-pinned canonical proof body renders below the structured summary.',
  },

  references: [
    'Karnik–Romberg–Davenport, Improved bounds for the eigenvalues of prolate spheroidal wave functions and discrete prolate spheroidal sequences, arXiv:2006.00427v2.',
    'The selected current proof-use sources and independent audit records listed in research/rh/spectral-head/DEPENDENCY_INVENTORY.json.',
  ],
});

const SPECTRAL_HEAD_EQUATIONS = Object.freeze([
  ...SPECTRAL_HEAD_THEORY.theorem.equations,
  ...SPECTRAL_HEAD_THEORY.derivation.flatMap((step) => step.equations),
]);

function equation(id) {
  return SPECTRAL_HEAD_EQUATIONS.find((entry) => entry.id === id);
}

function hasRuntimeControlCharacter(value) {
  if (typeof value === 'string') return /[\u0000-\u001f\u007f]/u.test(value);
  if (Array.isArray(value)) return value.some(hasRuntimeControlCharacter);
  if (value && typeof value === 'object') return Object.values(value).some(hasRuntimeControlCharacter);
  return false;
}

export const SPECTRAL_HEAD_THEORY_ASSERTIONS = Object.freeze([
  {
    name: 'spectral head is an actual proved estimate with RH open',
    holds: () => SPECTRAL_HEAD_THEORY.status === 'proved-estimate' &&
      SPECTRAL_HEAD_THEORY.reviewStatus === 'accepted' &&
      SPECTRAL_HEAD_THEORY.reviewScope === 'internal' &&
      SPECTRAL_HEAD_THEORY.rhStatus === 'open',
  },
  {
    name: 'critical head and actual supported action are explicit',
    holds: () => equation('critical-head-definition')?.tex.includes(
      tex`a_\lambda=\lambda^{-4}w^{-(3+2r)}`,
    ) && equation('actual-head-action')?.tex.includes(
      tex`\mathcal F_\lambda\subset\operatorname{Dom}(H_\lambda)`,
    ) && equation('actual-head-action').tex.includes(tex`C_rw^{-r}`),
  },
  {
    name: 'spectral-head quantifier keeps r fixed and onset ineffective',
    holds: () => SPECTRAL_HEAD_THEORY.theorem.hypotheses.some(
      (item) => item.includes(tex`r>0`) && item.includes(tex`r=r(\lambda)`),
    ) && SPECTRAL_HEAD_THEORY.claimBoundary.doesNotClaim.some(
      (item) => /constants.*onset effective/i.test(item),
    ),
  },
  {
    name: 'rank and physical off-head bridge are both displayed',
    holds: () => equation('spectral-head-rank')?.tex.includes(tex`\lambda^2-\frac4{\pi^2}`) &&
      equation('physical-off-head-bridge')?.tex.includes(
        tex`\|(I-P_{\rm phys})H_\lambda P_{\rm phys}\|`,
      ),
  },
  {
    name: 'coordinate Gram remains normalization rather than energy',
    holds: () => equation('actual-coordinate-gram')?.tex.includes(tex`40\sqrt2\lambda`) &&
      SPECTRAL_HEAD_THEORY.derivation.some(
        (step) => step.id === 'coordinate-gram-only' && /not promoted to an energy theorem/.test(step.body),
      ),
  },
  {
    name: 'source repairs retain origin endpoint and both tails',
    holds: () => equation('repaired-source')?.tex.includes(tex`v=g-b_gp-d_g\eta_\lambda`) &&
      equation('two-tail-profile')?.tex.includes(tex`\sum_{m\ge1}R_mU_v`) &&
      equation('weighted-two-tail-bound')?.tex.includes(tex`C\sqrt a\,w^{3/2}`),
  },
  {
    name: 'tail transfer is an operator-action theorem',
    holds: () => equation('tail-to-window-action')?.tex.includes(
      tex`\|H_\lambda F_v\|\le C\lambda\|e^sa_v\|`,
    ) && equation('normalized-uniform-action')?.tex.includes(
      tex`\lambda^2\sqrt a\,w^{3/2}`,
    ),
  },
  {
    name: 'whole complement remains an explicit physics-scoped blocker',
    holds: () => SPECTRAL_HEAD_THEORY.blockers.some(
      (blocker) => blocker.id === 'whole-complement' &&
        /complementary diagonal/.test(blocker.statement) &&
        /heavy sector/.test(blocker.physicsAnalogy),
    ) && SPECTRAL_HEAD_THEORY.claimBoundary.doesNotClaim.some(
      (item) => /whole-even positivity, complement coercivity/.test(item),
    ),
  },
  {
    name: 'partial analytic availability never masquerades as numerical replay',
    holds: () => SPECTRAL_HEAD_THEORY.verification.reproducibilityStatus === 'partial' &&
      SPECTRAL_HEAD_THEORY.verification.replays.length === 0 &&
      /no numerical or executable replay/i.test(SPECTRAL_HEAD_THEORY.claimBoundary.statement),
  },
  {
    name: 'canonical body hash and immutable source commit are pinned',
    holds: () => SPECTRAL_HEAD_THEORY.verification.artifacts.some(
      (artifact) => artifact.path === SPECTRAL_HEAD_THEORY.bodyPath &&
        artifact.sha256 === BODY_SHA256,
    ) && SPECTRAL_HEAD_THEORY.provenance.sourceRefs[0].commit === SOURCE_COMMIT,
  },
  {
    name: 'spectral-head runtime TeX keeps backslashes and has no control characters',
    holds: () => [
      tex`\lambda`,
      tex`\operatorname`,
      tex`\chi`,
      tex`\delta`,
      tex`\mathcal`,
      tex`\sqrt`,
    ].every((command) => SPECTRAL_HEAD_EQUATIONS.some((entry) => entry.tex.includes(command))) &&
      !hasRuntimeControlCharacter(SPECTRAL_HEAD_THEORY),
  },
]);

export default SPECTRAL_HEAD_THEORY;
