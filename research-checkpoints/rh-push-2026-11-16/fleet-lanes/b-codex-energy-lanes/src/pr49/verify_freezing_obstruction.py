#!/usr/bin/env python3
"""Exact rational certificates that the finite-R leading model is indefinite.

Uses only the Python standard library. The actual theta-kernel calculations
live separately in numerics.py and are explicitly non-certified diagnostics.
"""
from fractions import Fraction as F
import argparse
import json
import math


def encode(q):
    return {'exact':str(q),'decimal':float(q)}


def finite_three_point():
    # p_i=L+i*d, d=log(r), x_i=exp(L)*r**i.
    L=F(5,4); r=F(11,9)
    indices=[-1,0,1]; c=[F(50),F(-99),F(50)]
    coefficient_L=F(0); coefficient_d=F(0)
    for j,i in enumerate(indices):
        for k,m in enumerate(indices):
            denominator=r**i+r**m
            coefficient_L+=c[j]*c[k]*2/denominator
            coefficient_d+=c[j]*c[k]*(i+m)/denominator
    assert coefficient_L==F(29999,9999)
    assert coefficient_d==F(-1990,99)
    # log(11/9)=2atanh(1/10). Positive series and geometric majorant.
    d_lower=F(1,5)
    d_upper=F(20,99)
    quadratic_upper=coefficient_L*L+coefficient_d*d_lower
    minimum_point_lower=L-d_upper
    assert coefficient_d<0
    assert quadratic_upper==F(-3599,13332)<0
    assert minimum_point_lower==F(415,396)>1
    d=math.log(11/9)
    q=math.exp(-float(L))*(float(coefficient_L*L)+float(coefficient_d)*d)
    return {
        'kernel':'M(p,q)=(p+q)/(exp(p)+exp(q))',
        'center_L':encode(L),
        'offset_d':'log(11/9)',
        'points':'(L-d,L,L+d)',
        'vector':[50,-99,50],
        'exp_L_times_quadratic':{
            'coefficient_of_L':encode(coefficient_L),
            'coefficient_of_d':encode(coefficient_d)},
        'strict_bounds_for_d':{'lower':encode(d_lower),'upper':encode(d_upper)},
        'strict_lower_bound_minimum_point':encode(minimum_point_lower),
        'strict_upper_bound_exp_L_times_quadratic':encode(quadratic_upper),
        'quadratic_decimal_illustration_only':q,
        'status':'PROVED_BY_EXACT_RATIONAL_ARITHMETIC_AND_ATANH_SERIES'
    }


def confluent_certificate(L,N):
    # A_jj=2L; A_jk=2/|j-k| at odd separations, zero at positive even ones.
    q=2*F(L)*N-4*sum((F(N-d,d) for d in range(1,N,2)),F(0))
    direct=F(0)
    for j in range(N):
        for k in range(N):
            delta=abs(j-k)
            a=2*F(L) if not delta else F(2,delta) if delta%2 else F(0)
            direct+=(-1)**(j+k)*a
    assert q==direct<0
    return {'L':L,'N':N,'vector':'v_j=(-1)^j, j=0,...,N-1',
            'quadratic':encode(q),'status':'PROVED_NEGATIVE'}


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output')
    args=parser.parse_args()
    result={'finite_three_point':finite_three_point(),
            'confluent':[confluent_certificate(L,N) for L,N in [(1,3),(2,6),(3,16),(4,42)]],
            'scope':'Only the finite-R leading model M. No statement of indefiniteness for the exact theta flux kernel.'}
    data=json.dumps(result,indent=2)
    print(data)
    if args.output:
        with open(args.output,'w') as f: f.write(data+'\n')


if __name__=='__main__': main()
