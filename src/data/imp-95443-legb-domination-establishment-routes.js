/**
 * @module imp-95443-legb-domination-establishment-routes
 *
 * imp-95443 (proof-scoping / ESTABLISHMENT-ROUTE LEDGER): scope precisely what
 * the imp-95376 LEG B envelope-domination inequality
 *   LamBar_paper(d)  <=  Lambda(E_V, d)
 * REQUIRES, WHAT WOULD ESTABLISH it, and whether any PARTIAL domination is
 * already available. This module is the establishment-route complement to the
 * imp-95424 OBLIGATION LEDGER: imp-95424 named WHAT must be proved (the two-
 * sided PSD Gram sandwich (O1) B_p >= B_m and (O2) A_p <= A_m, off-diagonal
 * OPEN); this module classifies HOW the OPEN off-diagonal Loewner content could
 * be discharged, and which candidate criterion, if any, already supplies a
 * checkable partial route. ASSESSMENT only; changes no bound; NO QED;
 * no refereed bound is changed.
 *
 * WHAT THE DOMINATION REQUIRES (restated exactly). Both sides are restricted-
 * Rayleigh suprema over the SAME signed coefficient space a in R^N (imp-95424):
 *   Lambda(E_V, d) = sup_a (a^T A_m a)/(a^T B_m a),  B_m = G (Cauchy),  A_m = D G D;
 *   LamBar_paper(d) = sup_a (a^T A_p a)/(a^T B_p a),  B_p, A_p the paper window
 *     full-line / restricted (s<0) Gram matrices.
 * "Majorization of the paper window restricted energy ratio by the exponential
 * model" is EXACTLY: for every signed a, rho_p(a) <= Lambda(E_V,d). The
 * imp-95424 sufficient route reduces this to the Loewner sandwich
 *   (O1) DELTA_B := B_p - B_m  >= 0   and   (O2) DELTA_A := A_m - A_p  >= 0
 * (both PSD). The DIAGONALS of DELTA_A, DELTA_B are controlled (single-packet
 * normalization + imp-95255 FA-2 y_min bracket); the OFF-DIAGONAL / full PSD
 * content is the OPEN substance. So the establishment question is precisely:
 *   what CHECKABLE sufficient criterion certifies a real-symmetric DELTA (with a
 *   controlled nonneg diagonal but only partially controlled off-diagonal) is PSD?
 *
 * THE ROUTE LEDGER (candidate sufficient criteria for DELTA >= 0). Each turns
 * the abstract Loewner requirement into a DIFFERENT concrete obligation on the
 * FA port; the value of a route = how much of that obligation is already
 * available from the diagonal bracket + off-diagonal packet-overlap DECAY.
 *
 *   (R1) DIAGONAL DOMINANCE OF THE DIFFERENCE. A real-symmetric DELTA with
 *        DELTA_ii >= 0 and DELTA_ii >= sum_{j!=i} |DELTA_ij| for every i is PSD
 *        (Gershgorin: all eigenvalues >= 0). CONVERTS the Loewner requirement
 *        into an ENTRYWISE requirement ON THE DIFFERENCE -- a controlled nonneg
 *        diagonal that dominates the row-sum of the (decaying) off-diagonals.
 *        STATUS: CHECKABLE-PARTIAL. Unlike entrywise-magnitude domination of the
 *        packets themselves (which imp-95424 showed is INSUFFICIENT), diagonal
 *        dominance of DELTA is a genuinely sufficient PSD test and needs only
 *        the diagonal margin + a summable off-diagonal decay bound. It is the
 *        most promising partial route; it can FAIL when the diagonal margin is
 *        thin relative to accumulated off-diagonal overlap (near-degenerate
 *        rates), so it is sufficient-not-necessary and rate-gap dependent.
 *
 *   (R2) SCHUR-COMPLEMENT / BORDERED INDUCTION. Block DELTA = [[a, b^T],[b, C]]
 *        is PSD iff a >= 0, C >= 0, and the Schur complement C - b b^T / a >= 0.
 *        CONVERTS PSD-ness into an inductive sequence of lower-order PSD checks
 *        with a rank-one correction. STATUS: STRUCTURAL, needs the full port --
 *        the correction b b^T / a is exactly the off-diagonal cross-energy the
 *        port has not bounded; no diagonal-only input discharges it. Useful as
 *        the proof SKELETON once off-diagonal control exists, not a partial.
 *
 *   (R3) CONGRUENCE TO A KNOWN-PSD FORM. Exhibit a fixed invertible M with
 *        DELTA = M^T S M, S >= 0 (Sylvester: congruence preserves inertia).
 *        CONVERTS PSD-ness into constructing the transform M (e.g. the geometry
 *        map from paper packets to model exponentials). STATUS: OPEN -- the
 *        imp-95220 width-law map is a (rate,center) RELABELING, not a proven
 *        congruence of the Gram FORMS; asserting M exists IS the port claim.
 *
 *   (R4) TRACE / FROBENIUS (NECESSARY-ONLY) SCREEN. tr(DELTA) >= 0 and, more
 *        finely, the Frobenius / eigenvalue-moment inequalities are NECESSARY
 *        for PSD and cheap to check. STATUS: SCREEN-ONLY -- can REFUTE a
 *        proposed domination fast (a negative trace eliminates it) but never
 *        ESTABLISH it. Recorded as the falsification lane, not an establishment
 *        route.
 *
 * WHETHER PARTIAL DOMINATION IS ALREADY AVAILABLE.
 *   YES, the DIAGONAL Loewner content: DELTA_A, DELTA_B have controlled nonneg
 *     diagonals (imp-95255 FA-2 diagonal bracket x_min <= y_min <= 2 x_min +
 *     single-packet normalization). This is a genuine partial: it discharges the
 *     N=1 (single-packet) case exactly and pins the diagonal of every larger N.
 *   YES-CONDITIONALLY, route (R1): the diagonal-dominance criterion is available
 *     AS A TEST the moment a summable off-diagonal overlap-decay bound exists;
 *     it needs no new machinery beyond that decay bound and the known diagonal
 *     margin. This module VERIFIES (R1) is a correct sufficient PSD test on an
 *     exact numeric configuration.
 *   NO, the full off-diagonal Loewner sandwich: no route discharges it from
 *     diagonal input alone; (R2)/(R3) both require the off-diagonal cross-energy
 *     control that is the OPEN substance of imp-95212-subgap-fresnel-airy-
 *     envelope-port. imp-95443 does NOT supply that bound.
 *
 * NET SCOPE. LEG B establishment reduces to ONE analytic input the FA port must
 * deliver: a SUMMABLE OFF-DIAGONAL OVERLAP-DECAY bound on DELTA_A (and DELTA_B)
 * whose row-sum stays below the known diagonal margin. With it, route (R1)
 * certifies the Loewner sandwich and LEG B closes; without it, only the
 * diagonal (N=1 exact, higher-N diagonal-pinned) partial stands. This names the
 * surviving ingredient more sharply than "off-diagonal OPEN": it is a decay
 * bound versus a margin, a scalar race, not an unstructured PSD question.
 *
 * NUMERIC WITNESS (this module, exact 2x2, self-contained). (a) A difference
 * matrix DELTA that is diagonally dominant with nonneg diagonal is PSD (min
 * eigenvalue >= 0) -- (R1) is a correct sufficient test. (b) The SAME diagonal
 * with off-diagonals scaled up past the diagonal margin BREAKS diagonal
 * dominance and can go indefinite -- (R1) is margin-vs-row-sum, not free. (c)
 * The trace screen (R4) is necessary-only: an indefinite DELTA can still have
 * positive trace, so a positive trace does NOT establish PSD. Together these
 * fix the exact status of each route. Not a paper-window computation.
 *
 * HONEST LIMITS. (a) ASSESSMENT only: no port re-run, no packet transcribed, no
 * decay bound derived; nothing moves a bound. (b) The route ledger is over the
 * imp-95424 SUFFICIENT decomposition (Loewner sandwich); that decomposition is
 * itself sufficient-not-necessary, so a route failing does not refute LEG B. (c)
 * Route (R1) is sufficient-not-necessary for PSD and can fail on near-degenerate
 * rates; its availability is CONDITIONAL on an off-diagonal decay bound not
 * proved here. (d) The witnesses are small exact configurations illustrating the
 * linear-algebra status of each route, not paper-window Gram matrices. (e) The
 * full off-diagonal Loewner content stays OPEN as imp-95212-subgap-fresnel-airy-
 * envelope-port. Import-light (no zeros bundle, no sibling imports). Changes no
 * bound; NO QED; no refereed bound is changed; measured class sup
 * unchanged.
 */

