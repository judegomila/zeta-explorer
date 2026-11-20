# Lane 5, Lemma 1: decay exponent of the integrand of E_J on the side v -> +infinity (measured from three heights).
import sys, json, math
from flint import arb, acb, ctx
ctx.prec = 400
PI = acb.pi()
I = acb(0, 1)


def Xf(u):
    u = acb(u)
    return acb(2) ** u * PI ** (u - 1) * (PI * u / 2).sin() * (1 - u).gamma()


def Q2j(b, j):
    v = acb(1)
    for l in range(j):
        v *= (arb(2 * l + 1) / 2) ** 2 - b * b
    return v


def integrand(v, b, J, c, x):
    w = acb(c) + I * v
    half = acb(1) / 2
    lg2 = (2 * PI / x).log() + PI * I / 2
    H = (2 * PI) ** (2 * w) * (-w).gamma() / (Xf(half + w - b) * Xf(half + w + b))
    sub = acb(0)
    for j in range(J + 1):
        sub += (-1) ** j * Q2j(b, j) / math.factorial(j) * (w - j).gamma()
    return (H - sub) * (half + w - b).zeta() * (half + w + b).zeta() * (-w * lg2).exp()


out = {}
for (J, c) in ((1, -0.75), (3, -0.75), (6, -0.75), (6, -0.6), (6, -0.9)):
    b = acb(0, 1.9)
    x = arb(3) / 8
    # average of |integrand| over a short window to smooth the zeta factors
    vals = []
    for V in (200.0, 800.0, 3200.0):
        m = sum(float(abs(integrand(acb(V * (1 + 0.01 * k)), b, J, c, x)).mid()) for k in range(-10, 11)) / 21
        vals.append(m)
    e1 = math.log(vals[1] / vals[0]) / math.log(4)
    e2 = math.log(vals[2] / vals[1]) / math.log(4)
    out['J=%d c=%g' % (J, c)] = dict(mean_abs=vals, measured_exponents=[e1, e2], predicted_minus_c_minus_J_minus_3_2=-c - J - 1.5, lane_stated=-J - 1)
    print('J=%d c=%g' % (J, c), out['J=%d c=%g' % (J, c)], flush=True)
json.dump(out, open(sys.argv[1], 'w'), indent=1)
