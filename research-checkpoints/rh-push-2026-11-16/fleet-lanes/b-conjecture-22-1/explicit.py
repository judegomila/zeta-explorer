# Explicit families for the heat-flow cap (exact sign counting with mpmath at 60 digits).
import mpmath as mp
mp.mp.dps = 60
def changes(f, lo, hi, n):
    prev = 0; cnt = 0
    for i in range(n+1):
        v = f(lo + (hi-lo)*mp.mpf(i)/n)
        s = 1 if v > 0 else (-1 if v < 0 else 0)
        if s and prev and s != prev: cnt += 1
        if s: prev = s
    return cnt
# Family A (d=0): one wide positive Gaussian minus N-1 narrow spikes -> 2(N-1) zeros (cap attained).
for N in (2, 3, 5, 9):
    cs = [mp.mpf(k) - mp.mpf(N-2)/2 for k in range(N-1)]
    f = lambda t: mp.e**(-t*t/200) - 2*sum(mp.e**(-(t-c)**2/mp.mpf('0.02')) for c in cs)
    D = N
    print(f"A: N={N} D={D} sign changes={changes(f,-60,60,24000)}  equal-width PS cap D-1={D-1}  heat-flow cap={2*(N-1)+1-1}")
# Family B (d>0): wide positive Gaussian + narrow Hermite block He_d(x/sqrt(eps)) e^{-x^2/(2 eps)} * A.
for d in (1, 2, 3, 4, 6):
    eps = mp.mpf('0.01')
    best = 0
    for A in (mp.mpf(x) for x in ('0.3','1','3','10','30','100')):
        f = lambda t: mp.e**(-t*t/200) + A*mp.hermite(d, t/mp.sqrt(2*eps))*mp.e**(-t*t/(2*eps))
        best = max(best, changes(f, -8, 8, 16000))
    D = d + 2
    print(f"B: narrow degree d={d} over one wide Gaussian: D={D} best sign changes={best}  equal-width PS cap D-1={D-1}  heat-flow cap={2*(d+1)+1-1}")
