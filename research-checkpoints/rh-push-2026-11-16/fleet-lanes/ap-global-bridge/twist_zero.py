# Control U: completely multiplicative unimodular chi (a point of the Bohr torus T^P)
# with zeta_chi(s) = sum chi(n) n^{-s} having a zero at prescribed s0, 1/2 < Re s0 < 1.
# chi(p_k) = p^{i gamma} exp(i eps_k phi_p), cos phi_p = -p^{beta-1}, eps_k = (-1)^k.
# Check: smoothed Dirichlet sum S_N(s) = sum chi(n) n^{-s} e^{-n/N}  vs  closed form
#        F(s) = exp(h0(w) + R(s) + h(s)) / zeta(w),  w = s - s0 + 1.
import sys, json, numpy as np, mpmath as mp
N = int(float(sys.argv[1])); beta = 0.9; gamma = 3.0; s0 = complex(beta, gamma)
print("planned allocation: sieve bool %d MB, theta float64 %d MB, coeff complex128 %d MB" % (N//2**20, 8*N//2**20, 16*N//2**20), flush=True)
sv = np.ones(N+1, dtype=bool); sv[:2] = False
for i in range(2, int(N**0.5)+1):
    if sv[i]: sv[i*i::i] = False
primes = np.nonzero(sv)[0]; del sv
lp = np.log(primes.astype(np.float64))
eps = np.where(np.arange(len(primes)) % 2 == 0, 1.0, -1.0)
c = -np.exp((beta-1)*lp); phi = np.arccos(c)
thp = gamma*lp + eps*phi            # arg chi(p)
theta = np.zeros(N+1)
for p, t in zip(primes.tolist(), thp.tolist()):
    q = p
    while q <= N:
        theta[q::q] += t
        q *= p
n = np.arange(1, N+1, dtype=np.float64); ln = np.log(n)
a = np.exp(1j*theta[1:]); del theta
def S(s, M):
    return complex(np.sum(a*np.exp(-s*ln - n/M)))
chip = np.exp(1j*thp)
def Fpred(s):
    w = s - s0 + 1
    z = chip*np.exp(-s*lp)                      # chi(p) p^{-s}
    h = np.sum(-np.log(1-z) - z)                # k>=2 terms of log Euler factor
    y = np.exp(-w*lp)
    h0 = np.sum(-np.log(1-y) - y)
    R = np.sum(1j*eps*np.sin(phi)*np.exp(-(s-1j*gamma)*lp))
    return complex(np.exp(h0 + R + h)) / complex(mp.zeta(mp.mpc(w.real, w.imag))) if abs(w-1) > 1e-12 else 0j
out = {"N": N, "s0": [beta, gamma], "rows": []}
pts = [s0, s0+0.05, s0+0.05j, s0-0.05, s0-0.05j, complex(0.75, 3.4), complex(0.95, 2.5), complex(1.3, 3.0)]
for s in pts:
    row = {"s": [s.real, s.imag], "pred": abs(Fpred(s))}
    for M in (N/160, N/40):
        v = S(s, M); row["S_M=%.0f" % M] = [v.real, v.imag]; row["err_M=%.0f" % M] = abs(v - Fpred(s))
    out["rows"].append(row); print(row, flush=True)
# winding number of S and of Fpred on the circle |s - s0| = 0.08
K = 48; M = N/40
for name, f in (("S", lambda s: S(s, M)), ("Fpred", Fpred)):
    vals = [f(s0 + 0.08*np.exp(2j*np.pi*k/K)) for k in range(K+1)]
    wind = sum(np.angle(vals[k+1]/vals[k]) for k in range(K))/(2*np.pi)
    out["winding_"+name] = wind; print("winding", name, wind, "min|.| on circle", min(abs(v) for v in vals), flush=True)
json.dump(out, open("twist_zero_%d.json" % N, "w"), indent=1)
