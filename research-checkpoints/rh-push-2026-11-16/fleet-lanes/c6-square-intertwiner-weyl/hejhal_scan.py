"""Hejhal-type residual scan for Maass cusp forms on SL_2(Z).
Purpose: test whether gamma_1 (and gamma_1/2, gamma_2, gamma_3) is a spectral parameter r_j.
Method: f = sum_{n<=M} a_n sqrt(y) K_ir(2 pi n y) cs(2 pi n x), a_1 = 1; automorphy imposed on two
horocycles Y1, Y2 (Q points each); overdetermined system (2M equations, M-1 unknowns) solved by least
squares; relative residual R(r) is O(1) off the spectrum and small on it.
Planned memory: matrices at most 2*M x M <= 24 x 12 floats; negligible. Single process, float + mpmath dps 20.
"""
import sys, json, math, time
import numpy as np
import mpmath as mp
mp.mp.dps = 20

def pullback(x, y):
    while True:
        x = x - round(x)
        n2 = x*x + y*y
        if n2 < 1 - 1e-15:
            x, y = -x/n2, y/n2
        else:
            return x, y

def kt(r, x):
    # e^{pi r/2} K_{ir}(x), real
    return float(mp.re(mp.besselk(1j*r, x)) * mp.exp(mp.pi*r/2))

def system(r, M, Q, Ys):
    rows = {0: [], 1: []}
    for Y in Ys:
        xs = [(j - 0.5)/(2*Q) for j in range(1, Q+1)]
        pb = [pullback(x, Y) for x in xs]
        # K table at pullback points
        Kp = np.array([[math.sqrt(ys)*kt(r, 2*math.pi*n*ys) for n in range(1, M+1)] for (_, ys) in pb])  # Q x M
        Kd = np.array([math.sqrt(Y)*kt(r, 2*math.pi*m*Y) for m in range(1, M+1)])
        for par in (0, 1):
            cs = np.cos if par == 0 else np.sin
            A = np.array([[cs(2*math.pi*n*xs_) for n in range(1, M+1)] for (xs_, _) in pb]) * Kp   # Q x M : f basis at z*
            B = np.array([[cs(2*math.pi*m*x) for x in xs] for m in range(1, M+1)])                 # M x Q
            V = (2.0/Q) * (B @ A) - np.diag(Kd)
            rows[par].append(V)
    out = {}
    for par in (0, 1):
        V = np.vstack(rows[par])
        V = V / np.abs(V).max(axis=1, keepdims=True)
        b = -V[:, 0]
        Aun = V[:, 1:]
        sol, *_ = np.linalg.lstsq(Aun, b, rcond=None)
        res = np.linalg.norm(Aun @ sol - b) / np.linalg.norm(b)
        out[par] = (float(res), [float(s) for s in sol[:3]])
    return out

def scan(lo, hi, step, M, Q, Ys):
    rs = np.arange(lo, hi + 1e-12, step)
    tab = []
    for r in rs:
        o = system(float(r), M, Q, Ys)
        tab.append((float(r), o[0][0], o[1][0]))
    return tab

def refine(r0, par, M, Q, Ys, h=0.02):
    # golden-section minimise residual near r0
    f = lambda r: system(r, M, Q, Ys)[par][0]
    a, b = r0 - h, r0 + h
    g = (math.sqrt(5) - 1)/2
    c, d = b - g*(b-a), a + g*(b-a)
    fc, fd = f(c), f(d)
    for _ in range(28):
        if fc < fd:
            b, d, fd = d, c, fc; c = b - g*(b-a); fc = f(c)
        else:
            a, c, fc = c, d, fd; d = a + g*(b-a); fd = f(d)
    r = (a+b)/2
    return r, f(r)

if __name__ == "__main__":
    t0 = time.time()
    G = [14.134725141734693, 21.022039638771555, 25.010857580145688]
    out = {"windows": [], "points": []}
    wins = [(6.6, 7.6, 0.02, 8, 24, (0.30, 0.25)),
            (9.3, 9.8, 0.02, 8, 24, (0.30, 0.25)),
            (13.5, 14.7, 0.01, 8, 24, (0.30, 0.25)),
            (20.0, 21.6, 0.01, 10, 28, (0.30, 0.25)),
            (24.8, 25.2, 0.005, 11, 30, (0.30, 0.25))]
    for (lo, hi, st, M, Q, Ys) in wins:
        tab = scan(lo, hi, st, M, Q, Ys)
        mins = []
        for par in (0, 1):
            col = [t[1+par] for t in tab]
            for i in range(1, len(col)-1):
                if col[i] < col[i-1] and col[i] < col[i+1] and col[i] < 0.05:
                    r, v = refine(tab[i][0], par, M, Q, Ys, h=st)
                    mins.append({"parity": "even" if par == 0 else "odd", "r": r, "residual": v})
        med = [float(np.median([t[1] for t in tab])), float(np.median([t[2] for t in tab]))]
        mn = [min(t[1] for t in tab), min(t[2] for t in tab)]
        print(f"window [{lo},{hi}] step {st} M={M} Q={Q}: median residual even {med[0]:.3f} odd {med[1]:.3f}; grid min even {mn[0]:.2e} odd {mn[1]:.2e}", flush=True)
        for m in mins: print("   minimum:", m, flush=True)
        out["windows"].append({"lo": lo, "hi": hi, "step": st, "M": M, "Q": Q, "Ys": Ys, "median": med, "gridmin": mn, "minima": mins})
    for (r, M, Q) in [(G[0], 8, 24), (G[0]/2, 8, 24), (G[1], 10, 28), (G[1]/2, 8, 24), (G[2], 11, 30), (G[2]/2, 8, 24)]:
        o = system(r, M, Q, (0.30, 0.25))
        print(f"r = {r:.9f}: residual even {o[0][0]:.4f} odd {o[1][0]:.4f}", flush=True)
        out["points"].append({"r": r, "even": o[0][0], "odd": o[1][0]})
    out["seconds"] = time.time() - t0
    json.dump(out, open(sys.argv[1] if len(sys.argv) > 1 else "hejhal_scan.json", "w"), indent=1)
    print("seconds", out["seconds"])
