"""Jensen polynomials (shift 0) of the Davenport-Heilbronn xi function, degrees 2..8. mpmath, dps 40."""
import mpmath as mp, json, sys
mp.mp.dps = 40
KAP = (mp.sqrt(10 - 2 * mp.sqrt(5)) - 2) / (mp.sqrt(5) - 1)
CH = [0, 1, 1j, -1j, -1]; CHB = [0, 1, -1j, 1j, -1]
def xi_dh(s):
    f = ((1 - 1j * KAP) * mp.dirichlet(s, CH) + (1 + 1j * KAP) * mp.dirichlet(s, CHB)) / 2
    return (5 / mp.pi) ** (s / 2) * mp.gamma((s + 1) / 2) * f
D = 8
co = mp.taylor(lambda z: xi_dh(mp.mpf(1) / 2 + 1j * z), 0, 2 * D)
gam = [mp.factorial(k) * co[2 * k].real * (-1) ** k for k in range(D + 1)]
rows = {}
for d in range(2, D + 1, 2):
    poly = [mp.binomial(d, j) * gam[j] for j in range(d, -1, -1)]
    rts = mp.polyroots(poly, maxsteps=400, extraprec=400)
    rows[d] = int(sum(1 for r in rts if abs(r.imag) > mp.mpf(10) ** (-15) * (1 + abs(r))))
print('jensen dh', rows, 'odd-coefficient size', float(max(abs(co[2 * k + 1]) for k in range(D)) / abs(co[0])))
json.dump(rows, open(sys.argv[1], 'w'))
