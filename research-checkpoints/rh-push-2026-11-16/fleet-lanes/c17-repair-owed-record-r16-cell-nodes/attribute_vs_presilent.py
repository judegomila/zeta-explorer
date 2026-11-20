#!/usr/bin/env python3
"""Attribution of the differences between the top 60 after the cell change (after1/CANDIDATES.json) and the last list
made before the silent-cell nodes existed (push/c16-repair-owed-record-r15/after1/CANDIDATES.json)."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
P = json.load(open(os.path.join(HERE, '..', 'c16-repair-owed-record-r15', 'after1', 'CANDIDATES.json'), encoding='utf-8'))
A = json.load(open(os.path.join(HERE, 'after1', 'CANDIDATES.json'), encoding='utf-8'))
ALL = {s['key']: dict(s, scoreParts=s['parts']) for s in json.load(open(os.path.join(HERE, 'after1', 'all_scored_slim.json'), encoding='utf-8'))}
Pk = {s['key']: s for s in P['candidates']}; Ak = {s['key']: s for s in A['candidates']}
out = dict(common=len(set(Pk) & set(Ak)), commonSameScore=sum(1 for k in set(Pk) & set(Ak) if Pk[k]['score'] == Ak[k]['score']),
           commonScoreDiff=[(k, Pk[k]['score'], Ak[k]['score'], {p: (Pk[k]['scoreParts'].get(p), Ak[k]['scoreParts'].get(p))
                             for p in Ak[k]['scoreParts'] if Pk[k]['scoreParts'].get(p) != Ak[k]['scoreParts'].get(p)})
                            for k in sorted(set(Pk) & set(Ak)) if Pk[k]['score'] != Ak[k]['score']],
           left=[], entered=[])
for k in sorted(set(Pk) - set(Ak), key=lambda k: Pk[k]['rank']):
    s = Pk[k]
    now = ALL.get(k)
    out['left'].append(dict(key=k, rankBefore=s['rank'], scoreBefore=s['score'], nodes=[n['id'] for n in s['nodes']],
                            stillScored=bool(now), scoreNow=now['score'] if now else None,
                            partsChanged={p: (s['scoreParts'].get(p), now['scoreParts'].get(p)) for p in now['scoreParts']
                                          if s['scoreParts'].get(p) != now['scoreParts'].get(p)} if now else None,
                            cause=('not enumerated or rejected in the new run' if not now else
                                   'scored the same; displaced by the selection caps' if now['score'] == s['score'] else 'score changed')))
for k in sorted(set(Ak) - set(Pk), key=lambda k: Ak[k]['rank']):
    s = Ak[k]
    out['entered'].append(dict(key=k, rankNow=s['rank'], score=s['score'], nodes=[n['id'] for n in s['nodes']],
                               cells=[c['id'] for c in s['cells']]))
out['summary'] = dict(left=len(out['left']), leftNotEnumerated=sum(1 for x in out['left'] if not x['stillScored']),
                      leftSameScore=sum(1 for x in out['left'] if x['stillScored'] and x['scoreNow'] == x['scoreBefore']),
                      leftScoreChanged=sum(1 for x in out['left'] if x['stillScored'] and x['scoreNow'] != x['scoreBefore']),
                      entered=len(out['entered']), enteredWithCell=sum(1 for x in out['entered'] if x['cells']))
json.dump(out, open(os.path.join(HERE, 'top60_vs_presilent.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print(json.dumps(out['summary']), out['common'], out['commonSameScore'], out['commonScoreDiff'])
for x in out['left']: print(x['rankBefore'], x['scoreBefore'], x['scoreNow'], x['cause'], x['partsChanged'], x['nodes'])
for x in out['entered']: print('IN', x['rankNow'], x['score'], x['nodes'])
