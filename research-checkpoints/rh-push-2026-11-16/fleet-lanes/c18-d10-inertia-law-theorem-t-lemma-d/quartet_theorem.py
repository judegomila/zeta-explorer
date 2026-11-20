# Symmetric quartet in the rational model: rank <= 6 identically, and e6(E, c) = sum of principal 6 x 6 minors of H(E, c) as an exact polynomial.
# Degree bounds: entries of H have degree <= 12 in c and <= 6 in E (N is of degree 6 in the coefficients of b; these have degree <= 2 in c, <= 1 in E).
# A 7 x 7 minor has degree <= 84 in c, <= 42 in E: it vanishes identically if it vanishes on an 85 x 43 grid.  e6 has degree <= 72 in c, <= 36 in E.
import json, sys, time
from multiprocessing import Pool
from flint import fmpq, fmpq_mat, fmpq_mpoly_ctx, Ordering
from quartet_lib import Hmat, m, q
NC, NE = 85, 43
def work(t):
    E, c = t
    H = Hmat(q(E), q(c)); co = H.charpoly().coeffs()
    low = next(i for i, x in enumerate(co) if x != 0)
    return (E, c, m - low, str(co[m-6]) if len(co) > m-6 else '0')
if __name__ == '__main__':
    t0 = time.time()
    with Pool(8) as p: res = p.map(work, [(E, c) for E in range(NE) for c in range(NC)], chunksize=16)
    ranks = {}
    val = {}
    for (E, c, rk, e6) in res: ranks[rk] = ranks.get(rk, 0) + 1; val[(E, c)] = fmpq(e6)
    print('grid', NE, 'x', NC, 'rank histogram', ranks, 'time', round(time.time()-t0)); sys.stdout.flush()
    assert max(ranks) <= 6
    # interpolate e6 on E in 0..36, c in 0..72
    dE, dc = 36, 72
    Vc = fmpq_mat(dc+1, dc+1, [fmpq(c)**k for c in range(dc+1) for k in range(dc+1)]).inv()
    VE = fmpq_mat(dE+1, dE+1, [fmpq(E)**k for E in range(dE+1) for k in range(dE+1)]).inv()
    Vals = fmpq_mat(dE+1, dc+1, [val[(E, c)] for E in range(dE+1) for c in range(dc+1)])
    Co = VE*Vals*Vc.transpose()          # Co[i,j] = coefficient of E^i c^j
    ctx = fmpq_mpoly_ctx.get(('E', 'c'), Ordering.lex)
    poly = ctx.from_dict({(i, j): Co[i, j] for i in range(dE+1) for j in range(dc+1) if Co[i, j] != 0})
    print('e6: degree in E', poly.degrees()[0], 'degree in c', poly.degrees()[1], 'terms', len(poly)); sys.stdout.flush()
    # check the interpolant on the rest of the grid (E in 37..42, c in 73..84)
    bad = sum(1 for (E, c) in val if (E > dE or c > dc) and poly(fmpq(E), fmpq(c)) != val[(E, c)])
    print('interpolant against the remaining grid values: mismatches', bad)
    const, facs = poly.factor()
    print('constant', const)
    out = []
    for f, e in facs: print('factor^%d:' % e, f); out.append((str(f), int(e)))
    json.dump(dict(grid=[NE, NC], rank_hist={str(k): v for k, v in ranks.items()}, e6_deg=[int(x) for x in poly.degrees()], const=str(const), factors=out, mismatches=bad), open('quartet_theorem.json', 'w'), indent=1)
