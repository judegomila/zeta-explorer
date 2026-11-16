"""Lemma E: E(n,D) = [v^n] exp(sum_j min(D q^(j/2), q^j) v^j / j) against the closed bound
log(E q^(-n/2)) <= n log J / J + (D/J)(1/log J + 1/J) + 1.6 D/(J-1),  J = floor(2 log_q D) >= 3, and against binom(n+D-1,n)."""
from mpmath import mp, mpf, log, floor, binomial, exp
mp.dps = 30
def E(q, n, D):
    b = [mpf(0)] + [min(D * mpf(q) ** (mpf(j) / 2), mpf(q) ** j) for j in range(1, n + 1)]
    e = [mpf(1)] + [mpf(0)] * n          # e_n = (1/n) sum_{j=1}^n b_j e_{n-j}
    for m in range(1, n + 1):
        e[m] = sum(b[j] * e[m - j] for j in range(1, m + 1)) / m
    return e[n]
for q in (7, 13):
    for D in (10, 50, 400, 3000, 10 ** 5, 10 ** 8):
        J = int(floor(2 * log(D) / log(q)))
        for n in (D // 4, D, 4 * D):
            if n > 1200: n = 1200
            val = log(E(q, n, D)) - n * log(q) / 2
            bnd = n * log(J) / J + (D / mpf(J)) * (1 / log(J) + 1 / mpf(J)) + mpf('1.6') * D / (J - 1) if J >= 3 else None
            print(f"q={q} D={D} J={J} n={n} log_q(Loss)/(n+D)={float(val/log(q)/(n+D)):.4f} bound/(n+D)={'-' if bnd is None else '%.4f' % float(bnd/log(q)/(n+D))} ok={'-' if bnd is None else bool(val <= bnd)} binom/(n+D)={float(log(binomial(n+D-1,n))/log(q)/(n+D)):.4f}")
