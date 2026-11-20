# Infinitesimal rigidity test for Beurling systems at P = primes.
# f_p(x) = d/dp [Theta_P(x) - x^(-1/2) Theta_P(1/x)],  Theta_P(x) = sum_{n in N} exp(-pi n^2 x)
# d n / d p = v_p(n) n / p  =>  d Theta/dp (x) = -(2 pi x / p) sum_n v_p(n) n^2 exp(-pi n^2 x)
import sys, json
from mpmath import mp, mpf, exp, pi, sqrt, matrix, svd_r, log
mp.dps = int(sys.argv[4]) if len(sys.argv) > 4 else 30
NP = int(sys.argv[1]); mode = sys.argv[2]; NMAX = 4000; NPTS = int(sys.argv[3]) if len(sys.argv)>3 else 400
print("planned allocation: matrix %d x %d mpf (~%.1f MB)" % (NP, NPTS, NP*NPTS*200/1e6))
def primes(k):
    out=[]; n=2
    while len(out)<k:
        if all(n%q for q in out if q*q<=n): out.append(n)
        n+=1
    return out
P = primes(NP); pmax=P[-1]
def vp(n,p):
    v=0
    while n%p==0: n//=p; v+=1
    return v
def A(p,x):
    # sum over n = multiples of p, n<=NMAX, truncated where exp underflows precision
    s=mpf(0); n=p
    cut = mp.dps*2.4+40
    while n<=NMAX:
        a = pi*n*n*x
        if a>cut and s!=0: break
        if a>20000: break
        s += vp(n,p)*n*n*exp(-a); n+=p
    return -(2*pi*x/p)*s
def f(p,x): return A(p,x) - A(p,1/x)/sqrt(x)
if mode=="literal":
    xs=[mpf('0.2')+(mpf('4.8')*j)/(NPTS-1) for j in range(NPTS)]
else:  # adapted: log-spaced in [1/(4 pmax^2), 1]
    lo=log(mpf(1)/(4*pmax*pmax)); xs=[exp(lo*(1-mpf(j)/(NPTS-1))) for j in range(NPTS)]
M=matrix(NP,NPTS)
norms=[]
for i,p in enumerate(P):
    row=[f(p,x) for x in xs]
    nr=sqrt(sum(r*r for r in row)); norms.append(nr)
    for j in range(NPTS): M[i,j]=row[j]
# antisymmetry check f_p(1/x) = -sqrt(x) f_p(x)
x0=mpf('0.37'); chk=max(abs(f(p,1/x0)+sqrt(x0)*f(p,x0))/ (abs(f(p,x0))+mpf(10)**(-mp.dps+5)) for p in P[:4])
S_raw=svd_r(M,compute_uv=False)
Mn=matrix(NP,NPTS)
for i in range(NP):
    for j in range(NPTS): Mn[i,j]=M[i,j]/norms[i] if norms[i]!=0 else 0
S_n=svd_r(Mn,compute_uv=False)
res=dict(NP=NP,mode=mode,dps=mp.dps,pmax=pmax,row_norms=[mp.nstr(v,6) for v in norms],
 sv_raw=[mp.nstr(S_raw[i],6) for i in range(NP)], sv_rownormalised=[mp.nstr(S_n[i],6) for i in range(NP)], antisym_check=mp.nstr(chk,3))
print(json.dumps(res,indent=1))
json.dump(res,open("svd_%s_%d_dps%d.json"%(mode,NP,mp.dps),"w"),indent=1)
