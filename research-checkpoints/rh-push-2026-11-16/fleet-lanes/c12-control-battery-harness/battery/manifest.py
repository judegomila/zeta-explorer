"""sha256 and sizes of every file in the tables directory; verdict summary. Usage: python manifest.py <tables>"""
import os, sys, json, hashlib
tables = sys.argv[1]; man = []
for f in sorted(os.listdir(tables)):
    p = os.path.join(tables, f)
    if not os.path.isfile(p) or f == 'MANIFEST.json': continue
    h = hashlib.sha256()
    with open(p, 'rb') as fh:
        for blk in iter(lambda: fh.read(1 << 22), b''): h.update(blk)
    man.append(dict(file=f, bytes=os.path.getsize(p), sha256=h.hexdigest()))
dev = {}
for k in ('D1', 'D2', 'D3', 'D4', 'D5'):
    p = os.path.join(tables, 'device_%s.json' % k)
    if os.path.exists(p):
        d = json.load(open(p)); dev[k] = dict(reproduced=d['reproduced'], verdict=d['verdict'], checks=len(d['checks']), failed=[c['check'] for c in d['checks'] if not c['ok']])
json.dump(dict(files=man, total_bytes=sum(m['bytes'] for m in man), devices=dev, reproduced_count=sum(1 for v in dev.values() if v['reproduced'])), open(os.path.join(tables, 'MANIFEST.json'), 'w'), indent=1)
print('files', len(man), 'total GB %.2f' % (sum(m['bytes'] for m in man) / 1e9)); print(json.dumps(dev, indent=1))
