"""Validation of the flow code on cases with a known answer.
(a) F(z) = (z^2 + Y^2) cos(c z): Lambda = (sqrt(1 + 4 c^2 Y^2) - 1)/(4 c^2) (node strip-ladder-kappa). Pair +-iY and the lattice (k+1/2) pi/c.
(b) isolated pair: landing at Y^2/2.
(c) HEAT table of the battery (H_{-0.1}): the flow run forward by 0.1 must return the zeta zeros; every pair lands before 0.1."""
import sys, json, math, numpy as np, hl
B = sys.argv[1] if len(sys.argv) > 1 else '../c12-control-battery-harness/tables/'
out = {}
# (b)
f = hl.Flow(np.zeros(0), np.array([0.0]), np.array([-4 * 0.7 ** 2]), mirror=False).run(1.0, verbose=False)
out['isolated'] = dict(Y=0.7, land=float(f.land[0]), exact=0.7 ** 2 / 2)
# (a)
for c, Y in ((1.0, 0.6), (3.0, 0.6), (0.3, 0.9)):
    K = 4000
    lat = (np.arange(-K, K) + 0.5) * math.pi / c
    Hc = K * math.pi / c
    f = hl.Flow(lat, np.array([0.0]), np.array([-4 * Y * Y]), mirror=False, tail=('const', c / math.pi, Hc)).run(1.0, verbose=False)
    ex = (math.sqrt(1 + 4 * c * c * Y * Y) - 1) / (4 * c * c)
    out['witness c=%g Y=%g' % (c, Y)] = dict(land=float(f.land[0]), exact=ex, rel=float(f.land[0] / ex - 1), debruijn=Y * Y / 2, steps=f.steps)
# (c)
zeta = np.array(sorted(float(v) for v in json.load(open(B + 'zeros_ZETA.json'))['online'])) if 'online' in json.load(open(B + 'zeros_ZETA.json')) else None
if zeta is None:
    d = json.load(open(B + 'zeros_ZETA.json')); key = [k for k in d if isinstance(d[k], list)][0]; zeta = np.array(sorted(float(v) for v in d[key]))
for tag, t0 in (('HEAT--0.1', 0.1),):
    d = json.load(open(B + 'zeros_%s.json' % tag))
    on = np.array(sorted(float(v) for v in d['online'])); off = np.array([[float(a), float(b)] for a, b, *_ in d['offline']])
    H = 2 * 2000.0
    f = hl.Flow(2 * on, 2 * off[:, 1], -4 * (2 * off[:, 0]) ** 2, mirror=True, tail=(1, math.log(1 / (4 * math.pi)), H))
    f.run(t0, stops=(t0,), verbose=False, stop_when_landed=False)
    x, y = f.positions(f.s)
    g = np.sort(x) / 2
    m = min(len(g), len(zeta)); sel = zeta[:m] < 1000
    dif = g[:m][sel] - zeta[:m][sel]
    out[tag] = dict(n_on=len(on), n_pairs=len(off), n_after=len(g), n_zeta=len(zeta), max_im_after=float(np.abs(y).max()),
                    landed=int((~np.isnan(f.land)).sum()), last_landing=float(np.nanmax(f.land)), first_landing=float(np.nanmin(f.land)),
                    max_abs_diff_below_1000=float(np.abs(dif).max()), rms_diff_below_1000=float(dif.std()), n_below_1000=int(sel.sum()),
                    max_abs_diff_below_500=float(np.abs(dif[zeta[:m][sel] < 500]).max()), steps=f.steps)
print(json.dumps(out, indent=1)); hl.jdump(out, 'out/c1_validate.json')
