#!/usr/bin/env python3
"""Arb checks of the actual packet, signed energies and Stieltjes centering.

Requires python-flint==0.8.0. Every integral is an exact piecewise polynomial
antiderivative (or exponential-polynomial antiderivative), evaluated in Arb.
No numerical quadrature tolerance is treated as an error certificate.
"""
from functools import lru_cache
from pathlib import Path
from fractions import Fraction as F
import hashlib
import json
import math
from flint import arb, arb_poly, ctx
from packet import ball, kernel, kernel_coefficients, transfer
from audit import arithmetic, coefficients


@lru_cache(None)
def kp(cell):
    return arb_poly([ball(c) for c in kernel_coefficients(cell)])


def shifted(shift, cell):
    if not 0 <= cell < 24:
        return arb_poly()
    center = -arb(1)/2+arb(2*cell+1)/48
    return kp(cell)(arb_poly([-shift-center, 1]))


def cell_at(x):
    if x < -arb(1)/2 or x > arb(1)/2:
        return -1
    c = math.floor((float(x)+.5)*24)
    assert 0 <= c < 24
    assert -arb(1)/2+arb(c)/24 < x < -arb(1)/2+arb(c+1)/24
    return c


def integrate(poly, a, b):
    q = poly.integral()
    return q(b)-q(a)


def exp_integrate(poly, a, b, rate):
    p = poly.coeffs()
    if not p:
        return arb(0)
    q = [arb(0)]*len(p)
    for j in range(len(p)-1, -1, -1):
        q[j] = (p[j]-(j+1)*(q[j+1] if j+1 < len(p) else 0))/rate
    q = arb_poly(q)
    return (rate*b).exp()*q(b)-(rate*a).exp()*q(a)


def checked_events(events):
    events.sort(key=lambda x: float(x))
    assert all(a < b for a, b in zip(events, events[1:]))
    return events


def packet_moments():
    moments = []
    for j in range(5):
        total = arb(0)
        for c in range(24):
            a = -arb(1)/2+arb(c)/24
            b = a+arb(1)/24
            total += exp_integrate(shifted(arb(0), c)*arb_poly([0]*j+[1]), a, b, arb(1)/2)
        if j < 4:
            assert total.contains(0) and abs(total) < arb('1e-85')
        else:
            assert total > 0
        moments.append(str(total))
    norm = sum((integrate(shifted(arb(0), c)**2, -arb(1)/2+arb(c)/24,
                          -arb(1)/2+arb(c+1)/24) for c in range(24)), arb(0))
    assert 0 < norm < 1
    w = arb(23)/64  # beta=55/64 is strictly inside the imported strip.
    mode = sum((exp_integrate(shifted(arb(0), c), -arb(1)/2+arb(c)/24,
                              -arb(1)/2+arb(c+1)/24, w) for c in range(24)), arb(0))
    assert mode > 0 and (mode-transfer(w)).contains(0)
    return {'moments_at_one_half_orders_0_to_4': moments, 'kernel_L2_squared': str(norm),
            'off_axis_control_w': '23/64', 'off_axis_control_K': str(mode),
            'control_energy_exponent': '23/32', 'control_is_synthetic_not_zeta': True}


def rows_for(T):
    cutoff = (arb(T)*12/25).exp()
    U = math.floor(float(cutoff))
    assert U < cutoff < U+1
    endpoint = (arb(T)+arb(3)/2).exp()
    N = math.ceil(float(endpoint))+1
    assert N > endpoint
    fs, mu, pp = arithmetic(N)
    ds = coefficients(N, U, U, mu, pp)
    logs = {p: arb(p).log() for p in set(pp)-{0}}
    vals = [sum((e*logs[p] for p, e in d.items()), arb(0)) for d in ds]
    rows = {}
    for n in range(2, N+1):
        if not ds[n]:
            continue
        shift = arb(n).log()-T
        if shift < -arb(1)/2 or shift > arb(3)/2:
            continue
        assert -arb(1)/2 < shift < arb(3)/2
        rows[n] = (shift, vals[n]/arb(n).sqrt())
    return U, N, mu, pp, vals, rows


def pair_gram(s1, s2):
    events = [arb(0), arb(1)]
    # The diagonal caller passes the identical object. Equality of two balls
    # with nonzero radii is not a proof that their underlying real values agree.
    shifts = [s1] if s1 is s2 else [s1, s2]
    for s in shifts:
        for j in range(25):
            x = s-arb(1)/2+arb(j)/24
            if 0 < x < 1:
                events.append(x)
            else:
                assert x < 0 or x > 1
    checked_events(events)
    out = arb(0)
    for a, b in zip(events, events[1:]):
        mid = (a+b)/2
        out += integrate(shifted(s1, cell_at(mid-s1))*shifted(s2, cell_at(mid-s2)), a, b)
    return out


def direct_energy(rows):
    events = []
    poly = arb_poly()
    for n, (s, z) in rows.items():
        poly += z*shifted(s, cell_at(-s))
        for j in range(25):
            x = s-arb(1)/2+arb(j)/24
            if 0 < x < 1:
                events.append((x, n, j))
            else:
                assert x < 0 or x > 1
    events.sort(key=lambda r: float(r[0]))
    events.append((arb(1), 0, 0))
    assert all(a[0] < b[0] for a, b in zip(events, events[1:]))
    left = arb(0)
    E = arb(0)
    for right, n, j in events:
        E += integrate(poly*poly, left, right)
        if n:
            s, z = rows[n]
            poly += z*(shifted(s, j)-shifted(s, j-1))
        left = right
    assert E > 0 and E.rad() < arb('1e-65')
    return E


