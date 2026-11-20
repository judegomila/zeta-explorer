import mpmath as mp
mp.mp.dps=25
kap=(mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
f=lambda s: 5**(-s)*(mp.zeta(s,mp.mpf(1)/5)+kap*mp.zeta(s,mp.mpf(2)/5)-kap*mp.zeta(s,mp.mpf(3)/5)-mp.zeta(s,mp.mpf(4)/5))
xi=lambda s: (mp.pi/5)**(-s/2)*mp.gamma((s+1)/2)*f(s)
s0=mp.findroot(f, mp.mpc('0.8085','85.6993')); print('DH zero', mp.nstr(s0,12), 'FE check', mp.nstr(xi(mp.mpc(0.3,2))/xi(1-mp.mpc(0.3,2)),10))
L=lambda z: mp.diff(xi, mp.mpf(1)/2+z)/xi(mp.mpf(1)/2+z)
for x in ('0.05','0.2','0.3','0.375','0.5'):
    vals=[(w, mp.re(L(mp.mpc(x, w)))) for w in [mp.im(s0)+d for d in (-0.3,-0.15,0,0.15,0.3)]]
    print('x=',x, ' Re F\'/F at omega=gamma+(-0.3..0.3):', [mp.nstr(v,5) for _,v in vals])
# zeta comparison at the same heights
xz=lambda s: s*(s-1)/2*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
Lz=lambda z: mp.diff(xz, mp.mpf(1)/2+z)/xz(mp.mpf(1)/2+z)
print('zeta x=0.2:', [mp.nstr(mp.re(Lz(mp.mpc('0.2', mp.im(s0)+d))),5) for d in (-0.3,-0.15,0,0.15,0.3)])
