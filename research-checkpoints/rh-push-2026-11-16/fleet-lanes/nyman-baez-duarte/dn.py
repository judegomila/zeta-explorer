# d_N(sigma0)^2 = inf_A (1/2pi) int_{Re s=sigma0} |1 - zeta(s) A(s)|^2 |ds|/|s|^2, A = sum_{n<=N} a_n n^-s  (MEASURED)
# versus the Theorem A/A' lower bound built from the first J zero pairs.
import sys, math, numpy as np, mpmath as mp
from flint import acb, ctx
ctx.prec = 80
sigma0 = float(sys.argv[1]); T = float(sys.argv[2]); h = float(sys.argv[3]); J = int(sys.argv[4])
Ns = [4,8,16,32,64,128,256,512] if len(sys.argv)<6 else [int(x) for x in sys.argv[5].split(",")]
npts = int(round(T/h)); npts += npts % 2
t = np.linspace(0, T, npts+1); w = np.full(npts+1, h/3); w[1:-1:2] *= 4; w[2:-1:2] *= 2   # Simpson
zeta = np.empty(npts+1, complex); gc = np.empty(npts+1, complex)
pi = acb.pi()
for i,ti in enumerate(t):
    s = acb(sigma0, float(ti)); zeta[i] = complex(s.zeta()); gc[i] = complex(s.gamma()*(pi*s/2).cos())
s = sigma0 + 1j*t
# ---------- least squares for d_N ----------
Nmax = max(Ns)
sw = np.sqrt(w/np.pi)/np.abs(s)
logn = np.log(np.arange(1, Nmax+1))
B = (sw*zeta)[:,None]*np.exp(-s[:,None]*logn[None,:])
Br = np.vstack([B.real, B.imag]); del B
y = np.concatenate([sw, np.zeros_like(sw)])
z2 = float(mp.zeta(2*sigma0))
n = np.arange(1, Nmax+1)
Q = z2*(np.lcm.outer(n, n).astype(float))**(-2*sigma0)
res = {}
for N in Ns:
    C = np.linalg.cholesky(Q[:N,:N]); e1 = np.zeros(N); e1[0] = 1
    c1 = np.linalg.solve(C, e1); sc = math.sqrt(1/(math.pi*T))
    A_ = np.vstack([Br[:, :N], sc*C.T]); b_ = np.concatenate([y, sc*c1])
    a, *_ = np.linalg.lstsq(A_, b_, rcond=None)
    main = np.sum((Br[:, :N]@a - y)**2)
    tail = (1 - 2*a[0] + a@Q[:N,:N]@a)/(math.pi*T)
    res[N] = (main+tail, main, tail, a[:3])
# ---------- multi-zero lower bound ----------
aa = 2.0
gam = [float(mp.zetazero(j).imag) for j in range(1, J+1)]
rhos = np.array([0.5+1j*g for g in gam] + [0.5-1j*g for g in gam])
tt = np.concatenate([-t[:0:-1], t]); ww = np.concatenate([w[:0:-1], w]); ww[len(t)-1] = w[0]*2 if False else ww[len(t)-1]
# Simpson on [-T,T]: mirror weights; the t=0 node gets w[0] from each side
ww = np.concatenate([w[:0:-1], [2*w[0]], w[1:]])
ss = sigma0 + 1j*tt
gcc = np.concatenate([np.conj(gc[:0:-1]), gc])
Kj = gcc[None,:]*ss[None,:]**2/((ss[None,:]-rhos[:,None])*(ss[None,:]-aa)**3)     # without M^s
G = (Kj*ww[None,:])@np.conj(Kj).T                                                  # G_jk = int K_j conj(K_k) dt
Rj = np.array([complex(acb(r.real, r.imag).gamma()*(pi*acb(r.real, r.imag)/2).cos()) for r in rhos])*rhos/(rhos-aa)**3
def rj(x): return x**2/((x-rhos)*(x-aa)**3)
print("sigma0=%.3f T=%g h=%g J=%d zero pairs" % (sigma0, T, h, J))
print("   N    d_N        d_N*N^(s0-1/2)  tail/d_N^2   LB_1zero   LB_Jzeros   d_N/LB_J   a1,a2,a3")
for N in Ns:
    M = N/(2*math.pi)
    v = M**rhos*Rj + sum(M**(-2*k)*(-1)**k/math.factorial(2*k)*rj(-2.0*k)/(-2*k) for k in range(1, 12))
    # |sum c_j v_j| <= (1/2pi) ||f|| M^s0 sqrt(c^* G^T c)  ->  d_N >= sqrt(2pi) M^-s0 sqrt(v^* conj(G)^-1 v)
    Gc = G   # sup_u |u^*v|^2/(u^*Gu) = v^* G^-1 v, u = conj(c)
    lbJ = math.sqrt(2*math.pi)*M**(-sigma0)*math.sqrt(abs(np.conj(v)@np.linalg.solve(Gc, v)))
    idx = [0, J]; v1 = v[idx]; G1 = Gc[np.ix_(idx, idx)]
    lb1 = math.sqrt(2*math.pi)*M**(-sigma0)*math.sqrt(abs(np.conj(v1)@np.linalg.solve(G1, v1)))
    d2, main, tail, a3 = res[N]; d = math.sqrt(d2)
    print("%4d  %.6f   %.6f       %.3f      %.6f   %.6f    %.3f    %s" % (N, d, d*N**(sigma0-0.5), tail/d2, lb1, lbJ, d/lbJ, np.round(a3, 4)))
print("cond(G) = %.3e" % np.linalg.cond(G))
