#!/usr/bin/env python3
"""Interval-arithmetic certificate: the first tracked zeros are on the line.

Run (needs python-flint, i.e. Arb, and node on PATH):
    python scripts/experiments/zero-line-certificate.py

Writes dist/zero-line-certificate.js and dist/experiments/zero-line-certificate.json.

What is proved, with every evaluation an Arb ball that encloses the true value:

  A. For each trap disc D_k = { |s - (1/2 + i t_k)| <= r_k } drawn by the app
     (centres and radii are the exact binary doubles from dist/zero-traps.js),
     zeta has no zero on the boundary and winding number exactly 1 around it.
     zeta has no pole in D_k, so D_k holds exactly one zero, counted with
     multiplicity. In D_k the zeros of zeta and of the completed xi coincide,
     xi(1 - conj s) = conj xi(s), and D_k is mapped to itself by that
     reflection, so the single zero is on Re s = 1/2 and is simple.

  B. Around the rectangle [-1, 2] x [-T, T], zeta has no zero on the boundary
     and winding number W. Its only pole inside is the simple pole at s = 1,
     so the rectangle holds exactly W + 1 zeros. The discs of A and their
     complex conjugates are pairwise disjoint and lie inside the rectangle;
     if W + 1 equals twice their number, they account for every zero.

Winding numbers are obtained without sampling error: each boundary piece P
with start point a is enclosed in a ball B_P, and Re( zeta(B_P) / zeta(a) ) > 0
is checked. The image of P then stays in an open half-plane through zeta(a),
so the continuous change of argument along P is the principal argument of
zeta(b) / zeta(a). Pieces are bisected until the check passes.

Scope: tau = 0 only (zeta and xi). Nothing here bounds zeros above height T.
"""
import hashlib
import json
import subprocess
import sys
import time
from datetime import datetime, timezone
from fractions import Fraction
from pathlib import Path

import flint
from flint import acb, arb, ctx

ROOT = Path(__file__).resolve().parents[2]
PREC = 128
MAX_DEPTH = 40
RECT = {'sigmaMin': -1, 'sigmaMax': 2, 'T': 90}
ctx.prec = PREC


def exact(q):
    """An exact rational or double as a ball (doubles convert exactly)."""
    if isinstance(q, Fraction):
        return arb(q.numerator) / arb(q.denominator)
    return arb(q)


class Unresolved(Exception):
    pass


def winding(point, box, pieces):
    """Rigorous winding number of zeta along a closed path.

    point(x) -> thin ball at parameter x (a Fraction); box(a, b) -> ball
    containing the whole path piece between parameters a and b.
    """
    total = arb(0)
    count = 0
    stack = [(a, b, 0) for a, b in reversed(pieces)]
    values = {}

    def value(x):
        if x not in values:
            v = point(x).zeta()
            if v.contains(0) or not v.is_finite():
                raise Unresolved(f'zeta not separated from 0 at parameter {x}')
            values[x] = v
        return values[x]

    while stack:
        a, b, depth = stack.pop()
        va = value(a)
        image = box(a, b).zeta()
        ok = image.is_finite() and (image / va).real > 0
        if not ok:
            if depth >= MAX_DEPTH:
                raise Unresolved(f'piece [{a}, {b}] not resolved at depth {depth}')
            m = (a + b) / 2
            stack.append((m, b, depth + 1))
            stack.append((a, m, depth + 1))
            continue
        ratio = value(b) / va
        if not ratio.real > 0:
            raise Unresolved('endpoint ratio left the half-plane')
        total += ratio.arg()
        count += 1
    turns = total / (2 * arb.pi())
    n = round(float(turns.mid()))
    # The true value is an integer inside the ball; it must be the only one.
    if not (turns.contains(n) and float(turns.rad()) < 0.25):
        raise Unresolved(f'winding ball {turns} does not isolate an integer')
    return n, count


def disc_winding(t, radius):
    centre = acb(arb(0.5), arb(t))
    r = arb(radius)

    def point(x):
        return centre + r * acb(exact(2 * x)).exp_pi_i()

    def box(a, b):
        mid = point((a + b) / 2)
        # Every point of the arc is within half its length of its midpoint.
        half = float(radius) * 3.1416 * float(b - a) * (1 + 1e-9) + 1e-30
        return acb(mid.real + arb(0, half), mid.imag + arb(0, half))

    return winding(point, box, [(Fraction(i, 16), Fraction(i + 1, 16)) for i in range(16)])


