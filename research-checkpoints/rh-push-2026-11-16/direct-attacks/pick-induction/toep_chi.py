import sys; sys.path.insert(0,'.')
from flint import arb, arb_series, ctx
from toep2 import lev_mid
CH={"chi_-4":(4,[0,1,0,-1]),"chi_-8":(8,[0,1,0,1,0,-1,0,-1]),"chi_-11":(11,[0,1,-1,1,1,1,-1,-1,-1,1,-1])}
def series(name,a,n,prec):
    q,chi=CH[name]; ctx.prec=prec; ctx.cap=n+2
    z=arb_series([0,1]); one=arb_series([1]); zz=arb(a)*(one+z)/(one-z); s=zz+arb(1)/2
    f=sum(s.zeta(arb(r)/q)*chi[r] for r in range(1,q) if chi[r])
    lg=-s*arb(q).log()+f.log()+s/2*(arb(q)/arb.pi()).log()+((s+1)/2).lgamma()
    ctx.cap=n+1; G=lg.derivative()/zz.derivative(); return [G[k] for k in range(n+1)]
for name in CH:
    for a in ("1",):
        n=150; f1=lev_mid(series(name,a,n,5000)); ctx.prec=10000; f2=lev_mid(series(name,a,n,10000))
        first=next((k+1 for k in range(n) if float(f2[k])<=0),None)
        ok=all(abs(float(x)-float(y))<=1e-6*abs(float(y)) for x,y in zip(f1,f2))
        print(name,"a=",a,"orders 2..%d"%(n+1),"first failing order:",first and first+1,"precision-stable:",ok,"min factor %.3e"%min(float(x) for x in f2))
