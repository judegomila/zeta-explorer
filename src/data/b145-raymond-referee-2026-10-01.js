/**
 * @fileoverview b145-raymond-referee-2026-10-01 — Track C: three internal referee reports on Raymond’s Λ ≤ 0.149396 analysis
 * (Zenodo 22867547): (A) Analytic Foundations Part I §§2–5 incl. the §3 Abel transfer; (B) AF §§10–12 incl. the §11 first-contact
 * argument; (C) AF Part II, the restored assembler guards, and the s145 band lemma (contract b). Sources: tmp/raymond-22867547/
 * (Analytic_Foundations.txt, Correlated_Translated_Probes.tex), /tmp/raymond_pr/pr/Proof_and_Replay/, Polymath15 arXiv 1904.12438.
 *
 * Result: NO ERROR found in any refereed section; every section grades SOUND, with expository GAPs that each have a one-paragraph fix.
 * These are internal referee passes by this project (not an external peer review); they narrow the G0 gate but do not close it.
 * Still unrefereed by any pass: AF §§6–9 and main-paper Lemmas 2–4 (self-review only, s145), main paper §§2–6/§8/§11 statements
 * beyond those used in §7 eq. (15), and main §5’s claim that c_n(t) ≥ 0 is nondecreasing for n ≤ 1024 (measured only; naive arb check
 * inconclusive).
 *
 * Corrections recorded:
 *  - s145 module’s dropped-guard list was slightly wrong: pipeline.py keeps h·r < 2, 0 < rate·δ < 1 and terminal-in-cell; it drops the
 *    strict time-zero entry check, U < 41/250, the contiguous-schedule check and check_history. Restored: identical outputs on X1, XW2.6,
 *    XW2.0, X2.62 (both modes).
 *  - Old band (contract b): H2 is now interval-certified for d ≥ 4 with b² ≤ 0.22h² (trajectory bound b ≤ √B2(t)); the wording
 *    “y < b ≤ 1” is NOT certified (float violations to normalised d ≈ 3 at b/h = 1.45). H1 (2-D zero-free box) is OPEN, estimated
 *    1e2–1e3 core-hours with a new 2-D evaluation engine. Track B’s Lemma B (walled window with verified RH inside) replaces H1.
 *  - θ0 sanity pin removal at new walls is harmless: a wrong branch flips the cosine-sum sign (−40.49 vs +40.49), so the check
 *    would fail, not pass falsely.
 *
 * PROVED: nothing new (re-derivations of Raymond’s steps). CERTIFIED: Raymond’s exact Bernstein kernel checker replayed (8,280
 *  coefficients, 41 leaves); H2 (old band, d ≥ 4) arb positivity. MEASURED: independent float/mpmath/arb checks listed per section.
 *  HEURISTIC: lever sweep (kernel domains not re-checked: upper limits on gains).
 * Verdict: SOUND (no ERROR) on AF §§2–5, §§10–12, Part II. No refereed bound is changed. RH open. NO QED.
 * Files: tmp/b145-C-refA-*.py (+ .out), tmp/b145-C-refB-*.py (+ .out/.json), tmp/b145-C-refC-*.py; /tmp/b145-C-refB-kroot/out.json.
 * Import-free. ASSERTIONS recompute the PT clearance, the first-contact entry numbers, v*, the r = 3/5 self cap, the far-field d^-4
 * coefficient sign, q_MTY of the old band, the Abel floor margins and the lever sweep crossing.
 */

const X1 = 6000000185827;
const T_PT_EXACT = 3000175332800;
const qMTY = (x) => (1 - 2 / (5.558691 * Math.log(x / 2))) ** 2;
const qStep = (q, c, d) => (q + 2 / c) * Math.exp(-c * d) - 2 / c;

