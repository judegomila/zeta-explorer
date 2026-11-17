import sys
from runlib import *
zA = complex(-0.25, 23**0.5/4)
roots = json.load(open("t3_zeros.json"))
log = open("t4_control.jsonl", "a")
divA = [hecke(zA, n) for n in range(1, 9)]
mixed = [hecke(zA, n) for n in (1, 2, 3, 4)] + [hecke(HEEG[D], 1) for D in (-3, -4, -7, -8)]
mode = sys.argv[1]
if mode == "A":
    s = complex(*roots[1])
    two_sheet(s, divA, "single class [2,1,3] T_1..T_8, at its off-line zero", log)
    two_sheet(s, mixed, "mixed: [2,1,3] T_1..T_4 + Heegner -3,-4,-7,-8, at the class zero", log)
    two_sheet(s+0.9j, divA, "single class T_1..T_8, same abscissa, height +0.9 (not a zero)", log)
if mode == "B":
    s = complex(*roots[0])
    two_sheet(s, divA, "single class [2,1,3] T_1..T_8, at its off-line zero (Re > 1)", log)
    for s in (0.7+17.8j, 0.9+17.8j, 0.7+10.0j, 0.9+10.0j):
        two_sheet(s, zeta_divs((1, 2)), "zeta8 generic height", log)
if mode == "C":
    s = complex(*roots[0])
    two_sheet(s+0.9j, divA, "single class T_1..T_8, same abscissa, height +0.9 (not a zero)", log)
