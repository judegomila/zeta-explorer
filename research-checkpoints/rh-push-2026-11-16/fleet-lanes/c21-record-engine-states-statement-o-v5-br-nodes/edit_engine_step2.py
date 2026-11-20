#!/usr/bin/env python3
"""Second engine edit of the lane: cells U6 (a), U6 (b) -> closed, because their second referee file appeared on disk after the
first edit. U4: closed only if a REFEREE file for the U4 round-20 lane is on disk now. Previous file -> scratch/mk_devices.c21-record-step2.py."""
import os, shutil, json, datetime, glob
B = 'tmp/research-2026-11-16'
MK = os.path.join(B, 'engine/curated/mk_devices.py'); t = open(MK, encoding='utf-8').read()
F6 = 'push/c21-referee-r20-theorems-a-c-u4-u6-nrq-f1/c20-u6ab-rank2-metaplectic-eigenobject-verdict/REFEREE2.md'
U4DIR = 'push/c21-referee-r20-theorems-a-c-u4-u6-nrq-f1/c20-u4-second-order-archimedean-mixed-form'
now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ')
have6 = os.path.exists(os.path.join(B, F6))
u4 = sorted(os.path.basename(p) for p in glob.glob(os.path.join(B, U4DIR, '*')) if 'REFEREE' in os.path.basename(p).upper())
rep = dict(time=now, u6ab_file=F6, u6ab_exists=have6, u4_dir=U4DIR, u4_referee_files=u4)
print(json.dumps(rep, indent=1)); assert have6 and not u4, 'state on disk differs from the one this script was written for'
shutil.copy2(MK, os.path.join(B, 'engine/scratch/mk_devices.c21-record-step2.py'))
a = "# text repairs owed from round 20 (ROUND_LOG.md, round 20, 'Owed')"
assert t.count(a) == 1
add = '''# second edit of the same lane (%s): the second referee file of the U6 (a), (b) lane appeared on disk after the first edit.
# U4: no REFEREE file in %s at this time; state unchanged.
_R21_F6 = %r
assert os.path.exists(os.path.join(HERE, '..', '..', _R21_F6)), 'referee file missing: ' + _R21_F6
R21_CELL_STATES.update({'silent-cell-u6a': 'closed', 'silent-cell-u6b': 'closed'})
R21_CELL_EVIDENCE['silent-cell-u6a'] += (" Second edit of the same lane (%s): state set to CLOSED on the second referee file " + _R21_F6 + " (Lemma K and K' hold, re-derived; the five wording corrections of the first referee accepted; the lane's verdict stands). "
    "Scope, as that file states: closed for linear groups; the double cover half (O4) is ARGUED; the truncated norm of the degenerate P_(2,1) object at 2u = 1 + rho is not derived and inherits row D10 (tried, not closed).")
R21_CELL_EVIDENCE['silent-cell-u6b'] += (" Second edit of the same lane (%s): state set to CLOSED on the second referee file " + _R21_F6 + " (Lemma K, K' hold). "
    "Scope, as that file states: 'no candidate norm' is a statement about the classes examined, not a classification; Lemma K says nothing about subspaces of infinite codimension defined without reference to the zeros.")
''' % (now, U4DIR, F6, now, now)
t = t.replace(a, add + a)
h = "U4, U6 (a), U6 (b) unchanged (second referee files not on disk)"
assert t.count(h) == 1
t = t.replace(h, "U4 unchanged (no second referee file on disk); U6 (a), U6 (b) cell -> closed in a second edit, on push/c21-referee-r20-theorems-a-c-u4-u6-nrq-f1/c20-u6ab-rank2-metaplectic-eigenobject-verdict/REFEREE2.md, which appeared after the first edit")
open(MK, 'w', encoding='utf-8').write(t)
json.dump(rep, open(os.path.join(B, 'push/c21-record-engine-states-statement-o-v5-br-nodes/logs/edit_engine_step2_referee_files.json'), 'w'), indent=1)
