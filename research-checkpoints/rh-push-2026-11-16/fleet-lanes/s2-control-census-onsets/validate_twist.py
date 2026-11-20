# Validation of twist.py: (a) completed L-values against python-flint Dirichlet L-functions; (b) known low zeros.
import math, cmath, numpy as np, twist
from flint import acb, ctx, dirichlet_char, dirichlet_group
ctx.prec = 100
def flint_L(q, vals, s):
    G = dirichlet_group(q)
    for m in range(1, q):
        if math.gcd(m, q) != 1: continue
        ch = dirichlet_char(q, m)
        if all(abs(complex(ch(n)) - vals(n)) < 1e-9 for n in range(1, min(q, 60))): return complex(ch.l(acb(s.real, s.imag)))
    raise ValueError('character not found')
twist.setup(3000)
for d in (-3, 8, -7, 13, -31, 77, -84):
    X = twist.kron_table([d], 400)[0]
    for fam in ('zeta', 'arm'):
        if fam == 'zeta': q = abs(d); vals = lambda n: complex(X[n % q]) if True else 0
        o = twist.Obj(fam, d, X)
        vals = (lambda n: complex(X[n])) if fam == 'zeta' else (lambda n: complex(X[n])*twist.CHI5[n % 5])
        for s in (complex(0.5, 1.3), complex(0.8, -2.1), complex(1.4, 0.4)):
            Lf = flint_L(o.q, vals, s)
            import scipy.special as sp
            comp = (o.q/math.pi)**((s + o.dl)/2)*sp.gamma((s + o.dl)/2)*Lf
            mine = o.F(np.array([s]))[0]
            print(fam, 'd=%d q=%d s=%s rel.err %.1e |eps|-1 %.1e' % (d, o.q, s, abs(mine - comp)/abs(comp), abs(abs(o.eps) - 1)))
# first zero of L(s, chi_-3) is 8.0397..., of chi_-4 6.0209 (outside the box); low zero check: d = -163? use winding = found
for d in (-3, 5, 8, -7, 12, -1867, 9973*1 if 9973 % 4 == 1 else 9977):
    X = twist.kron_table([d], int(math.sqrt(14.7*5*abs(d))) + 3)[0]
    for fam in ('zeta', 'arm', 'dh'):
        if fam != 'zeta' and d % 5 == 0: continue
        o = twist.Obj(fam, d, X); wn, zs, mx = twist.zeros_in_box(o, 9.0 if abs(d) < 20 else 2.5, 1.25)
        print(fam, d, 'winding', wn, 'found', len(zs), 'maxstep %.2f' % mx, [(round(z.real, 5), round(z.imag, 5)) for z in sorted(zs, key=lambda z: z.real)][:8])
