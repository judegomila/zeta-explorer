"""Second referee: the zeta(s+a)zeta(s-a) row of c17-window-information-law in the lane's own window model.
Configuration of E_a (given RH in the window): every ordinate gamma carries the pair gamma +- i a; no on-line zeros.
Synthetic set: pairs at zeta's ordinates (stored floats) in |gamma - T| <= H, pairs at lattice points (spacing
2 pi/Lg) outside. For u <= Lg the full lattice row is (2 Lg) Id (Theorem 6), so
  T = (2 Lg + 2M) Id - sum_{lattice in W} pair + sum_{zeta in W} pair,  pair = |c><c| - |d><d|,
  c = (v_z + v_zbar)/sqrt2, d = i (v_z - v_zbar)/sqrt2.
neg(T) = pos(K + G/c0) - pos(K) (inertia of [[c0, V],[V*, -K]]), G the real Gram matrix. Ball arithmetic; pivots certified."""
import json, math, sys, time, os
from multiprocessing import Pool
from flint import arb, acb, acb_mat, ctx
T = 1e6; H = float(os.environ.get('HW', '45'))
def run(args):
    theta, Mf, a = args
    ctx.prec = 512
    t0 = time.time()
    Tb = arb(T); Lg = (Tb / (2 * arb.pi())).log(); u = arb(theta) * Tb.log(); half = u / 2
    assert float(u) < float(Lg)
    M = arb(Mf); c0 = 2 * Lg + 2 * M
    zs = [g for g in json.load(open('zeros_1e+06.json'))['zeros_minus_T'] if abs(g) <= H]
    d = 2 * arb.pi() / Lg; jmax = int(H / float(d))
    lat = [d * j for j in range(-jmax, jmax + 1)]
    aa = arb(a)
    xs = [arb(z) for z in zs] + lat
    sg = [1] * len(zs) + [-1] * len(lat)
    # order: all K = +1 vectors first (c of zeta pairs, d of removed lattice pairs), then K = -1
    pts = []; 
    for x in xs:
        pts.append(acb(x, aa)); pts.append(acb(x, -aa))
    N = len(pts)
    Gv = acb_mat([[u * ((pts[j] - pts[i].conjugate()) * half).sinc() for j in range(N)] for i in range(N)])
    r2 = arb(2).sqrt(); I1 = acb(0, 1)
    U = [[acb(0)] * N for _ in range(N)]
    for j in range(len(xs)):
        U[2 * j][2 * j] = acb(1) / r2; U[2 * j + 1][2 * j] = acb(1) / r2          # c
        U[2 * j][2 * j + 1] = I1 / r2;  U[2 * j + 1][2 * j + 1] = -I1 / r2        # d
    U = acb_mat(U)
    G = U.conjugate().transpose() * Gv * U
    K = []
    for s in sg:
        K += [s, -s]
    order = [i for i in range(N) if K[i] == 1] + [i for i in range(N) if K[i] == -1]
    A = [[G[i, j].real / c0 + (K[i] if i == j else 0) for j in order] for i in order]
    imax = max(abs(float(G[i, j].imag.mid())) for i in range(0, N, 37) for j in range(N))
    pos = neg = 0; verdict = None
    for k in range(N):
        p = A[k][k]
        if p > 0: pos += 1
        elif p < 0: neg += 1
        else:
            verdict = 'undecided pivot %d' % k; break
        inv = 1 / p; rk = A[k]
        for i in range(k + 1, N):
            f = A[i][k] * inv
            ri = A[i]
            for j in range(i, N):
                ri[j] = ri[j] - f * rk[j]
        for i in range(k + 1, N):
            for j in range(i + 1, N):
                A[j][i] = A[i][j]
    posK = sum(1 for v in K if v == 1)
    rec = dict(T=T, theta=theta, M=Mf, a=a, H=H, n_zeta_pairs=len(zs), n_lattice_pairs_removed=len(lat), N=N, pos=pos, neg=neg,
               posK=posK, negT=(pos - posK) if verdict is None else None, verdict=verdict or ('pass' if pos == posK else 'fail'),
               max_imag_sample=imax, sec=round(time.time() - t0, 1))
    print(json.dumps(rec), flush=True)
    return rec
if __name__ == '__main__':
    cases = [(th, M, a) for th in (0.5, 0.8) for M in (0.0, 1.0) for a in (0.005, 0.02, 0.05, 0.1, 0.2, 0.3, 0.45)]
    if os.environ.get('CASES'): cases = [tuple(c) for c in json.loads(os.environ['CASES'])]
    print("planned per case: 686 x 686 acb at 512 bits, about 0.1 GB; cases", len(cases), flush=True)
    with Pool(int(os.environ.get('RH_WORKERS', '4'))) as pool:
        res = pool.map(run, cases, chunksize=1)
    json.dump(res, open('out_ea%s.json' % os.environ.get('TAG', ''), 'w'))
    print("done", flush=True)
