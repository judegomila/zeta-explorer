"""Combination 3: Toeplitz compression H_{h,m} = (q_|i-j|) of the box functional Psi_F on m cells of width h = W/m,
q_0 = 2 Psi(h)/h, q_d = [Psi((d+1)h) - 2 Psi(dh) + Psi((d-1)h)]/h, for zeta, Dirichlet L and controls with their own Psi.
Psi values in Arb (ball arithmetic); eigenvalues in float64 (screen); negative values re-checked by an Arb Rayleigh quotient
on the float eigenvector (rigorous upper bound for lambda_min); positive values re-checked by Arb Cholesky for small m.
Network decomposition Q = B - C (B, C >= 0) and gain ratio G(eps) = lambda_max(C, B + eps I).
usage: python toep.py scan|big|gain ... (see main)"""
import sys, os, json, math, time, bisect
import numpy as np
import scipy.linalg as sla
from flint import arb, acb, ctx, fmpz_poly, arb_mat
import lib
ctx.prec = 200

def A(x): return arb(x)
def _pi(): return arb.pi()
PI = arb.pi()
def trigamma(c): return arb(2).zeta(c)
def bridge_arb(spec, shift=None):
    kind = spec[0]
    if kind == 'zeta': cs = [A(1)/4]; poles = [(A(1)/2, A(8))]; d = 1; N = 1
    elif kind == 'even': cs = [A(1)/4]; poles = []; d = 1; N = spec[1]
    elif kind == 'odd': cs = [A(3)/4]; poles = []; d = 1; N = spec[1]
    else:
        a = arb(str(spec[1])); cs = [A(1)/4 + a/2, A(1)/4 - a/2]; d = 2; N = 1
        poles = [(A(1)/2 - a, 2/(A(1)/2 - a)**2), (A(1)/2 + a, 2/(A(1)/2 + a)**2)]
    A0 = sum((trigamma(c) for c in cs), A(0))/4
    A1 = (A(N).log() - d*arb.pi().log() + sum((c.digamma() for c in cs), A(0)))/2
    if shift is not None: A1 = A1 + shift
    return dict(A0=A0, A1=A1, cs=[2*c for c in cs], poles=poles)

def U_arb(al, r):
    """sum_{k>=0} exp(-(2k+al) r)/(2k+al)^2 with a rigorous tail (r > 0)"""
    K = int((ctx.prec*0.6931 + 10)/(2*float(r))) + 2
    e2 = (-2*r).exp(); t = (-al*r).exp(); s = A(0)
    for k in range(K):
        d = 2*k + al; s += t/(d*d); t *= e2
    tail = t/((2*K + al)**2*(1 - e2))
    return s + arb(0, 1.01*float(tail.upper()))

def obj_spec(name):
    o = [x for x in lib.OBJ if x['name'] == name]
    if name == 'DH': return dict(name='DH', br=('odd', 5))
    if name.startswith('TNR') and not o:   # TNR<q>_<c>[zb]
        zb = name.endswith('zb'); q0, c = name[3:].replace('zb', '').split('_')
        return dict(name=name, br=('zeta',), tnr=(int(q0), float(c)), own=not zb, amp=lambda p, k: 1.0)
    return o[0]

