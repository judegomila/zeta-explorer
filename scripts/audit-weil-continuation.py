"""Check arithmetic thresholds and an independently integrated remainder identity.

These diagnostics do not certify all-support positivity. See the companion note.
"""
import argparse
from fractions import Fraction as Q
from hashlib import sha256
import importlib.util
import json
from math import comb
from pathlib import Path
from flint import arb, acb, ctx


MODULE = Path(__file__).with_name('certify-weil-window.py')
spec = importlib.util.spec_from_file_location('weil_window', MODULE)
window = importlib.util.module_from_spec(spec)
spec.loader.exec_module(window)


def ball(q):
    q = Q(q)
    return arb(q.numerator) / q.denominator


def evaluate(poly, x):
    y = arb(0)
    for c in reversed(poly):
        y = y*x + ball(c)
    return y


def exp_integral(poly, alpha, left, right):
    """Integrate a rational polynomial times exp(alpha*x) by exact coefficients."""
    anti = [Q(0)] * len(poly)
    for k in range(len(poly)-1, -1, -1):
        anti[k] = (poly[k] - ((k+1)*anti[k+1] if k+1 < len(poly) else 0)) / alpha
    return evaluate(anti, right)*(ball(alpha)*right).exp() - evaluate(anti, left)*(ball(alpha)*left).exp()


def autocorrelation():
    # h=(-d²+1/4)g, g=(1-(x/a)²)^4 on [-a,a], zero elsewhere.
    # g,g' vanish at the endpoints, so both exponential moments of h vanish.
    a = Q(4, 5)
    g = [Q(0)] * 9
    for k in range(5):
        g[2*k] = Q((-1)**k * comb(4, k), 1) / a**(2*k)
    h = [g[k]/4 - ((k+2)*(k+1)*g[k+2] if k+2 < len(g) else 0) for k in range(len(g))]
    # C(x)=integral_{-a}^{a-x} h(u)h(u+x) du, 0<=x<=2a.
    C = [Q(0)] * 18
    for i, ci in enumerate(h):
        for j, cj in enumerate(h):
            for k in range(j+1):
                degree = i+k+1
                coefficient = ci*cj*comb(j, k)/degree
                offset = j-k
                for r in range(degree+1):
                    C[offset+r] += coefficient*comb(degree, r)*a**(degree-r)*(-1)**r
                C[offset] -= coefficient*(-a)**degree
    norm = C[0]
    assert norm > 0
    return [c/norm for c in C]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output')
    args = parser.parse_args()
    ctx.prec = 192
    counts = []
    for width, expected in [
        ('1.3', [2, 3]), ('1.38629435', [2, 3]),
        ('1.38629437', [2, 3, 4]), ('1.6', [2, 3, 4]),
        ('2', [2, 3, 4, 5, 7]),
        ('3', [2, 3, 4, 5, 7, 8, 9, 11, 13, 16, 17, 19]),
    ]:
        active = window.prime_powers(window.rational(width))
        assert [n for n, p, k in active] == expected
        counts.append({'width': width, 'prime_powers': active})
    assert (4, 2, 2) in window.prime_powers(arb(2))
    assert (9, 3, 2) in window.prime_powers(arb(3))

    C = autocorrelation()
    B = arb(8)/5
    D = [(k+1)*C[k+1]-C[k]/2 if k+1 < len(C) else -C[k]/2 for k in range(len(C))]
    active = window.prime_powers(B)
    direct = -2*sum(arb(p).log()/arb(n).sqrt()*evaluate(C, arb(n).log()) for n, p, k in active)
    compensated, psi, left = arb(0), arb(0), arb(0)
    for n, p, k in active + [(None, None, None)]:
        right = arb(n).log() if n else B
        minus = exp_integral(D, Q(-1, 2), left, right)
        xminus = exp_integral([Q(0)] + D, Q(-1, 2), left, right)
        plus = exp_integral(D, Q(1, 2), left, right)
        compensated += 2*((psi+1)*minus-xminus-plus)
        if n:
            psi += arb(p).log()
        left = right
    pole = 2*(exp_integral(C, Q(1, 2), arb(0), B)+exp_integral(C, Q(-1, 2), arb(0), B))
    discrepancy = compensated-direct-pole
    assert pole.contains(0) and abs(pole) < arb('1e-40')
    assert discrepancy.contains(0) and abs(discrepancy) < arb('1e-40')
    # The test's weighted autocorrelation is not monotone: an unproved sign
    # restriction on F' cannot be inserted into the all-tests criterion.
    dvalues = [(Q(k, 100), evaluate(D, ball(Q(k, 100)))*ball(Q(-k, 200)).exp()) for k in range(1, 160)]
    positive = next((x, v) for x, v in dvalues if v > 0)
    negative = next((x, v) for x, v in dvalues if v < 0)

    floors = []
    for width in ['1.3', '1.6', '2', '3', '4', '5', '6']:
        active = window.prime_powers(arb(width))
        amplitude = 2*sum(arb(p).log()/arb(n).sqrt() for n, p, k in active)
        # Bracket log(T) for the triangle-envelope floor m=1/4.
        lo, hi = arb(0), amplitude+arb(10)
        def surplus(log_t):
            return acb(arb(1)/4, log_t.exp()/2).digamma().real-arb.pi().log()-amplitude-arb(1)/4
        assert surplus(lo) < 0 and surplus(hi) > 0
        for _ in range(64):
            mid = (lo+hi)/2
            value = surplus(mid)
            if value > 0:
                hi = mid
            elif value < 0:
                lo = mid
            else:
                raise ArithmeticError('Unresolved tail-floor bracket')
        floors.append({'width': width, 'active_count': len(active), 'amplitude_enclosure': str(amplitude),
                       'log10_cutoff_lower': str(lo/arb(10).log()), 'log10_cutoff_upper': str(hi/arb(10).log())})

    result = {
        'status': 'passed', 'scope': 'threshold and identity diagnostics; not all-support positivity',
        'threshold_cases': counts,
        'identity_test': {'test': 'normalized autocorrelation of Q[(1-(x/(4/5))²)^4]',
                          'direct_prime_form': str(direct), 'compensated_remainder': str(compensated),
                          'pole_term': str(pole), 'difference': str(discrepancy),
                          'positive_weighted_derivative_at': str(positive[0]),
                          'positive_weighted_derivative': str(positive[1]),
                          'negative_weighted_derivative_at': str(negative[0]),
                          'negative_weighted_derivative': str(negative[1])},
        'tail_floor_cost': floors, 'window_checker_sha256': sha256(MODULE.read_bytes()).hexdigest(),
        'script_sha256': sha256(Path(__file__).read_bytes()).hexdigest(),
    }
    payload = json.dumps(result, indent=2)+'\n'
    if args.output:
        Path(args.output).write_text(payload)
    print(payload)


if __name__ == '__main__':
    main()
