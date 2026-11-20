# c16-qa-filter: numeric checks. mpmath only; no repo imports. Output: absolute path given as argv[1].
import sys, json, time
from mpmath import mp, mpf, mpc, zetazero, zeta, gamma, pi, cos, cosh, exp, log, sqrt, quad, diff, findroot, e as E_, re, im, fabs, linspace
mp.dps = 30
out = {}
t0 = time.time()
def xi(s): return mpf(1)/2*s*(s-1)*pi**(-s/2)*gamma(s/2)*zeta(s)
def mk(g1, g2, eta):
    gb = (g1+g2)/2; d = (g2-g1)/2
    def m(s):
        t2 = -(s-mpf(1)/2)**2
        return ((t2+gb**2+eta**2)**2 - 4*gb**2*t2)/((t2-g1**2)*(t2-g2**2))
    def Dens(L):
        return -4*exp(-L/2)*cos(gb*L)*(cosh(eta*L)-cos(d*L))
    def env(L):
        return 4*exp(-L/2)*(cosh(eta*L)-cos(d*L))
    return gb, d, m, Dens, env
Z = {n: zetazero(n).imag for n in (1,2,100,101,298,299,300,301,6709,6710)}
out['zeros'] = {str(k): str(v) for k,v in Z.items()}
print('zeros done', time.time()-t0, flush=True)

# A. defect density against the proved bound, three parameter sets
A = []
for (a,b,eta) in ((1,2,mpf('0.05')),(298,299,mpf('0.07')),(6709,6710,mpf('0.01'))):
    g1,g2 = Z[a],Z[b]; gb,d,m,Dens,env = mk(g1,g2,eta)
    quad_bound = 8*exp(-2)*(eta**2+d**2)/(mpf(1)/2-eta)**2
    bound = min(mpf(8), quad_bound)
    # envelope maximum on a fine grid in L, then |D| on a grid resolving cos(gb L) around the envelope maxima
    Ls = [mpf(k)/200 for k in range(1, 200*80)]
    ev = [(env(L), L) for L in Ls]
    emax, Lstar = max(ev)
    # resolved sup of |D|: 60 points per period of cos(gb L) over a window of 40 periods around the 5 largest envelope points
    top = sorted(ev, reverse=True)[:5]
    per = 2*pi/gb
    dmax = mpf(0); dmin = mpf(0)
    for (_, Lc) in top:
        for k in range(-1200, 1201):
            L = Lc + k*per/60
            if L <= 0: continue
            v = Dens(L)
            dmax = max(dmax, v); dmin = min(dmin, v)
    supD = max(dmax, -dmin)
    # Laplace identity at s0: sum over removed of 1/(s-rho) - sum over added of 1/(s-rho') against -m'/m by numerical derivative
    s0 = mpc('1.3','2')
    pf = sum(1/(s0-mpc(0.5, sg*g)) for g in (g1,g2) for sg in (1,-1)) - sum(1/(s0-mpc(0.5+se*eta, sg*gb)) for se in (1,-1) for sg in (1,-1))
    lhs = -diff(m, s0)/m(s0)
    # direct quadrature of the density for the low pair only (oscillation too fast otherwise)
    dq = None
    if a == 1:
        f = lambda L: exp(-(s0-1)*L)*Dens(L)
        dq = quad(f, linspace(0, 120, 241))
    A.append(dict(pair=[a,b], eta=str(eta), d=str(d), gbar=str(gb), envelope_max=str(emax), L_at_max=str(Lstar),
                  sup_abs_D_resolved=str(supD), D_min=str(dmin), D_max=str(dmax), quadratic_bound=str(quad_bound), bound_used=str(bound),
                  ratio_sup_over_bound=str(supD/bound), holds=bool(supD <= bound and emax <= bound),
                  laplace_partial_fractions_vs_minus_mprime_over_m=str(fabs(pf-lhs)), value_size=str(fabs(lhs)),
                  laplace_direct_quadrature_defect=(str(fabs(dq-lhs)) if dq is not None else 'not run (oscillation)'),
                  m_at_1=str(m(mpf(1))), sup_m_minus_1_on_Re2=str(max(fabs(m(mpc(2,t))-1) for t in [gb+mpf(k)/20 for k in range(-400,401)]))))
    print('A', a, b, time.time()-t0, flush=True)
out['A_defect_density_vs_bound'] = A

