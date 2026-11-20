"""Owned three-region tree comparison using only previously certified moments."""
import json,sys
from pathlib import Path
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,ctx
ctx.prec=192
p=Path(__file__).parent
def ball(q):
 lo=arb(q['lo']);hi=arb(q['hi']);return (lo+hi)/2+arb(0,((hi-lo)/2).upper())
def solve(m):
 d1=m[1];l21=m[2]/d1;l31=m[3]/d1;d2=m[3]-m[2]*l21;l32=(m[4]-m[2]*l31)/d2;d3=m[5]-m[3]*l31-d2*l32*l32
 assert all(x.lower()>0 for x in [d1,d2,d3])
 y1=m[4];y2=m[5]-l21*y1;y3=m[6]-l31*y1-l32*y2
 cost=y1*y1/d1+y2*y2/d2+y3*y3/d3
 x3=y3/d3;x2=y2/d2-l32*x3;x1=y1/d1-l21*x2-l31*x3
 return m[7]-cost,[-x1,-x2,-x3],[d1,d2,d3,l21,l31,l32]
def quad(d,v):
 d1,d2,d3,l21,l31,l32=d
 return d1*(v[0]+l21*v[1]+l31*v[2])**2+d2*(v[1]+l32*v[2])**2+d3*v[2]**2
def add(x,y):return [a+b for a,b in zip(x,y)]
def sub(x,y):return [a-b for a,b in zip(x,y)]
def gamma_test(x,y):
 for k in range(-4,21):
  gamma=arb(2)**k;m=[gamma*a-b for a,b in zip(y,x)]
  try:_,_,d=solve(m)
  except (AssertionError,ZeroDivisionError):continue
  return k,gamma,d
 raise RuntimeError('no metric bound')
def directed(x):return {'lo':str(x.lower()),'hi':str(x.upper())}
out={}
for name,shift in [('odd7',1),('even6',0)]:
 a=json.loads((p/f'degree{7 if shift else 6}_eighth_partition_4000.json').read_text())
 b=json.loads((p/(f'degree{7 if shift else 6}_'+('regional_payment' if shift else 'half_partition')+'_4000.json')).read_text())
 def moments(d,r):return [arb(0)]+[ball(d['regions'][r]['moments'][str(j+shift)]) for j in range(7)]
 C=moments(a,'core');P=moments(b,'core');T=moments(b,'tail');M=sub(P,C)
 sc,zc,dc=solve(C);sm,zm,dm=solve(M);st,zt,dt=solve(T)
 sp,zp,dp=solve(add(C,M));sg,zg,dg=solve(add(add(C,M),T))
 vc=quad(dc,sub(zc,zp));vm=quad(dm,sub(zm,zp));vcm=vc+vm
 vp=quad(dp,sub(zp,zg));vt=quad(dt,sub(zt,zg));vpt=vp+vt
 k,gamma,gd=gamma_test(C,M)
 metric_core=sc+vcm/(1+gamma)
 group=sc+sm+vcm;total=group+st+vpt
 out[name]={'bounds':{key:directed(v) for key,v in [('s_core',sc),('s_middle',sm),('s_tail',st),('inner_core_variation',vc),('inner_middle_variation',vm),('inner_variation',vcm),('outer_variation',vpt),('inner_group',group),('total',total),('core_metric_payment',metric_core)]},'middle_old_pivots':[str(x.lower()) for x in dm[:3]],'gamma_core_vs_middle':str(gamma),'gamma_power':k,'comparison_pivots':[str(x.lower()) for x in gd[:3]],'scope':'Moment interval subtraction and tree algebra only; no fresh quadrature or target reserve input. Inconclusive lower bounds are not sign counterexamples.'}
print(json.dumps(out,indent=2))
