import json, sys, numpy as np, pickle
from collections import defaultdict
out=json.load(open(sys.argv[1])); by=defaultdict(list)
def val(s):
    s=s.strip()
    if s.startswith('[+/-'): return 0.0
    return float(s[1:].split(' +/-')[0]) if s[0]=='[' else float(s)
for o in out: by[o['w']].append((o['seq'],complex(val(o['re']),val(o['im']))))
P=pickle.load(open(sys.argv[2],'rb'))['res']
for w,v in sorted(by.items(),key=lambda a:float(a[0])):
    v.sort(); z=np.array([a[1] for a in v]); a=np.angle(z); da=np.diff(a); da=(da+np.pi)%(2*np.pi)-np.pi
    n=da.sum()/np.pi; zz=P[float(w)]['zeros']; non=int((zz<399.9).sum())
    print(f'w={w}: 60-digit argument principle N(0.5<Im s<399.9) = {n:.12f}  (max arg step {np.abs(da).max():.2f} rad); on-line sign changes below 399.9 = {non}; off-line = {round(n)-non}')
