"""Tables for RESULT.md from out_server/*.jsonl.  Usage: analyze.py DIR > analysis.txt"""
import sys, json, math, os, numpy as np
import glob
DS = sys.argv[1:]; D = DS[0]
def load(name):
    """all shards <prefix>*.jsonl in the given directories, de-duplicated by (kind, idx), sorted by height."""
    pre = name[:-6]; seen = {}; nbad = 0; first = None
    for d in DS:
        for p in sorted(glob.glob(os.path.join(d, pre + '*.jsonl'))):
            for l in open(p):
                try: r = json.loads(l)
                except Exception: continue
                if 'error' in r:
                    nbad += 1; first = first or r['error']; continue
                seen[(r['kind'], r['idx'])] = r
    if nbad: print('   %s: %d records with errors, first: %s' % (name, nbad, first[:120]))
    return sorted(seen.values(), key=lambda r: r['im'])
def qs(v, q=(0.01, 0.1, 0.5, 0.9, 0.99)):
    v = np.asarray(v, float)
    return ' '.join('%.4g' % x for x in np.quantile(v, q)) if len(v) else 'n/a'
def ks(a, b):
    a = np.sort(a); b = np.sort(b); allv = np.concatenate([a, b])
    return float(np.abs(np.searchsorted(a, allv, side='right') / len(a) - np.searchsorted(b, allv, side='right') / len(b)).max())
FIRST_OFF = {'DH': 85.699348, 'HEAT': 111.694228, 'TNR': math.pi / math.log(3)}
full = {k: load('full_%s.jsonl' % k) for k in ('ZETA', 'L4', 'L3', 'DH', 'TNR', 'HEAT', 'ZW5', 'ZW6')}
offs = {'DH>1e4': load('off_DH.jsonl'), 'EA': load('off_EA.jsonl')}
print('records:', {k: len(v) for k, v in list(full.items()) + list(offs.items())})

LISTS = {}
for nm, fn in (('DH', 'data/DH.npz'), ('TNR', 'data/TNR.npz'), ('HEAT', 'data/HEAT_-0.5.npz'), ('DH>1e4', 'data/DH.npz')):
    if os.path.exists(fn):
        d = np.load(fn); o = np.argsort(d['offg']); LISTS[nm] = (np.sort(d['on']), d['offx'][o], d['offg'][o])
print('=' * 110); print('COMBINATION 1: rate at off-line zeros (v = dy/dt = -Re(F_ss/F_s)/2, y = 2(beta - 1/2))')
def c1(name, R):
    R = [r for r in R if not r['online'] and 'eta' in r]
    if not R: return
    v = np.array([r['v'] for r in R]); y = np.array([r['y'] for r in R])
    print('\n%s: %d off-line zeros, heights %.2f .. %.2f, y %.4g .. %.4g' % (name, len(R), min(r['im'] for r in R), max(r['im'] for r in R), y.min(), y.max()))
    print('   v*y quantiles (1,10,50,90,99%%): %s ; v < 0 at %d ; v <= -1/y (de Bruijn, valid for a topmost zero) at %d ; max v*y = %.4f' % (qs(v * y), (v < 0).sum(), (v * y <= -1 + 1e-12).sum(), (v * y).max()))
    for j, lab in enumerate(('eta = sqrt5 y', 'eta = max(sqrt5 y, 1.02)', 'x1.3', 'x2', 'x4')):
        B4 = np.array([r['eta'][j]['B4'] for r in R]); viol4 = (v > B4 + 1e-9 * np.abs(B4))
        s = '   %-26s A4 (own S): v <= B4 violated at %5d of %d (largest v - B4 = %+.4g)' % (lab, viol4.sum(), len(R), (v - B4).max())
        if 'B5z' in R[0]['eta'][j] or any('B5z' in r['eta'][j] for r in R):
            m = np.array(['B5z' in r['eta'][j] for r in R])
            B5 = np.array([r['eta'][j].get('B5z', np.nan) for r in R]); E = np.array([r['eta'][j].get('E', np.nan) for r in R])
            s += ' | A5 with zeta majorant: defined at %d, violated at %d ; E < 0 at %d (min E %.4g, median E %.4g)' % (m.sum(), (v[m] > B5[m] + 1e-9).sum(), (E[m] < 0).sum(), np.nanmin(E) if m.any() else float('nan'), np.nanmedian(E) if m.any() else float('nan'))
        print(s)
    return R
