#!/usr/bin/env python3
"""Combination 3: trace-side multiplier Lhat(t) = 2theta'(t) + 2Re(L_p'/L_p)(1/2+it) + deltahat(t) for a one-prime kernel
K(t) = 2 sum_n c_n cos(2 pi p^n t) (exact spike offsets, method of lane s2 symbol2.py).
SPEC: 'alpha:x'  local factor 1/(1 - x z), x real, |x| < sqrt(p)   (x = 1: zeta; x = -1: sign; x = 0: archimedean only)
      'dropcos'  zeta coefficients with c_{-1} = 0 (the source control 'drop -cos(pi t)': not the kernel of a unitary operator)
usage: c3_symbol.py p SPEC OUT KMAX TMAX TSTEP [GLN RATIO J]"""
import sys, math, json, os, time
import numpy as np
from scipy.special import digamma
import sisum
try:
    if os.environ.get('S6_NUMPY'): raise ImportError
    import cupy as xp
    xp.get_default_memory_pool().set_limit(size=int(float(os.environ.get('S6_POOL_GB', '8')) * 1024**3)); GPU = True
except Exception:
    import numpy as xp; GPU = False
p = int(sys.argv[1]); SPEC = sys.argv[2]; OUT = sys.argv[3]; KMAX = int(sys.argv[4]); TMAX = float(sys.argv[5]); TSTEP = float(sys.argv[6])
GLN = int(sys.argv[7]) if len(sys.argv) > 7 else 12; RAT = float(sys.argv[8]) if len(sys.argv) > 8 else 2.0; J = int(sys.argv[9]) if len(sys.argv) > 9 else 42
os.makedirs(OUT, exist_ok=True); t0 = time.time(); LP = math.log(p)
if SPEC == 'dropcos': al = 1.0
else: al = float(SPEC.split(':')[1])
amax = max(abs(al), 1.0)
gx, gw = np.polynomial.legendre.leggauss(GLN)
dmin = (LP / 2) * RAT ** (-J)
NEXT = int(37.0 / (LP - math.log(amax))) + 4
NRES = int((math.log(1 / dmin) + 37.0) / (LP - 2 * math.log(amax))) + 4
# Laurent coefficients of rho = (1 - (al/p) z^-1) / (1 - al z):  c_n = al^n (1 - al^2/p) for n >= 0, c_{-1} = -al/p
NP = KMAX + NRES + NEXT + 8
cdict = {n: (al ** n) * (1 - al * al / p) for n in range(0, NP + 1)}
cdict[-1] = -al / p
if SPEC == 'dropcos': cdict[-1] = 0.0
cdict = {n: c for n, c in cdict.items() if abs(c) > 1e-300}
nall = np.array(sorted(cdict))
def half(side, Jk):
    d = []; w = []; prev = 0.0
    for j in range(Jk, -1, -1):
        e = (LP / 2) * RAT ** (-j); lo, hi = prev, e; prev = e; h = (hi - lo) / 2
        d.extend(side * (lo + h + h * gx)); w.extend(h * gw)
    return np.array(d), np.array(w)
def delta_spike(k, d):
    eps = np.expm1(d); out = np.zeros_like(d)
    for n in nall[nall <= NRES + 2]:
        cn = cdict[int(n)]
        ms = nall[nall <= n + k + NEXT]
        cm = np.array([cdict[int(m)] for m in ms])
        dd = (n + k - ms).astype(float); pm = float(p) ** ms.astype(float)
        A = float(p) ** float(n + k) * (1 + eps)
        fac = np.where(dd[:, None] == 0, np.abs(eps)[None, :], np.abs(float(p) ** dd[:, None] * (1 + eps)[None, :] - 1))
        out += cn * (cm[:, None] * (sisum.si(A[None, :] + pm[:, None]) + sisum.si(pm[:, None] * fac))).sum(axis=0)
    return 2 * np.sqrt(float(p) ** k * (1 + eps)) * out
ts = np.arange(0, TMAX + TSTEP / 2, TSTEP); hat = xp.zeros(len(ts)); tsg = xp.asarray(ts); masses = []
CH = max(1, int(4e8 / 8 / max(1, 2 * GLN * (J + 400))))
print(f'[{SPEC}@{p}] gpu={GPU} KMAX={KMAX} NRES={NRES} NEXT={NEXT} t-points={len(ts)}; planned: cos blocks of {CH} t-points x <= {2*GLN*(J+KMAX*2)} nodes', flush=True)
for k in range(0, KMAX + 1):
    Jk = J + int(math.ceil(k * LP / math.log(RAT)))
    dP, wP = half(+1, Jk); dM, wM = half(-1, Jk)
    parts = [(dP, wP)] if k == 0 else [(dP, wP), (dM, wM)]
    mk = 0.0
    for d, w in parts:
        vv = delta_spike(k, d); u = xp.asarray(k * LP + d); wv = xp.asarray(w * vv)
        for a in range(0, len(ts), CH): hat[a:a + CH] += 2 * (xp.cos(xp.outer(tsg[a:a + CH], u)) @ wv)
        mk += float(np.sum(w * vv))
    masses.append(mk)
    if k % 20 == 0: print(f'  spike {k}: mass {mk:+.4e} [{time.time()-t0:.0f}s]', flush=True)
hat = xp.asnumpy(hat) if GPU else hat
tth = digamma(0.25 + 0.5j * ts).real - math.log(math.pi)
z = p ** (-0.5 - 1j * ts)
def ld_of(a): return (-2 * LP * (a * z / (1 - a * z))).real      # 2 Re L'/L for 1/(1 - a z)
ld = ld_of(al); Lh = tth + ld + hat; i = int(np.argmin(Lh))
out = dict(spec=SPEC, p=p, KMAX=KMAX, TMAX=TMAX, TSTEP=TSTEP, L0=float(Lh[0]), minL=float(Lh[i]), argmin=float(ts[i]), hat0=float(hat[0]), masses=masses, seconds=time.time() - t0)
if SPEC in ('alpha:1', 'alpha:1.0'):
    fl = tth - ld + hat; j = int(np.argmin(fl)); out['flip_m2_only'] = dict(min=float(fl[j]), at=float(ts[j]))       # source control: sign of m_2 flipped, deltahat of zeta kept
if SPEC == 'dropcos':
    zl = tth + ld_of(1.0) + hat; j = int(np.argmin(zl)); out['with_zeta_m2'] = dict(min=float(zl[j]), at=float(ts[j]))
print(f'RESULT3 {SPEC}@{p}: Lhat(0) = {Lh[0]:+.6f}, deltahat(0) = {hat[0]:.6f}; min over [0,{TMAX:g}] = {Lh[i]:+.6f} at t = {ts[i]:.3f}; extras {json.dumps({k_: v_ for k_, v_ in out.items() if k_ in ("flip_m2_only", "with_zeta_m2")})}; last spike mass {masses[-1]:+.2e} [{time.time()-t0:.0f}s]', flush=True)
tag = SPEC.replace(':', '')
json.dump(out, open(f'{OUT}/c3sym_{tag}_p{p}.json', 'w'))
if len(ts) > 20000: np.save(f'{OUT}/c3hat_{tag}_p{p}.npy', np.vstack([ts, tth, hat]))
