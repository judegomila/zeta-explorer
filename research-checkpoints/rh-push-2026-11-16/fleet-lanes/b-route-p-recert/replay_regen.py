#!/usr/bin/env python3
"""r3-bb-replay: exact replay of a band comparison run with a full per-substep log, plus the checks that the written
proof of the band barriers (BB1)/(BB2) needs from the consumer data (formalization/paper/lemma-B-two-band.md, section 6.1).

The replay re-implements the choice rule of the two consumers (b145-B-lib.integrate_multi and r2-floor-consume.integrate)
and must reproduce their exact output U.  It shares only the data loaders and the floor tables with them.

Checks per substep k (barrier B defined from the stored upward enclosures q_k, see section 6.1):
  E1  kernel admissibility at q_k: catalogue v = q_k/h^2 <= rho^2; sharp 0 < v < 1, 29 v^2 - v - 1 <= 0, v < 51/250;
      spatial validity h r < 2 (catalogue) or h^2/3 < 4 (sharp).
  E2  self-pair cap: cap >= sup_{0 <= v' <= v} s(v') (catalogue: s_r closed form, interior maximum enclosed with arb;
      sharp: exact identity 6/(4 - v), increasing).
  E3  rate recomputed: c = (2 lam / h)(floor - cap / h) (catalogue), (4/h)(floor - cap/h) (sharp), 0 < c delta < 1.
  E4  upward enclosure: q_{k+1} = ceil_{2^-96}((q_k + 2/c) A18(c delta) - 2/c) with A18 the alternating Taylor sum through
      degree 18 (an upper bound for exp(-x) on [0, 1), Leibniz), i.e. no downward jump of the barrier.
  E5  windowed (sharp-r2) floors: the barrier's end value on the substep, bounded BELOW with A17 (Leibniz lower bound),
      is >= q_lo; on the terminal substep q_e >= q_lo.  (The consumer itself tests an upper bound.)
  E6  terminal time: no early crossing (A17 lower bound of every non-terminal end value > q_e, so t_e lies in the
      terminal substep); t_e <= now + log(1+z)/c recomputed with two independent upper bounds for log(1+z) (degree-11
      alternating sum; z - z^2/(2(1+z))); U = ceil_{1e-15}(now + lag + q_e/2) reproduced; U < 41/250.
  E7  heights h used, for the far-field lemma H2 (range [h_lo, h_hi] proved analytically in r3-bb-h2.py).
  E8  start value q_0 (band 1: > q_MTY(x_L) enclosed with arb at 256 bits; band 2: > 1).
usage: r3-bb-replay.py RUN OUT.json      RUN in {routeP, U2, PT_b145, X170}
"""
import sys, json, time, importlib.util
from fractions import Fraction as F
from pathlib import Path
from collections import Counter
from flint import arb, ctx

T = Path('tmp')


def mod(name, path):
    sp = importlib.util.spec_from_file_location(name, path); m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m); return m


BL = mod('b145lib', T / 'b145-B-lib.py')
KERNELS = BL.KERNELS
STEP = BL.STEP; PARTS = 128; DELTA = STEP / PARTS; QE = BL.QE
XL = F('15600000002223.2344'); XR = F('15600000009475.44')


def A(x, deg):
    """alternating Taylor partial sum of exp(-x) through degree deg (upper bound if deg even, lower if odd, 0 <= x < 1)."""
    assert 0 <= x < 1
    s = term = F(1)
    for j in range(1, deg + 1):
        term *= -x / j; s += term
    return s


