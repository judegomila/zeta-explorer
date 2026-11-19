"""Constants of Lemma X per r-datum: kappa, A, a valid x_1, t_r.
D(x) = sum_{j>=r} (-1)^(j-1) dP_j x^j / j, dP_j = P_j(a) - P_j(b) (exact integers).
x_1 is valid if T(x_1) := sum_{j>r} |dP_j| x_1^(j-r) / j <= kappa/10 (T is increasing in x) and x_1 <= 1/(2A).
T is summed to j = 400 with positive terms (no cancellation) plus the bound 2 s (A x)^401 x^(-r) / (401 (1 - A x)) on the rest."""
from fractions import Fraction as Fr
PTE = {2: ([1, -1], [0, 0]), 3: ([1, 2, 6], [0, 4, 5]), 4: ([0, 4, 7, 11], [1, 2, 9, 10]), 5: ([1, 2, 10, 14, 18], [0, 4, 8, 16, 17])}
def T(x, a, b, r):
    s = len(a); A = max(map(abs, a + b)); tot = 0.0
    for j in range(r + 1, 401):
        tot += float(abs(sum(Fr(u)**j for u in a) - sum(Fr(u)**j for u in b)) * Fr(x)**(j - r) / j)
    return tot + 2*s*(A*x)**401 / x**r / (401*(1 - A*x))
for r, (a, b) in PTE.items():
    s = len(a); A = max(map(abs, a + b)); dPr = sum(u**r for u in a) - sum(u**r for u in b); kap = abs(dPr)/r
    lo, hi = 0.0, 1/(2*A)
    if T(hi, a, b, r) <= kap/10: lo = hi
    else:
        for _ in range(80):
            mid = (lo + hi)/2
            if T(mid, a, b, r) <= kap/10: lo = mid
            else: hi = mid
    x1 = lo*0.999
    tr = max(4.5/(kap*x1**r), (3*r)**r*1.12/kap)
    print(f"r={r} s={s} A={A} dP_r={dPr} kappa={kap:g} x_1={x1:.6g} T(x_1)/kappa={T(x1,a,b,r)/kap:.5f} t_r={tr:.6g} eps bound={0.479/s:.4f}")
