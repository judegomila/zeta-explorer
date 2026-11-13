"""Independent 80-decimal mpmath reference; no JavaScript code is reused."""
import json, mpmath as mp
from pathlib import Path
mp.mp.dps=80
points=[(-12,0),(-12,.25),(-12,120),(13,0),(13,40),(13,120),(-4,0),(-4,.2),(-4,17.2),(-4,120),(-2,0),(-2,14.134725141734693),(-.26,.1),(-.25,.1),(0,0),(0,21.5),(.5,0),(.5,1),(.5,14),(.5,14.134725141734693),(.5,20),(.5,40),(.5,60),(.5,90),(.5,120),(1,1e-6),(1,10),(2,0),(2,60),(5,0),(5,120),(.31,-39.7),(-3.74,-119.5)]
def pack(z):return {'re':float(mp.re(z)),'im':float(mp.im(z))}
def xi(s):
 if s in (0,1):return mp.mpf('.5')
 return s*(s-1)/2*mp.power(mp.pi,-s/2)*mp.gamma(s/2)*mp.zeta(s)
refs=[]
for sig,t in points:
 s=mp.mpc(sig,t)
 row={'sigma':sig,'t':t,'zeta':pack(mp.zeta(s)),'zetaDerivative':pack(mp.diff(mp.zeta,s))}
 # Use functional equation across gamma poles (including trivial zeros).
 sx=1-s if sig<.5 else s
 row['xi']=pack(xi(sx));row['xiDerivative']=pack(mp.diff(xi,sx)*(-1 if sig<.5 else 1))
 refs.append(row)
def phi(u):
 e4=mp.exp(4*u);e5=mp.exp(5*u);e9=mp.exp(9*u)
 return mp.fsum((2*mp.pi**2*n**4*e9-3*mp.pi*n*n*e5)*mp.exp(-mp.pi*n*n*e4) for n in range(1,13))
heat=[]
for sig,t,tau in [(.5,0,-1),(.5,14,-1),(.5,21,.5),(.1,30,.25),(1.2,40,-.5),(.5,60,1),(.4,90,-1),(.5,120,1),(-4,15,-1),(5,120,1),(.2,-32,-.1),(-12,40,1),(13,120,-1)]:
 z=2*mp.mpc(t,-(sig-.5));ta=mp.mpf(tau)
 integrand=lambda u:8*mp.exp(ta*u*u)*phi(u)*mp.cos(z*u)
 v=mp.quad(integrand,[0,.125,.25,.5,.75,1,1.5])
 deriv=lambda u:16j*u*mp.exp(ta*u*u)*phi(u)*mp.sin(z*u)
 dv=mp.quad(deriv,[0,.125,.25,.5,.75,1,1.5])
 heat.append({'sigma':sig,'t':t,'tau':tau,'heat':pack(v),'derivative':pack(dv)})
 print('reference',sig,t,tau,flush=True)
Path(__file__).with_name('reference.json').write_text(json.dumps({'generator':'mpmath 1.3.0, 80 decimal digits; direct unshifted theta quadrature','points':refs,'heat':heat},indent=2)+'\n')
