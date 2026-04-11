#!/usr/bin/env python3
"""
imp-415: Independent reimplementation cross-check
Python port of the backward Dyson ODE integrator on the 35-point ladder.

Validates the JavaScript RK4 backward Dyson collision times at N in
{50, 100, 200, 500} against an independent Python implementation.

ODE (backward Dyson / Calogero-Moser):
  dg_{k}/dt = -2 * sum_{j != k} 1 / (g_k - g_j)

with positive dt stepping backward toward collision. The collision time
|t_c(N)| is identified when min_{k}(g_{k+1} - g_k) < 1e-4.

Reference: imp-362 interval-arithmetic witness (src/math/interval-dyson-integrator.mjs).
The Python RK4+Kahan result should fall within the certified enclosure [t_c_lo, t_c_hi]:
  N=50    -> [0.094,   0.096  ]   width=0.002
  N=100   -> [0.075,   0.076  ]   width=0.001
  N=200   -> [0.0325,  0.033  ]   width=0.0005
  N=500   -> [0.0132,  0.0135 ]   width=0.0003

NOTE on PATH_C_BASELINE_FIT discrepancy
----------------------------------------
The legacy values in dyson-scaling-N5000.js PATH_C_FIT_POINTS
  {N:50, tc:0.1435}, {N:100, tc:0.0723}, {N:200, tc:0.0352}, {N:500, tc:0.0163}
were measured with an EULER integrator (one-step first-order method), which overshoots
the first collision singularity and latches onto a nonphysical second near-approach.
dyson-scaling-N5000.js:139 documents this explicitly: "the Euler integrator overshoots
... and reports t_c = 0.1435 (a nonphysical second near-approach). RK4 at the same dt
... the true first-collision time at N=50 is approx 0.0958 (33% lower)."
This cross-check uses the imp-362 interval bounds as the correct reference.

Run:  python3 src/math/dyson-backward-crosscheck.py
Deps: Python >= 3.8 standard library only (no third-party packages).

Honest scope
------------
This is a Float64 cross-check, not an interval-arithmetic certificate.
It validates the ODE algebra, the RK4 Butcher tableau, and the Kahan
summation by running identical maths in a different language/runtime.
For rigorous certified enclosures see src/math/interval-dyson-integrator.mjs
(imp-362) and its successor tickets (imp-363, Arb port).
"""

import sys