# B. Lemma R: compound multiplier with residue factor m(1) = 1 exactly
g1,g2 = Z[298],Z[299]; eta = mpf('0.07'); gb,d,m1,Dens1,env1 = mk(g1,g2,eta)
g3,g4 = Z[300],Z[301]
target = 1/m1(mpf(1))
def fac(delta): return ((mpf(1)/4+(g3-delta)**2)*(mpf(1)/4+(g4-delta)**2))/((mpf(1)/4+g3**2)*(mpf(1)/4+g4**2))
delta = findroot(lambda x: fac(x)-target, mpf('1e-5'))
h3,h4 = g3-delta, g4-delta
def m2(s):
    t2 = -(s-mpf(1)/2)**2
    return ((t2-h3**2)*(t2-h4**2))/((t2-g3**2)*(t2-g4**2))
mc = lambda s: m1(s)*m2(s)
def D2(L): return 2*exp(-L/2)*(cos(g3*L)+cos(g4*L)-cos(h3*L)-cos(h4*L))
env2 = max(4*exp(-L/2)*2*fabs(mp.sin(delta*L/2)) for L in [mpf(k)/100 for k in range(1,4000)])
sp = mpc('0.3','17.7')
qz = mpc(0.5+eta, gb)
out['B_compound_residue'] = dict(delta=str(delta), m_compound_at_1_minus_1=str(mc(mpf(1))-1), m_ZQ_at_1_minus_1=str(m1(mpf(1))-1),
    symmetry_defect=str(fabs(mc(sp)-mc(1-sp))), abs_m_compound_at_quartet_point=str(fabs(mc(qz))),
    envelope_bound_second_density=str(env2), proved_bound_8delta_over_e=str(8*delta/E_), limit_at_infinity=str(fabs(mc(mpc(1e6,3))-1)),
    moved_zeros_distinct_from_zeta_zeros=str(min(fabs(h3-g3), fabs(h4-g4))))
print('B', time.time()-t0, flush=True)

# C. Lemma C: sup |m - 1| on a compact box, and on full horizontal lines (the heat-flow average), as the pair moves up
C = []
for (a,b) in ((100,101),(298,299),(6709,6710)):
    g1,g2 = Z[a],Z[b]; eta = mpf('0.25'); gb,d,m,_,_ = mk(g1,g2,eta)
    box = max(fabs(m(mpc(sig,t))-1) for sig in [mpf(k)/4 for k in range(-6,11)] for t in [mpf(k) for k in range(0,51,2)])
    line = max(fabs(m(mpc(mpf(1)/2-y, z))-1) for z in (mpf(0),mpf(25),mpf(50)) for y in [mpf(k)/2 for k in range(-2000,2001)])
    zz = mpf(50)
    lane_bound = (eta**2+d**2)*((2*zz**2+2*gb**2+1)/(g1**2-zz**2)**2 + 1/(2*(g1**2-zz**2)))
    C.append(dict(pair=[a,b], gbar=str(gb), d=str(d), eta='0.25', sup_box=str(box), sup_three_horizontal_lines=str(line),
                  proved_line_bound_z_le_50=str(lane_bound), leading_2_eta2_d2_over_gbar2=str(2*(eta**2+d**2)/gb**2), holds=bool(line <= lane_bound)))
out['C_compact_closeness'] = C
print('C', time.time()-t0, flush=True)

# D. kernel closeness: weighted L1 norms of xi(1/2+iz)(m(z)-1) against those of xi, pair 298,299, eta 0.07
g1,g2 = Z[298],Z[299]; eta = mpf('0.07'); gb,d,m,_,_ = mk(g1,g2,eta)
D_ = {}
for k in (0,2,4):
    num = quad(lambda z: z**k*fabs(xi(mpc(0.5,z)))*fabs(m(mpc(0.5,z))-1), linspace(0,80,41))
    den = quad(lambda z: z**k*fabs(xi(mpc(0.5,z))), linspace(0,80,41))
    D_['k=%d'%k] = dict(int_xi_absm1=str(num), int_xi=str(den), ratio=str(num/den))
# contribution of the neighbourhood of the removed pair: sup of |xi (m-1)| on [g1-1, g2+1]
near = max(fabs(xi(mpc(0.5,z))*(m(mpc(0.5,z))-1)) for z in [g1-1+mpf(k)*(g2-g1+2)/400+mpf('1e-7') for k in range(401)])
D_['sup_abs_xi_times_m_minus_1_near_removed_pair'] = str(near)
D_['abs_xi_at_gbar'] = str(fabs(xi(mpc(0.5,gb))))
out['D_kernel_closeness'] = D_
print('D', time.time()-t0, flush=True)

