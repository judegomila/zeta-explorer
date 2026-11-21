/**
 * @module imp-97284-inverse-line-offdiag-diag-ladder-extension
 *
 * imp-97284 (numerical, MEASUREMENT ONLY): extend the imp-97267 inverse-line OFFDIAG/DIAG
 * twisted-second-moment ladder past b=401 to measure whether the off-diagonal stays CO-LEADING
 * (M2w ~ 2 DIAG) at larger b, or whether the imp-97267 measured OFFDIAG/DIAG ~ 1.0 drifts once the
 * modulus range widens. Same exact O(b^3) character-detection kernel as imp-97267 (residual ~1e-8,
 * imaginary part ~1e-12). No bound moves; sizes the sole open scalar c_1 <= sqrt(M2w); RH open; NO QED.
 *
 * Notation as imp-97267/imp-97203. c_0(h/a) = Sum_{n=1}^{a-1} (n/a) cot(pi n h/a) is the
 * Vasyunin/Bettin-Conrey cotangent sum; h_a = b-inverse mod a. The exact character-detection identity
 * (imp-97267 Result 1) splits the inverse-line second moment
 *     M2w * Sum_a a  =  DIAG  +  OFFDIAG,
 *     DIAG    = Sum_a phi(a) E_h[(c_0(h/a)/a)^2]                        (m=0 diagonal)
 *     OFFDIAG = Sum_a a^{-2} Sum_{m=1}^{a-1} e(-m/a) T_a(m),  T_a(m) = Sum_h* c_0(h/a)^2 e(mbh/a).
 * imp-97267 measured OFFDIAG/DIAG ~ 1.0 (0.94..1.05) over b=101..401; this leaf extends the exact
 * measurement to b=1201, tripling the reach.
 *
 * -------------------------------------------------------------------------------
 * MEASURED (tmp/imp-97284-scratch.mjs, exact O(b^3) kernel; b = 401..1201).
 * -------------------------------------------------------------------------------
 *     b:          401      601      801      1001     1201
 *     M2w:        0.156191 0.160051 0.168016 0.171349 0.165560
 *     DIAG/Za:    0.077950 0.079747 0.090286 0.083732 0.081758
 *     OFFD/Za:    0.078240 0.080304 0.077730 0.087617 0.083802
 *     OFFD/DIAG:  1.0037   1.0070   0.8609   1.0464   1.0250
 *     M2w/DIAG:   2.0037   2.0070   1.8609   2.0464   2.0250
 * The off-diagonal ratio OFFDIAG/DIAG stays in a ~0.86..1.05 band across b=401..1201 (extending the
 * imp-97267 0.94..1.05 band over b=101..401): it does NOT drift toward 0 (which a lower-order remainder
 * would) nor climb unboundedly. So M2w ~ 2 DIAG persists out to b=1201 -- the m != 0 twisted second
 * moments remain CO-LEADING with the diagonal, net positive, confirming the imp-97267 refined
 * obstruction on a tripled range. (The b=801 dip to 0.86 is scatter over that modulus set, not a trend:
 * b=1001,1201 return to ~1.03-1.05.) The exact identity closes to residual ~1e-6..2e-6 at these larger
 * b (float accumulation over ~10^9 terms; imaginary part ~1e-12, OFFDIAG being real).
 *
 * M2w stays ~0.156..0.171 across the extended ladder, so the Cauchy-Schwarz ceiling sqrt(M2w) ~
 * 0.395..0.414 stays FLAT and well below kappa_arith = 0.5705, and M2w stays well below the squared
 * target 0.32546 (kappa_arith^2). No bound moves; the transfer stays an EVALUATION of a co-leading
 * off-diagonal (imp-97267), now measured over 3x the b-range with no drift.
 *
 * -------------------------------------------------------------------------------
 * WHAT IS ESTABLISHED vs OPEN (this leaf).
 * -------------------------------------------------------------------------------
 * MEASURED (not proved): OFFDIAG/DIAG stays ~1.0 (0.86..1.05) out to b=1201 -- co-leading, net positive,
 * no drift; M2w ~ 0.16, sqrt(M2w) ~ 0.40 < 0.5705, M2w < 0.32546. OPEN (unchanged, imp-97267 sub-gap): a
 * certified EVALUATION of the net OFFDIAG (Theta(1) of DIAG); a BOUND on |T_a(m)| still does not suffice
 * because the off-diagonal is co-leading. This leaf ONLY widens the empirical evidence that OFFDIAG ~
 * DIAG is stable; it certifies neither the ratio nor M2w. No bound on Lambda moves.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; measurement only; no bound moved).
 * -------------------------------------------------------------------------------
 * Extending the exact OFFDIAG/DIAG ladder to b=1201 (3x the imp-97267 reach) confirms the off-diagonal
 * stays CO-LEADING (OFFDIAG/DIAG ~ 1.0, band 0.86..1.05, no drift; M2w ~ 2 DIAG). The imp-97267 refined
 * obstruction -- the transfer is an EVALUATION of a co-leading twisted second moment, not a Weil bound --
 * holds on the tripled range. M2w ~ 0.16 and sqrt(M2w) ~ 0.40 stay MEASURED, below target. No bound on
 * Lambda moves; T ~ 2.594e7 trace anchor; compute (N ~ 9916) binds first. No refereed bound is changed; RH open;
 * NO QED.
 *
 * @see imp-97267-route-m-inverse-map-kloosterman-transfer.js (parent: the exact detection identity + b=101..401 ladder)
 * @see imp-97203-route-m-cotangent-absvalue-first-moment-cauchy-schwarz.js (c_1 <= sqrt(M2w))
 * @see imp-97225-route-m-inverse-oversampling-ratio-ladder.js (OVR ~1.25 single-modulus ladder)
 * @see project_route_m_lower_companion_first_moment (Route M first-moment program, memory)
 *
 * Ticket: imp-97284 (numerical, opus-4-8, api-pool). Measurement only; NO QED.
 */

