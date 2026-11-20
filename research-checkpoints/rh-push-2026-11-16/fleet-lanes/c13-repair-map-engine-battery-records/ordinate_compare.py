import json
from mpmath import mp, mpf
mp.dps=45
n=json.load(open('records_corrected/screen.corrected.json')); o=json.load(open('before/screen.json'))
dz=[mpf(g) for g in json.load(open('../c12-control-battery-harness/tables/zeros_DH.json'))['online']]
for w,(a,b) in (('t0-200',(1,200)),('t1000-1020',(1000,1020))):
    mine=[mpf(x) for x in n['DH'][w]['ordinates']]; bat=[g for g in dz if a<g<b]
    print(w, len(mine), len(bat), 'largest |ordinate difference| battery vs corrected record: %s' % mp.nstr(max(abs(x-y) for x,y in zip(mine,bat)),3))
print('zeta max change', max(abs(o['zeta'][w]['min_q'][h]-n['zeta'][w]['min_q'][h]) for w in o['zeta'] for h in o['zeta'][w]['min_q']))
