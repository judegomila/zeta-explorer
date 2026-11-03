from pathlib import Path
exec((Path(__file__).parent/'probe_conditioning.py').read_text().split('xl,wl=')[0])
rows=[]
for n in [2,5,9,15]:
 for t in [.1,.5,.9]:
  o=calc(t,n);eps=1e-4
  d=(calc(t+eps,n)['S']-calc(t-eps,n)['S'])/(2*eps)
  rows.append(dict(n=n,lam=t,relative_fd_error=abs(d-o['signed_rate'])/max(1,abs(o['signed_rate'])),relative_split_error=abs(o['compensated_rate']-o['signed_rate'])/max(1,abs(o['signed_rate']))))
print(json.dumps(dict(scope='Floating derivative smoke check only',rows=rows),indent=2))
assert max(r['relative_fd_error'] for r in rows)<1e-5
assert max(r['relative_split_error'] for r in rows)<1e-7
