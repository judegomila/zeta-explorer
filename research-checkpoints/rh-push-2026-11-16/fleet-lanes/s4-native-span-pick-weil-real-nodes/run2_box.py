"""Combination (2): admissible box of the n prime scalars Z_i = -zeta'/zeta(s_i) on a node family, and the position of
each control's vector. Form: P(Z) = [(A_i + A_j - Z_i - Z_j)/(nu_i + nu_j)], A = arch + pole of zeta (fixed).
For each i: P(Z + t e_i) >= 0 iff 1/mu_- <= t <= 1/mu_+, mu_+- = b +- sqrt(a d), a = e_i' P^-1 e_i, b = e_i' P^-1 g_i,
d = g_i' P^-1 g_i, g_i = column i of the Cauchy matrix G (rank-two perturbation; exact for the single-coordinate box).
usage: run2_box.py <out.jsonl> <family> <n> <bits> <control codes...>"""
import sys, os, json, math, time
from multiprocessing import Pool
from flint import arb, ctx, arb_mat
import lib, lib2

def f(x): return float(x.mid())
def sf(x):
    try:
        v = float(x.mid()); return v if abs(v) < 1e300 else None
    except Exception: return None
def l2(x):
    v = lib._log2(x); return None if v is None else round(v, 2)

def ldl_signs(nu, c):
    piv = lib.schur_real(nu, c, stop_at_negative=False)
    return sum(1 for p in piv if p[1] < 0), next((p[0] for p in piv if p[1] == 0), None), len(piv)

def main():
    out, family, n, bits = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]); codes = sys.argv[5:]
    with Pool(int(os.environ.get('RH_WORKERS', '4'))) as pool:
        P3 = lib2.values('ZETA', family, n, bits, pool, 'parts')
        ctx.prec = bits + 64
        nu = [lib2.node(family, k) for k in range(n)]
        arch = [lib2.unpack(t[0]) for t in P3]; pole = [lib2.unpack(t[1]) for t in P3]; Z = [-lib2.unpack(t[2]) for t in P3]
        ctx.prec = bits
        A = [arch[i] + pole[i] for i in range(n)]; c = [A[i] - Z[i] for i in range(n)]
        sc = [(nu[i] / c[i]).sqrt() for i in range(n)]                       # normalisation: unit diagonal
        Pn = arb_mat(n, n, [(c[i] + c[j]) / (nu[i] + nu[j]) * sc[i] * sc[j] for i in range(n) for j in range(n)])
        negz, undz, _ = ldl_signs(nu, c)
        rec = dict(kind='box', family=family, n=n, bits=bits, zeta_negatives=negz, zeta_undecided=undz, rows=[])
        Pinv = Pn.inv()
        if undz is not None or not all(Pinv[i, i] > 0 for i in range(n)):
            rec['error'] = 'precision'; open(out, 'a').write(json.dumps(rec) + '\n'); print(rec); return
        tm = []; tp = []
        for i in range(n):
            g = [sc[j] / (nu[i] + nu[j]) for j in range(n)]                    # scaled column of G
            Pg = [sum((Pinv[j, k] * g[k] for k in range(n)), arb(0)) for j in range(n)]
            a = Pinv[i, i] * sc[i] * sc[i]
            b = Pg[i] * sc[i]
            d = sum((g[j] * Pg[j] for j in range(n)), arb(0))
            r = (a * d).sqrt()
            tplus = 1 / (b + r); tminus = 1 / (b - r)
            tp.append(tplus); tm.append(tminus)
            rec['rows'].append(dict(i=i, nu=f(nu[i]), log2_Z=l2(Z[i]), c=f(c[i]), log2_tplus=l2(tplus), log2_tminus_abs=l2(-tminus),
                                    log2_width_over_Z=l2((tplus - tminus) / Z[i]), width_over_c=f((tplus - tminus) / c[i]),
                                    tplus_over_Z=sf(tplus / Z[i]), tminus_over_Z=sf(tminus / Z[i]),
                                    certified=bool(tplus > 0 and tminus < 0)))
        rec['min_width_over_c'] = min(r_['width_over_c'] for r_ in rec['rows'])
        rec['width_over_Z_first3'] = [(r_['tminus_over_Z'], r_['tplus_over_Z']) for r_ in rec['rows'][:3]]
        open(out, 'a').write(json.dumps(rec) + '\n')
        print(json.dumps({k: v for k, v in rec.items() if k != 'rows'}), flush=True)
        for code in codes:
            ctx.prec = bits + 64
            own = [lib2.unpack(t) for t in lib2.values(code, family, n, bits, pool, 'c')]
            if code.startswith('HT:') or code.startswith('HEAT'):
                Zc = [A[i] - own[i] for i in range(n)]; zdef = 'A_zeta - c_own'
            else:
                Zc = [lib2.unpack(t) for t in lib2.values(code, family, n, bits, pool, 'Z')]; zdef = '-L\'/L of the Dirichlet series'
            ctx.prec = bits
            dl = [Zc[i] - Z[i] for i in range(n)]
            inside = []; worst = None
            for i in range(n):
                ins = bool(dl[i] <= tp[i] and dl[i] >= tm[i]); outs = bool(dl[i] > tp[i] or dl[i] < tm[i])
                inside.append(1 if ins else (0 if outs else -1))
            # position: delta_i / t_+- (ratio > 1 = outside)
            ratio = [f(dl[i] / tp[i]) if dl[i] > 0 else f(dl[i] / tm[i]) for i in range(n)]
            hyb = [A[i] - Zc[i] for i in range(n)]
            nh, uh, dh = ldl_signs(nu, hyb); no, uo, do = ldl_signs(nu, own)
            # ray: largest theta with P(Z + theta (Zc - Z)) >= 0 (bisection on LDL signs, theta in [0, 64])
            def psd(th):
                cc = [A[i] - Z[i] - arb(th) * dl[i] for i in range(n)]
                ng, ud, _ = ldl_signs(nu, cc); return ng == 0 and ud is None
            lo, hi = 0.0, 64.0
            if psd(hi): theta = '>64'
            else:
                for _ in range(40):
                    mid = (lo + hi) / 2
                    if psd(mid): lo = mid
                    else: hi = mid
                theta = lo
            r2 = dict(kind='control', family=family, n=n, bits=bits, code=code, Z_definition=zdef,
                      coords_outside_box=[i for i in range(n) if inside[i] == 0], coords_undecided=[i for i in range(n) if inside[i] == -1],
                      max_ratio=max(ratio), ratio_first4=ratio[:4], Zc_over_Z_first4=[sf(Zc[i] / Z[i]) for i in range(min(4, n))],
                      hybrid_negatives=nh, hybrid_undecided=uh, own_negatives=no, own_undecided=uo, ray_theta_star=theta)
            open(out, 'a').write(json.dumps(r2) + '\n'); print(json.dumps(r2), flush=True)

if __name__ == '__main__':
    main()
