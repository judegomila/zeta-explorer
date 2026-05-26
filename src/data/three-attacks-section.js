/**
 * @module data/three-attacks-section
 * @fileoverview imp-1199 -- Paper section 18 "Three Direct Attacks on Ghost
 *   Absence" — frozen record powering the /three-attacks app page.
 *
 *   This module renders section 18 (pages 26-31) of the consolidated paper
 *   research-inputs/twin_ladder_consolidated_v52.pdf. The section motivates a
 *   "ghost absence" theorem (Conjecture 18.4: the inverse Blaschke ghost
 *   factor B_a^+ is identically 1 for every shift a > 0) and presents three
 *   non-circular attack routes that each reduce to the same statement:
 *
 *     Attack I   -- kernel/passivity closure (Conjecture 18.1):
 *                   realize the pair (A_a, B_a) as the Weyl transfer pair of
 *                   a positive Hamiltonian canonical system whose energy
 *                   kernel is K_a.
 *
 *     Attack II  -- prime-delay domination (Conjecture 18.2):
 *                   establish Re(X'/X)(w) > 0 in the half-plane Re w > 0 by
 *                   showing the completed archimedean drift G_infty dominates
 *                   the coherent prime-delay echo train under the analytic
 *                   continuation dictated by the Weil explicit formula.
 *
 *     Attack III -- Weil/Pontryagin index closure (Theorem 18.3 +
 *                   Conjecture 18.4): certify that the negative index
 *                   ind_-(K_a) of the shifted twin-ladder Weil form is zero
 *                   in every spectral window and pass to the limit.
 *
 *   The §18.4 synthesis observes that all three routes are equivalent ways
 *   of asserting B_a^+ = 1, and lists the three concrete deliverables a
 *   final proof would have to provide.
 *
 *   Content authority. The mathematical content, the conjecture labels, and
 *   the synthesis paragraph are taken directly from §18 of the user's paper
 *   (twin_ladder_consolidated_v52.pdf). This file is a PRESENTATION LAYER
 *   only; no new mathematics is asserted. All statements are flagged with
 *   their currentStatus (CONDITIONAL, RESEARCH-OPEN, etc.) so the page
 *   cannot accidentally claim a proof.
 *
 *   Tripwires (THREE_ATTACKS_SECTION_ASSERTIONS): six build-time guards
 *   wiring the section into the run-assertions.mjs sweep. They check
 *   (i) exactly three attacks are present, (ii) each attack carries a
 *   non-empty conjecture id of the form "Conjecture 18.x" or "Theorem 18.x",
 *   (iii) each attack carries a non-empty statement, mathFormulation, and
 *   blocker, (iv) the synthesis paragraph is non-empty and mentions the
 *   shared B_a^+ = 1 obstruction, (v) the section title cites §18 and
 *   "Ghost Absence", and (vi) the ghost-absence theorem (Conjecture 18.4)
 *   is named in the synthesis as the common reduction target.
 *
 *   Syntax discipline. JSDoc avoids the star-slash sequence inside the
 *   block; LaTeX is kept out of comments to prevent escape interpretation.
 *
 *   Proof-chain role: dissemination artefact for §18 of the paper.
 *   Ticket: imp-1199 (feature, high, S7).
 */

// ── Section title and provenance ────────────────────────────────────────────

const SECTION_TITLE = 'Three Direct Attacks on Ghost Absence (§18)';

const SECTION_PROVENANCE = {
  paperSource: 'research-inputs/twin_ladder_consolidated_v52.pdf',
  paperSection: '§18',
  paperPages: '26-31',
  consolidatedDraft: 'v52',
};

// ── Section opening (the gateway / setup of the three attacks) ──────────────

