# Markdown tables for combination 1 from the h5an JSON. usage: h5tables.py h5an.json
import json,sys
r=json.load(open(sys.argv[1])); R=r['real']
decs=[k for k in ('1e4','1e6','1e8','1e10','1e12') if k in R['0.51']['zeta']['at_decades']]
def row(lbl,v):
    return '| %s | %s | %.4f | %.4f (Y = %.3g) | %.4f (Y = %.3g) |'%(lbl,' | '.join('%.4f'%v['at_decades'][k] for k in decs),v['final'],v['sup'],v['Y_at_sup'],v['inf'],v['Y_at_inf'])
names=[('zeta','zeta: sum p^-s - E'),('liouville_primes(-zeta)','Liouville on primes: -(zeta row)'),('chi4','chi_4'),('chi3','chi_3'),('chi5_re','Re chi_5'),('chi5_im','Im chi_5'),
 ('eps_random_sign','random sign eps_p'),('THIN_b0.8(all-2S1-E)','THIN b = 0.8'),('DEL_b0.8(all-S2-E)','DEL b = 0.8'),('S1_minus_own_main','thin set S1, own main term removed'),
 ('TNR_q3_c2.2','T-NR q = 3, c = 2.2'),('TNR_q3_c2.02','T-NR q = 3, c = 2.02'),('TNR_q1000003_c2.2','T-NR q = 1000003, c = 2.2')]
print('Ymax = %.6g (X = %d)\n'%(r['Ymax'],r['X']))
for s in ('0.51','0.55','0.6','0.75'):
    print('sigma = %s\n'%s)
    print('| family | '+' | '.join('Y = '+k for k in decs)+' | Y = Ymax | sup over 2 <= Y <= Ymax | inf |')
    print('|---|'+'---|'*(len(decs)+3))
    for k,l in names: print(row(l,R[s][k]))
    print()
print('| sigma | limit D(inf) = Re[P(sigma) + Ei((1-sigma) log 2)] | D(Ymax) | theta_eff of the tail | decade maxima of abs(D - limit) log Y at 1e4, 1e8, 1e12 |\n|---|---|---|---|---|')
for s in ('0.51','0.55','0.6','0.75'):
    v=R[s]['zeta']; dm=v['decade_max_abs_tail_times_logY']
    print('| %s | %.6f | %.6f | %.3f | %s |'%(s,v['ref'],v['final'],v['theta_eff'],', '.join('%.3g'%dm[k] for k in ('1e4','1e8','1e12') if k in dm)))
print()
v=R['0.45']['zeta']; print('sigma = 0.45 (zeta): D at decades '+', '.join('%s: %.4f'%(k,v['at_decades'][k]) for k in decs)+'; final %.4f; sup %.4f at Y = %.3g'%(v['final'],v['sup'],v['Y_at_sup']))
v=R['EA']['EA_a0.15_sigma0.6_ownpoles']; print('E_a (a = 0.15, sigma = 0.6, both poles removed): '+', '.join('%s: %.4f'%(k,v['at_decades'][k]) for k in decs)+'; final %.4f; sup %.4f at Y = %.3g'%(v['final'],v['sup'],v['Y_at_sup']))
print()
C=r['complex']; dk=[k for k in ('1e2','1e4','1e6','1e8','1e10','1e12') if k in C['zeta']['at_decades']]
print('| family | '+' | '.join('Y = '+k for k in dk)+' | Y = Ymax | sup over Y (Y, sigma, t at the sup) |')
print('|---|'+'---|'*(len(dk)+2))
for n,l in (('zeta','zeta'),('chi4','chi_4'),('eps','random sign'),('THIN','THIN b = 0.8'),('DEL','DEL b = 0.8'),('TNR_q3_c2.2','T-NR q = 3, c = 2.2')):
    v=C[n]; print('| %s | %s | %.3f | %.3f (%.3g, %s, %s) |'%(l,' | '.join('%.3f'%v['at_decades'][k] for k in dk),v['final'],v['sup'],v['Y_at_sup'],v['sigma_at_sup'],v['t_at_sup']))
print()
print('| sigma | t | v_Y(s) at Ymax | limit Re[P(s) + Ei((1-s) log 2)] | difference |\n|---|---|---|---|---|')
for c in r['limit_check']: print('| %.2f | %.2f | %.7f | %.7f | %.1e |'%(c['sigma'],c['t'],c['vY'],c['limit'],c['vY']-c['limit']))
