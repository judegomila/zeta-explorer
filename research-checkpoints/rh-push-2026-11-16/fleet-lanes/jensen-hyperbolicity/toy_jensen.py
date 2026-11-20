# Exact Jensen thresholds for the toy F(w) = cosh(sqrt w) * (1 - w/W)(1 - w/conj W), W=(beta+i Gamma)^2, beta,Gamma rational.
# gamma_k = k! [w^k] F (rational).  J^{d,n}(X) = sum_j C(d,j) gamma_{n+j} X^j.
# d*(n) = largest d with J^{d,n} hyperbolic (the hyperbolic set is an initial segment in d: P_{d-1} = P_d'/d).
import sys
from fractions import Fraction as Fr
from math import comb, factorial
from flint import fmpz_poly, fmpq_poly, fmpq, ctx
def gammas(beta, Gamma, K):
    b, G = Fr(beta), Fr(Gamma)
    re, im = b*b - G*G, 2*b*G          # W
    n2 = re*re + im*im
    q = [Fr(1), -2*re/n2, 1/n2]
    c0 = [Fr(1, factorial(2*k)) for k in range(K)]
    return [factorial(k)*sum(q[j]*c0[k-j] for j in range(3) if k >= j) for k in range(K)]
def nreal(g, d, n):
    co = [comb(d, j)*g[n+j] for j in range(d+1)]
    p = fmpq_poly([fmpq(c.numerator, c.denominator) for c in co])
    pz = p.numer()
    # exact count of distinct real roots via Sturm on squarefree part
    return sturm(pz), d
def sturm(p):
    g = p.gcd(p.derivative())
    if g.degree() > 0: p = p // g
    seq = [fmpq_poly(p), fmpq_poly(p.derivative())]
    while seq[-1].degree() > 0:
        r = seq[-2] % seq[-1]
        if r.degree() < 0: break
        seq.append(-r)
    def var(signs):
        s = [x for x in signs if x != 0]
        return sum(1 for a, b in zip(s, s[1:]) if a != b)
    lead = [(1 if q.coeffs()[-1] > 0 else -1) for q in seq]
    minus = [l*(-1)**q.degree() for l, q in zip(lead, seq)]
    return var(minus) - var(lead)
def hyp(g, d, n):
    co = [comb(d, j)*g[n+j] for j in range(d+1)]
    p = fmpq_poly([fmpq(c.numerator, c.denominator) for c in co]).numer()
    # certified root isolation (Arb enclosures); real roots are returned with exact zero imaginary part
    return sum(m for (z, m) in p.complex_roots() if z.imag == 0) == d
if __name__ == "__main__":
    Gamma = sys.argv[1]; beta = sys.argv[2]; nmax = int(sys.argv[3]); dcap = int(sys.argv[4])
    g = gammas(beta, Gamma, dcap + nmax + 5)
    b, G = Fr(beta), Fr(Gamma)
    D0 = float(((b*b+G*G)/(2*b*G))**2)
    print(f"Gamma={Gamma} beta={beta} sector bound D0=(|W|/Im W)^2={D0:.2f}", flush=True)
    for n in range(nmax+1):
        lo, hi = 1, dcap           # hyp(lo) true (d=1 always)
        if hyp(g, hi, n):
            print(f"  n={n}: hyperbolic for all d <= {dcap} (cap)", flush=True); continue
        while hi - lo > 1:
            mid = (lo+hi)//2
            if hyp(g, mid, n): lo = mid
            else: hi = mid
        print(f"  n={n}: d*(n) = {lo}   ratio d*/D0 = {lo/D0:.3f}", flush=True)
