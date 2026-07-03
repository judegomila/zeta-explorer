/**
 * @module imp-3700-mesoscopic-shock-scale-separation-viz-data
 *
 * Viz data for imp-3700: the imp-3671 mesoscopic-vs-shock scale-separation Gronwall floor
 * floor(k) = exp(-k^2 * E_meso), collapsing from the mesoscopic reading (k=1, y_star=4d) toward
 * the nearest-pair front (large k). Recomputed here from the imp-3642 measured floor 0.991 so the
 * chart data matches imp-3671's IMP3671_MESOSCOPIC_V0_VS_G6A_SHOCK_LIPSCHITZ_ASSESSMENT.scaleSeparation.
 */

const IMP3642_MESO_FLOOR = 0.991;
const E_MESO = -Math.log(IMP3642_MESO_FLOOR); // 0.009041

function floorAt(k) {
  return Math.exp(-(k * k) * E_MESO);
}

export const IMP3700_K_LADDER = [1, 2, 4, 8, 16, 32, 50];

export const IMP3700_SCALE_TABLE = IMP3700_K_LADDER.map((k) => ({
  k,
  y_over_d: +(4 / k).toFixed(4),
  floor: floorAt(k),
}));

export const IMP3700_K_HALF = Math.sqrt(Math.log(2) / E_MESO); // ~8.76
export const IMP3700_Y_HALF_OVER_D = 4 / IMP3700_K_HALF; // ~0.457 d
export const IMP3700_FLOOR_HALF = floorAt(IMP3700_K_HALF); // 0.5 by construction

export const IMP3700_FLOOR_K1 = floorAt(1); // 0.991, mesoscopic
export const IMP3700_FLOOR_K50 = floorAt(50); // ~1.5e-10, nearest-pair proxy, vacuous
