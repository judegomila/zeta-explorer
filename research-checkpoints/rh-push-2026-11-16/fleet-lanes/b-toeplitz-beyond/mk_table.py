import json, glob, re
rows=[json.loads(l) for f in sorted(glob.glob('dh_big_*.jsonl')) for l in open(f)]
rows.sort(key=lambda r:r['twoa']); th=rows[0]['thetas']
L=["| 2a | n ≤ | function | "+" | ".join(f"θ={t:g}" for t in th)+" |", "|---|---|---|"+"---|"*len(th)]
for r in rows:
    L.append(f"| {r['twoa']:g} | {r['Nmax']} | ζ | "+" | ".join(("\\|·\\|<1e-10" if abs(v)<1e-10 else f"{v:.5f}") for v in r['zeta'])+" |")
    L.append(f"| | | DH | "+" | ".join(f"{v:.3f}" for v in r['dh'])+" |")
s=open('RESULT.md').read()
tab="<!--DHTAB-->\n"+"\n".join(L)+"\n<!--/DHTAB-->"
s = s.replace("DH_TABLE_PLACEHOLDER", tab) if "DH_TABLE_PLACEHOLDER" in s else re.sub(r"<!--DHTAB-->.*?<!--/DHTAB-->", lambda m: tab, s, flags=re.S)
open('RESULT.md','w').write(s); print(len(rows),"rows")
