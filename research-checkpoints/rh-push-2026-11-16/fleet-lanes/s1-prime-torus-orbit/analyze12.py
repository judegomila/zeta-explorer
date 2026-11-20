"""Tables for tests 1 and 2 from a t12 npz file. Usage: analyze12.py file.npz [out.json]"""
import sys, json, math
import numpy as np

z = np.load(sys.argv[1]); m = json.loads(str(z['meta']))
bands = m['bands']; FAM = m['FAM']; SIG = m['SIG']; cuts = m['cuts']; CS = m['CS']; Ncuts = m['Ncuts']
orb = [b for b in bands if b != 'HAAR']
out = {'meta': m, 'test1': {}, 'test2': {}}


def ks(x, y):
    x = np.sort(x); y = np.sort(y); allv = np.concatenate([x, y])
    d = np.abs(np.searchsorted(x, allv, side='right') / len(x) - np.searchsorted(y, allv, side='right') / len(y)).max()
    en = math.sqrt(len(x) * len(y) / (len(x) + len(y))); lam = (en + 0.12 + 0.11 / en) * d
    p = 2 * sum((-1) ** (k - 1) * math.exp(-2 * k * k * lam * lam) for k in range(1, 101))
    return float(d), float(min(1.0, max(0.0, p)))


def cmp(x, h):
    """window statistic x (orbit band) against h (Haar): mean, z-score of the difference of means, KS p-value."""
    se = math.sqrt(x.var(ddof=1) / len(x) + h.var(ddof=1) / len(h))
    d, p = ks(x, h)
    return dict(mean=float(x.mean()), haar=float(h.mean()), z=float((x.mean() - h.mean()) / se), ks_p=p)


def series(key, sel):
    """dict band -> per-window array"""
    return {b: z[f'P|{b}|{key}'][sel] for b in bands}


ci = len(cuts) - 1
rows1 = {}
for si in (0, 1, 2):
    for f in FAM:
        fi = FAM.index(f)
        for stat in ('lmax', 'lmin'):
            S = series(stat, (slice(None), fi, si, ci))
            rows1[f'{f}|sig={SIG[si]}|{stat}'] = {b: cmp(S[b], S['HAAR']) for b in orb}
        V = {b: float((z[f'P|{b}|m2'][:, fi, si, ci] - 0).mean() - (z[f'P|{b}|m1'][:, fi, si, ci].mean()) ** 2) for b in bands}
        rows1[f'{f}|sig={SIG[si]}|var'] = V
    for name, kmax, kmin in (('DH', 'dhmax', 'dhmin'), ('TNR', 'tnrmax', 'tnrmin')):
        for stat, key in (('lmax', kmax), ('lmin', kmin)):
            S = series(key, (slice(None), si, ci))
            rows1[f'{name}|sig={SIG[si]}|{stat}'] = {b: cmp(S[b], S['HAAR']) for b in orb}
    if si in (1, 2) and len(SIG) > 3:
        for stat, key in (('lmax', 'eamax'), ('lmin', 'eamin')):
            S = series(key, (slice(None), si - 1, ci))
            rows1[f'EA|sig={SIG[si]}|{stat}'] = {b: cmp(S[b], S['HAAR']) for b in orb}
    hs = m['HS'].index(SIG[si])
    for stat, key in (('lmax', 'hmax'), ('lmin', 'hmin')):
        S = {b: z[f'C|{b}|{key}'][:, hs] for b in bands}
        rows1[f'HEAT|sig={SIG[si]}|{stat}'] = {b: cmp(S[b], S['HAAR']) for b in orb}
out['test1']['rows'] = rows1
# Haar law of the window maximum against the cutoff (zeta family) and differences between families at Haar level
out['test1']['haar_max_vs_cut'] = {f'sig={SIG[si]}': [float(z['P|HAAR|lmax'][:, 0, si, c].mean()) for c in range(len(cuts))] for si in (0, 1, 2)}
out['test1']['haar_var_vs_cut'] = {f'sig={SIG[si]}': [float(z['P|HAAR|m2'][:, 0, si, c].mean() - z['P|HAAR|m1'][:, 0, si, c].mean() ** 2) for c in range(len(cuts))] for si in (0, 1, 2)}
hz = {}
for si in (0, 1, 2):
    ref = z['P|HAAR|lmax'][:, 0, si, ci]
    d = {}
    for f in FAM[1:]:
        d[f] = cmp(z['P|HAAR|lmax'][:, FAM.index(f), si, ci], ref)
    d['DH'] = cmp(z['P|HAAR|dhmax'][:, si, ci], ref); d['TNR'] = cmp(z['P|HAAR|tnrmax'][:, si, ci], ref)
    d['DH_min'] = cmp(z['P|HAAR|dhmin'][:, si, ci], z['P|HAAR|lmin'][:, 0, si, ci])
    d['TNR_min'] = cmp(z['P|HAAR|tnrmin'][:, si, ci], z['P|HAAR|lmin'][:, 0, si, ci])
    hz[f'sig={SIG[si]}'] = d
