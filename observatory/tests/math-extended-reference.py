"""Independent 90-decimal reference for compactified-tail log-polar evaluation."""
import mpmath as mp, json
from pathlib import Path
mp.mp.dps=90
points=[(-128,0),(-127.999,.1),(-128,120),(-128,1000),(-128,2000),(-64,450),(-64,451),(-64,2000),(-12,1000),(-.250001,700),(-.25,700),(-.249999,2000),(0,2000),(.5,120),(.5,200),(.5,450),(.5,451),(.5,700),(.5,950),(.5,1000),(.5,1500),(.5,2000),(.499,2000),(.501,2000),(.21,-1999.9),(1.1,2000),(7.9999,2000),(8,2000),(8.0001,2000),(16,1000),(64,2000),(129,0),(129,.1),(129,120),(129,1000),(129,2000)]
rows=[]
def pack(z):return {'re':float(mp.re(z)),'im':float(mp.im(z))}
def xp(s):
 if s==1:return mp.mpf('.5'),(2+mp.euler-mp.log(4*mp.pi))/4
 zv=mp.zeta(s);zd=mp.diff(mp.zeta,s)
 lg=mp.loggamma(1+s/2)-s*mp.log(mp.pi)/2
 v=mp.exp(lg)*(s-1)*zv
 dv=mp.exp(lg)*((s-1)*zd+zv+(s-1)*zv*(mp.digamma(1+s/2)-mp.log(mp.pi))/2)
 return v,dv
for sigma,t in points:
 s=mp.mpc(sigma,t);z=mp.zeta(s);zd=mp.diff(mp.zeta,s)
 sx=1-s if sigma<.5 else s;x,xd=xp(sx)
 if sigma<.5:xd=-xd
 def datum(v,d):
  return {'zero':v==0,'logAbs':None if v==0 else float(mp.log(abs(v))),'arg':0.0 if v==0 else float(mp.arg(v)),'q':None if v==0 else pack(d/v),'derivativeLogAbs':float(mp.log(abs(d)))}
 rows.append({'sigma':sigma,'t':t,'zeta':datum(z,zd),'xi':datum(x,xd),'hardyZ':float(mp.siegelz(t)) if sigma==.5 else None})
 print('reference',sigma,t,flush=True)
Path(__file__).with_suffix('.json').write_text(json.dumps({'generator':'mpmath 1.3.0, 90 decimal digits; logarithms and analytic derivatives of independent zeta/gamma evaluations','points':rows},indent=2)+'\n')
