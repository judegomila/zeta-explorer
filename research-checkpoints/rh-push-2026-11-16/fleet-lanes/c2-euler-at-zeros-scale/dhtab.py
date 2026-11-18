import json, sys
d = json.load(open(sys.argv[1]))
f = lambda s: 'NA' if s is None else '%.4f [%.4f, %.4f] %.4f' % (s['mean'], s['min'], s['max'], s['sd'])
print('on-line zeros %d, off-line pairs %d' % (d['n_on'], d['n_off_pairs']))
print('| class | P | window | n win | Rref = A0/(N M_P^DH) | RU (one-spacing shift) | Rhalf | G (mean log ratio) |'); print('|' + '---|' * 8)
for name in ['on', 'offR', 'offL', 'all']:
    for P in [10, 100, 1000, 10000, 100000]:
        for k in sorted([k for k in d if k.startswith('%s|%d|' % (name, P)) and not k.endswith('profile')], key=lambda k: int(k.split('|')[2])):
            r = d[k]; print('| %s | %d | %s | %d | %s | %s | %s | %s |' % (name, P, k.split('|')[2], r['RU']['n'], f(r['Rref']), f(r['RU']), f(r['Rhalf']), f(r['G'])))
