# Same test, floating midpoints (no ball propagation) -> MEASURED; agreement across two precisions is the check.
import sys, time
sys.path.insert(0,'.')
from toep import series_L
from flint import arb, ctx
def lev_mid(g):
    c = [g[0].mid()] + [(x/2).mid() for x in g[1:]]
    n = len(c)-1
    aco = [arb(1)]; E = c[0]; facs=[]
    for k in range(1, n+1):
        acc = sum((aco[j]*c[k-j]).mid() for j in range(k)).mid()
        alpha = (-acc/E).mid()
        aco = [arb(1)] + [(aco[j] + alpha*aco[k-j]).mid() for j in range(1,k)] + [alpha]
        fac = (1 - alpha*alpha).mid(); E = (E*fac).mid()
        facs.append(fac)
    return facs
def run(which,a,n,prec):
    g = series_L(which,a,n,prec); ctx.prec=prec
    return lev_mid(g)
if __name__=="__main__":
    which,a,n,prec = sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4])
    t=time.time()
    f1 = run(which,a,n,prec); f2 = run(which,a,n,2*prec)
    first=None; agree=n
    for k in range(n):
        x1=float(f1[k]); x2=float(f2[k])
        if abs(x1-x2) > 1e-6*abs(x2) and agree==n: agree=k   # last k (0-based) where precisions agree
        if first is None and x2<=0: first=k+1
    print(which,"a=",a,"n=",n,"prec=",prec,"/",2*prec,"time %.0fs"%(time.time()-t),
          "| precisions agree through k=",agree,"| first 1-alpha_k^2<=0 at k=",first,"=> Toeplitz/Pick order N*=", (first+1 if first else None))
    ks=[1,5,10,20,40,60,80,100,150,200,250,300,400]
    if first: ks += [first-1, first]
    print("   ", [(k, "%.3e"%float(f2[k-1])) for k in sorted(set(ks)) if k<=n])