def ceil_grid(x, den):
    return F(-((-x.numerator * den) // x.denominator), den)


# ---------------------------------------------------------------- self-pair caps (independent of the consumer code)
def s_r(a, v):
    u = 1 + a - v
    return 2 * u / (u * u + 4 * a * v)


VM = {}


def interior_max(k):
    """for catalogue kernel k: (v_m, upper bound of s_r(v_m)) with v_m = 1 + a - 2 sqrt(a(1+a)) the unique critical point."""
    if k['r'] in VM: return VM[k['r']]
    ctx.prec = 256
    a = F(k['r'])**2; aa = arb(a.numerator) / a.denominator
    root = (aa * (1 + aa)).sqrt(); vm = 1 + aa - 2 * root; u = 2 * root
    smax = u / (2 * aa * (2 * (1 + aa) - u))           # s_r(v_m) = u / (2a(2(1+a) - u)), u = 2 sqrt(a(1+a))
    vlo = vm.lower().fmpq(); vhi = vm.upper().fmpq(); su = smax.upper().fmpq()
    VM[k['r']] = (F(int(vlo.numerator), int(vlo.denominator)), F(int(vhi.numerator), int(vhi.denominator)), F(int(su.numerator), int(su.denominator)))
    return VM[k['r']]


def cap_valid(k, V, cap):
    """True if cap >= sup_{0<=v<=V} s_r(v) (s_r' has the sign of (1+a-v)^2 - 4a(1+a), one critical point v_m)."""
    a = F(k['r'])**2
    sup_end = max(s_r(a, F(0)), s_r(a, V))
    vlo, vhi, smax = interior_max(k)
    if vhi < 0 or vlo > V:               # critical point outside [0, V]: monotone there, maximum at an endpoint
        return cap >= sup_end
    return cap >= max(sup_end, smax)     # interior maximum possibly inside: use its upper enclosure


def q_mty_upper(x, prec=256):
    ctx.prec = prec
    R = arb(5558691) / 10**6
    lg = (arb(x.numerator) / x.denominator / 2).log()
    q = (1 - 2 / (R * lg))**2
    up = q.upper().fmpq(); return F(int(up.numerator), int(up.denominator))


# ---------------------------------------------------------------- run definitions
def load_routeP():
    C = mod('cons', T / 'r2-floor-consume.py')
    base = str(T / 'r2-refF-out/corrected_m0023')
    pat = f'{base}/batch_*.json,{base}/adapt/*.json,{base}/adapt2/*.json'
    res = C.load(pat)
    d = F(round(-0.02 * 1e12), 10**12)
    assert d == F(-1, 50)
    for kk, v in res.items():
        if v.get('status') != 'ok': continue
        v['floor_str'] = str(F(v['floor_str']) + d)
        if 'wins' in v: v['wins'] = [(a_, b_, str(F(c_) + d)) for a_, b_, c_ in v['wins']]
    kaps = ['1', '0.94', '0.88']
    sets = C.build_sets(res, kaps)
    return dict(kind='r2', sets=sets, kaps=kaps, q0=C.Q0B, start_check=False, band=1, expect=F(1448843462793, 10**13), pattern=pat)


def load_lib(items, q0, start_check, band, expect, extra=None):
    Cs = mod('b145c', Path('tmp/research-2026-11-16/push/b-route-p-recert/b145c_regen.py'))
    import os
    cwd = os.getcwd(); os.chdir(T)
    try:
        sets = Cs.load_sets(items)
    finally:
        os.chdir(cwd)
    return dict(kind='lib', sets=sets, kaps=items, q0=q0, start_check=start_check, band=band, expect=expect, extra=extra)


def mh_catalog():
    import glob
    cat = []
    for f in sorted(glob.glob(str(T / 'b145-B-out/kernels/MH*.json'))):
        dd = json.load(open(f))
        if dd['PASS']: cat.append(dict(dd, file=f.split('/')[-1]))
    return cat


def load_mh_pt():
    """b145 PT-height band value 0.147273668782792 (b145-B-consume-mh.py X1_P100MH PLAN K21_10.. --extra X1_P0_97 --q0 Q0B)."""
    ARCH = Path('tmp/research-2026-11-16/push/b-route-p-recert/mb/gen-archive')
    rows = json.load(open(T / 's145-1-g1/data/PLAN.json'))['rows']; hts = [F(r['height']) for r in rows]
    low_sets = [(hts, BL.load_tables(ARCH / 'X1_P100MH' / 'TABLES.json'))]
    rr = json.load(open(T / 'b145-B-out/plans/X1_mult_0_97b.json'))['rows']; hh = [None] * 608
    for r in rr: hh[r['time_index']] = F(r['height'])
    low_sets.append((hh, BL.load_tables(ARCH / 'X1_P0_97' / 'TABLES.json')))
    high_sets = []; kidx = {}
    for tag, kap in [('X1_K21_10', '21/10'), ('X1_K12_5', '12/5'), ('X1_K11_4', '11/4'), ('X1_K31_10', '31/10')]:
        kap = F(kap); op = {int(i): F(v) for i, v in json.load(open(ARCH / tag / 'ONEPOINT.json')).items()}
        kidx[kap] = len(high_sets); high_sets.append(([kap * h for h in hts], op))
    kernels = []
    for d in mh_catalog():
        kap = F(d['kappa'])
        if kap in kidx:
            kernels.append({'kappa': kap, 'r': F(d['r']), 'w': F(d['w']), 'lambda': F(d['lambda']), 'rho': F(d['rho']), 'low': 0, 'high': kidx[kap], 'file': d['file']})
    q0 = F(195181606067939, 200000000000000)
    return dict(kind='lib', sets=low_sets, kaps=['X1_P100MH', 'X1_P0_97'], q0=q0, start_check=False, band=1,
                expect=F(18409208597849, 125000000000000), mh=(kernels, low_sets, high_sets))


def load_cmh(low, plan, extras, highs, q0, expect):
    """b145-B-consume-mh semantics: MH kernels on the first low set only; extra single-height sets; --q0 => no entry check."""
    ARCH = Path('tmp/research-2026-11-16/push/b-route-p-recert/mb/gen-archive')
    rows = json.load(open(T / plan))['rows']; hts = [F(r['height']) for r in rows]
    low_sets = [(hts, BL.load_tables(ARCH / low / 'TABLES.json'))]
    for tg, pl in extras:
        rr = json.load(open(T / pl))['rows']; hh = [None] * 608
        for r in rr: hh[r['time_index']] = F(r['height'])
        low_sets.append((hh, BL.load_tables(ARCH / tg / 'TABLES.json')))
    high_sets = []; kidx = {}
    for tag, kap in highs:
        kap = F(kap); op = {int(i): F(v) for i, v in json.load(open(ARCH / tag / 'ONEPOINT.json')).items()}
        kidx[kap] = len(high_sets); high_sets.append(([kap * h for h in hts], op))
    kernels = []
    for d in mh_catalog():
        kap = F(d['kappa'])
        if kap in kidx:
            kernels.append({'kappa': kap, 'r': F(d['r']), 'w': F(d['w']), 'lambda': F(d['lambda']), 'rho': F(d['rho']), 'low': 0, 'high': kidx[kap], 'file': d['file']})
    return dict(kind='lib', sets=low_sets, kaps=[low] + [e[0] for e in extras], q0=q0, start_check=False, band=1, expect=expect,
                mh=(kernels, low_sets, high_sets))


def load_mh_spec(path, expect):
    """r2-height-consume2 spec (every low set may carry its own two-height kernels)."""
    ARCH = Path('tmp/research-2026-11-16/push/b-route-p-recert/mb/gen-archive')
    spec = json.load(open(path))['spec']; q0 = F(spec['q0'])
    low_sets, high_sets, kernels = [], [], []
    cat = mh_catalog()
    for li, e in enumerate(spec['low']):
        rows = json.load(open(T / e['plan']))['rows']; hts = [None] * 608
        for r in rows: hts[r['time_index']] = F(r['height'])
        low_sets.append((hts, BL.load_tables(ARCH / e['tag'] / 'TABLES.json')))
        for tg, kap in e.get('high', []):
            kap = F(kap)
            op = {int(i): F(v) for i, v in json.load(open(ARCH / tg / 'ONEPOINT.json')).items()}
            hi = len(high_sets); high_sets.append(([None if h is None else kap * h for h in hts], op))
            for d in cat:
                if F(d['kappa']) == kap:
                    kernels.append({'kappa': kap, 'r': F(d['r']), 'w': F(d['w']), 'lambda': F(d['lambda']), 'rho': F(d['rho']), 'low': li, 'high': hi, 'file': d['file']})
    return dict(kind='lib', sets=low_sets, kaps=[e['tag'] for e in spec['low']], q0=q0, start_check=(q0 > 1), band=1 if q0 < 1 else 2,
                expect=expect, mh=(kernels, low_sets, high_sets), xl_override=None)


def options_mh(mh, i, q):
    kernels, low_sets, high_sets = mh
    out = []
    for ki, k in enumerate(kernels):
        lh, lt = low_sets[k['low']]; hh, ho = high_sets[k['high']]
        if i not in lt or i not in ho or lh[i] is None or hh[i] is None: continue
        h = lh[i]; kap, r, w, lam, rho = k['kappa'], k['r'], k['w'], k['lambda'], k['rho']
        V = q / (h * h)
        if V > rho * rho: continue
        mode = 'r_' + str(r).replace('/', '_')
        lp = lt[i][mode]['both']; lhigh = ho[i]
        hbar = h * ((1 - w) + w * kap)
        s_pair = 2 / (h * (1 + r * r)); s_high = 2 * kap / (h * (kap * kap - V))
        rate = 2 * lam / hbar * ((1 - w) * lp + w * lhigh - (1 - w) * s_pair - w * s_high)
        if rate > 0: out.append(dict(rate=rate, si='MH', ki=ki, h=h, ell=(lp, lhigh), cap=(s_pair, s_high), kind='mh', k=k, hh=hh[i]))
    return out


def run_def(name):
    if name == 'routeP':
        return load_routeP()
    if name == 'U2':
        return load_lib(['XW26_P100:s145-1-g1/data/PLAN.json', 'XW26_P0_97:b145-B-out/plans/XW26_mult_0_97.json',
                         'XW26_P0_94:b145-B-out/plans/XW26_mult_0_94.json'], BL.Q0_RAYMOND, True, 2, F(36063660805739, 250000000000000))
    if name == 'PTMH':
        return load_mh_pt()
    if name == 'H160':
        return load_mh_spec(T / 'r2-height-out/c2_X160_full_band26.json', F(144974387559643, 10**15))
    if name == 'H160b165':     # three-band form, band 1 = (x_f(1.6X), x_L(1.65X window)), start q_MTY(x_L1) + 2e-6
        R = load_mh_spec(T / 'r2-height-out/c2_X160_full_band165.json', F(144951726247781, 10**15))
        R['xl'] = F('9900000003031.5801'); return R
    if name == 'X165mid':      # three-band form, middle band = (x_R(1.65X window), x_L(2.6X window)), floors at 1.65X
        return load_cmh('X165_P100MH', 's145-1-g1/data/PLAN.json',
                        [('X165_P0_97', 'r2-height-out/plans/X165_mult_0_97.json'), ('X165_P0_94', 'r2-height-out/plans/X165_mult_0_94.json')],
                        [('X165_K21_10', '21/10'), ('X165_K12_5', '12/5'), ('X165_K11_4', '11/4'), ('X165_K31_10', '31/10')],
                        F(195181606067939, 200000000000000), F(144912451862679, 10**15))
    if name == 'X170':
        q0 = BL.ceilq(q_mty_upper(XL, 200) + F(2, 10**6), 10**15)
        return load_lib(['X170_P100:s145-1-g1/data/PLAN.json', 'X170_P0_97:b145-B-out/plans/X170_mult_0_97.json'], q0, False, 1,
                        F(18108446112627, 125000000000000))
    raise SystemExit('unknown run ' + name)


# ---------------------------------------------------------------- option generators (same order as the consumers)
def options_lib(sets, i, q):
    out = []
    for si, (hts, tabs) in enumerate(sets):
        if i not in tabs or hts[i] is None: continue
        h = hts[i]; v = q / (h * h)
        for ki, k in enumerate(KERNELS):
            rh, lam, r = map(F, [k['rho'], k['lambda'], k['r']])
            if v > rh * rh: continue
            ell = tabs[i]['r_' + k['r'].replace('/', '_')]['both']
            cap = BL.self_cap(k, v); rate = 2 * lam / h * (ell - cap / h)
            if rate > 0: out.append(dict(rate=rate, si=si, ki=ki, h=h, ell=ell, cap=cap, kind='cat'))
        if 0 < v < 1 and 29 * v * v - v - 1 <= 0:
            ell = tabs[i]['sharp']['both']; cap = 6 / (4 - v); rate = 4 / h * (ell - cap / h)
            if rate > 0: out.append(dict(rate=rate, si=si, ki=-1, h=h, ell=ell, cap=cap, kind='sharp'))
    return out


def options_r2(sets, i, q):
    out = []
    for si, (hts, tabs, sw) in enumerate(sets):
        if i not in tabs or hts[i] is None: continue
        h = hts[i]; v = q / (h * h)
        for ki, k in enumerate(KERNELS):
            rh, lam, r = map(F, [k['rho'], k['lambda'], k['r']])
            if v > rh * rh: continue
            ell = tabs[i]['r_' + k['r'].replace('/', '_')]['both']
            if ell <= 0: continue
            cap = BL.self_cap(k, v); rate = 2 * lam / h * (ell - cap / h)
            if rate > 0: out.append(dict(rate=rate, si=si, ki=ki, h=h, ell=ell, cap=cap, kind='cat', qlo=None))
        if 0 < v < 1 and 29 * v * v - v - 1 <= 0:
            cap = 6 / (4 - v)
            base = tabs[i]['sharp']['both']
            if base > 0:
                rate = 4 / h * (base - cap / h)
                if rate > 0: out.append(dict(rate=rate, si=si, ki=-1, h=h, ell=base, cap=cap, kind='sharp', qlo=None))
            for (qlo, qhi, ell) in sw.get(i, []):
                rate = 4 / h * (ell - cap / h)
                if rate > 0 and q <= qhi: out.append(dict(rate=rate, si=si, ki=-2, h=h, ell=ell, cap=cap, kind='sharp-r2', qlo=qlo, qhi=qhi))
    return out


# ---------------------------------------------------------------- replay + checks
def replay(R, log_every=0):
    sets = R['sets']; q = F(R['q0']); first = True; steps = []
    fails = Counter(); stats = Counter(); hmin = None; hmax = None; win_margin = None; maxcd = F(0); kuse = Counter()
    for i in range(608):
        tl = i * STEP
        for j in range(PARTS):
            now = tl + j * DELTA
            if R['kind'] == 'lib':
                opts = options_lib(sets, i, q)
                if R.get('mh') is not None: opts += options_mh(R['mh'], i, q)
                if not opts: raise SystemExit(f'no option at cell {i}')
                best = max(opts, key=lambda o: o['rate'])       # first maximal element, as max() in integrate_multi
                chosen = best; outq = (q + 2 / best['rate']) * BL.expminus(best['rate'] * DELTA) - 2 / best['rate']
            else:
                opts = sorted(options_r2(sets, i, q), key=lambda o: o['rate'], reverse=True)
                chosen = None
                for o in opts:
                    rate = o['rate']
                    oq = (q + 2 / rate) * BL.expminus(rate * DELTA) - 2 / rate
                    qn = max(oq, F(0))
                    if o['qlo'] is not None and qn < o['qlo'] and oq > QE: continue
                    if o['qlo'] is not None and oq <= QE and QE < o['qlo']: continue
                    chosen = o; outq = oq; break
                if chosen is None: raise SystemExit(f'no admissible option at cell {i}')
            c = chosen['rate']; h = chosen['h']; x = c * DELTA
            # E1 admissibility at q (upward enclosure at the start of the substep)
            v = q / (h * h)
            if chosen['kind'] == 'cat':
                k = KERNELS[chosen['ki']]; rho = F(k['rho']); r = F(k['r']); lam = F(k['lambda'])
                if not (v <= rho * rho): fails['E1-rho'] += 1
                if not (h * r < 2): fails['E1-spatial'] += 1
                if not cap_valid(k, v, chosen['cap']): fails['E2-cap'] += 1
                rate_chk = 2 * lam / h * (chosen['ell'] - chosen['cap'] / h)
                kuse[('cat', k['r'], k['lambda'], k['rho'])] += 1
            elif chosen['kind'] == 'mh':
                k = chosen['k']; kap, r, w, lam, rho = k['kappa'], k['r'], k['w'], k['lambda'], k['rho']
                if not (v <= rho * rho and v < kap * kap): fails['E1-mh'] += 1
                if not (h * r < 2): fails['E1-spatial'] += 1
                if not (3 * r * r >= 1): fails['E2-mh-pair-monotone'] += 1      # s_r decreasing => sup_{[0,v]} = s_r(0) = 2/(1+r^2)
                if not (chosen['hh'] == kap * h): fails['E1-mh-height'] += 1
                if not (chosen['cap'][0] == 2 / (h * (1 + r * r)) and chosen['cap'][1] == 2 * kap / (h * (kap * kap - v))): fails['E2-mh-cap'] += 1
                hbar = h * ((1 - w) + w * kap)
                rate_chk = 2 * lam / hbar * ((1 - w) * chosen['ell'][0] + w * chosen['ell'][1] - (1 - w) * chosen['cap'][0] - w * chosen['cap'][1])
                kuse[('mh', k['file'])] += 1
            else:
                if not (0 < v < 1 and 29 * v * v - v - 1 <= 0 and v < F(51, 250)): fails['E1-sharp'] += 1
                if not (h * h / 3 < 4): fails['E1-spatial'] += 1
                if not (chosen['cap'] == 6 / (4 - v)): fails['E2-sharpcap'] += 1
                rate_chk = 4 / h * (chosen['ell'] - chosen['cap'] / h)
                kuse[(chosen['kind'],)] += 1
            if rate_chk != c: fails['E3-rate'] += 1
            if not (0 < x < 1): fails['E3-cdelta'] += 1
            maxcd = max(maxcd, x)
            # start check of the original run (band 2 only): kept for bookkeeping, not needed by the proof
            if first and R['start_check'] and not (q - (2 + c * q) * F(1, 10**8) > 1): fails['start-entry'] += 1
            first = False
            hmin = h if hmin is None or h < hmin else hmin; hmax = h if hmax is None or h > hmax else hmax
            stats[(R['kaps'][chosen['si']] if R['kind'] == 'r2' else chosen['si'], chosen['kind'])] += 1
            terminal = outq <= QE
            # E5 window lower end (barrier end value bounded below)
            if chosen['kind'] == 'sharp-r2':
                if terminal:
                    if not (QE >= chosen['qlo']): fails['E5-window-terminal'] += 1
                    m = QE - chosen['qlo']
                else:
                    low_end = (q + 2 / c) * A(x, 17) - 2 / c
                    m = low_end - chosen['qlo']
                    if not (m >= 0): fails['E5-window'] += 1
                    if not (q <= chosen['qhi']): fails['E5-window-top'] += 1
                win_margin = m if win_margin is None or m < win_margin else win_margin
            if log_every and (i * PARTS + j) % log_every == 0:
                print(i, j, float(q), chosen['kind'], float(h), float(c), flush=True)
            steps.append((i, j, q, chosen['kind'], chosen['si'], chosen['ki'], h, c))
            if terminal:
                z = c * (q - QE) / (2 + c * QE)
                if not (0 < z < 1): fails['E6-zdomain'] += 1
                lg11 = sum(((-1)**(kk + 1) * z**kk / kk for kk in range(1, 12)), F(0))       # >= log(1+z) (Leibniz)
                lgB = z - z * z / (2 * (1 + z))                                               # >= log(1+z) (f' = 2z^2/(4(1+z)^2) >= 0)
                lag = lg11 / c; lagB = lgB / c
                if not (0 < lag <= DELTA): fails['E6-lag-in-cell'] += 1
                U = BL.ceilq(now + lag + QE / 2)
                if not (U >= now + lagB + QE / 2): fails['E6-altlog'] += 1
                if not (U < F(41, 250)): fails['E6-horizon'] += 1
                return dict(U=U, cell=i, sub=j, now=now, lag=lag, lagB=lagB, z=z, steps=steps, fails=fails, stats=stats, hmin=hmin,
                            hmax=hmax, win_margin=win_margin, maxcd=maxcd, kuse=kuse, q_terminal_start=q)
            # E6 (location of t_e): on a non-terminal step the barrier end value, bounded below by A17, stays > q_e,
            # so B cannot reach q_e before the terminal substep and t_e lies in the terminal substep.
            if not ((q + 2 / c) * A(x, 17) - 2 / c > QE): fails['E6-early-crossing'] += 1
            qn = ceil_grid(outq, 2**96)
            # E4: stored enclosure equals the ceiling of the A18 image (A18 >= exp(-x)), so B(t_{k+1}) <= q_{k+1}
            if not (qn >= (q + 2 / c) * A(x, 18) - 2 / c): fails['E4-enclosure'] += 1
            q = qn
    raise SystemExit('no terminal crossing')


if __name__ == '__main__':
    name, out = sys.argv[1], sys.argv[2]
    t0 = time.time()
    R = run_def(name)
    res = replay(R)
    q0 = F(R['q0'])
    if R['band'] == 1:
        qm = q_mty_upper(R.get('xl', XL), 256)
        start = dict(x_L=str(R.get('xl', XL)), q0=str(q0), q_mty_upper=str(qm), q_mty_float=float(qm), margin=float(q0 - qm), ok=bool(q0 > qm))
    else:
        start = dict(q0=str(q0), ok=bool(q0 > 1), margin=float(q0 - 1))
    summary = dict(run=name, U=str(res['U']), U_float=float(res['U']), expect=str(R['expect']), reproduced=bool(res['U'] == R['expect']),
                   terminal_cell=res['cell'], terminal_sub=res['sub'], t_K=str(res['now']), t_K_float=float(res['now']), n_steps=len(res['steps']), lag=float(res['lag']), lagB=float(res['lagB']),
                   fails=dict(res['fails']), stats={str(k): v for k, v in res['stats'].items()}, kernels_used={str(k): v for k, v in res['kuse'].items()},
                   h_min=str(res['hmin']), h_max=str(res['hmax']), h_min_float=float(res['hmin']), h_max_float=float(res['hmax']),
                   window_min_margin=(float(res['win_margin']) if res['win_margin'] is not None else None),
                   max_c_delta=float(res['maxcd']), start=start, seconds=round(time.time() - t0, 1),
                   sets=[str(s) for s in R['kaps']], pattern=R.get('pattern'))
    json.dump(summary, open(out, 'w'), indent=1)
    print(json.dumps({k: summary[k] for k in ['run', 'U', 'reproduced', 'fails', 'h_min_float', 'h_max_float', 'window_min_margin', 'start', 'seconds']}))
