#!/usr/bin/env python3
"""export_f2: extract the F2 run (tmp/qrh-tune-out/F2_final.steps.jsonl.gz) into the compact form used by the Lean
verifier (kernel table, floor table, run list), re-run the chain with exactly the integer algorithm of the Lean
checker, and cross-check every substep against the dump (q, rate, cap) and the final value U.

Output: JSON with kernels, floors, runs, chunk boundary states (substep index n, q = P/Q) and the simulated U.
usage: export_f2.py DUMP.jsonl.gz OUT.json [--chunk-steps K]
"""
import sys, json, gzip
from fractions import Fraction as F
from collections import OrderedDict, Counter

ROOT = '/Users/USER/Documents/GitHub/mathexplorer/tmp/'
CATK = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'inputs', 'KERNELS.json')))['rows']
TWO96 = 2 ** 96
QE = F(1, 10 ** 8)
DELTA = F(1, 512000)


def capof(r, M, v):
    a = r * r
    if 3 * a >= 1:
        return min(M, 2 / (1 + a))
    if (1 + a - v) ** 2 >= 4 * a * (1 + a):
        return min(M, 2 * (1 + a - v) / ((1 + a - v) ** 2 + 4 * a * v))
    return M


def sr(a, v):
    return 2 * (1 + a - v) / ((1 + a - v) ** 2 + 4 * a * v)


def cap_ok(a, v, cap):
    if 3 * a >= 1 and cap >= 2 / (1 + a):
        return True
    if 4 * a * (1 + a) <= (1 + a - v) ** 2 and v <= 1 + a and sr(a, v) <= cap:
        return True
    if 2 * cap >= 1 and a + 1 <= a * (2 * cap - 1) ** 2:
        return True
    return False


def horner(N, D):
    Fv, Coef = 1, 1
    for j in range(17, -1, -1):
        Coef = Coef * D * (j + 1)
        NF = N * Fv
        if NF > Coef:
            raise ValueError('horner underflow')
        Fv = Coef - NF
    return Fv, Coef


SETS = {
    'W4': ('routes-b3-9-out/archive/W4_single/TABLES.json', 'routes-b3-9-out/plans/W4_single.json'),
    'm097': ('routes-b3-9-out/archive/X1_P0_97/TABLES.json', 'b145-B-out/plans/X1_mult_0_97b.json'),
    'm094': ('routes-b3-9-out/archive/X1_m0.94_c200_600/TABLES.json', 'routes-b3-9-out/plans/X1_mult_0.94.json'),
    'm091': ('routes-b3-9-out/archive/X1_m0.91_c200_600/TABLES.json', 'routes-b3-9-out/plans/X1_mult_0.91.json'),
    'QA_m0.88': ('qrh-tune-out/archive/QA_m0.88/TABLES.json', 'qrh-tune-out/plans/QA_m0.88.json'),
    'QB_m0.91': ('qrh-tune-out/archive/QB_m0.91/TABLES.json', 'qrh-tune-out/plans/QB_m0.91.json'),
    'QC_cliff': ('qrh-tune-out/archive/QC_cliff/TABLES.json', 'qrh-tune-out/plans/QC_cliff.json'),
}
R3FILES = ['routes-b2-r3-out/tab_P.json', 'routes-b3-combine-out/tab_X.json', 'routes-b3-combine-out/tab_X2.json']


