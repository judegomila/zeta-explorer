import mpmath as mp, random
mp.mp.dps=80
def xi(s): return s*(s-1)/2*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
def L(x):
    s=mp.mpf(1)/2+x
    # log-derivative of xi: 1/s+1/(s-1)-log(pi)/2+psi(s/2)/2+zeta'/zeta
    return 1/s+1/(s-1)-mp.log(mp.pi)/2+mp.digamma(s/2)/2+mp.zeta(s,derivative=1)/mp.zeta(s)
def Lsmall(x):
    return mp.diff(lambda z: mp.log(xi(mp.mpf(1)/2+z)), x)
def pivots(xs,f):
    n=len(xs); Lv=[f(x) for x in xs]
    P=mp.matrix(n,n)
    for i in range(n):
        for j in range(n): P[i,j]=(Lv[i]+Lv[j])/(xs[i]+xs[j])
    # Gaussian elimination pivots
    piv=[]
    A=P.copy()
    for k in range(n):
        piv.append(A[k,k])
        for i in range(k+1,n):
            m=A[i,k]/A[k,k]
            for j in range(k,n): A[i,j]-=m*A[k,j]
    return piv
random.seed(1)
f=lambda x: L(x) if abs(x-mp.mpf(1)/2)>1e-6 else Lsmall(x)
worst=None
for trial in range(300):
    mode=trial%3
    if mode==0: xs=[mp.mpf(random.uniform(0.01,20)) for _ in range(5)]
    elif mode==1:
        c=random.uniform(0.05,10); xs=[mp.mpf(c+random.uniform(0,0.5)) for _ in range(5)]
    else: xs=[mp.mpf(10**random.uniform(-3,2.5)) for _ in range(5)]
    xs=sorted(set(xs))
    if len(xs)<5: continue
    for x in xs:
        if abs(x-mp.mpf(1)/2)<1e-6: x+=1e-3
    pv=pivots(xs,f)
    mn=min(pv)
    if mn<=0: print('NONPOS',xs,pv)
    r=float(pv[-1]/pv[0])
    if worst is None or r<worst[0]: worst=(r,[float(x) for x in xs])
print('done; min last/first pivot ratio',worst)
# six nodes, out of claim scope
cnt=0
for trial in range(100):
    xs=sorted(mp.mpf(10**random.uniform(-2,2)) for _ in range(6))
    if min(pivots(xs,f))<=0: cnt+=1
print('6-node nonpositive count (not claimed):',cnt)
