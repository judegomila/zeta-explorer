# integer w = 1..12: (i) class-constant T_{p^2} relation c(p^2 n)/c(n) constant on each Legendre class of n coprime to p; (ii) full three-term relation
#   c(p^2 n) + p^{w-2} c(n/p^2) = (A_p + B_p (n|p)) c(n) for ALL n (B_p (n|p) term := 0 for p | n);  (iii) multiplicativity of c(n)/c(1)
from fractions import Fraction as Fr
import math
N=6000
def coeffs(k):
    c=[0]*(N+1); c[0]=1
    sq=[j*j for j in range(1,int(N**.5)+1)]
    for n in range(1,N+1):
        acc=0
        for j in sq:
            if j>n: break
            acc+=2*(k*j-(n-j))*c[n-j]
        c[n]=acc//n
    return c
def leg(n,p):
    n%=p
    return 0 if n==0 else (1 if pow(n,(p-1)//2,p)==1 else -1)
for k in range(1,13):
    c=coeffs(k); line=[]
    for p in (3,5,7):
        M=N//(p*p)
        # fit A,B from n=1 and first nonresidue with c!=0, then test all n<=M
        lam={}
        okc=True
        for n in range(1,M+1):
            e=leg(n,p)
            if e==0 or c[n]==0:
                if e!=0 and c[p*p*n]!=0: okc=False
                continue
            v=Fr(c[p*p*n],c[n])
            if e in lam and lam[e]!=v: okc=False
            lam.setdefault(e,v)
        full=None
        if okc and 1 in lam and -1 in lam:
            A=(lam[1]+lam[-1])/2; B=(lam[1]-lam[-1])/2; full=True
            for n in range(1,M+1):
                lhs=c[p*p*n]+(Fr(p)**(k-2)*c[n//(p*p)] if n%(p*p)==0 else 0)
                if lhs!=(A+B*leg(n,p))*c[n]: full=False; break
        line.append(f'p={p}: class-const={okc}' + (f' three-term(all n<={M})={full} A={A} B={B}' if full is not None else ''))
    mult=all(c[1]*c[m*n]==c[m]*c[n] for m in range(2,40) for n in range(2,40) if math.gcd(m,n)==1)
    print(f'w={k}: mult={mult} | '+' | '.join(line))
