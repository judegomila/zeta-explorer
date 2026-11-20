import json, sys
S = json.load(open('out/summary.json'))
L = []
L.append('| family | read | nodes done (planned) | decided by the HEAT column before other columns | positives one-signed for some threshold | excluded | T-train (balls) | hold-out survivors, thresholds scanned | undecided | largest rung used |')
L.append('|---|---|---|---|---|---|---|---|---|---|')
tot = dict(n=0, e=0, t=0, h=0, u=0)
for k, e in S.items():
    fam, rd = k.split('_')
    c = e['cnt']
    tur = fam in ('T3', 'T6')
    planned = e['planned'] * (18 if tur else 1)
    pos = c.get('posfeas', 0) if (tur or 't' in fam) else ('%d of the %d recount nodes' % (c.get('onesigned', 0), c.get('loco_n', 0)))
    precs = sorted(int(x[5:]) for x in c if x.startswith('prec_'))
    rung = max(precs) if precs else 128
    if e.get('undecided_in_search_runs'):
        rung = '512 after the post-pass (%d nodes were left at 16384 by the search run)' % e['undecided_in_search_runs']
    L.append('| %s | %s | %s (%s)%s | %s | %s | %s | %d | %d | %d | %s |' % (
        fam, 'K3' if rd == 'k3' else 'Kpol', format(e['nodes'], ','), format(planned, ','), ' cut' if e['cut'] else '',
        format(c.get('why_HEATcol', 0), ',') if rd == 'k3' and not tur and 't' not in fam else ('%s (lazy exit)' % format(c.get('lazy', 0) + 0, ',') if 't' in fam else '-'),
        pos if isinstance(pos, str) else format(pos, ','), format(e['excluded'], ','), e['ttrain'], e['hold'], e['undecided'], rung))
    tot['n'] += e['nodes']; tot['e'] += e['excluded']; tot['t'] += e['ttrain']; tot['h'] += e['hold']; tot['u'] += e['undecided']
L.append('| total | | %s | | | %s | %d | %d | %d | |' % (format(tot['n'], ','), format(tot['e'], ','), tot['t'], tot['h'], tot['u']))
L.append('')
L.append('Leave-one-class-out recount.')
L.append('')
L.append('| family | read | scope of the recount | {T-NR, E_a}: T-train / hold-out | {T-NR, HEAT}: T-train / hold-out | {E_a, HEAT}: T-train / hold-out | best hold-out score of a two-class tier (23 needed) |')
L.append('|---|---|---|---|---|---|---|')
for k, e in S.items():
    fam, rd = k.split('_')
    c = e['cnt']
    tur = fam in ('T3', 'T6')
    if tur:
        scope = 'all %s node-mu; float64 certified (+ float64-undecided, not converted unless the hold-out read was favourable)' % format(e['nodes'], ',')
        cell = lambda t: '%s (+%s) / %d float64, %d balls' % (format(c.get('ft_' + t, 0), ','), format(c.get('fu_' + t, 0), ','), c.get('fh_' + t, 0), c.get('bh_' + t, 0))
    else:
        scope = 'first %s nodes, balls' % format(c.get('loco_n', 0), ',')
        cell = lambda t: '%d / %d' % (c.get('lt_' + t, 0), c.get('lh_' + t, 0))
        if 't' in fam and e['loco_ttrain_rec']['TH'] > c.get('lt_TH', 0):
            scope += '; {T-NR, HEAT} also on all nodes (%d T-train, 0 hold-out)' % e['loco_ttrain_rec']['TH']
    b = max(e['best'][t] for t in ('TE', 'TH', 'EH'))
    L.append('| %s | %s | %s | %s | %s | %s | %s |' % (fam, 'K3' if rd == 'k3' else 'Kpol', scope, cell('TE'), cell('TH'), cell('EH'), b if b else '-'))
open('table.md', 'w').write('\n'.join(L) + '\n')
print('\n'.join(L))
