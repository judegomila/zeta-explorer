# Controls and the Fejer identity check (float64 / Arb midpoints; MEASURED).
import sys, json, math, time, os
import numpy as np
from flint import acb, arb, ctx
ctx.prec = 80
OUT = os.path.dirname(os.path.abspath(__file__))
T = 1e6; H = 20.0; dt = 0.002
t = T + np.arange(int(round(H/dt)) + 1)*dt; n_t = len(t); L = math.log(T/(2*math.pi))
NMAX = 10**4
def chi_acb(s): return acb.pi()**(s - acb(0.5)) * (((acb(1) - s)/2).lgamma() - (s/2).lgamma()).exp()
def cplx(z): return complex(float(z.real.mid()), float(z.imag.mid()))
def line(f, sg, tt=t): return np.array([cplx(f(acb(sg, float(x)))) for x in tt])
sieve = np.ones(NMAX+1, bool); sieve[:2] = False
for p in range(2, int(NMAX**0.5)+1):
    if sieve[p]: sieve[p*p::p] = False
primes = [int(p) for p in np.nonzero(sieve)[0]]
items = []
for p in primes:
    q = p; k = 1
    while q <= NMAX: items.append((q, p, k)); q *= p; k += 1
items.sort()
def logP(sg, X, coef=lambda p, k: 1.0, tt=t):
    # sum_{n = p^k <= X} coef(p,k)/k * n^{-s}
    out = np.zeros(len(tt), complex)
    for n, p, k in items:
        if n > X: break
        out += coef(p, k)/k * n**(-sg) * np.exp(-1j*tt*math.log(n))
    return out
def crossings(W): return int(np.sum((W.imag[1:]*W.imag[:-1] < 0) & (W.real[1:] < 0) & (W.real[:-1] < 0)))
def summ(W): return {"neg_axis_crossings": crossings(W), "total_arg_change_over_pi": float((np.unwrap(np.angle(W))[-1]-np.unwrap(np.angle(W))[0])/math.pi),
                    "max_abs_W_minus_1": float(np.max(np.abs(W-1))), "frac_ReW_le_0": float(np.mean(W.real <= 0))}
res = {"T": T, "H": H, "L": L}
t0 = time.time()

# ---- zeta reference on two lines
sgs = {"d0.5/L": 0.5 + 0.5/L, "0.6": 0.6, "0.75": 0.75}
zl = {k: line(lambda s: s.zeta(), v) for k, v in sgs.items()}
cl = {k: line(chi_acb, v) for k, v in sgs.items()}
print("zeta lines", time.time()-t0, flush=True)
X = 1000
res["zeta"] = {k: summ(zl[k]/(lambda P: P + cl[k]*np.conj(P))(np.exp(logP(v, X)))) for k, v in sgs.items()}

# ---- U: random unimodular completely multiplicative twist (fixed seed)
rng = np.random.default_rng(20261118)
ph = {p: np.exp(2j*math.pi*rng.random()) for p in primes}
cu = lambda p, k: ph[p]**k
res["U"] = {}
for k, v in sgs.items():
    PU = np.exp(logP(v, X, cu)); GU = PU + cl[k]*np.conj(PU)
    res["U"][k] = {"min_abs_stage_over_P": float(np.min(np.abs(GU/PU))), "one_minus_max_abs_chi": float(1-np.max(np.abs(cl[k]))),
                   "zeta_against_U_stage": summ(zl[k]/GU)}
# stage zeros on the line for U (phase count) against zeta's stage
c12 = line(chi_acb, 0.5)
for name, cf in [("zeta", lambda p, k: 1.0), ("U", cu), ("liouville", lambda p, k: (-1.0)**k)]:
    Fph = -np.unwrap(np.angle(c12)) + 2*np.imag(logP(0.5, X, cf)); g = np.cos(Fph/2)
    res.setdefault("stage_zeros_on_line_X1000", {})[name] = int(np.sum(g[1:]*g[:-1] < 0))
z12 = line(lambda s: s.zeta(), 0.5)
Z = np.real(z12*np.exp(-1j*np.unwrap(np.angle(c12))/2)); res["zeta_zeros_in_window"] = int(np.sum(Z[1:]*Z[:-1] < 0))

