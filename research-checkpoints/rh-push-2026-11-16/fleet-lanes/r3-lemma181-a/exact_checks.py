"""Exact / high-precision checks for RESULT.md (mpmath 40 digits, sympy).
A. critical class data and the identities used in the text.
B. saturation profile: symbolic check that it satisfies every instance of Lemma 18.1.
C. dual certificate (Prop U of bypass-78, with numerator exponent K - d): closed-form lower bound of the
   comparison system as a function of a hypothetical uniform numerator saving d.  MODEL for d > 0.
"""
import mpmath as mp
import sympy as sp
mp.mp.dps = 40

def Rk(delta, x, kappa, alpha=mp.mpf(5) / 6):
    c = 1 / (3 * kappa)
    D = 3 - (1 + 2 * c) * x
    P = (2 - 2 * c * x) * (1 - x)
    J = (alpha - delta) * D + delta * P
    return 1 - delta + (alpha - delta) * delta * P / (2 * J)

def certificate(d, x=mp.mpf(1) / 2, guess=(0.125, 0.23, 0.469, 0.8749)):
    """unknowns wK, wH, delta, B. L0, LK, H as affine functions of (lx, ly, l); gradient of
    w0 L0 + wK LK + wH H must vanish, and B equals the constant; kappa = 2B - 1."""
    def eqs(wK, wH, delta, B):
        kappa = 2 * B - 1
        w0 = 1 - wK - wH
        g = delta * x; th = g / (6 * kappa); a = (1 + delta) / 2
        K = (3 * Rk(delta, x, kappa) + 1) / 4 - d
        hk = K + th / 2 - mp.mpf(1) / 6
        # gradients in (lx, ly, l)
        gL0 = (mp.mpf(1) / 12, mp.mpf(1) / 12, -mp.mpf(1) / 6)
        gLK = (gL0[0] + mp.mpf(1) / 2, gL0[1] + mp.mpf(1) / 2, gL0[2] + mp.mpf(1) / 2)
        gH = (-hk, -(mp.mpf(1) / 2 + th), hk + g - mp.mpf(1) / 2)
        cL0 = mp.mpf(5) / 6; cLK = cL0 - mp.mpf(1) / 2; cH = a + hk
        grad = [w0 * gL0[i] + wK * gLK[i] + wH * gH[i] for i in range(3)]
        const = w0 * cL0 + wK * cLK + wH * cH
        return grad[0], grad[1], grad[2], const - B
    sol = mp.findroot(eqs, guess)
    return sol

print("== C. dual certificate: lower bound of the system vs uniform numerator saving d  (x = 1/2 class)")
prev = None
rows = []
for d in ["0", "1e-6", "1e-4", "1e-3", "2e-3", "5e-3", "1e-2", "2e-2", "3e-2", "5e-2"]:
    dd = mp.mpf(d)
    try:
        wK, wH, delta, B = certificate(dd, guess=prev if prev else (0.125, 0.23, 0.469, 0.8749))
        prev = (wK, wH, delta, B)
        rows.append((dd, B))
        print(f"d={d:>5s}  B_cert={mp.nstr(B, 18)}  delta_c={mp.nstr(delta, 10)}  w=({mp.nstr(1-wK-wH, 6)}, {mp.nstr(wK, 6)}, {mp.nstr(wH, 6)})"
              f"  max(B_cert, 13/15)={mp.nstr(max(B, mp.mpf(13)/15), 12)}")
    except Exception as e:
        print("d=", d, "no root:", e)
B0 = rows[0][1]
print("slope dB/dd at 0 (finite difference 1e-6):", mp.nstr((rows[1][1] - B0) / mp.mpf("1e-6"), 10))
print("B_flat check: quartic residual", mp.nstr(133488*B0**4 - 376596*B0**3 + 384534*B0**2 - 167541*B0 + 26231, 5))
# d needed to reach the low floor 13/15
f = lambda d: certificate(d, guess=prev)[3] - mp.mpf(13) / 15
try:
    dstar = mp.findroot(lambda d: certificate(d, guess=(0.125, 0.23, 0.47, 0.867))[3] - mp.mpf(13) / 15, 0.045)
    print("saving d* at which the certificate reaches 13/15:", mp.nstr(dstar, 12))
except Exception as e:
    print("dstar:", e)

