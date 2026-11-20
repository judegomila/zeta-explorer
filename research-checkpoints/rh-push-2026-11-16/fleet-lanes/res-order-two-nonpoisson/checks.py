# Exact finite identities used in RESULT.md. Python stdlib only. Peak memory: a few MB (no large arrays).
import cmath, math, json
from math import gcd
def e(x): return cmath.exp(2j*math.pi*x)
def jac(a,n):
    a%=n; r=1
    while a:
        while a%2==0:
            a//=2
            if n%8 in (3,5): r=-r
        a,n=n,a
        if a%4==3 and n%4==3: r=-r
        a%=n
    return r if n==1 else 0
def eps(c): return 1 if c%4==1 else 1j
def salie(a,b,c):
    return sum(jac(x,c)*e((a*x+b*pow(x,-1,c))/c) for x in range(1,c) if gcd(x,c)==1) if c>1 else 1
def kloos(a,b,c):
    return sum(e((a*x+b*pow(x,-1,c))/c) for x in range(1,c) if gcd(x,c)==1) if c>1 else 1
def W(D,k,c): return sum(e(k*y/c) for y in range(c) if (y*y-D)%c==0)
def U(k,c): return sum(e(2*u*k/c) for u in range(c) if (u*u-1)%c==0)
def ram(N,c): return sum(e(N*d/c) for d in range(1,c+1) if gcd(d,c)==1)
def mu(n):
    r=1;p=2
    while p*p<=n:
        if n%p==0:
            n//=p
            if n%p==0: return 0
            r=-r
        p+=1
    return -r if n>1 else r
