/**
 * @fileoverview b145-verification-pilot-2026-10-01 — Track D: measured cost of extending verified RH height above PT (3.0001753e12)
 * with FLINT 3.6.0’s interval implementation of Platt’s method (Turing-anchored local isolation, index gluing), and the campaign
 * specification that would supply the “RH to T*” hypothesis of the b145 stack. MEASUREMENT + PLAN; no bound. One internal adversarial
 * referee pass (minor, not refuted).
 *
 * Referee corrections applied:
 *  - The “10–50× from a hardware-double port of the multieval” lever is unsupported: PT’s recorded 7.5e6 core-hours for (0, 3e12]
 *    is ≈ 111 units/core-s with Platt’s own double-interval code, 1.26× FLINT’s 88 on an M5 P-core; after hardware adjustment a port
 *    is worth ≈ 2–3× at most. Realistic S2 after a port ≈ 5e6–8e6 core-hours, not 1.5e6.
 *  - Prices are per PHYSICAL core-hour. On hyperthreaded x86 vCPU pricing multiply by up to 2, on top of the unmeasured hardware
 *    factor κ_hw (ARM instances with 1 vCPU = 1 core avoid this). Worst case S2 ≈ $3.8M (κ_hw = 2.5, vCPU pricing).
 *  - “Index continuity” in chain logs holds by construction (chain.c sets n_first = n_last + 1); the real guarantee is FLINT’s
 *    Turing-anchored count_up_separated_zeros, which returns FAIL rather than mis-indexing. Gluing lemma and assemble_check.py sound.
 *    Shared chunk endpoints are Gram points with certified nonzero Z.
 *  - Escalation risk is not priced: 0 escalations in ≈ 286 attempts bounds the per-chunk rate only below ≈ 1% (95%); S2 has ≈ 3e9
 *    chunks, so a 1e-5 rate means ≈ 3e4 manual high-precision certificates. Budget and procedure needed before purchase.
 *  - The 3.2% FAIL rate is a tuning effect (BACK_MARGIN = 780 puts the first requested zero ≈ 60 units above the usable edge T − 840).
 *  - PLAN §2.2 “90–105 units/core-s” vs priced 88 and “≈ 3070 chunks / 5e6 units” vs 3110 at 1608 units/chunk: minor inconsistencies.
 *  - Height scaling confirmed: grid cost linear in B (14.7 / 30.6 / 61.9 cpu-s at B = 4096 / 8192 / 16384); rates measured directly at
 *    3e12 (88.9) and 7.8e12 (86.9).
 *
 * PROVED: gluing lemma (elementary). CERTIFIED (assuming FLINT 3.6.0’s Platt error lemmas and Turing bound): all zeros in ≈ 5e5 height
 *  units of pilot windows simple and on the line; N(3000175332800) = 12,363,153,437,138 (matches PT’s published count); 9/9 intervals
 *  re-checked with acb_dirichlet_hardy_z (separate code path); referee: 6 intervals around the hand-off at 200 bit. MEASURED: rate, stall
 *  rate, RAM, restart. HEURISTIC: campaign costs, storage, κ_hw.
 * Verdict: the RH-verification route is technically ready on open-source code and priced; it supplies only the RH-to-T* input.
 *  No refereed bound is changed. RH open. NO QED.
 * Files: formalization/rh-verification-campaign/{PLAN.md, pilot/chain.c, pilot.c, pilot2.c, run_job.sh, retry.sh, assemble_check.py,
 *  handoff_check.py}; tmp/b145-D-pilot/runs/ (logs, incl. long/), tmp/b145-D-pilot/platt_local_hardy_z_zeros.c.
 * Import-free. ASSERTIONS recompute the sustained rate, zeros/s from the zero density, the smooth count at the hand-off, zero counts and
 * core-hours per target height, dollar ranges, the escalation bound, chunk and storage counts, and the PT-vs-FLINT rate ratio.
 */

const T_PT = 3.0001753e12;
const T_HANDOFF = 3000175332800;
const Nsmooth = (T) => (T / (2 * Math.PI)) * Math.log(T / (2 * Math.PI * Math.E)) + 7 / 8;
const coreHours = (T, rate) => (T - T_PT) / rate / 3600;

