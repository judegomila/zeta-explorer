/**
 * imp-95208-ythaw — y-thaw 0.17759432 candidate package, stages 1+2 (FROZEN).
 *
 * GRADE: stage 1 = prose-proof (pending referee); stage 2 = Arb-certified
 * rows under OUR compile (local clang/FLINT, prec 256), NOT the sealed
 * toolchain. The package is NOT a candidate until the obligations ledger
 * below closes. Changes no bound; NO QED. No refereed bound is changed.
 *
 * (Filename note: the imp-95208 id is also used by the unrelated
 * imp-95208-mb-uniform-ballast-cap module; this module's id string is the
 * full 'imp-95208-ythaw-package-stage12'.)
 *
 * WHAT THIS IS: execution record of the first two stages of the y-thaw
 * candidate package derived from the imp-95207 salvage finding — a
 * delivered-face y-thaw of the sealed 0.1787854 candidate from its y-anchor
 * 0.187271994702891 down to 0.1808, giving the candidate value
 * 129/800 + 0.1808^2/2 = 0.17759432 (a 1.19e-3 conditional-candidate
 * sharpening), with the sharp (vecmax two/three-branch) weight replacing the
 * triangle weight whose sealed 7.9e-7 floor was a ~79,000x-pessimistic
 * artifact.
 *
 * STAGE 1 (theorem gate) — formalization/y-thaw-01775943/
 * SHARP_WEIGHT_NATIVE_BINDING.md: the sharp-weight native-binding lemma at
 * (t-box [129/800, 129/800+1e-9], y = 0.1808). VERDICT: CLOSES. Every step
 * of the sealed NATIVE_BINDING chain re-derives pointwise at the displaced
 * height: Theorem-eff inputs need only region membership (0<t<=1/2,
 * 0<=y<=1, x>=200); window-freeze directions need only y > 0; the sharp
 * summand is bound by the paper's Improved Triangle Inequality
 * (arXiv:1904.12438v2, barrier section), completed with a new radial-
 * monotonicity sub-lemma S0 (m(rho) = max(|B-rho A|/(1-rho),
 * |B+rho A|/(1+rho)) nondecreasing on [0,1)) so the full disk |gamma'| <=
 * g_N is covered, not just the boundary circle; frozen three-branch
 * domination and t-box uniformity are y-independent. Per-row side
 * conditions (positivity, g_N < 1, inner sign) are exactly what the sweep
 * certifies.
 *
 * STAGE 2 (fired on stage-1 close) — sharp-weight re-sweep of the finite
 * lane N = 690988..3840000 (3,149,013 rows, every integer N) at prec 256,
 * K = 8, hw = 1e-3, mode t, 27 shards at the sealed family boundaries,
 * 12-slot pool under nice -n 15. STRICT FAIL-CLOSED: zero UNCERT rows,
 * zero nonpositive floors, zero aborts. GLOBAL MIN L12 = 0.062718178029 at
 * N = 690996. Wall 666 s; 7,265 CPU-s (~2.02 CPU-hr; the ~12 CPU-hr
 * estimate assumed hw = 1e-5 rebuild cadence). Results:
 * formalization/y-thaw-01775943/sweep-results/ (SUMMARY.md, per-shard
 * minima, 27 gzipped shard logs + SHA256SUMS).
 *
 * NOT CLAIMED (obligations ledger, stage-1 note section 6): O1 all-y
 * transfer on the gap [0.1808, 0.187272] (sealed Dini cover starts at
 * 0.187272); O2 barrier/winding slab at the 0.1808 bottom edge; O3 global
 * E_max budget re-certification over y in [0.1808, y_max]; O4 analytic
 * tail (N > 3840000) at y = 0.1808; O5 left-edge site coverage
 * x_*(0.1808) in window 690988 (start moves right ~1.21e-3 vs sealed
 * interior margins > 5.38e6); O6 criterion assembly at y0 = 0.1808.
 * Until O1-O6 close, 0.17759432 is a package value, not a bound.
 *
 * REFEREE RECORD (appended 2026-09-10; history above kept verbatim): full
 * skeptical pass (note + sealed chain + Polymath Lemma 8.5 + producer
 * source + Lean statements + 400k randomized trials). S0 SOUND and
 * load-bearing: the endpoint-motion proof survives step-by-step approach (the
 * u* > u_minus V-shaped regime handled correctly; 200k randomized trials
 * zero violations; no hidden side conditions); critically, Polymath's
 * boundary-phase reduction provably does NOT port to the modulus form
 * (dist-to-ray vs dist-to-{0}: 0 can sit inside a disk whose boundary has
 * large modulus), so S0 is the exact necessary repair. Rows 1-6
 * region-membership ACCURATE; S2 step 3 correctly breaks the circularity a
 * naive port would have (E-bar != 0 derived via S1 at w = 0 BEFORE the main
 * inequality). Nits fixed in the note: O5 displaced-site shift is 1.212e-3
 * (not 1.208e-3); the section-4 amortized-Taylor sentence now states its
 * validity is inherited from the sealed audit. MATERIAL: O1 RESTATED —
 * route (a) (triangle Dini extension run + splice) STRUCK: the Dini
 * theorems are y-floor-free, but the transfer runs upward from a
 * bottom-edge anchor of the TRIANGLE functional, and this package's own
 * sweep shows the triangle floor at 0.1808 has COLLAPSED — the anchor does
 * not exist. O1 is now: prove SHARP-MASS Y-MONOTONICITY (new theorem + new
 * producer + new certificates; cost re-scoped upward). See
 * REFEREE_RECORD_2026_09_10 below and the note's REFEREE RECORD section.
 */

