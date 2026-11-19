"""tables/*.md and tables/summary.json from the run directory. usage: python make_tables.py <outdir>"""
import json, os, sys, glob
out = sys.argv[1]
CL = ['DH', 'T-NR', 'E_a', 'HEAT', 'SGN', 'U', 'DEL/THIN', 'EIS-w', 'theta^w']
G = ['D1', 'D2-F1', 'D2-F2', 'D2-F3', 'D2-F4', 'D2-F5', 'D3a', 'D3b-F1', 'D3b-F2', 'D3b-F3', 'D3b-F4', 'D3b-F5']
os.makedirs('tables', exist_ok=True)
summ = {}


def load(kind, fam):
    f = os.path.join(out, '%s_%s.json' % (kind, fam))
    return json.load(open(f)) if os.path.exists(f) else None


def fmt(x):
    return '%.3f' % x


lines = []
for suffix, title in (('', 'registered grid'), ('-rnd', 'registered random draws'), ('-adp', 'adaptive stage'), ('-rnd2', 'amendment A3 random draws')):
    lines.append('## %s\n' % title)
    for pset in ('P2', 'P1', 'P0'):
        lines.append('### positives %s, strict reading\n' % pset)
        lines.append('| family | functionals | one-signed on positives | ' + ' | '.join(CL) + ' | max classes rejected (training) | max classes with any member opposite | T-train | T-weak | full |')
        lines.append('|---|---|---|' + '---|' * 9 + '---|---|---|---|---|')
        for fam in G:
            a = load('analysis', fam + suffix)
            if a is None:
                continue
            p = a['%s/strict' % pset]
            ht = p['hist_train']; ha = p['hist_any']
            mt = max([i for i, v in enumerate(ht) if v > 0] or [0]); ma = max([i for i, v in enumerate(ha) if v > 0] or [0])
            pf = [fmt(x) if p['one'] else '-' for x in p['pass_frac_train']]
            lines.append('| %s | %d | %d | %s | %d | %d | %d | %d | %d |' % (fam + suffix, a['n'], p['one'], ' | '.join(pf), mt, ma, p['ttrain'], p['tweak'], p['full']))
            summ.setdefault(fam + suffix, {})[pset] = dict(n=a['n'], one=p['one'], pass_frac_train=p['pass_frac_train'], pass_frac_no_member_opposite=p['pass_frac_no_member_opposite'],
                                                          share_heldout_lt95=p['pass_frac_heldout_lt95'], hist_train=ht, hist_any=ha, hist_h95=p['hist_h95'], ttrain=p['ttrain'], tweak=p['tweak'], full=p['full'],
                                                          favourable=dict(one=a['%s/favourable' % pset]['one'], ttrain=a['%s/favourable' % pset]['ttrain'], full=a['%s/favourable' % pset]['full']),
                                                          optimistic=dict(ttrain=a['optimistic/%s' % pset]['ttrain'], full=a['optimistic/%s' % pset]['full']))
        lines.append('')
        lines.append('Columns DH .. theta^w: pass fraction = share of the one-signed functionals on which no training member of the class has the opposite sign.\n')
    lines.append('### held-out reading (P2 strict): share of one-signed functionals on which fewer than 95% of the 24 held-out members have the opposite sign; and share with no member (training or held-out) opposite\n')
    lines.append('| family | ' + ' | '.join(CL) + ' |')
    lines.append('|---|' + '---|' * 9)
    for fam in G:
        a = load('analysis', fam + suffix)
        if a is None or not a['P2/strict']['one']:
            continue
        p = a['P2/strict']
        lines.append('| %s | %s |' % (fam + suffix, ' | '.join('%s / %s' % (fmt(x), fmt(y)) for x, y in zip(p['pass_frac_heldout_lt95'], p['pass_frac_no_member_opposite']))))
    lines.append('')
    lines.append('### float64-undecided functionals and the ball stage (amendment A2)\n')
    lines.append('| family | undecided share of entries | not excluded by float64 (optimistic, P0 / P1 / P2) | ball stage: rows | zeta sign + / - / ball zero | killed by class (count) | kills relying on a ball-zero member | alive after all classes | T-train / T-weak / full among alive (P0; P1; P2) | ball evaluations | seconds |')
    lines.append('|---|---|---|---|---|---|---|---|---|---|---|')
    for fam in G:
        a = load('analysis', fam + suffix); h = load('hp', fam + suffix)
        if a is None:
            continue
        opt = ' / '.join(str(a['optimistic/%s' % p]['ttrain']) for p in ('P0', 'P1', 'P2'))
        if h is None:
            lines.append('| %s | %.4f | %s | not run | | | | | | | |' % (fam + suffix, a['undecided_share'], opt)); continue
        st = h['status']
        kill = ', '.join('%s %d' % (CL[int(k.split('_')[-1]) - 1], v) for k, v in sorted(st.items()) if k.startswith('killed'))
        ta = '; '.join('%d / %d / %d' % (h['tiers_alive'][p]['ttrain'], h['tiers_alive'][p]['tweak'], h['tiers_alive'][p]['full']) for p in ('P0', 'P1', 'P2')) if h['tiers_alive'] else '-'
        lines.append('| %s | %.4f | %s | %d | %d / %d / %d | %s | %s | %d | %s | %d | %.0f |' % (fam + suffix, a['undecided_share'], opt, h['processed'], h['zeta_plus'], h['zeta_minus'], st.get('zeta_zero', 0), kill, h.get('kills_with_a_ball_zero_member', 'n/a'), st.get('alive', 0), ta, h['ball_evaluations'], h['seconds']))
        summ.setdefault(fam + suffix, {})['ball_stage'] = dict(candidates=h['candidates'], processed=h['processed'], status=st, kills_with_a_ball_zero_member=h.get('kills_with_a_ball_zero_member'), tiers_alive={p: {k: v[k] for k in ('ttrain', 'tweak', 'full')} for p, v in h['tiers_alive'].items()}, maxprec_hist=h['maxprec_hist'])
    lines.append('')
    lines.append('### search controls: label shuffles (P2 strict criterion on permuted labels) and planted rows\n')
    lines.append('| family | shuffles | subsample step | with a full survivor | with a T-weak survivor | with a T-train survivor | mean one-signed after shuffle | planted rows recovered |')
    lines.append('|---|---|---|---|---|---|---|---|')
    for fam in G:
        a = load('analysis', fam + suffix)
        if a is None:
            continue
        s = a.get('shuffle'); pl = a['planted_value_level']
        if s:
            lines.append('| %s | %d | %d | %d | %d | %d | %.1f | %d of %d |' % (fam + suffix, s['n'], s['step'], s['with_full'], s['with_tweak'], s['with_ttrain'], s['mean_one'], pl['recovered'], pl['expected']))
            summ[fam + suffix]['shuffle'] = s
        else:
            lines.append('| %s | not run | | | | | | %d of %d |' % (fam + suffix, pl['recovered'], pl['expected']))
        summ[fam + suffix]['planted_value_level'] = pl
    lines.append('')
