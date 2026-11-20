import json, sys
rows = []
for f in sys.argv[1:]:
    try: rows += json.load(open(f))
    except Exception as e: print('missing', f)
print('family | X | T_mid | lam (own density) | tr/node (1/lam) | R +- se | c = 2 - R | c sine | c no off-diag | n_neg / nodes | ev_min | true on-line fraction | zero-side check')
for r in rows:
    zs = r.get('zero_side')
    print('%-16s | %.3g | %.4g | %.3f | %.4f (%.4f) | %.4f +- %s | %.4f | %.4f | %.4f | %d / %d | %.3g | %s | %s' % (
        r['family'], r['X'], r['T_mid'], r['lam'], r['tr_per_node'], r['one_over_lam'], r['R'], ('%.4f' % r['R_se']) if r['R_se'] is not None else '-', r['c'], r['c_sine'], 2 - r['R_no_offdiag'],
        r['n_neg_total'], r['nw'] * r['nwin'], r['ev_min'], r['true_fraction'],
        ('%s: max entry diff %.1e, fro2 %.3f / %.3f, tr %.3f / %.3f' % (zs['list'], zs['max_entry_diff'], zs['fro2_prime'], zs['fro2_zero'], zs['tr_prime'], zs['tr_zero'])) if zs else ''))
