"""(i) abscissa of the refined system when the exceptional term is designed out (b <= 0: additive large
sieve, Lemma 6.2 of the 7/8 manuscript, no P_a^{1/6} term);  (ii) fine rho scan of the mixed system;
(iii) higher-moment numerator models.  Float LP, MODEL values except where the source proves the inputs."""
import numpy as np
import scalar_system
from scalar_system import solve, bisect, count_R
from mixed_ratio import solve_rho
ND, NX = 61, 13
print("(i) exceptional term designed out", flush=True)
for name, rows in [("b = 0 (lx = ly)", [(np.array([-1.0, 1.0, 0.0]), 0.0), (np.array([1.0, -1.0, 0.0]), 0.0)]),
                   ("b <= 0 (ly <= lx)", [(np.array([-1.0, 1.0, 0.0]), 0.0)])]:
    for kinds, region in [(["av_max"], "A"), (["av_0"], "B"), (["pt_left"], "A"), (["pt_right"], "B")]:
        f = lambda B: solve(B, kinds, region, extra_rows=rows, nd=ND, nx=NX)
        try:
            Bs = bisect(f, 0.80, 0.99, it=34); t, v = f(Bs)
            print(f"   {name:18s} {kinds[0]:8s} region {region}: B = {Bs:.7f}  (lx,ly,l) = {np.round(v,5)}", flush=True)
        except AssertionError:
            print(f"   {name:18s} {kinds[0]:8s} region {region}: infeasible up to 0.99", flush=True)
print("(ii) fine rho scan, mixed pointwise/averaged per class", flush=True)
Bref = bisect(lambda B: solve(B, ["av_max"], "A", nd=ND, nx=NX), 0.86, 0.90, it=34)
best = 9
for rho in np.arange(0.5740, 0.5836, 0.0005):
    Bm = bisect(lambda B: solve_rho(B, rho, nd=ND, nx=NX, mixed=True), 0.86, 0.90, it=34)
    best = min(best, Bm)
    print(f"   rho={rho:.4f}  B_mixed - B_ref = {Bm-Bref:+.3e}   #pt classes {solve_rho.npt}", flush=True)
print(f"   min over fine rho: B_mixed - B_ref = {best-Bref:+.3e}  (B_ref on this grid {Bref:.10f})", flush=True)
