"""planted-configuration files. Heights: 'mid' = midpoint between consecutive zeta zeros nearest to the target (added quadruple);
'disp' = a zeta zero displaced to +-delta (on-line pair removed, quadruple added at the same height)."""
import json, sys, bisect
Z = [float(x) for x in json.load(open('zeros_ZETA.json'))]; ZS = json.load(open('zeros_ZETA.json'))
targets = [float(x) for x in sys.argv[2].split(',')]
deltas = sys.argv[3].split(',')
out = []
for t in targets:
    i = bisect.bisect(Z, t); i = max(1, min(i, len(Z) - 1))
    g = (Z[i - 1] + Z[i]) / 2
    for d in deltas:
        out.append(dict(label='add:%s:%.6f' % (d, g), kind='add', gamma=g, delta=float(d), nbelow=i, items=[['add', d, repr(g)]]))
for k in (1, 3, 6, 10, 20, 40, 80, 160, 320):
    if len(sys.argv) > 4 and k <= int(sys.argv[4]):
        for d in deltas[:1]:
            out.append(dict(label='disp:%s:k%d' % (d, k), kind='disp', gamma=Z[k - 1], delta=float(d), nbelow=k - 1, items=[['del', '0', ZS[k - 1]], ['add', d, ZS[k - 1]]]))
json.dump(out, open(sys.argv[1], 'w'), indent=0)
print(len(out), 'configs')
