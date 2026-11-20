# hq2.py: the control HQ2(q, eps) = zeta(s) (1 + eps u^2/(1-u)^4), u = q^(1/2-s). python-flint balls.
from flint import arb, acb, ctx
I = acb(0, 1)


def w_root(eps):
    """w with sinh(w/2) = (eps^(1/4)/2) e^(i pi/4), Re w > 0, Im w > 0. Roots of (1-u)^4 + eps u^2 are
    u = e^(+-w), e^(+-conj w)  [(1-u)^4/u^2 = 16 sinh^4(w/2) = eps e^(i pi) = -eps]."""
    e4 = arb(eps).sqrt().sqrt()
    x = e4 / 2 * (I * arb.pi() / 4).exp()
    return 2 * x.asinh()


def zeros_s(q, eps, k):
    """the four zeros of the factor in the period k: s = 1/2 + (+-w or +-conj w)/log q + 2 pi i k/log q."""
    v = arb(q).log()
    w = w_root(eps)
    base = acb(arb(1) / 2, 2 * arb.pi() * k / v)
    return [base + w / v, base - w / v, base + w.conjugate() / v, base - w.conjugate() / v]


def power_sums(eps, K):
    """S_k = sum of k-th powers of the four roots, k = 0..K: closed form 2 Re(e^(kw) + e^(-kw))."""
    w = w_root(eps)
    return [2 * ((k * w).exp() + (-k * w).exp()).real for k in range(K + 1)]


def power_sums_newton(eps, K):
    """the same by Newton's identities for u^4 - 4u^3 + (6+eps)u^2 - 4u + 1 (cross-check)."""
    e = [arb(1), arb(4), 6 + arb(eps), arb(4), arb(1)]
    p = [arb(4)]
    for k in range(1, K + 1):
        s = arb(0)
        for i in range(1, min(k - 1, 4) + 1):
            s += (-1) ** (i - 1) * e[i] * p[k - i]
        if k <= 4:
            s += (-1) ** (k - 1) * k * e[k]
        p.append(s)
    return p


def mfac(q, eps, s):
    u = (arb(q).log() * (arb(1) / 2 - s)).exp()
    return 1 + arb(eps) * u * u / (1 - u) ** 4


def coeff(q, eps, v):
    """a(q^v) = 1 + eps sum_{2<=j<=v} C(j+1,3) q^(j/2)."""
    s = arb(1)
    for j in range(2, v + 1):
        s += arb(eps) * ((j + 1) * j * (j - 1) // 6) * arb(q).sqrt() ** j
    return s
