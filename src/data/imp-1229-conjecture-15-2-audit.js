// @module imp-1229-conjecture-15-2-audit
// imp-1229: Targeted RH-equivalence audit of Conjecture 15.2 (zero
// bridge-thickness / shift contractivity) from
// research-inputs/twin_ladder_consolidated_v52.pdf page 16, Section 15.8.
//
// Companion to imp-1232 (Conjectures 17.3 + 18.4 audit) and imp-1210
// (Conjecture 22.4 audit). The four conjectures 15.2 / 17.3 / 18.4 /
// 22.4 form one RH-equivalence class in different bridge languages
// (shift-contractivity / right-half-plane Blaschke triviality / Weil-
// Pontryagin index closure / de Branges Hermite-Biehler positivity).
//
// SECTION (a) -- THE CONJECTURE.
//
//   Conjecture 15.2 (Zero bridge-thickness / shift contractivity):
//     For every a > 0 and every w with Re(w) > 0,
//         | X(w - a) |  <  | X(w + a) |,
//     where X(w) = xi(1/2 + w). Equivalently, the shifted de Branges
//     kernel K_a is positive definite for every a > 0.
//
// The paper Section 15.8 itself remarks "by the threshold theorem, this
// conjecture is equivalent to RH". This audit walks the equivalence
// EXPLICITLY so the SUBSUMED verdict is auditable rather than asserted.
//
// SECTION (b) -- UNWINDING TO RH.
//
// Step 1 (Hadamard factorization). xi has Hadamard product
// xi(s) = e^(A+Bs) PROD_rho (1 - s/rho) exp(s/rho); X(w) = xi(1/2+w)
// is even (functional equation), so X(w) = X(0) PROD_lambda (1 -
// w^2/lambda^2) with zeros of X paired symmetrically as +/-lambda.
//
// Step 2 (Per-factor strict inequality). |1 - (w-a)^2/lambda^2| <
// |1 - (w+a)^2/lambda^2| for all Re(w) > 0 holds simultaneously for
// every zero lambda iff Re(lambda) = 0 for every zero (taking a -> 0+
// after restricting |Re(lambda)| < a forces the boundary).
//
// Step 3 (Lift to the product). The Hadamard product converges
// normally; pointwise inequality lifts iff every zero has Re(lambda)
// = 0; equivalently every nontrivial zero rho of zeta has Re(rho) =
// 1/2 -- that is RH.
//
// Step 4 (de Branges Hermite-Biehler alternate). K_a positive definite
// iff E_a(z) = X(a - iz) is Hermite-Biehler (de Branges 1968,
// Lagarias 2007) iff E_a has no upper-half-plane zeros iff X has no
// zeros with Re(w) > 0 iff (by X(w) = X(-w)) all zeros purely
// imaginary iff RH.
//
// SECTION (c) -- VERDICT: SUBSUMED-BY-RH.
//
// SECTION (d) -- RECOMMENDATION: Reframe explicitly as RH-equivalent.
// Consolidate 15.2 with 15.3, 17.3, 22.4 (and the Pontryagin/Weil-form
// 18.4) under a single "RH-equivalent reformulations" subsection.
// Cite de Branges 1968, Lagarias 2007, Hadamard 1893, Bombieri-
// Lagarias 1999.

const RELATED_WORK = [
  {
    author: 'de Branges',
    year: 1968,
    title: 'Hilbert Spaces of Entire Functions',
    venue: 'Prentice-Hall, Englewood Cliffs',
    relevance:
      'Hermite-Biehler equivalence underlying Conjecture 15.2. For an ' +
      'entire E of finite exponential type, E is Hermite-Biehler iff ' +
      'the reproducing kernel K(z, w) is positive definite. Applied to ' +
      'E_a(z) = X(a - iz) this is the K_a positive-definite form.',
  },
  {
    author: 'Lagarias',
    year: 2007,
    title: 'Hilbert spaces of entire functions and Dirichlet L-functions',
    venue: 'Frontiers in Number Theory, Physics, and Geometry I, 365-377',
    relevance:
      'Explicit modern survey: E_a Hermite-Biehler for every a > 0 iff ' +
      'xi has only real zeros (RH). Conjecture 15.2 is literally RH ' +
      'restated in shifted-bridge form.',
  },
  {
    author: 'Hadamard',
    year: 1893,
    title:
      'Etude sur les proprietes des fonctions entieres et en ' +
      'particulier d\'une fonction consideree par Riemann',
    venue: 'J. Math. Pures Appl. 9, 171-215',
    relevance:
      'Foundational Hadamard factorization used in Step 1 of the ' +
      'unwinding. The pointwise shift-contractivity per zero is a direct ' +
      'consequence of Hadamard combined with the X(w) = X(-w) symmetry.',
  },
  {
    author: 'Bombieri-Lagarias',
    year: 1999,
    title: 'Complements to Li\'s criterion for the Riemann hypothesis',
    venue: 'J. Number Theory 77, 274-287',
    relevance:
      'Catalogs RH-equivalent positivity criteria. The shift-' +
      'contractivity |X(w-a)| < |X(w+a)| of Conjecture 15.2 belongs to ' +
      'the same equivalence class as the de Branges Hermite-Biehler ' +
      'form and the Li-Keiper coefficient positivity.',
  },
  {
    author: 'Rodgers-Tao',
    year: 2018,
    title: 'The de Bruijn-Newman constant is non-negative',
    venue: 'Forum of Mathematics Pi 8, e6 (2020)',
    relevance:
      'Closest unconditional positive-direction result. Lambda >= 0 ' +
      'for the de Bruijn-Newman flow H_t. Conjecture 15.2 is the ' +
      'bridge-thickness analog (parameter a instead of t), both asking ' +
      'for a positivity threshold at the boundary value.',
  },
];

