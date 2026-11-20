#!/usr/bin/env python3
"""checks.py -- exponent arithmetic used in RESULT.md (pure python)."""
d = 0.469344941; cnt = 0.5903322805
print("window: n_min = %.6f  n_max = %.6f" % ((1 - cnt) / (2 * d - 0.4), cnt / (1.6 - 2 * d)))
print("GM beats mean value 1 - d r for r < 1/(1.6 - d) = %.4f ; fourth moment beats it for r < 1/(2 - d) = %.4f" % (1 / (1.6 - d), 1 / (2 - d)))
print("Xu26 + monotonicity: 5/6 + (11/16)/3 =", 5 / 6 + 11 / 48, "= 17/16 =", 17 / 16)
print(" r      rho0   GMcnt  eta_GM  BGL    theta  Hal(BGL) Hal(theta) S2budget S2proved S2excess S3save(Lindelof) RMT||E||  GRH-Hal")
for r in (0.7605, 0.80, 5 / 6, 0.87, 0.8844):
    rho0 = 1 - d * r
    gm = max(r - d * r, 1.6 * r - 2 * d * r, 1 + 0.4 * r - 2 * d * r)
    bgl = 2 * (1 + r) / 3; th = 5 / 6 + r / 3
    s2b = rho0 + 3 * d * r - 2 * r          # allowed exponent of mean |h|^2 / D at count rho0
    s2p = bgl - rho0                        # proved exponent of mean |h|^2 / D  (R D ||A||^2 / R^2 / D)
    print(" %.4f %.4f %.4f %+.4f %.4f %.4f %.4f   %.4f     %.4f   %.4f   %.4f   %.4f          %.4f    %.4f" % (
        r, rho0, gm, rho0 - gm, bgl, th, bgl - d * r, th - d * r, s2b, s2p, s2p - s2b, 3 * r * (0.5 - d), (rho0 + r) / 2, rho0 + r / 2))
rs, dl = 0.74569995, d
print("bare witness at config A: r* = %.5f < n_min; GM count = %.5f vs C1 = %.6f" % (rs, 1 + 0.4 * rs - 2 * dl * rs, cnt))
print("C1-GM at n = 5/6: 4/3 - 5 d/3 = %.6f" % (4 / 3 - 5 * d / 3))
