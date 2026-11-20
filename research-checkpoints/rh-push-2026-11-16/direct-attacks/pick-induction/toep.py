# Confluent Pick test at node a == Caratheodory-Toeplitz test of G(zeta)=L(a(1+zeta)/(1-zeta)).
# L = Lambda'/Lambda(1/2+z). All-order Toeplitz positivity <=> L positive-real on Re z>0.
# Arb ball arithmetic; Levinson recursion; reports first k with certified |alpha_k|>=1 (=> T_{k+1} not PSD).
import sys, time
from flint import arb, arb_series, ctx
def series_L(which, a, n, prec):
    ctx.prec = prec; ctx.cap = n+2
    z = arb_series([0,1])
    one = arb_series([1])
    zz = arb(a)*(one+z)/(one-z)          # centered variable as series in zeta
    s = zz + arb(1)/2
    if which == "zeta":
        logxi = (s*(s-1)/2).log() - s/2*arb.pi().log() + (s/2).lgamma() + s.zeta().log()
    else:
        kap = ((10-2*arb(5).sqrt()).sqrt()-2)/(arb(5).sqrt()-1)
        c = [1, kap, -kap, -1]
        f = sum((s.zeta(arb(r+1)/5))*c[r] for r in range(4))
        logxi = -s*arb(5).log() + f.log() + s/2*(arb(5)/arb.pi()).log() + ((s+1)/2).lgamma()
    # dlog/dz = (dlog/dzeta)/(dz/dzeta)
    ctx.cap = n+1
    G = logxi.derivative()/zz.derivative()
    return [G[k] for k in range(n+1)]
def levinson(g, verbose=True):
    # c_0=g_0, c_k=g_k/2 ; real symmetric Toeplitz
    c = [g[0]] + [x/2 for x in g[1:]]
    n = len(c)-1
    aco = [arb(1)]; E = c[0]; out=[]
    for k in range(1, n+1):
        acc = sum(aco[j]*c[k-j] for j in range(k))
        alpha = -acc/E
        new = [arb(1)] + [aco[j] + alpha*aco[k-j] for j in range(1,k)] + [alpha]
        aco = new
        fac = 1 - alpha*alpha
        E = E*fac
        out.append((k, alpha, fac))
        if not (fac > 0):
            return k, out, (fac < 0)
    return None, out, None
if __name__ == "__main__":
    which, a, n, prec = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
    t=time.time(); g = series_L(which, a, n, prec)
    t1=time.time()-t
    k, out, cert = levinson(g)
    import math
    samp = [(kk, float(al.mid()), float(fc.mid()), float(fc.rad())) for kk,al,fc in out if kk in (1,2,5,10,20,50,100,150,200,300,400) or kk>=len(out)-2]
    print(which, "a=",a, "n=",n, "prec=",prec, "series %.1fs"%t1, "total %.1fs"%(time.time()-t))
    print("  c0=L(a)=", g[0].str(15), " first |alpha_k|>=1 at k =", k, "(Toeplitz order N* = k+1)", "certified-negative" if cert else ("inconclusive-ball" if k else ""))
    for x in samp: print("   k=%d alpha=%.6g 1-alpha^2=%.3e rad=%.1e"%x)
