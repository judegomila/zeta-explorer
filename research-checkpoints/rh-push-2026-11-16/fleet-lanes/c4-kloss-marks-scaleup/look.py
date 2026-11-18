import numpy as np, sys
d=np.load(sys.argv[1]); Np=d['Np']; SU=d['SU']; SV=d['SV']; R=int(d['R']); n=len(Np)
print(n,R,Np.astype(int))
for nm in ['Ap','R','K4a','A','Q']:
    if 'G_'+nm not in d.files: continue
    G=d['G_'+nm]; g=np.real(np.diag(G)); Gn=G/np.sqrt(np.outer(g,g)); off=np.abs(Gn-np.eye(n))*np.sqrt(R)
    iu=np.triu_indices(n,1); o=off[iu]; order=np.argsort(-o)[:10]
    print(nm,'rms',np.sqrt((o**2).mean()),'top:',[(int(Np[iu[0][k]]),int(Np[iu[1][k]]),(int(SU[iu[0][k]]),int(SV[iu[0][k]])),(int(SU[iu[1][k]]),int(SV[iu[1][k]])),round(o[k],2)) for k in order])
    w,v=np.linalg.eigh(Gn); print('  top eigs',w[-4:], ' top vec |.|', np.round(np.abs(v[:,-1]),2))
