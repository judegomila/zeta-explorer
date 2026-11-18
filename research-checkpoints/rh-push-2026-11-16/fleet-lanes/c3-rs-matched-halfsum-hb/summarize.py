import json, glob, math, os
rows = []
files = ['pilot_zeta.json'] + sorted(glob.glob('server/res_*.json'))
def row(r, src):
    H = r['H']; segs = r['segs']
    sds = sum(z[0] for s in segs for z in s.get('right_zeros', []))
    beyond = sum(round(s['counts_right_of_level'][-1]) for s in segs)
    last = max(s['dsig'][-1] for s in segs)
    c = None; cf = src.replace('res_', 'cert_')
    if os.path.exists(cf) and src != cf:
        cj = json.load(open(cf)); c = f"{cj.get('certified_total')}/{cj.get('attempted_total')}"
    q = [round(x, 2) for x in segs[-1].get('right_ds_quantiles_timesL', [])]
    return dict(label=r['label'], N=segs[-1]['N'], H=H, right=r['count_right'], newton=r.get('newton_right'), cert=c, dens=round(r['right_density'], 4),
                model_dens=round(r['model_right_density'], 4), Zdens=round(r['zeros_of_Z_density'], 4), ratio=round(r['right_density'] / r['zeros_of_Z_density'], 4),
                fracDneg=round(r['frac_D_neg'], 4), model_frac=round(r['model_frac_neg'], 4), mean_rate=round(r['mean_rate_arg_fF'], 4),
                meanlog=round(r['mean_log_absF'], 4), littlewood=round(2 * math.pi * sds / H, 4), beyond_last_level=beyond, last_level=round(last, 3), q_dsL=q,
                unres=sum(s['unresolved_steps'] for s in segs), interr=max(s['count_int_err'] for s in segs))
for f in files:
    d = json.load(open(f))
    for r in (d if isinstance(d, list) else [d]): rows.append(row(r, f))
json.dump(rows, open('summary.json', 'w'), indent=1)
print('| label | N | H | right zeros (winding) | Newton | arb-certified | right density | Gaussian model | Z-zero density | ratio | frac D<0 | model | mean log abs F | 2pi sum(beta-1/2)/H (found zeros) | zeros right of last level |')
print('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|')
for r in rows:
    print(f"| {r['label']} | {r['N']} | {r['H']:g} | {r['right']} | {r['newton']} | {r['cert']} | {r['dens']} | {r['model_dens']} | {r['Zdens']} | {r['ratio']} | {r['fracDneg']} | {r['model_frac']} | {r['meanlog']} | {r['littlewood']} | {r['beyond_last_level']} (ds>{r['last_level']}) |")
print(max(r['unres'] for r in rows), max(r['interr'] for r in rows))
for r in rows:
    if r['q_dsL']: print(r['label'], 'quantiles (10,25,50,75,90,99%) of (beta-1/2) log N:', r['q_dsL'])
