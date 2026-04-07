/**
 * Mossinghoff-Trudgian-Yang 2024: Updated Zero-Free Region Constants
 *
 * imp-291 (CRITICAL): MTY (2024, Research in Number Theory) improved:
 *
 *   Classical: σ ≥ 1 - 1/(R·log|t|), R = 5.558691 (was 5.573412 KLN 2018)
 *   VK form:   σ ≥ 1 - 1/(c·(log|t|)^{2/3}·(loglog|t|)^{1/3}), c = 55.241 (was 57.54 Ford)
 *
 * Also improved: |ζ(σ+it)| ≤ A·|t|^{B(1-σ)^{3/2}}·log^{2/3}|t|
 *   New: A=76.2, B=4.45 (previous B=18.5 — massive improvement!)
 *
 * Combined with Guth-Maynard (imp-290), this gives the complete 2024 SOTA.
 */

export function mty2024ZeroFreeUpdateTest() {
  // Historical progression of explicit constants
  const classicalR = [
    { year: 1958, author: 'Rosser-Schoenfeld', R: 9.6459 },
    { year: 2000, author: 'Ford', R: 6.397 },
    { year: 2005, author: 'Kadiri', R: 5.69693 },
    { year: 2018, author: 'Kadiri-Lumley-Ng', R: 5.573412 },
    { year: 2024, author: 'Mossinghoff-Trudgian-Yang', R: 5.558691 },
  ];

  const vkConstants = [
    { year: 2002, author: 'Ford', c: 57.54 },
    { year: 2024, author: 'Mossinghoff-Trudgian-Yang', c: 55.241 },
  ];

  // Zeta bound constants
  const zetaBound = [
    { year: 'prev', A: null, B: 18.5, note: 'previous best' },
    { year: 2024, A: 76.2, B: 4.45, note: 'MTY 2024 — B improved 4×!' },
  ];

  // Compute boundaries with NEW vs OLD constants
  const heights = [10, 100, 1000, 1e6, 1e10, 1e20];
  const R_old = 5.573412, R_new = 5.558691;
  const c_old = 57.54, c_new = 55.241;

  const comparison = heights.map(t => {
    const logT = Math.log(t), logLogT = Math.log(logT);
    const cl_old = 1 - 1/(R_old * logT);
    const cl_new = 1 - 1/(R_new * logT);
    const vk_old = logLogT > 0 ? 1 - 1/(c_old * Math.pow(logT, 2/3) * Math.pow(logLogT, 1/3)) : cl_old;
    const vk_new = logLogT > 0 ? 1 - 1/(c_new * Math.pow(logT, 2/3) * Math.pow(logLogT, 1/3)) : cl_new;
    return {
      t: t >= 1e6 ? t.toExponential(0) : t,
      'σ_cl(KLN 2018)': +cl_old.toFixed(8),
      'σ_cl(MTY 2024)': +cl_new.toFixed(8),
      'cl improvement': +((1-cl_new) - (1-cl_old)).toExponential(3),
      'σ_VK(Ford 2002)': +vk_old.toFixed(8),
      'σ_VK(MTY 2024)': +vk_new.toFixed(8),
      'VK improvement': +((1-vk_new) - (1-vk_old)).toExponential(3),
    };
  });

  // Percentage improvement in width
  const widthImprovement = {
    classical: +((R_new - R_old) / R_old * 100).toFixed(3),
    VK: +((c_old - c_new) / c_old * 100).toFixed(3),
    note: 'Negative classical % = wider zero-free region (better R means SMALLER 1/R)',
  };

  // The B constant improvement is MASSIVE
  const bImprovement = {
    old_B: 18.5,
    new_B: 4.45,
    ratio: +(18.5 / 4.45).toFixed(2),
    note: 'B improved by factor 4.16× — huge for explicit zeta bounds',
  };

  return {
    framework: {
      name: 'Mossinghoff-Trudgian-Yang 2024 Zero-Free Constants',
      classical: `σ ≥ 1 - 1/(${R_new}·log|t|) for |t| ≥ 2`,
      vk: `σ ≥ 1 - 1/(${c_new}·(log|t|)^{2/3}·(loglog|t|)^{1/3}) for |t| ≥ 3`,
      zetaBound: `|ζ(σ+it)| ≤ ${zetaBound[1].A}·|t|^{${zetaBound[1].B}(1-σ)^{3/2}}·log^{2/3}|t|`,
    },

    classical_history: classicalR,
    vk_history: vkConstants,
    zeta_bound_improvement: bImprovement,

    boundary_comparison: comparison,
    width_improvement: widthImprovement,

    keyFindings: [
      `Classical R: 5.573412 (KLN 2018) → 5.558691 (MTY 2024). Improvement: ${((R_old-R_new)/R_old*100).toFixed(2)}%.`,
      `VK c: 57.54 (Ford 2002) → 55.241 (MTY 2024). Improvement: ${((c_old-c_new)/c_old*100).toFixed(2)}%.`,
      `Zeta bound B: 18.5 → 4.45 (MTY 2024). Factor ${bImprovement.ratio}× improvement!`,
      `At t=10^6: classical width widens by ${comparison[3]['cl improvement']}, VK by ${comparison[3]['VK improvement']}.`,
      `At t=10^20: classical improvement ${comparison[5]['cl improvement']}, VK ${comparison[5]['VK improvement']}.`,
      `Combined with Guth-Maynard (imp-290): complete 2024 SOTA for zero-free regions.`,
    ],

    verdict:
      `MTY 2024: R=${R_new} (classical), c=${c_new} (VK), B=4.45 (zeta bound, 4× better). ` +
      `Complete 2024 SOTA baseline for zero-free regions established.`,
  };
}
