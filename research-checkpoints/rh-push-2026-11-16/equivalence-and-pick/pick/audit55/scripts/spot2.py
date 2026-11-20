# Independent non-rigorous spot check (own code) of K_H,S_U,K_U,S_Q from definitions; flint arb_series jets
from flint import arb, arb_series, ctx
import mpmath as mp
ctx.prec=1400; N=14; ctx.cap=N+2
def kap_series(t0):
    t=arb_series([t0,1],prec=N+1); e=t.exp(); out=arb_series([0],prec=N+1)
    for n in range(1,4):
        z=arb.pi()*n*n*e
        out+= (t/4).exp()*(2*z*z-3*z)*(-z).exp()
    return out
def kapf(s): 
    s=mp.mpf(s); return mp.e**(s/4)*sum((2*(mp.pi*n*n*mp.e**s)**2-3*mp.pi*n*n*mp.e**s)*mp.e**(-mp.pi*n*n*mp.e**s) for n in range(1,4))
mp.mp.dps=400
def coeffs(s): return [s.coeffs()[i] if i<len(s.coeffs()) else arb(0) for i in range(N+1)]
def sdiv(a,b):
    q=[]
    for k in range(len(a)): q.append((a[k]-sum(q[j]*b[k-j] for j in range(k)))/b[0])
    return q
def sder(a): return [a[k+1]*(k+1) for k in range(len(a)-1)]
def nth(a,m):
    for _ in range(m): a=sder(a)
    return a
def det(M):
    n=len(M)
    if n==1: return M[0][0]
    return sum(((-1)**j)*M[0][j]*det([r[:j]+r[j+1:] for r in M[1:]]) for j in range(n))
def W(fs,m):
    cols=[sder(f) for f in fs]; fact=[1,1,2,6,24,120]
    return det([[cols[j][i]*fact[i] for j in range(m)] for i in range(m)])
def run(t0):
    k=coeffs(kap_series(arb(t0)))
    tk=[arb(t0)*k[0]]+[arb(t0)*k[j]+k[j-1] for j in range(1,N+1)]
    C0=arb(str(mp.quad(lambda s:s*kapf(s),[t0,t0+0.5,t0+1,t0+2,t0+4])/4))
    Cs=[C0]+[-tk[j]/4/(j+1) for j in range(N)]
    H=sdiv(Cs,k); B=[4*x for x in sdiv(nth(Cs,2),k)]; J=[4*x for x in sdiv(nth(k,2),k)]
    P=[16*x for x in sdiv(nth(Cs,4),k)]; Q=[16*x for x in sdiv(nth(k,4),k)]; U=[64*x for x in sdiv(nth(Cs,6),k)]
    L=min(len(x) for x in (H,B,J,P,Q,U)); H,B,J,P,Q,U=[x[:L] for x in (H,B,J,P,Q,U)]
    return W([B,J,P,Q,H],5),W([B,J,P,U],4),W([B,J,P,Q,U],5),W([B,J,P,Q],4),W([B,J,P,H],4)
for t in ['5','6']:
    r=run(float(t)); print(t,'KH,SU,KU,SQ,SH =',[x.mid().str(4) for x in r],flush=True)