open('tables/per_class_tables.md', 'w').write('# Per-class tables (generated by make_tables.py from the server run)\n\n' + '\n'.join(lines))

# confirmation and near misses
L = ['# Ball confirmation and best near-misses (amendment A4)\n', '| family | entries compared | float64 decided, ball agrees | disagrees | float64 decided, ball undecided | float64 undecided |', '|---|---|---|---|---|---|']
nm = []
for fam in G:
    c = load('confirm', fam)
    if c is None:
        continue
    L.append('| %s | %d | %d | %d | %d | %d |' % (fam, c['entries'], c['float_decided_agree'], c['float_decided_disagree'], c['float_decided_ball_undecided'], c['float_undecided']))
    summ[fam]['confirm'] = {k: c[k] for k in ('entries', 'float_decided_agree', 'float_decided_disagree', 'float_decided_ball_undecided', 'float_undecided', 'bad')}
    if 'prediction2_tnr_counterexamples_ball' in c:
        summ[fam]['prediction2_ball'] = c['prediction2_tnr_counterexamples_ball']
    for t in c['top_rows_ball']:
        nm.append((fam, t))
L += ['', '## Best near-misses, every object in balls\n', '| family | parameters | positive set with a strict sign | classes rejected: training / any member / held-out >= 95% | training reject vector (DH .. theta^w) | held-out opposite fractions | held-out positives with the sign | ball-undecided objects |', '|---|---|---|---|---|---|---|---|']
for fam, t in nm:
    best = None
    for pset in ('P2', 'P1', 'P0'):
        if t['ball'][pset]['sign'] != 0:
            best = pset; break
    if best is None:
        L.append('| %s | %s | none | | | | | %d |' % (fam, json.dumps(t['params']), t['ball_undecided'])); continue
    b = t['ball'][best]
    L.append('| %s | %s | %s (%+d) | %d / %d / %d | %s | %s | %.3f | %d |' % (fam, json.dumps(t['params']), best, b['sign'], b['classes_rejected_train'], b['classes_any_member'], b['classes_heldout95'], ''.join(map(str, b['rejT'])), ' '.join('%.2f' % x for x in b['fracH']), b['ph_same'], t['ball_undecided']))