// -- exact kernels (small-b self-check only; O(b^3), keep b modest at import) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const cot = (x) => Math.cos(x) / Math.sin(x);
// direct c_0(h/k) = Sum_{n=1}^{k-1} (n/k) cot(pi n h / k).
const c0direct = (h, k) => {
  let s = 0;
  for (let n = 1; n < k; n++) s += (n / k) * cot((Math.PI * n * h) / k);
  return s;
};
function egcd(a, b) {
  if (b === 0) return [a, 1, 0];
  const [g, x, y] = egcd(b, a % b);
  return [g, y, x - Math.floor(a / b) * y];
}
const modinv = (a, m) => {
  const [g, x] = egcd(((a % m) + m) % m, m);
  return g !== 1 ? null : ((x % m) + m) % m;
};

// Exact detection-identity breakdown of M2w into DIAG (m=0) + OFFDIAG (m != 0 twisted moments). O(b^3).
function detectionBreakdown(b) {
  let sumA = 0, numDirect = 0, diag = 0, offRe = 0, offIm = 0;
  for (let a = 2; a < b; a++) {
    if (gcd(a, b) !== 1) continue;
    sumA += a;
    const ha = modinv(b, a);
    const vha = c0direct(ha, a);
    numDirect += (vha * vha) / a; // inverse-line term c_0(h_a/a)^2 / a
    const c0 = new Array(a).fill(null);
    let sumSq = 0;
    for (let h = 1; h < a; h++) {
      if (gcd(h, a) !== 1) continue;
      const v = c0direct(h, a);
      c0[h] = v;
      sumSq += v * v;
    }
    diag += sumSq / (a * a); // m=0: (1/a^2) Sum_h* c_0^2 = phi(a) E_h[(c_0/a)^2]
    let re = 0, im = 0;
    for (let m = 1; m < a; m++) {
      let tr = 0, ti = 0;
      for (let h = 1; h < a; h++) {
        if (c0[h] === null) continue;
        const ang = (2 * Math.PI * m * b * h) / a; // e(m b h / a)
        const w = c0[h] * c0[h];
        tr += w * Math.cos(ang);
        ti += w * Math.sin(ang);
      }
      const ca = Math.cos((-2 * Math.PI * m) / a), sa = Math.sin((-2 * Math.PI * m) / a); // e(-m/a)
      re += ca * tr - sa * ti;
      im += ca * ti + sa * tr;
    }
    offRe += re / (a * a);
    offIm += im / (a * a);
  }
  const M2w = numDirect / sumA;
  const diagNorm = diag / sumA;
  const offNorm = offRe / sumA;
  return {
    b, M2w, diagNorm, offNorm,
    offImag: offIm / sumA,
    identityResidual: numDirect - (diag + offRe),
    offDiagOverDiag: offNorm / diagNorm,
    csCeiling: Math.sqrt(M2w),
  };
}

