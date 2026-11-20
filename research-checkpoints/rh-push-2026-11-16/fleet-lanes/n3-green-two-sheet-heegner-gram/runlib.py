import numpy as np, mpmath as mp, time, json
from glib import *

def divisors_to_pts(divs):
    pts = []; W = np.zeros((len(divs), 0))
    rows = []
    for D in divs:
        row = {}
        for p in D:
            key = None
            for i, q in enumerate(pts):
                if abs(p-q) < 1e-8: key = i; break
            if key is None: pts.append(p); key = len(pts)-1
            row[key] = row.get(key, 0)+1
        rows.append(row)
    W = np.zeros((len(divs), len(pts)))
    for i, r in enumerate(rows):
        for k, v in r.items(): W[i, k] = v
    return pts, W

def inertia(M, tol):
    ev = np.linalg.eigvalsh((M+M.T)/2)
    return (int((ev > tol).sum()), int((ev < -tol).sum()), int((abs(ev) <= tol).sum())), ev

def two_sheet(s, divs, label, log):
    t0 = time.time()
    pts, W = divisors_to_pts(divs)
    so1 = Solver(s); G1p, r1 = so1.gram(pts)
    if abs(complex(s).real-0.5) < 1e-14:
        G2p, r2 = np.conj(G1p), r1          # G_{1-s} = conj G_s on the line
    else:
        so2 = Solver(1-s); G2p, r2 = so2.gram(pts)
    E1 = np.array([eis(p, s) for p in pts]); E2 = np.array([eis(p, 1-s) for p in pts])
    G1 = W@G1p@W.T; G2 = W@G2p@W.T; e1 = W@E1; e2 = W@E2
    J = np.outer(e1, e2)/(1-2*s)
    scale = np.max(np.abs(G1))
    jerr = np.max(np.abs(G2-G1-J))/scale
    symerr = np.max(np.abs(G1-G1.T))/scale
    M1 = G1.imag; M2 = G2.imag
    tol = max(1e-9, 50*jerr, 50*symerr)*scale
    i1, ev1 = inertia(M1, tol); i2, ev2 = inertia(M2, tol)
    out = dict(label=label, s=[complex(s).real, complex(s).imag], npts=len(pts), lstsq_res=[float(r1), float(r2)],
               scale=float(scale), jump_relerr=float(jerr), sym_relerr=float(symerr),
               absE=[float(abs(v)) for v in e1], jump_norm_rel=float(np.max(np.abs(J))/scale),
               inertia_phys=i1, inertia_second=i2, ev_phys=[float(v) for v in ev1], ev_second=[float(v) for v in ev2],
               tol=float(tol), sec=time.time()-t0)
    print(json.dumps(out), file=log, flush=True)
    print(label, "s=", s, "npts", len(pts), "jump err", "%.1e" % jerr, "sym", "%.1e" % symerr, "|J|/|G|", "%.2e" % out["jump_norm_rel"],
          "\n   phys (+,-,0)", i1, "second", i2, "\n   ev phys", np.array2string(ev1, precision=3), "\n   ev 2nd ", np.array2string(ev2, precision=3), flush=True)
    return out

HEEG = {-3: complex(-0.5, 3**0.5/2), -4: 1j, -7: complex(-0.5, 7**0.5/2), -8: complex(0, 2**0.5)}
def zeta_divs(ns=(1, 2)):
    return [hecke(HEEG[D], n) for n in ns for D in (-3, -4, -7, -8)]
