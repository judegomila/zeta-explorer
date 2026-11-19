"""c8: (E-H) and (E-K) in the exact LP of ../c5-target-fe-order2-ledger (tiers_fe.py; copy tiers_fe_copy.py unchanged,
tiers_fe_theta.py = the copy with one added parameter theta in the high constraint: h(1 - 1/r - delta - theta)).
high: 'dh' = floor class + density class, 'grh' = floor class only, 'none' = high side deleted.
MODEL abscissae of hypothetical estimate systems. Planned memory < 100 MB."""
from tiers_fe_theta import *
ALL = ["refl", "dir", "empty"]
if __name__ == "__main__":
    print("== R. regression (theta = 0): c5 values")
    show("A1 source system", ["refl"], "13/15", wfix=F(0))
    show("A2 K removed", ["refl"], "31/36", wfix=F(0), drop="K")
    show("X5 free, refl | dir | empty, G polar", ALL, "13/15", geo="free", box=F(8))
    for geo in ("src", "free"):
        for G in ("src", "polar", "zero"):
            print(f"== geometry {geo}, G {G}, rows refl | dir | empty, w free, box 8")
            for drop, nm in (("", "ledger J,K,P"), ("K", "(E-K): K deleted")):
                for high, th, hn in (("dh", F(0), "dh, theta 0"), ("grh", F(0), "floor class, theta 0"), ("grh", F(1, 4), "floor class, theta 1/4"),
                                     ("grh", F(1, 2), "floor class, theta 1/2"), ("dh", F(1, 2), "dh, theta 1/2"), ("none", F(0), "high side deleted")):
                    show(f"{nm}; {hn}", ALL, geo=geo, G=G, drop=drop, high=high, theta=th, box=F(8))