// ── candidate arithmetic ────────────────────────────────────────────────────
export const YTHAW_ROW = {
  t0: { num: 129, den: 800 }, // 0.16125; t-box [129/800, 129/800 + 1e-9]
  tBox: { num: [161250000, 161250001], den: 1000000000 },
  y: { num: 113, den: 625 }, // 0.1808 exactly; y^2 = 12769/390625
  y2: { num: 12769, den: 390625 },
  candidateValue: 0.17759432, // = 129/800 + (113/625)^2 / 2, exact in decimal
  sealedBase: 0.1787854,
  sealedYAnchor: 0.187271994702891, // sqrt(350708/1e7), sealed Dini anchor
  sealedDiniCover: [0.187271994702891, 0.823103881657717],
  yMax: 0.823103881657717, // sqrt(1 - 2 t0), unchanged by the thaw
};

// ── referee record (appended 2026-09-10; skeptical pass) ──────────────────
export const REFEREE_RECORD_2026_09_10 = {
  date: '2026-09-10',
  scope:
    'note + sealed chain + Polymath Lemma 8.5 + producer source + Lean statements + 400k randomized trials',
  s0: 'SOUND and load-bearing — endpoint-motion proof survives step-by-step approach: u* > u_minus V-shaped regime handled correctly; 200k randomized trials zero violations; no hidden side conditions',
  s0ExactRepair:
    "Polymath's boundary-phase reduction provably does NOT port to the modulus form (dist-to-ray vs dist-to-{0}: 0 can sit inside a disk whose boundary has large modulus), so S0 is the exact necessary repair",
  rows1to6: 'region-membership ACCURATE',
  s2Step3:
    'correctly breaks the circularity a naive port would have: E-bar != 0 derived via S1 at w = 0 BEFORE the main inequality',
  nitsFixed: {
    o5ShiftCorrected: 1.212e-3, // was quoted 1.208e-3 (double-precision estimate)
    section4:
      'amortized-Taylor sentence now states plainly that its validity is inherited from the sealed audit',
  },
  o1Restated: {
    struckRoute:
      'route (a): triangle Dini extension run on [0.1808, 0.187272] + splice',
    reason:
      "the Dini theorems are y-floor-free, but the transfer runs upward from a bottom-edge anchor of the TRIANGLE functional, and this package's own sweep shows the triangle floor at 0.1808 has COLLAPSED — the anchor does not exist",
    newO1:
      "prove SHARP-MASS Y-MONOTONICITY: y-monotonicity of the max-of-kinked-branches summand with y-dependent c(gamma), same style as the note section-3 divisor-pattern cells (B and gamma*A live on the same cells, so the structure plausibly carries) — a NEW theorem + new producer + new certificates",
    cost: 're-scoped UPWARD (new theorem + producer + certificates, not a run + splice)',
    diniHeadroomNote:
      "sealed Dini certificate's worst gate has 1.4e-6 headroom at an interior rectangle (y ~ 0.20) — not obviously wall-blocking for new rectangles, but no passage guarantee",
  },
};

