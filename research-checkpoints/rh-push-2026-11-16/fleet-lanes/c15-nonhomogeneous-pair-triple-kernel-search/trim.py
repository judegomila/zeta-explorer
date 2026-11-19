"""compact copies of the synthetic-run summaries (the row lists of feasible nodes are dropped). usage: trim.py <dir>"""
import glob
import json
import os
import sys
d = sys.argv[1]
out = {}
for f in sorted(glob.glob(os.path.join(d, '*_summary.json'))):
    s = json.load(open(f))['summary']
    out[os.path.basename(f).replace('_summary.json', '')] = {k: v for k, v in s.items() if not (k.endswith('rows_feas') or k.endswith('rows_und'))}
json.dump(out, open(os.path.join(d, 'synth_compact.json'), 'w'), indent=1)
print('TRIM-DONE', len(out))