# F. Lemma J2: log-jet of order 3 of the kernel is unchanged by the heat factor
def Phi(u): return sum((2*pi**2*n**4*exp(9*u)-3*pi*n**2*exp(5*u))*exp(-pi*n**2*exp(4*u)) for n in range(1,30))
F = []
for tau in (mpf('-0.5'), mpf('-0.1')):
    for u in (mpf('0.05'), mpf('0.2'), mpf('0.4')):
        K = lambda v: log(Phi(v)); Kh = lambda v: tau*v**2/4 + log(Phi(v))
        F.append(dict(tau=str(tau), u=str(u), d3_diff=str(fabs(diff(K,u,3)-diff(Kh,u,3))), d2_shift_minus_tau_over_2=str(fabs(diff(Kh,u,2)-diff(K,u,2)-tau/2)), d3=str(diff(K,u,3))))
out['F_log_jet'] = F
print('F', time.time()-t0, flush=True)

# G. ZQ on the scattering carrier M(u) = f(u)/f(u+1), f = xi m: cocycle, unitarity, Schur sample, zero at the quartet point
g1,g2 = Z[1],Z[2]; eta = mpf('0.3'); gb,d,m,_,_ = mk(g1,g2,eta)
f = lambda u: xi(u)*m(u)
M = lambda u: f(u)/f(u+1)
Mz = lambda u: xi(u)/xi(u+1)
u0 = mpc('0.37','11.3')
G = dict(f_symmetry_defect=str(fabs(f(u0)-f(1-u0))/fabs(f(u0))), cocycle_defect=str(fabs(M(u0)*M(-u0)-1)),
         unitarity_on_axis=str(max(fabs(fabs(M(mpc(0,t)))-1) for t in (mpf('3.3'),mpf('17.5'),mpf('40.1')))),
         abs_M_at_quartet_point=str(fabs(M(mpc(0.5+eta,gb)))), abs_Mzeta_at_quartet_point=str(fabs(Mz(mpc(0.5+eta,gb)))))
grid = [mpc(x,y) for x in [mpf(k)/20 for k in range(1,61)] for y in [mpf(10)+mpf(k)/4 for k in range(0,61)]]
G['sup_abs_M_ZQ_grid'] = str(max(fabs(M(u)) for u in grid)); G['sup_abs_M_zeta_grid'] = str(max(fabs(Mz(u)) for u in grid))
# real axis: m > 0 and r = m(u)/m(u+1) > 0
G['min_r_on_real_axis'] = str(min(re(m(mpf(k)/10)/m(mpf(k)/10+1)) for k in range(1,400)))
out['G_scattering_carrier'] = G
print('G', time.time()-t0, flush=True)

# E. critical-line positivity of the discrete multipliers for every lift value z
q = 1+sqrt(2); c = mpf('2.1')
mn = min(re(c + 2*re(mp.expjpi(2*mpf(j)/16).conjugate()*q**mpc(0,t))) for j in range(16) for t in [mpf(k)/7 for k in range(0,700)])
bz = mp.acosh(c/2)/log(q)
zs = []
for j in (0, 3, 8):
    zz = mp.expjpi(2*mpf(j)/16)
    mz = lambda s: zz.conjugate()*q**(s-mpf(1)/2) + c + zz*q**(mpf(1)/2-s)
    # zero: q^(s-1/2) = zz*y, y = (-c - sqrt(c^2-4))/2  (real negative, |y| > 1)
    y = (-c - sqrt(c**2-4))/2
    s_z = mpf(1)/2 + (log(-y) + mpc(0,1)*(mp.arg(zz) + pi))/log(q)
    zs.append(dict(arg_z=str(mp.arg(zz)), zero=str(s_z), abs_m_at_zero=str(fabs(mz(s_z))), re_minus_half=str(re(s_z)-mpf(1)/2)))
out['E_discrete_multiplier_line_positivity'] = dict(min_over_grid=str(mn), c_minus_2=str(c-2), b=str(bz), zeros_for_three_lift_values=zs)
out['seconds'] = time.time()-t0
json.dump(out, open(sys.argv[1], 'w'), indent=1)
print(json.dumps(out, indent=1))
