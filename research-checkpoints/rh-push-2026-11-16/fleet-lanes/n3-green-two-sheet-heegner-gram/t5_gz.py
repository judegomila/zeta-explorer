# Arithmetic expansion (Gross-Zagier, "On singular moduli", coprime fundamental discriminants, Re s > 1):
#   G_s(z_D1, z_D2) = c * sum_{n > sqrt(D1 D2), n = D1 D2 mod 2} rho(n) Q_{s-1}(n/sqrt(D1 D2)),  rho(n) = sum_{d | (n^2-D1D2)/4} eps(d)
# checked here against the collocation value; also Hecke symmetry G(T_2 a, b) = G(a, T_2 b) on both sheets.
from runlib import *
from sympy import factorint
def kron(D, p):
    if p == 2: return 0 if D % 2 == 0 else (1 if D % 8 == 1 else -1)
    r = pow(D % p, (p-1)//2, p)
    return 0 if D % p == 0 else (1 if r == 1 else -1)
def rho(n, D1, D2):
    m = (n*n-D1*D2)//4; tot = 1
    for p, e in factorint(m).items():
        ep = kron(D1, p) if D1 % p else kron(D2, p)
        tot *= sum(ep**k for k in range(e+1))
    return tot
for s in (2.2+2j, 1.9+5j):
    C, reg0 = consts(s); so = Solver(s)
    for D1, D2 in ((-3, -4), (-7, -8), (-3, -7), (-4, -7), (-3, -8)):
        coef, res = so.solve(HEEG[D2]); Gh = so.G([HEEG[D1]], HEEG[D2], coef)[0]
        P = D1*D2; rt = P**0.5; N = 60000
        ns = np.array([n for n in range(int(rt)+1, N) if (n-P) % 2 == 0])
        rh = np.array([rho(int(n), D1, D2) for n in ns])
        Q = 2*np.pi*gs_arr((ns/rt-1)/2, s, C, reg0)
        ser = (rh*Q).sum()
        print("s", s, "D1,D2", D1, D2, "G", Gh, "series", ser, "ratio 2pi G/series", 2*np.pi*Gh/ser, flush=True)
# Hecke symmetry on both sheets
for s in (0.7+14.134725j, 0.3-14.134725j):
    so = Solver(s)
    a, b = HEEG[-7], HEEG[-8]
    cb, _ = so.solve(b); lhs = so.G(hecke(a, 2), b, cb).sum()
    rhs = 0
    for w in hecke(b, 2):
        cw, _ = so.solve(w); rhs += so.G([a], w, cw)[0]
    print("s", s, "G(T2 a, b)", lhs, "G(a, T2 b)", rhs)
