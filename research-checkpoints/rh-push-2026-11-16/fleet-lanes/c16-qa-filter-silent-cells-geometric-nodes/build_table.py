# Builds TABLE.md and table.json from this lane's readings. Node files are read as JSON text (silent71_text.json, map4_text.json).
import json, sys, os
here = os.path.dirname(os.path.abspath(__file__))
nodes = json.load(open(os.path.join(here, 'silent71_text.json')))
m4 = json.load(open(os.path.join(here, 'map4_text.json')))
first = {n['idx']: n for n in nodes}
idx4 = {'map-open-11': (163, 'Z'), 'map-open-20': (166, 'L'), 'map-pos-19': (175, 't'), 'map-pos-26': (178, 't')}
for x in m4:
    i, c = idx4[x['id']]
    first[i] = dict(idx=i, id=x['id'], c14class=c, twice=(i == 163), name=x['name'])
first[30]['c14class'] = 'Z'   # c14 referee E4, confirmed by the c15 second reader
second = {14:'t',30:'Z',48:'c',104:'Z',120:'c',134:'t',163:'Z',195:'L',213:'Z',286:'L',292:'Z',350:'t',355:'K',363:'t',377:'K'}
# outcome codes
# T    target-level: the displayed hypothesis is the conclusion, an all-order criterion or a zero-location input; no control satisfies it; not a candidate
# ZQa  ZQ passes exactly: the step reads prime-power atoms only (Lemma QA (a))
# ZQe  ZQ passes exactly: the step reads a zero list or zero count below a height; pair chosen above it (Lemma QA (a), data d4)
# ZQc  ZQ passes by Lemma C: strict condition on a compact set; pair chosen high enough
# ZQm  ZQ passes if the step has a margin in the density norm (Lemma QA (b)); margin not established here (ARGUED)
# REC  a control on record passes (named)
# FZ   hypothesis false for zeta on record
# NF   no control formulable on file; missing input named
# NR   node statement does not display the hypothesis; not read
A = {
0:('t','zero-location (real simple zeros and S >= L along the flow)','n/a','T','implication holds for any even kernel (row P31); the hypothesis is the input'),
1:('L','mean values (pair-correlation second moment); Gabor compression of the Weil form','no','REC','MV-CAP, row P27. ZQ differs from zeta in 8 zeros, so every proportion is unchanged; the conclusion is a proportion and is true for ZQ'),
9:('t','zero-location (hypotheses G and S)','n/a','T','implication is linear algebra; holds for every pencil'),
13:('c','zero table at t = 0 below a height, zero count','no','ZQe','open bound; whatever is proved from the table and the count holds for ZQ with the pair above the table'),
14:('t','RH-equivalent criterion','n/a','T',''),
28:('t','zero-location (Nevanlinna property under RH)','n/a','T','finite surrogate is built from a zero list'),
30:('Z','exact local sections at every prime, Re s > 1','no; atoms only','ZQa','the cascade is a function of the atoms: for ZQ it is the same cascade, with poles at zeros of the atom product (zeta), not of ZQ. Row G10'),
34:('t','RH-equivalent existence statement','n/a','T',''),
35:('t','RH-equivalent (Hermite-Biehler positivity)','n/a','T',''),
41:('t','zero-location (slab at tau_0, floor A >= kappa y)','n/a','T','rows F5, F3'),
48:('c','zeros below the verified height','no','ZQe','the window statement is derived from the zero list; identical for ZQ with g1 above the height'),
55:('Z','per-prime resonators (atoms), Re s > 1','no; atoms only','ZQa','row G10: the passive cascade is valid right of 1 only'),
56:('c','values of H_t on a compact box, 0 <= t <= 129/800','no','ZQc','Lemma C heat form, t >= 0 (PROVED estimate); pair above the box'),
57:('t','zero-location (maximum gap of real zeros along the flow)','n/a','T','row F5'),
58:('t','zero-location (strip, simple boundary zero, Poisson floor)','n/a','T',''),
60:('t','zero-location (uniform Poisson floor, all x, all tau)','n/a','T','needed input, not established'),
61:('K','shift positivity of the completed function, in a family','n/a','FZ','row P53: false for zeta (zero 34 at h = 1); every control fails one step earlier, ZQ included'),
73:('t','flow bound E(N) -> 0 and a lower bound on t_c (not supplied)','n/a','T',''),
82:('c','verified height T_ver','no','ZQe','pair above T_ver'),
84:('Z','size from the Euler product right of 1','no','ZQm','abs(m - 1) <= 2.1e-4 on Re s = 2 for the pair 6709, 6710 (MEASURED): the anchor constant changes by that factor; device not run'),
94:('c','winding numbers on boxes','no','ZQc','every finite subfamily (Lemma C); the exhaustive family is the target (row G7)'),
104:('Z','rung moments at prime powers, support below 3.44','no; atoms only','ZQa','node: detects multiplicativity only, no zero-location content'),
110:('t','target (passive frozen-bridge closure in the limit)','n/a','T','finite windows are certificates'),
120:('c','values of the heat field on a compact box, t in [0, 1/2]','no','ZQc','Lemma C heat form, t >= 0; row G7'),
134:('t','RH-equivalent factorisation','n/a','T',''),
140:('t','RH-equivalent operator bound','n/a','T',''),
141:('t','RH-equivalent operator bound','n/a','T','finite truncation violates it (norm 4.617)'),
142:('K','kernel shape and phase derivative in a window','n/a','REC','BLS passes; lane c15-klein: certificate at bounded height fed by a target-level hypothesis (rows G13, G17)'),
147:('t','sup norm of the bridge ratio for every a (target); equivalences','n/a','T',''),
157:('t','zero-density hypothesis W(A)','n/a','T','typed L by c14; lane c15-klein: W(A) contains the strip abs(beta - 1/2) <= 1/(2A), target-level. ZQ with eta <= 1/(2A) satisfies W(A) iff zeta does'),
158:('L','mollified mean values','no','REC','MV-CAP (rows P26, P27); proportions are unchanged for ZQ'),
163:('Z','identity: multiplicative at p','no','REC','node text: sign twists and unimodular twists pass (row G22); boundary Z against PASS S1 as for the second reader; read on atoms the identity holds for ZQ'),
166:('L','Weil form on a window','no','REC','DH passes on every node set tried (row G25)'),
175:('t','all-order Pick positivity (RH-equivalent) with zero tolerance per prime weight','n/a','T','Theorem R perturbs the atoms; ZQ perturbs off the atoms and is not addressed by it'),
178:('t','zero-location input (zero-free half-plane)','n/a','T','implication of de Bruijn type'),
195:('L','Pick form on a lacunary node set','no','REC','row P18: no zero information on Blaschke node lattices'),
196:('c','zeros in one local window, band barrier','no','ZQe','pair outside the window and above the barrier range'),
197:('L','mean values (mollifier)','no','REC','MV-CAP (rows P26, P27, Q9)'),
205:('L','Weil form with support (ln 3)/2: atoms n <= 3 and the archimedean term','no','ZQm','measured margins; the ZQ form differs by at most sup abs(D) 2a e^a times the L2 norm squared of the test; margin against that norm not on file'),
212:('c','winding count on a rectangle; all-x lower bound (zero-location type)','no','ZQc','rectangle part by Lemma C; the hard half is a target-level input'),
213:('Z','Euler product right of 1 at t = 0, one instant','no','ZQm','-ZQ\'/ZQ differs from -zeta\'/zeta by at most 4(eta^2 + d^2)/(sigma - 1/2 - eta)^3 on Re s = sigma (PROVED bound); device step not re-derived'),
247:('t','RH-equivalent inequality read on atoms only (factorials, radicals)','n/a','T','atom-only: same truth value for the atoms of ZQ; the passage to zeros of G reads INT'),
261:('t','all-order pivot positivity','n/a','T','rows P3, P7'),
262:('t','RH-equivalent pointwise sign','n/a','T','rows G8, P8'),
263:('t','RH-equivalent pointwise sign','n/a','T','rows G8, P8'),
270:('t','all-order condition equivalent to the global kernel sign','n/a','T','rows P21, P22'),
271:('c','zero-free half-plane Re s > 7/8 and verified height','no','ZQe','ZQ with eta < 3/8 and the pair above the verified height meets both inputs; the conclusion is a bound for Lambda, not a critical-line statement'),
273:('t','RH restated on Satake points','n/a','T',''),
286:('L','Weil form with 2a <= 0.96: atom at n = 2 and the archimedean term','no','REC','finite-support certificates: Euler-blind range and verified height on record; ZQ additionally passes under a margin (ARGUED)'),
292:('Z','rung moments c(p^k)/log p at single primes','no; atoms only','ZQa','row L1; node: no zero-location content'),
303:('t','target (analyticity of the ratio)','n/a','T','single circular gap'),
323:('t','RH-equivalent','n/a','T',''),
333:('c','values of H_t on a compact box and on one semi-infinite slice','no','ZQc','box by Lemma C; the slice is unbounded in x: for ZQ it holds only if the quartet stays below the slice (eta small against y*), ARGUED; campaign designed, not run'),
341:('t','zero-strip statement read on atoms only','n/a','T','atom-only equivalent of a zero-free strip; same truth value for the atoms of ZQ'),
342:('L','atoms n <= (c log H)^kappa at every height H','no; atoms only','ZQa','unproved for zeta; ZQ has the same truth value (Lemma QA (a)); any implication from it to zeros of G must read INT; node: DH violates the analogue'),
344:('c','complete zero list below x_N','no','ZQe','pair above x_N'),
348:('Z','Satake data of sym^m in the conductor aspect; residues at s = 1','n/a','NF','no lift of a control to symmetric powers on file; the missing input (log c_m = O(log Q_m)) is of GRH strength by the node text; not a critical-line step'),
350:('t','RH-equivalent form inequality','n/a','T',''),
355:('K','kernel shape (concavity of log kappa(sqrt t))','n/a','REC','HEAT passes at every tau (row G5)'),
357:('c','operator norm on a compact range of L with margin 2e-5 and 5e-7','no','ZQc','needs kernel closeness in the norm used: ARGUED (measured relative L1 distance 3.3e-7 for the pair 298, 299, tending to 0 as the pair rises); row Q15'),
363:('t','zero-location (under RH)','n/a','T',''),
372:('K','kernel shape (convexity of -log kappa(sqrt t)); far translates','n/a','REC','HEAT passes (rows G5, P22)'),
374:('L','frequencies outside the support 2a','no','REC','T-NR with log p0 >= 2a passes exactly (the node\'s own statement; Q-P type S3); NR-q with log q >= 2a likewise'),
377:('K','kernel-only norm bound with margin','n/a','REC','HEAT with abs(tau) small by continuity of I_0 J_a (ARGUED); ZQ by kernel closeness (ARGUED)'),
381:('c','boundary non-vanishing on a walled cell','no','ZQc','conditional lemma, valid for any even kernel; the hypothesis is a compact certificate'),
387:('c','winding count on a rectangle above T_PT','no','ZQc','pair above T_PT + Delta; equals more verified height (row G7)'),
395:('c','one zero in a fixed disk for abs(tau) <= 0.05','no','ZQc','tau of the sign that is a Gaussian average along a horizontal line: PROVED estimate; the other sign: ARGUED; row G7'),
403:('c','one named hypothesis (statement not displayed in the node)','not readable','NR','typed c by the first reader; not typed further here; the theorem it would complete is frozen-rung iff verified height'),
411:('t','comparison over all tests (RH-strength by the node text)','n/a','T','rows G1, G2'),
420:('c','one zero in a fixed disk for abs(tau) <= 1/20','no','ZQc','as node 395'),
437:('c','zero count in one reflection-symmetric disk','no','ZQc','lemma holds for every family with the symmetry (ZQ has it); local; row G7'),
}
assert set(A) == set(first), (set(A) ^ set(first))
rows = []; agree = 0; tw = 0
for i in sorted(A):
    cls, read, qa, oc, note = A[i]
    n = first[i]
    r = dict(idx=i, id=n['id'], c14class=n['c14class'], cls=cls, read=read, QA=qa, outcome=oc, note=note, twice=bool(n.get('twice')))
    if r['twice']:
        tw += 1; r['secondReader'] = second[i]; r['sameAsSecond'] = (second[i] == cls); agree += r['sameAsSecond']
    rows.append(r)
