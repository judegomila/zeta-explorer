"""C1 (M = L + S), C2 (pointwise unfolding of T_m on the truncated series), C3 (closed form with crossing terms
against two-dimensional quadrature). float64 quadrature against the arb closed form of amp.py."""
import sys, json, math, time, random
import numpy as np
from flint import acb, arb, ctx, fmpq
import amp, direct

out = {}
ctx.prec = 200
zeros = [acb.zeta_zero(k).imag for k in range(1, 13)]
def mkpoint(kind, k, delta=None):
    ctx.prec = 200
    g = zeros[k - 1]
    if kind == 'Z':
        return acb(arb(1) / 2, g), True
    return acb(1 - arb(delta), g), False

def both(sarb, zero):
    ctx.prec = 300
    pt = amp.Point(sarb.real, sarb.imag, zero=zero)
    Fo = direct.F(complex(sarb), zero=zero, sarb=sarb)
    return pt, Fo

which = sys.argv[1:] or ['C1', 'C2', 'C3']
# ---------------- C1 ----------------
if 'C1' in which:
    rows = []
    cases = [('Z', k, None) for k in range(1, 6)] + [('O', 1, '0.2'), ('O', 2, '0.1'), ('O', 3, '0.05')]
    for kind, k, dl in cases:
        sarb, zero = mkpoint(kind, k, dl)
        pt, Fo = both(sarb, zero)
        M = float(pt.MS(1)) * Fo.scale ** 2
        L = direct.J_tail(Fo, 1.0)
        fb = lambda x, y, cl: Fo.f(x, y)[None, :]
        S = direct.gram_region(Fo, fb, [1.0], math.sqrt(3) / 2, 1.0)[0, 0].real
        rows.append(dict(kind=kind, k=k, delta=dl or '0.5', M=M, L=L, S=S, rel=abs(L + S - M) / M))
        print("C1", rows[-1], flush=True)
    out['C1'] = rows
# ---------------- C2 ----------------
if 'C2' in which:
    rows = []
    rng = random.Random(7)
    for kind, k, dl in [('Z', 1, None), ('Z', 4, None), ('O', 2, '0.1')]:
        sarb, zero = mkpoint(kind, k, dl)
        pt, Fo = both(sarb, zero)
        for (T, m) in [(1, 2), (1, 3), (1, 4), (1, 6), (1, 12), (2, 6), (2, 8), (1.5, 5), (4, 30)]:
            worst = 0.0; size = 0.0
            for trial in range(6):
                x = rng.uniform(-0.5, 0.5); y = rng.uniform(1.0, 3.0) if trial % 2 else rng.uniform(max(0.87, math.sqrt(1 - x * x)), 1.3)
                z = complex(x, y)
                lhs = direct.hecke_def(Fo, z, T, m)
                cl = direct.cosets(T / m, y - 1e-9, xmax=abs(x) + 1e-9)
                rhs = direct.hecke_formula(Fo, x, y, T, m, cl)[0]
                worst = max(worst, abs(lhs - rhs)); size = max(size, abs(lhs))
            rows.append(dict(kind=kind, k=k, delta=dl or '0.5', T=T, m=m, maxabs_diff=worst, size=size, crossing=(m > T * T)))
            print("C2", rows[-1], flush=True)
    out['C2'] = rows
# ---------------- C3 ----------------
if 'C3' in which:
    rows = []
    Ns = [int(a) for a in (sys.argv[sys.argv.index('--N') + 1].split(',') if '--N' in sys.argv else ['2'])]
    which = ['C3']
    for kind, k, dl in [('Z', 1, None), ('O', 1, '0.1')]:
        sarb, zero = mkpoint(kind, k, dl)
        pt, Fo = both(sarb, zero)
        TT = float(sys.argv[sys.argv.index('--T') + 1]) if '--T' in sys.argv else 1
        TT = int(TT) if TT == int(TT) else TT
        for (T, N) in [(TT, n) for n in Ns]:
            t0 = time.time()
            P, lam, info = amp.gram(pt, T, N)
            Pc = np.array([[complex(P[m, n]) for n in range(N)] for m in range(N)]) * Fo.scale ** 2
            H = max(T * N, N / T)
            heights = sorted({T * (m // a) / a for m in range(1, N + 1) for a in direct.divisors(m)})
            H = max(H, 1.0 / min(heights))
            def fb(x, y, cl):
                return np.array([direct.hecke_formula(Fo, x, y, T, m, cl) for m in range(1, N + 1)])
            G = direct.gram_region(Fo, fb, heights, math.sqrt(3) / 2, float(H), verbose=True)
            LH = direct.J_tail(Fo, float(H))
            lamv = np.array([Fo.lam(m) for m in range(1, N + 1)])
            G = G + np.outer(lamv, lamv.conj()) * LH
            err = np.abs(G - Pc).max() / np.abs(Pc).max()
            rng = np.random.default_rng(5)
            xs = [np.ones(N) / 1.0 if False else np.array([1.0] + [0.7 - 0.4j] * (N - 1)), rng.standard_normal(N) + 1j * rng.standard_normal(N)]
            rel = []
            for x in xs:
                a = (x @ G @ x.conj()).real; b = (x @ Pc @ x.conj()).real
                rel.append(abs(a - b) / b)
            rows.append(dict(kind=kind, k=k, delta=dl or '0.5', T=T, N=N, gram_maxrel=float(err), norm_rel=[float(r) for r in rel],
                             ncross=info['ncross'], P11=Pc[0, 0].real, PNN_closed=Pc[N - 1, N - 1].real, PNN_quad=G[N - 1, N - 1].real, sec=time.time() - t0))
            print("C3", rows[-1], flush=True)
    out['C3'] = rows
tag = "_".join(which) + ("_T%s_N%s" % (sys.argv[sys.argv.index("--T") + 1], sys.argv[sys.argv.index("--N") + 1]) if "--T" in sys.argv else "")
json.dump(out, open("checks_%s.json" % tag, "w"), indent=1)
