import json,glob
lane='../../c18-tz-band-completion-controls-server/'
L={}
for f in glob.glob(lane+'res_*.jsonl'):
    for l in open(f):
        r=json.loads(l)
        if r.get('obj')=='zeta' and 'lam_min' in r:
            L.setdefault((r['T0'],r['w'],r['theta'],r['form']),[]).append(r)
mine=[]
for T in ['1e6','1e8','1e10','1e12']:
    mine+=json.load(open('out_%s.json'%T))
print("T0 w theta | lane C lam_min (m=96) | ref C m=48, 96, 192 | diff96 | lane D lam_min | ref D 48,96,192 | lane sign C M=0/1")
cells={}
for r in mine:
    cells.setdefault((r['T0'],r['w'],r['theta']),{})[r['m']]=r
nC=0; maxrelC=0; maxabsD=0; rows=[]
for k in sorted(cells):
    c=cells[k]; lc=L.get(k+('C',),[None])[0]; ld=L.get(k+('D',),[None])[0]
    row=dict(T0=k[0],w=k[1],theta=k[2],Lg=c[96]['Lg'],n_reflected=c[96].get('n_reflected'),
             lane_C=lc['lam_min'] if lc else None, lane_C_signs=lc['signs'] if lc else None, ref_C={m:c[m].get('C_lam_min') for m in (48,96,192)},
             lane_D=ld['lam_min'] if ld else None, ref_D={m:c[m]['D_lam_min'] for m in (48,96,192)},
             lane_noref=lc.get('lam_min_no_reflected') if lc else None, ref_noref={m:c[m].get('C_noref_lam_min') for m in (48,96,192)},
             lane_normref=lc.get('norm_reflected') if lc else None, ref_normref={m:c[m].get('norm_reflected') for m in (48,96,192)})
    rows.append(row)
    if lc and row['n_reflected']:
        nC+=1; maxrelC=max(maxrelC,abs(lc['lam_min']-c[96]['C_lam_min'])/abs(lc['lam_min']))
    if ld: maxabsD=max(maxabsD,abs(ld['lam_min']-c[96]['D_lam_min']))
    f=lambda x: 'None' if x is None else '%.4f'%x
    print(k, '|', f(row['lane_C']), '|', ' '.join(f(row['ref_C'][m]) for m in (48,96,192)), '|', ('%.1e'%abs(row['lane_C']-row['ref_C'][96])) if lc else '-', '|', f(row['lane_D']), '|', ' '.join(f(row['ref_D'][m]) for m in (48,96,192)), '|', row['lane_C_signs'], row['n_reflected'])
print('cells with atoms compared',nC,'max rel diff C at m=96',maxrelC,'max abs diff D at m=96',maxabsD)
json.dump(rows,open('compare.json','w'),indent=1)
