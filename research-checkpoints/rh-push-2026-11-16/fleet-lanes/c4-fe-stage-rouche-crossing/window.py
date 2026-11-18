# c4-fe-stage-rouche-crossing: float64 window scan (MEASURED, not certified).
# zeta and chi from Arb (python-flint) midpoints; prime sums in numpy.
import sys, json, math, time
import numpy as np
from flint import acb, arb, ctx
ctx.prec = 80
T = float(sys.argv[1]) if len(sys.argv) > 1 else 1e6
H = float(sys.argv[2]) if len(sys.argv) > 2 else 40.0
NMAX = int(float(sys.argv[3])) if len(sys.argv) > 3 else 10**6
dt = 0.002
t = T + np.arange(int(round(H/dt)) + 1) * dt
n_t = len(t)
L = math.log(T/(2*math.pi))
ds = [0.0, 0.25/L, 0.5/L, 1.0/L, 2.0/L, 0.1, 0.25]
sig = [0.5 + d for d in ds]
print("T", T, "H", H, "NMAX", NMAX, "points", n_t, "L", L, "planned arrays: about", 3*len(sig)*n_t*16*14/1e6, "MB", flush=True)

def chi(s):
    # chi(s) = pi^(s-1/2) Gamma((1-s)/2)/Gamma(s/2)
    return (acb.pi()**(s - acb(0.5)) * (((acb(1) - s)/2).lgamma() - (s/2).lgamma()).exp())

t0 = time.time()
zeta = np.empty((len(sig), n_t), complex); chis = np.empty((len(sig), n_t), complex)
for i, sg in enumerate(sig):
    for j in range(n_t):
        s = acb(sg, t[j])
        z = s.zeta(); c = chi(s)
        zeta[i, j] = complex(float(z.real.mid()), float(z.imag.mid()))
        chis[i, j] = complex(float(c.real.mid()), float(c.imag.mid()))
print("zeta/chi done", time.time() - t0, flush=True)

# prime powers n <= NMAX
sieve = np.ones(NMAX + 1, bool); sieve[:2] = False
for p in range(2, int(NMAX**0.5) + 1):
    if sieve[p]: sieve[p*p::p] = False
primes = np.nonzero(sieve)[0]
items = []
for p in primes:
    q = int(p)
    while q <= NMAX:
        items.append((q, math.log(int(p)))); q *= int(p)
items.sort()
ns = np.array([a for a, b in items], float); lam = np.array([b for a, b in items])
logn = np.log(ns)
Xs = [x for x in [2, 3, 5, 7, 11, 30, 100, 1000, 10**4, 10**5, 10**6, 10**7] if x <= NMAX]
A = np.zeros((len(sig), n_t), complex); B = np.zeros((len(sig), n_t), complex); C = np.zeros(n_t, complex)
snapA, snapB, snapC, triv = {}, {}, {}, {}
sig_arr = np.array(sig)
pos = 0; trivB = 0.0
bs = 256
for X in Xs:
    end = int(np.searchsorted(ns, X, side='right'))
    while pos < end:
        e = min(end, pos + bs)
        ph = np.exp(-1j * np.outer(logn[pos:e], t))           # (b, n_t)
        for i, sg in enumerate(sig):
            w = lam[pos:e] * ns[pos:e]**(-sg)
            B[i] += w @ ph
            A[i] += (w/logn[pos:e]) @ ph
        C += (lam[pos:e]*logn[pos:e]*ns[pos:e]**(-0.5)) @ ph
        trivB += float(np.sum(lam[pos:e]*ns[pos:e]**(-0.5)))
        pos = e
    snapA[X] = A.copy(); snapB[X] = B.copy(); snapC[X] = C.copy(); triv[X] = trivB
    print("X", X, "terms", end, time.time() - t0, flush=True)

Lt = np.log(t/(2*np.pi))
# zeta zeros in window via Hardy Z
phi = np.unwrap(np.angle(chis[0]))/2
Z = np.real(zeta[0]*np.exp(-1j*phi))
nz = int(np.sum(Z[1:]*Z[:-1] < 0))
out = {"T": T, "H": H, "L": L, "zeta_sign_changes": nz, "sig": sig, "rows": [], "lemma1": []}