const SECTION_OPENING = (
  'The inverse-Blaschke factorization isolates the remaining wall. For ' +
  'X(w) = xi(1/2 + w) and R_a(w) = X(w - a) / X(w + a), the boundary ' +
  'relation |R_a(it)| = 1 is automatic from the functional equation. ' +
  'Possible failure of Schur contractivity is therefore not diffuse: it is ' +
  'carried by right-half-plane poles of R_a, equivalently by zeros lambda ' +
  'of X with Re lambda > a. The previous section factors those poles into ' +
  'inverse Blaschke ghosts. This section attacks the ghost-absence theorem ' +
  'through the three remaining routes: (1) kernel/passivity closure; ' +
  '(2) prime-delay domination; (3) Weil/Pontryagin index closure. The ' +
  'conclusion is not a completed proof of RH. The conclusion is sharper: ' +
  'each attack reduces to the same explicit no-ghost statement ' +
  'B_a^+ = 1 (a > 0), and each route gives a different possible way to ' +
  'prove it non-circularly.'
);

// ── Attack I: kernel/passivity closure (Conjecture 18.1) ────────────────────

const ATTACK_I = Object.freeze({
  id: 'attack-I-kernel-passivity',
  number: 'I',
  name: 'Kernel/passivity closure',
  paperSubsection: '§18.1',
  conjecture: 'Conjecture 18.1',
  conjectureTitle: 'Kernel/passivity closure',
  statement: (
    'For every shift a > 0, the pair (A_a, B_a) — the even and odd Fourier ' +
    'channels of the centered completed kernel — arises from a positive ' +
    'Hamiltonian canonical system whose Weyl transfer function is ' +
    'Theta_a(z) = E_a^{#}(z) / E_a(z). Equivalently, the Wronskian kernel ' +
    'K_a is the energy kernel of a passive system constructed directly ' +
    'from the completed Riemann kernel Phi.'
  ),
  mathFormulation: [
    'X(w) = \\int_0^\\infty \\Phi(u) \\cosh(wu)\\,du',
    'E_a(z) = X(a - iz) = A_a(z) - iB_a(z)',
    'A_a(z) = \\int_0^\\infty \\Phi(u) \\cosh(au)\\cos(zu)\\,du',
    'B_a(z) = \\int_0^\\infty \\Phi(u) \\sinh(au)\\sin(zu)\\,du',
    'K_a(w,z) = \\frac{A_a(z) B_a(w) - B_a(z) A_a(w)}{\\pi(\\bar{w} - z)}',
  ],
  obstruction: (
    'The Wronskian kernel is a symplectic pairing of the cosine channel ' +
    'C_a and the sine channel S_a. The u-integrals are not diagonal, so ' +
    'the sine-kernel collapse cos(zu) sin(\\bar{w}u) - sin(zu) cos(\\bar{w}u) ' +
    '= sin((\\bar{w} - z)u) does not occur — a double integral in (u, v) ' +
    'introduces off-diagonal terms with indefinite sign.'
  ),
  blocker: (
    'Upgrade the symplectic pairing into the energy kernel of a passive ' +
    'canonical system. The factorization must be nonlocal in the kernel ' +
    'variable u (de Branges / canonical-system / total-positivity / ' +
    'operator-theoretic transform), built from Phi without reference to ' +
    'the zero set.'
  ),
  currentStatus: 'RESEARCH-OPEN',
  badgeColor: '#8b5cf6',
  ghostInterpretation: (
    'If an off-critical zero exists, then R_a = \\tilde{R}_a / B_a^+ ' +
    'carries an inverse inner factor: \\tilde{R}_a is the passive part, ' +
    '1/B_a^+ is an anti-passive ghost channel. The kernel/passivity route ' +
    'must realize R_a itself passively, not merely its pole-cleared factor.'
  ),
});

// ── Attack II: prime-delay domination (Conjecture 18.2) ─────────────────────

