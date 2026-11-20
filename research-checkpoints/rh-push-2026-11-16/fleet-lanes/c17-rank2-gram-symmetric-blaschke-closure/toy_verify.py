# Deterministic verification of the toy identity (Theorem T) by exact evaluation on a product grid (polynomial identity test with degree bounds).
# Identity: K_0(lam,mu) psi(lam) psi(mu) = Delta(lam) Delta(mu) * (1, I2, I3)(lam) H(a1,a2) (1, I2, I3)(mu)^T   for real lam, mu
# (both sides are polynomial after multiplication by D = product of the 18 linear forms a + b; degree <= 18 in each of z1, z2, y1, y2 and <= 6 in each of a1, a2;
#  both sides symmetric in (a1, a2)). Grid: z_i in {2..20}, y_i in {k + 1/3 : k = 2..20} (no form a + b vanishes), a_i in {1/3, ..., 7/3}: 19^4 * 28 points.
# H at the nodes is the exactly fitted matrix; the symbolic H of toy_exact.py is its Lagrange interpolant on the same nodes.
import sys, os, json, itertools
from multiprocessing import Pool
from flint import fmpq
import toy_exact_lib as L
def work(a):
    a1, a2 = a
    H, bad = L.fitH(a1, a2)
    M, psi = L.setup(a1, a2)
    Z = [fmpq(k) for k in range(2, 21)]; Y = [fmpq(3*k+1, 3) for k in range(2, 21)]
    n = 0; fail = 0
    idx = [0, 1, 2]
    for z1 in Z:
        for z2 in Z:
            lam = (z1, z2); il = L.inv(lam)[:3]; dl = L.Delta(lam); pl = psi(lam)
            ol = L.orb(lam, M)
            for y1 in Y:
                for y2 in Y:
                    mu = (y1, y2); im = L.inv(mu)[:3]
                    om = L.orb(mu, M)
                    s = fmpq(0)
                    for (p, q_, c) in ol:
                        for (p2, q2, c2) in om:
                            s += c*c2/((p+p2)*(q_+q2))
                    lhs = s*pl*psi(mu)
                    rhs = dl*L.Delta(mu)*sum((H[i, j]*il[i]*im[j] for i in idx for j in idx), fmpq(0))
                    n += 1; fail += (lhs != rhs)
    return (str(a1), str(a2), n, fail, bad)
if __name__ == '__main__':
    nodes = [fmpq(k, 3) for k in range(1, 8)]
    pairs = [(x, y) for i, x in enumerate(nodes) for y in nodes[i:]]
    tot = 0; fails = 0; res = []
    with Pool(int(os.environ.get('RH_WORKERS', '7'))) as pool:
        for r in pool.imap_unordered(work, pairs):
            res.append(r); tot += r[2]; fails += r[3]
    print('node pairs', len(pairs), 'grid points checked', tot, 'failures', fails)
    json.dump(dict(pairs=len(pairs), points=tot, failures=fails, detail=res), open('toy_verify.json', 'w'))