# ── Riemann zeta zero ordinates ──────────────────────────────────────────────
# First 500 imaginary parts of nontrivial zeros: Im(rho_n) with
# zeta(1/2 + i*rho_n) = 0, n = 1..500.
# Source: matches ZETA_ZEROS in src/math/zeta.js (Odlyzko canonical table).
ZETA_ZEROS = [
    14.134725142, 21.022039639, 25.010857580, 30.424876126, 32.935061588,
    37.586178159, 40.918719012, 43.327073281, 48.005150881, 49.773832478,
    52.970321478, 56.446247697, 59.347044003, 60.831778525, 65.112544048,
    67.079810529, 69.546401711, 72.067157674, 75.704690699, 77.144840069,
    79.337375020, 82.910380854, 84.735492981, 87.425274613, 88.809111208,
    92.491899271, 94.651344041, 95.870634228, 98.831194218, 101.317851006,
    103.725538040, 105.446623052, 107.168611184, 111.029535543, 111.874659177,
    114.320220915, 116.226680321, 118.790782866, 121.370125002, 122.946829294,
    124.256818554, 127.516683880, 129.578704200, 131.087688531, 133.497737203,
    134.756509753, 138.116042055, 139.736208952, 141.123707404, 143.111845808,
    146.000982487, 147.422765343, 150.053520421, 150.925257612, 153.024693811,
    156.112909294, 157.597591818, 158.849988171, 161.188964138, 163.030709687,
    165.537069188, 167.184439978, 169.094515416, 169.911976479, 173.411536520,
    174.754191523, 176.441434298, 178.377407776, 179.916484020, 182.207078484,
    184.874467848, 185.598783678, 187.228922584, 189.416158656, 192.026656361,
    193.079726604, 195.265396680, 196.876481841, 198.015309676, 201.264751944,
    202.493594514, 204.189671803, 205.394697202, 207.906258888, 209.576509717,
    211.690862595, 213.347919360, 214.547044783, 216.169538508, 219.067596349,
    220.714918839, 221.430705555, 224.007000255, 224.983324670, 227.421444280,
    229.337413306, 231.250188700, 231.987235253, 233.693404179, 236.524229666,
    237.769820481, 239.555477573, 241.049157796, 242.823271934, 244.070898497,
    247.136990075, 248.101990060, 249.573689645, 251.014947795, 253.069986748,
    255.306256455, 256.380713694, 258.610439492, 259.874406990, 260.805084505,
    263.573893905, 265.557851839, 266.614973782, 267.921915083, 269.970449024,
    271.494055642, 273.459609188, 275.587492649, 276.452049503, 278.250743530,
    279.229250928, 282.465114765, 283.211185733, 284.835963981, 286.667445363,
    287.911920501, 289.579854929, 291.846291329, 293.558434139, 294.965369619,
    295.573254879, 297.979277062, 299.840326054, 301.649325462, 302.696749590,
    304.864371341, 305.728912602, 307.219496128, 310.109463147, 311.165141530,
    312.427801181, 313.985285731, 315.475616089, 317.734805942, 318.853104256,
    321.160134309, 322.144558672, 323.466969558, 324.862866052, 327.443901262,
    329.033071680, 329.953239728, 331.474467583, 333.645378525, 334.211354833,
    336.841850428, 338.339992851, 339.858216725, 341.042261111, 342.054877510,
    344.661702940, 346.347870566, 347.272677584, 349.316260871, 350.408419349,
    351.878649025, 353.488900489, 356.017574977, 357.151302252, 357.952685102,
    359.743754953, 361.289361696, 363.331330579, 364.736024114, 366.212710288,
    367.993575482, 368.968438096, 370.050919212, 373.061928372, 373.864873911,
    375.825912767, 376.324092231, 378.436680250, 379.872975347, 381.484468617,
    383.443529450, 384.956116815, 385.861300846, 387.222890222, 388.846128354,
    391.456083564, 392.245083340, 393.427743844, 395.582870011, 396.381854223,
    397.918736210, 399.985119876, 401.839228601, 402.861917764, 404.236441800,
    405.134387460, 407.581460387, 408.947245502, 410.513869193, 411.972267804,
    413.262736070, 415.018809755, 415.455214996, 418.387705790, 419.861364818,
    420.643827625, 422.076710059, 423.716579627, 425.069882494, 427.208825084,
    428.127914077, 430.328745431, 431.301306931, 432.138641735, 433.889218481,
    436.161006433, 437.581698168, 438.621738656, 439.918442214, 441.683199201,
    442.904546303, 444.319336278, 446.860622696, 447.441704194, 449.148545685,
    450.126945780, 451.403308445, 453.986737807, 454.974683769, 456.328426689,
    457.903893064, 459.513415281, 460.087944422, 462.065367275, 464.057286911,
    465.671539211, 466.570286931, 467.439046210, 469.536004559, 470.773655478,
    472.799174662, 473.835232345, 475.600339369, 476.769015237, 478.075263767,
    478.942181535, 481.830339376, 482.834782791, 483.851427212, 485.539148129,
    486.528718262, 488.380567090, 489.661761578, 491.398821594, 493.314441582,
    493.957997805, 495.358828822, 496.429696216, 498.580782430, 500.309084942,
    501.604446965, 502.276270327, 504.499773313, 505.415231742, 506.464152710,
    508.800700336, 510.264227944, 511.562289700, 512.623144531, 513.668985555,
    515.435057167, 517.589668572, 518.234223148, 520.106310412, 521.525193449,
    522.456696178, 523.960530892, 525.077385687, 527.903641601, 528.406213852,
    529.806226319, 530.866917884, 532.688183028, 533.779630754, 535.664314076,
    537.069759083, 538.428526176, 540.213166376, 540.631390247, 541.847437121,
    544.323890101, 545.636833249, 547.010912058, 547.931613364, 549.497567563,
    550.970010039, 552.049572201, 553.764972119, 555.792020562, 556.899476407,
    557.564659172, 559.316237029, 560.240807497, 562.559207616, 564.160879111,
    564.506055938, 566.698787683, 567.731757901, 568.923955180, 570.051114782,
    572.419984132, 573.614610527, 575.093886014, 575.807247141, 577.039003472,
    579.098834672, 580.136959362, 581.946576266, 583.236088219, 584.561705903,
    585.984563205, 586.742771891, 588.139663266, 590.660397517, 591.725858065,
    592.571358300, 593.974714682, 595.728153697, 596.362768328, 598.493077346,
    599.545640364, 601.602136736, 602.579167886, 603.625618904, 604.616218494,
    606.383460422, 608.413217311, 609.389575155, 610.839162938, 611.774209621,
    613.599778676, 614.646237872, 615.538563369, 618.112831366, 619.184482598,
    620.272893672, 621.709294528, 622.375002740, 624.269900018, 626.019283428,
    627.268396851, 628.325862359, 630.473887438, 630.805780927, 632.225141167,
    633.546858252, 635.523800311, 637.397193160, 637.925513981, 638.927938267,
    640.694794669, 641.945499666, 643.278883781, 644.990578230, 646.348191596,
    647.761753004, 648.786400889, 650.197519345, 650.668683891, 653.649571605,
    654.301920586, 655.709463022, 656.964084599, 658.175614419, 659.663845973,
    660.716732595, 662.296586431, 664.244604652, 665.342763096, 666.515147704,
    667.148494895, 668.975848820, 670.323585206, 672.458183584, 673.043578286,
    674.355897810, 676.139674364, 677.230180669, 677.800444746, 679.742197883,
    681.894991533, 682.602735020, 684.013549814, 684.972629862, 686.163223588,
    687.961543185, 689.368941362, 690.474735032, 692.451684416, 693.176970061,
    694.533908700, 695.726335921, 696.626069900, 699.132095476, 700.296739132,
    701.301742955, 702.227343146, 704.033839296, 705.125813955, 706.184654800,
    708.269070885, 709.229588570, 711.130274180, 711.900289914, 712.749383470,
    714.082771821, 716.112396454, 717.482569703, 718.742786545, 719.697100988,
    721.351162219, 722.277504976, 723.845821045, 724.562613890, 727.056403230,
    728.405481589, 728.758749796, 730.416482123, 731.417354919, 732.818052714,
    734.789643252, 735.765459209, 737.052928912, 738.580421171, 739.909523674,
    740.573807447, 741.757335573, 743.895013142, 745.344989551, 746.499305899,
    747.674563624, 748.242754465, 750.655950362, 750.966381067, 752.887621567,
    754.322370472, 755.839308976, 756.768248440, 758.101729246, 758.900238225,
    760.282366984, 762.700033250, 763.593066173, 764.307522724, 766.087540100,
    767.218472156, 768.281461807, 769.693407253, 771.070839314, 772.961617566,
    774.117744628, 775.047847097, 775.999711963, 777.299748530, 779.157076949,
    780.348925004, 782.137664391, 782.597943946, 784.288822612, 785.739089701,
    786.461147451, 787.468463816, 790.059092364, 790.831620468, 792.427707609,
    792.888652563, 794.483791870, 795.606596156, 797.263470038, 798.707570166,
    799.654336211, 801.604246463, 802.541984878, 803.243096204, 804.762239113,
    805.861635667, 808.151814936, 809.197783363, 810.081804886, 811.184358847,
]

