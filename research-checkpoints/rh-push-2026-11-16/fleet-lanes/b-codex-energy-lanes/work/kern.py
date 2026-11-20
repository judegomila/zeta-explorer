"""Independent implementation of the theta kernel kappa, a zero-inserted kernel
kappa_sharp = P(d/du) kappa, and the Davenport-Heilbronn (DH) kernel.

Normalisation (PR 43-46): F(z) = xi(1/2+z) = int kappa(u) e^{zu/2} du,
kappa(u) = sum_{n>=1} (2 t^2 - 3 t) e^{u/4} e^{-t},  t = pi n^2 e^u  (all real u; even).
Nothing here is copied from the PR scripts.
"""
import mpmath as mp


def _polys(p0, shift, jmax):
    """p_{j+1}(t) = t p_j'(t) + (shift - t) p_j(t); coefficient lists low->high."""
    out = [list(p0)]
    for _ in range(jmax):
        p = out[-1]
        q = [mp.mpf(0)] * (len(p) + 1)
        for k, c in enumerate(p):
            q[k] += (k + shift) * c      # t p' + shift p
            q[k + 1] -= c                # - t p
        out.append(q)
    return out


class Kernel:
    """Even kernel given for u>=0 by sum_n w_n e^{su} p(t_n) e^{-t_n}, t_n = lam n^2 e^u."""

    def __init__(self, name, lam, shift, p0, weight, jmax=24):
        self.name, self.lam, self.shift, self.weight = name, lam, mp.mpf(shift), weight
        self.P = _polys([mp.mpf(c) for c in p0], mp.mpf(shift), jmax)

    def d(self, j, u):
        """j-th derivative at u (any real u, via evenness)."""
        u = mp.mpf(u)
        sgn = 1
        if u < 0:
            u, sgn = -u, (-1) ** j
        e = mp.exp(u)
        tot = mp.mpf(0)
        n = 1
        tol = mp.mpf(10) ** (-mp.mp.dps - 5)
        first = None
        while True:
            w = self.weight(n)
            t = self.lam * n * n * e
            if w != 0:
                term = w * mp.polyval(self.P[j][::-1], t) * mp.exp(-t)
                tot += term
                if first is None:
                    first = abs(term)
                elif first == 0 or abs(term) <= tol * max(first, abs(tot)):
                    if n > 6:
                        break
            n += 1
            if n > 400:
                break
        return sgn * mp.exp(self.shift * u) * tot

    def __call__(self, u):
        return self.d(0, u)


def zeta_kernel(jmax=24):
    return Kernel('zeta', mp.pi, mp.mpf(1) / 4, [0, -3, 2], lambda n: 1, jmax)


def dh_kernel(jmax=24):
    kap = (mp.sqrt(10 - 2 * mp.sqrt(5)) - 2) / (mp.sqrt(5) - 1)
    a = {1: mp.mpf(1), 2: kap, 3: -kap, 4: mp.mpf(-1), 0: mp.mpf(0)}
    return Kernel('DH', mp.pi / 5, mp.mpf(3) / 4, [1], lambda n: a[n % 5] * n, jmax)


class Combo:
    """sum_j c_j * base^{(j)}  (i.e. P(d/du) base)."""

    def __init__(self, name, base, coeffs):
        self.name, self.base, self.c = name, base, coeffs

    def d(self, j, u):
        return mp.fsum(c * self.base.d(j + k, u) for k, c in self.c.items())

    def __call__(self, u):
        return self.d(0, u)


def sharp_kernel(rho, jmax=24):
    """kappa_sharp with F_sharp(z) = F(z) (1 - z^2/rho^2)(1 - z^2/conj(rho)^2).
    d/du <-> -z/2, so 1 - z^2/rho^2 <-> 1 - 4 d^2/rho^2."""
    rho = mp.mpc(rho)
    a = 4 / rho ** 2
    c2 = -2 * a.real           # -(a + conj a)
    c4 = abs(a) ** 2
    return Combo('sharp', zeta_kernel(jmax + 4), {0: mp.mpf(1), 2: c2, 4: c4})
