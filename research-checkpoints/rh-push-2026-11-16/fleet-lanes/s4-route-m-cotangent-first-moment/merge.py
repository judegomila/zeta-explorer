# sum the slices of mode T and cross-check against the unsliced run at B = 3e5 made on another machine (Mac, clang)
import numpy as np, sys, os
B=int(sys.argv[1]); n=int(sys.argv[2])
tot=np.zeros(4*(B+1))
for k in range(n): tot+=np.fromfile("out/zt%d_tree_%d_%d.bin"%(B,k,n))
tot.tofile("out/zt%d_all.bin"%B)
S,Sa,Q,M=tot.reshape(4,B+1)
if os.path.exists("loc/z3e5_tree_0_1.bin"):
    l=np.fromfile("loc/z3e5_tree_0_1.bin").reshape(4,-1); L=l.shape[1]-1
    m=np.arange(3,L); print("M(a), a < %d: max relative difference, server (%d slices, B=%d) vs local (B=%d): %.2e"%(L,n,B,L,np.max(np.abs(M[m]-l[3][m])/l[3][m])))
    m=np.arange(5,L+1); print("S(b), b <= %d: %.2e ; Q(b): %.2e ; sum|V|: %.2e"%(L,np.max(np.abs(S[m]-l[0][m])/np.abs(l[0][m])),np.max(np.abs(Q[m]-l[2][m])/l[2][m]),np.max(np.abs(Sa[m]-l[1][m])/l[1][m])))
