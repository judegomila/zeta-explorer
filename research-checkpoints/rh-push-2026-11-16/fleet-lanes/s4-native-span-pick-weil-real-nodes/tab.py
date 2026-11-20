import json, sys, os
def rd(f):
    return [json.loads(l) for l in open(f)] if os.path.exists(f) else []
def t1():
    for fn in ('server/c1_zeta.jsonl', 'server/c1_ctrl.jsonl'):
        print('##', fn)
        for r in rd(fn):
            fnn = r['first_negative']
            print('%-22s %-14s n=%-4d bits=%-6d done=%-4d neg=%-3d first_n=%-5s node=%-8s log2=%-9s minlog2=%-9s und=%-5s | probe N=%-5s x=%-7s | lad=%s steps=%s negidx=%s' % (
                r['code'], r['family'], r['n'], r['bits'], r['done'], r['negatives'], (fnn + 1) if fnn is not None else '-',
                ('%.4f' % r['first_negative_node']) if fnn is not None else '-', ('%.0f' % r['first_negative_log2']) if fnn is not None else '-',
                '%.0f' % r['min_log2_pivot'], r['undecided_at'], r.get('probe_first_N', '.'), ('%.3f' % r['probe_first_x']) if r.get('probe_first_x') else '-',
                (r['ladder_first_nonpositive'] + 1) if r.get('ladder_first_nonpositive') is not None else ('-' if 'ladder_steps' in r else '.'), r.get('ladder_steps', '.'),
                [i + 1 for i in r.get('negative_indices', [])[:8]]))
def t3():
    for r in rd('server/c3.jsonl'):
        print('%-28s z*=%-4s a=%-5s d=%-4d bits=%-6d decided=%-4d first=%-5s log2=%-8s nneg=%-3d neg=%s und=%s maxg=%.6f' % (r['code'], r['zstar'], r['a'], r['d'], r['bits'], r['orders_decided'],
              (r['first_negative_order'] + 1) if r['first_negative_order'] is not None else '-', ('%.0f' % r['first_negative_log2']) if r['first_negative_log2'] else '-',
              r['n_negative'], [i + 1 for i in r['negative_orders'][:8]], r['undecided_at'], r['max_abs_schur_param'] or -1))
def t4():
    import collections
    g = collections.OrderedDict()
    for r in rd('server/c4.jsonl'):
        g.setdefault(r['code'], []).append(r)
    for code, rows in g.items():
        ok = [r for r in rows if r.get('status') == 'ok']
        if not ok: print(code, 'no rows'); continue
        rel = sorted(r['rel_resid'] for r in ok)
        bad = [r for r in ok if r['rel_resid'] > 1e-6]
        print('%-26s windows=%-4d t in [%.1f, %.1f] rel_resid median=%.2e max=%.2e | windows above 1e-6: %d' % (code, len(ok), ok[0]['t0'], ok[-1]['t0'] + ok[-1]['W'], rel[len(rel) // 2], rel[-1], len(bad)))
        for r in bad[:12]:
            print('      t0=%-8.1f rel=%.2e max=%.2e at t=%.2f' % (r['t0'], r['rel_resid'], r['max_abs_resid'], r['t_at_max']))
        if len(bad) > 12: print('      ... first clean window after start:', next((r['t0'] for r in ok if r['rel_resid'] <= 1e-6), None), ' lowest failing t0:', min(r['t0'] for r in bad))
{'1': t1, '3': t3, '4': t4}[sys.argv[1]]()
