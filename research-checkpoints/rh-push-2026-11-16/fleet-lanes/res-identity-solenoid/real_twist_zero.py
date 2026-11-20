# Control U_R: completely multiplicative eps with values +-1 (a 2-torsion point of the Bohr torus)
# such that zeta_eps(s) = sum eps(n) n^{-s} has simple zeros at s0 and conj(s0), 1/2 < Re s0 < 1.
# Sigma-delta choice: D = running sum of (eps_p - m_p), m_p = clip(-2 p^{beta-1} cos(gamma log p), -1, 1);
# eps_p = -1 if D >= 0 else +1, so |D| <= 2.
# Check: smoothed sum S_M(s) = sum eps(n) n^{-s} e^{-n/M} against
#   F(s) = exp(R(s) + h(s) + h0(w1) + h0(w2)) / (zeta(w1) zeta(w2)), w1 = s - s0 + 1, w2 = s - conj(s0) + 1.
import sys, json, numpy as np, mpmath as mp
N = int(float(sys.argv[1])); beta = float(sys.argv[2]); gamma = float(sys.argv[3]); s0 = complex(beta, gamma)
print("planned allocation: sieve %d MB, coeff int8 %d MB, n/ln float64 2x%d MB, complex temporaries 3x%d MB"
      % (N//2**20, N//2**20, 8*N//2**20, 16*N//2**20), flush=True)
sv = np.ones(N+1, dtype=bool); sv[:2] = False
for i in range(2, int(N**0.5)+1):
    if sv[i]: sv[i*i::i] = False
primes = np.nonzero(sv)[0]; del sv
lp = np.log(primes.astype(np.float64))
mtrue = -2*np.exp((beta-1)*lp)*np.cos(gamma*lp)
m = np.clip(mtrue, -1, 1)
eps = np.empty(len(primes)); D = 0.0; Dmax = 0.0
for k, mk in enumerate(m.tolist()):
    e = -1.0 if D >= 0 else 1.0
    eps[k] = e; D += e - mk; Dmax = max(Dmax, abs(D))
print("primes", len(primes), "clipped", int(np.sum(np.abs(mtrue) > 1)), "max|D|", Dmax, "mean eps", eps.mean(), flush=True)
a = np.ones(N+1, dtype=np.int8)
for p, e in zip(primes.tolist(), eps.tolist()):
    if e < 0:
        q = p
        while q <= N:
            a[q::q] *= -1
            q *= p
n = np.arange(1, N+1, dtype=np.float64); ln = np.log(n); af = a[1:].astype(np.float64); del a
def S(s, M): return complex(np.sum(af*np.exp(-s*ln - n/M)))
def Fpred(s):
    w1 = s - s0 + 1; w2 = s - s0.conjugate() + 1
    z = eps*np.exp(-s*lp); h = np.sum(-np.log(1-z) - z)
    R = np.sum((eps - mtrue)*np.exp(-s*lp))
    tot = R + h
    for w in (w1, w2):
        y = np.exp(-w*lp); tot += np.sum(-np.log(1-y) - y)
    den = complex(mp.zeta(mp.mpc(w1.real, w1.imag)))*complex(mp.zeta(mp.mpc(w2.real, w2.imag)))
    return complex(np.exp(tot))/den
out = {"N": N, "s0": [beta, gamma], "maxD": Dmax, "rows": []}
for s in [s0, s0.conjugate(), s0+0.05, s0+0.05j, complex(0.75, gamma+0.4), complex(1.3, gamma), complex(1.3, 0.0), complex(0.8, 0.0)]:
    row = {"s": [s.real, s.imag]}
    row["pred"] = abs(Fpred(s)) if abs(s-s0) > 1e-9 and abs(s-s0.conjugate()) > 1e-9 else 0.0
    for M in (N/640, N/160, N/40):
        v = S(s, M); row["absS_M=%.0f" % M] = abs(v)
        row["err_M=%.0f" % M] = abs(v - (Fpred(s) if row["pred"] else 0))
    out["rows"].append(row); print(row, flush=True)
K = 48; M = N/40
for name, f in (("S", lambda s: S(s, M)), ("Fpred", Fpred)):
    for c in (s0, s0.conjugate()):
        vals = [f(c + 0.08*np.exp(2j*np.pi*k/K)) for k in range(K+1)]
        wind = sum(np.angle(vals[k+1]/vals[k]) for k in range(K))/(2*np.pi)
        out["winding_%s_%+.0f" % (name, c.imag)] = wind
        print("winding", name, c, wind, "min|.|", min(abs(v) for v in vals), flush=True)
json.dump(out, open("real_twist_zero_%d_%s_%s.json" % (N, beta, gamma), "w"), indent=1)
