"""report.py : tables (tables.md) and the pre-registered rules (rules.txt) from the exact slot split.  Floats only for display; every comparison is on exact Fractions."""
import statistics as st, json, math
from fractions import Fraction as Fr
import analyze_slot as A
R = A.main()
def g(x, n=3): return f'{float(x):.{n}g}'
def gs(x): return f'{float(x):+.3f}'
cfgs = sorted({k[:5] for k in R}, key=lambda c: (c[0], c[1], c[4], c[3], c[2]))
def cls(c, name): return [R[k] for k in sorted(R) if k[:5] == c and k[5].rstrip('0123456789') == name and k[5] != name]
def rmax(N, lam, d): return N + lam - 1 - d + d//2
T = []; P = T.append
REAL = ('one', 'a', 'b', 'c4', 'mu')
# ---------- table 1: squarefree rows (N = 2: these are the completed rows), probe vectors and mu
for q in (7, 13):
    for N in (2, 3):
        sec = second = 'b' if q == 7 else 'c4'
        P(f'\n**q = {q}, N = {N}, squarefree rows' + (' (= completed rows, Lemma P of c9)' if N == 2 else '') + '.** Columns per vector: e = E/D; c = Cross/D; beta = B/D; n = e - beta. s = SD/D is given once (range over the real vectors).\n')
        P(f'| (N, lam, d) | rmax | kind | s - 1 (range, real vectors) | a: e | a: c | a: beta | a: n | {sec}: e | {sec}: beta | {sec}: n | mu: e | mu: c | mu: beta | mu: n | one: e | one: beta | one: n | class U: n (min .. max) | class U: beta (min .. max) |')
        P('|' + '---|' * 20)
        for c in cfgs:
            if c[0] != q or c[1] != N or c[4] != 0: continue
            _, _, lam, d, _ = c; a = R[c + ('a',)]; b = R[c + (sec,)]; mu = R[c + ('mu',)]; one = R[c + ('one',)]; U = cls(c, 'U')
            sr = [R[c + (w,)]['s'] - 1 for w in REAL if c + (w,) in R] + [u['s'] - 1 for u in U]
            P(f"| ({N}, {lam}, {d}) | {rmax(N, lam, d)} | {a['kind']} | {float(min(sr)):+.1e} .. {float(max(sr)):+.1e} | {g(a['e'])} | {gs(a['c'])} | {g(a['beta'])} | {g(a['n'])} | {g(b['e'])} | {g(b['beta'])} | {g(b['n'])} | "
              f"{g(mu['e'], 4)} | {g(mu['c'], 4)} | {g(mu['beta'], 4)} | {g(mu['n'])} | {g(one['e'])} | {g(one['beta'])} | {g(one['n'])} | {g(min(u['n'] for u in U))} .. {g(max(u['n'] for u in U))} | {g(min(u['beta'] for u in U))} .. {g(max(u['beta'] for u in U))} |")
# ---------- table 2: completed rows N = 3
for q in (7, 13):
    P(f'\n**q = {q}, N = 3, completed rows (variant 1).** beta: span {{v_0, v_1}}; beta4: span {{v_0, v_1, V v_0, V v_1}}; n4 = e - beta4.\n')
    P('| (N, lam, d) | rmax | kind | a: e sqf | a: e compl | a: s | a: c | a: beta | a: beta4 | a: n4 | mu: e compl | mu: c | mu: beta | mu: beta4 | mu: n4 | one: e compl | one: beta4 | one: n4 | class U: n4 (min .. max) |')
    P('|' + '---|' * 19)
    for c in cfgs:
        if c[0] != q or c[1] != 3 or c[4] != 1: continue
        _, N, lam, d, _ = c; a = R[c + ('a',)]; mu = R[c + ('mu',)]; one = R[c + ('one',)]; U = cls(c, 'U'); a0 = R[c[:4] + (0, 'a')]
        n4 = lambda r: r['e'] - r['beta4']
        P(f"| ({N}, {lam}, {d}) | {rmax(N, lam, d)} | {a['kind']} | {g(a0['e'])} | {g(a['e'])} | {g(a['s'], 4)} | {gs(a['c'])} | {g(a['beta'])} | {g(a['beta4'])} | {g(n4(a))} | {g(mu['e'], 4)} | {g(mu['c'], 4)} | {g(mu['beta'], 4)} | {g(mu['beta4'], 4)} | {g(n4(mu))} | "
          f"{g(one['e'])} | {g(one['beta4'])} | {g(n4(one))} | {g(min(n4(u) for u in U))} .. {g(max(n4(u) for u in U))} |")
