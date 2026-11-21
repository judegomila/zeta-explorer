#!/usr/bin/env python3
"""Independent interval replay of the committed degree-four, one-prime payloads.

Run from any directory; requires Node and mpmath==1.3.0. All acceptance decisions
use mpmath.iv, never floating point samples or the payload's verification flags.
The certified object uses exact decimal coefficients from Node's JSON export and
exact lattice locations ks/50. See formalization/paper/rh-direction-audit-2026-09-30.md.
"""
import argparse
from fractions import Fraction
from functools import lru_cache
import json
import hashlib
from pathlib import Path
import subprocess
import time

from mpmath import iv, mp
from mpmath import __version__ as mpmath_version

ROOT = Path(__file__).resolve().parents[1]
PAYLOAD = "src/data/rh-route-i-toeplitz-krein-certificate-payload-2026-09-24.js"
iv.dps = 40
mp.dps = 60  # Only used by self-test and human-readable diagnostics.
Q = iv.mpf(1) / 4
LN2, LNPI = iv.log(2), iv.log(iv.pi)
PRIME2 = iv.sqrt(2) * LN2
# Exact Bernoulli rationals B_2 through B_16.
BERNOULLI = [(1, 6), (-1, 30), (1, 42), (-1, 30),
             (5, 66), (-691, 2730), (7, 6), (-3617, 510)]
B = [iv.mpf(p) / q for p, q in BERNOULLI]


def scalar(x):
    if isinstance(x, Fraction):
        return iv.mpf(x.numerator) / x.denominator
    return iv.mpf(str(x))


def hull(left, right):
    return iv.mpf([scalar(left).a, scalar(right).b])


def abs_upper(x):
    return abs(x).b


def lower_min(x, y):
    return x.a if x.a <= y.a else y.a


def complex_product(ar, ai, br, bi):
    return ar * br - ai * bi, ar * bi + ai * br


def psi_parts(t):
    """Enclose Re psi(1/4+it/2) and Im psi'(1/4+it/2).

    Shift by 12, then use eight Euler--Maclaurin terms. The periodic
    Bernoulli remainder gives |R| <= |B16|/(16 Re(w)^16) and
    |R'| <= |B16|/Re(w)^17. These intentionally conservative bounds
    need no assumed accuracy of a floating point Bernoulli constant.
    """
    v, u = t / 2, Q + 12
    d = u * u + v * v
    ir, ii = u / d, -v / d
    i2r, i2i = complex_product(ir, ii, ir, ii)
    re = iv.log(d) / 2 - ir / 2
    dim = ii + i2i / 2
    pr, pi = i2r, i2i
    for k, bk in enumerate(B, 1):
        re -= bk * pr / (2 * k)
        _, qi = complex_product(pr, pi, ir, ii)
        dim += bk * qi
        pr, pi = complex_product(pr, pi, i2r, i2i)
    for k in range(12):
        uk = Q + k
        den = uk * uk + v * v
        re -= uk / den
        dim -= 2 * uk * v / den ** 2
    er = abs(B[-1]) / (16 * u ** 16)
    ed = abs(B[-1]) / u ** 17
    return (re + iv.mpf([-er.b, er.b]),
            dim + iv.mpf([-ed.b, ed.b]))


def weight(t):
    re, dim = psi_parts(t)
    return (re - LNPI - PRIME2 * iv.cos(t * LN2),
            -dim / 2 + PRIME2 * LN2 * iv.sin(t * LN2))


def load_payload(which):
    name = "KREIN_CERTIFICATE_090" if which == "090" else "KREIN_CERTIFICATE"
    script = f'import {{ {name} as c }} from "./{PAYLOAD}"; console.log(JSON.stringify(c));'
    raw = subprocess.check_output(["node", "--input-type=module", "-e", script], cwd=ROOT, text=True)
    result = json.loads(raw, parse_float=str)
    result['_audit_payload_sha256'] = hashlib.sha256(raw.encode()).hexdigest()
    return result