export const B145_RAYMOND_REFEREE = Object.freeze({
  id: 'b145-raymond-referee-2026-10-01',
  date: '2026-10-01',
  title: 'Internal referee of Raymond’s Λ ≤ 0.149396: AF §§2–5, §§10–12, Part II — SOUND, no ERROR',
  status: 'REFEREE (internal, three passes). No ERROR found; expository GAPs with fixes. G0 narrowed, not closed. No bound claimed. NO QED.',

  sections: Object.freeze([
    { sec: 'AF §2 classical framework, finite head', grade: 'SOUND', gaps: ['2a: “no pair can be born inside” — write the k(t) count (boundary-free box, Prop 3.1(i)/(ii) + Rouché, infimum argument as in P15 Prop 3.3)'],
      checks: 'zeros of H0 in |Im z| < 1; de Bruijn |Im z| ≤ √(1−2t); forward splitting real (P15 Prop 3.1(ii)); clearance 175239886 exact' },
    { sec: 'AF §3 finite-head wall + Abel transfer', grade: 'SOUND (proved, with certified inputs)', gaps: ['3a: t = 0 needs a continuity sentence (P15 region (5) assumes t > 0)', '3b: error-budget reductions and da = 5/x live only in code; add a written lemma (measured sup x|α − lead| = 4.0)'],
      checks: 'Abel step re-derived: Σc_n w_n ≥ m·w_1 = 0.79 cosh(yL/4); error total ≈ 1.2e-3, physical floor 0.7888 > 3/4; independent prefix floors at X: minima 0.800597 / 0.868985 / 0.891753 / 0.867836 (match WALL_X1_B to 1e-13); exact Polymath f_t vs ideal ≤ 4.2e-12 (bound 8.4e-9)' },
    { sec: 'AF §4 larger-height approximation (y ≤ 2.41, σ ∈ [−1, 2])', grade: 'SOUND', gaps: [],
      checks: 'Polymath (14)–(18), Prop 6.1 all real σ, (60) has no σ restriction; δ3 replacement exponent ≤ −3r² for r ≥ 100; measured (4.6) sup 5.000 (< 10), (4.7) ratio ≤ 0.905; H_t by Gauss–Hermite at x = 2e4, 2e5: remainder 1.4–2.8% of budget' },
    { sec: 'AF §5 physical value and derivative errors', grade: 'SOUND', gaps: [],
      checks: 'ζ(5/4) = 4.60, −ζ′ = 15.93, ζ″ = 127.99 under 6/22/180; all 608 PLAN rows pass (min margins (5.1) 0.0834, (4.3) 9.72e-4 of 1e-3, (5.4) 8.79e-7 of 1e-6)' },
    { sec: 'AF §10 kernel catalogue, self caps', grade: 'SOUND', gaps: [],
      checks: 'Bernstein encoding re-derived (cube ↔ d ∈ [0,∞], 0 ≤ y ≤ ρ, 0 ≤ b ≤ y); exact checker PASS 8,280 coefficients; float search 160×81×1600; ρ = 1/2 counterexample reproduced (−32/195)' },
    { sec: 'AF §11 coupling + first contact', grade: 'SOUND', gaps: ['GAP-1: state compactness via P15 Thm 1.5(i) on [1e-8, 1/2] and Hurwitz closedness; no contact on (0, 1e-8] since Im² ≤ 1 − 2t < q(t)', 'GAP-2: cite Thm 1.5 part (i), qualitative constant C', 'GAP-4: multiple-zero step should cite P15 Prop 3.1(ii) backward branches z* + i√(2|t−t*|)λ_j'],
      checks: 'q′ = −2 − 4yΣK_y from P15 Prop 3.1(i); 240,000 random configurations × 14 modes, 0 violations (min slack 1.4e-11); probes r·h ≤ 1.26 < 2' },
    { sec: 'AF §12 terminal enclosure', grade: 'SOUND', gaps: ['GAP-3: AF §§10–12 text describes the 0.1511 parent; write one “final barrier lemma” (joint floors, sharp mode, 128 substeps, rate 2λ/h·(ℓ_joint − cap/h))'],
      checks: 'independent replay of 76,491 steps, 0 defects; ideal endpoint 0.14939507382768755913, U above it by 4.4e-16' },
    { sec: 'Part II §§1–8 (sharp continuum kernel, λ = 2, v ≤ v*)', grade: 'SOUND', gaps: [],
      checks: 'cleared numerator = (8/81)(V−4)(V−1)·Q exactly (middle term 12(1 + V − 29V²), unsquared); Q(21/100, 4/5, V) < 0; self term 6/(4 − v); §6 numbers reproduced exactly (primary 30168366072429/2e14)' },
    { sec: 'Assembler guards (restored)', grade: 'SOUND', gaps: [],
      checks: 'Raymond’s assemble_joint.integrate + verify_history on X1 / XW2.6 / XW2.0 / X2.62: identical U; entry margin 1.87e-6; max rate·δ 4.6e-5; max h·r 1.0355; DIRECT_192/256 and XI_T0 pass at 2.6X' },
    { sec: 'Old band lemma (contract b)', grade: 'logic SOUND; H2 certified (d ≥ 4, b² ≤ 0.22h²); strict-entry GAP fixed in text; H1 OPEN', gaps: ['H1 zero-free box: open (≈ 1e2–1e3 core-hours, new engine)'],
      checks: 'q1 exceeds exact q_MTY(X_b + 4) by 6.48e-12; guarded replay U_tail = 144987737368947/1e15, margin 1.23e-5' },
  ]),

  openForG0: Object.freeze([
    'AF §§6–9 and main-paper Lemmas 2–4: self-review only (s145); no independent pass',
    'main paper §5: c_n(t) ≥ 0 and nondecreasing for n ≤ 1024 — measured (50-digit grid min c_n′ = 0 at t = 0), not certified',
    'Raymond’s joint-pair lemma for arbitrary shifts r (needed by Track B two-height tables)',
    'external (non-project) referee of the whole chain',
  ]),

  leverSweep: Object.freeze({
    note: 'consumer re-integrated with geometry changed; kernel domains not re-checked — upper limits on gains, not bounds',
    rows: Object.freeze([['base', 0.1493951], ['λ → 2 everywhere', 0.1492898], ['self pair removed (impossible)', 0.1339841],
      ['floor +0.05', 0.148638], ['floor +0.10', 0.147893], ['floor +0.20', 0.146434], ['floor +0.30', 0.145015]]),
  }),

  firstContact: Object.freeze({ q0: 1.000002000001, c: 10.0733, q1e8: 1.0000018793, tAbove1: 1.66e-7, tAboveStrip: 1.99e-7 }),
  vStar: 0.2037354108,
  oldBand: Object.freeze({ Xb: 15720000486866, q1: '24397805261/25000000000', Utail: '144987737368947/1000000000000000' }),

  verdict:
    'Three internal referee passes find NO ERROR in Raymond’s AF §§2–5 (incl. the §3 Abel transfer), §§10–12 (incl. §11 first contact) '
    + 'and Part II; all graded SOUND with expository GAPs. G0 is narrowed to AF §§6–9 / main Lemmas 2–4 (self-reviewed only), the main §5 '
    + 'c_n monotonicity (measured only) and an external review. These passes move no bound: at PT height the chain still gives 0.149395. '
    + 'No refereed bound is changed. RH open. NO QED.',
});

