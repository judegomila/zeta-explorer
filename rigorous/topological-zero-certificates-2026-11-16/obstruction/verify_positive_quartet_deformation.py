#!/usr/bin/env python3
"""Exact rational audit of a positive theta-kernel quartet deformation.

This is an auxiliary countermodel certificate, not a statement that the
Riemann xi function has an off-line zero. All inequality certificates are
finite rational polynomial identities; no floating-point root finder is used.
"""
from pathlib import Path
import json
import sympy as s

if not __debug__:
    raise RuntimeError("Run this exact checker without -O; its assertions are part of verification.")

v, x, t, T, eta = s.symbols('v x t T eta', real=True)
P0 = 2*v**2 - 3*v
P = [P0]
for _ in range(4):
    P.append(s.expand(v*s.diff(P[-1], v) + (s.Rational(1,4)-v)*P[-1]))

expected2 = 2*v**4-14*v**3+s.Rational(165,8)*v**2-s.Rational(75,16)*v
expected4 = (2*v**6-33*v**5+s.Rational(647,4)*v**4-266*v**3
             +s.Rational(15465,128)*v**2-s.Rational(1875,256)*v)
assert s.expand(P[2]-expected2) == 0
assert s.expand(P[4]-expected4) == 0

R2 = s.cancel((P[2]+8*P0)/v)
R4 = s.cancel((P[4]+256*P0)/v)
shift2 = s.Poly(s.expand(R2.subs(v, 3+x)), x)
assert all(c > 0 for c in shift2.all_coeffs())

bernstein = []
for left in range(3, 8):
    poly = s.Poly(R4.subs(v, left+x), x)
    n = poly.degree()
    cs = [poly.nth(k) for k in range(n+1)]
    bs = [s.factor(sum(cs[k]*s.binomial(i,k)/s.binomial(n,k)
                         for k in range(i+1))) for i in range(n+1)]
    reconstructed = sum(bs[i]*s.binomial(n,i)*x**i*(1-x)**(n-i)
                        for i in range(n+1))
    assert s.expand(reconstructed-poly.as_expr()) == 0
    assert all(b > 0 for b in bs)
    bernstein.append({'interval': [left,left+1],
                      'degree': n,
                      'coefficients': list(map(str,bs)),
                      'minimum': str(min(bs))})

shift4 = s.Poly(s.expand(R4.subs(v, 8+x)), x)
assert all(c > 0 for c in shift4.all_coeffs())

den = (T*T+eta*eta)**2
a = 8*(T*T-eta*eta)/den
b = 16/den
quartet = (((t-T)**2+eta**2)*((t+T)**2+eta**2))/den
fourier_multiplier = 1-a*t*t/4+b*t**4/16
assert s.factor(quartet-fourier_multiplier) == 0
assert s.factor(quartet.subs(t,0)-1) == 0
assert s.factor(quartet.subs(t,-t)-quartet) == 0
for sign1 in (-1,1):
    for sign2 in (-1,1):
        assert s.factor(quartet.subs(t,sign1*T+sign2*s.I*eta)) == 0

# Direct negative odd spectral diagonal, computed algebraically from Q'/Q.
log_prime = s.diff(quartet,t)/quartet
odd_correction = s.factor((-s.diff(log_prime,t)+log_prime/t).subs(t,T))
expected_correction = -2/eta**2+(24*T**2+2*eta**2)/(4*T**2+eta**2)**2
assert s.factor(odd_correction-expected_correction) == 0
upper_difference = s.factor(s.Rational(3,2)/T**2
    -(24*T**2+2*eta**2)/(4*T**2+eta**2)**2)
assert upper_difference == eta**2*(20*T**2+3*eta**2)/(2*T**2*(4*T**2+eta**2)**2)

# For T>=16 and 0<eta<1/2: 0<a<=8/T^2 and 0<b<=16/T^4.
# Thus 8a+256b <=64/T^2+4096/T^4 <=5/16.
assert 64/s.Integer(16)**2+4096/s.Integer(16)**4 == s.Rational(5,16)
assert s.diff(64/T**2+4096/T**4,T) == -128/T**3-16384/T**5

certificate = {
    'status': 'EXACT_RATIONAL_IDENTITIES_VERIFIED',
    'interpretation': 'Auxiliary positive-kernel countermodel; not the Riemann xi function',
    'source_repository': 'judegomila/mathexplorer',
    'source_ref_pr56': '29d8f6f88250d976d4a45f6e0df0b6698bf46a16',
    'sympy_version': s.__version__,
    'P0': str(P0),
    'P2': str(P[2]),
    'P4': str(P[4]),
    'R2_shift_at_3': str(shift2.as_expr()),
    'R4_bernstein': bernstein,
    'R4_shift_at_8': str(shift4.as_expr()),
    'kernel_derivative_bounds': ['kappa_second >= -8*kappa',
                                 'kappa_fourth >= -256*kappa'],
    'parameter_range': 'T >= 16; 0 < eta < 1/2',
    'deformation_coefficients': {'a': str(a), 'b': str(b)},
    'uniform_kernel_lower_factor': '11/16',
    'transform_multiplier': str(s.factor(quartet)),
    'added_zeros': ['T+i*eta','T-i*eta','-T+i*eta','-T-i*eta'],
    'odd_diagonal_correction': str(odd_correction),
    'odd_diagonal_correction_upper_bound': '-2/eta^2+3/(2*T^2)',
    'direct_negative_witness_condition':
        'f(T)!=0 and eta^2 < 2/(max(A(T),0)+3/(2*T^2)+1), where A=-logabs(f)second+logabs(f)first/T',
    'global_rh_claim': False,
    'requires_numerical_root_finder': False
}
output = Path(__file__).with_name('positive_quartet_certificate.json')
output.write_text(json.dumps(certificate, indent=2)+'\n')
print('Verified exact derivative-polynomial identities P2 and P4.')
print('Verified positivity of P2+8P0 on v>=3 by shifted coefficients.')
print('Verified positivity of P4+256P0 on [3,8] by five rational Bernstein certificates.')
print('Verified positivity of P4+256P0 on [8,infinity) by shifted coefficients.')
print('Verified Fourier scaling and all four added zeros exactly.')
print('Verified exact negative odd-spectral-diagonal correction and its upper bound.')
print('Certified kappa_tilde >= (11/16)*kappa > 0 for T>=16 and 0<eta<1/2.')
print('No assertion of an actual Riemann-zeta counterexample is made.')
print(f'Wrote {output.name}.')
