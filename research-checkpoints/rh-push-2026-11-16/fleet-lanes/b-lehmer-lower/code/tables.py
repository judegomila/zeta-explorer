# tables.py : markdown tables for RESULT.md from data/*_analysis.json and cert files
import json, sys, math, glob
for tag,cf in (("run12",["cert12.json"]),("run15",["cert15.json"]),("run18",sorted(glob.glob("cert18_*.json")))):
    try: A=json.load(open(tag+"_analysis.json"))
    except Exception as e: print(tag,"missing",e); continue
    cert={}
    for f in cf:
        try:
            for r in json.load(open(f)): cert[r["T1"]]=r
        except Exception: pass
    L=A["L=log(T/2pi)"]
    tp=[t for t in A["top_pairs"] if not math.isnan(t["delta_direct"])]
    tp.sort(key=lambda t:t["delta_direct"])
    print(f"\n**{tag}: N = {A['N']:,} zeros, t in [{A['T_first']}, {A['T_last']}+L], log(T/2pi) = {L:.3f}**\n")
    print("| # | location t (integer + offset of the extremum) | delta = gap*log(T/2pi)/2pi | gap in t | Z at extremum | eps^2/2 = two-body collision time | CSV lambda | Arb |")
    print("|---|---|---|---|---|---|---|---|")
    for k,t in enumerate(tp[:10]):
        T1=int(t["loc"].split("+")[0]); c=cert.get(T1)
        cs=("certified, gap in (%.5e, %.5e)"%(c["gap_lo"],c["gap_hi"]) if c and c["certified"] else ("FAILED" if c else "not run"))
        print(f"| {k+1} | {t['loc']} | {t['delta_direct']:.7f} | {t['gap']:.4e} | {t['Zstar']:+.3e} | {t['gap']**2/2:.4e} | {t['lam']:.4e} | {cs} |")
