import math
def jac(a,n):
    a%=n; r=1
    while a:
        while a%2==0:
            a//=2
            if n%8 in(3,5): r=-r
        a,n=n,a
        if a%4==3 and n%4==3: r=-r
        a%=n
    return r if n==1 else 0
M,D=299,29999
def sqfree_part(d):
    d0,d1,q=1,1,3
    while q*q<=d:
        e=0
        while d%q==0: d//=q; e+=1
        if e%2: d0*=q
        d1*=q**(e//2)
        q+=2
    return d0*d,d1
mu=[1]*(M+1)
for q in range(2,M+1):
    if all(q%r for r in range(2,int(q**.5)+1)):
        for k in range(q,M+1,q): mu[k]=-mu[k]
        for k in range(q*q,M+1,q*q): mu[k]=0
def row(d):
    d0,d1=sqfree_part(d); a=[0]*(M+1)
    for e1 in range(1,min(d1,M)+1):
        if d1%e1 or mu[e1]==0: continue
        c1=mu[e1]*jac(d0,e1)
        if c1==0: continue
        for e2 in range(1,d1//e1+1):
            if (d1//e1)%e2: continue
            base=e1*e2*e2
            if base>M: break
            for k in range(1,M//base+1,2):
                a[base*k]+=c1*e2*jac(d0,k)
    return a
ms=list(range(1,M+1,2))
bs=(11,13,33,35,9,45)
acc={b:[0]*len(ms) for b in bs}
for d in range(1,D+1,2):
    r=row(d)
    for b in bs:
        j=jac(d,b)
        if j:
            A=acc[b]
            for i,m in enumerate(ms): A[i]+=j*r[m]
nd=(D+1)//2
for b in bs:
    v=[x/nd for x in acc[b]]
    def phi(n):
        r=n;q=2;t=n
        while q*q<=t:
            if t%q==0:
                r-=r//q
                while t%q==0:t//=q
            q+=1
        if t>1:r-=r//t
        return r
    big=[(m,round(x,3)) for m,x in zip(ms,v) if abs(x)>0.05]
    print("b=%d phi(b)/b=%.3f  entries with |mean|>0.05:"%(b,phi(b)/b),big, " max other %.4f"%max(abs(x) for x in v if abs(x)<=0.05))
