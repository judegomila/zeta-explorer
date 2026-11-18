"""Check that the high rows hold for every B in [1/2, 1] at the T6 geometries and at the B = 1/2 vertices (exact, grid of 501 values;
E is affine in delta for fixed B and the two rows delta = 0, delta = 2B - 1 are the extreme points, as in tiers.py)."""
from fractions import Fraction as F
def high_ok(v, B, comp):
    lx, ly, l = v; h = 1 - lx + l
    def E(d, x): return F(1,2) + d/2 - B - ly/2 + h*(F(5,6) - d) + ((-l/2 + l*d*x) if comp else 0)
    return E(F(0), F(0)) <= 0 and E(2*B - 1, F(1,2) if comp else F(0)) <= 0
pts = [((F(51,10),F(51,10),F(179,25)),False), ((F(6),F(6),F(43,5)),False), ((F(15,2),F(15,2),F(11)),False),
       ((F(153,25),F(306,25),F(409,50)),True), ((F(36,5),F(72,5),F(49,5)),True), ((F(9),F(18),F(25,2)),True),
       ((F(5),F(5),F(7)),False), ((F(4),F(8),F(6)),True), ((F(6),F(12),F(8)),True),
       ((F(3),F(6),F(7,2)),True), ((F(12,5),F(24,5),F(13,5)),True)]
for v, comp in pts:
    bad = [B for B in (F(1,2) + F(i,1000) for i in range(501)) if not high_ok(v, B, comp)]
    print(tuple(str(x) for x in v), "comp" if comp else "no-comp", "high rows hold on [1/2,1]" if not bad else f"FAIL for B in [{float(min(bad)):.3f},{float(max(bad)):.3f}]")