export const B145_VERIFICATION_PILOT = Object.freeze({
  id: 'b145-verification-pilot-2026-10-01',
  date: '2026-10-01',
  title: 'RH-height extension pilot: FLINT Platt isolation at 88 height units per core-second; campaign specified, not run',
  status: 'MEASURED + PLAN (no bound). One internal referee pass (minor, not refuted). Nothing spent; nothing run beyond the local pilot. NO QED.',

  measured: Object.freeze({
    sustained: { units: 445324.6, cpuSeconds: 5059.78, okChunks: 277, failChunks: 9, escalations: 0, workers: 4, minutes: 21 },
    spotRates: Object.freeze([[1e10, 90.6], [1e11, 93.1], [3e12, 88.9], [7.8e12, 86.9]]),
    perChunk: { cpuSeconds: 18.27, usableUnits: 1608 },
    gridCostByB: Object.freeze([[4096, 14.7], [8192, 30.6], [16384, 61.9]]),
    rssGB: 0.30,
    ptRate: 111,
    machine: 'Apple M5 Max, shared (load average 8–13), single-thread workers, prec 128',
  }),

  handoff: Object.freeze({ T: T_HANDOFF, N: 12363153437138, smooth: 12363153437137.099,
    lastBelow: [3000175332799.860, 3000175332799.977], firstAbove: [3000175332800.210, 3000175332800.384], nextIndex: 12363153437139 }),

  // Targets keyed to the b145 stack (T* = (x_w + 1)/2). S1/S2 are PLAN.md stages; S0 and S1.5 added by this synthesis.
  targets: Object.freeze([
    { stage: 'S0', T: 5100000011773.62, buys: 'Λ ≤ 0.144867568901016 (1.7X band, Lemma B + local window + MTY)', reportedCH: 6.63e6 },
    { stage: 'S1', T: 6.0000000063e12, buys: 'Λ ≤ 0.144254643222956 (2X band: max(U1 = 0.144073, U2 = 0.144255))', reportedCH: 9.47e6 },
    { stage: 'S1.5', T: 6900000002614.725, buys: 'Λ ≤ 0.144853511841549 (2.3X, no band, no window)', reportedCH: 1.231e7 },
    { stage: 'S2', T: 7.80000000474e12, buys: 'Λ ≤ 0.144254643222956 (2.6X certified stack, no band)', reportedCH: 1.515e7 },
  ]),
  pricePerCoreHour: [0.02, 0.05],
  multipliers: Object.freeze({ kappaHwMax: 2.5, vcpuHyperthread: 2, plattPortRealistic: [2, 3] }),

  campaign: Object.freeze({
    jobUnits: 5e6, s1Jobs: 600000, s2Jobs: 960000, bytesPerChunk: 330,
    acceptance: 'index continuity across jobs (gluing lemma), Turing anchors at both ends, hand-off index 12,363,153,437,139, last job certifies a zero above T* and reports N(T*) exactly',
    beforeSpending: Object.freeze([
      'audit FLINT 3.6.0 Platt error lemmas (3.2, A5, A7, A9, A11, B1, B2), interpolation bound and turing_method_bound against Platt 2017 / Trudgian 2011',
      '1-hour chain benchmark on the target instance type (κ_hw; physical vs vCPU)',
      'escalation procedure and budget for manual high-precision certificates',
      'optional: benchmark Platt’s own code if obtainable (expected ≤ 2–3× gain)',
    ]),
  }),

  verdict:
    'MEASURED + PLAN. FLINT 3.6.0 isolates zeros at 88 height units (384 zeros) per core-second at heights 3e12–7.8e12 and reproduces '
    + 'PT’s N(3000175332800) = 12,363,153,437,138 independently. Cheapest RH height that the b145 stack needs for Λ < 0.145 is T* = 5.10e12: '
    + '≈ 6.6e6 physical core-hours (≈ $0.13M–0.33M at $0.02–0.05, before κ_hw and vCPU factors). The campaign supplies only RH to T*; the '
    + 'Λ value would remain conditional on the analytic chain. No refereed bound is changed. RH open. NO QED.',
});

const D = B145_VERIFICATION_PILOT;

