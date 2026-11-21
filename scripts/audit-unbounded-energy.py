"""Audit refinement and finite mean-square identities, not an RH bound.

Uses exact rational spline identities and Arb enclosures of polynomial
integrals. No zero list, infinite prime-pair estimate, or all-support
certificate is used or produced.
"""
import argparse
from fractions import Fraction as F
from hashlib import sha256
import importlib.util
import json
from math import comb
from pathlib import Path
import sys
from flint import arb, acb, acb_series, ctx


DEPENDENCY = Path(__file__).with_name('audit-unbounded-translation.py')
spec = importlib.util.spec_from_file_location('translation_audit', DEPENDENCY)
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)
ball, ev, deriv = base.ball, base.ev, base.deriv


def product(p, q):
    result = [p[0]*q[0]*0 for _ in range(len(p)+len(q)-1)]
    for i, x in enumerate(p):
        for j, y in enumerate(q):
            result[i+j] += x*y
    return result


def shift(p, b):
    """Coefficients of p(x+b). Works in rational or interval arithmetic."""
    return [sum(p[j]*comb(j, k)*b**(j-k) for j in range(k, len(p)))
            for k in range(len(p))]


def add(p, q, scale=1):
    return [(p[i] if i < len(p) else 0)
            + scale*(q[i] if i < len(q) else 0)
            for i in range(max(len(p), len(q)))]


def poly_integral(p, lo, hi):
    anti = [0]+[c/(i+1) for i, c in enumerate(p)]
    return ev(anti, hi)-ev(anti, lo)


def scaled_pieces(order, a, q_count):
    result = []
    for j in range(order):
        p = [c/a**(i+1) for i, c in enumerate(base.spline_piece(order, j))]
        for _ in range(q_count):
            p = base.Q(p)
        result.append(p)
    return result


def local_poly(pieces, a, point, origin):
    """Polynomial in x-origin on the piece containing the rational point."""
    half = F(len(pieces), 16)*a
    if point <= -half or point >= half:
        return [F(0)]*len(pieces[0])
    j = int((point+half)*8/a)
    left = -half+j*a/8
    return shift(pieces[j], origin-left)


def H(a, z):
    if z == 0:
        return z*0+arb(1)/4
    x = ball(a)*z/16
    return (arb(1)/4-z*z)*(x.sinh()/x)**8


def C_value(pieces, x):
    if x <= -1 or x >= 1:
        return arb(0)
    if not (-1 < x < 1):
        raise ArithmeticError('Unresolved support endpoint')
    j = ((x+1)*8).floor().unique_fmpz()
    if j is None:
        raise ArithmeticError('Unresolved spline knot')
    j = int(j)
    return ev(pieces[j], x-(arb(j)/8-1))


