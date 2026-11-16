"""Independent check: fixed point of the local closed form B*(kappa) (zf-campaign-high-side.md, Prop E')
under kappa = 2B-1 equals Liu's B_flat (root of the quartic in arXiv:2610.26835 (14.1))."""
from mpmath import mp, mpf, findroot, sqrt, polyroots
mp.dps = 40
def Bstar(k):
    c = 1/(3*k)
    A = 216 - 18*c**2; Bq = 30*c**2 + 108*c - 504; C = 200 - 80*c
    d = (-Bq - sqrt(Bq**2 - 4*A*C))/(2*A)          # root in (0,5/6)
    l = (5 - 6*d)/(9 + 6*d*(1 + c))
    return mpf(11)/12 - l/4, d, l
B = mpf('0.8749')
for _ in range(60):
    B = Bstar(2*B - 1)[0]
print("fixed point of B*(2B-1):", B, " delta*, l* =", Bstar(2*B-1)[1:], )
q = lambda x: 133488*x**4 - 376596*x**3 + 384534*x**2 - 167541*x + 26231
r = findroot(q, mpf('0.8749'))
print("Liu quartic root        :", r, " difference:", B - r)
print("B*(3/4) =", Bstar(mpf(3)/4)[0], "  B*(29991/40000) =", Bstar(mpf(29991)/40000)[0])
