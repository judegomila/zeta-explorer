# Common library: D=-20 class-group family. python-flint (Arb) ball arithmetic.
from flint import ctx, acb, arb, acb_series, dirichlet_char, dirichlet_group, fmpz
import math
ctx.cap = 64

def find_char(q, vals):
    G = dirichlet_group(q)
    for n in range(1, q):
        if math.gcd(n, q) != 1: continue
        c = dirichlet_char(q, n)
        ok = True
        for m, v in vals.items():
            z = complex(c(m)) if hasattr(c, '__call__') else None
            if abs(z - v) > 1e-9: ok = False; break
        if ok: return c
    raise ValueError

CHI_M4 = find_char(4, {3: -1})
CHI_5 = find_char(5, {2: -1, 4: 1})
CHI_M20 = find_char(20, {3: 1, 7: 1, 9: 1, 11: -1, 13: -1, 17: -1, 19: -1})

def jets(t, n=3):
    """Taylor jets in t (length n) of A(1/2+it), B(1/2+it) as acb_series.
    A = 2 zeta L(chi_-20), B = 2 L(chi_5) L(chi_-4). t: arb."""
    s = acb_series([acb(0.5, t), acb(0, 1)], prec=n)
    z = s.zeta()
    l20 = acb_series.dirichlet_l(s, CHI_M20)
    l5 = acb_series.dirichlet_l(s, CHI_5)
    l4 = acb_series.dirichlet_l(s, CHI_M4)
    return 2 * z * l20, 2 * l5 * l4, (z, l20, l5, l4)

def AB(s):
    s = acb(s)
    return 2 * s.zeta() * CHI_M20.l(s), 2 * CHI_5.l(s) * CHI_M4.l(s)

def theta_series(t, n=3):
    """theta(t) = arg[(sqrt20/2pi)^s Gamma(s)] at s=1/2+it, continuous, as series in t."""
    s = acb_series([acb(0.5, t), acb(0, 1)], prec=n)
    K = 40   # shift into the Stirling region; avoids unstable wide-ball lgamma at small height
    lg = (s + K).lgamma()
    for j in range(K): lg = lg - (s + j).log()
    c = (arb(20).sqrt() / (2 * arb.pi())).log()
    w = lg + s * c
    return w  # theta = imag part coefficientwise

def hardy(t, n=3):
    """Real series (lists of arb) of Z_A(t) = e^{i theta} A, Z_B(t) = e^{i theta} B. Returns (ZA, ZB) coefficient lists,
    plus max imaginary enclosure for sanity."""
    A, B, _ = jets(t, n)
    w = theta_series(t, n)
    # i*theta = i*Im(w): build series with coefficients i*Im(w_k)
    ith = acb_series([acb(0, c.imag) for c in w.coeffs()], prec=n)
    e = ith.exp()
    ZA = (e * A).coeffs(); ZB = (e * B).coeffs()
    assert len(A.coeffs()) == n and len(B.coeffs()) == n and len(ZA) == n and len(ZB) == n and len(w.coeffs()) == n, 'series truncated'
    return [c.real for c in ZA], [c.real for c in ZB], [c.imag for c in ZA + ZB]
