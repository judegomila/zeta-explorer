# Windowed anticausal transform I(u) = int S(it) w(t) e^{itu} dt, u<0, w Gaussian (centre t0, width Dl).
# Identity: I(u) = -2 pi sum_{RHP poles} r_j W(z_j) e^{z_j u} + Rem,  |Rem| <= sqrt(2 pi) Dl exp(-u^2 Dl^2/2)
# when |S|<=1 on Re z = |u| Dl^2.  zeta vs Davenport-Heilbronn near t0 = 85.699348.
import mpmath as mp, sys
mp.mp.dps = 25
kap = (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
def dh(s, d=0):
    if d == 0:
        return 5**(-s)*(mp.zeta(s, mp.mpf(1)/5) + kap*mp.zeta(s, mp.mpf(2)/5) - kap*mp.zeta(s, mp.mpf(3)/5) - mp.zeta(s, mp.mpf(4)/5))
    return mp.diff(lambda x: dh(x), s)
def L_dh(z):
    s = mp.mpf(1)/2 + z
    h = lambda x: mp.zeta(x, mp.mpf(1)/5) + kap*mp.zeta(x, mp.mpf(2)/5) - kap*mp.zeta(x, mp.mpf(3)/5) - mp.zeta(x, mp.mpf(4)/5)
    hd = mp.zeta(s, mp.mpf(1)/5, 1) + kap*mp.zeta(s, mp.mpf(2)/5, 1) - kap*mp.zeta(s, mp.mpf(3)/5, 1) - mp.zeta(s, mp.mpf(4)/5, 1)
    return mp.log(5/mp.pi)/2 + mp.digamma((s+1)/2)/2 - mp.log(5) + hd/h(s)
def L_z(z):
    s = mp.mpf(1)/2 + z
    return 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s)
t0 = mp.mpf('85.699348')
def run(name, L, alpha, Dl, us, pole_guess=None):
    Sf = lambda z: (1-alpha*L(z))/(1+alpha*L(z))
    W = lambda z: mp.exp((z-1j*t0)**2/(2*Dl**2))
    print(f"== {name}: alpha={alpha} Dl={Dl}")
    # sanity: unimodular on axis
    print("   | |S(i t0)| - 1 | =", mp.nstr(abs(abs(Sf(1j*t0))-1), 3), "  |S(0.5+i t0)| =", mp.nstr(abs(Sf(0.5+1j*t0)), 6), "  |S(1.5+i t0)| =", mp.nstr(abs(Sf(1.5+1j*t0)), 6))
    pl = []
    if pole_guess is not None:
        for g in pole_guess:
            zj = mp.findroot(lambda z: 1+alpha*L(z), g)
            rj = 2/(alpha*mp.diff(L, zj))
            pl.append((zj, rj)); print("   RHP pole z_j =", mp.nstr(zj, 12), " residue r_j = 2/(alpha L'(z_j)) =", mp.nstr(rj, 10), " |r_j|/(2 Re z_j) =", mp.nstr(abs(rj)/(2*zj.real), 8))
    h = mp.mpf('0.01'); n = int(9*Dl/h)
    ts = [t0 + k*h for k in range(-n, n+1)]
    Sv = [Sf(1j*t) for t in ts]
    for u in us:
        I = h*mp.fsum(Sv[i]*mp.exp(-(ts[i]-t0)**2/(2*Dl**2))*mp.exp(1j*ts[i]*u) for i in range(len(ts)))
        pol = -2*mp.pi*mp.fsum(r*W(z)*mp.exp(z*u) for z, r in pl) if pl else mp.mpf(0)
        bound = mp.sqrt(2*mp.pi)*Dl*mp.exp(-u*u*Dl*Dl/2)
        print(f"   u={u}: |I(u)| = {mp.nstr(abs(I), 8)}   |pole sum| = {mp.nstr(abs(pol), 8)}   |I - pole sum| = {mp.nstr(abs(I-pol), 4)}   Gaussian bound = {mp.nstr(bound, 4)}   (line x=|u|Dl^2={mp.nstr(abs(u)*Dl*Dl,3)})")
    sys.stdout.flush()
us = [mp.mpf(x) for x in ('-0.5', '-1', '-2', '-3', '-4', '-6')]
b = mp.mpf('0.308517'); 
for alpha in (mp.mpf('0.3'), mp.mpf(1)):
    wp = mp.sqrt(alpha**2+b**2)-alpha
    run("zeta", L_z, alpha, mp.mpf(1), us)
    run("DH", L_dh, alpha, mp.mpf(1), us, pole_guess=[wp+1j*t0])
