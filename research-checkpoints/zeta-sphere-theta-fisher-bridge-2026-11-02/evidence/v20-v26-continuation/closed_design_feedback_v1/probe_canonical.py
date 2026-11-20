from pathlib import Path
exec(Path('/workspace/shared/zeta_sphere_campaign/closed_dual_design_v1/probe_closed.py').read_text().split('\nrows=[]')[0])
rows=[]
for N in [2,4,5]:
 ids=list(range((N+1)%2,N,2));js=list(range(N%2,N+1,2));order=ids+js;k=len(ids)
 F=Fs[N][J:];q=Fs[N+1][J:];qa=h*q+Ks[N+1][J:]
 U=np.array([Fs[j][J:]/math.sqrt(ss[j]) for j in order]);KU=np.array([Ks[j][J:]/math.sqrt(ss[j]) for j in order]);Ua=h*U+KU
 B=(U*(wh*h))@U.T;Bp=(Ua*(wh*h))@U.T+(U*(wh*h))@Ua.T;c=U@(wh*h*q);cp=Ua@(wh*h*q)+U@(wh*h*qa)
 gam=np.linalg.solve(B,c);x=gam[:k];y=gam[k:];A=B[:k,:k];Ap=Bp[:k,:k];C=B[:k,k:];Cp=Bp[:k,k:];Dp=Bp[k:,k:];alpha=np.linalg.solve(A,c[:k]);r=cp[:k]-Ap@alpha;f=r@np.linalg.solve(Ap,r)
 Lp=2*cp@gam-gam@Bp@gam-2*cp[:k]@alpha+alpha@Ap@alpha
 z=cp[:k]-Ap@x;common=2*y@(cp[k:]-Cp.T@x)-y@Dp@y-z@np.linalg.solve(Ap,z)
 rate=2*np.linalg.svd(Cp,compute_uv=False)[0]
 canonical=2*y@cp[k:]-gam@Bp@gam
 natural=np.argsort(order);H=Bp[np.ix_(natural,natural)];Yn=U[natural];Kn=KU[natural]
 R=2*(Yn*(wh*h))@Yn.T+(Kn*wh)@Yn.T+(Yn*wh)@Kn.T
 bb=np.sqrt(np.array(ss[1:N+1])/np.array(ss[:N]));recerr=[];adjerr=[]
 for i in range(N):
  adjerr.append(abs(H[i,i+1]+np.trace(R[:i+1,:i+1])/(2*bb[i])))
  for j in range(N):
   lhs=bb[j]*H[i,j+1]+bb[i]*H[i+1,j]
   rhs=(bb[j-1]*H[i,j-1] if j else 0)+(bb[i-1]*H[i-1,j] if i else 0)-R[i,j]
   recerr.append(abs(lhs-rhs))
 rows.append(dict(N=N,canonical_relative_error=abs(canonical-common)/max(1,abs(common)),old_source_derivative_max=float(np.max(abs(cp[:k]))),cross_residue_max=float(np.max(abs(R[np.ix_(ids,js)]))),top_source_error=abs(cp[-1]/math.sqrt(ss[N])+.5*np.trace(R)),recurrence_absolute_error=max(recerr),adjacent_absolute_error=max(adjerr),common_relative_error=abs(common-(Lp-f))/max(1,abs(common)),parity_block_error=max(np.max(abs(Ap-.5*np.eye(k))),np.max(abs(Dp-.5*np.eye(len(js))))),mixed_coupling_norm=rate,mixed_derivative_min_eigenvalue=float(np.linalg.eigvalsh(Bp)[0]),gain_minus_feedback=common,old_metric_cost=z@np.linalg.solve(Ap,z),cross_term=-2*y@Cp.T@x,current_metric_cost=y@Dp@y,source_gain=2*y@cp[k:]))
print(json.dumps(dict(scope='Floating verified rungs only; not certified',rows=rows),indent=2))
