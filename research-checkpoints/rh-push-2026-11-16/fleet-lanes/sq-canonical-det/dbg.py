from suzmp import *
import mpmath as mp
digits = 80
setprec(digits)
kind, omf, nu = "dh", Fraction(1, 4), 1
om = arb(1) / 4
tf = Fraction(17, 10); t = arb(17) / 10
N = int(math.floor(math.exp(2 * float(tf))))
a_n = coeffs(kind, om, nu, N)
print("coef radius", max(float(a.rad()) for a in a_n))
tab = GTable(kind, om, nu, 2 * float(tf) + 0.01, digits)
print("tail", tab.tail)
Ms = {}
for p in (40, 60):
    M, trK = galerkin(tab, a_n, N, t, p, omf, nu)
    Ms[p] = M
    ev = acb_mat(M).eig(algorithm="approx")
    evr = sorted([e.real for e in ev], key=lambda z: float(z.mid()))
    mp.mp.dps = digits
    A = mp.matrix(p, p)
    for i in range(p):
        for j in range(p):
            A[i, j] = mp.mpf(M[i, j].str(digits, radius=False))
    E = mp.eigsy(A, eigvals_only=True)
    print(p, "flint gap+", float((1 - evr[-1]).mid()), "gap-", float((1 + evr[0]).mid()),
          "| mpmath gap+", mp.nstr(1 - max(E), 5), "gap-", mp.nstr(1 + min(E), 5),
          "| max imag", max(abs(float(e.imag.mid())) for e in ev))
d = 0
for i in range(40):
    for j in range(40):
        d = max(d, abs(float((Ms[60][i, j] - Ms[40][i, j]).mid())))
print("max |M60[:40,:40]-M40| =", d)
