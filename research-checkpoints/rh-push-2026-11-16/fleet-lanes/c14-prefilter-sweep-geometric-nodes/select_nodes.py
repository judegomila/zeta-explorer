# Selects live nodes of the idea graph carrying a tag of the user geometric program. Text only.
import json,collections,sys
R='tmp/research-2026-11-16'
G={'twin-ladder','bridge','shear','antibridge','torus','klein','spinor','twistor','zero-channel','vortex','bridge-square','prime-torus'}
g=json.load(open(R+'/engine/IDEA_GRAPH.json'))
def sel(declared_only):
    out=[]
    for n in g['nodes']:
        if 'wall' in n['roles'] or n['origin'] not in ('corpus','map'): continue
        t=set(n['tags']) | (set() if declared_only else set(n['tagsInferred']))
        if t&G: out.append(n)
    return out
a=sel(True); b=sel(False)
print('live, declared geometric tag:',len(a),' declared or inferred:',len(b))
for name,s in (('declared',a),('all',b)):
    print(name, collections.Counter(n['type'] for n in s))
    print(name, collections.Counter(n['status'] for n in s))
    print(name, collections.Counter(t for n in s for t in (set(n['tags'])|set(n['tagsInferred']))&G))
keep=['id','type','name','statement','status','usesMultiplicativity','heightUniform','source','tags','tagsInferred','roles','device','holdsForDH','defeatedByControls']
json.dump([{k:n.get(k) for k in keep} for n in b],open('selected_nodes.json','w'),indent=1)
print(sum(len(n['statement']) for n in b),'characters of statements')
