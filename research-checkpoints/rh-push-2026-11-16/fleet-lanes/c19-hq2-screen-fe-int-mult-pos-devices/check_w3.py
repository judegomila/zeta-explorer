# check_w3.py: the s3 matrix W (w3.py, float64, box window, X = T0) against U * (band form of dev.py at theta = 1) on the same nodes.
import sys, math, json, numpy as np
sys.path.insert(0, "../s3-prime-side-zero-statistics")
import w3
from flint import arb, acb, ctx
import tz, dev
ctx.prec = 128
out = []
for (T0, m, tw) in [(1e4, 24, 1e4), (1e4, 48, 1e4 + 128), (1e5, 32, 1e5)]:
    U = arb(int(T0)).log(); u = float(U.mid())
    tau, D = tz.nodes(tw, U, m)
    F, F1, _, _ = dev.prime_sum(tw, U, m, int(T0))
    Az = tz.to_np(tz.add(tz.arch(tw, U, m, [arb(1) / 4], -arb.pi().log()), tz.rank_terms(tw, U, m, [(acb(0, 0.5), 1), (acb(0, -0.5), 1)]), tz.loewner(m, D, U, F, F1, -1)))
    fam = w3.family('ZETA', T0)
    # w3 excludes nothing at n = X; dev excludes log n >= U (n = T0 is not a prime power here)
    W = w3.build_box(fam, float(tau[0].mid()), m, T0)
    sg = np.array([(-1.0) ** a for a in range(m)])
    d1 = np.max(np.abs(W - u * Az)); d2 = np.max(np.abs(W - u * (sg[:, None] * Az * sg[None, :])))
    r = dict(T0=T0, m=m, tw=tw, max_entry=float(np.max(np.abs(W))), maxdiff_plain=float(d1), maxdiff_sign_conjugated=float(d2),
             eig_min_W_over_U=float(np.linalg.eigvalsh(W)[0] / u), eig_min_dev=float(np.linalg.eigvalsh(Az)[0]))
    print(json.dumps(r)); out.append(r)
json.dump(out, open("check_w3.json", "w"), indent=1)
