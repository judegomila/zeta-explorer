"""s1-klein-annulus-energy: ball-arithmetic recheck (python-flint, 200 bits) of single values reported as failures or passes in
combination (1): u_b(y) = -log|S(b+iy)| and -theta'(y) = 2 alpha L'/(1 - alpha^2 L^2) at z = iy, L = F'/F through acb_series.
usage: recheck_points.py out.json CODE:alpha:b:y_u:y_theta ...     (reads the argmin locations from the analysis json by hand)"""
import sys, json
from flint import acb, arb, ctx, acb_series
ctx.prec = 200

def completed(code, x):
    pi = arb.pi()
    def xi(u): return u * (u - 1) * (-u / 2 * pi.log()).exp() * (u / 2).gamma() * u.zeta()
    if code == 'ZETA': return xi(x)
    if code == 'LCHI3':
        return ((x + 1) / 2 * (3 / pi).log()).exp() * ((x + 1) / 2).gamma() * (x.zeta(arb(1) / 3) - x.zeta(arb(2) / 3)) * (-x * arb(3).log()).exp()
    if code == 'DH':
        r5 = arb(5).sqrt(); k = ((10 - 2 * r5).sqrt() - 2) / (r5 - 1)
        return (x / 2 * (5 / pi).log()).exp() * ((x + 1) / 2).gamma() * (x.zeta(arb(1) / 5) + k * x.zeta(arb(2) / 5) - k * x.zeta(arb(3) / 5) - x.zeta(arb(4) / 5)) * (-x * arb(5).log()).exp()
    if code.startswith('EA'):
        num, den = code.split(':')[1].split('/'); a = arb(int(num)) / int(den)
        return xi(x + a) * xi(x - a)
    if code == 'TNR':
        lq = arb(3).log()
        return (x * lq).exp() * xi(x) * (1 + arb('2.2') * ((arb(1) / 2 - x) * lq).exp() + ((1 - 2 * x) * lq).exp())
    raise KeyError(code)

def L_and_Lp(code, z):
    x = acb_series([acb(arb(1) / 2) + z, 1], prec=3); f = completed(code, x)
    L = f[1] / f[0]; Lp = 2 * f[2] / f[0] - L * L
    return L, Lp

if __name__ == '__main__':
    out = []
    for spec in sys.argv[2:]:
        code, al, b, yu, yt = spec.rsplit('|')
        alpha = arb(al); 
        L, _ = L_and_Lp(code, acb(arb(b), arb(yu)))
        u = ((1 + alpha * L).abs_lower().log() if False else abs(1 + alpha * L).log()) - abs(1 - alpha * L).log()
        L0, Lp0 = L_and_Lp(code, acb(0, arb(yt)))
        mth = (2 * alpha * Lp0 / (1 - alpha * alpha * L0 * L0))
        r = dict(code=code, alpha=al, b=b, y_u=yu, u_b=str(u), ReL_on_b=str(L.real), y_theta=yt, minus_theta_prime=str(mth.real), imag_part=str(mth.imag))
        out.append(r); print(r, flush=True)
    json.dump(out, open(sys.argv[1], 'w'), indent=1)
