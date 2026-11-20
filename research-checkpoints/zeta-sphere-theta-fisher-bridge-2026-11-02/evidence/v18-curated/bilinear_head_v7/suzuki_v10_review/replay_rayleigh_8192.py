# Independent exact-integer witness replay from second-primitive identity.
import json,mpmath as mp
from pathlib import Path
mp.iv.dps=45;mp.mp.dps=55;I=mp.iv
src=Path('/workspace/shared/zeta_sphere_campaign/hierarchy/suzuki_v10/primitive_trial_8192_certificate.json')
d=json.loads(src.read_text());n=d['n'];K=d['terms'];v=d['ci']
w=I.mpf(2)/5;R=I.ln(3);h=R/n
norm=sum(x*x for x in v);assert norm==int(d['norm'])
conv=[sum(v[i]*v[k-i]for i in range(max(0,k-n+1),min(n-1,k)+1))for k in range(2*n-1)]
weights=[0]*(2*n+1)
for k,c in enumerate(conv):weights[k]+=c;weights[k+1]-=2*c;weights[k+2]+=c
f=[];g=[];b=[];pf=pg=pb=I.mpf(1)
for j in range(K+1):
 if j:
  pf*= (I.mpf(j-1)-I.mpf(1)/20)/j
  pg*= (I.mpf(j-1)-I.mpf(1)/10)/j
  pb*= (I.mpf(j)+I.mpf(1)/20)/j
 f.append(pf/(w+j));g.append(pg/(w+j));b.append(pb)
pref=I.pi**w/(2*I.gamma(w));s=I.mpf(0);coef=[]
for j in range(K+1):
 s+=f[j]
 coef.append(pref*(9*s-8*sum((g[k]*b[j-k]for k in range(j+1)),I.mpf(0)))/(w+j+1))
tail=abs(pref)*66*(K+3)**2*(I.mpf(8)/9)**(K+1)/(I.mpf(1)/9)**3
err=I.mpf([-1,1])*mp.mpf(tail.b)
def T(r):
 if mp.mpf(r.b)<=0:return I.mpf(0)
 assert mp.mpf(r.a)>=0,'unexpected straddling interval'
 z=1-I.exp(-2*r);acc=I.mpf(0)
 for c in reversed(coef):acc=c+z*acc
 return z**(w+1)*acc+err
c2=(I.power(2,w)-I.power(2,-w))/I.sqrt(2)
ans=I.mpf(0)
for k,bk in enumerate(weights):
 if bk:
  r=(I.mpf(k)/n-1)*R
  ans+=bk*(T(r)+c2*T(r-I.ln(2)))
 if k%512==0:print('endpoint',k,flush=True)
ans/=h*norm
print('independent Rayleigh enclosure',str(ans),flush=True)
assert mp.mpf(ans.a)>mp.mpf('.99999995275')
print('PASS',flush=True)
