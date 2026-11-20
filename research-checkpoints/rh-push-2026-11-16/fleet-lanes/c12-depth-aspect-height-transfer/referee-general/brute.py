# Brute force of the CONCLUSION of Lemma X (independent of its proof): for every character chi mod q
# compute min over unimodular c of max_{n<=N,(n,p)=1} |chi(n) - c n^{-it}|  (all n, c optimised), then min over chi.
import math, numpy as np, sys
def gens(p,k):
    q=p**k
    if p==2:
        return q,[(q-1,2),(5,q//4)] if k>=3 else None
    phi=q-q//p
    fac=set();x=phi;d=2
    while d*d<=x:
        while x%d==0: fac.add(d);x//=d
        d+=1
    if x>1: fac.add(x)
    g=2
    while not(math.gcd(g,p)==1 and all(pow(g,phi//f,q)!=1 for f in fac)): g+=1
    return q,[(g,phi)]
def run(p,k,t,Ns):
    q,G=gens(p,k)
    # index vectors
    idx={}
    if len(G)==1:
        g,phi=G[0];x=1
        for e in range(phi): idx[x]=(e,);x=x*g%q
        orders=[phi]
    else:
        (g1,o1),(g2,o2)=G
        for e1 in range(o1):
            x=pow(g1,e1,q)
            for e2 in range(o2):
                idx[x]=(e1,e2);x=x*g2%q
        orders=[o1,o2]
    assert len(idx)==q-q//p
    res=[]
    for N in Ns:
        ns=[n for n in range(1,N+1) if n%p]
        I=np.array([idx[n%q] for n in ns],dtype=np.int64)
        tgt=np.array([(t*math.log(n)/(2*math.pi))%1.0 for n in ns])  # phase of n^{it}; chi(n) n^{it} should be ~ c
        best=9.0
        import itertools
        if len(orders)==1:
            A=np.arange(orders[0],dtype=np.int64)
            for chunk in np.array_split(A,max(1,len(A)*len(ns)//4_000_000+1)):
                ph=(np.outer(chunk,I[:,0])%orders[0])/orders[0]+tgt[None,:]
                ph=np.sort(ph%1.0,axis=1)
                gaps=np.diff(np.concatenate([ph,ph[:,:1]+1],axis=1),axis=1)
                arc=1-gaps.max(axis=1)           # smallest covering arc (fraction of circle)
                e=2*np.sin(math.pi*arc/2)       # c at arc midpoint: max dist = 2 sin(theta/4), theta=2 pi arc
                best=min(best,e.min())
        else:
            for a1 in range(orders[0]):
                A=np.arange(orders[1],dtype=np.int64)
                ph=(np.outer(A,I[:,1])%orders[1])/orders[1]+(a1*I[:,0]%orders[0])/orders[0]+tgt[None,:]
                ph=np.sort(ph%1.0,axis=1)
                gaps=np.diff(np.concatenate([ph,ph[:,:1]+1],axis=1),axis=1)
                arc=1-gaps.max(axis=1); e=2*np.sin(math.pi*arc/2); best=min(best,e.min())
        res.append((N,best))
    return q,res
for p,k,t,r in ((3,7,45.0,2),(5,4,60.0,2),(2,10,50.0,2),(7,4,41.0,2),(3,8,100.0,2)):
    H=p**(-(-k//r)); Nreq=math.ceil(H*(math.sqrt(t/1.12)+1))
    Ns=[5,7,11,13,17,23,31,47,97,Nreq//4,Nreq//2,Nreq]
    q,res=run(p,k,t,sorted(set(Ns)))
    print(f"p={p} k={k} q={q} logq={math.log(q):.1f} t={t} H={H} N_req(LemmaX,r=2)={Nreq}: "+"  ".join(f"N={N}:{e:.3f}" for N,e in res), " bound 0.2395 holds at N_req:", res[-1][1]>=0.2395)
