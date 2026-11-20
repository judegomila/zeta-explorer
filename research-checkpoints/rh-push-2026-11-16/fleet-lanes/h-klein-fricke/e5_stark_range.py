"""E5: single-torus trapping at class-number-one CM points (Deuring / Stark mechanism).
E*(z_D,s) = pi^-s Gamma(s) (sqrt|D|/2)^s (w/2) zeta(s) L(s,chi_D)  when h(D)=1.
On the line E* = 2|A| cos(phi) + delta,  A = Lambda(1+2it) y^(1/2+it),  delta = Bessel tail.
At the points t_k with phi = k pi, sign E* = (-1)^k while rho = |delta|/(2|A|) < 1: one on-line zero per gap.
Compare with N_K from the argument principle on the same window."""
import math, cmath, json, sys
from flint import acb, arb, ctx
from epstein import Estar, Lam
import scan_oval as so

def A_and_E(x, y, t):
    prec = 220 + int(5 * t)
    while True:
        ctx.prec = prec
        s = acb(0.5, t)
        A = Lam(2 * s) * acb(arb(y)) ** s
        E = Estar(x, y, s)
        sc = math.exp(math.pi * t / 2)
        if float(E.real.rad()) * sc < 1e-14 * abs(float(A.real.mid()) + 1j * float(A.imag.mid())) * sc or prec > 5000:
            return complex(float(A.real.mid()), float(A.imag.mid())) * sc, float(E.real.mid()) * sc
        prec *= 2

def run(D, T=70.0, dt=0.01):
    x = 0.5 if D % 4 == 3 else 0.0
    y = math.sqrt(D) / 2
    t = 1.0; A, E = A_and_E(x, y, t); phi = cmath.phase(A)
    k_next = math.ceil(phi / math.pi) if True else 0
    marks = []  # (t_k, k, rho, sign ok)
    rho_max = 0; T0 = None; direction = None
    prev = (t, phi, A, E)
    while t < T:
        t2 = t + dt
        A2, E2 = A_and_E(x, y, t2)
        phi2 = phi + cmath.phase(A2 / A)
        lo, hi = (phi, phi2) if phi2 > phi else (phi2, phi)
        k = math.ceil(lo / math.pi)
        if k * math.pi <= hi and lo != hi:
            # linear interpolation of the mark
            w = (k * math.pi - phi) / (phi2 - phi)
            tk = t + w * dt
            Ak, Ek = A_and_E(x, y, tk)
            rho = abs(Ek - 2 * Ak.real) / (2 * abs(Ak))
            ok = (Ek * Ak.real > 0)
            marks.append((tk, k, rho, ok))
            if T0 is None and rho >= 1: T0 = tk
        t, phi, A, E = t2, phi2, A2, E2
    good = []
    for m in marks:
        if m[2] < 1: good.append(m)
        else: break
    out = dict(D=D, y=y, two_pi_y=2 * math.pi * y, T0_first_rho_ge_1=T0, n_marks_before=len(good))
    if len(good) >= 2:
        Ta, Tb = good[0][0], good[-1][0]
        r = so.scan(x, y, Ta, Tb) if x == 0 else so.scan([(x, y, 1.0)], None, Ta, Tb)
        out.update(window=(Ta, Tb), forced_on_line=len(good) - 1, N_on_grid=r["N_on"], NK=r["NK"],
                   rho_at_marks=[(round(m[0], 3), float("%.3g" % m[2])) for m in good[:: max(1, len(good) // 8)]])
    return out

if __name__ == "__main__":
    res = []
    for D in [int(a) for a in sys.argv[1:]]:
        r = run(D); print(json.dumps(r), flush=True); res.append(r)
    json.dump(res, open("e5_stark.json", "w"), indent=1)
