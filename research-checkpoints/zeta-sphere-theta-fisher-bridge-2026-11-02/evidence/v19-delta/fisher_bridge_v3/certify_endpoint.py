import mpmath as mp,json,sys
mp.mp.dps=80;iv=mp.iv;iv.dps=65
N=int(sys.argv[1])if len(sys.argv)>1 else 1000
root='/workspace/shared/zeta_sphere_campaign/fisher_bridge_v3/'
z=json.load(open(root+'parent_interval_'+str(N)+'.json'))
# Serialized decimal endpoints receive much more than their <1e-59 relative rounding error.
def load(x):
 v=iv.mpf(x);return v+iv.mpf([-1,1])*iv.mpf('1e-54')*(1+abs(v))
G=[[load(v)for v in r]for r in z['G0']];sc=list(map(iv.mpf,z['scales']))
def load_mu(x):
 v=iv.mpf(x);return v+iv.mpf([-1,1])*iv.mpf('1e-90')*(1+abs(iv.mpf(x[0]))+abs(iv.mpf(x[1])))
mu=[load_mu(x)for x in json.load(open('/workspace/shared/zeta_sphere_campaign/full_split_audit/actual_total_certificate.json'))['moments']]
ix=list(range(1,20,2));D=[[(-1)**(1+(i+j)//2)*mu[(i+j)//2]/4**((i+j)//2)*sc[r]*sc[s]for s,j in enumerate(ix)]for r,i in enumerate(ix)]
def solve(A,b):
 n=len(A);a=[A[i][:]+[b[i]]for i in range(n)]
 for k in range(n):
  p=a[k][k];assert p.a>0,(k,str(p));a[k]=[v/p for v in a[k]]
  for i in range(n):
   if i!=k:
    f=a[i][k];a[i]=[v-f*w for v,w in zip(a[i],a[k])]
 return [a[i][-1]for i in range(n)]
def dot(a,b):return sum(x*y for x,y in zip(a,b))
def mv(A,x):return [dot(r,x)for r in A]
def enc(v):
 lo=mp.mpf(v.a._mpi_[0]);hi=mp.mpf(v.b._mpi_[1]);e=mp.mpf('1e-60')*(1+abs(lo)+abs(hi));return [mp.nstr(lo-e,65),mp.nstr(hi+e,65)]
out=[]
for n in range(1,10):
 A=[r[:n]for r in G[:n]];b=[G[i][n]for i in range(n)];al=solve(A,b)
 A1=[r[:n]for r in D[:n]];b1=[D[i][n]for i in range(n)];v=[x-y for x,y in zip(b1,mv(A1,al))]
 gain=D[n][n]-2*dot(al,b1)+dot(al,mv(A1,al));cost=dot(v,solve(A1,v));sur=gain-cost;ratio=cost/gain
 assert gain.a>0 and cost.a>0 and sur.a>0
 out.append({'degree':ix[n],'gain':enc(gain),'cost':enc(cost),'surplus':enc(sur),'cost_over_gain':enc(ratio),'alpha':[enc(v)for v in al]})
 print(ix[n],str(gain),str(cost),str(sur),str(ratio),flush=True)
json.dump({'scope':'Original theta existing odd rungs3..19 normalized a0; positive parent G0 intervalTaylor20; reused target moment intervals; no nonzero-shift interval certificate','source_cells':N,'source_decimal_load_padding':'1e-54*(1+abs(interval))','results':out},open(root+'endpoint_certificate_'+str(N)+'.json','w'),indent=2)
