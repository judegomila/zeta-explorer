#!/usr/bin/env node
// scripts/imp-33309-max-bj-growth-fit.mjs
// imp-33309 OFFLINE MEASUREMENT / GROWTH-LAW FIT (HONEST, fit-only, NO QED).
//
// imp-33290 proved the realised-gap-aware per-term bound 8*B_j (B_j = P_j/D_j,
// prefix sums) is provably still an upper bound (AM-HM) and collapses the
// certified aggregate ratio R_maj (up to 11.08) onto the flat K_real floor
// (<= 1.60), removing 84.70% of the endpoint over-charge -- BUT its N-uniform
// certification reduces to bounding sup_{N,j} B_j = the realised elasticity =
// the imp-33250 residual dg2, which the swap leaves untouched. imp-33290 noted
// max B_j already grows across plateaus (2.10 at plateau 0 to 6.45 at plateau 5)
// but never tabulated/fit the growth across ALL 10 plateaus of [1e4,1e6].
//
// This script takes the max_j B_j measured per plateau by the imp-33290 sweep
// (scripts/imp-33290-far-term-tighter-majorant-assess.mjs) and FITS its growth
// versus plateau index and effective N (linear, log, power, sub-log), reporting
// least-squares R^2 for each, to characterize whether the relocated dg2
// obstruction is plausibly bounded or genuinely unbounded N-uniformly.
//
// KEY QUALITATIVE FINDING: max B_j is NON-MONOTONE in N. Its global maximum
// (6.4537) sits at plateau 5 (endN ~ 95248), while the endpoint plateau 9
// (endN = 1e6) is only 4.9938 -- i.e. the sequence DIPS after its peak, which a
// genuine monotone-in-N growth law forbids. Every candidate fit has poor R^2
// (~0.27-0.40), so the ~1.72 decades of N in [1e4,1e6] cannot distinguish a
// slow unbounded drift from a bounded lattice fluctuation. The measurement thus
// leaves the imp-33250 dg2 obstruction OPEN: it neither certifies sup B_j
// bounded nor demonstrates it unbounded. Fit-only; no certified constant.
//
// Run:  node scripts/imp-33309-max-bj-growth-fit.mjs

// max_j B_j per imp-3725 plateau (thetaBar=0.99) of [1e4,1e6], baked from the
// imp-33290 offline sweep (2026-07-04); endN is each plateau's running-min end.
const IDX  = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const ENDN = [18859, 44555, 73997, 82552, 87761, 95248, 354769, 415587, 420891, 1000000];
const MBJ  = [2.0959, 2.1965, 2.7439, 4.6691, 2.7013, 6.4537, 3.7228, 4.1845, 4.0866, 4.9938];
const n = IDX.length;

// Ordinary least squares: returns slope, intercept, and R^2 for ys ~ a*xs + b.
function olsFit(xs, ys) {
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0, sxy = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx, dy = ys[i] - my;
    sxx += dx * dx; sxy += dx * dy; syy += dy * dy;
  }
  const slope = sxy / sxx;
  const r = sxy / Math.sqrt(sxx * syy);
  return { slope, intercept: my - slope * mx, r2: r * r };
}

const lnN = ENDN.map(Math.log);
const lnB = MBJ.map(Math.log);

const fLinIdx = olsFit(IDX, MBJ);                // maxBj = a*idx + b
const fLogN   = olsFit(lnN, MBJ);                // maxBj = a*ln(N) + b
const fPow    = olsFit(lnN, lnB);                // ln maxBj = alpha*ln N + c  (power law)
const fSubLog = olsFit(lnN.map(Math.log), MBJ);  // maxBj = a*ln(ln N) + b

const gmax = Math.max(...MBJ);
const argmax = MBJ.indexOf(gmax);
const monotone = MBJ.every((v, i) => i === 0 || v >= MBJ[i - 1]);

console.log('imp-33309 max_j B_j growth-law fit across the 10 imp-3725 plateaus of [1e4,1e6]\n');
console.log('idx  endN        maxBj');
for (let i = 0; i < n; i++) {
  console.log(`${IDX[i]}  ${String(ENDN[i]).padStart(9)}   ${MBJ[i].toFixed(4)}`);
}
console.log(`\nglobal max B_j = ${gmax.toFixed(4)} at plateau ${argmax} (endN ${ENDN[argmax]})`);
console.log(`endpoint plateau 9 = ${MBJ[9].toFixed(4)} (endN ${ENDN[9]})`);
console.log(`monotone non-decreasing in N? ${monotone}`);
console.log(`endpoint < global max? ${MBJ[9] < gmax}  <- a monotone N-growth law forbids this dip`);
console.log('\nFITS (least squares, R^2):');
console.log(`  linear vs plateau idx : maxBj = ${fLinIdx.slope.toFixed(4)}*idx + ${fLinIdx.intercept.toFixed(4)}    R^2=${fLinIdx.r2.toFixed(4)}`);
console.log(`  log    vs ln(endN)    : maxBj = ${fLogN.slope.toFixed(4)}*lnN + ${fLogN.intercept.toFixed(4)}    R^2=${fLogN.r2.toFixed(4)}`);
console.log(`  power  (log-log)      : maxBj = ${Math.exp(fPow.intercept).toFixed(4)} * N^${fPow.slope.toFixed(4)}    R^2=${fPow.r2.toFixed(4)}`);
console.log(`  sub-log vs ln(ln N)   : maxBj = ${fSubLog.slope.toFixed(4)}*lnlnN + ${fSubLog.intercept.toFixed(4)}    R^2=${fSubLog.r2.toFixed(4)}`);
console.log(`\npower-law exponent alpha = ${fPow.slope.toFixed(4)} (tiny; over ~1.72 decades of N, max B_j only ~doubles)`);
console.log('best R^2 among all candidate fits =', Math.max(fLinIdx.r2, fLogN.r2, fPow.r2, fSubLog.r2).toFixed(4), '(all poor)');
console.log('\nVERDICT (fit-only): every candidate fit has poor R^2 (~0.27-0.40) and max B_j is');
console.log('NON-MONOTONE (peaks at plateau 5, dips to the endpoint), so ~1.72 decades of N');
console.log('cannot distinguish a slow unbounded drift from a bounded lattice fluctuation.');
console.log('The imp-33250 dg2 obstruction stays OPEN: sup_{N,j} B_j is neither certified');
console.log('bounded nor demonstrated unbounded. No certified constant; imp-3066 UNTOUCHED; NO QED.');
