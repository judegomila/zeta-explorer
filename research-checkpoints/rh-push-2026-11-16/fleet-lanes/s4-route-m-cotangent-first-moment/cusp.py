# Crest (log-cusp) strength of A_F at a rational x0 = r/s:  D(delta) = A(x0+delta) + A(x0-delta) - 2 A(x0),
# fitted as D/delta = beta * log(1/delta) + const over delta = 1/n. Prediction (derived in RESULT.md):
#   beta = (1/r) * mean over a period of c_{rk} c_{sk}   (zeta: c = 1, beta = 1/r).
import subprocess, math, json, numpy as np
XI=0.28407904384041227
F={"zeta":None,"chi_-3":[1,-1,0],"chi_5":[1,-1,-1,1,0],"DH":[1,XI,-XI,-1,0]}
def run(name,pairs):
    if F[name] is None:
        out=subprocess.run(["./rmc_local","X"],input="".join("A %d %d\n"%p for p in pairs),capture_output=True,text=True).stdout.split()
        return [float(v) for v in out]
    c=F[name]; red=[]
    for a,b in pairs:
        g=math.gcd(a,b); red.append((a//g,b//g))
    out=subprocess.run(["./rmc_local","PX",str(len(c))]+[repr(v) for v in c],input="".join("%d %d\n"%p for p in red),capture_output=True,text=True).stdout.strip().split("\n")
    return [float(l.split()[3])/p[1] for l,p in zip(out,red)]
ns=[100,200,400,1000,2000,4000,10000,20000,40000,100000,200000,400000]
res={}
for (r,s) in [(1,5),(1,6),(1,4),(1,7),(2,5),(1,3),(2,7)]:
    for name in F:
        pairs=[(r,s)]
        for n in ns: pairs+=[(r*n+1,s*n),(r*n-1,s*n)]      # x0 +- 1/(s n)
        v=run(name,pairs); A0=v[0]; xs=[];ys=[]
        for i,n in enumerate(ns):
            d=1.0/(s*n); Dd=(v[1+2*i]+v[2+2*i]-2*A0)/d; xs.append(math.log(1/d)); ys.append(Dd)
        beta,const=np.polyfit(xs[4:],ys[4:],1)
        c=F[name]
        pred=(1.0/r) if c is None else (1.0/r)*sum(c[(r*k-1)%len(c)]*c[(s*k-1)%len(c)] for k in range(1,len(c)+1))/len(c)
        res["%s@%d/%d"%(name,r,s)]={"A0":A0,"beta_fit":float(beta),"beta_pred":pred,"const":float(const)}
        print("%-7s x0=%d/%d  A(x0)=%.10f  beta fit %+.5f  predicted %+.5f   D/delta at n=1e2,1e4,4e5: %+.4f %+.4f %+.4f"%(name,r,s,A0,beta,pred,ys[0],ys[6],ys[-1]))
json.dump(res,open("cusp.json","w"),indent=1)
