# off-line DH zero to high precision (arb): f = ((1-i k)/2) L(s,chi) + ((1+i k)/2) L(s,chibar), chi mod 5, chi(2)=i
import sys
from flint import acb, arb, ctx, dirichlet_char
P = int(sys.argv[1]); ctx.prec = P + 200
s5 = arb(5).sqrt(); kap = ((10-2*s5).sqrt()-2)/(s5-1)
c1 = dirichlet_char(5, 2); c2 = dirichlet_char(5, 3)
assert abs(complex(c1(2)) - 1j) < 1e-12
I = acb(0, 1)
def f(s): return ((1-I*kap)/2)*c1.l(s) + ((1+I*kap)/2)*c2.l(s)
s = acb('0.808517182456637', '85.6993484853776')
h = arb(2)**(-(P//3))
for it in range(14):
    fs = f(s); d = (f(s+h)-f(s-h))/(2*h)
    s = s - fs/d
    s = acb(s.real.mid(), s.imag.mid())
res = abs(f(s))
print('residual |f| ~', res.str(5), file=sys.stderr)
nd = int(P*0.30103)
open('rho0.txt', 'w').write(s.real.str(nd, radius=False) + '\n' + s.imag.str(nd, radius=False) + '\n')