def provenance(flist):
    """re-read every floor entry from the raw table files (same sources as tmp/qrh-ref-verify.py)."""
    import glob
    plan = json.load(open(ROOT + 's145-1-g1/data/PLAN.json'))
    PH = {r['time_index']: F(r['height']) for r in plan['rows']}
    TA = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'inputs', 'TABLES_NEW.json')))
    CERTF = json.load(open(ROOT + 'routes-b4-rec-joint-out/collect6/merge/certfile_fullref.json'))
    tabs = {}
    for lab, (tp, pp) in SETS.items():
        tb = json.load(open(ROOT + tp)); pl = json.load(open(ROOT + pp))['rows']
        tabs[lab] = ({int(k): v for k, v in tb.items()}, {r['time_index']: F(r['height']) for r in pl}, tp)
    JF = {}
    for p in R3FILES:
        dd = json.load(open(ROOT + p))
        for i, row in dd['tables'].items():
            for mid, v in row.items():
                JF.setdefault((int(i), mid), []).append((F(v['both']), p))
    R2 = {}
    for pat in ['r2-refF-out/corrected_m0023/batch_*.json', 'r2-refF-out/corrected_m0023/adapt*/batch_P*.json']:
        for f in sorted(glob.glob(ROOT + pat)):
            rel = f[len(ROOT):]
            for key, e in json.load(open(f)).items():
                if e.get('status') != 'ok': continue
                ck = key + '@' + rel
                if ck not in CERTF: continue
                R2.setdefault(key, []).append((F(e['floor_str']) + F(CERTF[ck]), F(e['h']), e.get('q_lo'), e.get('q_hi'), ck))
    bad = 0
    for f in flist:
        i, src, r, h, ell = f['cell'], f['src'], F(f['r']), F(f['h']), F(f['ell'])
        mode = 'r_%d_%d' % (r.numerator, r.denominator)
        if src.startswith('X:'):
            lab = src.split(':')[1]; tb, pl, tp = tabs[lab]
            ok = pl.get(i) == h and i in tb and F(tb[i][mode]['both']) == ell
            f['file'] = tp + '#' + str(i) + '.' + mode + '.both'
        elif src.startswith('R3:'):
            mid = src.split(':')[1]
            hits = [p for v, p in JF.get((i, mid), []) if v == ell]
            ok = h == PH[i] and bool(hits) and ell == max(v for v, _ in JF[(i, mid)])
            f['file'] = (hits[0] if hits else '?') + '#' + str(i) + '.' + mid + '.both'
        else:
            kap = src.split(':')[1]
            key = '%d|%s|%s' % (i, kap, mode)
            hits = [ck for fl, eh, ql, qh, ck in R2.get(key, []) if fl == ell and eh == h and ql is None and qh is None]
            ta = kap == '1' and mode in TA[i] and F(TA[i][mode]['both']) == ell
            ok = h == PH[i] * F(kap) and (bool(hits) or ta)
            f['file'] = hits[0] if hits else ('/tmp/b145-A-archive/TABLES_NEW.json#' + str(i) + '.' + mode if ta else '?')
        if not ok:
            bad += 1
    return bad


