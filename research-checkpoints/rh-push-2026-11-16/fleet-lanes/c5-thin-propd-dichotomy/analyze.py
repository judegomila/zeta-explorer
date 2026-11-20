"""analyze.py -- read rows.c aggregates (format 0x41354336).

Per scale Z and weight w:
  MS_w   = sum over rows 0 < N(m) <= Z of |C_w(Z; m)|^2                         (full enumeration)
  D      = sum over rows of the diagonal sum_{(c n, m) = 1} |coefficient|^2      (identical for all weights)
  x_w    = MS_w / D - 1   (off-diagonal part relative to the diagonal), se from the rows:
           se^2 = sum_m (|C_w(m)|^2 - D_m)^2 / D^2  -  (off-diagonal treated as mean-zero row noise; for the null
           weights iid, shuf95, d50 the measured x_w checks this error model)
  M_w    = sum_c mu(c) w(c) q_c^{-1/2} V(q_c/Z)   (from prep.py; Mertens-type sum over the squarefree part, n = 1)
Model tested:  x_w(Z) * D(Z) = kappa(Z) * M_w(Z)^2  with kappa(Z) the same for all multiplicative weights
(kappa calibrated on liou, and independently on d75).
Usage: python analyze.py test Z1 Z2 ... [--dir data] [--json out.json]
"""
import sys, os, json, math
import numpy as np
WEIGHTS = ['one', 'e99', 'e97', 'e95', 'e90', 'e60', 'rm95a', 'rm95b', 'liou', 'd75', 'd50', 'iid', 'shuf95', 'rm90']
BZERO = {'e99': 0.99, 'e97': 0.97, 'e95': 0.95, 'e90': 0.90, 'e60': 0.60, 'rm95a': 0.95, 'rm95b': 0.95, 'rm90': 0.90, 'liou': 1.0}

def load(path):
    import gzip, io
    if not os.path.exists(path) and os.path.exists(path + '.gz'):
        f0 = io.BytesIO(gzip.open(path + '.gz', 'rb').read())
    else:
        f0 = io.BytesIO(open(path, 'rb').read())
    def _fromfile(f, dtype, count):
        dt = np.dtype(dtype); return np.frombuffer(f.read(dt.itemsize * count), dtype=dt).copy()
    with f0 as f:
        h = _fromfile(f, '<i8', 8)
        assert h[0] == 0x41354337, hex(h[0])
        Z, Mmax, NW, NSH, NOD, NFL, rows = [int(x) for x in h[1:8]]
        ns = NSH * NOD * NFL
        sh = (NSH, NOD, NFL)
        cnt = _fromfile(f, '<i8', ns).reshape(sh)
        s2 = _fromfile(f, '<f8', ns * NW).reshape(sh + (NW,))
        s4 = _fromfile(f, '<f8', ns * NW).reshape(sh + (NW,))
        sx = _fromfile(f, '<f8', ns * NW).reshape(sh + (NW,))
        s1 = _fromfile(f, '<c16', ns * NW).reshape(sh + (NW,))
        sd = _fromfile(f, '<f8', ns * NW).reshape(sh + (NW,))
        d1 = _fromfile(f, '<f8', ns).reshape(sh)
        d2 = _fromfile(f, '<f8', ns).reshape(sh)
        xm = _fromfile(f, '<c16', ns * NW * NW).reshape(sh + (NW, NW))
        xd = _fromfile(f, '<f8', ns * NW * NW).reshape(sh + (NW, NW))
        xv = _fromfile(f, '<f8', ns * NW * NW).reshape(sh + (NW, NW))
    return dict(Z=Z, Mmax=Mmax, NW=NW, rows=rows, cnt=cnt, s2=s2, s4=s4, sx=sx, s1=s1, sd=sd, d1=d1, d2=d2, xm=xm, xd=xd, xv=xv)

def masks(d):
    sh = d['cnt'].shape
    allm = np.ones(sh, bool)
    o0 = np.zeros(sh, bool); o0[:, 0, :] = True
    pw = np.zeros(sh, bool); pw[:, 1:, :] = True
    return {'all': allm, 'sqfree': o0, 'powerful>1': pw}

def summarize(d, sel):
    n = int(d['cnt'][sel].sum())
    s2 = d['s2'][sel].sum(axis=0); s4 = d['s4'][sel].sum(axis=0); sd = d['sd'][sel].sum(axis=0); sx = d['sx'][sel].sum(axis=0)
    D = float(d['d1'][sel].sum()); D2 = float(d['d2'][sel].sum())
    x = s2 / D - 1
    sex = np.sqrt(np.maximum(s4 - 2 * sd + D2, 0)) / D
    R = s2 / s2[0]
    seR = np.sqrt(np.maximum(s4 - 2 * R * sx + R ** 2 * s4[0], 0)) / s2[0]
    return n, s2, D, x, sex, R, seR

