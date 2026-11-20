# Author-written finite checks of the Laguerre identities; not a target-rung test.
import mpmath as m,json
m.mp.dps=100
out=[]
for N in range(1,31):
 a=[sum((-1)**k*m.binomial(N+5,N-k)/m.factorial(k)*m.binomial(k,j)*(-m.pi)**(k-j)for k in range(j,N+1))for j in range(N+1)]
 direct=sum(a[j]*2*j*m.rf(m.mpf('1.5'),j)for j in range(1,N+1))
 generated=-3*sum(m.pi**r/m.factorial(r)*m.rf(r+m.mpf('4.5'),N-1-r)/m.factorial(N-1-r)for r in range(N))
 err=abs(direct/generated-1)
 assert err<m.mpf('1e-75')
 # Standard-Laguerre coefficient vector and multiplication by x+pi.
 f=[m.binomial(N-k+4,4)for k in range(N+1)]+[m.mpf(0)]*5
 g=f[:]
 for _ in range(5):
  nxt=[m.mpf(0)]*len(g)
  for k,c in enumerate(g):
   nxt[k]+=(2*k+1+m.pi)*c
   if k+1<len(g):nxt[k+1]-=(k+1)*c
   if k:nxt[k-1]-=k*c
  g=nxt
 norm=m.exp(-m.pi)*sum(x*y for x,y in zip(f,g))
 bound=m.mpf(4)**11*(N+5)**15
 assert norm>0 and norm<bound
 row={'N':N,'relative_identity_error':str(err),'sigma_norm_over_bound':str(norm/bound)}
 if N>=4:
  mm=int(m.sqrt(N));ratio=abs(generated)/(m.pi**mm/mm);assert ratio>=1;row['residue_over_lower_bound']=str(ratio)
 out.append(row)
json.dump(out,open('/workspace/shared/zeta_sphere_campaign/fisher_bridge_v5_audit/identity_checks.json','w'),indent=2)
print('PASS: 30 polynomial/gamma identities and norm bounds; no theta target-rung claim.')
