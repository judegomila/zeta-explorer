"""streaming re-check of the GPU float64 sums of echo.py in x86 long double (63-bit mantissa), low memory.
For one sample point per height: ZETA:sharp and SGN:sharp at x = X[0], X[8] and checkpoint Pmax, recomputed over all prime powers.
usage: recheck2.py <echo_raw.npz> <Pmax> <out.json>"""
import sys, json, math, numpy as np
import echo
z = np.load(sys.argv[1]); P = float(sys.argv[2]); LD = np.longdouble
print('long double mantissa bits', np.finfo(LD).nmant, flush=True)
Hs = sorted({k[2:] for k in z.files if k.startswith('t_')}, key=float)
tt = np.array([z['t_' + H][len(z['t_' + H]) // 2] for H in Hs]); tl = tt.astype(LD)
JX = [0, 8]
acc = {('ZETA', j): np.zeros(len(tt), LD) for j in JX}; acc.update({('SGN', j): np.zeros(len(tt), LD) for j in JX})
def add(p, m):
    """p int64 array, m int"""
    lp = np.log(p.astype(LD)); logn = lp * m
    h = echo.splitmix(p); eps = np.where((h >> np.uint64(63)) == 1, -1.0, 1.0) if m % 2 else np.ones(len(p))
    for i in range(len(tt)):
        c = np.cos(tl[i] * logn) * lp
        for j in JX:
            w = c * np.exp(-(LD(0.5) + LD(echo.X[j])) * logn)
            acc[('ZETA', j)][i] += w.sum(); acc[('SGN', j)][i] += (w * eps).sum()
N = int(P); r = int(math.isqrt(N)) + 1
s = np.ones(r + 1, bool); s[:2] = False
for i in range(2, int(math.isqrt(r)) + 1):
    if s[i]: s[i * i::i] = False
base = np.nonzero(s)[0].astype(np.int64)
add(base[base <= N], 1)
m = 2
while 2 ** m <= N:
    q = np.array([v for v in base if int(v) ** m <= N], np.int64)
    if len(q): add(q, m)
    m += 1
seg = 1 << 22; lo = r + 1; k = 0
while lo <= N:
    hi = min(lo + seg - 1, N); mk = np.ones(hi - lo + 1, bool)
    for p in base:
        if p * p > hi: break
        st = max(p * p, (lo + p - 1) // p * p); mk[st - lo::p] = False
    add(np.nonzero(mk)[0].astype(np.int64) + lo, 1); lo = hi + 1; k += 1
    if k % 40 == 0: print('segment', k, lo, flush=True)
out = []
for i, H in enumerate(Hs):
    s_ = (0.5 + echo.X) + 1j * tt[i]; G = echo.drift('ZETA', s_)
    idx = len(z['t_' + H]) // 2
    rec = dict(H=float(H), t=float(tt[i]))
    for nm in ('ZETA', 'SGN'):
        for j in JX:
            ld = float(G[j] - acc[(nm, j)][i]); g = float(z['%s|%s:sharp|%g' % (H, nm, P)][idx, j])
            rec['%s x=%g' % (nm, echo.X[j])] = dict(long_double=ld, gpu=g, diff=g - ld)
    out.append(rec); print(rec, flush=True)
json.dump(out, open(sys.argv[3], 'w'), indent=1)
