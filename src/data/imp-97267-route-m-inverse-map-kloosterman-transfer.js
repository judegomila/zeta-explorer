/**
 * @module imp-97267-route-m-inverse-map-kloosterman-transfer
 *
 * imp-97267 (proof, ATTEMPT + PARTIAL): attempt the inverse-map (Kloosterman-type) equidistribution
 * transfer of the FULL-residue Bettin-Conrey second moment to the INVERSE line a |-> h_a = b-inverse
 * mod a -- the sole open input for the imp-97203 Cauchy-Schwarz ceiling c_1 <= sqrt(M2w) and, per the
 * imp-97210 obligation ledger, the one open scalar the positivity of the whole first-moment kappa rests
 * on. The attempt does NOT certify M2w; instead it writes the transfer as an EXACT character-detection
 * identity (the Kloosterman-type object the ledger asked for) and measures its two pieces, sharpening the
 * obstruction from "absorb a bounded ~1.25 oversampling" to "EVALUATE a Theta(1) off-diagonal twisted
 * second moment". No bound moves; OVR ~1.25 stays measured; no refereed bound is changed; RH open; NO QED.
 *
 * Notation as imp-97203/imp-97225/imp-97210. c_0(h/a) = Sum_{n=1}^{a-1} (n/a) cot(pi n h/a) is the
 * Vasyunin/Bettin-Conrey cotangent sum; h_a = b-inverse mod a (so b h_a == 1 mod a). The transfer input:
 *     M2w = ( Sum_{a=2,(a,b)=1}^{b-1} c_0(h_a/a)^2 / a ) / ( Sum_a a ),
 * whose sqrt is the exact Cauchy-Schwarz ceiling on c_1 = Sum_a |c_0(h_a/a)| / Sum_a a (imp-97203).
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 (RIGOROUS, exact unconditional identity): the transfer IS a character-detection sum.
 * -------------------------------------------------------------------------------
 * Detect the single inverse residue h_a via additive characters mod a. Since h == b-inverse mod a is
 * equivalent to b h == 1 mod a, the indicator is 1[h == h_a] = (1/a) Sum_{m mod a} e(m(bh-1)/a), so for
 * ANY weight w(h) on the residues,
 *     w(h_a) = (1/a) Sum_{m=0}^{a-1} e(-m/a) Sum_{h mod a}* w(h) e(mbh/a).
 * Applying this to w = c_0(.,a)^2 and folding the 1/a inverse-line weight gives the EXACT decomposition
 *     M2w * Sum_a a  =  DIAG  +  OFFDIAG,
 *     DIAG    = Sum_a phi(a) E_h[(c_0(h/a)/a)^2]                          (m=0 diagonal term)
 *     OFFDIAG = Sum_a a^{-2} Sum_{m=1}^{a-1} e(-m/a) T_a(m),  T_a(m) = Sum_{h mod a}* c_0(h/a)^2 e(mbh/a).
 * DIAG is exactly the phi-weighted aggregate of the TRACTABLE full-residue second moments E_h[(c_0/a)^2]
 * that Bettin-Conrey even-moment machinery bounds (no absolute value); OFFDIAG is the inverse-map defect.
 * The e(mbh/a) frequency carries the fixed b against the moving modulus a, so OFFDIAG is precisely a sum
 * of Kloosterman/Estermann-type twisted second moments -- the "Kloosterman-type transfer" named in the
 * imp-97210 ledger, written out exactly. This identity is unconditional and finite (verified numerically
 * to residual ~1e-8, cot precision; the imaginary part cancels to ~1e-13 as it must, OFFDIAG being real).
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 (MEASURED): the off-diagonal is NOT negligible -- it carries HALF the inverse-line moment.
 * -------------------------------------------------------------------------------
 * MEASURED (tmp/imp-97267-scratch.mjs, exact O(b^3) kernels, b = 101..401):
 *     b:        101      151      211      301      401
 *     M2w:      0.12881  0.14087  0.14287  0.15938  0.15619
 *     DIAG/Za:  0.06625  0.07083  0.07378  0.07770  0.07795
 *     OFFD/Za:  0.06256  0.07003  0.06909  0.08169  0.07824
 *     OFFD/DIAG:0.944    0.989    0.936    1.051    1.004
 * The off-diagonal ratio OFFDIAG/DIAG stays ~1.0 (0.94..1.05), i.e. OFFDIAG ~ DIAG and OFFDIAG carries
 * ~HALF of M2w at every measured b. It is net POSITIVE and stable (M2w ~ 2 DIAG). So the m != 0 twisted
 * second moments do NOT cancel to a lower-order remainder: they contribute at the SAME order as the
 * diagonal. (This is a per-modulus DIAG reference -- the phi-weighted full-residue aggregate from the
 * exact identity -- and is a DIFFERENT comparison from the imp-97225 single-modulus OVR ~1.25, which
 * measures M2w against E_h[(c_0/a)^2] at the single modulus a=b; OVR ~1.25 stays measured, unchanged.)
 *
 * -------------------------------------------------------------------------------
 * REFINED OBSTRUCTION: the transfer is an EVALUATION problem, not a BOUNDING problem.
 * -------------------------------------------------------------------------------
 * Because OFFDIAG is Theta(1) relative to DIAG, a Weil/Kloosterman-BOUND route -- estimating |T_a(m)| by
 * the Weil bound to show the off-diagonal is a negligible error on top of the diagonal main term -- CANNOT
 * certify M2w: it would throw away half the mass. The transfer therefore requires EVALUATING the net
 * off-diagonal (establishing OFFDIAG ~ DIAG, i.e. its sign AND size), not bounding it away. Concretely the
 * open input is: show Sum_a a^{-2} Sum_{m=1}^{a-1} e(-m/a) T_a(m) stays comparable to (and no more than a
 * bounded multiple of) DIAG, so that M2w ~ 2 DIAG stays below the squared target 0.32546. DIAG itself is
 * bounded (Bettin-Conrey even moments over full residues, imp-97203 Result 3); the residual is entirely
 * the net off-diagonal twisted-moment EVALUATION. This is strictly sharper than the imp-97203/imp-97225
 * framing ("absorb a bounded ~1.25 oversampling"): the oversampling is not a small correction but a
 * co-leading twisted-moment term, and it is the object any completion of the transfer must compute.
 *
 * -------------------------------------------------------------------------------
 * WHAT IS ESTABLISHED vs OPEN (this leaf).
 * -------------------------------------------------------------------------------
 * ESTABLISHED (rigorous): the exact character-detection identity M2w*Sum_a a = DIAG + OFFDIAG, with DIAG
 * the phi-weighted full-residue second-moment aggregate (m=0) and OFFDIAG the real m != 0 twisted-moment
 * sum -- the Kloosterman-type transfer written out unconditionally (residual ~1e-8, imaginary part ~0).
 * MEASURED (not proved): OFFDIAG/DIAG ~ 1.0 (off-diagonal ~ half of M2w, net positive, stable to b=401);
 * M2w ~ 0.16 and sqrt(M2w) ~ 0.40 < 0.5705. OPEN: a certified evaluation of the net OFFDIAG (Theta(1) of
 * DIAG) -- a BOUND on |T_a(m)| does not suffice; the transfer must compute the net off-diagonal so
 * M2w ~ 2 DIAG < 0.32546. No bound moved; OVR ~1.25 stays measured.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The inverse-map equidistribution transfer is NOT completed. The attempt (i) writes it as an EXACT
 * character-detection (Kloosterman-type) identity M2w*Sum_a a = DIAG + OFFDIAG, (ii) measures OFFDIAG ~
 * DIAG (the off-diagonal carries ~half of M2w, net positive, stable), and (iii) sharpens the obstruction:
 * the transfer is an EVALUATION of a co-leading off-diagonal twisted second moment, NOT a Weil-bound that
 * discards it. M2w ~ 0.16 and OVR ~1.25 stay MEASURED. No bound on Lambda moves; T ~ 2.594e7 trace anchor;
 * compute (N ~ 9916) binds first. No refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97203-route-m-cotangent-absvalue-first-moment-cauchy-schwarz.js (parent: c_1 <= sqrt(M2w); the sub-gap)
 * @see imp-97225-route-m-inverse-oversampling-ratio-ladder.js (sibling: OVR ~1.25 single-modulus ladder)
 * @see imp-97210-route-m-kappa-obligation-ledger.js (ledger: M2w is the sole open scalar)
 * @see project_route_m_lower_companion_first_moment (Route M first-moment program, memory)
 *
 * Ticket: imp-97267 (proof, opus-4-8, api-pool). Attempt + partial; NO QED.
 */

