import { createResearchModule } from './module-contract.js';

const tex = String.raw;
const SOURCE_COMMIT = 'e37bb8e670572e22993206ab17df6579611c5436';
const BODY_SHA256 = '66d2a804f9721080b0faf4e323fa09b030a9a4c06d5598e2cc43b6937cb20174';

const SOURCE_ROOT = 'research/rh/signed-complement/source-tree/rh_attack_cycle_20261030';

export const SIGNED_COMPLEMENT = createResearchModule({
  schemaVersion: 1,
  id: 'signed-complement',
  route: '/rh-signed-complement',
  title: 'Signed clipping, the actual head, and a restricted safe complement',
  updatedAt: '2026-10-30',
  status: 'proved-identity',
  reviewStatus: 'accepted',
  reviewScope: 'internal',
  rhStatus: 'open',
  summary:
    'Actual supported zeta packets refute a strong positive clipping cap, yet lie asymptotically near the retained physical head. Exact adjoint and Möbius formulas then support a growing positive sector in the true complement. The full signed complement floor remains open, and the inherited analytic proof tree is only partially bundled.',
  bodyPath: 'research/rh/modules/signed-complement.md',

  claimBoundary: {
    title: 'Scoped analytic theorems with a partial dependency tree',
    statement:
      'The packet obstruction, physical-head projection, exact adjoint and inversion identities, and restricted safe-sector theorem are internally reviewed within their stated hypotheses. The safe-sector proof imports an accepted actual-head action theorem whose full transitive analytic dependencies are not bundled in this review unit.',
    doesNotClaim: [
      'It does not prove a uniform lower bound on every physical-complement direction, a cofinal-support floor, an actual ground-state identification, or RH.',
      'The failed strong $4M$ clipping cap is not a negative Weil vector and does not prove the actual form negative.',
      'The packet averages $m$ near $M$; it does not refute the earlier small-positive-threshold gate or the valid conditional rank lemmas.',
      'Small physical $L^2$ distance from the retained head is not small action of the unbounded Weil operator and gives no sign for the normalized residue.',
      'The positive source Fourier eigenvalue $\\chi>0$ is not an assertion that every actual retained-head energy is positive.',
      'The restricted sector theorem covers only the specified narrow-lobe subspace, not broad lobes, long prime-shift networks, or arbitrary complement vectors.',
      'The bundled four source/audit pairs are not a standalone complete proof tree, numerical replay, external peer review, or formal verification.',
      'It does not change any finite whole-even support endpoint; the complete finite spectral certificate is a separate review unit.',
    ],
  },

  theorem: {
    label: 'Clipping obstruction, head projection, and restricted-complement theorem',
    statement:
      'For every fixed $M>0$ and $1/2<\\theta<1$, actual supported bandlimited packets force the strong $4M$ clipping excess to grow at least as $N^{\\theta-1/2}\\log N$ along $X=2N$. The same packet family has relative physical distance $O((N\\log N)^{-1/2})$ from the actual retained head. Exact physical adjoint and finite Möbius-inversion identities describe its orthogonal complement, and—using the separately accepted actual-head action theorem—a specified complement sector of dimension asymptotic to $\\sqrt N/(16\\pi\\log^2N)$ has floor $(\\log N)/4$ for all sufficiently large $N$. No whole-complement floor follows.',
    hypotheses: [
      'For the clipping theorem, $M>0$ is fixed, $1/2<\\theta<1$, $X=2N$, $\\lambda=\\sqrt{2N}$, $\\ell=\\log\\lambda$, and $N$ tends through sufficiently large integers; the positive onset constant is not made explicit.',
      'The packet envelope $\\phi$ is fixed, real, even and Schwartz, has angular Fourier support in $[-1,1]$, and satisfies $\\|\\phi\\|_2=1$; $\\Delta=N^\\theta$.',
      'The retained source space uses the signed projector $1_{\\{\\chi>0,\\,1-\\chi^2\\le a_\\lambda\\}}(C_\\lambda)$ with $a_\\lambda=\\lambda^{-4}(1+\\ell)^{-7}$ and the exact mean-zero condition.',
      'Physical orthogonality is taken in the actual even $L^2[-\\ell,\\ell]$ norm, not a gamma-weighted metric.',
      'The restricted-sector transfer uses the separately accepted operator-domain estimate $\\|A_\\lambda P\\|\\le\\eta_\\lambda=O((1+\\ell)^{-2})$; its complete inherited trace-repair, coordinate-Gram, action-strip, radical-domain, and tail-transfer proof tree is not bundled here.',
    ],
    equations: [
      {
        id: 'strong-clipping-excess',
        label: 'Refuted strong clipping aggregate',
        tex: tex`E_\lambda=\sum_j\left(A_j-\frac{M}{12\ell}\right)_+,\qquad E_\lambda\ge c_{M,\theta,\phi}N^{\theta-1/2}\log N`,
        explanation: 'The lower bound holds for all sufficiently large integers $N$ along $X=2N$, with positive constant and unspecified onset.',
      },
      {
        id: 'actual-head-distance',
        label: 'Specific packet family approaches the actual head',
        tex: tex`\|(I-P)f_N\|\le C\sqrt{\Delta/N},\qquad \frac{\|(I-P)f_N\|}{\|f_N\|}\le\frac{C}{\sqrt{N\log N}}`,
      },
      {
        id: 'physical-adjoint',
        label: 'Exact physical adjoint',
        tex: tex`A_f(y)=\frac1{2\sqrt{|y|}}\sum_{n\le\lambda|y|}n^{-1/2}f\!\left(\log\frac{|y|}{n}\right)`,
        explanation: 'This holds almost everywhere for $1/\\lambda<|y|<\\lambda$, and $A_f=0$ for $|y|<1/\\lambda$.',
      },
      {
        id: 'restricted-sector-floor',
        label: 'Growing positive sector in the true complement',
        tex: tex`\dim QW_N\sim\frac{\sqrt N}{16\pi\log^2N},\qquad q[Qw]\ge\frac14\log N\,\|Qw\|^2`,
        explanation: 'The result is sector-specific and depends on the inherited actual-head action estimate.',
      },
    ],
  },

  derivation: [
    {
      id: 'clipping-symbol',
      title: 'Define the actual clipping symbol and its cell excess',
      body:
        'The symbol keeps the digamma, prime-power, and continuum pieces with the exact damping factor. At the proposed natural cutoff, its high positive deficit is integrated cell by cell. The strong route asked every cell mass to remain below $M/(12\\ell)$, or at least for the aggregate excess to grow only linearly in $\\ell$.',
      equations: [
        {
          id: 'symbol-components',
          tex: tex`a(t)=\Re\psi(5/4+it/2)-\log\pi,\quad P_X(t)=2\Re\sum_{d\le X}\Lambda(d)d^{-1/2+it}`,
        },
        {
          id: 'continuum-and-symbol',
          tex: tex`C_X(t)=2\Re\frac{\sqrt X X^{it}-1}{1/2+it},\quad d_X=P_X-C_X,\quad m(t)=(1-\delta)(a(t)+M)-d_X(t),\quad\delta=(1+\ell)^{-3}`,
        },
        {
          id: 'cell-masses',
          tex: tex`T_0=\frac{\pi X}{\ell},\quad v_{\rm high}=1_{|t|>T_0}[4M-m(t)]_+,\quad A_j=\int_{j/\ell}^{(j+1)/\ell}v_{\rm high}(t)\,dt`,
        },
      ],
    },
    {
      id: 'admissible-packet',
      title: 'Build an actual supported physical packet',
      body:
        'A fixed bandlimited Schwartz envelope localizes a Dirichlet polynomial near frequencies $\\pm N$. Its inverse Fourier transform is even, smooth, and strictly supported inside the physical interval. This makes the construction an admissible test rather than a coefficient-space relaxation.',
      equations: [
        {
          id: 'packet',
          tex: tex`R_N(t)=\sum_{n\le N}n^{-1/2+it},\quad F_+(t)=\phi\!\left(\frac{t-N}{\Delta}\right)e^{-it\log N/2}R_N(t),\quad F(t)=F_+(t)+F_+(-t)`,
        },
        {
          id: 'packet-support',
          tex: tex`\operatorname{supp}\mathcal F^{-1}F\subset\left[-\frac12\log N-\frac1\Delta,\frac12\log N+\frac1\Delta\right]\subset(-\ell,\ell)`,
        },
      ],
    },
    {
      id: 'zeta-and-arithmetic-pairing',
      title: 'Match zeta and the arithmetic product without an inadmissible dual sum',
      body:
        'Euler summation at $N+1/2$ supplies the one-sum zeta and derivative approximations uniformly on the packet. The divisor identity identifies every output up to $N$, while the Fourier support of $|\\phi|^2$ restricts cutoff-crossing pairs tightly enough that their normalized total is $o(1)$.',
      equations: [
        {
          id: 'one-sum-zeta',
          tex: tex`R_N(t)=\zeta(1/2-it)+O(N^{-1/2}),\qquad \sum_{n\le N}\frac{\log n}{\sqrt n}n^{it}=-\zeta'(1/2-it)+O(N^{-1/2}\log N)`,
        },
        {
          id: 'packet-norms',
          tex: tex`\|F\|_2^2=2\Delta(\log N+O(1)),\qquad\|F\|_\infty^2=O(\sqrt N)`,
        },
      ],
      notes: [
        'The proof does not extend a two-sum approximate functional equation to a dual length below one.',
      ],
    },
    {
      id: 'clipping-lower-bound',
      title: 'Convert the packet expectation into divergent clipping excess',
      body:
        'The functional equation is multiplied by conjugate zeta, not divided by zeta. The exact $5/4$ versus $1/4$ gamma correction and the actual continuum term remain in the estimate. After cellwise capped/excess splitting, the capped part absorbs at most one quarter of the $M$ budget and the excess must carry the remaining packet expectation.',
      equations: [
        {
          id: 'functional-equation-pairing',
          tex: tex`2\Re[-\zeta'(1/2-it)\overline{\zeta(1/2-it)}]=[\Re\psi(1/4+it/2)-\log\pi]|\zeta(1/2-it)|^2`,
        },
        {
          id: 'symbol-expectation',
          tex: tex`\int m|F|^2=(M+o(1))\|F\|^2,\qquad\int_{|t|\le T_0}[4M-m]_+|F|^2=o(\|F\|^2)`,
        },
        {
          id: 'excess-conclusion',
          tex: tex`E_\lambda\|F\|_\infty^2\ge\int e|F|^2\ge(11M/4-o(1))\|F\|^2`,
        },
      ],
      notes: [
        'The resulting lower bound refutes the strong $4M$ cap and aggregate hypothesis only.',
      ],
    },
    {
      id: 'actual-head-space',
      title: 'Identify the actual retained physical head',
      body:
        'The source-side prolate operator is cut by sign and small deficit, then restricted to mean zero. The actual finite arithmetic map transports that source space to the physical interval, where $P$ is the ordinary physical $L^2$ projection.',
      equations: [
        {
          id: 'signed-projector',
          tex: tex`\Pi_a=1_{\{\chi>0,\ 1-\chi^2\le a_\lambda\}}(C_\lambda),\qquad a_\lambda=\lambda^{-4}(1+\ell)^{-7},\qquad G_\lambda=\operatorname{ran}\Pi_a\cap1^\perp`,
        },
        {
          id: 'actual-arithmetic-map',
          tex: tex`E_{\rm raw}v(x)=e^{x/2}\sum_{n\ge1}v(ne^x),\qquad Ev(x)=\tfrac12(E_{\rm raw}v(x)+E_{\rm raw}v(-x)),\quad |x|\le\ell`,
        },
        {
          id: 'physical-head',
          tex: tex`\mathscr H_\lambda=E G_\lambda,\qquad P=P_{\mathscr H_\lambda}^{\text{physical }L^2}`,
        },
      ],
    },
    {
      id: 'packet-head-projection',
      title: 'Project this packet family near the actual head',
      body:
        'A mean-corrected additive source is placed strictly inside both cutoffs. Nonstationary integration by parts controls the exterior tail, positive symmetrization removes the negative source phase, a projected Gaussian repairs the exact mean, and the finite map bound transfers the source error to physical space. The result applies to this packet family, not all dangerous directions.',
      equations: [
        {
          id: 'finite-map-bound',
          tex: tex`\|E\|\le2\lambda`,
        },
        {
          id: 'relative-projection-error',
          tex: tex`\frac{\|(I-P)f_N\|}{\|f_N\|}\le\frac C{\sqrt{N\log N}}`,
        },
      ],
      notes: [
        'No normalized-residue action bound or sign conclusion follows from physical $L^2$ smallness alone.',
      ],
    },
    {
      id: 'adjoint-and-inversion',
      title: 'Write physical orthogonality and finite Möbius inversion exactly',
      body:
        'The physical adjoint contains a factor one half from the full additive-even norm. Orthogonality to the retained head becomes a projected adjoint equation. Finite Möbius inversion recovers the physical function because the inner divisor sum is exactly the Kronecker delta.',
      equations: [
        {
          id: 'orthogonality-equivalence',
          tex: tex`f\perp\mathscr H_\lambda\quad\Longleftrightarrow\quad\Pi_aA_f=c\Pi_a1\quad\text{for some scalar }c`,
        },
        {
          id: 'finite-mobius-inversion',
          tex: tex`f(x)=2e^{x/2}\sum_{d\le\lambda e^x}\frac{\mu(d)}dA_f(e^x/d)`,
        },
        {
          id: 'divisor-delta',
          tex: tex`\sum_{d\mid m}\mu(d)=1_{\{m=1\}}`,
        },
      ],
      notes: [
        'These exact identities give no favorable sign for arbitrary complement vectors.',
      ],
    },
    {
      id: 'restricted-safe-sector',
      title: 'Construct and transfer a growing narrow-lobe positive sector',
      body:
        'The first $K$ Dirichlet modes on a shrinking interval generate even wave packets centered near $\\pm(\\log N)/2$. Their high-frequency gamma energy dominates the countable overlapping prime shifts and the continuum term. The separately accepted full action estimate then pays for projection into the true physical complement.',
      equations: [
        {
          id: 'sector-scales',
          tex: tex`b=\tfrac12\log N,\qquad h=(\sqrt N\log^2N)^{-1},\qquad K=\left\lfloor\frac{\sqrt N}{16\pi\log^2N}\right\rfloor`,
        },
        {
          id: 'narrow-lobe',
          tex: tex`w_g(x)=2^{-1/2}\{e^{iN(x-b)}g(x-b)+e^{iN(-x-b)}g(-x-b)\}`,
        },
        {
          id: 'preprojection-floor',
          tex: tex`q[w]\ge\tfrac12\log N\,\|w\|^2`,
        },
        {
          id: 'action-transfer',
          tex: tex`\|A_\lambda P\|\le\eta_\lambda=O((1+\ell)^{-2}),\qquad q[Qw]\ge q[w]-3\eta_\lambda\|w\|^2\ge\tfrac14\log N\,\|Qw\|^2`,
        },
      ],
      notes: [
        'Projection may destroy narrow support; the full action estimate, not support transfer, pays for that change.',
        'The action estimate has bundled source and audit here, but its full inherited analytic dependency tree does not.',
      ],
    },
    {
      id: 'dependency-boundary',
      title: 'Keep the inherited analytic proof tree explicit',
      body:
        'The actual-head action theorem imports bandwidth-scale trace repair, mean-zero coordinate Gram normalization, a restricted deficit row, endpoint/action-strip and divided-difference estimates, and a radical-source tail-to-window action theorem. Several immediate sources are pinned by hash but not bundled or linked to immutable repository publications in this unit.',
      equations: [
        {
          id: 'availability-boundary',
          tex: tex`\text{bundled source/audit pairs}\ \subsetneq\ \text{transitive analytic proof tree}`,
        },
      ],
      notes: [
        'The separate spectral-head theory dependency unit must not be confused with the independent complete finite whole-even interval replay.',
      ],
    },
  ],

  verification: {
    result:
      'The eleven-file publication manifest pins the canonical body, four curated source/audit pairs, provenance, and dependency inventory. Internal mathematical audits accept the scoped analytic statements. The unit is only partially reproducible because the safe-sector action theorem has unbundled transitive analytic dependencies; no numerical replay applies.',
    scope:
      'Analytic source review covers the strong-clipping packet construction, actual-head projection for that family, exact physical adjoint and finite Möbius inversion, critical-power-four action theorem, and restricted safe sector. It does not independently republish or re-audit the complete inherited coordinate/Gram, trace-repair, action-strip, radical-domain, and tail-transfer chain.',
    reproducibilityStatus: 'partial',
    commands: [
      {
        label: 'Verify the curated signed-complement publication bytes',
        command: 'shasum -a 256 -c research/rh/signed-complement/PUBLICATION_SHA256SUMS',
        cwd: 'repository root',
        expected: 'All eleven listed bodies, source notes, audits, provenance, and dependency inventory report OK.',
      },
    ],
    artifacts: [
      {
        label: 'Canonical signed-complement body',
        path: 'research/rh/modules/signed-complement.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: BODY_SHA256,
        sizeBytes: 9350,
      },
      {
        label: 'Analytic dependency inventory',
        path: 'research/rh/signed-complement/ANALYTIC_DEPENDENCIES.md',
        requiredForClaim: true,
        availability: 'available',
        sha256: '9dbf18b4a95d19c1b076b230be16d7e5bd156a04080ebaa57bd6aa9c5fd41092',
        sizeBytes: 5226,
      },
      {
        label: 'Signed-complement source provenance',
        path: 'research/rh/signed-complement/SOURCE_PROVENANCE.json',
        requiredForClaim: false,
        availability: 'available',
        sha256: 'a283e38e74fa87d512833e1eba2321c8b0d4a6a0bb2cb55e6b729a3e500fc320',
        sizeBytes: 7821,
      },
      {
        label: 'Strong-clipping packet proof',
        path: `${SOURCE_ROOT}/gamma_complement_attack/BANDLIMITED_ZETA_PACKETS_REFUTE_FOUR_M_GATE.md`,
        requiredForClaim: true,
        availability: 'available',
        sha256: 'fdb99d965d4b24f117afc15f8765ab8564ddfb86ae10516d0ceeeae01375c178',
        sizeBytes: 13210,
      },
      {
        label: 'Strong-clipping independent audit',
        path: `${SOURCE_ROOT}/independent_review/BANDLIMITED_ZETA_PACKET_GATE_REFUTATION_AUDIT.md`,
        requiredForClaim: true,
        availability: 'available',
        sha256: '7a8b7d7b9cd87a235aafd27e2cd105475865d739f215a21865652c9068084c99',
        sizeBytes: 7117,
      },
      {
        label: 'Actual physical-head projection proof',
        path: `${SOURCE_ROOT}/gamma_complement_attack/ZETA_PACKET_TO_ACTUAL_POSITIVE_HEAD_PROJECTION.md`,
        requiredForClaim: true,
        availability: 'available',
        sha256: '07cc5553b73140d01604f2e0bad12fcb6789600ab1a995bd6eda4c4085a1c5e4',
        sizeBytes: 11381,
      },
      {
        label: 'Actual physical-head projection audit',
        path: `${SOURCE_ROOT}/independent_review/ZETA_PACKET_ACTUAL_HEAD_PROJECTION_AUDIT.md`,
        requiredForClaim: true,
        availability: 'available',
        sha256: '414fad7b679524cab7fa8baf41691e7a55c2c5df581d763f829f910af590493d',
        sizeBytes: 7500,
      },
      {
        label: 'Exact adjoint and restricted safe-sector proof',
        path: `${SOURCE_ROOT}/gamma_complement_attack/EXACT_PHYSICAL_ADJOINT_AND_NARROW_RESIDUE_SAFE_SECTOR.md`,
        requiredForClaim: true,
        availability: 'available',
        sha256: '94d3b9f59834ad3a12950bc5575f0722dd33f00faac629d91c1d3037f12a6bd6',
        sizeBytes: 7014,
      },
      {
        label: 'Restricted safe-sector independent audit',
        path: `${SOURCE_ROOT}/independent_review/NARROW_LOBE_TRUE_PHYSICAL_COMPLEMENT_AUDIT.md`,
        requiredForClaim: true,
        availability: 'available',
        sha256: '7f1c2afd0867056defc6990b115601e7eacc25898ed4809de8ab68154669f5ac',
        sizeBytes: 7198,
      },
      {
        label: 'Critical-power-four actual-head action theorem',
        path: `${SOURCE_ROOT}/weil_radical_tail_attack/CRITICAL_POWER_FOUR_LOG_TUNED_ACTUAL_ACTION_HEAD.md`,
        requiredForClaim: true,
        availability: 'available',
        sha256: 'a7a9854ca9c402821fbccde6aaa7767b734261ca0d2540aa42e8bb664e228636',
        sizeBytes: 5051,
      },
      {
        label: 'Critical-power-four action independent audit',
        path: `${SOURCE_ROOT}/independent_review/CRITICAL_POWER_FOUR_ACTION_HEAD_AUDIT.md`,
        requiredForClaim: true,
        availability: 'available',
        sha256: 'a81b909f45b076a0bbd8daa4b1ec8f97c377e6ec8a889d42ff928a1ed6c78961',
        sizeBytes: 4692,
      },
      {
        label: 'Bandwidth-scale trace-repair dependency',
        path: 'research/rh/signed-complement/unbundled/TRACE_REPAIRS_AT_BANDWIDTH_SCALE_AND_FULL_DEEP_HEAD_ACTION.md',
        requiredForClaim: true,
        availability: 'unavailable',
        note: 'Pinned original SHA-256 b1440ac746cdc6819010735b74bc78b55d44a24b82f32897c76129f3215bd1f6, but not bundled and no immutable repository publication link is asserted in this unit.',
      },
      {
        label: 'Mean-zero coordinate-Gram dependency',
        path: 'research/rh/signed-complement/unbundled/SHARP_SOURCE_POISSON_AND_ALL_HEAD_COORDINATE_CLOSURE.md',
        requiredForClaim: true,
        availability: 'unavailable',
        note: 'Pinned original SHA-256 fe914fb77a89eeddf77ccc2a425f2653307a15ff84c6fe8640819ac19d2b7faa, but not bundled; its own collar, Hardy, and channel dependencies remain outside this review unit.',
      },
      {
        label: 'Restricted-deficit spectral-row dependency',
        path: 'research/rh/signed-complement/unbundled/POLYNOMIAL_DEFICIT_WEIL_HEAD_ENERGY_TRANSFER.md',
        requiredForClaim: true,
        availability: 'unavailable',
        note: 'Pinned original SHA-256 120b7cec1e421b8dae7e63061460b9ccd6499f1958d388b27cdfad12df66c4c4, but not bundled and no immutable repository publication link is asserted in this unit.',
      },
      {
        label: 'Exact radical-domain and two-tail dependency',
        path: 'research/rh/signed-complement/unbundled/EXACT_RADICAL_WINDOW_IDENTITY_AND_TWO_TAIL_BRIDGE.md',
        requiredForClaim: true,
        availability: 'unavailable',
        note: 'Pinned original SHA-256 788280061df1d3acd494b47a95d85280b8a4646f79237ed5d4edcf7b8f421430, but not bundled and no immutable repository publication link is asserted in this unit.',
      },
      {
        label: 'Tail-to-window action-transfer dependency',
        path: 'research/rh/signed-complement/unbundled/CARLEMAN_TAIL_TO_WINDOW_WEIL_ACTION_TRANSFER.md',
        requiredForClaim: true,
        availability: 'unavailable',
        note: 'Pinned original SHA-256 fc903d4c2afebe561323ecf085661a1fadd6c854f1f284e4722434da40598bb1, but not bundled and no immutable repository publication link is asserted in this unit.',
      },
      {
        label: 'Additive endpoint-null frame dependency',
        path: 'research/rh/signed-complement/unbundled/ADDITIVE_THRESHOLD_ENDPOINT_NULL_VALUE_FRAME.md',
        requiredForClaim: true,
        availability: 'unavailable',
        note: 'Pinned original SHA-256 62cff67c897596caf6dfab6f8b09a1e71975aafe6ff643f33aec6ff2fe794b4c, but not bundled and no immutable repository publication link is asserted in this unit.',
      },
      {
        label: 'Mean-zero origin-trace dependency',
        path: 'research/rh/signed-complement/unbundled/MEAN_ZERO_ORIGIN_TRACE_AND_MOBIUS_POLE_ABSORPTION.md',
        requiredForClaim: true,
        availability: 'unavailable',
        note: 'Pinned original SHA-256 ab05993feef16a0dc83ea024e051ee19cf87b5fe77308148f138a61b7ecae5fc, but not bundled and no immutable repository publication link is asserted in this unit.',
      },
      {
        label: 'Physical finite-map and adjoint-convention dependency',
        path: 'research/rh/signed-complement/unbundled/EXACT_COMPLEMENT_AND_NESTED_FRAME_CROWDING.md',
        requiredForClaim: true,
        availability: 'unavailable',
        note: 'Pinned original SHA-256 52aee3c3d81d743f86c3b86ac3a25d93b6c87aa7742b0ba9551f4feba08cf236, but not bundled and no immutable repository publication link is asserted in this unit.',
      },
      {
        label: 'Finite Möbius-inverse cost follow-up',
        path: 'research/rh/signed-complement/pending/FINITE_MOBIUS_INVERSE_COST_SURVIVES_HEAD_REMOVAL.md',
        requiredForClaim: false,
        availability: 'pending',
        note: 'Explicitly excluded from the frozen release by SOURCE_PROVENANCE.json; it is not evidence for any displayed theorem and no publication hash is asserted.',
      },
      {
        label: 'Self-dual exterior-minimum follow-up',
        path: 'research/rh/signed-complement/pending/SELFDUAL_EXTERIOR_MINIMUM_AND_WEIGHTED_CHARGE_PORTS.md',
        requiredForClaim: false,
        availability: 'pending',
        note: 'Explicitly excluded from the frozen release by SOURCE_PROVENANCE.json; it is not evidence for any displayed theorem and no publication hash is asserted.',
      },
    ],
    replays: [
      {
        label: 'Scoped internal analytic reviews',
        method:
          'Each of the four bundled mathematical source notes was compared with its independent internal audit, including hypotheses, signs, norm conventions, domain restrictions, and explicit nonimplications.',
        outcome:
          'Accepted within the stated scope. This is source-level mathematical review, not a numerical replay, a full transitive dependency audit, external peer review, or formal verification.',
        evidence: [
          `${SOURCE_ROOT}/independent_review/BANDLIMITED_ZETA_PACKET_GATE_REFUTATION_AUDIT.md`,
          `${SOURCE_ROOT}/independent_review/ZETA_PACKET_ACTUAL_HEAD_PROJECTION_AUDIT.md`,
          `${SOURCE_ROOT}/independent_review/NARROW_LOBE_TRUE_PHYSICAL_COMPLEMENT_AUDIT.md`,
          `${SOURCE_ROOT}/independent_review/CRITICAL_POWER_FOUR_ACTION_HEAD_AUDIT.md`,
        ],
      },
    ],
    evidence: [
      {
        label: 'Canonical signed-complement mathematics',
        kind: 'analytic theorem and failure record',
        location: 'research/rh/modules/signed-complement.md',
      },
      {
        label: 'Explicit transitive dependency boundary',
        kind: 'partial-proof-tree inventory',
        location: 'research/rh/signed-complement/ANALYTIC_DEPENDENCIES.md',
        note: 'Several load-bearing inherited sources are pinned but not bundled in this review unit.',
      },
      {
        label: 'Source-to-publication mapping',
        kind: 'provenance',
        location: 'research/rh/signed-complement/SOURCE_PROVENANCE.json',
      },
      {
        label: 'Immutable private source commit',
        kind: 'private source',
        location: SOURCE_COMMIT,
        href: `https://github.com/judegomila/mathexplorer/tree/${SOURCE_COMMIT}`,
        note: 'Private repository access is required.',
      },
    ],
  },

  blockers: [
    {
      id: 'whole-physical-complement-floor',
      title: 'Control every physical-complement direction with sign intact',
      statement:
        'The proved sector excludes broad lobes and long prime-shift networks. The missing result is a uniform signed lower bound for arbitrary vectors in the true physical complement, with the actual head projection and operator domain preserved.',
      physicsAnalogy:
        'The theorem pressure-tests one growing family of narrow vibration modes. A bridge is certified only after every coupled mode—including broad and networked resonances—obeys the same load law.',
      nextTest:
        'Develop a cancellation-aware complement estimate that retains the physical head geometry instead of replacing the signed operator by a whole-space positive clipping norm.',
    },
    {
      id: 'complete-analytic-dependency-publication',
      title: 'Publish and re-audit the inherited action-theorem chain',
      statement:
        'The restricted-sector transfer uses a load-bearing actual-head action theorem whose trace-repair, coordinate-Gram, action-strip, radical-domain, and tail-transfer dependencies are not all bundled here.',
      physicsAnalogy:
        'The final beam calculation cites certified material constants, but several upstream calibration reports are not yet in the current binder. The calculation remains partial until that chain is published and checked as one unit.',
      nextTest:
        'Land the separately curated spectral-head theory dependency unit with immutable sources, audits, and the minimal transitive proof-use chain.',
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
          'research/rh/modules/signed-complement.md',
          'research/rh/signed-complement/ANALYTIC_DEPENDENCIES.md',
          'research/rh/signed-complement/SOURCE_PROVENANCE.json',
          'research/rh/signed-complement/PUBLICATION_SHA256SUMS',
          `${SOURCE_ROOT}/gamma_complement_attack/BANDLIMITED_ZETA_PACKETS_REFUTE_FOUR_M_GATE.md`,
          `${SOURCE_ROOT}/gamma_complement_attack/ZETA_PACKET_TO_ACTUAL_POSITIVE_HEAD_PROJECTION.md`,
          `${SOURCE_ROOT}/gamma_complement_attack/EXACT_PHYSICAL_ADJOINT_AND_NARROW_RESIDUE_SAFE_SECTOR.md`,
          `${SOURCE_ROOT}/weil_radical_tail_attack/CRITICAL_POWER_FOUR_LOG_TUNED_ACTUAL_ACTION_HEAD.md`,
          `${SOURCE_ROOT}/independent_review/BANDLIMITED_ZETA_PACKET_GATE_REFUTATION_AUDIT.md`,
          `${SOURCE_ROOT}/independent_review/ZETA_PACKET_ACTUAL_HEAD_PROJECTION_AUDIT.md`,
          `${SOURCE_ROOT}/independent_review/NARROW_LOBE_TRUE_PHYSICAL_COMPLEMENT_AUDIT.md`,
          `${SOURCE_ROOT}/independent_review/CRITICAL_POWER_FOUR_ACTION_HEAD_AUDIT.md`,
        ],
        note:
          'The source slice contains four curated source/audit pairs. The dependency inventory explicitly identifies pinned inherited files not bundled or asserted as immutably published here.',
      },
    ],
    sourceManifestPath: 'research/rh/signed-complement/SOURCE_PROVENANCE.json',
    curatorNote:
      'Published source transformations remove operational and private executor identifiers while retaining the mathematical sections. Hash identity establishes provenance, not theorem truth or completeness of the transitive proof tree.',
  },

  failures: [
    {
      id: 'strong-four-m-clipping-cap',
      title: 'Actual packets refute the strong $4M$ clipping cap',
      surrogate:
        'At $T_0=\\pi X/\\ell$, require every high-tail cell mass $A_j$ to be at most $M/(12\\ell)$, or weaken this to the aggregate excess estimate $E_\\lambda=O_M(\\ell)$.',
      failureStage:
        'For any fixed $1/2<\\theta<1$, admissible supported packets along $X=2N$ force $E_\\lambda\\ge c_{M,\\theta,\\phi}N^{\\theta-1/2}\\log N$ for all sufficiently large $N$.',
      implication:
        'A whole-space positive clipping norm at threshold $4M$ discards the packet cancellation and cannot supply the desired complement estimate. Any replacement must keep signed head geometry.',
      nonImplications: [
        'This is not a negative vector or a proof that the actual Weil form is negative.',
        'It is not a counterexample to RH.',
        'It does not refute the earlier small-positive-threshold gate because the packet averages $m$ near $M$.',
        'It does not refute the valid conditional rank lemmas or the restricted positive complement sector.',
        'It does not prove that every cancellation-aware complement route must fail.',
      ],
      evidence: [
        {
          label: 'Bandlimited packet counterexample',
          kind: 'analytic proof',
          location: `${SOURCE_ROOT}/gamma_complement_attack/BANDLIMITED_ZETA_PACKETS_REFUTE_FOUR_M_GATE.md`,
        },
        {
          label: 'Independent clipping audit',
          kind: 'internal mathematical review',
          location: `${SOURCE_ROOT}/independent_review/BANDLIMITED_ZETA_PACKET_GATE_REFUTATION_AUDIT.md`,
        },
      ],
    },
  ],

  references: [
    'research/rh/modules/signed-complement.md — canonical scoped theorem and failure record.',
    'research/rh/signed-complement/ANALYTIC_DEPENDENCIES.md — explicit bundled and unbundled analytic proof-use boundary.',
    'Classical zeta functional equation, second moment, balanced approximate functional equation, Poisson summation, and finite Möbius inversion as used with the exact hypotheses in the bundled proof notes.',
  ],
});

