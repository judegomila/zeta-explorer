import math, numpy as np
from mpmath import mp, mpf, log
mp.dps = 60
# (A) exact/interval instance of Lemma X, r=3, p=3, k=30, t=1e6 ; and r=4, p=2,k=41,t=1e8; r=2 p=7 k=9 (odd) t=50
PTE = {2: ([1,-1],[0,0]), 3: ([1,2,6],[0,4,5]), 4: ([0,4,7,11],[1,2,9,10]), 5: ([1,2,10,14,18],[0,4,8,16,17])}
X1 = {2:0.419264, 3:0.0103274, 4:0.00424945, 5:0.00208501}
for r,p,k,t in ((3,3,30,mpf(10)**6),(4,2,41,mpf(10)**8),(2,7,9,mpf(50)),(5,11,7,mpf(3)*10**10),(3,5,13,mpf(340453))):
    a,b = PTE[r]; s=len(a); A=max(map(abs,a+b))
    kap = mpf(abs(sum(x**r for x in a)-sum(x**r for x in b)))/r
    q=p**k; H=p**(-(-k//r)); assert H**r % q == 0
    x0=(mpf('1.12')/(kap*t))**(mpf(1)/r); xu=(mpf('4.5')/(kap*t))**(mpf(1)/r)
    tr=max(4.5/(float(kap)*X1[r]**r),(3*r)**r*1.12/float(kap))
    lo=H/xu; hi=H/x0
    m=int(mp.ceil(lo)); 
    while m%p==0: m+=1
    assert m<=hi, "no m in window"
    Pa=1;Pb=1
    for x in a: Pa*=m+x*H
    for x in b: Pb*=m+x*H
    D=log(mpf(Pa))-log(mpf(Pb))   # 60 digits, exact integers
    th=abs(t*D)
    dev=abs(mp.expj(-t*D)-1)
    N=int(mp.ceil(H*((kap*t/mpf('1.12'))**(mpf(1)/r)+A)))
    print(f"r={r} p={p} k={k} t={float(t):.4g} t_r={tr:.4g} t>=t_r:{float(t)>=tr} xu<=x1:{float(xu)<=X1[r]} H={H} m={m} winlen={float(hi-lo):.1f} "
          f"(Pa-Pb)%q={(Pa-Pb)%q} all>0:{m-A*H>0} top={m+A*H}<=N={N}:{m+A*H<=N} |tD|={float(th):.5f} in[1.008,4.95]:{1.008<=th<=4.95} |e^(-itD)-1|={float(dev):.4f} eps>= {float(dev)/(2*s):.4f} (claim {0.479/s:.4f})")
# also scan whole window for r=3 case: min dev over all admissible m (sampled)
r,p,k,t=3,3,30,1e6
a,b=PTE[r];kap=12.0;H=3**10
x0=(1.12/(kap*t))**(1/3);xu=(4.5/(kap*t))**(1/3)
import random
random.seed(1); mn=9
for _ in range(20000):
    m=random.randint(int(H/xu)+1,int(H/x0))
    if m%p==0: continue
    D=sum(math.log1p(x*H/m) for x in a)-sum(math.log1p(x*H/m) for x in b)
    mn=min(mn,abs(2*math.sin(t*D/2)))
print("r=3 window scan: min |e^(-itD)-1| over 20000 random m:",mn)
