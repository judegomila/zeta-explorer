#!/usr/bin/env python3
"""Campaign and engine text edits of lane c21-record-engine-states-statement-o-v5-br-nodes. Previous files -> engine/scratch/*.pre-c21-record.*.
Anchored replacements; each anchor must occur exactly once."""
import os, shutil, json
B = 'tmp/research-2026-11-16'
SCR = os.path.join(B, 'engine/scratch'); SL = 'c21-record-engine-states-statement-o-v5-br-nodes'
log = []
def edit(rel, pairs, bak):
    p = os.path.join(B, rel); t = open(p, encoding='utf-8').read()
    b = os.path.join(SCR, bak); assert not os.path.exists(b), b
    shutil.copy2(p, b)
    for a, r in pairs:
        assert t.count(a) == 1, (rel, t.count(a), a[:80])
        t = t.replace(a, r); log.append(dict(file=rel, anchor=a[:120], inserted=r[len(a):][:400] if r.startswith(a) else r[:400]))
    open(p, 'w', encoding='utf-8').write(t)
R2 = 'push/c20-referee-theorem-d-headline-and-r19/'
edit('campaign/STRATEGY.md', [
 # C1, items 59, 61, 63, 69
 ('(one referee: does not hold as worded, holds after E1; second referee owed). Kind: the multiplicative step of (J)',
  '(one referee: does not hold as worded, holds after E1; second referee owed) [c21 record lane, correction C1 of the campaign referee of the c20 record lane: this item was entered under "closed by this rule" on one refereed obstruction; the second referee file is now on disk, `' + R2 + 'REFEREE2-c19-u4-joint-prime-phase-quadratic-dp-zeros.md`: holds with corrections (Lemma Q2 needs simple zeros and a limit over heights; Liouville fails at p q^2, first atom 12; the lane text "E_a, DEL and the Liouville twist pass every step" is true for Liouville only at P <= 12)]. Kind: the multiplicative step of (J)'),
 ('`c19-hq2-screen-fe-int-mult-pos-devices` (one referee, holds with corrections E1 to E7; second referee owed).',
  '`c19-hq2-screen-fe-int-mult-pos-devices` (one referee, holds with corrections E1 to E7; second referee owed) [c21 record lane, C1: entered on one refereed obstruction; the second referee file is now on disk, `' + R2 + 'REFEREE2-c19-hq2-screen-fe-int-mult-pos-devices.md`: holds (Lemmas N, S, F, C)].'),
 ('`c19-u6c-double-cover-k3-run` (one referee, holds, nine corrections; second referee owed).',
  '`c19-u6c-double-cover-k3-run` (one referee, holds, nine corrections; second referee owed) [c21 record lane, C1: entered on one refereed obstruction; the second referee file is now on disk, `' + R2 + 'REFEREE2-c19-u6c-double-cover-k3-run.md`: holds; its scope is Lemma Q (the interchange lemma) only, the Eisenstein and cusp-form runs keep one referee; engine state set to closed in `engine/curated/mk_devices.py`, block R21, so STRATEGY and engine agree].'),
 ('State: closed (items 57 and 63 with two referee files on the double-cover half); engine state owed.',
  'State: closed (items 57 and 63 with two referee files on the double-cover half); engine state owed. [c21 record lane: engine state set to closed, block R21 of `engine/curated/mk_devices.py`; the second file covers Lemma Q only.]'),
 # Lemma P -> P'
 ('The PROVED positivity step (Lemma P applied to the constructed measure) was false as stated and is repaired on the three mode spaces (T_sigma >= -3e-11 Lg; no number changes).',
  'The PROVED positivity step (Lemma P applied to the constructed measure) was false as stated and is repaired on the three mode spaces (T_sigma >= -3e-11 Lg; no number changes). [c21 record lane, text repair: the repaired statement is Lemma P\' of the second referee (`' + R2 + 'REFEREE2-c19-rs-real-zero-completion-band-server.md`): T_sigma >= -2.247887 sup over abs(x) <= 6.29 of abs(g)^2, and on the mode space V_m T_sigma >= -eps with eps <= 3.3e-10 (1e6), 2.2e-16 (1e9), 1.7e-22 (1e12); Lemma P itself holds only under sigma >= 0, which the constructed sigma does not satisfy; positivity on V_m is a computed fact per cell, not a consequence of the construction.]'),
 # d even
 ('Kind: X(d) is not proved; it is reduced to NL(d) (d negative squares of a three-term one-variable kernel on the pole line);',
  'Kind: X(d) is not proved; it is reduced to NL(d) (d negative squares of a three-term one-variable kernel on the pole line) [c21 record lane, text repair: X(d) and NL(d) are statements for d even; both are false for odd d (second referee, exact: at {1/4, 3/4, 1/2} N has inertia (1, 2) and N^+ (6, 1); at {1/6, 5/6, 1/3, 2/3, 1/2} N has (6, 4) and N^+ (15, 1))];'),
 ('(row D10; X(d) reduced to NL(d), exact to d = 16; cannot score; item 64)',
  '(row D10; X(d) reduced to NL(d), d even, exact to d = 16; cannot score; item 64)'),
 # state note
 ('Device table: 56 types, 55 closed, 1 floored (the 7/8 type), 0 open.',
  'Device table: 56 types, 55 closed, 1 floored (the 7/8 type), 0 open. [c21 record lane, after block R21: 58 types, 55 closed, 1 floored, 2 open; the two open types are the proposed, untested entries for BR-2 and BR-3 (questions with entry conditions, registered so that `generate.py` can rank them; not leads with a score). Cells: 11, of which 5 closed (U6 (c) added on its second referee file), 1 tried and not closed, 5 with engine state `cell` (U4, U6 (a), U6 (b): second referee files of `c21-referee-r20-theorems-a-c-u4-u6-nrq-f1` not on disk at the edit; U6 (d), U8).]'),
 ('## 5. Change log\n',
  '## 5. Change log\n\n- 2026-11-20 (`c21-record-engine-states-statement-o-v5-br-nodes`, record lane; previous file `engine/scratch/STRATEGY.pre-c21-record.md`): bracketed notes "[c21 record lane ...]" in section 0c (device and cell counts after block R21), in section 3.1 items 59, 60, 61, 63, 64, 69 (correction C1: second referee files; Lemma P\'; "d even") and in the round-19 cell paragraph ("d even"). No rule, weight, allocation or state of a family changed. Statement O version 5 accepted as version 5.1 (`campaign/STATEMENT_O.md`); registers `campaign/CORRECTIONS_R20.md` and `campaign/SOURCES_R21.md`.\n'),
], 'STRATEGY.pre-c21-record.md')
edit('campaign/CHECKPOINT_R20_INPUT.md', [
 ('| X(d) for d > 4 (a record item: the row cannot score)', '| X(d) for even d > 4 (a record item: the row cannot score; "d even" added by the c21 record lane: X(d) is false for odd d)'),
], 'CHECKPOINT_R20_INPUT.pre-c21-record.md')
edit('campaign/CHECKPOINT_R20_DECISION_SHEET.md', [
 ('| NL(d) for general d (model-level; record value only);', '| NL(d) for general even d (model-level; record value only; "even" added by the c21 record lane: NL(d) is false for odd d);'),
], 'CHECKPOINT_R20_DECISION_SHEET.pre-c21-record.md')
# engine: text repairs inside block R21 of mk_devices.py (the block was written by edit_engine.py of this lane; previous file of the pre-lane state is scratch/mk_devices.pre-c21-record.py)
MK = os.path.join(B, 'engine/curated/mk_devices.py'); t = open(MK, encoding='utf-8').read()
shutil.copy2(MK, os.path.join(SCR, 'mk_devices.c21-record-step1.py'))
a = "CELLS = [(i, R21_CELL_STATES.get(i, s), n, e + R21_CELL_EVIDENCE.get(i, ''), nodes) for i, s, n, e, nodes in CELLS]\n"
assert t.count(a) == 1
add = ('''# text repairs owed from round 20 (ROUND_LOG.md, round 20, 'Owed'): "d even" for X(d), NL(d); Lemma P -> Lemma P'; "Liouville passes".
R21_CELL_EVIDENCE['silent-cell-u6g'] = (" Round 21, text repair (second referee " + %r + "REFEREE2-c19-d10-xd-determinant-pole-term-lemma-q.md: holds with corrections): X(d) and NL(d) are statements for d even; "
    "both are false for odd d (exact: at {1/4, 3/4, 1/2} N has inertia (1, 2) and N^+ (6, 1); at {1/6, 5/6, 1/3, 2/3, 1/2} N has (6, 4) and N^+ (15, 1)). State unchanged: tried, not closed.")
R21_CELL_EVIDENCE['silent-cell-u4'] += (" Text repair: the sentence 'E_a, DEL and the Liouville twist pass every step' of the round-19 lane holds for Liouville only at P <= 12; it fails the cross-sign step at p q^2, first atom n = 12 (second referee " + %r + "REFEREE2-c19-u4-joint-prime-phase-quadratic-dp-zeros.md).")
R21_BAND_TEXT = (" Round 21, text repair: the repaired lemma is Lemma P' of the second referee (" + %r + "REFEREE2-c19-rs-real-zero-completion-band-server.md, holds with corrections): T_sigma >= -2.247887 sup over abs(x) <= 6.29 of abs(g)^2; on the mode space V_m, "
    "T_sigma >= -eps with eps <= 3.3e-10 (1e6), 2.2e-16 (1e9), 1.7e-22 (1e12). Lemma P holds only under sigma >= 0. With this file the round-19 continuation lane has two referee files. State unchanged: closed.")
D = [(i, s, n, e + (R21_BAND_TEXT if i == R19_BAND else ''), nodes) for i, s, n, e, nodes in D]
''' % (R2, R2, R2))
t = t.replace(a, add + a); open(MK, 'w', encoding='utf-8').write(t)
log.append(dict(file='engine/curated/mk_devices.py', anchor='block R21', inserted='evidence text for silent-cell-u6g, silent-cell-u4, band device (no state change)'))
json.dump(log, open(os.path.join(B, 'push', SL, 'logs', 'apply_campaign.json'), 'w'), indent=1, ensure_ascii=False)
print(len(log), 'edits')