# ---------- table 3: controls
P('\n**Controls (squarefree rows).** r: random sixth roots on every column; a*e, mu*e: target a / mu with random signs on the marked primes. mean +- standard deviation over the seeds [min, max].\n')
P('| q | (N, lam, d) | seeds | r: e | r: c | a: e | a*e: e (s of a) | mu: e | mu*e: e (s of mu) | al: e | al: s | al: beta |')
P('|' + '---|' * 12)
def ms(L, k): v = [float(r[k]) for r in L]; return f"{st.mean(v):.3f} +- {(st.stdev(v) if len(v) > 1 else 0):.3f} [{min(v):.3f}, {max(v):.3f}]"
for c in cfgs:
    if c[4] != 0: continue
    q, N, lam, d, _ = c; r = cls(c, 'r'); ae = cls(c, 'a*e'); me = cls(c, 'mu*e'); a = R[c + ('a',)]; mu = R[c + ('mu',)]; al = R[c + ('al',)]
    P(f"| {q} | ({N}, {lam}, {d}) | {len(r)} | {ms(r, 'e')} | {ms(r, 'c')} | {g(a['e'])} | {ms(ae, 'e')} ({g(a['s'], 4)}) | {g(mu['e'], 4)} | {ms(me, 'e')} ({g(mu['s'], 4)}) | {g(al['e'], 4)} | {g(al['s'])} | {g(al['beta'], 4)} |")
open('tables.md', 'w').write('\n'.join(T) + '\n')
# ---------- rules
L = []; P = L.append
sq = [c for c in cfgs if c[4] == 0]
def realvecs(c): return [(w, R[c + (w,)]) for w in REAL if c + (w,) in R] + [(k[5], R[k]) for k in sorted(R) if k[:5] == c and k[5][0] == 'U']
# Rule A
bad = []; worst = (0, None); n_ = 0
for c in sq:
    if c[2] < 7: continue
    for w, r in realvecs(c):
        n_ += 1; dv = abs(r['s'] - 1)
        if dv > worst[0]: worst = (dv, (c, w))
        if dv > Fr(5, 100): bad.append((c, w, float(r['s'])))
P(f"RULE A  |s - 1| <= 0.05, real vectors, lam >= 7: {n_} vector-configurations, violations {len(bad)}; largest |s - 1| = {float(worst[0]):.2e} at {worst[1]}  ->  {'HOLDS' if not bad else 'FAILS ' + str(bad[:5])}")
w2 = (0, None); n2 = 0
for c in sq:
    if c[2] >= 7: continue
    for w, r in realvecs(c):
        n2 += 1; dv = abs(r['s'] - 1)
        if dv > w2[0]: w2 = (dv, (c, w))
P(f"        (reported, not in the rule) lam < 7: {n2} vector-configurations, largest |s - 1| = {float(w2[0]):.3f} at {w2[1]}")
for N in (2, 3):
    for lo, hi in ((3, 4), (5, 6), (7, 8), (9, 10), (11, 12)):
        v = [abs(r['s'] - 1) for c in sq if c[1] == N and lo <= c[2] <= hi for w, r in realvecs(c)]
        if v: P(f"        N = {N}, lam in [{lo}, {hi}]: max |s - 1| = {float(max(v)):.2e} ({len(v)} vector-configurations)")
