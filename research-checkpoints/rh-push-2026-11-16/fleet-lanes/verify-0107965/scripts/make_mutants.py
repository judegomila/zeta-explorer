"""Write mutated copies of the three arc-stage inputs, one directory per mutation, plus a copy of the
packet's verify_arcs_fresh.py in which ONLY the three sha256 literals (BOUND) are replaced by the digests
of the mutated files, so that the inequality checks (not the hash gate) are what is being tested.
Usage: python -I make_mutants.py <workspace_dir> <packet verify_arcs_fresh.py> <out_dir>
"""
import sys, json, gzip, hashlib, os, copy
from fractions import Fraction as F
ws, checker, out = sys.argv[1:4]
REL = {'plan': 'lambda_round14/material/m8_late/M8_LATE_PLAN.json', 'source': 'lambda_round15/flow_main_v2/MAIN_CLOCK_SOURCE.json',
       'flow': 'lambda_round16/ordinary_7_8_flow/full_flow/FLOW.json.gz'}
raw = {k: open(os.path.join(ws, v), 'rb').read() for k, v in REL.items()}
orig = {k: hashlib.sha256(v).hexdigest() for k, v in raw.items()}
plan = json.loads(raw['plan']); source = json.loads(raw['source'])
print('planned: parse flow JSON (about 125 MB text); each mutant re-serialises it (about 125 MB) and gzips at level 1', flush=True)
flow = json.loads(gzip.decompress(raw['flow']))
code = open(checker).read()
ulp = F(1, 2 ** 96); tiny = F(1, 10 ** 20)
def add(rec, key, d): rec[key] = str(F(rec[key]) + d)
def emit(name, desc, expect, fl=None, pl=None, sr=None, patch=True):
    d = os.path.join(out, name); os.makedirs(d, exist_ok=True)
    data = dict(raw)
    if pl is not None: data['plan'] = json.dumps(pl).encode()
    if sr is not None: data['source'] = json.dumps(sr).encode()
    h = {k: hashlib.sha256(v).hexdigest() for k, v in data.items()}
    fl = fl if fl is not None else (flow if (pl is not None or sr is not None) and patch else None)
    if fl is not None:
        if patch: fl = dict(fl); fl['plan_sha256'] = h['plan']; fl['source_sha256'] = h['source']
        data['flow'] = gzip.compress(json.dumps(fl).encode(), compresslevel=1, mtime=0)
        h['flow'] = hashlib.sha256(data['flow']).hexdigest()
    for k, rel in REL.items():
        p = os.path.join(d, 'ws', rel); os.makedirs(os.path.dirname(p), exist_ok=True); open(p, 'wb').write(data[k])
    c = code
    if patch:
        for k in REL:
            assert c.count(orig[k]) == 1; c = c.replace(orig[k], h[k])
    os.makedirs(os.path.join(d, 'chk'), exist_ok=True); open(os.path.join(d, 'chk', 'verify_arcs_fresh.py'), 'w').write(c)
    json.dump({'name': name, 'description': desc, 'expected': expect, 'digest_literals_patched': patch}, open(os.path.join(d, 'MUTATION.json'), 'w'), indent=1)
    print('wrote', name, flush=True)
def mflow(fn):
    f = dict(flow); f['records'] = list(flow['records']); fn(f); return f
def cp(f, k): f['records'][k] = dict(f['records'][k]); return f['records'][k]

emit('m00_control_unmutated', 'no mutation, digests re-patched to identical values (control: must PASS)', 'PASS', fl=mflow(lambda f: None))
def m(f): add(cp(f, 500), 'qout', -ulp); add(cp(f, 501), 'qin', -ulp)
emit('m01_hashgate', 'qout of arc 500 lowered by 2^-96 (join kept consistent); checker digests NOT patched', 'reject: input bytes', fl=mflow(m), patch=False)
emit('m02_qout_minus_ulp', 'qout of arc 500 lowered by 2^-96, qin of arc 501 changed to match', 'reject: Pade outgoing', fl=mflow(m))
def m(f): add(cp(f, 500), 'qout', ulp)
emit('m03_qout_join', 'qout of arc 500 raised by 2^-96, next qin unchanged', 'reject: join', fl=mflow(m))
def m(f): add(cp(f, 500), 'source_lower', tiny)
emit('m04_source_up', 'source_lower of arc 500 raised by 1e-20', 'reject: source bound', fl=mflow(m))
def m(f): add(cp(f, 500), 'own_upper', -tiny)
emit('m05_own_down', 'own_upper of arc 500 lowered by 1e-20', 'reject: own bound', fl=mflow(m))
def m(f): add(cp(f, 500), 'rate', tiny)
emit('m06_rate_up', 'rate of arc 500 raised by 1e-20', 'reject: strict rate', fl=mflow(m))
def m(f):
    r = cp(f, 500); add(r, 'source_lower', -F(1, 10 ** 6)); add(r, 'own_upper', -F(1, 10 ** 6))
