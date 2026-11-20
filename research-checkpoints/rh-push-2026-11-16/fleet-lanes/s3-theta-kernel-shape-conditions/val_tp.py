# validation of t_tp.py: L(x) = F'/F against mpmath for zeta and DH; a Pick matrix built from a function with a known
# off-line zero pair (F = xi * (1 + (w^2 ... )) is not available in closed form, so the check is the model
# L_m(x) = L_zeta(x) + sum over a planted quadruple {+-b +- i g}: 4x(x^2 - b^2 + g^2)/((x^2 - b^2 + g^2)^2 + 4 b^2 g^2).
import mpmath as mp, numpy as np
from flint import arb
import klib3 as K3, t_tp as T
mp.mp.dps = 40
def xi(w):
    s = mp.mpf(1)/2 + w
    return s*(s - 1)/2*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
for x in ('0.3', '2.5', '40'):
    K3.setp(256, 1)
    F = T.Lval('zeta', K3.SPEC('zeta'), arb(x), 256)
    L = F[1]/F[0]
    ref = mp.diff(lambda w: mp.log(xi(w)), mp.mpf(x))
    print('zeta L(%s) = %s   mpmath %s' % (x, L.str(25), mp.nstr(ref, 25)))
kd = (mp.sqrt(10 - 2*mp.sqrt(5)) - 2)/(mp.sqrt(5) - 1); bb = [0, 1, kd, -kd, -1]
def LamDH(w):
    s = mp.mpf(1)/2 + w
    return (5/mp.pi)**((s + 1)/2)*mp.gamma((s + 1)/2)*sum(bb[r]*mp.zeta(s, mp.mpf(r)/5) for r in range(1, 5))/5**s
for x in ('0.3', '2.5'):
    K3.setp(256, 1)
    F = T.Lval('dh', K3.SPEC('dh'), arb(x), 256)
    print('dh   L(%s) = %s   mpmath %s' % (x, (F[1]/F[0]).str(25), mp.nstr(mp.diff(lambda w: mp.log(LamDH(w)), mp.mpf(x)), 25)))
# planted quadruple: smallest Pick order with a negative determinant on random nodes (float128-free: mpmath, 200 tuples)
rng = np.random.Generator(np.random.PCG64(5))
def Lz(x):
    return mp.diff(lambda w: mp.log(xi(w)), x)
pool = [mp.mpf(float(v)) for v in np.concatenate([rng.uniform(0, 4, 20), np.exp(rng.uniform(np.log(0.01), np.log(100), 20))])]
Lp = [Lz(x) for x in pool]
for b, g in ((mp.mpf('0.4'), mp.mpf('2.86')), (mp.mpf('0.35'), mp.mpf('14.13')), (mp.mpf('0.3'), mp.mpf('85.7'))):
    Lq = [Lp[i] + 4*x*(x*x - b*b + g*g)/((x*x - b*b + g*g)**2 + 4*b*b*g*g) for i, x in enumerate(pool)]
    first = {}
    for _ in range(300):
        idx = rng.choice(40, size=10, replace=False)
        M = mp.matrix(10, 10)
        for i in range(10):
            for j in range(10):
                M[i, j] = (Lq[idx[i]] + Lq[idx[j]])/(pool[idx[i]] + pool[idx[j]])
        for m in range(1, 11):
            if mp.det(M[:m, :m]) < 0:
                first[m] = first.get(m, 0) + 1; break
    print('planted pair b=%s g=%s on top of zeta: histogram of the first order with a negative determinant (300 tuples, orders <= 10):' % (b, g), dict(sorted(first.items())))
