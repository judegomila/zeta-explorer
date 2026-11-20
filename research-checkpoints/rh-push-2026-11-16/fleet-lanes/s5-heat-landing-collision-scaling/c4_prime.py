"""Combination 4, prime side.  Kernel: phi(v) = v (1 - v/L) on [0, L], L = log X;  K(r) = int_{-L}^{L} phi(|v|) e^{irv} dv
  = 2 [ -(1 + cos rL)/r^2 + 2 sin(rL)/(L r^3) ],  K(0) = L^2/3,  K(r) ~ -2/r^2 on average: the kernel 1/(x - gamma)^2 of the discriminant
  rate (second derivative of log F on the line) cut at resolution 1/L.  Explicit formula (Weil), all zeros rho = 1/2 + i gamma_rho:
  Z(x) := sum_rho K(gamma_rho - x) - int K(r - x) dens(r) dr   =   P(x) := pole terms - 2 sum_n Lambda_F(n) n^(-1/2) phi(log n) cos(x log n)   (sum over zeros with gamma > 0)
  (mirror terms K(gamma + x) are below 1e-6 at the heights used and are dropped on both sides; pole terms 2 Re K(i/2 - x) for zeta).
Zero side: zeros of the list within R of x, the rest by the smooth density (exact: int_{-R}^{R} K = 4/R - 4 sin(RL)/(L R^2)).
Statistic: P(x) - Z(x) at the zeros x of a window of 1000 consecutive zeros.
Usage: c4_prime.py OUT.json XMAX  name:list.npy:kind:start,start,...   (kind zeta | chi4 | chi5)"""
import sys, os, json, math, numpy as np, hl
from scipy.special import digamma

