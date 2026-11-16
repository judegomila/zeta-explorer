# scan for Davenport-Heilbronn zeros with Re > 1
import sys, time
from flint import acb, arb, ctx, dirichlet_char
ctx.prec = 64
G=[dirichlet_char(5,k) for k in range(1,5)]
CHI=[c for c in G if abs(complex(c(2))-1j)<1e-9][0]
CHIB=[c for c in G if abs(complex(c(2))+1j)<1e-9][0]
k=((10-2*arb(5).sqrt()).sqrt()-2)/(arb(5).sqrt()-1); I=acb(0,1)
c1=(1-I*k)/2; c2=(1+I*k)/2
def f(s): return c1*CHI.l(s)+c2*CHIB.l(s)
T=float(sys.argv[1]); sig=float(sys.argv[2])
t=0.0; best=[]; t0=time.time()
prev2=prev1=None
while t<T:
    v=abs(complex(f(acb(sig,t))))
    if prev2 is not None and prev1[1]<prev2[1] and prev1[1]<v and prev1[1]<0.08:
        best.append(prev1)
    prev2,prev1=prev1,(t,v); t+=0.02
best.sort(key=lambda x:x[1])
for b in best[:25]: print(b)
print("time",time.time()-t0)
