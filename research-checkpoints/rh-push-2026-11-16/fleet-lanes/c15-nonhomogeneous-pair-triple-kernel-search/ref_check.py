"""c15 referee checks (independent of nsolve.py and of the float64 kernels where stated).
R1: brute-force threshold scan against nsolve on random nodes (pair families).
R2: mpmath values of R, L2, L3 for zeta, a complex chi, the HEAT pair without polar terms and a split T-NR pair.
R3: closed form of the two-member Phi table: phi_(1/2) * phi_(3/2) (t) = (1/2) e^(t/2) exp(-2 pi e^t).
usage: ref_check.py <outdir with *_nodes.npz> <out.json>"""
import json
import math
import sys
import numpy as np
import mpmath as mp
import kern
import jk
import jobj
import nobj
import nf
import nsolve
import nc

out = {}
P = nobj.build({})
G = np.array([p.group for p in P])
D = nobj.gidx(G)
PA = np.concatenate((D['P'], D['PX']))


def brute(V1, E1, V2, E2, cl):
    """is there lam with all positives one decided sign and a decided opposite training member in each class?"""
    tr = np.concatenate([PA] + [D['C%d' % k] for k in cl])
    with np.errstate(all='ignore'):
        r = V1[tr] / V2[tr]
    r = np.sort(r[np.isfinite(r)])
    if len(r) == 0:
        return False
    cand = np.concatenate(([r[0] - 1.0], 0.5 * (r[1:] + r[:-1]), [r[-1] + 1.0]))
    for lam in cand:
        v = V1 - lam * V2
        tol = E1 + abs(lam) * E2
        s = np.where(np.isfinite(v) & (np.abs(v) > tol), np.sign(v), 0)
        sp = s[PA]
        for sg in (1, -1):
            if (sp == sg).all() and all((s[D['C%d' % k]] == -sg).any() for k in cl):
                return True
    return False


rng = np.random.Generator(np.random.PCG64(157000))
res = {}
for g in ('g0', 'g1', 'g2'):
    nd = np.load(sys.argv[1] + '/' + g + '_nodes.npz')
    ii = rng.choice(len(nd['u']), 400, replace=False)
    V = nf.eval_group(g, nd['u'][ii], nd['h'][ii], P)
    for f in nf.GROUPS[g]:
        V1, E1, V2, E2 = nf.v2full(V[f])
        agree = dis = nfe = 0
        for name, cl in (('PA/all', nobj.ALLC), ('PA/FE', nobj.FE_CLASSES)):
            cls = [D['C%d' % k] for k in cl]
            r, e, und, sg2 = nsolve.ratio(V1, E1, V2, E2)
            fe = np.zeros(len(ii), dtype=bool)
            fo = np.zeros(len(ii), dtype=bool)
            for s in (1, -1):
                fe |= nsolve.solve_sign(r, e, und, sg2, s, PA, cls, False)[2].any(1)
                fo |= nsolve.solve_sign(r, e, und, sg2, s, PA, cls, True)[2].any(1)
            for i in range(len(ii)):
                b = brute(V1[i], E1[i], V2[i], E2[i], cl)
                if fe[i] != fo[i]:
                    continue                       # float64-undecided node: not compared
                agree += int(b == fe[i])
                dis += int(b != fe[i])
                nfe += int(fe[i])
        res[f] = dict(compared=agree + dis, disagree=dis, feasible_among_compared=nfe)
        print('R1', f, res[f], flush=True)
out['R1_brute_force_vs_nsolve'] = res

# R2
mp.mp.dps = 40


def kz(u, pol=True):
    y = mp.e ** (2 * abs(u))
    if pol:
        return mp.e ** (abs(u) / 2) * (1 + 2 * mp.nsum(lambda n: mp.e ** (-mp.pi * n * n * y), [1, mp.inf]))
    return mp.e ** (abs(u) / 2) * 2 * mp.nsum(lambda n: (4 * (mp.pi * n * n * y) ** 2 - 6 * mp.pi * n * n * y) * mp.e ** (-mp.pi * n * n * y), [1, mp.inf])


