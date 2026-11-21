/**
 * @module imp-35801-i2-panel-amplification-vs-grazing-distance
 *
 * imp-35801 (numerical/measurement, S-frontier): QUANTIFY the imp-35777 I2/I3
 * panel-count amplification factor G = delta_robust / delta_local as a FUNCTION of the
 * contour-to-would-be-zero grazing distance d, and tabulate the local panel-budget
 * blow-up L_panel < pi . delta / B -> 0 that imp-35777 flagged as unbounded but never
 * tied to a distance. MEASUREMENT ONLY on the shared OOM model of imp-35777.
 *
 * imp-35777 factored the certifiable I2 per-panel argument cap as
 *     L_panel < pi . delta / B,   B = sup|H_t prime|,   delta = inf|H_t| (the I3 floor),
 * and noted that where dR grazes a would-be off-line zero the floor delta collapses, so
 * the local panel count spikes by G = delta_robust / delta_local, "UNBOUNDED as the
 * contour approaches a zero". It gave only ABSTRACT decade examples (G = 10, 100, 1000 for
 * a 1/2/3-decade floor drop) with NO map from G to how far dR stands off the zero. This
 * module supplies that map.
 *
 * THE GRAZING-DISTANCE MODEL (linear vanishing at a simple would-be zero)
 * -----------------------------------------------------------------------------
 * A would-be off-line zero z0 of H_t is (generically) SIMPLE, so near it the modulus
 * vanishes to first order:
 *     |H_t(z0 + d)| ~ |H_t prime(z0)| . d ~ B . d   (d = grazing distance, height units),
 * approximating the local sup|H_t prime| by its value B at the zero. Hence the LOCAL floor
 * a panel touching distance d from the zero sees is
 *     delta_local(d) ~ B . d.
 * The robust floor is main-term scale, delta_robust ~ |H_t| = B / w with
 * w = w(T_PT) = (1/2) log(T_PT/2pi) (imp-35777: B/delta_robust ~ w). So the standoff at
 * which the floor reaches main-term scale is
 *     d_robust = delta_robust / B = 1 / w ~ 0.0744   (height units)
 *              = (1/pi) . (mean zero gap g),   g = pi/w ~ 0.2336,
 * i.e. dR recovers the robust regime once it stands ~1/pi of a mean zero gap off the zero.
 *
 * CLOSED FORMS: EVERYTHING IS A SIMPLE POLE IN d
 * -----------------------------------------------------------------------------
 * Substituting delta_local = B . d into the imp-35777 relations gives three clean laws,
 * all first-order poles at d = 0 (the divergence rate the ticket asks for):
 *     G(d)          = delta_robust / delta_local = (B/w)/(B d) = 1 / (w . d) = d_robust / d,
 *     L_panel(d)    = pi . delta_local / B       = pi . d,          (-> 0 linearly in d)
 *     density(d)    = 1 / L_panel                = 1 / (pi . d).     (panels per unit height)
 * So the panel budget diverges as 1/d: HALVING the grazing distance DOUBLES both G and the
 * local panel density -- a simple pole set by the simple would-be zero (an order-m zero
 * would give delta_local ~ d^m and a G ~ d^{-m} pole of order m). At d = d_robust the three
 * laws return G = 1, L_panel = pi/w ~ 0.2336, density = w/pi ~ 4.28 -- EXACTLY the imp-35777
 * robust regime, so the distance model interpolates continuously from the zero out to the
 * main-term scale.
 *
 * STANDOFF REQUIRED TO KEEP THE BUDGET FINITE
 * -----------------------------------------------------------------------------
 * Inverting G(d) = 1/(w d): to hold the local amplification below a ceiling G_max, dR must
 * stand off by at least
 *     d >= d_robust / G_max = 1 / (w . G_max);
 * equivalently, to cap the local density at D_max panels/unit-height, d >= 1/(pi . D_max).
 * There is NO positive lower bound on the budget that survives d -> 0: the certificate must
 * POSITION the rectangle a fixed standoff off every would-be zero (the same placement I3
 * demands), or accept a 1/d-divergent panel count. This QUANTIFIES imp-35777's qualitative
 * "finite exactly when I3 holds, infinite exactly where I3 fails".
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * MEASUREMENT / OOM TABULATION on the imp-35777 model only. It bounds no |H_t prime| (B),
 * lower-bounds no |H_t| (delta), instantiates no interval enclosure, fixes no Delta or h,
 * certifies no cap, and changes no bound. The linear-vanishing model is the generic
 * simple-zero OOM, not a certified enclosure. NO QED. No refereed bound is changed.
 *
 * @see imp-35777-i2-logderivative-panel-cap-scope (named G = delta_robust/delta_local UNBOUNDED; abstract decade examples)
 * @see imp-35757-i2-panel-width-count-scope (robust ~4.28 panels/unit-height via mean winding rate)
 * @see imp-35758-i3-modulus-floor-margin-tie-scope (I3 floor delta; grazing caveat delta -> 0)
 * @see imp-35800-i3-two-knob-floor-balance-point (robust standoff h = 1/w ~ 0.0744; mean gap ~ 0.2336)
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (I2 named GREENFIELD)
 * @see Polymath15 2019 (H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35777) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const TWO_PI = 2 * Math.PI;
const HALF_TURN = Math.PI; // the I2 cap threshold |Delta arg f| < pi per panel

const WINDING_RATE = 0.5 * Math.log(T_PT / TWO_PI); // w(T_PT) ~ 13.446 = robust B/delta
const MEAN_GAP = HALF_TURN / WINDING_RATE; // g = pi/w ~ 0.2336 = robust L_panel = mean zero gap
const D_ROBUST = 1 / WINDING_RATE; // standoff at which delta reaches main-term scale ~ 0.0744
const DENSITY_ROBUST = WINDING_RATE / HALF_TURN; // w/pi ~ 4.28 panels per unit height (imp-35757)

// Closed-form laws (all simple poles in the grazing distance d):
//   G(d) = 1/(w d) = D_ROBUST/d ;  L_panel(d) = pi d ;  density(d) = 1/(pi d).
const G_of_d = (d) => 1 / (WINDING_RATE * d);
const lPanel_of_d = (d) => HALF_TURN * d;
const density_of_d = (d) => 1 / (HALF_TURN * d);
// Minimum standoff to hold the amplification below a ceiling G_max: d >= d_robust/G_max.
const standoff_for_Gmax = (gMax) => D_ROBUST / gMax;

// Sweep grazing distance in decade steps below the robust standoff; k = decades inside d_robust.
// At k=0 (d = d_robust) the table recovers the imp-35777 robust regime (G=1, L=g, density=4.28);
// each decade closer multiplies G and the density by 10 (matches imp-35777 GRAZING examples).
const DECADE_STEPS = [0, 1, 2, 3, 4];
const GRAZING_TABLE = DECADE_STEPS.map((k) => {
  const d = D_ROBUST * Math.pow(10, -k); // grazing distance in height units
  return {
    decadesInsideRobust: k,
    grazingDistance: d, // d (height units)
    grazingInGapUnits: d / MEAN_GAP, // d as a fraction of the mean zero gap (= 1/pi at k=0)
    deltaLocalOverRobust: WINDING_RATE * d, // delta_local/delta_robust = w d = 10^{-k}
    G: G_of_d(d), // amplification factor = 10^k
    lPanel: lPanel_of_d(d), // certifiable panel length pi d
    localPanelsPerUnitHeight: density_of_d(d), // 1/(pi d)
  };
});

export const IMP35801_I2_PANEL_AMPLIFICATION_VS_GRAZING_DISTANCE = {
  id: 'imp-35801',
  proofSection: 'S-frontier',
  question:
    'Quantify the imp-35777 I2/I3 panel-count amplification factor G = delta_robust/delta_local as a function of ' +
    'the contour-to-would-be-zero grazing distance d, tabulating the local panel-budget blow-up L_panel < pi.delta/B ' +
    '-> 0 imp-35777 flagged as unbounded but never mapped to a distance. Measurement on the OOM model only; ' +
    'certifies no cap; changes no bound; NO QED.',
  grazingDistanceModel: {
    linearVanishing: '|H_t(z0+d)| ~ |H_t prime(z0)| . d ~ B . d: a simple would-be zero makes the local floor vanish linearly in d.',
    deltaLocal: 'delta_local(d) ~ B . d, so delta_local/delta_robust = w . d.',
    robustStandoff:
      'd_robust = delta_robust/B = 1/w ~ 0.0744 height units = (1/pi) . mean zero gap (g = pi/w ~ 0.2336): dR ' +
      'recovers the robust regime once it stands ~1/pi of a gap off the zero.',
    windingRate: WINDING_RATE,
    meanGap: MEAN_GAP,
    dRobust: D_ROBUST,
    densityRobust: DENSITY_ROBUST,
  },
  closedForms: {
    amplification: 'G(d) = delta_robust/delta_local = 1/(w d) = d_robust/d.',
    panelLength: 'L_panel(d) = pi . delta_local/B = pi . d  (-> 0 linearly in d).',
    density: 'density(d) = 1/L_panel = 1/(pi d) panels per unit height.',
    divergenceRate:
      'All three are FIRST-ORDER poles at d = 0: halving the grazing distance doubles both G and the local density. ' +
      'A simple would-be zero gives a 1/d pole; an order-m zero would give an order-m pole G ~ d^{-m}.',
    standoffRequirement:
      'To hold G <= G_max the rectangle must stand off by d >= d_robust/G_max = 1/(w G_max); to cap the local ' +
      'density at D_max, d >= 1/(pi D_max). No positive budget survives d -> 0.',
  },
  grazingTable: GRAZING_TABLE,
  recoversRobustAtStandoff:
    'At d = d_robust (k=0) the table gives G = 1, L_panel = pi/w ~ 0.2336, density = w/pi ~ 4.28 -- EXACTLY the ' +
    'imp-35777 robust regime; the distance model interpolates continuously from the zero out to main-term scale.',
  matchesImp35777DecadeExamples:
    'k decades inside d_robust give delta_local/delta_robust = 10^{-k} and G = 10^k, reproducing the imp-35777 ' +
    'abstract examples (floorDropDecades 1/2/3 -> G 10/100/1000) but now anchored to a physical standoff distance.',
  isRigorous: false,
  verdict:
    'MEASUREMENT / OOM TABULATION (frontier-direction, NOT rigorous). Modelling a simple would-be zero by linear ' +
    'vanishing |H_t(z0+d)| ~ B . d turns the imp-35777 abstract amplification G = delta_robust/delta_local into the ' +
    'closed forms G(d) = 1/(w d) = d_robust/d, L_panel(d) = pi d, density(d) = 1/(pi d) -- three first-order poles at ' +
    'd = 0, so the panel budget diverges as 1/d (halving the standoff doubles G and the count). The robust standoff ' +
    'is d_robust = 1/w ~ 0.0744 height units (= 1/pi of the mean zero gap g ~ 0.2336), at which the laws recover the ' +
    'imp-35777 robust regime G=1, L_panel~0.2336, density~4.28. To keep the amplification below G_max the certificate ' +
    'must position dR a standoff d >= 1/(w G_max) off every would-be zero -- quantifying imp-35777 "finite exactly ' +
    'when I3 holds, infinite exactly where I3 fails". Bounds no B; lower-bounds no delta; instantiates no enclosure; ' +
    'fixes no Delta or h; certifies no cap; changes no bound; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35777 (I2/I3 coupling L_panel < pi delta/B; G named unbounded, decade examples); imp-35757 (~4.28 ' +
    'panels/unit-height); imp-35758 (I3 floor, grazing caveat); imp-35800 (robust standoff 1/w, mean gap ~0.2336); ' +
    'imp-35727 (I2 GREENFIELD); Polymath15 2019 (H_t = A+B-C; barrier method); Platt-Trudgian 2021.',
};

export const IMP35801_I2_PANEL_AMPLIFICATION_VS_GRAZING_DISTANCE_ASSERTIONS = [
  {
    // Closed forms consistent per row: G = 1/(w d), L_panel = pi d, density = 1/(pi d), L*density = 1.
    id: 'imp35801-closed-forms-consistent',
    description: 'Each row satisfies G = d_robust/d = 1/(w d), L_panel = pi d, density = 1/(pi d), L_panel . density = 1',
    holds: () =>
      GRAZING_TABLE.length === 5 &&
      GRAZING_TABLE.every((r) => {
        const okG = Math.abs(r.G - 1 / (WINDING_RATE * r.grazingDistance)) < 1e-12 &&
          Math.abs(r.G - D_ROBUST / r.grazingDistance) < 1e-9;
        const okL = Math.abs(r.lPanel - Math.PI * r.grazingDistance) < 1e-15;
        const okD = Math.abs(r.localPanelsPerUnitHeight - 1 / (Math.PI * r.grazingDistance)) < 1e-9;
        const okInv = Math.abs(r.lPanel * r.localPanelsPerUnitHeight - 1) < 1e-12;
        return okG && okL && okD && okInv;
      }),
  },
  {
    // At the robust standoff d = 1/w the table recovers the imp-35777 robust regime.
    id: 'imp35801-recovers-imp35777-robust-at-standoff',
    description: 'd = d_robust = 1/w -> G = 1, L_panel ~ 0.2336, density ~ 4.28 (imp-35777 robust regime)',
    holds: () => {
      const r0 = GRAZING_TABLE[0];
      return (
        Math.abs(D_ROBUST - 1 / (0.5 * Math.log(3e12 / (2 * Math.PI)))) < 1e-12 &&
        r0.decadesInsideRobust === 0 &&
        Math.abs(r0.G - 1) < 1e-12 &&
        Math.abs(r0.lPanel - 0.2336488) < 1e-4 &&
        Math.abs(r0.localPanelsPerUnitHeight - 4.279956) < 1e-4 &&
        Math.abs(r0.grazingInGapUnits - 1 / Math.PI) < 1e-12
      );
    },
  },
  {
    // 1/d pole: each decade closer to the zero multiplies G and the density by 10 (matches imp-35777).
    id: 'imp35801-first-order-pole-decade-scaling',
    description: 'Halving/decade-dropping d multiplies G and density by the same factor; k decades give G = 10^k (imp-35777 examples)',
    holds: () =>
      GRAZING_TABLE.every((r) => Math.abs(r.G - Math.pow(10, r.decadesInsideRobust)) < 1e-6) &&
      GRAZING_TABLE.every((r) => Math.abs(r.deltaLocalOverRobust - Math.pow(10, -r.decadesInsideRobust)) < 1e-9) &&
      // simple-pole check: G(d/2) = 2 G(d) and density(d/2) = 2 density(d)
      Math.abs(G_of_d(D_ROBUST / 2) - 2 * G_of_d(D_ROBUST)) < 1e-9 &&
      Math.abs(density_of_d(D_ROBUST / 2) - 2 * density_of_d(D_ROBUST)) < 1e-9,
  },
  {
    // Standoff requirement: to keep G <= G_max the contour must stand off by d >= 1/(w G_max).
    id: 'imp35801-standoff-requirement',
    description: 'd >= d_robust/G_max = 1/(w G_max) holds G below G_max; G(standoff) = G_max',
    holds: () =>
      [10, 100, 1000].every((gMax) => {
        const d = standoff_for_Gmax(gMax);
        return Math.abs(d - 1 / (WINDING_RATE * gMax)) < 1e-15 && Math.abs(G_of_d(d) - gMax) < 1e-6;
      }),
  },
  {
    // Honesty gate: measurement only, no certification, no QED, no refereed bound is changed.
    id: 'imp35801-honesty-gate-no-qed',
    description: 'Measurement only; certifies no cap; bounds no B; lower-bounds no delta; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35801_I2_PANEL_AMPLIFICATION_VS_GRAZING_DISTANCE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /certifies no cap/.test(IMP35801_I2_PANEL_AMPLIFICATION_VS_GRAZING_DISTANCE.verdict) &&
      /NO QED/.test(IMP35801_I2_PANEL_AMPLIFICATION_VS_GRAZING_DISTANCE.verdict) &&
      /refereed bound is changed/i.test(IMP35801_I2_PANEL_AMPLIFICATION_VS_GRAZING_DISTANCE.verdict),
  },
];

for (const a of IMP35801_I2_PANEL_AMPLIFICATION_VS_GRAZING_DISTANCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35801-i2-panel-amplification-vs-grazing-distance assertion failed: ${a.id}`);
  }
}
