"""Rerun of the scalar comparison system of push/bypass-78/scalar_system.py (float LP, HiGHS; a screen, not a certificate)
with the count replaced by min(R, new-sieve option, Cor 1.5 n = 6 option).  Planned memory: LP with ~5000 rows x 4 columns."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "bypass-78"))
import scalar_system as S

def opt6(d):                      # inf_Y [max(1, Y, 5/6 + Y/3, 1/3 + 5Y/6) - d Y]
    return 1 - d / 2 if d <= 1 / 3 else 7 / 6 - d

def dens6(d):                     # 1 - delta_6((1 + d)/2), Cor 1.5
    n = 6; s = (1 + d) / 2; q = d
    if s <= 1 / 2 + 1 / n: return 1 - q / (4 - n * q)
    if s <= 1 - 1 / (2 * n):
        return 1 - q * (q * n * n - (6 * s - 2) * n + 3) / (q * (3 - 2 * s) * n * n - 4 * s * n + 2)
    return 1 - (8 * s * s - 10 * s + 3) / (1 - 4 * (1 - s) ** 2 * n)

sel = [0]
def Rnew(d, x, k):
    r = S.count_R(d, x, k); o = min(opt6(d), dens6(d))
    if o < r: sel[0] += 1
    return min(r, o)

for name, kinds, region, bal in [("S1 averaged, balanced, region A", ["av_max"], "A", True),
                                 ("S3 averaged, free geometry, region A", ["av_max"], "A", False),
                                 ("S0 pointwise, free geometry, region A", ["pt_left"], "A", False)]:
    out = []
    for Rf in (S.count_R, Rnew):
        f = lambda B: S.solve(B, kinds, region, balanced=bal, Rfun=Rf)
        out.append(S.bisect(f, 0.80, 0.95))
    print("%-40s B* old count %.12f | with new options %.12f | difference %.1e" % (name, out[0], out[1], out[1] - out[0]))
print("classes at which a new option was selected (all LP rows, all bisection steps):", sel[0])
