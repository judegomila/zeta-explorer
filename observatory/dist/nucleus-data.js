/**
 * Evaluated data for uranium-238 shown beside the liquid-drop model. These are
 * measured or evaluated values, quoted with their source; the model does not
 * fit or reproduce them. Read on 2026-11-24.
 *
 * Levels, half-life and decay modes: ENSDF Adopted Levels for A = 238
 *   (Browne & Tuli, Nuclear Data Sheets, literature cut-off 1 June 2014), via
 *   https://www-nds.iaea.org/relnsd/v1/data?fields=levels&nuclides=238u and
 *   https://www.nndc.bnl.gov/nudat3/ .
 * beta2: Raman, Nestor & Tikkanen, At. Data Nucl. Data Tables 78 (2001) 1,
 *   from B(E2; 0+ -> 2+) = 12.09(20) e²b². The later NNDC evaluation
 *   (Pritychenko et al., ADNDT 107 (2016) 1) gives 0.2741(36).
 * Fission barriers and giant dipole resonance: IAEA RIPL-3
 *   (empirical-barriers.dat; gdr-parameters-exp-LOR.dat, Caldwell 1980 fit).
 * Neutron resonances: ENDF/B-VIII.0, n-092_U_238, MF=2 MT=151 (Reich–Moore),
 *   l = 0 block, positive energies in ascending order, first 100.
 *   The l assignment of weak resonances is an evaluators' judgement, and the
 *   list is about 6 % sparser than the evaluated mean spacing D0 = 20.3(6) eV
 *   (RIPL-3 resonances0.dat), so a few s-wave levels are missing from it.
 */
export const U238_DATA=Object.freeze({
  /** Kπ = 0+ ground-state rotational band, energies in keV. */
  groundBand:Object.freeze([
    {J:2,energy:44.916},{J:4,energy:148.38},{J:6,energy:307.18},{J:8,energy:518.1},
    {J:10,energy:775.9},{J:12,energy:1076.7},{J:14,energy:1415.5},{J:16,energy:1788.4},
  ]),
  /** Band heads in keV, with the ENSDF band label. */
  bandHeads:Object.freeze([
    {label:'Octupole-vibrational Kπ = 0−, 1−',energy:680.11},
    {label:'First excited 0+ (Kπ = 0+ band)',energy:927.21},
    {label:'Gamma-vibrational Kπ = 2+, 2+',energy:1060.27},
  ]),
  beta2:.2863,
  halfLifeYears:4.468e9,
  alphaQ:4.26986,                    // MeV
  spontaneousFissionPercent:5.45e-5,
  fissionBarriers:Object.freeze({inner:6.30,outer:5.50}),   // MeV
  giantDipole:Object.freeze([10.77,13.80]),                 // MeV
  evaluatedD0:20.3,                  // eV
  /** s-wave neutron resonance energies of 238U + n, in eV. */
  resonances:Object.freeze([
    6.67428,20.87177,36.68283,66.03021,80.75157,102.5631,116.9035,145.6662,165.2971,189.6751,
    208.5226,237.3987,273.6702,291.0091,311.3212,347.8149,353.6366,376.9342,397.6202,410.2491,
    434.0782,463.1704,478.433,518.3822,535.3186,580.1263,595.0688,619.9855,628.5326,661.1923,
    693.0676,708.2652,765.0125,790.7469,821.5363,851.0667,856.1662,866.4612,905.0953,925.1471,
    937.0628,958.5604,991.6162,1006.279,1022.956,1054.47,1057.848,1098.706,1109.092,1140.182,
    1167.597,1177.214,1194.815,1211.058,1245.27,1267.256,1273.199,1298.82,1326.181,1337.059,
    1361.167,1394.043,1405.67,1420.006,1428.249,1444.33,1474.083,1490.986,1522.954,1558.081,
    1565.54,1591.689,1598.157,1622.947,1638.339,1662.697,1689.048,1710.061,1723.054,1756.141,
    1782.612,1783.173,1808.67,1823.955,1846.349,1867.306,1903.084,1917.437,1954.048,1969.286,
    1975.179,2000.884,2023.994,2030.79,2052.947,2088.873,2096.598,2124.435,2145.861,2153.069,
  ]),
});
