import io, sys, glob, contextlib
from tab import table
def cap(pat, dets=True):
    b = io.StringIO()
    with contextlib.redirect_stdout(b):
        table(pat, dets)
    return b.getvalue().strip()
part1 = open("RESULT_part1.md").read()
rest = open("rest_template.md").read()
subs = {"ZETA5": cap("runs/mp_zeta_14_5_*.json"), "ZETA9": cap("runs/mp_zeta_14_9.json"),
        "ZETA1A": cap("runs/mp_zeta_14_1.json", False), "ZETA1B": cap("runs/mp_zeta_110_1.json", False),
        "DHHP": cap("runs/hp_dh_110_1_*.json", False) + ("\n\n" + cap("runs/hp_dh_14_1*.json", False) if glob.glob("runs/hp_dh_14_1*.json") else ""),
        "DH110": cap("runs/mp_dh_110_1.json", False), "DH5": cap("runs/mp_dh_14_5.json")}
for k, v in subs.items():
    rest = rest.replace("{{%s}}" % k, v)
open("RESULT.md", "w").write(part1.rstrip() + "\n\n" + rest)
print(len(part1), len(rest))