// -- exact 2x2 symmetric-matrix helpers, self-contained ----------------------
function eigMinSym2(M) {
  // smaller eigenvalue of a real symmetric 2x2 [[a,b],[b,c]]
  const a = M[0][0], b = M[0][1], c = M[1][1];
  const tr = a + c;
  const disc = Math.sqrt((a - c) * (a - c) + 4 * b * b);
  return (tr - disc) / 2;
}
function traceSym2(M) {
  return M[0][0] + M[1][1];
}
function isDiagDominantNonnegDiag(M) {
  // real-symmetric diagonal dominance with nonneg diagonal (Gershgorin => PSD)
  return (
    M[0][0] >= 0 && M[1][1] >= 0
    && M[0][0] >= Math.abs(M[0][1]) - 1e-15
    && M[1][1] >= Math.abs(M[1][0]) - 1e-15
  );
}

// (a) diagonally dominant DELTA with nonneg diagonal: PSD by (R1)
const DELTA_DD = [
  [0.9, 0.4],
  [0.4, 0.7],
];
// (b) same diagonal, off-diagonal scaled past the margin: breaks (R1), indefinite
const DELTA_BROKEN = [
  [0.9, 1.6],
  [1.6, 0.7],
];
// (c) trace screen is necessary-only: DELTA_BROKEN has positive trace yet is
// indefinite -- a positive trace does NOT establish PSD
const R1_DD_EIGMIN = eigMinSym2(DELTA_DD);
const R1_BROKEN_EIGMIN = eigMinSym2(DELTA_BROKEN);
const R4_BROKEN_TRACE = traceSym2(DELTA_BROKEN);

