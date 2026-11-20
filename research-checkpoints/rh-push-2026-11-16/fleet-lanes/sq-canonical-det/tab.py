import json, sys, glob, math
from post import kmin
def load(pat):
    R = []
    for fn in sorted(glob.glob(pat)): R += json.load(open(fn))
    return R
def table(pat, dets=True):
    R = load(pat)
    ts = sorted(set(r["t"] for r in R))
    ps = sorted(set(r["p"] for r in R))
    print("\n`%s`, omega=%s, nu=%d; degrees p=%s" % (R[0]["kind"], R[0]["om"], R[0]["nu"], ps))
    if dets:
        print("| t | 1-lam_max (p_lo / p_hi) | 1+lam_min (p_hi) | log det(1+K) (p_mid / p_hi) | log det(1-K) (p_hi) | log gamma(t) (p_mid / p_hi) | k_min |")
        print("|---|---|---|---|---|---|---|")
    else:
        print("| t | 1-lam_max by p | 1+lam_min by p | #ev>1, #ev<-1 (p_hi) |")
        print("|---|---|---|---|")
    for t in ts:
        rows = sorted([r for r in R if r["t"] == t], key=lambda r: r["p"])
        lo, hi = rows[0], rows[-1]; mid = rows[-2] if len(rows) > 1 else rows[-1]
        if dets:
            k = kmin(hi["top"], hi["bottom"])
            print("| %.4g | %.3e / %.3e | %.3e | %.4f / %.4f | %.4f | %.5f / %.5f | %s |" % (
                t, lo["gap_plus"], hi["gap_plus"], hi["gap_minus"], mid["ld_plus_c"], hi["ld_plus_c"], hi["ld_minus_c"],
                mid["log_gamma_ham_c"], hi["log_gamma_ham_c"], ("%.2g" % k) if k else "-"))
        else:
            print("| %.4g | %s | %s | %d, %d |" % (t, " / ".join("%.2e" % r["gap_plus"] for r in rows),
                  " / ".join("%.2e" % r["gap_minus"] for r in rows), hi["n_gt1"], hi["n_ltm1"]))
if __name__ == "__main__":
    table("runs/mp_zeta_14_5_*.json"); table("runs/mp_zeta_14_9.json"); table("runs/mp_dh_14_5.json")
    table("runs/mp_zeta_14_1.json", False); table("runs/mp_zeta_110_1.json", False)
    table("runs/mp_dh_14_1.json", False); table("runs/mp_dh_110_1.json", False)
    if glob.glob("runs/hp_dh_110_1_t*.json"): table("runs/hp_dh_110_1_t*.json", False)