def sqfree(n): return mu(n)!=0
def divisors(n): return [d for d in range(1,n+1) if n%d==0]
out={}
# C1 Salie evaluation: S(a,b;c) = eps_c sqrt(c) (a/c) sum_{y^2=ab (c)} e(2y/c), odd c, (a,c)=1
bad_sf=0;bad_nsf=0;n_sf=0;n_nsf=0;mx=0
for c in range(3,100,2):
    for a in range(1,c):
        if gcd(a,c)!=1: continue
        for b in range(0,c,max(1,c//12)):
            lhs=salie(a,b,c); rhs=eps(c)*math.sqrt(c)*jac(a,c)*W(a*b,2,c)
            err=abs(lhs-rhs)
            if sqfree(c):
                n_sf+=1; mx=max(mx,err); bad_sf+= err>1e-8
            else:
                n_nsf+=1; bad_nsf+= err>1e-8
out['C1_salie_eval']={'squarefree_cases':n_sf,'squarefree_fail':bad_sf,'max_err_squarefree':mx,'nonsquarefree_cases':n_nsf,'nonsquarefree_fail':bad_nsf}
# C2 Fourier duality: sum_x S(x^2,n;c) e(-kx/c) = eps_c sqrt(c) c_c(4n-k^2), all odd c
mx=0;cnt=0
for c in range(3,64,2):
    for n in range(0,c,max(1,c//7)):
        for k in range(0,c,max(1,c//7)):
            lhs=sum(salie(x*x,n,c)*e(-k*x/c) for x in range(c))
            rhs=eps(c)*math.sqrt(c)*ram(4*n-k*k,c)
            mx=max(mx,abs(lhs-rhs));cnt+=1
out['C2_salie_to_ramanujan']={'cases':cnt,'max_err':mx}
# C2b same for Kloosterman rows: sum_x K(x^2,n;c) e(-kx/c) = eps_c sqrt(c) * [quadratic Gauss-type sum] = eps_c^2 c ((4n-k^2)/c) for squarefree c
mx=0;cnt=0
for c in range(3,64,2):
    if not sqfree(c): continue
    for n in range(0,c,max(1,c//7)):
        for k in range(0,c,max(1,c//7)):
            lhs=sum(kloos(x*x,n,c)*e(-k*x/c) for x in range(c))
            N=(n-pow(4,-1,c)*k*k)%c
            g=sum(jac(d,c)*e(N*pow(d,-1,c)/c) for d in range(1,c) if gcd(d,c)==1)
            rhs=eps(c)*math.sqrt(c)*g
            rhs2=eps(c)**2*c*jac(N,c)
            mx=max(mx,abs(lhs-rhs),abs(lhs-rhs2));cnt+=1
out['C2b_kloosterman_to_gauss']={'cases':cnt,'max_err':mx}
# C3 root sums: W(k^2,2;c) = sum_{g|(k,c)} mu(g) U(k/g; c/g), odd squarefree c
mx=0;cnt=0
for c in range(1,400,2):
    if not sqfree(c): continue
    for k in range(0,60):
        lhs=W(k*k,2,c)
        rhs=sum(mu(g)*U(k//g,c//g) for g in divisors(gcd(k,c)) ) if k>0 else sum(mu(g)*U(0,c//g) for g in divisors(c))
        mx=max(mx,abs(lhs-rhs));cnt+=1
out['C3_root_sum_moebius']={'cases':cnt,'max_err':mx}
# C3b U(k;c) = sum_{c1 c2 = c} e(2k(inv(c2)/c1 - inv(c1)/c2))
mx=0;cnt=0
for c in range(1,400,2):
    if not sqfree(c): continue
    for k in range(0,30):
        rhs=0
        for c1 in divisors(c):
            c2=c//c1
            t1=(pow(c2,-1,c1)/c1 if c1>1 else 0); t2=(pow(c1,-1,c2)/c2 if c2>1 else 0)
            rhs+=e(2*k*(t1-t2))
        mx=max(mx,abs(U(k,c)-rhs));cnt+=1
out['C3b_U_as_factorisations']={'cases':cnt,'max_err':mx}
# C4 Hecke relation at squares (Siegel-Weil, O(3)): r3(n0 t^2) = r3(n0) sum_{d|t} mu(d) (-n0/d) sigma(t/d), t odd, n0 squarefree
NMAX=3*45*45+1
import itertools
r2=[0]*(NMAX+1)
L=int(math.isqrt(NMAX))
sq=[x*x for x in range(-L,L+1)]
for a in sq:
    for b in sq:
        if a+b<=NMAX: r2[a+b]+=1
def r3(n): return sum(r2[n-z*z] for z in range(-int(math.isqrt(n)),int(math.isqrt(n))+1))
def sigma(n): return sum(divisors(n))
fails=0;cnt=0
for n0 in (1,2,3,5,6,10,11,13,14,17,19,21):
    for t in range(1,46,2):
        if n0*t*t>NMAX: continue
        rhs=r3(n0)*sum(mu(d)*jac(-n0,d)*sigma(t//d) for d in divisors(t))
        cnt+=1; fails+= (r3(n0*t*t)!=rhs)
out['C4_r3_hecke_square']={'cases':cnt,'fails':fails}
# C5 probe-level identity: R = sum_t W(t) sum_c F(c) S(n0,n0 t^2;c)/(eps_c sqrt c (n0/c)) = sum_g mu(g) sum_{t',c'} W(g t') F(g c') U(n0 t'; c')
n0=1;T=40;C=121
def Wt(t): return math.exp(-(t/17.0)**2)
def F(c): return c**-0.5*math.cos(1.3*math.log(c))
lhs=0
for c in range(1,C,2):
    if not sqfree(c): continue
    for t in range(1,T):
        lhs+=Wt(t)*F(c)*salie(n0,n0*t*t,c)/(eps(c)*math.sqrt(c)*jac(n0,c))
rhs=0
for g in range(1,C,2):
    if mu(g)==0: continue
    for c1 in range(1,(C-1)//g+1,2):
        if not sqfree(c1) or gcd(c1,g)!=1: continue
        for t1 in range(1,(T-1)//g+1):
            rhs+=mu(g)*Wt(g*t1)*F(g*c1)*U(n0*t1,c1)
out['C5_probe_factorisation']={'lhs':[lhs.real,lhs.imag],'rhs':[rhs.real,rhs.imag],'abs_diff':abs(lhs-rhs)}
# C6 completeness: rank of [e(n*inv(d)/c)]_{n mod c, d unit} equals phi(c)  (Gram determinant via characters: check injectivity numerically for small c)
def rank(M,tol=1e-9):
    M=[row[:] for row in M];r=0;rows=len(M);cols=len(M[0])
    for j in range(cols):
        p=max(range(r,rows),key=lambda i:abs(M[i][j])) if r<rows else None
        if p is None or abs(M[p][j])<tol: continue
        M[r],M[p]=M[p],M[r]
        for i in range(rows):
            if i!=r:
                f=M[i][j]/M[r][j]
                M[i]=[x-f*y for x,y in zip(M[i],M[r])]
        r+=1
        if r==rows: break
    return r
res={}
for c in (3,5,7,15,21,33,35):
    units=[d for d in range(1,c) if gcd(d,c)==1]
    M=[[e(n*pow(d,-1,c)/c) for d in units] for n in range(c)]
    res[c]=(rank(M),len(units))
out['C6_completeness_rank_vs_phi']=res
print(json.dumps(out,indent=1))
json.dump(out,open('checks.json','w'),indent=1)
