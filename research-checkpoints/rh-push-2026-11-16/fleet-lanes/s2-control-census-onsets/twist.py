# Combination 3: quadratic-twist families F x chi_d, d fundamental, |d| <= DMAX.
#   zeta family: L(s, chi_d).   arm family: L(s, chi5 chi_d), chi5 the quartic character mod 5 with chi5(2) = i (Euler product).
#   DH family: F_d(s) = sum a_DH(n) chi_d(n) n^{-s} = (1/2)[c0 L(s, chi5 chi_d) + conj(c0) L(s, conj(chi5) chi_d)], c0 = 1 - i kappa.
# Completed functions by the theta integral (float64):
#   Lambda(s,psi) = (q/pi)^{(s+dl)/2} Gamma((s+dl)/2) L(s,psi) = int_1^inf [theta(y) y^{(s+dl)/2} + eps conj(theta(y)) y^{(1-s+dl)/2}] dy/y,
#   theta(y) = sum psi(n) n^dl exp(-pi n^2 y/q).
# For each d: all zeros of the completed function in the box |Re z| <= T1, |Im z| <= Y (s = 1/2 + i z) by winding number + Newton,
# and the explicit-formula balance with the Gaussian pair h(t) = exp(-t^2/(2 TAU^2)), g(x) = TAU/sqrt(2pi) exp(-TAU^2 x^2/2).
import sys, os, json, math, time, cmath
for _k in ('VECLIB_MAXIMUM_THREADS', 'OMP_NUM_THREADS', 'OPENBLAS_NUM_THREADS', 'MKL_NUM_THREADS'): os.environ[_k] = '1'
import numpy as np
from numpy.polynomial.legendre import leggauss
from scipy.special import digamma
KAPPA = (math.sqrt(10 - 2*math.sqrt(5)) - 2)/(math.sqrt(5) - 1)
C0 = complex(1, -KAPPA)
CHI5 = np.array([0, 1, 1j, -1j, -1])
TAU5 = sum(CHI5[a]*cmath.exp(2j*math.pi*a/5) for a in range(5))
T1 = float(os.environ.get('T1', 2.5)); YB = 1.25; SG = float(os.environ.get('SG', 0.15))
NPAN = int(os.environ.get('NPAN', 10)); NGL = int(os.environ.get('NGL', 20))

