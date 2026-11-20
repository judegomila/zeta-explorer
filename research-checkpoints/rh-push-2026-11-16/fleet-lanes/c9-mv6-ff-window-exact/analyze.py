"""analyze.py : exact statistics from results/*.txt (ffw enw output), completed rows for N = 3, comparison with predictions.json, verdict rule of PREREG.md.
Every e = E/(X D) is an exact Fraction; floats only in logs, slopes and the display."""
import os, re, json, math, sys
from fractions import Fraction as Fr
from plan import *
from fit import slope
from ffpy import FF, mul, add, norm
RESDIR = os.environ.get('C9_RESDIR', 'results')
def load(q, N, lam, d):
    fn = f'{RESDIR}/q{q}_N{N}_lam{lam}_d{d}.txt'
    if not os.path.exists(fn): return None
    W = []; rows = {}
    for line in open(fn):
        t = line.split()
        if not t: continue
        if t[0] == 'ENW':
            f = [x.strip() for x in line.split('|')]
            h = f[0].split(); W.append({'mode': int(h[5]), 'p': tuple(int(x) for x in h[6:9]), 'np': int(f[1]), 'sumnorm': int(f[2]), 'diag': int(f[3]), 'sW2': int(f[4]), 'maxnorm': int(f[5])})
        elif t[0] == 'ROW': rows.setdefault(int(t[1]), []).append((int(t[3]), int(t[4])))
    if not W: return None          # marker file of a size dropped for time
    for i, w in enumerate(W):
        w['rows'] = rows[i]; assert len(rows[i]) == q**d and sum(norm(r) for r in rows[i]) == w['sumnorm']
    return W
def completed(q, lam, d, name, w3, W0, F):
    """rows of the completed N = 3 vector: R = S_3 + Jbar V(m) S_0 (units G_2^(3+lam)); diagonal = diag_3 + q * np * sum_{n, u(n) != 0} #{m : (m, n) = 1}."""
    nm = q**d; ms = [F.idx2poly(i, d) for i in range(nm)]; Wq = weights(q); mode, p1, p2, p3 = Wq[name]
    lin = [F.idx2poly(i, 1) for i in range(q)]
    def chi3(n, m):
        c = F.chi(n, m); return 0 if c is None else (-1 if c & 1 else 1)
    if name in ('one', 'a', 'b', 'c4', 'mu'):
        S0 = W0[0]['rows']
        if name == 'one': u = [1]*q
        elif name == 'mu': u = [-1]*q
        else:
            Fp = F.idx2poly(p2, p1); u = []
            for n in lin:
                R = F.res(Fp, n); u.append(0 if R == 0 else (-1 if (p3*F.L6[R]) % 6 == 3 else 1))
        V = [sum(u[i]*chi3(n, m) for i, n in enumerate(lin)) for m in ms]
        sup = [i for i in range(q) if u[i] != 0]
    elif name == 'al':
        S0 = W0[1]['rows']; cnt = 0; m0 = None
        for mi, m in enumerate(ms):
            if F.irreducible(m):
                m0 = m; break
        V = [sum(chi3(n, m0)*chi3(n, m) for n in lin) for m in ms]; sup = [i for i in range(q) if chi3(lin[i], m0) != 0]
    else:  # r1: random sixth roots on n (fixed table), times the random phases on P of the companion run
        import random
        rnd = random.Random(20261119); ph = [rnd.randrange(6) for _ in range(q)]
        from ffpy import ZP
        S0 = W0[2]['rows']; V = None; sup = list(range(q))
        Vc = []
        for m in ms:
            s = (0, 0)
            for i, n in enumerate(lin):
                c = chi3(n, m)
                if c: s = add(s, mul(ZP[ph[i]], (c, 0)))
            Vc.append(s)
    rows = []
    for mi in range(nm):
        v = Vc[mi] if V is None else (V[mi], 0)
        rows.append(add(w3['rows'][mi], mul(F.Jb, mul(v, S0[mi]))))
    cop = sum(sum(1 for m in ms if F.chi(lin[i], m) is not None) for i in sup)
    completed.rows = rows; completed.sup_n = sup; completed.V = V; completed.S0 = S0
    return sum(norm(r) for r in rows), w3['diag'] + q * w3['np'] * cop
