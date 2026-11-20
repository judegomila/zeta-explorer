#!/usr/bin/env python3
"""Before/after comparison, entry by entry (lane c19-repair-owed-record-r18-checkpoint-prep).
Reads before/ and after/ JSON files as text (json); writes compare_before_after.json and .md.
Engine counts only: a rank is a heuristic, not evidence about zeros of zeta."""
import json, os, collections
HERE = os.path.dirname(os.path.abspath(__file__))
J = lambda *p: json.load(open(os.path.join(HERE, *p), encoding='utf-8'))
PROP = ['tz-one-sided-completion-bound-band', 'exact-relation-rigidity']
def ids(c): return [n['id'] if isinstance(n, dict) else n for n in c['nodes']]
def key(c): return ' x '.join(sorted(ids(c)))
def load(name):
    d = J(name, 'CANDIDATES.json'); return d['meta'], d['candidates']
mb, tb = load('before'); ma, ta = load('after')
kb = {key(c): (r, c['score']) for r, c in enumerate(tb, 1)}
ka = {key(c): (r, c['score']) for r, c in enumerate(ta, 1)}
def devs(c): return '; '.join('%s (%s)' % (d['id'], d['kind']) for d in c['r4Devices'])
def summ(meta, top):
    r4 = meta['r4Rules']; per = collections.Counter(d['id'] for c in top for d in c['r4Devices'])
    return dict(n=len(top), generated=meta['generated'], scored=meta['scored'],
                nodes=meta['graphCounts']['nodes'], live=meta['graphCounts']['live'], rows=meta['graphCounts']['rows'], edges=meta['graphCounts']['edges'],
                devices=meta['graphCounts']['devices'], devicesLive=meta['graphCounts']['devicesLive'], cells=meta['graphCounts']['cells'],
                topWithOpenDevice=r4['topWithOpenDevice'], topWithProposedDevice=r4.get('topWithProposedDevice'),
                topWithFlooredDeviceOnly=r4['topWithFlooredDeviceOnly'], topWithClosedDevice=r4['topWithClosedDevice'], topWithCell=r4.get('topWithCell'),
                topOnProposedNode={p: sum(1 for c in top if p in ids(c)) for p in PROP},
                rank1=dict(nodes=ids(top[0]), score=top[0]['score']), minScore=top[-1]['score'], perDeviceNode=dict(per),
                rejected=meta['rejected'])
B, A = summ(mb, tb), summ(ma, ta)
rows = []
for r, c in enumerate(tb, 1):
    k = key(c); a = ka.get(k)
    onp = [p for p in PROP if p in ids(c)]
    fate = ('kept: rank %d, score %.2f' % a) if a else ('left: contains closed device ' + ', '.join(onp) if onp else 'left: displaced or no longer scored')
    rows.append(dict(side='before', rank=r, score=c['score'], move=c.get('move'), nodes=ids(c), devices=devs(c), fate=fate))
for r, c in enumerate(ta, 1):
    k = key(c); b = kb.get(k)
    rows.append(dict(side='after', rank=r, score=c['score'], move=c.get('move'), nodes=ids(c), devices=devs(c),
                     fate=('was rank %d, score %.2f' % b) if b else 'entered'))
common = sorted(set(ka) & set(kb))
rej_keys = sorted(set(B['rejected']) | set(A['rejected']))
rej = [(k, B['rejected'].get(k, 0), A['rejected'].get(k, 0)) for k in rej_keys if B['rejected'].get(k, 0) != A['rejected'].get(k, 0)]
# scoreboard, entry by entry (flattened)
def flat(d, pre=''):
    out = {}
    for k, v in d.items():
        if isinstance(v, dict): out.update(flat(v, pre + k + '.'))
        elif isinstance(v, list): out[pre + k] = json.dumps(v, ensure_ascii=False, sort_keys=True)
        else: out[pre + k] = v
    return out
sb, sa = flat(J('before', 'scoreboard.rerun.json')), flat(J('after', 'scoreboard.json'))
sfound = flat(J('before', 'scoreboard.asfound.json')); sfin = flat(J('final', 'scoreboard.json'))
sbrows = [(k, sfound.get(k), sb.get(k), sa.get(k), sfin.get(k)) for k in sorted(set(sb) | set(sa) | set(sfound) | set(sfin))]
# devices.json, entry by entry
db, da = J('before', 'devices.json'), J('after', 'devices.json')
def st(d, key_): return {x['id']: x for x in d[key_]}
devrows = []
for key_ in ('devices', 'cells'):
    xb, xa = st(db, key_), st(da, key_)
    for i in sorted(set(xb) | set(xa)):
        b, a = xb.get(i), xa.get(i)
        ch = []
        if not b or not a: ch.append('added' if a else 'removed')
        else:
            for f in sorted(set(b) | set(a)):
                if b.get(f) != a.get(f):
                    ch.append(f + (': %s -> %s' % (b.get(f), a.get(f)) if f == 'state' else ' edited' + (' (+%d chars)' % (len(str(a.get(f))) - len(str(b.get(f)))) if f in ('evidence', 'name', 'status') else '')))
        devrows.append((key_, i, b and b['state'], a and a['state'], '; '.join(ch) or 'unchanged'))
