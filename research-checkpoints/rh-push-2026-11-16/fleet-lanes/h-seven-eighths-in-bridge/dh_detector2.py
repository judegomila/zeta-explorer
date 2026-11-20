# Which zeros does each sum see?  Resonance scan  R(beta,gamma) = | sum_n c(n) n^{-beta-i gamma} (1 - n/N) |  (Cesaro-weighted partial sum of
# the Dirichlet series of c at s = beta + i gamma; large iff s is near a pole of sum c(n) n^-s).
import numpy as np, math, mpmath as mp
N = 2_000_000
xi = (math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1)
per = np.array([0.0, 1.0, xi, -xi, -1.0]); n = np.arange(N+1); a = per[n % 5]
mu = np.ones(N+1, np.int8); mu[0] = 0
isp = np.ones(N+1, bool); isp[:2] = False
for p in range(2, N+1):
    if isp[p]:
        isp[2*p::p] = False; mu[p::p] *= -1
        if p*p <= N: mu[p*p::p*p] = 0
b = np.zeros(N+1); b[1] = 1.0
for d in range(1, N//2+1):
    if b[d] != 0.0:
        m = np.arange(2*d, N+1, d); b[m] -= b[d]*a[m//d]
ln = np.log(n[1:].astype(float)); w = 1 - n[1:]/N
def R(c, beta, gam): return abs(np.sum(c[1:]*w*np.exp(-(beta+1j*gam)*ln)))
# DH off-line zero and nearby zeros of L(s,chi) mod 5 (complex character) found numerically
mp.mp.dps = 20
def Lchi(s, conj=False):
    i = mp.mpc(0, 1); vals = [1, i, -i, -1] if not conj else [1, -i, i, -1]
    return 5**(-s)*sum(v*mp.zeta(s, mp.mpf(k)/5) for v, k in zip(vals, (1, 2, 3, 4)))
def fDH(s): return 5**(-s)*(mp.zeta(s, mp.mpf(1)/5)+xi*mp.zeta(s, mp.mpf(2)/5)-xi*mp.zeta(s, mp.mpf(3)/5)-mp.zeta(s, mp.mpf(4)/5))
rho = mp.findroot(fDH, mp.mpc(0.8085, 85.6993)); print("DH off-line zero:", rho)
zs = []
for conj in (False, True):
    ts = [mp.mpf(t) for t in np.arange(80, 92, 0.05)]
    v = [abs(Lchi(mp.mpc(0.5, t), conj)) for t in ts]
    for j in range(1, len(v)-1):
        if v[j] < v[j-1] and v[j] < v[j+1] and v[j] < 0.05:
            try:
                z = mp.findroot(lambda s: Lchi(s, conj), mp.mpc(0.5, ts[j])); zs.append((conj, z))
            except Exception as e: pass
for c, z in zs: print("  zero of L(s,chi%s):" % ("bar" if c else ""), mp.nstr(z, 12))
print("point                         R[Moebius twist mu*a]   R[Dirichlet inverse a^-1]")
pts = [("DH zero 0.8085+85.699i", float(rho.real), float(rho.imag))] + [("L(chi%s) zero t=%.3f" % ("bar" if c else "", float(z.imag)), 0.5, float(z.imag)) for c, z in zs] + [("generic 0.8085+83.0i", 0.8085, 83.0), ("generic 0.5+83.0i", 0.5, 83.0)]
for name, be, ga in pts:
    print(f"{name:28s}  {R(mu*a, be, ga):14.3f}  {R(b, be, ga):22.3f}")
print("growth in N at the DH zero (R at N/8, N/4, N/2, N), Dirichlet inverse vs Moebius twist:")
for M in (N//8, N//4, N//2, N):
    ww = np.clip(1 - n[1:]/M, 0, None)
    f = np.exp(-(float(rho.real)+1j*float(rho.imag))*ln)
    print(f"   N={M:8d}:  inverse {abs(np.sum(b[1:]*ww*f)):9.3f}   twist {abs(np.sum((mu*a)[1:]*ww*f)):9.3f}")

# P_a sign at the DH foot: Re Lambda'/Lambda(1/2 + a + i t) minimised over t near 85.7
def LamLog(s): return -(s/2)*mp.log(mp.pi/5) + mp.loggamma((s+1)/2) + mp.log(fDH(s))
def ReL(a, t):
    s = mp.mpc(0.5+a, t); h = mp.mpf('1e-6')
    return mp.re((LamLog(s+h)-LamLog(s-h))/(2*h))
print("shifted bridge sign at the DH pair (b = %.6f): min over t in [85.2, 86.2] of Re L(a + it)" % (float(rho.real)-0.5))
for aa in (0.10, 0.25, 0.30, 0.3086, 0.32, 0.375, 0.5):
    m = min(ReL(aa, 85.2+0.01*j) for j in range(101)); print(f"   a = {aa:6.4f}:  {mp.nstr(m, 8)}")