def fund_discs(D):
    def sqfree(m):
        m = abs(m); p = 2
        while p*p <= m:
            if m % (p*p) == 0: return False
            p += 1
        return True
    out = []
    for d in range(-D, D + 1):
        if d in (0, 1): continue
        if d % 4 == 1 and sqfree(d): out.append(d)
        elif d % 4 == 0 and (d//4) % 4 in (2, 3) and sqfree(d//4): out.append(d)
    return out

def kron_table(ds, nmax):
    """chi_d(n), n = 0..nmax, for an array of fundamental discriminants (int8, len(ds) x (nmax+1))."""
    ds = np.asarray(ds, dtype=np.int64); X = np.zeros((len(ds), nmax + 1), dtype=np.int8); X[:, 1] = 1
    spf = np.zeros(nmax + 1, dtype=np.int64)
    for p in range(2, nmax + 1):
        if spf[p] == 0: spf[p::p] = np.where(spf[p::p] == 0, p, spf[p::p])
    for n in range(2, nmax + 1):
        p = int(spf[n])
        if p == n:
            if p == 2:
                r = ds % 8; X[:, 2] = np.where(ds % 2 == 0, 0, np.where((r == 1) | (r == 7), 1, -1))
            else:
                tb = -np.ones(p, dtype=np.int8); tb[(np.arange(p)**2) % p] = 1; tb[0] = 0; X[:, p] = tb[ds % p]
        else: X[:, n] = X[:, p]*X[:, n//p]
    return X

class Obj:
    """completed function of one family member; F(s) for complex arrays s."""
    def __init__(self, fam, d, chid):
        self.fam = fam; self.d = d
        if fam == 'zeta':
            q = abs(d); dl = 0 if d > 0 else 1; eps = 1.0
        else:
            q = 5*abs(d); dl = 1 if d > 0 else 0
            taud = math.sqrt(abs(d)) if d > 0 else 1j*math.sqrt(abs(d))
            eps = CHI5[abs(d) % 5]*chid[5]*TAU5*taud/((1j)**dl*math.sqrt(q))
        self.q = q; self.dl = dl; self.eps = eps
        U = math.log(46*q/math.pi); xg, wg = leggauss(NGL)
        edges = np.concatenate([np.linspace(0, min(3.0, U/2), NPAN//2 + 1), np.linspace(min(3.0, U/2), U, NPAN - NPAN//2 + 1)[1:]])
        u = np.concatenate([(edges[i] + edges[i+1])/2 + (edges[i+1] - edges[i])/2*xg for i in range(NPAN)])
        w = np.concatenate([(edges[i+1] - edges[i])/2*wg for i in range(NPAN)])
        nmax = int(math.sqrt(14.7*q)) + 2; n = np.arange(1, nmax + 1)
        psi = chid[1:nmax + 1].astype(float) if fam == 'zeta' else chid[1:nmax + 1]*CHI5[n % 5]
        self.psi = psi; self.n = n
        E = np.exp(-math.pi*np.outer(np.exp(u), n.astype(float)**2)/q)
        self.th = E @ (psi*n**dl); self.u = u; self.w = w
        self.a = self.th*w; self.b = eps*np.conj(self.th)*w
    def A(self, s):
        s = np.asarray(s, complex)
        return np.exp(np.outer((s + self.dl)/2, self.u)) @ self.a + np.exp(np.outer((1 - s + self.dl)/2, self.u)) @ self.b
    def F(self, s):
        if self.fam != 'dh': return self.A(s)
        s = np.asarray(s, complex)
        return 0.5*(C0*self.A(s) + np.conj(C0*self.A(np.conj(s))))
    def Fz(self, z): return self.F(0.5 + 1j*np.asarray(z, complex))

def zeros_in_box(o, T, Y, nb=260, gx=101, gy=17):
    wn, found, mx = _zeros_in_box(o, T, Y, nb, gx, gy, [])
    if len(found) != wn: wn, found, mx = _zeros_in_box(o, T, Y, nb, 401, 49, found)
    return wn, found, mx

def _zeros_in_box(o, T, Y, nb, gx, gy, found0):
    """(winding count, zeros z found, max phase step)."""
    for refine in (1, 4):
        m = nb*refine
        t = np.linspace(0, 1, m, endpoint=False)
        path = np.concatenate([-T - 1j*Y + 2*T*t, T - 1j*Y + 2j*Y*t, T + 1j*Y - 2*T*t, -T + 1j*Y - 2j*Y*t])
        v = o.Fz(path); dph = np.angle(np.roll(v, -1)/v); mx = float(np.abs(dph).max())
        if mx < 1.6: break
    wn = int(round(dph.sum()/(2*math.pi)))
    X, Yg = np.meshgrid(np.linspace(-T, T, gx), np.linspace(-Y, Y, gy)); Z = X + 1j*Yg; V = np.abs(o.Fz(Z.ravel())).reshape(Z.shape)
    P = np.pad(V, 1, constant_values=np.inf)
    ismin = np.ones_like(V, bool)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dx or dy: ismin &= V <= P[1 + dy:1 + dy + V.shape[0], 1 + dx:1 + dx + V.shape[1]]
    seeds = Z[ismin]; found = list(found0)
    sc = float(np.median(V))
    for z in seeds:
        ok = False
        for it in range(60):
            h = 1e-5; f0, fp, fm = o.Fz(np.array([z, z + h, z - h])); dv = (fp - fm)/(2*h)
            if dv == 0: break
            st = f0/dv
            if abs(st) > 0.1: st *= 0.1/abs(st)
            z = z - st
            if abs(st) < 1e-11: ok = True; break
        if ok and abs(z.real) <= T and abs(z.imag) <= Y and not any(abs(z - w) < 1e-6 for w in found): found.append(complex(z))
    return wn, found, mx

TAU = float(os.environ.get('TAU', 0.6)); NPR = int(os.environ.get('NPR', 20000))
def prime_side(o, chi_real):
    """sum over zeros of h(gamma), h(t) = exp(-t^2/(2 TAU^2)), from the coefficient side (needs the symmetry s <-> 1-s):
       (1/2pi) int h(t) [log(q/pi) + Re psi(1/4 + dl/2 + it/2)] dt - 2 sum c(n) n^{-1/2} g(log n), g(x) = TAU/sqrt(2pi) exp(-TAU^2 x^2/2)."""
    L = math.log(o.q/math.pi)
    t = np.linspace(-10*TAU, 10*TAU, 4001); h = np.exp(-t*t/(2*TAU*TAU))
    arch = float(np.sum(h*(L + digamma(0.25 + o.dl/2 + 0.5j*t).real))*(t[1] - t[0]))/(2*math.pi)
    n = np.arange(2, NPR + 1); g = TAU/math.sqrt(2*math.pi)*np.exp(-TAU*TAU*np.log(n)**2/2)
    if o.fam == 'dh': coef = CDH[n]*chi_real[n]
    elif o.fam == 'zeta': coef = LAMB[n]*chi_real[n]
    else: coef = LAMB[n]*chi_real[n]*CHI5[n % 5].real
    return arch - 2*float(np.sum(coef*g/np.sqrt(n)))

LAMB = None; CDH = None
def setup(nmax):
    global LAMB, CDH
    import wf
    LAMB = wf.sieve_mangoldt(nmax)[0]
    A = np.array([[0.0, 1.0, KAPPA, -KAPPA, -1.0][n % 5] for n in range(nmax + 1)]); CDH = wf.logderiv_general(A, nmax)

def do_chunk(args):
    fam, ds = args; nmax = max(NPR, int(math.sqrt(14.7*5*max(abs(d) for d in ds))) + 3)
    X = kron_table(ds, nmax); out = []
    for i, d in enumerate(ds):
        if fam != 'zeta' and d % 5 == 0: continue
        try:
            o = Obj(fam, int(d), X[i]); o.psi_real = X[i][1:len(o.n) + 1].astype(float)
            wn, zs, mx = zeros_in_box(o, T1, YB)
            hh = lambda z: cmath.exp(-z*z/(2*TAU*TAU)).real
            T0 = 4*math.pi/math.log(o.q)
            on = [z for z in zs if abs(z.imag) < 1e-6]; off = [z for z in zs if abs(z.imag) >= 1e-6]
            # functional-equation defect on the line: after removing a constant phase the values should be real
            tt = np.linspace(-T1, T1, 41) + 0.0137; v = o.Fz(tt); ph = np.angle(np.sum(v*v))/2
            fe = float(np.abs((v*np.exp(-1j*ph)).imag).max()/np.abs(v).max())
            rec = dict(d=int(d), q=o.q, wn=wn, nf=len(zs), mx=round(mx, 3), on=[round(z.real, 7) for z in on],
                       off=[[round(z.real, 7), round(z.imag, 7)] for z in off], fe=fe,
                       S_on=sum(hh(z.real) for z in on), S_all=sum(hh(z) for z in zs))
            rec['n_off_T0'] = sum(1 for z in off if abs(z.real) <= T0); rec['n_on_T0'] = sum(1 for z in on if abs(z.real) <= T0)
            if fam != 'dh' or fe < 1e-6: rec['P'] = prime_side(o, X[i].astype(float))
            out.append(rec)
        except Exception as e:
            out.append(dict(d=int(d), err=repr(e)))
    return out

if __name__ == '__main__':
    fam = sys.argv[1]; DMAX = int(sys.argv[2]); OUT = sys.argv[3]; W = int(os.environ.get('RH_WORKERS', 2))
    ds = fund_discs(DMAX); setup(max(NPR, int(math.sqrt(14.7*5*DMAX))) + 5)
    if len(sys.argv) > 4: ds = ds[(int(sys.argv[5]) if len(sys.argv) > 5 else 0)::int(sys.argv[4])]
    chunks = [(fam, ds[i:i + 200]) for i in range(0, len(ds), 200)]
    print('%s: %d discriminants, %d chunks, T1=%g SG=%g' % (fam, len(ds), len(chunks), T1, SG), flush=True)
    import multiprocessing as mp
    t0 = time.time()
    with mp.get_context('fork').Pool(W) as pool, open(OUT, 'w') as fo:
        for i, res in enumerate(pool.imap_unordered(do_chunk, chunks)):
            for r in res: fo.write(json.dumps(r) + '\n')
            if i % 20 == 0: print(i, len(chunks), '%.0fs' % (time.time() - t0), flush=True)
    print('done %.0fs' % (time.time() - t0), flush=True)
