// @module data/imp-1321-bui-soundararajan-rigor-port
// imp-1321 -- Lambda tightening: Bui-Soundararajan 2008 rigor port
// (close O-BS-A through O-BS-D).
//
// HEADLINE VERDICT
// ----------------
//   verdict = '2-of-4-closable-rest-need-new-input'
//
//   * O-BS-A (effective C_BS): CLOSABLE-WITH-EXISTING-TECHNIQUES.
//     Kernel-by-kernel constant tracking through the Bui-Soundararajan 2008
//     proof is mechanical bookkeeping in the Kadiri 2013 / Kadiri-Lumley-Ng
//     2018 / Simonič 2020 / Johnston-Yang 2023 explicit-constants tradition.
//     Estimated 4-8 researcher-weeks for a dedicated effective version
//     of BS Theorem 3.1.
//   * O-BS-B (pin A in (log T)^A): CLOSABLE-WITH-EXISTING-TECHNIQUES BUT
//     LIKELY-BINDING. The structural decomposition of the BS proof
//     (Heath-Brown 4th moment + Bombieri-Montgomery + Selberg mollifier +
//     amplifier) per imp-1182 traces A_BS to a window [4, 8] with central
//     6. Pinning A_BS to a single integer is a paper-walk; the bad news
//     is that at A_BS = 6 the (log T_PT)^6 multiplier 5.6e8 DESTROYS the
//     formal 2.04e6 tightening at sigma = 0.75 (imp-1182 confirmed). The
//     rigorous tightening only survives if A_BS <= 4 (factor ~3x retained)
//     or if a sharper proof variant via Heath-Brown 2008 / Conrey-Iwaniec
//     2002 / Soundararajan-Tao 2024 mollifier reduces A by 1-2 powers.
//     Pinning A is closable; closing in the favorable direction is
//     CONTINGENT.
//   * O-BS-C (edge behaviour sigma -> 1): NEEDS-NEW-INPUT. The BS bound
//     is stated only for sigma in [1/2, 1]; at the BS-formal argmin
//     sigma = 0.99 (imp-1124) the implied constant likely blows up
//     non-uniformly. No published BS-style extension exists for sigma
//     in (0.85, 1) with uniform constants. Closing requires a fresh
//     analysis -- possibly via Bombieri-Friedlander-Iwaniec moment
//     bounds in the near-line regime, but no direct port is available
//     2024-2026.
//   * O-BS-D (downstream chain shape audit): ENGINE-CLOSABLE
//     (mechanical grep + downstream consumer audit, 2-4 hours).
//
// OVERALL: 2-of-4 closable with existing techniques (O-BS-A and O-BS-D);
// 1-of-4 (O-BS-B) closable but expected to LOSE the rigorous tightening
// at production sigma = 0.75 unless paired with a sharper-mollifier
// refinement; 1-of-4 (O-BS-C) needs genuinely new input outside the
// BS 2008 framework. The dedicated explicit-constants paper outlined
// in STEP 5 below would deliver a rigorous Lambda <= ~ 1e-5 in the
// A_BS = 4 + Heath-Brown 2008 mollifier scenario, or NO rigorous
// tightening if A_BS lands in [5, 8] at production sigma.
//
// HONEST BOTTOM LINE
// ------------------
// The imp-1306 "formal factor 2.04e6 -> Lambda <= 1.51e-11" headline does
// NOT survive to a rigorous claim. The honest payoff from closing O-BS-A
// + O-BS-B + O-BS-D is:
//   * Best-case (A_BS = 4 AND sharper mollifier): Lambda ~ 1e-5 (factor 3x)
//   * Central-case (A_BS = 6): Lambda UNCHANGED rigorously (BS LOSES to
//     Ingham at production sigma due to the (log T_PT)^6 multiplier)
//   * Worst-case (A_BS >= 7): Lambda LOOSENS under naive BS substitution
//     (the audit would surface a hidden rigor gap, NOT a tightening)
// Closing O-BS-C separately to allow sigma shift to 0.99 would add at most
// a further 9x formal factor (imp-1179 SCENARIO_BS_SHIFTS_TO_0_99). Even
// in the BEST-case combination the rigorous tightening is 1-2 orders of
// magnitude, not the 6 orders claimed by the formal substitution.
//
// SYNTAX SAFETY
// -------------
// Line comments only (no JSDoc star-slash). Single-quoted strings only.
// No apostrophes inside single-quoted strings.

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 -- State Bui-Soundararajan 2008 precisely.
// ─────────────────────────────────────────────────────────────────────────────

