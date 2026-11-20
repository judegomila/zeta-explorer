"""Combination 3: per-N rate of the collision time. Lane s5-burgers-shock-cusp-stieltjes-strip.
Objects (unnormalised m_N(z) = sum 1/(gamma_k - z), y_N = sqrt(2 pi/N)):
  M_inf(N)   = sup_x Im m_N(x + i y_N) = sup_x sum_k y_N/((x - gamma_k)^2 + y_N^2)      (>= 1/y_N = sqrt(N/2pi): atomic self term)
  t_proxy(N) = 1/(2 M_inf(N))            = t_c(m_N): crossing time of the mollified empirical density read at the strip y_N
  t_c(N)     = first collision time of dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j) on the first N zeros
  R_A(N)     = |t_c(N) - t_proxy(N)|
  D(N)       = pi * max_{k<=N} |S(gamma_k +-)| / (N y_N)     (Koksma-Hlawka form of imp-36082 with the measured max |S| in place of C log gamma_N)
  C_W(N)     = t_proxy(N) / sqrt(D(N))   (t_c(m_inf) = 0)
usage:
  c3.py validate                reproduce the recorded t_c at N = 50, 100, 200, 500, 2458 (full pairwise flow) and the block method against it
  c3.py list NAME [nmax]        ladder; block method for the collision time (candidate pairs by g^2/(8(1-Theta)), block of 2B+1 zeros, frozen linearised far field)
  c3.py tables                  full sets with off-line pairs (complex particles), N = all zeros below height 2000
"""
import sys, json, math, os, numpy as np
import zf
from zf import log
from scipy.special import loggamma

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out'); os.makedirs(OUT, exist_ok=True)
REC = {50: 0.0957473, 100: 0.0701183, 200: 0.0326830, 500: 0.0123271, 2458: 0.00119231}   # dyson-burgers-shock.js, correction of 2026-09-24

def nbar(T, q=1, a=0):
    """smooth count of zeros with 0 < gamma <= T for a primitive real character mod q of parity a (zeta: q = 1, a = 0, +1 for the pole/7-8 term)"""
    T = np.asarray(T, dtype=np.float64)
    th = loggamma(0.25 + 0.5 * a + 0.5j * T).imag - 0.5 * T * math.log(math.pi / q)
    return th / math.pi + (1.0 if q == 1 else 0.0)

def Smax(x, q, a, blk=5_000_000):
    """running maximum of |S(gamma_k +-)| and S(gamma_k +); blocks of blk zeros (0.3 GB temporaries)"""
    n = len(x); sm = np.empty(n); Sp = np.empty(n)
    for s in range(0, n, blk):
        e = min(n, s + blk); nb = nbar(x[s:e], q, a); k = np.arange(s + 1, e + 1)
        Sp[s:e] = k - nb; sm[s:e] = np.maximum(np.abs(k - nb), np.abs(k - 1 - nb))
    np.maximum.accumulate(sm, out=sm)
    return sm, Sp

def poisson_sup(x, N, K=16):
    """sup_x sum_k y/((x-g_k)^2+y^2) over the first N points. Evaluated at every zero with K neighbours each side (the k-th neighbour adds about (y rho / k)^2 relative to the self term: below 1e-6 at K = 16 for N >= 1e5; the rest is below 2 y rho^2/K
    relative 1e-6), then refined on the 20 best with all N points and a local 1-d maximisation."""
    y = math.sqrt(2 * math.pi / N); xs = x[:N]
    P = np.full(N, 1.0 / y)
    for k in range(1, min(K, N - 1) + 1):
        for s0 in range(0, N - k, 10_000_000):
            d = xs[s0 + k:min(N, s0 + k + 10_000_000)] - xs[s0:min(N - k, s0 + 10_000_000)]; c = y / (d * d + y * y)
            P[s0 + k:s0 + k + len(c)] += c; P[s0:s0 + len(c)] += c
    best = np.argpartition(P, -20)[-20:]; val = 0.0; arg = None
    for j in best:
        a0 = max(0, j - 3000); b0 = min(N, j + 3001); loc = xs[a0:b0]
        far = float((y / ((xs[j] - xs[:a0]) ** 2 + y * y)).sum() + (y / ((xs[j] - xs[b0:]) ** 2 + y * y)).sum())   # constant over |t - x_j| <= 3 y to 1e-9
        f = lambda t: float((y / ((t - loc) ** 2 + y * y)).sum()) + far
        ts = np.linspace(xs[j] - 3 * y, xs[j] + 3 * y, 121); vs = [f(t) for t in ts]; i = int(np.argmax(vs))
        a = ts[max(0, i - 1)]; b = ts[min(len(ts) - 1, i + 1)]
        for _ in range(60):
            c1 = a + 0.382 * (b - a); c2 = a + 0.618 * (b - a)
            if f(c1) < f(c2): a = c1
            else: b = c2
        v = f(0.5 * (a + b))
        if v > val: val = v; arg = 0.5 * (a + b)
    return val, arg, y

