import mpmath as mp
from kern import zeta_kernel, dh_kernel, sharp_kernel
mp.mp.dps=30
Z=zeta_kernel(); D=dh_kernel(); S=sharp_kernel(mp.mpc('0.3','3'))
# evenness via direct series at negative u (bypass the evenness shortcut)
def raw(k,u):
    e=mp.exp(u); return mp.exp(k.shift*u)*mp.nsum(lambda n: k.weight(int(n))*mp.polyval(k.P[0][::-1],k.lam*n*n*e)*mp.exp(-k.lam*n*n*e),[1,mp.inf]) 
for k in (Z,D):
    for u in (0.3,0.9):
        print(k.name,u,mp.nstr(k(u),15),mp.nstr(raw(k,-mp.mpf(u)),15))
# transform checks: F(z)=xi(1/2+z)
xi=lambda s: s*(s-1)/2*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
for z in (mp.mpf('0.2'), mp.mpc('0.1','5')):
    Fz=2*mp.quad(lambda u: Z(u)*mp.cosh(z*u/2),[0,1,2,3,5])
    print('F',z,mp.nstr(Fz,15),mp.nstr(xi(mp.mpf(1)/2+z),15))
    Fs=2*mp.quad(lambda u: S(u)*mp.cosh(z*u/2),[0,1,2,3,5])
    rho=mp.mpc('0.3','3'); print('Fsharp',mp.nstr(Fs,15),mp.nstr(xi(mp.mpf(1)/2+z)*(1-z**2/rho**2)*(1-z**2/mp.conj(rho)**2),15))
rho=mp.mpc('0.3','3'); print('Fsharp(rho)',mp.nstr(2*mp.quad(lambda u: S(u)*mp.cosh(rho*u/2),[0,1,2,3,5]),8))
# derivative check
print(mp.nstr(Z.d(3,0.7),15), mp.nstr(mp.diff(lambda u: Z(u),0.7,3),15))
print(mp.nstr(D.d(2,0.4),15), mp.nstr(mp.diff(lambda u: D(u),0.4,2),15))
# DH: zero of transform at known off-line zero s=0.808517+85.699348i -> z=0.308517+85.699348i
zz=mp.mpc('0.308517','85.699348'); mp.mp.dps=80
print('DH F(z_off)',mp.nstr(2*mp.quad(lambda u: D(u)*mp.cosh(zz*u/2),mp.linspace(0,6,61)),8), 'DH F(0)',mp.nstr(2*mp.quad(lambda u: D(u),[0,1,2,3,6]),8))
