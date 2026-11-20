# CYC signed sums in Arb (window transform evaluated through sinc, valid at xi = 0), and the n = 8 sample row.
import json, math, flint
from flint import arb
flint.ctx.prec = 256
P = 5; pi = arb.pi()
def bhat(xi):
    v = xi.sinc()
    for m in range(1, P+1):
        v = v*(pi*m)**2/((pi*m)**2 - xi*xi)
    return v
out = {}
l0 = arb(3).log(); rows = []
for (k0, h, n) in [(6, 1, 1), (6, 1, 7), (9, 1, 3), (9, 0.25, 5), (12, 1, 2), (12, 0.25, 11)]:
    hh = arb(h); om = n*l0*2**k0
    S = arb(0); Eabs = arb(0); below = arb(0)
    for kk in range(80):
        lk = l0*arb(2)**kk
        x = float((om/lk).mid()); R = int(90/(h*float(lk.mid()))) + 2; m0 = max(round(x), 1)
        for m in range(max(1, m0-R), m0+R+1):
            t = lk*hh*bhat(hh*(om - m*lk))
            S += t if m % 2 == 0 else -t
            if not (kk == k0 and m == n):
                Eabs += abs(t)
    x = float((om/l0).mid()); m0 = round(x); R = int(90/(h*1.0986))+2
    Pm = arb(0)
    for m in range(max(1, m0-R), m0+R+1):
        Pm += -l0*hh*bhat(hh*(om - m*l0))
    sp = l0*2**k0*hh
    rows.append(dict(k0=k0, h=h, n=n, spike=float(sp.mid()), signed_sum=float(S.mid()), closed_form=float(Pm.mid()),
                     abs_diff_upper=float(abs(S-Pm).upper()), signed_over_spike=float((S/sp).mid()), E_over_spike=float((Eabs/sp).mid())))
out['cyc_signed'] = rows
K0 = 600; k0 = 601; lk0 = arb(k0)**arb('1.5'); n_ = 8; om = n_*lk0
kmax = int((float(om.mid()) + 400.0)**(1/1.5)) + 3
E = arb(0); top = []
for k in range(K0+1, kmax+1):
    lk = arb(k)**arb('1.5'); x = float((om/lk).mid()); m0 = max(round(x), 1)
    for m in range(max(1, m0-2), m0+3):
        if k == k0 and m == n_: continue
        t = lk*abs(bhat(om - m*lk)); E += t
        if bool(t > lk0/10): top.append((k, m, float((t/lk0).mid())))
out['k15_K0_600_n8'] = dict(E_over_spike=float((E/lk0).mid()), rad=float((E/lk0).rad()), large_terms_k_m_ratio=top)
print(json.dumps(out, indent=1)); json.dump(out, open('w2.json', 'w'), indent=1)
