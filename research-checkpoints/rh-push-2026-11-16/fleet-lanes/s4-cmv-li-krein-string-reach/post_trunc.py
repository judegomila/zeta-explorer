"""eigen-angles reproduced by the last positive-definite section built from truncated Euler-product data"""
import json, sys, subprocess, os
d = sys.argv[1]; a = sys.argv[2]; prec = sys.argv[3]
PY = sys.executable
T = json.load(open(os.path.join(d, 'trunc_a%s.json' % a)))
out = {}
for key, v in T['results'].items():
    if not key.startswith('ZETA-EUL:'): continue
    cp = key.split(':')[1]; nf = v[0]
    if nf is None: nf = T['n']
    o = os.path.join(d, 'eig_ZETA-EUL_%s.json' % cp)
    subprocess.run([PY, 'cmv.py', 'ZETA', a, str(nf), prec, o, '--moments', os.path.join(d, 'mom_ZETA-EUL_%s.json' % cp), '--zeros', 'zeros_ZETA.json', '--K', '400', '--snap', str(nf)], stdout=subprocess.DEVNULL)
    r = json.load(open(o))
    e = r['eigen_angles'].get(str(nf), {})
    out[cp] = dict(first_index=v[0], log2E_at_break=v[1], last_pd_size=nf, prefix=[e.get('beta+1', {}).get('prefix'), e.get('beta-1', {}).get('prefix')])
    print(a, cp, out[cp], flush=True)
json.dump(out, open(os.path.join(d, 'eig_summary_a%s.json' % a), 'w'), indent=1)
