#!/usr/bin/env python3
"""Exact finite checks for the principal-sector follow-up (stdlib only).

The accompanying note proves the general identities. These finite checks do
not prove the imported quasi-RH theorem, an exponent saving, or RH.
Arithmetic helpers adapt the author's preceding moment-transfer checker.
"""
from fractions import Fraction as F
from pathlib import Path
import hashlib
import json
import math


def arithmetic(N):
    spf = list(range(N + 1))
    for p in range(2, math.isqrt(N) + 1):
        if spf[p] == p:
            for n in range(p*p, N + 1, p):
                if spf[n] == n:
                    spf[n] = p
    fs = [{} for _ in range(N + 1)]
    mu = [0]*(N + 1)
    mu[1] = 1
    pp = [0]*(N + 1)
    for n in range(2, N + 1):
        p = spf[n]
        fs[n] = dict(fs[n//p])
        fs[n][p] = fs[n].get(p, 0) + 1
        mu[n] = 0 if any(e > 1 for e in fs[n].values()) else (-1)**len(fs[n])
        if len(fs[n]) == 1:
            pp[n] = p
    return fs, mu, pp


def conv(a, b):
    N = len(a)-1
    out = [0]*(N+1)
    for d in range(1, N+1):
        if a[d]:
            for n in range(d, N+1, d):
                out[n] += a[d]*b[n//d]
    return out


def add(dst, src, scale=1):
    for p, c in src.items():
        dst[p] = dst.get(p, 0) + scale*c
        if not dst[p]:
            del dst[p]


def coefficients(N, U, V, mu, pp):
    a = conv([0] + [mu[n] if n > U else 0 for n in range(1, N+1)], [0]+[1]*N)
    d = [{} for _ in range(N+1)]
    for b in range(V+1, N+1):
        if pp[b]:
            for r in range(1, N//b+1):
                if a[r]:
                    add(d[r*b], {pp[b]: a[r]})
    return d


def coefficient_tests():
    N = 4096
    fs, mu, pp = arithmetic(N)
    chi = [0 if n % 3 == 0 else (1 if n % 3 == 1 else -1) for n in range(N+1)]
    nu = conv(mu, [mu[n]*chi[n] for n in range(N+1)])
    assert conv(nu, chi) == mu
    rows = []
    for U, V in [(1, 1), (3, 5), (17, 17), (31, 11)]:
        d = coefficients(N, U, V, mu, pp)
        # Recover the tail after the full convolution, retaining ac>U.
        lifted_tail = [0]*(N+1)
        wrong_tail = [0]*(N+1)
        for a in range(1, N+1):
            if nu[a]:
                for c in range(1, N//a+1):
                    if a*c > U:
                        lifted_tail[a*c] += nu[a]*chi[c]
                    if a > U:
                        wrong_tail[a*c] += nu[a]*chi[c]
        assert lifted_tail == [mu[n] if n > U else 0 for n in range(N+1)]
        a_lift = conv(lifted_tail, [0]+[1]*N)
        lifted = [{} for _ in range(N+1)]
        for b in range(V+1, N+1):
            if pp[b]:
                for r in range(1, N//b+1):
                    if a_lift[r]:
                        add(lifted[r*b], {pp[b]: a_lift[r]})
        assert lifted == d
        for n in range(1, N+1):
            tau = math.prod(e+1 for e in fs[n].values())
            tau4 = math.prod(math.comb(e+3, 3) for e in fs[n].values())
            assert tau*tau <= tau4
            for p, c in d[n].items():
                assert abs(c) <= tau*fs[n][p]
        wrong = sum(x != y for x, y in zip(wrong_tail, lifted_tail))
        assert wrong > 0
        rows.append({'U': U, 'V': V, 'coefficients': N,
                     'incorrect_a_only_cutoff_mismatches': wrong})
    # The divisor summatory estimate follows by counting ordered quadruples.
    for N0 in [1, 2, 17, 64, 257]:
        summatory = sum(math.prod(math.comb(e+3, 3) for e in fs[n].values()) for n in range(1, N0+1))
        H = sum((F(1, n) for n in range(1, N0+1)), F(0))
        assert summatory <= N0*H**3
    return rows


def mul(a, b):
    out = {}
    for i, x in a.items():
        for j, y in b.items():
            out[i+j] = out.get(i+j, F(0)) + x*y
    return out


def inverse_unit(a, degree):
    assert a[0] == 1
    out = {0: F(1)}
    for n in range(1, degree+1):
        out[n] = -sum(a.get(k, 0)*out[n-k] for k in range(1, n+1))
    return out


def laurent_tests():
    cases = []
    for j in range(1, 13):
        # zeta(1+z)=z^-1 Z(z), with generic rational regular coefficients.
        Z = {0: F(1), 1: F(j, 7), 2: F(-j-2, 11), 3: F(3, 5)}
        zeta = {n-1: v for n, v in Z.items()}
        dzeta = {n-1: n*v for n, v in zeta.items() if n}
        invzeta = {n+1: v for n, v in inverse_unit(Z, 5).items()}
        logderiv = mul(dzeta, invzeta)
        M = {0: F(j-4, 9), 1: F(j+1, 13), 2: F(2, 3)}
        L = {0: F(j, 3), 1: F(5, 7)}
        first = {n: -v for n, v in mul(zeta, M).items()}
        first[0] = first.get(0, 0)+1
        second = {n: -v for n, v in logderiv.items()}
        for n, v in L.items():
            second[n] = second.get(n, 0)-v
        product = mul(first, second)
        b = 1-M[1]+M[0]*L[0]
        assert product[-2] == -M[0]
        assert product[-1] == b
        assert product[-1] != 1+M[0]*L[0]  # Missing M' is detected.
        cases.append({'m0': str(M[0]), 'm1': str(M[1]), 'ell0': str(L[0]),
                      'double_pole': str(-M[0]), 'simple_pole': str(b)})
    return cases


def band_tests():
    # Exact rational PSD Gram models. Tests the signed decomposition and
    # the bound, without treating these as samples of the arithmetic kernel.
    rows = []
    for size in [5, 9, 17]:
        vectors = [[F(((i+1)*(j+2)) % 11 - 5, 10) for j in range(3)] for i in range(size)]
        G = [[sum(x*y for x, y in zip(a, b)) for b in vectors] for a in vectors]
        assert all(abs(x) <= 1 for row in G for x in row)
        z = [F((-1)**i*(i+1), i+2) for i in range(size)]
        mass = sum(x*x for x in z)
        E = sum(z[i]*z[j]*G[i][j] for i in range(size) for j in range(size))
        A = sum(z[i]*z[i]*G[i][i] for i in range(size))
        assert E >= 0 and A >= 0
        for H in [0, 1, 3, 20]:
            near = 2*sum(z[i]*z[j]*G[i][j] for i in range(size) for j in range(i+1, size) if j-i <= H)
            far = 2*sum(z[i]*z[j]*G[i][j] for i in range(size) for j in range(i+1, size) if j-i > H)
            near_abs = 2*sum(abs(z[i]*z[j]*G[i][j]) for i in range(size) for j in range(i+1, size) if j-i <= H)
            assert E == A+near+far
            assert near_abs <= 2*H*mass
            assert abs(A+near) <= (2*H+1)*mass
            assert far >= -(2*H+1)*mass
            rows.append({'size': size, 'H': H, 'energy': str(E), 'far': str(far)})
    # A principal-density subtraction cancels a main term only when data match.
    X1, X2, Y1, Y2 = map(F, [2, 12, 3, 8])
    assert X1*X2 == Y1*Y2
    c, I1, I2 = F(2, 3), F(5, 7), F(3, 11)
    assert c*c*I1*I2*(X1*X2-Y1*Y2) == 0
    assert c*c*I1*I2*X1*X2-(c+1)*c*I1*I2*Y1*Y2 != 0
    return rows


def main():
    out = {'status': 'PASS', 'coefficient_checks': coefficient_tests(),
           'principal_Laurent_models': laurent_tests(), 'rational_Gram_models': band_tests(),
           'arithmetic': 'exact integers and fractions',
           'scope': 'Finite checks of identities and controls; general bounds proved in the note.',
           'RH_proved': False, 'new_zero_free_region_proved': False,
           'positive_delta_proved': False, 'external_Lean_build_run': False}
    out['source_sha256'] = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
    Path(__file__).with_name('exact_results.json').write_text(json.dumps(out, indent=2)+'\n')
    print(json.dumps({'status': 'PASS', 'formal_coefficients': 4*4096,
                      'Laurent_models': 12, 'Gram_models': 12, 'positive_delta_proved': False}))


if __name__ == '__main__':
    main()