def kchi(c, u):
    v = abs(u)
    s = mp.mpf(0)
    for n in range(1, 200):
        x = complex(c.vals[n % c.q])
        if abs(x) > 0.5:
            s += 2 * mp.mpc(x) * n ** c.d * mp.e ** (-mp.pi * n * n * mp.e ** (2 * v) / c.q)
    val = mp.conj(mp.mpc(complex(c.omega))) * mp.e ** ((mp.mpf(1) / 2 + c.d) * v) * s
    return val if u >= 0 else mp.conj(val)


tr = jobj.char_objs(3, 13)
by = {c.name: c for c in tr}
c5 = by['chi5.2c']
c7 = by['chi7.2c']
tests = []
worst = 0.0
n2 = 0
for u, h in ((0.3, 0.2), (-0.7, 0.45), (1.1, 0.1), (0.05, 0.6)):
    # pair (zeta, chi5.2c): families a1-with, b1-Aw, b1-B, b3-with; group g2: b2-with
    pr = jobj.Pair('P', jk.W(kern.ZETA), jk.W(c5))
    tau = -0.5
    ph = jobj.Pair('C4', jk.W(kern.Heat(tau, 'h')), jk.HeatX(c5, tau, 'hx'))
    p0 = nobj.split_primes(c7, 1)[0]
    cc = nobj.tnr_c(p0, 0.5)
    pt = jobj.Pair('C2', jk.W(kern.TNR(p0, cc, 't')), jk.tnr_twist(c7, p0, cc, 'tx'))
    l = mp.log(p0)
    la = lambda z: mp.log(abs(z))
    d2 = lambda f: la(f(u - h)) - 2 * la(f(u)) + la(f(u + h))
    d3 = lambda f: la(f(u + 1.5 * h)) - 3 * la(f(u + 0.5 * h)) + 3 * la(f(u - 0.5 * h)) - la(f(u - 1.5 * h))
    g = lambda x: mp.e ** (tau * x * x / 4)
    ref = {
        ('P', 'a1-with'): mp.re(kchi(c5, u) / kz(u)),
        ('P', 'b1-Aw'): d2(kz), ('P', 'b1-Ao'): d2(lambda x: kz(x, False)), ('P', 'b1-B'): d2(lambda x: kchi(c5, x)),
        ('P', 'b2-with'): d3(kz),
        ('H', 'b1-Ao'): d2(lambda x: g(x) * kz(x, False)), ('H', 'b1-B'): d2(lambda x: g(x) * kchi(c5, x)),
        ('T', 'b1-Aw'): d2(lambda x: kz(x + l) + cc * kz(x) + kz(x - l)),
        ('T', 'b1-B'): d2(lambda x: kchi(c7, x + l) + cc * kchi(c7, x) + kchi(c7, x - l)),
        ('T', 'b2-with'): d3(lambda x: kz(x + l) + cc * kz(x) + kz(x - l)),
    }
    ua, ha = np.array([u]), np.array([h])
    got = {}
    for lab, pp in (('P', pr), ('H', ph), ('T', pt)):
        for gname in ('g0', 'g1', 'g2'):
            V = nf.eval_group(gname, ua, ha, [pp], nf.GROUPS[gname])
            for f, v in V.items():
                got[(lab, f)] = float(v[0][0, 0])
    for k, v in ref.items():
        dev = abs(got[k] - float(v)) / max(1.0, abs(float(v)))
        worst = max(worst, dev)
        n2 += 1
out['R2_mpmath'] = dict(values=n2, worst_abs_or_rel_difference=worst, split_prime_chi7=int(p0))
print('R2', out['R2_mpmath'], flush=True)

# R3
F, Fd, tcut = nc.table(0.5, False, [1.5])
t = -19.0 + nc.DT * np.arange(len(F))
exact = 0.5 * np.exp(t / 2 - 2 * math.pi * np.exp(t))
sel = (t > -15) & (t < 1.5)
out['R3_phi_closed_form'] = dict(max_rel_diff=float(np.max(np.abs(F[sel] - exact[sel]) / exact[sel])),
                                 hermite_midpoint_max_rel=float(np.max(np.abs(nc.herm((F, Fd, tcut), t[sel] + nc.DT / 2) - 0.5 * np.exp((t[sel] + nc.DT / 2) / 2 - 2 * math.pi * np.exp(t[sel] + nc.DT / 2))) / exact[sel])))
print('R3', out['R3_phi_closed_form'], flush=True)
json.dump(out, open(sys.argv[2], 'w'), indent=1)
