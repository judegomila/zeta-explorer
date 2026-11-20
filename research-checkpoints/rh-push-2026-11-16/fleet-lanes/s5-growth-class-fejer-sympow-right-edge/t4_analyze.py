"""s5 combination 4: summary table of the scans (out/t4_scan_*.json)."""
import json, glob, os
rows = []
for f in sorted(glob.glob('out/t4_scan_*.json')) + sorted(glob.glob('out/t4_high_*.json')):
    d = json.load(open(f)); s = d['summary']
    for sg in d['sigmas']:
        r = s[str(sg)]
        rows.append({'file': os.path.basename(f), 'object': d['object'], 't_range': d['t_range'], 'n_t': d['n_t'], 'sigma': sg,
                     **{p: {'min': r[p]['min'], 'at_t': r[p]['at_t'], 'n_negative': r[p]['n_negative'], 'first_negative_t': r[p]['first_negative_t']} for p in ('341', 'F2', 'F4', 'F8', 'F16', 'F32', 'F64')}})
json.dump(rows, open('out/t4_table.json', 'w'), indent=1)
for r in rows:
    print('%-22s %-5s t in [%g, %g] (%d) sigma %-5s | ' % (r['file'][8:-5], r['object'], r['t_range'][0], r['t_range'][1], r['n_t'], r['sigma']) +
          ' '.join('%s: %.3g%s' % (p, r[p]['min'], ('' if r[p]['n_negative'] == 0 else ' [neg %d, first t %.3g]' % (r[p]['n_negative'], r[p]['first_negative_t']))) for p in ('341', 'F4', 'F16', 'F64')))