cnt = {}; ccl = {}; changed = []
for r in rows:
    cnt[r['outcome']] = cnt.get(r['outcome'], 0) + 1; ccl[r['cls']] = ccl.get(r['cls'], 0) + 1
    if r['cls'] != r['c14class']: changed.append((r['idx'], r['id'], r['c14class'], r['cls']))
summary = dict(nodes=len(rows), twice=tw, twiceSameClass=agree, notReadTwice=len(rows)-tw, byOutcome=cnt, byClass=ccl, classChangedAgainstC14Corrected=changed,
               noControlPassesAndNotTarget=[r['id'] for r in rows if r['outcome'] == 'NF'])
json.dump(dict(summary=summary, rows=rows), open(os.path.join(here, 'table.json'), 'w'), indent=1)
L = ['# Node table: 71 silent nodes of the c14 sweep under the four-question filter', '',
     'Generated by `build_table.py` from the readings in that file. One reader (this lane); the 15 rows marked 2R were read by the c15 second reader. Outcome codes: T target-level (the hypothesis is the conclusion, an all-order criterion or a zero-location input; no control satisfies it and it is not established for zeta); ZQa ZQ passes exactly, atoms only (Lemma QA (a)); ZQe ZQ passes exactly, the step reads zeros or counts below a height and the pair is above it; ZQc ZQ passes by Lemma C (strict condition on a compact set); ZQm ZQ passes if the step has a margin in the density norm (not established here); REC a control on record passes; FZ false for zeta on record; NF no control formulable on file; NR the node does not display its hypothesis.', '',
     '| # | node | class | decisive read set | Q-A | outcome | first control that passes, with the step | 2R |', '|---|---|---|---|---|---|---|---|']
for r in rows:
    L.append('| %d | %s | %s | %s | %s | %s | %s | %s |' % (r['idx'], r['id'], r['cls'], r['read'], r['QA'], r['outcome'], r['note'] or '-', ('2R: %s, %s' % (r['secondReader'], 'same' if r['sameAsSecond'] else 'DIFFERENT')) if r['twice'] else ''))
L += ['', 'Summary: ' + json.dumps(summary)]
open(os.path.join(here, 'TABLE.md'), 'w').write('\n'.join(L) + '\n')
print(json.dumps(summary, indent=1))
