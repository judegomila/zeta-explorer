import math, mpmath as mp, hk
from flint import acb, ctx
hk.setprec(100)
# 1. functional equations and reality on the line
for kind in ('zeta','chi4','dh','tnr','ea'):
    s = acb(0.3, 17.3)
    lg, v = hk.parts(kind, s); lg2, v2 = hk.parts(kind, 1 - s)
    a = lg.exp()*v; b = lg2.exp()*v2
    lg3, v3 = hk.parts(kind, acb(0.5, 23.7)); c = lg3.exp()*v3
    print(kind, 'FE rel diff', float(abs(a-b).mid()/abs(a).mid()), ' Im/Re on line', float(c.imag.mid()/c.real.mid()))
# 2. DH first off-line zero
lg, v = hk.parts('dh', acb(0.808517, 85.699348)); print('DH f at 0.808517+85.699348i', hk.c128(v))
# 3. H_t against the defining integral (Polymath normalisation H_0 = xi/8)
mp.mp.dps = 30
def Phi(u):
    return mp.nsum(lambda n: (2*mp.pi**2*n**4*mp.e**(9*u) - 3*mp.pi*n**2*mp.e**(5*u))*mp.e**(-mp.pi*n**2*mp.e**(4*u)), [1, 12])
def Hdirect(t, z, d=0):
    f = lambda u: mp.e**(t*u*u)*Phi(u)*(mp.cos(z*u) if d == 0 else -u*mp.sin(z*u) if d == 1 else -u*u*mp.cos(z*u))
    return mp.quad(f, mp.linspace(0, 1.6, 33))
for (t, z) in ((0.2, 30.0), (0.5, 22.0), (1e-3, 25.0), (-0.1, 40.0), (0.164, complex(35.0, 0.6))):
    ref = hk.ref_at('zeta', z.real if isinstance(z, complex) else z)
    zz = acb(z.real, z.imag) if isinstance(z, complex) else acb(z)
    J = hk.Hjet('zeta', zz, t, ref, n=48)
    sc = mp.e**mp.mpf(float(ref.mid()))/8
    for d in range(3):
        a = hk.c128(J[d]); b = complex(Hdirect(t, mp.mpc(z), d)/sc)
        print('t=%g z=%s d=%d GH=%s direct=%s rel=%.2e' % (t, z, d, a, b, abs(a-b)/max(abs(b),1e-300)))
