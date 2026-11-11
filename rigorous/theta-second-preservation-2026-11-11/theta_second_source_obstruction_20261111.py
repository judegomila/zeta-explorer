"""Certified failure of the next anchor-free theta source criterion.

Proves two normalized source Wronskians are negative throughout
0<t<=1/16, including rigorously enclosed negative origin limits.
This refutes a sufficient source condition, not actual reduced-kernel
preservation or Pick positivity. Every theta, C, and Taylor error is
included. Dependencies are pinned in the checkpoint requirements.
"""
from fractions import Fraction as Q
from itertools import permutations
from math import factorial
import json

from flint import arb, arb_poly, ctx
from theta_ratio_c_integral_20261110 import C_point
from theta_ratio_origin_certificate_20261110 import (
    coefficients, polynomial_derivative, kappa_remainder, error_ball)

PERMS = [(p, (-1)**sum(p[i] > p[j] for i in range(5) for j in range(i+1, 5)))
         for p in permutations(range(5))]


def det5(columns):
    ans = 0
    for p, sign in PERMS:
        term = sign
        for i in range(5):
            term *= columns[p[i]][i]
        ans += term
    return ans


def origin_columns(u, k, C):
    """Columns are derivatives through order four in u=t^2.

    Return K, KB, KJ, KP, 8KH and KQ. Here K(u)=kappa(sqrt(u));
    H=C/K, B=4C_tt/K, J=4kappa_tt/K, P=16C_tttt/K,
    Q=16kappa_tttt/K. The factor eight in H avoids fractions.
    """
    col0 = k[:5]
    colB = [-(2*j+1)*k[j]-2*u*k[j+1] for j in range(5)]
    colJ = [(8+16*j)*k[j+1]+16*u*k[j+2] for j in range(5)]
    colP = [-(24+64*j+32*j*j)*k[j+1]-(96+64*j)*u*k[j+2]
            -32*u*u*k[j+3] for j in range(5)]
    colH = [8*C] + [-k[j] for j in range(4)]
    colQ = [(192+512*j+256*j*j)*k[j+2]+(768+512*j)*u*k[j+3]
            +256*u*u*k[j+4] for j in range(5)]
    return col0, colB, colJ, colP, colH, colQ


def origin_numerators(u, k, C):
    columns = origin_columns(u,k,C)
    prefix = list(columns[:4])
    return det5(prefix+[columns[4]]), det5(prefix+[columns[5]])


def audit():
    """Exact identities for column derivatives and coordinate conversion."""
    import sympy as s
    u,t=s.symbols('u t')
    K=s.Function('K')(u)
    C=s.Function('C')(u)
    cols=origin_columns(u,[s.diff(K,u,j) for j in range(9)],C)
    targets=[K,-K-2*u*s.diff(K,u),8*s.diff(K,u)+16*u*s.diff(K,u,2),
             -24*s.diff(K,u)-96*u*s.diff(K,u,2)-32*u*u*s.diff(K,u,3),8*C,
             192*s.diff(K,u,2)+768*u*s.diff(K,u,3)+256*u*u*s.diff(K,u,4)]
    subs={s.diff(C,u,j):-s.diff(K,u,j-1)/8 for j in range(1,5)}
    checks=0
    for col,target in zip(cols,targets):
        for j,entry in enumerate(col):
            assert s.expand((s.diff(target,u,j)-entry).subs(subs))==0
            checks+=1
    # The derivative rows are D_t^i q(t^2), i=1,...,4.
    # Their coefficient matrix in D_u^j q, j=1,...,4, is triangular.
    # A formal jet recurrence avoids relying on SymPy's names for the
    # substituted derivative atoms in a composite function.
    row=[s.Integer(0),2*t,s.Integer(0),s.Integer(0),s.Integer(0)]
    rows=[row[1:]]
    for _ in range(3):
        new=[s.diff(value,t) for value in row]
        for j in range(1,5):
            new[j]+=2*t*row[j-1]
        row=new
        rows.append(row[1:])
    assert s.det(s.Matrix(rows))==1024*t**10
    checks+=1
    # K(t^2) differentiation produces the stated J and Q numerators.
    for order,expected in [(2,targets[2]/4),(4,targets[5]/16)]:
        actual=s.diff(K.subs(u,t*t),t,order)
        assert s.simplify(actual-expected.subs(u,t*t))==0
        checks+=1
    return checks


