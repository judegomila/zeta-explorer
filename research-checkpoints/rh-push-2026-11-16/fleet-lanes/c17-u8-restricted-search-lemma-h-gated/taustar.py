"""tau* column for the K3 sign minors (corollary C4): F_tau = det[exp(tau p_ij^2/4) K3_zeta(p_ij)] from zeta's values
alone; tau*(F) = smallest abs(tau) on the ladder -0.005 * 2^k, k = -8..14 (up to abs(tau) = 81.9), at which the sign of
F_tau differs from the sign of F_0; refined by bisection.  First 300 nodes of each registered stream."""
import json, math
from flint import arb, arb_mat, ctx
import du
out = {}
for fam in ('TM5', 'TM6', 'DM5', 'DM6'):
    m = int(fam[-1])
    ts = []
    none = 0
    for nd in du.draw_nodes(fam, False, 300):
        ctx.prec = 4096
        pts = du.node_points(fam, nd)
        z = [du.ballk.BZ.jets(u, 0, False)[0] for u in pts]
        sq = [u * u / 4 for u in pts]

        def sgn(tau):
            d = arb_mat(m, m, [zz * (arb(tau) * s).exp() for zz, s in zip(z, sq)]).det()
            return 1 if d > 0 else (-1 if d < 0 else 0)
        s0 = sgn(0.0)
        assert s0 != 0
        prev = 0.0
        found = None
        for k in range(-8, 15):
            t = -0.005 * 2.0 ** k
            s = sgn(t)
            if s != s0:
                a, b = prev, t
                for _ in range(40):
                    mid = (a + b) / 2
                    if sgn(mid) == s0:
                        a = mid
                    else:
                        b = mid
                found = abs(b)
                break
            prev = t
        if found is None:
            none += 1
        else:
            ts.append(found)
    ts.sort()
    out[fam] = dict(n=300, no_sign_change_up_to_81p9=none, with_root=len(ts), min_tau_star=ts[0] if ts else None,
                    quartiles=[ts[len(ts) // 4], ts[len(ts) // 2], ts[3 * len(ts) // 4]] if ts else None,
                    below_0p005=sum(1 for t in ts if t <= 0.005))
    print(fam, out[fam], flush=True)
json.dump(out, open('taustar.json', 'w'), indent=1)