// ── stage 1: the theorem gate ───────────────────────────────────────────────
export const STAGE1 = {
  note: 'formalization/y-thaw-01775943/SHARP_WEIGHT_NATIVE_BINDING.md',
  verdict: 'CLOSES',
  grade: 'prose-proof, pending referee',
  lemma:
    'at (t-box 129/800, y = 0.1808): stored sharp floor T_N > 0 implies |f_t(x+iy)| >= T_N on window W_N, in Theorem-1.3 normalized additive-error units (no Euler-factor conversion)',
  newContent: [
    'S0 radial monotonicity: m(rho) = max(|B - rho A|/(1-rho), |B + rho A|/(1+rho)) nondecreasing on [0,1) — extends the published boundary-circle Improved Triangle Inequality to the full disk |gamma\'| <= g_N',
    'S1 sharp disk lemma: |P + w conj(Q)| >= (1-g) - sum max(|B_n - g A_n|, c(g)|B_n + g A_n|) n^{-sigma} for all |w| <= g < 1 (cosine-rule/fractional-linear step verbatim from arXiv:1904.12438v2)',
    'S2 sharp native binding: kappa-removal -> mollify -> exact truncated convolution (real coefficients) -> gamma\' = gamma E/conj(E) -> S1 -> E != 0 via S1 at w = 0 -> division by |E| <= M_N',
  ],
  yAuditRowLevel:
    'no step of the row-level binding chain uses y >= 0.187272; only region membership (0 <= y <= 1) and y > 0 are consumed',
  obligationsOpen: [
    'O1 all-y transfer (Dini) on [0.1808, 0.187272]',
    'O2 barrier/winding slab at bottom edge 0.1808',
    'O3 E_max budget over y in [0.1808, y_max]',
    'O4 analytic tail N > 3840000 at y = 0.1808',
    'O5 site coverage x_*(0.1808) in window 690988',
    'O6 criterion assembly at y0 = 0.1808',
  ],
  // ── appended 2026-09-10 (independent referee pass; obligationsOpen above
  // kept verbatim as history — O1 there is the ORIGINAL statement) ──
  refereeRecord: REFEREE_RECORD_2026_09_10,
  gradeUpdate2026_09_10:
    'prose-proof, REFEREED (skeptical pass 2026-09-10): S0/S1/S2 sound; rows 1-6 accurate; O1 restated (see refereeRecord.o1Restated)',
  obligationsRestated: [
    "O1 (RESTATED, supersedes the O1 wording above): prove SHARP-MASS Y-MONOTONICITY of the max-of-kinked-branches summand with y-dependent c(gamma) on [0.1808, 0.187272] — NEW theorem + new producer + new certificates, cost re-scoped upward; route (a) triangle-Dini extension + splice STRUCK (triangle anchor at 0.1808 collapsed per this package's own sweep)",
  ],
};