const VERDICT = 'SUBSUMED-BY-RH';

const UNWINDING_CHAIN = [
  'Step 1: xi has Hadamard product over zeros; X(w) = xi(1/2+w) is ' +
    'even (functional equation), so X(w) = X(0) PROD (1 - w^2/lambda^2).',
  'Step 2: per-factor strict inequality |1 - (w-a)^2/lambda^2| < ' +
    '|1 - (w+a)^2/lambda^2| for all Re(w) > 0 holds iff Re(lambda) = 0.',
  'Step 3: lifted to the product, |X(w-a)| < |X(w+a)| for all a > 0 ' +
    'and Re(w) > 0 iff every zero has Re(lambda) = 0, i.e. RH.',
  'Step 4 (alternate): K_a positive definite iff E_a(z) = X(a-iz) is ' +
    'Hermite-Biehler iff E_a has no upper-half-plane zeros iff X has ' +
    'no zeros with Re(w) > 0 iff RH.',
];

const EQUIVALENT_CONJECTURES = [
  '15.3 (Hermite-Biehler form of E_a)',
  '17.3 (ghost-absence: B_a^+ identically 1)',
  '22.4 (zero bridge-thickness: E_a Hermite-Biehler for every a > 0)',
];

const HONEST_SCOPE = [
  'Audit performed from training-time knowledge only. No external ' +
    'browsing. The SUBSUMED-BY-RH verdict is robust against further ' +
    'literature search because the unwinding uses textbook de Branges ' +
    'Hermite-Biehler equivalences (Lagarias 2007 surveys them).',
  'The unwinding chain is a SKETCH of the standard argument, not a ' +
    'fully rigorous proof to publication standards. Steps 1, 3, 4 are ' +
    'standard textbook material; Step 2 is a one-line calculation, but ' +
    'the SHARP threshold a vs |Re(lambda)| is what makes 15.2 strictly ' +
    'equivalent to RH rather than to a weaker zero-free-region statement.',
  'Conjecture 15.2 uses STRICT inequality. The equivalent K_a positive ' +
    'DEFINITE form is the strict variant. This audit follows the paper ' +
    'convention; a positive semi-definite reading is the K_a >= 0 form ' +
    'of Conjecture 18.4 / Hermite-Biehler form of 22.4.',
  'Cross-reference: Conjecture 22.4 was audited SUBSUMED-BY-RH via ' +
    'imp-1210 (de Branges / Lagarias machinery); Conjectures 17.3 + ' +
    '18.4 audited SUBSUMED-BY-RH via imp-1232 (Krein-Langer / Weil-' +
    'Pontryagin). The four conjectures (15.2, 15.3, 17.3, 22.4) plus ' +
    '18.4 form one equivalence class under RH.',
];