def wfit(x, y, s):
    w = 1 / s ** 2
    xm = (w * x).sum() / w.sum(); ym = (w * y).sum() / w.sum()
    sxx = (w * (x - xm) ** 2).sum()
    b = (w * (x - xm) * (y - ym)).sum() / sxx
    a = ym - b * xm
    chi2 = float((w * (y - a - b * x) ** 2).sum()); dof = len(x) - 2
    seb = 1 / math.sqrt(sxx)
    return float(b), float(seb), chi2, dof, float(seb * math.sqrt(max(chi2 / max(dof, 1), 1.0))), float(a)

def main():
    args = sys.argv[1:]
    ddir = 'data'; jout = None
    if '--dir' in args: i = args.index('--dir'); ddir = args[i + 1]; del args[i:i + 2]
    if '--json' in args: i = args.index('--json'); jout = args[i + 1]; del args[i:i + 2]
    test = args[0]; Zs = [int(z) for z in args[1:]]
    D = {Z: load(os.path.join(ddir, f'agg_{test}_{Z}.bin')) for Z in Zs}
    side = {Z: json.load(open(os.path.join(ddir, f'in_{test}_{Z}.bin.side.json'))) for Z in Zs
            if os.path.exists(os.path.join(ddir, f'in_{test}_{Z}.bin.side.json'))}
    out = {'test': test, 'Z': Zs, 'weights': WEIGHTS, 'strata': {}}
    lz = np.log(np.array(Zs, float))
    for name in ('all', 'sqfree', 'powerful>1'):
        rec = {'rows': [], 'MS': [], 'D': [], 'x': [], 'sex': [], 'R': [], 'seR': []}
        print(f"\n=== test {test}, rows: {name} ===")
        print("x_w = MS_w/D - 1 in percent (se in percent)")
        print("       Z     rows  MS_one/Z      D/Z " + " ".join(f"{w:>12s}" for w in WEIGHTS))
        for Z in Zs:
            n, s2, Dg, x, sex, R, seR = summarize(D[Z], masks(D[Z])[name])
            for k, v in (('rows', n), ('MS', s2.tolist()), ('D', Dg), ('x', x.tolist()), ('sex', sex.tolist()), ('R', R.tolist()), ('seR', seR.tolist())): rec[k].append(v)
            print(f"{Z:8d} {n:8d} {s2[0] / Z:9.5f} {Dg / Z:8.5f} " + " ".join(f"{100 * x[w]:+6.2f}({100 * sex[w]:4.2f})" for w in range(len(WEIGHTS))))
        MS = np.array(rec['MS']); X = np.array(rec['x']); SX = np.array(rec['sex']); R = np.array(rec['R']); SR = np.array(rec['seR']); Dv = np.array(rec['D'])
        if len(Zs) >= 3:
            print("exponent in Z of MS_w (WLS on log MS_w, se from rows, scaled by sqrt(chi2/dof) when > 1) and of MS_w/MS_one:")
            rec['exp_MS'] = {}; rec['exp_ratio'] = {}
            for w in range(len(WEIGHTS)):
                relse = SX[:, w] / (1 + X[:, w])
                b, sb, chi2, dof, sbs, a = wfit(lz, np.log(MS[:, w]), relse)
                rec['exp_MS'][WEIGHTS[w]] = [b, sb, sbs, chi2, dof]
                line = f"   {WEIGHTS[w]:7s} MS: {b:.4f} +- {sbs:.4f} (chi2/dof {chi2:.1f}/{dof})"
                if w > 0:
                    b2, sb2, chi22, dof2, sbs2, a2 = wfit(lz, np.log(R[:, w]), SR[:, w] / R[:, w])
                    rec['exp_ratio'][WEIGHTS[w]] = [b2, sb2, sbs2, chi22, dof2]
                    pred = 2 * (BZERO[WEIGHTS[w]] - 11 / 12) if WEIGHTS[w] in BZERO else float('nan')
                    line += f"   ratio to one: {b2:+.4f} +- {sbs2:.4f} (chi2/dof {chi22:.1f}/{dof2}); asymptotic low-side-failure value 2(b-11/12) = {pred:+.4f}"
                print(line)
        if side and name == 'all':
            Mw = np.array([[side[Z]['mertens'][w] for w in WEIGHTS] for Z in Zs])
            rec['mertens'] = Mw.tolist()
            E = X * Dv[:, None]; SE = SX * Dv[:, None]
            il = WEIGHTS.index('liou'); i7 = WEIGHTS.index('d75')
            kap_l = E[:, il] / Mw[:, il] ** 2; skap_l = SE[:, il] / Mw[:, il] ** 2
            kap_7 = E[:, i7] / Mw[:, i7] ** 2; skap_7 = SE[:, i7] / Mw[:, i7] ** 2
            rec['kappa_liou'] = kap_l.tolist(); rec['kappa_liou_se'] = skap_l.tolist(); rec['kappa_d75'] = kap_7.tolist(); rec['kappa_d75_se'] = skap_7.tolist()
            print("\ncoherent-term calibration: kappa(Z) = (MS_w - D)/M_w^2 for w = liou and w = d75; then for each thin weight")
            print("the measured off-diagonal E_w = MS_w - D against the prediction kappa_liou(Z) M_w(Z)^2 (in units of the row se)")
            thin = ['e99', 'e97', 'e95', 'e90', 'e60', 'rm95a', 'rm95b', 'rm90', 'd50', 'iid', 'shuf95', 'one']
            print("       Z  kappa_liou(se)   kappa_d75(se)  | " + " ".join(f"{w:>22s}" for w in thin))
            rec['thin'] = {w: [] for w in thin}
            for i, Z in enumerate(Zs):
                cells = []
                for w in thin:
                    j = WEIGHTS.index(w)
                    pred = kap_l[i] * Mw[i, j] ** 2
                    cells.append(f"{E[i, j]:+8.2f}/{pred:7.2f}({SE[i, j]:5.2f})")
                    rec['thin'][w].append([float(E[i, j]), float(pred), float(SE[i, j]), float(Mw[i, j])])
                print(f"{Z:8d} {kap_l[i]:7.4f}({skap_l[i]:.4f}) {kap_7[i]:7.4f}({skap_7[i]:.4f}) | " + " ".join(cells))
            print("\nslope s_w of E_w(Z) = s_w * kappa_liou(Z) * M_w(Z)^2 over all scales (WLS through the origin; s = 1: coherent term present")
            print("with the Liouville constant; s = 0: absent), se from rows, and chi2 of the s = 1 and s = 0 hypotheses:")
            rec['slope'] = {}
            for w in thin + ['d75']:
                j = WEIGHTS.index(w)
                p = kap_l * Mw[:, j] ** 2
                # error of the prediction from kappa: skap_l * M^2, added in quadrature
                s = np.sqrt(SE[:, j] ** 2 + (skap_l * Mw[:, j] ** 2) ** 2)
                wgt = 1 / s ** 2
                sl = float((wgt * p * E[:, j]).sum() / (wgt * p * p).sum()); ssl = float(1 / math.sqrt((wgt * p * p).sum()))
                chi1 = float((wgt * (E[:, j] - p) ** 2).sum()); chi0 = float((wgt * E[:, j] ** 2).sum())
                rec['slope'][w] = [sl, ssl, chi1, chi0, len(Zs)]
                print(f"   {w:7s} s = {sl:+8.3f} +- {ssl:.3f}   chi2(s=1) = {chi1:8.1f}   chi2(s=0) = {chi0:8.1f}   ({len(Zs)} scales)")
            print("\nlocal exponents (WLS in log Z, upper half of the scales): M_w^2, kappa_liou, and their sum (= exponent of the coherent term)")
            h = len(Zs) // 2
            rec['coh_exp'] = {}
            bk, sbk, c2, dfk, sbks, _ = wfit(lz[h:], np.log(np.abs(kap_l[h:])), skap_l[h:] / np.abs(kap_l[h:]))
            print(f"   kappa_liou: {bk:+.3f} +- {sbks:.3f}   (sixth-power count: kappa ~ Z^(1/6), exponent +0.167)")
            for w in ['liou', 'd75', 'e99', 'e97', 'e95', 'e90', 'rm95a', 'rm95b', 'rm90', 'e60']:
                j = WEIGHTS.index(w)
                bm = np.polyfit(lz[h:], np.log(Mw[h:, j] ** 2), 1)[0]
                rec['coh_exp'][w] = [float(bm), bk, sbks]
                print(f"   {w:7s} d log M^2/d log Z = {bm:+.3f}  (2b-1 = {2 * BZERO.get(w, float('nan')) - 1:+.3f});  coherent term E ~ Z^{bm + bk:+.3f};  relative to D ~ Z: {bm + bk - 1:+.3f}")
        out['strata'][name] = rec
    if jout: json.dump(out, open(jout, 'w'), indent=1)

if __name__ == '__main__':
    main()