# ---- WT: stage read at a translated height (alpha = 2 pi / L)
alpha = 2*math.pi/L; res["WT"] = {"alpha": alpha}
for k, v in sgs.items():
    P = np.exp(logP(v, X, tt=t+alpha)); G = P + cl[k]*np.conj(P)
    res["WT"][k] = summ(zl[k]/G)

# ---- Liouville twist: F = zeta(2s)/zeta(s), stage from lambda; no functional equation s <-> 1-s
res["liouville"] = {}
for k, v in sgs.items():
    F = line(lambda s: (2*s).zeta(), v)/zl[k]
    Pl = np.exp(logP(v, X, lambda p, kk: (-1.0)**kk))
    res["liouville"][k] = {"F_over_P": summ(F/Pl), "F_over_stage_with_zeta_chi": summ(F/(Pl + cl[k]*np.conj(Pl)))}
print("U, WT, Liouville", time.time()-t0, flush=True)

# ---- E_a = zeta(s+a) zeta(s-a), a = 0.2: zeros on Re s = 0.3 and 0.7
a = 0.2; res["E_a"] = {"a": a}
for k, v in [("0.6", 0.6), ("0.75", 0.75)]:
    F = line(lambda s: s.zeta(), v+a)*line(lambda s: s.zeta(), v-a)
    ch = line(chi_acb, v+a)*line(chi_acb, v-a)
    for XX in [100, 1000, 10000]:
        P = np.exp(logP(v+a, XX) + logP(v-a, XX)); G = P + ch*np.conj(P)
        r = summ(F/G); r["max_abs_chi_a"] = float(np.max(np.abs(ch))); r["min_abs_G_over_P"] = float(np.min(np.abs(G/P)))
        res["E_a"][f"sigma0={k},X={XX}"] = r
print("E_a", time.time()-t0, flush=True)

# ---- Fejer identity: F'_Y(t) = 2 log Y sum_gamma (1 - cos u)/u^2, u = (gamma - t) log Y
n0 = 1747146 - 260
zs = acb.zeta_zeros(n0, 700) if hasattr(acb, "zeta_zeros") else None
gam = np.array([float(z.imag.mid()) for z in zs]); res["fejer_identity"] = {"zeros_used": [float(gam[0]), float(gam[-1])]}
ts = T + 5 + np.arange(0, 10, 0.05)
NM2 = 10**6
sv = np.ones(NM2+1, bool); sv[:2] = False
for p in range(2, int(NM2**0.5)+1):
    if sv[p]: sv[p*p::p] = False
it2 = []
for p in np.nonzero(sv)[0]:
    q = int(p)
    while q <= NM2: it2.append((q, math.log(int(p)))); q *= int(p)
ns = np.array([x for x, y in it2], float); lam = np.array([y for x, y in it2]); ln = np.log(ns)
for Y in [100, 10**4, 10**6]:
    m = ns <= Y; w = lam[m]*(1 - ln[m]/math.log(Y))*ns[m]**-0.5
    S = np.array([np.sum(w*np.cos(tt*ln[m])) for tt in ts])
    Fp = np.log(ts/(2*math.pi)) - 2*S
    u = (gam[None, :] - ts[:, None])*math.log(Y)
    Kz = 2*math.log(Y)*np.sum((1-np.cos(u))/u**2, axis=1)
    tail = (L/math.pi)/math.log(Y)*(1/(ts-gam[0]) + 1/(gam[-1]-ts))   # mean density of zeros beyond the list, mean of 1-cos = 1
    pole = 2*np.real(Y**(0.5-1j*ts)/((0.5-1j*ts)**2*math.log(Y)))       # pole term of the explicit formula
    res["fejer_identity"][f"Y={Y}"] = {"min_Fprime_prime_side": float(Fp.min()), "max_abs_diff_prime_minus_zero_side": float(np.max(np.abs(Fp-(Kz+tail)))),
        "max_tail_correction": float(tail.max()), "max_abs_pole_term": float(np.max(np.abs(pole))), "mean_Fprime": float(Fp.mean())}
json.dump(res, open(os.path.join(OUT, "controls.json"), "w"), indent=1)
print(json.dumps(res, indent=1)); print("done", time.time()-t0)