def theta_adj(x, K=20, blk=5_000_000):
    """g_i and Theta_i = g_i^2/2 * sum over K neighbours on each side of 1/((x_i - x_j)(x_{i+1} - x_j)); blocks of blk pairs (0.04 GB temporaries)"""
    n = len(x); g = np.diff(x); E = np.zeros(n - 1); K = min(K, n - 2)
    for s in range(0, n - 1, blk):
        e = min(n - 1, s + blk); a = x[s:e]; b = x[s + 1:e + 1]; acc = np.zeros(e - s)
        for k in range(1, K + 1):
            i0 = max(s, k)                      # left neighbour x[i-k] exists for i >= k
            if i0 < e:
                xl = x[i0 - k:e - k]; acc[i0 - s:] += 1.0 / ((a[i0 - s:] - xl) * (b[i0 - s:] - xl))
            i1 = min(e, n - 1 - k)              # right neighbour x[i+1+k] exists for i <= n-2-k
            if i1 > s:
                xr = x[s + 1 + k:i1 + 1 + k]; acc[:i1 - s] += 1.0 / ((xr - a[:i1 - s]) * (xr - b[:i1 - s]))
        E[s:e] = acc
    E *= 0.5 * g * g
    return g, E

def block_tc(x, i, B=250, W=200000):
    """collision time of the flow started from the first len(x) zeros, computed on the block of zeros i-B .. i+1+B with the other zeros frozen
    (their force linearised about the starting positions)."""
    n = len(x); lo = max(0, i - B); hi = min(n, i + 2 + B)
    xin = x[lo:hi].astype(np.float64); c = xin.mean(); xin0 = xin - c
    xout = np.concatenate([x[max(0, lo - W):lo], x[hi:hi + W]]) - c   # zeros further than W indices: uniform translation + dilation rate below 2 rho^2/W
    if len(xout):
        F0, F1 = zf.rect_field(xin0, xout, np, chunk=2e7)
    else: F0 = np.zeros_like(xin0); F1 = np.zeros_like(xin0)
    r = zf.backward_flow(xin0, np, cfl=0.05, stop=1e-8, ext=(F0, F1, xin0.copy()))
    return r

def full_tc(x, N, B_=np):
    r = zf.backward_flow(B_.asarray(x[:N].astype(np.float64)), B_, cfl=0.05, stop=1e-8)
    return r

def est_of(g, Th, blk=5_000_000):
    est = np.empty(len(g))
    for s in range(0, len(g), blk):
        gg = g[s:s + blk]; th = Th[s:s + blk]; est[s:s + blk] = np.where(th < 1, gg * gg / (8 * np.maximum(1e-12, 1 - th)), np.inf)
    return est

def tc_block_method(x, N, ncand=12, B=250, Th=None, g=None, est=None):
    xs = x[:N]
    if g is None: g, Th = theta_adj(xs)
    else: g = g[:N - 1]
    if est is None: est = est_of(g, Th[:N - 1])
    else:
        est = est[:N - 1]; Th = None
    cand = np.argpartition(est, min(ncand, len(est) - 1))[:ncand]; best = None
    for i in cand:
        r = block_tc(xs, int(i), B)
        if not math.isnan(r['tc']) and (best is None or r['tc'] < best['tc']): best = dict(tc=r['tc'], pair=int(i), g0=float(g[i]), Theta0=float(Th[i]) if Th is not None else float(1 - g[i] ** 2 / (8 * est[i])), est=float(est[i]), steps=r['steps'], switched=r['switched'])
    imin = int(np.argmin(g))
    best['gmin'] = float(g[imin]); best['gmin_pair'] = imin; best['gmin2_over_8'] = float(g[imin] ** 2 / 8); best['first_pair_is_closest'] = bool(best['pair'] == imin)
    return best

def validate():
    x, T0, q = zf.load('zeta8', 20000); res = {}
    for N, ref in REC.items():
        r = full_tc(x, N); b = tc_block_method(x, N, ncand=6, B=120)
        res[N] = dict(full=r['tc'], recorded=ref, rel_full_vs_recorded=r['tc'] / ref - 1, block=b['tc'], rel_block_vs_full=b['tc'] / r['tc'] - 1)
        log('N %d full %.9g recorded %.9g rel %.2e | block %.9g rel to full %.2e' % (N, r['tc'], ref, r['tc'] / ref - 1, b['tc'], b['tc'] / r['tc'] - 1))
    for N in (5000, 10000):
        r = full_tc(x, N); b = tc_block_method(x, N)
        res[N] = dict(full=r['tc'], block=b['tc'], rel_block_vs_full=b['tc'] / r['tc'] - 1)
        log('N %d full %.9g block %.9g rel %.2e' % (N, r['tc'], b['tc'], b['tc'] / r['tc'] - 1))
    json.dump(res, open(os.path.join(OUT, 'c3_validate.json'), 'w'), indent=1)

