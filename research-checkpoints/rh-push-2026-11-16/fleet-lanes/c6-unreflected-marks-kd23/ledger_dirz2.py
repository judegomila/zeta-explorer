"""box 32 runs of ledger_dirz (anti geometry, uncompensated) and the same with the ideal high side removed."""
import ledger_dirz
import tiers_fe_copy as T
from fractions import Fraction as F
print("== Z2. lx <= l, no compensation, G polar, w = 0, box 32")
for th in ["1/2", "3/4", "7/8"]:
    T.show(f"Z2 dirZ theta = {th}, box 32", ["dirZ" + th], geo="anti", box=F(32), comp=False, G="polar", wfix=F(0))
print("== Z3. same at fixed h: add l - lx <= h - 1 through the box on l only (lx, ly free up to 64)")
