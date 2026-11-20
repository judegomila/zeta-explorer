"""Combination (3b): one-point jets of K_a(z, w) = (1 - R_a(z) conj R_a(w))/(z + conj w), R_a(w) = F(w - a)/F(w + a), at a real
centre z*. In the disc variable zeta (w = z* (1 + zeta)/(1 - zeta)) the jet matrix of order d is congruent to
[D D^* - N N^*]/(1 - zeta conj eta) Taylor section; its LDL pivots are computed by the Schur algorithm (lib2.schur_params).
J_a^(d)(z*) >= 0 iff the first d pivots are >= 0.
usage: run3_jets.py <out.jsonl> <code> <zstar> <a> <d> <bits> [delta:gamma ...]  (planted quadruples on the base object)"""
import sys, json, time, math
from flint import arb, acb, ctx, acb_series
import lib, lib2

def main():
    out, code, zs, a, d, bits = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], int(sys.argv[5]), int(sys.argv[6])
    specs = [None] + sys.argv[7:]
    ctx.prec = bits; ctx.cap = d + 4
    t0 = time.time(); o = lib2.get(code)
    N, D = lib2.jet_series(o, zs, a, d)
    tser = time.time() - t0
    z = arb(zs); aa = arb(a)
    def wser(shift):
        return acb_series([acb(z + shift)] + [acb(2 * z)] * (d - 1), prec=d)
    for spec in specs:
        if spec is None: n_, d_ = N, D; label = code
        else:
            dl, g = spec.split(':'); lam = acb(arb(g), -arb(dl)); lam = lam * lam
            def fac(shift):
                w = wser(shift); w2 = w * w
                co = [t.real for t in ((w2 + lam) * (w2 + lam.conjugate())).coeffs()]; co += [arb(0)] * (d - len(co))
                return co
            def mul(x, y):
                r = (acb_series(x, prec=d) * acb_series(y, prec=d)).coeffs(); r = [t.real for t in r]; return r + [arb(0)] * (d - len(r))
            n_ = mul(N, fac(-aa)); d_ = mul(D, fac(aa)); label = 'PL:%s:%s' % (code, spec)
        t1 = time.time()
        res = lib2.schur_params(d_, n_)
        neg = [r[0] for r in res if r[1] < 0]; und = next((r[0] for r in res if r[1] == 0), None)
        gam = [abs(r[3]) for r in res if r[3] is not None]
        rec = dict(kind='jets', code=label, zstar=zs, a=a, d=d, bits=bits, orders_decided=len(res) - (1 if und is not None else 0),
                   first_negative_order=(neg[0] if neg else None), first_negative_log2=(res[neg[0]][2] if neg else None),
                   negative_orders=neg[:30], n_negative=len(neg), undecided_at=und,
                   first_schur_param_outside_disc=next((r[0] for r in res if r[3] is not None and abs(r[3]) > 1), None),
                   max_abs_schur_param=max(gam) if gam else None,
                   log2_pivot_profile=[(r[0], round(r[2], 1)) for r in res[::max(1, len(res) // 20)] if r[2] is not None],
                   series_sec=round(tser, 1), schur_sec=round(time.time() - t1, 1))
        open(out, 'a').write(json.dumps(rec) + '\n')
        print(json.dumps({k: v for k, v in rec.items() if k != 'log2_pivot_profile'}), flush=True)

if __name__ == '__main__':
    main()
