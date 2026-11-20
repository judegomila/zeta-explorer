exec(open('/workspace/shared/zeta_sphere_campaign/hierarchy/suzuki_v8/block_probe.py').read().split('for w in [.4,.49]:')[0])
for m in [10000,100000,1000000]:
 w=.4;n=100;M=m//n; R=np.log(2)*m/(m-1);dx=R/m;h=R/n;c2=(2**w-2**(-w))/np.sqrt(2)
 Qs=Q(np.arange(m+1)*dx,w)
 def at(idx):return Qs[np.maximum(idx,0)]
 A=np.zeros((n,n));EA=np.zeros((n,n));S=np.zeros((n,n));err2=0
 for row in range(n):
  i=np.arange(row*M,(row+1)*M)[:,None]
  hi=i+(np.arange(n)[None,:]+1)*M-m
  vl=(at(hi)-at(hi-M))/np.sqrt(h)
  vr=(at(hi+1)-at(hi+1-M))/np.sqrt(h)
  ran=abs(vr-vl)
  if row==n-1:
   vr[-1,-1]+=c2*Qs[1]/np.sqrt(h);ran[-1,-1]+=c2*Qs[1]/np.sqrt(h)
  V=(vl+vr)/2
  A[row]=dx/np.sqrt(h)*V.sum(axis=0)
  EA[row]=dx/(2*np.sqrt(h))*ran.sum(axis=0)
  S+=dx*(V.T@V);err2+=dx/4*np.sum(ran**2)
 G=S-A.T@A
 d=2*Q(h,w)+2*h*abs(q(R,w))+2*c2*Q(dx,w)
 eps=np.sqrt(err2)
 ae=np.sqrt(EA.sum(axis=0).max()*EA.sum(axis=1).max())
 rh=np.sqrt(np.abs(G).sum(axis=1).max())
 ge=2*rh*eps+eps**2
 U=(A+A.T)/2+G/(1-d)
 margin=1-eigvalsh(U)[-1]
 print('m',m,'d',d,'epsHS',eps,'Aerr',ae,'resnorm',rh,'Gerr',ge,'rawmargin',margin,'certmargin',margin-ae-ge/(1-d),flush=True)