for k in ('DH', 'TNR', 'HEAT'): c1(k + ' (height < 1e4)' if k != 'HEAT' else 'HEAT tau=-0.5 (height < 1990)', full[k])
for k in offs: c1(k, offs[k])
if full['DH'] and offs['DH>1e4']:
    allr = [r for r in full['DH'] + offs['DH>1e4'] if not r['online']]
    x = np.array([r['x'] for r in allr]); g = np.array([r['im'] for r in allr]); M = np.array([r['M'] for r in allr])
    print('\nDH all off-line zeros to 1e5: %d pairs ; x = beta - 1/2: max %.4f at height %.2f ; quantiles %s ; zeros with beta > 1: %d' % (len(x), x.max(), g[x.argmax()], qs(x), (x > 0.5).sum()))
    for a, b in ((0, 1e3), (1e3, 1e4), (1e4, 3e4), (3e4, 1e5)):
        m = (g >= a) & (g < b)
        if m.sum(): print('   heights [%g, %g): %5d pairs ; M quantiles %s ; M < 0: %d ; M < 1: %d ; median x %.4f' % (a, b, m.sum(), qs(M[m]), (M[m] < 0).sum(), (M[m] < 1).sum(), np.median(x[m])))

print('\n' + '=' * 110); print('COMBINATION 3: M = x Re(F_ss/F_s) at off-line zeros (D\' = -M/2; M = 1 from the mirror partner alone); kappa = Re d_s(F_ss/F_s) at on-line zeros')
for name, R in list(full.items()) + list(offs.items()):
    of = [r for r in R if not r['online']]; on = [r for r in R if r['online']]
    if of:
        M = np.array([r['M'] for r in of]); x = np.array([r['x'] for r in of])
        print('%-8s off-line %6d : M quantiles %s ; min %.4f max %.4f ; M < 0: %d ; M < 1: %d ; (M-1)/x^2 quantiles %s' % (name, len(of), qs(M), M.min(), M.max(), (M < 0).sum(), (M < 1).sum(), qs((M - 1) / x ** 2)))
    if of and name in LISTS:
        onl, ox, og = LISTS[name]; Mon = []; top = 0
        for r in of:
            i = np.searchsorted(onl, r['im']); w = onl[max(0, i - 400):i + 400] - r['im']
            Mon.append(float((2 * r['x'] ** 2 / (r['x'] ** 2 + w * w)).sum()))
            nb = (np.abs(og - r['im']) < 2) & (np.abs(og - r['im']) > 1e-9)
            top += not (ox[nb] > r['x']).any()
        Mon = np.array(Mon)
        print('            real-zero Poisson field M_on = sum_on 2x^2/(x^2+D^2) (800 nearest on-line zeros): quantiles %s ; M - 1 - M_on (other off-line pairs, tails) quantiles %s ; min %.4f ; zeros that are topmost within height distance 2: %d of %d' % (qs(Mon), qs(M - 1 - Mon), (M - 1 - Mon).min(), top, len(of)))
    if on:
        k = np.array([r['kappa'] for r in on]); gb = np.array([r.get('gbar', 1.0) for r in on]); im = np.array([r['im'] for r in on])
        print('%-8s on-line  %6d : kappa < 0 at %d ; min kappa %.4f at height %.4f ; kappa*gbar^2 quantiles %s' % (name, len(on), (k < 0).sum(), k.min(), im[k.argmin()], qs(k * gb * gb)))
        if name in LISTS:
            _, ox, og = LISTS[name]
            j = np.clip(np.searchsorted(og, im), 1, len(og) - 1); j = np.where(np.abs(og[j - 1] - im) < np.abs(og[j] - im), j - 1, j)
            close = np.abs(og[j] - im) < ox[j]
            print('            kappa < 0: %d, of which %d have an off-line pair at height distance < its x ; on-line zeros with such a pair: %d, of which kappa < 0: %d ; smallest |height distance|/x among the others with kappa<0: %s' % (
                (k < 0).sum(), ((k < 0) & close).sum(), close.sum(), ((k < 0) & close).sum(), 'n/a' if not ((k < 0) & ~close).any() else '%.3f' % (np.abs(og[j] - im) / ox[j])[(k < 0) & ~close].min()))
        if True:
            key = name if name in FIRST_OFF else None
            if key:
                m = im < FIRST_OFF[key]
                if m.any(): print('            below the first off-line height %.3f: %d on-line zeros, min kappa %.4f, min kappa*gbar^2 %.4f ; nearest on-line zero below that height at distance %.4f' % (FIRST_OFF[key], m.sum(), k[m].min(), (k[m] * gb[m] ** 2).min(), FIRST_OFF[key] - im[m].max()))
for nm in ('kap_ZK7.jsonl', 'kap_ZK8.jsonl'):
    R = load(nm)
    if R:
        k = np.array([r['kappa'] for r in R]); gb = np.array([r['gbar'] for r in R])
        print('%-14s jets (192 bits) at heights %.1f .. %.1f: %d zeros ; kappa < 0: %d ; min kappa*gbar^2 %.3f ; quantiles %s ; max |x| after Newton %.1e' % (nm, R[0]['im'], R[-1]['im'], len(R), (k < 0).sum(), (k * gb * gb).min(), qs(k * gb * gb), max(abs(r['x']) for r in R)))