# Rule B
bad = []; n_ = 0; lo_ = (9, None); hi_ = (-9, None); badmu = []; nmu = 0
for c in sq:
    for w, r in realvecs(c):
        if w == 'one': continue
        n_ += 1; cp = r['c_perp']
        if cp < lo_[0]: lo_ = (cp, (c, w))
        if cp > hi_[0]: hi_ = (cp, (c, w))
        if not (Fr(-105, 100) <= cp <= Fr(3, 2)): bad.append((c, w, float(cp)))
        if w == 'mu' and r['beta'] >= 10:
            nmu += 1
            if abs(r['c']/r['beta'] - 1) > Fr(1, 10): badmu.append((c, float(r['c']/r['beta'])))
P(f"RULE B  -1.05 <= c_perp <= 1.5 for a, b/c4, mu, class U (squarefree rows): {n_} vector-configurations, violations {len(bad)}; range [{float(lo_[0]):.3f} at {lo_[1]}, {float(hi_[0]):.3f} at {hi_[1]}]")
for b_ in bad[:12]: P(f"        violation {b_}")
P(f"        mu, beta >= 10: |c/beta - 1| <= 0.1 in {nmu - len(badmu)} of {nmu}; violations {badmu[:8]}")
P(f"        ->  {'HOLDS' if not bad and not badmu else 'FAILS'}")
for w in ('a', 'b', 'c4', 'mu', 'one', 'U'):
    v = [r['n'] for c in sq for ww, r in realvecs(c) if (ww == w or (w == 'U' and ww[0] == 'U'))]
    if v: P(f"        n = e - beta for {w}: {len(v)} values, min {float(min(v)):.3f}, median {float(sorted(v)[len(v)//2]):.3f}, max {float(max(v)):.3f}")
v = [(r['c_perp'], c) for c in sq for ww, r in realvecs(c) if ww == 'one']
P(f"        one (not in the rule): c_perp range [{float(min(v)[0]):.3f}, {float(max(v)[0]):.3f}]; above 1.5 at {[(x[1][:4], round(float(x[0]), 2)) for x in v if x[0] > Fr(3, 2)]}")
# Rule C
bad = []; n_ = 0; worst = (0, None)
for c in sq:
    if c[2] < 7: continue
    for w, r in realvecs(c):
        n_ += 1; lim = Fr(2 * (1 if c[3] == 1 else 2), c[0]**c[3])
        ratio = r['sb'] / lim
        if ratio > worst[0]: worst = (ratio, (c, w))
        if r['sb'] > lim: bad.append((c, w, float(r['sb']), float(lim)))
P(f"RULE C  sb <= 2 dim/q^d, real vectors, lam >= 7: {n_} vector-configurations, violations {len(bad)}; largest sb/(2 dim/q^d) = {float(worst[0]):.3f} at {worst[1]}  ->  {'HOLDS' if not bad else 'FAILS ' + str(bad[:5])}")
# Rule D
okr = tot = 0; oka = totA = 0; sep = nsep = 0; worstr = []
for c in sq:
    if R[c + ('a',)]['kind'] != 'F': continue
    r = [float(x['c']) for x in cls(c, 'r')]; tot += 1; m = st.mean(r); se = st.stdev(r)/math.sqrt(len(r))
    if abs(m) <= max(3*se, 0.02): okr += 1
    else: worstr.append((c[:4], round(m, 3), round(se, 3)))
    for nm_, base in (('a*e', 'a'), ('mu*e', 'mu')):
        e = [float(x['e']) for x in cls(c, nm_)]; totA += 1; m = st.mean(e) - float(R[c + (base,)]['s']); se = st.stdev(e)/math.sqrt(len(e))
        if abs(m) <= max(3*se, 0.02): oka += 1
    U = [x['c_perp'] for x in cls(c, 'U')]; a = R[c + ('a',)]['c_perp']; rng = max(U) - min(U); nsep += 1
    if a < min(U) - rng or a > max(U) + rng: sep += 1
