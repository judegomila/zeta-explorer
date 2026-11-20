# Controls with zeta's own functional equation: ZQ (zero-quartet multiplier), SG (real-zero twin),
# NR-q (symmetric multiplier at a non-integer base), DH5e (self-dual combination, frequencies n/sqrt5).
import json, mpmath as mp
mp.mp.dps = 30
out = {}
def gam(s): return mp.pi**(-s/2)*mp.gamma(s/2)
def t2(s): return -(s-mp.mpf(1)/2)**2          # t^2 with s = 1/2 + it
def m_zq(s, g1, g2, eta):
    gb=(g1+g2)/2; T=t2(s)
    return ((T+gb**2+eta**2)**2-4*gb**2*T)/((T-g1**2)*(T-g2**2))
def m_zq_closed(s, g1, g2, eta):
    gb=(g1+g2)/2; d=(g2-g1)/2; T=t2(s)
    return 1+(eta**2+d**2)*(2*T+2*gb**2+eta**2-d**2)/((T-g1**2)*(T-g2**2))
def D_zq(x, g1, g2, eta):
    gb=(g1+g2)/2; d=(g2-g1)/2; L=mp.log(x)
    return -4*x**(-mp.mpf(1)/2)*mp.cos(gb*L)*(mp.cosh(eta*L)-mp.cos(d*L))
def winding(f, c, r, n=400):
    tot=0; prev=f(c+r)
    for k in range(1,n+1):
        cur=f(c+r*mp.expj(2*mp.pi*k/n)); tot+=mp.arg(cur/prev); prev=cur
    return float(tot/(2*mp.pi))
pts=[mp.mpc('0.3','7.7'), mp.mpc('1.7','-33.1'), mp.mpc('-2.4','15.2'), mp.mpc('0.81','18.0')]

def run_zq(tag, g1, g2, eta, do_ls=True):
    r={}; gb=(g1+g2)/2; d=(g2-g1)/2
    G=lambda s: mp.zeta(s)*m_zq(s,g1,g2,eta)
    r['gamma1']=mp.nstr(g1,20); r['gamma2']=mp.nstr(g2,20); r['eta']=float(eta); r['half_gap_d']=float(d)
    r['fe_defect_max']=float(max(abs(G(s)*gam(s)-G(1-s)*gam(1-s))/abs(G(s)*gam(s)) for s in pts))
    r['closed_form_m_defect']=float(max(abs(m_zq(s,g1,g2,eta)-m_zq_closed(s,g1,g2,eta)) for s in pts))
    r['G_at_2']=mp.nstr(G(2),15); r['zeta_at_2']=mp.nstr(mp.zeta(2),15)
    z0=mp.mpc(mp.mpf(1)/2+eta, gb)
    r['offline_zero']=[float(z0.real), mp.nstr(gb,20)]
    r['absG_at_offline_zero']=float(abs(G(z0)))
    r['absGprime_at_offline_zero']=float(abs(mp.diff(G,z0)))
    rad=min(eta/2, mp.mpf('0.2'))
    r['winding_offline_zero']=winding(G,z0,rad)
    r['winding_mirror_zero']=winding(G,mp.mpc(mp.mpf(1)/2-eta,gb),rad)
    r['winding_removed_gamma1']=winding(G,mp.mpc(0.5,g1),min(d/2,mp.mpf('0.2')))
    r['winding_removed_gamma2']=winding(G,mp.mpc(0.5,g2),min(d/2,mp.mpf('0.2')))
    r['winding_zeta_gamma1']=winding(mp.zeta,mp.mpc(0.5,g1),min(d/2,mp.mpf('0.2')))
    # defect density D(x) of Lambda_G - Lambda
    Ls=[mp.mpf(k)/200 for k in range(1,200*60)]
    sup=max(abs(D_zq(mp.e**L,g1,g2,eta)) for L in Ls)
    r['sup_abs_D_grid_logx_le_60']=float(sup)
    r['sup_abs_D_bound']=float(8*mp.e**-2*(eta**2+d**2)/(mp.mpf(1)/2-eta)**2)
    r['min_D']=float(min(D_zq(mp.e**L,g1,g2,eta) for L in Ls)); r['max_D']=float(max(D_zq(mp.e**L,g1,g2,eta) for L in Ls))
    for sg in (1,2):
        s=mp.mpc(sg,gb+1)
        r['abs_m_minus_1_at_%d_plus_i(gbar+1)'%sg]=float(abs(m_zq(s,g1,g2,eta)-1))
    r['sup_abs_m_minus_1_on_Re_2']=float(max(abs(m_zq(mp.mpc(2,gb+mp.mpf(k)/20),g1,g2,eta)-1) for k in range(-400,401)))
    if do_ls:
        s=mp.mpc(2,3)
        lhs=-mp.diff(lambda u: mp.log(m_zq(u,g1,g2,eta)), s)
        # exact Laplace form of the density: sum_old 1/(s-rho) - sum_new 1/(s-rho')
        old=[mp.mpc(0.5,g1),mp.mpc(0.5,-g1),mp.mpc(0.5,g2),mp.mpc(0.5,-g2)]
        new=[mp.mpc(0.5+eta,gb),mp.mpc(0.5-eta,gb),mp.mpc(0.5+eta,-gb),mp.mpc(0.5-eta,-gb)]
        rhs=sum(1/(s-o) for o in old)-sum(1/(s-n) for n in new)
        r['ls_identity_defect_partial_fractions']=float(abs(lhs-rhs))
        # density from partial fractions equals closed form D
        x=mp.mpf(7)
        dens=sum(x**(o-1) for o in old)-sum(x**(n-1) for n in new)
        r['density_closed_form_defect']=float(abs(dens-D_zq(x,g1,g2,eta)))
        if g2<30:
            quad=mp.quadosc(lambda L: (mp.e**(-(s-1)*L)*D_zq(mp.e**L,g1,g2,eta)).real, [0,mp.inf], omega=gb) \
               +1j*mp.quadosc(lambda L: (mp.e**(-(s-1)*L)*D_zq(mp.e**L,g1,g2,eta)).imag, [0,mp.inf], omega=gb)
            r['ls_identity_defect_quadrature']=float(abs(lhs-quad))
    # residues of 1/m at the new zeros: size constant C_E of the density of 1/G - sum mu(n) n^-s
    CE=0
    for n in [mp.mpc(0.5+eta,gb),mp.mpc(0.5-eta,gb),mp.mpc(0.5+eta,-gb),mp.mpc(0.5-eta,-gb)]:
        CE+=abs(1/mp.diff(lambda u: m_zq(u,g1,g2,eta), n))
    r['C_E_sum_abs_residues_of_1_over_m']=float(CE)
    out[tag]=r

