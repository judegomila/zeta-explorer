# analyze2.py : OFFDIAG/DIAG of the character-detection split for the leaf sums (b <= K of the E2 table)
import numpy as np, json, glob, os, math
out=[]
for fn,tag in [('zeta','zeta'),('chi4','chi4'),('chi5','chi5'),('dh','dh')]:
    e2f=f'out/t_{tag}_E2.bin'
    if not os.path.exists(e2f): continue
    E2=np.fromfile(e2f); K=len(E2)-1
    for lf in sorted(glob.glob(f'out/leaf_{tag}_*.bin')):
        b=int(lf.split('_')[-1][:-4])
        if b>K: continue
        va=np.fromfile(lf); a=np.arange(b); ok=np.isfinite(va)&(a>=2)
        cond={'chi4':4,'chi5':5,'dh':5}.get(fn,1)
        if cond>1: ok&=(np.gcd(a,cond)==1)
        M2=float((va[ok]**2/a[ok]).sum()); DIAG=float((a[ok]*E2[a[ok]]).sum())
        out.append({'fn':fn,'b':b,'M2':M2,'DIAG':DIAG,'OFFDIAG_over_DIAG':M2/DIAG-1,'ratio_abs':float(abs(va[ok].sum())/np.abs(va[ok]).sum())})
json.dump(out,open('out/analyze2.json','w'),indent=1); print(json.dumps(out,indent=1))
