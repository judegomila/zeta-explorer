"""Exact L-polynomials of the targets nu(A) = chi_quad(Res(F, A)) and their Moebius sums M_n = [v^n] 1/L(v, nu)."""
import itertools, math
def res(a, b, q):
    """Res(a,b) over F_q, a, b lists low->high with nonzero leading coefficients"""
    a = a[:]; b = b[:]; r = 1
    while True:
        da, db = len(a) - 1, len(b) - 1
        if db < 0: return 0
        if da < db:
            a, b = b, a
            if da & db & 1: r = -r % q
            continue
        if db == 0: return r * pow(b[0], da, q) % q
        ib = pow(b[-1], q - 2, q); rem = a[:]
        for i in range(da, db - 1, -1):
            f = rem[i] * ib % q
            for j in range(db + 1): rem[i - db + j] = (rem[i - db + j] - f * b[j]) % q
        rem = rem[:db]
        while rem and rem[-1] == 0: rem.pop()
        if not rem: return 0
        if da & db & 1: r = -r % q
        r = r * pow(b[-1], da - (len(rem) - 1), q) % q
        a, b = b, rem
for q, F, name in ((7, [2, 0, 0, 1], 'a: F = T^3+2'), (7, [1, 1, 0, 1], 'b: F = T^3+T+1'), (13, [2, 0, 0, 1], 'a (q=13): F = T^3+2')):
    leg = lambda x: 0 if x % q == 0 else (1 if pow(x, (q - 1) // 2, q) == 1 else -1)
    a = []
    for n in range(0, 5):
        s = 0
        for lo in itertools.product(range(q), repeat=n):
            s += leg(res(F, list(lo) + [1], q))
        a.append(s)
    disc = a[1] ** 2 - 4 * a[2]
    M = [1]
    for n in range(1, 9): M.append(-sum(a[j] * M[n - j] for j in range(1, min(n, 4) + 1)))
    print(name, '| coefficients of L(u,nu):', a, '| a_2 = q:', a[2] == q, '| a_1^2 - 4q =', disc, '< 0:', disc < 0, '=> both inverse roots have modulus sqrt(q) exactly')
    print('    M_n:', M, ' |M_n| q^(-n/2):', ['%.3f' % (abs(m) / q ** (n / 2)) for n, m in enumerate(M)])
