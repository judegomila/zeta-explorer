# Rigidity: replace Lambda(n0) by Lambda(n0)+eps in xi'/xi. First Toeplitz order (confluent node a) at which positivity fails.
import sys; sys.path.insert(0,'.')
from toep import series_L
from toep2 import lev_mid
from flint import arb, arb_series, ctx
def run(a,n,prec,n0,eps):
    g=series_L("zeta",a,n,prec); ctx.prec=prec; ctx.cap=n+1
    z=arb_series([0,1]); one=arb_series([1]); s=arb(a)*(one+z)/(one-z)+arb(1)/2
    pert=(-(s)*arb(n0).log()).exp()
    g2=[g[k]-arb(eps)*pert[k] for k in range(n+1)]
    return lev_mid(g2)
a=sys.argv[1]; n=int(sys.argv[2]); prec=int(sys.argv[3])
for n0 in (2,3,101):
    for eps in ("1e-1","1e-2","1e-3","1e-4","1e-6","-1e-2","-1e-4"):
        f1=run(a,n,prec,n0,eps); f2=run(a,n,2*prec,n0,eps)
        first=next((k+1 for k in range(n) if float(f2[k])<=0),None)
        ok=all(abs(float(f1[k])-float(f2[k]))<=1e-6*abs(float(f2[k])) for k in range((first or n)))
        print("a=%s n0=%d eps=%s (relative change of Lambda(n0): %.1e): first failing order N=%s  precision-stable=%s"%(a,n0,eps,float(eps)/float(arb(n0).log()),(first+1 if first else ">%d"%(n+1)),ok),flush=True)