def finite_energy(pieces, norm, endpoints):
    """Integrate the full prime sum on 1<=R<=L, with a one-unit collar.

    Each piece is polynomial of degree at most 15. Sweep every translated
    spline knot, integrating its square by an exact polynomial primitive.
    The diagonal is accumulated independently from the individual squares.
    """
    limit = int((arb(max(endpoints)+1).exp()).floor().unique_fmpz())
    arithmetic = [(n, arb(n).log(), arb(p).log()/arb(n).sqrt()/norm)
                  for n, p in base.powers(limit)]
    current = [arb(0)]*16
    diagonal = [arb(0)]*31
    events = []
    for n, ell, coefficient in arithmetic:
        previous = [arb(0)]*16
        previous_square = [arb(0)]*31
        for j in range(17):
            at = ell+arb(j)/8-1
            new = ([coefficient*c for c in shift(pieces[j], -at)]
                   if j < 16 else [arb(0)]*16)
            new_square = product(new, new)
            delta = add(new, previous, -1)
            delta_square = add(new_square, previous_square, -1)
            if at < 1:
                current = add(current, delta)
                diagonal = add(diagonal, delta_square)
            elif at < max(endpoints):
                events.append((at, delta, delta_square, None))
            elif not at > max(endpoints):
                raise ArithmeticError('Unresolved window threshold')
            previous, previous_square = new, new_square
    for L in endpoints:
        events.append((arb(L), [arb(0)]*16, [arb(0)]*31, L))
    events.sort(key=lambda e: e[0])
    lo, energy, diagonal_energy = arb(1), arb(0), arb(0)
    rows, panels = [], []
    for hi, delta, delta_square, endpoint in events:
        if not lo < hi:
            raise ArithmeticError('Unresolved or duplicate translated knot')
        energy += poly_integral(product(current, current), lo, hi)
        diagonal_energy += poly_integral(diagonal, lo, hi)
        if hi <= 2:
            panels.append((lo, hi))
        if endpoint is not None:
            assert energy > 0 and diagonal_energy > 0
            assert energy.rad() < arb('1e-70')
            assert diagonal_energy.rad() < arb('1e-70')
            rows.append({'L': endpoint, 'energy_per_norm_squared': str(energy),
                         'diagonal_per_norm_squared': str(diagonal_energy),
                         'off_diagonal_per_norm_squared': str(energy-diagonal_energy)})
            print(f'Continuous finite energy through L={endpoint} enclosed',
                  file=sys.stderr, flush=True)
        current = add(current, delta)
        diagonal = add(diagonal, delta_square)
        lo = hi
    # Independent evaluation: degree-30 polynomial on each panel, so the
    # 16-point Gauss rule has zero truncation error. Evaluate original local
    # splines, rather than the accumulated global polynomial coefficients.
    nodes = [arb.legendre_p_root(16, j, weight=True) for j in range(16)]
    direct = arb(0)
    for lo, hi in panels:
        mid, half = (lo+hi)/2, (hi-lo)/2
        active = [(ell, c) for n, ell, c in arithmetic if abs(mid-ell) < 1]
        for root, weight in nodes:
            x = mid+half*root
            value = sum(c*C_value(pieces, x-ell) for ell, c in active)
            direct += half*weight*value**2
    residual = direct-arb(rows[0]['energy_per_norm_squared'])
    assert residual.contains(0) and abs(residual) < arb('1e-65')
    return rows, str(residual), len(arithmetic), len(events)


