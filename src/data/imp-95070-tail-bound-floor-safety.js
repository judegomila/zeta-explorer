/**
 * imp-95070 - Does an EXPLICIT analytic tail bound replace the floor-UNSAFE
 * Tx underflow truncation? (measurement of imp-95017 item (4)).
 *
 * THE OPEN NOTE. imp-95017-witness-floor-reaudit.js item (4) flagged that the
 * far-mass tail sum
 *      Tx(theta) = sum_{j>=2} (1 + g(j))^(-theta),
 *      g(j) = 2^beta (2^(j-1) - 1) / (Q 2^(j beta)),   Q = 2^(-(1-beta)),
 * is summed in double precision only until the first term UNDERFLOWS to the
 * IEEE denormal floor (theta = 2 at j = 807, theta = 10 at j = 162) and then
 * STOPS, silently dropping every later positive term. Because the base floor
 * is F = E / (Tx M), a smaller computed Tx makes F strictly LARGER than the
 * true floor - floor-UNSAFE in DIRECTION (it nudges a lower bound up). imp-95017
 * only characterized the FIRST dropped term (~1e-324, empirical) and leaned on
 * "it is the denormal floor" as the safety argument. This module asks whether
 * an explicit CLOSED-FORM upper bound on the ENTIRE dropped tail replaces that
 * empirical denormal argument with a provable one.
 *
 * THE ANALYTIC BOUND (elementary, this module).
 *   Step 1 (g grows geometrically). For every integer j >= 2 we have
 *   2^(j-1) - 1 >= 2^(j-2) (equivalent to 2^(j-2) >= 1). Hence
 *        g(j) >= (2^beta / (4 Q)) 2^(j(1-beta)) =: A 2^(j(1-beta)),   A = 2^beta/(4Q).
 *   With the repo constants (beta = 1/3, Q = 2^(-2/3)) this gives A = 1/2 EXACTLY.
 *   Step 2 (per-term geometric majorant). Since 1 + g(j) > g(j) > 0,
 *        (1 + g(j))^(-theta) < g(j)^(-theta) <= A^(-theta) (2^(-theta(1-beta)))^j
 *        = A^(-theta) rho^j,   rho = 2^(-theta(1-beta)) < 1.
 *   Step 3 (closed-form tail). Summing the geometric majorant from the first
 *   dropped index J = dropJ(theta) to infinity,
 *        sum_{j>=J} (1+g(j))^(-theta) <= A^(-theta) rho^J / (1 - rho) =: TAIL(theta).
 *   TAIL(theta) is an EXPLICIT upper bound on ALL dropped tail mass - not just
 *   the first term - depending on nothing but (beta, Q, theta) and the dropJ at
 *   which the double sum stopped.
 *
 * THE ANSWER (measurement; NO QED).
 *  - YES: the denormal cutoff is replaceable by an explicit analytic bound.
 *    Adding TAIL(theta) back gives a CONSERVATIVE tail
 *        Tx_safe = Tx_computed + TAIL(theta)  >=  Tx_true,
 *    so F_safe = E / (Tx_safe M) <= E / (Tx_true M) = F_true - a PROVABLE lower
 *    bound, no longer relying on "the underflow term happened to be the last one".
 *  - The cost is negligible: log10 TAIL(2) ~ -323.09 and log10 TAIL(10) ~ -322.10,
 *    i.e. the safe floor differs from the reported base floor by ~1e-322 relative,
 *    ~314 orders of magnitude below the ~1e-8 float rounding the chain already
 *    prices. So the floor-UNSAFE DIRECTION note stands (unchanged) but its safety
 *    is now backed by a closed-form geometric-tail inequality rather than by the
 *    empirical denormal floor.
 *
 * SCOPE. Elementary tail estimate over the SAME g(j) the floor evaluator uses;
 * it does not re-audit E, M, h or the append-chain lift (imp-95017-subgap-append-lift
 * stays open). Import-light (no heavy bundle). Changes NO bound; measurement only;
 * does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// ── constants (re-declared, matching imp-95017 conventions) ──────────────────
const TB_BETA = 1 / 3;
const TB_C = 1;
const TB_V = 1;
const TB_D = 1;
const TB_Q = ((TB_C * Math.pow(TB_D, 1 - TB_BETA)) / TB_V) * Math.pow(2, -(1 - TB_BETA));

// geometric lower-bound coefficient A with g(j) >= A 2^(j(1-beta)) for j >= 2
const TB_A = Math.pow(2, TB_BETA) / (4 * TB_Q);

function tbGSharp(j) {
  return (Math.pow(2, TB_BETA) * (Math.pow(2, j - 1) - 1)) / (TB_Q * Math.pow(2, j * TB_BETA));
}

// double-precision tail: stops at the first underflow, returns dropJ and Tx_computed
function tbTailComputed(theta) {
  let s = 0;
  let dropJ = -1;
  for (let j = 2; j <= 4000; j++) {
    const g = tbGSharp(j);
    if (!Number.isFinite(g)) break;
    const t = Math.pow(1 + g, -theta);
    if (t === 0) {
      dropJ = j;
      break;
    }
    s += t;
  }
  return { TxComputed: s, dropJ };
}

// log10 of the analytic geometric tail bound TAIL(theta) = A^-theta rho^dropJ / (1 - rho)
// (computed in log space because TAIL itself underflows the double denormal floor)
function tbTailBoundLog10(theta, dropJ) {
  const rho = Math.pow(2, -theta * (1 - TB_BETA));
  return -theta * Math.log10(TB_A) + dropJ * Math.log10(rho) - Math.log10(1 - rho);
}

// ── evaluate at the two witnessed spacings ───────────────────────────────────
const TB_T2 = tbTailComputed(2);
const TB_T10 = tbTailComputed(10);
const TB_LOG10_TAIL_T2 = tbTailBoundLog10(2, TB_T2.dropJ);
const TB_LOG10_TAIL_T10 = tbTailBoundLog10(10, TB_T10.dropJ);

export const IMP95070_TAIL_BOUND_FLOOR_SAFETY = {
  ticket:
    "imp-95070 (does an explicit analytic tail bound replace the floor-UNSAFE Tx underflow truncation; imp-95017 item (4))",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; measures the referee-flagged Tx underflow-truncation floor-safety note from imp-95017-witness-floor-reaudit.js item (4).",
  question:
    "The far-mass tail Tx(theta) = sum_{j>=2} (1+g(j))^-theta is summed in double precision only until the first term underflows to the IEEE denormal floor, then stops - dropping later positive terms and making F = E/(Tx M) LARGER than true (floor-UNSAFE direction). Can an explicit closed-form geometric-tail bound on the dropped mass replace the empirical denormal-floor safety argument with a provable one?",
  analyticBound: {
    step1_gGeometricLowerBound:
      "for every j >= 2, 2^(j-1) - 1 >= 2^(j-2), hence g(j) >= A 2^(j(1-beta)) with A = 2^beta/(4Q); with beta = 1/3, Q = 2^(-2/3) this gives A = 1/2 exactly",
    step2_perTermMajorant:
      "since 1 + g(j) > g(j) > 0, (1+g(j))^-theta < g(j)^-theta <= A^-theta rho^j with rho = 2^(-theta(1-beta)) < 1",
    step3_closedFormTail:
      "sum_{j>=J} (1+g(j))^-theta <= A^-theta rho^J/(1-rho) = TAIL(theta), an explicit upper bound on ALL dropped tail mass (J = dropJ)",
    A: TB_A,
    Q: TB_Q,
  },
  measured: {
    theta2: {
      dropJ: TB_T2.dropJ,
      TxComputed: TB_T2.TxComputed,
      log10TailBound: TB_LOG10_TAIL_T2,
    },
    theta10: {
      dropJ: TB_T10.dropJ,
      TxComputed: TB_T10.TxComputed,
      log10TailBound: TB_LOG10_TAIL_T10,
    },
  },
  answer: {
    replaceable: true,
    safeConstruction:
      "Tx_safe = Tx_computed + TAIL(theta) >= Tx_true, hence F_safe = E/(Tx_safe M) <= E/(Tx_true M) = F_true is a PROVABLE lower bound - no longer relying on the underflow term being the last one",
    cost:
      "log10 TAIL(2) ~ -323.09 and log10 TAIL(10) ~ -322.10, so the safe floor differs from the reported base floor by ~1e-322 relative, ~314 orders of magnitude below the ~1e-8 float rounding already priced",
    directionNoteStands:
      "the floor-UNSAFE DIRECTION (dropping positive mass nudges the lower bound up) is unchanged; what changes is that its safety is now backed by a closed-form geometric-tail inequality rather than by the empirical IEEE denormal floor",
  },
  subGap:
    "This is an elementary tail estimate over the SAME g(j) the floor evaluator uses; it does not re-audit E, M, h or the append-chain lift. imp-95017-subgap-append-lift stays open.",
  isRigorous: true,
  rigorScope:
    "The three-step bound is elementary: 2^(j-1)-1 >= 2^(j-2) for j>=2 (arithmetic), the per-term geometric majorant, and the closed-form geometric series - all over the exact g(j) the floor uses. The dropJ values are read off the actual double-precision underflow. This measures the tail-mass safety only; it does not re-derive E, M, h or the append lift.",
  promotesBound: false,
  verdict:
    "YES - the floor-UNSAFE Tx underflow truncation is replaceable by an explicit analytic bound. Because g(j) >= (1/2) 2^(2j/3) for all j >= 2, every dropped term is majorized by A^-theta rho^j (rho = 2^(-2theta/3) < 1) and the entire dropped tail is bounded in closed form by TAIL(theta) = A^-theta rho^dropJ/(1-rho): log10 TAIL(2) ~ -323.09 (dropJ = 807) and log10 TAIL(10) ~ -322.10 (dropJ = 162). Adding TAIL(theta) back gives Tx_safe = Tx_computed + TAIL >= Tx_true, so F_safe = E/(Tx_safe M) is a PROVABLE lower bound; the cost is ~1e-322 relative, ~314 orders below the ~1e-8 float rounding already priced. The floor-UNSAFE DIRECTION note stands but its safety is now backed by a closed-form geometric-tail inequality rather than the empirical denormal floor. Measurement only; changes no bound; does NOT promote Lambda<=0.14; imp-95017-subgap-append-lift stays open; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95070_TAIL_BOUND_ASSERTIONS = [
  {
    id: "imp95070-A-exact-half",
    description:
      "the geometric lower-bound coefficient A = 2^beta/(4Q) equals 1/2 exactly at the repo constants (beta = 1/3, Q = 2^(-2/3))",
    holds: () => Math.abs(TB_A - 0.5) < 1e-15,
  },
  {
    id: "imp95070-g-geometric-lower-bound",
    description:
      "g(j) >= A 2^(j(1-beta)) for every j = 2..200 (the elementary 2^(j-1)-1 >= 2^(j-2) step underpinning the tail majorant)",
    holds: () => {
      for (let j = 2; j <= 200; j++) {
        if (tbGSharp(j) < TB_A * Math.pow(2, j * (1 - TB_BETA))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95070-per-term-majorant",
    description:
      "each computed term (1+g(j))^-theta is bounded by the geometric majorant A^-theta rho^j below the drop index, for both theta = 2 and theta = 10",
    holds: () =>
      [2, 10].every((theta) => {
        const rho = Math.pow(2, -theta * (1 - TB_BETA));
        const { dropJ } = tbTailComputed(theta);
        for (let j = 2; j < dropJ; j++) {
          const t = Math.pow(1 + tbGSharp(j), -theta);
          const ub = Math.pow(TB_A, -theta) * Math.pow(rho, j);
          if (t > ub * (1 + 1e-12)) return false;
        }
        return true;
      }),
  },
  {
    id: "imp95070-drop-indices",
    description:
      "the double-precision tail underflows at the imp-95017 indices (theta = 2 at j = 807, theta = 10 at j = 162) with a strictly positive computed Tx",
    holds: () =>
      TB_T2.dropJ === 807 &&
      TB_T10.dropJ === 162 &&
      TB_T2.TxComputed > 0 &&
      TB_T10.TxComputed > 0,
  },
  {
    id: "imp95070-tail-bound-negligible",
    description:
      "the explicit analytic tail bound is far below the ~1e-8 float rounding already priced: log10 TAIL(2) ~ -323.09 and log10 TAIL(10) ~ -322.10 (both < -300)",
    holds: () =>
      TB_LOG10_TAIL_T2 < -300 &&
      TB_LOG10_TAIL_T10 < -300 &&
      Math.abs(TB_LOG10_TAIL_T2 - -323.0866) < 1e-2 &&
      Math.abs(TB_LOG10_TAIL_T10 - -322.0978) < 1e-2,
  },
  {
    id: "imp95070-honesty-gate",
    description:
      "the verdict records the replaceable answer, the safe-construction direction, promotes no bound, keeps the append-lift sub-gap open, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95070_TAIL_BOUND_FLOOR_SAFETY.promotesBound === false &&
      IMP95070_TAIL_BOUND_FLOOR_SAFETY.answer.replaceable === true &&
      /imp-95017-subgap-append-lift/.test(IMP95070_TAIL_BOUND_FLOOR_SAFETY.subGap) &&
      /NO QED/.test(IMP95070_TAIL_BOUND_FLOOR_SAFETY.verdict) &&
      /refereed bound is changed/i.test(IMP95070_TAIL_BOUND_FLOOR_SAFETY.verdict),
  },
];

for (const a of IMP95070_TAIL_BOUND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95070-tail-bound-floor-safety assertion failed: ${a.id}`);
  }
}

export default IMP95070_TAIL_BOUND_FLOOR_SAFETY;
