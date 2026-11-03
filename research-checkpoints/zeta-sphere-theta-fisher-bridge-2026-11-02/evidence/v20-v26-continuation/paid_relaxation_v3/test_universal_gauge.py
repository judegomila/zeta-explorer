from pathlib import Path
exec((Path(__file__).parent/'optimize_gauge.py').read_text().split('rows=[]')[0])
xx,ww=leggauss(60);ls=(xx+1)/2;ww=ww/2
rows=[]
for n in [3,4,5,6,7,8,9]:
 end=calc(1,n)
 row=dict(n=n,terminal=end['S'],mid_coefficients=calc(.5,n)['coefficients'])
 for mode in ['psecond','scaled_psecond','paired_L2']:
  vals=[calc(t,n,gauge=mode)['cost'] for t in ls]
  row[mode]=float(2*np.dot(ww,vals)/end['S'])
 rows.append(row)
print(json.dumps(dict(scope='Floating diagnostic only',rows=rows),indent=2))
