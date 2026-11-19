# Stage-B checks for c14-joint-pair-design-ratio-vortex-cross-bridge. Local, small.
# Planned memory: largest array = (contour points 560) x (5q-1 <= 504) complex128 = 2.3 MB.
import sys, json, cmath, math
import numpy as np
from flint import acb, arb, ctx
ctx.prec = 100
OUT = sys.argv[1]
res = {}

def hz(s, a):  # Hurwitz zeta, ball
    return acb(s.real, s.imag).zeta(arb(a))
def cplx(z): return complex(float(z.real.mid()), float(z.imag.mid()))
def L5real(s):  # Legendre character mod 5 (even, real)
    chi = {1: 1, 2: -1, 3: -1, 4: 1}
    tot = acb(0)
    S = acb(s.real, s.imag)
    for a in range(1, 5):
        tot += chi[a] * hz(s, arb(a) / 5)
    return tot * (acb(5) ** (-S))
def zeta(s): return acb(s.real, s.imag).zeta()

# C1: gamma-free functional equation Q(s) = 5^(1/2-s) Q(1-s), Q = L(s,chi5)/zeta(s)
c1 = []
for s in [0.3 + 7j, 0.7 + 20j, 0.45 + 33.3j]:
    Q = L5real(s) / zeta(s)
    Qd = L5real(1 - s) / zeta(1 - s)
    rhs = (acb(5) ** (acb(0.5) - acb(s.real, s.imag))) * Qd
    c1.append({"s": str(s), "absQ": abs(cplx(Q)), "defect": abs(cplx(Q - rhs))})
res["C1_gamma_free_FE"] = c1

# C2: tanh product, s = 3+2i, inert primes p = 2,3 mod 5, p <= 20000
def primes(n):
    sv = bytearray([1]) * (n + 1); sv[0:2] = b"\0\0"
    for i in range(2, int(n ** .5) + 1):
        if sv[i]: sv[i * i::i] = bytearray(len(sv[i * i::i]))
    return [i for i in range(n + 1) if sv[i]]
s = 3 + 2j
prod = 1 - 5 ** (-s)
for p in primes(20000):
    if p % 5 in (2, 3): prod *= cmath.tanh(s * math.log(p) / 2)
Q = cplx(L5real(s) / zeta(s))
res["C2_tanh_product"] = {"s": str(s), "Q": [Q.real, Q.imag], "product_P20000": [prod.real, prod.imag], "defect": abs(Q - prod)}

# C3: Lemma N: (1/phi) sum_chi L(s,chi) = q^-s zeta(s,1/q) -> 1
c3 = []
for q in [11, 101, 1009, 10007]:
    for s in [0.8085171825 + 85.6993484854j, 0.6 + 14.2j]:
        S = acb(s.real, s.imag)
        v = cplx((acb(q) ** (-S)) * hz(s, arb(1) / q))
        c3.append({"q": q, "s": str(s), "abs_value_minus_1": abs(v - 1)})
res["C3_lemma_N"] = c3

# C4: zeros of twisted Davenport-Heilbronn functions in boxes (argument principle, float64 from 100-bit balls)
kappa = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
chi5 = {1: 1, 2: 1j, 4: -1, 3: -1j}
def primroot(q):
    for g in range(2, q):
        if len({pow(g, k, q) for k in range(q - 1)}) == q - 1: return g
def contour(x0, x1, y0, y1, h):
    pts = []
    nx = int(round((x1 - x0) / h)); ny = int(round((y1 - y0) / h))
    pts += [complex(x0 + (x1 - x0) * k / nx, y0) for k in range(nx)]
    pts += [complex(x1, y0 + (y1 - y0) * k / ny) for k in range(ny)]
    pts += [complex(x1 - (x1 - x0) * k / nx, y1) for k in range(nx)]
    pts += [complex(x0, y1 - (y1 - y0) * k / ny) for k in range(ny)]
    return pts
def winding(vals):
    v = np.concatenate([vals, vals[:1]])
    d = np.angle(v[1:] / v[:-1])
    return int(round(d.sum() / (2 * math.pi))), float(np.abs(d).max())
def run(q, box, h=0.01):
    N = 5 * q
    rs = [r for r in range(1, N) if r % 5 and r % q]
    g = primroot(q); ind = {pow(g, j, q): j for j in range(q - 1)}
    pts = contour(*box, h)
    H = np.empty((len(pts), len(rs)), dtype=complex)
    for i, s in enumerate(pts):
        S = acb(s.real, s.imag); pref = cplx(acb(N) ** (-S))
        for j, r in enumerate(rs):
            H[i, j] = cplx(hz(s, arb(r) / N)) * pref
    c5 = np.array([chi5[r % 5] for r in rs]); jr = np.array([ind[r % q] for r in rs])
    out = []
    for k in range(q - 1):
        psi = np.exp(2j * math.pi * k * jr / (q - 1))
        La = H @ (c5 * psi); Lb = H @ (np.conj(c5) * psi)
        f = (1 - 1j * kappa) / 2 * La + (1 + 1j * kappa) / 2 * Lb
        wf, mf = winding(f); wa, ma = winding(La); wb, mb = winding(Lb)
        out.append({"k": k, "zeros_f": wf, "zeros_La": wa, "zeros_Lb": wb, "max_step_arg": max(mf, ma, mb)})
    return out
boxes = {"A_at_DH_zero": (0.6, 1.4, 84.7, 86.7), "B_control_box": (0.6, 1.4, 94.0, 96.0)}
c4 = {}
for q in [11, 19, 29, 31, 61]:
    for name, box in boxes.items():
        o = run(q, box)
        nz = sum(1 for e in o if e["zeros_f"] > 0); tot = sum(e["zeros_f"] for e in o)
        c4[f"q{q}_{name}"] = {"q": q, "fe_kept": q % 5 in (1, 4), "box": box, "characters": q - 1,
            "with_zero": nz, "total_zeros": tot, "k0_zeros_f": o[0]["zeros_f"],
            "L_member_zeros_total": sum(e["zeros_La"] + e["zeros_Lb"] for e in o),
            "max_step_arg": max(e["max_step_arg"] for e in o), "per_char": [e["zeros_f"] for e in o]}
        print(q, name, nz, "/", q - 1, "total", tot, "k0", o[0]["zeros_f"], "maxstep", c4[f"q{q}_{name}"]["max_step_arg"], flush=True)
res["C4_DH_twists"] = c4
json.dump(res, open(OUT, "w"), indent=1)
print(json.dumps({k: res[k] for k in ["C1_gamma_free_FE", "C2_tanh_product", "C3_lemma_N"]}, indent=1))
