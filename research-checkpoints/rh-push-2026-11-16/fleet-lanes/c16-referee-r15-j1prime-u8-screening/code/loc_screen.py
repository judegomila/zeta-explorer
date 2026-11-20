"""Referee recomputation of screening-lane numbers (local, own code). Memory: zeros6 as float64 = 16 MB; sieve to 1e7 = 10 MB."""
import sys, json, math, numpy as np, mpmath as mp
OUT, ZF = sys.argv[1], sys.argv[2]; R = {}
mp.mp.dps = 30
# --- primes
def primes(N):
    s = np.ones(N + 1, dtype=bool); s[:2] = False
    for i in range(2, int(N ** 0.5) + 1):
        if s[i]: s[i * i::i] = False
    return np.nonzero(s)[0].astype(np.float64)
P7 = primes(10 ** 7)
def li2(x, K=60):
    out = np.zeros_like(x); xk = np.ones_like(x)
    for k in range(1, K + 1):
        xk = xk * x; out += xk / (k * k)
    return out
# G1: Lambda constants
g0 = mp.euler; g1 = mp.stieltjes(1)
sp = float(np.sum(np.log(P7) ** 2 / (P7 - 1) ** 2))
tail = float(mp.quad(lambda x: mp.log(x) / x ** 2, [1e7, mp.inf]))          # sum_{p>X} log^2 p / p^2 ~ int log x / x^2 dx
Lam = float(g0 ** 2 + 2 * g1) + sp + tail
R["G1 Lambda (claim 1.573151)"] = Lam; R["G1 Lambda_5 (claim 2.220724)"] = Lam + math.log(5) ** 2 / 4
# G2: GUE Hill exponent on s < 0.2 from the small-s series of the GUE gap density
a = {2: math.pi ** 2 / 3, 4: -2 * math.pi ** 4 / 45, 6: math.pi ** 6 / 315, 7: -math.pi ** 6 / 4050}
c = 0.2; Pc = sum(v * c ** (j + 1) / (j + 1) for j, v in a.items()); Ic = sum(v * c ** (j + 1) / (j + 1) ** 2 for j, v in a.items())
R["G2 GUE Hill exponent, cut 0.2 (claim 2.962)"] = Pc / Ic
# G3: DH log-derivative coefficients
kap = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1); per = [0, 1, kap, -kap, -1]
N = 12; A = [0] + [per[n % 5] for n in range(1, N + 1)]; B = [0] * (N + 1); B[1] = 1.0
for n in range(2, N + 1): B[n] = -sum(A[d] * B[n // d] for d in range(2, n + 1) if n % d == 0)
C = [0] * (N + 1)
for n in range(1, N + 1): C[n] = sum(A[d] * math.log(d) * B[n // d] for d in range(1, n + 1) if n % d == 0)
R["G3 DH c(2), c(4), c(6) (claims 0.19691, -1.44223, 1.93636)"] = [C[2], C[4], C[6]]
R["G3 DH c(4) log 2 - c(2)^2 (claim -1.0385)"] = C[4] * math.log(2) - C[2] ** 2
# T-NR zero (both lanes)
w = -1.1 + math.sqrt(0.21); R["T-NR lowest zero of 1+2.2*3^(1/2-s)+3^(1-2s) (claims 0.9038+2.86i, 0.90375+2.8596i)"] = [0.5 - math.log(-w) / math.log(3), math.pi / math.log(3)]
R["T-NR factor on the line: min over t of c + 2 cos(t log 3), c = 2.2"] = 0.2
# S1: exact torus variance of arg zeta(1+it) and of arg L(1+it, chi5)
v = 0.5 * float(np.sum(li2(P7 ** -2.0, 12))) + 0.5 * float(mp.quad(lambda x: 1 / (x * x * mp.log(x)), [1e7, mp.inf]))
R["S1 var arg zeta(1+it), torus (claim 0.236847)"] = v; R["S1 var arg L(1+it,chi5), torus (claim 0.216644)"] = v - 0.5 * float(mp.polylog(2, mp.mpf(1) / 25))
# P3: Haar pointwise variance of log|F_P(1/2+it)|
for X in (1e2, 1e3, 1e4, 1e5, 1e6, 1e7):
    q = P7[P7 <= X]; val = 0.5 * float(np.sum(li2(1 / q, 200)))
    R["P3 Haar var log|F_P(1/2+it)|, P=%g" % X] = [val, 0.5 * math.log(math.log(X)) + 0.21]
# zeros
z = np.loadtxt(ZF); R["zeros loaded"] = int(len(z))
def theta(t): return t / 2 * np.log(t / (2 * math.pi)) - t / 2 - math.pi / 8 + 1 / (48 * t) + 7 / (5760 * t ** 3)
for n in (100000, len(z)):
    g = z[:n]; r = np.arange(1, n + 1) - 0.5 - theta(g) / math.pi
    R["S2 mean of (n-1/2)-theta(gamma_n)/pi minus 1/8, first %d zeros (claims 0.875007, 0.875000)" % n] = [float(r.mean() - 0.125), float(r.var())]
# remove one pair at height ~50000 : second-half mean of first 1e5 (claim 1.0000 -> -0.4592)
g = z[:100000]; i = int(np.searchsorted(g, 50000.0)); g2 = np.delete(g, [i, i + 1]); r2 = np.arange(1, len(g2) + 1) - 0.5 - theta(g2) / math.pi
r1 = np.arange(1, len(g) + 1) - 0.5 - theta(g) / math.pi
R["S2 second-half mean, full / one pair removed at 50000 (claims 1.0000, -0.4592)"] = [float(r1[50000:].mean()), float(r2[len(g2) // 2:].mean())]
# G2b / G5: Hill exponent and lag-1 gap autocorrelation on the first 2e6 zeros, local mean window 2001
def local_norm(zz, w=2001):
    gp = np.diff(zz); n = len(gp); hw = w // 2; cs = np.concatenate([[0.0], np.cumsum(gp)])
    i = np.arange(n); lo = np.maximum(0, i - hw); hi = np.minimum(n, i + hw + 1); return gp / ((cs[hi] - cs[lo]) / (hi - lo))
gn = local_norm(z); s = gn[gn < 0.2]; k = len(s) / np.sum(np.log(0.2 / s))
R["G2b Hill exponent zeta first 2,001,052 zeros (claim 2.952 +- 0.025)"] = [float(k), int(len(s)), float(k / math.sqrt(len(s)))]
gc = gn - gn.mean(); R["G5 C(1) gap autocorrelation, first 2e6 zeros (claim -0.349)"] = float((gc[1:] * gc[:-1]).mean() / (gc * gc).mean())
R["G count of normalised gaps < 0.2 over GUE expectation (first 2e6)"] = float(len(s) / (len(gn) * Pc))
# G4: coefficients from zeros, cos^4 window
T = z[-1]; W = np.cos(math.pi * z / (2 * T)) ** 4; intW = 2 * T * 3 / 8
for n in (2, 3, 4, 6, 7, 10, 37):
    R["G4 c^(%d) from 2e6 zeros (Lambda(n) or 0)" % n] = float(-math.sqrt(n) * 2 * np.sum(W * np.cos(z * math.log(n))) / (intW / (2 * math.pi)))
json.dump(R, open(OUT, "w"), indent=1); print(json.dumps(R, indent=1))