emit('m07_shift_both', 'source_lower and own_upper of arc 500 both lowered by 1e-6 (difference unchanged)', 'reject: own bound', fl=mflow(m))
def m(f): del f['records'][150000]; f['steps'] = len(f['records'])
emit('m08_drop_arc', 'arc 150000 removed, steps field updated', 'reject: count or join', fl=mflow(m))
def m(f): cp(f, 5119)['row'] = 1
emit('m09_row_early', 'arc 5119 (last of row 0) relabelled row 1', 'reject: cell or other', fl=mflow(m))
def m(f): add(cp(f, 500), 'linear_positive_lower', tiny)
emit('m10_ell', 'stored linear_positive_lower of arc 500 raised by 1e-20', 'reject: ell equality', fl=mflow(m))
def m(f):
    k = len(f['records']) - 1; add(cp(f, k), 'qout', -ulp)
    f['terminal_q'] = str(F(f['terminal_q']) - ulp); f['endpoint'] = str(F(f['endpoint']) - ulp / 2)
emit('m11_terminal', 'last qout lowered by 2^-96; terminal_q and endpoint fields updated consistently', 'reject: Pade outgoing at last arc', fl=mflow(m))
def m(f):
    r = cp(f, 500); r['dt'] = '1/1024000'
emit('m12_dt', 'dt of arc 500 doubled', 'reject: dt/step', fl=mflow(m))
def m(f): f['initial_q'] = '9/16'; add(cp(f, 0), 'qin', -F(1, 10 ** 12))
emit('m13_initial', 'initial q set to 9/16 exactly (cushion removed) in header and arc 0', 'reject: initial', fl=mflow(m))
p2 = copy.deepcopy(plan); nd = p2['rows'][0]['nodes'][0]
w = F(nd['weight']); nd['weight'] = str(w + (F(1, 10 ** 9) if w > 0 else -F(1, 10 ** 9)))
emit('m14_plan_weight', 'row 0 node 0 weight magnitude raised by 1e-9 in the plan (plan digest and flow plan_sha256 patched)', 'reject: own bound or pass if own decreases', pl=p2)
p3 = copy.deepcopy(plan); p3['rows'][3]['q_interval'][1] = str(F(p3['rows'][3]['q_interval'][1]) / 2)
emit('m15_plan_cap', 'row 3 contact cap halved in the plan only', 'reject: source/kernel cap mismatch', pl=p3)
s2 = copy.deepcopy(source); s2['records'][3]['main_lo'] = str(F(s2['records'][3]['main_lo']) - F(1, 10 ** 9))
emit('m16_source_main_down', 'row 3 main_lo lowered by 1e-9 in the source ledger', 'reject: source bound at first arc of row 3', sr=s2)
s3 = copy.deepcopy(source); s3['records'][3]['main_lo'] = str(F(s3['records'][3]['main_lo']) + F(1, 10 ** 9))
emit('m17_source_main_up', 'row 3 main_lo RAISED by 1e-9 in the source ledger (favourable direction)', 'arcs stage alone cannot detect this (passes); binding is by sha256 and by the interfaces/direct-source stages', sr=s3)
s4 = copy.deepcopy(source); s4['records'][3]['last_hi'] = str(F(s4['records'][3]['first_hi']) + F(1, 10 ** 6))
emit('m18_source_chord', 'row 3 last_hi set above first_hi (chord would decrease)', 'reject: A>=B', sr=s4)
