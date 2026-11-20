"""Owned correlated midpoint transport with exact third-derivative error."""
from pathlib import Path
import json
p=Path(__file__).parent
s=(p/'check_moving_flux_energy.py').read_text();exec(s[:s.index('out={};delta')])
s=(p/'check_degree7_regional_payment.py').read_text();f=s[s.index('def calc('):s.index('sums=')].replace('def calc(u,derivative):','def calc_all(u):').replace('if not derivative:return [weight*v for v in g]','val=[weight*v for v in g]')
f=f.replace('return [w2*g[j]+2*w1*fac[j]*ex1[2*j]+weight*fac[j]*ex2[2*j] for j in range(8)]','first=[w1*g[j]+weight*fac[j]*ex1[2*j] for j in range(8)]\n second=[w2*g[j]+2*w1*fac[j]*ex1[2*j]+weight*fac[j]*ex2[2*j] for j in range(8)]\n return val,first,second');exec(f)
def inv(d,v):
 y=forward(d,v);d1,d2,d3,l21,l31,l32=d;x3=y[2]/d3;x2=y[1]/d2-l32*x3;x1=y[0]/d1-l21*x2-l31*x3
 return [x1,x2,x3]
def hull(lo,hi):return (lo+hi)/2+arb(0,((hi-lo)/2).upper())
def quadratic(v,d,shift):return sum(v[i]*v[j]*d[i+j+shift] for i in range(len(v)) for j in range(len(v)))
N=int(sys.argv[1]) if len(sys.argv)>1 else 16000
start=json.loads((p/'core_transport_moments_1000.json').read_text());mom=[ball(start['moments'][str(j)]) for j in range(7)];w=arb(3)/(8*N);sums={0:arb(0),1:arb(0)};errors={0:arb(0),1:arb(0)};mins={k:[None]*3 for k in [0,1]}
for k in range(N):
 mid=arb(1)/8+(arb(k)+arb(1)/2)*w;u=mid+arb(0,(w/2).upper());d0,d1,d2=calc_all(u);mid0=calc(mid,False);quarter0=calc(mid-w/4,False)
 halfmom=[mom[j]+(w/2)*quarter0[j]+arb(0,((w/2)**3*abs(d2[j]).upper()/24).upper()) for j in range(7)]
 for shift in [0,1]:
  inc=[]
  for j in range(6):
   q=d0[j+shift];lo=w*q.lower() if q.lower()<0 else arb(0);hi=w*q.upper() if q.upper()>0 else arb(0);inc.append(hull(lo,hi))
  path=[arb(0)]+[mom[j+shift]+inc[j] for j in range(6)]+[arb(0)]
  _,zc,dc=solve(path);v=zc+[arb(1)]
  rr=[sum(d0[i+j+shift]*zc[j] for j in range(3))+d0[i+3+shift] for i in range(3)];tt=[sum(d1[i+j+shift]*zc[j] for j in range(3))+d1[i+3+shift] for i in range(3)]
  yr=forward(dc,rr);yt=forward(dc,tt);ar=inv(dc,rr)
  third=quadratic(v,d2,shift)-6*sum(a*b/d for a,b,d in zip(yr,yt,dc[:3]))+6*quadratic(ar,d0,shift)
  _,zm,_=solve([arb(0)]+halfmom[shift:shift+6]+[arb(0)]);sl,zl,dl=solve([arb(0)]+mid0[shift:shift+7]);qmid=sl+quad(dl,sub(zm,zl));err=w**3*abs(third).upper()/24
  sums[shift]+=w*qmid+arb(0,err.upper());errors[shift]+=err
  for j in range(3):mins[shift][j]=dc[j].lower() if mins[shift][j] is None or dc[j].lower()<mins[shift][j] else mins[shift][j]
 for j in range(7):mom[j]+=w*mid0[j]+arb(0,(w**3*abs(d2[j]).upper()/24).upper())
out={'N':N,'bits':ctx.prec,'scope':'Fresh source-flow midpoint quadrature with exact S third-derivative error. No target integral or previous gain read. Actual old/cross path verified; full-theta local target densities computed directly.'}
for name,shift in [('even6',0),('odd7',1)]:out[name]={'gain':directed(sums[shift]),'quadrature_error_upper':str(errors[shift].upper()),'old_path_minima':[str(v) for v in mins[shift]],'positive_gain':bool(sums[shift].lower()>0)}
print(json.dumps(out,indent=2))
