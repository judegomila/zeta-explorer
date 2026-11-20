# Newly authored interval Taylor integration for positive halfline parent Gram.
import mpmath as mp,json,sys,time
from fractions import Fraction as F
iv=mp.iv;iv.dps=55;mp.mp.dps=65
N=int(sys.argv[1]) if len(sys.argv)>1 else 300
Ps=[[F(0),F(-12),F(8)]]
for j in range(39):
 p=Ps[-1];q=[F(0)]*(len(p)+1)
 for k,c in enumerate(p):q[k]+=(2*k+F(1,2))*c;q[k+1]-=2*c
 Ps.append(q)
assert max(sum(map(abs,p)) for p in Ps)<10**53
P=[[iv.mpf(c.numerator)/c.denominator for c in p]for p in Ps]
mu=json.load(open('/workspace/shared/zeta_sphere_campaign/full_split_audit/actual_total_certificate.json'))['moments']
muiv=[iv.mpf(x)for x in mu];mum=[sum(map(mp.mpf,x))/2 for x in mu]
ix=list(range(1,20,2));scstr=[mp.nstr(1/mp.sqrt(mum[j]/4**j),60)for j in ix];sc=[iv.mpf(s)for s in scstr]
tail=2*iv.mpf(10)**53*iv.mpf(507)**(iv.mpf(165)/4)*iv.exp(-507)
# For n>=13, z>=3n², and z^(k+1/4)e^-z decreases; next-orbit ratio<1/2.
assert tail.b<iv.mpf('1e-50')
assert (iv.mpf(14)/13)**(iv.mpf(165)/2)*iv.exp(-81)<iv.mpf('0.5')
def deriv(h):
 d=[iv.mpf(0)for _ in range(40)];x=iv.exp(2*h);fac0=iv.exp(h/2)
 for n in range(1,13):
  z=iv.pi*n*n*x;fac=fac0*iv.exp(-z)
  for j in range(40):
   v=iv.mpf(0)
   for c in reversed(P[j]):v=v*z+c
   d[j]+=fac*v
 return [v+iv.mpf([-1,1])*tail for v in d]
def bound(v):return max(abs(v.a),abs(v.b))
def fk(d,i,j,k,h):
 s=sum(iv.mpf(mp.binomial(k,l))*d[i+l]*d[j+k-l]for l in range(k+1))
 if k:return h*s+k*sum(iv.mpf(mp.binomial(k-1,l))*d[i+l]*d[j+k-1-l]for l in range(k))
 return h*s
G=[[iv.mpf(0)for _ in range(10)]for _ in range(10)];err=[[iv.mpf(0)for _ in range(10)]for _ in range(10)]
delta=iv.mpf(3)/N;half=delta/2
for cell in range(N):
 h=iv.mpf(3)*(2*cell+1)/(2*N);hr=h+iv.mpf([-1,1])*half;dc=deriv(h);dr=deriv(hr)
 for r,i in enumerate(ix):
  for s in range(r+1):
   j=ix[s];v=sum(fk(dc,i,j,k,h)*2*half**(k+1)/mp.factorial(k+1)for k in range(0,20,2));e=bound(fk(dr,i,j,20,hr))*2*half**21/mp.factorial(21)
   G[r][s]+=v*sc[r]*sc[s];err[r][s]+=e*sc[r]*sc[s]
 if cell%20==0: print('cell',cell,'of',N,flush=True)
z0=3*iv.exp(6);spatial_tail=2*iv.mpf(10)**106*z0**(iv.mpf(165)/2)*iv.exp(-2*z0)
assert spatial_tail.b<iv.mpf('1e-400')
for r in range(10):
 for s in range(r+1):
  G[r][s]+=iv.mpf([-1,1])*(err[r][s]+spatial_tail*sc[r]*sc[s]);G[s][r]=G[r][s]
def enc(x):return [mp.nstr(mp.mpf(x.a._mpi_[0]),60),mp.nstr(mp.mpf(x.b._mpi_[1]),60)]
out={'cells':N,'scales':scstr,'G0':[[enc(v)for v in r]for r in G],'max_remainder':enc(max(v for r in err for v in r)),'orbit_tail':enc(tail),'spatial_tail':enc(spatial_tail)}
json.dump(out,open('/workspace/shared/zeta_sphere_campaign/fisher_bridge_v3/parent_interval_'+str(N)+'.json','w'),indent=2)
print('max_remainder',out['max_remainder'],flush=True)