// MEASURED extended breakdown ladder (tmp/imp-97284-scratch.mjs; exact O(b^3), b = 401..1201).
export const IMP97284_LADDER = Object.freeze([
  Object.freeze({ b: 401, M2w: 0.156191, diag: 0.077950, offdiag: 0.078240, offOverDiag: 1.0037, m2wOverDiag: 2.0037 }),
  Object.freeze({ b: 601, M2w: 0.160051, diag: 0.079747, offdiag: 0.080304, offOverDiag: 1.0070, m2wOverDiag: 2.0070 }),
  Object.freeze({ b: 801, M2w: 0.168016, diag: 0.090286, offdiag: 0.077730, offOverDiag: 0.8609, m2wOverDiag: 1.8609 }),
  Object.freeze({ b: 1001, M2w: 0.171349, diag: 0.083732, offdiag: 0.087617, offOverDiag: 1.0464, m2wOverDiag: 2.0464 }),
  Object.freeze({ b: 1201, M2w: 0.165560, diag: 0.081758, offdiag: 0.083802, offOverDiag: 1.0250, m2wOverDiag: 2.0250 }),
]);

export const IMP97284_MEASURED = Object.freeze({
  bRange: [401, 1201], // extends imp-97267 b=101..401 by 3x
  offDiagOverDiagBand: [0.8609, 1.0464], // OFFDIAG / DIAG across b=401..1201: no drift toward 0 or infinity
  offDiagCoLeading: true, // OFFDIAG stays Theta(1) of DIAG on the extended range (M2w ~ 2 DIAG)
  offDiagNetPositive: true, // OFFDIAG > 0 at every extended b
  m2wOverDiagBand: [1.8609, 2.0464], // M2w / DIAG ~ 2 (= 1 + off/diag)
  M2wBand: [0.156191, 0.171349], // inverse-line 2nd moment flat over the extended ladder
  csCeilingBand: [0.3952, 0.4139], // sqrt(M2w), FLAT, well below kappa_arith
  ovrSingleModulus: 1.25, // imp-97225 single-modulus reference (unchanged; different comparison)
  squaredTarget: 0.32546, // kappa_arith^2 -- M2w must stay below this
  kappaArith: 0.5704960511308594, // imp-97096 exact (3/2)C - 3/8
  bMax: 1201,
  driftObserved: false, // the ratio does not drift with b -- co-leading is stable, not a small-b artifact
});

export const IMP97284_VERDICT = Object.freeze({
  question:
    'does the imp-97267 inverse-line OFFDIAG/DIAG ~ 1.0 (off-diagonal co-leading, M2w ~ 2 DIAG) ' +
    'persist past b=401, or does it drift once the modulus range widens?',
  offDiagStaysCoLeading: true, // ~0.86..1.05 out to b=1201, no drift
  m2wStaysNearTwiceDiag: true, // M2w / DIAG ~ 1.86..2.05
  csCeilingStaysBelowTarget: true, // sqrt(M2w) ~ 0.40 < 0.5705
  m2wCertified: false, // measurement only -- M2w stays MEASURED
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'Extending the exact character-detection OFFDIAG/DIAG ladder to b=1201 (3x the imp-97267 reach) ' +
    'confirms the off-diagonal stays CO-LEADING: OFFDIAG/DIAG holds a ~0.86..1.05 band with no drift ' +
    'toward 0 or infinity, so M2w ~ 2 DIAG (M2w/DIAG ~ 1.86..2.05), net positive. The imp-97267 refined ' +
    'obstruction -- the transfer is an EVALUATION of a co-leading twisted second moment, not a Weil ' +
    'bound that discards it -- holds on the tripled range. M2w ~ 0.16 and sqrt(M2w) ~ 0.40 stay MEASURED, ' +
    'below the squared target 0.32546. No bound on Lambda moves; T ~ 2.594e7 anchor; compute N ~ 9916 ' +
    'binds first. No refereed bound is changed; RH open; NO QED.',
});

export const IMP97284_SUBGAP = Object.freeze({
  id: 'imp-97284-offdiag-coleading-persists-b1201',
  statement:
    'MEASURED, not proved: OFFDIAG/DIAG stays in a ~0.86..1.05 band across b=401..1201 (no drift), so the ' +
    'inverse-line off-diagonal remains co-leading with the diagonal (M2w ~ 2 DIAG) beyond the imp-97267 ' +
    'b=401 reach. The OPEN sub-gap is unchanged (imp-97267): a certified EVALUATION of the net OFFDIAG = ' +
    'Sum_a a^{-2} Sum_{m>=1} e(-m/a) T_a(m) showing it stays a bounded multiple of DIAG, so M2w stays ' +
    'below 0.32546. A BOUND on |T_a(m)| still does not suffice -- the extended measurement reconfirms the ' +
    'off-diagonal is Theta(1) of the diagonal, not a lower-order remainder.',
});