# ── OLS reference constants from PATH_C_BASELINE_FIT ─────────────────────────
# Linear fit |t_c(N)| = OLS_A + OLS_B / N, fitted on the 5-point baseline.
# Used only for reporting; NOT used for the AGREE/MISMATCH verdict (see below).
OLS_A = 0.0066
OLS_B = 4.91

# imp-362 interval-arithmetic witness (src/math/interval-dyson-integrator.mjs).
# These are the CERTIFIED [t_c_lo, t_c_hi] enclosures computed by the JS
# interval RK4 integrator with one-ULP outward inflation.  The Python RK4+Kahan
# result is expected to land inside (or at the boundary of) each interval.
# Source: LAMBDA_INTERVAL_DYSON.witness in interval-dyson-integrator.mjs.
IMP362_WITNESS = {
    50:  (0.094,   0.096  ),
    100: (0.075,   0.076  ),
    200: (0.0325,  0.033  ),
    500: (0.0132,  0.0135 ),
}

# Euler-method baseline (PATH_C_FIT_POINTS in dyson-scaling-N5000.js).
# THESE ARE KNOWN ARTIFACTS of the first-order Euler integrator: it overshoots
# the collision singularity and records a nonphysical second near-approach.
# Kept here for documentation only; the AGREE verdict uses IMP362_WITNESS.
EULER_BASELINE = {50: 0.1435, 100: 0.0723, 200: 0.0352, 500: 0.0163}


