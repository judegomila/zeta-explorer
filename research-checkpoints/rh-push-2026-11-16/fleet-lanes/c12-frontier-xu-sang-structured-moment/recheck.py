# Second pass by a different method: R(delta, x) from the min-max-min definition of r3-critical-count section 1
# (float grids, no closed form, no code shared with slot_test.py), then the forced option against it.
import math
k6 = (37 - 10*math.sqrt(6))/6
def R_def(d, x, kap, nt=201, nr=401):
    c1, c2 = 2.0, 6*kap
    best = 9.0
    for it in range(nt):
        t = 1 + 0.5*it/(nt - 1)
        worst = -9.0
        for ir in range(nr):
            r = (t - 0.5) + 0.5*ir/(nr - 1)
            m = t - r                          # the row takes the smallest admissible m (M2 decreases in m)
            M1 = 1 - d*r - 2*d*x*(1 - r)/c1 if r <= 1 else max(1.0, (1 + 5*r)/6) - d*r
            M2 = 1 - 2*d*m - 2*d*x*(1 - 2*m)/c2
            worst = max(worst, min(M1, M2))
        best = min(best, worst)
    return best
kap = 0.749773
print("R_def(delta_c, 1/2) = %.6f (file 0.590332)" % R_def(0.46934485869814, 0.5, kap))
print("R_def(delta_c, 0)   = %.6f ; (15-16d)/(15-6d) = %.6f" % (R_def(0.46934485869814, 0.0, kap), (15 - 16*0.46934485869814)/(15 - 6*0.46934485869814)))
mn = 9; mono = 0; n = 0
for kap in (13/18, 0.749773, 1.0):
    for i in range(1, 26):
        d = (5/6)*i/25
        prev = None
        for j in range(0, 6):
            x = j/10; r = R_def(d, x, kap); n += 1
            if prev is not None and r > prev + 1e-12: mono += 1
            prev = r
            mn = min(mn, k6 - 1 - d - r, k6 - 1 - 2*d*x - r)
print("classes %d ; monotonicity violations in x: %d ; least margin of the forced option (grid error about 2e-3): %.6f" % (n, mono, mn))
