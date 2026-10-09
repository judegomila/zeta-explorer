#!/usr/bin/env python3
"""export_r78: replay Raymond's chain with the 7/8 start (tmp/oai-lambda-raymond.py integrate: catalogue kernels, X1 joint
floors at PLAN heights, kind 'both', choice = max rate, q0 = 9/16 + 2e-6) in exact rationals, record the chosen option of
every substep, and write the compact export used by scripts/gen_lean.py.  Also re-derives U with the Lean integer algorithm.
usage: export_r78.py OUT.json
"""
import sys, json
from fractions import Fraction as F

ROOT = '/Users/USER/Documents/GitHub/mathexplorer/tmp/'
KERNELS = json.load(open('/tmp/raymond_pr/pr/Proof_and_Replay/Evidence/numerical/parent_numerical/KERNELS.json'))['rows']
PLAN = json.load(open(ROOT + 's145-1-g1/data/PLAN.json'))
TABLES = [{m: {k: F(v) for k, v in d.items()} for m, d in row.items()} for row in json.load(open(ROOT + 's145-1-g1/out/X1/TABLES.json'))]
QE = F(1, 10 ** 8)
TWO96 = 2 ** 96


def self_cap(k, V):
    a = F(k['r']) ** 2; M = F(k['self_cap'])
    assert 0 <= V <= F(k['rho']) ** 2
    if 3 * a >= 1: return min(M, 2 / (1 + a))
    if (1 + a - V) ** 2 >= 4 * a * (1 + a): return min(M, 2 * (1 + a - V) / ((1 + a - V) ** 2 + 4 * a * V))
    return M


def expminus(x):
    assert 0 <= x < 1
    s = term = F(1)
    for j in range(1, 19): term *= -x / j; s += term
    return s


def ceilq(x, d): return F(-((-x.numerator * d) // x.denominator), d)


def main():
    out = sys.argv[1]
    th = F(7, 8); qb = (2 * th - 1) ** 2; q0 = qb + F(2, 10 ** 6)
    q = q0; dt = F(PLAN['step']); parts = 128; delta = dt / parts
    choices = []; U = None; first = True
    for i, spec in enumerate(PLAN['rows']):
        h = F(spec['height']); tl = F(spec['t_lo'])
        for j in range(parts):
            now = tl + j * delta; v = q / (h * h); opts = []
            for ki, k in enumerate(KERNELS):
                rh, lam, r = map(F, [k['rho'], k['lambda'], k['r']])
                if v > rh * rh: continue
                assert h * r < 2
                ell = TABLES[i]['r_' + k['r'].replace('/', '_')]['both']
                cap = self_cap(k, v); rate = 2 * lam / h * (ell - cap / h)
                if rate > 0: opts.append((rate, ki))
            if 0 < v < 1 and 29 * v * v - v - 1 <= 0:
                ell = TABLES[i]['sharp']['both']; cap = 6 / (4 - v); rate = 4 / h * (ell - cap / h)
                if rate > 0: opts.append((rate, -1))
            rate, ki = max(opts)
            assert ki >= 0, 'sharp mode chosen (not supported by the Lean checker)'
            if first:
                assert q - (2 + rate * q) * QE > qb; first = False
            choices.append((i, ki))
            outq = (q + 2 / rate) * expminus(rate * delta) - 2 / rate
            if outq <= QE:
                z = rate * (q - QE) / (2 + rate * QE)
                lg = sum((F((-1) ** (kk + 1), kk) * z ** kk for kk in range(1, 12)), F(0))
                U = ceilq(now + lg / rate + QE / 2, 10 ** 15)
                break
            q = ceilq(outq, TWO96)
        if U is not None: break
    # compact export
    kers = {}; floors = {}; runs = []
    for n, (i, ki) in enumerate(choices):
        k = KERNELS[ki]
        kk = ki
        if kk not in kers:
            kers[kk] = dict(r=k['r'], lam=k['lambda'], rho=k['rho'], M=k['self_cap'], cert='catalogue:KERNELS.json#' + str(ki))
        mode = 'r_' + k['r'].replace('/', '_')
        fk = (i, ki)
        if fk not in floors:
            floors[fk] = dict(cell=i, src='X1:' + mode, r=k['r'], h=PLAN['rows'][i]['height'], ell=str(TABLES[i][mode]['both']),
                              file='s145-1-g1/out/X1/TABLES.json#' + str(i) + '.' + mode + '.both')
    kidx = {k: j for j, k in enumerate(sorted(kers))}
    flist = list(floors.values()); fidx = {k: j for j, k in enumerate(floors)}
    for n, (i, ki) in enumerate(choices):
        key = (fidx[(i, ki)], kidx[ki])
        if runs and runs[-1][0] == key[0] and runs[-1][1] == key[1]: runs[-1][2] += 1
        else: runs.append([key[0], key[1], 1])
    res = dict(q0=[q0.numerator, q0.denominator], qb=str(qb), U=str(U), steps=len(choices),
               description="R78: Raymond's chain alone with the 7/8 start q0 = 9/16 + 2e-6 (tmp/oai-lambda-raymond.py), X1 floors at PLAN heights",
               kernels=[kers[k] for k in sorted(kers)], floors=flist, runs=runs)
    json.dump(res, open(out, 'w'), indent=0)
    print(json.dumps(dict(U=res['U'], steps=res['steps'], kernels=len(res['kernels']), floors=len(flist), runs=len(runs), q0=str(q0))))


if __name__ == '__main__':
    main()
