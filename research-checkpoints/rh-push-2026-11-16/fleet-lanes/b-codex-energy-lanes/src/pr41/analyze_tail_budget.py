#!/usr/bin/env python3
"""Audit the loss/recovery budget using the existing finite interval leaves.

Does not extend the cutoff and does not certify the infinite mixed budget.
All reported enclosures use the outward interval engine in verify_reserve.py.
"""
import csv
import hashlib
import json
from pathlib import Path
from verify_reserve import I, D, DN, UP, constants, decaying_sums, arch_interval

ROOT = Path(__file__).resolve().parent


def negative_part(x):
    return I(max(D(0), -x.hi), max(D(0), -x.lo))


def nonnegative(x):
    if x.hi < 0:
        raise AssertionError('proved nonnegative quantity has negative enclosure')
    return I(max(D(0), x.lo), x.hi)


def arch_prime(t, c):
    root = (t/2).exp()
    j1, _ = decaying_sums((-2*t).exp(), 1/root)
    return 2*(root-1/root)+c['c']+j1


def exact_free_flight(n, energy, slope, curvature, c):
    t = I(n).ln()
    if slope.lo >= 0:
        return {'prime_power': n, 'minimum_time': t.strings(),
                'minimum_value': energy.strings(), 'case': 'endpoint'}
    if slope.hi >= 0:
        raise AssertionError('slope sign unresolved')
    s = arch_prime(t, c)-slope
    intercept = energy-arch_interval(t, c)+t*s
    # Increasing curvature guarantees the minimizer lies in this bracket.
    lo = t.lo
    hi = UP.add(t.hi, UP.divide(-slope.lo, curvature.lo))
    iterations = 0
    while hi-lo > D('1e-28'):
        mid = (lo+hi)/2
        derivative = arch_prime(I(mid), c)-s
        if derivative.hi < 0:
            lo = mid
        elif derivative.lo > 0:
            hi = mid
        else:
            break
        iterations += 1
    u = I(lo, hi)
    value = arch_interval(u, c)-u*s+intercept
    quadratic = energy-negative_part(slope)**2/(2*curvature)
    if value.lo < quadratic.lo:
        raise AssertionError('exact minimum comparison unresolved')
    return {'prime_power': n, 'case': 'interior',
            'minimum_time': u.strings(), 'minimum_value': value.strings(),
            'quadratic_reserve': quadratic.strings(),
            'gain_over_quadratic': (value-quadratic).strings(),
            'root_bracket_iterations': iterations}


def run():
    certificate = json.loads((ROOT/'certificate/certificate.json').read_text())
    leaves = ROOT/'certificate/reserve_leaves.csv'
    digest = hashlib.sha256(leaves.read_bytes()).hexdigest()
    # Accept only the input certificate's own stored CSV hash.
    def scalar_values(obj):
        if isinstance(obj, dict):
            for v in obj.values():
                yield from scalar_values(v)
        elif isinstance(obj, list):
            for v in obj:
                yield from scalar_values(v)
        else:
            yield obj
    assert digest in set(map(str, scalar_values(certificate)))
    diagonal, mixed, losses, recovery = I(0), I(0), I(0), I(0)
    previous = initial = None
    selected, checkpoints = [], []
    c = constants()
    thresholds = iter([10, 100, 1000, 10000, 100000, 1000000])
    threshold = next(thresholds)
    last_snapshot = None
    count = 0
    with leaves.open(newline='') as stream:
        for row in csv.DictReader(stream):
            n, p = int(row['prime_power']), int(row['prime'])
            if n > threshold:
                checkpoints.append(last_snapshot)
                threshold = next(thresholds)
            energy = I(row['psi_lo'], row['psi_hi'])
            slope = I(row['slope_lo'], row['slope_hi'])
            a = I(row['curvature_lo'], row['curvature_hi'])
            q = I(p).ln()/I(n).sqrt()
            before = slope+q
            r_before = energy-negative_part(before)**2/(2*a)
            r_after = energy-negative_part(slope)**2/(2*a)
            if initial is None:
                initial = r_before
            else:
                recovery = recovery+nonnegative(r_before-previous)
            loss = nonnegative(r_before-r_after)
            d = q*q/(2*a)
            m = q*negative_part(before)/a
            assert loss.hi >= m.lo
            assert loss.lo <= (m+d).hi
            diagonal, mixed, losses = diagonal+d, mixed+m, losses+loss
            previous = r_after
            count += 1
            if n in (2, 3089, 999983):
                selected.append(exact_free_flight(n, energy, slope, a, c))
            last_snapshot = {
                'last_event': n, 'event_count': count,
                'diagonal_sum': diagonal.strings(),
                'mixed_sum': mixed.strings(),
                'actual_jump_loss': losses.strings(),
                'free_flight_recovery': recovery.strings(),
                'mixed_minus_recovery': (mixed-recovery).strings(),
                'reserve_after_event': r_after.strings()}
    checkpoints.append(last_snapshot)
    assert count == certificate['prime_power_events']
    residual = initial+recovery-losses-previous
    assert residual.lo <= 0 <= residual.hi
    excess = losses-mixed
    assert excess.hi >= 0 and excess.lo <= diagonal.hi
    nmax = I(certificate['integer_cutoff'])
    logn = nmax.ln()
    tail = I(3)/5/nmax.sqrt()*(2*logn*logn+8*logn+16)
    result = {
        'status': 'finite_budget_audit_and_unconditional_diagonal_tail_bound',
        'infinite_mixed_recovery_bound': 'UNPROVED',
        'input_sha256': digest,
        'input_integer_cutoff': certificate['integer_cutoff'],
        'event_count': count,
        'initial_reserve_before_prime_2': initial.strings(),
        'telescoping_residual_enclosure': residual.strings(),
        'diagonal_tail_upper': str(tail.hi),
        'diagonal_tail_formula': '3/(5*sqrt(N))*(2*log(N)^2+8*log(N)+16), N>=4',
        'all_event_diagonal_sum_upper': str((diagonal+I(0, tail.hi)).hi),
        'checkpoints': checkpoints,
        'exact_free_flight_samples': selected,
        'warning': 'Finite observations do not bound the global mixed-minus-recovery budget.'}
    out = ROOT/'tail_budget.json'
    out.write_text(json.dumps(result, indent=2)+'\n')
    print(json.dumps({'output': str(out), 'event_count': count,
                      'diagonal_tail_upper': str(tail.hi),
                      'last_checkpoint': last_snapshot,
                      'free_flight_samples': selected}, indent=2))


if __name__ == '__main__':
    run()