g=[mp.zetazero(k).imag for k in (1,2)]
run_zq('ZQ_pair_1_2_eta_0.3', g[0], g[1], mp.mpf('0.3'))
run_zq('ZQ_pair_1_2_eta_0.05', g[0], g[1], mp.mpf('0.05'))
gl=[mp.zetazero(k).imag for k in (6709,6710)]
run_zq('ZQ_lehmer_6709_6710_eta_0.01', gl[0], gl[1], mp.mpf('0.01'))
run_zq('ZQ_lehmer_6709_6710_eta_0.25', gl[0], gl[1], mp.mpf('0.25'))

# zeta in the family only at defect 0: m == 1 iff (eta^2+d^2)=0; eta -> 0 at fixed pair gives a double zero on the line
g1,g2=g; gb=(g1+g2)/2
out['defect_zero_only']={'m_minus_1_coefficient_eta0': float(((g2-g1)/2)**2),
  'abs_G_at_half_plus_i_gbar_eta0': float(abs(mp.zeta(mp.mpc(0.5,gb))*m_zq(mp.mpc(0.5,gb),g1,g2,mp.mpf(0)))),
  'winding_double_zero_eta0': winding(lambda s: mp.zeta(s)*m_zq(s,g1,g2,mp.mpf(0)), mp.mpc(0.5,gb), mp.mpf('0.2')),
  'sup_abs_m_minus_1_Re2_eta0': float(max(abs(m_zq(mp.mpc(2,mp.mpf(k)/10),g1,g2,mp.mpf(0))-1) for k in range(-600,601)))}