def rectangle_winding(lo, hi, T):
    """Counter-clockwise boundary of [lo, hi] x [-T, T], parameter in [0, 4]."""
    lo, hi, T = Fraction(lo), Fraction(hi), Fraction(T)

    def corner(x):
        side, u = divmod(x, 1)
        if side == 4:
            side, u = 0, Fraction(0)
        if side == 0:
            return lo + (hi - lo) * u, -T
        if side == 1:
            return hi, -T + 2 * T * u
        if side == 2:
            return hi - (hi - lo) * u, T
        return lo, T - 2 * T * u

    def point(x):
        s, t = corner(x)
        return acb(exact(s), exact(t))

    def box(a, b):
        (s0, t0), (s1, t1) = corner(a), corner(b)
        # Pieces never straddle a corner, so this is an axis-parallel segment.
        return acb(exact(s0).union(exact(s1)), exact(t0).union(exact(t1)))

    pieces = []
    for side in range(4):
        n = 8 if side % 2 == 0 else 64
        pieces += [(side + Fraction(i, n), side + Fraction(i + 1, n)) for i in range(n)]
    return winding(point, box, pieces)


def main():
    start = time.perf_counter()
    dump = ("import('./dist/math.js').then(async m=>{const z=await import('./dist/zero-traps.js');"
            "console.log(JSON.stringify(z.trapDiscs(m.ZERO_HEIGHTS)))})")
    discs = json.loads(subprocess.run(['node', '-e', dump], cwd=ROOT, check=True,
                                      capture_output=True, text=True).stdout)
    T = RECT['T']
    records = []
    for i, disc in enumerate(discs):
        t, r = disc['t'], disc['radius']
        assert 0 < t - r and t + r < T and r < 0.5 - RECT['sigmaMin'], 'disc must lie inside the rectangle'
        if i:
            previous = discs[i - 1]
            assert previous['t'] + previous['radius'] < t - r, 'discs must be disjoint'
        n, pieces = disc_winding(t, r)
        if n != 1:
            raise Unresolved(f'disc {i} has winding {n}')
        records.append({'t': t, 'radius': r, 'winding': n, 'pieces': pieces})
        print(f'disc {i + 1:2d}  t = {t:.12f}  r = {r:.6f}  winding {n}  ({pieces} pieces)', flush=True)
    W, pieces = rectangle_winding(RECT['sigmaMin'], RECT['sigmaMax'], T)
    zeros = W + 1
    print(f'rectangle winding {W}  zeros inside {zeros}  ({pieces} pieces)', flush=True)
    complete = zeros == 2 * len(records)
    source = Path(__file__).read_bytes()
    certificate = {
        'schema': 'zeta-observatory/zero-line-certificate/1',
        'certificateId': f'zeta-first-{len(records)}-discs-arb-v1',
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'method': 'Arb ball arithmetic; half-plane argument principle on bisected boundary pieces',
        'precisionBits': PREC,
        'pythonFlint': flint.__version__,
        'tau': 0,
        'discs': records,
        'rectangle': {**RECT, 'winding': W, 'zerosInside': zeros, 'pieces': pieces},
        'complete': complete,
        'completeHeight': T if complete else None,
        'statement': (f'Each listed disc contains exactly one zero of zeta, on the critical line and simple. '
                      + (f'These {len(records)} zeros and their conjugates are all the zeros of zeta in '
                         f'[-1, 2] x [-{T}, {T}], so every zero with 0 < Im s < {T} is on the critical line and simple.'
                         if complete else 'The rectangle count does not match the discs; completeness is not claimed.')),
        'scope': f'tau = 0 only. Finite height: nothing is claimed above Im s = {T}. Not a proof of the Riemann hypothesis.',
        'generatorSha256': hashlib.sha256(source).hexdigest(),
        'seconds': round(time.perf_counter() - start, 2),
    }
    text = json.dumps(certificate, indent=1)
    (ROOT / 'dist/experiments/zero-line-certificate.json').write_text(text + '\n')
    (ROOT / 'dist/zero-line-certificate.js').write_text(
        '// Generated by scripts/experiments/zero-line-certificate.py. Do not edit.\n'
        'export const LINE_CERTIFICATE = Object.freeze(' + text + ');\n')
    print(certificate['statement'])
    return 0 if complete else 1


if __name__ == '__main__':
    sys.exit(main())
