# High-precision rerun of the sector sign changes: c*(node set) - 2 for P, K_e = P+B, K_o = P-B.
# The 50-digit run cannot resolve crossings closer to 2 than about 1e-9 (zeta's own normalised
# minimum eigenvalues are 1e-21 .. 1e-37), so the crossing is located in the variable p = -log10(|c|-2).
import mpmath as mp, json, sys
mp.mp.dps = 220
q = int(sys.argv[1]); lq = mp.log(q); half = mp.mpf(1)/2
def Lxi(s): return 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s)
kap = (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1); A5 = [0, 1, kap, -kap, -1]
def dh(s): return 5**(-s)*sum(A5[k]*mp.zeta(s, mp.mpf(k)/5) for k in range(1,5))
def dh1(s): return -mp.log(5)*dh(s) + 5**(-s)*sum(A5[k]*mp.zeta(s, mp.mpf(k)/5, derivative=1) for k in range(1,5))
def LDH(s): return mp.log(5/mp.pi)/2 + mp.digamma((s+1)/2)/2 + dh1(s)/dh(s)
BASE = {'zeta': lambda z: Lxi(half+z), 'DH': lambda z: LDH(half+z), 'symbol': None}
def LD(z, c): return 2*lq*mp.sinh(z*lq)/(2*mp.cosh(z*lq)+c)
def LD1(z, c): return 2*lq**2*(2 + c*mp.cosh(z*lq))/(2*mp.cosh(z*lq)+c)**2
NODES = {'geo7': [mp.mpf('0.6')*mp.mpf('1.3')**k for k in range(7)],
         'lin12': [mp.mpf('0.55')+mp.mpf('0.35')*k for k in range(12)]}
out = {}
for bn, Lb in BASE.items():
    for nn, xs in NODES.items():
        n = len(xs)
        L0 = [Lb(x) if Lb else mp.mpf(0) for x in xs]
        L01 = [mp.diff(Lb, x) if Lb else mp.mpf(0) for x in xs]
        def mineigs(c):
            L = [L0[i] + LD(xs[i], c) for i in range(n)]; L1 = [L01[i] + LD1(xs[i], c) for i in range(n)]
            P = mp.matrix(n, n); B = mp.matrix(n, n)
            for i in range(n):
                for j in range(n):
                    P[i,j] = (L[i]+L[j])/(xs[i]+xs[j]); B[i,j] = -L1[i] if i == j else -(L[i]-L[j])/(xs[i]-xs[j])
            res = []
            for M in (P, P+B, P-B):
                d = [mp.sqrt(abs(M[i,i])) for i in range(n)]
                N = mp.matrix(n, n)
                for i in range(n):
                    for j in range(n): N[i,j] = M[i,j]/(d[i]*d[j])
                res.append(mp.eigsy((N+N.T)/2, eigvals_only=True)[0])
            return res
        rec = {'min_eig_at_c': {str(c): [mp.nstr(v, 6) for v in mineigs(mp.mpf(c))] for c in ('-2.1','-2','-1.9','0','1.9','2','2.1')}}
        for sgn in (1, -1):
            for k, name in enumerate(('P', 'Ke', 'Ko')):
                f = lambda p: mineigs(sgn*(2 + mp.mpf(10)**(-p)))[k]
                a, b = mp.mpf('1.0'), mp.mpf(150)       # |c| - 2 from 1e-1 down to 1e-150
                fa, fb = f(a), f(b)
                if not (fa < 0 and fb > 0):
                    rec['%s%s' % ('+' if sgn > 0 else '-', name)] = 'no bracket: f(|c|-2=1e-1)=%s, f(1e-150)=%s' % (mp.nstr(fa, 4), mp.nstr(fb, 4)); continue
                for _ in range(34):
                    m = (a+b)/2
                    if f(m) < 0: a = m
                    else: b = m
                rec['%s%s' % ('+' if sgn > 0 else '-', name)] = '|c*|-2 = ' + mp.nstr(mp.mpf(10)**(-(a+b)/2), 5)
        out['%s/%s' % (bn, nn)] = rec
        print(bn, nn, rec, flush=True)
json.dump(out, open('sector_hp_q%d.json' % q, 'w'), indent=1)