const ATTACK_II = Object.freeze({
  id: 'attack-II-prime-delay-domination',
  number: 'II',
  name: 'Prime-delay domination',
  paperSubsection: '§18.2',
  conjecture: 'Conjecture 18.2',
  conjectureTitle: 'Prime-delay domination closure',
  statement: (
    'For every w with Re w > 0, the completed archimedean drift dominates ' +
    'the coherent prime-delay echo train: Re G_infty(w) > Re of the ' +
    'analytically continued series sum over p, m of (log p) p^{-(1/2+w)m} ' +
    'in the completed sense dictated by the Weil explicit formula.'
  ),
  mathFormulation: [
    '\\partial_x \\log|X(x + iy)| > 0 \\quad (x > 0)',
    '\\Re\\frac{X\'}{X}(w) > 0 \\quad (\\Re w > 0)',
    '\\frac{X\'}{X}(w) = G_\\infty(w) - \\sum_p \\sum_{m \\ge 1} (\\log p)\\, e^{-(1/2+w) m \\log p}',
    'G_\\infty(w) = \\frac{1}{s} + \\frac{1}{s-1} - \\tfrac{1}{2}\\log\\pi + \\tfrac{1}{2}\\psi(s/2), \\quad s = \\tfrac{1}{2} + w',
    '\\text{Critical-line ladder rungs: } (\\log p)\\, p^{-m/2}\\, e^{-iTm\\log p}',
  ],
  obstruction: (
    'A single off-critical zero packet lambda = delta + i gamma, with ' +
    'reflected partner -lambda, contributes the same-height factor ' +
    'Q_{delta,gamma}(w) = (w - i gamma)^2 - delta^2. Direct computation ' +
    'gives partial_x log|Q_{delta,gamma}(w)| / 2 = ' +
    '4x (x^2 + (y - gamma)^2 - delta^2) / |Q|^2, which is negative at ' +
    'y = gamma and 0 < x < delta. An off-critical zero manufactures its ' +
    'own local violation of prime-delay domination (the Godelian witness ' +
    'principle).'
  ),
  blocker: (
    'A literal Euler-series proof cannot work in the critical half-strip ' +
    'because the Euler series is not absolutely convergent there. The ' +
    'prime-delay echo train must be interpreted through a completed ' +
    'bridge — the Weil explicit formula or a kernel-side proxy — which is ' +
    'why this route is not independent of the kernel/passivity route; ' +
    'they are two languages for the same domination law.'
  ),
  currentStatus: 'CONDITIONAL',
  badgeColor: '#06b6d4',
  ghostInterpretation: (
    'The local sign flip caused by an off-critical packet IS the ghost: a ' +
    'pointwise failure of horizontal monotonicity in 0 < x < delta is ' +
    'equivalent to the negative-norm channel of the shifted bridge.'
  ),
});

// ── Attack III: Weil/Pontryagin index closure (Theorem 18.3 + Conj 18.4) ────

