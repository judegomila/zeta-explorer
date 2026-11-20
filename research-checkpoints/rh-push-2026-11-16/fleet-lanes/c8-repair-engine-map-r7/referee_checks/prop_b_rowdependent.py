import math, random, numpy as np
random.seed(2026); rng=np.random.default_rng(11)
def jacobi(a, n):
    a %= n; t = 1
    while a:
        while a % 2 == 0:
            a //= 2
            if n % 8 in (3, 5): t = -t
        a, n = n, a
        if a % 4 == 3 and n % 4 == 3: t = -t
        a %= n
    return t if n == 1 else 0
def run(Q,D,mode):
    ms=[2*i+101 for i in range(Q)]; ns=list(range(50,D+50))
    T=np.array([[jacobi(n,m) for n in ns] for m in ms],dtype=float)
    worst=1e9; viol=0
    for trial in range(60):
        A=rng.standard_normal(Q)
        if mode=='flat': beta=rng.choice([-1.0,1.0],D)
        else: beta=rng.standard_normal(D)
        b1=np.abs(beta).max()*math.sqrt(D)/np.linalg.norm(beta)
        # row-dependent column partitions (non-product)
        nr=random.randint(1,5); rc=sorted(random.sample(range(1,Q),nr)); RI=[list(range(a,b)) for a,b in zip([0]+rc,rc+[Q])]
        tot=0; cmin=1
        for I in RI:
            perm=list(range(D)); random.shuffle(perm)
            k=random.randint(1,20); cuts=sorted(random.sample(range(1,D),k))
            for a,b in zip([0]+cuts,cuts+[D]):
                J=perm[a:b]; B=T[np.ix_(I,J)]; cmin=min(cmin,np.count_nonzero(B)/B.size)
                tot+=np.linalg.norm(A[I])*np.linalg.norm(B,2)*np.linalg.norm(beta[J])
        if cmin==0: continue
        lower=math.sqrt(cmin)/b1*np.linalg.norm(A)*np.linalg.norm(beta)*math.sqrt(D)
        worst=min(worst,tot/lower); viol+= tot<lower
        # also compare with unnormalised K-branch ||A|| ||beta|| sqrt(max(Q,D))
    print(Q,D,mode,'min ratio %.3f'%worst,'violations',viol)
for Q,D in ((45,700),(120,500),(200,200)):
    for mode in ('flat','gauss'): run(Q,D,mode)
