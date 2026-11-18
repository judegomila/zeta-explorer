# interval arithmetic (arb balls, prec 128): A_S at rigorously isolated zeta zeros and at the shifted points gamma + k d/16
# (d = the float64 number 2 pi / log(gamma_mid/2 pi), used as an exact dyadic). zeta and the Liouville twist (1 + p^{-s})^{-1}.
import sys, json, math, time
from multiprocessing import Pool
from flint import acb, arb, fmpz, ctx
from elib import NW, CPS, CPI, KSH, PR
WS = {'1e3': 500}
def pack(x):
    m, e = x.mid().man_exp(); r, f = x.rad().man_exp(); return (int(m), int(e), int(r), int(f))
def unpack(t):
    return arb(fmpz(t[0])) * arb(2) ** t[1] + arb(0, 1) * (arb(fmpz(t[2])) * arb(2) ** t[3])
def chunk(a):
    n, m = a; ctx.prec = 128
    lp = [arb(int(p)).log() for p in PR]; ps = [arb(int(p)).rsqrt() for p in PR]
    S = [[[arb(0) for _ in CPS] for _ in range(KSH)] for _ in range(2)]
    for z in acb.zeta_zeros(n, m):
        g = z.imag; d = arb(2 * math.pi / math.log(float(g.mid()) / (2 * math.pi)))  # exact double
        for k in range(KSH):
            t = g + d * k / KSH; z1 = acb(1); z2 = acb(1); a0 = 0
            for ci, b in enumerate(CPI):
                for i in range(a0, b):
                    s, c = (t * lp[i]).sin_cos(); u = acb(c * ps[i], -s * ps[i])
                    z1 /= (1 - u); z2 /= (1 + u)
                a0 = b
                S[0][k][ci] += z1.real * z1.real + z1.imag * z1.imag
                S[1][k][ci] += z2.real * z2.real + z2.imag * z2.imag
    return [[[pack(x) for x in row] for row in fam] for fam in S]
if __name__ == '__main__':
    out = {}; t0 = time.time()
    for key in sys.argv[1:]:
        ctx.prec = 128
        n0 = int(open('zeros_%s.meta' % key).read().split()[0]); ws = WS.get(key, 2000); cs = 25
        print(key, 'window: zeros', n0, '..', n0 + ws - 1, 'planned memory: per worker %d arb logs + sqrt ~ %.1f MB' % (len(PR), len(PR) * 2 * 100e-6), flush=True)
        with Pool(NW) as pool: res = pool.map(chunk, [(n0 + i, cs) for i in range(0, ws, cs)], chunksize=1)
        ctx.prec = 128
        for fi, fam in enumerate(('zeta', 'liou')):
            for ci, P in enumerate(CPS):
                A = [arb(0)] * KSH
                for r in res:
                    for k in range(KSH): A[k] = A[k] + unpack(r[fi][k][ci])
                U = sum(A[1:], A[0]) / KSH; RU = A[0] / U; Rh = A[0] / A[KSH // 2]
                M = arb(1)
                for p in PR[:CPI[ci]]: M /= (1 - arb(1) / int(p))
                Rref = A[0] / (M * ws)
                out['%s|%s|%d' % (key, fam, P)] = dict(ws=ws, n0=n0, A0=A[0].str(25), U=U.str(25), RU=RU.str(20), Rhalf=Rh.str(20), Rref=Rref.str(20),
                    RU_upper=float((RU.mid() + RU.rad()).str(20, radius=False)), RU_lower=float((RU.mid() - RU.rad()).str(20, radius=False)))
                print(key, fam, P, 'RU', RU.str(15), 'Rhalf', Rh.str(15), 'Rref', Rref.str(15), flush=True)
        print(key, 'sec', time.time() - t0, flush=True)
        json.dump(out, open('iv.json', 'w'))