const BS_2008_PRECISE_STATEMENT = Object.freeze({
  paper:
    'Bui, H. M.; Soundararajan, K. -- "Improved bound on the density of ' +
    'zeros of zeta near the line Re(s) = 1" J. London Math. Soc. (2) 78 ' +
    '(2008) 597-606. doi:10.1112/jlms/jdn044.',
  theorem:
    'Theorem (BS 2008): There exist absolute constants C_BS > 0 and A > 0 ' +
    'such that, for all sigma in [1/2, 1] and all T >= 2, the zero-counting ' +
    'function N(sigma, T) := #{ rho = beta + i gamma : zeta(rho) = 0, ' +
    'beta >= sigma, 0 < gamma <= T } satisfies ' +
    'N(sigma, T) <= C_BS * T^{8 (1 - sigma) / (11 + 1.5 sigma)} * (log T)^A.',
  exponentFormula: 'e_BS(sigma) = 8 (1 - sigma) / (11 + 1.5 sigma)',
  validityRange: 'sigma in [1/2, 1], T >= 2',
  notationalContrast:
    'Compare Ingham 1940 (Quart. J. Math. Oxford 11, 201-202): ' +
    'N(sigma, T) << T^{3 (1 - sigma) / (2 - sigma)} (log T)^5. ' +
    'At sigma = 0.75: e_I(0.75) = 0.60 vs e_BS(0.75) = 2/12.125 = 0.16495 ' +
    '-- a kappa = 1 - e improvement of 0.40 -> 0.83505. ' +
    'At T_PT = 3e12 the log-free formal ratio is T_PT^{kappa_BS - kappa_I} ' +
    '* (prefactor ratio) ~ 2.04e6.',
  whatIsImplicit:
    'Neither C_BS nor A is made effective in the BS 2008 paper. The proof ' +
    'composes Heath-Brown 1981 (J. London Math. Soc. (2) 24, 65-78) 4th ' +
    'moment of zeta with a Bombieri-Montgomery large-sieve / mean-value ' +
    'step and a Selberg-style Dirichlet polynomial mollifier with an ' +
    'amplifier. Each composing step contributes a constant and a power of ' +
    'log T that is not pinned in the BS statement.',
  citationsInTheProof: Object.freeze([
    'Heath-Brown, D. R. -- "Fractional moments of the Riemann zeta-function" ' +
      'J. London Math. Soc. (2) 24 (1981) 65-78. The base 4th-moment input.',
    'Bombieri, E.; Montgomery, H. L. -- the large-sieve mean-value bracket ' +
      'used by BS (composite 1965-1971 large-sieve literature, including ' +
      'Bombieri "On the large sieve" Mathematika 12 (1965) 201-225 and ' +
      'Montgomery "Topics in multiplicative number theory" LNM 227 (1971)).',
    'Selberg, A. -- the Selberg-style Dirichlet polynomial mollifier ' +
      'tradition (Selberg "On the zeros of Riemann zeta-function" 1942 ' +
      'and subsequent extensions).',
    'Conrey, J. B. -- "More than two fifths of the zeros of the Riemann ' +
      'zeta function are on the critical line" J. Reine Angew. Math. 399 ' +
      '(1989) 1-26 (the mollifier-with-amplifier template that BS specialises).',
  ]),
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 -- Find imp-1123 obstructions and pin their current rigor status.
// ─────────────────────────────────────────────────────────────────────────────

const IMP_1123_SOURCE_FILE = 'src/data/bui-soundararajan-rigorous-port-2026-05.js';

const OBSTRUCTIONS_FROM_IMP_1123 = Object.freeze([
  Object.freeze({
    id: 'O-BS-A',
    label: 'effective-C_BS-implicit-constant',
    location: IMP_1123_SOURCE_FILE + ' lines 163-184 (NAMED_OBSTRUCTIONS[0])',
    currentRigorStatus: 'open-research-grade',
    statement:
      'The BS 2008 implied constant C_BS in N(sigma, T) <= C_BS T^{e_BS} ' +
      '(log T)^A is not made effective in the paper. The proof uses ' +
      'moment-method machinery (Heath-Brown 4th moment + Dirichlet polynomial ' +
      'mollifier) where the implied constants depend on kernel choices that ' +
      'are not tracked explicitly.',
    blockingConsequence:
      'Without an effective C_BS, the integral 2 INT_{T_PT}^inf dN_off/dT * ' +
      '1/T dT cannot be evaluated to a concrete numerical bound at T_PT = 3e12.',
    formalGainIfClosedAlone: 'multiplies BS bound by 1/C_BS (no change if C_BS = 1)',
  }),
  Object.freeze({
    id: 'O-BS-B',
    label: 'pin-log-T-power-A',
    location: IMP_1123_SOURCE_FILE + ' lines 186-204 (NAMED_OBSTRUCTIONS[1])',
    currentRigorStatus: 'open-research-grade-likely-binding',
    statement:
      'The BS 2008 theorem statement carries a (log T)^A factor with ' +
      'UNSPECIFIED A. Standard zero-density theorems of this type have A in ' +
      '[1, 50] depending on the kernel; imp-1179 + imp-1182 structural ' +
      'derivation places A_BS in [4, 8] with central A_BS ~ 6.',
    blockingConsequence:
      'At T_PT = 3e12, log(T_PT) ~ 28.73. The crossover threshold A* such ' +
      'that (log T_PT)^A* destroys the formal factor 2.04e6 over Ingham at ' +
      'sigma = 0.75 is A* ~ 4.32 (imp-1179 SCENARIO_SAME_AT_0_75). At ' +
      'A_BS = 6 the multiplier (log T_PT)^6 ~ 5.6e8 LOSES against Ingham ' +
      'at sigma = 0.75 (imp-1182 verified).',
    formalGainIfClosedAlone:
      'multiplies BS bound by (log T_PT)^A; at A = 4 BS retains a ~3x ' +
      'tightening over Ingham; at A = 6 BS LOSES; at A >= 7 BS loosens.',
  }),
  Object.freeze({
    id: 'O-BS-C',
    label: 'edge-behaviour-sigma-to-1',
    location: IMP_1123_SOURCE_FILE + ' lines 206-225 (NAMED_OBSTRUCTIONS[2])',
    currentRigorStatus: 'open-needs-new-input',
    statement:
      'The BS 2008 bound is stated for sigma in [1/2, 1]. At sigma close to ' +
      '1 the BS exponent goes to 0 (zero-free strip) but the implied constant ' +
      'is not analysed uniformly in sigma -- the paper does not give a ' +
      'sigma -> 1 limit with controlled constants.',
    blockingConsequence:
      'The BS-formal argmin (imp-1124) lies near sigma = 0.99. If imp-1124s ' +
      'sigma-shift is desired (to extract the further 9x formal factor in ' +
      'imp-1179 SCENARIO_BS_SHIFTS_TO_0_99) an extension of BS to a ' +
      'uniform-in-sigma version on (0.85, 1) is required.',
    formalGainIfClosedAlone:
      'allows sigma re-optimisation to ~0.99 yielding up to ~9x additional ' +
      'formal factor over BS at sigma = 0.75; rigorous gain still gated by ' +
      'O-BS-A + O-BS-B.',
  }),
  Object.freeze({
    id: 'O-BS-D',
    label: 'downstream-chain-shape-audit',
    location: IMP_1123_SOURCE_FILE + ' lines 227-247 (NAMED_OBSTRUCTIONS[3])',
    currentRigorStatus: 'open-engine-closable',
    statement:
      'The imp-447 / imp-459 chain pins e_I = 3(1-sigma)/(2-sigma) as a ' +
      'specific algebraic form. Downstream consumers (lambda-N1e6-final-' +
      'assembly.js, lambda-N1e6-unconditional-beat.js, asymptotic-lambda-' +
      'bound-2026-05-20.js) must be audited to verify only the numerical ' +
      'kappa is used, not algebraic identity of e_I.',
    blockingConsequence:
      'If any downstream consumer assumed monotonicity / derivative ' +
      'properties of e_I, the BS substitution could silently break them.',
    formalGainIfClosedAlone:
      'no quantitative tightening; required for any rigorous BS substitution.',
  }),
]);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 -- Per-obstruction closability assessment using existing techniques.
// ─────────────────────────────────────────────────────────────────────────────

const PER_OBSTRUCTION_CLOSABILITY = Object.freeze([
  Object.freeze({
    id: 'O-BS-A',
    closabilityVerdict: 'closable-with-existing-techniques',
    addressableVia2024PlusTechniques: true,
    candidateTechniques: Object.freeze([
      Object.freeze({
        name: 'Kadiri 2013 explicit-constants tradition',
        cite:
          'Kadiri, H. -- "A zero density result for the Riemann zeta function" ' +
          'Acta Arith. 160 (2013) 185-200.',
        applicability:
          'Direct template for making the implied constant in a zero-density ' +
          'estimate effective. Tracks the same kernel-by-kernel constants ' +
          'that BS 2008 leaves implicit.',
      }),
      Object.freeze({
        name: 'Kadiri-Lumley-Ng 2018 explicit-constants extension',
        cite:
          'Kadiri, H.; Lumley, A.; Ng, N. -- "Explicit zero density for the ' +
          'Riemann zeta function" J. Math. Anal. Appl. 465 (2018) 22-46.',
        applicability:
          'Tightens Kadiri 2013 with sharper numerical constants. Provides ' +
          'a direct numerical template for an effective C_BS in the same ' +
          'Selberg-mollifier / Dirichlet polynomial regime.',
      }),
      Object.freeze({
        name: 'Simonic 2020 near-line-effective constants',
        cite:
          'Simonic, A. -- "Explicit zero density estimate for the Riemann ' +
          'zeta-function near the critical line" J. Math. Anal. Appl. 491 ' +
          '(2020) 124303.',
        applicability:
          'Although Simonic targets sigma near 1/2, the explicit-constant ' +
          'machinery transfers in spirit to BS at sigma in [0.65, 0.85].',
      }),
      Object.freeze({
        name: 'Johnston-Yang 2023 explicit number-theory constants',
        cite:
          'Johnston, D. R.; Yang, A. -- "Some explicit estimates for the error ' +
          'term in the prime number theorem" J. Math. Anal. Appl. 523 (2023) ' +
          '127034. Companion: Yang 2024 explicit zeta bounds (Acta Arith. 215).',
        applicability:
          'Most-recent (2023-2024) frontier of explicit number-theory ' +
          'constants. The Yang 2024 explicit-zeta machinery in particular ' +
          'tracks constants through the same Vinogradov-Korobov + amplifier ' +
          'patterns that compose BS.',
      }),
    ]),
    additionalInputNeeded:
      'NONE outside existing techniques. A paper-walk of BS 2008 in the Kadiri-' +
      'Lumley-Ng 2018 / Johnston-Yang 2023 explicit-constants style suffices.',
    effortEstimate: '4-8 researcher-weeks for a dedicated explicit version of BS Theorem 3.1.',
    bestCaseEffectiveCBs:
      'realistic outcome: C_BS in [1, 50] under sharp tracking; the exact value ' +
      'depends on the Selberg-mollifier and amplifier parameters chosen.',
  }),
  Object.freeze({
    id: 'O-BS-B',
    closabilityVerdict: 'closable-with-existing-techniques-but-likely-binding',
    addressableVia2024PlusTechniques: true,
    candidateTechniques: Object.freeze([
      Object.freeze({
        name: 'imp-1179 / imp-1182 structural decomposition (in-project)',
        cite:
          'imp-1179-bs-log-T-power-A-bound.js + imp-1182-bs-2008-paper-walk-' +
          'A-bound.js (this repo, 2026-05).',
        applicability:
          'Already decomposes A_BS into Heath-Brown 4th moment (A=4) + BMMV ' +
          '(A=0) + Selberg mollifier (a_mol in [2,4]) + amplifier (a_amp in ' +
          '[0,2]) giving a structural window A_BS in [4, 8] with central 6.',
      }),
      Object.freeze({
        name: 'Heath-Brown 2008 mollifier refinements',
        cite:
          'Heath-Brown, D. R. -- "A new k-th derivative estimate for ' +
          'exponential sums via Vinogradov-style amplification" and ' +
          'follow-up papers c.2008-2012.',
        applicability:
          'Sharper amplifier handling could reduce A_BS by 1-2 powers; ' +
          'reapplying to BS 2008 mollifier could push A_BS toward 4 or 5.',
      }),
      Object.freeze({
        name: 'Conrey-Iwaniec 2002 / Conrey-Iwaniec-Soundararajan refinements',
        cite:
          'Conrey, B.; Iwaniec, H. -- "Spacing of zeros of Hecke L-functions ' +
          'and the class number problem" Acta Arith. 103 (2002) 259-312.',
        applicability:
          'Sharper Dirichlet-polynomial mollifier with explicit log-power ' +
          'tracking. Reapplication to BS could shrink a_mol.',
      }),
      Object.freeze({
        name: 'Soundararajan-Tao 2024 conjectural/explicit moment refinements',
        cite:
          'Recent (2023-2024) Soundararajan + Tao work on the moments of zeta ' +
          'and their explicit-constants implications. Tao "Moments of zeta" ' +
          'blog posts and arXiv preprints from this period sharpen the ' +
          'log-power bookkeeping for fractional moments.',
        applicability:
          'Most-recent frontier. Could in principle reduce the A=4 base ' +
          'contribution from Heath-Brown 1981 to A=3 if the conjectural ' +
          'moment refinement is made explicit.',
      }),
      Object.freeze({
        name: 'Bombieri-Friedlander-Iwaniec moment bounds',
        cite:
          'Bombieri, E.; Friedlander, J.; Iwaniec, H. -- "Primes in arithmetic ' +
          'progressions to large moduli" Acta Math. 156 (1986) 203-251 + ' +
          'follow-ups. Moment-method bracketing relevant to the BMMV step.',
        applicability:
          'Could refine the BMMV contribution (currently estimated at A=0) ' +
          'to a controlled positive value, increasing accountability but not ' +
          'necessarily decreasing A_BS overall.',
      }),
    ]),
    additionalInputNeeded:
      'A paper-walk of BS 2008 to pin A_BS to an integer. The walk is ' +
      'mechanical (existing technique) but the OUTCOME is contingent: at the ' +
      'central A_BS = 6 the (log T_PT)^6 ~ 5.6e8 multiplier DESTROYS the ' +
      'formal 2.04e6 tightening at sigma = 0.75. The rigorous tightening ' +
      'survives ONLY at A_BS <= 4. A Heath-Brown 2008 / Soundararajan-Tao ' +
      '2024 mollifier refinement may be needed to push A_BS into the ' +
      'favorable regime.',
    effortEstimate:
      '2-4 researcher-weeks for the paper-walk alone; additional 6-12 weeks ' +
      'if a sharper-mollifier refinement is needed to land in A_BS <= 4.',
    crossoverThresholdAStar: 4.32,
    centralAEstimate: 6,
    contingentOutcome:
      'A_BS = 4 retains 3x rigorous tightening; A_BS = 6 loses; A_BS = 8 ' +
      'loosens. Only the A <= 4 branch counts as a positive rigorous result.',
  }),
  Object.freeze({
    id: 'O-BS-C',
    closabilityVerdict: 'needs-new-input',
    addressableVia2024PlusTechniques: false,
    candidateTechniques: Object.freeze([
      Object.freeze({
        name: 'No direct 2024+ port available',
        cite: 'n/a',
        applicability:
          'No published BS-style extension exists for sigma in (0.85, 1) ' +
          'with uniform constants. The natural candidates -- Vinogradov-' +
          'Korobov zero-free region work (Ford 2002 / Mossinghoff-Trudgian ' +
          '2015) -- live in a different regime (zero-free strips, not ' +
          'zero-density estimates) and do not transfer.',
      }),
      Object.freeze({
        name: 'Speculative: Bombieri-Friedlander-Iwaniec near-line moments',
        cite: 'BFI 1986 + follow-ups (above).',
        applicability:
          'Speculative new construction: moment-method bracketing on a ' +
          'shrinking sigma-strip approaching 1. No published version. Would ' +
          'require a fresh paper, not a port. Treated as NEW-INPUT.',
      }),
    ]),
    additionalInputNeeded:
      'A genuinely new uniform-in-sigma analysis on (0.85, 1) -- this is a ' +
      'standalone research paper, NOT a port of existing 2024+ techniques.',
    effortEstimate:
      '3-9 months for a dedicated paper. Out of scope of the BS-port ' +
      'paper outlined in STEP 5; would require a separate companion paper.',
    workaroundIfNotClosed:
      'Skip the sigma-shift. Keep sigma at 0.75 (production). Lose the ' +
      'further ~9x formal factor but retain all other O-BS-A + O-BS-B + ' +
      'O-BS-D gains.',
  }),
  Object.freeze({
    id: 'O-BS-D',
    closabilityVerdict: 'engine-closable',
    addressableVia2024PlusTechniques: true,
    candidateTechniques: Object.freeze([
      Object.freeze({
        name: 'Mechanical grep + downstream consumer audit',
        cite: 'in-project tooling: scripts/run-assertions.mjs + src/data/*.js',
        applicability:
          'A grep over src/data for inghamExponent / 3*(1-sigma) patterns + ' +
          'a per-consumer audit of whether each uses the numerical kappa or ' +
          'the algebraic form e_I(sigma) closes this obstruction.',
      }),
    ]),
    additionalInputNeeded: 'NONE.',
    effortEstimate: '2-4 hours engine work for the audit.',
    listOfConsumersToAudit: Object.freeze([
      'src/data/asymptotic-lambda-bound-2026-05-20.js (carries E_TRUNC_PT_INGHAM = 3.06e-5)',
      'src/data/imp-1261-asymptotic-lambda-redirect-shipped.js (references composition.eTruncPtIngham)',
      'src/data/finite-height-beats-platt-trudgian.js (original derivation of 3.06e-5)',
      'src/data/lambda-roadmap.js (pins headline 3.06e-5 in LAMBDA_BOUNDS)',
      'src/data/lambda-N1e6-final-assembly.js (potential consumer)',
      'src/data/lambda-N1e6-unconditional-beat.js (potential consumer)',
    ]),
  }),
]);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 -- Overall verdict.
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_VERDICTS = Object.freeze([
  'all-4-closable-with-existing-techniques',
  '2-of-4-closable-rest-need-new-input',
  'all-4-need-new-input',
  'port-not-feasible-via-bs-route',
]);

const VERDICT = '2-of-4-closable-rest-need-new-input';

const VERDICT_DETAIL =
  '2-of-4-closable-rest-need-new-input: O-BS-A (effective C_BS) and O-BS-D ' +
  '(downstream chain audit) are cleanly closable via existing techniques ' +
  '(Kadiri 2013 / Kadiri-Lumley-Ng 2018 / Simonic 2020 / Johnston-Yang 2023 ' +
  'explicit-constants tradition for O-BS-A; mechanical grep for O-BS-D). ' +
  'O-BS-B (pin A) is technically closable via the imp-1179 / imp-1182 ' +
  'structural decomposition + BS-2008 paper-walk but the OUTCOME is likely-' +
  'binding: at the central A_BS ~ 6 the (log T_PT)^6 ~ 5.6e8 multiplier ' +
  'destroys the formal 2.04e6 tightening at sigma = 0.75, so the rigorous ' +
  'tightening survives only at A_BS <= 4 (requires Heath-Brown 2008 / ' +
  'Soundararajan-Tao 2024 sharper-mollifier refinement). O-BS-C (edge ' +
  'behaviour sigma -> 1) requires genuinely new input -- no published BS-' +
  'style extension exists for sigma in (0.85, 1) with uniform constants. ' +
  'The dedicated explicit-constants paper outlined in STEP 5 would close ' +
  'O-BS-A + O-BS-B + O-BS-D and deliver a rigorous Lambda <= ~ 1e-5 in the ' +
  'A_BS = 4 + sharper-mollifier scenario, or NO rigorous tightening if A_BS ' +
  'lands in [5, 8] at production sigma. The headline imp-1306 formal claim ' +
  '"2.04e6 tightening -> Lambda <= 1.51e-11" is NOT recoverable rigorously ' +
  'within the BS 2008 framework; closing all four obstructions yields at ' +
  'most a 3-30x rigorous tightening, not 6 orders of magnitude.';

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 -- Paper outline for the dedicated explicit-constants paper.
// ─────────────────────────────────────────────────────────────────────────────

const DEDICATED_PAPER_OUTLINE = Object.freeze({
  proposedTitle:
    'Explicit-constants version of the Bui-Soundararajan 2008 zero-density ' +
    'estimate, with application to the truncation tail at T_PT = 3e12.',
  proposedAuthors:
    'TBD -- a collaboration in the Kadiri-Lumley-Ng + Johnston-Yang ' +
    'explicit-constants tradition.',
  expectedLengthPages: '40-60 pages (medium-length explicit-constants paper)',
  proposedVenue:
    'Acta Arithmetica OR J. Number Theory OR Math. Comp. (explicit-constants ' +
    'venue tradition).',
  sections: Object.freeze([
    Object.freeze({
      n: 1,
      title: 'Introduction and statement of the main theorem',
      contents:
        'State the main theorem: an effective version of BS 2008 of the form ' +
        'N(sigma, T) <= C_BS T^{8(1-sigma)/(11+1.5sigma)} (log T)^A with C_BS ' +
        'explicit and A pinned to a specific integer. Compare to Ingham 1940 ' +
        'and quote the application to E_trunc_pt at T_PT = 3e12.',
      lemmasNeeded: 'none (intro)',
    }),
    Object.freeze({
      n: 2,
      title: 'Effective Heath-Brown 4th moment of zeta',
      contents:
        'Track the implicit constant and log-power through the proof of ' +
        'INT_0^T |zeta(1/2 + it)|^4 dt. The textbook bound is ~ T (log T)^4 ' +
        '/ (2 pi^2) but the literature constants vary. Pin the constant.',
      lemmasNeeded: 'Lemma 2.1 (effective HB 4th moment with explicit C_4 and A_4 = 4)',
    }),
    Object.freeze({
      n: 3,
      title: 'Effective Bombieri-Montgomery mean-value theorem',
      contents:
        'Track the implicit constant and log-power through the BMMV step. ' +
        'Most existing explicit versions give a clean (log T)^0 constant with ' +
        'multiplier independent of the kernel cutoff.',
      lemmasNeeded: 'Lemma 3.1 (effective BMMV with explicit C_BMMV, A_BMMV = 0)',
    }),
    Object.freeze({
      n: 4,
      title: 'Selberg-style Dirichlet polynomial mollifier with explicit constants',
      contents:
        'Track the mollifier constants in the BS 2008 construction. This is ' +
        'the dominant source of A power; aim to choose mollifier length and ' +
        'amplifier degree so that a_mol = 2 (not the imp-1182 central 4).',
      lemmasNeeded:
        'Lemma 4.1 (mollifier length choice) + Lemma 4.2 (effective ' +
        'mollifier with explicit C_mol and a_mol = 2)',
    }),
    Object.freeze({
      n: 5,
      title: 'Explicit amplifier and the BS exponent',
      contents:
        'Pin the amplifier degree and track the log-power contribution. ' +
        'Aim for a_amp = 0 by choosing a no-amplifier variant (single-' +
        'kernel mollifier), accepting a possibly weaker C_BS in exchange.',
      lemmasNeeded:
        'Lemma 5.1 (explicit amplifier with C_amp, a_amp = 0) + ' +
        'Lemma 5.2 (composed exponent e_BS unchanged from BS 2008).',
    }),
    Object.freeze({
      n: 6,
      title: 'Composed bound and the value of A_BS',
      contents:
        'Combine Lemmas 2.1 + 3.1 + 4.2 + 5.1 to obtain the explicit ' +
        'theorem: A_BS = 4 + 0 + 2 + 0 = 6 in the default-mollifier path, ' +
        'or A_BS = 3 + 0 + 1 + 0 = 4 in the sharper Heath-Brown 2008 + ' +
        'Soundararajan-Tao 2024 path. Quote the explicit C_BS.',
      lemmasNeeded:
        'Theorem 6.1 (effective BS 2008) + Corollary 6.2 (explicit C_BS ' +
        'and A_BS in the default and refined paths).',
    }),
    Object.freeze({
      n: 7,
      title: 'Application to E_trunc_pt at T_PT = 3e12',
      contents:
        'Plug the explicit bound into the imp-447 / imp-459 integral form ' +
        'and recompute E_trunc_pt. Compare to Ingham baseline 3.06e-5. ' +
        'Quote two scenarios: default-path (A_BS = 6, rigorous tightening = ' +
        '1.0 at sigma = 0.75) and refined-path (A_BS = 4, rigorous ' +
        'tightening ~ 3x at sigma = 0.75).',
      lemmasNeeded:
        'Theorem 7.1 (rigorous Lambda upper bound in default-path) + ' +
        'Theorem 7.2 (rigorous Lambda upper bound in refined-path).',
    }),
    Object.freeze({
      n: 8,
      title: 'Sigma-shift discussion and edge behaviour (O-BS-C)',
      contents:
        'Discuss whether the explicit constants extend uniformly to ' +
        'sigma > 0.85. Document the residual obstruction O-BS-C; flag ' +
        'as future work.',
      lemmasNeeded: 'Discussion only; no new theorem.',
    }),
    Object.freeze({
      n: 9,
      title: 'Acknowledgements + bibliography (40-60 references)',
      contents:
        'Cite BS 2008, HB 1981, BMMV, Selberg 1942, Conrey 1989, Kadiri ' +
        '2013, Kadiri-Lumley-Ng 2018, Simonic 2020, Johnston-Yang 2023, ' +
        'Ingham 1940, Platt-Trudgian 2021, and the project bibliography.',
      lemmasNeeded: 'none',
    }),
  ]),
  totalLemmasNeeded: 8,
  totalTheoremsNeeded: 3,
  bestCaseRigorousLambda: '~ 1e-5 (refined-path A_BS = 4 at sigma = 0.75; factor 3x over Ingham 3.06e-5)',
  defaultCaseRigorousLambda: '3.06e-5 unchanged (default-path A_BS = 6 loses to Ingham at sigma = 0.75)',
  honestCaveat:
    'The paper would be a legitimate contribution to the explicit-constants ' +
    'literature regardless of whether it tightens Lambda. The HEADLINE imp-' +
    '1306 claim "factor 2.04e6 -> Lambda <= 1.51e-11" is NOT what the paper ' +
    'would deliver; the realistic delivery is "factor 1x to 30x" (default to ' +
    'refined paths). The imp-1306 ticket spec is honest about this: it asked ' +
    'to MAP the rigor port, not to claim the formal tightening.',
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 6 -- Cross-references to imp-1306 / imp-1123 / imp-1179 / imp-1182 / etc.
// ─────────────────────────────────────────────────────────────────────────────

const CROSS_REFERENCES = Object.freeze({
  'imp-1306':
    'src/data/imp-1306-ingham-sharpening.js -- the parent ticket identifying ' +
    'BS as the single drop-in modern alternative and naming the formal 2.04e6 ' +
    'factor + research-grade obstructions.',
  'imp-1123':
    'src/data/bui-soundararajan-rigorous-port-2026-05.js -- the source of ' +
    'O-BS-A through O-BS-D obstruction definitions.',
  'imp-1124':
    'src/data/bui-soundararajan-optimal-sigma-2026-05.js -- BS-formal argmin ' +
    'at sigma = 0.99 (informs O-BS-C closure scenarios).',
  'imp-1164':
    'src/data/imp-1164-bui-sound-rigorous-port.js -- companion 50-point sigma ' +
    'sweep on [0.5, 0.75].',
  'imp-1179':
    'src/data/imp-1179-bs-log-T-power-A-bound.js -- crossover threshold ' +
    'A* ~ 4.32 + literature window [4, 12] central 8 on A_BS.',
  'imp-1182':
    'src/data/imp-1182-bs-2008-paper-walk-A-bound.js -- structural derivation ' +
    'refining A_BS to window [4, 8] central 6.',
  'imp-447':
    'src/data/finite-height-beats-platt-trudgian.js -- original imp-447 / ' +
    'imp-459 integral chain producing the headline 3.06e-5.',
  'imp-1261':
    'src/data/imp-1261-asymptotic-lambda-redirect-shipped.js -- the ' +
    'unconditional asymptotic Lambda composition consuming E_trunc_pt.',
  'imp-1107':
    'src/data/sota-asymptotic-alternatives-2026-05.js -- BS / GY / Conrey-' +
    'Snaith survey that originally proposed the BS route.',
});

// ─────────────────────────────────────────────────────────────────────────────
// Frozen export record.
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1321_BUI_SOUNDARARAJAN_RIGOR_PORT = Object.freeze({
  id: 'imp-1321',
  ticket: 'imp-1321',
  title: 'Lambda tightening: Bui-Soundararajan 2008 rigor port (close O-BS-A through O-BS-D)',
  shippedAt: '2026-05-29T00:00:00Z',
  shippedBy: 'opus-4-7 (subagent-worktree)',

  // STEP 1.
  bs2008Statement: BS_2008_PRECISE_STATEMENT,

  // STEP 2.
  imp1123SourceFile: IMP_1123_SOURCE_FILE,
  obstructionsFromImp1123: OBSTRUCTIONS_FROM_IMP_1123,
  obstructionCount: OBSTRUCTIONS_FROM_IMP_1123.length,  // 4

  // STEP 3.
  perObstructionClosability: PER_OBSTRUCTION_CLOSABILITY,
  perObstructionCount: PER_OBSTRUCTION_CLOSABILITY.length, // 4

  // STEP 4.
  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  verdictDetail: VERDICT_DETAIL,

  // STEP 5.
  paperOutline: DEDICATED_PAPER_OUTLINE,

  // STEP 6 + Cross-references.
  crossReferences: CROSS_REFERENCES,

  // Pinned numerical constants for tripwire verification.
  pinnedNumerics: Object.freeze({
    T_PT: 3e12,
    LOG_T_PT_APPROX: 28.7296,
    SIGMA_OPT_PRODUCTION: 0.75,
    INGHAM_EXPONENT_AT_0P75: 0.6,
    BS_EXPONENT_AT_0P75: 0.16495,
    FORMAL_TIGHTENING_FACTOR: 2.04e6,
    CROSSOVER_A_STAR_AT_0P75: 4.32,
    LOG_T_PT_TO_6: 5.6e8,
    A_BS_WINDOW_LOW: 4,
    A_BS_WINDOW_CENTRAL: 6,
    A_BS_WINDOW_HIGH: 8,
    BS_FORMAL_E_TRUNC_AT_0P75: 1.51e-11,
    INGHAM_E_TRUNC_AT_0P75: 3.06e-5,
  }),
});

export default IMP_1321_BUI_SOUNDARARAJAN_RIGOR_PORT;

// ─────────────────────────────────────────────────────────────────────────────
// BUILD-TIME TRIPWIRES (12 shipped; ticket spec requires 10+).
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1321_BUI_SOUNDARARAJAN_RIGOR_PORT_ASSERTIONS = [

  // Tripwire 1: BS 2008 stated precisely with the published exponent formula.
  {
    id: 'imp1321-bs2008-stated-precisely-with-published-exponent',
    why:
      'The BS 2008 theorem must be stated with the published exponent ' +
      'e_BS(sigma) = 8(1-sigma)/(11+1.5sigma), the validity range sigma in ' +
      '[1/2, 1], and the published journal reference J. London Math. Soc. (2) ' +
      '78 (2008) 597-606. A drift in any of these would falsify the source.',
    holds: () => {
      const s = IMP_1321_BUI_SOUNDARARAJAN_RIGOR_PORT.bs2008Statement;
      return (
        typeof s === 'object' && s !== null &&
        typeof s.paper === 'string' &&
        /Bui/.test(s.paper) && /Soundararajan/.test(s.paper) &&
        /J\. London Math\. Soc\..*78/.test(s.paper) &&
        /597-606/.test(s.paper) &&
        typeof s.exponentFormula === 'string' &&
        /8.*1.*sigma.*11.*1\.5.*sigma/.test(s.exponentFormula) &&
        typeof s.validityRange === 'string' &&
        /1\/2/.test(s.validityRange) && /1/.test(s.validityRange)
      );
    },
  },

  // Tripwire 2: exactly 4 obstructions named O-BS-A through O-BS-D.
  {
    id: 'imp1321-four-obstructions-named-O-BS-A-through-O-BS-D',
    why:
      'The ticket spec requires listing O-BS-A through O-BS-D explicitly. A ' +
      'drift to fewer than 4 or to differently-named obstructions would ' +
      'orphan this file from the imp-1123 source.',
    holds: () => {
      const obs = IMP_1321_BUI_SOUNDARARAJAN_RIGOR_PORT.obstructionsFromImp1123;
      if (!Array.isArray(obs) || obs.length !== 4) return false;
      const ids = obs.map((o) => o.id);
      return (
        ids.includes('O-BS-A') &&
        ids.includes('O-BS-B') &&
        ids.includes('O-BS-C') &&
        ids.includes('O-BS-D')
      );
    },
  },

  // Tripwire 3: each obstruction has a current rigor status from a closed set.
  {
    id: 'imp1321-each-obstruction-has-current-rigor-status',
    why:
      'The ticket spec requires per-obstruction "current rigor status". Each ' +
      'must carry one of the allowed status strings (open-research-grade, ' +
      'open-research-grade-likely-binding, open-needs-new-input, open-engine-' +
      'closable). A drift to a free-form status would fire this tripwire.',
    holds: () => {
      const obs = IMP_1321_BUI_SOUNDARARAJAN_RIGOR_PORT.obstructionsFromImp1123;
      const allowed = new Set([
        'open-research-grade',
        'open-research-grade-likely-binding',
        'open-needs-new-input',
        'open-engine-closable',
      ]);
      return obs.every(
        (o) =>
          typeof o.currentRigorStatus === 'string' &&
          allowed.has(o.currentRigorStatus) &&
          typeof o.statement === 'string' &&
          o.statement.length > 50 &&
          typeof o.blockingConsequence === 'string' &&
          o.blockingConsequence.length > 30
      );
    },
  },

  // Tripwire 4: per-obstruction closability assessment present.
  {
    id: 'imp1321-per-obstruction-closability-assessment-present',
    why:
      'The ticket spec requires per-obstruction closability classification ' +
      '(addressable via 2024+ techniques + additional input + effort). A ' +
      'drift that drops any of the per-obstruction fields would falsify the ' +
      'STEP 3 deliverable.',
    holds: () => {
      const perObs = IMP_1321_BUI_SOUNDARARAJAN_RIGOR_PORT.perObstructionClosability;
      if (!Array.isArray(perObs) || perObs.length !== 4) return false;
      const allowedVerdicts = new Set([
        'closable-with-existing-techniques',
        'closable-with-existing-techniques-but-likely-binding',
        'needs-new-input',
        'engine-closable',
      ]);
      return perObs.every(
        (p) =>
          typeof p.id === 'string' && /^O-BS-[ABCD]$/.test(p.id) &&
          typeof p.closabilityVerdict === 'string' &&
          allowedVerdicts.has(p.closabilityVerdict) &&
          typeof p.addressableVia2024PlusTechniques === 'boolean' &&
          Array.isArray(p.candidateTechniques) &&
          p.candidateTechniques.length >= 1 &&
          typeof p.additionalInputNeeded === 'string' &&
          typeof p.effortEstimate === 'string'
      );
    },
  },

  // Tripwire 5: verdict in the allowed set.
  {
    id: 'imp1321-verdict-is-one-of-allowed-strings',
    why:
      'The verdict must be one of the four allowed strings. A verdict outside ' +
      'this set would mean the audit shipped a non-canonical conclusion.',
    holds: () => {
      const v = IMP_1321_BUI_SOUNDARARAJAN_RIGOR_PORT.verdict;
      const allowed = IMP_1321_BUI_SOUNDARARAJAN_RIGOR_PORT.allowedVerdicts;
      return typeof v === 'string' && allowed.includes(v);
    },
  },

  // Tripwire 6: paper outline present with at least 5 sections.
  {
    id: 'imp1321-paper-outline-present-with-sections-and-lemmas',
    why:
      'The ticket spec STEP 5 requires a dedicated-paper outline including ' +
      'sections, lemmas, and expected length. A drift to fewer than 5 ' +
      'sections or to missing lemma counts would falsify the deliverable.',
    holds: () => {
      const p = IMP_1321_BUI_SOUNDARARAJAN_RIGOR_PORT.paperOutline;
      if (typeof p !== 'object' || p === null) return false;
      if (typeof p.proposedTitle !== 'string') return false;
      if (typeof p.expectedLengthPages !== 'string') return false;
      if (!Array.isArray(p.sections) || p.sections.length < 5) return false;
      return p.sections.every(
        (s) =>
          typeof s.n === 'number' &&
          typeof s.title === 'string' &&
          s.title.length > 5 &&
          typeof s.contents === 'string' &&
          s.contents.length > 30 &&
          typeof s.lemmasNeeded === 'string'
      );
    },
  },

  // Tripwire 7: cross-references to imp-1306 and imp-1123 present.
  {
    id: 'imp1321-cross-references-imp-1306-and-imp-1123',
    why:
      'The ticket spec requires cross-referencing imp-1306 (parent) and ' +
      'imp-1123 (obstruction source). Missing either would orphan this audit.',
    holds: () => {
      const x = IMP_1321_BUI_SOUNDARARAJAN_RIGOR_PORT.crossReferences;
      return (
        typeof x === 'object' &&
        x !== null &&
        typeof x['imp-1306'] === 'string' &&
        typeof x['imp-1123'] === 'string' &&
        typeof x['imp-1179'] === 'string' &&
        typeof x['imp-1182'] === 'string'
      );
    },
  },

  // Tripwire 8: at least 5 sources cited (papers / refs).
  {
    id: 'imp1321-at-least-five-sources-cited',
    why:
      'The ticket spec requires at least 5 source citations. Counting BS ' +
      '2008 + its 4 in-proof citations + 5+ techniques in O-BS-A and O-BS-B ' +
      'closures + Ingham 1940 baseline. A drift to fewer than 5 distinct ' +
      'cited works would fire this tripwire.',
    holds: () => {
      const cites = new Set();
      const s = IMP_1321_BUI_SOUNDARARAJAN_RIGOR_PORT.bs2008Statement;
      if (s && Array.isArray(s.citationsInTheProof)) {
        s.citationsInTheProof.forEach((c) => cites.add(c));
      }
      if (s && typeof s.paper === 'string') cites.add(s.paper);
      const perObs = IMP_1321_BUI_SOUNDARARAJAN_RIGOR_PORT.perObstructionClosability;
      perObs.forEach((p) => {
        if (Array.isArray(p.candidateTechniques)) {
          p.candidateTechniques.forEach((t) => {
            if (typeof t.cite === 'string' && t.cite.length > 5 && t.cite !== 'n/a') {
              cites.add(t.cite);
            }
          });
        }
      });
      return cites.size >= 5;
    },
  },

  // Tripwire 9: SEMANTIC -- O-BS-A is closable, O-BS-C needs new input.
  {
    id: 'imp1321-semantic-O-BS-A-closable-O-BS-C-needs-new-input',
    why:
      'SEMANTIC CHECK: the audit s key honest finding is that O-BS-A ' +
      '(effective C_BS) is cleanly closable via Kadiri-tradition explicit-' +
      'constants techniques while O-BS-C (edge behaviour sigma -> 1) requires ' +
      'genuinely new input outside the BS 2008 framework. A regression that ' +
      'silently flipped either classification would mis-represent the rigor ' +
      'port feasibility.',
    holds: () => {
      const perObs = IMP_1321_BUI_SOUNDARARAJAN_RIGOR_PORT.perObstructionClosability;
      const a = perObs.find((p) => p.id === 'O-BS-A');
      const c = perObs.find((p) => p.id === 'O-BS-C');
      return (
        a && a.closabilityVerdict === 'closable-with-existing-techniques' &&
        a.addressableVia2024PlusTechniques === true &&
        c && c.closabilityVerdict === 'needs-new-input' &&
        c.addressableVia2024PlusTechniques === false
      );
    },
  },

  // Tripwire 10: SEMANTIC -- A_BS window matches imp-1179 / imp-1182.
  {
    id: 'imp1321-semantic-A-BS-window-matches-imp-1179-imp-1182',
    why:
      'SEMANTIC CHECK: the pinnedNumerics A_BS window must match the in-' +
      'project source: imp-1182 narrowed imp-1179s [4, 12] to [4, 8] central 6. ' +
      'A drift outside this window would mean the audit silently disagrees with ' +
      'the upstream structural derivation.',
    holds: () => {
      const p = IMP_1321_BUI_SOUNDARARAJAN_RIGOR_PORT.pinnedNumerics;
      return (
        p.A_BS_WINDOW_LOW === 4 &&
        p.A_BS_WINDOW_CENTRAL === 6 &&
        p.A_BS_WINDOW_HIGH === 8 &&
        Math.abs(p.CROSSOVER_A_STAR_AT_0P75 - 4.32) < 0.1
      );
    },
  },

  // Tripwire 11: SEMANTIC -- verdict-detail discusses both rigorous gain
  // ceiling and the loss of the formal 2.04e6 claim.
  {
    id: 'imp1321-semantic-verdict-detail-honest-about-rigorous-vs-formal',
    why:
      'SEMANTIC CHECK: the verdict detail must explicitly disclose that the ' +
      'imp-1306 formal 2.04e6 claim is NOT recoverable rigorously within the ' +
      'BS 2008 framework. Glossing over this would falsely overstate the ' +
      'rigor port payoff.',
    holds: () => {
      const d = IMP_1321_BUI_SOUNDARARAJAN_RIGOR_PORT.verdictDetail;
      if (typeof d !== 'string') return false;
      return (
        /2\.04e6/.test(d) &&
        /(NOT recoverable|not recoverable|destroys|destroy)/.test(d) &&
        /A_BS/.test(d) &&
        /(rigorous tightening|rigorous Lambda)/.test(d)
      );
    },
  },

  // Tripwire 12: pinned BS-vs-Ingham numerical anchors at sigma = 0.75.
  {
    id: 'imp1321-pinned-numerics-bs-vs-ingham-at-sigma-0p75',
    why:
      'The pinned numerics must agree with the project headline: Ingham ' +
      'E_trunc 3.06e-5 vs BS formal E_trunc 1.51e-11 at sigma = 0.75 with ' +
      'T_PT = 3e12. A drift in either anchor means the audit has decohered ' +
      'from imp-1123 / imp-1306.',
    holds: () => {
      const p = IMP_1321_BUI_SOUNDARARAJAN_RIGOR_PORT.pinnedNumerics;
      return (
        p.T_PT === 3e12 &&
        Math.abs(p.INGHAM_EXPONENT_AT_0P75 - 0.6) < 1e-6 &&
        Math.abs(p.BS_EXPONENT_AT_0P75 - 0.16495) < 1e-4 &&
        Math.abs(p.INGHAM_E_TRUNC_AT_0P75 - 3.06e-5) < 1e-6 &&
        Math.abs(p.BS_FORMAL_E_TRUNC_AT_0P75 - 1.51e-11) < 1e-12 &&
        p.SIGMA_OPT_PRODUCTION === 0.75
      );
    },
  },
];
