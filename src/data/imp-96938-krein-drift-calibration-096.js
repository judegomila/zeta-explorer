/**
 * @fileoverview imp-96938 -- CALIBRATION (numerical): run the imp-96911 coupled-(N,T) Ritz-drift
 * measurement at the CERTIFIED-POSITIVE endpoint 2a=0.96 (a=0.48), where a positive lambda_1 IS
 * established by the interval-rigorous Toeplitz/Krein certificate, and compare its drift magnitude
 * and sign to the binding 2a=ln3 (a=(ln3)/2) case where positivity is open. imp-96911 measured the
 * shift-invert eta and floor drift ONLY at 2a=ln3; this leaf calibrates that drift against a
 * known-positive endpoint. Driver tmp/imp-96938-calibrate.py, /tmp/rhvenv scipy 1.18; reuses the
 * imp-96911/imp-96889/imp-96768 pole-free Gegenbauer Galerkin build verbatim. eta is the top
 * eigenvalue of the compression R_N = P_N (K+m)^{-1} P_N in a nested Nbig space at cutoff T; the
 * Ritz floor lam1_ritz = 1/eta - m is an UPPER bound on lambda_1(T), so the floor is an upper
 * estimate NOT a certified LB. Measurement/calibration only. NO QED.
 *
 * SETUP. Fixed N=16, shift m=1, integration cutoff T=800, Nbig ladder 24..240, at two endpoints:
 * a=(ln3)/2 (2a=ln3, positivity OPEN) and a=0.48 (2a=0.96, positivity ESTABLISHED). The ln3 rows
 * reproduce the imp-96911 IMP96911_ETA_NBIG_T800 table to 7 digits (a reproduction cross-check).
 *
 * FINDING 1 -- THE DRIFT DIRECTIONS ARE IDENTICAL AT BOTH ENDPOINTS. At the certified-positive
 * 2a=0.96 endpoint the top Ritz eta rises MONOTONICALLY with Nbig (0.0454226 @ Nbig=24 ->
 * 0.0768707 @ Nbig=240 at T=800) and FALLS with T at fixed Nbig (0.0768707 @ T=800 -> 0.0497202 @
 * T=3200 at Nbig=240), so the Ritz floor 1/eta-m falls with Nbig and rises with T -- the EXACT same
 * sign structure imp-96911 found at 2a=ln3. The two truncations push in opposite directions at BOTH
 * endpoints. So the drift DIRECTIONS are a generic property of the coupled (N,T) resolvent
 * truncation scheme, NOT a signature of the open-positivity case.
 *
 * FINDING 2 -- AT THE CERTIFIED ENDPOINT THE FLOOR NEVER THREATENS ZERO. At 2a=0.96 the Ritz floor
 * stays >= 12.0 across the ENTIRE (Nbig,T) sweep: it swings 21.0155 (Nbig=24) -> 12.0089 (Nbig=240)
 * at T=800 (a ~9.007 swing), with the most adverse cell (Nbig=240, T=800) still at floor 12.0089 --
 * enormously positive. Raising T toward convergence RAISES the floor further (12.0089 -> 19.1126 at
 * Nbig=240 over T=800..3200). The eta itself is tiny (~0.045..0.077, vs ~0.62..0.68 at ln3), so the
 * true lambda_1 there is large and positive and the drift is a small perturbation on a huge margin.
 *
 * FINDING 3 -- WHAT DIFFERS IS THE MARGIN, NOT THE DRIFT BEHAVIOUR. The calibration isolates the
 * one quantity that separates the two endpoints: the ABSOLUTE floor LEVEL (order 12+ at 2a=0.96 vs
 * order 0.5 at 2a=ln3), i.e. the positivity margin. The drift DIRECTIONS, the Nbig-monotone rise of
 * eta, the T-reopening of the plateau, and the opposite-sign (N,T) coupling are all present and
 * identical at the known-positive endpoint. Therefore the ln3 drift, taken by its magnitude and
 * sign ALONE, does NOT constrain the sign of lambda_1 at ln3: the same drift pattern coexists with
 * certified positivity at 2a=0.96. The only thing the ln3 measurement lacks is the large margin.
 *
 * VERDICT. Calibrating the imp-96911 coupled-(N,T) Ritz drift against the certified-positive 2a=0.96
 * endpoint shows the drift SIGN STRUCTURE (eta up with Nbig / down with T; floor down with Nbig / up
 * with T) is identical to 2a=ln3, so it is a generic truncation-scheme artifact, not a diagnostic of
 * the open-positivity case. At 2a=0.96 the Ritz floor stays >= 12 over the whole sweep (min 12.0089
 * at the most adverse Nbig=240/T=800 cell), never approaching zero, and larger T only improves it --
 * consistent with the established positive lambda_1 there. Hence the ln3 drift magnitude/sign alone
 * do NOT constrain the sign of lambda_1(ln3); what distinguishes the endpoints is the absolute floor
 * margin (~12 vs ~0.5), not the drift behaviour. This SHARPENS imp-96911 SUB-GAP
 * IMP96911_ETA_DRIFT_IS_COUPLED_NT_NOT_A_STANDALONE_NBIG_RATE by ruling out reading the drift
 * DIRECTION as evidence about positivity. SUB-GAP
 * IMP96938_DRIFT_DIRECTION_IS_SCHEME_GENERIC_MARGIN_IS_THE_ONLY_DISCRIMINANT.
 * Ritz value is an UPPER bound (floor is an upper estimate, not a certified LB); interval-rigorous
 * certificate reach stays 2a<=0.96; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96911-krein-eta-nconvergence-scout.js (the ln3-only coupled-(N,T) drift this leaf calibrates)
 * @see imp-96889-krein-shiftinvert-katotemple-scout.js (Finding 3a eta drift source)
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (the open t-truncation (N,T) rate the floor couples to)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; interval reach 2a <= 0.96)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// interval-rigorous certificate reach (unchanged by this calibration)
export const IMP96938_RIGOROUS_REACH_2A = 0.96;
export const IMP96938_SHIFT_M = 1.0;
export const IMP96938_T_CUTOFF = 800.0;
export const IMP96938_N_TRIAL = 16;

// eta(Nbig) at fixed N=16, T=800 at BOTH endpoints. floor = 1/eta - m.
// The 2a=ln3 rows reproduce imp-96911 IMP96911_ETA_NBIG_T800 to 7 digits (reproduction cross-check).
export const IMP96938_ETA_NBIG_T800 = Object.freeze({
  ln3: Object.freeze([
    Object.freeze({ Nbig: 24, eta: 0.6222380, floor: 0.6071020 }),
    Object.freeze({ Nbig: 28, eta: 0.6257271, floor: 0.5981408 }),
    Object.freeze({ Nbig: 32, eta: 0.6279391, floor: 0.5925111 }),
    Object.freeze({ Nbig: 40, eta: 0.6306628, floor: 0.5856334 }),
    Object.freeze({ Nbig: 48, eta: 0.6327793, floor: 0.5803298 }),
    Object.freeze({ Nbig: 56, eta: 0.6354313, floor: 0.5737343 }),
    Object.freeze({ Nbig: 64, eta: 0.6379345, floor: 0.5675591 }),
    Object.freeze({ Nbig: 80, eta: 0.6438065, floor: 0.5532618 }),
    Object.freeze({ Nbig: 96, eta: 0.6501889, floor: 0.5380147 }),
    Object.freeze({ Nbig: 120, eta: 0.6602504, floor: 0.5145769 }),
    Object.freeze({ Nbig: 160, eta: 0.6736681, floor: 0.4844106 }),
    Object.freeze({ Nbig: 200, eta: 0.6773559, floor: 0.4763288 }),
    Object.freeze({ Nbig: 240, eta: 0.6776879, floor: 0.4756055 }),
  ]),
  // 2a=0.96 -- certified-positive endpoint. eta is tiny so the floor is order 12+; the drift is a
  // small perturbation on a huge positive margin, but its DIRECTION (eta up / floor down with Nbig)
  // is identical to the ln3 case above.
  a096: Object.freeze([
    Object.freeze({ Nbig: 24, eta: 0.0454226, floor: 21.0154900 }),
    Object.freeze({ Nbig: 28, eta: 0.0459479, floor: 20.7637915 }),
    Object.freeze({ Nbig: 32, eta: 0.0464412, floor: 20.5325902 }),
    Object.freeze({ Nbig: 40, eta: 0.0469244, floor: 20.3108557 }),
    Object.freeze({ Nbig: 48, eta: 0.0475794, floor: 20.0174848 }),
    Object.freeze({ Nbig: 56, eta: 0.0481330, floor: 19.7757702 }),
    Object.freeze({ Nbig: 64, eta: 0.0488851, floor: 19.4561337 }),
    Object.freeze({ Nbig: 80, eta: 0.0507128, floor: 18.7188861 }),
    Object.freeze({ Nbig: 96, eta: 0.0531236, floor: 17.8240426 }),
    Object.freeze({ Nbig: 120, eta: 0.0580186, floor: 16.2358668 }),
    Object.freeze({ Nbig: 160, eta: 0.0707828, floor: 13.1277355 }),
    Object.freeze({ Nbig: 200, eta: 0.0755739, floor: 12.2320780 }),
    Object.freeze({ Nbig: 240, eta: 0.0768707, floor: 12.0088505 }),
  ]),
});

// T-sensitivity at the top Nbig rungs: eta FALLS with T at BOTH endpoints (floor rises), so the
// fixed-T plateau is a truncation ceiling at both. At 2a=0.96 the floor rises toward ~19-20.
export const IMP96938_T_SENSITIVITY = Object.freeze({
  ln3: Object.freeze([
    Object.freeze({ Nbig: 120, eta_T800: 0.6602504, eta_T1600: 0.6394898, eta_T3200: 0.6340637 }),
    Object.freeze({ Nbig: 200, eta_T800: 0.6773559, eta_T1600: 0.6541151, eta_T3200: 0.6383433 }),
    Object.freeze({ Nbig: 240, eta_T800: 0.6776879, eta_T1600: 0.6618934, eta_T3200: 0.6411512 }),
  ]),
  a096: Object.freeze([
    Object.freeze({ Nbig: 120, eta_T800: 0.0580186, eta_T1600: 0.0492740, eta_T3200: 0.0476331 }),
    Object.freeze({ Nbig: 200, eta_T800: 0.0755739, eta_T1600: 0.0547319, eta_T3200: 0.0488511 }),
    Object.freeze({ Nbig: 240, eta_T800: 0.0768707, eta_T1600: 0.0589029, eta_T3200: 0.0497202 }),
  ]),
});

export const IMP96938_VERDICT = Object.freeze({
  ticket: 'imp-96938',
  question: 'how does the imp-96911 coupled-(N,T) Ritz drift behave at the certified-positive 2a=0.96 endpoint, and does its magnitude/sign there constrain the interpretation of the 2a=ln3 drift ?',
  shift_m: 1.0,
  T_cutoff: 800.0,
  N_trial: 16,
  // Finding 1: drift directions identical at both endpoints
  driftDirectionsIdenticalBothEndpoints: true, // eta up with Nbig / down with T at BOTH 2a=ln3 and 2a=0.96
  driftDirectionIsSchemeGeneric: true,
  // Finding 2: at the certified endpoint the floor never threatens zero
  floorMin_a096: 12.0088505,          // most adverse cell Nbig=240, T=800
  floorSwing_a096: 9.0066395,         // 21.0154900 -> 12.0088505 over the Nbig ladder at T=800
  floorRisesWithT_a096: true,         // T=800 -> 3200 raises floor 12.0089 -> 19.1126 at Nbig=240
  // Finding 3: what differs is the margin, not the drift behaviour
  floorSwing_ln3: 0.1314965,          // matches imp-96911 floorBiasOverLadder
  floorMin_ln3: 0.4756055,            // Nbig=240, T=800
  marginIsTheOnlyDiscriminant: true,  // order-12 floor at 2a=0.96 vs order-0.5 at 2a=ln3
  ln3DriftSignConstrainsPositivity: false, // same drift pattern coexists with CERTIFIED positivity at 0.96
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP96938_DRIFT_DIRECTION_IS_SCHEME_GENERIC_MARGIN_IS_THE_ONLY_DISCRIMINANT -- calibrating the imp-96911 coupled-(N,T) Ritz drift at the certified-positive endpoint 2a=0.96 (a=0.48) shows the drift SIGN STRUCTURE is identical to 2a=ln3: the top Ritz eta rises monotonically with Nbig (0.0454226 @ Nbig=24 -> 0.0768707 @ Nbig=240 at T=800) and falls with T at fixed Nbig (0.0768707 -> 0.0497202 over T=800..3200 at Nbig=240), so the Ritz floor 1/eta-m falls with Nbig and rises with T exactly as at ln3 -- the two truncations push in opposite directions at BOTH endpoints. So the drift DIRECTIONS are a generic property of the coupled (N,T) resolvent-truncation scheme, NOT a signature of the open-positivity case. At 2a=0.96 the floor stays >= 12.0 across the entire (Nbig,T) sweep (min 12.0089 at the most adverse Nbig=240/T=800 cell; swing ~9.007 over the Nbig ladder) and larger T only improves it (12.0089 -> 19.1126), consistent with the established large positive lambda_1 there. Therefore the ln3 drift magnitude/sign ALONE do NOT constrain the sign of lambda_1(ln3) -- the same drift pattern coexists with certified positivity -- and the only quantity distinguishing the two endpoints is the ABSOLUTE floor margin (order 12 at 2a=0.96 vs order 0.5 at 2a=ln3), not the drift behaviour. This sharpens imp-96911 IMP96911_ETA_DRIFT_IS_COUPLED_NT_NOT_A_STANDALONE_NBIG_RATE by ruling out reading the drift direction as evidence about positivity. Ritz value is an UPPER bound so the floor is an upper estimate, not a certified LB',
  qed: false,
});
export default IMP96938_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96938_ASSERTIONS = [
  {
    id: 'imp96938-ln3-rows-reproduce-imp96911',
    holds: () => {
      const g = IMP96938_ETA_NBIG_T800.ln3;
      // internal consistency floor == 1/eta - m at every row
      const consistent = g.every((r) => Math.abs(r.floor - (1.0 / r.eta - IMP96938_SHIFT_M)) < 1e-6);
      // reproduces the imp-96911 endpoints (0.6222380 @ Nbig=24, 0.6776879 @ Nbig=240)
      return consistent &&
        Math.abs(g[0].eta - 0.6222380) < 1e-6 &&
        Math.abs(g[g.length - 1].eta - 0.6776879) < 1e-6;
    },
    why: 'the 2a=ln3 calibration rows reproduce the imp-96911 IMP96911_ETA_NBIG_T800 eta ladder (0.6222380 @ Nbig=24 .. 0.6776879 @ Nbig=240) and each row is internally consistent floor == 1/eta - m.',
  },
  {
    id: 'imp96938-drift-directions-identical-both-endpoints',
    holds: () => {
      // at BOTH endpoints eta rises monotonically with Nbig (so floor falls monotonically)
      const monoUpDown = (g) => {
        for (let i = 1; i < g.length; i++) {
          if (!(g[i].eta > g[i - 1].eta)) return false;
          if (!(g[i].floor < g[i - 1].floor)) return false;
        }
        return true;
      };
      // and at BOTH endpoints eta FALLS with T at every measured Nbig (floor rises)
      const fallsWithT = (rows) => rows.every((r) => r.eta_T800 > r.eta_T1600 && r.eta_T1600 > r.eta_T3200);
      return monoUpDown(IMP96938_ETA_NBIG_T800.ln3) && monoUpDown(IMP96938_ETA_NBIG_T800.a096) &&
        fallsWithT(IMP96938_T_SENSITIVITY.ln3) && fallsWithT(IMP96938_T_SENSITIVITY.a096) &&
        IMP96938_VERDICT.driftDirectionsIdenticalBothEndpoints === true &&
        IMP96938_VERDICT.driftDirectionIsSchemeGeneric === true;
    },
    why: 'at BOTH 2a=ln3 and 2a=0.96 the top Ritz eta rises monotonically with Nbig (floor falls) and falls with T at fixed Nbig (floor rises) -- the drift sign structure is identical, so it is a generic truncation-scheme artifact, not a signature of the open-positivity case.',
  },
  {
    id: 'imp96938-certified-endpoint-floor-never-threatens-zero',
    holds: () => {
      const g = IMP96938_ETA_NBIG_T800.a096;
      const floorMin = Math.min(...g.map((r) => r.floor));
      // most adverse cell across the T-sensitivity sweep too (Nbig=240, T=800)
      const tworst = IMP96938_T_SENSITIVITY.a096.map((r) => 1.0 / r.eta_T800 - IMP96938_SHIFT_M);
      const overallMin = Math.min(floorMin, ...tworst);
      return overallMin > 12.0 &&                       // never approaches zero
        IMP96938_VERDICT.floorRisesWithT_a096 === true &&
        IMP96938_VERDICT.marginIsTheOnlyDiscriminant === true &&
        IMP96938_VERDICT.ln3DriftSignConstrainsPositivity === false;
    },
    why: 'at the certified-positive 2a=0.96 endpoint the Ritz floor stays > 12.0 across the entire (Nbig,T) sweep (never approaching zero) and larger T only improves it -- the drift is a small perturbation on a huge positive margin, so the ln3 drift sign alone cannot constrain lambda_1(ln3).',
  },
  {
    id: 'imp96938-margin-is-the-only-discriminant-and-no-qed',
    holds: () =>
      IMP96938_VERDICT.floorMin_a096 > IMP96938_VERDICT.floorMin_ln3 &&   // ~12 vs ~0.48
      IMP96938_VERDICT.floorMin_a096 / IMP96938_VERDICT.floorMin_ln3 > 20 && // order-of-magnitude gap
      IMP96938_VERDICT.operatorPositivityProved === false &&
      IMP96938_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96938_RIGOROUS_REACH_2A === 0.96 &&
      IMP96938_VERDICT.qed === false,
    why: 'the only quantity distinguishing the two endpoints is the absolute floor margin (order 12 at 2a=0.96 vs order 0.5 at 2a=ln3), not the drift behaviour; no operator positivity is established and the interval-rigorous certificate reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP96938_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96938 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