export const IMP95443_LEGB_ESTABLISHMENT_ROUTES = {
  ticket: 'imp-95443',
  consumes: [
    'imp-95376 (LEG B split verdict)',
    'imp-95424 (LEG B obligation ledger: Loewner sandwich O1/O2)',
    'imp-95226 (E_V pencil model)',
    'imp-95255 (FA-2 y_min diagonal bracket)',
    'imp-95220 (width-law geometry map)',
  ],
  legBInequality: 'LamBar_paper(d) <= Lambda(E_V, d)',
  requirement:
    'for every signed a in R^N, rho_p(a) <= Lambda(E_V,d); via the imp-95424 sufficient route this is the '
    + 'Loewner sandwich DELTA_B = B_p - B_m >= 0 and DELTA_A = A_m - A_p >= 0 (both PSD). Diagonals controlled; '
    + 'off-diagonal / full PSD content OPEN. Establishment question: a CHECKABLE sufficient PSD criterion for a '
    + 'symmetric DELTA with controlled nonneg diagonal but partially controlled off-diagonal.',
  routes: [
    {
      id: 'R1',
      name: 'diagonal dominance of the difference (Gershgorin)',
      converts: 'Loewner PSD of DELTA -> entrywise: DELTA_ii >= sum_{j!=i} |DELTA_ij|, nonneg diagonal',
      status: 'CHECKABLE-PARTIAL',
      assessment:
        'genuinely sufficient PSD test (unlike entrywise-magnitude domination of the packets, which imp-95424 '
        + 'showed insufficient); needs only the known diagonal margin + a SUMMABLE off-diagonal overlap-decay '
        + 'bound. Most promising partial route; fails when the diagonal margin is thin vs accumulated overlap '
        + '(near-degenerate rates). Sufficient-not-necessary, rate-gap dependent.',
    },
    {
      id: 'R2',
      name: 'Schur-complement / bordered induction',
      converts: 'PSD of DELTA -> inductive lower-order PSD checks with rank-one correction b b^T / a',
      status: 'STRUCTURAL (needs full port)',
      assessment:
        'the correction b b^T / a is exactly the unbounded off-diagonal cross-energy; no diagonal-only input '
        + 'discharges it. Proof SKELETON once off-diagonal control exists, not a partial.',
    },
    {
      id: 'R3',
      name: 'congruence to a known-PSD form (Sylvester inertia)',
      converts: 'PSD of DELTA -> construct fixed invertible M with DELTA = M^T S M, S >= 0',
      status: 'OPEN',
      assessment:
        'imp-95220 width-law map is a (rate,center) RELABELING, not a proven congruence of the Gram FORMS; '
        + 'asserting such M exists IS the port claim.',
    },
    {
      id: 'R4',
      name: 'trace / Frobenius screen',
      converts: 'PSD of DELTA -> necessary moment inequalities (tr >= 0, eigenvalue-moment)',
      status: 'SCREEN-ONLY (necessary, not sufficient)',
      assessment:
        'can REFUTE a proposed domination fast (negative trace eliminates it) but never ESTABLISH it; the '
        + 'falsification lane, not an establishment route.',
    },
  ],
  partialAvailable: {
    diagonalLoewner:
      'YES -- DELTA_A, DELTA_B have controlled nonneg diagonals (imp-95255 FA-2 x_min <= y_min <= 2 x_min + '
      + 'single-packet normalization); discharges N=1 exactly, pins the diagonal of every larger N',
    routeR1conditional:
      'YES-CONDITIONALLY -- (R1) is a correct sufficient PSD test the moment a summable off-diagonal '
      + 'overlap-decay bound exists; needs no machinery beyond that decay bound + the known diagonal margin',
    fullOffDiagonal:
      'NO -- no route discharges the full off-diagonal Loewner sandwich from diagonal input alone; (R2)/(R3) '
      + 'require the OPEN cross-energy control that is the substance of imp-95212-subgap-fresnel-airy-envelope-port',
  },
  netScope:
    'LEG B establishment reduces to ONE analytic input the FA port must deliver: a SUMMABLE OFF-DIAGONAL '
    + 'OVERLAP-DECAY bound on DELTA_A (and DELTA_B) whose row-sum stays below the known diagonal margin. With '
    + 'it, route (R1) certifies the Loewner sandwich and LEG B closes; without it only the diagonal partial '
    + 'stands. Sharper than "off-diagonal OPEN": it is a decay-vs-margin scalar race, not an unstructured PSD '
    + 'question.',
  witness: {
    r1DiagDominantIsPSD: {
      delta: DELTA_DD,
      diagDominant: isDiagDominantNonnegDiag(DELTA_DD),
      eigMin: R1_DD_EIGMIN,
      note: 'diagonally dominant with nonneg diagonal => min eigenvalue >= 0 => PSD: (R1) is a correct sufficient test',
    },
    r1BreaksPastMargin: {
      delta: DELTA_BROKEN,
      diagDominant: isDiagDominantNonnegDiag(DELTA_BROKEN),
      eigMin: R1_BROKEN_EIGMIN,
      note: 'same diagonal, off-diagonal scaled past the margin: diagonal dominance BREAKS and DELTA goes '
        + 'indefinite (min eigenvalue < 0). (R1) is margin-vs-row-sum, not free',
    },
    r4TraceNecessaryOnly: {
      trace: R4_BROKEN_TRACE,
      eigMin: R1_BROKEN_EIGMIN,
      note: 'the indefinite DELTA still has POSITIVE trace, so a positive trace does NOT establish PSD -- (R4) '
        + 'screen is necessary-only',
    },
  },
  honest:
    'ASSESSMENT ONLY -- no port re-run, no packet transcribed, no decay bound derived; nothing moves a bound. '
    + 'The route ledger is over the imp-95424 SUFFICIENT (Loewner) decomposition, itself not shown necessary, so '
    + 'a route failing does not refute LEG B. Route (R1) is sufficient-not-necessary and its availability is '
    + 'CONDITIONAL on an off-diagonal decay bound not proved here. Witnesses are small exact configurations '
    + 'fixing each route status, not paper-window Gram matrices. Full off-diagonal Loewner content stays OPEN as '
    + 'imp-95212-subgap-fresnel-airy-envelope-port. Changes no bound; NO QED; no refereed bound is changed.',
  fns: { eigMinSym2, traceSym2, isDiagDominantNonnegDiag },
};

