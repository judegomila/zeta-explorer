"""Tables for combination 3 from the output of hl.py: singular series, relative errors, exponents."""
import sys, os, math, json
import numpy as np
import psnu, hl
C2 = 0.6601618158468695739
PS = psnu.small_primes(10 ** 7)

def S2(h):
    if h % 2: return 0.0
    v = 2 * C2; m = h
    while m % 2 == 0: m //= 2
    p = 3
    while p * p <= m:
        if m % p == 0:
            v *= (p - 1) / (p - 2)
            while m % p == 0: m //= p
        p += 2
    if m > 1: v *= (m - 1) / (m - 2)
    return v

def Sk(H):
    k = len(H); v = 1.0
    small = PS[PS <= max(H) + 1]
    for p in small.tolist():
        nu = len(set(h % p for h in H))
        v *= (1 - nu / p) / (1 - 1 / p) ** k
    big = PS[PS > max(H) + 1].astype(np.float64)
    v *= float(np.exp(np.sum(np.log1p(-k / big) - k * np.log1p(-1 / big))))
    return v

def char_mean(H, chi, q, conj_pattern):
    """mean over residues n mod q with all n + h coprime to q of prod chi^(+-)(n + h_i), relative to the admissible count"""
    tot = 0; cnt = 0
    for n in range(q):
        if all((n + h) % q for h in H):
            v = 1
            for i, h in enumerate(H):
                c = chi[(n + h) % q]
                v = v * (np.conj(c) if conj_pattern[i] else c)
            tot = tot + v; cnt += 1
    return tot / cnt if cnt else 0.0