pend = [(x['lane'], y['state'], x['state'], 'name edited' if x['name'] != y['name'] else 'unchanged') for x, y in zip(da['pending'], db['pending'])]
res = dict(before=B, after=A, keysInCommon=len(common), sameScoreInCommon=sum(1 for k in common if abs(ka[k][1] - kb[k][1]) < 1e-9),
           left=len(set(kb) - set(ka)), entered=len(set(ka) - set(kb)), rows=rows, rejectedChanged=rej, scoreboard=sbrows, devices=devrows, pending=pend)
json.dump(res, open(os.path.join(HERE, 'compare_before_after.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
L = ['# Before / after, entry by entry (c19-repair-owed-record-r18-checkpoint-prep)', '',
     'Engine counts only. A rank is a heuristic, not evidence about zeros of zeta. "Before" is the rerun of `build_graph.py`, `generate.py --top 60` and `scoreboard.py` before any edit of this lane; "after" is the rerun after the map, device and node edits. `merge_outcomes.py` was not run.', '',
     '## 1. Summary', '', '| quantity | before | after |', '|---|---|---|']
for f in ('nodes', 'live', 'rows', 'edges', 'devices', 'devicesLive', 'cells', 'generated', 'scored', 'topWithOpenDevice', 'topWithProposedDevice', 'topOnProposedNode', 'topWithFlooredDeviceOnly', 'topWithClosedDevice', 'topWithCell', 'minScore', 'perDeviceNode'):
    L.append('| %s | %s | %s |' % (f, json.dumps(B[f]), json.dumps(A[f])))
L.append('| rank 1 | %s (%.2f) | %s (%.2f) |' % (' x '.join(B['rank1']['nodes']), B['rank1']['score'], ' x '.join(A['rank1']['nodes']), A['rank1']['score']))
L += ['', 'Keys in common: %d of 60 (%d with the same score). Left: %d. Entered: %d.' % (len(common), res['sameScoreInCommon'], res['left'], res['entered']), '',
      '## 2. Rejection reasons whose count changed', '', '| reason | before | after |', '|---|---|---|']
L += ['| %s | %d | %d |' % r for r in rej]
L += ['', '## 3. Top 60 before: each entry and what happened to it', '', '| rank | score | move | members | device (kind) | after |', '|---|---|---|---|---|---|']
L += ['| %d | %.2f | %s | %s | %s | %s |' % (x['rank'], x['score'], x['move'], ' x '.join(x['nodes']), x['devices'], x['fate']) for x in rows if x['side'] == 'before']
L += ['', '## 4. Top 60 after: each entry and where it came from', '', '| rank | score | move | members | device (kind) | before |', '|---|---|---|---|---|---|']
L += ['| %d | %.2f | %s | %s | %s | %s |' % (x['rank'], x['score'], x['move'], ' x '.join(x['nodes']), x['devices'], x['fate']) for x in rows if x['side'] == 'after']
L += ['', '## 5. Scoreboard, every entry', '', '`as found` = `campaign/scoreboard.json` when this lane started; `before` = rerun before any edit; `after` = rerun after the edits (before this lane\'s line in `lanes.jsonl`); `final` = rerun after the line was appended. The as-found file was written before the graph was last rebuilt (1,737 nodes against 1,742), so its differences from `before` are not caused by this lane.', '',
      '| entry | as found | before (rerun) | after | final | changed by the edits | changed by the lane line |', '|---|---|---|---|---|---|---|']
def cut(v):
    v = str(v); return v if len(v) <= 90 else v[:87] + '...'
L += ['| %s | %s | %s | %s | %s | %s | %s |' % (k, cut(f), cut(b), cut(a), cut(n), 'yes' if b != a else '', 'yes' if a != n else '') for k, f, b, a, n in sbrows]
L += ['', '## 6. `engine/curated/devices.json`, every device type and cell', '', '| list | id | state before | state after | change |', '|---|---|---|---|---|']
L += ['| %s | %s | %s | %s | %s |' % r for r in devrows]
L += ['', 'Pending entries (lane, state before, state after, text): ' + '; '.join('%s: %s -> %s, %s' % p for p in pend), '']
cnt = lambda d, k: dict(collections.Counter(x['state'] for x in d[k]))
L += ['Device types by state: before %s, after %s. Cells by state: before %s, after %s.' % (cnt(db, 'devices'), cnt(da, 'devices'), cnt(db, 'cells'), cnt(da, 'cells'))]
open(os.path.join(HERE, 'compare_before_after.md'), 'w', encoding='utf-8').write('\n'.join(L) + '\n')
print('\n'.join(L[:34])); print('...'); print('scoreboard entries changed:', [(k, b, a, n) for k, f, b, a, n in sbrows if not (b == a == n)][:40])
print('device changes:', [r for r in devrows if r[4] != 'unchanged'])
