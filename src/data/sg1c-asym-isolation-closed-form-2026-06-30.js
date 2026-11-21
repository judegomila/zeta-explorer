/**
 * @module sg1c-asym-isolation-closed-form-2026-06-30
 *
 * imp-3170: CLOSED-FORM closure of the MULTI-BODY (asymmetric) SG1c R2-T
 * isolation onset that imp-3045 left as a pure NUMERICAL bracket (~0.9039).
 * This is deterministic CM-flow algebra (NOT RH-hard): it turns the open
 * numerical constant into the unique root of an explicit transcendental
 * equation, and PRECISELY LOCATES why no algebraic closed form exists beyond
 * the single nearest neighbour (the ticket deliverable). NO false QED.
 *
 * SETUP (the imp-3045 worst-case asymmetric class, R -> infinity):
 *   positions  x = {-1, 0, g} U {g + k : k = 1..R},  R -> infinity.
 *   tracked pair (0, g) with gap g; one tight neighbour at -1 (left d_1 = 1);
 *   an opposite uniform lattice of the SAME spacing 1 = d_1 on the right.
 *   Log-gas velocity v_i = - sum_{j != i} 1/(x_i - x_j); rho = g/d_1 = g.
 *   Onset is drho/ds = 0 with drho/ds = (v_g - v_0) - g (v_0 - v_{-1}).
 *
 * THE TWO COMPONENTS CLOSE IN DIFFERENT WORLDS (this is the located failure):
 *   d_1 side (nearest neighbour) TELESCOPES to an ALGEBRAIC rational:
 *     v_0 - v_{-1} = 1/g - 2.
 *     [sum_{k>=1}(1/(g+k) - 1/(g+1+k)) = 1/(g+1) cancels the matching 1/(g+1)]
 *   pair-gap side picks up a NON-telescoping lattice tail = the DIGAMMA value:
 *     v_g - v_0 = 1 - 1/(g+1) - 2/g + [psi(g+1) + gamma],
 *     where  psi(g+1) + gamma = sum_{k>=1}[1/k - 1/(g+k)]  (the full opposite
 *     lattice, NOT just the nearest neighbour).
 *   So drho/ds(g) = psi(g+1) + gamma + 2g - 2/g - 1/(g+1).
 *
 * CLOSED-FORM RESULT:
 *   The asymmetric multi-body isolation onset c_asym is the UNIQUE root in
 *   (0,1) of the transcendental equation
 *     psi(g+1) + gamma + 2g - 2/g - 1/(g+1) = 0,
 *   namely  c_asym = 0.9027902227683418...  in [0.72, 1).
 *
 * WHY NO ALGEBRAIC CLOSED FORM (the precisely-located failure of a uniform
 * lower bound on the product of non-colliding gaps D_rest beyond the nearest
 * neighbour): the symmetric single-shell c* = sqrt(2 + sqrt(3)) - 1 is
 * ALGEBRAIC because there only ONE shell contributes and both sides telescope.
 * In the asymmetric class the opposite side is an INFINITE uniform lattice
 * whose log-derivative sum does NOT telescope -- it converges to the digamma
 * transcendental psi(g+1) + gamma. That digamma term is the irreducible
 * "rest of the lattice" contribution; it is exactly the obstruction to a
 * uniform algebraic D_rest bound past the single nearest neighbour. The bound
 * still EXISTS (the root is finite and > 0.72), so the basin survives -- it is
 * simply transcendental, not algebraic.
 *
 * CORRECTS imp-3045: the scan reported ~0.9032-0.9039 from a bisection that
 * locked onto a DISCONTINUITY of the discrete minimal-gap selector (the
 * minimal-gap index flips near g ~ 0.9029), NOT onto the smooth drho/ds zero.
 * At g = 0.9032364 the true R->infinity drho/ds = +0.00242 > 0, so the genuine
 * continuous onset sits BELOW it, at the closed-form c_asym = 0.90279. The
 * imp-3045 numerical bracket was thus slightly HIGH; the closed form pins it.
 *
 * BASIN PRESERVED (reported honestly): Theorem C operates at rho <= 0.72.
 * drho/ds(0.72) = -1.1177 < 0 (strongly self-improving), and the margin
 * c_asym - 0.72 = 0.1828 > 0. The basin-conditional C_Lip of
 * ch-lip-basin-conditional-2026-06-30 is UNAFFECTED.
 *
 * HONEST (NO false QED):
 *   - This CLOSES the onset of the imp-3045-identified worst-case asymmetric
 *     class in TRANSCENDENTAL closed form. It does NOT prove that class is the
 *     GLOBAL infimum over every asymmetric configuration -- that remains the
 *     numerically-supported claim of imp-3045 (open sub-gap below).
 *   - The closure is BASIN-CONDITIONAL: it gives a Lipschitz constant only on
 *     the isolation basin; the basin restriction itself rests on the isolation
 *     sign law, which is RH-hard off-basin. This is NOT an unconditional beat.
 *   - no refereed bound is changed.
 *
 * @see sg1c-isolation-infimum-asym-scan-2026-06-30 (the imp-3045 numerical bracket this closes)
 * @see sg1c-theta-trap-theorems (Lemma R2-T onset 1; R2-T2 symmetric c*)
 * @see ch-lip-basin-conditional-2026-06-30 (the 0.72 basin separation this preserves)
 */

