# Phi = g^2 dTheta/ds = -4 Th (2-Th) + 6 sum mu^2 + 2 sum mu^3, mu_j = g^2 T_j, Theta = sum mu /2
import numpy as np
def mu(d): return 1.0/(d*(d+1.0))
def Phi(mus):
    mus=np.array(mus); Th=mus.sum()/2
    return Th, -4*Th*(2-Th)+6*(mus**2).sum()+2*(mus**3).sum()
# direct check of Lemma 2 by finite differences on N-body
def force(x):
    d=x[:,None]-x[None,:]; np.fill_diagonal(d,np.inf); return -2*(1/d).sum(1)
def theta(x,i):
    g=x[i+1]-x[i]; E=sum(1/((x[i]-x[j])*(x[i+1]-x[j])) for j in range(len(x)) if j not in(i,i+1)); return g*g*E/2
x=np.array([-3.3,-2.1,-1.0,0,0.9,2.0,3.2,4.9]); i=3
h=1e-6; x2=x+h*force(x); x0=x-h*force(x)
fd=(theta(x2,i)-theta(x0,i))/(2*h)
g=x[i+1]-x[i]; mus=[g*g/((x[i]-x[j])*(x[i+1]-x[j])) for j in range(len(x)) if j not in(i,i+1)]
print('lemma2 check',fd, Phi(mus)[1]/g**2)
# family: KL full, KR full, partial at distance t on the right
best={}
for KL in range(0,40):
  for KR in range(KL,41):
    base=[mu(r) for r in range(1,KL+1)]+[mu(r) for r in range(1,KR+1)]
    for side,K in (('R',KR),('L',KL)):
      for m in np.linspace(0,mu(K+1),41):
        Th,P=Phi(base+[m])
        key=round(Th,3)
        if key not in best or P>best[key][0]: best[key]=(P,KL,KR,side,m)
ks=sorted(best)
neg=[k for k in ks if best[k][0]<=0 and k>0.44]
print('levels with family max <=0 above 0.44:',neg[:50], len(neg))
for k in ks:
    if 0.40<=k<=1 and int(round(k*1000))%20==0: print(k,best[k])
