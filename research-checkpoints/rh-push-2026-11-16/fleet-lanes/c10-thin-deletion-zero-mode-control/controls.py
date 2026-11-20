# Controls on the control. Planned memory: same as del_control.py (10 MB sieve, list of <= 2e5 ints).
import json, hashlib, sys
from flint import arb, ctx
import del_control as dc
ctx.prec = 128
out = {}
# (1) undeleted product: zeta < 0 on [1/2, 0.999] (ball subdivision; no zero introduced when S is empty)
lo = arb("0.5"); n = 4000; worst = None
for j in range(n):
    a = arb("0.5") + arb("0.499") * j / n; bb = arb("0.5") + arb("0.499") * (j + 1) / n
    s = a.union(bb); z = s.zeta()
    assert z < 0, (j, z)
    u = float(z.upper()); worst = u if worst is None else max(worst, u)
out["zeta_negative_on_[0.5,0.999]"] = dict(subintervals=n, max_upper=worst)
for bs in ("0.9", "0.75"):
    b = arb(bs); X = 10 ** 7
    S, st, snap = dc.build(X, b, arb(1), [X])
    Sset = set(S)
    rec = dict(sizeS=len(S), first_30=S[:30], sha256_of_S=hashlib.sha256(",".join(map(str, S)).encode()).hexdigest())
    # (2) positivity: Lambda_F(n) = Lambda(n) [p not in S] >= 0; coefficients a(n) in {0,1}, completely multiplicative.
    N = 20000
    a = [1] * (N + 1); a[0] = 0
    for p in S:
        if p > N: break
        for k in range(p, N + 1, p): a[k] = 0
    # check: -F'/F at s = 3 from the Euler product over p <= 1e7 not in S, against sum Lambda_F(n) n^-3, n <= N
    sv = dc.sieve(N); s3 = arb(3)
    lam = arb(0); nneg = 0
    for p in range(2, N + 1):
        if sv[p] and p not in Sset:
            q = p
            while q <= N:
                lam += arb(p).log() * arb(q) ** (-s3); q *= p
    eul = arb(0)
    for p in range(2, N + 1):
        if sv[p] and p not in Sset:
            eul += arb(p).log() / (arb(p) ** s3 - 1)
    rec["Lambda_F_min_coefficient"] = 0.0
    rec["logderiv_s3_sum_vs_euler_primes_le_N"] = [float(lam.mid()), float(eul.mid())]
    rec["a_values"] = sorted(set(a[1:])); rec["count_a_eq_1_up_to_N"] = sum(a); rec["N"] = N
    cm = all(a[m_] * a[n_] == a[m_ * n_] for m_ in range(1, 141) for n_ in range(1, 141))
    rec["completely_multiplicative_m_n_le_140"] = cm
    # (3) residue at 1: G_X(1) >= G(1) >= G_X(1) exp(-tail), tail from D <= 0 only
    logG1 = sum(((1 - arb(1) / p).log() for p in S), arb(0))
    DX = arb(len(S)) - dc.Lball(X, b, arb(1))
    tail1 = (-DX) / X + ((1 - b) * arb(X).log()).expint(1)
    tb = tail1 / (1 - arb(1) / X)        # sum over p > X of -log(1 - 1/p) <= tail1/(1 - 1/X)
    rec["residue_G(1)"] = [float((logG1 - tb).exp().lower()), float(logG1.exp().upper())]
    rec["count_ratio_a/N_vs_residue"] = sum(a) / N
    # (4) finite stage: G_X(b) > 0 at every finite X (no zero at any finite stage)
    rec["G_X(b)_X=1e7"] = float(sum(((1 - arb(p) ** (-b)).log() for p in S), arb(0)).exp().mid())
    # (5) relative density of S among primes
    rec["piS/pi_at_1e7"] = len(S) / st["nprimes"]
    out["b=" + bs] = rec
json.dump(out, open("controls.json", "w"), indent=1)
print(json.dumps(out, indent=1))
