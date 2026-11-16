# Independent non-rigorous float spot check of K_H, S_U, K_U, S_Q from their definitions
import mpmath as mp
mp.mp.dps=80
N=16
def kap(t):
    return mp.e**(t/4)*mp.nsum(lambda n:(2*(mp.pi*n*n*mp.e**t)**2-3*mp.pi*n*n*mp.e**t)*mp.e**(-mp.pi*n*n*mp.e**t),[1,30])
def sdiv(a,b):
    q=[]
    for k in range(len(a)):
        q.append((a[k]-sum(q[j]*b[k-j] for j in range(k)))/b[0])
    return q
def sder(a): return [a[k+1]*(k+1) for k in range(len(a)-1)]
def smul(a,b): return [sum(a[j]*b[k-j] for j in range(k+1)) for k in range(min(len(a),len(b)))]
def run(t):
    k=mp.taylor(kap,t,N)
    tk=smul([t,1]+[0]*(N-1),k)            # s*kappa(s) about t
    C0=mp.quad(lambda s:s*kap(s),[t,t+1,t+3,mp.inf])/4
    # C' = -s kappa/4 -> C series = C0 + integral
    Cs=[C0]+[-tk[j]/4/(j+1) for j in range(N)]
    Cs=Cs[:N+1]
    def nth(a,m):
        for _ in range(m): a=sder(a)
        return a
    H=sdiv(Cs,k); B=[4*x for x in sdiv(nth(Cs,2),k)]; J=[4*x for x in sdiv(nth(k,2),k)]
    P=[16*x for x in sdiv(nth(Cs,4),k)]; Q=[16*x for x in sdiv(nth(k,4),k)]; U=[64*x for x in sdiv(nth(Cs,6),k)]
    def W(fs,m):
        M=mp.matrix(m,m)
        for j,f in enumerate(fs):
            g=sder(f)
            for i in range(m): M[i,j]=g[i]*mp.factorial(i)
        return mp.det(M)
    return W([B,J,P,Q,H],5),W([B,J,P,U],4),W([B,J,P,Q,U],5),W([B,J,P,Q],4)
for t in ['0.1','0.15','0.2','0.3','0.5','0.52','0.54','0.5625','0.75','1','2','3','4','4.5']:
    r=run(mp.mpf(t)); print(t,'KH,SU,KU,SQ =',[mp.nstr(x,5) for x in r],flush=True)