# ── Dyson ODE kernel ─────────────────────────────────────────────────────────

def dyson_drift_kahan(gammas):
    """
    Backward Dyson drift: dg_{k}/dt = -2 * sum_{j != k} 1 / (g_k - g_j).

    Uses Kahan-Neumaier compensated summation to suppress O(N * eps_mach)
    roundoff in the 1 / (g_k - g_j) pole terms. Matches the
    dysonDerivativesKahan function in src/math/dyson-ode-integrator.js.
    """
    N = len(gammas)
    dg = [0.0] * N
    for n in range(N):
        s = 0.0
        c = 0.0  # Kahan compensation
        for k in range(N):
            if k == n:
                continue
            diff = gammas[n] - gammas[k]
            if abs(diff) < 1e-15:
                continue
            term = 1.0 / diff
            y = term - c
            t = s + y
            c = (t - s) - y
            s = t
        dg[n] = -2.0 * s  # direction = backward
    return dg


def rk4_step(gammas, dt):
    """
    Classical 4-stage Runge-Kutta step for the backward Dyson ODE.
    Matches rk4StepKahan in src/math/dyson-ode-integrator.js.
    """
    N = len(gammas)
    k1 = dyson_drift_kahan(gammas)

    y1 = [gammas[i] + dt * 0.5 * k1[i] for i in range(N)]
    k2 = dyson_drift_kahan(y1)

    y2 = [gammas[i] + dt * 0.5 * k2[i] for i in range(N)]
    k3 = dyson_drift_kahan(y2)

    y3 = [gammas[i] + dt * k3[i] for i in range(N)]
    k4 = dyson_drift_kahan(y3)

    return [
        gammas[i] + dt / 6.0 * (k1[i] + 2.0 * k2[i] + 2.0 * k3[i] + k4[i])
        for i in range(N)
    ]


def min_spacing(gammas):
    """Return (minimum consecutive gap, index of the tight pair)."""
    min_s = float("inf")
    min_idx = -1
    for i in range(len(gammas) - 1):
        s = gammas[i + 1] - gammas[i]
        if s < min_s:
            min_s = s
            min_idx = i
    return min_s, min_idx


# ── Per-N integration budget ─────────────────────────────────────────────────

def budget_for_n(N):
    """
    Stepsize and step-count budget matching budgetForN() in
    src/data/dyson-ladder-measured.js. Ensures the total integration
    window dt * nSteps covers the expected collision time OLS_A + OLS_B/N.
    """
    if N <= 60:
        return 0.002, 120
    if N <= 120:
        return 0.001, 120
    if N <= 240:
        return 0.0005, 120
    if N <= 600:
        return 0.0003, 120
    return 0.0001, 120


# ── Backward collision runner ─────────────────────────────────────────────────

