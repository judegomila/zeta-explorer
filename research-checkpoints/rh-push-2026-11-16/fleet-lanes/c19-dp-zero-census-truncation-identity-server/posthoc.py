# POST-HOC analysis (not pre-registered; written after the first two cells of the main run were read).
# Reason: the pre-registered z regresses log Q on log N_R inside the Haar ensemble, and zeta at theta' = 1 has fewer
# right zeros than any Haar draw, so that z extrapolates. Here each statistic is bias-corrected inside its own job by
# permutation (Q2: depths permuted among the zeros; Q1: phases of each prime permuted independently), which removes the
# 1/N_R noise floor, and the corrected value is compared with the Haar ensemble directly.
import json, glob, math, sys
import numpy as np
NPMAX = 1100000
CLS_ID = {'zeta': 0, 'TNR': 1, 'ZQ': 2, 'EA': 3, 'DH': 4, 'HQ2': 5}
PR = np.array([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47], dtype=float)
_c = {}
def twist(r):
    key = (r['cls'], r['kind'], r['idx'])
    if key not in _c:
        if r['kind'] == 'haar': v = 2 * math.pi * np.random.default_rng(770000 + 1000 * CLS_ID[r['cls']] + r['idx']).random(NPMAX)[:15]
        elif r['cls'] == 'chain': v = math.pi * np.random.default_rng(121000 + r['idx']).integers(0, 2, size=NPMAX)[:15].astype(float)
        else: v = np.zeros(15)
        _c[key] = v
    return _c[key]
def stats(r, rng, nperm=200):
    z = np.array(r['zeros_right'])
    if len(z) < 6: return None
    b = z[:, 0]; gam = r['t'] + 200.0 * r['w'] + z[:, 1]
    pr = PR[PR <= r['P']]; th = twist(r)[:len(pr)]
    e = np.exp(1j * (th[None, :] - np.outer(gam, np.log(pr)))); n = len(b)
    def q2(bb):
        d = bb - bb.mean(); return (np.abs((d[:, None] * e).mean(0)) ** 2).mean() / d.var()
    def q2p(bb):      # per prime, complex correlation vector
        d = bb - bb.mean(); return (d[:, None] * e).mean(0) / d.std()
    iu = np.triu_indices(len(pr), 1)
    def q1(ee):
        m = ee.mean(0)
        cm = (ee.T @ ee.conj()) / n - np.outer(m, m.conj()); cp = (ee.T @ ee) / n - np.outer(m, m)
        return (np.abs(cm[iu]) ** 2 + np.abs(cp[iu]) ** 2).mean()
    Q2 = q2(b); Q1 = q1(e)
    p2 = [q2(rng.permutation(b)) for _ in range(nperm)]
    p1 = []
    for _ in range(60):
        ee = np.stack([e[rng.permutation(n), k] for k in range(len(pr))], axis=1); p1.append(q1(ee))
    v = q2p(b)
    return {'N_R': n, 'Q2': Q2, 'Q2c': Q2 - np.mean(p2), 'Q2_permz': (Q2 - np.mean(p2)) / np.std(p2), 'Q1': Q1, 'Q1c': Q1 - np.mean(p1), 'Q1_permz': (Q1 - np.mean(p1)) / np.std(p1),
            'corr_re': v.real.tolist(), 'corr_im': v.imag.tolist(), 'sd_b': float(b.std()), 'mean_b': float(b.mean())}
rows = []
for f in sorted(glob.glob('resBC_*.jsonl')): rows += [json.loads(l) for l in open(f)]
rng = np.random.default_rng(4242)
for r in rows: r['ph'] = stats(r, rng)
cells = sorted({(r['t'], r['theta']) for r in rows})
out = []
def sel(t, th, cls, kind): return sorted([r for r in rows if r['t'] == t and r['theta'] == th and r['cls'] == cls and r['kind'] == kind and r['ph']], key=lambda r: (r['w'], r['idx']))
print('columns: class: mean corrected statistic over its windows/members [n]; Z = Welch two-sample statistic of the class values against its own Haar ensemble')
for t, th in cells:
    c = {'t': t, 'theta': th, 'held_out': t in (3e5, 3e7)}
    for st in ('Q2c', 'Q1c'):
        line = ' t=%g th=%.2f %s %s:' % (t, th, 'H' if c['held_out'] else 'D', st)
        for cls in ('zeta', 'chain', 'ZQ', 'TNR', 'EA', 'DH', 'HQ2'):
            base = 'zeta' if cls == 'chain' else cls
            hz = [r['ph'][st] for r in sel(t, th, base, 'haar')]
            v = [r['ph'][st] for r in sel(t, th, cls, 'real')]
            if len(hz) < 6 or not v: continue
            Z = (np.mean(v) - np.mean(hz)) / math.sqrt((np.var(v, ddof=1) if len(v) > 1 else np.var(hz, ddof=1)) / len(v) + np.var(hz, ddof=1) / len(hz))
            c['%s_%s' % (cls, st)] = {'n': len(v), 'mean': float(np.mean(v)), 'haar_mean': float(np.mean(hz)), 'haar_sd': float(np.std(hz, ddof=1)), 'haar_n': len(hz), 'Z': float(Z),
                                      'values': [float(x) for x in v]}
            line += ' %s %.4f [%d] (Haar %.4f +- %.4f) Z %.1f |' % (cls, np.mean(v), len(v), np.mean(hz), np.std(hz, ddof=1), Z)
        print(line)
    # per-prime depth-phase correlation, zeta against Haar and against the functional-equation heuristic
    zr = sel(t, th, 'zeta', 'real'); hr = sel(t, th, 'zeta', 'haar')
    if zr and hr:
        k = min(len(r['ph']['corr_re']) for r in zr + hr)
        c['zeta_corr_re_by_prime'] = np.mean([r['ph']['corr_re'][:k] for r in zr], 0).tolist()
        c['haar_corr_re_by_prime'] = np.mean([r['ph']['corr_re'][:k] for r in hr], 0).tolist()
        c['zeta_corr_im_by_prime'] = np.mean([r['ph']['corr_im'][:k] for r in zr], 0).tolist()
        c['haar_corr_im_by_prime'] = np.mean([r['ph']['corr_im'][:k] for r in hr], 0).tolist()
        c['zeta_sd_b'] = float(np.mean([r['ph']['sd_b'] for r in zr])); c['haar_sd_b'] = float(np.mean([r['ph']['sd_b'] for r in hr]))
        c['zeta_mean_b'] = float(np.mean([r['ph']['mean_b'] for r in zr])); c['haar_mean_b'] = float(np.mean([r['ph']['mean_b'] for r in hr]))
        print('    Re corr(depth, e_p) p=2,3,5,7: zeta %s | Haar %s ; sd(depth) zeta %.4f Haar %.4f; mean depth zeta %.4f Haar %.4f' % (
            np.round(c['zeta_corr_re_by_prime'][:4], 3), np.round(c['haar_corr_re_by_prime'][:4], 3), c['zeta_sd_b'], c['haar_sd_b'], c['zeta_mean_b'], c['haar_mean_b']))
    out.append(c)
json.dump(out, open('posthoc.json', 'w'), indent=1)
