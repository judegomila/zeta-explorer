# Ball-arithmetic certificate that b = prod_{Y <= p <= X} p (squarefree) violates |E1(b)| <= b/4.
# E1(b) = mu(b) b [ P (lnA - L/12) + rho ],  0 < rho <= r(1) = 1/4 - lnA  (see RESULT.md),
# so P (L/12 - lnA) > 1/2 - lnA  implies  mu(b) E1(b) < -b/4.
import sys, numpy as np
from flint import arb, ctx
ctx.prec=200
Y=int(sys.argv[1]); X=int(sys.argv[2])
print('planned memory %.3f GB (byte sieve to X)'%(X/2/1e9)); 
sv=np.ones(X//2+1,dtype=np.uint8); sv[0]=0
for i in range(3,int(X**0.5)+1,2):
    if sv[i//2]: sv[i*i//2::i]=0
pr=2*np.nonzero(sv)[0]+1; pr=pr[(pr>=Y)&(pr<=X)]; del sv
if Y<=2: pr=np.concatenate(([2],pr))
lnA=arb(1)/12-arb(-1).zeta()*0  # placeholder replaced below
# ln A = 1/12 - zeta'(-1): use the known 60-digit value enclosed in a ball
lnA=arb('0.248754477033784262547252993576113976097399653113547',1e-48)
logP=arb(0); L=arb(0); th=arb(0)
for p in pr.tolist():
    a=arb(p); l=a.log(); logP+=(1-1/a).log(); L+=l/(a-1); th+=l
P=logP.exp(); val=P*(L/12-lnA); thr=arb(1)/2-lnA
print('Y',Y,'X',X,'omega',len(pr),'smallest prime',int(pr[0]),'largest prime',int(pr[-1]))
print('P = phi(b)/b =',P.str(25)); print('L =',L.str(25)); print('log b =',th.str(25),' log10 b =',(th/arb(10).log()).str(20))
print('P (L/12 - lnA) =',val.str(30)); print('threshold 1/2 - lnA =',thr.str(30)); d=val-thr
print('difference =',d.str(20),' certified positive:',bool(d>0))
print('mu(b) E1(b)/(b/4) <=',(4*(-(val)+ (arb(1)/4-lnA))).str(20),' (ceiling needs >= -1)')