def main(fn, out):
    fns = fn if isinstance(fn, list) else [fn]
    z = np.load(fns[0]); X = z['X']; K2 = json.loads(str(z['K2'])); KT = json.loads(str(z['KT']))
    full_upto = float(z['full_upto'])
    if 'k2' in z.files: k2 = z['k2']; kt = z['kt']
    else:
        zs = [np.load(f) for f in fns]
        k2 = np.cumsum(sum(q['k2_part'] for q in zs), axis=0); kt = np.cumsum(sum(q['kt_part'] for q in zs), axis=0)
        segs = sum(q['seg_part'] for q in zs); need = np.diff(np.concatenate([[0], z['cp_seg']]))
        ok = np.cumprod(segs == need).astype(bool); nok = int(ok.sum())
        print('merged %d parts; segments %d; primes %d; complete checkpoints %d of %d (X up to %.4g)' % (len(zs), sum(int(q['segments_done']) for q in zs), int(sum(q['n_part'].sum() for q in zs)), nok, len(X), X[nok - 1] if nok else 0))
        X = X[:nok]; k2 = k2[:nok]; kt = kt[:nok]
    TR = [tuple(t) for t in json.loads(str(z['TRIPLES']))]; QU = [tuple(t) for t in json.loads(str(z['QUADS']))]
    hs = 2 * np.arange(1, hl.HH + 1)
    S = np.array([S2(int(h)) for h in hs])
    res = dict(X=[float(x) for x in X], full_upto=full_upto, k2={}, tuples={})
    Xall = X; k2all = k2
    chi5 = hl.CHI5C_TAB; chi5r = psnu.CHI5R_TAB
    mean = {'ZETA': np.ones(len(hs)), 'RSGN': np.zeros(len(hs)), 'UNI_conj': np.zeros(len(hs)),
            'CHI5R': np.array([char_mean((0, int(h)), chi5r, 5, (0, 0)) for h in hs]).real,
            'CHI5C_conj': np.array([char_mean((0, int(h)), chi5, 5, (0, 1)) for h in hs]),
            'CHI5C_plain': np.array([char_mean((0, int(h)), chi5, 5, (0, 0)) for h in hs])}
    for oi, nm in enumerate(K2):
        m = mean[nm]; rows = []
        X = Xall if nm in ('ZETA', 'RSGN') else Xall[Xall <= full_upto * 1.0001]
        for j, x in enumerate(X):
            c = k2[j, oi, 1:]
            main_t = S * m * x
            has = np.abs(m) > 1e-12
            e = dict(X=float(x))
            if has.any():
                rel = (c[has] - main_t[has]) / np.abs(main_t[has])
                e['rms_rel_err'] = float(np.sqrt(np.mean(np.abs(rel) ** 2))); e['max_rel_err'] = float(np.max(np.abs(rel))); e['mean_rel_err'] = float(np.mean(rel.real))
                e['rms_err_over_sqrtX'] = float(np.sqrt(np.mean(np.abs(c[has] - main_t[has]) ** 2)) / math.sqrt(x)); e['n_h_main'] = int(has.sum())
            if (~has).any():
                e['rms_abs_no_main_over_sqrtX'] = float(np.sqrt(np.mean(np.abs(c[~has]) ** 2)) / math.sqrt(x)); e['rms_abs_no_main_over_X'] = float(np.sqrt(np.mean(np.abs(c[~has]) ** 2)) / x); e['n_h_no_main'] = int((~has).sum())
            rows.append(e)
        fit = {}
        lx = np.log(X)
        for key in ('rms_rel_err', 'rms_abs_no_main_over_X'):
            if key in rows[0]:
                y = np.log([r[key] for r in rows]); fit[key + '_exponent'] = float(np.polyfit(lx, y, 1)[0]); fit[key + '_exponent_last_decade'] = float(np.polyfit(lx[-5:], y[-5:], 1)[0])
        res['k2'][nm] = dict(rows=rows, fit=fit)
    X = Xall
    conjpat = {3: (0, 1, 0), 4: (0, 1, 0, 1)}
    for ti, H in enumerate(TR + QU):
        k = len(H); Sv = Sk(H); e = dict(H=list(H), S=Sv, objects={})
        for oi, nm in enumerate(KT):
            if nm == 'ZETA': m = 1.0
            elif nm == 'CHI4': m = char_mean(H, psnu.CHI4_TAB, 4, (0,) * k)
            elif nm == 'CHI5R': m = char_mean(H, chi5r, 5, (0,) * k)
            elif nm == 'CHI5C_conj': m = char_mean(H, chi5, 5, conjpat[k])
            else: m = 0.0
            vals = kt[:, oi, ti]; mt = Sv * m * X
            o = dict(char_mean=[float(np.real(m)), float(np.imag(m))])
            if abs(m) > 1e-12 and Sv > 1e-12:
                rel = (vals - mt) / np.abs(mt); o['rel_err'] = [float(abs(r)) for r in rel]
                o['exponent'] = float(np.polyfit(np.log(X), np.log(np.abs(rel) + 1e-300), 1)[0]); o['err_over_sqrtX'] = [float(abs(v - t) / math.sqrt(x)) for v, t, x in zip(vals, mt, X)]
            else:
                o['abs_over_sqrtX'] = [float(abs(v) / math.sqrt(x)) for v, x in zip(vals, X)]; o['abs_over_X_last'] = float(abs(vals[-1]) / X[-1])
                o['exponent_of_abs'] = float(np.polyfit(np.log(X), np.log(np.abs(vals) + 1e-9), 1)[0]) if np.all(np.abs(vals) > 0) else None
            o['value_last'] = [float(vals[-1].real), float(vals[-1].imag)]
            e['objects'][nm] = o
        res['tuples'][str(H)] = e
    json.dump(res, open(out, 'w'), indent=1)
    # print summary
    for nm in K2:
        r = res['k2'][nm]; print(nm, json.dumps(r['fit']))
        for row in r['rows'][::4] + [r['rows'][-1]]: print('   ', json.dumps(row))
    for H, e in res['tuples'].items():
        print(H, 'S=%.5f' % e['S'])
        for nm, o in e['objects'].items():
            print('    %-11s mean=%s  %s' % (nm, o['char_mean'], ('rel err last %.3e exponent %.2f' % (o['rel_err'][-1], o['exponent'])) if 'rel_err' in o else ('no main term: |C|/sqrt X last %.3f, |C|/X %.2e' % (o['abs_over_sqrtX'][-1], o['abs_over_X_last']))))

if __name__ == '__main__':
    main(sys.argv[2:] if len(sys.argv) > 3 else sys.argv[2], sys.argv[1])
