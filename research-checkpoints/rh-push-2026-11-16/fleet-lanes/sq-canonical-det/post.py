import json, sys, math, glob
def kmin(top, bottom):
    gaps = [g for g in top + bottom if g > 0]
    if any(g <= 0 for g in top + bottom): return None
    # smallest k with sum (1-g)^(2k) < 1 over the listed near-unit eigenvalues (lower bound for the true k)
    lo, hi = 1.0, 1e300
    f = lambda k: sum(math.exp(2 * k * math.log1p(-g)) if g < 1 else 0.0 for g in gaps) - 1
    if f(1) < 0: return 1
    lo, hi = 1.0, 2.0
    while f(hi) > 0 and hi < 1e290: hi *= 2
    for _ in range(80):
        mid = math.sqrt(lo * hi)
        if f(mid) > 0: lo = mid
        else: hi = mid
    return hi
if __name__ == '__main__':
    for fn in sorted(glob.glob(sys.argv[1] if len(sys.argv) > 1 else "runs/mp_*.json")):
        R = json.load(open(fn))
        print("\n###", fn, R[0]["kind"], "omega", R[0]["om"], "nu", R[0]["nu"], "digits", R[0]["digits"])
        print("| t | p | 1-lam_max | 1+lam_min | #ev>1 | #ev<-1 | log det(1+K) | log det(1-K) | log gamma(t) | k_min |")
        print("|---|---|---|---|---|---|---|---|---|---|")
        for r in R:
            k = kmin(r["top"], r["bottom"])
            print("| %.4f | %d | %.4e | %.4e | %d | %d | %.5f | %.5f | %.6f | %s |" % (
                r["t"], r["p"], r["gap_plus"], r["gap_minus"], r["n_gt1"], r["n_ltm1"],
                r["ld_plus_c"], r["ld_minus_c"], r["log_gamma_ham_c"], ("%.3g" % k) if k else "-"))