export const B145_VERIFICATION_PILOT_ASSERTIONS = Object.freeze([
  {
    id: 'b145-pilot-rate',
    holds: () => {
      const s = D.measured.sustained, r = s.units / s.cpuSeconds;
      const zerosPerUnit = Math.log(5e12 / (2 * Math.PI)) / (2 * Math.PI);
      const perChunk = D.measured.perChunk.usableUnits / D.measured.perChunk.cpuSeconds;
      return Math.abs(r - 88.0) < 0.05 && Math.abs(r * zerosPerUnit - 384) < 3 && Math.abs(perChunk - r) < 1
        && Math.abs(s.failChunks / s.okChunks - 0.032) < 0.002 && D.measured.spotRates.every(([, x]) => x > 85 && x < 95);
    },
    why: 'Sustained 445,324.6 units / 5059.78 cpu-s = 88.01 units/core-s; × zero density ln(T/2π)/2π ≈ 4.36 at 5e12 → 384 zeros/core-s; 1608/18.27 = 88.0; FAIL rate 9/277 = 3.2%.',
  },
  {
    id: 'b145-pilot-handoff',
    holds: () => {
      const h = D.handoff, n0 = Nsmooth(h.T);
      return Math.abs(n0 - h.smooth) < 0.05 && h.N - n0 > 0.5 && h.N - n0 < 1.5 && h.N % 2 === 0
        && h.lastBelow[1] < h.T && h.firstAbove[0] > h.T && h.nextIndex === h.N + 1;
    },
    why: 'Smooth N(T) at T = 3000175332800 is 12,363,153,437,137.10; the certified count ...138 differs by S(T) + O(1/T) ≈ 0.9 (|S| < 1 typical); N even matches sign Z < 0 at both points around the cut; no isolating interval straddles T.',
  },
  {
    id: 'b145-pilot-target-costs',
    holds: () => D.targets.every((t) => Math.abs(coreHours(t.T, 88.0) / t.reportedCH - 1) < 0.01)
      && D.targets.every((t, i, a) => i === 0 || t.T > a[i - 1].T)
      && Math.abs(Nsmooth(6e12) - Nsmooth(T_HANDOFF) - 1.3024e13) < 0.001e13 && Math.abs(Nsmooth(7.80000000474e12) - Nsmooth(T_HANDOFF) - 2.0965e13) < 0.001e13,
    why: 'Core-hours = (T* − T_PT)/88/3600: 6.63e6 (5.10e12), 9.47e6 (6.0e12), 1.23e7 (6.90e12), 1.52e7 (7.8e12); zeros to verify 1.302e13 / 2.097e13.',
  },
  {
    id: 'b145-pilot-dollars',
    holds: () => {
      const [lo, hi] = D.pricePerCoreHour, ch = coreHours(D.targets[0].T, 88), ch2 = coreHours(D.targets[3].T, 88);
      const m = D.multipliers;
      return Math.abs(ch * lo / 1e6 - 0.133) < 0.002 && Math.abs(ch * hi / 1e6 - 0.331) < 0.003
        && Math.abs(ch2 * lo / 1e6 - 0.30) < 0.01 && Math.abs(ch2 * hi / 1e6 - 0.76) < 0.01
        && Math.abs(ch2 * hi * m.kappaHwMax * m.vcpuHyperthread / 1e6 - 3.8) < 0.05;
    },
    why: 'S0: $0.13M–0.33M; S2: $0.30M–0.76M; worst S2 with κ_hw = 2.5 and vCPU ×2: ≈ $3.8M.',
  },
  {
    id: 'b145-pilot-platt-ratio-and-escalation',
    holds: () => {
      const ratio = D.measured.ptRate / 88.0, ptRate = 3e12 / (7.5e6 * 3600);
      const attempts = D.measured.sustained.okChunks + D.measured.sustained.failChunks;
      const chunks = (7.80000000474e12 - T_PT) / D.measured.perChunk.usableUnits;
      return Math.abs(ptRate - 111.1) < 0.1 && ratio > 1.2 && ratio < 1.3 && 3 / attempts < 0.011 && 3 / attempts > 0.0104
        && Math.abs(chunks / 2.985e9 - 1) < 0.01 && Math.abs((chunks * 1e-5) / 3e4 - 1) < 0.01
        && Math.abs((chunks * D.campaign.bytesPerChunk) / 1e12 - 0.985) < 0.01;
    },
    why: 'PT rate 3e12/(7.5e6·3600) = 111.1 units/core-s, 1.26× FLINT; rule of three: 0 escalations in 286 bounds the rate below 1.05%; S2 ≈ 2.98e9 chunks → 3e4 manual certificates at 1e-5, ≈ 1 TB logs.',
  },
  {
    id: 'b145-pilot-honest-scope',
    holds: () => /refereed bound is changed/i.test(D.verdict) && /NO QED/.test(D.verdict) && /NO QED/.test(D.status)
      && /Nothing spent/.test(D.status) && D.campaign.beforeSpending.length >= 3,
    why: 'Measurement and plan only; the campaign supplies RH to T*, not a Λ bound; nothing purchased.',
  },
]);

export default B145_VERIFICATION_PILOT;
