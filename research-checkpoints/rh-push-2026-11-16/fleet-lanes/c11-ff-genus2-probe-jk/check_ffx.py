"""check_ffx.py: S_cop of this lane (run_curves.one) against `ffx sc` (copy of c10-ff-slot-cross-decomposition/ffx.c, compiled unchanged), q = 7,
seeded squarefree F of degree 5 (20) and degree 7 (10), N in 1..3, lam in {0,1,2,3,7}, k = 0..3."""
import os, sys, subprocess, random
os.environ["Q"] = "7"; sys.argv = ["x", "7", "5"]
import run_curves as rc
from sq_q import q
random.seed(5); ok = bad = 0
for DEG, n in ((5, 20), (7, 10)):
    done = 0
    while done < n:
        idx = random.randrange(q**DEG); F = tuple((idx//q**a) % q for a in range(DEG)) + (1,); o = rc.one(F)
        if o is None: continue
        done += 1; S = o[1]; i = 0
        for N in rc.NS:
            for lam in rc.LAMS:
                out = subprocess.run(["./ffx", "sc", "7", "3", str(N), str(lam), "0", str(DEG), str(idx), "3", "0"], capture_output=True, text=True).stdout
                ref = [int(x) for x in out.split("|")[1].split()]
                if ref == S[i:i+4]: ok += 1
                else: bad += 1
                i += 4
print(f"S_cop vectors (4 values of k each) equal to ffx sc: {ok}, different: {bad}")
