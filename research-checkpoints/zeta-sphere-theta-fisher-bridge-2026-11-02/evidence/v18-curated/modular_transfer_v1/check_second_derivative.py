"""Authored floating sanity checks only; theorem bounds are analytic."""
import mpmath as mp
mp.mp.dps=65

def head(z,N,m):
 return mp.fsum(mp.power(n,-z) for n in range(1,N+1))+N**(1-z)/(z-1)-N**(-z)/2+mp.fsum(mp.bernoulli(2*k)/mp.factorial(2*k)*mp.rf(z,2*k-1)*N**(-z-2*k+1) for k in range(1,m+1))
for t,N,m in [(10,10,4),(100,100,10)]:
 for sig in map(mp.mpf,['.25','.5','.75','1']):
  z=sig+1j*t; D=sig+2*m-1
  S1=mp.fsum(1/abs(z+r) for r in range(2*m)); S2=mp.fsum(1/abs(z+r)**2 for r in range(2*m))
  e=2*mp.zeta(2*m)/(2*mp.pi)**(2*m)*abs(mp.rf(z,2*m))*N**(1-sig-2*m)/D
  e1=e*(S1+mp.log(N)+1/D); e2=e*((S1+mp.log(N)+1/D)**2+S2+1/D**2)
  h=[mp.diff(lambda u:head(u,N,m),z,k) for k in range(3)]
  f=[mp.diff(mp.zeta,z,k) for k in range(3)]
  assert abs(f[2]-h[2])<=e2
  b=2*mp.re(1/z+1/(z-1)-mp.log(mp.pi)/2+mp.digamma(z/2)/2)
  bp=2*mp.re(-1/z**2-1/(z-1)**2+mp.polygamma(1,z/2)/4)
  def cur(v):return (b*b+bp)*abs(v[0])**2+4*b*mp.re(v[1]*mp.conj(v[0]))+2*abs(v[1])**2+2*mp.re(v[2]*mp.conj(v[0]))
  E2=abs(b*b+bp)*(2*abs(h[0])*e+e*e)+4*abs(b)*(abs(h[1])*e+abs(h[0])*e1+e*e1)+2*(2*abs(h[1])*e1+e1*e1)+2*(abs(h[2])*e+abs(h[0])*e2+e*e2)
  assert abs(cur(f)-cur(h))<=E2
  print(t,sig,'Rsecond/e2',mp.nstr(abs(f[2]-h[2])/e2,10),'curvature_error/E2',mp.nstr(abs(cur(f)-cur(h))/E2,10))