out['test1']['haar_family_vs_zeta'] = hz

# ---- test 2
rms = np.array(m['rms']); tri = np.array(m['tri'])
t2 = {}
for f in FAM + ['TNR']:
    for b in bands:
        if f == 'TNR':
            mx = z[f'P|{b}|fmax_tnr'].max(axis=0); ms = z[f'P|{b}|fms_tnr'].mean(axis=0)
        else:
            mx = z[f'P|{b}|fmax'][:, FAM.index(f), :].max(axis=0); ms = z[f'P|{b}|fms'][:, FAM.index(f), :].mean(axis=0)
        t2[f'primes|{f}|{b}'] = dict(sup_over_rms=(mx / rms).tolist(), sup_over_torus_sup=(mx / tri).tolist(), meansq_over_rms2=(ms / rms ** 2).tolist())
out['test2']['prime_only'] = t2
out['test2']['torus_sup_over_rms'] = (tri / rms).tolist()
l1 = np.array(m['l1']); l2 = np.array(m['l2'])
t2c = {}
for i, f in enumerate(CS):
    for b in bands:
        mx = z[f'C|{b}|cmax'][:, i, :].max(axis=0); ms = z[f'C|{b}|cms'][:, i, :].mean(axis=0)
        gro = math.log(mx[-1] / mx[2]) / math.log(Ncuts[-1] / Ncuts[2]) if len(Ncuts) > 3 else None
        t2c[f'full|{f}|{b}'] = dict(sup=mx.tolist(), sup_over_l2=(mx / l2[i]).tolist(), sup_over_l1=(mx / l1[i]).tolist(), meansq_over_l2sq=(ms / l2[i] ** 2).tolist(), growth_exponent=gro)
out['test2']['full_log_derivative'] = t2c
out['test2']['l2'] = m['l2']; out['test2']['l1'] = m['l1']
of = sys.argv[2] if len(sys.argv) > 2 else sys.argv[1].replace('.npz', '_tables.json')
json.dump(out, open(of, 'w'), indent=1)


def fmt(d):
    return ' '.join(f"{b}:{d[b]['mean']:.3f}(z{d[b]['z']:+.1f},p{d[b]['ks_p']:.2g})" for b in orb) + f" | haar {d[orb[0]]['haar']:.3f}"


print('TEST 1: window maximum / minimum of log|F_P| (cut = P); per band mean (z against Haar, KS p)')
for k, v in rows1.items():
    if k.endswith('var'):
        print(f'{k:28s}', ' '.join(f'{b}:{v[b]:.3f}' for b in bands))
    elif 'lmax' in k or k.startswith(('DH', 'TNR', 'EA', 'HEAT')):
        print(f'{k:28s}', fmt(v))
print('Haar max vs cut', out['test1']['haar_max_vs_cut']); print('Haar var vs cut', out['test1']['haar_var_vs_cut'])
print('Haar family vs zeta (max):', {s: {f: (round(v['mean'], 3), round(v['z'], 1), float(f"{v['ks_p']:.2g}")) for f, v in d.items()} for s, d in hz.items()})
print('\nTEST 2 prime-only sup|f_N|/rms_N over all windows; cuts', cuts, 'torus sup/rms', np.round(tri / rms, 2))
for k, v in t2.items():
    print(f'{k:26s}', np.round(v['sup_over_rms'], 3), 'msq', np.round(v['meansq_over_rms2'], 3))
print('\nTEST 2 full log-derivative coefficient sets: sup|f_N| / l2_N; Ncuts', Ncuts)
for k, v in t2c.items():
    print(f'{k:22s}', np.round(v['sup_over_l2'], 3), 'msq', np.round(v['meansq_over_l2sq'], 3), 'sup', np.round(v['sup'], 2), 'growth', None if v['growth_exponent'] is None else round(v['growth_exponent'], 3))
