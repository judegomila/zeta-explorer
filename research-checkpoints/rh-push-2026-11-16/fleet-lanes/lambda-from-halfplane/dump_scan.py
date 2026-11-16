import gzip, json, collections
kinds = collections.Counter(); ex = {}
n = 0
with gzip.open('tmp/qrh-tune-out/F2_final.steps.jsonl.gz', 'rt') as f:
    for line in f:
        d = json.loads(line); n += 1
        key = (d['lab'][0], tuple(sorted(k for k in d if k not in ('q', 'rate', 'outq', 'lab'))))
        kinds[key] += 1
        if key not in ex: d.pop('outq', None); ex[key] = (n, d)
print(n)
for k, v in kinds.items(): print(k, v)
for k, v in ex.items(): print(v[0], json.dumps(v[1])[:1500])
