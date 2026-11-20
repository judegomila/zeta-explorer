import json, sys
def load(p):
    d = json.load(open(p))
    c = d['candidates'] if isinstance(d, dict) else d
    return d, c
def key(c):
    return tuple(sorted(n['id'] for n in c['nodes'])) + (c.get('control'),)
a_d, a = load(sys.argv[1]); b_d, b = load(sys.argv[2])
ka = [key(c) for c in a]; kb = [key(c) for c in b]
print('top lists: %d vs %d; common keys %d; same order %s' % (len(ka), len(kb), len(set(ka) & set(kb)), ka == kb))
for name, cs in (('first', a), ('second', b)):
    ids = [n['id'] for c in cs for n in c['nodes']]
    print(name, 'with br2:', sum(1 for c in cs if any(n['id'].startswith('br2-') for n in c['nodes'])),
          'with br3:', sum(1 for c in cs if any(n['id'].startswith('br3-') for n in c['nodes'])),
          'with twin-screen-ts:', sum(1 for c in cs if any(n['id'] == 'twin-screen-ts' for n in c['nodes'])),
          'with qrh/tro6:', sum(1 for c in cs if any(n['id'] in ('qrh-seven-eighths', 'tro6-natural') for n in c['nodes'])),
          'score range: %.2f..%.2f' % (min(c['score'] for c in cs), max(c['score'] for c in cs)))
    for r, c in enumerate(cs[:5], 1):
        print('  ', r, round(c['score'], 2), c['move'], ' x '.join(n['id'] for n in c['nodes']))
