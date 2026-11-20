# Physical-coordinate (x-space) float Nystrom of the odd half-line kernel H_-(x,y), alpha=1, cutoff at 0.
# H_0(u,v) = 2 int_{|m|}^inf t k(t-d) k(t+d) dt, m=(u+v)/2, d=(u-v)/2 ; H_- = H_0(x,y)-H_0(x,-y).
import numpy as np, sys, json
def kern(kind):
    if kind == 'xi':
        def k(u):
            u = np.abs(u); e = np.exp(u); out = 0
            for n in range(1, 7):
                out = out + np.pi*n*n*(2*np.pi*n*n*e-3)*np.exp(1.25*u-np.pi*n*n*e)
            return out
    elif kind == 'dh':
        kp = (np.sqrt(10-2*np.sqrt(5))-2)/(np.sqrt(5)-1); a = [0, 1, kp, -kp, -1, 0]
        def k(u):
            u = np.abs(u); e = np.exp(u); out = 0
            for n in range(1, 40):
                if a[n % 5] == 0: continue
                out = out + a[n % 5]*n*np.exp(0.75*u-np.pi*n*n*e/5)
            return np.sqrt(np.pi/5)*out
    elif kind == 'cx':   # PR56 comparison kernel with a negative odd test
        def k(u): return (1+u*u/10+u**4/300)*np.exp(-u*u)
    return k
gx, gw = np.polynomial.legendre.leggauss(400)
def H0(k, u, v, R):
    m = (u+v)/2; d = (u-v)/2; lo = np.abs(m)
    t = lo[..., None] + (gx+1)/2*R; w = gw/2*R
    return 2*np.sum(w*t*k(t-d[..., None])*k(t+d[..., None]), axis=-1)
def Hminus(k, x, y, R):
    X, Y = np.meshgrid(x, y, indexing='ij')
    return H0(k, X, Y, R) - H0(k, X, -Y, R)
if __name__ == '__main__':
    kind = sys.argv[1]; N = int(sys.argv[2]); Xmax = float(sys.argv[3]); R = float(sys.argv[4])
    k = kern(kind)
    nx, nw = np.polynomial.legendre.leggauss(N); x = (nx+1)/2*Xmax; w = nw/2*Xmax
    H = Hminus(k, x, x, R)
    print('min entry', H.min(), 'max', H.max())
    A = np.sqrt(w)[:, None]*H*np.sqrt(w)[None, :]
    E, V = np.linalg.eigh(A); o = np.argsort(-E); E = E[o]; V = V[:, o]
    print('top eig', E[:10]); print('min eig', E[-1])
    for r in range(8):
        v = V[:, r]/np.sqrt(w); mx = np.abs(v).max(); s = v[np.abs(v) > 1e-6*mx]
        print('eigfn', r+1, 'sign changes', int(np.sum(s[:-1]*s[1:] < 0)), 'x of max', x[np.argmax(np.abs(v))])
