exec(open('/workspace/shared/zeta_sphere_campaign/fisher_bridge_v3/probe.py').read())
out=[]
for aa in ['0.015625','0.125','0.25','0.49']:
 a=m.mpf(aa);H=(gram(a)-gram(-a))/(2*a);L=m.cholesky(H);piv=[L[i,i]**2 for i in range(10)];out.append({'a':aa,'pivots':[str(v)for v in piv]});print('PIVOT',aa,m.nstr(min(piv),15),flush=True)
json.dump(out,open('/workspace/shared/zeta_sphere_campaign/fisher_bridge_v3/metric_'+str(int(1/step))+'.json','w'),indent=2)
