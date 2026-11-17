import json, sys, numpy as np
from collections import defaultdict
out=json.load(open(sys.argv[1])); by=defaultdict(list)
def val(s): return float(s.split(' ')[0].strip('[]')) if s[0]=='[' else float(s)
for o in out: by[(o['w'],o['kind'])].append((float(o['tau']),val(o['re']),o['re']))
for (w,kind),v in sorted(by.items(), key=lambda a:(float(a[0][0]),a[0][1])):
    v.sort()
    sg=np.sign([a[1] for a in v])
    if kind=='mid':
        print(f"w={w}: {len(v)} midpoints, sign alternations (= on-line zeros, 60-digit) = {int((sg[1:]*sg[:-1]<0).sum())}, all alternate: {bool((sg[1:]*sg[:-1]<0).all())}, min |value| = {min(abs(a[1]) for a in v):.3e}")
    else:
        print(f"   w={w} positive-min points:", [(a[0], a[2][:22]) for a in v])
