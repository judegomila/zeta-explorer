import json, glob, math
L10 = math.log(10)
for fn in sorted(glob.glob('mellin_*.json')):
    r = json.load(open(fn)); rows = r['rows']
    print(fn, 'v-range [%.2f, %.2f]' % (r['kmin']/100, r['kmax']/100), 'flags', r['flags'], 'sec %.0f' % r['seconds'],
          'max relrad %.1e' % max(x['relrad_MJ'] for x in rows), 'nan rows', sum(1 for x in rows if x['logabsMJ'] != x['logabsMJ']))
    for sig in ['0.15', '0.25', '0.3', '0.35', '0.5', '0.7']:
        rs = [x for x in rows if x['sigma'] == sig]
        d = {x['t']: x for x in rs}
        slope = (d[200.0]['logabsMJ'] - d[150.0]['logabsMJ']) / 50
        line = '  sigma=%s rate of |M[J]| on t in [150,200]: %.4f; max rel(h vs 2h), t<=100: %.1e' % (sig, -slope, max(x['rel_h_vs_2h'] for x in rs if x['t'] <= 100))
        if 'logabsZ_formula' in rs[0]:
            line += '; max rel(M[logN/n] vs formula): %.1e' % max(x['rel_MN_vs_formula'] for x in rs)
        else:
            line += '; rate of |M[logN/n]|: %.4f' % (-(d[200.0]['logabsMN'] - d[150.0]['logabsMN']) / 50)
        line += ' | log10|M[J]|, log10(|M[logN/n]|/|M[J]|) at t=0,14,50,100,200: ' + ' '.join('(%.2f, %.2f)' % (d[t]['logabsMJ']/L10, (d[t]['logabsMN'] - d[t]['logabsMJ'])/L10) for t in [0.0, 14.0, 50.0, 100.0, 200.0])
        print(line)
