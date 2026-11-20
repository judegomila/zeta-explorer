#!/usr/bin/env python3
"""Validation of e1_kloss.py against the stored Gram matrices of n2-kloss-sdp-certificate (entrywise) and of the
Gauss-sum shortcut against the direct sum. Usage: e1_test.py <tmp_out_dir>"""
import os, sys, glob, subprocess, numpy as np, math
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
REF = os.environ.get("E1_REF", os.path.join(HERE, "..", "..", "n2-kloss-sdp-certificate"))
os.environ.setdefault("E_NOGPU", "1")
import e1_kloss as E
import shutil
for f in glob.glob(os.path.join(out, "*")):
    shutil.rmtree(f) if os.path.isdir(f) else os.remove(f)
els = E.primary_elements(5000); pt = E.prime_table(els, E.sieve(5000))
g = E.prime_gauss(pt, os.path.join(out, "gauss_test.npz"), 10 ** 6)
sp = np.flatnonzero(pt["split"])
d = max(abs(g[k] - E.gauss_direct_split(pt, k)) for k in sp)
al = (pt["a"] - pt["b"] / 2 + 1j * pt["b"] * math.sqrt(3) / 2) / np.sqrt(pt["N"])
print(f"Gauss sums: {len(sp)} split primes of norm <= 5000: max |shortcut - direct| = {d:.2e}; max |g^3 + alpha| = {np.abs(g ** 3 + al).max():.2e}")
assert d < 1e-9
for Z, l in [(1000, 0.5), (1000, 0.75), (2000, 0.5), (4000, 0.75), (8000, 0.5)]:
    sub = os.path.join(out, f"case_{Z}_{l}")
    if os.path.exists(sub):
        shutil.rmtree(sub)
    subprocess.run([sys.executable, os.path.join(HERE, "e1_kloss.py"), "--Z", str(Z), "--ls", str(l), "--out", sub, "--save-gram", "--k-below", "1e9"], check=True,
                   stdout=subprocess.DEVNULL)
    a = np.load(os.path.join(sub, f"gram_Z{Z}_l{l:.4f}.npz")); b = np.load(os.path.join(REF, f"gram_Z{Z}_M1.0_l{l:.3f}.npz"))
    assert (a["SU"] == b["SU"]).all() and (a["SV"] == b["SV"]).all() and int(a["R"]) == int(b["R"])
    msg = f"Z={Z} l={l}: n={len(a['SU'])} R={int(a['R'])}"
    for v in ("Ap", "K"):
        rel = np.abs(a["G_" + v] - b["G_" + v]).max() / np.abs(b["G_" + v]).max()
        msg += f"  {v}: max rel diff {rel:.2e}"
        assert rel < 1e-9, msg
    tr = lambda G: np.real(np.trace(G))
    msg += f"  R: tr ratio {tr(a['G_R']) / tr(b['G_R']):.4f}"
    print(msg, flush=True)
print("E1 TEST PASSED")
