# c3-fixedt-growingp-onesided: decisive test. float64 (MEASURED, not interval arithmetic).
# Object: G(P;s) = sum_{p<=P} p^-s + E_1((s-1) log P), s = sigma+it fixed, as a function of P (evaluated at every prime P<=1e7).
# Planned memory: primes<=1e7: 664579 float64 (5 MB); per (t,sigma) a few complex vectors of that length (< 100 MB);
# DH: 4 arrays of 1e7 float64/complex128 (80-160 MB each), < 1.5 GB total.
import numpy as np, mpmath as mp, json, sys, time, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
from scipy.special import exp1
PMAX = 10**7; PMIN = 1000.0
SIG = [0.6, 0.75, 0.9]
HEI = [float(1e3*10**(3*j/39)) for j in range(40)]
mp.mp.dps = 20
def primes_upto(n):
    s = np.ones(n+1, bool); s[:2] = False
    for i in range(2, int(n**0.5)+1):
        if s[i]: s[i*i::i] = False
    return np.nonzero(s)[0]
pi_ = primes_upto(PMAX); ps = pi_.astype(float); lp = np.log(ps); NP = ps.size
print("primes: %d, per-vector %.0f MB complex" % (NP, NP*16/1e6), flush=True)
w0 = int(np.searchsorted(ps, PMIN)); w5 = int(np.searchsorted(ps, 1e5))
def stats(x, lo=w0):
    y = x[lo:]; i = int(np.argmax(y)); j = int(np.argmin(y))
    return dict(sup=float(y[i]), P_sup=float(ps[lo+i]), inf=float(y[j]), P_inf=float(ps[lo+j]), last=float(x[-1]))
def atP(x, P):
    if P > PMAX or P < 2: return None
    return float(x[int(np.searchsorted(ps, P, side='right'))-1])
out = dict(meta=dict(PMAX=PMAX, PMIN=PMIN, sig=SIG, heights=HEI, nprimes=NP), zeta=[], U_far=[], U_near=[], RZ=[], RZ_near=[], DH=[])
T0 = time.time()
# ---------- zeta (Liouville is the exact negative) ----------
for t in HEI:
    for sig in SIG:
        s = complex(sig, t)
        z = np.exp(-s*lp)
        S = np.cumsum(z); L = np.cumsum(-np.log1p(-z))
        E = exp1((s-1)*lp)
        lz = float(mp.log(abs(mp.zeta(mp.mpc(sig, t)))))
        G = (S+E).real; R = (L+E).real
        Hfin = float((L-S).real[-1])
        D = R - lz
        rec = dict(t=t, sigma=sig, log_abs_zeta=lz, ReH=Hfin, target_G=lz-Hfin,
                   G=stats(G), rawS=stats(S.real), D=stats(D), D_1e5=stats(D, w5),
                   D_at_P_eq_t=atP(D, t), D_at_P_eq_sqrt_t=atP(D, t**0.5), D_at_P_eq_t2=atP(D, t*t),
                   scaled_sup_absD=float(np.max(np.abs(D[w0:])*ps[w0:]**(sig-0.5)*lp[w0:])),
                   trivial=float(np.sum(ps**-sig)))
        out['zeta'].append(rec)
    print("zeta t=%.4g done %.0fs" % (t, time.time()-T0), flush=True)
# ---------- U: unimodular twist with a zero at s0 = 0.8 + i t0 ----------
SIG0 = 0.8
eps = np.where(np.arange(NP) % 2 == 0, 1.0, -1.0)
phi = eps*np.arccos(-ps**(SIG0-1.0)); cphi = np.exp(1j*phi)
def U_run(sig, dt):   # dt = t - t0
    s = complex(sig, dt)
    z = cphi*np.exp(-s*lp)
    S = np.cumsum(z); L = np.cumsum(-np.log1p(-z))
    w = (complex(sig-SIG0, dt))*lp
    E = exp1(w) if (dt != 0 or sig > SIG0) else (-np.array([float(mp.ei(-x)) for x in w.real[::1]]) if False else None)
    return S, L, E
from scipy.special import expi
for sig in SIG:
    for dt in [0.0, 0.25, 3.0, -0.25, -3.0]:
        s = complex(sig, dt); z = cphi*np.exp(-s*lp)
        S = np.cumsum(z); L = np.cumsum(-np.log1p(-z))
        x = (sig-SIG0)*lp
        if dt == 0.0 and sig < SIG0: ReE = -expi(-x)           # Re E_1(-y) = -Ei(y), y>0
        else: ReE = exp1(complex(sig-SIG0, dt)*lp).real
        G = S.real; Rn = L.real - ReE      # renormalised: zero factor removed
        out['U_near'].append(dict(sigma=sig, t_minus_t0=dt, G=stats(G), logE=stats(L.real), renorm=stats(Rn), renorm_1e5=stats(Rn, w5),
                                  pred_amp=float(PMAX**(SIG0-sig)/(abs(complex(sig-SIG0, dt))*np.log(PMAX)))))
for t in HEI:
    for sig in SIG:
        dt = t - 20.0
        s = complex(sig, dt); z = cphi*np.exp(-s*lp)
        L = np.cumsum(-np.log1p(-z)); S = np.cumsum(z)
        ReE = exp1(complex(sig-SIG0, dt)*lp).real
        out['U_far'].append(dict(t=t, t0=20.0, sigma=sig, G=stats(S.real), logE=stats(L.real), renorm=stats(L.real-ReE),
                                 logE_1e5=stats(L.real, w5), pred_amp=float(PMAX**(SIG0-sig)/(abs(complex(sig-SIG0, dt))*np.log(PMAX)))))
