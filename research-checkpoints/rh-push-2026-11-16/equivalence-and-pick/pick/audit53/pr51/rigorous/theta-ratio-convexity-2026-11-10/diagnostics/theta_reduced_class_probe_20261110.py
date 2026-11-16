"""Diagnostic first-reduction stronger-class tests; not a certificate.

For z=1/N=kappa/n, the signs of d_z^2(c z) and d_z^2(B z)
are respectively signs(c' N''-c''N') and (B'N''-B''N').
Here c=C/kappa, B=t V'-1, N=n/kappa, and V=-log(kappa).
"""

import argparse
import json
import mpmath as mp

from theta_ratio_probe_20261110 import probe
from theta_anchor_free_probe_20261110 import potential_jets


def reduced_probe(a,t,dps=70):
    with mp.workdps(dps):
        values=probe(a,t,dps,return_raw=True)
        a,t,p,N,Np,c,cp=[values[key] for key in ('a','t','p','N','Np','c','cp')]
        vp,vpp,v3,v4=potential_jets(t)
        B=t*vp-1
        Bp=vp+t*vpp
        Bpp=2*vpp+t*v3
        cpp=vpp*c+vp*cp-mp.mpf(1)/4
        Npp=(a*a/4-vp*vp+vpp)*N+2*vp*Np+(B-a*p)/4
        Jprime=Bp/N-(B-a*p)*Np/N**2
        D_H=cp*Npp-cpp*Np
        D_B=Bp*Npp-Bpp*Np
        return {
            'a':str(a),'t':str(t),'dps':dps,
            'Nprime':mp.nstr(Np,28),'Nsecond':mp.nstr(Npp,28),
            'Jnew_prime':mp.nstr(Jprime,28),
            'Hnew_convexity_numerator':mp.nstr(D_H,28),
            'Jnew_convexity_numerator':mp.nstr(D_B,28),
            'expected_signs':bool(Np<0 and Jprime>0 and D_H>0 and D_B>0),
        }


if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--a',default='0.01,1,10,100')
    parser.add_argument('--t',default='0.001,0.5,2,6')
    parser.add_argument('--dps',type=int,default=70)
    args=parser.parse_args()
    rows=[]
    for a in args.a.split(','):
        for t in args.t.split(','):
            row=reduced_probe(a,t,args.dps)
            rows.append(row)
            print(json.dumps(row),flush=True)