def logP(kind, X, i):
    if kind == "sharp": return snapA[X][i]
    if kind == "fejer": return snapA[X][i] - snapB[X][i]/math.log(X)
    if kind == "trap":  # Gonek Lambda_X, needs X^2 <= NMAX: 2 tri(X^2) - tri(X)
        X2 = X*X
        return 2*(snapA[X2][i] - snapB[X2][i]/math.log(X2)) - (snapA[X][i] - snapB[X][i]/math.log(X))
def dsum(kind, X):   # sum w(n) Lambda(n) n^{-1/2-it}
    if kind == "sharp": return snapB[X][0]
    if kind == "fejer": return snapB[X][0] - snapC[X]/math.log(X)
    if kind == "trap":
        X2 = X*X
        return 2*(snapB[X2][0] - snapC[X2]/math.log(X2)) - (snapB[X][0] - snapC[X]/math.log(X))
def trivial(kind, X):
    m = ns <= (X*X if kind == "trap" else X)
    if kind == "sharp": w = np.ones(m.sum())
    elif kind == "fejer": w = 1 - logn[m]/math.log(X)
    else: w = np.minimum(1.0, 2 - logn[m]/math.log(X))
    return float(np.sum(w*lam[m]*ns[m]**-0.5))

for kind in ["sharp", "fejer", "trap"]:
    for X in Xs:
        if kind == "trap" and X*X not in snapA: continue
        if kind == "fejer" and X < 3: continue
        # Lemma 1: phase derivative F' = log(t/2pi) - 2 Re sum
        Fp = Lt - 2*np.real(dsum(kind, X))
        lp = logP(kind, X, 0)
        Fph = -np.unwrap(np.angle(chis[0])) + 2*np.imag(lp)   # F_X(t) up to a constant multiple of 2 pi
        g = np.cos(Fph/2)
        nst = int(np.sum(g[1:]*g[:-1] < 0))
        out["lemma1"].append({"kind": kind, "X": X, "trivial_sum": trivial(kind, X), "half_L": L/2,
            "max_Re_sum": float(np.max(np.real(dsum(kind, X)))), "min_Fprime": float(Fp.min()),
            "frac_Fprime_neg": float(np.mean(Fp < 0)), "stage_zeros": nst, "zeta_zeros": nz,
            "dF_over_2pi": float((Fph[-1]-Fph[0])/(2*np.pi))})
        for i, sg in enumerate(sig):
            if i == 0: continue
            P = np.exp(logP(kind, X, i))
            G = P + chis[i]*np.conj(P)
            W = zeta[i]/G
            W0 = zeta[i]/P
            cross = int(np.sum((W.imag[1:]*W.imag[:-1] < 0) & (W.real[1:] < 0) & (W.real[:-1] < 0)))
            cross0 = int(np.sum((W0.imag[1:]*W0.imag[:-1] < 0) & (W0.real[1:] < 0) & (W0.real[:-1] < 0)))
            out["rows"].append({"kind": kind, "X": X, "d": ds[i], "sigma": sg,
                "max_abs_W_minus_1": float(np.max(np.abs(W-1))), "frac_strict_fail": float(np.mean(np.abs(W-1) >= 1)),
                "max_abs_argW": float(np.max(np.abs(np.angle(W)))), "neg_axis_crossings": cross,
                "noFE_max_abs_W_minus_1": float(np.max(np.abs(W0-1))), "noFE_frac_strict_fail": float(np.mean(np.abs(W0-1) >= 1)),
                "noFE_max_abs_arg": float(np.max(np.abs(np.angle(W0)))), "noFE_crossings": cross0,
                "max_abs_chi": float(np.max(np.abs(chis[i])))})
np.savez_compressed(f"window_T{T:.0e}.npz", t=t, zeta=zeta, chis=chis, sig=np.array(sig),
    **{f"A{X}": snapA[X] for X in Xs}, **{f"B{X}": snapB[X] for X in Xs})
json.dump(out, open(f"window_T{T:.0e}.json", "w"), indent=1)
print("done", time.time() - t0)
