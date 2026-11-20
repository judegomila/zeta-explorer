import json, os, re, difflib
B='tmp/research-2026-11-16/'; L=B+'push/c21-record-engine-states-statement-o-v5-br-nodes/'
J=lambda p: json.load(open(p,encoding='utf-8'))
g=J(B+'engine/IDEA_GRAPH.json'); print('graph nodes',len(g['nodes']),'edges',len(g['edges']))
ids={n['id']:n for n in g['nodes']}
for i in ('br2-sparse-pole-lattice-regime-k','br3-euler-shape-rigidity-regime3','twin-screen-ts'):
    n=ids[i]; print(i, n['type'], n.get('roles'), (n.get('device') or {}).get('state'), (n.get('device') or {}).get('status','')[:40])
print('device nodes by state', {s:sum(1 for n in g['nodes'] if (n.get('device') or {}).get('state')==s) for s in ('open','floored','closed')})
print('cell nodes by state', {s:sum(1 for n in g['nodes'] if (n.get('cell') or {}).get('state')==s) for s in ('cell','tried-not-closed','closed')})
d=J(B+'engine/curated/devices.json'); print('types',len(d['devices']),{s:sum(1 for x in d['devices'] if x['state']==s) for s in ('closed','floored','open')},'cells',{s:sum(1 for x in d['cells'] if x['state']==s) for s in ('cell','tried-not-closed','closed')})
key=lambda c:' x '.join(sorted(n['id'] for n in c['nodes']))+(' x '+c['control'] if c.get('control') else '')
cb=J(L+'before/CANDIDATES.json'); cl=J(B+'engine/CANDIDATES.json')
kb={key(c) for c in cb['candidates']}; kl=[key(c) for c in cl['candidates']]
print('top',len(kl),'overlap',len(kb&set(kl)),'with br',sum(1 for k in kl if 'br2-sparse' in k or 'br3-euler' in k),'br2',sum('br2-sparse' in k for k in kl),'br3',sum('br3-euler' in k for k in kl),'ts',sum('twin-screen-ts' in k for k in kl))
print('ranks with br',[i for i,k in enumerate(kl,1) if 'br2-sparse' in k or 'br3-euler' in k])
print('meta',cb['meta']['generated'],cb['meta']['scored'],sum(cb['meta']['rejected'].values()),'->',cl['meta']['generated'],cl['meta']['scored'],sum(cl['meta']['rejected'].values()))
print('live CANDIDATES == final copy', J(L+'final/CANDIDATES.json')['candidates']==cl['candidates'])
sa=J(L+'before/scoreboard.json'); sl=J(B+'campaign/scoreboard.json')
def flat(d,p=''):
    o={}
    for k,v in d.items():
        if isinstance(v,dict): o.update(flat(v,p+k+'.'))
        else: o[p+k]=json.dumps(v,sort_keys=True)
    return o
fa,fl=flat(sa),flat(sl); print('scoreboard diffs',[(k,fa.get(k),fl.get(k)) for k in sorted(set(fa)|set(fl)) if fa.get(k)!=fl.get(k)])
# STRATEGY: only insertions
a=open(B+'engine/scratch/STRATEGY.pre-c21-record.md',encoding='utf-8').read(); b=open(B+'campaign/STRATEGY.md',encoding='utf-8').read()
def lined(a,b):
    out=[]
    al,bl=a.split('\n'),b.split('\n')
    for o in difflib.SequenceMatcher(None,al,bl,autojunk=False).get_opcodes():
        if o[0]=='equal': continue
        if o[0]=='insert': out.append(('insert lines',o[4]-o[3])); continue
        for x,y in zip(al[o[1]:o[2]],bl[o[3]:o[4]]):
            # every changed line must be the old line with insertions only
            it=iter(y); ok=all(ch in it for ch in x)
            out.append(('line changed','old is a subsequence of new: %s'%ok,'+%d chars'%(len(y)-len(x))))
        if (o[2]-o[1])!=(o[4]-o[3]): out.append(('line count differs',o[2]-o[1],o[4]-o[3]))
    return out
for o in lined(a,b): print('STRATEGY',o)
for f in ('CHECKPOINT_R20_INPUT','CHECKPOINT_R20_DECISION_SHEET'):
    a=open(B+'engine/scratch/%s.pre-c21-record.md'%f,encoding='utf-8').read(); b=open(B+'campaign/%s.md'%f,encoding='utf-8').read()
    print(f,lined(a,b))
# statement: labels unchanged
v5=open(B+'push/c20-repair-owed-record-r19-statement-o-v5/STATEMENT_O_v5.md',encoding='utf-8').read(); v51=open(B+'campaign/STATEMENT_O.md',encoding='utf-8').read()
lab=lambda t:[l[:60] for l in t.split('\n') if l.startswith('- **Label.**')]
print('label bullets equal', lab(v5)==lab(v51), len(lab(v5)))
print('v5 file untouched sha', os.popen('shasum "%s"'%(B+'push/c20-repair-owed-record-r19-statement-o-v5/STATEMENT_O_v5.md')).read()[:12], 'campaign copy == lane copy', v51==open(L+'STATEMENT_O_v5_1.md',encoding='utf-8').read())
# source quotes
tw=open(L+'sources_dl/tw2014.txt',errors='replace').read(); print('TW thm 5.1 present', 'Theorem 5.1. Suppose w is analytic in the strip' in tw, 'as small as possible' in tw)
bd=open(L+'sources_dl/bds0805.txt',errors='replace').read(); print('Bohr (1.6)', '|ap | ≤ kf k∞' in bd, '(1.6)' in bd)
st=open(L+'sources_dl/star2411.txt',errors='replace').read(); print('Ingham thm', 'Theorem 2.1. [10, Theorem 1]' in st, 'Quart. J. Math. 8 (1937)' in st)
print('referee files for U4/U6ab:', [os.path.join(r,f) for r,_,fs in os.walk(B+'push/c21-referee-r20-theorems-a-c-u4-u6-nrq-f1') for f in fs if 'REFEREE' in f.upper()])