print("U done %.0fs" % (time.time()-T0), flush=True)
# ---------- RZ_b = 1/zeta(s+1-b), b = 0.93: zero at s = b ----------
B = 0.93
def RZ(sig, t):
    s1 = complex(sig+1-B, t); z = np.exp(-s1*lp)
    S = -np.cumsum(z); L = np.cumsum(np.log1p(-z))
    if t == 0.0 and sig < B: ReE = -expi(-(sig-B)*lp)
    else: ReE = exp1(complex(sig-B, t)*lp).real
    tgt = -float(mp.log(abs(mp.zeta(mp.mpc(sig+1-B, t)))))
    return dict(t=t, sigma=sig, target=tgt, G=stats(S.real), logE=stats(L.real), D_raw=stats(L.real-tgt), D_renorm=stats(L.real-ReE-tgt),
                pred_amp=float(PMAX**(B-sig)/(abs(complex(sig-B, t))*np.log(PMAX))))
for sig in SIG:
    for t in [0.0, 0.25, 3.0]: out['RZ_near'].append(RZ(sig, t))
for t in HEI:
    for sig in SIG: out['RZ'].append(RZ(sig, t))
print("RZ done %.0fs" % (time.time()-T0), flush=True)
json.dump(out, open('onesided_test.partial.json', 'w'))
# ---------- DH: coefficients of log f, f = sum a(n) n^-s, a mod 5 = (0, 1, xi, -xi, -1) ----------
N = PMAX
xi = (np.sqrt(10-2*np.sqrt(5.0))-2)/(np.sqrt(5.0)-1)
per = np.array([0.0, 1.0, xi, -xi, -1.0])
print("DH: planned arrays 3 x %d float64 = %.0f MB, + 2 complex per (t,sigma) = %.0f MB" % (N+1, 3*(N+1)*8/1e6, 2*(N+1)*16/1e6), flush=True)
n = np.arange(N+1); a = per[n % 5]; logn = np.zeros(N+1); logn[1:] = np.log(n[1:].astype(float))
acc = np.zeros(N+1)
for d in range(2, N//2+1):
    ld = a[d]*logn[d] - acc[d]
    if ld != 0.0:
        acc[2*d::d] += ld*a[2:N//d+1]
lam = a*logn - acc; lam[:2] = 0.0
bco = np.zeros(N+1); bco[2:] = lam[2:]/logn[2:]
del acc
print("DH coefficients done %.0fs; max|b(n)|=%.4g, sum|b|n^-1=%.4g, b(2),b(3),b(4),b(6)=%s" % (time.time()-T0, np.max(np.abs(bco)), float(np.sum(np.abs(bco[2:])/n[2:])), bco[[2,3,4,6]].tolist()), flush=True)
# check: exp(sum b(n) n^-s) = f(s) at s = 3
chk = np.exp(np.sum(bco[2:]*n[2:]**-3.0)); fchk = np.sum(a[1:]*n[1:]**-3.0)
print("DH check at s=3: exp(sum b n^-3)=%.15g f(3)=%.15g" % (chk, fchk), flush=True)
def f_DH(s):  # Euler-Maclaurin on each residue class from M = 2e6 blocks (n > 1e7)
    M = N//5   # terms n = 5m + r, m >= M  (n >= N + r > N handled; n <= N summed directly below)
    head = np.sum(a[1:N]*np.exp(-s*logn[1:N]))    # n <= N-1
    tail = 0j
    for r in range(0, 5):
        ar = per[r]
        if ar == 0: continue
        x0 = 5.0*M + r
        g = x0**(-s)
        tl = x0**(1-s)/(5*(s-1)) + 0.5*g
        # - sum B_2k/(2k)! g^(2k-1)(M): g'(M) = -5 s x0^(-s-1); g'''(M) = -125 s(s+1)(s+2) x0^(-s-3)
        tl += (1/12.0)*5*s*x0**(-s-1) - (1/720.0)*125*s*(s+1)*(s+2)*x0**(-s-3) + (1/30240.0)*3125*s*(s+1)*(s+2)*(s+3)*(s+4)*x0**(-s-5)
        tail += ar*tl
    return head + tail
for s in [complex(0.6, 30.0), complex(0.75, 1000.0)]:
    ref = sum(float(c)*mp.zeta(mp.mpc(s), mp.mpf(r)/5) for r, c in zip(range(1, 5), per[1:]))*mp.mpf(5)**(-mp.mpc(s))
    print("DH f check s=%s: EM=%s mp=%s" % (s, f_DH(s), complex(ref)), flush=True)
nn = n[2:].astype(float); lnn = logn[2:]; bb = bco[2:]
i3 = int(np.searchsorted(nn, PMIN)); 
for t in HEI:
    for sig in SIG:
        s = complex(sig, t)
        Gc = np.cumsum(bb*np.exp(-s*lnn)).real
        fv = f_DH(s)
        i = int(np.argmax(Gc[i3:])); j = int(np.argmin(Gc[i3:]))
        cps = {('%g' % P): float(Gc[int(P)-2]) for P in [1e3, 1e4, 1e5, 1e6, 1e7]}
        out['DH'].append(dict(t=t, sigma=sig, log_abs_f=float(np.log(abs(fv))), sup=float(Gc[i3+i]), P_sup=float(nn[i3+i]), inf=float(Gc[i3+j]), P_inf=float(nn[i3+j]), at=cps))
    print("DH t=%.4g done %.0fs" % (t, time.time()-T0), flush=True)
json.dump(out, open('onesided_test.json', 'w'))
print("ALL DONE %.0fs" % (time.time()-T0), flush=True)
