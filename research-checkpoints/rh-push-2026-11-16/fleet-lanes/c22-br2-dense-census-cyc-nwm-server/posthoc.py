"""Post hoc diagnostics of statistic 1 (NOT pre-registered): where the registered cut fails for CYC, two variants, ETA check."""
import numpy as np, glob, json, math, os
L3 = math.log(3.0); out = {}
z = np.load('out1/CYC.npz'); t, beta, cls = z['t'], z['beta'], z['cls']
dev = np.abs(beta - np.round(beta)); bad = dev > 0.02
dpole = np.abs(t - (2 * math.pi / L3) * np.round(t * L3 / (2 * math.pi)))
print('CYC failing heights', int(bad.sum()), 'classes', np.bincount(cls[bad], minlength=4).tolist(), 'max t among failing', float(t[bad].max()),
      'max distance to a pole of 1/(1-w) among failing', float(dpole[bad].max()), 'min distance among passing non-pole', float(dpole[(~bad) & (cls != 3)].min()))
print('CYC: heights with dist < 0.0125:', int((dpole < 0.0125).sum()), ' failing among dist >= 0.0125:', int((bad & (dpole >= 0.0125)).sum()))
def variants(f):
    z = np.load(f); t, y, js = z['t'], z['y'], z['js']
    def sl(k):
        x = js[-k:] * math.log(2.0); xc = x - x.mean()
        return (y[:, -k:] * xc).sum(axis=1) / (xc ** 2).sum()
    b11 = sl(min(11, len(js))); b4 = sl(4)
    fi = lambda b, m: float((np.abs(b - np.round(b))[m] <= 0.02).mean()) if m.sum() else None
    al = np.ones(len(t), bool)
    return dict(n=len(t), registered=fi(b11, al), t_ge_half=fi(b11, t >= 0.5), n_t_ge_half=int((t >= 0.5).sum()), terminal4=fi(b4, al), terminal4_t_ge_half=fi(b4, t >= 0.5),
                sd_beta=float(b11.std()), med_abs_beta=float(np.median(np.abs(b11))), sd_y_last=float(y[:, -1].std()), sd_y_generic=float(y[z['cls'] == 1, -1].std()),
                sd_y_generic_by_j=[float(v) for v in y[z['cls'] == 1].std(axis=0)])
for f in sorted(glob.glob('out1/*.npz')):
    n = os.path.basename(f)[:-4]; out[n] = variants(f)
    v = out[n]; print(n, 'reg=%.4f tge.5=%.4f(n=%d) term4=%.4f term4&tge.5=%.4f sd_beta=%.3g sd_y_gen=%.3g' % (v['registered'], v['t_ge_half'], v['n_t_ge_half'], v['terminal4'], v['terminal4_t_ge_half'], v['sd_beta'], v['sd_y_generic']))
# ETA against the eta transformation at t = 2 pi a / b
z = np.load('out1/ETA.npz'); t, y, js = z['t'], z['y'], z['js']
chk = []
for b in (1, 2, 3, 4, 5, 7):
    for a in range(1, 40):
        if math.gcd(a, b) != 1: continue
        i = np.nonzero(np.abs(t - 2 * math.pi * a / b) < 1e-12)[0]
        if len(i):
            i = i[0]
            for ji in (4, 9, 14):
                d = 2.0 ** -int(js[ji])
                pred = math.pi ** 2 / (6 * b * b * d) - 0.5 * math.log(2 * math.pi / (b * d)) - d / 24
                chk.append(dict(a=a, b=b, j=int(js[ji]), y=float(y[i, ji]), pred=pred, diff=float(y[i, ji] - pred)))
            break
for c in chk: print('ETA', c)
out['_eta'] = chk
json.dump(out, open('posthoc.json', 'w'), indent=1)