// -- exact kernels (small-b self-check only; O(b^3), keep b modest) --
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
    identityResidual: numDirect - (diag + offRe), // exact identity: ~0 up to cot precision
    offDiagOverDiag: offNorm / diagNorm,
    csCeiling: Math.sqrt(M2w),
  };
}

// MEASURED breakdown ladder (tmp/imp-97267-scratch.mjs; b = 101..401).
export const IMP97267_LADDER = Object.freeze([
  Object.freeze({ b: 101, M2w: 0.128809, diag: 0.066251, offdiag: 0.062557, offOverDiag: 0.9442 }),
  Object.freeze({ b: 151, M2w: 0.140866, diag: 0.070833, offdiag: 0.070033, offOverDiag: 0.9887 }),
  Object.freeze({ b: 211, M2w: 0.142868, diag: 0.073782, offdiag: 0.069086, offOverDiag: 0.9364 }),
  Object.freeze({ b: 301, M2w: 0.159383, diag: 0.077698, offdiag: 0.081685, offOverDiag: 1.0513 }),
  Object.freeze({ b: 401, M2w: 0.156191, diag: 0.077950, offdiag: 0.078240, offOverDiag: 1.0037 }),
]);

export const IMP97267_MEASURED = Object.freeze({
  offDiagOverDiag: 1.0, // OFFDIAG / DIAG ~ 0.94..1.05: off-diagonal at the SAME order as the diagonal
  offDiagShareOfM2w: 0.49, // OFFDIAG / M2w ~ 0.485..0.51: the off-diagonal carries ~half of M2w
  offDiagNetPositive: true, // OFFDIAG > 0 at every measured b (M2w ~ 2 DIAG)
  identityRealResidual: 1e-8, // Sum over a of the exact identity closes to ~1e-8 (cot precision)
  identityImagResidual: 1e-13, // OFFDIAG imaginary part cancels to ~1e-13 (real, as required)
  M2wStable: 0.16, // inverse-line 2nd moment ~0.13 (101) -> 0.16 (401)
  csCeilingStable: 0.40, // sqrt(M2w) ~ 0.359 (101) -> 0.395 (401), FLAT, below target
  ovrSingleModulus: 1.25, // imp-97225 single-modulus reference OVR (unchanged; different comparison)
  squaredTarget: 0.32546, // kappa_arith^2 -- certify M2w below this
  kappaArith: 0.5704960511308594, // imp-97096 exact (3/2)C - 3/8
  bMax: 401,
});

