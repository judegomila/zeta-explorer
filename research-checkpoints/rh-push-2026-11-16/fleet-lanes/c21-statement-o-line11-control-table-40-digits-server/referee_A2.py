"""DH, row P8: pointwise parts recomputed with mpmath (zeros by Newton from 4-digit starts, Q_sym, Q_gen, W_R, pair formula).
The contour integral C_R is NOT recomputed here (the full mpmath recomputation, referee.py A, was stopped after 105 minutes);
the hybrid cell uses the Arb value of C_R read from the table."""
import json, re, sys
import mpmath as mp
mp.mp.dps = 60
T = json.load(open(sys.argv[1]))['controls']['DH']; j = mp.mpc(0, 1)
kap = (mp.sqrt(10 - 2*mp.sqrt(5)) - 2)/(mp.sqrt(5) - 1)
def f(s, d=0):
    # f = 5^-s sum_a c_a zeta(s, a/5): derivatives by the product rule on 5^-s and Hurwitz derivatives
    co = [1, kap, -kap, -1]; l5 = mp.log(5); tot = 0
    for k in range(d + 1):
        hz = sum(co[a]*mp.zeta(s, mp.mpf(a + 1)/5, k) for a in range(4))
        tot += mp.binomial(d, k)*(-l5)**(d - k)*hz
    return tot*mp.power(5, -s)
def L(z):
    s = z + mp.mpf(1)/2
    return mp.log(5/mp.pi)/2 + mp.digamma((s + 1)/2)/2 + f(s, 1)/f(s)
zs = []
for st in (mp.mpc(0.3085, 85.6993), mp.mpc(-0.3085, 85.6993)):
    z = st
    for it in range(40):
        z = z - f(z + 0.5)/f(z + 0.5, 1)
    zs.append(z)
r0 = T['config']['rates'][0]; z = mp.mpc(mp.mpf(r0[0]), -mp.mpf(r0[1])); x = z.real
h = lambda s: 1/((s + z)*(mp.conj(z) - s))
W = sum(h(r) for r in zs); Wp = sum((x - r.real)/(x*abs(z - mp.conj(r))**2) for r in zs)
Qs = (L(z) + mp.conj(L(z)))/(2*x); Qg = (L(mp.conj(z)) - L(-z))/(2*x)
def arbmid(s):
    out = []
    for p in s.replace(' i', '').split(' + '):
        p = p.strip(); m = re.match(r'\[?\s*(-?[0-9.]+(?:e[-+]?[0-9]+)?)', p)
        out.append(mp.mpf(m.group(1)) if m and not p.startswith('[+/-') else mp.mpf(0))
    return mp.mpc(out[0], out[1] if len(out) > 1 else 0)
row = T['narrow']['rows']['P8']; Carb = arbmid(row['C_R'])
res = dict(zeros=[mp.nstr(r, 40) for r in zs], absf_at_zeros=[mp.nstr(abs(f(r + 0.5)), 5) for r in zs], pair_symmetry=mp.nstr(abs(zs[0] + mp.conj(zs[1])), 5),
           W=mp.nstr(W, 45), W_minus_arb=mp.nstr(abs(W - arbmid(row['W_R'])), 5), Q_sym=mp.nstr(Qs, 45), Q_sym_minus_arb=mp.nstr(abs(Qs - arbmid(row['Q_sym'])), 5),
           Q_gen_minus_arb=mp.nstr(abs(Qg - arbmid(row['Q_gen'])), 5), sym_defect=mp.nstr(abs(Qs - Qg), 5), W_minus_pair=mp.nstr(abs(W - Wp), 5),
           hybrid_cell_sym=mp.nstr(abs(Qs - W + Carb), 5), note='C_R taken from the Arb table (not recomputed)')
print(json.dumps(res, indent=1)); json.dump(res, open(sys.argv[2], 'w'), indent=1)
