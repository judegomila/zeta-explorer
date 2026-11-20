# consts.py: closed-form / high-precision constants for each F.
#  kappa_F = int_0^1 A_F = (3/(4 pi)) int |F(1/2+it)|^2 / ((1/4+t^2)(9/4+t^2)) dt   (limit of the first moment)
#  F(1) (NB right-hand side), C_on = sum over on-line zeros 1/|rho|^2, Blaschke floor d_inf^2 = 1-|B(1)|^2.
import json, math, sys
import mpmath as mp
mp.mp.dps = 30
XI = (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
out = {}
K = mp.mpf(3)/4*(mp.log(2*mp.pi)-mp.euler)-mp.mpf(1)/4
out['zeta'] = {'kappa': mp.nstr(K, 20), 'C_on': mp.nstr(2+mp.euler-mp.log(4*mp.pi), 20), 'floor': '0'}
def kappa_per(c):
    q = len(c); cc = lambda n: c[(n-1) % q]
    # kappa = sum_{n>=1} [ S_n^2/(n(n+1)) - S_n M_n (2n+1)/(2 n^2 (n+1)^2) ],  S_n=sum_{k<=n} c_k, M_n=sum_{k<=n} k c_k
    Sq = [0]; Mq = [0]
    for n in range(1, q+1): Sq.append(Sq[-1]+cc(n)); Mq.append(Mq[-1]+n*cc(n))
    def block(i):
        i = int(i); tot = mp.mpf(0)
        for r in range(1, q+1):
            n = i*q+r; S = Sq[r]; M = Mq[r] + i*Mq[q] + i*q*Sq[r]  # M_{iq+r} = i M_q + sum_{k<=r}(iq+k)c_k (sum c over period 0)
            if S == 0: continue
            tot += S*S/(mp.mpf(n)*(n+1)) - S*M*(2*n+1)/(2*mp.mpf(n)**2*(n+1)**2)
        return tot
    return mp.nsum(block, [0, mp.inf])
def Lval(c, s):
    q = len(c); return mp.mpf(q)**(-s)*sum(c[r-1]*mp.zeta(s, mp.mpf(r)/q) for r in range(1, q+1) if c[r-1] != 0)
def kappa_quad(F, T=150, tail=None):
    f = lambda t: abs(F(mp.mpc(0.5, t)))**2/((0.25+t*t)*(2.25+t*t))
    old = mp.mp.dps; mp.mp.dps = 15
    v = mp.quad(f, mp.linspace(0, T, 2*T+1))
    mp.mp.dps = old
    return 3/(2*mp.pi)*v
per = {'chim3': ([1, -1, 0], 1), 'chi5': ([1, -1, -1, 1, 0], 0), 'DH': ([1, XI, -XI, -1, 0], 1)}
for name, (c, par) in per.items():
    q = len(c); c = [mp.mpf(x) for x in c]
    L1 = -sum(c[r-1]*mp.digamma(mp.mpf(r)/q) for r in range(1, q+1))/q
    Lp1 = -mp.log(q)*L1 - sum(c[r-1]*mp.stieltjes(1, mp.mpf(r)/q) for r in range(1, q+1))/q
    tot = mp.log(q/mp.pi) + mp.digamma(mp.mpf(1+par)/2) + 2*Lp1/L1   # sum over all zeros of 1/(rho(1-rho))
    kap = kappa_per(c)
    kq = kappa_quad(lambda s: Lval(c, s))
    d = {'q': q, 'c': [mp.nstr(x, 20) for x in c], 'L1': mp.nstr(L1, 20), 'kappa': mp.nstr(kap, 22), 'kappa_quad_T150': mp.nstr(kq, 12),
         'sum_all_zeros': mp.nstr(tot, 15), 'C_on': mp.nstr(tot, 15), 'floor': '0'}
    out[name] = d; print(name, d, flush=True)
# DH: subtract the off-line quartets (table of the control battery, height 2000)
Z = json.load(open('../c12-control-battery-harness/tables/zeros_DH.json'))
off = [(mp.mpf(b), mp.mpf(g)) for b, g, _ in Z['offline']]
sub = sum(4*mp.re(1/(mp.mpc(b, g)*(1-mp.mpc(b, g)))) for b, g in off)
on = sum(2/(mp.mpf(1)/4+mp.mpf(g)**2) for g in Z['online'])
B2 = mp.mpf(1)
for b, g in off: B2 *= (((1-b)**2+g*g)/(b*b+g*g))**2
tot = mp.mpf(out['DH']['sum_all_zeros'])
out['DH'].update({'C_on': mp.nstr(tot-sub, 12), 'offline_part': mp.nstr(sub, 12), 'online_sum_table_to_2000': mp.nstr(on, 12),
                  'floor': mp.nstr(1-B2, 12), 'first_offline': [mp.nstr(off[0][0], 10), mp.nstr(off[0][1], 10)], 'n_offline_pairs': len(off)})
print('DH', out['DH'], flush=True)
# T-NR: kappa by exact piecewise integration.  kappa_d = int_0^1 A(lambda q^d) d lambda
def kap_d(q, d):
    # d>=0: int_0^inf {t} Phi(x t) t^-3 dt, x=q^d ; d<0: (1/Q) int {Q s} Phi(s) s^-3 ds, Q=q^-d ; Phi(y)=(floor y + {y}^2)/2
    Q = q**abs(d); h = mp.mpf(1)/Q
    def piece(u0, u1, al, j, be, k):
        # int_{u0}^{u1} (al t - j)(k + (be t - k)^2)/(2 t^3) dt
        c0 = -j*(k+k*k); c1 = al*(k+k*k) + 2*j*be*k; c2 = -2*al*be*k - j*be*be; c3 = al*be*be
        F = lambda t: -c0/(2*t*t) - c1/t + c2*mp.log(t) + c3*t
        return (F(u1)-F(u0))/2
    def block(n):
        n = int(n); tot = mp.mpf(0)
        for i in range(Q):
            u0 = n + i*h; u1 = n + (i+1)*h; idx = n*Q+i
            if d >= 0: al, j, be, k = 1, n, Q, idx
            else: al, j, be, k = Q, idx, 1, n
            if idx == 0:
                tot += mp.mpf(al)*be*be*h/2   # int_0^{h} al t * be^2 t^2/(2 t^3) dt = al be^2 h/2
                continue
            tot += piece(u0, u1, al, j, be, k)
        return tot
    v = mp.nsum(block, [0, mp.inf])
    return v if d >= 0 else v/Q
print('check kappa_0 =', mp.nstr(kap_d(3, 0), 20), ' K =', mp.nstr(K, 20), flush=True)
def cosh(x): return mp.cosh(x)
for q, c in [(2, 2.1), (3, 2.2), (101, 2.2)]:
    cm = mp.mpf(str(c)); w = {-2: 1, -1: 2*cm, 0: cm*cm+2, 1: 2*cm, 2: 1}
    mp.mp.dps = 30 if q < 50 else 20
    kd = {dd: kap_d(q, dd) for dd in range(-2, 3)}
    kap = sum(w[dd]*mp.mpf(q)**(-mp.mpf(dd)/2)*kd[dd] for dd in kd)
    mp.mp.dps = 30
    L = mp.log(q); delta = mp.acosh(cm/2)/L
    B2 = (cosh((0.5-delta)*L/2)/cosh((0.5+delta)*L/2))**2
    kq = kappa_quad(lambda s: mp.zeta(s)*(mp.mpf(q)**(s-0.5)+cm+mp.mpf(q)**(0.5-s))) if q < 50 else None
    out[f'tnr{q}'] = {'q': q, 'c': c, 'kappa': mp.nstr(kap, 18), 'kappa_d': {str(k_): mp.nstr(v, 18) for k_, v in kd.items()},
                      'kappa_quad_T150': mp.nstr(kq, 12) if kq is not None else None, 'delta': mp.nstr(delta, 12),
                      'first_offline': [mp.nstr(0.5+delta, 10), mp.nstr(mp.pi/L, 10)], 'C_on': out['zeta']['C_on'], 'floor': mp.nstr(1-B2, 12)}
    print(f'tnr{q}', out[f'tnr{q}'], flush=True)
# quadrature-only controls: zeta itself (check), E_a (a=1/4), U = zeta(s+i alpha) (alpha=1)
out['zeta']['kappa_quad_T150'] = mp.nstr(kappa_quad(mp.zeta), 12)
out['Ea_0.25'] = {'kappa_quad_T150': mp.nstr(kappa_quad(lambda s: mp.zeta(s+0.25)*mp.zeta(s-0.25)), 12)}
out['U_alpha1'] = {'kappa_quad_T150_one_sided_x2': None}
fU = lambda t: abs(mp.zeta(mp.mpc(0.5, t+1)))**2/((0.25+t*t)*(2.25+t*t))
mp.mp.dps = 15
out['U_alpha1'] = {'kappa_quad_T150': mp.nstr(3/(4*mp.pi)*mp.quad(fU, mp.linspace(-150, 150, 601)), 12)}
print(out['zeta'], out['Ea_0.25'], out['U_alpha1'])
json.dump(out, open('consts.json', 'w'), indent=1)
