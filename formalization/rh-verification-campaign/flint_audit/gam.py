import mpmath as mp
mp.mp.dps=30
# A.6: claim |Gamma((-s+iy)/2)| < |Gamma((s+iy)/2)| for all real y (y=(t+t0))
for s in [3,5,7,9,25]:
    worst=max((abs(mp.gamma((-s+1j*y)/2))/abs(mp.gamma((s+1j*y)/2)), y) for y in mp.linspace(0,40,4001))
    print("sigma",s,"max ratio |G(-s/2+iy/2)|/|G(s/2+iy/2)| over y in [0,40]:",mp.nstr(worst[0],6),"at y=",mp.nstr(worst[1],4))
# A.4/A.10: sup_x |Gamma(1/4+ix/2)| e^{pi x/4} < 4
f=lambda x: abs(mp.gamma(mp.mpf(1)/4+1j*x/2))*mp.e**(mp.pi*x/4)
xs=mp.linspace(-50,200,25001); m=max((f(x),x) for x in xs); print("sup |Gamma(1/4+ix/2)|e^{pi x/4} on [-50,200]:",mp.nstr(m[0],8),"at x=",mp.nstr(m[1],5), " value at 1e12:",mp.nstr(f(mp.mpf(10)**12),6))
