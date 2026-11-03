"""Fresh starting target Schur bounds, then combine with independent flow.
The new target masses are evaluated, not assumed. No earlier target certificate input.
"""
from pathlib import Path
import json
p=Path(__file__).parent
s=(p/'check_midpoint_recovery_flow.py').read_text();exec(s[:s.index('N=int(sys.argv')])
s=(p/'check_signed_tail_prefix.py').read_text();exec(s[s.index('def general_ldl'):s.index('sums=')])
data=json.loads((p/'tail_old_cross_fourth_4000.json').read_text())['moments']
out={}
for name,shift in [('even8',0),('odd9',1)]:
 old=[ball(data[str(j+shift)]) for j in range(8)]
 cc=ball(data['8']) if shift==0 else ball(json.loads((p/'tail_target_m9_8000.json').read_text())['M9_tail'])
 ff=general_ldl([[old[i+j] for j in range(4)] for i in range(4)])
 ell,ds=ff;bb=old[4:8];yy=[]
 for i in range(4):yy.append(bb[i]-sum(ell[i][j]*yy[j] for j in range(i)))
 cost=sum(yy[i]**2/ds[i] for i in range(4));schur=cc-cost
 gain=ball(json.loads((p/'next_tail_target_flow_refined_16000.json').read_text())[name]['signed_gain'])
 full=schur+gain
 out[name]={'target_mass':directed(cc),'actual_feedback_cost':directed(cost),'starting_tail_schur':directed(schur),'flow_recovered_global_schur':directed(full),'starting_positive':bool(schur.lower()>0),'global_positive':bool(full.lower()>0)}
out['scope']='Explicit independently evaluated starting target masses combined with prior noncircular target differences. Original normalized a=0 only; no all-shift theorem or degree-range extension claimed.'
print(json.dumps(out,indent=2))