def energy_check(T, full_pairs=False):
    U, N, mu, pp, vals, rows = rows_for(T)
    Hball = (arb(T)/2).exp()
    H = math.floor(float(Hball))
    assert H < Hball < H+1
    E = direct_energy(rows)
    A = arb(0)
    near = arb(0)
    nearabs = arb(0)
    far_direct = arb(0)
    for n, (s1, z1) in rows.items():
        A += z1*z1*pair_gram(s1, s1)
        for m, (s2, z2) in rows.items():
            if m <= n or (not full_pairs and m-n > H):
                continue
            v = 2*z1*z2*pair_gram(s1, s2)
            if m-n <= H:
                near += v
                nearabs += abs(v)
            else:
                far_direct += v
    far = E-A-near
    if full_pairs:
        assert (far-far_direct).contains(0) and abs(far-far_direct) < arb('1e-60')
    mass = sum((z*z for s, z in rows.values()), arb(0))
    envelope = arb(2).exp()*(T+arb(3)/2)**2*(T+arb(5)/2)**3
    assert mass < envelope
    assert A > 0 and A < mass
    assert nearabs < 2*H*mass
    # Omitting the near contribution must fail at these actual sample windows.
    assert not near.contains(0)
    expected_sign = {2: -1, 3: 1, 4: -1}.get(T)
    if expected_sign is not None:
        assert expected_sign*far > 0
    if T == 4:
        # Enclosure archived in v9 results.json, theta=12/25, T=4.
        prior = arb('[0.093690267223154871894019318700815653498376425926265872878075561730312454189797069938886860775023871637526061811 +/- 3.13e-112]')
        assert (E-prior).contains(0)
    return {'T': T, 'U': U, 'N': N, 'H': H, 'active_terms': len(rows),
            'energy': str(E), 'diagonal': str(A), 'near_signed': str(near),
            'near_absolute': str(nearabs), 'far_signed': str(far),
            'coefficient_mass': str(mass), 'proved_mass_envelope': str(envelope),
            'all_pairs_independently_summed': full_pairs}


def residual_check(T):
    U, N, mu, pp, vals, rows = rows_for(T)
    L = arb(T)+arb(1)/2
    m0 = sum((arb(mu[d])/d for d in range(1, U+1)), arb(0))
    m1 = -sum((arb(mu[d])*arb(d).log()/d for d in range(1, U+1)), arb(0))
    ell0 = sum((arb(pp[b]).log()/b for b in range(2, U+1) if pp[b]), arb(0))
    B = 1-m1+m0*ell0
    prefix = [arb(0)]
    for v in vals[1:]:
        prefix.append(prefix[-1]+v)
    events = [-arb(1)/2+arb(j)/24 for j in range(25)]
    for n in range(2, N+1):
        x = arb(n).log()-L
        if -arb(1)/2 < x < arb(1)/2:
            events.append(x)
        else:
            assert x < -arb(1)/2 or x > arb(1)/2
    checked_events(events)
    integral = arb(0)
    bad = arb(0)
    for a, b in zip(events, events[1:]):
        mid = (a+b)/2
        x = (L+mid).exp()
        n = math.floor(float(x))
        assert n < x < n+1
        p = shifted(arb(0), cell_at(mid))
        w = p*(arb(1)/2)-p.derivative()
        rconst = prefix[n]+m0+B
        linear = arb_poly([m0*L-m0-B, m0])
        for dest in [0, 1]:
            weight = w if dest == 0 else p*(arb(1)/2)
            val = rconst*(-L/2).exp()*exp_integrate(weight, a, b, -arb(1)/2)
            val += (L/2).exp()*exp_integrate(linear*weight, a, b, arb(1)/2)
            if dest == 0:
                integral += val
            else:
                bad += val
    direct = sum((vals[n]/arb(n).sqrt()*kernel(arb(n).log()-L)
                  for n in range(2, N+1) if vals[n] != 0), arb(0))
    residual = integral-direct
    assert residual.contains(0) and abs(residual) < arb('1e-65')
    assert not (bad-direct).contains(0)
    return {'T': T, 'L': str(L), 'U': U, 'm0': str(m0), 'm1': str(m1), 'B': str(B),
            'direct_packet': str(direct), 'centered_Stieltjes_integral': str(integral),
            'difference': str(residual), 'missing_kernel_derivative_error': str(bad-direct)}


def main():
    ctx.prec = 512
    out = {'status': 'PASS', 'precision_bits': ctx.prec, 'python_flint_version': '0.8.0',
           'packet': packet_moments(), 'energy_samples': [], 'centering_samples': [],
           'positive_delta_proved': False, 'RH_proved': False}
    for T in [2, 3, 4]:
        row = energy_check(T, full_pairs=(T == 2))
        out['energy_samples'].append(row)
        out['centering_samples'].append(residual_check(T))
        print(json.dumps({'T': T, 'energy': row['energy'], 'near': row['near_signed'], 'far': row['far_signed']}), flush=True)
    out['scope'] = 'Actual finite Arb checks; no asymptotic estimate inferred from samples.'
    out['source_hashes'] = {name: hashlib.sha256(Path(__file__).with_name(name).read_bytes()).hexdigest()
                            for name in ['audit.py', 'interval_audit.py', 'packet.py']}
    Path(__file__).with_name('interval_results.json').write_text(json.dumps(out, indent=2)+'\n')
    print(json.dumps({'status': 'PASS', 'precision_bits': ctx.prec, 'positive_delta_proved': False}), flush=True)


if __name__ == '__main__':
    main()