export const IMP97267_VERDICT = Object.freeze({
  question:
    'complete the inverse-map (Kloosterman-type) equidistribution transfer of the full-residue ' +
    'Bettin-Conrey second moment to the inverse line, certifying M2w below the CS-margin ceiling?',
  detectionIdentityRigorous: true, // M2w*Sum_a a = DIAG + OFFDIAG is exact and unconditional
  offDiagonalNegligible: false, // OFFDIAG ~ DIAG (~half of M2w), NOT a lower-order remainder
  weilBoundRouteSuffices: false, // a bound on |T_a(m)| discards half the mass -- cannot certify M2w
  transferIsEvaluationNotBound: true, // must EVALUATE the net off-diagonal, not bound it away
  m2wCertified: false, // M2w stays MEASURED ~0.16
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'The inverse-map transfer is NOT completed. It is written as an EXACT character-detection ' +
    '(Kloosterman-type) identity M2w*Sum_a a = DIAG + OFFDIAG: DIAG = Sum_a phi(a) E_h[(c_0/a)^2] the ' +
    'phi-weighted full-residue second-moment aggregate (m=0, tractable via Bettin-Conrey even moments), ' +
    'OFFDIAG = Sum_a a^{-2} Sum_{m != 0} e(-m/a) T_a(m) the real twisted-moment defect (residual ~1e-8, ' +
    'imaginary part ~1e-13). MEASURED, OFFDIAG ~ DIAG (off-diagonal ~half of M2w, net positive, stable to ' +
    'b=401), so a Weil/Kloosterman BOUND on |T_a(m)| cannot certify M2w -- it discards a co-leading term. ' +
    'The transfer is an EVALUATION of the net off-diagonal, not a bound. M2w ~ 0.16 and OVR ~1.25 stay ' +
    'MEASURED. No bound on Lambda moves; T ~ 2.594e7 anchor; compute N ~ 9916 binds first. No refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97267_SUBGAP = Object.freeze({
  id: 'imp-97267-inverse-map-offdiagonal-twisted-moment-evaluation',
  statement:
    'EVALUATE (not bound) the net off-diagonal OFFDIAG = Sum_{a=2,(a,b)=1}^{b-1} a^{-2} Sum_{m=1}^{a-1} ' +
    'e(-m/a) T_a(m), T_a(m) = Sum_{h mod a}* c_0(h/a)^2 e(mbh/a), and show it stays comparable to (and no ' +
    'more than a bounded multiple of) the diagonal DIAG = Sum_a phi(a) E_h[(c_0(h/a)/a)^2], so that M2w = ' +
    '(DIAG + OFFDIAG)/Sum_a a stays below the squared target 0.32546 (whence c_1 <= sqrt(M2w) < ' +
    'kappa_arith = 0.5705). MEASURED OFFDIAG ~ DIAG (~half of M2w, net positive): a Weil bound on ' +
    '|T_a(m)| is insufficient because the off-diagonal is Theta(1) of the diagonal, so the sub-gap is a ' +
    'twisted-second-moment EVALUATION with the fixed b against the moving modulus a. OFFDIAG stays ' +
    'MEASURED.',
});

