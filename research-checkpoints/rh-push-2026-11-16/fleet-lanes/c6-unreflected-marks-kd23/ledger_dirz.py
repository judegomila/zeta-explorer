"""ledger_dirz.py -- the reduced ledger of c5-target-fe-order2-ledger (tiers_fe_copy.py, copied unchanged) with the
unreflected row branch replaced by the conditional bound of Lemma D (RESULT section 2):
   dirZ(theta): k = max(0, 1 + l - M, 2 theta (1 + l) - M)
(row energy <= K + D + D^(2 theta) relative to ||a||^2, valid if every twist L(s, psi chi_k) is zero-free in
Re s > theta; theta = 1/2 is GRH for the family and gives dir0). MODEL: abscissae of a hypothetical estimate system."""
import tiers_fe_copy as T
from fractions import Fraction as F
orig = T.kbranches
def kb(row, drop=""):
    if row.startswith("dirZ"):
        th = F(row[4:])
        return [T.ZERO, T.add(T.lin(0, 0, 1, 0, 1), T.M_, -1), T.add(T.lin(0, 0, 2 * th, 0, 2 * th), T.M_, -1)]
    return orig(row, drop)
T.kbranches = kb
if __name__ == "__main__":
    print("== Z. lx <= l (h >= 1), no compensation on the high side, G polar, w = 0")
    for th in ["1/2", "5/8", "3/4", "7/8", "1"]:
        for box in (8, 16):
            T.show(f"Z1 dirZ theta = {th}, box {box}", ["dirZ" + th], geo="anti", box=F(box), comp=False, G="polar", wfix=F(0))
    print("== S. source geometry (lx, ly >= l, compensated), G polar, w = 0")
    for th in ["1/2", "3/4", "7/8", "1"]:
        T.show(f"S1 dirZ theta = {th}, box 8", ["dirZ" + th], geo="src", box=F(8), G="polar", wfix=F(0))
    T.show("S2 dir (Lemma 9.1), box 8", ["dir"], geo="src", box=F(8), G="polar", wfix=F(0))
