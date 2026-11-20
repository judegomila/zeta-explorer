"""Analysis of klein.py output.  usage: klein_an.py FILE.npz OUT.json [tol] [amp]
A mode k enters the convexity statistics of a triple only if its energy on all three circles exceeds amp^2 times the largest
mode energy of the triple (amp = 1e-8 by default; the float64 floor of a mode is about 1e-13 of the largest)."""
import sys, json, math
import numpy as np

def main():
    d = np.load(sys.argv[1]); meta = json.loads(str(d['meta'])); H = d['H']; tol = float(sys.argv[3]) if len(sys.argv) > 3 else 1e-6
    amp = float(sys.argv[4]) if len(sys.argv) > 4 else 1e-8
    kmax = meta['kmax']; kap1 = meta['kappa1']; nc = H.shape[0]
    k = np.arange(1, kmax + 1)
    cp = H[:, 1:kmax + 1] / (2j * math.pi * k)                    # c_k, k > 0
    cm = H[:, :kmax:-1][:, :kmax] / (2j * math.pi * (-k))          # c_{-k}
    a = (cp + np.conj(cm)) / 2; b = (cp - np.conj(cm)) / 2j        # modes k > 0 of log|F| and arg F
    v = np.array(meta['v']); specs = meta['specs']
    inn = [i for i in range(nc) if not specs[i].startswith('ax')]
    inn.sort(key=lambda i: v[i])
    out = dict(file=sys.argv[1], code=meta['code'], L=meta['L'], r=meta['r'], N=meta['N'], kmax=kmax, tol=tol, amp=amp, circles=[], pairs=[], triples=[], A_parity=[])
    for i in range(nc):
        out['circles'].append(dict(spec=specs[i], v=v[i], xmin=meta['xmin'][i], winding=round(meta['wind'][i][0], 4), max_abs_t=meta['maxabs_t'][i],
                                   alias_rel=float(abs(H[i, kmax]) / np.abs(H[i]).max())))
    # transport between consecutive circles
    for i1, i2 in zip(inn[:-1], inn[1:]):
        dv = v[i2] - v[i1]; dec = np.exp(-kap1 * k * dv)
        scale = np.abs(cp[i1]).max()
        good = (np.abs(cp[i1]) * dec > 1e-11 * scale)
        resid = np.abs(cp[i2] - cp[i1] * dec) / (np.abs(cp[i1]) * dec + 1e-300)
        good2 = (np.abs(cm[i2]) * dec > 1e-11 * np.abs(cm[i2]).max())
        resid2 = np.abs(cm[i1] - cm[i2] * dec) / (np.abs(cm[i2]) * dec + 1e-300)
        dw = meta['wind'][i2][0] - meta['wind'][i1][0]
        out['pairs'].append(dict(v1=v[i1], v2=v[i2], x1=meta['xmin'][i1], x2=meta['xmin'][i2], winding_jump=round(dw, 4),
                                 n_modes=int(good.sum()), transport_resid_median=float(np.median(resid[good])) if good.any() else None,
                                 transport_resid_max=float(resid[good].max()) if good.any() else None,
                                 transport_resid_k1=float(resid[0]), transport_resid_neg_max=float(resid2[good2].max()) if good2.any() else None))
    # convexity on consecutive triples (second divided difference)
    for i1, i2, i3 in zip(inn[:-2], inn[1:-1], inn[2:]):
        row = dict(v=[v[i1], v[i2], v[i3]], x=[meta['xmin'][i1], meta['xmin'][i2], meta['xmin'][i3]],
                   winding=[round(meta['wind'][i][0], 3) for i in (i1, i2, i3)])
        for name, m in (('logabs', a), ('arg', b)):
            E1, E2, E3 = (np.abs(m[i]) ** 2 for i in (i1, i2, i3))
            sc = np.maximum(np.maximum(E1, E2), E3)
            good = np.minimum(np.minimum(E1, E2), E3) > amp * amp * sc.max()
            h1 = v[i2] - v[i1]; h2 = v[i3] - v[i2]
            D2 = 2 * (E1 * h2 - E2 * (h1 + h2) + E3 * h1) / (h1 * h2 * (h1 + h2))
            rel = D2 * h1 * h2 / sc
            lE = [np.log(np.maximum(E, 1e-300)) for E in (E1, E2, E3)]
            LD2 = (lE[0] * h2 - lE[1] * (h1 + h2) + lE[2] * h1) / (h1 + h2)        # second difference of log E (scaled)
            if not good.any():
                row[name] = dict(n_modes=0, nonconvex=0, min_rel_D2=None, first_nonconvex_k=None, not_logconvex=0, min_logD2=None, first_not_logconvex_k=None, k_range=None); continue
            row[name] = dict(k_range=[int(k[good][0]), int(k[good][-1])], n_modes=int(good.sum()), nonconvex=int((rel[good] < -tol).sum()), min_rel_D2=float(rel[good].min()),
                             first_nonconvex_k=int(k[good][rel[good] < -tol][0]) if (rel[good] < -tol).any() else None,
                             not_logconvex=int((LD2[good] < -tol).sum()), min_logD2=float(LD2[good].min()),
                             first_not_logconvex_k=int(k[good][LD2[good] < -tol][0]) if (LD2[good] < -tol).any() else None)
        out['triples'].append(row)
    # parity under A
    for i in range(nc):
        if specs[i].startswith('ax'):
            j = specs.index('x' + specs[i][2:]) if ('x' + specs[i][2:]) in specs else None
            if j is None: continue
            sg = (-1.0) ** k
            odd_a = (a[j] - sg * np.conj(a[i])) / 2; even_b = (b[j] + sg * np.conj(b[i])) / 2
            good = np.abs(a[j]) > 1e-9 * np.abs(a[j]).max()
            out['A_parity'].append(dict(spec=specs[j], odd_part_logabs_rel_max=float((np.abs(odd_a) / np.abs(a[j]))[good].max()),
                                        odd_part_logabs_rel_median=float(np.median((np.abs(odd_a) / np.abs(a[j]))[good])),
                                        even_part_arg_rel_max=float((np.abs(even_b) / (np.abs(b[j]) + 1e-300))[good].max()),
                                        seam_energy_arg_k1_10=[float(x) for x in np.abs(b[j][:10]) ** 2], n_modes=int(good.sum())))
    json.dump(out, open(sys.argv[2], 'w'), indent=1)
    for p in out['pairs']: print('pair x %.4g -> %.4g  wind jump %+.3f  transport resid median %.2e max %.2e (neg k max %.2e) modes %d' %
                                 (p['x1'], p['x2'], p['winding_jump'], p['transport_resid_median'] or -1, p['transport_resid_max'] or -1, p['transport_resid_neg_max'] or -1, p['n_modes']))
    for t in out['triples']: print('triple x', ['%.4g' % x for x in t['x']], 'wind', t['winding'], 'logabs nonconvex %d/%d (min %.2e) notlogconvex %d | arg nonconvex %d/%d (min %.2e) notlogconvex %d' %
                                   (t['logabs']['nonconvex'], t['logabs']['n_modes'], t['logabs']['min_rel_D2'] or 0, t['logabs']['not_logconvex'], t['arg']['nonconvex'], t['arg']['n_modes'], t['arg']['min_rel_D2'] or 0, t['arg']['not_logconvex']), 'k range', t['logabs'].get('k_range'))
    for p in out['A_parity']: print('A parity', p['spec'], 'odd part of log|F| rel max %.2e median %.2e; even part of arg rel max %.2e' % (p['odd_part_logabs_rel_max'], p['odd_part_logabs_rel_median'], p['even_part_arg_rel_max']))

if __name__ == '__main__':
    main()