def validate_payload(c, width):
    if c["symbol"] != "sigma2" or c["kmax"] != 4 or Fraction(c["dx"]) != Fraction(1, 50):
        raise ValueError("Only the committed sigma2, degree-four, ks/50 certificates are supported")
    n = len(c["ks"])
    if not n or any(not isinstance(k, int) or k < 0 for k in c["ks"]):
        raise ValueError("Invalid lattice indices")
    if any(len(c[key]) != n for key in ["xs", "c0", "c1", "c2", "c3", "c4"]):
        raise ValueError("Coefficient/atom length mismatch")
    if not (0 < scalar(width) <= iv.log(3).a):
        raise ValueError("The one-prime symbol is valid only for 0 < width <= log(3)")
    if any(Fraction(k, 50) < width for k in c["ks"]):
        raise ValueError("Certificate atom lies inside the requested autocorrelation support")
    if any(abs(Fraction(x) - Fraction(k, 50)) > Fraction(1, 10**12)
           for x, k in zip(c["xs"], c["ks"])):
        raise ValueError("Stored xs disagree with the declared lattice")
    return [[(Fraction(k, 50), scalar(coef))
             for k, coef in zip(c["ks"], c[f"c{power}"]) if Fraction(coef)]
            for power in range(5)]


def certify_cover(left, right, value, curvature, floor, max_cells):
    """Endpoint linear interpolation minus M2*h^2/8; dyadic exhaustive cover."""
    pending = [(Fraction(left), Fraction(right))]
    checked, leaves = 0, 0
    weakest = None
    while pending:
        a, b = pending.pop()
        checked += 1
        if checked > max_cells:
            raise RuntimeError("Cell budget exhausted: INCONCLUSIVE, not a certificate failure")
        va, vb = value(a), value(b)
        if va.b < floor or vb.b < floor:
            raise RuntimeError(f"Requested lower bound fails at an endpoint in [{a}, {b}]")
        bound = lower_min(va, vb) - curvature(a, b) * scalar(b - a) ** 2 / 8
        if bound.a > floor:
            leaves += 1
            weakest = bound.a if weakest is None else lower_min(weakest, bound)
        else:
            m = (a + b) / 2
            pending.extend([(m, b), (a, m)])
    return {"checked_cells": checked, "accepted_cells": leaves,
            "lower_bound_interval": str(weakest)}


def verify(c, width, max_cells):
    atoms = validate_payload(c, width)
    sums = [sum((abs(v) for _, v in family), iv.mpf(0)) for family in atoms]

    @lru_cache(maxsize=250000)
    def f(t):
        t = scalar(t)
        result = (t*t + Q) ** 2 * weight(t)[0]
        for k, family in enumerate(atoms):
            trig = iv.sin if k % 2 else iv.cos
            result += t ** k * sum((c * trig(scalar(x) * t) for x, c in family), iv.mpf(0))
        return result

    def curvature(a, b):
        t = scalar(b)
        w, dw = weight(hull(a, b))
        q = t*t + Q
        # |w''| < 33: half of sum_{n>=0}(n+1/4)^-3, plus sqrt(2)*log(2)^3.
        result = (12*t*t + 1)*abs_upper(w) + 8*t*q*abs_upper(dw) + 33*q*q
        for k, family in enumerate(atoms):
            for x, c in family:
                x = scalar(x)
                term = x*x*t**k
                if k: term += 2*k*x*t**(k-1)
                if k >= 2: term += k*(k-1)*t**(k-2)
                result += abs(c)*term
        return result.b

    # p4(t) has phase theta=t/50; [0,7] covers a full period 2*pi.
    top = [(int(x * 50), c) for x, c in atoms[4]]
    @lru_cache(maxsize=100000)
    def p4(theta):
        return sum((c * iv.cos(k * scalar(theta)) for k, c in top), iv.mpf(0))
    top_curvature = sum((abs(c) * k*k for k, c in top), iv.mpf(0)).b
    pmin = scalar("-0.85")
    periodic = certify_cover(0, 7, p4, lambda a, b: top_curvature, pmin, max_cells)
    t = scalar(c["T"])
    if t.a <= 0:
        raise ValueError("Tail threshold must be positive")
    # N=1 shifted EM bound. Monotone increasing for t>0; weaker than legacy L.
    lbound = (iv.log(t/2) - 1/t - 4*sum(Q+k for k in range(12))/t**2
              - 1/(3*t**2) - 1/(12*(Q+12)**2) - LNPI)
    wlower = lbound - PRIME2
    bracket = wlower + pmin - sum((sums[k]/t**(4-k) for k in range(4)), iv.mpf(0))
    if wlower.a <= 0 or bracket.a <= 0:
        raise RuntimeError("Tail bound inconclusive; no global positivity claim")
    compact = certify_cover(0, Fraction(c["T"]), f, curvature, iv.mpf(0), max_cells)
    return {"status": "INTERVAL_REPLAY_PASSED", "width": str(width),
            "payload_source": PAYLOAD, "payload_json_sha256": c['_audit_payload_sha256'],
            "interpretation": "exact decimal coefficients; lattice ks/50; smooth compact tests",
            "compact": compact, "periodic_top_family": periodic,
            "tail_bracket_interval": str(bracket),
            "rh_proved": False, "support_extended": False}