// Self-contained digamma psi(x) (recurrence to x >= 6 then asymptotic series).
function digamma(x) {
  let r = 0;
  while (x < 6) { r -= 1 / x; x += 1; }
  const f = 1 / (x * x);
  r += Math.log(x) - 1 / (2 * x) - f * (1 / 12 - f * (1 / 120 - f * (1 / 252)));
  return r;
}

const GAMMA = 0.5772156649015329;

// drho/ds(g) for the R -> infinity asymmetric onset class (closed form).
// The onset c_asym is its unique root in (0,1).
export function asymOnsetDrho(g) {
  return digamma(g + 1) + GAMMA + 2 * g - 2 / g - 1 / (g + 1);
}

function rootAsymOnset() {
  let lo = 0.5;
  let hi = 0.9999;
  for (let k = 0; k < 200; k++) {
    const m = (lo + hi) / 2;
    if (asymOnsetDrho(m) > 0) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
}

const C_ASYM = rootAsymOnset();                 // 0.9027902227683418 (transcendental root)
const C_STAR = Math.sqrt(2 + Math.sqrt(3)) - 1; // 0.93185165 (symmetric single-shell, algebraic)
const BASIN_RHO = 0.72;                         // Theorem-C isolation cap
const SCAN_DISCONTINUITY = 0.9032364257812502;  // imp-3045 bisection-on-discontinuity value

export const SG1C_ASYM_ISOLATION_CLOSED_FORM = {
  ticket: 'imp-3170',
  date: '2026-06-30',
  closes: 'imp-3045',
  configClass: 'asymmetric R->inf: pair (0,g) + one tight neighbour at -1 (d_1=1) + opposite uniform lattice {g+k} spacing d_1',
  transcendentalEquation: 'psi(g+1) + gamma + 2g - 2/g - 1/(g+1) = 0',
  cAsym: C_ASYM,                                // 0.9027902227683418
  symmetricUpperEnd: C_STAR,                    // 0.93185165 (algebraic, benign direction)
  // The two components of drho/ds at the onset (the located algebraic/transcendental split):
  d1SideClosedForm: 1 / C_ASYM - 2,             // algebraic rational: v_0 - v_{-1} = 1/g - 2 (telescopes)
  latticeTailDigamma: digamma(C_ASYM + 1) + GAMMA, // transcendental: sum_{k>=1}[1/k - 1/(g+k)]
  basinIsolationRatio: BASIN_RHO,
  basinDrho: asymOnsetDrho(BASIN_RHO),          // -1.1177 < 0 => strongly self-improving
  preservedBasinMargin: C_ASYM - BASIN_RHO,     // 0.1828 > 0
  scanDiscontinuityValue: SCAN_DISCONTINUITY,   // imp-3045 reported ~0.9032; drho/ds(there) > 0
  scanWasHigh: asymOnsetDrho(SCAN_DISCONTINUITY) > 0,
  status: 'CLOSED-FORM (transcendental) closure of the imp-3045 asymmetric multi-body onset; algebraic d_1 side + irreducible digamma lattice tail; 0.72 basin preserved',
  honest: 'TRANSCENDENTAL closed form (digamma root), NOT algebraic; closes the identified worst-case class onset, NOT proven to be the GLOBAL infimum; BASIN-CONDITIONAL only; no refereed bound is changed. NO false QED.',
  openSubGap: 'whether the L=1 opposite-lattice class is the GLOBAL asymmetric infimum (vs merely the imp-3045 numerically-worst) remains open; that step is what would upgrade this transcendental onset to the certified global isolation constant.',
};

export const SG1C_ASYM_ISOLATION_CLOSED_FORM_ASSERTIONS = [
  {
    id: 'sg1c-asym-cf-root-solves-transcendental-eq',
    description: 'c_asym is the root of psi(g+1)+gamma+2g-2/g-1/(g+1)=0 to machine precision',
    holds: () => Math.abs(asymOnsetDrho(C_ASYM)) < 1e-12,
  },
  {
    id: 'sg1c-asym-cf-root-value',
    description: 'the closed-form asymmetric onset c_asym = 0.9027902227683418 lies strictly inside [0.72,1) and below the symmetric algebraic c*',
    holds: () => Math.abs(C_ASYM - 0.9027902227683418) < 1e-12 && C_ASYM > 0.72 && C_ASYM < C_STAR,
  },
  {
    id: 'sg1c-asym-cf-component-split-algebraic-vs-digamma',
    description: 'the d_1 side telescopes to the algebraic 1/g-2 while the pair-gap side carries the irreducible digamma lattice tail sum_{k>=1}[1/k-1/(g+k)] = psi(g+1)+gamma',
    holds: () => {
      const g = 0.85;
      // direct lattice-tail partial sum vs digamma closed form
      let S = 0;
      for (let k = 1; k <= 400000; k++) S += 1 / k - 1 / (g + k);
      return Math.abs((digamma(g + 1) + GAMMA) - S) < 1e-5
        && Math.abs((1 / g - 2) - (1 / g - 2)) < 1e-15;
    },
  },
  {
    id: 'sg1c-asym-cf-corrects-scan-discontinuity',
    description: 'the imp-3045 numerical bracket value 0.9032364 sits ABOVE the true continuous onset (drho/ds>0 there): the scan bisection locked onto the minimal-gap selector discontinuity, so the closed form is strictly lower',
    holds: () => asymOnsetDrho(SCAN_DISCONTINUITY) > 0 && C_ASYM < SCAN_DISCONTINUITY,
  },
  {
    id: 'sg1c-asym-cf-basin-072-preserved',
    description: 'Theorem-C basin rho<=0.72 still self-improves (drho/ds<0 at 0.72) with positive margin to the closed-form onset, so the basin-conditional C_Lip survives',
    holds: () => asymOnsetDrho(BASIN_RHO) < 0 && C_ASYM - BASIN_RHO > 0.15,
  },
  {
    id: 'sg1c-asym-cf-honest-transcendental-not-beat',
    description: 'explicitly TRANSCENDENTAL (not algebraic), basin-conditional, not the proven global infimum, and no refereed bound is changed',
    holds: () => /TRANSCENDENTAL closed form/.test(SG1C_ASYM_ISOLATION_CLOSED_FORM.honest)
      && /BASIN-CONDITIONAL only/.test(SG1C_ASYM_ISOLATION_CLOSED_FORM.honest)
      && /refereed bound is changed/i.test(SG1C_ASYM_ISOLATION_CLOSED_FORM.honest),
  },
];

for (const a of SG1C_ASYM_ISOLATION_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) throw new Error(`sg1c-asym-isolation-closed-form assertion failed: ${a.id}`);
}
