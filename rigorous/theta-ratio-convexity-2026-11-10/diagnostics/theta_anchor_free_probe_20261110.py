"""Diagnostic samples of the anchor-independent theta comparison tests.

This is high-precision quadrature, not an interval proof. Run with --dps
to compare precision. The output does not assert a continuum inequality.
"""

import argparse
from fractions import Fraction
import json

import mpmath as mp

from theta_ratio_probe_20261110 import theta_data


POLYNOMIALS=[[Fraction(0),Fraction(-3),Fraction(2)]]
for _ in range(4):
    old=POLYNOMIALS[-1]
    POLYNOMIALS.append([
        (Fraction(j)+Fraction(1,4))*(old[j] if j<len(old) else 0)
        -(old[j-1] if j>0 else 0)
        for j in range(len(old)+1)
    ])


def potential_jets(t):
    z=mp.pi*mp.exp(t)
    totals=[mp.mpf(0)]*5
    for n in range(1,100):
        q=z*n*n
        weight=mp.exp(-(n*n-1)*z)
        terms=[]
        for k,poly in enumerate(POLYNOMIALS):
            term=weight*mp.polyval([mp.mpf(v.numerator)/v.denominator for v in poly[::-1]],q)
            terms.append(term)
            totals[k]+=term
        if n>1 and max(abs(v) for v in terms)<mp.eps*abs(totals[0]):
            break
    else:
        raise RuntimeError('Theta truncation did not converge')
    r=[x/totals[0] for x in totals]
    return [
        -r[1],-(r[2]-r[1]**2),
        -(r[3]-3*r[2]*r[1]+2*r[1]**3),
        -(r[4]-4*r[3]*r[1]-3*r[2]**2+12*r[2]*r[1]**2-6*r[1]**4),
    ]


def probe(t_value,dps=50):
    with mp.workdps(dps):
        t=mp.mpf(str(t_value))
        vp,vpp,v3,v4=potential_jets(t)
        logkt=theta_data(t)[0]
        scale=max(mp.mpf(1),vp)
        end=max(t+1,mp.log((100+4*dps)/mp.pi)+2)
        limit=(end-t)*scale
        breaks=[mp.mpf(0),limit]
        step=mp.mpf(1)
        while step<limit:
            breaks.append(step)
            step*=4
        h=mp.quad(lambda w:(t+w/scale)*mp.exp(theta_data(t+w/scale)[0]-logkt)/(4*scale),sorted(breaks))
        hp=vp*h-t/4
        hpp=vpp*h+vp*hp-mp.mpf(1)/4
        fp=vp+t*vpp
        fpp=2*vpp+t*v3
        wp=4*(2*vp*vpp-v3)
        wpp=4*(2*vpp*vpp+2*vp*v3-v4)
        dw=wpp*fp-wp*fpp
        dh=hpp*fp-hp*fpp
        return {
            't':str(t),'dps':dps,
            'Wprime':mp.nstr(wp,25),'DW':mp.nstr(dw,25),'Dh':mp.nstr(dh,25),
            'DW_over_t3':mp.nstr(dw/t**3,25),
            'Dh_over_t3':mp.nstr(dh/t**3,25),
            'V_third':mp.nstr(v3,25),
            'expected_signs':bool(wp>0 and dw>0 and dh>0),
        }


if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--t',default='0.0001,0.001,0.01,0.1,0.3,0.5,1,2,4,8')
    parser.add_argument('--dps',type=int,default=50)
    args=parser.parse_args()
    print(json.dumps({'scope':'Diagnostic samples only; no interval certificate','cases':[probe(t,args.dps) for t in args.t.split(',')]},indent=2))