# SG: real-zero twin  m = (t^2 + b^2)/(t^2 - g1^2), zeros at 1/2 +- b ; D = -2 x^-1/2 (cosh(b L) - cos(g1 L)) <= 0
b=mp.mpf('0.3')
m_sg=lambda s: (t2(s)+b**2)/(t2(s)-g1**2)
Gs=lambda s: mp.zeta(s)*m_sg(s)
D_sg=lambda L: -2*mp.e**(-L/2)*(mp.cosh(b*L)-mp.cos(g1*L))
Ls=[mp.mpf(k)/200 for k in range(1,200*60)]
s=mp.mpc(2,3)
out['SG_b_0.3']={'fe_defect_max': float(max(abs(Gs(u)*gam(u)-Gs(1-u)*gam(1-u))/abs(Gs(u)*gam(u)) for u in pts)),
  'abs_G_at_0.8': float(abs(Gs(mp.mpf('0.8')))), 'winding_at_0.8': winding(Gs, mp.mpf('0.8'), mp.mpf('0.1')),
  'max_D_grid': float(max(D_sg(L) for L in Ls)), 'min_D_grid': float(min(D_sg(L) for L in Ls)),
  'ls_defect': float(abs(-mp.diff(lambda u: mp.log(m_sg(u)), s) - (1/(s-mp.mpc(0.5,g1))+1/(s-mp.mpc(0.5,-g1))-1/(s-0.5-b)-1/(s-0.5+b))))}

# NR-q: m = q^(s-1/2) + c + q^(1/2-s), q = 1+sqrt2 (no power of q is rational)
q=1+mp.sqrt(2); c=mp.mpf('2.2')
m_nr=lambda s: q**(s-mp.mpf(1)/2)+c+q**(mp.mpf(1)/2-s)
Gn=lambda s: mp.zeta(s)*m_nr(s)
bq=mp.acosh(c/2)/mp.log(q); z0=mp.mpc(mp.mpf(1)/2+bq, mp.pi/mp.log(q))
# generalised Dirichlet series check at s=3: sum over n of (q^-1/2 (n/q)^-s + c n^-s + q^1/2 (n q)^-s)
s3=mp.mpf(3)
ser=mp.nsum(lambda n: q**-0.5*(n/q)**-s3 + c*n**-s3 + q**0.5*(n*q)**-s3, [1,mp.inf])
out['NRq_q_1+sqrt2_c_2.2']={'fe_defect_max': float(max(abs(Gn(u)*gam(u)-Gn(1-u)*gam(1-u))/abs(Gn(u)*gam(u)) for u in pts)),
  'offline_zero': [float(z0.real), float(z0.imag)], 'absG_at_zero': float(abs(Gn(z0))), 'winding': winding(Gn,z0,mp.mpf('0.05')),
  'series_defect_at_3': float(abs(ser-Gn(s3))), 'coefficient_on_integers': float(c),
  'log_coefficient_modulus_at_q^k_per_k (r q^1/2)': float(mp.e**(mp.acosh(c/2))*mp.sqrt(q)), 'q^(1/2)': float(mp.sqrt(q))}

# DH5e: 5^(s/2) L(s,chi5) + t (5^(s/2) + 5^((1-s)/2)) zeta(s): exact FE of zeta, frequencies n/sqrt5 and n sqrt5, no Euler product
chi=[0,1,-1,-1,1]
L5=lambda s: mp.dirichlet(s,chi)
def Gd(s,t=1): return 5**(s/2)*L5(s)+t*(5**(s/2)+5**((1-s)/2))*mp.zeta(s)
r={'fe_defect_max': float(max(abs(Gd(u)*gam(u)-Gd(1-u)*gam(1-u))/abs(Gd(u)*gam(u)) for u in pts)),
   'fe_defect_L5_alone': float(max(abs(5**(u/2)*L5(u)*gam(u)-5**((1-u)/2)*L5(1-u)*gam(1-u))/abs(5**(u/2)*L5(u)*gam(u)) for u in pts))}
found=[]
mp.mp.dps=20
for tt in range(2,80):
    for sg in ('0.75','1.1'):
        try:
            z=mp.findroot(Gd, mp.mpc(sg,tt), tol=1e-15, maxsteps=30)
        except Exception: continue
        if abs(z.real-0.5)>1e-3 and 0<z.imag<90 and abs(Gd(z))<1e-12 and all(abs(z-w)>1e-6 for w in found):
            found.append(z)
mp.mp.dps=30
r['offline_zeros_found']=[[float(z.real),float(z.imag),winding(Gd,z,mp.mpf('0.02'))] for z in sorted(found,key=lambda z:z.imag)[:8]]
out['DH5e_t_1']=r
import os; json.dump(out,open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'checks.json'),'w'),indent=1)
print(json.dumps(out,indent=1))
