"""Rigorous single-crossing certificates for the failed theta source tests.

The source signs are negative at the origin, strictly increasing after
division by t^10 until t=3/16, and positive thereafter. The infinite
tail is covered by the separate exact tail proof.
"""
from math import factorial
from fractions import Fraction as Q
import json
from flint import arb, arb_poly, ctx
from theta_second_source_obstruction_20261111 import det5
from theta_ratio_core_certificate_20261110 import ThetaJets, rat, ball
from theta_ratio_c_integral_20261110 import C_point
from theta_ratio_origin_certificate_20261110 import coefficients, polynomial_derivative, kappa_remainder, error_ball


def core_numerators(t,k,C):
    """Return kappa^5 times the two exact source Wronskians."""
    col0=k[:5]
    col1=[t*k[j+1]+(j*k[j] if j else 0) for j in range(5)]
    col2=k[2:7]
    col3=[t*k[j+3]+(j*k[j+2] if j else 0) for j in range(5)]
    colC=[4*C]+[-t*k[j-1]-(j-1)*k[j-2] if j>1 else -t*k[0]
                for j in range(1,5)]
    return (4*det5([col0,col1,col2,col3,colC]),
            256*det5([col0,col1,col2,col3,k[4:9]]))


def even_columns(u,k,C):
    return [
        k[:6],
        [-(2*j+1)*k[j]-2*u*k[j+1] for j in range(6)],
        [(8+16*j)*k[j+1]+16*u*k[j+2] for j in range(6)],
        [-(24+64*j+32*j*j)*k[j+1]-(96+64*j)*u*k[j+2]-32*u*u*k[j+3] for j in range(6)],
        [8*C]+[-k[j] for j in range(5)],
        [(192+512*j+256*j*j)*k[j+2]+(768+512*j)*u*k[j+3]+256*u*u*k[j+4] for j in range(6)]
    ]


def audit():
    import sympy as s
    u,t=s.symbols('u t')
    K=s.Function('K')(u);C=s.Function('C')(u)
    cols=even_columns(u,[s.diff(K,u,j) for j in range(10)],C)
    targets=[K,-K-2*u*s.diff(K,u),8*s.diff(K,u)+16*u*s.diff(K,u,2),
             -24*s.diff(K,u)-96*u*s.diff(K,u,2)-32*u*u*s.diff(K,u,3),8*C,
             192*s.diff(K,u,2)+768*u*s.diff(K,u,3)+256*u*u*s.diff(K,u,4)]
    subs={s.diff(C,u,j):-s.diff(K,u,j-1)/8 for j in range(1,6)}
    checks=0
    for col,target in zip(cols,targets):
        for j,entry in enumerate(col):
            assert s.expand((s.diff(target,u,j)-entry).subs(subs))==0
            checks+=1
    # General determinant differentiation: the earlier differentiated rows
    # duplicate an adjacent row, leaving only row order 5 in the last row.
    funcs=[s.Function('f'+str(j))(u) for j in range(5)]
    wr=det5([[s.diff(f,u,j) for j in range(5)] for f in funcs])
    wrp=det5([[s.diff(f,u,j) for j in [0,1,2,3,5]] for f in funcs])
    assert s.expand(s.diff(wr,u)-wrp)==0
    checks+=1
    V=s.Function('V')(u)
    assert s.cancel(s.diff(V/K**5,u)-(s.diff(V,u)*K-5*V*s.diff(K,u))/K**6)==0
    checks+=1
    k=s.Function('k')(t);c=s.Function('c')(t)
    cjets=[4*c]+[-t*s.diff(k,t,j-1)-(j-1)*s.diff(k,t,j-2) if j>1 else -t*k for j in range(1,5)]
    csubs={s.diff(c,t,j):-(t*s.diff(k,t,j-1)+(j-1)*s.diff(k,t,j-2))/4 if j>1 else -t*k/4 for j in range(1,5)}
    for j,entry in enumerate(cjets):
        assert s.expand((s.diff(4*c,t,j)-entry).subs(csubs))==0
        checks+=1
    return checks


