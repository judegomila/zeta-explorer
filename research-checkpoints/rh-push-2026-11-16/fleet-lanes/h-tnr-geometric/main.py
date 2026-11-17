# controls for the geometric-arithmetic program: kernels, zeros, lens, sector forms, Hecke action
import json, sys, math, mpmath as mp
from common import *
setup(30)
R = {}
def ns(x, n=8): return mp.nstr(x, n)
lq = mp.log(Q); A_EA = mp.mpf('0.3')
# ---------- 1. loaded kernels kappa_X(u):  F(z) = int kappa(u) e^{zu/2} du ----------
def Phi1(t):
    s = mp.mpf(0)
    for n in range(1, 40):
        e4 = mp.e**(4*t); term = (2*mp.pi**2*n**4*mp.e**(9*t) - 3*mp.pi*n*n*mp.e**(5*t))*mp.e**(-mp.pi*n*n*e4)
        s += term
        if mp.pi*n*n*e4 > 120: break
    return s
kz = lambda u: Phi1(abs(u)/4)   # kappa is even; the series is used on u >= 0 only
_c = {}
def kzc(u):
    if u not in _c: _c[u] = kz(u)
    return _c[u]
def kNR(c): return lambda u: kz(u+2*lq)+kz(u-2*lq)+c*kz(u)
def kEA(u):   # convolution of e^{av/2}kappa(v) and e^{-aw/2}kappa(w)
    h = mp.mpf(1)/16     # trapezoid: integrand analytic with double-exponential decay
    return h*sum(kzc(i*h)*kz(u-i*h)*mp.e**(A_EA*(2*i*h-u)/2) for i in range(-128,129))
def kDH(u):
    u = abs(u); x = mp.e**u; a = [0, 1, kap(), -kap(), -1]; s = mp.mpf(0)
    for n in range(1, 400):
        if n%5==0: continue
        cc = mp.pi*n*n*x/5; s += n*a[n%5]*mp.e**(-cc)
        if cc > 120: break
    return mp.e**(3*u/4)*s
kernels = {'zeta':kz, 'DH':kDH, 'NR':kNR(mp.mpf('2.2')), 'NRt':kNR(mp.mpf(1)), 'NR-':kNR(mp.mpf('-2.2')), 'EA':kEA}
# normalisation check: int kappa e^{zu/2} du / F(z)
zt = mp.mpc('0.3','4.0'); chk={}
for lab in ['zeta','DH','NR','NRt','EA']:
    F,_ = get(lab)
    hh = mp.mpf(1)/8; I = hh*sum(kernels[lab](i*hh)*mp.e**(zt*i*hh/2) for i in range(-112,113))
    chk[lab] = ns(I/F(zt), 12)
R['kernel_transform_over_F_at_0.3+4i'] = chk
print(chk, flush=True)
kr = {}
for lab,k in kernels.items():
    h = mp.mpf('0.05'); us = [h*i for i in range(0, 161)]     # u in [0,8]
    vals = [k(u) for u in us]
    lv = [mp.log(v) if v > 0 else None for v in vals]
    d2 = [ (lv[i+1]-2*lv[i]+lv[i-1])/h**2 for i in range(1,len(us)-1) if None not in (lv[i-1],lv[i],lv[i+1]) ]
    # Csordas-type: V(t) = -log kappa(sqrt t) convex in t  <=>  d/du( -(log k)'(u)/u ) >= 0 ; test (log k)'/u decreasing
    g = [ (lv[i+1]-lv[i-1])/(2*h)/us[i] for i in range(1,len(us)-1) if None not in (lv[i-1],lv[i+1]) ]
    nmax = sum(1 for i in range(1,len(vals)-1) if vals[i]>vals[i-1] and vals[i]>vals[i+1])
    kr[lab] = dict(min_kappa=ns(min(vals)), kappa0=ns(vals[0]), positive=bool(min(vals)>0),
        max_second_diff_log=ns(max(d2)) if d2 else None, log_concave=bool(d2 and max(d2)<=0),
        csordas_convex=bool(all(g[i+1] <= g[i] for i in range(len(g)-1))) if min(vals)>0 else False,
        interior_local_maxima=nmax)
    print(lab, kr[lab], flush=True)