open('tables/near_misses_and_confirmation.md', 'w').write('\n'.join(L) + '\n')
for f in glob.glob('tables/ball_vs_float_*.json') + ['tables/validation.json', 'tables/referee_mp_check.json']:
    if os.path.exists(f):
        summ[os.path.basename(f)] = json.load(open(f))
json.dump(summ, open('tables/summary.json', 'w'), indent=1)
print('written', len(lines), 'lines')

# closest approaches
C = ['# Closest approaches (closest.py; rows re-evaluated on every object in balls)\n',
     'Per family and positive set: number of one-signed functionals with a member (training or held-out) of opposite sign in every class; the largest value over one-signed functionals of the minimum over classes of the held-out opposite fraction (the registered criterion needs 0.958 = 23/24); then the listed rows.\n',
     '| family | positives | functionals with an opposite member in every class | best min-over-classes held-out fraction |', '|---|---|---|---|']
rowsout = []
allfam = [f + s for s in ('', '-rnd', '-adp', '-rnd2') for f in G]
cl = {}
for fam in allfam:
    c = load('closest', fam)
    if c is None:
        continue
    cl[fam] = {}
    for pset in ('P2', 'P1', 'P0'):
        C.append('| %s | %s | %d | %.3f |' % (fam, pset, c[pset]['n_every_class_has_an_opposite_member'], max(c[pset]['best_min_heldout_fraction'], 0)))
        cl[fam][pset] = dict(n_every=c[pset]['n_every_class_has_an_opposite_member'], best_min=c[pset]['best_min_heldout_fraction'])
        for r in c[pset]['rows']:
            rowsout.append((fam, pset, r))
C += ['', '## Rows (ball values)\n', '| family | positives | parameters | sign on positives | training reject vector (DH .. theta^w) | held-out opposite fractions | min | held-out positives with the sign | T-train | full | float64 = ball on the reading |', '|---|---|---|---|---|---|---|---|---|---|---|']
for fam, pset, r in rowsout:
    b = r['ball']; f = r['float64']
    C.append('| %s | %s | %s | %+d | %s | %s | %.3f | %.3f | %s | %s | %s |' % (fam, pset, json.dumps({k: (round(v, 5) if isinstance(v, float) else v) for k, v in r['params'].items()}), b['sign'], ''.join(map(str, b['rejT'])), ' '.join('%.2f' % x for x in b['fracH']), b['min_fracH'], b['ph_same'], b['ttrain'], b['full'], (b['rejT'] == f['rejT'] and b['fracH'] == f['fracH'] and b['sign'] == f['sign'])))
open('tables/closest_approaches.md', 'w').write('\n'.join(C) + '\n')
summ['closest'] = cl
json.dump(summ, open('tables/summary.json', 'w'), indent=1)
