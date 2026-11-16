# Anchor candidate (PR 49 q+-: s_zeta = 1/2, i.e. x = 0, s = x^2 = 0). Ball arithmetic (python-flint).
# log Xi(t) = sum a_k t^k (t = x^2);  M(t) = Xi'/Xi = sum_k (-1)^k mu_k t^k,  mu_k = sum_lambda lambda^{-k-1}.
# Confluent sector matrices at the anchor: K_o -> H0 = [mu_{i+j}], K_e -> H1 = [mu_{i+j+1}]  (Stieltjes moment pair).
# Reports the first order at which H0, H1 are not certified positive definite, for xi, planted twins and DH.
from flint import arb, acb, acb_series, ctx
import sys, json, time
def logder_series_xi(n):      # series in x of log xi(1/2+x), length n
    s = acb_series([acb(arb(1)/2), 1], prec=n)
    z = s.zeta()
    lg = (s/2).lgamma()
    return (s.log() + (1-s).log() - (s/2)*acb(arb.pi().log()) + lg + (-z).log())
def logder_series_dh(n):
    s = acb_series([acb(arb(1)/2), 1], prec=n)
    s5 = arb(5).sqrt(); k = ((10-2*s5).sqrt()-2)/(s5-1)
    tot = None
    for a, c in ((1, arb(1)), (2, k), (3, -k), (4, arb(-1))):
        h = s.zeta(acb(arb(a)/5))*acb(c); tot = h if tot is None else tot + h
    l5 = arb(5).log(); lpi = arb.pi().log()
    return (tot.log() - s*acb(l5) + (s/2)*acb(l5 - lpi) + ((s+1)/2).lgamma())
def mus(logser, K2):          # mu_0..mu_{K2-1} from the even coefficients a_k = coeff of x^{2k}
    out = []; odd = arb(0)
    for k in range(K2):
        a = logser[2*(k+1)]; sgn = 1 if k % 2 == 0 else -1
        out.append(sgn*(k+1)*a.real)
    for k in range(1, 2*K2, 2):
        c = logser[k]; odd = max(odd, abs(c.real).upper()) if hasattr(abs(c.real),'upper') else odd
    return out
def pivots(A):
    N = len(A); Lm = [[None]*N for _ in range(N)]; d = [None]*N
    for i in range(N):
        for j in range(i):
            s = A[i][j]
            for k in range(j): s -= Lm[i][k]*Lm[j][k]*d[k]
            Lm[i][j] = s/d[j]
        s = A[i][i]
        for k in range(i): s -= Lm[i][k]*Lm[i][k]*d[k]
        d[i] = s
        if not (s > 0 or s < 0): return d[:i+1]   # stop only when the sign is not certified
    return d
def first(mu, shift, K):
    H = [[mu[i+j+shift] for j in range(K)] for i in range(K)]
    d = pivots(H); neg = [i+1 for i, v in enumerate(d) if v < 0]
    und = (not (d[-1] > 0 or d[-1] < 0))
    msg = "certified signs to order %d; negative pivots at %s"%(len(d) - (1 if und else 0), neg)
    if und: msg += "; UNDECIDED at %d"%len(d)
    return (neg[0] if neg else None), msg
if __name__ == "__main__":
    which, K, bits = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); ctx.prec = bits; t = time.time()
    n = 4*K + 6; ctx.cap = n
    ser = (logder_series_dh if which == "dh" else logder_series_xi)(n)
    oddmax = max(float(abs(ser[k]).upper()) if True else 0 for k in range(1, 12, 2)) if hasattr(abs(ser[1]),'upper') else None
    mu = mus(ser, 2*K + 1)
    # scale mu_k by g^(2k+2) (positive diagonal congruence of both Hankel matrices), g = 14 for xi, 5 for dh
    out = {"which": which, "K": K, "bits": bits, "mu0": mu[0].str(20), "mu1": mu[1].str(20), "odd_coeff_check": [ser[k].real.str(5) for k in (1,3,5)], "rows": []}
    print(which, "mu_0 =", mu[0].str(25), "mu_1 =", mu[1].str(25), "odd coeffs:", out["odd_coeff_check"], "t=%.0fs"%(time.time()-t), flush=True)
    r = {"case": which}
    r["H0"], r["H0_msg"] = first(mu, 0, K); r["H1"], r["H1_msg"] = first(mu, 1, K)
    print(r, "t=%.0fs"%(time.time()-t), flush=True); out["rows"].append(r)
    if which == "xi" and len(sys.argv) > 5:
        d = arb(sys.argv[5])
        for nz in [int(v) for v in sys.argv[6].split(',')]:
            g = acb.zeta_zero(nz).imag if hasattr(acb, 'zeta_zero') else None
            lam = acb(g*g - d*d, -2*d*g)
            mt = []
            for k in range(2*K + 1):
                mt.append(mu[k] - 1/(g*g)**(k+1) + 2*(1/lam**(k+1)).real)
            r = {"case": "move", "n": nz, "gamma": g.str(10), "delta": sys.argv[5]}
            r["H0"], r["H0_msg"] = first(mt, 0, K); r["H1"], r["H1_msg"] = first(mt, 1, K)
            print(r, flush=True); out["rows"].append(r)
    json.dump(out, open(sys.argv[4], "w"), indent=1)