// ── stage 2: the sweep (fired on stage-1 close) ─────────────────────────────
export const STAGE2 = {
  producerSha256: '580d0b51165da58d4ca22e16d80a8c3db603dd0d9246f26dd027b5f820bf0808',
  binarySha256: '476dda60adb5548e4f70fea12a67d5c457b6edc2de864172118dc8b05c7bf47c',
  weight: 'SHARP', // plain compile, no -DTRIANGLE_WEIGHT
  mode: 't', // amortized frozen three-branch sawtooth, certified lower endpoints
  prec: 256,
  K: 8,
  hw: 1e-3, // rebuild cadence only; Lagrange remainder ~1e-21 added per row
  nRange: [690988, 3840000],
  rows: 3149013,
  uncertRows: 0,
  nonpositiveRows: 0,
  aborted: false,
  wallSeconds: 666,
  cpuSeconds: 7265,
  threads: 12,
  nice: 15,
  globalMin: { L12: 0.062718178029, N: 690996 },
  // per-shard minima (shard = [Nstart, Nend, mtype, minL12, argminN, wallS])
  shards: [
    ['p235711', 690988, 690995, 6, 0.06272566365, 690988, 411],
    ['p235711', 690996, 691500, 6, 0.062718178029, 690996, 412],
    ['p235711', 691501, 697000, 6, 0.062790626543, 691501, 414],
    ['p235711', 697001, 728999, 6, 0.064168829121, 697001, 582],
    ['p2357', 729000, 773999, 5, 0.063431045389, 729000, 426],
    ['p2357', 774000, 818999, 5, 0.077882593031, 774000, 438],
    ['p235', 819000, 888999, 4, 0.065454106079, 819000, 332],
    ['p235', 889000, 958999, 4, 0.085454129613, 889000, 367],
    ['p235', 959000, 1027999, 4, 0.10344845918, 959000, 277],
    ['p23', 1028000, 1189999, 3, 0.067916024127, 1028000, 379],
    ['p23', 1190000, 1349999, 3, 0.103966533555, 1190000, 426],
    ['p23', 1350000, 1509999, 3, 0.133462761063, 1350000, 412],
    ['p23', 1510000, 1669999, 3, 0.158481381135, 1510000, 270],
    ['p23', 1670000, 1829999, 3, 0.180066864934, 1670000, 211],
    ['p23', 1830000, 1989999, 3, 0.198949514617, 1830000, 196],
    ['p23', 1990000, 2149999, 3, 0.215657735504, 1990000, 199],
    ['p23', 2150000, 2309999, 3, 0.230584936149, 2150000, 151],
    ['p23', 2310000, 2469999, 3, 0.244031024125, 2310000, 157],
    ['p23', 2470000, 2629999, 3, 0.256229193728, 2470000, 164],
    ['p23', 2630000, 2789999, 3, 0.267364009416, 2630000, 170],
    ['p23', 2790000, 2949999, 3, 0.277583755035, 2790000, 172],
    ['p23', 2950000, 3109999, 3, 0.287009093409, 2950000, 175],
    ['p23', 3110000, 3269999, 3, 0.2957394234, 3110000, 176],
    ['p23', 3270000, 3429999, 3, 0.303857480187, 3270000, 98],
    ['p23', 3430000, 3589999, 3, 0.311432733338, 3430000, 100],
    ['p23', 3590000, 3749999, 3, 0.318524051581, 3590000, 99],
    ['p23', 3750000, 3840000, 3, 0.325311061495, 3750000, 51],
  ],
  sealedTriangleFloorAt690988: 7.91366e-7, // at the SEALED anchor y = 0.187272
  shadowPrec128At690988: 0.0627256, // imp-95207, 7 sig figs
  resultsDir: 'formalization/y-thaw-01775943/sweep-results/',
};

export const IMP_95208_YTHAW_VERDICT = {
  stage1: 'CLOSES',
  stage2: 'COMPLETE, fail-closed clean, global sharp floor 0.062718178029',
  packageIsCandidate: false, // O1-O6 open
  changesBound: false,
  qed: false,
  grade:
    'stage-1 note prose-proof pending referee; stage-2 rows Arb-certified under our local compile (not the sealed toolchain)',
};

export const IMP_95208_YTHAW_PACKAGE = {
  id: 'imp-95208-ythaw-package-stage12',
  title:
    'y-thaw 0.17759432 package, stages 1+2: sharp-weight native-binding note (CLOSES) + full-lane sharp re-sweep at y = 0.1808 (min 0.0627)',
  row: YTHAW_ROW,
  stage1: STAGE1,
  stage2: STAGE2,
  verdict: IMP_95208_YTHAW_VERDICT,
};