print("\n== A. critical class of the source system (d = 0)")
wK, wH, delta, B = certificate(mp.mpf(0))
kappa = 2 * B - 1; x = mp.mpf(1) / 2; q = delta * x; cap = q / (6 * kappa)
R = Rk(delta, x, kappa); K = (3 * R + 1) / 4
mp_ = ((1 - R) / 4 - q / (12 * kappa)) / (delta / 2 - q / (6 * kappa))
ma = ((1 - R) / 4 - q / (12 * kappa)) / (mp.mpf(1) / 2 - q / (6 * kappa))
for k, v in [("B_flat", B), ("kappa", kappa), ("delta_c", delta), ("a_c", (1 + delta) / 2), ("q", q), ("theta cap q/(6k)", cap),
             ("R_c", R), ("K=(3R+1)/4", K), ("K - cap/2 (should be 2/3)", K - cap / 2), ("Hoelder level (1-R)/4", (1 - R) / 4),
             ("class pointwise level delta/4", delta / 4), ("m_p (pointwise/F4 crossing)", mp_), ("m_a (abs counting/F4 crossing)", ma),
             ("sixth-moment threshold (1-R)/2", (1 - R) / 2), ("available delta/2", delta / 2),
             ("gap = (R-(1-delta))/2", (R - (1 - delta)) / 2), ("K - R = (1-R)/4", K - R)]:
    print(f"  {k:36s} {mp.nstr(v, 15)}")
# plain-witness count at m_p:  A_P(m) = 1 - delta{c x + (2 - 2 c x) m}, c = 1/(3 kappa)
c = 1 / (3 * kappa)
print("  A_P(m_p) - R (should be 0):", mp.nstr(1 - delta * (c * x + (2 - 2 * c * x) * mp_) - R, 5))
# detector balance: t* = 1 + delta P/(2J), r* from Xu-Sang
D = 3 - (1 + 2 * c) * x; P = (2 - 2 * c * x) * (1 - x); J = (mp.mpf(5) / 6 - delta) * D + delta * P
tstar = 1 + delta * P / (2 * J); rstar = ((2 - 2 * c * x) * tstar + (c - 1) * x) / D
print("  t*, r*, t*-r* :", mp.nstr(tstar, 10), mp.nstr(rstar, 10), mp.nstr(tstar - rstar, 10), " (t*-r* should equal m_p)")
print("  A_I(r*) - R :", mp.nstr(1 - delta * (x + (1 - x) * rstar) - R, 5))

print("\n== B. saturation profile, symbolic")
Rs, qs, ks, m1, m2, z, ds = sp.symbols("R q kappa m1 m2 z delta", positive=True)
F = lambda m: (1 - Rs) / 4 - qs * (1 - 2 * m) / (12 * ks)
expr = sp.simplify(Rs + 2 * F(m1) + 2 * F(m2) + 2 * qs * z - 1)
print("  R + 2F(m1) + 2F(m2) + 2qz - 1 =", sp.factor(expr), "  (<= 0 iff m1 + m2 + 6 kappa z <= 1)")
print("  with z at capacity (1-m1-m2)/(6 kappa):", sp.simplify(expr.subs(z, (1 - m1 - m2) / (6 * ks))))
# Hoelder/pointwise coincidence at the density-hypothesis count
print("  K - (R + delta/4) at R = 1 - delta:", sp.simplify(((3 * Rs + 1) / 4 - Rs - ds / 4).subs(Rs, 1 - ds)))
# second-moment route never wins: (R+1)/2 - q(1-m)/(6k) - [(3R+1)/4 - q(1-2m)/(12k)]
m = sp.symbols("m")
print("  second-moment minus fourth-moment exponent:", sp.simplify((Rs + 1) / 2 - qs * (1 - m) / (6 * ks) - ((3 * Rs + 1) / 4 - qs * (1 - 2 * m) / (12 * ks))))
# chord: N(theta) on [cap, delta/2] through (cap, K - cap/2) with slope -m_p ends at (delta/2, R)
th = sp.symbols("theta")
mps = ((1 - Rs) / 4 - qs / (12 * ks)) / (ds / 2 - qs / (6 * ks))
caps = qs / (6 * ks)
print("  chord end value N(delta/2) - R:", sp.simplify((3 * Rs + 1) / 4 - caps / 2 - mps * (ds / 2 - caps) - Rs))
# sixth-moment threshold
om = sp.symbols("omega")
print("  (5R+1+omega)/6 < (3R+1)/4  iff omega <", sp.solve(sp.Eq((5 * Rs + 1 + om) / 6, (3 * Rs + 1) / 4), om))
