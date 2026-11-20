"""Device (e): interpolation twin with an ordinary Dirichlet series.
C(s) = zeta(s) + c L(s, chi_-4) L(s, chi_5): chi_-4 odd (trivial zeros at -1, -3, ...), chi_5 even (trivial zeros at 0, -2, ...),
so the added term vanishes at every non-positive integer; c is chosen to put a zero at s0."""
import json
from mpmath import mp, mpf, mpc, zeta, dirichlet, fabs
mp.dps = 30
c4 = [0, 1, 0, -1]; c5 = [0, 1, -1, -1, 1]
H = lambda s: dirichlet(s, c4)*dirichlet(s, c5)
out = {}
for s0 in (mpc("0.8", "20"), mpc("0.75", "1000")):
    c = -zeta(s0)/H(s0)
    C = lambda s: zeta(s) + c*H(s)
    out[str(s0)] = {"c": str(c), "abs_C_s0": str(fabs(C(s0))), "abs_zeta_s0": str(fabs(zeta(s0))),
                    "max_abs_H_at_0..-15": str(max(fabs(H(mpf(-k))) for k in range(16))),
                    "abs_cH_at_2": str(fabs(c*H(2))), "abs_cH_at_3+50i": str(fabs(c*H(mpc(3, 50))))}
json.dump(out, open("twin_test.json", "w"), indent=1); print(json.dumps(out, indent=1))
