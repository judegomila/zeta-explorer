"""regression of two c5 rows (tiers_fe2.log Y2, Y6) with the c5 call signature (w free) and with w = 0"""
from tiers_fe_copy import *
show("Y2 c5 call (w free)", ["refl", "dir", "empty"], geo="anti", box=F(8), comp=False, G="polar")
show("Y2 w = 0", ["refl", "dir", "empty"], geo="anti", box=F(8), comp=False, G="polar", wfix=F(0))
show("Y2 w = 0, refl only", ["refl"], geo="anti", box=F(8), comp=False, G="polar", wfix=F(0))
show("Y1 w = 0 (G src)", ["refl", "dir", "empty"], geo="anti", box=F(8), comp=False, wfix=F(0))
show("Y6 w = 0", ["refl"], geo="anti", box=F(8), comp=False, drop="K", G="polar", wfix=F(0))
