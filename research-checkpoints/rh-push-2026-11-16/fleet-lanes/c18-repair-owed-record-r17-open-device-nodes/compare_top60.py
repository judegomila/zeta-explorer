#!/usr/bin/env python3
"""Before/after comparison of the top 60 (lane c18-repair-owed-record-r17-open-device-nodes). Reads CANDIDATES.json
files as text (json) and IDEA_GRAPH.json for declared tags. Writes top60_before_after.json and .md."""
import json, os, collections
HERE = os.path.dirname(os.path.abspath(__file__))
ENG = os.path.normpath(os.path.join(HERE, '..', '..', 'engine'))
GEO = ['twin-ladder', 'bridge', 'shear', 'antibridge', 'torus', 'klein', 'spinor', 'twistor', 'zero-channel', 'vortex']
PROP = ['tz-one-sided-completion-bound-band', 'exact-relation-rigidity']
g = json.load(open(os.path.join(ENG, 'IDEA_GRAPH.json'), encoding='utf-8'))
tags = {n['id']: set(n['tags']) for n in g['nodes']}
def load(p):
    d = json.load(open(p, encoding='utf-8')); return d['meta'], d['candidates']
def ids(c): return [n['id'] if isinstance(n, dict) else n for n in c['nodes']]
def key(c): return ' x '.join(sorted(ids(c)))
def summary(name, path):
    meta, top = load(path)
    r4 = meta['r4Rules']
    out = dict(name=name, n=len(top), rank1=dict(nodes=ids(top[0]), score=top[0]['score'], move=top[0].get('move')),
               minScore=top[-1]['score'],
               topWithOpenDevice=r4['topWithOpenDevice'], topWithFlooredDeviceOnly=r4['topWithFlooredDeviceOnly'],
               topWithClosedDevice=r4['topWithClosedDevice'], topWithCell=r4.get('topWithCell'),
               topWithProposedDevice=r4.get('topWithProposedDevice'), topPerProposedNode=r4.get('topPerProposedNode'),
               deviceNodesLiveOpen=r4['deviceNodesLive']['open'], deviceNodesLiveFloored=r4['deviceNodesLive']['floored'])
    per = collections.Counter(); geo_c = []; perdev = collections.Counter()
    for r, c in enumerate(top, 1):
        m = ids(c)
        for d in c['r4Devices']: perdev[d['id']] += 1
        gt = sorted({t for i in m if i not in PROP for t in tags.get(i, ()) if t in GEO})
        for t in gt: per[t] += 1
        if gt: geo_c.append(dict(rank=r, score=c['score'], nodes=m, geoTags=gt, onProposed=[i for i in m if i in PROP]))
    out['perDeviceNode'] = dict(perdev)
    out['geoTagCounts'] = {t: per.get(t, 0) for t in GEO}
    out['withGeoMember'] = len(geo_c); out['geoCandidates'] = geo_c
    return out, {key(c): (r, c['score']) for r, c in enumerate(top, 1)}, top
B, kb, tb = summary('before (rerun before any edit)', os.path.join(HERE, 'before', 'CANDIDATES.json'))
A, ka, ta = summary('after (final; proposed devices without penalty waivers)', os.path.join(HERE, 'after', 'CANDIDATES.json'))
W, kw, tw = summary('after, comparison run with --proposed-waivers', os.path.join(HERE, 'after_waivers', 'CANDIDATES.json'))
common = sorted(set(ka) & set(kb))
res = dict(before=B, after=A, afterWithWaivers=W,
           keysInCommon=len(common), sameScoreInCommon=sum(1 for k in common if abs(ka[k][1] - kb[k][1]) < 1e-9),
           left=sorted(set(kb) - set(ka)), entered=sorted(set(ka) - set(kb)),
           keysInCommonAfterVsWaivers=len(set(ka) & set(kw)),
           after_top60=[dict(rank=r, score=c['score'], move=c.get('move'), theme=c.get('theme'), nodes=ids(c),
                             devices=[(d['id'], d['kind'], d.get('status', '')) for d in c['r4Devices']],
                             cells=[x['id'] for x in c.get('cells', [])]) for r, c in enumerate(ta, 1)])
json.dump(res, open(os.path.join(HERE, 'top60_before_after.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
L = ['# Top 60 before and after (c18-repair-owed-record-r17-open-device-nodes)', '',
     'Engine counts only. A rank is a heuristic, not evidence about zeros of zeta.', '',
     '| | before | after | after with --proposed-waivers |', '|---|---|---|---|']
for f in ('topWithOpenDevice', 'topWithProposedDevice', 'topWithFlooredDeviceOnly', 'topWithClosedDevice', 'topWithCell', 'withGeoMember', 'minScore'):
    L.append('| %s | %s | %s | %s |' % (f, B.get(f), A.get(f), W.get(f)))
L.append('| rank 1 | %s (%.2f) | %s (%.2f) | %s (%.2f) |' % (' x '.join(B['rank1']['nodes']), B['rank1']['score'], ' x '.join(A['rank1']['nodes']), A['rank1']['score'], ' x '.join(W['rank1']['nodes']), W['rank1']['score']))
L += ['', 'Keys in common before/after: %d of 60 (%d with the same score). Left: %d. Entered: %d. After against the waiver run: %d in common.' % (
      len(common), res['sameScoreInCommon'], len(res['left']), len(res['entered']), res['keysInCommonAfterVsWaivers']), '',
      'Entries per device node (after): ' + ', '.join('%s %d' % kv for kv in sorted(A['perDeviceNode'].items(), key=lambda kv: -kv[1])), '',
      'Entries per device node (before): ' + ', '.join('%s %d' % kv for kv in sorted(B['perDeviceNode'].items(), key=lambda kv: -kv[1])), '',
      'Geometric-program tags on a member other than the proposed device node (declared tags), entries of the top 60:', '',
      '| tag | before | after | waiver run |', '|---|---|---|---|']
for t in GEO: L.append('| %s | %d | %d | %d |' % (t, B['geoTagCounts'][t], A['geoTagCounts'][t], W['geoTagCounts'][t]))
L += ['', '## After: the 60 entries', '', '| rank | score | move | members | device (kind) | geometric tags of partners |', '|---|---|---|---|---|---|']
geo_by_rank = {c['rank']: c['geoTags'] for c in A['geoCandidates']}
for e in res['after_top60']:
    L.append('| %d | %.2f | %s | %s | %s | %s |' % (e['rank'], e['score'], e['move'], ' x '.join(e['nodes']),
             '; '.join('%s (%s%s)' % (i, k, ', proposed' if s else '') for i, k, s in e['devices']), ', '.join(geo_by_rank.get(e['rank'], [])) or '-'))
open(os.path.join(HERE, 'top60_before_after.md'), 'w', encoding='utf-8').write('\n'.join(L) + '\n')
print('\n'.join(L[:40]))
