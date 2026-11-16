# Long nested run: L values in a small process pool (exact dyadic transfer of midpoint and radius), LDL pivots in ball arithmetic.
import sys, json, time
from multiprocessing import Pool
from flint import arb, ctx, fmpq
from lib import *
func, family, Nmax, prec, nproc = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
def work(j):
    ctx.prec = prec
    x = nodes(family, j+1)[j]
    v = (L_xi if func == 'xi' else L_dh)(x)
    m, r = v.mid().man_exp(), v.rad().man_exp()
    return j, (int(m[0]), int(m[1])), (int(r[0]), int(r[1]))
def dy(me):
    return arb(fmpq(me[0])*(fmpq(2)**me[1]))
if __name__ == '__main__':
    ctx.prec = prec
    t0 = time.time()
    with Pool(nproc) as p: out = p.map(work, range(Nmax), chunksize=1)
    ctx.prec = prec + 64
    Ls = [None]*Nmax
    for j, m, r in out: Ls[j] = arb(dy(m), dy(r))
    ctx.prec = prec
    xs = nodes(family, Nmax)
    print('L done', time.time()-t0, 'max rel rad', max(float((l.rad()/abs(l.mid())).mid()) for l in Ls), flush=True)
    A, K = pick_normalized(xs, Ls)
    d = ldl_pivots(A)
    rows = []
    for n in range(1, Nmax):
        piv = d[n]
        sign = '+' if piv > 0 else ('-' if piv < 0 else '?')
        rows.append(dict(order=n+1, y=float(xs[n].mid()), sign=sign, piv=piv.str(8), log10=log10mid(piv)))
    first = next((r for r in rows if r['sign'] != '+'), None)
    print('first non-positive pivot:', first, flush=True)
    for r in rows:
        if r['order'] % 10 == 0 or r['sign'] != '+': print(json.dumps(r), flush=True)
    json.dump(dict(func=func, family=family, Nmax=Nmax, prec=prec, first=first, rows=rows, seconds=time.time()-t0),
              open(f'long_{func}_{family}_{Nmax}.json', 'w'))