def prime_powers(X, seg=1 << 24):
    """log n and Lambda(n) for all prime powers n <= X, with the prime p of each; segmented sieve"""
    r = int(math.isqrt(X)) + 1
    sv = np.ones(r + 1, bool); sv[:2] = False
    for i in range(2, int(math.isqrt(r)) + 1):
        if sv[i]: sv[i * i::i] = False
    small = np.nonzero(sv)[0]
    ps = []
    for lo in range(0, X + 1, seg):
        hi = min(lo + seg, X + 1); s = np.ones(hi - lo, bool)
        if lo == 0: s[:2] = False
        for p in small:
            if p * p >= hi: break
            st = max(p * p, ((lo + p - 1) // p) * p); s[st - lo::p] = False
        ps.append(np.nonzero(s)[0].astype(np.int64) + lo)
    p = np.concatenate(ps)
    n = [p]; base = [p]
    k = 2
    while 2 ** k <= X:
        b = p[p <= int(round(X ** (1.0 / k))) + 1]; pk = b ** k; m = pk <= X
        n.append(pk[m]); base.append(b[m]); k += 1
    return np.concatenate(n), np.concatenate(base), np.concatenate([np.full(len(v), j + 1) for j, v in enumerate(n)])

def K(r, L):
    r = np.asarray(r); out = np.empty(r.shape, dtype=np.result_type(r.dtype, np.float64))
    sm = np.abs(r) * L < 0.5
    rs = r[sm]; acc = np.zeros(rs.shape, dtype=out.dtype); term = np.ones(rs.shape, dtype=out.dtype) * L * L
    for k in range(0, 14):
        acc += term / ((2 * k + 2) * (2 * k + 3)); term = term * (-(rs * L) ** 2) / ((2 * k + 1) * (2 * k + 2))
    out[sm] = 2 * acc
    rb = r[~sm]; out[~sm] = 2 * (-(1 + np.cos(rb * L)) / rb ** 2 + 2 * np.sin(rb * L) / (L * rb ** 3))
    return out

def dens(x, kind):
    x = np.asarray(x, dtype=np.float64)
    if kind == 'zeta': return (digamma(0.25 + 0.5j * x).real - math.log(math.pi)) / (2 * math.pi)
    q, a = (4, 1) if kind == 'chi4' else (5, 0)
    return (math.log(q / math.pi) + digamma(0.25 + 0.5 * a + 0.5j * x).real) / (2 * math.pi)

def zero_side(x, g, L, kind, R=300.0):
    out = np.empty(len(x))
    for i, xv in enumerate(x):
        lo = np.searchsorted(g, xv - R); hi = np.searchsorted(g, xv + R)
        out[i] = K(g[lo:hi] - xv, L).sum()
    IR = 4 / R - 4 * math.sin(R * L) / (L * R * R)
    return out - dens(x, kind) * IR - R / (math.pi * x ** 2)

if __name__ == '__main__':
    out = sys.argv[1]; XMAX = int(float(sys.argv[2])); specs = sys.argv[3:]
    hl.log('sieve to %g: planned memory about %.2f GB' % (XMAX, 3 * 8e-9 * 1.1 * XMAX / math.log(XMAX) + 0.05))
    n, p, kk = prime_powers(XMAX)
    o = np.argsort(n); n = n[o]; p = p[o]; kk = kk[o]
    logn = np.log(n.astype(np.float64)); lam = np.log(p.astype(np.float64)) / np.sqrt(n.astype(np.float64))
    hl.log('prime powers', len(n))
    Xs = [X for X in (10 ** 3, 10 ** 5, 10 ** 7, 10 ** 9) if X <= XMAX]
    res = dict(XMAX=XMAX, rows=[])
    for sp in specs:
        name, fn, kind, starts = sp.split(':')
        if not os.path.exists(fn) and os.path.exists(os.path.join('data', os.path.basename(fn))): fn = os.path.join('data', os.path.basename(fn))
        g = np.array(np.load(fn, mmap_mode='r'), dtype=np.float64)
        if os.path.exists(fn.replace('.npy', '.meta.npy')) and g[0] < 1e6 and 'off' in fn: g = g + float(np.load(fn.replace('.npy', '.meta.npy'))[0])
        if kind == 'zeta': chi = np.ones(len(n))
        elif kind == 'chi4': chi = np.where(p % 4 == 1, 1.0, np.where(p % 4 == 3, -1.0, 0.0)) ** kk
        else: chi = np.where((p % 5 == 1) | (p % 5 == 4), 1.0, np.where(p % 5 == 0, 0.0, -1.0)) ** kk
        for st in [int(float(v)) for v in starts.split(',')]:
            x = g[st:st + 1000]
            for X in Xs:
                L = math.log(X); m = np.searchsorted(n, X, side='right')
                coef = -2 * chi[:m] * lam[:m] * (logn[:m] * (1 - logn[:m] / L))
                P = hl.prime_sum(logn[:m], coef, x)
                if kind == 'zeta': P = P + 2 * K(0.5j - x, L).real
                Z = zero_side(x, g, L, kind)
                # sampled check of the vectorised cosine against numpy at 5 points
                chk = max(abs(float((coef * np.cos(xv * logn[:m])).sum()) - float(Pv - (2 * K(np.array([0.5j - xv]), L).real[0] if kind == 'zeta' else 0))) for xv, Pv in zip(x[::250], P[::250]))
                d = P - Z
                row = dict(name=name, kind=kind, start=st, height=float(x[0]), X=X, L=L, resolution_in_mean_spacings=float(dens(x[:1], kind)[0] / L * 2 * math.pi),
                           rms_Z=float(Z.std()), max_abs_Z=float(np.abs(Z).max()), rms_diff=float(np.sqrt((d ** 2).mean())), max_abs_diff=float(np.abs(d).max()),
                           mean_diff=float(d.mean()), corr=float(np.corrcoef(P, Z)[0, 1]), kernel_check=chk, n_prime_powers=int(m))
                # T-NR on the same on-line list: extra prime-power terms at q^j (closed form), two members of the family
                for q, c in ((3, 2.2), (1000003, 2.2)):
                    th = math.acosh(c / 2); j = np.arange(1, int(L / math.log(q)) + 1)
                    if len(j):
                        cf = -2 * (-1.0) ** (j + 1) * math.log(q) * (np.exp(j * th) + np.exp(-j * th)) * (j * math.log(q) * (1 - j * math.log(q) / L))
                        ex = (cf[None, :] * np.cos(x[:, None] * j[None, :] * math.log(q))).sum(1)
                    else: ex = np.zeros(len(x))
                    row['tnr_q%d' % q] = dict(rms_mismatch=float(np.sqrt(((d + ex) ** 2).mean())), max_abs_mismatch=float(np.abs(d + ex).max()), terms=int(len(j)),
                                              first_offline_height=math.pi / math.log(q))
                res['rows'].append(row); hl.log(json.dumps(row)[:400])
    # Poisson check for T-NR: the closed-form extra terms equal the sum of K over the off-line progression
    chk = []
    for q, c, X, xv in ((3, 2.2, 10 ** 3, 1234.5), (3, 2.2, 10 ** 5, 1234.5), (1000003, 2.2, 10 ** 7, 1234.5)):
        if X > XMAX: continue
        L = math.log(X); th = math.acosh(c / 2); b = th / math.log(q); lq = math.log(q)
        j = np.arange(1, int(L / lq) + 1)
        cf = -2 * (-1.0) ** (j + 1) * lq * (np.exp(j * th) + np.exp(-j * th)) * (j * lq * (1 - j * lq / L)); closed = float((cf * np.cos(xv * j * lq)).sum())
        Rp = 2.0e5; ks = np.arange(int((xv - Rp) * lq / (2 * math.pi)) - 1, int((xv + Rp) * lq / (2 * math.pi)) + 2); gk = (2 * ks + 1) * math.pi / lq
        gk = gk[np.abs(gk - xv) <= Rp]
        direct = float((K(gk - xv - 1j * b, L) + K(gk - xv + 1j * b, L)).real.sum()) - (2 * lq / (2 * math.pi)) * (4 / Rp)
        chk.append(dict(q=q, X=X, x=xv, closed_form=closed, direct_sum_over_offline_zeros=direct))
    res['tnr_poisson_check'] = chk
    hl.jdump(res, out); print(json.dumps(res['tnr_poisson_check'], indent=0))
