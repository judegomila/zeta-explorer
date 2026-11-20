# Combination 2: truncated Hankel operator (H_{a,L} f)(x) = int_0^L h_a(xy) f(y) dy on L^2(0,L)  (Suzuki kernel).
# Log coordinates (unitary): operator on L^2(-l, l), l = log L, kernel K(v+v'), K causal,
#     R(w) = int_0^inf e^{-wu} K(u) du = X(w-a)/X(w+a),   X(w) = completed function at s = 1/2 + w.
# Galerkin in cubic B-splines beta_i(v) = B(v - v_i), v_i = -l + i h, supp B = [0,4h], all supported inside [-l, l]:
#     M_ij = <beta_i, H beta_j> = m(v_i + v_j),  m(u0) = int K(u) B8(u - u0) du,  B8 = B*B,
#     m(u0) = (1/2 pi) int R(c+it) Bhat8(c+it) e^{(c+it) u0} dt,   Bhat8(w) = ((e^{wh}-1)/(wh))^8,
# evaluated by FFT with the aliased sum over J frequency images.  G_ij = <beta_i, beta_j> (banded).
# The spline space is a subspace of L^2(-l,l): max |generalised eigenvalue| is a LOWER bound for ||H_{a,L}||
# (up to float64 error), and is nondecreasing in l and under h -> h/2.
# K on (0, 2l) depends only on Dirichlet coefficients n <= e^{2l} = L^2, so the symbol's arithmetic factor is the
# truncated Dirichlet polynomial of the quotient F(z-a)/F(z+a), z = w + 1/2 (no convergence condition).
import math, os, time
import numpy as np
from scipy.special import loggamma
try:
    import cupy as cp
    if os.environ.get('NOGPU'): raise ImportError
    cp.get_default_memory_pool().set_limit(size=int(float(os.environ.get('GPU_GB', 20))*1024**3))
    cp.zeros(1)
    GPU = True
except Exception:
    cp = None; GPU = False

