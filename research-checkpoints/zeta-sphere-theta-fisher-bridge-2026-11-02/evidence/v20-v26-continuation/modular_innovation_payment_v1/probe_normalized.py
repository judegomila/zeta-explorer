"""Own-source normalized original-theta sanity check; floating only, not a certificate."""
from pathlib import Path
exec((Path(__file__).parent/'probe_payment.py').read_text().split('Fs=[]')[0])
Fs=[];Ds=[];Ks=[];DKs=[];Ts=[];ss=[]
for n in range(maxN+2):
 idx=list(range(n%2,n+1,2));sg=np.array([(-1)**((n-j)//2) for j in idx]);v=psi[idx]*sg[:,None]
 kk=np.array([sg0*j*psi[j-1] if j else np.zeros_like(u) for sg0,j in zip(sg,idx)])
 sc=np.sqrt((v*v)@wt);vs=v/sc[:,None];ks=kk/sc[:,None]
 H=(vs*(wt*2*u*u))@vs.T+(ks*(wt*u))@vs.T+(vs*(wt*u))@ks.T
 co=np.r_[-np.linalg.solve(H[:-1,:-1],H[:-1,-1]),1.];c=co/sc*sc[-1]
 F=c@v;der=sum(cj*sj*psi[j+1] for cj,sj,j in zip(c,sg,idx));K=c@kk;DK=sum(cj*sj*j*psi[j] for cj,sj,j in zip(c,sg,idx))
 T=np.zeros(n+1)
 for cj,sj,j in zip(c,sg,idx):T[j]=cj*sj
 sig=np.dot(wt*u,2*u*F*F+2*F*K)
 Fs.append(F);Ds.append(der);Ks.append(K);DKs.append(DK);Ts.append(Poly(T));ss.append(sig)
rows=[]
for N in [2,4,5]:
 assert min(ss[:N+1])>0
 F=Fs[N][J:];q=Ds[N][J:];KN=Ks[N][J:];DK=DKs[N][J:];qa=h*q+F+DK
 idx=list(range((N+1)%2,N,2));V=np.array([Fs[j][J:]/math.sqrt(ss[j]) for j in idx]);KV=np.array([Ks[j][J:]/math.sqrt(ss[j]) for j in idx]);Va=V*h+KV
 VD=np.array([Ds[j][J:]/math.sqrt(ss[j]) for j in idx]);KVD=np.array([DKs[j][J:]/math.sqrt(ss[j]) for j in idx]);Fa=h*F+KN
 cpre=-(V+h*VD)@(wh*F)
 cppre=-(V+h*VD)@(wh*Fa)-(Va+h*(V+h*VD+KVD))@(wh*F)
 A=(V*(wh*h))@V.T;Ap=(Va*(wh*h))@V.T+(V*(wh*h))@Va.T
 c=V@(wh*h*q);cp=Va@(wh*h*q)+V@(wh*h*qa)
 alpha=np.linalg.solve(A,c);alphap=np.linalg.solve(A,cp-Ap@alpha)
 f=(A@alphap)@np.linalg.solve(Ap,A@alphap)
 deltap=2*np.dot(wh*h,q*qa)-2*cp@alpha+alpha@Ap@alpha
 roots=np.sqrt(ss[:N+1]);p=Ts[N+1].deriv()/roots[N];dd=np.zeros(N+1)
 for j in range(N,-1,-1):
  dd[j]=(p.coef[j] if len(p.coef)>j else 0)*roots[j];p=p-dd[j]*Ts[j]/roots[j]
 kap0=4*N+np.dot(dd[:-1],dd[:-1]);M=np.dot(wh*h,F*F)
 vals=[]
 for powers in [[1],[1,3],[1,3,5]]:
  U=np.vstack([V]+[h**r*F for r in powers]);KU=np.vstack([KV]+[h**r*KN for r in powers]);sc=np.sqrt((U*U)@(wh*h));U=U/sc[:,None];KU=KU/sc[:,None];Ua=h*U+KU
  B=(U*(wh*h))@U.T;bc=U@(wh*h*q);gamma=np.linalg.solve(B,bc)
  err=q-gamma@U;Edotp=2*np.dot(wh*h,err*(qa-gamma@Ua));Ldot=deltap-Edotp
  force=F+DK-gamma@KU
  B0=(U*wh)@U.T;eta=np.linalg.solve(B0,U@(wh*force));res=force-eta@U;cost=np.dot(wh,res*res)
  bpre=np.r_[cpre,[-(r+1)/2*np.dot(wh*h**r,F*F) for r in powers]]/sc
  bppre=np.r_[cppre,[-(r+1)*np.dot(wh*h**r,F*Fa) for r in powers]]/sc
  Bp=(Ua*(wh*h))@U.T+(U*(wh*h))@Ua.T
  Ldotpre=2*bppre@gamma-gamma@Bp@gamma-2*cppre@alpha+alpha@Ap@alpha
  assert abs(Ldotpre-Ldot)<1e-8*max(1,abs(Ldot))
  assert np.max(abs(bpre-bc))<1e-8*max(1,np.max(abs(bc)))
  lower=2*(Ldotpre-f)-cost-kap0*M
  vals.append(dict(powers=powers,Ldot=Ldot,prefix_Ldot=Ldotpre,prefix_Ldot_relative_error=abs(Ldotpre-Ldot)/max(1,abs(Ldot)),error_derivative=Edotp,error_derivative_lower=-.5*cost,forcing_cost=cost,normalized_payment_lower=lower,payment_lower_over_current_pivot=lower/ss[N]))
 rows.append(dict(N=N,sigma_current=ss[N],sigma_next=ss[N+1],innovation_drift_next=2*(deltap-f),identity_relerror=abs(2*(deltap-f)-ss[N+1])/ss[N+1],kappa0=kap0,modular_cost=kap0*M,true_payment_margin=ss[N+1]-kap0*M,tests=vals))
print(json.dumps(dict(scope='Floating normalized-a0 original theta on verified finite rungs only; no interval/full-tail certificate',Q=Q,rows=rows),indent=2))
