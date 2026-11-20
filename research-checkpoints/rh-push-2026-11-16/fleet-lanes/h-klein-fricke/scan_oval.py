"""N_on, N_right of s -> Estar(z,s) on the window T1<t<T2, for tori z on the real locus of X(1).
N_on: sign changes of the real function on the line (grid dt). N_K = N_on + 2 N_right = (1/pi) Delta_C arg.
Off-line zeros located by Newton from non-crossing local minima of |Z|."""
import sys, math, json, cmath
from flint import acb, ctx
from epstein import Estar

def F(x, y, sig, t):
    """x may be a list of (x, y, weight): weighted sum over several tori (Heegner orbit).
    Precision is raised until the Arb enclosure has relative radius < 1e-12 (bessel_k loses bits at large order)."""
    pts = x if isinstance(x, list) else [(x, y, 1.0)]
    prec = 220 + int(5 * abs(t))
    while True:
        ctx.prec = prec
        v = acb(0)
        for (xx, yy, w) in pts:
            v += Estar(xx, yy, acb(sig, t)) * w
        mid = complex(float(v.real.mid()) * math.exp(math.pi * t / 2), float(v.imag.mid()) * math.exp(math.pi * t / 2))
        rad = max(float(v.real.rad()), float(v.imag.rad())) * math.exp(math.pi * t / 2)
        if rad < 1e-12 * abs(mid) or rad < 1e-25 or prec > 6000:
            if prec > 6000: raise RuntimeError("precision")
            return mid
        prec *= 2

def arg_change(x, y, pts_fn, a, b, h):
    """continuous arg change of F along a parametrised segment u in [a,b]."""
    tot = 0.0; u = a; f0 = F(x, y, *pts_fn(a)); n = 0
    step = h
    while u < b - 1e-12:
        un = min(b, u + step)
        f1 = F(x, y, *pts_fn(un)); n += 1
        d = cmath.phase(f1 / f0)
        if abs(d) > 0.9 and step > 1e-4:
            step /= 2; continue
        tot += d; u = un; f0 = f1
        if abs(d) < 0.3: step = min(h, step * 2)
    return tot, n

def newton(x, y, s0, it=60):
    s = s0
    for _ in range(it):
        e = 1e-7
        f = F(x, y, s.real, s.imag)
        # derivative via complex step in s (F includes exp(pi t/2), harmless for root)
        f2 = F(x, y, s.real + e, s.imag)
        df = (f2 - f) / e
        if df == 0: break
        ds = f / df
        if abs(ds) > 0.3: ds *= 0.3 / abs(ds)
        s = s - ds
        if abs(ds) < 1e-11: return s, True
    return s, False

def scan(x, y, T1, T2, dt=0.02, sig0=5.0):
    n = int(round((T2 - T1) / dt))
    ts = [T1 + k * dt for k in range(n + 1)]
    Z = [F(x, y, 0.5, t).real for t in ts]
    non = sum(1 for k in range(n) if Z[k] * Z[k + 1] < 0)
    # candidates: local minima of |Z| without sign change
    cand = [ts[k] for k in range(1, n) if abs(Z[k]) < abs(Z[k - 1]) and abs(Z[k]) < abs(Z[k + 1])
            and Z[k - 1] * Z[k] > 0 and Z[k] * Z[k + 1] > 0]
    a1, _ = arg_change(x, y, lambda u: (u, T1), 0.5, sig0, 0.02)
    a2, _ = arg_change(x, y, lambda u: (sig0, u), T1, T2, 0.05)
    a3, _ = arg_change(x, y, lambda u: (0.5 + sig0 - u, T2), 0.5, sig0, 0.02)
    NK = (a1 + a2 + a3) / math.pi
    roots = []
    for tc in cand:
        for sg in (0.55, 0.7, 0.9, 1.2, 1.6):
            s, ok = newton(x, y, complex(sg, tc))
            if ok and s.real > 0.5 + 1e-6 and T1 < s.imag < T2 and all(abs(s - r) > 1e-6 for r in roots):
                roots.append(s)
    tg = T1 + 0.5
    while tg < T2 and len(roots) < round((NK - non) / 2):
        for sg in (0.8, 1.3, 2.0):
            s, ok = newton(x, y, complex(sg, tg))
            if ok and s.real > 0.5 + 1e-6 and T1 < s.imag < T2 and all(abs(s - r) > 1e-6 for r in roots):
                roots.append(s)
        tg += 1.0
    return dict(x=x, y2=(y * y if y else None), T1=T1, T2=T2, N_on=non, NK=NK, N_right_arg=(NK - non) / 2,
                offline=[(round(r.real, 8), round(r.imag, 8)) for r in sorted(roots, key=lambda r: r.imag)])

JOBS = {
 "D-20_sum": [(0.0, math.sqrt(5), 1.0), (0.5, math.sqrt(5) / 2, 1.0)],
 "D-20_[2,2,3]": [(0.5, math.sqrt(5) / 2, 1.0)],
 "D-23_[1,1,6]": [(0.5, math.sqrt(23) / 2, 1.0)],
 "D-23_[2,1,3]": [(0.25, math.sqrt(23) / 4, 1.0)],
 "D-23_sum": [(0.5, math.sqrt(23) / 2, 1.0), (0.25, math.sqrt(23) / 4, 2.0)],
 "D-163": [(0.5, math.sqrt(163) / 2, 1.0)],
}
if __name__ == "__main__":
    T2 = float(sys.argv[1]); out = sys.argv[2]
    res = []
    for a in sys.argv[3:]:
        if a in JOBS: r = scan(JOBS[a], None, 1.0, T2)
        else: r = scan(0.0, math.sqrt(float(a)), 1.0, T2)
        r["job"] = a; r.pop("x")
        print(json.dumps(r), flush=True); res.append(r)
        json.dump(res, open(out, "w"), indent=1)