def two_prime_diagnostic():
    """Check the first extension's arithmetic and reject reuse of old atoms.

    This is not a candidate search or a positivity certificate at the new width.
    The pointwise symbol correction changes sign; this alone says nothing about
    the sign of the compressed quadratic-form difference.
    """
    width = Fraction(11, 10)
    assert iv.log(3).b < scalar(width).a < iv.log(4).a
    amplitude = 2 * iv.log(3) / iv.sqrt(3)
    rejected = []
    for which in ['090', '096']:
        payload = load_payload(which)
        first_atom = Fraction(min(payload['ks']), 50)
        assert first_atom < width
        try:
            validate_payload(payload, width)
        except ValueError as exc:
            rejected.append({'certificate': which, 'reason': str(exc),
                             'first_atom': str(first_atom),
                             'atom_inside_target_support': True})
        else:
            raise AssertionError('One-prime certificate reused past its scope')
    return {'status': 'ARITHMETIC_AND_SCOPE_CHECK_ONLY', 'target_width': str(width),
            'active_prime_powers': [2, 3],
            'delta_w_at_0': str(-amplitude),
            'delta_w_at_pi_over_log3': str(amplitude),
            'formula': 'w23(t)=w2(t)-2*log(3)/sqrt(3)*cos(t*log(3))',
            'rejected_payloads': rejected,
            'new_certificate_found': False, 'positivity_at_target_proved': False}


def self_test():
    for point in [0, 1, 9, 12, 40, 60, 1000]:
        re, dim = psi_parts(scalar(point))
        z = mp.mpf(1)/4 + mp.j*point/2
        assert scalar(str(mp.re(mp.digamma(z)))) in re
        assert scalar(str(mp.im(mp.polygamma(1, z)))) in dim
    c = load_payload("090")
    validate_payload(c, Fraction(9, 10))
    for width in [Fraction(91, 100), Fraction(11, 10)]:
        try: validate_payload(c, width)
        except ValueError: pass
        else: raise AssertionError("Invalid certificate reuse was accepted")
    zeta3_bound = (64 + scalar('1.25')**-3 + 1/(2*scalar('1.25')**2))/2
    assert (zeta3_bound + iv.sqrt(2)*LN2**3).b < 33
    # An interior negative dip must never pass endpoint-only inspection.
    try:
        certify_cover(0, 1, lambda t: (scalar(t)-scalar("0.5"))**2-scalar("0.01"),
                      lambda a, b: scalar(2), iv.mpf(0), 100)
    except RuntimeError: pass
    else: raise AssertionError("Missed between-endpoint counterexample")
    print("PASS: digamma enclosures, support guards, between-endpoint counterexample")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--certificate", choices=["090", "096"], default="090")
    parser.add_argument("--max-cells", type=int, default=200000)
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--two-prime-diagnostic", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        self_test()
    elif args.two_prime_diagnostic:
        print(json.dumps(two_prime_diagnostic(), indent=2))
    else:
        start = time.monotonic()
        payload = load_payload(args.certificate)
        result = verify(payload, Fraction(payload["twoA"]), args.max_cells)
        result["elapsed_seconds"] = round(time.monotonic() - start, 2)
        result["mpmath_version"] = mpmath_version
        result["checker_sha256"] = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
        print(json.dumps(result, indent=2))
