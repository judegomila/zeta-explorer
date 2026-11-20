#!/usr/bin/env python3
"""Compare top-60 lists (before, stage A = families and merge only, after = with the c4 rules) on fixed
definitions, evaluated on the final graph. Text/JSON only."""
import json, os, re, sys, importlib.util
HERE = os.path.dirname(os.path.abspath(__file__))
ENG = os.path.normpath(os.path.join(HERE, '..', '..', 'engine'))
spec = importlib.util.spec_from_file_location('gen', os.path.join(ENG, 'generate.py'))
gen = importlib.util.module_from_spec(spec); spec.loader.exec_module(gen)
g = json.load(open(os.path.join(ENG, 'IDEA_GRAPH.json')))
node = {n['id']: n for n in g['nodes']}
outc = json.load(open(os.path.join(ENG, 'outcomes.json')))
fams = json.load(open(os.path.join(ENG, 'closed_families.json')))
linked = set()
for e in g['edges']:
    if e['type'] in ('uses', 'special-case-of', 'restates'):
        linked.add((e['source'], e['target'])); linked.add((e['target'], e['source']))

def decl(i): return set(node[i]['tags']) if i in node else set()
def device(i):
    n = node.get(i)
    if not n: return None
    if gen.DEVICE_TAG in decl(i): return 'curated'
    r = set(n['roles'])
    if 'crossing' not in r or 'phenomenon' in r or 'flow-stable' in r or decl(i) & gen.LAMBDA_SIDE: return None
    if (decl(i) | set(n.get('tagsInferred', []))) & gen.MV_SIDE or 'visualization' in decl(i): return None
    return 'role'
def shared(a, b):
    return (a, b) in linked or bool((decl(a) & decl(b)) - gen.GENERIC_TAGS)

def stats(path):
    c = json.load(open(path))
    top = c['candidates']
    out = dict(file=os.path.relpath(path, HERE), n=len(top), generated=c['meta']['generated'], scored=c['meta']['scored'],
               rejected=sum(c['meta']['rejected'].values()))
    k = dict(themeFlow=0, lambdaMajority=0, flowOrLambdaMajority=0, mvMajority=0, noSharedObject=0, anyCrossingRole=0,
             deviceByRule=0, curatedDevice=0, missingNode=0, twoNodesOfClosedLane=0, closedFamilyHit=0, selbergNode=0)
    for s in top:
        ids = [n['id'] for n in s['nodes']]
        if any(i not in node for i in ids):
            k['missingNode'] += 1
            continue
        lam = sum(1 for i in ids if decl(i) & gen.LAMBDA_SIDE)
        mv = sum(1 for i in ids if decl(i) & gen.MV_SIDE)
        k['themeFlow'] += s['theme'] == 'flow'
        k['lambdaMajority'] += 2 * lam > len(ids)
        k['flowOrLambdaMajority'] += (s['theme'] == 'flow') or (2 * lam > len(ids))
        k['mvMajority'] += 2 * mv > len(ids)
        prs = [(x, y) for a, x in enumerate(ids) for y in ids[a + 1:]]
        k['noSharedObject'] += not any(shared(x, y) for x, y in prs)
        k['anyCrossingRole'] += any('crossing' in node[i]['roles'] for i in ids)
        dv = [device(i) for i in ids]
        k['deviceByRule'] += any(dv)
        k['curatedDevice'] += 'curated' in dv
        k['twoNodesOfClosedLane'] += any(o.get('verdict') in ('closed', 'refuted') and
                                         len((set(o.get('nodes', [])) | set(o.get('launchedNodes', []))) & set(ids)) >= 2 for o in outc)
        joint = ' '.join(node[i]['id'] + ' ' + node[i].get('name', '') + ' ' + node[i].get('statement', '') + ' ' + ' '.join(node[i].get('tags', [])) for i in ids)
        k['closedFamilyHit'] += any(all(re.search(p, joint, re.I) for p in f['all']) and not (f.get('unless') and re.search(f['unless'], joint, re.I)) for f in fams)
        k['selbergNode'] += any('selberg' in i for i in ids)
    out.update(k)
    return out

res = [stats(os.path.join(HERE, p)) for p in ('before/CANDIDATES.rerun.json', 'after/CANDIDATES.stageA.json', 'after/CANDIDATES.json')]
json.dump(res, open(os.path.join(HERE, 'after', 'compare_top.json'), 'w'), indent=1)
keys = [k for k in res[0] if k != 'file']
print('%-24s %10s %10s %10s' % ('', 'before', 'stageA', 'after'))
for k in keys:
    print('%-24s %10s %10s %10s' % (k, *[r[k] for r in res]))
