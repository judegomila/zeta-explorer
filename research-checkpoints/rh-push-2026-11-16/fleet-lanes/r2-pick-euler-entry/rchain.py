# r_k = R_k(a) along the confluent canonical reduction (ball arithmetic).  Real-Pick order N at the confluent node a
# is positive definite iff r_0..r_{N-1} > 0.  Optional: F jets from theta-kernel moments instead of zeta/Hurwitz series.
import sys, time; sys.path.insert(0, '.')
import gates_arb as G
from gates_arb import *
def F_from_theta(kind, aq, n, bits):
    th = Theta(kind); al = aq / 2
    mo = moments(th, arb(0), [al, -al], n + 3, bits)
    return [(mo[0][j] + (-1) ** j * mo[1][j]) / arb(2) ** j for j in range(n + 3)]
if __name__ == "__main__":
    name, astr, K, prec = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
    src = sys.argv[5] if len(sys.argv) > 5 else "series"
    ctx.prec = prec; t0 = time.time()
    spec = Spec(name); aq = Q(astr)
    if src == "theta":
        bits = int(sys.argv[6])
        base = spec.base
        Fth = F_from_theta(base, aq, K + 4, bits)
        Fse = F_series(base, aq, 6)
        print("theta/series ratio of F jets (must be constant):", [(Fth[j] / Fse[j]).str(20) for j in range(4)])
        G.F_series = lambda kind, aq_, n: Fth[:n + 3]
    rs, lev = reduction(spec, aq, K)
    sg = "".join(sgn(r) for r in rs)
    neg = [k for k, c in enumerate(sg) if c == '-']; unk = [k for k, c in enumerate(sg) if c == '?']
    print("%s a=%s K=%d prec=%d src=%s sec=%.0f" % (name, astr, K, prec, src, time.time() - t0))
    print("  first certified negative r_k: k =", neg[0] if neg else None, "(Pick order %s)" % (neg[0] + 1 if neg else "-"),
          "| undecided:", unk[:5], "| negatives:", neg[:12])
    if neg:
        k = neg[0]
        for j in range(max(0, k - 2), min(K, k + 2)): print("   r_%d = %s" % (j, rs[j].str(12)))
    else:
        print("   r_%d = %s" % (K - 1, rs[K - 1].str(12)))
