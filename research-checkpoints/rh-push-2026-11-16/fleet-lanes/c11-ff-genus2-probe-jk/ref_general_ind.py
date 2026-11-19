"""Independent referee rerun. No resultants, no polynomial arithmetic over F_q[T]:
nu(P) for a prime P of degree e is eps^e * chi_{q^e}(F(theta)), theta a root of P (eps = chi_q(-1)^deg F);
L_n from point sums a_n = sum_{x in F_{q^n}} eps^n chi(F(x)) via log L = sum a_n u^n / n.
S_cop by the convention of sq_q.scop, summed over factorisation types by brute enumeration."""
import sys, random, itertools
from fractions import Fraction as Fr
q=int(sys.argv[1]); DEG=int(sys.argv[2]); NF=int(sys.argv[3]); g=(DEG-1)//2
random.seed(987654+q*10+DEG)
chi=lambda x: 0 if x%q==0 else (1 if pow(x%q,(q-1)//2,q)==1 else -1)
eps=chi(-1)**DEG
def irr(n):
    for c in itertools.product(range(q),repeat=n):
        # monic T^n + c[n-1] T^(n-1)+...+c0 ; irreducible of degree 2,3 iff no root
        if all((pow(a,n,q)+sum(c[i]*pow(a,i,q) for i in range(n)))%q for a in range(q)): return c
def mk(n):
    m=irr(n)
    def mul(a,b):
        c=[0]*(2*n-1)
        for i,x in enumerate(a):
            if x:
                for j,y in enumerate(b): c[i+j]+=x*y
        for d in range(2*n-2,n-1,-1):
            f=c[d]%q
            if f:
                for i in range(n): c[d-n+i]-=f*m[i]
        return tuple(x%q for x in c[:n])
    els=list(itertools.product(range(q),repeat=n))
    zero=tuple([0]*n)
    sq=set(mul(x,x) for x in els if x!=zero)
    assert len(sq)==(q**n-1)//2
    return mul,els,sq,zero
F2=mk(2); F3=mk(3)
def evalF(F,x,fld):
    mul,els,sq,zero=fld; n=len(x); acc=tuple([F[-1]]+[0]*(n-1))
    for c in reversed(F[:-1]):
        acc=mul(acc,x); acc=((acc[0]+c)%q,)+acc[1:]
    return 0 if acc==zero else (1 if acc in sq else -1)
def pi(l):
    mu={1:1,2:-1,3:-1,4:0,5:-1,6:1,7:-1}
    return sum(mu[e]*q**(l//e) for e in range(1,l+1) if l%e==0)//l
GRID=[(N,lam,k) for N in (1,2,3) for lam in (0,1,2,3,5,7) for k in (0,1,2,3)]   # lam = 5 is not in the lane grid
def copk(degs,k):
    pol=[1]+[0]*k
    for e in degs:
        for j in range(k,e-1,-1): pol[j]-=pol[j-e]
    return sum(pol[j]*q**(k-j) for j in range(k+1))
def weight(degs,lam,k):
    mu=(-1)**len(degs)
    if lam==0: return mu*copk(degs,k)
    nfl=degs.count(lam)
    return -mu*(pi(lam)-nfl)*(copk(degs,k)-(copk(degs,k-lam) if k>=lam else 0))
data={}; mism=0; fe_bad=0; cnt=0; seen=set()
while cnt<NF:
    F=tuple(random.randrange(q) for _ in range(DEG))+(1,)
    if F in seen: continue
    seen.add(F)
    val=lambda a: sum(c*pow(a,i,q) for i,c in enumerate(F))%q
    dval=lambda a: sum(i*c*pow(a,i-1,q) for i,c in enumerate(F) if i)%q
    # squarefree test without gcd: disc != 0 <=> no repeated root in closure; test via F, F' common root in F_q, F_q^2, F_q^3 is not enough for deg 7,
    # so use the criterion that chi-sums give a degree-2g L only when squarefree; here: Euclid gcd(F, F') once (only place a gcd is used)
    def pmod(a,b):
        a=list(a)
        while a and a[-1]==0: a.pop()
        inv=pow(b[-1],q-2,q)
        while len(a)>=len(b):
            f=a[-1]*inv%q; s=len(a)-len(b)
            for i in range(len(b)): a[s+i]=(a[s+i]-f*b[i])%q
            while a and a[-1]==0: a.pop()
        return a
    A=list(F); B=[i*c%q for i,c in enumerate(F)][1:]
    while B and B[-1]==0: B.pop()
    if not B: continue
    while B: A,B=B,pmod(A,B)
    if len(A)>1: continue
    cnt+=1
    n1=[eps*chi(val(a)) for a in range(q)]                      # nu of the q linear primes
    r=n1.count(0)
    x2=[(eps**2)*evalF(F,x,F2) for x in F2[1] if x[1:]!=(0,)]    # theta in F_q^2 \ F_q, each prime twice
    x3=[(eps**3)*evalF(F,x,F3) for x in F3[1] if x[1:]!=(0,0)]   # each prime three times
    a1=sum(n1); a2=sum(x*x for x in n1)+sum(x2)                  # sum over F_q^2 of eps^2 chi_{q^2}: on F_q, chi_{q^2}(c)=chi(c)^2
    a3=sum(x**3 for x in n1)+sum(x3)
    L1=a1; L2=Fr(a1*a1+a2,2); L3=Fr(a1**3+3*a1*a2+2*a3,6)
    assert L2.denominator==1 and L3.denominator==1; L2=int(L2); L3=int(L3)
    if g==2 and L3!=q*L1: fe_bad+=1
    p2=Fr(sum(x2),2); p3=Fr(sum(x3),3)                           # sums of nu over primes of degree 2, 3
    E={ (1,):sum(n1),
        (1,1):sum(a*b for a,b in itertools.combinations(n1,2)), (2,):p2,
        (1,1,1):sum(a*b*c for a,b,c in itertools.combinations(n1,3)), (1,2):sum(n1)*p2, (3,):p3 }
    S=[]
    for (N,lam,k) in GRID:
        S.append(sum(weight(list(t),lam,k)*E[t] for t in E if sum(t)==N))
    key=(r,L1,L2,L3)
    if key in data:
        if data[key]!=S: mism+=1
    else: data[key]=S
print(f"q={q} deg={DEG} eps={eps}: {cnt} seeded squarefree F, distinct (r,L) {len(data)}, S not a function of (r,L): {mism}; genus-2 FE L3=qL1 violated: {fe_bad}")
# closed forms derived by the referee
bad=0; tot=0
for (r,L1,L2,L3),S in data.items():
    for i,(N,lam,k) in enumerate(GRID):
        if lam==7 and k==0:
            tot+=1; ex={1:pi(7)*L1,2:-pi(7)*(L1*L1-L2),3:pi(7)*(L1**3-2*L1*L2+L3)}[N]; bad+=(S[i]!=ex)
        if (N,lam,k)==(2,2,1):
            tot+=1; ex=-Fr(pi(2)*(q-2),2)*(L1*L1-(q-r)) + (pi(2)-1)*q*(L2-Fr(L1*L1+q-r,2)); bad+=(S[i]!=ex)
        if N==1:
            tot+=1; bad+=(S[i]*1 != weight([1],lam,k)*L1)
print(f"   closed forms (lam=7,k=0: S=-pi(7)[1/L]_N; (2,2,1) hand formula with r; N=1: S=w L1): {tot} checks, {bad} off")
# rank tests per stratum
def rank(M):
    M=[[Fr(x) for x in r] for r in M]; rk=0
    for c in range(len(M[0])):
        p=next((i for i in range(rk,len(M)) if M[i][c]!=0),None)
        if p is None: continue
        M[rk],M[p]=M[p],M[rk]
        for i in range(len(M)):
            if i!=rk and M[i][c]!=0:
                f=M[i][c]/M[rk][c]; M[i]=[x-f*y for x,y in zip(M[i],M[rk])]
        rk+=1
    return rk
def tr(L1,L2,L3,nmax):
    Lp=[1,L1,L2,q*L1,q*q] if g==2 else [1,L1,L2,L3,q*L2,q*q*L1,q**3]
    e=[(-1)**i*c for i,c in enumerate(Lp)]; t=[2*g]
    for n in range(1,nmax+1):
        t.append(sum((-1)**(i-1)*e[i]*t[n-i] for i in range(1,n) if i<len(e)) + ((-1)**(n-1)*n*e[n] if n<len(e) else 0))
    return t
byr={}
for (r,L1,L2,L3),S in data.items(): byr.setdefault(r,[]).append((L1,L2,L3,S))
res={"poly":[0,0],"lin":[0,0],"long":[0,0],"sq":[0,0]}
for r,pts in sorted(byr.items()):
    for i,(N,lam,k) in enumerate(GRID):
        if N==1: continue
        if all(p[3][i]==0 for p in pts): continue
        T=[tr(p[0],p[1],p[2],2*N) for p in pts]
        mon=[[1,p[0],p[0]**2,p[1]]+([p[0]**3,p[0]*p[1],p[2]] if N==3 else []) for p in pts]
        y=[[p[3][i]] for p in pts]; y2=[[p[3][i]**2] for p in pts]
        Mlin=[t[:N+1] for t in T]; Mlong=T
        if len(pts)-rank(mon)>=1:
            res["poly"][1]+=1; res["poly"][0]+=(rank([a+b for a,b in zip(mon,y)])==rank(mon))
        if len(pts)-rank(Mlin)>=5:
            res["lin"][1]+=1; res["lin"][0]+=(rank([a+b for a,b in zip(Mlin,y)])==rank(Mlin))
        if len(pts)-rank(Mlong)>=3:
            res["long"][1]+=1; res["long"][0]+=(rank([a+b for a,b in zip(Mlong,y)])==rank(Mlong))
            res["sq"][1]+=1; res["sq"][0]+=(rank([a+b for a,b in zip(Mlong,y2)])==rank(Mlong))
print(f"   N>=2 vector-strata: polynomial law holds {res['poly'][0]}/{res['poly'][1]}; linear in t_0..t_N {res['lin'][0]}/{res['lin'][1]}; S in span t_0..t_2N {res['long'][0]}/{res['long'][1]}; S^2 in span t_0..t_2N {res['sq'][0]}/{res['sq'][1]}")
# N=1 inequality, blocks, Mattuck-Tate, on distinct L
import json
Ls=set((a,b,c) for (r,a,b,c) in data)
def blocks(t):
    G=lambda j,k: q**min(j,k)*t[abs(j-k)]
    def vec(j,s):
        x=[0]*(2*g+1); x[g+j]+=1; x[g-j]+=s*q**j; return x
    Bv=[vec(j,1) for j in range(g+1)]; Av=[vec(j,-1) for j in range(1,g+1)]
    bil=lambda x,y: sum(x[i]*y[j]*G(i,j) for i in range(2*g+1) for j in range(2*g+1))
    return [[bil(x,y) for y in Bv] for x in Bv],[[bil(x,y) for y in Av] for x in Av],all(bil(x,y)==0 for x in Bv for y in Av)
def det(A):
    A=[[Fr(x) for x in r] for r in A]; m=len(A); d=Fr(1)
    for i in range(m):
        p=next((r for r in range(i,m) if A[r][i]!=0),None)
        if p is None: return Fr(0)
        if p!=i: A[i],A[p]=A[p],A[i]; d=-d
        d*=A[i][i]
        for r in range(i+1,m):
            f=A[r][i]/A[i][i]
            if f: A[r]=[x-f*y for x,y in zip(A[r],A[i])]
    return d
def psd(M):
    n=len(M)
    return all(det([[M[i][j] for j in idx] for i in idx])>=0 for k in range(1,n+1) for idx in itertools.combinations(range(n),k))
c=dict(n=0,ineq=0,sym=0,anti=0,orth=0,mt=0); rmin=1; rmax=0
for (L1,L2,L3) in Ls:
    t=tr(L1,L2,L3,2*g); SS,AA,o=blocks(t)
    ddn=2*q*q*t[0]+2*q*t[2]   # x = q P0 + P2 : q^2 G00 + 2 q G02 + G22 = 2g q^2 + 2 q t2 + 2 g q^2 ... computed below exactly
    ddn=q*q*t[0]+2*q*t[2]+q*q*t[0]
    H=Fr(g,2)*ddn/q
    c["n"]+=1; c["ineq"]+=(0<=t[1]**2<=H); c["sym"]+=psd(SS); c["anti"]+=psd(AA); c["orth"]+=o; c["mt"]+=(t[1]**2<=4*g*g*q)
    if H: rmin=min(rmin,Fr(t[1]**2)/H); rmax=max(rmax,Fr(t[1]**2)/H)
print(f"   distinct L-polynomials {c['n']}: N=1 inequality {c['ineq']}, sym PSD {c['sym']}, anti PSD {c['anti']}, cross zero {c['orth']}, t1^2<=4g^2q {c['mt']}; rho in [{float(rmin):.4f},{float(rmax):.4f}]")
