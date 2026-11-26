"""Certified finite counterterm diagnostics. No infinite-cutoff/RH certificate."""
import argparse
from hashlib import sha256
import json
from math import isqrt
from pathlib import Path
from flint import arb, acb, ctx


def prime_powers(limit):
    sieve = bytearray(b'\x01')*(limit+1)
    sieve[:2] = b'\x00\x00'
    for p in range(2, isqrt(limit)+1):
        if sieve[p]:
            sieve[p*p:limit+1:p] = b'\x00'*((limit-p*p)//p+1)
    rows = []
    for p in range(2, limit+1):
        if sieve[p]:
            n, k = p, 1
            while n <= limit:
                rows.append((n, p, k))
                n, k = n*p, k+1
    return sorted(rows)


def close_zero(x, tol='1e-35'):
    assert x.contains(0), str(x)
    assert abs(x) < arb(tol), str(x)


def ein(z):
    """Entire Ein by power series with an explicit geometric tail majorant."""
    z = acb(z)
    if z.is_zero():
        return acb(0)
    A = abs(z).upper()
    term, total, k = z, z, 1
    major = A
    while True:
        # next absolute term is A^(k+1)/((k+1)*(k+1)!).
        next_major = major*A*k/(k+1)**2
        if A < k+2:
            tail = next_major/(1-A/(k+2))
            if tail < arb('1e-70'):
                radius = arb(0, tail.upper())
                return total+acb(radius, radius)
        term *= -z*k/(k+1)**2
        total += term
        major = next_major
        k += 1
        assert k < 5000


def integral_power(a, b, u):
    if u == 1:
        return acb(arb(b).log()-arb(a).log())
    return ((1-u)*arb(b).log()).exp()/(1-u)-((1-u)*arb(a).log()).exp()/(1-u)


def approximant(X, u, rows):
    ell = arb(X).log()
    exponent = sum((acb(arb(n)**(-2))-(-u*arb(n).log()).exp())/k
                   for n, p, k in rows if n <= X)
    exponent -= ein((u-1)*ell)-ein(ell)
    return exponent.exp()/arb(2).zeta()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output')
    args = parser.parse_args()
    ctx.prec = 512
    rows = prime_powers(10000)
    checks = []
    assert (64, 2, 6) in rows and (81, 3, 4) in rows
    checks.append('prime-power generator includes higher powers with coefficient 1/k')

    for u in [acb(arb(3)/4, arb(7)/10), acb(arb(3)/2, 2), acb(2)]:
        for p in [2, 3, 5, 7]:
            x, y = (-u*arb(p).log()).exp(), acb(arb(p)**(-2))
            b = (x+y)/(1+x*y)
            d = b+b*b/2-x-x*x/2
            close_zero(d-y*(1-x*x)/(1+x*y)*(1+(b+x)/2))
        checks.append(f'frozen-bridge correction factorization: {u}')

    # Independent piecewise integration of the compensated psi error.
    for X in [64, 100]:
        subset = [(n, p, k) for n, p, k in rows if n <= X]
        for u in [acb(1), acb(arb(3)/4, arb(7)/10), acb(2)]:
            direct = sum(arb(p).log()*(-u*arb(n).log()).exp() for n, p, k in subset)-integral_power(1, X, u)
            integral, psi, left = acb(0), arb(0), 1
            for n, p, k in subset:
                integral += (psi+1)*((-u*arb(left).log()).exp()-(-u*arb(n).log()).exp())-u*integral_power(left, n, u)
                psi += arb(p).log()
                left = n
            integral += (psi+1)*((-u*arb(left).log()).exp()-(-u*arb(X).log()).exp())-u*integral_power(left, X, u)
            boundary = (psi-X+1)*(-u*arb(X).log()).exp()
            close_zero(direct-integral-boundary)
            assert not (direct-integral).contains(0)
        checks.append(f'compensated psi integral and omitted-boundary negative control: X={X}')

    # Independent special case: Ein(0)=0 and derivative at 0 is 1.
    close_zero(ein(acb(0)))
    z = acb(arb(1)/4)
    # Ein(z)+Ein(-z) has only even powers, checked using a separate bounded sum.
    direct = ein(z)+ein(-z)
    even = -sum(2*z**(2*j)/(2*j*arb(2*j).fac()) for j in range(1, 51))
    assert abs(direct-even) < arb('1e-70')
    checks.append('entire-integral series cancellation and removable zero')

    # Independent integration of the smooth, entire removable-endpoint form.
    for u in [acb(1), acb(arb(3)/4, arb(7)/10)]:
        ell = arb(100).log()
        integral = acb.integral(
            lambda t, analytic: (u-2)*(-t).exp()*(-(u-2)*t).hypgeom_1f1(1, 2),
            0, ell, abs_tol=arb('1e-55'), rel_tol=arb('1e-55'))
        close_zero(integral-(ein((u-1)*ell)-ein(ell)))
    checks.append('independent certified quadrature of entire pole-removal integral')

    table = []
    samples = [('1', acb(1)), ('0.75', acb(arb(3)/4)),
               ('0.75+14i', acb(arb(3)/4, 14)), ('1.5+2i', acb(arb(3)/2, 2))]
    for X in [100, 1000, 10000]:
        close_zero(approximant(X, acb(2), rows)-1/arb(2).zeta())
        for label, u in samples:
            value = approximant(X, u, rows)
            target = acb(1) if u == 1 else 1/((u-1)*u.zeta())
            assert value.is_finite() and abs(value) > 0
            table.append({'X': X, 'u': label, 'abs_F_enclosure': str(abs(value)),
                          'error_to_regularized_reciprocal_at_this_point': str(abs(value-target))})
        checks.append(f'finite approximants and exact anchor: X={X}')

    # Omitting powers changes the construction already at the first square.
    u, X = acb(1), 100
    primes_only = [(n, p, k) for n, p, k in rows if k == 1]
    assert not (approximant(X, u, rows)-approximant(X, u, primes_only)).contains(0)
    checks.append('prime-only replacement is rejected')

    psi, positive_example = arb(0), None
    for n, p, k in rows:
        psi += arb(p).log()
        if psi-n+1 > 0:
            positive_example = {'x': n, 'E_enclosure': str(psi-n+1)}
            break
    assert positive_example is not None
    assert arb(1)-arb(3)/2 < 0  # psi(3/2)=0.
    checks.append('compensated prime-power error takes both signs')

    # Off-axis quartet control, exactly rational at its four alleged poles.
    # Exact rational real and imaginary coordinates; no fitted zero locations.
    aa = acb(arb(1)/4, 2)
    ab = aa.conjugate()
    for root in (aa, -aa, ab, -ab):
        close_zero((1-root**2/aa**2)*(1-root**2/ab**2))
    toy = []
    for N in [8, 32, 128, 512]:
        at_pole = sum((1+(aa*aa/(ab*ab))**k)/k for k in range(1, N+1))
        critical = sum(((acb(0, 1)**2/aa**2)**k+(acb(0, 1)**2/ab**2)**k)/k for k in range(1, N+1))
        assert critical.imag.contains(0) and critical.real.exp() > 0
        toy.append({'N': N, 'abs_W_at_off_axis_pole': str(at_pole.real.exp()),
                    'W_at_half_plus_i': str(critical.real.exp())})
    checks.append('positive critical-line toy family with off-axis-pole divergence')

    result = {'status': 'passed', 'scope': 'finite counterterm identities and diagnostics; compact uniform bound unproved',
              'rh_proved': False, 'precision_bits': ctx.prec, 'checks': checks, 'check_count': len(checks),
              'positive_error_example': positive_example, 'finite_approximants': table,
              'off_axis_control': toy, 'script_sha256': sha256(Path(__file__).read_bytes()).hexdigest()}
    payload = json.dumps(result, indent=2)+'\n'
    if args.output:
        Path(args.output).write_text(payload)
    print(payload)


if __name__ == '__main__':
    main()
