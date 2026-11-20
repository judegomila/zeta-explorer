from conc import *
F = fmpq
def sub(r, label):
    n = len(r); d = n-1; b, Q, jm, pair, N, v = setup(r)
    a = [-x for x in r]   # a[0] = -1 (pole), a[j] zeros
    def gV(vs): return inertia_q(gram(vs, pair))
    J = range(1, n)
    part = {j: next((k for k in J if a[j]+a[k] == 1), None) for j in J}
    left = [j for j in J if a[j] < F(1, 2)]; right = [j for j in J if a[j] > F(1, 2)]
    res = {}
    res['diag'] = gV([v(j, j) for j in J])
    res['LL all'] = gV([v(j, k) for j in J for k in J])
    res['left x left'] = gV([v(j, k) for j in left for k in left])
    res['right x right'] = gV([v(j, k) for j in right for k in right])
    res['left x right'] = gV([v(j, k) for j in left for k in right])
    res['right x left'] = gV([v(j, k) for j in right for k in left])
    res['partner (j,j\')'] = gV([v(j, part[j]) for j in J if part[j]])
    res['sym v_jk+v_kj'] = gV([[(c, x) for (c, x) in v(j, k)]+[(c, x) for (c, x) in v(k, j)] for j in J for k in J if j <= k])
    res['anti v_jk-v_kj'] = gV([[(c, x) for (c, x) in v(j, k)]+[(-c, x) for (c, x) in v(k, j)] for j in J for k in J if j < k])
    res['diag left'] = gV([v(j, j) for j in left]); res['diag right'] = gV([v(j, j) for j in right])
    res['00'] = gV([v(0, 0)])
    print(label, res, flush=True)
sub([F(1), F(-1, 4), F(-3, 4)], 'SYM d=2')
sub([F(1), F(-1, 4), F(-3, 4), F(-1, 3), F(-2, 3)], 'SYM d=4')
sub([F(1), F(-1, 4), F(-3, 4), F(-1, 3), F(-2, 3), F(-1, 7), F(-6, 7)], 'SYM d=6')