# ---------- Dirichlet coefficient tools (truncated at N) ----------
def dconv(x, y, N):
    out = np.zeros(N + 1, dtype=np.result_type(x, y))
    for d in range(1, N + 1):
        if x[d] != 0:
            out[d::d] += x[d]*y[1:N//d + 1]
    return out

def dinv(y, N):
    inv = np.zeros(N + 1, dtype=y.dtype); inv[1] = 1.0/y[1]
    for d in range(1, N//2 + 1):
        if inv[d] != 0:
            inv[2*d::d] -= inv[d]*y[2:N//d + 1]/y[1]
    return inv

def periodic(b, N, dtype=np.float64):
    q = len(b); n = np.arange(N + 1)
    out = np.array(b, dtype=dtype)[n % q]; out[0] = 0
    return out

def quotient_coeffs(bn, a, N):
    """Dirichlet coefficients of F(z-a)/F(z+a), F = sum bn(n) n^{-z}."""
    n = np.arange(N + 1, dtype=np.float64); n[0] = 1.0
    return dconv(bn*n**a, dinv(bn*n**(-a), N), N)

def zeta_quot(a, N):
    return quotient_coeffs(np.concatenate([[0.0], np.ones(N)]), a, N)

# ---------- gamma factors (functions of the complex array z = w + 1/2) ----------
def A_zeta(z, a):
    return np.exp(a*math.log(math.pi) + loggamma((z - a)/2) - loggamma((z + a)/2))*(z - a)*(z - a - 1)/((z + a)*(z + a - 1))

def A_F(z, a, q, delta):
    return np.exp(-a*math.log(q/math.pi) + loggamma((z - a + delta)/2) - loggamma((z + a + delta)/2))

# ---------- objects ----------
def make_object(name, a, N):
    """returns (A(z) callable, coefficient array c[0..N], is_real)"""
    import klib
    n = np.arange(N + 1, dtype=np.float64); n[0] = 1.0
    if name == 'zeta':
        return (lambda z: A_zeta(z, a)), zeta_quot(a, N), True
    if name.startswith('chi_real_q'):
        q = int(name.split('q')[1]); b, d = klib.real_char(q)
        return (lambda z: A_F(z, a, q, d)), quotient_coeffs(periodic(b, N), a, N), True
    if name == 'chi5_complex':           # Euler arm of DH: chi mod 5, chi(2) = i
        b = [0, 1, 1j, -1j, -1]
        return (lambda z: A_F(z, a, 5, 1)), quotient_coeffs(periodic(b, N, np.complex128), a, N), False
    if name == 'DH':
        return (lambda z: A_F(z, a, 5, 1)), quotient_coeffs(periodic(klib.DH_B, N), a, N), True
    if name.startswith('twin_'):         # route-44 twin by key
        key = name[5:]
        T = [t for t in klib.twin_table(int(key.split('.')[0][1:]), int(key.split('.')[0][1:])) if t['key'] == key][0]
        return (lambda z: A_F(z, a, T['q'], T['delta'])), quotient_coeffs(periodic(T['b'], N), a, N), True
    if name.startswith('prod_b='):       # zeta(s+b) zeta(s-b): X(w+b) X(w-b)
        b = float(name.split('=')[1])
        c1 = zeta_quot(a, N)
        return (lambda z: A_zeta(z + b, a)*A_zeta(z - b, a)), dconv(c1*n**(-b), c1*n**b, N), True
    if name.startswith('tnr_'):          # T-NR: xi(s)(q^{s-1/2} + q^{1/2-s} + c), name tnr_q3_c2.2
        q = int(name.split('_')[1][1:]); c = float(name.split('_')[2][1:])
        K = int(math.log(N)/math.log(q)) + 1
        P = [1.0, c*q**(0.5 + a), q**(1 + 2*a)]; Q = [1.0, c*q**(0.5 - a), q**(1 - 2*a)]
        e = [0.0]*(K + 1)
        for k in range(K + 1):
            e[k] = (P[k] if k < 3 else 0.0) - sum(Q[j]*e[k - j] for j in (1, 2) if k - j >= 0)
        loc = np.zeros(N + 1)
        for k in range(K + 1):
            if q**k <= N: loc[q**k] = e[k]
        return (lambda z: A_zeta(z, a)*q**(-2*a)), dconv(loc, zeta_quot(a, N), N), True
    if name.startswith('sign_'):         # completely multiplicative +-1 twist of zeta (zeta's gamma factor; no FE)
        kind = name.split('_')[1]
        eps = np.ones(N + 1)
        sieve = np.ones(N + 1, dtype=bool)
        rng = np.random.default_rng(int(kind[4:]) if kind.startswith('seed') else 0)
        for p in range(2, N + 1):
            if sieve[p]:
                sieve[2*p::p] = False
                s = -1.0 if kind == 'liouville' else (1.0 if rng.random() < 0.5 else -1.0)
                if s < 0:
                    pk = p
                    while pk <= N:
                        eps[pk::pk] *= -1.0; pk *= p
        return (lambda z: A_zeta(z, a)), zeta_quot(a, N)*eps, True
    if name.startswith('unimod_alpha='):  # chi(n) = n^{-i alpha}: zeta(s + i alpha) with zeta's unshifted gamma factor
        al = float(name.split('=')[1])
        return (lambda z: A_zeta(z, a)), zeta_quot(a, N)*np.exp(-1j*al*np.log(n)), False
    if name.startswith('heat_tau='):
        return heat_symbol(float(name.split('=')[1]), a), None, True
    raise ValueError(name)

# ---------- Dirichlet polynomial on a vertical line ----------
def dirichlet_poly(c, sigma, t, chunk_bytes=float(os.environ.get('CHUNK_BYTES', 2e9)), log=None):
    """D(sigma + i t_j) = sum_n c(n) n^{-sigma} exp(-i t_j log n)."""
    N = len(c) - 1
    idx = np.nonzero(c[1:])[0] + 1
    amp = c[idx]*idx.astype(np.float64)**(-sigma); ln = np.log(idx.astype(np.float64))
    xp = cp if GPU else np
    tt = xp.asarray(t); out = xp.zeros(len(t), dtype=xp.complex128)
    amp_x = xp.asarray(amp.astype(np.complex128)); ln_x = xp.asarray(ln)
    step = max(1, int(chunk_bytes/(16*3*len(t))))
    t0 = time.time()
    for s in range(0, len(idx), step):
        ph = xp.outer(tt, ln_x[s:s + step])
        out += xp.exp(-1j*ph)@amp_x[s:s + step]
        if log and (s//step) % 200 == 0: log('  dpoly %d/%d %.0fs' % (s, len(idx), time.time() - t0))
    return cp.asnumpy(out) if GPU else out

# ---------- Hankel sequence m(u_k), u_k = -8h + k h, k = 0..nk-1 ----------
def hankel_sequence(Afun, c, a, l, h, cshift=2.0, J=12, guard=10.0, log=None):
    nk = int(round(2*l/h)) + 9
    Nf = 1
    while Nf*h < 2*l + 8*h + guard: Nf *= 2
    P = Nf*h; dt = 2*math.pi/P
    jmax = J*Nf//2
    j = np.arange(-jmax, jmax)
    t = j*dt
    w = cshift + 1j*t
    z = w + 0.5
    if log: log('  Nf=%d P=%.3f Nt=%d' % (Nf, P, len(t)) + ('' if c is None else ' N=%d planned work %.2e complex exps' % (len(c) - 1, len(t)*(len(c) - 1))))
    if c is None:
        R = Afun(cshift, j, dt)          # direct symbol on the line (no Dirichlet structure)
    else:
        D = dirichlet_poly(c, cshift + 0.5, t, log=log)
        R = Afun(z)*D
    wh = w*h
    Bh = (np.expm1(wh)/wh)**8
    ustart = -8*h
    g = R*Bh*np.exp(1j*t*ustart)
    fold = np.zeros(Nf, dtype=np.complex128)
    np.add.at(fold, j % Nf, g)
    m = np.fft.ifft(fold)*Nf*dt/(2*math.pi)
    k = np.arange(nk)
    u = ustart + k*h
    return u, m[:nk]*np.exp(cshift*u), {'Nf': Nf, 'Nt': len(t), 'tmax': float(t[-1]), 'max|R Bh| at band edge / max': float(np.abs(g[:50]).max()/np.abs(g).max())}

N7 = np.array([1, 120, 1191, 2416, 1191, 120, 1], dtype=np.float64)/5040.0   # degree-7 cardinal B-spline at 1..7

def gram_and_M(m, nb, i0, i1, k_of_pair0, real=True):
    """sub-block for basis indices i0..i1-1 (global index i <-> v_i = -l + i h); m index = i + j + k_of_pair0."""
    n = i1 - i0
    idx = (np.arange(i0, i1)[:, None] + np.arange(i0, i1)[None, :]) + k_of_pair0
    M = m[idx]
    M = M.real.copy() if real else M
    G = np.zeros((n, n))
    for d in range(-3, 4):
        G += N7[3 + d]*np.eye(n, k=d)
    return M, G          # both carry a common factor (h for G in physical units; M has the 1/h^0 normalisation below)

def window_norms(m, l, h, windows, real=True, log=None, want_vec=True, tol=1e-7):
    """for each l' in windows: extreme generalised eigenvalues of (M, h*G) on the central block."""
    import scipy.linalg as sla
    Mtot = int(round(2*l/h)); nb = Mtot - 3
    # v_i + v_j = -2l + (i+j) h ; m index k: u_k = -8h + k h  => k = i + j + 8 - 2l/h ; negative k => m = 0
    k0 = 8 - Mtot
    mm = np.concatenate([np.zeros(max(0, -k0) + 1, dtype=m.dtype), m])      # pad so that negative k map to zeros
    off = max(0, -k0) + 1
    out = []
    for lp in windows:
        # basis functions with support [v_i, v_i+4h] inside [-lp, lp]
        i0 = int(math.ceil((l - lp)/h - 1e-9)); i1 = nb - i0
        n = i1 - i0
        if n < 8: continue
        idx = (np.arange(i0, i1)[:, None] + np.arange(i0, i1)[None, :]) + k0 + off
        idx = np.clip(idx, 0, len(mm) - 1)
        M = mm[idx]
        if real: M = np.ascontiguousarray(M.real)
        G = np.zeros((n, n))
        for d in range(-3, 4): G += N7[3 + d]*np.eye(n, k=d)
        G *= h                                   # <beta_i, beta_j> with unit-integral B: (1/h) N7, times h^2?  see note
        # normalisation: B = (1/h) N3(x/h) has integral 1; <B_i,B_j> = (1/h) N7(4+d); M uses the same B. So pencil (M, G/h^2 ... )
        G = G/(h*h)                              # => G = (1/h) N7
        t0 = time.time()
        Lc = np.linalg.cholesky(G)
        Y = sla.solve_triangular(Lc, M, lower=True)
        Aop = sla.solve_triangular(Lc, Y.T, lower=True).T
        freq = None
        if real:
            Aop = 0.5*(Aop + Aop.T)
            if want_vec and lp == windows[-1]:
                ev, V = np.linalg.eigh(Aop)
                kbest = -1 if abs(ev[-1]) >= abs(ev[0]) else 0
                x = sla.solve_triangular(Lc.T, V[:, kbest], lower=False)       # spline coefficients of the top eigenfunction
                xx = np.zeros(8*n); xx[:n] = np.asarray(x, dtype=np.float64) - float(np.mean(x)); sp = np.abs(np.fft.rfft(xx)); kk = int(np.argmax(sp))
                freq = 2*math.pi*kk/(8*n*h)
            elif GPU and n > 3000:
                ev = cp.asnumpy(cp.linalg.eigvalsh(cp.asarray(Aop)))
            else:
                ev = np.linalg.eigvalsh(Aop)
            lam_max, lam_min = float(ev[-1]), float(ev[0]); nrm = max(abs(lam_max), abs(lam_min))
            neg1 = int(np.sum(ev < -1.0 - tol)); pos1 = int(np.sum(ev > 1.0 + tol))
        else:
            if GPU and n > 3000:
                sv = cp.asnumpy(cp.linalg.svd(cp.asarray(Aop), compute_uv=False))
            else:
                sv = np.linalg.svd(Aop, compute_uv=False)
            nrm = float(sv[0]); lam_max = nrm; lam_min = float('nan'); pos1 = int(np.sum(sv > 1.0 + tol)); neg1 = 0
        r = {'l': lp, 'L': math.exp(lp), 'n_basis': n, 'norm_lower': nrm, 'norm_minus_1': nrm - 1.0, 'lam_max': lam_max, 'lam_min': lam_min,
             'n_eig_gt_1+tol': pos1, 'n_eig_lt_-1-tol': neg1, 'top_eigfn_freq': freq}
        out.append(r)
        if log: log('  l=%.4f L=%.4f n=%d norm-1=%+.3e lam_max-1=%+.3e lam_min+1=%+.3e (#>1+tol: %d, #<-1-tol: %d) freq=%s %.0fs' % (lp, r['L'], n, nrm - 1, lam_max - 1, lam_min + 1, pos1, neg1, freq, time.time() - t0))
    return out


# ---------- backward heat deformation of zeta: X_tau(w) = int Phi(u) e^{tau u^2} e^{2wu} du = E_y X(w + i y), y ~ N(0, |tau|/2) ----------
def zeta_em(s, N=30000):
    """zeta(s) for Re s >= 2 by Euler-Maclaurin (complex array s)."""
    xp = cp if GPU else np
    ss = xp.asarray(s); out = xp.zeros(ss.shape, dtype=xp.complex128)
    n = xp.arange(1, N, dtype=xp.float64); ln = xp.log(n)
    step = max(1, int(1.5e9/(48*len(s))))
    for k in range(0, N - 1, step):
        out += xp.exp(-xp.outer(ss, ln[k:k + step])).sum(axis=1)
    lN = math.log(N)
    NS = xp.exp(-ss*lN)
    out += NS*N/(ss - 1) + NS/2 + ss*NS/(12*N) - ss*(ss + 1)*(ss + 2)*NS/(720*N**3)
    return cp.asnumpy(out) if GPU else out

def log_xi_line(cprime, tt):
    """log X(c' + i t) = log xi(1/2 + c' + i t) on an array of t >= 0."""
    s = 0.5 + cprime + 1j*tt
    return np.log(s*(s - 1)/2) - (s/2)*math.log(math.pi) + loggamma(s/2) + np.log(zeta_em(s))

def heat_symbol(tau, a, log=None):
    sig = math.sqrt(abs(tau)/2.0)
    def R(cshift, j, dt):
        mref = max(1, int(math.ceil(dt/(sig/5.0)))); dy = dt/mref
        Kw = int((10*sig + math.pi*sig*sig/2)/dy) + 2
        jmax = int(np.max(np.abs(j)))
        nfine = jmax*mref + Kw + 2
        tf = np.arange(0, nfine + 1)*dy
        vals = {}
        for sgn in (-1, +1):
            LXp = log_xi_line(cshift + sgn*a, tf)
            LX = np.concatenate([np.conj(LXp[:0:-1]), LXp])       # index i <-> t = (i - nfine) dy
            jj = np.arange(0, jmax + 1)*mref + nfine               # t_j >= 0
            base = LX[jj].real
            acc = np.zeros(len(jj), dtype=np.complex128)
            for k in range(-Kw, Kw + 1):
                acc += math.exp(-(k*dy)**2/(2*sig*sig))*np.exp(LX[jj + k] - base)
            acc *= dy/(sig*math.sqrt(2*math.pi))
            vals[sgn] = (acc, base, LX[jj])
        num, bn, _ = vals[-1]; den, bd, _ = vals[+1]
        Rp = num/den*np.exp(bn - bd)                               # t_j >= 0
        out = np.where(j >= 0, Rp[np.abs(j)], np.conj(Rp[np.abs(j)]))
        return out
    return R

def heat_X_direct(tau, w, n=4000):
    """direct quadrature of int Phi e^{tau u^2} e^{2wu} du (float64; small |Im w| only); returns value up to the constant 4."""
    import klib
    u, wt = klib.gl_nodes(n, 0.0, 1.8)
    ph = klib.phi_zeta_np(u)*np.exp(tau*u*u)
    return np.sum(wt*ph*2*np.cosh(2*w*u))*4