p = os.path.join(D, 'kappa_list.json')
if os.path.exists(p):
    kl = json.load(open(p)); print('list form, zeta: ', {a: b for a, b in kl.items() if a not in ('head', 'per_decade_min')})
    if kl.get('head') and full['ZETA']:
        gl = np.array(kl['head'][0]); kpl = np.array(kl['head'][1]); S1l = np.array(kl['head'][2])
        J = {round(r['im'], 6): r for r in full['ZETA'] if r['online']}
        d = []; d1 = []
        for a, b, c in zip(gl, kpl, S1l):
            r = J.get(round(a, 6))
            if r: d.append((b - r['kappa']) / r['kappa']); d1.append(c - (-r['Qim'] / 2))
        d = np.array(d); d1 = np.array(d1)
        if len(d): print('   list kappa (with the smooth term -pi/4 in S1) against jet kappa at %d zeros (heights %.1f .. %.1f): relative difference quantiles %s ; S1(list) - S1(jet) quantiles %s' % (len(d), gl[0], gl[len(d) - 1], qs(d), qs(d1)))

print('\n' + '=' * 110); print('COMBINATION 2: heat-stability radius from positivity (delta_R: direct Rouche floor, delta_TR: Taylor-Rouche); log10')
for name, R in full.items():
    R = [r for r in R if 'lgdel_R' in r and r['im'] > 0]
    if not R: continue
    for sub, RR in (('on-line', [r for r in R if r['online']]), ('off-line', [r for r in R if not r['online']])):
        if len(RR) < 5: continue
        im = np.array([r['im'] for r in RR]); ld = np.array([r['lgdel_R'] for r in RR]); lt = np.array([r.get('lgdel_TR', np.nan) for r in RR])
        A = np.vstack([np.ones(len(im)), im, np.log10(im)]).T
        if im.max() - im.min() < 500: A = np.vstack([np.ones(len(im)), im, 0 * im]).T
        co = np.linalg.lstsq(A, ld, rcond=None)[0]; resid = ld - A @ co
        fl = np.array([r['floor_R'] / r['g'] for r in RR]); ft = np.array([r.get('floor_TR', np.nan) / r['g'] for r in RR])
        loc = ld - np.array([r['lg_a1'] for r in RR]) - np.log10(np.array([r['g'] for r in RR]))        # log10( delta / (|F'| g) )
        print('%-6s %-8s %6d zeros to %.0f: lg delta_R at lowest/highest %.2f / %.2f ; fit lg delta = %.3f %+.6f gamma %+.3f lg gamma (rms resid %.3f) ; TR available at %d ; median lg(delta_R/delta_TR) %.3f' % (
            name, sub, len(RR), im.max(), ld[im.argmin()], ld[im.argmax()], co[0], co[1], co[2], resid.std(), np.isfinite(lt).sum(), np.nanmedian(ld - lt)))
        print('                 floor_R/g quantiles %s ; floor_TR/g quantiles %s ; r_opt/g (R) median %.2f ; lg[delta_R/(|F\'(rho)| g)] quantiles %s' % (qs(fl), qs(ft[np.isfinite(ft)]), np.median([r['ropt_R'] for r in RR]), qs(loc)))
        key = name if name in FIRST_OFF else None
        if key and sub == 'on-line':
            m = im < FIRST_OFF[key]; m2 = (im >= FIRST_OFF[key])
            if m.sum() > 3: print('                 below first off-line height: %d channels, floor_R/g quantiles %s ; above: %s' % (m.sum(), qs(fl[m]), qs(fl[m2])))
print('   pi/(4 ln 10) = %.6f' % (math.pi / 4 / math.log(10)))