const ATTACK_III = Object.freeze({
  id: 'attack-III-weil-pontryagin',
  number: 'III',
  name: 'Weil/Pontryagin index closure',
  paperSubsection: '§18.3',
  conjecture: 'Theorem 18.3 + Conjecture 18.4',
  conjectureTitle: 'Finite-window ghost-index test + ghost absence theorem',
  statement: (
    'Theorem 18.3 (finite-window ghost-index test). Fix a > 0. If the ' +
    'shifted bridge ratio has N right-half-plane poles in a finite ' +
    'spectral window, the finite-window Gram matrices of K_a have at ' +
    'least N negative squares after clearing other analytic factors. ' +
    'Conversely, if all finite-window Gram matrices are positive ' +
    'semidefinite under arbitrarily fine sampling and stable window ' +
    'enlargement, no pole of R_a lies in that window. A certified proof ' +
    'that ind_-(K_a) = 0 for every a > 0 and every window proves RH.'
  ),
  mathFormulation: [
    'C_h(r) = \\int_{\\mathbb{R}} h(u)\\, h(u - r)\\, du',
    'Q_{TL}[h] = A_\\infty[h] - 2 \\sum_p \\sum_{m \\ge 1} (\\log p)\\, p^{-m/2}\\, \\Re C_h(m \\log p)',
    '\\text{Under RH: } Q_{TL}[h] = \\sum_\\gamma |\\hat{h}(\\gamma)|^2',
    '\\operatorname{ind}_-(K_a) = \\#P_a, \\quad P_a = \\{\\lambda - a : X(\\lambda) = 0,\\ \\Re\\lambda > a\\}',
    'S(w) = \\frac{w + \\bar\\alpha}{w - \\alpha}, \\quad \\frac{1 - S(z)S(w)}{z + \\bar w} = -\\frac{2\\Re\\alpha}{(z - \\alpha)(\\bar w - \\bar\\alpha)}',
  ],
  obstruction: (
    'Each inverse Blaschke factor contributes one rank-one negative ' +
    'square; a product of finitely many such factors gives a Pontryagin ' +
    'kernel of negative index equal to the pole count. Off RH, ' +
    'reflected zeros introduce cross-pairings (not modulus squares) on ' +
    'the zero side of the Weil form, and the bridge form is a Pontryagin ' +
    'space rather than a Hilbert space.'
  ),
  blocker: (
    'Build B such that Q_{TL}[h] = \\|B h\\|^2 for every admissible ' +
    'coherent shell h, constructed without using RH. Equivalently, ' +
    'certify that the Pontryagin negative index of the shifted ' +
    'twin-ladder form is zero in every window and pass to the limit ' +
    'using stable refinement.'
  ),
  currentStatus: 'CONDITIONAL',
  badgeColor: '#f59e0b',
  ghostInterpretation: (
    'Cross-pairings between reflected zeros are the negative-norm ghost ' +
    'states of the completed ladder. Ghost absence is exactly the ' +
    'Pontryagin negative-index-zero condition for K_a uniformly in a.'
  ),
});

// ── Synthesis (§18.4) ───────────────────────────────────────────────────────

const SYNTHESIS_PARAGRAPH = (
  'The three routes have a common shape: kernel/passivity asks for a ' +
  'passive canonical system whose ghost is 1/B_a^+; prime-delay domination ' +
  'asks for Re(X\'/X) > 0 and its ghost is the negative drift of a ' +
  'reflected zero packet; the Weil/Pontryagin route asks for Q_{TL} >= 0 ' +
  'and its ghost is the negative index ind_-(K_a) > 0. All three are ' +
  'equivalent ways of asking for the same Ghost Absence Theorem ' +
  '(Conjecture 18.4): for every a > 0, the inverse Blaschke ghost factor ' +
  'is absent, B_a^+ = 1. Equivalently, R_a is Schur in the right ' +
  'half-plane; equivalently K_a is positive semidefinite; equivalently ' +
  'the twin-ladder Weil form has zero negative index; equivalently RH ' +
  'holds. The practical research program is then precise: a final proof ' +
  'must (1) build a passive canonical system for R_a itself rather than ' +
  'its pole-cleared factor; or (2) prove completed prime-delay ' +
  'domination in the critical half-plane using the explicit formula ' +
  'rather than the divergent Euler series; or (3) certify that the ' +
  'Pontryagin negative index of the shifted twin-ladder form is zero in ' +
  'every window and pass to the limit. In the language of the twin ' +
  'ladder, RH is the assertion that local prime-delay oscillators create ' +
  'no inverse-Blaschke ghost channel once the completed kernel bridge is ' +
  'imposed.'
);

const GHOST_ABSENCE_THEOREM = Object.freeze({
  conjecture: 'Conjecture 18.4',
  name: 'Ghost absence theorem',
  statement: (
    'For every a > 0, the inverse Blaschke ghost factor is absent: ' +
    'B_a^+ ≡ 1. Equivalently, R_a is Schur in the right half-plane; ' +
    'equivalently K_a is positive semidefinite; equivalently the ' +
    'twin-ladder Weil form has zero negative index; equivalently the ' +
    'Riemann Hypothesis holds.'
  ),
  mathFormulation: 'B_a^+ \\equiv 1 \\iff R_a \\text{ Schur on } \\Re w > 0 \\iff K_a \\succeq 0 \\iff \\operatorname{ind}_-(K_a) = 0 \\iff \\text{RH}',
});