def run_backward_collision(N, dt, max_steps, verbose=False):
    """
    Integrate the backward Dyson ODE for the first N Riemann zeros.

    Returns (t_c, pair_index) where t_c = step * dt at the first step
    where the minimum consecutive gap drops below 1e-4.
    Returns (None, None) if no collision is found within max_steps.
    """
    gammas = list(ZETA_ZEROS[:N])
    for step in range(max_steps):
        spacing, idx = min_spacing(gammas)
        if spacing < 1e-4:
            t_c = step * dt
            if verbose:
                print(f"  step={step:4d}  t={t_c:.6f}  "
                      f"min_gap={spacing:.2e}  pair=({idx},{idx+1})")
            return t_c, idx
        gammas = rk4_step(gammas, dt)
    return None, None


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("=" * 72)
    print("imp-415: Python backward Dyson integrator cross-check")
    print("ODE: dg_{k}/dt = -2 * sum_{j!=k} 1/(g_k - g_j)  [backward]")
    print("Method: RK4 + Kahan-compensated summation (Python float64)")
    print("Reference: imp-362 interval-arithmetic witness [t_c_lo, t_c_hi]")
    print("=" * 72)
    print()
    print(f"{'N':>6}  {'py_tc':>8}  {'iv_lo':>8}  {'iv_hi':>8}  "
          f"{'euler_ref':>9}  {'in_interval':>11}")
    print("-" * 72)

    test_ns = [50, 100, 200, 500]
    results = []

    for N in test_ns:
        dt, max_steps = budget_for_n(N)
        lo, hi = IMP362_WITNESS[N]
        euler_ref = EULER_BASELINE[N]

        t_c, pair_idx = run_backward_collision(N, dt, max_steps)

        if t_c is not None:
            # AGREE if py_tc falls within [t_c_lo, t_c_hi] or at most
            # one step (dt) above the upper bound (rounding of detection step).
            agree = lo <= t_c <= hi + dt
            tag = "YES" if agree else "NO"
            print(f"{N:6d}  {t_c:8.4f}  {lo:8.4f}  {hi:8.4f}  "
                  f"{euler_ref:9.4f}  {tag:>11}"
                  + (f"  (pair idx {pair_idx})" if agree else "  *** OUTSIDE ***"))
        else:
            total_t = dt * max_steps
            tag = "BUDGET-EXHAUSTED"
            print(f"{N:6d}  {'--':>8}  {lo:8.4f}  {hi:8.4f}  "
                  f"{euler_ref:9.4f}  {tag:>11} (window={total_t:.4f})")
            agree = False

        results.append({
            "N": N,
            "py_tc": t_c,
            "iv_lo": lo,
            "iv_hi": hi,
            "euler_ref": euler_ref,
            "agree": agree,
            "pair_idx": pair_idx,
        })

    print()
    closed = [r for r in results if r["py_tc"] is not None]
    agreed = [r for r in closed if r["agree"]]

    all_agree = len(agreed) == len(results) and len(closed) == len(results)
    print(f"Closed:  {len(closed)}/{len(results)} N-values reached collision")
    print(f"In-interval: {len(agreed)}/{len(closed)} closed py_tc values "
          "fall within [t_c_lo, t_c_hi+dt]")
    print()

    if all_agree:
        print("VERDICT: CROSS-VERIFIED")
        print("  Python RK4+Kahan collision times land inside the imp-362")
        print("  certified interval-arithmetic enclosures at all "
              f"{len(results)} tested N-values.")
        print("  The backward Dyson ODE algebra and RK4 tableau are")
        print("  implementation-independent across JS and Python runtimes.")
        print()
        print("  Euler-baseline discrepancy explained:")
        print("  The PATH_C_FIT_POINTS values (0.1435, 0.0723, ...) are")
        print("  artifacts of a first-order Euler integrator that overshoots")
        print("  the first collision singularity (see dyson-scaling-N5000.js")
        print("  line ~141). RK4+Kahan resolves the true earlier collision.")
    else:
        mismatched = [r for r in results if not r["agree"]]
        print(f"VERDICT: {len(mismatched)} ISSUE(S) — py_tc outside interval")
        for r in mismatched:
            if r["py_tc"] is None:
                print(f"  N={r['N']}: budget exhausted — widen step budget")
            else:
                print(f"  N={r['N']}: py={r['py_tc']:.6f} not in "
                      f"[{r['iv_lo']}, {r['iv_hi']}]")

    print()
    print("Honest limitations:")
    print("  - Python float64 == JS Float64 (IEEE 754); validates ODE algebra,")
    print("    not rounding-mode correctness.")
    print("  - imp-362 intervals use one-ULP JS emulation, not true Arb directed")
    print("    rounding — so the enclosures are conservatively wider than needed.")
    print("  - For rigorous certificates, port to Arb/MPFI (planned in imp-363).")

    return 0 if all_agree else 1


if __name__ == "__main__":
    sys.exit(main())
