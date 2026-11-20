import json
d=json.load(open('spikes.json'))
A=d['A']
names=['zeta','sign','tnr','dh','l2','ntm','ntp','ea']
out=[]
for p in (2,3):
    out.append('\nS = {inf,%d}: each cell = delta_S(%d^k + 1e-7); slope per log_%d(1/eps) between eps = 1e-7 and 1e-11; ratio slope(delta_in)/slope(delta_S) (law: 1/rho). Zeta law for the slope: 2 rho^(1/2) (1 - 1/p)^2.\n'%(p,p,p))
    out.append('| k | rho | zeta law slope | '+' | '.join(names)+' |'); out.append('|---|---|---|'+'---|'*len(names))
    for k in range(0,5):
        cells=[]
        for nm in names:
            r=[x for x in A if x['p']==p and x['name']==nm and x['k']==k][0]
            io='-' if r['in_over_out'] is None else '%.4f'%r['in_over_out']
            cells.append('%+.4f; %+.4f; %s'%(r['height_abs'],r['slope'],io))
        r0=[x for x in A if x['p']==p and x['name']=='zeta' and x['k']==k][0]
        out.append('| %d | %d | %.4f | '%(k,p**k,r0['zeta_law'])+' | '.join(cells)+' |')
out.append('\nS = {inf,2,3}: sqrt(rho0) M(a,b)/M(0,0), M(a,b) = mean over the positive cone of c_j conj(c_{j+(a,b)}) (the log^2-cusp coefficient at rho0 = 2^a 3^b in units of the rho0 = 1 coefficient); last column: largest factorisation defect abs(M(a,b) M(0,0) - M(a,0) M(0,b))/M(0,0)^2 over the ten units.\n')
units=[(u['a'],u['b']) for u in d['B'][0]['units']]
out.append('| object | '+' | '.join('%d'%(2**a*3**b) for a,b in units)+' | max defect |'); out.append('|---|'+'---|'*(len(units)+1))
for row in d['B']:
    cells=[]
    for u in row['units']:
        cells.append(('%+.3f'%u['rel_re']) if abs(u['rel_im'])<1e-6 else '%+.3f%+.3fi'%(u['rel_re'],u['rel_im']))
    out.append('| %s | '%row['name']+' | '.join(cells)+' | %.1e |'%max(u['fact_defect'] for u in row['units']))
open('tables_spikes.md','w').write('\n'.join(out)+'\n')
