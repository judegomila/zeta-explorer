#!/usr/bin/env python3
"""Entry-by-entry comparison of two CANDIDATES.json files (top 60) and two IDEA_GRAPH.json files.
Usage: compare_top60.py <before CANDIDATES> <after CANDIDATES> <before GRAPH> <after GRAPH> <out prefix>
Reads files as text/JSON; writes <out prefix>.json and <out prefix>.md next to this script."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
b, a, gb, ga, pref = sys.argv[1:6]
B = json.load(open(b, encoding='utf-8')); A = json.load(open(a, encoding='utf-8'))
def counts(C):
    top = C['candidates']
    r = C['meta']['r4Rules']
    silent = sum(1 for s in top if any(n['id'].startswith('silent-') for n in s['nodes']))
    return dict(top=len(top), topWithOpenDevice=r['topWithOpenDevice'], floored=r['topWithFlooredDeviceOnly'],
                closed=r['topWithClosedDevice'], topWithCell=r.get('topWithCell'), topWithSilentNode=silent,
                generated=C['meta']['generated'], scored=C['meta']['scored'],
                rejected=sum(C['meta']['rejected'].values()), pools=C['meta']['pools'],
                deviceNodesLive={k: len(v) for k, v in r['deviceNodesLive'].items()},
                cellNodesLive={k: len(v) for k, v in r.get('cellNodesLive', {}).items()})
def ent(s):
    return dict(rank=s['rank'], score=s['score'], move=s['move'], theme=s['theme'], key=s['key'],
                nodes=[n['id'] for n in s['nodes']], control=s.get('control'),
                devices=[(d['id'], d['kind']) for d in s['r4Devices']],
                cells=[(d['id'], d['state']) for d in s.get('cells', [])], parts=s['scoreParts'])
Bt = [ent(s) for s in B['candidates']]; At = [ent(s) for s in A['candidates']]
Bk = {e['key']: e for e in Bt}; Ak = {e['key']: e for e in At}
rows = []
for r in range(max(len(Bt), len(At))):
    x = Bt[r] if r < len(Bt) else None; y = At[r] if r < len(At) else None
    rows.append(dict(rank=r + 1, before=x, after=y,
                     beforeKeyNowAtRank=Ak[x['key']]['rank'] if x and x['key'] in Ak else None,
                     afterKeyWasAtRank=Bk[y['key']]['rank'] if y and y['key'] in Bk else None))
kept = sorted(set(Bk) & set(Ak))
score_changed = [(k, Bk[k]['score'], Ak[k]['score'],
                  {p: (Bk[k]['parts'].get(p), Ak[k]['parts'].get(p)) for p in set(Bk[k]['parts']) | set(Ak[k]['parts'])
                   if Bk[k]['parts'].get(p) != Ak[k]['parts'].get(p)}) for k in kept if Bk[k]['score'] != Ak[k]['score']]
rej = {}
for k in sorted(set(B['meta']['rejected']) | set(A['meta']['rejected'])):
    x, y = B['meta']['rejected'].get(k, 0), A['meta']['rejected'].get(k, 0)
    if x != y:
        rej[k] = [x, y]
G0 = json.load(open(gb, encoding='utf-8')); G1 = json.load(open(ga, encoding='utf-8'))
def gsum(G):
    c = G['meta']['counts']
    return dict(nodes=c['nodes'], live=c['live'], rows=c['rows'], edges=c['edges'], edgesByType=c['edgesByType'],
                devices=c['devices'], devicesLive=c['devicesLive'], cells=c.get('cells'), controls=c['controls'])
ek = lambda e: (e['type'], e['source'], e['target'])
E0 = {ek(e) for e in G0['edges']}; E1 = {ek(e) for e in G1['edges']}
N0 = {n['id']: n for n in G0['nodes']}; N1 = {n['id']: n for n in G1['nodes']}
node_changes = []
for i in sorted(set(N0) | set(N1)):
    x, y = N0.get(i), N1.get(i)
    if x is None or y is None:
        node_changes.append(dict(id=i, change='added' if x is None else 'removed')); continue
    d = {k: (x.get(k), y.get(k)) for k in set(x) | set(y) if x.get(k) != y.get(k)}
    if d:
        node_changes.append(dict(id=i, fields=sorted(d), roles=(x.get('roles'), y.get('roles')) if 'roles' in d else None))
silent_edge = lambda e: e[1].startswith('silent-') or e[2].startswith('silent-')
out = dict(before=os.path.abspath(b), after=os.path.abspath(a), countsBefore=counts(B), countsAfter=counts(A),
           keysKept=len(kept), keysKeptSameScore=len(kept) - len(score_changed), scoreChanged=score_changed,
           rejectedChanged=rej, rows=rows, graphBefore=gsum(G0), graphAfter=gsum(G1),
           edgesAdded=sorted(E1 - E0), edgesRemoved=sorted(E0 - E1),
           edgesAddedTouchingSilent=sum(1 for e in E1 - E0 if silent_edge(e)),
           edgesRemovedTouchingSilent=sum(1 for e in E0 - E1 if silent_edge(e)),
           nodeChanges=node_changes)
json.dump(out, open(os.path.join(HERE, pref + '.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
L = ['# Top 60 before and after: ' + pref, '', 'Before: `' + out['before'] + '`', 'After: `' + out['after'] + '`', '',
     '| quantity | before | after |', '|---|---|---|']
cb, ca = out['countsBefore'], out['countsAfter']
for k in ('topWithOpenDevice', 'floored', 'closed', 'topWithCell', 'topWithSilentNode', 'generated', 'scored', 'rejected'):
    L.append('| %s | %s | %s |' % (k, cb[k], ca[k]))
L.append('| pools | %s | %s |' % (cb['pools'], ca['pools']))
L.append('| live device nodes | %s | %s |' % (cb['deviceNodesLive'], ca['deviceNodesLive']))
L.append('| live cell nodes | %s | %s |' % (cb['cellNodesLive'], ca['cellNodesLive']))
gb_, ga_ = out['graphBefore'], out['graphAfter']
for k in ('nodes', 'live', 'rows', 'edges', 'devices', 'devicesLive', 'cells'):
    L.append('| graph %s | %s | %s |' % (k, gb_[k], ga_[k]))
L += ['', 'Keys in both lists: %d (same score: %d). Edges added %d (touching a silent node: %d), removed %d (touching a silent node: %d). Nodes changed: %d.'
      % (len(kept), len(kept) - len(score_changed), len(E1 - E0), out['edgesAddedTouchingSilent'], len(E0 - E1),
         out['edgesRemovedTouchingSilent'], len(node_changes)), '',
      '| rank | before: score, move, members (device / cell) | now at rank | after: score, move, members (device kind) | was at rank |', '|---|---|---|---|---|']
def fmt(e, after):
    if not e:
        return '-'
    tag = ', '.join('%s:%s' % d for d in e['devices']) + (('; cell ' + ', '.join('%s:%s' % d for d in e['cells'])) if e['cells'] else '')
    return '%.2f %s %s [%s]' % (e['score'], e['move'], ' x '.join(e['nodes']) + (' x ' + e['control'] if e['control'] else ''), tag)
for r in rows:
    L.append('| %d | %s | %s | %s | %s |' % (r['rank'], fmt(r['before'], 0), r['beforeKeyNowAtRank'] or 'not listed',
                                             fmt(r['after'], 1), r['afterKeyWasAtRank'] or 'new'))
open(os.path.join(HERE, pref + '.md'), 'w', encoding='utf-8').write('\n'.join(L) + '\n')
print(json.dumps(dict(before=cb, after=ca, kept=len(kept), scoreChanged=len(score_changed), rejectedChanged=rej,
                      edgesAdded=len(E1 - E0), edgesRemoved=len(E0 - E1), nodeChanges=len(node_changes)), indent=1))
