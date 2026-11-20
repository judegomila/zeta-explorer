# Complete list of b (any size) at which the explicit bound of Theorem 1(ii) does not decide kappa(b) > 0.69, resp. S(b) < 0.
#   kerr(b) = [b 2^w (3 + 2 log b) + 2 + log b]/(b phi(b))  >= K - 0.69   (kappa undecided)
# For b >= 2.5e9: phi(b)/2^omega(b) >= 0.18257 sqrt(b) (prime-power factors (p-1)p^(k-1)/2 >= p^(k/2) except p = 2,3,5 at k = 1)
# gives kerr < 0.00508 < K - 0.69 = 0.005496. Below 2.5e9 an undecided b has phi/2^omega <= (3 + 2 log 2.5e9 + 1e-6)/0.005496 < 8425.
import math, sys, json
sys.setrecursionlimit(10000)
EG=0.57721566490153286061; C=(math.log(2*math.pi)-EG)/2; K=1.5*C-0.25; GAP=K-0.69
BMAX=2.5e9; T=(3+2*math.log(BMAX)+1e-6)/GAP
print("K-0.69 =",GAP,"threshold on phi/2^omega:",T)
assert (3+2*math.log(BMAX))/(0.18257*math.sqrt(BMAX))+1e-9<GAP
PM=int(2*T*2)+10
sieve=bytearray([1])*(PM+1); primes=[]
for i in range(2,PM+1):
    if sieve[i]:
        primes.append(i)
        for j in range(i*i,PM+1,i): sieve[j]=0
out=[]
def rec(i,b,g,ph,w):
    # g = phi/2^omega so far
    if b>=3:
        kerr=(b*2**w*(3+2*math.log(b))+2+math.log(b))/(b*ph)
        if kerr>=GAP*(1-1e-9): out.append(b)
    for j in range(i,len(primes)):
        p=primes[j]
        g1=g*(p-1)/2
        if g1>T:
            if p>3: break
            else: continue
        bb=b*p; gg=g1; pp=ph*(p-1)
        while bb<BMAX and gg<=T:
            rec(j+1,bb,gg,pp,w+1)
            bb*=p; gg*=p; pp*=p
rec(0,1,1.0,1,0)
out.sort()
print("undecided for kappa > 0.69: %d values; largest %d; above 1e6: %d; above 2e6: %d; above 5e6: %d"%(len(out),out[-1],sum(b>10**6 for b in out),sum(b>2*10**6 for b in out),sum(b>5*10**6 for b in out)))
import numpy as np
ex=np.load("cert_exK.npy"); s=set(out); miss=[int(b) for b in ex if int(b) not in s]; print("cross-check against the sieve list to 5e6: sieve %d, DFS below 5e6 %d, missing %d"%(len(ex),sum(b<=5*10**6 for b in out),len(miss)))
open("exc_kappa_above1e6.txt","w").write("\n".join(str(b) for b in out if b>10**6)+"\n")
json.dump({"count":len(out),"largest":out[-1],"above1e6":sum(b>10**6 for b in out),"above2e6":sum(b>2*10**6 for b in out)},open("enum_exc.json","w"))
