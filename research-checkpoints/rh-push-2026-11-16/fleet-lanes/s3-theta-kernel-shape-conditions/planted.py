# supporting measurement for combination 3 (Pick part): the smallest order of a real Pick matrix with a negative
# determinant when one off-line quadruple {+-b +- i g} is planted on top of zeta,
#   L(x) = L_zeta(x) + 4x(x^2 - b^2 + g^2)/((x^2 - b^2 + g^2)^2 + 4 b^2 g^2),
# as a function of the height g.  Same node law as t_tp.py (half uniform (0,4), half log-uniform [0.01,100]).
import sys, os, json, math, time
import multiprocessing as mp
import numpy as np
from flint import arb
import klib3 as K3, t_tp as T
PREC = 4096; ORD = 40; M = 160; NT = 60
def pool_item(xs):
    K3.setp(PREC, 1)
    out = []
    for x in xs:
        F = T.Lval('zeta', K3.SPEC('zeta'), arb(x), PREC)
        out.append((F[1]/F[0]).str(int(PREC*0.30103) - 8, radius=False))
    return out
def run(args):
    g, b, xs, Ls, seed = args
    K3.setp(PREC, 1)
    x = [arb(v) for v in xs]; L0 = [arb(v) for v in Ls]
    gg = arb(g); bb = arb(b)
    L = [L0[i] + 4*x[i]*(x[i]**2 - bb*bb + gg*gg)/((x[i]**2 - bb*bb + gg*gg)**2 + 4*bb*bb*gg*gg) for i in range(len(x))]
    rng = np.random.Generator(np.random.PCG64(seed))
    hist = {}
    for _ in range(NT):
        idx = rng.choice(len(x), size=ORD, replace=False)
        A = [[(L[i] + L[j])/(x[i] + x[j]) for j in idx] for i in idx]
        first = None
        for k in range(ORD):
            p = A[k][k]
            s = K3.sgn(p)
            if s <= 0:
                first = (k + 1) if s < 0 else -(k + 1)
                break
            Ak = A[k]
            for i in range(k + 1, ORD):
                Ai = A[i]; f = Ai[k]/p
                for j in range(k + 1, ORD):
                    Ai[j] = Ai[j] - f*Ak[j]
        hist[first] = hist.get(first, 0) + 1
    return g, b, hist
if __name__ == '__main__':
    nw = int(os.environ.get('RH_WORKERS', '4'))
    rng = np.random.Generator(np.random.PCG64(77))
    xf = np.concatenate([rng.uniform(0, 4, M//2), np.exp(rng.uniform(math.log(0.01), math.log(100), M - M//2))])
    xs = [repr(float(v)) for v in xf]
    t0 = time.time()
    with mp.get_context('fork').Pool(nw) as pool:
        parts = pool.map(pool_item, [xs[i::nw] for i in range(nw)])
        Ls = [None]*M
        for w in range(nw):
            for k, v in enumerate(parts[w]):
                Ls[w + k*nw] = v
        print('pool done %.0f s' % (time.time() - t0), flush=True)
        tasks = [(g, b, xs, Ls, 31) for b in ('0.3', '0.05') for g in ('0', '2', '4', '8', '16', '32', '64', '85.7', '128')]
        res = []
        for g, b, hist in pool.imap(run, tasks):
            hh = {str(k): v for k, v in sorted(hist.items(), key=lambda kv: (kv[0] is None, kv[0] or 0))}
            print('b=%s g=%s  first negative pivot order histogram (None = none up to %d; negative key = undetermined): %s' % (b, g, ORD, hh), flush=True)
            res.append({'b': b, 'g': g, 'hist': hh})
    json.dump({'prec': PREC, 'order': ORD, 'pool': M, 'tuples': NT, 'rows': res}, open('out/planted.json', 'w'), indent=0)