def main():
    dump, out = sys.argv[1], sys.argv[2]
    chunk = int(sys.argv[sys.argv.index('--chunk-steps') + 1]) if '--chunk-steps' in sys.argv else 1000
    recs = []
    with gzip.open(dump, 'rt') as fh:
        for line in fh:
            recs.append(json.loads(line))
    kers = OrderedDict(); floors = OrderedDict(); runs = []
    per_step = []
    for n, r in enumerate(recs):
        i = n // 128
        if 'multi' in r:
            m = r['multi']; ch = m['choice'][0]
            assert len(m['choice']) == 1 and len(m['caps']) == 1 and len(m['cw']) == 1 and F(m['cw'][0][0]) == 1
            assert m['cw'][0][1][1] == 'fixed'
            src = m['mid'] if m['mid'].startswith('X:') else 'R3:' + m['mid']
            kk = (F(ch['r']), F(ch['lam']), F(ch['rho']), F(ch['self_cap']))
            kcert = ch['cert']
            fk = (i, src, F(ch['r']), F(m['h']), F(m['ell']))
            cap = F(m['cap']); h = F(m['h'])
        else:
            o = r['opt']; k = CATK[int(o['ki'])]
            assert o['kind'] == 'cat' and o['qlo'] is None
            src = 'CAT:' + r['set'] + ':k' + str(o['ki'])
            kk = (F(k['r']), F(k['lambda']), F(k['rho']), F(k['self_cap']))
            kcert = 'catalogue:KERNELS.json#' + str(o['ki'])
            fk = (i, src, F(k['r']), F(o['h']), F(o['ell']))
            cap = F(o['cap']); h = F(o['h'])
        if kk not in kers:
            kers[kk] = (len(kers), kcert)
        if fk not in floors:
            floors[fk] = len(floors)
        key = (floors[fk], kers[kk][0])
        if runs and runs[-1][0] == key[0] and runs[-1][1] == key[1]:
            runs[-1][2] += 1
        else:
            runs.append([key[0], key[1], 1])
        per_step.append((F(r['q']), F(r['rate']), cap, r.get('outq')))
    klist = [None] * len(kers)
    for kk, (idx, cert) in kers.items():
        klist[idx] = dict(r=str(kk[0]), lam=str(kk[1]), rho=str(kk[2]), M=str(kk[3]), cert=cert)
    flist = [None] * len(floors)
    for fk, idx in floors.items():
        flist[idx] = dict(cell=fk[0], src=fk[1], r=str(fk[2]), h=str(fk[3]), ell=str(fk[4]))
    # ---------------------------------------------------------------- simulate with the Lean integer algorithm
    q = F(5625001, 10 ** 7)
    P, Q = 5625001, 10 ** 7
    n = 0
    states = [dict(n=0, P=P, Q=Q)]
    mism = Counter(); U = None; s1 = None
    for ri, (fi, ki, ln) in enumerate(runs):
        fl = flist[fi]; kr = klist[ki]
        r, lam, rho, M = F(kr['r']), F(kr['lam']), F(kr['rho']), F(kr['M'])
        h, ell = F(fl['h']), F(fl['ell'])
        assert F(fl['r']) == r
        for s in range(ln):
            i = n // 128; j = n % 128
            assert fl['cell'] == i
            q = F(P, Q)
            dq, drate, dcap, _ = per_step[n]
            if dq != q: mism['q'] += 1
            v = q / (h * h)
            cap = capof(r, M, v)
            if cap != dcap: mism['cap'] += 1
            assert v <= rho * rho and h * r < 2 and F(1, 2) <= h <= F(5, 2) and cap_ok(r * r, v, cap)
            c = 2 * lam / h * (ell - cap / h)
            if c != drate: mism['rate'] += 1
            assert c > 0
            a, b = c.numerator, c.denominator
            N, D = a, 512000 * b
            assert N < D
            Fv, Coef = horner(N, D)
            A = P * a + 2 * b * Q
            twoBQC = 2 * b * Q * Coef
            den = Q * a * Coef
            if n == 0:
                s1 = q - (2 + c * q) * QE - F(9, 16)
                assert s1 > 0
            N18 = N ** 18
            assert N18 <= Fv
            # terminal test exactly as consumer: outq <= QE
            if 10 ** 8 * A * Fv <= 10 ** 8 * twoBQC + den:
                # terminal
                z = c * (q - QE) / (2 + c * QE)
                assert 0 < z < 1
                l11 = sum((F((-1) ** (kk + 1), kk) * z ** kk for kk in range(1, 12)), F(0))
                lB = z - z * z / (2 * (1 + z))
                now = F(n, 512000)
                lag = l11 / c
                assert 0 < lag <= DELTA
                Uq = now + lag + QE / 2
                U = F(-((-Uq.numerator * 10 ** 15) // Uq.denominator), 10 ** 15)
                assert U >= now + lB / c + QE / 2 and U < F(41, 250)
                n += 1
                assert ri == len(runs) - 1 and s == ln - 1, 'terminal not at end'
                break
            assert 10 ** 8 * twoBQC + den < 10 ** 8 * (A * (Fv - N18)), 'early crossing'
            num = A * Fv - twoBQC
            P = (TWO96 * num + den - 1) // den; Q = TWO96
            n += 1
            if n % chunk == 0:
                states.append(dict(n=n, P=P, Q=Q))
    bad = provenance(flist)
    res = dict(q0=[5625001, 10 ** 7], qb='9/16', provenance_failures=bad,
               description='F2: re-tuned route-P single-band consumer, 7/8 start q0 = 9/16 + 1e-7, tmp/qrh-tune-out/F2_final.steps.jsonl.gz',
               kernels=klist, floors=flist, runs=runs, states=states, U=str(U), steps=n, s1=str(s1), mismatches=dict(mism),
               nkernels=len(klist), nfloors=len(flist), nruns=len(runs), src_counts=dict(Counter(f['src'].split(':')[0] + ':' + f['src'].split(':')[1] for f in flist)))
    json.dump(res, open(out, 'w'), indent=0)
    print(json.dumps({k: res[k] for k in ['provenance_failures', 'U', 'steps', 's1', 'mismatches', 'nkernels', 'nfloors', 'nruns', 'src_counts']}))


if __name__ == '__main__':
    main()
