"""Class-by-class choice between pointwise and averaged numerator, free geometry.
For fixed rho = ly/h the better estimate per class is determined by (delta,x,rho) alone
(both are affine in (ly,h) with the same remaining terms), so each rho gives an LP.
Region A (rho>=1/2): candidates av(theta=g/6k), pt(w=1-a). Region B (rho<=1/2): av(theta=0), pt(w=a).
Float LP, not a certificate."""
import numpy as np
from scipy.optimize import linprog
from scalar_system import class_row, low_rows, count_R, bisect

def solve_rho(B, rho, nd=97, nx=25, mixed=True, dmin=0.125):
    kappa = min(1.0, max(13/18, 2*B-1))
    kinds = ("av_max", "pt_left") if rho >= 0.5 else ("av_0", "pt_right")
    A = []; ub = []
    for coef, rhs in low_rows(B):
        A.append(np.append(coef, 0.0)); ub.append(rhs)
    v_probe = np.array([1.0 - 1.0, rho, 0.0])  # lx=0,l=0 -> h=1, ly=rho : probe geometry for the comparison
    npt = 0
    for d in np.linspace(dmin, min(5/6, 2*B-1), nd):
        for x in np.linspace(0, .5, nx):
            rows = [class_row(k, d, x, B, kappa) for k in kinds]
            if mixed:
                # terms other than (ly,h) are identical between kinds; compare at h=1, ly=rho
                vals = [np.dot(c, v_probe) + c0 for c, c0 in rows]
                j = int(np.argmin(vals)); npt += j
            else:
                j = 0
            coef, const = rows[j]
            A.append(np.append(coef, -1.0)); ub.append(-const)
    # ly = rho*h = rho*(1 - lx + l)
    Aeq = np.array([[rho, 1.0, -rho, 0.0]]); beq = np.array([rho])
    res = linprog(c=[0, 0, 0, 1.0], A_ub=np.array(A), b_ub=np.array(ub), A_eq=Aeq, b_eq=beq,
                  bounds=[(0, 1), (0, 1), (0, .5), (None, None)], method="highs")
    solve_rho.npt = npt
    if res.status != 0:
        return None, None
    return res.x[3], res.x[:3]

if __name__ == "__main__":
    import sys
    ND, NX = 61, 13
    best = (9, None)
    # reference on the same grid: averaged only, no rho constraint (region A)
    from scalar_system import solve
    Bref = bisect(lambda B: solve(B, ["av_max"], "A", nd=ND, nx=NX), 0.86, 0.90, it=32)
    print(f"reference (averaged only, same grid {ND}x{NX}, free geometry): {Bref:.10f}", flush=True)
    print(" rho     B*_mixed      B*_mixed - ref   #classes using pointwise   (lx, ly, l)", flush=True)
    rhos = [0.35, 0.45, 0.50, 0.52, 0.54, 0.55, 0.56, 0.57, 0.575, 0.58, 0.585, 0.59, 0.60, 0.62, 0.65, 0.70, 0.80, 0.90]
    for rho in rhos:
        try:
            Bm = bisect(lambda B: solve_rho(B, rho, nd=ND, nx=NX, mixed=True), 0.85, 0.99, it=32)
        except AssertionError:
            print(f" {rho:.4f}  infeasible up to 0.99", flush=True); continue
        t, v = solve_rho(Bm, rho, nd=ND, nx=NX, mixed=True); npt = solve_rho.npt
        print(f" {rho:.4f}  {Bm:.10f}  {Bm-Bref:+.2e}  {npt:5d}   {np.round(v,6)}", flush=True)
        if Bm < best[0]: best = (Bm, rho, v)
    print("min over rho of mixed B*:", best, " minus ref:", best[0]-Bref, flush=True)
