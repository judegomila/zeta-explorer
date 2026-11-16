"""First reduced theta source determinants: diagnostic, not certificate."""
import argparse
import json
from functools import lru_cache
import math
import mpmath as mp
import sympy as sp
from theta_ratio_probe_20261110 import probe

@lru_cache(maxsize=12)
def polynomials(order):
    x=sp.symbols('x')
    p=2*x*x-3*x
    result=[]
    for j in range(order+1):
        result.append([mp.mpf(str(c.p))/mp.mpf(str(c.q)) for c in sp.Poly(p,x).all_coeffs()])
        p=sp.expand((sp.Rational(1,4)-x)*p+x*sp.diff(p,x))
    return result


def normalized_theta_jets(t,order=5):
    z=mp.pi*mp.exp(t)
    ps=polynomials(order)
    sums=[mp.mpf(0) for i in range(order+1)]
    n=1
    while True:
        q=z*n*n
        weight=mp.exp(-(n*n-1)*z)
        terms=[weight*mp.polyval(c,q) for c in ps]
        sums=[s+d for s,d in zip(sums,terms)]
        if n>1 and max(abs(x) for x in terms)<mp.eps*abs(sums[0]):
            break
        n+=1
    return [x/sums[0] for x in sums]


def reduced_source_probe(a,t,dps=70,return_raw=False):
    with mp.workdps(dps):
        vals=probe(a,t,dps,return_raw=True)
        a,t,p,N,Np,h= [vals[x] for x in ('a','t','p','N','Np','c')]
        q=normalized_theta_jets(t,5)
        n1=Np+q[1]*N
        n2=(a*a*N-t*q[1]-1-a*p)/4
        n3=(a*a*n1-t*q[2]-(2+a*p)*q[1])/4
        n=[N,n1,n2,n3]
        k=q[:4]
        tk=[t*q[j+1]+j*q[j] for j in range(4)]
        c=[h,-t/4,-(1+t*q[1])/4,-(2*q[1]+t*q[2])/4]
        k2=q[2:6]
        DH=mp.det(mp.matrix([[n[i],k[i],tk[i],c[i]] for i in range(4)]))
        DP=mp.det(mp.matrix([[n[i],k[i],tk[i],k2[i]] for i in range(4)]))
        WH=p/a*DH/N**4
        WP=-4*p*p*DP/N**4
        if return_raw:
            return {'a':a,'t':t,'p':p,'N':N,'Np':Np,'h':h,'WH':WH,'WP':WP,'DH':DH,'DP':DP,'q':q}
        return {'a':str(a),'t':str(t),'dps':dps,'WH':mp.nstr(WH,30),'WP':mp.nstr(WP,30),'WH_t6':mp.nstr(WH/t**6,30),'WP_t6':mp.nstr(WP/t**6,30),'expected_signs':bool(WH>0 and WP>0)}

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--a',default='0.01,0.1,1,10,100')
    parser.add_argument('--t',default='0.001,0.125,0.5,1,2,4,6')
    parser.add_argument('--dps',type=int,default=70)
    args=parser.parse_args()
    rows=[]
    for a in args.a.split(','):
        for t in args.t.split(','):
            row=reduced_source_probe(a,t,args.dps)
            rows.append(row)
            print(json.dumps(row),flush=True)
