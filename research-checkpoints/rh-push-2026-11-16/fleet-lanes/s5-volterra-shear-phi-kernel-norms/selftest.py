# validation of slib against known values
import sys, time
from flint import arb, ctx
import slib
import mpmath as mp
slib.setprec(256)
print('Phi(0) =', slib.phi_zeta(arb(0)).str(20), '(known 0.446696900467)')
mp.mp.dps = 40
xi = lambda s: s*(s - 1)/2*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
for npp in (40, 64):
    T, W, K = slib.table('zeta', npp)
    I0 = sum(w*k for w, k in zip(W, K))
    print('npp', npp, 'int_0^inf Phi =', I0.str(35), ' xi(1/2)/8 =', mp.nstr(xi(mp.mpf(1)/2)/8, 35))
I, Ep, Em = slib.exp_moments(T, W, K, 0.5)
G = ((Ep*Em - I*I)/4).sqrt()
print('G(0.5) =', G.str(15), '(record 4.673660098e-4)')
for a in ('31.6213', '31.6214'):
    I, Ep, Em = slib.exp_moments(T, W, K, arb(a)); print('G(%s) =' % a, ((Ep*Em - I*I)/4).sqrt().str(15))
# DH Fourier identity at t = 3.7
T, W, K = slib.table('DH', 64)
t = 3.7
lhs = 2*sum(w*k*(2*t*x).cos() for x, w, k in zip(T, W, K))
k_ = (mp.sqrt(10 - 2*mp.sqrt(5)) - 2)/(mp.sqrt(5) - 1); bb = [0, 1, k_, -k_, -1]
s = mp.mpf(1)/2 + 1j*t
F = sum(bb[r]*mp.zeta(s, mp.mpf(r)/5) for r in range(1, 5))/5**s
print('DH Fourier:', lhs.str(25), mp.nstr((5/mp.pi)**((s + 1)/2)*mp.gamma((s + 1)/2)*F, 25))
# chi-4, chi5 at t = 2.1:  Lambda(1/2+it)
for key, q, d, chi in (('chi-4', 4, 1, [0, 1, 0, -1]), ('chi5', 5, 0, [0, 1, -1, -1, 1])):
    T, W, K = slib.table(key, 64); t = 2.1
    lhs = 2*sum(w*k*(2*t*x).cos() for x, w, k in zip(T, W, K))
    s = mp.mpf(1)/2 + 1j*t
    L = sum(chi[r]*mp.zeta(s, mp.mpf(r)/q) for r in range(1, q))/q**s
    print(key, 'Fourier:', lhs.str(25), mp.nstr((q/mp.pi)**((s + d)/2)*mp.gamma((s + d)/2)*L, 25))
# E_b: int_R Phi_b = (int_R Phi e^{2bu})^2 = (xi(1/2+b)/4)^2
slib.setprec(128)
t0 = time.time(); T, W, K = slib.table('E_b=0.25', 30); print('conv table time', time.time() - t0, len(T))
print('E_b int_0^inf:', sum(w*k for w, k in zip(W, K)).str(20), ' (xi(3/4)/4)^2/2 =', mp.nstr((xi(mp.mpf(3)/4)/4)**2/2, 20))
# T-NR transform at w = 1.3
slib.setprec(256)
for key in ('NR(3,2.2)', 'NR(1000003,2.2)'):
    q = int(key[3:-1].split(',')[0])
    T, W, K = slib.table(key, 48); wv = arb('1.3')
    lhs = 2*sum(w*k*(wv*x).cos() for x, w, k in zip(T, W, K))
    T0, W0, K0 = slib.table('zeta', 48)
    rhs = 2*sum(w*k*(wv*x).cos() for x, w, k in zip(T0, W0, K0))*(2*(wv*arb(q).log()/2).cos() + arb('2.2'))
    print(key, lhs.str(25), rhs.str(25))
