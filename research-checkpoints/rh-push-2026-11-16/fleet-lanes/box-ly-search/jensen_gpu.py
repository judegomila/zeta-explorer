#!/usr/bin/env python3
"""Jensen polynomials J^{d,n}: float64 batched companion-matrix eigenvalue screen over all shifts n <= nmax for
each degree d <= dmax (cupy if it provides batched eigvals, else numpy), then certified Sturm counts (Arb) at the
boundary found by the screen.   python jensen_gpu.py <input> <dmax> <nmax> <out.jsonl>
Per degree d one JSON line: flagged shifts (screen), n_f = largest flagged shift, certified verdicts at (d, n_f),
(d, n_f + 1) and (d, 0).  The screen is float64 and is never a verdict."""
import json, math, os, sys, time
import numpy as np
from flint import arb, ctx
import lylib as L

try:
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=8 * 1024 ** 3)
    cp.zeros(1)
except Exception:                                            # noqa
    cp = None


def eig_batch(M):
    if cp is not None:
        try:
            return cp.asnumpy(cp.linalg.eigvals(cp.asarray(M))), 'cupy'
        except Exception:                                    # noqa
            pass
    return np.linalg.eigvals(M), 'numpy'


def main():
    inp, dmax, nmax, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
    K = dmax + nmax + 2
    prec = int(math.lgamma(2 * K + 3) / math.log(2)) + 512
    if inp.startswith('heat'):
        prec = 4096
    ctx.prec = prec
    t0 = time.time()
    print('[jensen_gpu] %s dmax=%d nmax=%d K=%d prec=%d; planned: series %d x %d bits < 1 GB, batch %.0f MB'
          % (inp, dmax, nmax, K, prec, 2 * K + 2, prec, (nmax + 1) * dmax * dmax * 16 * 3 / 2 ** 20), flush=True)
    cs = L.taylor_even(inp, K)
    # gamma(k) = k! c_{2k}: sign and log|.| as floats
    lg, sg = [], []
    lf = 0.0
    for k in range(K + 1):
        if k > 0:
            lf += math.log(k)
        c = cs[k]
        if c.contains(0):
            raise SystemExit('coefficient %d not separated from 0 at prec %d' % (k, prec))
        sg.append(1.0 if c > 0 else -1.0)
        lg.append(float(abs(c).log().mid()) + lf)
    lg, sg = np.array(lg), np.array(sg)
    print('[jensen_gpu] coefficients in %.0fs; signs all positive: %s' % (time.time() - t0, bool((sg > 0).all())), flush=True)
    done = set()
    if os.path.exists(out):
        for l in open(out):
            try:
                done.add(json.loads(l)['d'])
            except ValueError:
                pass
    f = open(out, 'a')
    ns = np.arange(nmax + 1)
    for d in range(2, dmax + 1):
        if d in done:
            continue
        j = np.arange(d + 1)
        lb = np.array([math.lgamma(d + 1) - math.lgamma(i + 1) - math.lgamma(d - i + 1) for i in j])
        la = lb[None, :] + lg[ns[:, None] + j[None, :]]      # log|a_j|, shape (n, d+1)
        sa = sg[ns[:, None] + j[None, :]]
        ls = (la[:, 0] - la[:, d]) / d                       # log of root scale
        b = sa * np.exp(la + j[None, :] * ls[:, None] - (la[:, d] + d * ls)[:, None]) * sa[:, d:d + 1]
        M = np.zeros((nmax + 1, d, d))
        M[:, np.arange(1, d), np.arange(d - 1)] = 1.0
        M[:, :, d - 1] = -b[:, :d]
        ev, backend = eig_batch(M)
        rel = np.abs(ev.imag) / np.maximum(np.abs(ev), 1e-300)
        flagged = np.nonzero(rel.max(axis=1) > 1e-6)[0]
        rec = dict(input=inp, d=d, nmax=nmax, backend=backend, n_flagged=int(len(flagged)),
                   flagged_head=[int(x) for x in flagged[:8]], flagged_tail=[int(x) for x in flagged[-4:]])
        tests = {0}
        if len(flagged):
            nf = int(flagged.max())
            rec['n_f'] = nf
            tests |= {nf, min(nf + 1, nmax)}
            gaps = [int(x) for x in np.setdiff1d(np.arange(nf + 1), flagged)[:3]]   # unflagged shifts below n_f
            rec['unflagged_below_nf'] = gaps
            tests |= set(gaps)
        cert = {}
        for n in sorted(tests):
            try:
                cnt, _ = L.sturm_real_roots(L.jensen_coeffs(cs, d, n))
                cert[str(n)] = 'PASS' if cnt == d else 'FAIL(%d real of %d)' % (cnt, d)
            except L.Unresolved as e:
                cert[str(n)] = 'UNRESOLVED'
        rec['certified'] = cert
        f.write(json.dumps(rec) + '\n')
        f.flush()
        print(json.dumps(rec), flush=True)
    print('[jensen_gpu] finished %.0fs' % (time.time() - t0), flush=True)


if __name__ == '__main__':
    main()