P(f"RULE D  (i) class r: mean c within max(3 se, 0.02) of 0 in {okr} of {tot} F configurations ({100*okr/max(tot,1):.0f}%; needed 90%); outside: {worstr[:6]}")
P(f"        (ii) slot signs: mean e within max(3 se, 0.02) of s in {oka} of {totA} (a*e and mu*e; {100*oka/max(totA,1):.0f}%; needed 90%)")
P(f"        (iii) target a separated from class U in c_perp in {sep} of {nsep} F configurations")
# excess configurations: where is the excess
P('\nEXCESS CONFIGURATIONS (e >= 2), squarefree rows: vector, configuration, e, c/(e - 1), c_coh/c, beta, n')
for c in sq:
    for w in ('a', 'b', 'c4', 'mu', 'one'):
        if c + (w,) not in R: continue
        r = R[c + (w,)]
        if r['e'] >= 2: P(f"  q={c[0]} ({c[1]},{c[2]},{c[3]}) {w}: e = {g(r['e'], 4)}, c/(e-1) = {g(r['c']/(r['e']-1), 5)}, c_coh/c = {g(r['c_coh']/r['c'], 4)}, beta = {g(r['beta'], 4)}, n = {g(r['n'])}")
P('\nEXCESS CONFIGURATIONS (e >= 2), completed rows N = 3: vector, configuration, e, c/(e - 1), beta, beta4, n4, share of the excess in the enlarged span (beta4 - sb4)/c')
for c in cfgs:
    if c[4] != 1: continue
    for w in ('a', 'b', 'c4', 'mu', 'one'):
        if c + (w,) not in R: continue
        r = R[c + (w,)]
        if r['e'] >= 2: P(f"  q={c[0]} ({c[1]},{c[2]},{c[3]}) {w}: e = {g(r['e'], 4)}, c/(e-1) = {g(r['c']/(r['e']-1), 5)}, beta = {g(r['beta'], 4)}, beta4 = {g(r['beta4'], 4)}, n4 = {g(r['e'] - r['beta4'])}, (beta4 - sb4)/c = {g((r['beta4'] - r['sb4'])/r['c'], 4)}, c_perp4 = {g(r['c_perp4'])}")
# ---------- completed rows: registered expectation
P('\nCOMPLETED ROWS (N = 3, variant 1), rule B with both spans, vectors a, b/c4, mu, class U')
b2 = []; b4 = []; n_ = 0
for c in cfgs:
    if c[4] != 1: continue
    for w, r in realvecs(c):
        if w == 'one': continue
        n_ += 1
        if not (Fr(-105, 100) <= r['c_perp'] <= Fr(3, 2)): b2.append((c[:4], w, round(float(r['c_perp']), 2)))
        if not (Fr(-105, 100) <= r['c_perp4'] <= Fr(3, 2)): b4.append((c[:4], w, round(float(r['c_perp4']), 2)))
