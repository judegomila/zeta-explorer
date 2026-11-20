"""Diagnostic high-precision theta-ratio probe; not an interval certificate.

Positive centered-tail Stein integrals avoid large-anchor cancellation.
Quadrature and truncation are checked by precision changes, not rigorously
enclosed. No sampled sign is claimed as a continuum theorem.
"""

import argparse
import json
from functools import lru_cache

import mpmath as mp


def theta_data(t):
    """Return log(kappa), V', V''' for V=-log(kappa), t>=0."""
    t=mp.mpf(t)
    z=mp.pi*mp.exp(t)
    totals=[mp.mpf(0) for _ in range(4)]
    n=1
    while True:
        q=z*n*n
        weight=mp.exp(-(n*n-1)*z)
        polynomials=[
            2*q*q-3*q,
            -2*q**3+mp.mpf(15)/2*q*q-mp.mpf(15)/4*q,
            2*q**4-14*q**3+mp.mpf(165)/8*q*q-mp.mpf(75)/16*q,
            -2*q**5+mp.mpf(45)/2*q**4-mp.mpf(529)/8*q**3
            +mp.mpf(1635)/32*q*q-mp.mpf(375)/64*q,
        ]
        for k in range(4):
            totals[k]+=weight*polynomials[k]
        if n>1 and max(abs(weight*poly) for poly in polynomials)<mp.eps*abs(totals[0]):
            break
        n+=1
    logk=t/4-z+mp.log(totals[0])
    r1,r2,r3=[totals[k]/totals[0] for k in range(1,4)]
    return logk,-r1,-(r3-3*r2*r1+2*r1**3)


@lru_cache(maxsize=256)
def anchor_p(a_text,dps):
    a=mp.mpf(a_text)
    if a==mp.mpf('0.5'):
        return 1+mp.euler/2-mp.log(4*mp.pi)/2
    s=a+mp.mpf('0.5')
    return 1/s+1/(s-1)-mp.log(mp.pi)/2+mp.digamma(s/2)/2+mp.diff(mp.zeta,s)/mp.zeta(s)


def probe(a_value,t_value,dps=50,return_raw=False):
    with mp.workdps(dps):
        a,t=mp.mpf(str(a_value)),mp.mpf(str(t_value))
        lam=a/2
        p=anchor_p(str(a),dps)
        logkt,Vp,V3=theta_data(t)
        # The finite endpoint is chosen far beyond the tail peak. At it,
        # the leading theta exponent exceeds the requested digit budget.
        end=max(t+1,mp.log((a+100+4*dps)/mp.pi)+2)

        def ratio(v):
            return mp.exp(theta_data(abs(v))[0]-logkt)

        def breaks(limit,extra=()):
            values=[mp.mpf(0),limit]
            step=mp.mpf(1)
            while step<limit:
                values.append(step)
                step*=4
            return sorted(set(values+list(extra)))

        def right_integral(tilt,center):
            scale=max(mp.mpf(1),Vp-tilt)
            limit=(end-t)*scale
            def fun(w):
                v=t+w/scale
                return (v-center)*ratio(v)*mp.exp(tilt*(v-t))/scale
            return mp.quad(fun,breaks(limit))

        if t>=2*p:
            tau_plus=right_integral(lam,2*p)
        else:
            scale=max(mp.mpf(1),lam-Vp)
            limit=(t+end)*scale
            def left_fun(w):
                v=t-w/scale
                return (2*p-v)*ratio(v)*mp.exp(-lam*w/scale)/scale
            tau_plus=mp.quad(left_fun,breaks(limit,[t*scale]))
        tau_minus=right_integral(-lam,-2*p)
        scale=max(mp.mpf(1),Vp)
        limit=(end-t)*scale
        def c_fun(w):
            v=t+w/scale
            return v*ratio(v)/(4*scale)
        c=mp.quad(c_fun,breaks(limit))
        N=(tau_plus+tau_minus)/8
        Np=(Vp*(tau_plus+tau_minus)+lam*(tau_minus-tau_plus)-2*t)/8
        cp=Vp*c-t/4
        first_numerator=Np*c-N*cp
        bratio=(c-N)/a
        d_n_over_b=a*first_numerator/(c-N)**2
        if return_raw:
            return {'a':a,'t':t,'p':p,'N':N,'Np':Np,'c':c,'cp':cp,'Vp':Vp,'V3':V3}
        result={
            'a':str(a),'t':str(t),'dps':dps,
            'p':mp.nstr(p,25),'n_over_kappa':mp.nstr(N,25),
            'b_over_kappa':mp.nstr(bratio,25),
            'd_n_over_kappa':mp.nstr(Np,25),
            'first_ratio_numerator':mp.nstr(first_numerator,25),
            'd_n_over_b':mp.nstr(d_n_over_b,25),
            'V_third':mp.nstr(V3,25),
            'expected_signs':bool(Np<0 and first_numerator>0 and bratio>0),
        }
        return result


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--a',default='1')
    parser.add_argument('--t',default='1')
    parser.add_argument('--dps',type=int,default=50)
    args=parser.parse_args()
    print(json.dumps(probe(args.a,args.t,args.dps),indent=2))


if __name__=='__main__':
    main()