// ── assertions (import-light; O(27) loops) ──────────────────────────────────
export const IMP_95208_YTHAW_ASSERTIONS = [
  {
    id: 'imp-95208-ythaw-candidate-arithmetic',
    holds: () =>
      113 * 113 === 12769 &&
      625 * 625 === 390625 &&
      Math.abs(113 / 625 - 0.1808) < 1e-15 &&
      Math.abs(129 / 800 + (113 / 625) ** 2 / 2 - 0.17759432) < 1e-15 &&
      0.17759432 < YTHAW_ROW.sealedBase &&
      Math.abs(YTHAW_ROW.sealedBase - 0.17759432 - 1.19108e-3) < 1e-8,
    why: 'The thaw arithmetic is exact: y = 113/625 = 0.1808, candidate value 129/800 + y^2/2 = 0.17759432, a 1.19108e-3 sharpening of the sealed 0.1787854 base.',
  },
  {
    id: 'imp-95208-ythaw-below-sealed-cover',
    holds: () =>
      0.1808 < YTHAW_ROW.sealedYAnchor &&
      Math.abs(Math.sqrt(350708 / 10000000) - YTHAW_ROW.sealedYAnchor) < 1e-14 &&
      Math.abs(YTHAW_ROW.sealedYAnchor - 0.1808 - 0.006472) < 1e-6,
    why: 'The thawed edge 0.1808 sits 6.472e-3 BELOW the sealed y-monotonicity cover start 0.187271994702891 — exactly why the new binding note plus obligations O1-O6 are required, and why the sweep had to be re-run rather than transferred.',
  },
  {
    id: 'imp-95208-ythaw-lane-partition',
    holds: () => {
      const s = STAGE2.shards;
      if (s.length !== 27) return false;
      let rows = 0;
      for (let i = 0; i < s.length; i++) {
        const [, a, b, , min, argmin] = s[i];
        if (b < a || min <= 0 || argmin !== a) return false;
        if (i > 0 && a !== s[i - 1][2] + 1) return false;
        rows += b - a + 1;
      }
      return (
        s[0][1] === 690988 &&
        s[26][2] === 3840000 &&
        rows === 3149013 &&
        rows === STAGE2.rows
      );
    },
    why: 'The 27 shards exactly partition the finite lane N = 690988..3840000 (3,149,013 rows, no gaps/overlaps); every shard minimum is positive and sits at the shard left edge (floors increase within shards, matching the sealed sweep morphology).',
  },
  {
    id: 'imp-95208-ythaw-fail-closed-clean',
    holds: () =>
      STAGE2.uncertRows === 0 &&
      STAGE2.nonpositiveRows === 0 &&
      STAGE2.aborted === false &&
      STAGE2.shards.every((sh) => sh[4] > 0.06),
    why: 'Strict fail-closed discipline held: zero UNCERT rows, zero nonpositive floors, no abort; every per-shard minimum exceeds 0.06 — the whole triangle-collapsed stretch is sharp-positive at y = 0.1808 with margin, seams included.',
  },
  {
    id: 'imp-95208-ythaw-global-min',
    holds: () => {
      let min = Infinity;
      let at = 0;
      for (const sh of STAGE2.shards) {
        if (sh[4] < min) {
          min = sh[4];
          at = sh[5];
        }
      }
      return (
        Math.abs(min - STAGE2.globalMin.L12) < 1e-12 &&
        at === STAGE2.globalMin.N &&
        at === 690996 &&
        min > 0.0627
      );
    },
    why: 'Global sharp floor: 0.062718178029 at N = 690996 (the second p235711 shard left edge under its own re-freeze), consistent with the baked per-shard minima and above 0.0627.',
  },
  {
    id: 'imp-95208-ythaw-triangle-artifact-confirmed',
    holds: () => {
      const ratio = STAGE2.shards[0][4] / STAGE2.sealedTriangleFloorAt690988;
      return ratio > 7.9e4 && ratio < 8.0e4;
    },
    why: 'At N = 690988 the certified sharp floor at the DISPLACED y = 0.1808 (0.0627257) is ~7.93e4 times the sealed triangle floor at the sealed anchor (7.91366e-7): the sealed near-zero floor is a triangle-weight artifact, now confirmed at prec 256 across the full lane rather than at shadow probes.',
  },
  {
    id: 'imp-95208-ythaw-shadow-consistency',
    holds: () =>
      Math.abs(STAGE2.shards[0][4] - STAGE2.shadowPrec128At690988) < 5e-6,
    why: 'The prec-256 mode-t left-edge floor (0.062725663650) agrees with the imp-95207 prec-128 shadow (0.0627256, 7 sig figs) within storage-precision tolerance — the shadow measurement is validated, not just reproduced in kind.',
  },
  {
    id: 'imp-95208-ythaw-family-seams-positive',
    holds: () => {
      const seam = Object.fromEntries(
        STAGE2.shards
          .filter((sh) => [729000, 819000, 1028000].includes(sh[1]))
          .map((sh) => [sh[1], sh[4]])
      );
      return (
        seam[729000] > 0.063 &&
        seam[819000] > 0.065 &&
        seam[1028000] > 0.067 &&
        seam[729000] < seam[819000] &&
        seam[819000] < seam[1028000]
      );
    },
    why: 'The family-seam left edges that punctured the triangle thick region (sealed floors ~3.1e-4) are sharp-positive at 0.1808 with 0.063-0.068 margins, ordered increasing across families — the seam-excision problem of the split-collar analysis dissolves under the sharp weight.',
  },
  {
    id: 'imp-95208-ythaw-stage-gate-order',
    holds: () =>
      STAGE1.verdict === 'CLOSES' &&
      STAGE1.obligationsOpen.length === 6 &&
      IMP_95208_YTHAW_VERDICT.packageIsCandidate === false &&
      IMP_95208_YTHAW_VERDICT.changesBound === false &&
      IMP_95208_YTHAW_VERDICT.qed === false,
    why: 'Theorem-first ordering honored: the sweep fired only on the stage-1 close; six named obligations (O1-O6) remain open and are not claimed, so the package changes no bound and carries no QED.',
  },
  {
    id: 'imp-95208-ythaw-compute-budget',
    holds: () =>
      STAGE2.cpuSeconds < 12 * 3600 &&
      STAGE2.wallSeconds < 3600 &&
      STAGE2.threads <= 12,
    why: 'The run landed far inside the greenlit ~12 CPU-hr envelope: 7,265 CPU-s (~2.02 CPU-hr), 666 s wall on a 12-slot nice-15 pool — the hw = 1e-3 rebuild cadence (remainder cost ~1e-21) removed ~100x of the patch-rebuild estimate.',
  },
  // appended 2026-09-10 (independent referee pass)
  {
    id: 'imp-95208-ythaw-referee-record-appended',
    holds: () =>
      STAGE1.refereeRecord === REFEREE_RECORD_2026_09_10 &&
      REFEREE_RECORD_2026_09_10.date === '2026-09-10' &&
      Math.abs(REFEREE_RECORD_2026_09_10.nitsFixed.o5ShiftCorrected - 1.212e-3) < 1e-9 &&
      REFEREE_RECORD_2026_09_10.o1Restated.struckRoute.includes('triangle Dini') &&
      STAGE1.obligationsOpen.length === 6 && // history kept verbatim, not rewritten
      STAGE1.obligationsOpen[0].startsWith('O1 all-y transfer (Dini)') &&
      STAGE1.obligationsRestated.length === 1 &&
      STAGE1.obligationsRestated[0].includes('SHARP-MASS Y-MONOTONICITY'),
    why: 'The 2026-09-10 independent referee record is appended (not rewritten over history): S0 sound and load-bearing, boundary-phase reduction non-portable to modulus form, O5 shift nit fixed to 1.212e-3, and O1 restated as sharp-mass y-monotonicity with the triangle-Dini route struck while the original O1 wording is preserved in obligationsOpen.',
  },
];

for (const a of IMP_95208_YTHAW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95208-ythaw-package-stage12 assertion failed: ${a.id}`);
  }
}

export default IMP_95208_YTHAW_PACKAGE;
