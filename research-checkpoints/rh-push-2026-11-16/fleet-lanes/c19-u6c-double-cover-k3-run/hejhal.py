"""Hecke eigenvalues of the first odd Maass cusp form of SL2(Z) by Hejhal's method (no external data).
f(z) = sum_n a_n sqrt(y) K_{iR}(2 pi n y) sin(2 pi n x), a_1 = 1. K scaled by exp(pi R/2). flint for Bessel."""
import math, json, sys
import numpy as np
from flint import acb, arb, ctx
ctx.prec = 100

def Kt(R, x):
    return float((acb(x).bessel_k(acb(0, R)) * (acb.pi()*R/2).exp()).real.mid())

def pullback(x, y):
    while True:
        x -= round(x)
        if x*x + y*y < 1 - 1e-15:
            n = x*x + y*y; x, y = -x/n, y/n
        else: return x, y

def system(R, Y, M, Q):
    xs = [(j - 0.5)/(2*Q) for j in range(1, 2*Q+1)]
    pb = [pullback(x, Y) for x in xs]
    V = np.zeros((M, M))
    for m in range(1, M+1):
        col = np.array([math.sqrt(ys)*Kt(R, 2*math.pi*m*ys)*math.sin(2*math.pi*m*xsr) if 2*math.pi*m*ys < R + 45 else 0.0 for xsr, ys in pb])
        for n in range(1, M+1):
            V[n-1, m-1] = sum(col[j]*math.sin(2*math.pi*n*xs[j]) for j in range(2*Q))/Q
    for n in range(1, M+1): V[n-1, n-1] -= math.sqrt(Y)*Kt(R, 2*math.pi*n*Y)
    return V

def solve(R, Y, M, Q):
    V = system(R, Y, M, Q)
    a = np.linalg.lstsq(V[:, 1:], -V[:, 0], rcond=None)[0]   # all M rows, unknowns a_2..a_M
    return np.concatenate([[1.0], a])

def hecke_resid(a):
    return max(abs(a[3] - (a[1]**2 - 1)), abs(a[5] - a[1]*a[2]), abs(a[7] - (a[1]**3 - 2*a[1])), abs(a[8] - (a[2]**2 - 1)), abs(a[9] - a[1]*a[4]))

def refine_R(R0, M=14, Q=40):
    # secant on the difference of a_2 between two heights
    def g(R):
        a = solve(R, 0.21, M, Q); b = solve(R, 0.26, M, Q)
        return a[1] - b[1], a
    r0, r1 = R0 - 1e-4, R0 + 1e-4
    g0, _ = g(r0); g1, _ = g(r1)
    for it in range(8):
        r2 = r1 - g1*(r1 - r0)/(g1 - g0)
        r0, g0 = r1, g1
        r1 = r2; g1, a = g(r1)
        if abs(r1 - r0) < 1e-13: break
    return r1, a

def extend(R, a_low, nmax, Q=260):
    """a_n for n up to nmax from f on low horocycles; f evaluated by pullback with the low coefficients."""
    out = list(a_low[:10])
    M0 = len(a_low)
    for n in range(11, nmax+1):
        best = None
        for fac in (0.55, 0.65, 0.75, 0.85, 0.95):
            Y = fac*R/(2*math.pi*n)
            k = Kt(R, 2*math.pi*n*Y)
            if best is None or abs(k) > abs(best[1]): best = (Y, k)
        Y, k = best
        tot = 0.0
        for j in range(1, 2*Q+1):
            x = (j - 0.5)/(2*Q)
            xs, ys = pullback(x, Y)
            fv = sum(a_low[m-1]*Kt(R, 2*math.pi*m*ys)*math.sin(2*math.pi*m*xs) for m in range(1, M0+1) if 2*math.pi*m*ys < R + 45)*math.sqrt(ys)
            tot += fv*math.sin(2*math.pi*n*x)
        out.append(tot/Q/(math.sqrt(Y)*k))
    return out

if __name__ == "__main__":
    R, a = refine_R(float(sys.argv[1]) if len(sys.argv) > 1 else 9.5336952613536)
    print("R =", repr(R), "a2,a3,a5,a7 =", a[1], a[2], a[4], a[6], "hecke resid", hecke_resid(a), flush=True)
    full = extend(R, a, 47)
    # multiplicativity checks on the extended list
    chk = max(abs(full[n*m-1] - full[n-1]*full[m-1]) for n in range(2, 8) for m in range(2, 24) if math.gcd(n, m) == 1 and n*m <= 47)
    print("max multiplicativity defect n*m <= 47:", chk)
    primes = [p for p in range(2, 48) if all(p % t for t in range(2, int(p**.5)+1))]
    json.dump(dict(R=R, lam={p: full[p-1] for p in primes}, hecke_resid=hecke_resid(a), mult_defect=chk, a=full), open('hejhal_odd1.json', 'w'), indent=1)
    print({p: round(full[p-1], 10) for p in primes})