def certify(degree=32, terms=16, cells=128):
    C0=C_point(0)
    upper=arb(1)/256
    coeff,theta_tail=coefficients(degree,terms)
    k_at_zero=[coeff[j]*factorial(j) for j in range(9)]
    num_zero=origin_numerators(arb(0),k_at_zero,C0)
    limits=[1024*num_zero[0]/(8*k_at_zero[0]**5),
            1024*num_zero[1]/k_at_zero[0]**5]
    assert limits[0]<-1000000
    assert limits[1]<-5000000000000
    errors=[kappa_remainder(j,degree,upper) for j in range(9)]
    models=[arb_poly(polynomial_derivative(coeff,j))
            +arb_poly([error_ball(errors[j])]) for j in range(9)]
    integral=[arb(0)]+[coeff[k]/(k+1) for k in range(degree+1)]
    integral_error=40000*4**(degree+1)*upper**(degree+2)/(degree+2)/(1-4*upper)
    Cmodel=arb_poly([C0])-arb_poly(integral)*(arb(1)/8)
    Cmodel+=arb_poly([error_ball(integral_error/8)])
    nums=origin_numerators(arb_poly([arb(0),arb(1)]),models,Cmodel)
    names=['S_H_over_t10','S_Q_over_t10']
    maxima={name:None for name in names}
    minima={name:None for name in names}
    for i in range(cells):
        u=arb(2*i+1)/(512*cells)+error_ball(arb(1)/(512*cells))
        K0=models[0](u)
        assert K0>0
        vals=[1024*nums[0](u)/(8*K0**5),1024*nums[1](u)/K0**5]
        for name,value in zip(names,vals):
            if not value<0:
                raise AssertionError(f'{name} did not enclose a negative value on cell {i}: {value}')
            lo,hi=value.lower(),value.upper()
            if minima[name] is None or lo<minima[name]:
                minima[name]=lo
            if maxima[name] is None or hi>maxima[name]:
                maxima[name]=hi
    # Broad exact rational margins are checked, not inferred from printing.
    assert maxima[names[0]]<-100000
    assert maxima[names[1]]<-1000000000000
    # Explicit rational positive spatial witness t=1/16, with all errors.
    uw=arb(1)/256
    Kw=models[0](uw)
    witness=[1024*nums[0](uw)/(8*Kw**5)*arb(1)/16**10,
             1024*nums[1](uw)/Kw**5*arb(1)/16**10]
    assert witness[0]<0 and witness[1]<0
    return {
        'status':'passed', 'exact_checks':audit(),
        'targets':"S_H=W4(B',J',P',H'); S_Q=W4(B',J',P',Q')",
        'domain':'0<t<=1/16; certified in the even coordinate 0<=u=t^2<=1/256',
        'precision_bits':ctx.prec,'degree':degree,'theta_terms':terms,'cells':cells,
        'C0':str(C0),'theta_disk_tail_bound':str(theta_tail),
        'K_derivative_remainder_bounds':[str(x) for x in errors],
        'C_remainder_bound':str(integral_error/8),
        'origin_limits':{name:str(value) for name,value in zip(names,limits)},
        'whole_interval_lower_bounds':{name:str(minima[name]) for name in names},
        'whole_interval_upper_bounds':{name:str(maxima[name]) for name in names},
        'rational_margins':{'S_H_over_t10':'< -100000','S_Q_over_t10':'< -1000000000000'},
        'witness':{'t':'1/16','S_H':str(witness[0]),'S_Q':str(witness[1])},
        'scope':'Certified failure of these sufficient source hypotheses for actual theta. Does not refute reduced-kernel positivity, the first preservation theorem, fifth-order Pick positivity, or RH.'
    }


if __name__=='__main__':
    if not __debug__:
        raise SystemExit('Do not use python -O for verification')
    ctx.prec=320
    print(json.dumps(certify(),indent=2,sort_keys=True))