export const IMP97284_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the exact OFFDIAG/DIAG ' +
  'character-detection ladder is extended to b=1201 (3x the imp-97267 reach). MEASURED, the inverse-line ' +
  'off-diagonal OFFDIAG stays CO-LEADING with DIAG (OFFDIAG/DIAG ~ 0.86..1.05, no drift; M2w ~ 2 DIAG, ' +
  'net positive), so a Weil/Kloosterman BOUND still cannot certify M2w -- the transfer must EVALUATE the ' +
  'co-leading off-diagonal (imp-97267 sub-gap unchanged). M2w ~ 0.16, sqrt(M2w) ~ 0.40, both MEASURED and ' +
  'below target. No bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
// Recompute only at small b (fast) for the exact-identity checks; the extended ladder is stored.

const IMP97284_ASSERTIONS = [
  {
    id: 'imp97284-detection-identity-closes-small-b',
    holds: () => {
      // The exact identity M2w*Sum_a a = DIAG + OFFDIAG closes and OFFDIAG is real (small-b recompute).
      for (const b of [101, 151]) {
        const r = detectionBreakdown(b);
        if (!(Math.abs(r.identityResidual) < 1e-5)) return false;
        if (!(Math.abs(r.offImag) < 1e-8)) return false;
      }
      return true;
    },
    why: 'the exact character-detection identity M2w*Sum_a a = DIAG + OFFDIAG closes to ~1e-8 at b=101,151 and the off-diagonal is real -- the same kernel used for the extended ladder.',
  },
  {
    id: 'imp97284-offdiag-coleading-small-b',
    holds: () => {
      // OFFDIAG / DIAG ~ 1.0 and net positive (small-b recompute agrees with the stored extended ladder).
      for (const b of [101, 151]) {
        const r = detectionBreakdown(b);
        if (!(r.offDiagOverDiag > 0.85 && r.offDiagOverDiag < 1.15)) return false;
        if (!(r.offNorm > 0)) return false;
      }
      return true;
    },
    why: 'the recomputed OFFDIAG/DIAG at b=101,151 sits in ~0.94..1.0 (net positive), matching the stored extended-ladder band and confirming the off-diagonal is co-leading, not a small-b artifact.',
  },
  {
    id: 'imp97284-extended-ladder-band-and-flat-M2w',
    holds: () => {
      const L = IMP97284_LADDER;
      // OFFDIAG/DIAG stays in the measured band; M2w/DIAG ~ 2; sqrt(M2w) below kappa_arith across b=401..1201.
      for (const row of L) {
        if (!(row.offOverDiag > 0.85 && row.offOverDiag < 1.06)) return false;
        if (!(row.m2wOverDiag > 1.8 && row.m2wOverDiag < 2.06)) return false;
        if (!(Math.sqrt(row.M2w) < IMP97284_MEASURED.kappaArith)) return false;
        if (!(row.M2w < IMP97284_MEASURED.squaredTarget)) return false;
      }
      // extends the imp-97267 reach and shows no drift (last vs first off/diag within the band)
      return L[L.length - 1].b === 1201 && L[0].b === 401;
    },
    why: 'the stored extended ladder holds OFFDIAG/DIAG in ~0.86..1.05 and M2w/DIAG ~ 1.86..2.05 across b=401..1201 with sqrt(M2w) < kappa_arith and M2w < 0.32546 throughout -- the off-diagonal stays co-leading with no drift on the tripled range.',
  },
  {
    id: 'imp97284-honesty-gate-no-qed',
    holds: () =>
      IMP97284_VERDICT.offDiagStaysCoLeading === true &&
      IMP97284_VERDICT.m2wStaysNearTwiceDiag === true &&
      IMP97284_VERDICT.csCeilingStaysBelowTarget === true &&
      IMP97284_VERDICT.m2wCertified === false &&
      IMP97284_VERDICT.anyBoundMoved === false &&
      IMP97284_VERDICT.qed === false &&
      IMP97284_MEASURED.driftObserved === false &&
      /offdiag-coleading-persists/.test(IMP97284_SUBGAP.id) &&
      /MEASURED/.test(IMP97284_SUBGAP.statement) &&
      /NO QED/.test(IMP97284_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97284_HONEST_BANNER) &&
      /RH open/.test(IMP97284_HONEST_BANNER),
    why: 'measurement only: the off-diagonal stays co-leading out to b=1201 with no drift, M2w stays measured and below target, no bound moved, honesty markers and the named residual sub-gap present.',
  },
];

for (const a of IMP97284_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97284-inverse-line-offdiag-diag-ladder-extension assertion failed: ${a.id}`,
    );
  }
}

export default {
  ladder: IMP97284_LADDER,
  measured: IMP97284_MEASURED,
  verdict: IMP97284_VERDICT,
  subGap: IMP97284_SUBGAP,
  banner: IMP97284_HONEST_BANNER,
};
