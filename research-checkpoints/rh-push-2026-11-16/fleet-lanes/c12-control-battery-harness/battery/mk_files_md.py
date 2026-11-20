"""FILES.md from tables/MANIFEST.json. Usage: python mk_files_md.py <tables> <out.md>"""
import json, sys, os
m = json.load(open(os.path.join(sys.argv[1], 'MANIFEST.json')))
L = ['# Files of the control battery: sizes and sha256', '', 'Generated from `tables/MANIFEST.json` (server copy `~/rh-push/c12-control-battery-harness/tables/`). %d files, %.2f GB.' % (len(m['files']), m['total_bytes'] / 1e9), '',
     '| file | bytes | sha256 |', '|---|---|---|']
for f in m['files']: L.append('| `%s` | %d | `%s` |' % (f['file'], f['bytes'], f['sha256']))
L += ['', '## Device summary', '', '| device | reproduced (verdict and every number) | checks | failed checks |', '|---|---|---|---|']
for k, v in m['devices'].items(): L.append('| %s | %s | %d | %s |' % (k, v['reproduced'], v['checks'], '; '.join(v['failed']) or '-'))
open(sys.argv[2], 'w').write('\n'.join(L) + '\n')