P(f"  span {{v_0, v_1}}: {n_} vector-configurations, violations {len(b2)}: {[x for x in b2 if x[1][0] != 'U'][:12]} (+ {sum(1 for x in b2 if x[1][0] == 'U')} of class U)")
P(f"  span {{v_0, v_1, V v_0, V v_1}}: violations {len(b4)}: {b4[:12]}")
# ---------- predictions of PREREG section 5
P('\nPREDICTIONS (PREREG section 5)')
v2 = [abs(r['s'] - 1) for c in sq if c[1] == 2 and c[2] >= 7 for w, r in realvecs(c)]; v3 = [abs(r['s'] - 1) for c in sq if c[1] == 3 and c[2] >= 7 for w, r in realvecs(c)]
P(f"  1. max |s - 1|: N = 2, lam >= 7: {float(max(v2)):.2e} (predicted <= 0.01); N = 3, lam >= 7: {float(max(v3)):.2e} (predicted <= 0.05)  -> {'HIT' if max(v2) <= Fr(1,100) and max(v3) <= Fr(5,100) else 'MISS'}")
tv = [(r['c_perp'], c[:4], w) for c in sq for w, r in realvecs(c) if w in ('a', 'b', 'c4')]
out = [(x[1], x[2], round(float(x[0]), 3)) for x in tv if not (-1 <= x[0] <= Fr(6, 10))]
z = [(c[:4], w) for c in sq for w, r in realvecs(c) if w in ('a', 'b', 'c4', 'mu', 'one') and r['e'] == 0]; zb = [x for x in z if R[x[0] + (0, x[1])]['beta'] != 0 or R[x[0] + (0, x[1])]['c'] != -R[x[0] + (0, x[1])]['s']]
P(f"  2. c_perp of a, b/c4 in [-1, 0.6]: {len(tv) - len(out)} of {len(tv)}; outside: {out}; rows with e = 0 exactly: {len(z)} (one, a, b/c4, mu), of which beta != 0 or c != -s: {len(zb)}  -> {'HIT' if not out and not zb else 'MISS'}")
k = (7, 2, 12, 1, 0, 'a')
if k in R: P(f"  3. q = 7 (2, 12, 1), a: beta = {float(R[k]['beta']):.4f} (predicted [18, 21.5]), c_coh/c = {float(R[k]['c_coh']/R[k]['c']):.4f} (predicted [0.9, 1.1])  -> {'HIT' if 18 <= R[k]['beta'] <= Fr(43, 2) and Fr(9, 10) <= R[k]['c_coh']/R[k]['c'] <= Fr(11, 10) else 'MISS'}")
k = (7, 2, 8, 3, 0, 'one')
if k in R: P(f"  4. q = 7 (2, 8, 3), one: e = {float(R[k]['e']):.4f}, beta = {float(R[k]['beta']):.4f}, 0.75 (e - 1) = {float(Fr(3,4)*(R[k]['e']-1)):.4f}  -> {'HIT' if R[k]['beta'] >= Fr(3,4)*(R[k]['e']-1) else 'MISS'}")
bad5 = []; n5 = 0
for c in sq:
    for nm_, base in (('a*e', 'a'), ('mu*e', 'mu')):
        for x in cls(c, nm_):
            n5 += 1
            if abs(float(x['e'] - R[c + (base,)]['s'])) > 3/math.sqrt(c[0]**c[3]): bad5.append((c[:4], nm_, round(float(x['e']), 3)))
P(f"  5. slot-sign vectors: |e - s| <= 3/sqrt(q^d) in {n5 - len(bad5)} of {n5}; outside: {bad5[:8]}  -> {'HIT' if not bad5 else 'MISS'}")
act = 0; spread = 0
for c in sq:
    U = [x['beta'] for x in cls(c, 'U')]
    if R[c + ('mu',)]['beta'] >= 3 and len(U) >= 8:
        act += 1
        if min(U) == 0 or max(U)/min(U) > 3: spread += 1
P(f"  6. class U: beta spread over the seeds by more than a factor 3 in {spread} of {act} active F configurations (beta(mu) >= 3); target a separated from U in c_perp in {sep} of {nsep}  -> {'HIT' if spread == act and sep <= nsep/10 else 'MISS'}")
# model law: beta(target)/beta(mu)
P('\nRATIO beta(a)/beta(mu) times q^N (model law: squared ratio of the Moebius sums), configurations with beta(mu) >= 3')
for c in sq:
    a = R[c + ('a',)]; mu = R[c + ('mu',)]
    if mu['beta'] >= 3: P(f"  q={c[0]} ({c[1]},{c[2]},{c[3]}): beta(mu) = {g(mu['beta'], 5)}, beta(a) = {g(a['beta'], 5)}, beta(a) q^N / beta(mu) = {g(a['beta'] * c[0]**c[1] / mu['beta'], 6)}" + (f" = {a['beta'] * c[0]**c[1] / mu['beta']}" if (a['beta'] * c[0]**c[1] / mu['beta']).denominator < 10**6 else ''))
open('rules.txt', 'w').write('\n'.join(L) + '\n'); print('\n'.join(L))
