"""Audit all-plus recovery obstructions and a centered recovery identity.

The deterministic uniform bound is NOT proved. Finite interval checks
verify identities and constants used in the accompanying analytic note.
"""
import argparse
from fractions import Fraction as F
from hashlib import sha256
import importlib.util
import json
from pathlib import Path
from flint import arb, acb, acb_series, ctx


DEPENDENCY = Path(__file__).with_name('audit-unbounded-energy.py')
spec = importlib.util.spec_from_file_location('energy_audit', DEPENDENCY)
energy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(energy)
base = energy.base
ball, ev, deriv = base.ball, base.ev, base.deriv


def exponent_of(n, p):
    m = 0
    while n % p == 0:
        n //= p
        m += 1
    assert n == 1
    return m


def exp_piece_integral(p, rate, left, lo, hi):
    return (rate*left).exp()*(base.exp_integral(p, rate, hi-left)
                            -base.exp_integral(p, rate, lo-left))


def tail_transform(pieces, lower, rate):
    result = arb(0)
    for j, p in enumerate(pieces):
        left = arb(j)/8-1
        right = left+arb(1)/8
        if right <= lower:
            continue
        lo = max(left, lower)
        result += exp_piece_integral(p, rate, left, lo, right)
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output')
    args = parser.parse_args()
    ctx.prec = 512
    checks = []
    cp = energy.scaled_pieces(16, F(1), 2)
    cb = [[ball(x) for x in p] for p in cp]
    norm = ball(cp[8][0])
    integral_c = sum(base.integral(p, F(1, 8)) for p in cp)
    assert integral_c == F(1, 16)
    checks.append('exact square-prime continuum limit: integral C / 2 = 1/32')

    # A quantitative positive lobe of the full prime-pair Gram kernel.
    c2 = sum(base.integral(energy.product(p, p), F(1, 8)) for p in cp)
    cprime2 = sum(base.integral(energy.product(deriv(p), deriv(p)), F(1, 8))
                  for p in cp)
    kernel = base.spline_piece(32, 16)
    for _ in range(4):
        kernel = base.Q(kernel)
    assert kernel[0] == c2 and -2*kernel[2] == cprime2
    delta = F(1, 64)
    assert delta**2*cprime2 < c2
    near_diagonal_margin = ball(1-delta**2*cprime2/c2)
    absolute_pair_coefficient = 2*ball(c2)*arb(-2).exp()*(ball(delta/2).exp()-1)**2
    assert absolute_pair_coefficient > 0
    checks.append('exact derivative norm gives K(t)>=K(0)/2 for |t|<=1/64')
    checks.append('strictly positive constant in the exponential absolute-pair lower bound')

    # Biased independent prime signs: enumerate every relevant assignment.
    R = arb(3)/2
    U, V = arb(0), {}
    for n, p in base.powers(20):
        ell = arb(n).log()
        if abs(R-ell) >= 1:
            continue
        value = arb(p).log()/arb(n).sqrt()*energy.C_value(cb, R-ell)/norm
        if exponent_of(n, p) % 2:
            V[p] = V.get(p, arb(0))+value
        else:
            U += value
    v = list(V.values())
    P = U+sum(v)
    rows = []
    for beta in [F(0), F(1, 10), F(1, 2), F(1)]:
        mean, moment, total_weight = arb(0), arb(0), F(0)
        for bits in range(2**len(v)):
            signs = [1 if bits & (1 << j) else -1 for j in range(len(v))]
            weight = F(1)
            for sign in signs:
                weight *= (1+beta*sign)/2
            value = U+sum(sign*x for sign, x in zip(signs, v))
            mean += ball(weight)*value
            moment += ball(weight)*value**2
            total_weight += weight
        expected_mean = ball(beta)*P+ball(1-beta)*U
        expected_moment = expected_mean**2+ball(1-beta**2)*sum(x*x for x in v)
        assert total_weight == 1
        for residual in [mean-expected_mean, moment-expected_moment]:
            assert residual.contains(0) and abs(residual) < arb('1e-100')
        rows.append({'bias': str(beta), 'mean_per_norm': str(mean),
                     'second_moment_per_norm_squared': str(moment)})
    assert abs(P-U) > arb('0.01')
    checks.append('biased mean and variance identities for all 32 signs at four biases')

    # The global L2 variance series stays finite at every fixed bias.
    sigma = arb(3)/2
    zs = acb_series([acb(sigma), acb(1)], 3).zeta()
    weighted_c2 = sum(exp_piece_integral(energy.product(p, p), -arb(1)/2,
                                        arb(j)/8-1, arb(j)/8-1, arb(j+1)/8-1)
                       for j, p in enumerate(cb))
    variance_upper = weighted_c2*2*zs[2].real/(1-(-sigma*arb(2).log()).exp())**2
    assert variance_upper > 0 and variance_upper.is_finite()
    higher_power_l1_upper = -zs[1].real/(1-1/arb(2).sqrt())
    assert higher_power_l1_upper > 0 and higher_power_l1_upper.is_finite()
    checks.append('finite explicit weighted variance and higher-power absolute-sum bounds')

    # Independent Stieltjes integration checks the centered prime cutoff.
    Y = 100
    primes = [n for n, p in base.powers(Y) if n == p]
    logs = [(p, arb(p).log()) for p in primes]
    y = arb(1)/8
    R = arb(Y).log()+y
    raw = sum(ell/arb(p).sqrt()*energy.C_value(cb, R-ell) for p, ell in logs)
    continuum = arb(Y).sqrt()*(y/2).exp()*tail_transform(cb, y, -arb(1)/2)
    theta_y = sum(ell for p, ell in logs)
    endpoint = (theta_y-Y)/arb(Y).sqrt()*energy.C_value(cb, y)
    breaks = [arb(j)/8 for j in range(1, 9)]
    breaks += [R-ell for p, ell in logs if y < R-ell < 1]
    breaks.sort()
    signed_integral = arb(0)
    for lo, hi in zip(breaks, breaks[1:]):
        assert lo < hi
        mid = (lo+hi)/2
        j = int(((mid+1)*8).floor().unique_fmpz())
        left = arb(j)/8-1
        jp = [c/2+(cb[j][i+1]*(i+1) if i+1 < len(cb[j]) else 0)
              for i, c in enumerate(cb[j])]
        theta = sum(ell for p, ell in logs if ell < R-mid)
        signed_integral += theta*(-R/2).exp()*exp_piece_integral(jp, arb(1)/2, left, lo, hi)
        signed_integral -= (R/2).exp()*exp_piece_integral(jp, -arb(1)/2, left, lo, hi)
    residual = raw-continuum-endpoint-signed_integral
    assert residual.contains(0) and abs(residual) < arb('1e-90')
    assert abs(endpoint) > 1
    assert abs(raw-continuum-signed_integral) > 1
    checks.append('centered prime-cutoff identity independently integrated through every theta jump')
    checks.append('omitting the cutoff endpoint is decisively rejected')

    edge_constant = energy.edge_profile(cb, arb(1)/4)
    assert edge_constant > 0
    checks.append('positive continuum edge constant used in the conditional-mean obstruction')

    # Actual conditional means at the moving edge: diagnostics only.
    edge_rows = []
    profile_zero = tail_transform(cb, arb(0), -arb(1)/2)/norm
    for Y in [100, 1000, 10000]:
        limit = int((arb(Y)*arb(2).exp()).floor().unique_fmpz())
        R = arb(Y).log()
        conditional_mean = arb(0)
        full = arb(0)
        for n, p in base.powers(limit):
            ell = arb(n).log()
            if abs(R-ell) >= 1:
                continue
            value = arb(p).log()/arb(n).sqrt()*energy.C_value(cb, R-ell)
            full += value
            if p <= Y or exponent_of(n, p) % 2 == 0:
                conditional_mean += value
        scaled = conditional_mean/(arb(Y).sqrt()*norm)
        edge_rows.append({'Y': Y, 'conditional_mean_over_sqrtY_norm': str(scaled),
                          'continuum_profile_at_zero_per_norm': str(profile_zero),
                          'centered_conditional_mean_over_sqrtY_norm': str(scaled-profile_zero),
                          'untruncated_prime_sum_per_norm': str(full/norm)})
    checks.append('moving-edge conditional means evaluated with every contributing prime power')

    result = {
        'status': 'Recovery identities and obstruction constants checked; RH and the centered uniform bound unproved.',
        'precision_bits': ctx.prec,
        'checks': checks,
        'check_count': len(checks),
        'C_L2_squared_exact': str(c2),
        'C_derivative_L2_squared_exact': str(cprime2),
        'positive_kernel_radius_exact': str(delta),
        'positive_kernel_margin': str(near_diagonal_margin),
        'absolute_pair_liminf_coefficient_per_norm_squared': str(absolute_pair_coefficient/norm**2),
        'biased_moment_rows': rows,
        'weighted_variance_series_upper_epsilon_quarter_per_norm_squared': str((variance_upper/norm**2).upper()),
        'higher_power_absolute_coefficient_sum_upper': str(higher_power_l1_upper.upper()),
        'centered_cutoff_residual': str(residual),
        'cutoff_endpoint_per_norm': str(endpoint/norm),
        'conditional_edge_constant_epsilon_quarter_per_norm_squared': str(edge_constant/norm**2),
        'moving_edge_diagnostics': edge_rows,
        'centered_uniform_bound_proved': False,
        'rh_proved': False,
        'script_sha256': sha256(Path(__file__).read_bytes()).hexdigest(),
        'dependency_sha256': {
            DEPENDENCY.name: sha256(DEPENDENCY.read_bytes()).hexdigest(),
            energy.DEPENDENCY.name: sha256(energy.DEPENDENCY.read_bytes()).hexdigest(),
        },
    }
    payload = json.dumps(result, indent=2)+'\n'
    if args.output:
        Path(args.output).write_text(payload)
    print(payload)


if __name__ == '__main__':
    main()
