"""s5 combination 4: lower tail of the Lehmer functional q = D^2 G and of the gaps; minimum-gap exponents; matched sizes.

For consecutive ordinates x_k < x_{k+1} of a list (unfolded):  D = x_{k+1} - x_k,
  G = sum_{j != k, k+1} [(x_k - x_j)^-2 + (x_{k+1} - x_j)^-2]   (Csordas-Smith-Varga; scale invariant: q = D^2 G does not depend on the unfolding)
evaluated with KN neighbours on each side plus the unit-density tail 1/(distance + 1/2) on each of the four sides.
GUE small-gap law P(D < s) = pi^2 s^3/9 gives P(q < eps) ~ C eps^(3/2).  Estimators:
  Hill exponent of the lower tail of q below eps0 and of D below s0:  m / sum log(eps0/q_i);
  minimum-gap exponent: slope of mean log(min gap in a block of m gaps) against log m  (GUE: -1/3), and the ladder version of the node.
"""
import sys, math, json, time
import numpy as np
KN = 64
EPS0 = [0.02, 0.05, 0.1, 0.2]
S0 = [0.1, 0.2]

def lehmer_q(x, chunk=1_000_000):
    """returns (D, q) for k = KN .. n-KN-2"""
    n = len(x); lo = KN; hi = n - KN - 2
    D = np.empty(hi - lo + 1); q = np.empty(hi - lo + 1)
    for a in range(lo, hi + 1, chunk):
        b = min(hi + 1, a + chunk); k = np.arange(a, b)
        xk = x[k]; xk1 = x[k + 1]
        G = np.zeros(b - a)
        for m in range(1, KN + 1):
            l = x[k - m]; r = x[k + 1 + m]
            G += (xk - l) ** -2 + (r - xk) ** -2 + (xk1 - l) ** -2 + (r - xk1) ** -2
        l = x[k - KN]; r = x[k + 1 + KN]
        G += 1 / (xk - l + 0.5) + 1 / (r - xk + 0.5) + 1 / (xk1 - l + 0.5) + 1 / (r - xk1 + 0.5)
        d = xk1 - xk
        D[a - lo:b - lo] = d; q[a - lo:b - lo] = d * d * G
    return D, q

def hill(v, v0):
    s = v[v < v0]; m = len(s)
    if m < 3: return None, m
    return float(m / np.sum(np.log(v0 / s))), m

def block_hill(v, v0, size):
    nb = len(v) // size; out = []
    for b in range(nb):
        h, m = hill(v[b * size:(b + 1) * size], v0)
        out.append(np.nan if h is None else h)
    return np.array(out)

def minexp(D, jmin=6):
    """slope of mean log min over disjoint blocks of 2^j gaps; jackknife over 16 super-blocks"""
    n = len(D); jmax = int(math.log2(n)) - 5
    if jmax <= jmin + 1: return None
    def slope(Ds):
        xs = []; ys = []
        for j in range(jmin, jmax + 1):
            m = 2 ** j; nb = len(Ds) // m
            if nb < 8: break
            mn = Ds[:nb * m].reshape(nb, m).min(1)
            xs.append(j * math.log(2)); ys.append(float(np.mean(np.log(mn))))
        return np.polyfit(xs, ys, 1)[0], xs, ys
    s, xs, ys = slope(D)
    nj = 16; step = n // nj
    js = np.array([slope(np.concatenate([D[:i * step], D[(i + 1) * step:]]))[0] for i in range(nj)])
    se = math.sqrt((nj - 1) / nj * np.sum((js - js.mean()) ** 2))
    return dict(slope=float(s), se=float(se), logm=xs, mean_log_min=ys)

def ladder(D, base=100):
    xs = []; ys = []
    N = base
    while N <= len(D):
        xs.append(math.log(N)); ys.append(math.log(float(D[:N].min()))); N *= 2
    if len(xs) < 4: return None
    return dict(slope=float(np.polyfit(xs, ys, 1)[0]), rungs=len(xs))

def summary(x, name, sizes=(), log=print):
    t0 = time.time()
    D, q = lehmer_q(np.asarray(x, dtype=np.float64))
    D = D / D.mean()
    out = dict(name=name, n_pairs=int(len(D)), q_min=float(q.min()), D_min=float(D.min()), q_median=float(np.median(q)), frac_q_below_0p8=float(np.mean(q < 0.8)),
               tail_counts={str(e): int((q < e).sum()) for e in (1e-4, 1e-3, 1e-2, 0.02, 0.05, 0.1, 0.2, 0.8)})
    out['hill_q'] = {}
    for e in EPS0:
        h, m = hill(q, e); out['hill_q'][str(e)] = dict(kappa=h, m=m, se=(h / math.sqrt(m) if h else None))
    out['hill_D'] = {}
    for s in S0:
        h, m = hill(D, s); out['hill_D'][str(s)] = dict(kappa=h, m=m, se=(h / math.sqrt(m) if h else None))
    out['min_gap_exponent_blocks'] = minexp(D)
    out['min_q_exponent_blocks'] = minexp(q)
    out['min_gap_exponent_ladder'] = ladder(D)
    out['matched'] = {}
    for sz in sizes:
        if sz * 8 > len(D): continue
        e = {}
        for e0 in (0.1, 0.2):
            bh = block_hill(q, e0, sz); ok = ~np.isnan(bh)
            e['hill_q_%g' % e0] = dict(nblocks=int(len(bh)), frac_defined=float(ok.mean()),
                                       quantiles=[float(v) for v in np.quantile(bh[ok], [0.025, 0.5, 0.975])] if ok.sum() >= 20 else None)
        nb = len(q) // sz
        mq = q[:nb * sz].reshape(nb, sz).min(1); md = D[:nb * sz].reshape(nb, sz).min(1)
        e['min_q_quantiles'] = [float(v) for v in np.quantile(mq, [0.025, 0.5, 0.975])]
        e['min_D_quantiles'] = [float(v) for v in np.quantile(md, [0.025, 0.5, 0.975])]
        e['first_block'] = dict(min_q=float(mq[0]), min_D=float(md[0]))
        out['matched'][str(sz)] = e
    log('  %s: %d pairs, %.0fs' % (name, len(D), time.time() - t0))
    return out

if __name__ == '__main__':
    import lists
    out = sys.argv[1]; res = []
    sizes = (30, 100, 1000, 10000, 100000, 1000000)
    for nm in sys.argv[2:]:
        lst = lists.load(nm)
        print('list', nm, len(lst['x']), 'zeros; planned allocation: 6 arrays of 1e6 float64 per chunk + 2 arrays of n = %.2f GB' % (2 * len(lst['x']) * 8 / 1e9), flush=True)
        r = summary(lst['x'], nm, sizes, log=lambda s: print(s, flush=True))
        r['T_lo'] = float(lst['t0'] + lst['d'][0]); r['T_hi'] = float(lst['t0'] + lst['d'][-1])
        res.append(r); json.dump(res, open(out, 'w'), indent=1)
