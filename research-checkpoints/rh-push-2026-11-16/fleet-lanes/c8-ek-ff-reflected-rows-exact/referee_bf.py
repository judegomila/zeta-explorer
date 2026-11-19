"""Independent check of the definition of B_m and of the 'en' kernel (python, complex floats, no code shared with ffx.c).
Res(c, x) is computed as the determinant of multiplication by x on F_q[T]/(c) (norm form), not by the Euclidean algorithm.
  B_m = sum_{P prime, deg lam} sum_{A' monic, deg N, P A' squarefree} g_3(1, P A') w(A') chi_{P A'}(m),  m monic of degree d
  g_3(1, A) = sum_{x mod A} chi_A(x)^2 e(x/A),  chi_A(x) = chi_0(Res(A, x)),  e(x/A) = exp(2 pi i x_{deg A - 1}/q)
Compared with the kernel: sum_m |B_m|^2 = q^(N+lam) sumnorm, and the diagonal sum_A W(A)^2 q^(N+lam) #{m: (m,A)=1} = q^(N+lam) diagsum."""
import cmath, itertools, subprocess, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
def run(q, N, lam, d, mode, F=None, e3=3):
    g = next(g for g in range(2, q) if len({pow(g, e, q) for e in range(q - 1)}) == q - 1)
    L6 = {}; x = 1
    for e in range(q - 1): L6[x] = e % 6; x = x * g % q
    z6 = cmath.exp(2j * cmath.pi / 6); zq = cmath.exp(2j * cmath.pi / q)
    def monic(k): return [list(c) + [1] for c in itertools.product(range(q), repeat=k)]   # low -> high
    def mulmod(a, b, c):   # a*b mod monic c, lists low->high, length deg c
        n = len(c) - 1; pr = [0] * (2 * n)
        for i, ai in enumerate(a):
            for j, bj in enumerate(b): pr[i + j] = (pr[i + j] + ai * bj) % q
        for i in range(2 * n - 1, n - 1, -1):
            f = pr[i]
            if f:
                for j in range(n + 1): pr[i - n + j] = (pr[i - n + j] - f * c[j]) % q
        return pr[:n]
    def det(M):
        n = len(M); M = [r[:] for r in M]; dt = 1
        for i in range(n):
            p = next((r for r in range(i, n) if M[r][i]), None)
            if p is None: return 0
            if p != i: M[i], M[p] = M[p], M[i]; dt = -dt
            dt = dt * M[i][i] % q; inv = pow(M[i][i], q - 2, q)
            for r in range(i + 1, n):
                f = M[r][i] * inv % q
                if f: M[r] = [(a - f * b) % q for a, b in zip(M[r], M[i])]
        return dt % q
    def red(x, c):   # x (any degree) mod monic c
        n = len(c) - 1; x = x[:] + [0] * max(0, n - len(x))
        for i in range(len(x) - 1, n - 1, -1):
            f = x[i]
            if f:
                for j in range(n + 1): x[i - n + j] = (x[i - n + j] - f * c[j]) % q
        return x[:n]
    def res(c, x):   # norm of x in F_q[T]/(c)
        n = len(c) - 1
        if n == 0: return 1
        xr = red(x, c); cols = []
        for j in range(n):
            b = [0] * n; b[j] = 1; cols.append(mulmod(xr, b, c))
        return det([[cols[j][i] for j in range(n)] for i in range(n)])
    def pmul(a, b):
        r = [0] * (len(a) + len(b) - 1)
        for i, ai in enumerate(a):
            for j, bj in enumerate(b): r[i + j] = (r[i + j] + ai * bj) % q
        return r
    def divides(p, a): return not any(red(a, p)) if len(a) >= len(p) else False
    def irreducible(p):
        n = len(p) - 1
        return n >= 1 and not any(divides(t, p) for e in range(1, n // 2 + 1) for t in monic(e))
    def squarefree(a):
        n = len(a) - 1
        return not any(divides(pmul(t, t), a) for e in range(1, n // 2 + 1) for t in monic(e))
    def g3(A):
        n = len(A) - 1; s = 0
        for xs in itertools.product(range(q), repeat=n):
            R = res(A, list(xs))
            if R: s += z6 ** (2 * L6[R]) * zq ** xs[n - 1]
        return s
    def w(Ap):
        if mode == 'mu':
            n = len(Ap) - 1; cnt = 0; a = Ap
            # number of prime factors of squarefree Ap
            for e in range(1, n + 1):
                for t in monic(e):
                    if irreducible(t) and divides(t, a): cnt += 1
            return (-1) ** cnt
        R = res(F, Ap) if len(Ap) > 1 else 1
        return 0 if R == 0 else (-1) ** (L6[R] * e3 % 2) if e3 == 3 else None
    primes = [p for p in monic(lam) if irreducible(p)] if lam else [[1]]
    ms = monic(d); B = [0j] * len(ms); Wd = {}
    for P in primes:
        for Ap in monic(N):
            A = pmul(P, Ap)
            if not squarefree(A): continue
            wt = w(Ap)
            if not wt: continue
            G = g3(A) * wt; Wd[tuple(A)] = Wd.get(tuple(A), 0) + wt
            for i, m in enumerate(ms):
                R = res(A, m)
                if R: B[i] += G * z6 ** L6[R]
    energy = sum(abs(b) ** 2 for b in B)
    diag = sum(v * v * q ** (N + lam) * sum(1 for m in ms if res(list(A), m)) for A, v in Wd.items())
    return energy, diag
if __name__ == '__main__':
    q = 7; F = [2, 0, 0, 1]
    for (N, lam, d, mode, args) in [(1, 1, 2, 'a', '0 3 2 3 0'), (2, 1, 2, 'a', '0 3 2 3 0'), (1, 2, 2, 'a', '0 3 2 3 0'), (2, 1, 1, 'mu', '4 0 0 0 0'), (1, 2, 1, 'mu', '4 0 0 0 0'), (2, 1, 3, 'a', '0 3 2 3 0')]:
        en, dg = run(q, N, lam, d, mode, F)
        out = subprocess.run([os.path.join(HERE, 'ffx'), 'en', str(q), str(d), str(N), str(lam)] + args.split(), capture_output=True, text=True).stdout
        f = [x.strip() for x in out.split('|')]; sn, ds = int(f[2]), int(f[3])
        print(f'(N,lam,d)=({N},{lam},{d}) weight {mode}: brute force energy {en:.6f}, kernel q^(N+lam)*sumnorm = {q ** (N + lam) * sn}; brute force diagonal {dg}, kernel {q ** (N + lam) * ds}; '
              f'agree: {abs(en - q ** (N + lam) * sn) < 1e-6 * max(1, en) and dg == q ** (N + lam) * ds}')
