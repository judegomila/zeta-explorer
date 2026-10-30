#!/usr/bin/env python3
"""Exact identities and NONARITHMETIC obstructions; not a Weil certificate."""
import hashlib
import json
from pathlib import Path
import sympy as s


def txt(x):
    return str(s.simplify(x))


def main():
    alpha, t = s.symbols('alpha t', positive=True, real=True)
    multiplier = 2/alpha - 2*alpha/(alpha**2+t**2)
    assert s.simplify(multiplier-2*t**2/(alpha*(alpha**2+t**2))) == 0

    # K(x,y)=F(x)+F(y)-F(x-y), F even. Four corners of two
    # distributional box derivatives give 2(F(a+b)-F(|a-b|)).
    fa, fb, fplus, fminus = s.symbols('Fa Fb Fplus Fminus', real=True)
    corner_difference = ((fa+fb-fminus) - (fa+fb-fplus)
                         - (fa+fb-fplus) + (fa+fb-fminus))
    assert s.expand(corner_difference-2*(fplus-fminus)) == 0

    x12,y12,x23,y23,x31,y31 = s.symbols('x12 y12 x23 y23 x31 y31', real=True)
    z12, z23, z31 = x12+s.I*y12, x23+s.I*y23, x31+s.I*y31
    H = s.Matrix([[1,z12,s.conjugate(z31)],
                  [s.conjugate(z12),1,z23],
                  [z31,s.conjugate(z23),1]])
    formula = (1-z12*s.conjugate(z12)-z23*s.conjugate(z23)
               -z31*s.conjugate(z31)+2*s.re(z12*z23*z31))
    assert s.expand(H.det()-formula) == 0

    r = s.Rational(2,3)
    H0 = s.Matrix([[1,r,r],[r,1,r],[r,r,1]])
    Hpi = s.Matrix([[1,r,-r],[r,1,r],[-r,r,1]])
    assert H0.det() == s.Rational(7,27)
    assert Hpi.det() == -s.Rational(25,27)
    assert 1-r*r == s.Rational(5,9)

    n=4
    H4=s.Matrix(n,n,lambda i,j: 1 if i==j else -s.Rational(2,5))
    one=s.ones(n,1)
    assert H4*one == -one/5
    assert (one.T*H4*one)[0] == -s.Rational(4,5)
    triples=[]
    for omit in range(4):
        ids=[i for i in range(4) if i!=omit]
        h=H4.extract(ids,ids)
        assert h.eigenvals() == {s.Rational(1,5):1,s.Rational(7,5):2}
        triples.append({'omitted_channel':omit,'eigenvalues':['1/5','7/5','7/5'],
                        'determinant':txt(h.det())})
    D=H4[:3,:3];B=H4[:3,3:4]
    coupling=(B.T*D.inv()*B)[0]
    schur=1-coupling
    assert coupling==s.Rational(12,5)
    assert schur==-s.Rational(7,5)
    assert H4.det()==D.det()*schur

    F=lambda x:s.Integer(x)**4
    KF=lambda x,y:F(x)+F(y)-F(x-y)
    KF2=s.Matrix([[KF(i,j) for j in [1,2]] for i in [1,2]])
    assert KF2==s.Matrix([[2,16],[16,32]])
    assert KF2.det()==-192
    boxF=s.Matrix([[2*(F(a+b)-F(abs(a-b))) for b in [1,2]] for a in [1,2]])
    assert boxF==s.Matrix([[32,160],[160,512]])
    assert boxF.det()==-9216

    out={
        'status':'PASS_EXACT_IDENTITIES_AND_SYNTHETIC_OBSTRUCTIONS',
        'scope':'No actual prime/carrier computation, Weil negative direction, support certificate, or RH conclusion.',
        'archimedean_regularized_multiplier':txt(s.factor(multiplier)),
        'box_corner_identity':txt(s.expand(corner_difference)),
        'general_complex_three_channel_determinant':'symbolic polynomial identity PASS',
        'equal_intensity_phase_test':{'r':'2/3','pair_minor':'5/9','phase_zero_det':txt(H0.det()),'phase_pi_det':txt(Hpi.det())},
        'all_triples_pass':triples,
        'full_four_channel':{'eigenvalues':['-1/5','7/5','7/5','7/5'],
                             'all_ones_energy':txt((one.T*H4*one)[0]),
                             'determinant':txt(H4.det()),'coupling_payment':txt(coupling),'schur_remainder':txt(schur)},
        'nonarithmetic_F_t4':{'kernel_matrix':[[txt(x) for x in row] for row in KF2.tolist()],
                              'kernel_determinant':txt(KF2.det()),
                              'even_box_matrix':[[txt(x) for x in row] for row in boxF.tolist()],
                              'even_box_determinant':txt(boxF.det())},
        'sympy_version':s.__version__,
        'script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
    }
    target=Path(__file__).with_name('EXACT_ALGEBRA_CHECKS.json')
    target.write_text(json.dumps(out,indent=2)+'\n')
    print(json.dumps(out,indent=2))


if __name__=='__main__':
    main()
