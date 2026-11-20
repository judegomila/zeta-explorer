exec(open('/workspace/shared/zeta_sphere_campaign/fisher_bridge_v3/probe.py').read())
N=int(sys.argv[2]) if len(sys.argv)>2 else 8
x,w=m.gauss_quadrature(N,'legendre')
outs=[]
for aa in ['0.015625','0.125','0.25','0.49']:
 a=m.mpf(aa);Gp=gram(a);Gm=gram(-a);Ap=Gp[:9,:9];Am=Gm[:9,:9];bp=Gp[:9,9];bm=Gm[:9,9];alp=m.lu_solve(Ap,bp);alm=m.lu_solve(Am,bm)
 dp=Gp[9,9]-(bp.T*alp)[0];dm=Gm[9,9]-(bm.T*alm)[0];A=Ap-Am;delta=alm-alp;K=Am+Am*(A**-1)*Am
 exact=(delta.T*K*delta)[0];action=m.mpf(0)
 for z,ww in zip(x,w):
  t=a*z;G=gram(t);Gd=gram(t,True);G0=G[:9,:9];b0=G[:9,9];al=m.lu_solve(G0,b0);ad=m.lu_solve(G0,Gd[:9,9]-Gd[:9,:9]*al)
  action+=2*a*a*ww*(ad.T*K*ad)[0]
 gain=dp-dm;sur=gain-exact;gap=gain-action
 out={'a':aa,'gain':str(gain),'exact_cost':str(exact),'action_cost':str(action),'exact_surplus':str(sur),'action_surplus':str(gap),'action_over_exact':str(action/exact),'action_over_gain':str(action/gain)};outs.append(out)
 print('ACTION',aa,*[m.nstr(v,15) for v in [gain,exact,action,gap,action/gain]],flush=True)
 json.dump({'nodes':N,'step':str(step),'data':outs},open('/workspace/shared/zeta_sphere_campaign/fisher_bridge_v3/action_'+str(int(1/step))+'_'+str(N)+'.json','w'),indent=2)
