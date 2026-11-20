from pathlib import Path
import json,sys,mpmath as mp
p=Path(__file__).parent
s=(p/'check_midpoint_recovery_flow.py').read_text();exec(s[:s.index('N=int(sys.argv')])
mp.mp.dps=100
data=json.loads((p/'tail_old_cross_fourth_4000.json').read_text())['moments']
mm=[ball(data[str(j)]) for j in range(9)]+[ball(json.loads((p/'tail_target_m9_8000.json').read_text())['M9_tail'])]
out={}
for name,shift in [('even8',0),('odd9',1)]:
 B=mp.matrix([[mp.mpf(mm[i+j+shift].mid().str(70,radius=False)) for j in range(5)] for i in range(5)])
 P=mp.inverse(mp.cholesky(B)).T
 out[name]={'shift':shift,'coefficients':[[mp.nstr(P[i,j],40) for j in range(5)] for i in range(5)],'scope':'Finite rational decimal candidate only; exact interval Gram verification required.'}
print(json.dumps(out,indent=2))
