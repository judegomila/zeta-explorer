"""Second batch: geometry without lx >= l. Which inputs produce a vertex with h > 1 (see RESULT section 5)."""
from tiers_fe import *
if __name__ == "__main__":
    print("== X. free geometry (lx, ly, l >= 0), w free in [0, 8], ideal high side, box 8 unless stated")
    show("X1 dir (Lemma 9.1 sieve), G src", ["dir"], "1", geo="free", box=F(8))
    show("X2 dir (Lemma 9.1 sieve), G polar", ["dir"], "1", geo="free", box=F(8))
    show("X3 dir (Lemma 9.1 sieve), G = 0", ["dir"], geo="free", box=F(8))
    show("X4 refl, G = 0", ["refl"], geo="free", box=F(8))
    show("X5 refl | dir | empty, G polar", ["refl", "dir", "empty"], "13/15", geo="free", box=F(8))
    show("X6 refl | dir | empty, G polar, K removed", ["refl", "dir", "empty"], geo="free", box=F(8), drop="K")
    print("== Y. lx <= l (h >= 1), no compensation on the high side, box 8")
    show("Y1 refl | dir | empty, G src", ["refl", "dir", "empty"], geo="anti", box=F(8), comp=False)
    show("Y2 refl | dir | empty, G polar", ["refl", "dir", "empty"], geo="anti", box=F(8), comp=False)
    show("Y3 dir0, G polar", ["dir0"], geo="anti", box=F(8), comp=False)
    show("Y4 dir0, G polar, box 16", ["dir0"], geo="anti", box=F(16), comp=False)
    show("Y5 k = 0, G polar", ["k0"], geo="anti", box=F(8), comp=False)
    show("Y6 refl, K removed, G polar", ["refl"], geo="anti", box=F(8), comp=False, drop="K")
    show("Y7 refl, K and P removed, G polar", ["refl"], geo="anti", box=F(8), comp=False, drop="KP")