print('\n' + '=' * 110); print('COMBINATION 4: v_exit (disk radius 0.7 g about the zero) and v_coll (collision of the branch), backward heat v = -tau')
Rz = {}
for name, R in full.items():
    on = [r for r in R if r['online']]
    if not on: continue
    ok = []; ncap = 0; nstall = 0; ntr = 0; nbadtr = 0
    for r in on:
        if r.get('c4_status') == 'cap': ncap += 1; continue
        if r.get('c4_status') != 'ok' or 'v_exit_0.7' not in r: nstall += 1; continue
        if 'trunc' in r:
            ntr += 1; t = r['trunc']
            if t[0] is None or t[1] is None or abs(t[0] - r['v_coll']) > 1e-6 * r['v_coll'] or abs(t[1] - r['v_exit_0.7']) > 1e-6 * r['v_exit_0.7']: nbadtr += 1; continue
        ok.append(r)
    if not ok: continue
    ratio = np.array([r['v_exit_0.7'] / r['v_coll'] for r in ok]); vc = np.array([r['v_coll'] / (r['g'] ** 2 / 2) for r in ok]); im = np.array([r['im'] for r in ok])
    how = {}
    for r in ok: how[r['v_exit_0.7_how']] = how.get(r['v_exit_0.7_how'], 0) + 1
    Rz[name] = (im, ratio, vc, np.array([r['gbar'] for r in ok]))
    print('%-6s on-line %6d : collision found %6d (cap %d, no fold/no exit %d, truncation check run %d failed %d) ; ratio v_exit/v_coll quantiles %s ; mean %.4f ; ratio > 1: %d ; v_coll/(g^2/2) quantiles %s ; exit type %s' % (
        name, len(on), len(ok), ncap, nstall, ntr, nbadtr, qs(ratio), ratio.mean(), (ratio > 1).sum(), qs(vc), how))
    key = name if name in FIRST_OFF else None
    if key:
        m = im < FIRST_OFF[key]
        if m.sum() > 2: print('          below first off-line height: %d channels ; ratio quantiles %s ; sign of v_exit and v_coll positive at all: %s' % (m.sum(), qs(ratio[m]), bool((ratio[m] > 0).all())))
FAR = {}
for name in ('DH', 'TNR', 'HEAT'):
    if name in Rz and name in LISTS:
        im, ratio, vc, gb = Rz[name]; og = LISTS[name][2]
        j = np.clip(np.searchsorted(og, im), 1, len(og) - 1); dist = np.minimum(np.abs(og[j - 1] - im), np.abs(og[j] - im))
        for mult in (4, 10):
            m = dist > mult * gb
            FAR['%s, no off-line pair within %d gbar' % (name, mult)] = (im[m], ratio[m], vc[m], gb[m])
        m = im < FIRST_OFF[name]
        if m.sum() > 10: FAR['%s below its first off-line height' % name] = (im[m], ratio[m], vc[m], gb[m])
Rz.update(FAR)
if 'ZETA' in Rz and 'L4' in Rz:
    # pooled reference zeta + L4 + L3 for the low channels
    P = [Rz[k] for k in ('ZETA', 'L4', 'L3') if k in Rz]; Rz['pooled ZETA+L4+L3'] = tuple(np.concatenate([p[i] for p in P]) for i in range(4))
    for nm in FAR:
        if 'below' in nm:
            b = Rz[nm]; a = Rz['pooled ZETA+L4+L3']; lo, hi = np.quantile(b[3], (0.1, 0.9)); ma = (a[3] >= lo) & (a[3] <= hi); mb = (b[3] >= lo) & (b[3] <= hi)
            if ma.sum() > 10: print('   %s (gbar in [%.2f, %.2f], n = %d) against pooled zeta, L3, L4 channels with gbar in the same range (n = %d): KS ratio %.3f, KS v_coll/(g^2/2) %.3f ; 1%% critical value %.3f ; median ratio %.3f vs %.3f' % (nm, lo, hi, mb.sum(), ma.sum(), ks(a[1][ma], b[1][mb]), ks(a[2][ma], b[2][mb]), 1.63 * math.sqrt((ma.sum() + mb.sum()) / (ma.sum() * mb.sum())), np.median(b[1][mb]), np.median(a[1][ma])))
if 'ZETA' in Rz:
    for name in Rz:
        if name == 'ZETA': continue
        a = Rz['ZETA']; b = Rz[name]
        print('   KS distance of the ratio distribution, ZETA against %s: %.4f (n = %d, %d ; 1%% critical value %.4f) ; of v_coll/(g^2/2): %.4f' % (name, ks(a[1], b[1]), len(a[1]), len(b[1]), 1.63 * math.sqrt((len(a[1]) + len(b[1])) / (len(a[1]) * len(b[1]))), ks(a[2], b[2])))
        for lo, hi in ((0.55, 0.65), (0.65, 0.8), (0.8, 1.0), (1.0, 1.4)):
            ma = (a[3] >= lo) & (a[3] < hi); mb = (b[3] >= lo) & (b[3] < hi)
            if ma.sum() > 80 and mb.sum() > 80:
                na, nb = ma.sum(), mb.sum()
                print('        matched local mean spacing gbar in [%.2f, %.2f): KS ratio %.4f, KS v_coll/(g^2/2) %.4f (n = %d, %d ; 1%% critical value %.4f) ; median ratio %.4f vs %.4f' % (lo, hi, ks(a[1][ma], b[1][mb]), ks(a[2][ma], b[2][mb]), na, nb, 1.63 * math.sqrt((na + nb) / (na * nb)), np.median(a[1][ma]), np.median(b[1][mb])))
