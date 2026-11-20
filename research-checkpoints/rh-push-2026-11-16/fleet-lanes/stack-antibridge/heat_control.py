# Backward-heat control: F_tau(x) = int kappa(u) e^{tau u^2/16} e^{xu/2} du, kappa(u)=Phi(u/4).
# First order at which P, K_e, K_o lose positive definiteness on the first N nodes of family A.
import mpmath as mp, sys, json, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sectors import nodes, mats, first_fail, L_zeta
mp.mp.dps = int(sys.argv[2]); N = int(sys.argv[1])
def Phi(u):
    u = abs(u); e4 = mp.exp(4*u); tot = mp.mpf(0); n = 1
    while True:
        t = (2*mp.pi**2*n**4*mp.exp(9*u) - 3*mp.pi*n**2*mp.exp(5*u))*mp.exp(-mp.pi*n*n*e4)
        tot += t
        if abs(t) < mp.mpf(10)**(-mp.mp.dps-10)*abs(tot) or n > 60: break
        n += 1
    return tot
def jets(x, tau):
    pts = mp.linspace(0, 9, 19)
    w = lambda u: mp.exp(tau*u*u/16)*Phi(u/4)
    F0 = 2*mp.quad(lambda u: w(u)*mp.cosh(x*u/2), pts)
    F1 = 2*mp.quad(lambda u: w(u)*(u/2)*mp.sinh(x*u/2), pts)
    F2 = 2*mp.quad(lambda u: w(u)*(u*u/4)*mp.cosh(x*u/2), pts)
    L = F1/F0; return L, F2/F0 - L*L
xs = nodes(N, mp.mpf('0.01'), mp.mpf('0.5'))
out = []
for tau in [mp.mpf(t) for t in sys.argv[3].split(',')]:
    J = [jets(x, tau) for x in xs]
    if tau == 0:
        err = max(abs(J[i][0]-L_zeta(xs[i])[0]) for i in range(N)); derr = max(abs(J[i][1]-L_zeta(xs[i])[1]) for i in range(N))
        print("tau=0 check vs closed form: max|dL| %s max|dL'| %s"%(mp.nstr(err,3), mp.nstr(derr,3)), flush=True)
    P,Ke,Ko = mats(xs,[j[0] for j in J],[j[1] for j in J])
    r = {"tau": mp.nstr(tau,6)}
    for nm,K in (("P",P),("Ke",Ke),("Ko",Ko)):
        f,piv = first_fail(K); r[nm]=f; r[nm+"_piv"]=[mp.nstr(p,4) for p in piv]
    print({k:v for k,v in r.items() if not k.endswith("_piv")}, [r[k][-1] for k in ("P_piv","Ke_piv","Ko_piv")], flush=True); out.append(r)
json.dump(out, open(sys.argv[4],"w"), indent=1)
