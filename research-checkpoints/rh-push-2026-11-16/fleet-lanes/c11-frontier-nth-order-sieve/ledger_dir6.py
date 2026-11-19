"""ledger_dir6.py -- reduced ledger of c5-target-fe-order2-ledger (tiers_fe_copy.py, copied unchanged from
c6-unreflected-marks-kd23) with one added row branch:
   'dir6': unreflected rows bounded by the n = 6 bound of de Faveri 2610.04045 Thm 1.1 (rows Z^M, columns Z^(1+l)):
           k = max(0, 1 + l - M, (1 + l)/3 - M/6, 5(1 + l)/6 - 2M/3)
   ('dir' is the same with (KD)^(2/3): k = max(0, 1 + l - M, (2 + 2l - M)/3); 'dir0' the hypothetical K + D.)
Exact rational vertex enumeration. MODEL: abscissae of a hypothetical estimate system (ideal high side), not bounds on zeros.
Planned memory: constraint lists of < 40 rows; no arrays."""
import tiers_fe_copy as T
from fractions import Fraction as F
orig = T.kbranches
def kb(row, drop=""):
    if row == "dir6":
        one_l = T.lin(0, 0, 1, 0, 1)
        return [T.ZERO, T.add(one_l, T.M_, -1),
                T.add(T.scale(one_l, F(1, 3)), T.scale(T.M_, F(1, 6)), -1),
                T.add(T.scale(one_l, F(5, 6)), T.scale(T.M_, F(2, 3)), -1)]
    return orig(row, drop)
T.kbranches = kb
if __name__ == "__main__":
    print("== regression (must equal the files): A1 13/15, B3 dir, B3' dir0")
    T.show("A1 source system (refl), w = 0", ["refl"], "13/15", wfix=F(0))
    T.show("B3 dir only (Lemma 9.1), box 4", ["dir"], wfix=F(0))
    T.show("B3' dir0 only (hypothetical K + D), box 4", ["dir0"], wfix=F(0))
    print("== new branch, source geometry (lx, ly >= l), ideal high side")
    for box in (4, 8, 16):
        T.show(f"N1 dir6 only, w = 0, box {box}", ["dir6"], wfix=F(0), box=F(box))
    T.show("N2 refl | dir6 | empty, w free", ["refl", "dir6", "empty"], "13/15")
    T.show("N3 refl | dir | dir6 | empty, w = 0", ["refl", "dir", "dir6", "empty"], "13/15", wfix=F(0))
    T.show("N4 dir6 only, G polar, w = 0, box 8", ["dir6"], wfix=F(0), box=F(8), G="polar")
    T.show("N4' dir only, G polar, w = 0, box 8 (file: 1)", ["dir"], wfix=F(0), box=F(8), G="polar")
    print("== w-dependence, refl | dir6 | empty against refl | dir | empty")
    for w in ["0", "1/10", "2/5", "1", "2", "4"]:
        T.show(f"C  w = {w}: with dir ", ["refl", "dir", "empty"], wfix=F(w))
        T.show(f"C  w = {w}: with dir6", ["refl", "dir6", "empty"], wfix=F(w))
    print("== relaxed geometry")
    T.show("D1 geo Q, refl | dir6 | empty, G src", ["refl", "dir6", "empty"], geo="Q")
    T.show("D1' geo Q, refl | dir | empty, G src", ["refl", "dir", "empty"], geo="Q")
    T.show("D3 geo free, refl | dir6 | empty, G src, box 8", ["refl", "dir6", "empty"], geo="free", box=F(8))
    T.show("D3' geo free, refl | dir | empty, G src, box 8", ["refl", "dir", "empty"], geo="free", box=F(8))
    T.show("D7 geo free, dir6 only, G polar, w = 0, box 8", ["dir6"], geo="free", box=F(8), G="polar", wfix=F(0))
    T.show("D7' geo free, dir only, G polar, w = 0, box 8", ["dir"], geo="free", box=F(8), G="polar", wfix=F(0))
    print("== lx <= l (h >= 1), no compensation on the high side, G polar, w = 0 (the branch c6 identified as the false input)")
    for box in (8, 16):
        T.show(f"Z1 dir6, anti geometry, box {box}", ["dir6"], geo="anti", box=F(box), comp=False, G="polar", wfix=F(0))
        T.show(f"Z1' dir, anti geometry, box {box}", ["dir"], geo="anti", box=F(box), comp=False, G="polar", wfix=F(0))
    print("done")
