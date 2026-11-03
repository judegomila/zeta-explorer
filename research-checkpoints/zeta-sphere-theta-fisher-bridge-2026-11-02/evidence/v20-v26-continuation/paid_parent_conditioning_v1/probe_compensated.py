from pathlib import Path
exec((Path(__file__).parent/'probe_conditioning.py').read_text().split('xl,wl=')[0])
from scipy.integrate import cumulative_trapezoid,trapezoid
rows=[]
ls=np.linspace(0,1,201)
for n in [2,3,4,5,7,9,12,15]:
 vals=[calc(l,n) for l in ls];aa=np.array([v['alpha'] for v in vals]);A=cumulative_trapezoid(aa,ls,initial=0)
 cost=2*trapezoid(np.exp(2*(A[-1]-A))*np.array([v['conditional_cs'] for v in vals]),ls)/vals[-1]['S']
 rows.append(dict(n=n,integral_alpha=A[-1],terminal_m=vals[-1]['m'],terminal_delta_ratio=vals[-1]['delta_ratio'],terminal_conditional_eta=vals[-1]['conditional_eta'],compensated_ratio=cost))
print(json.dumps(dict(scope='Floating diagnostic only; trapezoidal lambda integration.',rows=rows),indent=2))
