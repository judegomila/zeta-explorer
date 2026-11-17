# c_n = G[2n]/G[0] to 40 digits for n<=NMAX (no integrality); working precision covers the e^{2k} cancellation
import sys, json
from mpmath import mp, mpf, pi, exp, binomial, nstr
NMAX=int(sys.argv[1]); mp.dps=int(0.9*2*NMAX)+120
K=2*NMAX+1
print("dps",mp.dps,"series length",K+1,"(~%d MB)"%((K+1)*mp.dps//2000000+1),file=sys.stderr)
def coeffs(b):
    q=[mpf(1)]
    for k in range(K):
        v=(b-2*k)*q[k]
        if k>=1: v-=(k-1)*q[k-1]
        q.append(v/(k+1))
    return q
tot=[mpf(0)]*(K+1); tot[0]=mpf(1); m=1
while True:
    a=pi*m*m; q=coeffs(2*a); e=exp(-a)
    big=max(abs(x) for x in q)*e
    for k in range(K+1): tot[k]+=2*e*q[k]
    if big<mpf(10)**(-60): break
    m+=1
print("m terms",m,file=sys.stderr)
bn=[mpf(1)]
for k in range(1,K+1): bn.append(bn[-1]*(mpf(-1)/2-k+1)/k)
G=[]
for k in range(0,K+1,2):
    G.append(sum(bn[j]*tot[k-j] for j in range(k+1)))
odd=sum(bn[j]*tot[K-j] for j in range(K+1))
print("last odd coeff (should be 0):",nstr(odd,5),file=sys.stderr)
json.dump([nstr(g,45) for g in G],open("G_%d.json"%NMAX,"w"))