R['kernel_properties_u_in_[0,8]'] = kr
# ---------- 2. zeros: off-line zeros in Re z>0, 0<Im z<T ----------
zr = {}
d0 = mp.acosh(mp.mpf('1.1'))/lq
zr['NR_predicted'] = dict(delta0=ns(d0,12), re_s=ns(mp.mpf(1)/2+d0,12), heights=[ns(mp.pi*(2*k+1)/lq,10) for k in range(6)])
Fn,_ = get('NR'); zr['NR_findroot'] = ns(mp.findroot(Fn, mp.mpc(0.4,2.9)), 12)
Fe,_ = get('EA'); g1 = mp.im(mp.zetazero(1)); zr['EA_findroot'] = ns(mp.findroot(Fe, mp.mpc(0.3,14.1)),12); zr['EA_predicted'] = '0.3 + i*gamma_n (assuming gamma_n on the line), first %s' % ns(g1,12)
zr['DH_findroot'] = [ns(mp.findroot(dh, mp.mpc('0.808517','85.699348'))-mp.mpf(1)/2,12), ns(mp.findroot(dh, mp.mpc('0.650830','114.163343'))-mp.mpf(1)/2,12)]
# argument principle: number of zeros in the box  eps<Re z<3, 0.3<Im z<T
def count(L, T, eps=mp.mpf('0.03'), X=mp.mpf(3), y0=mp.mpf('0.3')):
    mp.mp.dps = 18
    seg = lambda a,b,n: mp.quad(lambda t: L(a+(b-a)*t)*(b-a), mp.linspace(0,1,n+1))
    tot = seg(mp.mpc(eps,y0), mp.mpc(X,y0), 4) + seg(mp.mpc(X,y0), mp.mpc(X,T), int(T)) + seg(mp.mpc(X,T), mp.mpc(eps,T), 4) + seg(mp.mpc(eps,T), mp.mpc(eps,y0), int(4*T))
    mp.mp.dps = 30
    return tot/(2j*mp.pi)
for lab,T in [('zeta',60),('NR',60),('NRt',60),('EA',60)]:   # DH count: count_dh.py
    _,L = get(lab); v = count(L, mp.mpf(T)); zr['N_right_'+lab+'_T%s'%T] = ns(v,8); print(lab, 'N_right', ns(v,8), flush=True)
R['zeros'] = zr
# ---------- 3. lens  Q(z) = Re L(z)/Re z, and bridge sector forms on 6 real nodes ----------
lens = {}
pts = {'zeta':[mp.mpc(0.2,g1), mp.mpc(0.15,2.86), mp.mpc(0.15,85.7)], 'NR':[mp.mpc(d0/2, mp.pi/lq)], 'NRt':[mp.mpc(0.2, mp.acos(-mp.mpf(1)/2)/lq), mp.mpc(0.2, mp.pi/lq)],
       'EA':[mp.mpc(0.15,g1)], 'DH':[mp.mpc(0.154,'85.699348'), mp.mpc(0.075,'114.163343')]}
for lab,ps in pts.items():
    _,L = get(lab); lens[lab] = [dict(z=ns(p,8), Q=ns(mp.re(L(p))/mp.re(p),8)) for p in ps]
R['lens_Q=ReL/Rez'] = lens; print(lens, flush=True)
mp.mp.dps = 60
sect = {}
xs = [mp.mpf('0.6')*mp.mpf('1.3')**k for k in range(7)]
for lab in ['zeta','DH','NR','NRt','EA']:
    _,L = get(lab)
    Ls = [mp.re(L(x)) for x in xs]; Lp = [mp.re(mp.diff(L, x)) for x in xs]; n=len(xs)
    P = mp.matrix(n,n); B = mp.matrix(n,n)
    for i in range(n):
        for j in range(n):
            P[i,j] = (Ls[i]+Ls[j])/(xs[i]+xs[j]); B[i,j] = -Lp[i] if i==j else -(Ls[i]-Ls[j])/(xs[i]-xs[j])
    def mineig(M):
        d = [mp.sqrt(abs(M[i,i])) for i in range(n)]
        Nn = mp.matrix(n,n)
        for i in range(n):
            for j in range(n): Nn[i,j] = M[i,j]/(d[i]*d[j])
        E = mp.eigsy(Nn, eigvals_only=True); return min(E), sum(1 for e in E if e < -mp.mpf(10)**(-45))
    out = {}
    for nm,M in [('P',P),('K_e=P+B',P+B),('K_o=P-B',P-B)]:
        m,neg = mineig(M); out[nm] = dict(min_normalised_eig=ns(m,6), n_negative=neg)
    sect[lab] = out; print(lab, out, flush=True)
R['sector_forms_7_geometric_real_nodes'] = sect
mp.mp.dps = 30
json.dump(R, open('main.json','w'), indent=1)