const ROUTES_TABLE = Object.freeze([
  { route: 'Kernel/passivity',         positiveObject: 'passive canonical system for R_a', ghostObstruction: '1/B_a^+ (anti-passive channel)' },
  { route: 'Prime-delay domination',   positiveObject: 'Re(X\'/X) > 0',                    ghostObstruction: 'negative zero-packet drift' },
  { route: 'Weil/Pontryagin',          positiveObject: 'Q_{TL} >= 0',                      ghostObstruction: 'ind_-(K_a) > 0' },
]);

// ── Exported frozen section record ──────────────────────────────────────────

export const THREE_ATTACKS_SECTION = Object.freeze({
  id: 'imp-1199-three-attacks-section-18',
  ticket: 'imp-1199',
  consumes: SECTION_PROVENANCE.paperSource,
  title: SECTION_TITLE,
  paperSection: SECTION_PROVENANCE.paperSection,
  paperPages: SECTION_PROVENANCE.paperPages,
  provenance: SECTION_PROVENANCE,
  opening: SECTION_OPENING,

  attacks: Object.freeze([ATTACK_I, ATTACK_II, ATTACK_III]),

  synthesisParagraph: SYNTHESIS_PARAGRAPH,
  ghostAbsenceTheorem: GHOST_ABSENCE_THEOREM,
  routesTable: ROUTES_TABLE,

  honestScopeNotes: Object.freeze([
    'This module is a PRESENTATION LAYER over §18 of the user paper ' +
    '(twin_ladder_consolidated_v52.pdf). No new mathematics is asserted.',
    'All three attacks are flagged CONDITIONAL or RESEARCH-OPEN. The ' +
    'page must not advertise any of them as a completed proof of RH.',
    'The synthesis explicitly states that all three routes reduce to the ' +
    'same Ghost Absence Theorem (Conjecture 18.4), and that each route ' +
    'gives a different possible way to prove it non-circularly.',
  ]),
});

// ── Build-time tripwires ────────────────────────────────────────────────────

