# Closed-form evaluation at X = U^4 for every U <= 1e8 (X up to 1e32).
# Needs mu and Lambda only up to 1e8.
#  untuned Vaughan forcing, leading term (source Prop 3.1):  Xi ~ -2 sqrt X m(U) eps1(U) + R(V)(1 - zeta(1/2) M_U(1/2)) - zeta'(1/2) M_U(1/2)
#  gauge-fixed forcing: |Xi'| <= (Q(U) + |c2| + |c3|) (4 + log X)/sqrt X      (Proposition G)
import json, math, numpy as np
N = 10**8
print("planned allocation: about %.1f GB peak" % (N*(4+8+8+8+8+2)/1e9), flush=True)
G = 0.5772156649015329; Z1 = -1.4603545088095868; ZP = -3.9226461392091517
P = int(N**0.5)
sm = np.ones(P+1, dtype=bool); sm[:2] = False
for p in range(2, int(P**0.5)+1):
    if sm[p]: sm[p*p::p] = False
sp = np.nonzero(sm)[0]
mu = np.ones(N+1, dtype=np.int8); mu[0] = 0
lg = np.zeros(N+1, dtype=np.float32)
for p in sp:
    p = int(p); mu[p::p] *= -1; mu[p*p::p*p] = 0; lg[p::p] += np.float32(math.log(p))
CH = 1 << 20
def nchunk(i): return np.arange(i, min(i+CH, N+1), dtype=np.float64)
big = np.empty(N+1, dtype=bool)
for i in range(0, N+1, CH):
    nn = nchunk(i); nn[nn == 0] = 1.0
    big[i:i+CH] = (np.log(nn) - lg[i:i+CH]) > 1.0
mu[big] *= -1
isprime = (lg < 0.5); isprime[:2] = False; isprime[sp] = True
del lg, big
pp = {}                                   # prime powers p^k, k >= 2
for p in sp:
    p = int(p); q = p*p
    while q <= N: pp[q] = math.log(p); q *= p
ppi = np.array(sorted(pp), dtype=np.int64); ppv = np.array([pp[k] for k in sorted(pp)])
def ccum(f, dtype=np.float64):
    out = np.empty(N+1, dtype=dtype); base = 0.0; SUB = 1 << 14
    for i in range(0, N+1, CH):
        x = f(i)
        for j in range(0, len(x), SUB):
            c = x[j:j+SUB]; out[i+j:i+j+len(c)] = base + np.cumsum(c); base += float(np.sum(c))
    return out
def fn(i):
    nn = nchunk(i); nn[nn == 0] = 1.0; return nn
def lamchunk(i):
    nn = fn(i); l = np.where(isprime[i:i+CH], np.log(nn), 0.0)
    lo = np.searchsorted(ppi, i); hi = np.searchsorted(ppi, i+len(nn))
    l[ppi[lo:hi]-i] = ppv[lo:hi]; return l, nn
Q = ccum(lambda i: np.abs(mu[i:i+CH]).astype(np.float64), np.float32)
m1 = ccum(lambda i: mu[i:i+CH]/fn(i))
Mh = ccum(lambda i: mu[i:i+CH]/np.sqrt(fn(i)))
del mu
def f_e(i):
    l, nn = lamchunk(i); return l/nn
def f_r(i):
    l, nn = lamchunk(i); return l/np.sqrt(nn)
eps1 = ccum(f_e); Rv = ccum(f_r)
det = 0.5*3**-0.5 - (1/3)*2**-0.5
def block(a, b):
    U = np.arange(a, b+1, dtype=np.float64); s = slice(a, b+1)
    e1 = eps1[s] - np.log(U) + G; rv = Rv[s] - 2*np.sqrt(U); sq = U*U; lX = 4*np.log(U)
    Xi = -2*sq*m1[s]*e1 + rv*(1 - Z1*Mh[s]) - ZP*Mh[s]
    F0 = -(4+2*G)*sq*m1[s] - ZP*Mh[s]
    c2 = (m1[s]*3**-0.5 - Mh[s]/3)/det; c3 = (0.5*Mh[s] - 2**-0.5*m1[s])/det
    bd = (Q[s] + np.abs(c2) + np.abs(c3))*(4+lX)/sq
    return U, Xi, F0, c2, c3, bd, rv
res = {"N": N, "rows": []}
best = (0, 0.0)
for k in range(1, 8):
    a, b = 10**k, 10**(k+1)
    acc = None
    for lo in range(a, b+1, 10**7):
        hi = min(lo + 10**7 - 1, b)
        U, Xi, F0, c2, c3, bd, rv = block(lo, hi)
        j = int(np.argmax(np.abs(Xi)))
        cur = dict(mx=float(abs(Xi[j])), at=lo+j, sgn=float(Xi[j]), r14=float(np.max(np.abs(Xi)/U)), f0=float(np.max(np.abs(F0))),
           f38=float(np.max(np.abs(F0)/U**1.5)), mlo=float(np.min(Mh[lo:hi+1])), mhi=float(np.max(Mh[lo:hi+1])),
           c2=float(np.max(np.abs(c2))), c3=float(np.max(np.abs(c3))), bd=float(np.max(bd)), bt=float(bd[-1]),
           rlo=float(np.min(rv)), rhi=float(np.max(rv)))
        if acc is None: acc = cur
        else:
            if cur["mx"] > acc["mx"]: acc["mx"], acc["at"], acc["sgn"] = cur["mx"], cur["at"], cur["sgn"]
            for key in ("r14", "f0", "f38", "mhi", "c2", "c3", "bd", "rhi"): acc[key] = max(acc[key], cur[key])
            for key in ("mlo", "rlo"): acc[key] = min(acc[key], cur[key])
            acc["bt"] = cur["bt"]
    row = dict(U_decade="1e%d..1e%d" % (k, k+1), X_decade="1e%d..1e%d" % (4*k, 4*k+4),
      max_abs_Xi_untuned=acc["mx"], at_U=acc["at"], Xi_there=acc["sgn"], max_Xi_over_X14=acc["r14"],
      max_abs_F0_V1=acc["f0"], max_F0_over_X38=acc["f38"], min_M_half=acc["mlo"], max_M_half=acc["mhi"],
      max_abs_c2=acc["c2"], max_abs_c3=acc["c3"], max_bound_Xi_gauge=acc["bd"], bound_at_top=acc["bt"],
      min_R=acc["rlo"], max_R=acc["rhi"])
    res["rows"].append(row); print(json.dumps(row), flush=True)
sg = np.signbit(m1[2:]); sc = np.nonzero(sg[1:] != sg[:-1])[0] + 3
res["m_sign_changes"] = dict(count=int(len(sc)), first=[int(x) for x in sc[:10]], last=[int(x) for x in sc[-5:]],
   max_gap_ratio_above_100=float(np.max(sc[sc > 100][1:]/sc[sc > 100][:-1])))
print(json.dumps(res["m_sign_changes"]))
json.dump(res, open("closed_form_1e32.json", "w"), indent=1)
