"""Own-source closed-design sanity check on previously verified rungs only; not certified."""
from pathlib import Path
exec((Path('/workspace/shared/zeta_sphere_campaign/modular_innovation_payment_v1/probe_normalized.py')).read_text().split('rows=[]')[0].replace("Path(__file__).parent", "Path('/workspace/shared/zeta_sphere_campaign/modular_innovation_payment_v1')"))
rows=[]
for N in [2,4,5]:
 F=Fs[N][J:];q=Ds[N][J:];KN=Ks[N][J:];Fa=h*F+KN;qa=h*q+F+DKs[N][J:]
 ids=list(range((N+1)%2,N,2));V=np.array([Fs[j][J:]/math.sqrt(ss[j]) for j in ids]);KV=np.array([Ks[j][J:]/math.sqrt(ss[j]) for j in ids]);Va=h*V+KV
 A=(V*(wh*h))@V.T;Ap=(Va*(wh*h))@V.T+(V*(wh*h))@Va.T;c=V@(wh*h*q);cp=Va@(wh*h*q)+V@(wh*h*qa)
 alpha=np.linalg.solve(A,c);alphap=np.linalg.solve(A,cp-Ap@alpha);f=(A@alphap)@np.linalg.solve(Ap,A@alphap)
 deltap=2*np.dot(wh*h,q*qa)-2*cp@alpha+alpha@Ap@alpha
 U=np.array([Fs[j][J:]/math.sqrt(ss[j]) for j in range(N+1)]);KU=np.array([Ks[j][J:]/math.sqrt(ss[j]) for j in range(N+1)]);Ua=h*U+KU
 B=(U*(wh*h))@U.T;bc=U@(wh*h*q);gamma=np.linalg.solve(B,bc);err=q-gamma@U
 Ep=2*np.dot(wh*h,err*(qa-gamma@Ua));Ep_pos=2*np.dot(wh*h*h,err*err);Ldot=deltap-Ep_pos
 roots=np.sqrt(ss[:N+1]);p=Ts[N+1].deriv()/roots[N];dd=np.zeros(N+1)
 for j in range(N,-1,-1):dd[j]=(p.coef[j] if len(p.coef)>j else 0)*roots[j];p=p-dd[j]*Ts[j]/roots[j]
 kap0=4*N+np.dot(dd[:-1],dd[:-1]);M=np.dot(wh*h,F*F);lower=2*(Ldot-f)-kap0*M
 rows.append(dict(N=N,design_size=N+1,error_derivative=Ep,positive_error_formula=Ep_pos,relative_identity_error=abs(Ep-Ep_pos)/max(1,abs(Ep)),Ldot=Ldot,actual_drift_cost=f,modular_cost=kap0*M,payment_lower=lower,payment_lower_over_current_pivot=lower/ss[N],positive_parent_condition=np.linalg.cond(B)))
print(json.dumps(dict(scope='Floating normalized original theta, verified finite rungs only; no interval/full-tail certification',rows=rows),indent=2))
