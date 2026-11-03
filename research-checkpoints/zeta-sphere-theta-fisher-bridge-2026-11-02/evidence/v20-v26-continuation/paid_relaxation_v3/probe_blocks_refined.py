"""Floating blockwise/time-integrated signed budgets, not certificates."""
from pathlib import Path
s=(Path(__file__).parent/'optimize_gauge.py').read_text().split('rows=[]')[0]
s=s.replace('N=800;maxn=9','N=1440;maxn=15')
s=s.replace('x,wt=leggauss(N);u=3*x;wt=3*wt;pos=slice(N//2,None);wp=wt[pos]',"gx,gw=leggauss(120);edges=[0,.125,.25,.5,1,2,3];hp=np.concatenate([lo+(gx+1)*(hi-lo)/2 for lo,hi in zip(edges[:-1],edges[1:])]);wh=np.concatenate([gw*(hi-lo)/2 for lo,hi in zip(edges[:-1],edges[1:])]);u=np.r_[-hp[::-1],hp];wt=np.r_[wh[::-1],wh];N=len(u);pos=slice(N//2,None);wp=wt[pos]")
s=s.replace("cost=math.pi/2*np.dot(wp,np.maximum(Jp+Zp@gauge,0))", "edges=[0,.125,.25,.5,1,2,3]\n blocks=[float(math.pi/2*np.dot(wp*((u[pos]>=lo)&(u[pos]<hi)),Jp+Zp@gauge)) for lo,hi in zip(edges[:-1],edges[1:])]\n cost=math.pi/2*np.dot(wp,np.maximum(Jp+Zp@gauge,0))")
s=s.replace("return dict(S=float(S)","return dict(blocks=blocks,S=float(S)")
exec(s)
xx,ww=leggauss(32)
rows=[]
for n in [5,9,12,13,15]:
 rowsn=[]
 for mode in [None,'scaled_psecond']:
  overall=np.zeros(6);paid=0.;local=0.
  for lo,hi in [(0,.5),(.5,1)]:
   ls=lo+(xx+1)*(hi-lo)/2;ws=ww*(hi-lo)/2
   vals=[calc(t,n,gauge=mode) for t in ls]
   block=ws@np.array([v['blocks'] for v in vals]);overall+=block
   paid+=np.maximum(block,0).sum();local+=ws@np.array([v['cost'] for v in vals])
  end=calc(1,n);start=calc(0,n)
  rowsn.append(dict(gauge=mode,space_time_block_budget_ratio=float(2*paid/end['S']),space_only_time_aggregated_ratio=float(2*np.maximum(overall,0).sum()/end['S']),local_ratio=float(2*local/end['S']),block_signed_integrals=list(map(float,overall)),relative_signed_identity_error=float((end['S']-2*sum(overall)-start['S'])/start['S'])))
 rows.append(dict(n=n,results=rowsn))
print(json.dumps(dict(scope='Floating diagnostics; separate120-node GL per spatial block; still no rigorous error bounds.',spatial_edges=[0,.125,.25,.5,1,2,3],time_edges=[0,.5,1],rows=rows),indent=2))
