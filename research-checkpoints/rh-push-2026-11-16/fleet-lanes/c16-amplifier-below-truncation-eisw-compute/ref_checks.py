"""Second pass, different code path: the optimal gain G_opt recomputed from a Gram matrix obtained by direct
two-dimensional quadrature over F (direct.py: Fourier expansion with K-Bessel values, explicit coset sums; no
Maass-Selberg relation, no unfolding, no incomplete beta), float64, and compared with the arb rows of grid.jsonl.
The only quantity shared with the grid is the definition of the object."""
import sys, json, math, time
import numpy as np
from flint import acb, arb, ctx
import direct

def mid(s): return float(s.split('[')[1].split(' ')[0])
grid = {}
for l in open('grid.jsonl'):
    r = json.loads(l); grid[(r['T'], r['N'], r['kind'], r['k'], r['delta'])] = r
cells = [tuple(int(a) for a in c.split(',')) for c in sys.argv[1].split(';')]
out = []
for (T, N) in cells:
    for kind, ks in (('Z', range(1, 13)), ('E', range(1, 4)), ('O', range(1, 3))):
        for k in ks:
            ctx.prec = 200
            g = acb.zeta_zero(k).imag
            if kind == 'Z': sarb = acb(arb(1) / 2, g); dl = '0.5'
            elif kind == 'E': sarb = acb(arb(1) / 2, (g + acb.zeta_zero(k + 1).imag) / 2); dl = '0.5'
            else: sarb = acb(1 - arb('0.1'), g); dl = '0.1'
            t0 = time.time()
            Fo = direct.F(complex(sarb), zero=(kind == 'Z'), sarb=sarb)
            heights = sorted({T * (m // a) / a for m in range(1, N + 1) for a in direct.divisors(m)})
            H = float(max(T * N, N / T))
            fb = lambda x, y, cl: np.array([direct.hecke_formula(Fo, x, y, T, m, cl) for m in range(1, N + 1)])
            G = direct.gram_region(Fo, fb, heights, math.sqrt(3) / 2, H)
            lamv = np.array([Fo.lam(m) for m in range(1, N + 1)])
            G = G + np.outer(lamv, lamv.conj()) * direct.J_tail(Fo, H)
            # norm of the unamplified truncation at height T, by quadrature as well
            f1 = lambda x, y, cl: direct.hecke_formula(Fo, x, y, T, 1, cl)[None, :]
            MT = direct.gram_region(Fo, f1, [float(T)], math.sqrt(3) / 2, float(T))[0, 0].real + direct.J_tail(Fo, float(T))
            gopt = (lamv.conj() @ np.linalg.solve(G.T, lamv)).real * MT
            delta = 1 - complex(sarb).real
            ratio = gopt / N ** delta
            ref = mid(grid[(T, N, kind, k, dl)]['ratio_opt'])
            row = dict(T=T, N=N, kind=kind, k=k, delta=dl, ratio_quadrature=ratio, ratio_grid=ref, absdiff=abs(ratio - ref), sec=round(time.time() - t0, 1))
            out.append(row); print(row, flush=True)
json.dump(out, open('ref_checks_%s.json' % sys.argv[2], 'w'), indent=1)
print("max absdiff", max(r['absdiff'] for r in out))