def edge_profile(pieces, epsilon):
    """Exact exp-polynomial integration of the continuum cutoff energy.

    B(y)=exp(y/2) integral_y^1 exp(-v/2) C(v) dv.
    On each local interval B(base+t)=kappa*exp(t/2)-q(t),
    where q'-q/2=C. No numerical quadrature or infinite tail occurs.
    """
    width, total, at_right = arb(1)/8, arb(0), arb(0)
    for j in range(15, -1, -1):
        p = pieces[j]
        q = [arb(0)]*len(p)
        for i in range(len(p)-1, -1, -1):
            q[i] = 2*((i+1)*q[i+1]-p[i]) if i+1 < len(p) else -2*p[i]
        assert all((deriv(q)[i] if i+1 < len(q) else 0)-q[i]/2-p[i]
                   == 0 or abs((deriv(q)[i] if i+1 < len(q) else 0)-q[i]/2-p[i])
                   < arb('1e-80') for i in range(len(p)))
        kappa = (at_right+ev(q, width))*(-width/2).exp()
        left = arb(j)/8-1
        term = kappa**2*base.exp_integral([arb(1)], 1-2*epsilon, width)
        term -= 2*kappa*base.exp_integral(q, arb(1)/2-2*epsilon, width)
        term += base.exp_integral(product(q, q), -2*epsilon, width)
        total += (-2*epsilon*left).exp()*term
        at_right = kappa-q[0]
    assert at_right.contains(0) and abs(at_right) < arb('1e-65')
    assert total > 0 and total.rad() < arb('1e-65')
    return total


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output')
    args = parser.parse_args()
    ctx.prec = 512
    checks = []
    cp = scaled_pieces(16, F(1), 2)
    half_cp = scaled_pieces(16, F(1, 2), 2)
    norm = cp[8][0]

    # Coefficient-by-coefficient identity on every common rational segment.
    mask = [F(comb(16, j), 2**16) for j in range(17)]
    assert sum(mask) == 1
    for i in range(32):
        left, mid = F(i, 16)-1, F(2*i+1, 32)-1
        target = local_poly(cp, F(1), mid, left)
        refined = [F(0)]*16
        for j, weight in enumerate(mask):
            d = F(8-j, 16)
            refined = add(refined, local_poly(half_cp, F(1, 2), mid-d, left-d), weight)
        assert target == refined
    checks.append('exact dyadic refinement on all 32 common polynomial intervals')

    z = acb(arb(1)/10, 1)
    factor = (z/32).cosh()**16
    residual = H(F(1), z)**2-factor*H(F(1, 2), z)**2
    assert residual.contains(0) and abs(residual) < arb('1e-100')
    assert abs(H(F(1), z)) > 0 and abs(factor) > 0
    checks.append('off-axis exponential survives the refinement multiplier')
    # Repeated shifts remain within the original radius, never at R/2.
    for depth in range(1, 13):
        radius = sum(F(1, 2**(j+1)) for j in range(depth))
        assert radius == 1-F(1, 2**depth) < 1
    checks.append('refinement shift radius stays below one at every checked depth')

    bp = base.spline_piece(16, 8)
    b4 = deriv(deriv(deriv(deriv(bp))))[0]
    assert b4 > 0
    spikes = []
    for a in [F(1, 4), F(1, 8), F(1, 16), F(1, 32)]:
        cpa = scaled_pieces(16, a, 2)
        hpa = scaled_pieces(8, a, 1)
        norm_a = sum(base.integral(product(p, p), a/8) for p in hpa)
        assert norm_a == cpa[8][0]
        leading = a**5*norm_a
        assert leading == b4-a*a*deriv(deriv(bp))[0]/2+a**4*bp[0]/16
        assert leading >= b4
        assert arb(3).log()-arb(2).log() > ball(a)
        spikes.append({'a': str(a), 'a5_Ca0_exact': str(leading),
                       'isolated_prime2_height': str(arb(2).log()/arb(2).sqrt()*ball(norm_a))})
    checks.append('isolated prime spike grows at least as a^-5, with exact leading constant')

    c_l2 = sum(base.integral(product(p, p), F(1, 8)) for p in cp)
    k0 = base.spline_piece(32, 16)
    for _ in range(4):
        k0 = base.Q(k0)
    assert k0[0] == c_l2 > 0
    lobes = []
    for j in range(16, 25):
        p = base.spline_piece(32, j)
        for _ in range(4):
            p = base.Q(p)
        lobes.append((F(j-16, 8), p[0]))
    negative = next((t, value) for t, value in lobes if value < 0)
    checks.append('independent exact autocorrelation norm and a negative Gram-kernel lobe')

    cb = [[ball(v) for v in p] for p in cp]
    # Actual prime-pair density has both signs. Its positivity at R=3/2
    # rejects a pointwise nonpositive-cross-term shortcut.
    terms = [(n, p, arb(n).log(), arb(p).log()/arb(n).sqrt()/ball(norm))
             for n, p in base.powers(21)]
    cross_densities = []
    for R, expected_sign in [(arb(1), -1), (arb(3)/2, 1)]:
        values = [c*C_value(cb, R-ell) for n, p, ell, c in terms]
        cross = sum(values)**2-sum(v*v for v in values)
        assert expected_sign*cross > 0
        cross_densities.append({'R': str(R), 'cross_density_per_norm_squared': str(cross)})
    checks.append('actual prime cross density is negative at R=1 and positive at R=3/2')

    # Multiplicative twists share a prime sign across all its powers:
    # even powers survive averaging, and odd powers of the same prime
    # remain correlated. Check all 2^5 relevant assignments at R=3/2.
    even, odd = arb(0), {}
    R = arb(3)/2
    for n, p, ell, c in terms:
        if abs(R-ell) >= 1:
            continue
        exponent, remainder = 0, n
        while remainder % p == 0:
            exponent += 1
            remainder //= p
        assert remainder == 1
        value = c*C_value(cb, R-ell)
        if exponent % 2:
            odd[p] = odd.get(p, arb(0))+value
        else:
            even += value
    values = list(odd.values())
    samples = [even+sum((1 if bits & (1 << j) else -1)*v
                       for j, v in enumerate(values))
               for bits in range(2**len(values))]
    mean = sum(samples)/len(samples)
    mean_square = sum(v*v for v in samples)/len(samples)
    for residual_twist in [mean-even, mean_square-even**2-sum(v*v for v in values)]:
        assert residual_twist.contains(0) and abs(residual_twist) < arb('1e-100')
    assert abs(mean-(even+sum(values))) > arb('0.01')
    checks.append('exhaustive multiplicative prime-sign average retains even powers and odd-power groups')

    # Explicit unconditional upper bound for the expected infinite weighted
    # energy of multiplicative twists; the zeta arguments are >1 throughout.
    epsilon, sigma = arb(1)/4, arb(3)/2
    weighted_c_norm = sum((-(arb(j)/8-1)*2*epsilon).exp()
                         *base.exp_integral(product(p, p), -2*epsilon, arb(1)/8)
                         for j, p in enumerate(cb))
    zs = acb_series([acb(sigma), acb(1)], 3).zeta()
    zeta_prime, zeta_second = zs[1].real, 2*zs[2].real
    expected_bound = weighted_c_norm*((-zeta_prime)**2+zeta_second)
    expected_bound /= (1-(-sigma*arb(2).log()).exp())**2*ball(norm)**2
    assert weighted_c_norm > 0 and zeta_prime < 0 and zeta_second > 0
    assert expected_bound.is_finite() and expected_bound > 0
    checks.append('finite explicit bound for expected infinite twisted energy at epsilon=1/4')

    edge = edge_profile(cb, arb(1)/4)
    # At epsilon=1/4 the edge energy multiplies by exp(2) when L increases by 4.
    edge4, edge8 = edge*arb(2).exp(), edge*arb(4).exp()
    assert edge8/edge4 > 7
    checks.append('positive cutoff-edge constant and exponential growth in the continuum control')

    rows, energy_residual, prime_count, event_count = finite_energy(cb, ball(norm), [2, 4, 6])
    checks.append('continuous prime energy and diagonal enclosed on [1,2], [1,4], [1,6]')
    checks.append('independent exact-degree Gauss integration on [1,2] agrees')
    # Crude unconditional diagonal bound uses Lambda(n)<=log n and the
    # harmonic-sum bound in the note, independent of any prime asymptotic.
    for row in rows:
        L = row['L']
        bound = ball(c_l2/norm**2)*(L+1)**2*(L+2)
        assert arb(row['diagonal_per_norm_squared']) < bound
    checks.append('finite diagonals satisfy the elementary cubic upper bound')

    result = {
        'status': 'Finite identities and obstruction controls pass; global energy bound unproved.',
        'precision_bits': ctx.prec,
        'checks': checks,
        'check_count': len(checks),
        'norm_h_squared_exact': str(norm),
        'norm_C_squared_exact': str(c_l2),
        'negative_full_gram_lobe': {'shift': str(negative[0]), 'value_exact': str(negative[1])},
        'off_axis_refinement_residual': str(residual),
        'isolated_spike_leading_constant_exact': str(b4),
        'isolated_spike_samples': spikes,
        'actual_prime_cross_density_samples': cross_densities,
        'multiplicative_twist_assignment_count': len(samples),
        'expected_infinite_twisted_energy_upper_epsilon_quarter_per_norm_squared': str(expected_bound.upper()),
        'continuum_edge_constant_epsilon_quarter_per_norm_squared': str(edge/ball(norm)**2),
        'continuum_edge_growth_ratio_L8_over_L4': str(edge8/edge4),
        'finite_energy_rows': rows,
        'finite_energy_prime_power_count_including_collar': prime_count,
        'finite_energy_event_count': event_count,
        'independent_energy_residual': energy_residual,
        'global_energy_bound_proved': False,
        'rh_proved': False,
        'script_sha256': sha256(Path(__file__).read_bytes()).hexdigest(),
        'dependency_sha256': sha256(DEPENDENCY.read_bytes()).hexdigest(),
    }
    payload = json.dumps(result, indent=2)+'\n'
    if args.output:
        Path(args.output).write_text(payload)
    print(payload)


if __name__ == '__main__':
    main()
