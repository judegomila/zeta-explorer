"""s0scan.py: real zero s0 in (1/2, 1) of Z_{Gamma(2)}(s, chi_{a,b}) (sel.py transfer operator, K = 30; MEASURED).
usage: s0scan.py out.json a1 b1 a2 b2 ..."""
import sys, json, warnings
warnings.simplefilter('ignore')
import sel
def Zr(s, a, b, K=30): return sel.Ztw(s, a, b, K=K, prec=800).real
def find(ab):
    a, b = ab
    grid = [0.505 + 0.015 * i for i in range(34)]
    vals = [Zr(s, a, b) for s in grid]
    zs = []
    for (s0, v0), (s1, v1) in zip(zip(grid, vals), zip(grid[1:], vals[1:])):
        if v0 * v1 < 0:
            lo, hi, flo = s0, s1, v0
            for _ in range(36):
                mid = (lo + hi) / 2; fm = Zr(mid, a, b)
                if fm * flo < 0: hi = mid
                else: lo, flo = mid, fm
            zs.append((lo + hi) / 2)
    return dict(a=a, b=b, zeros=zs, grid=grid, vals=vals)
if __name__ == '__main__':
    import multiprocessing as mp, os
    v = [float(x) for x in sys.argv[2:]]; pairs = list(zip(v[0::2], v[1::2]))
    with mp.Pool(int(os.environ.get('RH_WORKERS', '1'))) as pool: res = pool.map(find, pairs, chunksize=1)
    json.dump(res, open(sys.argv[1], 'w'))
    for r in res: print(r['a'], r['b'], 'real zeros in (0.505, 1):', r['zeros'], flush=True)
