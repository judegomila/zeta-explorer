# Cross-check the three reruns on exact dyadic interval endpoints.
from fractions import Fraction as Fr
import json, sys
def load(prefix):
    iv = {}
    with open(prefix + '.iv.txt') as f:
        for line in f:
            idx, ch, ma, ea, mb, eb = line.split()
            a = Fr(int(ma)) * (Fr(2) ** int(ea)); b = Fr(int(mb)) * (Fr(2) ** int(eb))
            iv[int(idx)] = (a, b, int(ch))
    return iv
runs = {'V1': load('V1_fix_t1_p128_m2500_b520'), 'V2': load('V2_orig_t1_p128_m2500_b520'), 'V3': load('V3_fix_t4_p160_m4000_b650')}
xL2 = Fr('15600000002223.2344') / 2; xR2 = Fr('15600000009475.44') / 2
gam_first = Fr('7800000000999.91541557'); gam_last = Fr('7800000005887.92044395')
out = {}
for name, iv in runs.items():
    ks = sorted(iv)
    consec = all(ks[i+1] == ks[i] + 1 for i in range(len(ks)-1))
    proper = all(iv[k][0] < iv[k][1] for k in ks)
    mono = all(iv[ks[i]][1] <= iv[ks[i+1]][0] for i in range(len(ks)-1))
    nstrict = sum(1 for i in range(len(ks)-1) if iv[ks[i]][1] == iv[ks[i+1]][0])
    inside = [k for k in ks if iv[k][0] >= xL2 and iv[k][1] <= xR2]
    strad = [k for k in ks if iv[k][0] < xL2 < iv[k][1] or iv[k][0] < xR2 < iv[k][1]]
    below = [k for k in ks if iv[k][1] <= xL2]; above = [k for k in ks if iv[k][0] >= xR2]
    widths = [float(iv[k][1] - iv[k][0]) for k in ks]
    out[name] = dict(n=len(ks), first=ks[0], last=ks[-1], consecutive=consec, proper=proper, monotone_disjoint_across_all=mono,
                     shared_endpoints=nstrict, window_inside=(inside[0], inside[-1], len(inside)), straddling=strad,
                     last_below_xL2=below[-1], first_above_xR2=above[0],
                     cover=(float(iv[ks[0]][0]), float(iv[ks[-1]][1])),
                     contains_gamma874=iv[33328427938874][0] < gam_first < iv[33328427938874][1],
                     contains_gamma538=iv[33328427960538][0] < gam_last < iv[33328427960538][1],
                     width_max=max(widths), width_mean=sum(widths)/len(widths))
    print(name, json.dumps(out[name], default=str))
# pairwise agreement on common indices: intervals must intersect (same zero), and no interval of index i may meet index j != i
def agree(A, B):
    common = sorted(set(A) & set(B)); bad = 0; bad_cross = 0
    for k in common:
        a1, b1, _ = A[k]; a2, b2, _ = B[k]
        if not (max(a1, a2) < min(b1, b2)): bad += 1
        if k + 1 in B and B[k+1][0] < b1 and max(a1, B[k+1][0]) < min(b1, B[k+1][1]) and False: bad_cross += 1
    return len(common), bad
for x, y in [('V1','V2'), ('V1','V3'), ('V2','V3')]:
    print(x, y, 'common, disagreements =', agree(runs[x], runs[y]))
# identical intervals V1 vs V2 (patched vs unpatched, same chunking)?
same = sum(1 for k in runs['V1'] if runs['V1'][k][:2] == runs['V2'][k][:2]); print('V1==V2 identical intervals:', same, 'of', len(runs['V1']))
# original pilot gluing points
for idx, t in [(33328427946100, Fr('7800000002630.3659385')), (33328427946101, Fr('7800000002630.3659385')), (33328427953306, Fr('7800000004256.2573428')), (33328427953307, Fr('7800000004256.2573428'))]:
    a, b, _ = runs['V1'][idx]; print('idx', idx, 'V1 interval', float(a), float(b), ' original glue point', float(t), ' rel:', 'below' if b <= t else ('above' if a >= t else 'contains'))
