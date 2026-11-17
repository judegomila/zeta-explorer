"""All integer (N1,h), 0<=N1<=40, 1<=h<=80: genus-2 formal numerator 1+p1 T+p2 T^2+u p1 T^3+u^2 T^4,
p1=N1-1-u, p2=h-N1+(2-N1)u.  List the pairs whose I_C is not a single interval (certified)."""
from pell import *
bad = []; empty = 0; n = 0
for h in range(1, 81):
    for N1 in range(0, 41):
        P = [[1], [N1-1, -1], [h-N1, 2-N1], [0, N1-1, -1], [0, 0, 1]]
        comps, Gy, crit = I_C(P, 2)
        iso = I_C.iso; assert I_C.undet == 0
        k = len(comps) + len(iso); n += 1
        if k == 0: empty += 1
        if k > 1: bad.append((N1, h, [[round(c[0][0]**2, 6), round(c[1][0]**2, 6)] for c in comps], [i[0] for i in iso]))
print("pairs:", n, "empty I_C:", empty, "disconnected:", len(bad))
for b in bad: print(b)
print("max h among disconnected:", max(b[1] for b in bad))
