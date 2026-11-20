"""validation of the moment tables: (1) two trapezoid steps; (2) Xi(0) and the zeros; (3) heat table against the t-series of the plain table;
(4) E_a series against Xi(w - ia) Xi(w + ia)."""
import sys, pickle, math, mpmath as mp
from flint import arb, acb, ctx
import jl
f1, f2 = sys.argv[1], sys.argv[2]
A = pickle.load(open(f1, 'rb')); B = pickle.load(open(f2, 'rb')); prec = A['prec']; ctx.prec = prec + 64
print('prec', prec, 'jmax', A['jmax'], 'steps 1/%d, 1/%d' % (A['hden'], B['hden']))
for k in A['tables']:
    a, b = A['tables'][k], B['tables'][k]; worst = -10 ** 6
    for j in range(len(a)):
        if a[j] != 0:
            e = abs(a[j] - b[j]); worst = max(worst, (e.bit_length() - abs(a[j]).bit_length()) if e else -10 ** 6)
    print('  %-22s entries %d  worst relative difference between the two steps: 2^%d' % (k, len(a), worst))
T = jl.Tables(f1)
def ev(c, X):
    s = acb(0)
    for v in reversed(c): s = s * X + v
    return s
mp.mp.dps = 40
cz = T.series('ZETA'); print('Xi(0) =', cz[0].str(30), ' xi(1/2) = 0.4971207781883141...')
for g in (mp.zetazero(1).imag, mp.zetazero(10).imag):
    w = acb(arb(str(g))); print('  zeta: Xi at gamma=%s : %s  (scale Xi(0.9 gamma) %s)' % (mp.nstr(g, 12), ev(cz, -w * w).real.str(8), ev(cz, -(w * 0.9) ** 2).real.str(8)))
cd = T.series('DH'); w = acb(arb('85.699348485'), arb('-0.308517182')) ; w0 = acb(arb('85.699348485') * 0.99, arb('-0.308517182'))
print('  DH: |Xi| at the off-line zero 0.808517182 + 85.699348485 i :', abs(ev(cd, -w * w)).str(8), ' nearby', abs(ev(cd, -w0 * w0)).str(8))
c4 = T.series('L4'); w = acb(arb('6.0209489046976')); print('  L4: Xi at 6.0209489047:', ev(c4, -w * w).real.str(8), ' at 5.9:', ev(c4, -acb(5.9) ** 2).real.str(8))
c5 = T.series('L5'); w = acb(arb('6.64845334472771')); print('  L5: Xi at 6.6484533447:', ev(c5, -w * w).real.str(8), ' at 6.5:', ev(c5, -acb(6.5) ** 2).real.str(8))
# heat: M_2k(t) = sum_j (t/4)^j M_{2k+2j}/j!
Mz = T.arbs('ZETA|heat|0/1'); Mh = T.arbs('ZETA|heat|-1/10'); t = arb(-1) / 10
for k in (0, 5, 40):
    s = arb(0); term = arb(1)
    for j in range(0, len(Mz) - k):
        if j: term = term * (t / 4) / j
        s += term * Mz[k + j]
    print('  heat t=-0.1: M_%d direct %s  series %s' % (2 * k, Mh[k].str(25), s.str(25)))
ce = T.series('EA:3/10')
for w in (3.0, 14.2):
    lhs = ev(ce, -acb(w) ** 2).real; rhs = (ev(cz, -acb(w, -0.3) ** 2) * ev(cz, -acb(w, 0.3) ** 2)).real
    print('  E_a a=0.3 at w=%g: series %s  product %s' % (w, lhs.str(25), rhs.str(25)))
ct = T.series('TNR:3:2.2'); w = acb(math.pi / math.log(3), -math.acosh(1.1) / math.log(3)); print('  TNR q=3: |Xi| at its first off-line zero', abs(ev(ct, -w * w)).str(6), ' Xi(0)', ct[0].str(12), '= (c+2) xi(1/2) =', (4.2 * cz[0]).str(12))
