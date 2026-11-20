# Known-answer checks for radix.c: (a) C_p(N) formula against the direct carry count from binomial coefficients;
# (b) Kummer: sum over layers reproduces log prod_k C(N,k); (c) radix.c output against exact mpmath sums.
import sys, math
from mpmath import mp, mpf, log
mp.dps=40
def primes(n):
    s=bytearray([1])*(n+1); s[0:2]=b'\0\0'
    for i in range(2,int(n**0.5)+1):
        if s[i]: s[i*i::i]=bytearray(len(s[i*i::i]))
    return [i for i in range(n+1) if s[i]]
def vp(n,p):
    c=0
    while n%p==0: n//=p; c+=1
    return c
ok=True
for N in [10,37,100,257,600]:
    ps=primes(N); binom=[math.comb(N,k) for k in range(N+1)]
    tot=mpf(0); first=mpf(0)
    for p in ps:
        direct=sum((N//p)-(k//p)-((N-k)//p) for k in range(N+1))
        formula=(N//p)*(p-1-(N%p)); ok&=(direct==formula)
        full=sum(vp(b,p) for b in binom)
        layers=sum(sum((N//p**j)-(k//p**j)-((N-k)//p**j) for k in range(N+1)) for j in range(1,20) if p**j<=N)
        ok&=(full==layers); tot+=full*log(p); first+=direct*log(p)
    lhs=sum(log(b) for b in binom); ok&=abs(lhs-tot)<mpf(10)**-25
    H=tot-first
    print(N,'formula ok',ok,'higher-radix tail H_N =',mp.nstr(H,12),'H_N/N^1.5 =',mp.nstr(H/mpf(N)**1.5,8))
if len(sys.argv)>1:
    worst=0
    for line in open(sys.argv[1]):
        c=line.split(); N=int(c[0])
        if N>200000: continue
        ps=primes(N); R=mpf(0); T=mpf(0); R4=mpf(0); R5=mpf(0)
        for p in ps:
            m=N//p; w=m*(p-1-N%p)-(N-p); L=log(p); R+=w*L; T+=(N-p)*L
            c4=0 if p==2 else (1 if p%4==1 else -1)
            R4+=c4*w*L
            tw=sum((1 if j%4==1 else -1)*(2*j*p-N-1) for j in range(1,m+1,2))-(N-p)
            R5+=c4*tw*L
        for a,b in ((R,c[1]),(R4,c[5]),(R5,c[6]),(T,c[7])):
            worst=max(worst,abs(a-mpf(b))/(1+abs(a)))
    print('radix.c vs exact: worst rel diff',mp.nstr(worst,5))
