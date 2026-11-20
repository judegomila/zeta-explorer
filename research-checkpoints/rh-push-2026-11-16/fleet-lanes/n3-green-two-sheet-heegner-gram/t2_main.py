import sys
from runlib import *
mp.mp.dps = 20
# first lemma check: E(z_D,s) = (w/2) (|D|/4)^{s/2} zeta(s) L(s,chi_D)/zeta(2s), and Hecke: E(T_p z) = (p^s+p^{1-s}) E(z)
chis = {-3: [0, 1, -1], -4: [0, 1, 0, -1], -7: [0, 1, 1, -1, 1, -1, -1], -8: [0, 1, 0, 1, 0, -1, 0, -1]}
wD = {-3: 6, -4: 4, -7: 2, -8: 2}
s0 = mp.mpc(0.63, 9.1)
for D in chis:
    lhs = eis(HEEG[D], s0)
    rhs = complex((wD[D]/2)*(mp.mpf(abs(D))/4)**(s0/2)*mp.zeta(s0)*mp.dirichlet(s0, chis[D])/mp.zeta(2*s0))
    h2 = sum(eis(p, s0) for p in hecke(HEEG[D], 2))/complex(2**s0+2**(1-s0))
    h3 = sum(eis(p, s0) for p in hecke(HEEG[D], 3))/complex(3**s0+3**(1-s0))
    print("D", D, "E/closed", lhs/rhs, "T2", h2/lhs, "T3", h3/lhs)
log = open("t2_main.jsonl", "a")
gam = [mp.zetazero(n).imag for n in (1, 2, 3)]
divs = zeta_divs((1, 2))
for n, g in enumerate(gam, 1):
    for x in (0.0, 0.05, 0.2):
        two_sheet(complex(0.5+x, float(g)), divs, "zeta8 gamma%d x=%.2f" % (n, x), log)
