# Time-domain canonical theta reduction (uniform form, PR54 synthesis eq.(1)):
#   pair (u,v) even positive kernels, R(z)=z Lu(z)/Lv(z), r=R(a);
#   4b''-a^2 b = r v - a u (even decaying solution), n=u-ab; next pair (u,v)<-(b,n).
# Gates per level: u>0, v>0, H'<0, B'>0, J'>0, d2H/dB2>0, d2J/dB2>0  (H=u/v, B=4u''/v, J=4v''/v).
# float64 on a grid uniform in x=e^t; MEASURED only.
import numpy as np, sys
from scipy.integrate import cumulative_simpson
def jets_theta(x, terms, alpha, M=4):
    # kernel = sum_n sum_j coef * e^{alpha t} y^j e^{-y}, y = lam_n e^t ; returns d^k/dt^k, k=0..M
    out = [np.zeros_like(x) for _ in range(M+1)]
    for lam, poly in terms:              # poly: dict j->coef
        y = lam*x; e = np.exp(-y)
        p = dict(poly)
        for k in range(M+1):
            out[k] += sum(c*y**j for j,c in p.items())*e
            q = {}
            for j,c in p.items():
                q[j] = q.get(j,0)+c*(alpha+j); q[j+1] = q.get(j+1,0)-c
            p = q
    ea = x**alpha
    return [o*ea for o in out]
def kernel(which, x):
    if which=="zeta":
        terms=[(np.pi*n*n, {2:2.0,1:-3.0}) for n in range(1,12)]
        return jets_theta(x, terms, 0.25)
    kap=(np.sqrt(10-2*np.sqrt(5))-2)/(np.sqrt(5)-1); c=[0,1,kap,-kap,-1]
    terms=[(np.pi*n*n/5, {0:c[n%5]*n}) for n in range(1,40) if n%5]
    return jets_theta(x, terms, 0.75)
def tailint(g, x):   # int_t^inf g ds, ds=dx/x, on grid (g ~ 0 at right end)
    f = g/x
    c = cumulative_simpson(f, x=x, initial=0.0)
    return c[-1]-c
def level0(which, x):
    t=np.log(x); k=kernel(which,x)
    C0 = 0.25*tailint(t*k[0], x)
    C=[C0, -t*k[0]/4, -(k[0]+t*k[1])/4, -(2*k[1]+t*k[2])/4, -(3*k[2]+t*k[3])/4]
    return C, k
def reduce(u, v, a, x):
    t=np.log(x); ch=np.cosh(a*t/2)
    r = a*tailint(ch*u[0],x)[0]/tailint(ch*v[0],x)[0]
    S=[r*v[k]-a*u[k] for k in range(5)]
    ep=x**(a/2); em=x**(-a/2)
    Ip=tailint(ep*S[0],x); Im=tailint(em*S[0],x)
    b0=(em*Ip-ep*Im)/(4*a); b1=-(em*Ip+ep*Im)/8
    b=[b0,b1,(a*a*b0+S[0])/4,(a*a*b1+S[1])/4]; b.append((a*a*b[2]+S[2])/4)
    n=[u[k]-a*b[k] for k in range(5)]
    return b, n, r
def gates(u, v):
    q=lambda f0,f1,g0,g1: (f1*g0-f0*g1)/g0**2
    def q2(f0,f1,f2,g0,g1,g2): return (f2*g0-f0*g2)/g0**2 - 2*g1*(f1*g0-f0*g1)/g0**3
    H1=q(u[0],u[1],v[0],v[1]); B1=4*q(u[2],u[3],v[0],v[1]); J1=4*q(v[2],v[3],v[0],v[1])
    H2=q2(u[0],u[1],u[2],v[0],v[1],v[2]); B2=4*q2(u[2],u[3],u[4],v[0],v[1],v[2]); J2=4*q2(v[2],v[3],v[4],v[0],v[1],v[2])
    return {"u>0":u[0],"v>0":v[0],"H'<0":-H1,"B'>0":B1,"J'>0":J1,"HBconv":H2*B1-H1*B2,"JBconv":J2*B1-J1*B2}
def check(which, anchors, X, dx, tmax, verbose=False):
    x=np.arange(1.0, X, dx); t=np.log(x)
    u,v=level0(which,x); m=(t>1e-3)&(t<tmax)
    res=[]
    for lev in range(len(anchors)+1):
        g=gates(u,v)
        fails={}
        for name,arr in g.items():
            a_=arr[m]
            if not np.all(a_>0):
                i=np.argmax(a_<=0); fails[name]=float(t[m][i])
        res.append(fails)
        if lev<len(anchors):
            b,n,r=reduce(u,v,anchors[lev],x)
            if verbose: print("  lev",lev,"a",anchors[lev],"r",r,"b'(0)",b[1][0]/b[0][0])
            u,v=b,n
    return res
if __name__=="__main__":
    which=sys.argv[1]; anchors=[float(s) for s in sys.argv[2].split(',')] if len(sys.argv)>2 and sys.argv[2] else []
    X,dx,tmax = (14,1e-3,2.0) if which=="zeta" else (70,2.5e-3,3.5)
    for lev,f in enumerate(check(which,anchors,X,dx,tmax,True)): print(which,"level",lev,"FAILS(first t):" if f else "all 7 gates pass", f if f else "")
