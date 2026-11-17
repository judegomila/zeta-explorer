# exact: c_w(n) in Q[w], theta^w = sum c_w(n) q^n, theta = 1 + 2 sum q^{k^2}
from flint import fmpq_poly, fmpq
import sympy as sp, math
N=1300
a=[0]*(N+1); a[0]=1
k=1
while k*k<=N: a[k*k]=2; k+=1
w=fmpq_poly([0,1])
c=[fmpq_poly([1])]
sq=[j for j in range(1,N+1) if a[j]]
for n in range(1,N+1):
    acc=fmpq_poly([0])
    for j in sq:
        if j>n: break
        acc+= (w*j-(n-j))*c[n-j]*2
    c.append(acc*fmpq(1,n))
print('c1..c5:',[str(c[n]) for n in range(1,6)])
# sanity: w=1,2,3,4,8 integer values
def r(k,n):
    return int(c[n](fmpq(k)).p)
print('r_k(n) n=1..10, k=1,2,3,4,8:',[[r(k,n) for n in range(1,11)] for k in (1,2,3,4,8)])
def roots_of_gcd(polys):
    g=polys[0]
    for p in polys[1:]:
        g=g.gcd(p)
    x=sp.symbols('w')
    gp=sp.Poly([sp.Rational(int(q.p),int(q.q)) for q in reversed(g.coeffs())],x) if g.degree()>=0 else None
    return g.degree(), sp.factor(gp.as_expr()) if gp is not None else None
def fac(p):
    x=sp.symbols('w')
    return sp.factor(sp.Poly([sp.Rational(int(q.p),int(q.q)) for q in reversed(p.coeffs())],x).as_expr())
# (M) multiplicativity of c(n)/c(1): c(1)c(mn)=c(m)c(n), gcd(m,n)=1
pairs=[(2,3),(2,5),(3,4),(3,5),(2,7),(4,5),(3,7),(2,9)]
P=[c[1]*c[m*n]-c[m]*c[n] for m,n in pairs]
print('M single (2,3):',fac(P[0]))
print('M single (2,5):',fac(P[1]))
print('M single (3,4):',fac(P[2]))
print('M gcd:',roots_of_gcd(P))
# (H_p) class-constant eigen relation at p: c(p^2 n) c(n') = c(p^2 n') c(n), n,n' coprime to p, same Legendre class
def leg(n,p): return 1 if pow(n,(p-1)//2,p)==1 else -1
for p in (3,5,7):
    cls={1:[],-1:[]}
    for n in range(1,N//(p*p)+1):
        if n%p: cls[leg(n,p)].append(n)
    for e in (1,-1):
        ns=cls[e][:8]
        Q=[c[p*p*ns[0]]*c[n]-c[p*p*n]*c[ns[0]] for n in ns[1:]]
        print(f'H p={p} class {e:+d} ns={ns}: first rel factor:',fac(Q[0]) if Q[0].degree()<=14 else f'deg {Q[0].degree()}', '| gcd:',roots_of_gcd(Q))
    # full three-term relation c(p^2 n) = (A + B leg(n)) c(n) - C c(n/p^2): solve A,B from n=1 and first NR, check n=p (B-term absent), C from n=p^2, check n=2p, n=2p^2 ...
    nr=cls[-1][0]
    # A+B = c(p^2)/c(1); A-B = c(p^2 nr)/c(nr); A = c(p^3)/c(p)  => (c(p^2)c(nr) + c(p^2 nr) c(1)) c(p) = 2 c(p^3) c(1) c(nr)
    T=(c[p*p]*c[nr]+c[p*p*nr]*c[1])*c[p]-2*c[p**3]*c[1]*c[nr]
    T2=c[p**3]*c[2*p]-c[2*p**3]*c[p] if 2*p**3<=N else None
    print(f'  p={p} A-consistency (n=1,{nr},{p}):',roots_of_gcd([T]+([T2] if T2 is not None else [])))