def weights_arb(o, nmax):
    """sorted [(n, w)] with w = c(n) n^{-1/2} as arb"""
    name = o['name']
    if name == 'DH':
        if nmax <= 4000:   # exact Dirichlet inversion in Arb
            s5 = A(5).sqrt(); xi = ((10 - 2*s5).sqrt() - 2)/(s5 - 1); a5 = [A(0), A(1), xi, -xi, A(-1)]
            N = int(nmax); b = [A(0)]*(N + 1); b[1] = A(1)
            for m in range(1, N//2 + 1):
                for k in range(2, N//m + 1):
                    if k % 5: b[k*m] = b[k*m] - a5[k % 5]*b[m]
            lam = [A(0)]*(N + 1)
            for d in range(2, N + 1):
                if d % 5:
                    c = a5[d % 5]*A(d).log()
                    for m in range(1, N//d + 1): lam[d*m] = lam[d*m] + c*b[m]
            return [(n, lam[n]/A(n).sqrt()) for n in range(2, N + 1) if n % 5 or True]
        lam = lib.dh_lambda(int(nmax)); n = np.nonzero(lam)[0]
        return [(int(k), arb(float(lam[k]))/A(int(k)).sqrt()) for k in n]
    out = []
    for q, p, k in lib.prime_powers(int(nmax)):
        lp = A(p).log(); base = lp/(A(p)**k).sqrt()
        if name in ('zeta',) or name.startswith('TNR'): amp = A(1)
        elif name == 'L_chi-4': amp = A(lib.chi4(p)**k)
        elif name == 'L_chi5': amp = A(lib.chi5(p)**k)
        elif name == 'liouville': amp = A((-1)**k)
        elif name == 'randsign': amp = A((1 if lib.hash_u(p, 1) < 0.5 else -1)**k)
        elif name == 'flip10': amp = A((-1 if lib.hash_u(p, 2) < 0.1 else 1)**k)
        elif name.startswith('unimod'): amp = (arb(str(float(name[6:])))*k*lp).cos()
        elif name.startswith('Ea'): amp = 2*(arb(name[2:])*k*lp).cosh()
        else: raise ValueError(name)
        w = amp*base
        if 'tnr' in o and p == o['tnr'][0]:
            c = arb(str(o['tnr'][1])); disc = (c*c - 4).sqrt(); r1 = (-c + disc)/2; r2 = (-c - disc)/2
            w = w - lp*(r1**k + r2**k)
        if not (w == 0): out.append((q, w))
    return out

class Obj:
    def __init__(self, name, nmax):
        self.o = obj_spec(name); self.name = name
        shift = A(self.o['tnr'][0]).log() if (self.o.get('own') and 'tnr' in self.o) else None
        self.br = bridge_arb(self.o['br'], shift)
        ws = weights_arb(self.o, nmax); self.nmax = nmax
        self.logn = [math.log(n) for n, w in ws]; self.ns = [n for n, w in ws]
        # prefix sums split by sign: S+, J+, S-, J-
        self.pre = []
        Sp = Jp = Sm = Jm = A(0); self.pre.append((Sp, Jp, Sm, Jm))
        for n, w in ws:
            ln = A(n).log()
            if w > 0: Sp = Sp + w; Jp = Jp + w*ln
            else: Sm = Sm - w; Jm = Jm - w*ln
            self.pre.append((Sp, Jp, Sm, Jm))
    def pieces(self, W, m):
        """arb lists over mesh d = 0..m: Phi_arch (A0 - sum U), Phi_pole, Phi_plus, Phi_minus; and kappa0 = 2 A1"""
        assert math.exp(float(W)) <= self.nmax*(1 + 1e-12), 'coefficient table too short'
        h = W/m; arch = [A(0)]; pole = [A(0)]; pp = [A(0)]; pm = [A(0)]
        for d in range(1, m + 1):
            r = h*d
            v = self.br['A0']
            for al in self.br['cs']: v = v - U_arb(al, r)
            arch.append(v)
            v = A(0)
            for kap, P in self.br['poles']: v = v + P*((kap*r).cosh() - 1)
            pole.append(v)
            k = bisect.bisect_right(self.logn, float(r))
            # guard ties: move k so that log n_k <= r rigorously where decidable
            while k > 0 and (A(self.ns[k-1]).log() > r): k -= 1
            while k < len(self.ns) and (A(self.ns[k]).log() < r): k += 1
            Sp, Jp, Sm, Jm = self.pre[k]
            pp.append(Sp*r - Jp); pm.append(Sm*r - Jm)
        return dict(h=h, arch=arch, pole=pole, pp=pp, pm=pm, k0=2*self.br['A1'])

def qvec(phi, h):
    """Toeplitz first row from a box function Phi (arb list, Phi(0)=0)"""
    m = len(phi) - 1
    q = [2*phi[1]/h]
    for d in range(1, m): q.append((phi[d+1] - 2*phi[d] + phi[d-1])/h)
    return q
def psi_q(pc):
    m = len(pc['arch']) - 1; h = pc['h']
    qa, qo, qp, qm = (qvec(pc[k], h) for k in ('arch', 'pole', 'pp', 'pm'))
    q = [qa[d] + qo[d] - qp[d] + qm[d] for d in range(m)]; q[0] = q[0] + pc['k0']
    return q, (qa, qo, qp, qm)
def fl(v): return np.array([float(x.mid()) for x in v])

def sectors(q):
    m = len(q); n = m//2; i = np.arange(n)
    T = q[np.abs(i[:, None] - i[None, :])]; X = q[m - 1 - i[:, None] - i[None, :]]
    return T + X, T - X
def lam_min(q, want_vec=True, gpu=False):
    """float64 lowest eigenvalue of the m x m symmetric Toeplitz matrix (m even) through the even/odd sectors"""
    out = []
    for sec, Mx in zip(('even', 'odd'), sectors(q)):
        if gpu:
            import cupy as cp
            w, v = cp.linalg.eigh(cp.asarray(Mx)); w = cp.asnumpy(w[:1]); v = cp.asnumpy(v[:, :1])
        else:
            w, v = sla.eigh(Mx, subset_by_index=[0, 0])
        out.append((float(w[0]), sec, v[:, 0]))
    out.sort(key=lambda t: t[0]); lam, sec, u = out[0]
    m = len(q); vec = np.concatenate([u, (u if sec == 'even' else -u)[::-1]])/math.sqrt(2)
    return lam, sec, vec, {s: l for l, s, _ in out}

def rayleigh_arb(qarb, vec):
    """rigorous enclosure of v^T H v / v^T v for the integer vector round(vec 2^50); q as arb"""
    V = [int(round(float(x)*2**50)) for x in vec]; m = len(V)
    P = fmpz_poly(V); Pr = fmpz_poly(V[::-1]); R = P*Pr
    r = [int(R[m - 1 + d]) for d in range(m)]
    s = qarb[0]*r[0]
    for d in range(1, m): s = s + 2*qarb[d]*r[d]
    return s/r[0]

def chol_arb(qarb, shift=0):
    """Arb LDL^T of both sector matrices of H - shift; True if every pivot is certainly positive (certified positive definite)"""
    m = len(qarb); n = m//2
    for sgn in (1, -1):
        Lr = [[None]*n for _ in range(n)]; D = [None]*n
        for j in range(n):
            # row j of the sector matrix, columns <= j
            v = [qarb[abs(j - k)] + sgn*qarb[m - 1 - j - k] for k in range(j + 1)]
            v[j] = v[j] - shift
            Lj = Lr[j]
            for k in range(j):
                s_ = v[k]; Lk = Lr[k]
                for t in range(k): s_ = s_ - Lj[t]*Lk[t]*D[t]
                Lj[k] = s_/D[k]
            d = v[j]
            for t in range(j): d = d - Lj[t]*Lj[t]*D[t]
            if not (d > 0): return False
            D[j] = d
    return True

def network(pc):
    """float64 B, C (PSD) with H = B - C on the cell basis; pieces from Obj.pieces"""
    q, (qa, qo, qp, qm) = psi_q(pc); m = len(q); i = np.arange(m); D = np.abs(i[:, None] - i[None, :])
    qa, qo, qp, qm = fl(qa), fl(qo), fl(qp), fl(qm)
    Ta = qa[D]; Tp = qp[D]; Tm = qm[D]; Tpole = qo[D]
    k0 = float(pc['k0'].mid())
    # arch: off-diagonal entries are <= 0: Laplacian of -offdiag plus row-sum diagonal
    B = Ta.copy(); C = np.zeros((m, m))
    if k0 >= 0: B += k0*np.eye(m)
    else: C += -k0*np.eye(m)
    # pole: T_pole = positive part - negative part by eigen-decomposition (rank two for zeta)
    if np.abs(Tpole).max() > 0:
        w, v = np.linalg.eigh(Tpole); B += (v*np.maximum(w, 0)) @ v.T; C += (v*np.maximum(-w, 0)) @ v.T
    # primes with positive weight: -T+ = (Deg - T+) - Deg ; negative weight: +T- = (Deg + T-) - Deg
    B += np.diag(Tp.sum(1)) - Tp; C += np.diag(Tp.sum(1))
    B += np.diag(Tm.sum(1)) + Tm; C += np.diag(Tm.sum(1))
    return B, C, fl(q), dict(arch_rowsum_min=float(Ta.sum(1).min()), arch_offdiag_max=float((Ta - np.diag(np.diag(Ta))).max()))
def gain(B, C, eps):
    w = sla.eigh(C, B + eps*np.eye(len(B)), eigvals_only=True, subset_by_index=[len(B)-1, len(B)-1])
    return float(w[0])

def evaluate(ob, W, m, gpu=False, arbcheck=True, cholmax=512):
    t0 = time.time(); pc = ob.pieces(arb(str(W)) if not isinstance(W, arb) else W, m); q, _ = psi_q(pc); qf = fl(q)
    lam, sec, vec, both = lam_min(qf, gpu=gpu)
    rec = dict(obj=ob.name, W=float(W), m=m, h=float(W)/m, lam_min=lam, sector=sec, lam_even=both['even'], lam_odd=both['odd'], q0=float(qf[0]),
               qrad=float(max(float(x.rad()) for x in q)))
    if arbcheck and lam < 0:
        rq = rayleigh_arb(q, vec); rec['rayleigh_arb_upper'] = float(rq.upper()); rec['rayleigh_arb_mid'] = float(rq.mid()); rec['certified_negative'] = bool(rq < 0)
    if arbcheck and lam > 0 and m <= min(cholmax, 128):
        rec['certified_positive_arb_cholesky'] = chol_arb(q)
    rec['sec'] = round(time.time() - t0, 1)
    return rec, pc

def onset(ob, m, Wlo, Whi, step, tol=0.004, gpu=False, log=None):
    """first W on the grid Wlo + k step with lambda_min < 0, then bisection (float64 screen)"""
    W = Wlo; prev = None; rows = []
    while W <= Whi + 1e-12:
        rec, _ = evaluate(ob, round(W, 6), m, gpu=gpu, arbcheck=False); rows.append(rec)
        if log: log(rec)
        if rec['lam_min'] < 0: break
        prev = W; W += step
    else:
        return None, rows
    if prev is None: return (None, W), rows
    a, b = prev, W
    while b - a > tol:
        c = round((a + b)/2, 6); rec, _ = evaluate(ob, c, m, gpu=gpu, arbcheck=False); rows.append(rec)
        if log: log(rec)
        if rec['lam_min'] < 0: b = c
        else: a = c
    return (a, b), rows

if __name__ == '__main__':
    mode = sys.argv[1]; out = sys.argv[2]
    f = open(out, 'a')
    def log(rec):
        f.write(json.dumps(rec) + '\n'); f.flush(); print(json.dumps(rec), flush=True)
    gpu = os.environ.get('TOEP_GPU', '0') == '1'
    if gpu:
        import cupy as cp
        cp.get_default_memory_pool().set_limit(size=20*1024**3)
    if mode == 'onset':      # onset <out> m Whi step names...
        m = int(sys.argv[3]); Whi = float(sys.argv[4]); step = float(sys.argv[5])
        for name in sys.argv[6:]:
            ob = Obj(name, math.exp(Whi)*1.001 + 3)
            br, rows = onset(ob, m, step, Whi, step, gpu=gpu, log=None)
            rec = dict(kind='onset', obj=name, m=m, Whi=Whi, bracket=br, lam_at_Whi=rows[-1]['lam_min'] if br is None else None,
                       min_lam_seen=min(r['lam_min'] for r in rows), scan=[(r['W'], r['lam_min'], r['sector']) for r in rows])
            if br is not None and br[0] is not None:   # certify the negative end in Arb, the positive end by Arb Cholesky when small
                r2, _ = evaluate(ob, br[1], m, gpu=gpu, cholmax=0); rec['neg_end'] = r2
                if m <= 512: r1, _ = evaluate(ob, br[0], m, gpu=gpu); rec['pos_end'] = r1
            log(rec)
    elif mode == 'cert':     # cert <out> m W names...   Arb LDL^T positivity certificate (m <= 256 recommended)
        m = int(sys.argv[3]); W = float(sys.argv[4]); ctx.prec = 300 + 4*(m//2)     # interval LDL loses about 1.6 bits per pivot
        PI = arb.pi()
        for name in sys.argv[5:]:
            ob = Obj(name, math.exp(W)*1.001 + 3); t0 = time.time(); pc = ob.pieces(arb(str(W)), m); q, _ = psi_q(pc)
            lam = lam_min(fl(q))[0]; ok = chol_arb(q)
            log(dict(kind='cert', obj=name, m=m, W=W, lam_min_float=lam, certified_positive_arb_ldl=ok, prec_bits=ctx.prec, sec=round(time.time() - t0, 1)))
    elif mode == 'point':    # point <out> m W names...   (single evaluations, Arb re-check)
        m = int(sys.argv[3]); W = float(sys.argv[4])
        for name in sys.argv[5:]:
            ob = Obj(name, math.exp(W)*1.001 + 3); rec, _ = evaluate(ob, W, m, gpu=gpu); rec['kind'] = 'point'; log(rec)
    elif mode == 'gain':     # gain <out> m W names...
        m = int(sys.argv[3]); W = float(sys.argv[4])
        for name in sys.argv[5:]:
            ob = Obj(name, math.exp(W)*1.001 + 3); pc = ob.pieces(arb(str(W)), m); B, C, qf, info = network(pc)
            i = np.arange(m); H = qf[np.abs(i[:, None] - i[None, :])]
            rec = dict(kind='gain', obj=name, m=m, W=W, lam_min=float(sla.eigvalsh(H, subset_by_index=[0, 0])[0]), decomposition_error=float(np.abs(B - C - H).max()),
                       lamB_min=float(sla.eigvalsh(B, subset_by_index=[0, 0])[0]), lamC_min=float(sla.eigvalsh(C, subset_by_index=[0, 0])[0]), **info)
            for eps in (1e-2, 1e-4, 1e-6): rec['G_%g' % eps] = gain(B, C, eps)
            log(rec)