export const SIGNED_COMPLEMENT_ASSERTIONS = Object.freeze([
  {
    name: 'signed-complement module keeps RH open and review internal',
    holds: () => SIGNED_COMPLEMENT.status === 'proved-identity' &&
      SIGNED_COMPLEMENT.rhStatus === 'open' &&
      SIGNED_COMPLEMENT.reviewStatus === 'accepted' &&
      SIGNED_COMPLEMENT.reviewScope === 'internal',
  },
  {
    name: 'canonical body and source commit are pinned',
    holds: () => SIGNED_COMPLEMENT.verification.artifacts.some(
      (artifact) => artifact.path === SIGNED_COMPLEMENT.bodyPath && artifact.sha256 === BODY_SHA256,
    ) && SIGNED_COMPLEMENT.verification.artifacts.some(
      (artifact) => artifact.path === SIGNED_COMPLEMENT.provenance.sourceManifestPath &&
        artifact.sha256 === 'a283e38e74fa87d512833e1eba2321c8b0d4a6a0bb2cb55e6b729a3e500fc320',
    ) && SIGNED_COMPLEMENT.provenance.sourceRefs[0].commit === SOURCE_COMMIT,
  },
  {
    name: 'strong 4M clipping route is a scoped failed surrogate',
    holds: () => SIGNED_COMPLEMENT.failures.some(
      (failure) => failure.id === 'strong-four-m-clipping-cap' &&
        failure.failureStage.includes('N^{\\theta-1/2}') &&
        failure.nonImplications.some((item) => /not a negative vector/i.test(item)),
    ),
  },
  {
    name: 'strong clipping theorem preserves its exact TeX separator at runtime',
    holds: () => {
      const equation = SIGNED_COMPLEMENT.theorem.equations.find(
        (candidate) => candidate.id === 'strong-clipping-excess',
      );
      const expected = String.raw`E_\lambda=\sum_j\left(A_j-\frac{M}{12\ell}\right)_+,\qquad E_\lambda\ge c_{M,\theta,\phi}N^{\theta-1/2}\log N`;
      return equation?.tex === expected && equation.tex.includes(',\\qquad E_\\lambda') &&
        !/[\u0000-\u001f\u007f]/.test(equation.tex);
    },
  },
  {
    name: 'actual supported packet and head projection mathematics are displayed',
    holds: () => SIGNED_COMPLEMENT.derivation.some(
      (step) => step.id === 'admissible-packet' && step.equations.some((equation) => equation.id === 'packet-support'),
    ) && SIGNED_COMPLEMENT.theorem.equations.some(
      (equation) => equation.id === 'actual-head-distance' && equation.tex.includes('N\\log N'),
    ),
  },
  {
    name: 'physical adjoint retains one-half factor and finite Mobius inverse',
    holds: () => SIGNED_COMPLEMENT.theorem.equations.some(
      (equation) => equation.id === 'physical-adjoint' && equation.tex.includes('2\\sqrt{|y|}'),
    ) && SIGNED_COMPLEMENT.derivation.some(
      (step) => step.id === 'adjoint-and-inversion' && step.equations.some(
        (equation) => equation.id === 'finite-mobius-inversion',
      ),
    ),
  },
  {
    name: 'restricted sector dimension and floor remain sector scoped',
    holds: () => SIGNED_COMPLEMENT.theorem.equations.some(
      (equation) => equation.id === 'restricted-sector-floor' &&
        equation.tex.includes('16\\pi\\log^2N') && equation.tex.includes('\\frac14\\log N'),
    ) && SIGNED_COMPLEMENT.claimBoundary.doesNotClaim.some(
      (claim) => /restricted sector theorem covers only/i.test(claim),
    ),
  },
  {
    name: 'partial proof-tree availability is explicit and load-bearing',
    holds: () => SIGNED_COMPLEMENT.verification.reproducibilityStatus === 'partial' &&
      SIGNED_COMPLEMENT.verification.artifacts.filter(
        (artifact) => artifact.requiredForClaim && artifact.availability === 'unavailable',
      ).length === 8 && SIGNED_COMPLEMENT.verification.artifacts.filter(
        (artifact) => !artifact.requiredForClaim && artifact.availability === 'pending',
      ).length === 2 && SIGNED_COMPLEMENT.blockers.some(
        (blocker) => blocker.id === 'complete-analytic-dependency-publication',
      ),
  },
  {
    name: 'module does not masquerade as standalone replay or whole-complement theorem',
    holds: () => SIGNED_COMPLEMENT.claimBoundary.doesNotClaim.some(
      (claim) => /standalone complete proof tree, numerical replay/i.test(claim),
    ) && SIGNED_COMPLEMENT.blockers.some(
      (blocker) => blocker.id === 'whole-physical-complement-floor',
    ),
  },
]);

export default SIGNED_COMPLEMENT;