def source_monotonicity(degree=56,terms=16,cells=256):
    upper=arb(9)/256
    b,tail=coefficients(degree,terms)
    errors=[kappa_remainder(j,degree,upper) for j in range(10)]
    K=[arb_poly(polynomial_derivative(b,j))+arb_poly([error_ball(errors[j])]) for j in range(10)]
    C0=C_point(0)
    integral=[arb(0)]+[b[j]/(j+1) for j in range(degree+1)]
    errC=40000*4**(degree+1)*upper**(degree+2)/(degree+2)/(1-4*upper)/8
    C=arb_poly([C0])-arb_poly(integral)*(arb(1)/8)+arb_poly([error_ball(errC)])
    cols=even_columns(arb_poly([0,1]),K,C)
    numerators=[]
    derivative_numerators=[]
    for col in cols[4:]:
        selected=cols[:4]+[col]
        value=det5([c[:5] for c in selected])
        derivative=det5([[c[j] for j in [0,1,2,3,5]] for c in selected])
        numerators.append(value)
        derivative_numerators.append(derivative*K[0]-5*value*K[1])
    names=['S_H_over_t10','S_Q_over_t10']
    minima={name:None for name in names}
    for i in range(cells):
        u=upper*(2*i+1)/(2*cells)+ball(upper/(2*cells))
        kk=K[0](u)
        assert kk>0
        for name,poly,den in zip(names,derivative_numerators,[8,1]):
            value=1024*poly(u)/(den*kk**6)
            assert value>0,(name,i,value)
            lower=value.lower()
            if minima[name] is None or lower<minima[name]:
                minima[name]=lower
    at_zero=[1024*p(arb(0))/(den*K[0](arb(0))**5) for p,den in zip(numerators,[8,1])]
    at_end=[1024*p(upper)/(den*K[0](upper)**5) for p,den in zip(numerators,[8,1])]
    assert all(x<0 for x in at_zero)
    assert all(x>0 for x in at_end)
    assert minima[names[0]]>59000000
    assert minima[names[1]]>179000000000000
    return {'status':'passed','domain':'0<=u=t^2<=9/256 (0<=t<=3/16)',
            'degree':degree,'theta_terms':terms,'cells':cells,'precision_bits':ctx.prec,
            'derivative_with_respect_to_u_lower_bounds':{k:str(v) for k,v in minima.items()},
            'normalized_origin':{k:str(v) for k,v in zip(names,at_zero)},
            'normalized_endpoint':{k:str(v) for k,v in zip(names,at_end)},
            'claim':'Each normalized source is strictly increasing here and has exactly one simple zero in (0,3/16).'}


def positive_core(order=16,terms=16):
    jet=ThetaJets(order+8,terms)
    right=Q(4);stop=Q(3,16)
    Cright=C_point(4)
    minima={'S_H':None,'S_Q':None};cells=0;widths={}
    while right>stop:
        step=Q(1,64)
        while not rat(step)*arb.pi()*rat(right).exp()<=arb(1)/8:
            step/=2
        step=min(step,right-stop)
        left=right-step
        center=rat((right+left)/2);half=rat(step/2);delta=ball(half)
        jm=jet(center);jb=jet(center+delta)
        tpoly=arb_poly([center,arb(1)])
        ktrunc=arb_poly([jm[m]/factorial(m) for m in range(order)])
        integ=(tpoly*ktrunc*(arb(1)/4)).integral()
        rem=rat(right)*abs(jb[order]).upper()/(4*factorial(order)*(order+1))
        E=rem*half**(order+1)
        Cmid=Cright+integ(half)+ball(E)
        Cleft=Cright+integ(half)-integ(-half)+ball(2*E)
        assert Cmid>0 and Cleft>0
        Cpoly=arb_poly([Cmid])-integ+arb_poly([arb(0)]*(order+1)+[ball(rem)])
        K=[arb_poly([jm[j+m]/factorial(m) for m in range(order)]+[jb[j+order]/factorial(order)]) for j in range(9)]
        upperk=jet(rat(left),0)[0].upper()
        for name,poly in zip(minima,core_numerators(tpoly,K,Cpoly)):
            value=poly(delta)
            assert value>0,(name,left,right,value)
            lower=(value/upperk**5).lower()
            if minima[name] is None or lower<minima[name]:
                minima[name]=lower
        Cright=Cleft;right=left;cells+=1
        widths[str(step)]=widths.get(str(step),0)+1
    direct=C_point(rat(stop))
    assert direct.overlaps(Cright)
    assert minima['S_H']>arb('0.0653')
    assert minima['S_Q']>65156
    return {'status':'passed','domain':'3/16<=t<=4','cells':cells,'Taylor_order':order,
            'theta_terms':terms,'precision_bits':ctx.prec,'cell_widths':widths,
            'positive_lower_bounds':{k:str(v) for k,v in minima.items()},
            'C_endpoint_propagated':str(Cright),'C_endpoint_direct':str(direct)}


if __name__=='__main__':
    if not __debug__:
        raise SystemExit('Do not use python -O for verification')
    ctx.prec=512
    print(json.dumps({'status':'passed','exact_checks':audit(),
                      'monotonicity':source_monotonicity(),
                      'positive_core':positive_core(),
                      'scope':'Each source changes sign exactly once on t>0 when combined with the separately proved t>=4 tail.'},indent=2,sort_keys=True))