PAR = {'zeta8': (1, 0), 'chi': (5, None), 'chibar': (5, None), 'dh': (5, 1), 'alt': (5, 1)}

def do_list(name, nmax=None):
    x, T0, q = zf.load(name, nmax); n = len(x); log(name, n, 'T0', T0)
    rows = []
    g, Th = theta_adj(x); est = est_of(g, Th); del Th
    if name in PAR and T0 == 0.0:
        qq, a = PAR[name]
        if a is None:
            # complex character mod 5: parity fixed by the fit of the constant; use a = 1 (odd) and report the mean of S as a check
            a = 1
        sm, Sp = Smax(x, qq, a)
        log('S check: mean S over the list %.4f, max |S| %.3f' % (float(Sp.mean()), float(sm[-1])))
        from c12 import ladder as _lad
        Sat = {N: float(Sp[N - 1]) for N in _lad(n)}; del Sp
    else: sm = None
    from c12 import ladder
    for N in ladder(n):
        Minf, xarg, y = poisson_sup(x, N)
        tp = 1 / (2 * Minf)
        b = tc_block_method(x, N, g=g, est=est)
        row = dict(N=N, y=y, gammaN=float(T0 + x[N - 1]), Minf=Minf, Minf_over_atom=Minf * y, t_proxy=tp, t_proxy_bound=math.sqrt(math.pi / (2 * N)), tc=b['tc'],
                   R_A=abs(b['tc'] - tp), **{k: v for k, v in b.items() if k != 'tc'})
        if sm is not None:
            D = math.pi * float(sm[N - 1]) / (N * y); row.update(Smax=float(sm[N - 1]), D=D, C_W=tp / math.sqrt(D), r_bound_shape=math.sqrt(math.log(x[N - 1])) * N ** -0.25,
                                                                 S_at_N=Sat[N])
        rows.append(row)
        log(json.dumps({k: (float('%.6g' % v) if isinstance(v, float) else v) for k, v in row.items()}))
    Ns = np.array([r['N'] for r in rows], dtype=float)
    def slope(key):
        v = np.array([r[key] for r in rows]); p = np.polyfit(np.log(Ns), np.log(v), 1); return float(p[0]), float(math.exp(p[1]))
    fits = dict(t_proxy=slope('t_proxy'), tc=slope('tc'), R_A=slope('R_A'), R_A_times_N32=[r['R_A'] * r['N'] ** 1.5 for r in rows])
    if sm is not None: fits['D'] = slope('D'); fits['C_W'] = slope('C_W')
    log('fits (exponent, constant):', json.dumps({k: v for k, v in fits.items() if k != 'R_A_times_N32'}))
    json.dump(dict(name=name, n=n, rows=rows, fits=fits), open(os.path.join(OUT, 'c3_%s.json' % name), 'w'), indent=1)

def tables():
    res = {}
    for nm in ('ZETA', 'DH', 'HEAT--0.1', 'HEAT--0.5', 'TNR'):
        try: on, off = zf.table(nm)
        except Exception as e: log(nm, 'not available', repr(e)); continue
        on = np.sort(np.array(on)); N = len(on)
        Minf, xarg, y = poisson_sup(on, N); tp = 1 / (2 * Minf)
        r0 = zf.backward_flow(on.copy(), np, cfl=0.05, stop=1e-8)
        row = dict(online=N, offline_pairs=len(off), t_proxy_online=tp, tc_online_only=r0['tc'], gmin=r0['g0'])
        if off:
            Z = zf.full_set(on, off); isreal = np.abs(Z.imag) == 0
            r1 = zf.backward_flow(Z, np, cfl=0.05, stop=1e-8, isreal=isreal)
            row.update(tc_full_set=r1['tc'], rel_change=r1['tc'] / r0['tc'] - 1, same_pair=bool(r1['pair0'] == r0['pair0']))
            # counting function of the on-line list against the full main term, and with the off-line pairs added back
            if nm == 'DH':
                nb = nbar(on, 5, 1); S_on = np.arange(1, N + 1) - nb
                offg = np.sort(np.array([g for b, g in off])); S_full = S_on + 2 * np.searchsorted(offg, on, side='right')
                row.update(S_online_max_abs=float(np.abs(S_on).max()), S_online_at_top=float(S_on[-1]), S_with_offline_max_abs=float(np.abs(S_full).max()),
                           D_online=math.pi * float(np.abs(S_on).max()) / (N * y), D_with_offline=math.pi * float(np.abs(S_full).max()) / (N * y))
        res[nm] = row; log(nm, json.dumps(row))
    json.dump(res, open(os.path.join(OUT, 'c3_tables.json'), 'w'), indent=1)

if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'validate': validate()
    elif cmd == 'list': do_list(sys.argv[2], int(float(sys.argv[3])) if len(sys.argv) > 3 else None)
    elif cmd == 'tables': tables()
