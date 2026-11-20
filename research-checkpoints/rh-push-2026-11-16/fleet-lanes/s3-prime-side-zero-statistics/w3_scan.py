"""Detection scan in Arb. Usage: w3_scan.py FAMILY lo hi X prec [plant]
1. Builds W_box on the grid nu0 = lo, spacing 2 pi/log X, up to hi.  LDL^T without pivoting: the index k of the first negative pivot is the
   smallest k such that the leading window [lo, nu_k] has a negative eigenvalue (all pivots certified nonzero).  Reported as edge = nu_k.
2. With 'plant' (zeta-type family): adds to the zero set one extra quadruple gamma0 -+ i beta, -gamma0 -+ i beta (exact zero-side term added to the
   exact prime-side matrix) and reports the inertia: detection of an off-line pair at height gamma0 from the window [lo, hi] with primes <= X."""
import sys, json, time
from flint import arb, acb, ctx
import w3_arb

def inertia(M):
    m = len(M); A = [row[:] for row in M]
    pos = neg = 0; first = None; minpiv = None; negpiv = None
    for k in range(m):
        p = A[k][k]
        if p > 0: pos += 1
        elif p < 0:
            neg += 1
            if first is None: first = k; negpiv = float(p.mid())
        else: return dict(n_pos=pos, n_neg=neg, undecided=m - pos - neg, first_neg=first, stopped_at=k)
        lg = float(abs(p).log().mid()) / 2.302585092994046
        minpiv = lg if minpiv is None else min(minpiv, lg)
        rk = A[k]
        for i in range(k + 1, m):
            f = rk[i] / p; ri = A[i]
            for j in range(i, m): ri[j] = ri[j] - f * rk[j]
    return dict(n_pos=pos, n_neg=neg, undecided=0, first_neg=first, log10_min_abs_pivot=minpiv, first_neg_pivot=negpiv)

def hann(M):
    m = len(M)
    A = [[(M[i][j] + 2 * M[i + 1][j] + M[i + 2][j]) / 4 for j in range(m)] for i in range(m - 2)]
    return [[(A[i][j] + 2 * A[i][j + 1] + A[i][j + 2]) / 4 for j in range(m - 2)] for i in range(m - 2)]

if __name__ == '__main__':
    name = sys.argv[1]; lo = float(sys.argv[2]); hi = float(sys.argv[3]); X = float(sys.argv[4]); prec = int(sys.argv[5])
    plant = len(sys.argv) > 6 and sys.argv[6] == 'plant'
    t0 = time.time()
    W, nus, L, meta = w3_arb.run(name, lo, hi, X, prec, False, log=lambda *a: print(*a, file=sys.stderr, flush=True), return_W=True)
    n = len(W)
    r = inertia(W); rh = inertia(hann(W))
    meta['box'] = r; meta['hann'] = rh
    meta['edge_box'] = None if r['first_neg'] is None else float(nus[r['first_neg']].mid())
    meta['edge_hann'] = None if rh['first_neg'] is None else float(nus[rh['first_neg'] + 1].mid())
    print(json.dumps(meta), flush=True)
    if plant:
        for g0 in [hi + d for d in (2.0, 5.0, 10.0, 15.0, 20.0, 30.0, 40.0, 60.0, 100.0, 300.0, 1000.0)]:
            for beta in (0.3, 0.01):
                M = [row[:] for row in W]
                for sg in (1, -1):
                    g = acb(sg * g0, -beta)
                    F = [2 * ((g - nus[a]) * L / 2).sin() / (g - nus[a]) for a in range(n)]
                    for a in range(n):
                        for b in range(n):
                            M[a][b] = M[a][b] + 2 * (F[a] * F[b]).real
                rr = inertia(M)
                print(json.dumps(dict(family=name, lo=lo, hi=hi, X=X, prec=prec, n=n, plant_gamma=g0, plant_beta=beta, **rr,
                                      edge=None if rr['first_neg'] is None else float(nus[rr['first_neg']].mid()), t=time.time() - t0)), flush=True)
