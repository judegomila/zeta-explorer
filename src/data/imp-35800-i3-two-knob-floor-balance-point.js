/**
 * @module imp-35800-i3-two-knob-floor-balance-point
 *
 * imp-35800 (numerical/measurement, S-frontier): MEASURE the imp-35778 two-knob
 * ingredient-I3 contour modulus floor delta = min(delta_short, delta_long) on the
 * rectangle boundary dR of R = [T_PT, T_PT + Delta] x [-h, h] as the two knobs vary --
 * the off-axis height h (controls delta_long) and the endpoint spacing Delta (controls
 * delta_short) -- at the T_PT = 3e12 OOM scale, and LOCATE the (h, Delta) that maximizes
 * min(delta_short, delta_long). imp-35778 gave the two-knob PRESCRIPTION (Delta via
 * endpoints between real zeros, h via off-axis distance) and named the balance
 * (Delta ~ integer mean gaps, h ~ 1/w) but NEVER TABULATED the trade-off surface. This
 * module builds that surface on the shared normalised OOM model and reports the argmax.
 *
 * MEASUREMENT ON THE SHARED OOM MODEL ONLY. Evaluates no true |H_t| or |H_t'| on any
 * edge; fixes no Delta or h for any rectangle; certifies no delta > 0; establishes no
 * positivity; changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE SHARED OOM MODEL (normalised, |H_t| main-term envelope == 1)
 * -----------------------------------------------------------------------------
 * imp-35778 reads both edge floors off the SAME normalised main-term picture: |H_t| on
 * the real axis oscillates between consecutive real zeros with an O(1) inter-zero
 * envelope, and off the axis it grows with transverse distance. We model:
 *
 *   ON-AXIS modulus (short-edge value at an x-endpoint), normalised env == 1:
 *     |H_t(x)| ~ |sin(pi (x - x_0) / gap)|,   gap = meanZeroGap(T_PT) ~ 0.2336,
 *   with x_0 a real zero. This is the standard "sine-kernel" OOM stand-in for the
 *   main-term oscillation (NOT a certified profile). Zeros sit at integer multiples of
 *   the mean gap; between them |H_t| rises to the O(1) inter-zero maximum.
 *
 *   OFF-AXIS modulus (long-edge worst point, directly above a real zero x_0):
 *     |H_t(x_0 +- i h)| ~ |H_t'(x_0)| . h ~ w . h   (imp-35778 h-linear leading order),
 *   with w = windingRate(T_PT) = (1/2) log(T_PT / 2 pi) ~ 13.446 the imp-35777 derivative
 *   scale (|H_t'| ~ |H_t| . w, |H_t| ~ 1). The linear proxy reaches the O(1) main-term
 *   envelope at h ~ 1/w; beyond that the off-axis modulus is already env-scale, so we cap
 *   the OOM long-edge floor at the envelope: delta_long(h) = min(w . h, 1).
 *
 * THE TWO KNOBS (independent controls, one floor each)
 * -----------------------------------------------------------------------------
 * delta_short(Delta): the short edges sit at x = T_PT and x = T_PT + Delta. The whole
 * rectangle may SLIDE along the axis (choose the base phase phi of the left endpoint
 * freely), so the achievable short-edge floor is the phase-optimised worst endpoint:
 *     delta_short(Delta) = max over phi of min(|sin(phi)|, |sin(phi + pi Delta / gap)|).
 * Closed form (verified numerically below): with d = distance(Delta / gap, nearest int)
 * in [0, 1/2],
 *     delta_short(Delta) = cos(pi d / 2)  in  [cos(pi/4), 1] = [0.7071..., 1].
 * KEY MEASUREMENT: with free sliding the short-edge floor NEVER collapses to 0 -- it only
 * dips to 1/sqrt2 ~ 0.707 at half-integer Delta/gap (endpoints 90 deg out of phase). The
 * imp-35758/imp-35778 "grazing-a-zero collapse" caveat therefore bites ONLY when the
 * endpoints are NOT free to slide (both x-positions externally pinned onto zeros); with
 * one free slide the short-edge quantization penalty is bounded by ~29%, not a collapse.
 *
 * delta_long(h): controlled purely by the off-axis height, delta_long(h) = min(w h, 1),
 * INDEPENDENT of Delta. It rises linearly to the envelope at h = 1/w ~ 0.0744 and
 * saturates there.
 *
 * THE TRADE-OFF SURFACE AND BALANCE POINT
 * -----------------------------------------------------------------------------
 * delta(h, Delta) = min(delta_short(Delta), delta_long(h)) = min(cos(pi d / 2), min(w h, 1)).
 * The two knobs act on disjoint floors, so the surface is a MIN of a Delta-ridge and an
 * h-ramp; its maximum is the joint corner:
 *   - Delta at an integer number of mean gaps (d = 0): delta_short = 1 (endpoints at
 *     consecutive inter-zero maxima); the smallest such Delta that still encloses a zero
 *     is one mean gap, Delta* = gap ~ 0.2336.
 *   - h at or beyond the saturation height: h* = 1/w ~ 0.0744 (h ~ (1/pi) of the mean
 *     gap); larger h is WASTED (delta_long already == 1 == the short-edge ceiling).
 * At (h*, Delta*) the two floors BALANCE: delta_short = delta_long = delta* = 1 (main-term
 * scale). This is the argmax; the balance is a SATURATION corner (no genuine tension --
 * pushing either knob past its own optimum cannot raise the min), which is exactly why
 * imp-35778's two independent knobs both hit main-term scale "under the same geometry".
 *
 * WHAT THIS MEASURES (over imp-35778)
 * -----------------------------------------------------------------------------
 * imp-35778 asserted the h-linearity and the "both reach main-term scale" balance
 * qualitatively; this module TABULATES delta over an (h, Delta) grid on the shared OOM
 * model, exhibits the ridge/ramp/min structure, and LOCATES the argmax numerically --
 * confirming (h*, Delta*) = (1/w, gap) and quantifying the short-edge quantization
 * penalty as bounded (>= 1/sqrt2, not a collapse) once one endpoint may slide. It ADDS NO
 * greenfield mechanism: both floors are the SAME I1/W1 enclosure quantities imp-35778
 * read (imp-35681 Part A), just swept over the two knobs.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * MEASUREMENT on a normalised OOM model only. The sine-kernel on-axis profile and the
 * w-h off-axis proxy are OOM stand-ins, NOT certified moduli; the balance value delta* = 1
 * is the normalised envelope, NOT a certified magnitude. Evaluates no true |H_t| or
 * |H_t'|; lower-bounds no inf|H_t'|; fixes no Delta or h for any rectangle; positions no
 * rectangle; verifies no strict inequality; certifies no delta > 0. Establishes no
 * positivity; certifies no non-vanishing; changes no bound; C_mb GUE-conditional
 * (imp-486) untouched; NO QED. No refereed bound is changed.
 *
 * @see imp-35778-i3-edge-type-floor-decomposition-scope (delta = min(delta_short, delta_long); two-knob prescription, not tabulated)
 * @see imp-35777-i2-logderivative-panel-cap-scope (B = sup|H_t prime| ~ |H_t| . w; the off-axis derivative scale)
 * @see imp-35758-i3-modulus-floor-margin-tie-scope (I3 floor = margin - cap; grazing-collapse caveat)
 * @see imp-35757-i2-panel-width-count-scope (mean zero gap delta(T_PT) = 2 pi / log(T_PT/2 pi) ~ 0.2336)
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (I3 named GREENFIELD)
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (Part A: A+B-C interval enclosure greenfield)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35725 / imp-35757 / imp-35777 / imp-35778) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement

// Winding / derivative log-scale w(T) = (1/2) log(T / 2 pi) (imp-35757 / imp-35777 / imp-35778).
const windingRate = (T) => 0.5 * Math.log(T / (2 * Math.PI));
const W_TPT = windingRate(T_PT); // ~13.446 rad per unit height at T_PT

// Mean zero gap delta(T) = 2 pi / log(T / 2 pi) = pi / w(T) (imp-35757).
const meanZeroGap = (T) => (2 * Math.PI) / Math.log(T / (2 * Math.PI));
const GAP_TPT = meanZeroGap(T_PT); // ~0.2336

// -- OOM floor models (normalised main-term envelope == 1; NOT certified moduli) --

// Distance of a real value to the nearest integer, in [0, 1/2].
const distToNearestInt = (x) => {
  const f = x - Math.floor(x);
  return Math.min(f, 1 - f);
};

// Short-edge floor, phase-optimised over a free slide of the rectangle base position:
//   delta_short(Delta) = max over phi of min(|sin phi|, |sin(phi + pi Delta / gap)|).
// Closed form: cos(pi d / 2) with d = dist(Delta/gap, nearest int) in [0, 1/2].
const deltaShortClosedForm = (Delta, gap) => Math.cos((Math.PI * distToNearestInt(Delta / gap)) / 2);

// Direct phase-grid evaluation (used to VERIFY the closed form, not for production).
const deltaShortPhaseGrid = (Delta, gap, phiPanels = 4000) => {
  const theta = (Math.PI * Delta) / gap; // phase increment between the two endpoints
  let best = 0;
  for (let k = 0; k <= phiPanels; k++) {
    const phi = (Math.PI * k) / phiPanels; // |sin| has period pi; sweep [0, pi]
    const worst = Math.min(Math.abs(Math.sin(phi)), Math.abs(Math.sin(phi + theta)));
    if (worst > best) best = worst;
  }
  return best;
};

// Long-edge floor: h-linear near a zero, capped at the O(1) envelope (imp-35778 proxy).
const deltaLong = (h, w) => Math.min(w * h, 1);

// The two-knob min floor on the shared OOM model.
const deltaTwoKnob = (h, Delta, w, gap) => Math.min(deltaShortClosedForm(Delta, gap), deltaLong(h, w));

// -- Balance-point search: sweep (h, Delta), locate argmax of min(delta_short, delta_long) --
const H_SAT = 1 / W_TPT; // ~0.0744 off-axis saturation height (h ~ (1/pi) of the mean gap)

function locateBalancePoint(w, gap, hPanels = 240, deltaPanels = 240) {
  const hMax = 3 * (1 / w); // sweep out to 3x the saturation height
  const deltaMax = 3 * gap; // sweep out to 3 mean gaps (a few enclosed zeros)
  let best = { delta: -1, h: 0, Delta: 0 };
  for (let i = 1; i <= hPanels; i++) {
    const h = (hMax * i) / hPanels;
    for (let j = 1; j <= deltaPanels; j++) {
      const Delta = (deltaMax * j) / deltaPanels;
      const d = deltaTwoKnob(h, Delta, w, gap);
      if (d > best.delta + 1e-15) best = { delta: d, h, Delta };
    }
  }
  return best;
}

const BALANCE = locateBalancePoint(W_TPT, GAP_TPT);

// A small illustrative tabulation of the trade-off (h as multiple of 1/w, Delta as multiple of gap).
const TRADEOFF_TABLE = [
  { hOverHsat: 0.5, DeltaOverGap: 1.0 },
  { hOverHsat: 1.0, DeltaOverGap: 1.0 },
  { hOverHsat: 2.0, DeltaOverGap: 1.0 },
  { hOverHsat: 1.0, DeltaOverGap: 0.5 },
  { hOverHsat: 1.0, DeltaOverGap: 1.5 },
  { hOverHsat: 0.5, DeltaOverGap: 0.5 },
].map((r) => {
  const h = r.hOverHsat * H_SAT;
  const Delta = r.DeltaOverGap * GAP_TPT;
  return {
    ...r,
    deltaShort: deltaShortClosedForm(Delta, GAP_TPT),
    deltaLong: deltaLong(h, W_TPT),
    deltaMin: deltaTwoKnob(h, Delta, W_TPT, GAP_TPT),
  };
});

export const IMP35800_I3_TWO_KNOB_FLOOR_BALANCE_POINT = {
  id: 'imp-35800',
  proofSection: 'S-frontier',
  question:
    'Measure the imp-35778 two-knob I3 floor delta = min(delta_short, delta_long) as the off-axis height h and ' +
    'endpoint spacing Delta vary at T_PT = 3e12, and locate the (h, Delta) that maximizes min(delta_short, delta_long). ' +
    'Measurement on the shared OOM model only; certifies no delta > 0; changes no bound; NO QED.',
  model: {
    onAxis: '|H_t(x)| ~ |sin(pi (x - x_0) / gap)| (sine-kernel OOM stand-in, normalised env == 1; NOT a certified profile)',
    offAxis: '|H_t(x_0 +- i h)| ~ w . h capped at env == 1 (imp-35778 h-linear leading order; imp-35777 w derivative scale)',
    gap: GAP_TPT,
    windingRate: W_TPT,
  },
  shortEdgeFloor: {
    formula: 'delta_short(Delta) = max over phi of min(|sin phi|, |sin(phi + pi Delta/gap)|) = cos(pi d / 2), d = dist(Delta/gap, int)',
    range: '[cos(pi/4), 1] = [0.7071..., 1] with free sliding: NEVER collapses to 0; dips only to 1/sqrt2 at half-integer Delta/gap',
    caveat:
      'the imp-35758/imp-35778 grazing-collapse bites ONLY when endpoints are externally pinned (no slide); with one free ' +
      'slide the short-edge quantization penalty is bounded by ~29%, not a collapse',
  },
  longEdgeFloor: {
    formula: 'delta_long(h) = min(w . h, 1), INDEPENDENT of Delta; rises linearly to the envelope at h = 1/w and saturates',
    saturationHeight: H_SAT,
  },
  balancePoint: {
    h: BALANCE.h,
    Delta: BALANCE.Delta,
    delta: BALANCE.delta,
    hOverSaturation: BALANCE.h / H_SAT,
    DeltaOverGap: BALANCE.Delta / GAP_TPT,
    interpretation:
      'argmax of min(delta_short, delta_long) is the SATURATION corner (h ~ 1/w, Delta ~ integer mean gaps): there ' +
      'delta_short = delta_long = 1 (normalised main-term scale). No genuine tension -- the knobs act on disjoint floors, ' +
      'so pushing either past its own optimum cannot raise the min; h beyond 1/w is WASTED',
  },
  tradeoffTable: TRADEOFF_TABLE,
  isRigorous: false,
  verdict:
    'MEASUREMENT on a normalised OOM model (frontier-direction, NOT rigorous). The imp-35778 two-knob I3 floor ' +
    'delta = min(delta_short, delta_long) is tabulated over an (h, Delta) grid at T_PT = 3e12. delta_short(Delta), ' +
    'phase-optimised over a free rectangle slide, equals cos(pi d / 2) with d = dist(Delta/gap, nearest int): it ranges ' +
    '[1/sqrt2, 1] and NEVER collapses -- the imp-35758 grazing caveat bites only when endpoints are externally pinned. ' +
    'delta_long(h) = min(w h, 1) is Delta-independent, linear to the envelope at h = 1/w ~ 0.0744, then saturated. The ' +
    'argmax of the min is the saturation corner (h* = 1/w, Delta* = one mean gap ~ 0.2336) where both floors balance at ' +
    'the normalised main-term scale 1; the balance is a saturation, not a tension (disjoint knobs). This TABULATES and ' +
    'LOCATES what imp-35778 prescribed qualitatively, ADDING NO greenfield mechanism -- both floors are the SAME I1/W1 ' +
    'enclosure quantities (imp-35681 Part A). Evaluates no true |H_t| or |H_t prime|; lower-bounds no inf|H_t prime|; ' +
    'fixes no Delta or h for any rectangle; certifies no delta > 0; establishes no positivity; changes no bound; ' +
    'C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35778 (delta = min(delta_short, delta_long); two-knob prescription); imp-35777 (B = sup|H_t prime| ~ |H_t| . w); ' +
    'imp-35758 (I3 floor = margin - cap; grazing caveat); imp-35757 (mean zero gap ~ 0.2336); imp-35727 (I3 GREENFIELD); ' +
    'imp-35681 Part A (A+B-C interval enclosure greenfield); Polymath15 2019 (H_t = A + B - C, barrier method); ' +
    'Platt-Trudgian 2021.',
};

export const IMP35800_I3_TWO_KNOB_FLOOR_BALANCE_POINT_ASSERTIONS = [
  {
    // Closed-form delta_short matches the direct phase-grid maximisation at several Delta/gap.
    id: 'imp35800-short-floor-closed-form-matches-grid',
    description: 'delta_short(Delta) = cos(pi d/2) reproduces the max-over-phi grid search across Delta/gap in {0.5,1,1.5,2,0.37,2.83}',
    holds: () => {
      const cases = [0.5, 1.0, 1.5, 2.0, 0.37, 2.83];
      for (const r of cases) {
        const Delta = r * GAP_TPT;
        const cf = deltaShortClosedForm(Delta, GAP_TPT);
        const grid = deltaShortPhaseGrid(Delta, GAP_TPT, 6000);
        if (Math.abs(cf - grid) > 2e-3) return false;
      }
      return true;
    },
  },
  {
    // Short-edge floor never collapses under free sliding: bounded below by 1/sqrt2, above by 1.
    id: 'imp35800-short-floor-no-collapse',
    description: 'delta_short in [1/sqrt2, 1]: = 1 at integer Delta/gap, = 1/sqrt2 at half-integer; never 0 (no collapse with a free slide)',
    holds: () => {
      const atInt = deltaShortClosedForm(2 * GAP_TPT, GAP_TPT); // Delta/gap = 2
      const atHalf = deltaShortClosedForm(1.5 * GAP_TPT, GAP_TPT); // Delta/gap = 1.5
      let mn = Infinity;
      for (let k = 0; k <= 500; k++) {
        const Delta = (3 * GAP_TPT * k) / 500;
        mn = Math.min(mn, deltaShortClosedForm(Delta, GAP_TPT));
      }
      return (
        Math.abs(atInt - 1) < 1e-9 &&
        Math.abs(atHalf - Math.SQRT1_2) < 1e-9 &&
        mn > Math.SQRT1_2 - 1e-9
      );
    },
  },
  {
    // Long-edge floor is h-linear up to the envelope, Delta-independent, saturating at h = 1/w.
    id: 'imp35800-long-floor-linear-then-saturates',
    description: 'delta_long(h) = min(w h, 1): linear (doubling h below 1/w doubles it), reaches 1 exactly at h = 1/w, then saturates',
    holds: () => {
      const w = W_TPT;
      const hLo = 0.3 * H_SAT;
      const linear = Math.abs(deltaLong(2 * hLo, w) - 2 * deltaLong(hLo, w)) < 1e-12;
      const atSat = Math.abs(deltaLong(H_SAT, w) - 1) < 1e-12;
      const saturated = Math.abs(deltaLong(2 * H_SAT, w) - 1) < 1e-12;
      return linear && atSat && saturated && Math.abs(W_TPT * H_SAT - 1) < 1e-12;
    },
  },
  {
    // The located balance point is the saturation corner: h ~ 1/w, Delta ~ integer gap, delta ~ 1.
    id: 'imp35800-balance-point-saturation-corner',
    description: 'argmax of min(delta_short, delta_long) at (h ~ 1/w, Delta ~ integer mean gap) with balance value delta ~ 1 (normalised)',
    holds: () => {
      const b = IMP35800_I3_TWO_KNOB_FLOOR_BALANCE_POINT.balancePoint;
      return (
        b.delta > 0.99 &&
        b.hOverSaturation >= 1 - 1e-9 && // saturation reached (h >= 1/w)
        Math.abs(distToNearestInt(b.DeltaOverGap)) < 0.02 && // Delta at (near) an integer number of gaps
        b.DeltaOverGap > 0.5 && // encloses at least one gap
        Math.abs(W_TPT - 13.446) < 5e-3 &&
        Math.abs(GAP_TPT - 0.2336) < 5e-4
      );
    },
  },
  {
    // Honesty gate: measurement on OOM model only, no positivity, no delta>0 certificate, no QED, no refereed bound is changed.
    id: 'imp35800-honesty-gate-no-qed',
    description: 'OOM measurement only; establishes no positivity; certifies no delta>0; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35800_I3_TWO_KNOB_FLOOR_BALANCE_POINT.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /establishes no positivity/.test(IMP35800_I3_TWO_KNOB_FLOOR_BALANCE_POINT.verdict) &&
      /certifies no delta > 0/.test(IMP35800_I3_TWO_KNOB_FLOOR_BALANCE_POINT.verdict) &&
      /NO QED/.test(IMP35800_I3_TWO_KNOB_FLOOR_BALANCE_POINT.verdict) &&
      /refereed bound is changed/i.test(IMP35800_I3_TWO_KNOB_FLOOR_BALANCE_POINT.verdict),
  },
];

for (const a of IMP35800_I3_TWO_KNOB_FLOOR_BALANCE_POINT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35800-i3-two-knob-floor-balance-point assertion failed: ${a.id}`);
  }
}
