"""Lemma L check: T-NR theta kernel on node sets whose ROW nodes lie on a p0^2-lattice (columns arbitrary).
Cauchy-Binet with the weight sequence (q^-1/2, c, q^1/2): totally positive iff c >= 2.  Also: sign change of the E_a kernel."""
import sys, json, random
import mpmath as mp
mp.mp.dps = 150
def theta(x): return mp.jtheta(3, 0, mp.exp(-mp.pi*x))
def th_nr(x, q, c): return c*theta(x) + theta(x/q**2)/mp.sqrt(q) + mp.sqrt(q)*theta(x*q**2)
R = {}
ref = {3: -1, 4: -1, 5: 1}
for name, q, c in [('TNR q=2 c=2.0506', 2, mp.mpf(29)/10/mp.sqrt(2)), ('TNR q=3 c=2.0785', 3, mp.mpf(18)/5/mp.sqrt(3)),
                   ('twin q=2 c=2 (double zeros on the line)', 2, mp.mpf(2)),
                   ('tempered twin q=2 c=1.4142', 2, mp.sqrt(2)), ('tempered twin q=2 c=0.5', 2, mp.mpf('0.5')),
                   ('tempered twin q=3 c=0', 3, mp.mpf(0))]:
    rng = random.Random(77); R[name] = {}
    for order in (3, 4, 5):
        agree = dis = 0
        for _ in range(150):
            x0 = mp.exp(rng.uniform(-0.5, 0.5))
            a = sorted(rng.sample(range(-2, 3), order)) if order <= 5 else None
            ys = sorted(rng.uniform(-1.2, 1.2) for _ in range(order))
            M = mp.matrix(order, order)
            for i in range(order):
                for j in range(order): M[i, j] = th_nr(x0*mp.mpf(q)**(2*a[i])*mp.exp(ys[j]), q, c)
            s = mp.sign(mp.det(M))
            if s == ref[order]: agree += 1
            else: dis += 1
        R[name][order] = dict(sign_of_zeta=ref[order], agree=agree, disagree=dis)
    print(name, R[name], flush=True)
mp.mp.dps = 30
def xis(s): return mp.power(mp.pi, -s/2)*mp.gamma(s/2)*mp.zeta(s)
def Estar(y, s):
    tot = xis(2*s)*y**s + xis(2*s-1)*y**(1-s); n = 1
    while True:
        term = 4*mp.sqrt(y)*mp.power(n, s-mp.mpf(1)/2)*sum(mp.power(d, 1-2*s) for d in range(1, n+1) if n % d == 0)*mp.besselk(s-mp.mpf(1)/2, 2*mp.pi*n*y)
        tot += term; n += 1
        if abs(term) < mp.mpf(10)**(-32): break
    return tot
R['E_a_sign_change_y'] = {}
for a in ('0.1', '0.2', '0.3', '0.4'):
    s = mp.mpf(1)/2 + mp.mpf(a)
    ystar = mp.findroot(lambda y: Estar(y, s), (2, 40), solver='anderson')
    R['E_a_sign_change_y'][a] = dict(y_star=float(ystar), E_at_1=float(Estar(mp.mpf(1), s)), E_at_2ystar=float(Estar(2*ystar, s)))
print(R['E_a_sign_change_y'])
json.dump(R, open(sys.argv[1], 'w'), indent=1)
