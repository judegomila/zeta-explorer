"""Interior zero search of F(.,s) in K_Y: cell-winding on a grid, then 2D Newton; sign of Jacobian; compare with boundary winding."""
import sys, json, math, cmath, time
from elib import *

def to_xy(a, b, Y):
    """curvilinear coordinates on K_Y: a in [0,1] -> x = a/2 ; b in [0,1] -> y = ylow(x) * (Y/ylow(x))**b."""
    x = 0.5 * a; yl = math.sqrt(1 - x * x)
    return x, yl * (Y / yl) ** b

def jac(E, x, y, h=1e-6):
    fx = (E.F(x + h, y) - E.F(x - h, y)) / (2 * h)
    fy = (E.F(x, y + h) - E.F(x, y - h)) / (2 * h)
    return fx, fy

def newton(E, x, y, it=40):
    for _ in range(it):
        f = E.F(x, y); fx, fy = jac(E, x, y)
        det = fx.real * fy.imag - fx.imag * fy.real
        if det == 0: return None
        dx = (-f.real * fy.imag + f.imag * fy.real) / det
        dy = (-fx.real * f.imag + fx.imag * f.real) / det
        st = math.hypot(dx, dy)
        if st > 0.2: dx *= 0.2 / st; dy *= 0.2 / st
        x += dx; y += dy
        if y < 0.5 or y > 60 or abs(x) > 1: return None
        if st < 1e-12: break
    f = E.F(x, y)
    return (x, y, abs(f))

def find(sg, t, na=40, nb=None):
    E = Eis(sg, t); Y = 3 + abs(t) / math.pi
    if nb is None: nb = int(40 + 6 * t)
    g = [[E.F(*to_xy(i / na, j / nb, Y)) for j in range(nb + 1)] for i in range(na + 1)]
    zs = []
    tot = 0
    for i in range(na):
        for j in range(nb):
            c = [g[i][j], g[i + 1][j], g[i + 1][j + 1], g[i][j + 1]]
            w = sum(cmath.phase(c[(k + 1) % 4] / c[k]) for k in range(4)) / (2 * PI)
            w = round(w)
            # (a,b) -> (x,y) is orientation preserving (x increases with a, y with b), so w is the ccw cell winding
            tot += w
            if w != 0:
                x, y = to_xy((i + 0.5) / na, (j + 0.5) / nb, Y)
                r = newton(E, x, y)
                if r:
                    x, y, res = r
                    fx, fy = jac(E, x, y)
                    J = fx.real * fy.imag - fx.imag * fy.real
                    zs.append({"x": x, "y": y, "res": res, "J": J, "cellw": w,
                               "inK": bool(0 <= x <= 0.5 and x * x + y * y >= 1 and y <= Y)})
                else:
                    zs.append({"x": None, "cellw": w})
    Wb, mn, info, per = winding(E, Y)
    # dedupe
    uniq = []
    for z in zs:
        if z.get("x") is None: uniq.append(z); continue
        if not any(u.get("x") is not None and abs(u["x"] - z["x"]) + abs(u["y"] - z["y"]) < 1e-7 for u in uniq): uniq.append(z)
    sJ = sum((1 if z["J"] > 0 else -1) for z in uniq if z.get("x") is not None and z["inK"])
    return {"sigma": sg, "t": t, "W_boundary": Wb, "W_cells": tot, "sumSignJ": sJ, "nzeros": len(uniq), "zeros": uniq, "minF": mn}

if __name__ == "__main__":
    out = sys.argv[1]; res = []
    pts = [(float(a), float(b)) for a, b in (p.split(":") for p in sys.argv[2:])]
    for sg, t in pts:
        t0 = time.time(); r = find(sg, t); res.append(r)
        print(sg, t, "W_boundary", round(r["W_boundary"], 4), "W_cells", r["W_cells"], "sumSignJ", r["sumSignJ"], "n", r["nzeros"],
              [(round(z["x"], 4), round(z["y"], 4), "+" if z["J"] > 0 else "-") if z.get("x") is not None else "fail" for z in r["zeros"]],
              round(time.time() - t0, 1), flush=True)
    json.dump(res, open(out, "w"))
