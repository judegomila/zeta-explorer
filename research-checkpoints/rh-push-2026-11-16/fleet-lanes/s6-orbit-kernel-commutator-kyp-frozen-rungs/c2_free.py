# Combination 2, arithmetic-free replacement of the log-prime-power nodes: same count and same counting function (smooth), zeta, a = 0.5.
# node sets: log of the first n prime powers; log x_j with sum_k li(x_j^{1/k}) = j - 1/2 (smooth count of prime powers); equispaced on the same range.
import sys, json, math
import numpy as np
from flint import arb, acb, ctx
import slib, olib, mpmath
sys.argv = [sys.argv[0], 'x', 'repro', '64', '0', '0'] if False else sys.argv
ctx.prec = 300
a = 0.5
T, W, Kv = slib.table('zeta')
WK = [w*k for w, k in zip(W, Kv)]
Tf = np.array([float(t) for t in T]); m2 = np.array([float(w*k*k) for w, k in zip(W, Kv)])*np.sinh(2*a*Tf)
d0 = float((m2*Tf).sum()/(2*math.pi))
def pp(n):
    N = 200; res = []
    while len(res) < n:
        N *= 2
        s = bytearray([1])*(N + 1); s[0:2] = b'\x00\x00'
        for i in range(2, int(N**0.5) + 1):
            if s[i]: s[i*i::i] = bytearray(len(s[i*i::i]))
        res = []
        for p in range(2, N + 1):
            if s[p]:
                q = p
                while q <= N: res.append(q); q *= p
        res.sort()
    return res[:n]
def count_smooth(x):
    s = 0.0; k = 1
    while x**(1.0/k) >= 2:
        s += float(mpmath.li(x**(1.0/k))) - float(mpmath.li(2)) + 1.0 if k == 1 else float(mpmath.li(x**(1.0/k))) - float(mpmath.li(2)) + 1.0
        k += 1
    return s
def smooth_nodes(n):
    out = []; lo = 2.0
    for j in range(1, n + 1):
        hi = max(lo*2, 4.0)
        while count_smooth(hi) < j - 0.5: hi *= 2
        l = lo
        for _ in range(60):
            mid = (l + hi)/2
            if count_smooth(mid) < j - 0.5: l = mid
            else: hi = mid
        out.append((l + hi)/2); lo = out[-1]
    return out
def stat(wf):
    n = len(wf); aa = arb(a)
    A = []; B = []; Ad = []; Bd = []
    for w in wf:
        z = acb(arb(w), -aa); s0 = acb(0); s1 = acb(0)
        for t, wk in zip(T, WK):
            s0 += wk*(z*t).cos(); s1 -= wk*t*(z*t).sin()
        A.append(float(s0.real)); B.append(float(s0.imag)); Ad.append(float(s1.real)); Bd.append(float(s1.imag))
    A = np.array(A); B = np.array(B); Ad = np.array(Ad); Bd = np.array(Bd); wf = np.array(wf)
    dt = wf[:, None] - wf[None, :]
    with np.errstate(divide='ignore', invalid='ignore'):
        K = (A[:, None]*B[None, :] - B[:, None]*A[None, :])/(math.pi*(wf[None, :] - wf[:, None]))
    np.fill_diagonal(K, (A*Bd - Ad*B)/math.pi)
    D = np.empty((n, n))
    for i0 in range(0, n, 16):
        tt = dt[i0:i0 + 16][..., None]
        small = np.abs(tt) < 1e-12
        val = np.where(small, Tf, np.sin(tt*Tf)/np.where(small, 1.0, tt))
        D[i0:i0 + 16] = (val*m2).sum(axis=-1)/(2*math.pi)
    return {'ratio_R_over_D': float(np.linalg.norm(K - D)/np.linalg.norm(D)), 'trK_over_trD': float(np.trace(K)/np.trace(D)), 'min_eig_K': float(np.linalg.eigvalsh((K + K.T)/2)[0])}
out = []
for n in ([int(x) for x in sys.argv[2].split(",")] if len(sys.argv) > 2 else (50, 200, 500, 1000)):
    P = pp(n); S = smooth_nodes(n)
    sets = {'log-prime-powers': [math.log(q) for q in P], 'log-smooth-count (arithmetic-free, same counting function)': [math.log(x) for x in S],
            'equispaced on [log 2, log p_n]': list(np.linspace(math.log(2), math.log(P[-1]), n))}
    for k, v in sets.items():
        r = stat(v); r.update({'n': n, 'nodes': k, 'range': [v[0], v[-1]]}); out.append(r); print(json.dumps(r), flush=True)
json.dump(out, open(sys.argv[1], 'w'), indent=1)
