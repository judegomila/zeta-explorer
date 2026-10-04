import mpmath as mp, random
mp.mp.dps=30
random.seed(7)
t=mp.mpf('0.1583'); y=mp.mpf('0.2')
worst=None; cnt=0
for trial in range(300):
    S=[1]+random.sample(range(2,13),random.randint(1,4))
    lam={1:mp.mpc(1,0)}
    for d in S[1:]: lam[d]=mp.mpc(random.uniform(-1,1),random.uniform(-1,1))*random.uniform(0.2,3)
    N=random.randint(1,4); sig=mp.mpf(random.uniform(1.0,4.0)); g=mp.mpf(random.uniform(0,0.3)); k=mp.mpf(random.uniform(0,0.05))
    bm={m:mp.exp(t/4*mp.log(m)**2) for m in range(1,N+1)}
    B={};A={}
    for d,l in lam.items():
        for m in range(1,N+1):
            n=d*m; B[n]=B.get(n,0)+l*bm[m]; A[n]=A.get(n,0)+l*bm[m]*mp.mpf(m)**y
    Q=1-g-sum((abs(B[n])+g*abs(A[n]))*mp.mpf(n)**(-sig) for n in B if n>=2)
    M=sum(abs(l)*mp.mpf(d)**(-sig) for d,l in lam.items())
    C=sum(bm[m]*(mp.mpf(m)**k-1)*mp.mpf(m)**(y-sig) for m in range(2,N+1))
    L=Q/M-g*C
    if L<=0: continue
    cnt+=1
    # adversarial: minimize |f| over (Im s, gamma phase, kappa) by random restarts + local search
    def f(v):
        T,ph,kr,ki,ds=v
        s=mp.mpc(sig+abs(ds),T); sc=mp.conj(s); gam=g*mp.expjpi(ph); kap=mp.mpc(kr,ki)
        if abs(kap)>k: kap=kap/abs(kap)*k
        Aser=sum(bm[m]*mp.mpf(m)**(-s) for m in bm)
        Ck=sum(mp.mpf(m)**y*bm[m]*mp.mpf(m)**(-sc-kap) for m in bm)
        return abs(Aser+gam*Ck)
    best=None
    for r in range(30):
        v=[random.uniform(-50,50),random.uniform(-1,1),random.uniform(-k,k),random.uniform(-k,k),0]
        fv=f(v)
        for it in range(60):
            w=[v[0]+random.gauss(0,1),v[1]+random.gauss(0,.1),v[2],v[3],0]
            fw=f(w)
            if fw<fv: v,fv=w,fw
        best=fv if best is None else min(best,fv)
    sl=best-L
    worst=sl if worst is None else min(worst,sl)
print('cases with L>0:',cnt,' min(|f|-L) over adversarial search:',mp.nstr(worst,6))
