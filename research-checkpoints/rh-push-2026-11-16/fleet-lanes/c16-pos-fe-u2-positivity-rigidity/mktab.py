import json,sys
def rows(f): return [json.loads(l[7:]) for l in open(f) if l.startswith("RESULT ")]
main=rows("lp2_main.log")
print("| K | eta | pair (indices) | g* | d | ZQ: sup of D^- (fine grid) | proved bound of c15 | LP lower bound (fractional) | LP/ZQ | best integer member (MILP incumbent, fine grid) | MILP lower bound | incumbent is ZQ | seconds |")
print("|---|---|---|---|---|---|---|---|---|---|---|---|---|")
for o in sorted(main,key=lambda o:(o["K"],o["eta"])):
    print("| %d | %.2f | %d, %d | %.4f | %.4f | %.5e | %.3e | %.5e | %.3f | %s | %s | %s | %.0f |"%(o["K"],o["eta"],o["pair"][0],o["pair"][1],o["gstar"],o["d"],o["zq_true_sup_neg"],o["zq_proved_bound"],o["lp_delta_lower_bound"],o["lp_delta_lower_bound"]/o["zq_true_sup_neg"],
      "%.5e"%o["int_true_sup_neg_fine4"] if "int_true_sup_neg_fine4" in o else "none",
      "%.5e"%o["int_dual_bound_last_round"] if o.get("int_dual_bound_last_round") is not None else "none",
      {True:"yes",False:"no (removed %d, on-line added %d, extra quartets %d)"%(len(o.get("int_removed",[])),len(o.get("int_added_online",[])),len(o.get("int_extra_quartets",[]))),None:"n/a"}[o.get("int_is_ZQ")],o["seconds"]))
json.dump(main,open("lp2_main.json","w"),indent=1)
print()
rel=json.load(open("lp_small.json"))+json.load(open("lp_mid.json"))
print("| program | eta | K | status | min delta (constraint grid) | sup of D^- on the 4x finer grid | sum a | fractional a | sum b | quartet weights (largest) | real-pole weight |")
print("|---|---|---|---|---|---|---|---|---|---|---|")
for o in sorted(rel,key=lambda o:(o["prob"],o["eta"],o["K"])):
    tq=o.get("top_quartets") or []
    print("| %s | %.2f | %d | %s | %.4e | %.4e | %.2f | %d | %.2f | %s | %s |"%(o["prob"],o["eta"],o["K"],o["status"].split(" ")[0],o["delta"],max(0,-o["minD_fine4"]),o["sum_a"],o["n_a_frac"],o["sum_b"],"%.3f at %.3f"%(tq[0][1],tq[0][0]) if tq else "-",o.get("p_realpole") if o["prob"]=="C" else "-"))
