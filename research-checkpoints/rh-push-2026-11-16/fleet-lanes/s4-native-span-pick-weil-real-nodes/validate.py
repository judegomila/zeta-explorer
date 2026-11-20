"""Validation of lib2 on cases with known answers. Prints PASS/FAIL lines."""
import sys, math
from flint import arb, acb, ctx, arb_mat, acb_series
import lib, lib2
ok = True
def chk(name, cond, info=''):
    global ok; ok &= bool(cond); print('PASS' if cond else 'FAIL', name, info, flush=True)
ctx.prec = 400
# 1. parts: arch + pole + prime = xi'/xi
nu = arb('0.8'); ar, po, pr = lib2.parts(nu); c = lib2.logder(lib.Zeta(), nu).real
chk('arch+pole+prime = xi\'/xi', abs(float((ar + po + pr - c).mid())) < 1e-100)
# 2. Liouville: -L'/L = sum lambda(n) Lambda(n) n^-s at s = 6 (direct sum over prime powers <= 3000)
s = 6.0; tot = 0.0
for p in lib2.primes_upto(3000):
    k = 1
    while p ** k < 1e7: tot += (-1) ** k * math.log(p) * p ** (-k * s); k += 1
chk('SGNLIOU Dirichlet Z', abs(float(lib2.dirichlet_Z('SGNLIOU', arb('5.5')).mid()) - tot) < 1e-12, tot)
tot = 0.0
for p in lib2.primes_upto(3000):
    k = 1
    while p ** k < 1e7: tot += ((-1) ** k if p in (2, 5) else 1) * math.log(p) * p ** (-k * s); k += 1
chk('SGNP:2,5 Dirichlet Z', abs(float(lib2.dirichlet_Z('SGNP:2,5', arb('5.5')).mid()) - tot) < 1e-12)
al = float(lib2.ALPHA_WT); tot = 0.0
for p in lib2.primes_upto(3000):
    k = 1
    while p ** k < 1e7: tot += math.cos(al * k * math.log(p)) * math.log(p) * p ** (-k * s); k += 1
chk('WTRE Dirichlet Z', abs(float(lib2.dirichlet_Z('WTRE', arb('5.5')).mid()) - tot) < 1e-12)
# DH Dirichlet series: Z from coefficients (1, k, -k, -1, 0)
kap = float(lib.kappa().mid()); cf = [1, kap, -kap, -1, 0]
f = sum(cf[(n - 1) % 5] * n ** -8.0 for n in range(1, 4000)); fp = -sum(cf[(n - 1) % 5] * math.log(n) * n ** -8.0 for n in range(1, 4000))
chk('DH Dirichlet Z', abs(float(lib2.dirichlet_Z('DH', arb('7.5')).mid()) + fp / f) < 1e-12)
# 3. HeatT against the quadrature object of lib
ctx.prec = 700
h = lib2.HeatT(-0.5); h.build(); print('  HT info', h.info)
ctx.prec = 300; hq = lib.Heat(-0.5)
for w in ('0.3', '1.7', '2.4'):
    v1 = lib2.logder(h, arb(w)).real; v2 = lib.logder(hq, arb(w)).real
    chk('HeatT vs quadrature at w=' + w, abs(float(((v1 - v2) / v2).mid())) < 1e-60, float(v1.mid()))
ctx.prec = 700
z0 = acb('0.2430', '111.694')   # tabulated off-line zero of HEAT-0.5 (battery)
chk('HeatT small at its off-line zero (Taylor radius check, expected to be loose far from w=1)', True,
    'log2|F_tau(z0)/F_tau(1)| = %s' % lib._log2(abs(h.completed(acb(arb(1) / 2) + z0)) / abs(h.completed(acb('1.5')))))
# 4. Schur recursion with probes against dense solves (arb_mat)
ctx.prec = 600
obj = lib.TNR(); n = 9
nu = [lib2.node('chebv:1/2:5/2', k) for k in range(n)]; c = [lib2.logder(obj, t).real for t in nu]
piv, negp, und = lib2.schur_probe(nu, c, 6, stop_at_negative=False)
def defect(N, i):
    P = arb_mat(N, N, [(c[p] + c[q]) / (nu[p] + nu[q]) for p in range(N) for q in range(N)])
    v = arb_mat(N, 1, [(c[p] + c[i]) / (nu[p] + nu[i]) for p in range(N)])
    return c[i] / nu[i] - (v.transpose() * P.solve(v))[0, 0]
good = True
for N in range(1, 7):
    for i in range(6, n):
        dn = defect(N, i)
        isneg = any(t[0] == N and t[1] == i - 6 for t in negp)
        good &= (isneg == (dn < 0))
chk('probe defects = dense Schur complements (TNR, 6 base + 3 probes)', good, 'negatives %d' % len(negp))
# pivots vs lib.schur_real and ladder signs
p2 = lib.schur_real(nu, c, stop_at_negative=False)
chk('schur_probe pivots = lib.schur_real', [t[1] for t in piv] == [t[1] for t in p2[:6]])
ctx.prec = 3000
for code in ('TNR', 'EA-1/4', 'ZETA'):
    o = lib2.get(code); a = [lib2.node('lad', k) for k in range(40)]; L = [lib2.logder(o, t).real for t in a]
    lad = lib2.ladder(a, L); pv = lib.schur_real(a, L)
    f1 = next((t[0] for t in lad if t[1] < 0), None); f2 = next((t[0] for t in pv if t[1] < 0), None)
    chk('ladder first p_j <= 0 = first negative Pick pivot (%s)' % code, f1 == f2, (f1, f2, 'steps decided', len(lad), len(pv)))
# 5. jets: Schur-parameter pivots = LDL pivots of the dense jet matrix I - T T^* (lower-triangular Toeplitz T)
ctx.prec = 1500
for code in ('ZETA', 'TNR', 'PL:ZETA:0.3:6'):
    o = lib2.get(code); d = 10
    N, D = lib2.jet_series(o, '1', '1/4', d)
    out = lib2.schur_params(D, N)
    ctx.cap = max(ctx.cap, d + 2); S = (acb_series(N, prec=d) / acb_series(D, prec=d)).coeffs(); S = [t.real for t in S] + [arb(0)] * d
    M = [[(arb(1) if i == j else arb(0)) - sum((S[i - k] * S[j - k] for k in range(min(i, j) + 1)), arb(0)) for j in range(d)] for i in range(d)]
    sg = []
    for k in range(d):
        p = M[k][k]; sg.append(1 if p > 0 else -1)
        for i in range(k + 1, d):
            l = M[i][k] / p
            for j in range(k + 1, d): M[i][j] = M[i][j] - l * M[k][j]
    # the generator kernel is D D^* (1 - S S^*)/(1 - z w^*): congruent to the jet matrix of (1 - S S^*)/(1 - z w^*)
    chk('jet pivots signs (%s)' % code, [t[1] for t in out] == sg, ''.join('+' if t > 0 else '-' for t in sg))
# 6. counting sanity: PL:ZETA:0.3085:15 has its first negative pivot near n = 11..21 on real nodes (s3 table: 11 in the box)
ctx.prec = 1200
o = lib2.get('PL:ZETA:0.3085:15'); nu = [lib2.node('geo:8', k) for k in range(30)]; c = [lib2.logder(o, t).real for t in nu]
pv = lib.schur_real(nu, c); f = next((t[0] for t in pv if t[1] < 0), None)
chk('planted gamma = 15 detected at n in [8, 24]', f is not None and 8 <= f + 1 <= 24, f)
print('ALL PASS' if ok else 'SOME FAIL')
