"""Second pass (same agent, different method): float brute force on dense grids, no shared code with ledger.py."""
import math
dc = 0.46934485869814
# 1. inf_Y of new option
best = min((max(1, Y, 5/6 + Y/3, 1/3 + 5*Y/6) - dc*Y, Y) for Y in [i/100000*3 for i in range(100001)])
print("inf new option %.6f at Y = %.4f ; 7/6 - dc = %.6f" % (best[0], best[1], 7/6 - dc))
best = min((max(1, Y, 2*(1+Y)/3) - dc*Y, Y) for Y in [i/100000*3 for i in range(100001)])
print("inf old option %.6f at Y = %.4f ; 1 - dc/2 = %.6f" % (best[0], best[1], 1 - dc/2))
# 2. window of non-optimality, random sampling
import random
random.seed(1); bad = 0
for _ in range(200000):
    a, b = random.uniform(0, 3), random.uniform(0.01, 3)
    off = max(5*a/6 + b/3, a/3 + 5*b/6)
    if (off > max(a, b) + 1e-12) != (b/2 + 1e-12 < a < 2*b - 1e-12):
        if abs(a - b/2) > 1e-9 and abs(a - 2*b) > 1e-9: bad += 1
print("window D^(1/2) < K < D^2 mismatches:", bad)
# 3. Z6
Q, D = 1.0, 1.4
print("Z6 old %.4f new %.4f" % (max(Q, D, 2*(Q+D)/3)/2, max(Q, D, 5*Q/6 + D/3, Q/3 + 5*D/6)/2))
# 4. Framework A, order n: min over lam of max lines
for n in (3, 4, 5, 6):
    v = min(max(1 + lam - lam/n, 2 - lam/n, 2 - 2*lam/n, lam + (1 - 1/n)*(2 - lam) + 2/n - lam/n,
                lam + (2/n)*(2 - lam) + 1 - 1/n - lam/n) for lam in [i/1000*2 for i in range(1001)])
    print("Framework A order %d: min exponent of |A_1|^2 = %.6f -> theta = %.4f" % (n, v, min(1, v/2)))
# 5. identity B >= 1 for dir6 with polar branch: 1 - h/6 + b/12 + k/2 with k = (1+l)/3 - M/6
mx = 0
for _ in range(100000):
    lx, ly, l = random.uniform(0, 8), random.uniform(0, 8), random.uniform(0, 8)
    h = 1 - lx + l; b = ly - lx; M = lx + ly
    mx = max(mx, abs(1 - h/6 + b/12 + ((1 + l)/3 - M/6)/2 - 1))
print("max |1 - h/6 + b/12 + k3/2 - 1| over 1e5 random geometries: %.2e" % mx)
# 6. Ji arithmetic
h, y = 65/144, 1/288
print("Ji: upper %.8f (575/576 = %.8f); Y-term %.8f (599/600 = %.8f)" % (2 + 5*y - 2*h - y - h/4, 575/576, 1 - 12*y/25, 599/600))
u = (36 - math.sqrt(624))/336
print("E_6 = 1/6 at sigma = %.6f ; E_4 = 1/4 at 0.95" % (1 - u))
# 7. Liu polynomial root by Newton
B = 0.8749
for _ in range(50):
    f = 133488*B**4 - 376596*B**3 + 384534*B**2 - 167541*B + 26231
    fp = 4*133488*B**3 - 3*376596*B**2 + 2*384534*B - 167541
    B -= f/fp
print("B_flat = %.10f" % B)
