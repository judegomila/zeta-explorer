# validation: moments and Phi_1, Psi_1 against mpmath quadrature (independent)
import sys; sys.path.insert(0,'.')
from gates_arb import *
import mpmath as mp
ctx.prec=400; mp.mp.dps=40
def kap(kind,t):
    t=mp.mpf(t)
    if kind=='zeta': return mp.e**(t/4)*mp.nsum(lambda n:(2*(mp.pi*n*n*mp.e**t)**2-3*mp.pi*n*n*mp.e**t)*mp.exp(-mp.pi*n*n*mp.e**t),[1,mp.inf])
    kp=(mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1); c=[0,1,kp,-kp,-1]
    return mp.e**(3*t/4)*sum(c[n%5]*n*mp.exp(-mp.pi*n*n*mp.e**t/5) for n in range(1,60))
for kind in ['zeta','dh']:
    th=Theta(kind)
    for t in ['0.3','1.5','-1.0']:
        mo=moments(th,arb(t),[fmpq(1,2),fmpq(-1,2),fmpq(0)],6,200)
        for bi,b in enumerate([0.5,-0.5,0]):
            for m in [0,3,6]:
                ref=mp.quad(lambda tau: tau**m/mp.factorial(m)*mp.exp(b*tau)*kap(kind,mp.mpf(t)+tau),[0,0.5,1,2,4,10])
                print(kind,t,b,m, mo[bi][m].str(25), mp.nstr(ref,25))
        kj=kappa_jets(th,arb(t),3,200)
        print(' jets',kj[0].str(20), mp.nstr(kap(kind,t),20), kj[2].str(20), mp.nstr(mp.diff(lambda x:kap(kind,x),mp.mpf(t),2),15))
