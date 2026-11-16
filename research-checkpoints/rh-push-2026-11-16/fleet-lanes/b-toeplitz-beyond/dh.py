# Davenport-Heilbronn control for the damped Weil form (float Ritz, prime/coefficient side only).
# f(s) = sum a(n) n^{-s}, a periodic mod 5 = (1, kappa, -kappa, -1, 0); xi_DH(s) = (5/pi)^{s/2} Gamma((s+1)/2) f(s).
# -f'/f = sum c(n) n^{-s}; no pole.  Known off-line zero: 0.808517 + 85.699348 i (beta' = 0.3085).
import numpy as np, math, sys
from galerkin import build
kap = (math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1)
def dh_c(Nmax):
    a = [0.0]*(Nmax+1)
    for n in range(1, Nmax+1): a[n] = (0.0, 1.0, kap, -kap, -1.0)[n % 5]
    c = [0.0]*(Nmax+1)
    divs = [[] for _ in range(Nmax+1)]
    for d in range(2, Nmax+1):
        for m in range(2*d, Nmax+1, d): divs[m].append(d)
    for n in range(2, Nmax+1):
        s = a[n]*math.log(n)
        for d in divs[n]: s -= c[d]*a[n//d]
        c[n] = s
    return c
if __name__ == '__main__':
    Tres = float(sys.argv[1]) if len(sys.argv) > 1 else 110.0
    for twoa in (math.log(11), 3.0, 3.44, math.log(100), math.log(400), 7.0):
        a = twoa/2; N = int(1.25*a*Tres)+40
        Nmax = int(math.exp(twoa)); c = dh_c(Nmax); w = {n: c[n] for n in range(2, Nmax+1)}
        for theta in (0.0, 0.1, 0.2, 0.3, 0.35, 0.5):
            _, Ma, Mr = build(a, theta, N, lam_weights=w, pole=False, arch=5)
            evD = np.linalg.eigvalsh(Ma - Mr)[0]
            Mp, Maz, Mrz = build(a, theta, N)
            evZ = np.linalg.eigvalsh(Mp + Maz - Mrz)[0]
            print(f"2a={twoa:.3f} N={N} theta={theta:.2f}  lam_min DH={evD: .5e}   zeta={evZ: .5e}", flush=True)
