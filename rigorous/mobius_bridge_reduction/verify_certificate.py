"""Read-only independent verifier: rational functions + exact interpolation.

Does not import the certificate generator or use floating-point acceptance.
Checks algebraic admissibility only, not the source's analytic inputs.
"""
from fractions import Fraction as Q
from pathlib import Path
import json

def peval(cs,t):
    out=Q(0)
    for c in reversed(cs): out=out*t+Q(c)
    return out

def value(d,x,b,l,k):
    h=(1+b+3*l)/2; v=(1+b-l)/2
    c=1/(3*k)
    denominator=(Q(5,6)-d)*(3-(1+2*c)*x)+d*(2-2*c*x)*(1-x)
    r=1-d+(Q(5,6)-d)*d*(2-2*c*x)*(1-x)/(2*denominator)
    return (-Q(1,4)+b/6+5*l/4+d/2+d*x*(l+c*(h/4-v/2))-3*h*(1-r)/4),denominator

def verify(s):
    p={k:Q(v) for k,v in s['parameters'].items()}
    b,l,k,g,z,gs=[p[n] for n in ['b','ell','kappa','g','zeta','gstar']]
    boundary=Q(11,12)-l/4
    assert boundary==Q(s['boundary'])
    assert Q(s['licensing_boundary'])==(1+k)/2
    A=s['A_coefficients_low_to_high']; B=s['Bpoly_coefficients_low_to_high']; C=s['C_coefficients_low_to_high']
    assert len(A)<=4 and len(B)<=3 and len(C)<=2
    assert all(c>0 for c in A)
    # Independent integer convolution of 4AC-B^2.
    cc=[0]*max(len(A)+len(C)-1,2*len(B)-1)
    for i,a in enumerate(A):
        for j,c in enumerate(C): cc[i+j]+=4*a*c
    for i,b0 in enumerate(B):
        for j,b1 in enumerate(B): cc[i+j]-=b0*b1
    assert cc==s['four_AC_minus_B_squared_coefficients_low_to_high']
    assert all(c>0 for c in cc)
    # Q(delta,y)=2*J*(-E-g) has degree <=(2,3) by the displayed formula.
    # This redundant 5x5 exact grid checks the polynomial identity globally.
    for i in range(5):
        d=Q(5*i,24)
        for j in range(5):
            y=Q(j,8); e,den=value(d,Q(1,2)-y,b,l,k)
            assert den>0
            assert 2*Q(s['multiplier'])*den*(-e-g)==peval(A,y)*d*d+peval(B,y)*d+peval(C,y)
    lx=(1-b-l)/2; ly=(1+b-l)/2; h=ly+2*l
    c0=-Q(1,4)+b/6+5*l/4
    asm=Q(1,2)+l/2*(Q(1,2)+2*l/h)-h/2
    assert b>0 and Q(1,6)<=l<=Q(1,5) and Q(29991,40000)<=k<=Q(3,4)
    assert boundary>Q(87,100) and lx>l and ly-l>11*b/6
    assert 6*k*l>Q(3,4) and l/h<1/(6*k) and l/(h+z)>Q(21,100)
    assert h/2<ly<Q(1,2)
    assert 0<gs<Q(1,1000) and 0<2*z<Q(1,1000) and g-2*z>gs
    assert max(c0,c0+asm/8)<-Q(1,250)
    assert c0+(Q(1,2)+3*l/2)/50<-Q(1,100)
    assert h*(Q(17,50)-Q(1,6))-ly/2+Q(2,100)<-Q(1,20)
    return boundary

def target_obstruction():
    # For admissible h<2ly, E increases with kappa (proof in report).
    # At kappa_min and this (delta,x), E is affine in (b,ell).
    # Admissibility implies 0<b<ell<=1/5.  B<=.8748 implies ell>=314/1875.
    k=Q(29991,40000); rows=[]
    for b in [Q(0),Q(1,5)]:
        for l in [Q(314,1875),Q(1,5)]:
            e,_=value(Q(9387,20000),Q(1,2),b,l,k)
            assert e>Q(3,10000)
            rows.append({'b':str(b),'ell':str(l),'E':str(e)})
    return {'status':'B_LE_0.8748_INFEASIBLE_IN_STATED_ADMISSIBILITY_SYSTEM','positive_lower_bound':'3/10000','delta':'9387/20000','x':'1/2','corners':rows}

if __name__=='__main__':
    root=Path(__file__).parent
    data=json.loads((root/'parameter_certificate.json').read_text())
    old=verify(data['stage0']); new=verify(data['new_stage'])
    assert (Q(1)+Q(data['new_stage']['parameters']['kappa']))/2==old
    assert new==Q(17497733,20000000)
    assert Q(8748867,10000000)-new==Q(1,20000000)
    obstruction=target_obstruction()
    (root/'target_obstruction.json').write_text(json.dumps(obstruction,indent=2)+'\n')
    print('PASS: independent rational-function verification, 2 stages, all scalar gates, full-rectangle positivity, gain 1/20000000.')
    print('PASS: exact obstruction to B <= 0.8748 within the source admissibility system.')
    print('NOT VERIFIED: imported analytic estimates, source closure theorem, literature priority, or a direct twin-ladder global bound.')
