# c9: limit step and controls, mpmath. Window Littlewood identity for a function F -> 1 as Re s -> +inf:
#   B_W(F) := (1/2pi) [ int_T^{T+H} log|F(sig+it)| dt - Phi(T) + Phi(T+H) ] = sum_{zeros in box} (beta-sig) - sum_{poles in box} (beta-sig),
#   Phi(T) = int_sig^inf arg F(x+iT) dx  (arg continuous from the right, 0 at +inf).
import mpmath as mp, json, sys, time
mp.mp.dps = 20
SIG = mp.mpf('0.75'); X = mp.mpf(40)
def primes_upto(n):
    s = bytearray([1]) * (n + 1); s[0:2] = b'\0\0'
    for i in range(2, int(n ** 0.5) + 1):
        if s[i]: s[i * i::i] = bytearray(len(s[i * i::i]))
    return [i for i in range(n + 1) if s[i]]
def zeta_ld(s): return mp.zeta(s, derivative=1) / mp.zeta(s)
KAP = (mp.sqrt(10 - 2 * mp.sqrt(5)) - 2) / (mp.sqrt(5) - 1)
CO = [(mp.mpf(1) / 5, 1), (mp.mpf(2) / 5, KAP), (mp.mpf(3) / 5, -KAP), (mp.mpf(4) / 5, -1)]
def dh(s): return 5 ** (-s) * sum(c * mp.zeta(s, a) for a, c in CO)
def dh_ld(s):
    f = sum(c * mp.zeta(s, a) for a, c in CO); fp = sum(c * mp.zeta(s, a, 1) for a, c in CO)
    return fp / f - mp.log(5)
def Phi(ld, F, T, sig=SIG):
    # Phi = (X-sig) arg F(X+iT) - int_sig^X (y-sig) Im (F'/F)(y+iT) dy
    pts = [sig + (X - sig) * mp.mpf(j) / 40 for j in range(41)]
    I = mp.quad(lambda y: (y - sig) * mp.im(ld(mp.mpc(y, T))), pts)
    return (X - sig) * mp.arg(F(mp.mpc(X, T))) - I
def LHS(F, T, H, sig=SIG, step=mp.mpf('0.5')):
    n = int(mp.ceil(H / step)); pts = [T + H * mp.mpf(j) / n for j in range(n + 1)]
    return mp.quad(lambda t: mp.log(abs(F(mp.mpc(sig, t)))), pts)
out = {}; t0 = time.time()
# N6a: zeta, windows without and with the pole
rows = []
for T, H in ((20, 10), (100, 10), (1000, 6), (-3, 6)):
    l = LHS(mp.zeta, mp.mpf(T), mp.mpf(H)); p1 = Phi(zeta_ld, mp.zeta, mp.mpf(T)); p2 = Phi(zeta_ld, mp.zeta, mp.mpf(T + H))
    Bw = (l - p1 + p2) / (2 * mp.pi)
    rows.append({'T': T, 'H': H, 'LHS': float(l), 'Phi(T)': float(p1), 'Phi(T+H)': float(p2), 'B_W': float(Bw)})
    print('N6a zeta window [%g,%g]: LHS %.10f  Phi(T)-Phi(T+H) %.10f  B_W %.3e' % (T, T + H, l, p1 - p2, Bw), flush=True)
out['N6a_zeta'] = rows
# N6b: stage convergence at sigma = 0.75: Phi_P(T) against Phi(T), with and without the pole term
PRS = primes_upto(10 ** 6)
def PhiP(T, P, u=lambda p: 1):
    return float(sum(mp.im(mp.polylog(2, u(p) * mp.mpf(p) ** (-mp.mpc(SIG, T)))) / mp.log(p) for p in PRS if p <= P)) if P <= 10 ** 4 else None
import cmath, math
def PhiP_fast(T, P, sig=0.75):
    tot = 0.0
    for p in PRS:
        if p > P: break
        lp = math.log(p); z = cmath.exp(-(sig + 1j * T) * lp); 
        zk = z; s2 = 0j; k = 1
        while abs(zk) > 1e-18:
            s2 += zk / (k * k); k += 1; zk *= z
        tot += s2.imag / lp
    return tot
def pole_term(T, P, sig=0.75):
    # int_sig^inf Im [ int_P^inf x^(-y-iT) dx/log x ] dy, leading term: Im P^(1-s)/((s-1) log^2 P)
    s = complex(sig, T); return (P ** (1 - s) / ((s - 1) * math.log(P) ** 2)).imag
rows = []
for T in (20.0, 100.0, 1000.0):
    ph = float(Phi(zeta_ld, mp.zeta, mp.mpf(T)))
    for P in (10 ** 2, 10 ** 3, 10 ** 4, 10 ** 5, 10 ** 6):
        a = PhiP_fast(T, P); pt = pole_term(T, P)
        rows.append({'T': T, 'P': P, 'Phi': ph, 'Phi_P': a, 'diff': a - ph, 'pole_term_leading': pt, 'diff_plus_pole': a - ph + pt})
        print('N6b T=%g P=%d Phi %.8f Phi_P %.8f diff %+.3e pole-term %+.3e diff+pole %+.3e' % (T, P, ph, a, a - ph, pt, a - ph + pt), flush=True)
out['N6b_stage_convergence'] = rows
# N7: Davenport-Heilbronn. Window [80,90] contains the zero 0.8085171825 + 85.6993484854 i (beta - sig = 0.0585171825)
rows = []
for T, H in ((80, 10), (60, 10), (110, 8)):
    l = LHS(dh, mp.mpf(T), mp.mpf(H), step=mp.mpf('0.25')); p1 = Phi(dh_ld, dh, mp.mpf(T)); p2 = Phi(dh_ld, dh, mp.mpf(T + H))
    Bw = (l - p1 + p2) / (2 * mp.pi)
    rows.append({'T': T, 'H': H, 'LHS': float(l), 'Phi(T)': float(p1), 'Phi(T+H)': float(p2), 'B_W': float(Bw)})
    print('N7 DH window [%g,%g]: LHS %.10f  Phi(T)-Phi(T+H) %.10f  B_W %.10f' % (T, T + H, l, p1 - p2, Bw), flush=True)
out['N7_DH'] = rows
# DH: no chain. a(6) - a(2)a(3) and the non-additivity of log f over "prime stubs"
out['N7_DH_mult_defect'] = {'kappa': float(KAP), 'a2': float(KAP), 'a3': float(-KAP), 'a6': 1.0, 'a6_minus_a2a3': float(1 + KAP * KAP)}
print('N7 DH kappa %.10f  a(6)-a(2)a(3) = %.6f' % (KAP, 1 + KAP * KAP))
json.dump(out, open(__file__.replace('.py', '.json'), 'w'), indent=1); print('done %.0fs' % (time.time() - t0))
