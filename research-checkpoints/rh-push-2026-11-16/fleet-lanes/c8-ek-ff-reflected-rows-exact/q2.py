"""Second question: the compensated probe (12.5), one marked slot, in the F_q[T] model, exact arithmetic.
  marked term   : sum_P eta(P) I_{eta;P}(X, Y, Z q_P)        -> q^(-d/2-3k/2-N) * q^(-lam) * J_m,  J_m = J(k, N, lam; d)
  rescaled term : sum_P q_P^(-3/2) I_eta(X/q_P, Y/q_P, Z)    -> q^(-d/2-3k/2-N) * pi(lam) q^(lam) * J_b,  J_b = J(k-lam, N, 0; d-2 lam)
  (I = Q^(-1/2) sum_m A_m B_m with A_m = Y^(-1) sum_s q_s^(-1/2) g(s,m), B_m = sum_A g_3(1,A) w(A) chi_A(m) / |A|; see RESULT.md section 6)
  compensated   : C = J_m - pi(lam) q^(2 lam) J_b   (common factor q^(-d/2-3k/2-N-lam) removed)
All of J_m, J_b, C are exact elements of Z[zeta_6q]; |.|^2 evaluated at 70 digits from the exact element."""
import sys, json, os
from decimal import Decimal
from exact import *
from c7_analyze import RR, lq
TG = {'mu': (4, 0, 0, 0), 'a': (0, 3, 2, 3), 'b': (0, 3, 8, 3), 'n1': (2, 21, 0, 0), 'r1': (1, 11, 0, 0)}
def npr(q, lam):
    # number of monic irreducibles of degree lam
    mu = {1: 1, 2: -1, 3: -1, 4: 0, 5: -1, 6: 1}
    return sum(mu[lam // e] * q ** e for e in range(1, lam + 1) if lam % e == 0) // lam
def ckmap(q, d, k):
    res = {}
    if d == 0 or k == 0 or True:
        for line in run(['ck', q, d, k]).split('\n'):
            t = [int(x) for x in line.split()]
            if not t: continue
            dd = res.setdefault(t[0], {}); z = z6red(t[2:8]); cur = dd.get(t[1], (0, 0)); dd[t[1]] = (cur[0] + z[0], cur[1] + z[1])
    return res
def rowmap(q, d, N, lam, t):
    res = {}
    for line in run(['row', q, d, N, lam, t[0], t[1], t[2], t[3], 0]).split('\n'):
        tt = [int(x) for x in line.split()]
        if tt: res[tt[0]] = z6red(tt[1:7])
    return res
def Jelem(R, q, d, k, N, lam, t):
    ck = ckmap(q, d, k); row = rowmap(q, d, N, lam, t); S = {}
    for m, dd in ck.items():
        h = row.get(m, (0, 0))
        if h == (0, 0): continue
        for key, x in dd.items():
            p = z6mul(x, h); cur = S.get(key, (0, 0)); S[key] = (cur[0] + p[0], cur[1] + p[1])
    J = tuple([0] * R.deg)
    for key, s in S.items():
        if s != (0, 0): J = R.radd(J, R.rmul(R.rkey(key), R.rz6(s)))
    return R.rmul(J, R.red(R.Gpow(2, N + lam)))
def scop(q, N, lam, t, k):
    tot = 0
    for line in run(['wsum', q, N, lam, t[0], t[1], t[2], t[3], 0]).split('\n'):
        tt = [int(x) for x in line.split()]
        if len(tt) < 14: continue
        pol = [1] + [0] * k
        for i in range(1, 13):
            for _ in range(tt[i]):
                pol = [pol[j] - (pol[j - i] if j >= i else 0) for j in range(k + 1)]
        tot += tt[13] * (-1) ** sum(tt[1:13]) * sum(pol[j] * q ** (k - j) for j in range(k + 1))
    return tot
def main(q, dlist, out):
    R = RR(q); f = open(out, 'w')
    for d in dlist:
        for lam in (1, 2):
            if d - 2 * lam < 0: continue
            for N in range(1, 7 - lam - (1 if d >= 5 else 0)):
                for k in range(lam, d + 2):
                    if q ** (d + k) > 3e8 or q ** (d + N + lam) > 3e8: continue
                    for name in ('a', 'b', 'mu', 'n1'):
                        t = TG[name]
                        Jm = Jelem(R, q, d, k, N, lam, t); Jb = Jelem(R, q, d - 2 * lam, k - lam, N, 0, t)
                        B = R.rscal(Jb, npr(q, lam) * q ** (2 * lam))
                        a2 = R.rabs2(Jm); b2 = R.rabs2(B); cm = R.rabs2(R.radd(Jm, R.rscal(B, -1))); cp = R.rabs2(R.radd(Jm, B))
                        r = k + N + lam - 1 - d
                        rec = dict(q=q, target=name, d=d, k=k, N=N, lam=lam, r=r, region_lx_lt_l=(k > d - lam), Jm2=str(a2.quantize(Decimal(1))), B2=str(b2.quantize(Decimal(1))),
                                   Cminus2=str(cm.quantize(Decimal(1))), Cplus2=str(cp.quantize(Decimal(1))))
                        if a2 > 0:
                            rec['B_over_Jm'] = float((b2 / a2).sqrt()); rec['Cminus_over_Jm'] = float((cm / a2).sqrt()); rec['Cplus_over_Jm'] = float((cp / a2).sqrt())
                            if b2 > 0: rec['cos_phase'] = float((cp - cm) / (4 * (a2 * b2).sqrt()))
                        if name != 'r1':
                            rec['S_m_k'] = scop(q, N, lam, t, k); rec['S_b_k'] = scop(q, N, 0, t, k); rec['S_b_k_minus_lam'] = scop(q, N, 0, t, k - lam); rec['npr'] = npr(q, lam)
                        f.write(json.dumps(rec) + '\n'); f.flush()
    f.close()
if __name__ == '__main__':
    main(int(sys.argv[1]), [int(x) for x in sys.argv[2].split(',')], sys.argv[3])
