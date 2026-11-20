import sys,json
for l in sys.stdin:
    try: r=json.loads(l)
    except Exception:
        if not l.startswith('#'): print(l.strip()[:160])
        continue
    g=r.get('gap_over_sqrtX'); e=r.get('excess_over_sqrtX')
    cm=r.get('cmax'); print(f"{r['name']:9s} {str(r['kw']):24s} k={r['k']} X={r['X']:<8d} D={r['D']:<6d} st={r['status']} gap/sqrtX={g if g is None else format(g,'.2e')} exc/sqrtX={e if e is None else format(e,'+.4f')} sv={r['neg_count']} cmax={cm if cm is None else format(cm,'.3g')} rows={r.get('rows')} it={r.get('it')} t={r['time']:.0f} {r.get('msg','')[15:35]}")