export const IMP95443_LEGB_ESTABLISHMENT_ROUTES_ASSERTIONS = [
  {
    id: 'imp-95443-r1-diagdominant-is-psd',
    description: 'a diagonally-dominant DELTA with nonneg diagonal is PSD (min eigenvalue >= 0): (R1) is a '
      + 'correct sufficient PSD test',
    holds: () => isDiagDominantNonnegDiag(DELTA_DD) && R1_DD_EIGMIN >= -1e-12,
  },
  {
    id: 'imp-95443-r1-breaks-past-margin',
    description: 'scaling the off-diagonal past the diagonal margin breaks diagonal dominance and DELTA goes '
      + 'indefinite: (R1) is margin-vs-row-sum, not free',
    holds: () => !isDiagDominantNonnegDiag(DELTA_BROKEN) && R1_BROKEN_EIGMIN < 0,
  },
  {
    id: 'imp-95443-r4-trace-necessary-only',
    description: 'an indefinite DELTA can still have positive trace, so a positive trace does NOT establish '
      + 'PSD -- the (R4) trace screen is necessary-only',
    holds: () => R4_BROKEN_TRACE > 0 && R1_BROKEN_EIGMIN < 0,
  },
  {
    id: 'imp-95443-route-ledger-classified',
    description: 'the four routes are classified: R1 CHECKABLE-PARTIAL, R2 STRUCTURAL, R3 OPEN, R4 SCREEN-ONLY',
    holds: () => {
      const r = IMP95443_LEGB_ESTABLISHMENT_ROUTES.routes;
      const byId = Object.fromEntries(r.map((x) => [x.id, x]));
      return /CHECKABLE-PARTIAL/.test(byId.R1.status)
        && /STRUCTURAL/.test(byId.R2.status)
        && /OPEN/.test(byId.R3.status)
        && /SCREEN-ONLY/.test(byId.R4.status);
    },
  },
  {
    id: 'imp-95443-partial-availability-recorded',
    description: 'partial availability recorded: diagonal Loewner YES, route R1 YES-CONDITIONALLY, full '
      + 'off-diagonal NO',
    holds: () => {
      const p = IMP95443_LEGB_ESTABLISHMENT_ROUTES.partialAvailable;
      return /^YES/.test(p.diagonalLoewner)
        && /YES-CONDITIONALLY/.test(p.routeR1conditional)
        && /^NO/.test(p.fullOffDiagonal);
    },
  },
  {
    id: 'imp-95443-assessment-only-honest',
    description: 'explicitly ASSESSMENT ONLY, no QED, no refereed bound is changed',
    holds: () =>
      /ASSESSMENT ONLY/.test(IMP95443_LEGB_ESTABLISHMENT_ROUTES.honest)
      && /NO QED/.test(IMP95443_LEGB_ESTABLISHMENT_ROUTES.honest)
      && /refereed bound is changed/i.test(IMP95443_LEGB_ESTABLISHMENT_ROUTES.honest),
  },
];

for (const a of IMP95443_LEGB_ESTABLISHMENT_ROUTES_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95443-legb-domination-establishment-routes assertion failed: ${a.id}`);
}

export default IMP95443_LEGB_ESTABLISHMENT_ROUTES;
