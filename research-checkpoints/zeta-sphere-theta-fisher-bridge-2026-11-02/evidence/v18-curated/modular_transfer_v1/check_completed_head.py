"""Authored sanity checks; analytic proof provides rigorous bounds, not these floats."""
import mpmath as mp
mp.mp.dps=70

def head(z,N,m):
    return (mp.fsum(mp.power(n,-z) for n in range(1,N+1))
      +mp.power(N,1-z)/(z-1)-mp.power(N,-z)/2
      +mp.fsum(mp.bernoulli(2*k)/mp.factorial(2*k)*mp.rf(z,2*k-1)
        *mp.power(N,-z-2*k+1) for k in range(1,m+1)))

def bounds(z,N,m):
    sig=mp.re(z)
    e=2*mp.zeta(2*m)/(2*mp.pi)**(2*m)*abs(mp.rf(z,2*m))*N**(1-sig-2*m)/(sig+2*m-1)
    e1=e*(mp.fsum(1/abs(z+r) for r in range(2*m))+mp.log(N)+1/(sig+2*m-1))
    return e,e1

for t,N,m in [(10,10,4),(100,100,10),(1000,1000,12)]:
    for sig in [mp.mpf('.25'),mp.mpf('.5'),mp.mpf('.75'),mp.mpf('1')]:
        z=sig+1j*t
        h=head(z,N,m); hp=mp.diff(lambda u:head(u,N,m),z)
        e,e1=bounds(z,N,m)
        r=abs(mp.zeta(z)-h); r1=abs(mp.diff(mp.zeta,z)-hp)
        assert r<=e and r1<=e1
        bg=2*mp.re(1/z+1/(z-1)-mp.log(mp.pi)/2+mp.digamma(z/2)/2)
        actual=bg*abs(mp.zeta(z))**2/2+mp.re(mp.diff(mp.zeta,z)*mp.conj(mp.zeta(z)))
        approx=bg*abs(h)**2/2+mp.re(hp*mp.conj(h))
        E=abs(bg)/2*(2*abs(h)*e+e*e)+abs(hp)*e+abs(h)*e1+e*e1
        assert abs(actual-approx)<=E
        print('t',t,'sigma',sig,'m',m,'R/e',mp.nstr(r/e,10),'Rprime/e1',mp.nstr(r1/e1,10),'bridge_error/E',mp.nstr(abs(actual-approx)/E,10))
