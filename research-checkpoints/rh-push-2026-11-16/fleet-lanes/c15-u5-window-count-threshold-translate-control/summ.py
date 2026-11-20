import json, glob, math
for T in ("10000", "100000", "1e+06"):
    for s in range(3):
        L = [json.loads(l) for l in open(f"contig_T{T}_s{s}.jsonl")]
        c = L[0]; print(f"T={T} seed={s} Ts={c['Ts']:.2f} N={c['N']} P={c['P']} zeta defect max={max(v['zeta'] for v in c['controls'].values()):.1e} DH K=1 defect={c['controls']['1']['dh']:.2f}")
        for r in L[1:]:
            print(f"   K={r['K']:4d} rank {r['jac_rank'][0]}/{r['jac_rank'][1]} nm {r['nonmult_rank'][0]}/{r['nonmult_rank'][1]} score {r['score']:.1e} F(s0) {r['F_s0']:.0e} offgrid {r['offgrid']:.1e} pass {int(r['passed'])} dist {r['mean_weighted_dist_to_best_translate']:.2f} | nonmult {r['nonmult_score']:.0e} max|a| {r['nonmult_max_abs']:.2f} th2..5 {[round(x,3) for x in r['max_abs_theta_small_primes'][:3]]}")
