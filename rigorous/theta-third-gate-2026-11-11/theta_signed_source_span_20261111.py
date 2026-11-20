"""Three-point certificate excluding a positive constant source-basis rotation.

This concerns only the span of the original two signed higher theta sources.
It makes no assertion that a reduced theta source determinant is negative.
"""
import itertools
import json
from flint import arb, acb, ctx
from theta_preservation_origin_20261110 import Theta
from theta_second_origin_20261111 import moment


def det5(columns):
    total = 0
    for permutation in itertools.permutations(range(5)):
        inversions = sum(permutation[i] > permutation[j]
                         for i in range(5) for j in range(i+1, 5))
        term = -1 if inversions % 2 else 1
        for i in range(5):
            term *= columns[permutation[i]][i]
        total += term
    return total


def exact_checks():
    import sympy as s
    rows = [s.Matrix(1, 2, s.symbols('x'+str(i)+' y'+str(i)))
            for i in range(3)]
    determinant = lambda u, v: s.Matrix.vstack(u, v).det()
    weights = [determinant(rows[1], rows[2]),
               -determinant(rows[0], rows[2]),
               determinant(rows[0], rows[1])]
    residual = sum((weight*row for weight, row in zip(weights, rows)),
                   s.zeros(1, 2))
    for value in residual:
        assert s.expand(value) == 0
    t = s.symbols('t')
    k = s.Function('k')(t)
    for j in range(1, 5):
        actual = s.diff(-t*k/4, t, j-1)
        expected = -(t*s.diff(k, t, j-1)
                     + ((j-1)*s.diff(k, t, j-2) if j > 1 else 0))/4
        assert s.expand(actual-expected) == 0
    return {'status': 'passed', 'exact_checks': 6,
            'scope': 'Positive null-vector identity and four C-column jets.'}


def certify():
    ctx.prec = 256
    theta = Theta(8, 16)
    # All theta and spatial tails are included by the fixed PR53 moment helper.
    C0 = moment(theta, 1, A=2)/4
    assert C0 > 0
    rows = []
    records = []
    for numerator, denominator in [(1, 16), (1, 8), (1, 1)]:
        t = arb(numerator)/denominator
        finite = acb.integral(lambda z, analytic: z*theta.finite(z)/4,
                              0, t, rel_tol=arb(2)**-200,
                              abs_tol=arb(2)**-200, deg_limit=120,
                              eval_limit=100000, depth_limit=30)
        assert finite.imag.contains(0)
        # The omitted-mode majorant is decreasing for t>=0, so theta.tail0()
        # bounds it on [0,t]; the integral weight is integral_0^t s/4 ds=t²/8.
        assert arb(3)*(theta.terms+1)**2 > arb(9)/4
        integral_tail = theta.tail0()*t*t/8
        C = C0-finite.real+arb(0, integral_tail)
        assert C > 0
        k = theta.jets(t)
        assert k[0] > 0
        columns = [k[:5],
                   [t*k[j+1]+j*k[j] for j in range(5)],
                   k[2:7],
                   [t*k[j+3]+j*k[j+2] for j in range(5)]]
        Ccolumn = [C]+[-(t*k[j-1]+((j-1)*k[j-2] if j > 1 else 0))/4
                       for j in range(1, 5)]
        SH = 16*det5(columns+[Ccolumn])/k[0]**5
        SQ = 256*det5(columns+[k[4:9]])/k[0]**5
        rows.append((SH, SQ))
        records.append({'t': f'{numerator}/{denominator}', 'S_H': str(SH),
                        'S_Q': str(SQ), 'S_H_over_S_Q': str(SH/SQ),
                        'C': str(C), 'omitted_mode_integral_bound': str(integral_tail)})
    assert rows[0][0] < 0 and rows[0][1] < 0
    assert rows[1][0] > 0 and rows[1][1] < 0
    assert rows[2][0] > 0 and rows[2][1] > 0
    ratio_gap = rows[0][0]/rows[0][1]-rows[2][0]/rows[2][1]
    assert ratio_gap > arb('2.80e-8')
    determinant = lambda u, v: u[0]*v[1]-u[1]*v[0]
    weights = [determinant(rows[1], rows[2]),
               -determinant(rows[0], rows[2]),
               determinant(rows[0], rows[1])]
    assert all(weight > 0 for weight in weights)
    return {'status': 'passed', 'precision_bits': ctx.prec,
            'point_count': 3, 'C0': str(C0), 'points': records,
            'positive_null_vector_weights': [str(weight) for weight in weights],
            'ratio_gap_lower': '2.80e-8', 'ratio_gap_enclosure': str(ratio_gap),
            'fixed_helper_commit': '5d64d45acf37f4957a8f65c036b502e1b49292d0',
            'conclusion': ('Every nonzero constant linear combination of S_H,S_Q '
                           'has both a positive and a negative value among these '
                           'three points. The same is true of rho_H,rho_Q.'),
            'scope': ('Original two-source span only. No negative conclusion '
                      'about the second-reduced source Wronskians, P6, or RH.')}


if __name__ == '__main__':
    if not __debug__:
        raise RuntimeError('Do not run certificates under Python -O')
    result = {'exact': exact_checks(), 'certificate': certify()}
    with open('theta_signed_source_span_replay_20261111.json', 'w') as output:
        json.dump(result, output, indent=2)
    print(json.dumps(result, indent=2))
