# Cramer random model: each integer n >= 3 is "prime" independently with probability 1/log n.
# (1) D_sigma(Y) = sum_{n in C, n<=Y} n^-sigma - int_2^Y u^-sigma du/log u ; (2) R_C(N) = sum_{n in C, n<=N} k_N(n) log n.
# usage: cramer.py XMAX nseeds out.json
import sys, json, math, numpy as np
from mpmath import mp, ei, mpf, log
X=int(float(sys.argv[1])); ns=int(sys.argv[2]); RS=[0.51,0.55,0.6,0.75]
CH=1<<24; print('planned chunk %.0f MB'%(CH*8*4/1e6))
cps=[10**k for k in range(2,int(round(math.log10(X)))+1)]
Ngrid=[int(round(10**(3+k/8))) for k in range(0,8*4+1)]   # N up to 1e7 for the radix statistic
out={'X':X,'seeds':[]}
def Eint(sig,Y): return float(ei((1-mpf(sig))*log(Y))-ei((1-mpf(sig))*log(2)))
for seed in range(ns):
    rng=np.random.default_rng(1000+seed); acc=np.zeros(len(RS)); recs={}; sup=np.full(len(RS),-1e9); inf=np.full(len(RS),1e9)
    small=[]; ci=0
    for lo in range(3,X+1,CH):
        hi=min(X+1,lo+CH); n=np.arange(lo,hi,dtype=np.float64)
        sel=n[rng.random(hi-lo)<1.0/np.log(n)]
        if lo<=10**7: small.append(sel[sel<=10**7])
        L=np.log(sel)
        # running sup / inf inside the chunk at the selected points (statistic evaluated just after each selected n)
        for i,s in enumerate(RS):
            c=acc[i]+np.cumsum(np.exp(-s*L))
            # integral at the selected points: use the smooth approximation by interpolation on a coarse grid
            g=np.exp(np.linspace(math.log(lo),math.log(hi),2049 if lo<10**8 else 65)); Eg=np.array([Eint(s,float(v)) for v in g]); E=np.interp(sel,g,Eg)
            dd=c-E
            if len(dd): sup[i]=max(sup[i],dd.max()); inf[i]=min(inf[i],dd.min())
            while ci<len(cps) and False: pass
            acc[i]=c[-1] if len(c) else acc[i]
        while ci<len(cps) and cps[ci]<hi:
            Y=cps[ci]; m=sel<=Y
            recs['1e%d'%round(math.log10(Y))]=[float(acc[i]-np.exp(-s*L[~m]).sum()-Eint(s,Y)) for i,s in enumerate(RS)]; ci+=1
    C=np.concatenate(small).astype(np.int64); LC=np.log(C.astype(np.float64)); rad=[]
    for N in Ngrid:
        m=C<=N; n=C[m]; q=N//n; w=q*(n-1-N%n)-(N-n)
        rad.append([N,float((w*LC[m]).sum()/N**1.5)])
    sc=sum(1 for i in range(1,len(rad)) if rad[i][1]*rad[i-1][1]<0)
    out['seeds'].append(dict(seed=seed,D_at=recs,D_sup=sup.tolist(),D_inf=inf.tolist(),radix_over_N15=rad,radix_sign_changes=sc,radix_min=min(v for _,v in rad),radix_max=max(v for _,v in rad)))
    print(seed,recs.get('1e%d'%round(math.log10(X))),'sup',sup,'inf',inf,'radix sc',sc,flush=True)
json.dump(out,open(sys.argv[3],'w'),indent=0)