export const THREE_ATTACKS_SECTION_ASSERTIONS = [
  {
    id: 'imp1199-three-attacks-present',
    holds: () => {
      const a = THREE_ATTACKS_SECTION.attacks;
      return (
        Array.isArray(a) && a.length === 3 &&
        a[0].number === 'I' &&
        a[1].number === 'II' &&
        a[2].number === 'III'
      );
    },
    why:
      'Section 18 names exactly three attacks (I kernel/passivity, II ' +
      'prime-delay domination, III Weil/Pontryagin index closure). The ' +
      'attacks array must have exactly three entries in that order; ' +
      'fewer or more indicates the section has drifted from the paper.',
  },

  {
    id: 'imp1199-each-attack-has-conjecture-id',
    holds: () => {
      const a = THREE_ATTACKS_SECTION.attacks;
      const re = /^(Conjecture|Theorem)\s+18\./;
      return a.every((atk) =>
        typeof atk.conjecture === 'string' &&
        atk.conjecture.length > 0 &&
        re.test(atk.conjecture)
      );
    },
    why:
      'Every attack must cite a conjecture or theorem id of the form ' +
      '"Conjecture 18.x" or "Theorem 18.x" (Attack I cites 18.1, ' +
      'Attack II cites 18.2, Attack III cites Theorem 18.3 plus ' +
      'Conjecture 18.4). A missing or malformed id breaks the citation ' +
      'chain from the page back to the paper.',
  },

  {
    id: 'imp1199-each-attack-has-statement-formulation-and-blocker',
    holds: () => {
      const a = THREE_ATTACKS_SECTION.attacks;
      return a.every((atk) =>
        typeof atk.statement === 'string' && atk.statement.length > 50 &&
        Array.isArray(atk.mathFormulation) && atk.mathFormulation.length >= 3 &&
        atk.mathFormulation.every((tex) => typeof tex === 'string' && tex.length > 0) &&
        typeof atk.blocker === 'string' && atk.blocker.length > 50
      );
    },
    why:
      'Each attack must carry (i) a substantive plain-text statement of ' +
      'the conjecture (>50 chars), (ii) at least three KaTeX-ready math ' +
      'formulations, and (iii) a substantive blocker description (>50 ' +
      'chars). Under-developed entries would let the page render but ' +
      'leave readers without the load-bearing content of §18.',
  },

  {
    id: 'imp1199-synthesis-non-empty-and-cites-ghost-absence',
    holds: () => {
      const s = THREE_ATTACKS_SECTION.synthesisParagraph;
      if (typeof s !== 'string' || s.length < 200) return false;
      const mentionsGhostAbsence =
        s.indexOf('Ghost Absence') >= 0 || s.indexOf('ghost absence') >= 0;
      const mentionsBaPlus =
        s.indexOf('B_a^+') >= 0;
      const mentionsConj184 =
        s.indexOf('Conjecture 18.4') >= 0 || s.indexOf('18.4') >= 0;
      return mentionsGhostAbsence && mentionsBaPlus && mentionsConj184;
    },
    why:
      'The §18.4 synthesis paragraph must (a) be non-trivial (>200 ' +
      'chars), (b) name the Ghost Absence Theorem, (c) cite the shared ' +
      'reduction target B_a^+ = 1, and (d) cite Conjecture 18.4. Any ' +
      'missing piece would weaken the load-bearing claim that the three ' +
      'attacks reduce to the same statement.',
  },

  {
    id: 'imp1199-title-cites-section-18-and-ghost-absence',
    holds: () => {
      const t = THREE_ATTACKS_SECTION.title;
      if (typeof t !== 'string') return false;
      return (
        t.indexOf('18') >= 0 &&
        (t.indexOf('Ghost Absence') >= 0 || t.indexOf('ghost absence') >= 0)
      );
    },
    why:
      'The section title must cite both §18 and "Ghost Absence" so ' +
      'the page header makes the paper provenance and the topic ' +
      'self-evident at a glance.',
  },

  {
    id: 'imp1199-each-attack-has-status-badge',
    holds: () => {
      const allowed = new Set(['CONDITIONAL', 'RESEARCH-OPEN', 'PARTIAL', 'OPEN']);
      const a = THREE_ATTACKS_SECTION.attacks;
      return a.every((atk) =>
        typeof atk.currentStatus === 'string' &&
        allowed.has(atk.currentStatus) &&
        typeof atk.badgeColor === 'string' &&
        atk.badgeColor.length >= 4
      );
    },
    why:
      'Every attack must carry a currentStatus drawn from a closed ' +
      'whitelist (CONDITIONAL, RESEARCH-OPEN, PARTIAL, OPEN) and a non-empty ' +
      'badgeColor. A "complete" or "closed" status would falsely advertise ' +
      'a proof of RH, which §18 explicitly disclaims.',
  },

  {
    id: 'imp1199-routes-table-has-three-rows',
    holds: () => {
      const t = THREE_ATTACKS_SECTION.routesTable;
      return (
        Array.isArray(t) && t.length === 3 &&
        t.every((r) =>
          typeof r.route === 'string' && r.route.length > 0 &&
          typeof r.positiveObject === 'string' && r.positiveObject.length > 0 &&
          typeof r.ghostObstruction === 'string' && r.ghostObstruction.length > 0
        )
      );
    },
    why:
      'The §18.4 synthesis table mapping {route -> positive object, ' +
      'ghost obstruction} must have exactly three rows mirroring the ' +
      'three attacks; missing or extra rows indicate drift from the ' +
      'paper synthesis.',
  },
];