export const IMP_1229_CONJECTURE_15_2_AUDIT = Object.freeze({
  id: 'imp-1229',
  ticket: 'imp-1229',
  auditDate: '2026-05-27',
  paper: 'twin_ladder_consolidated_v52.pdf',
  paperSection: '15.8 (page 16) -- Zero bridge-thickness theorem',
  precedent: 'imp-1210',
  conjectureId: '15.2',
  conjectureName: 'Zero bridge-thickness / shift contractivity',
  paraphrased_statement:
    'For every a > 0 and every w with Re(w) > 0, |X(w - a)| < ' +
    '|X(w + a)| where X(w) = xi(1/2 + w). Equivalently, the shifted ' +
    'de Branges kernel K_a is positive definite for every a > 0.',
  related_work: Object.freeze(RELATED_WORK.map(Object.freeze)),
  verdict: VERDICT,
  unwinding_chain: Object.freeze(UNWINDING_CHAIN),
  equivalent_conjectures_in_paper: Object.freeze(EQUIVALENT_CONJECTURES),
  audit_method:
    'Direct unwinding via Hadamard factorization + functional equation ' +
    '+ de Branges Hermite-Biehler textbook equivalence (Lagarias 2007). ' +
    'No external browsing performed.',
  recommendation_for_paper:
    'Reframe 15.2 as an RH-equivalent reformulation in shift-' +
    'contractivity form. Consolidate with 15.3, 17.3, and 22.4 under ' +
    'a single "RH-equivalent reformulations" subsection. Cite de ' +
    'Branges 1968 and Lagarias 2007.',
  honestScope: Object.freeze(HONEST_SCOPE),
  parallelTickets: Object.freeze(['imp-1202', 'imp-1210', 'imp-1232']),
});

export default IMP_1229_CONJECTURE_15_2_AUDIT;

export const IMP_1229_CONJECTURE_15_2_AUDIT_ASSERTIONS = [
  {
    id: 'imp1229-conjecture-15-2-verdict-is-subsumed-by-rh',
    why:
      'Conjecture 15.2 is equivalent to RH via direct Hadamard ' +
      'pointwise unwinding AND via the de Branges Hermite-Biehler ' +
      'textbook equivalence. The verdict must be SUBSUMED-BY-RH; ' +
      'flipping to PARTIALLY-RELATED or INDEPENDENT-NOVEL would ' +
      'reintroduce the overclaim that 15.2 is a separate theorem target.',
    holds: () => IMP_1229_CONJECTURE_15_2_AUDIT.verdict === 'SUBSUMED-BY-RH',
  },
  {
    id: 'imp1229-cites-de-branges-and-lagarias',
    why:
      'The SUBSUMED-BY-RH verdict rests on the de Branges / Lagarias ' +
      'Hermite-Biehler equivalence. related_work must cite both ' +
      'de Branges 1968 and Lagarias 2007.',
    holds: () => {
      const authors = IMP_1229_CONJECTURE_15_2_AUDIT.related_work.map(
        (r) => r.author,
      );
      return authors.includes('de Branges') && authors.includes('Lagarias');
    },
  },
  {
    id: 'imp1229-cites-hadamard-for-step-1',
    why:
      'Step 1 (Hadamard product factorization of xi) is the load-' +
      'bearing classical input for the direct route. related_work must ' +
      'cite Hadamard 1893 to make the chain traceable.',
    holds: () => {
      const authors = IMP_1229_CONJECTURE_15_2_AUDIT.related_work.map(
        (r) => r.author,
      );
      return authors.includes('Hadamard');
    },
  },
  {
    id: 'imp1229-unwinding-chain-has-four-steps',
    why:
      'The unwinding from Conjecture 15.2 to RH proceeds in four ' +
      'explicit steps (Hadamard, per-factor, lift, Hermite-Biehler ' +
      'alternate route). All four must be present so the SUBSUMED ' +
      'verdict is auditable rather than asserted.',
    holds: () => {
      const chain = IMP_1229_CONJECTURE_15_2_AUDIT.unwinding_chain;
      return Array.isArray(chain) && chain.length >= 4;
    },
  },
  {
    id: 'imp1229-equivalent-conjectures-list-cross-references-22-4',
    why:
      'Per imp-1218 honestScope, Conjecture 15.2 is structurally ' +
      'identical to Conjecture 22.4 (and 15.3 / 17.3). The audit must ' +
      'explicitly cross-reference 22.4 and 17.3 so the paper-level ' +
      'recommendation to consolidate is supported.',
    holds: () => {
      const list =
        IMP_1229_CONJECTURE_15_2_AUDIT.equivalent_conjectures_in_paper;
      return (
        Array.isArray(list) &&
        list.some((s) => /22\.4/.test(s)) &&
        list.some((s) => /17\.3/.test(s))
      );
    },
  },
  {
    id: 'imp1229-honest-scope-acknowledges-training-only',
    why:
      'Per imp-1163 / imp-1210 honest-scope precedent, the audit must ' +
      'explicitly disclose training-time knowledge only.',
    holds: () =>
      Array.isArray(IMP_1229_CONJECTURE_15_2_AUDIT.honestScope) &&
      IMP_1229_CONJECTURE_15_2_AUDIT.honestScope.some((s) =>
        /training-time/.test(s),
      ),
  },
];
