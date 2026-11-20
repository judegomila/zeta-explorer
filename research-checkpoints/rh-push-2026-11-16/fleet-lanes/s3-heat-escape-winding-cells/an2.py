"""Summary of the box windings of combination 2 (out/ and out_server/)."""
import json, glob, math, os, sys
import numpy as np
files = sorted(glob.glob('out/boxes_*.json') + glob.glob('out_server/boxes_*.json'))
tracks = {}
for f in glob.glob('out/track_*.json'):
    d = json.load(open(f)); tracks[d['kind']] = [r for r in d['results'] if 't_star' in r]
agg = {}
for f in files:
    if 'local' in f: continue
    d = json.load(open(f)); kind = d['kind']; TL = d['TL']
    a = agg.setdefault(kind, dict(windows=0, boxes=0, nonzero=[], maxstep=0.0, xmin=1e99, xmax=0, count_change_without_winding=0, files=[]))
    a['files'].append(f)
    for w in d['windows']:
        a['windows'] += 1; a['boxes'] += len(w['winding']); a['maxstep'] = max(a['maxstep'], w['maxstep'])
        a['xmin'] = min(a['xmin'], w['x']); a['xmax'] = max(a['xmax'], w['x'] + w['W'])
        for i, wn in enumerate(w['winding']):
            dc = w['counts'][i+1] - w['counts'][i]
            if abs(wn) > 0.5: a['nonzero'].append((w['x'], w['x'] + w['W'], TL[i], TL[i+1], int(round(wn)), dc))
            elif dc != 0: a['count_change_without_winding'] += 1
out = {}
for kind, a in agg.items():
    tot = sum(v[4] for v in a['nonzero'])
    print('%-9s windows %4d  x in [%g, %g]  boxes %5d  nonzero-winding boxes %3d (sum of windings %d)  max phase step %.2f  boxes with count change and zero winding (side flux) %d' %
          (kind, a['windows'], a['xmin'], a['xmax'], a['boxes'], len(a['nonzero']), tot, a['maxstep'], a['count_change_without_winding']))
    m = None
    if kind in tracks:
        tr = [r for r in tracks[kind] if a['xmin'] <= r['x_star'] < a['xmax'] and TL[0] <= r['t_star'] <= TL[-1]]
        hit = 0
        for r in tr:
            if any(v[0] <= r["x_star"] < v[1] and 0.7*v[2] <= r["t_star"] <= 1.3*v[3] for v in a["nonzero"]): hit += 1
        m = (len(tr), hit)
        print('          tracked landings inside the covered region: %d; inside a box with winding != 0: %d; nonzero boxes: %d' % (len(tr), hit, len(a['nonzero'])))
    out[kind] = dict(windows=a['windows'], x_range=[a['xmin'], a['xmax']], boxes=a['boxes'], nonzero=a['nonzero'], sum_winding=tot, maxstep=a['maxstep'],
                     side_flux_boxes=a['count_change_without_winding'], tracked_match=m)
json.dump(out, open('out/an2_summary.json', 'w'), indent=1)
