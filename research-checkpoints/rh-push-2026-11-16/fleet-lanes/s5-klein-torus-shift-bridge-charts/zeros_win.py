"""Zeros for the frozen blocks.  usage: zeros_win.py ZETA|LCHI4|LCHI5 OUT.json lo1 hi1 [lo2 hi2 ...]
ZETA: Arb zeta_nzeros / zeta_zeros (isolated zeros of zeta on the line; the index range covers [lo, hi]).
LCHI: sign changes of the Hardy Z function on a grid of step 1/(40 x mean density), refined by bisection; the count is compared
with the main term of the counting function (not a certificate of completeness)."""
import sys, json, math, os
from multiprocessing import Pool
from flint import acb, arb, ctx, dirichlet_char

def zeta_win(args):
    lo, hi = args; ctx.prec = 110
    n0 = int(float(arb(lo).zeta_nzeros().mid())); n1 = int(float(arb(hi).zeta_nzeros().mid()))
    zs = acb.zeta_zeros(n0 + 1, n1 - n0) if n1 > n0 else []
    return dict(lo=lo, hi=hi, n0=n0, n1=n1, gammas=[z.imag.mid().str(25, radius=False) for z in zs], max_rad=max([float(z.imag.rad()) for z in zs] or [0]))

def lchi_win(args):
    code, lo, hi = args; ctx.prec = 80
    ch = dirichlet_char(4, 3) if code == 'LCHI4' else dirichlet_char(5, 4); q = 4 if code == 'LCHI4' else 5
    dens = math.log(q * max(hi, 10) / (2 * math.pi)) / (2 * math.pi); h = 1 / (25 * dens)
    n = int((hi - lo) / h) + 1; g = []
    tp = arb(lo); zp = ch.hardy_z(acb(tp)).real
    for i in range(1, n + 1):
        t = arb(lo) + arb(i) * arb(h); z = ch.hardy_z(acb(t)).real
        if (zp > 0 and z < 0) or (zp < 0 and z > 0):
            a, b, za = tp, t, zp
            for _ in range(36):
                m = (a + b) / 2; zm = ch.hardy_z(acb(m)).real
                if (za > 0 and zm < 0) or (za < 0 and zm > 0): b = m
                else: a = m; za = zm
            g.append(((a + b) / 2).mid().str(22, radius=False))
        tp, zp = t, z
    cnt = lambda T: T / math.pi * math.log(q * T / (2 * math.pi * math.e))
    return dict(lo=lo, hi=hi, gammas=g, count=len(g), main_term=cnt(hi) - cnt(lo))

if __name__ == '__main__':
    code, out = sys.argv[1:3]; v = [float(x) for x in sys.argv[3:]]; wins = list(zip(v[0::2], v[1::2]))
    with Pool(int(os.environ.get('RH_WORKERS', '1'))) as p:
        res = p.map(zeta_win, wins, chunksize=1) if code == 'ZETA' else p.map(lchi_win, [(code, a, b) for a, b in wins], chunksize=1)
    json.dump(dict(code=code, windows=res), open(out, 'w'))
    for r in res: print(r['lo'], r['hi'], len(r['gammas']), r.get('max_rad'), r.get('main_term'))
