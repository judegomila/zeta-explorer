import mpmath as m,json,time,sys
from fractions import Fraction as F
m.mp.dps=70
step=m.mpf(1)/int(sys.argv[1] if len(sys.argv)>1 else 32)
P=[[F(0),F(-12),F(8)]]
for j in range(19):
 old=P[-1]; new=[F(0)]*(len(old)+1)
 for k,c in enumerate(old):new[k]+=(2*k+F(1,2))*c;new[k+1]-=2*c
 P.append(new)
P=[[m.mpf(c.numerator)/c.denominator for c in p] for p in P]
mu=json.load(open('/workspace/shared/zeta_sphere_campaign/full_split_audit/actual_total_certificate.json'))['moments']
mu=[sum(map(m.mpf,x))/2 for x in mu]
ix=list(range(1,20,2))
sc=[1/m.sqrt(mu[i]/4**i) for i in ix]
G1=m.matrix(10)
for r,i in enumerate(ix):
 for s,j in enumerate(ix):
  k=(i+j)//2;G1[r,s]=(-1)**(1+k)*mu[k]/4**k*sc[r]*sc[s]
nodes=[]
for k in range(-int(4/step),int(4/step)+1):
 t=k*step;v=m.pi/2*m.sinh(t);h=m.mpf(3)/2*(1+m.tanh(v));w=step*3*m.pi/4*m.cosh(t)/m.cosh(v)**2
 if h==0 or h==3:continue
 d=[m.mpf(0)]*20
 for n in range(1,13):
  z=m.pi*n*n*m.exp(2*h);fac=m.exp(h/2-z)
  for j in range(20):d[j]+=fac*m.polyval(P[j][::-1],z)
 nodes.append((h,w,d))
print('nodes',len(nodes),flush=True)
def gram(a,deriv=False):
 G=m.matrix(10)
 for h,w,d in nodes:
  f=[sum(m.binomial(j,k)*a**(j-k)*d[k] for k in range(j+1))*sc[r] for r,j in enumerate(ix)]
  fac=w*h*m.exp(2*a*h)
  if deriv:
   fp=[j*sum(m.binomial(j-1,k)*a**(j-1-k)*d[k] for k in range(j))*sc[r] for r,j in enumerate(ix)]
  for r in range(10):
   for s in range(r+1):
    G[r,s]+=fac*(2*h*f[r]*f[s]+fp[r]*f[s]+f[r]*fp[s] if deriv else f[r]*f[s])
 for r in range(10):
  for s in range(r):G[s,r]=G[r,s]
 return G
G0=gram(m.mpf(0)); G1quad=gram(m.mpf(0),True)
print('G1 error',m.nstr(max(abs(G1quad[i,j]-G1[i,j]) for i in range(10) for j in range(10)),10),flush=True)
results=[]
for n in range(1,10):
 A=G0[:n,:n];b=G0[:n,n];alpha=m.lu_solve(A,b);A1=G1[:n,:n];b1=G1[:n,n];d1=G1[n,n]
 dd=d1-2*(alpha.T*b1)[0]+(alpha.T*A1*alpha)[0];v=b1-A1*alpha;cost=(v.T*m.lu_solve(A1,v))[0];sur=dd-cost
 results.append({'degree':ix[n],'innovation_derivative':str(dd),'motion_cost':str(cost),'surplus':str(sur),'cost_over_gain':str(cost/dd)})
 print(ix[n],*[m.nstr(x,15) for x in [dd,cost,sur,cost/dd]],flush=True)
json.dump({'step':str(step),'G0':[[str(G0[i,j]) for j in range(10)]for i in range(10)],'G1quad':[[str(G1quad[i,j]) for j in range(10)]for i in range(10)],'G1':[[str(G1[i,j]) for j in range(10)]for i in range(10)],'endpoint':results},open('/workspace/shared/zeta_sphere_campaign/fisher_bridge_v3/probe_'+str(int(1/step))+'.json','w'),indent=2)
