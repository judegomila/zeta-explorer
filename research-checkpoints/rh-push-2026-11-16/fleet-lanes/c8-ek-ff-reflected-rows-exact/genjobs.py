"""Job lists for the 'en' kernel. Region of hypothesis (E-K): d + lam > N (Q P > Z). K-region: N - lam < d < N + lam.
Weights (mode p1 p2 p3): a, b targets; mu; mn = mu * nu_a; r1 random unimodular; n1 random +-1; th THIN-type; dh = nu_a + nu_b; al aligned."""
import sys
def irr3(q):
    out = []
    for idx in range(q ** 3):
        c = [idx % q, idx // q % q, idx // q // q]
        if all((x ** 3 + c[2] * x * x + c[1] * x + c[0]) % q for x in range(q)): out.append(idx)
    return out
def weights(q):
    I = irr3(q); a = 2 if 2 in I else I[0]; b = 8 if 8 in I else next(i for i in I if i != a)
    return {'a': (0, 3, a, 3), 'b': (0, 3, b, 3), 'mu': (4, 0, 0, 0), 'mn': (7, 3, a, 3), 'r1': (1, 11, 0, 0), 'n1': (2, 21, 0, 0),
            'th': (6, 31, 0, 0), 'tb': (8, 31, 90, 0), 'dh': (3, 3, a, b), 'al': (5, 0, 0, 0)}
def grid(q, Tmax, dmax, Npmax, names, Tmin=0):
    W = weights(q); out = []
    for T in range(Tmin, Tmax + 1):
        for d in range(1, dmax + 1):
            Np = T - d
            if Np < 1 or Np > Npmax: continue
            for lam in range(0, Np + 1):
                N = Np - lam
                if N < 1 or lam > (6 if q == 7 else 4) or N > (7 if q == 7 else 5): continue
                if not (d + lam > N): continue
                if d > 2 * Np: continue
                for n in names:
                    w = W[n]; out.append((q ** T / max(lam, 1), f'en {q} {d} {N} {lam} {w[0]} {w[1]} {w[2]} {w[3]} 0'))
    return out
if __name__ == '__main__':
    q = int(sys.argv[1]); what = sys.argv[2]
    W = weights(q); allw = list(W)
    if what == 'grid':
        Tmax = int(sys.argv[3]); Tmin = int(sys.argv[4]) if len(sys.argv) > 4 else 0
        names = sys.argv[5].split(',') if len(sys.argv) > 5 else allw
        jobs = grid(q, Tmax, 8, 9, names, Tmin)
    else:
        jobs = []
        for spec in sys.argv[3:]:
            cfg, names = spec.split(':'); N, lam, d = [int(x) for x in cfg.split(',')]
            for n in (allw if names == 'all' else names.split(',')):
                w = W[n]; jobs.append((q ** (d + N + lam) / max(lam, 1), f'en {q} {d} {N} {lam} {w[0]} {w[1]} {w[2]} {w[3]} 0'))
    jobs.sort()
    sys.stderr.write(f'{len(jobs)} jobs, total pair-row operations {sum(j[0] for j in jobs):.3e}\n')
    for j in jobs: print(j[1])