export const IMP97267_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Attempt + partial only: the inverse-map ' +
  '(Kloosterman-type) transfer is NOT completed. It is written as an EXACT character-detection identity ' +
  'M2w*Sum_a a = DIAG + OFFDIAG (diagonal = phi-weighted full-residue second moment, off-diagonal = real ' +
  'twisted-moment defect). MEASURED, the off-diagonal OFFDIAG ~ DIAG carries ~half of M2w (net positive, ' +
  'stable to b=401), so a Weil/Kloosterman BOUND on the twisted moments cannot certify M2w -- the ' +
  'transfer must EVALUATE the co-leading off-diagonal. M2w ~ 0.16 and OVR ~1.25 stay measured. No bound ' +
  'on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97267_ASSERTIONS = [
  {
    id: 'imp97267-detection-identity-closes',
    holds: () => {
      // M2w*Sum_a a = DIAG + OFFDIAG must close to ~0 (cot precision), and OFFDIAG must be real.
      for (const b of [101, 151]) {
        const r = detectionBreakdown(b);
        if (!(Math.abs(r.identityResidual) < 1e-5)) return false; // exact identity closes
        if (!(Math.abs(r.offImag) < 1e-8)) return false; // OFFDIAG imaginary part ~ 0
      }
      return true;
    },
    why: 'the exact character-detection identity M2w*Sum_a a = DIAG + OFFDIAG closes to ~1e-8 (cot precision) at b=101,151 and the off-diagonal is real (imaginary part ~1e-13) -- confirming the Kloosterman-type transfer is written unconditionally.',
  },
  {
    id: 'imp97267-offdiagonal-same-order-as-diagonal',
    holds: () => {
      // OFFDIAG / DIAG ~ 1.0: the off-diagonal is NOT a lower-order remainder.
      for (const b of [101, 151]) {
        const r = detectionBreakdown(b);
        if (!(r.offDiagOverDiag > 0.85 && r.offDiagOverDiag < 1.15)) return false;
        if (!(r.offNorm > 0)) return false; // net positive
      }
      return true;
    },
    why: 'the off-diagonal OFFDIAG is ~1.0x the diagonal DIAG (net positive) at b=101,151, i.e. it carries ~half of M2w and sits at the same order as the diagonal -- a Weil bound that discards it cannot certify M2w.',
  },
  {
    id: 'imp97267-cs-ceiling-below-target',
    holds: () => {
      // sqrt(M2w) stays below kappa_arith (no bound moved; consistent with imp-97203/97225).
      for (const b of [101, 151]) {
        const r = detectionBreakdown(b);
        if (!(r.csCeiling < IMP97267_MEASURED.kappaArith)) return false;
        if (!(r.csCeiling > 0.3 && r.csCeiling < 0.45)) return false;
      }
      return true;
    },
    why: 'the Cauchy-Schwarz ceiling sqrt(M2w) ~ 0.36..0.38 (b=101,151) stays strictly below kappa_arith = 0.5705, consistent with imp-97203/imp-97225 -- no bound moved.',
  },
  {
    id: 'imp97267-ladder-consistent',
    holds: () => {
      // Stored ladder: off/diag ~ 1.0 throughout and M2w monotone-ish increasing.
      const L = IMP97267_LADDER;
      for (const row of L) if (!(row.offOverDiag > 0.9 && row.offOverDiag < 1.1)) return false;
      return L[L.length - 1].M2w > L[0].M2w;
    },
    why: 'the stored breakdown ladder holds OFFDIAG/DIAG in a ~0.94..1.05 band across b=101..401 with M2w mildly increasing -- the off-diagonal stays co-leading, not vanishing.',
  },
  {
    id: 'imp97267-honesty-gate-no-qed',
    holds: () =>
      IMP97267_VERDICT.detectionIdentityRigorous === true &&
      IMP97267_VERDICT.offDiagonalNegligible === false &&
      IMP97267_VERDICT.weilBoundRouteSuffices === false &&
      IMP97267_VERDICT.transferIsEvaluationNotBound === true &&
      IMP97267_VERDICT.m2wCertified === false &&
      IMP97267_VERDICT.anyBoundMoved === false &&
      IMP97267_VERDICT.qed === false &&
      /offdiagonal-twisted-moment-evaluation/.test(IMP97267_SUBGAP.id) &&
      /EVALUATE/.test(IMP97267_SUBGAP.statement) &&
      /NO QED/.test(IMP97267_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97267_HONEST_BANNER) &&
      /RH open/.test(IMP97267_HONEST_BANNER),
    why: 'attempt + partial: the transfer is not completed; it is reduced to an exact detection identity whose off-diagonal is co-leading and must be evaluated -- no bound moved, no rigorous M2w, honesty markers and the named residual sub-gap present.',
  },
];

for (const a of IMP97267_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97267-route-m-inverse-map-kloosterman-transfer assertion failed: ${a.id}`,
    );
  }
}

export default {
  ladder: IMP97267_LADDER,
  measured: IMP97267_MEASURED,
  verdict: IMP97267_VERDICT,
  subGap: IMP97267_SUBGAP,
  banner: IMP97267_HONEST_BANNER,
};
