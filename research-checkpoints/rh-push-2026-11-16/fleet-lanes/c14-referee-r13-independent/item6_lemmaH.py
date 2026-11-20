# Lemma H of c13-noncone-kernel-separator-search: targeted check on grid rows of the three covered types.
import sys, os, json, itertools, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from fractions import Fraction
from flint import arb, acb
import item6_kern as K
LANE = sys.argv[1]
rng = np.random.Generator(np.random.PCG64(20261120))
COLS = list(itertools.combinations(range(1, 14), 2))
taus = [Fraction(-1, 50), Fraction(-1, 10), Fraction(-1, 2), Fraction(-166, 100), Fraction(-5), Fraction(8), Fraction(60)]
res = collections.defaultdict(collections.Counter)
ident = 0.0
K.setprec(256)
LAD = [256, 1024, 4096, 16384]


def sgn(fam, par, base):
    return K.sign_of(fam, par, base, LAD)[0]


z = np.load(os.path.join(LANE, 'out', 'params_D3a.npz'))
idx = np.nonzero(z['m'] == 2)[0]
for r in rng.choice(idx, size=80, replace=False):
    par = dict(m=2, cols=COLS[int(z['ci'][r])], u0=z['u0'][r], h=z['h'][r], g=z['g'][r])
    sz = sgn('minor', par, K.zeta_k3)
    K.setprec(4096)
    # hypothesis K > 0 at the read points
    pts = [K.Pt(K.fr(par['u0']) + i * K.fr(par['h']), int(n), 1) for i in range(2) for n in par['cols']]
    kv = [K.zeta_k3(p)[0].real for p in pts]
    res['minor2']['K3>0 at 4 points' if all(v > 0 for v in kv) else 'K3 not >0'] += 1
    for tau in taus:
        sh = sgn('minor', par, lambda u, tau=tau: K.heat_k3(u, tau))
        K.setprec(4096)
        vh = K.evaluate('minor', par, lambda u, tau=tau: K.heat_k3(u, tau)).real
        res['minor2']['tau=%s zeta%+d heat%+d' % (float(tau), sz, sh)] += 1
        # identity (i): det = e^(tau A/4)(e^(tau d/2) K11 K22 - K12 K21)
        u1, u2 = float(pts[0]), float(pts[2])
        fu = [p.b() for p in pts]
        A = fu[1] ** 2 + fu[2] ** 2
        d = (fu[2] - fu[0]) * (fu[1] - fu[0])
        t = arb(tau.numerator) / tau.denominator
        rhs = (t * A / 4).exp() * ((t * d / 2).exp() * kv[0] * kv[3] - kv[1] * kv[2])
        if vh != 0 and all(v > 0 for v in kv):
            ident = max(ident, float(abs(vh - rhs).upper() / abs(vh).lower()))
for fam, cond in (('D3b-F1', lambda y, r: y['p'][r] == 0 and y['lam'][r] >= 1), ('D3b-F2', lambda y, r: y['p'][r] == 0 and y['lam'][r] == 1)):
    y = np.load(os.path.join(LANE, 'out', 'params_%s.npz' % fam))
    idx = np.array([r for r in range(len(y['p'])) if cond(y, r)])
    for r in rng.choice(idx, size=80, replace=False):
        par = dict(p=0, u=y['u'][r], h=y['h'][r], lam=y['lam'][r], mu=y['mu'][r])
        f = fam.split('-')[1]
        sz = sgn(f, par, K.zeta_k3)
        for tau in taus:
            sh = sgn(f, par, lambda u, tau=tau: K.heat_k3(u, tau))
            res[fam]['tau=%s zeta%+d heat%+d' % (float(tau), sz, sh)] += 1
out = {k: dict(sorted(v.items())) for k, v in res.items()}
out['identity_i_max_rel_defect'] = ident
json.dump(out, open(sys.argv[2], 'w'), indent=1)
print(json.dumps(out, indent=1))
