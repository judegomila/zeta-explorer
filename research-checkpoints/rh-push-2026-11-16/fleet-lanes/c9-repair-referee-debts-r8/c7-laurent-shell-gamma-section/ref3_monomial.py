"""Referee of the monomial case of Lemma 2 (push/c8-repair-engine-map-r7/c7-laurent-shell-gamma-section/REFEREE2.md section 2).
New cases, independent code (mpmath only): m = c q^(-it), poles 2 theta(t) + t log q - a = 2 pi j, Cesaro mean of zeta(1/2 + i g_j).
Predicted: 1 + conj(c) n^(-1/2) if 1/q = n is an integer, 1 otherwise. No arrays."""
from mpmath import mp, mpf, mpc, siegeltheta, zeta, log, pi, exp, floor
import sys
mp.dps = 15
def run(a, q, T0, T1, label):
    lq = log(mpf(q)); c = exp(mpc(0, a))
    ph = lambda t: 2*siegeltheta(t) + t*lq - a
    j = int(floor(ph(mpf(T0))/(2*pi))) + 1
    t = mpf(T0); S = mpc(0); N = 0; out = []
    marks = [T1/4, T1/2, T1]
    while True:
        target = 2*pi*j
        for _ in range(60):                       # Newton; derivative log(t/2pi) + log q
            d = (ph(t) - target)/(log(t/(2*pi)) + lq)
            t -= d
            if abs(d) < mpf(10)**(-10): break
        if t > T1: break
        S += zeta(mpc(0.5, t)); N += 1; j += 1
        if marks and t > marks[0]:
            out.append((float(marks.pop(0)), N, S/N))
    out.append((float(T1), N, S/N))
    n = 1/mpf(q)
    pred = 1 + c.conjugate()/n**0.5 if abs(n - round(n)) < 1e-12 else mpc(1)
    print(label, "| predicted", mp.nstr(pred, 8))
    for T, N, m in out:
        print("    poles in (%d, %d]: %d   Cesaro mean %s   |diff| = %.4f" % (T0, T, N, mp.nstr(m, 8), abs(m - pred)))
T1 = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
run(2.1, mpf(1)/2, 60, T1, "m = e^(2.1i) conj(w_2), q = 1/2")
run(2.1, mpf(1)/3, 60, T1, "m = e^(2.1i) conj(w_3), q = 1/3")
run(-0.9, mpf(2), 60, T1, "m = e^(-0.9i) w_2, q = 2 (1/q not an integer)")
run(-0.9, mpf(2)/3, 60, T1, "m = e^(-0.9i) w_2 conj(w_3), q = 2/3")
