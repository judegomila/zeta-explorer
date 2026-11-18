import numpy as np, sys, math
lo, hi = float(sys.argv[1]), float(sys.argv[2])
for f in sys.argv[3:]:
    d=np.load(f); Np=d['Np']; R=int(d['R']); sel=np.where((Np>=lo)&(Np<=hi))[0]; n=len(sel)
    print(f, 'R',R,'marks',n, 'MP',(1+math.sqrt(n/R))**2)
    for nm in ['Ap','R','K4a','A','Q','QR','T6','K']:
        if 'G_'+nm not in d.files: continue
        G=d['G_'+nm][np.ix_(sel,sel)]; g=np.real(np.diag(G)); Gn=G/np.sqrt(np.outer(g,g))
        w,v=np.linalg.eigh(Gn); off=np.abs(Gn-np.eye(n)); iu=np.triu_indices(n,1)
        vv=np.abs(v[:,-1]); sl=np.polyfit(np.log(Np[sel]),np.log(vv),1)[0]
        print(f'  {nm:4s} lam_max={w[-1]:.4f} lam2={w[-2]:.4f} off_rms*sqrtR={np.sqrt((off[iu]**2).mean())*math.sqrt(R):.3f} topvec slope in N: {sl:+.2f}  ones-form/n={np.real(np.ones(n)@Gn@np.ones(n))/n:.4f}')
