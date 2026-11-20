import sys, json
for f in sys.argv[1:]:
    try: d = json.load(open(f))
    except Exception as e: print(f, 'missing'); continue
    print('%s  T=%g..%g zeros %d%s' % (f, d['T'], d['Tend'], d['n0'], ' TNR %s' % d['tnr'] if d['tnr'] else ''))
    for e in d['table']:
        r = e['ratio']['bk_pair_triple'] or 0
        print('   tau=%g D=%d (pair criterion %d, isolated %d) ratio: pair+triple %.4f +- %.4f, pair %.4f, GUE %.4f' % (e['tau'], e['D'], e['D_gap'], e['D_gap_isolated'], r, r * (e['rel_stat'] or 0), e['ratio']['bk_pair'] or 0, e['ratio']['gue'] or 0)
              + (' | zeta same blocks D=%d ratio %.4f' % (e['D_zeta'], e['ratio_zeta']['bk_pair_triple']) if 'D_zeta' in e else ''))