const C = B145_RAYMOND_REFEREE;

export const B145_RAYMOND_REFEREE_ASSERTIONS = Object.freeze([
  {
    id: 'b145-ref-pt-clearance',
    holds: () => T_PT_EXACT - (X1 + 1) / 2 === 175239886 && (X1 + 1) / 2 === 3000000092914,
    why: 'AF §2: PT height 3000175332800 exceeds the needed ordinate (X + 1)/2 = 3000000092914 by exactly 175239886.',
  },
  {
    id: 'b145-ref-first-contact-entry',
    holds: () => {
      const f = C.firstContact, q = qStep(f.q0, f.c, 1e-8);
      const tHit1 = Math.log((f.q0 + 2 / f.c) / (1 + 2 / f.c)) / f.c;
      let lo = 0, hi = 1e-6;
      for (let i = 0; i < 80; i += 1) { const m = (lo + hi) / 2; if (qStep(f.q0, f.c, m) > 1 - 2 * m) lo = m; else hi = m; }
      return Math.abs(q - f.q1e8) < 1e-10 && Math.abs(tHit1 - f.tAbove1) < 0.01e-7 && Math.abs(lo - f.tAboveStrip) < 0.01e-7;
    },
    why: 'Closed-form step (q + 2/c)e^{−cd} − 2/c with c = 10.0733: q(1e-8) = 1.0000018793; barrier above 1 until 1.66e-7 and above 1 − 2t until 1.99e-7, so no contact before 1e-8.',
  },
  {
    id: 'b145-ref-part2-vstar',
    holds: () => {
      const v = (1 + Math.sqrt(117)) / 58;
      return Math.abs(29 * v * v - v - 1) < 1e-14 && Math.abs(v - C.vStar) < 1e-9 && 72 - 180 * v > 35 && v < 2 / 5 && v < 51 / 250;
    },
    why: 'Part II Thm 1: v* = (1 + √117)/58 = 0.2037354108 is the root of 29v² − v − 1; 72 − 180v* = 35.3 > 0; v* < 51/250.',
  },
  {
    id: 'b145-ref-self-cap-and-farfield',
    holds: () => {
      const a = 9 / 25, s = (V) => (2 * (1 + a - V)) / ((1 + a - V) ** 2 + 4 * a * V);
      const sup = Math.max(...Array.from({ length: 1001 }, (_, i) => s((i / 1000) * 0.3)));
      const c4 = (y, h, aa) => -4 * y * (3 * aa * aa - h * h + y * y);
      return Math.abs(2 / (1 + a) - 25 / 17) < 1e-15 && Math.abs(sup - 25 / 17) < 1e-12 && 3 * a >= 1
        && c4(0.5, 1, 0.6) < 0 && Math.abs(c4(0.5, 1, 0.5)) < 1e-15 && Math.abs(c4(0.4, 1, Math.sqrt((1 - 0.16) / 3))) < 1e-15;
    },
    why: 'AF §10: r = 3/5 self term is decreasing (3r² ≥ 1) with cap 25/17 = 2/(1 + r²) = its sup; far-field d^-4 coefficient −4y(3a² − h² + y²) is negative once a² > (h² − y²)/3 and zero on the sharp law (ρ = r = 1/2 sits exactly on it at y = ρ; its counterexample is near-field, d = 0.66).',
  },
  {
    id: 'b145-ref-old-band-mty',
    holds: () => {
      const q1 = 24397805261 / 25000000000;
      return q1 - qMTY(C.oldBand.Xb + 4) > 6e-12 && q1 - qMTY(C.oldBand.Xb + 4) < 7e-12
        && 0.145 - Number(C.oldBand.Utail.split('/')[0]) / 1e15 > 1.2e-5;
    },
    why: 'Old band: q1 exceeds q_MTY(X_b + 4) by ≈ 6.5e-12 (float; mpmath gives 6.48e-12); guarded U_tail margin 1.23e-5 below 0.145.',
  },
  {
    id: 'b145-ref-lever-sweep',
    holds: () => {
      const r = C.leverSweep.rows, fl = r.slice(3);
      return fl.every(([, u], i) => i === 0 || u < fl[i - 1][1]) && fl[fl.length - 1][1] > 0.145 && r[1][1] > r[0][1] - 2e-4
        && /not bounds/.test(C.leverSweep.note);
    },
    why: 'Raising the joint floor by 0.30 everywhere gives 0.145015 (> 0.145); λ → 2 is worth ≈ 1e-4; the sweep gives upper limits, not bounds.',
  },
  {
    id: 'b145-ref-grades',
    holds: () => C.sections.every((s) => /SOUND/.test(s.grade)) && !C.sections.some((s) => /ERROR/.test(s.grade))
      && C.sections.some((s) => /H1 OPEN/.test(s.grade)) && C.openForG0.length >= 3
      && /refereed bound is changed/i.test(C.verdict) && /NO QED/.test(C.verdict) && /narrowed/.test(C.verdict),
    why: 'All refereed sections SOUND, no ERROR; old-band H1 open; G0 narrowed, not closed; no bound claimed.',
  },
]);

export default B145_RAYMOND_REFEREE;
