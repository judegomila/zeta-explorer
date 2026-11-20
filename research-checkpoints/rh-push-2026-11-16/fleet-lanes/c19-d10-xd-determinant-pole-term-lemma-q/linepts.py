from conc import *
F = fmpq
def jp(setupres, lam):
    b = setupres[0]
    return [(b(-(x[0]+x[1])), x) for (x, sg) in orbit(lam) if b(-(x[0]+x[1])) != 0]
def test(r, label):
    S = setup(r); b, Q, jm, pair, N, v = S; a = [-x for x in r[1:]]; d = len(a)
    def g(pts): return inertia_q(gram([jp(S, p) for p in pts], pair))
    res = {}
    for name, zs in (('z=a_j', a), ('z=-1-a_j', [-1-x for x in a]), ('z=1+a_j', [1+x for x in a]), ('z=a_j-2', [x-2 for x in a]), ('z=-a_j-2', [-x-2 for x in a]), ('z=2a_j', [2*x for x in a]),
                     ('z=a_j & 1', a+[F(1)]), ('z=a_j,-1-a_j', a+[-1-x for x in a]), ('generic', [F(k, 3) for k in range(7, 7+2*d+3)])):
        res[name] = g([(F(1), z) for z in zs])
    print(label, res, flush=True)
    if d <= 4:
        G = gram([jp(S, (F(1), z)) for z in a], pair)
        print('   Gram at z=a_j:', [[str(x) for x in row] for row in G])
test([F(1), F(-1, 4), F(-3, 4)], 'SYM d=2')
test([F(1), F(-1, 4), F(-3, 4), F(-1, 3), F(-2, 3)], 'SYM d=4')
test([F(1), F(-1, 4), F(-3, 4), F(-1, 3), F(-2, 3), F(-1, 7), F(-6, 7)], 'SYM d=6')
test([F(1), F(-1, 5), F(-2, 3)], 'nonsym left+right')
test([F(1), F(-2, 3), F(-4, 5)], 'nonsym right right')
