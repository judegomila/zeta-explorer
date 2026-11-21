/**
 * @fileoverview imp-96019 — ASSESSMENT: can the Connes–Consani adelic scaling
 * site extend the proven archimedean Weil positivity PAST the first prime shift
 * u = ln 2? Answers roadmap opening.nextTests[1]
 * (rh-novel-routes-sweep-synthesis-2026-09-23.js). Assessment only; changes no
 * bound; conditional-frontier; no refereed bound is changed; RH open; NO QED.
 *
 * WHAT IS ALREADY PROVEN (the partial the sweep names). Weil positivity is a
 * THEOREM when the test function g = h * h~ has u-support inside the prime-free
 * window |u| < ln 2 (equivalently supp h inside |u| < (ln 2)/2). Reason: the
 * Weil/Guinand prime side is
 *   L(g) = Sum_p Sum_{k>=1} (log p) p^(-k/2) g(k log p),
 * a signed sum over the log-prime lattice { k log p }. The SMALLEST positive
 * lattice point is k log p = log 2 (p=2, k=1). So for supp g inside (−ln2, ln2)
 * every g(k log p) = 0 and the prime side is EMPTY: on that window W(g) reduces
 * to the archimedean local form, which is positive-definite (Yoshida 1992;
 * Connes–Consani 2021 "Weil positivity and the trace formula, the archimedean
 * place"; in-repo imp-95520 class II T=0.3 rung). Conditionality begins EXACTLY
 * at the first prime shift u = ln 2 — the point this ticket probes.
 *
 * WHAT THE SCALING SITE SUPPLIES AT u = ln 2. The scaling site is the topos
 * [0,∞) o N^x with its Frobenius/scaling flow R_+^x, whose periodic orbits have
 * lengths log p (the primes). This flow IS the promised SECOND direction of the
 * synthesis, but it is a DILATION (τ) direction — the same axis on which the
 * primon-gas zeros already live (Route A). The reflection/transfer (OS, Markov)
 * machinery that upgrades reflection positivity from an EQUIVALENCE
 * (RP = Weil = RH) to a THEOREM needs a genuine transverse EUCLIDEAN direction.
 * That Euclidean transverse structure exists at the archimedean place R (a real
 * line, with a Sonin/prolate reflection space) — and it is EXACTLY there that
 * Connes–Consani prove local positivity. It does NOT exist at the finite places
 * Q_p: they are totally disconnected, carry no Euclidean transverse coordinate,
 * and enter the trace formula ONLY through orbit counting (weights (log p) p^(-k/2)),
 * not through a reflection-positive transfer operator.
 *
 * THE ASSESSMENT (precise obstruction, no candidate extension). Crossing
 * u = ln 2 switches on the first FINITE-place term, p = 2, k = 1, with subtracted
 * weight w_{2,1} = (log 2)/sqrt(2) ~= 0.4901290717. Positivity past ln 2 therefore
 * requires a LOCAL positivity at the finite place p = 2 dominating this negative
 * spike. The scaling site supplies no such local positivity: its OS/Markov
 * transfer structure localizes at the archimedean place and reproduces precisely
 * the already-proven prime-free window, terminating at u = ln 2. The finite
 * places contribute only as periodic-orbit counts with no transverse Euclidean
 * (hence no reflection-positive) direction to run a transfer argument on. So the
 * scaling site does not, of itself, push the proven region past the first prime
 * shift; the archimedean-window theorem is exactly the archimedean-only
 * (semi-local S = {infinity}) fragment of the Connes 1999 trace formula, whose
 * FULL (all-places) positivity is equivalent to — not weaker than — RH.
 *
 * NAMED SUB-GAP (geometric refinement of imp-95520). The missing object is a
 * reflection-positive (OS / Markov transfer) transverse Euclidean structure at
 * the finite place p = 2 — a "finite-place Sonin space" carrying a local
 * positivity certificate for the p = 2 shift. imp-95520 named the algebraic form
 * of the gap (a positive-type-cone comparison carrying the archimedean majorant,
 * with "no archimedean channel"); this ticket refines it geometrically: the
 * archimedean channel DOES exist in the scaling site (that is the u < ln2 window),
 * but there is NO finite-place channel, and u = ln 2 is precisely the boundary
 * where the finite places must start contributing. Supplying that finite-place
 * Euclidean reflection structure is external to Connes–Consani 2021.
 *
 * HONEST LIMITS. Structural assessment of an external-geometry route; numerics
 * are only the lattice-ordering / weight witnesses recomputed by the assertions.
 * Touches no Lambda bound, no verified height, no paper packet. RH OPEN;
 * no refereed bound is changed; NO QED.
 */

// Weil prime-side weight on the log-prime lattice: w_{p,k} = (log p) p^(-k/2).
function weilWeight(p, k) {
  return Math.log(p) * Math.pow(p, -k / 2);
}

// The first few positive log-prime lattice points {k log p}, sorted, with weights.
function firstLatticePoints(limit) {
  const primes = [2, 3, 5, 7, 11, 13];
  const pts = [];
  for (const p of primes) {
    for (let k = 1; k <= 4; k++) {
      const u = k * Math.log(p);
      if (u <= limit + 1e-12) pts.push({ p, k, u, w: weilWeight(p, k) });
    }
  }
  return pts.sort((a, b) => a.u - b.u);
}

