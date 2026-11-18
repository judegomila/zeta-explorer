# Direct check of the gauge-fixed (forcing-free) renewal identity from prime data.
# R(X) = S(X) - 2 sqrt X,  S(X) = sum_{n<=X} Lambda(n) n^{-1/2}.
# mu' = mu_{<=U} - c2 delta_2 - c3 delta_3 with M'(1) = M'(1/2) = 0;  a' = delta - 1*mu'.
# Xi'(X) := R(X) - sum_{2<=m<=X} a'(m) m^{-1/2} R(X/m)     (claimed |Xi'| <= ||mu'||_1 (4+log X)/sqrt X)
import sys, json, math, numpy as np
X = int(float(sys.argv[1])); mode = sys.argv[2]  # mode: q (U=X^{1/4}) or h (U = sqrt X / log X)
print("planned allocation: about %.2f GB" % (X*8*3/1e9), flush=True)
G = 0.5772156649015329; Z1 = -1.4603545088095868; ZP = -3.9226461392091517  # gamma, zeta(1/2), zeta'(1/2)
# sieve Lambda
N = X
isp = np.ones(N+1, dtype=bool); isp[:2] = False
for p in range(2, int(N**0.5)+1):
    if isp[p]: isp[p*p::p] = False
primes = np.nonzero(isp)[0]
lam = np.zeros(N+1); lam[primes] = np.log(primes)
for p in primes[primes <= int(N**0.5)]:
    q = int(p)*int(p); lp = math.log(p)
    while q <= N: lam[q] = lp; q *= int(p)
del isp
n = np.arange(N+1, dtype=np.float64); n[0] = 1.0
term = lam/np.sqrt(n); del lam
# accurate cumulative sum by chunks
S = np.empty(N+1); CH = 1 << 14; base = 0.0
for i in range(0, N+1, CH):
    c = term[i:i+CH]; S[i:i+CH] = base + np.cumsum(c); base += float(np.sum(c))
del term
def Rf(y):  # y float array >= 1
    return S[np.floor(y+1e-9).astype(np.int64)] - 2*np.sqrt(y)
U = int(round(X**0.25)) if mode == 'q' else int(math.sqrt(X)/math.log(X))
# mobius up to U
mu = np.ones(U+1, dtype=np.int64); mu[0] = 0
for p in range(2, U+1):
    if all(p % q for q in range(2, int(p**0.5)+1)):
        mu[p::p] *= -1; mu[p*p::p*p] = 0
d = np.arange(1, U+1)
mU = float(np.sum(mu[1:]/d)); MU = float(np.sum(mu[1:]/np.sqrt(d)))
# solve c2/2 + c3/3 = mU ; c2/sqrt2 + c3/sqrt3 = MU
A = np.array([[0.5, 1/3], [2**-0.5, 3**-0.5]]); c2, c3 = np.linalg.solve(A, [mU, MU])
# kernel a'(m), m <= X
a = np.zeros(N+1)
for dd in range(1, U+1):
    if mu[dd]: a[dd::dd] -= mu[dd]
a0 = a.copy(); a0[1] = 0.0       # a_U (untuned), a_U(1)=0
a[2::2] += c2; a[3::3] += c3; a[1] = 0.0; a[0] = 0.0; a0[0] = 0.0
RX = float(S[N] - 2*math.sqrt(X))
V = U
def K(aa, mmax, sub):
    tot = 0.0; mass = 0.0; CHK = 1 << 22
    for i in range(2, mmax+1, CHK):
        m = np.arange(i, min(i+CHK, mmax+1), dtype=np.float64)
        w = aa[i:i+len(m)]/np.sqrt(m)
        r = Rf(X/m) - sub
        tot += float(np.sum(w*r)); mass += float(np.sum(np.abs(w)))
    return tot, mass
K1, mass1 = K(a, N, 0.0)            # gauge-fixed, V = 1
K0, mass0 = K(a0, N, 0.0)           # untuned, V = 1
RV = float(S[V] - 2*math.sqrt(V))
K1V, mass1V = K(a, N//V, RV)        # gauge-fixed, Vaughan-truncated increments
K0V, mass0V = K(a0, N//V, RV)
l1 = float(np.sum(np.abs(mu[1:]))) + abs(c2) + abs(c3)
out = dict(X=X, mode=mode, U=U, m_U=mU, M_U_half=MU, c2=float(c2), c3=float(c3), R_X=RX, R_V=RV,
  K_gauge=K1, Xi_gauge=RX-K1, Xi_gauge_bound=l1*(4+math.log(X))/math.sqrt(X), kappa_abs_gauge=mass1,
  K_untuned=K0, Xi_untuned=RX-K0, Xi_untuned_pred=-(4+2*G)*math.sqrt(X)*mU - ZP*MU, kappa_abs_untuned=mass0,
  incr_gauge_residual=(RX-RV)-K1V, kappa_abs_gauge_V=mass1V,
  incr_untuned_residual=(RX-RV)-K0V, kappa_abs_untuned_V=mass0V)
print(json.dumps(out)); open("verify_%s_%.0e.json" % (mode, X), "w").write(json.dumps(out, indent=1))
