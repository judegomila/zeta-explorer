"""Rigorous first-reduced source-Wronskian origin gates, 0<a<=100.

This companion recomputes the moment models from the all-two-anchor
origin theorem, then verifies two additional cleared determinant signs.
No sampled or cached moments are accepted as proof inputs.
"""
import json
import sympy as sp
from flint import arb,arb_poly,ctx
from theta_second_origin_20261111 import certify_compact
from theta_preservation_origin_20261110 import Theta


def source_polynomials():
    q,N,d,c,b,g,k8,h=sp.symbols('q N d c b g k8 h')
    Y=q*N-d;Z=q*Y+4*c*(d+2);T=q*Z-16*b*(d+4)
    n=[N,Y/8,Z/192,T/7680]
    k=[1,-c/2,b/12,g/120]
    tk=[0,-c,b/3,g/20]
    C=[h,-sp.Rational(1,8),c/16,-b/96]
    k2=[-c,b/2,g/12,k8/120]
    DH=sp.factor(64*sp.Matrix([[n[i],k[i],tk[i],C[i]] for i in range(4)]).det())
    DP=sp.factor(-256*sp.Matrix([[n[i],k[i],tk[i],k2[i]] for i in range(4)]).det())
    A=sp.diff(DH,N);B=sp.diff(DH,d);CC=DH.subs({N:0,d:0})
    AP=sp.diff(DP,N);BP=sp.diff(DP,d);CP=DP.subs({N:0,d:0})
    assert sp.expand(DH-A*N-B*d-CC)==0
    assert sp.expand(DP-AP*N-BP*d-CP)==0
    assert sp.expand(DH.subs({N:h,d:1,q:0}))==0
    D0=sp.cancel((A*h+B+CC)/q)
    assert sp.denom(D0).is_Integer
    return (q,c,b,g,k8,h),(A,B,CC,D0,AP,BP,CP)


def to_ball_polynomial(expr,variables,values,scale):
    """Substitute q=scale*X and enclosed theta constants, with exact rationals."""
    poly=sp.Poly(sp.expand(expr),*variables)
    coeffs=[arb(0)]*(poly.degree(variables[0])+1)
    for powers,value in poly.terms():
        term=arb(int(value.p))/int(value.q)
        for exponent,bound in zip(powers[1:],values):
            term*=bound**exponent
        term*=scale**powers[0]
        coeffs[powers[0]]+=term
    return arb_poly(coeffs)


def certify(models=None,origin_summary=None,cells=4096):
    # The public/default entry recomputes all data. Supplying models is
    # reserved for a runner that just called certify_compact in-process.
    if models is None:
        origin_summary,models=certify_compact(return_models=True)
    assert ctx.prec>=384
    e,ep,o,op=[models[k] for k in ('e','ep','o','op')]
    P,T,K0,A,xmax=[models[k] for k in ('P','T','K0','A','xmax')]
    k0=models['kappa0'];coeffs=models['raw_moment_coefficients']
    odd=coeffs[1::2];bound=models['moment_sum_bound']
    assert len(odd)==301 and A==200 and xmax==arb(1)/4
    p100=arb(200)*ep(xmax)/(A*A*e(xmax))
    assert p100>1 and p100<arb('1.5')
    # This is the series (o(X)-o(0))/X. Its independent remainder
    # starts at X^300; no interval-valued constant is divided by X.
    err=bound*xmax**300/(1-xmax)
    odiv=arb_poly(odd[1:])+arb_poly([arb(0,err)])
    h=odd[0]/K0
    jets=Theta(8,16).jets(0)
    assert jets[0].overlaps(k0)
    c=-jets[2]/k0;b=jets[4]/k0;g=jets[6]/k0;k8=jets[8]/k0
    variables,expressions=source_polynomials()
    AA,BB,CC,D0,AP,BP,CP=[to_ball_polynomial(v,variables,[c,b,g,k8,h],A*A)
                         for v in expressions]
    GH=AA*(e*odiv+2*(e*op-ep*o))+2*K0*BB*ep+A*A*K0*e*D0
    GP=AP*P+K0*BP*T+K0*CP*e
    minima=[None,None]
    for i in range(cells):
        lo=xmax*i/cells;hi=xmax*(i+1)/cells
        xx=(lo+hi)/2+arb(0,(hi-lo)/2)
        ev=e(xx);hv=GH(xx);pv=GP(xx)
        assert ev>0,(i,'e',ev)
        assert hv>0,(i,'DH/a2',hv)
        assert pv>0,(i,'DP',pv)
        vals=[hv/(A*A*K0*ev),pv/(K0*ev)]
        for j,val in enumerate(vals):
            assert val>0
            if minima[j] is None or val.lower()<minima[j]:minima[j]=val.lower()
    assert minima[0]>arb('3.07e-8') and minima[1]>arb('0.36')
    return {'status':'passed','anchor_interval':'0<a<=100','precision_bits':ctx.prec,
            'cells':cells,'moment_coefficients_recomputed':len(coeffs),
            'source_constants':{'gamma':str(c),'beta':str(b),'kappa6_over_kappa0':str(g),
                                'kappa8_over_kappa0':str(k8),'C0_over_kappa0':str(h),
                                'p100':str(p100)},
            'deflated_odd_remainder':str(err),'cleared_degrees':{'DH_over_a2':GH.degree(),'DP':GP.degree()},
            'minimum_DH_over_a2':str(minima[0]),'minimum_DP':str(minima[1]),
            'identities_checked':3,
            'conclusion':'The limiting first-reduced source Wronskians WH1/t^6 and WP1/t^6 are strictly positive for every 0<a<=100.',
            'scope':'First-reduced source determinants at the spatial origin. The large-anchor tail and global spatial transfer are separate proofs.',
            'shared_second_origin_compact':origin_summary}

if __name__=='__main__':
    if not __debug__:raise RuntimeError('Do not disable proof assertions with Python -O.')
    out=certify()
    with open('theta_second_source_origin_compact_replay_20261111.json','w') as f:
        json.dump(out,f,indent=2)
    print(json.dumps(out,indent=2))