export const SCALING_SITE_WEIL_PAST_LN2 = Object.freeze({
  id: 'imp-96019-scaling-site-weil-past-ln2-assessment',
  title: 'Assessment: extending the proven archimedean Weil positivity past u = ln 2 via the Connes-Consani scaling site',
  date: '2026-09-23',
  status:
    'ASSESSMENT — no candidate extension; precise obstruction recorded. The scaling site supplies a reflection-positive '
    + 'transverse Euclidean direction ONLY at the archimedean place, reproducing exactly the u < ln2 window; the finite '
    + 'place p=2 (first shift at u = ln 2) has no such direction, so positivity does not extend. RH open; no refereed bound is changed; NO QED',
  answers: 'rh-novel-routes-sweep-synthesis-2026-09-23.js opening.nextTests[1] (archimedean Weil positivity past u = ln 2)',

  provenPartial: {
    window: '|u| < ln 2 (supp h inside |u| < (ln 2)/2)',
    why: 'the smallest positive log-prime lattice point is log 2 (p=2,k=1); inside the window the Weil prime side is EMPTY, so W(g) = archimedean local form (positive-definite)',
    sources: 'Yoshida 1992; Connes-Consani 2021 (archimedean place); in-repo imp-95520 class II T=0.3',
  },

  firstShift: {
    u: Math.log(2),
    place: 'p = 2, k = 1 (first finite place)',
    weight: 'w_{2,1} = (log 2)/sqrt(2) (subtracted; a negative contribution to W)',
    reading: 'conditionality begins exactly here — the first finite-place term switching on',
  },

  scalingSiteSupplies:
    'a Frobenius/scaling flow (second direction) whose periodic-orbit lengths are the log p, plus a reflection-positive '
    + 'transverse Euclidean structure AT THE ARCHIMEDEAN PLACE (Sonin/prolate space) where Connes-Consani prove local '
    + 'positivity. This transfer/Markov machinery localizes at infinity and reproduces precisely the u < ln2 window.',

  obstruction:
    'the finite places Q_p are totally disconnected, carry no transverse Euclidean coordinate, and enter the trace formula '
    + 'only as periodic-orbit counts (weights (log p) p^(-k/2)) — so there is no reflection-positive transfer operator to run '
    + 'past u = ln 2. The archimedean-window theorem is exactly the semi-local S = {infinity} fragment of the Connes 1999 '
    + 'trace formula, whose full all-places positivity is EQUIVALENT to RH, not weaker.',

  subGap:
    'missing object = a reflection-positive (OS / Markov transfer) transverse EUCLIDEAN structure at the finite place p = 2 '
    + '(a finite-place Sonin space with a local positivity certificate for the p=2 shift). This is the GEOMETRIC refinement of '
    + 'imp-95520: the archimedean channel exists (= the u < ln2 window) but there is no finite-place channel, and u = ln 2 is '
    + 'exactly the boundary where the finite places must start contributing. External to Connes-Consani 2021.',

  candidateExtension: 'NONE — the scaling site does not of itself extend positivity past the first prime shift; only the precise obstruction is recorded.',

  honest:
    'Structural assessment of an external-geometry route; the only numerics are the lattice-ordering and weight witnesses. '
    + 'No Lambda bound, verified height, or paper packet is touched. RH OPEN; no refereed bound is changed; NO QED.',
});

export const SCALING_SITE_WEIL_PAST_LN2_ASSERTIONS = Object.freeze([
  {
    name: 'first prime shift is exactly u = ln 2 (smallest positive log-prime lattice point)',
    check: () => {
      const pts = firstLatticePoints(2.5);
      return pts.length > 0
        && pts[0].p === 2 && pts[0].k === 1
        && Math.abs(pts[0].u - Math.log(2)) < 1e-15
        && Math.abs(SCALING_SITE_WEIL_PAST_LN2.firstShift.u - Math.log(2)) < 1e-15;
    },
  },
  {
    name: 'prime-free window is genuinely prime-empty: no lattice point in (0, ln 2)',
    check: () => firstLatticePoints(2.5).every((pt) => pt.u >= Math.log(2) - 1e-15),
  },
  {
    name: 'lattice ordering past ln 2 is log2 < log3 < 2 log2 (= log4) < log5',
    check: () => {
      const seq = [Math.log(2), Math.log(3), 2 * Math.log(2), Math.log(5)];
      for (let i = 1; i < seq.length; i++) if (!(seq[i] > seq[i - 1])) return false;
      // and firstLatticePoints reproduces this order
      const pts = firstLatticePoints(Math.log(5) + 1e-9).map((pt) => pt.u);
      for (let i = 0; i < seq.length; i++) if (Math.abs(pts[i] - seq[i]) > 1e-12) return false;
      return true;
    },
  },
  {
    name: 'first finite-place weight w_{2,1} = (log 2)/sqrt(2) ~= 0.4901290717 (subtracted spike)',
    check: () => Math.abs(weilWeight(2, 1) - 0.4901290717342736) < 1e-12,
  },
  {
    name: 'assessment: no candidate extension; obstruction is the missing finite-place channel',
    check: () => /NONE/.test(SCALING_SITE_WEIL_PAST_LN2.candidateExtension)
      && /finite-place channel/.test(SCALING_SITE_WEIL_PAST_LN2.subGap)
      && /finite place p = 2/.test(SCALING_SITE_WEIL_PAST_LN2.subGap),
  },
  {
    name: 'geometric refinement of imp-95520 (archimedean channel exists, no finite-place channel)',
    check: () => /GEOMETRIC refinement of/.test(SCALING_SITE_WEIL_PAST_LN2.subGap)
      && /archimedean channel exists/.test(SCALING_SITE_WEIL_PAST_LN2.subGap),
  },
  {
    name: 'honesty: RH open, no refereed bound is changed, NO QED',
    check: () => /RH open/.test(SCALING_SITE_WEIL_PAST_LN2.status)
      && /refereed bound is changed/i.test(SCALING_SITE_WEIL_PAST_LN2.status)
      && /NO QED/.test(SCALING_SITE_WEIL_PAST_LN2.status),
  },
]);

export default SCALING_SITE_WEIL_PAST_LN2;