if __name__ == '__main__':
    P = json.load(open('predictions.json')); out = []; FFs = {7: FF(7), 13: FF(13)}
    for fam, (q, N, d, lams) in FAM.items():
        Wq = weights(q); names = list(Wq)
        for lam in lams:
            W = load(q, N, lam, d)
            if W is None: out.append({'fam': fam, 'q': q, 'N': N, 'lam': lam, 'd': d, 'run': False}); continue
            W0 = load(q, 0, lam, d) if N == 3 else None
            rec = {'fam': fam, 'q': q, 'N': N, 'lam': lam, 'd': d, 'run': True, 'np': W[0]['np'], 'w': {}}
            for i, name in enumerate(names):
                w = W[i]; assert w['mode'] == Wq[name][0]
                r = {'sumnorm': w['sumnorm'], 'diag': w['diag'], 'e_sqf': Fr(w['sumnorm'], w['diag']), 'nsupp': w['sW2']}
                if N == 3:
                    if W0 is not None:
                        sn, dg = completed(q, lam, d, name, w, W0, FFs[q]); r['sumnorm_c'] = sn; r['diag_c'] = dg; r['e'] = Fr(sn, dg); r['completed'] = True
                    else: r['e'] = r['e_sqf']; r['completed'] = False
                else: r['e'] = r['e_sqf']; r['completed'] = True     # N = 2: no cube part
                pk = f'{q} {N} {lam} {d} {name}'
                if pk in P: r['B_coh'] = P[pk]['B_coh']; r['pred'] = P[pk]['e_pred']; r['rstar'] = max([a[1] for a in P[pk]['active']], default=None)
                rec['w'][name] = r
            out.append(rec)
    def fl(x): return float(x)
    L = []
    L.append('TABLE 1. e = E/(X D) (exact rational, shown as float); N = 3: completed row (squarefree row in brackets). rmax = N + lam - 1 - d + floor(d/2).')
    for q in (7, 13):
        names = list(weights(q)); L.append(f'q = {q}: family (N,lam,d) rmax | ' + ' | '.join(names))
        for rec in out:
            if rec['q'] != q: continue
            cfg = f"{rec['fam']} ({rec['N']},{rec['lam']},{rec['d']}) {rmax(rec['N'], rec['lam'], rec['d'])}"
            if not rec['run']: L.append(cfg + ' | not run'); continue
            cells = []
            for n in names:
                r = rec['w'][n]; s = f"{fl(r['e']):.4g}"
                if rec['N'] == 3: s += f" [{fl(r['e_sqf']):.4g}]" + ('' if r['completed'] else ' (squarefree only)')
                cells.append(s)
            L.append(cfg + ' | ' + ' | '.join(cells))
    # predictions
    L.append(''); L.append('TABLE 2. Advance predictions (real weights): e against the interval [(1-1/q)^2 B_coh, B_coh + 1.1]; seen = value known before PREREG.')
    seen = {(7, 2, 7, 2), (7, 2, 10, 2), (7, 2, 8, 2)}
    hit = miss = 0; hm = {}
    for rec in out:
        if not rec['run']: continue
        for n, r in rec['w'].items():
            if 'pred' not in r: continue
            e = fl(r['e_sqf']) if rec['N'] == 3 else fl(r['e']); lo, hi = r['pred']; ok = lo <= e <= hi
            s = (rec['q'], rec['N'], rec['lam'], rec['d']) in seen and not (n in ('one',) and rec['lam'] == 10)
            if not s:
                hit += ok; miss += (not ok); k = ('active' if r['B_coh'] > 0 else 'inactive', n if n in ('one', 'mu') else 'target'); hm.setdefault(k, [0, 0])[0 if ok else 1] += 1
            L.append(f"q={rec['q']} ({rec['N']},{rec['lam']},{rec['d']}) {n}: B_coh {r['B_coh']:.4g} predicted [{lo:.3g}, {hi:.3g}] measured {e:.4g} {'HIT' if ok else 'MISS'}{' (seen)' if s else ''}" + (' [squarefree row]' if rec['N'] == 3 else ''))
    L.append(f'advance predictions (unseen): {hit} hit, {miss} missed; by class (hit, miss): ' + str({f'{k[0]}/{k[1]}': tuple(v) for k, v in sorted(hm.items())}))
    # slopes
    L.append(''); L.append('TABLE 3. Slopes of log_q(x), x = e - 1, against the active dual length r*, active N = 2 configurations (rule of PREREG section 3).')
    verdict = {}
    for q in (7, 13):
        for n in list(weights(q)):
            if n in ('al', 'r1'): continue
            pts = []
            for rec in out:
                if rec['q'] != q or rec['N'] != 2 or not rec['run']: continue
                r = rec['w'][n]
                if r.get('B_coh', 0) <= 0: continue
                x = fl(r['e']) - 1; pts.append((r['rstar'], math.log(max(x, 0.01), q), x, f"({rec['N']},{rec['lam']},{rec['d']})"))
            pts.sort(); b = slope([p[0] for p in pts], [p[1] for p in pts])
            big = max((p for p in pts), key=lambda p: (p[0], p[2]))[2] if pts else None
            verdict[(q, n)] = (len(pts), b, big)
            L.append(f"q={q} {n}: {len(pts)} sizes; slope {None if b is None else round(b, 4)}; x at the largest r*: {None if big is None else round(big, 4)}; points (r*, x): " + ', '.join(f"{p[3]} r*={p[0]} x={p[2]:.4g}" for p in pts))
    L.append(''); L.append('Cross-q exponent ln(x_13/x_7)/ln(13/7):')
    for cfg in [(2, 7, 2), (2, 8, 3), (2, 10, 1), (2, 8, 2), (2, 9, 2), (2, 7, 1), (2, 8, 1), (2, 9, 1), (3, 9, 1)]:
        a = next((r for r in out if r['run'] and (r['q'], r['N'], r['lam'], r['d']) == (7,) + cfg), None); b = next((r for r in out if r['run'] and (r['q'], r['N'], r['lam'], r['d']) == (13,) + cfg), None)
        if a and b:
            for n in ('one', 'a', 'mu'):
                xa = fl(a['w'][n]['e']) - 1; xb = fl(b['w'][n]['e']) - 1
                L.append(f"{cfg} {n}: x_7 = {xa:.4g}, x_13 = {xb:.4g}" + (f", exponent {math.log(xb/xa)/math.log(13/7):.3f}" if xa > 0 and xb > 0 else ', no exponent (an excess is <= 0)'))
    # controls
    L.append(''); L.append('CONTROLS.')
    okr = oka = True; nr = na = 0
    for rec in out:
        if not rec['run']: continue
        q, d = rec['q'], rec['d']; r1 = fl(rec['w']['r1']['e']) - 1; band = 3/math.sqrt(q**d)
        nr += 1
        if abs(r1) > band: okr = False; L.append(f"r1 outside the band: q={q} ({rec['N']},{rec['lam']},{rec['d']}) x = {r1:.4g}, band {band:.3g}")
        al = rec['w']['al']; ea = fl(al['e']); ratio = fl(al['e_sqf']) / (al['nsupp'] / q**d); na += 1
        if not (ea - 1 > 100 and 0.5 <= ratio <= 2): oka = False; L.append(f"al outside: q={q} ({rec['N']},{rec['lam']},{rec['d']}) e = {ea:.4g}, e_sqf/(nsupp/q^d) = {ratio:.4g}")
    L.append(f'r1 inside |x| <= 3/sqrt(q^d) in all {nr} configurations: {okr}; al: x > 100 and e/(nsupp/q^d) in [0.5, 2] in all {na} configurations: {oka}')
    for q in (7, 13):
        n_, b, big = verdict[(q, 'mu')]; L.append(f'mu (Liouville-twisted) q={q}: {n_} sizes, slope {None if b is None else round(b, 4)}, x at the largest r* {None if big is None else round(big, 2)}: control ' + ('passes' if b is not None and b > 0 and big >= 30 else 'DOES NOT PASS'))
    # rule
    L.append(''); L.append('RULE (PREREG section 3).')
    fails = []; holds = True
    for n in PROBE[7]:
        n7, b7, x7 = verdict[(7, n)]; n13_name = n if n in PROBE[13] else PROBE[13][2]; n13, b13, x13 = verdict[(13, n13_name)]
        f7 = n7 >= 3 and b7 is not None and b7 > 0 and x7 >= 1
        f13 = (n13 < 3) or (b13 is not None and b13 > 0 and x13 >= 1)
        L.append(f'probe vector {n} (q=13: {n13_name}): q=7: {n7} sizes, slope {None if b7 is None else round(b7,4)}, x at largest r* {None if x7 is None else round(x7,3)} -> {"positive growth" if f7 else "no positive growth by the rule"}; q=13: {n13} sizes, slope {None if b13 is None else round(b13,4)}, x at largest r* {None if x13 is None else round(x13,3)} -> {"(fewer than three active sizes: q=13 not required)" if n13 < 3 else ("positive growth" if f13 else "no positive growth by the rule")}')
        if f7 and f13: fails.append(n)
        if not (n7 >= 3 and b7 is not None and b7 <= 0): holds = False
    maxx = max(fl(rec['w'][n]['e']) - 1 for rec in out if rec['run'] for n in PROBE[rec['q']])
    L.append(f'largest excess of a probe vector over all configurations run: {maxx:.4g}')
    L.append('VERDICT BY THE RULE: ' + ('FAILS in the model (probe vectors: ' + ', '.join(fails) + ')' if fails else ('HOLDS in the model' if holds and maxx <= 1 else 'UNDECIDED')))
    open('summary.txt', 'w').write('\n'.join(L) + '\n'); print('\n'.join(L))
    json.dump([{**{k: v for k, v in rec.items() if k != 'w'}, 'w': {n: {k: (str(v) if isinstance(v, Fr) else v) for k, v in r.items()} for n, r in rec.get('w', {}).items()}} for rec in out], open('results.json', 'w'), indent=0)
