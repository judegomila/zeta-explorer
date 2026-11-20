# Take the smallest left singular vector u of the row-normalised 30x400 adapted matrix and
# evaluate g(x) = sum_p u_p f_p(x)/||f_p|| on a wider x-range; also exact-structure check:
# a self-dual tangent needs l(n) = sum_p c_p v_p(n)/p == 0 for all n (Lemma T), l(p) = c_p/p.
import sys, json
from mpmath import mp, mpf, exp, pi, sqrt, matrix, svd_r, log, nstr
mp.dps = int(sys.argv[1]); NP=30; NPTS=400; NMAX=20000
print("planned allocation: 30 x 400 mpf matrix (~3 MB)")
def primes(k):
    out=[]; n=2
    while len(out)<k:
        if all(n%q for q in out if q*q<=n): out.append(n)
        n+=1
    return out
P=primes(NP); pmax=P[-1]
def vp(n,p):
    v=0
    while n%p==0: n//=p; v+=1
    return v
def A(p,x):
    s=mpf(0); n=p; cut=mp.dps*2.4+40
    while n<=NMAX:
        a=pi*n*n*x
        if a>cut: break
        s+=vp(n,p)*n*n*exp(-a); n+=p
    return -(2*pi*x/p)*s
def f(p,x): return A(p,x)-A(p,1/x)/sqrt(x)
lo=log(mpf(1)/(4*pmax*pmax)); xs=[exp(lo*(1-mpf(j)/(NPTS-1))) for j in range(NPTS)]
M=matrix(NP,NPTS); norms=[]
for i,p in enumerate(P):
    row=[f(p,x) for x in xs]; nr=sqrt(sum(r*r for r in row)); norms.append(nr)
    for j in range(NPTS): M[i,j]=row[j]/nr
U,S,V=svd_r(M)
u=[U[i,NP-1] for i in range(NP)]
print("dps",mp.dps,"sigma_min",nstr(S[NP-1],8),"sigma_max",nstr(S[0],8))
print("u (coefficients on normalised rows):",[nstr(v,3) for v in u])
ins=max(abs(sum(u[i]*M[i,j] for i in range(NP))) for j in range(NPTS))
print("max |g| on the 400 sample points:",nstr(ins,4))
for x in ['1e-5','3e-6','1e-6','1e-7']:
    x=mpf(x); g=sum(u[i]*f(P[i],x)/norms[i] for i in range(NP)); sz=sum(abs(u[i]*f(P[i],x)/norms[i]) for i in range(NP))
    print("x=%s  g=%s  sum|terms|=%s  ratio=%s"%(nstr(x,3),nstr(g,4),nstr(sz,4),nstr(abs(g)/sz,4)))
