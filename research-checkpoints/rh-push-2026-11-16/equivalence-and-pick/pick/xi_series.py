"""Taylor data of h(u) = L(sqrt u)/sqrt u, L = F'/F, F(x) = xi(1/2+x).

Computed directly from the completed xi definition with Arb power series
(no zeros used).  Used for diagnostics (non-rigorous sign probes: we look
at midpoints) and for the Hankel / Loewner tests in NEXT_STAGE.md.
"""
import flint
from flint import arb, arb_series, ctx


def logF_series_in_t(u0, n, prec=256):
    """Series of log H(u0+t), H(u)=F(sqrt u), length n."""
    ctx.prec = prec
    ctx.cap = max(ctx.cap, n + 2)
    u0 = arb(u0)
    x = arb_series([u0, 1], prec=n).sqrt()          # sqrt(u0+t)
    s = x + arb(0.5)
    one = arb_series([1], prec=n)
    # (s-1)zeta(s) > 0 for all real s>0, s != 1
    logpref = (s * arb(0.5)).log()
    logpi = arb.pi().log()
    lg = (s * arb(0.5)).lgamma()
    lz = ((s - one) * arb_series.zeta(s)).log()
    return logpref - s * (logpi * arb(0.5)) + lg + lz


def h_coeffs(u0, n, prec=256):
    """Return [h^{(m)}(u0)/m!  for m=0..n-1] as arb, h = 2 (log H)'."""
    lH = logF_series_in_t(u0, n + 1, prec)
    d = lH.derivative()
    c = d.coeffs()
    c = list(c) + [arb(0)] * (n + 1 - len(c))
    return [2 * c[m] for m in range(n)]


def L_of_x(x, prec=256):
    """L(x)=F'/F(x) via series of log F at x."""
    ctx.prec = prec
    s = arb_series([arb(x) + arb(0.5), 1], prec=2)
    one = arb_series([1], prec=2)
    lf = (s * arb(0.5)).log() - s * (arb.pi().log() * arb(0.5)) \
        + (s * arb(0.5)).lgamma() + ((s - one) * arb_series.zeta(s)).log()
    return lf.coeffs()[1]


if __name__ == "__main__":
    # sanity: h(1/4) = 2 + gamma_E - log(4 pi)
    c = h_coeffs(0.25, 3)
    print("h(1/4) =", c[0], " expected", 2 + arb.const_euler() - (4 * arb.pi()).log())
    print("L(1/2) =", L_of_x(0.5))
