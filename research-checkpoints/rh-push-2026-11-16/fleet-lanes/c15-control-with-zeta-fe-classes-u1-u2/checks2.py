# supplement: NR-q with the zero inside the strip (c < q^1/2 + q^-1/2), l1 mass of the off-integer coefficients,
# and the DH5e zero list restricted to the open strip.
import json, mpmath as mp
mp.mp.dps=30
gam=lambda s: mp.pi**(-s/2)*mp.gamma(s/2)
def winding(f,c,r,n=400):
    tot=0; prev=f(c+r)
    for k in range(1,n+1):
        cur=f(c+r*mp.expj(2*mp.pi*k/n)); tot+=mp.arg(cur/prev); prev=cur
    return float(tot/(2*mp.pi))
pts=[mp.mpc('0.3','7.7'), mp.mpc('1.7','-33.1'), mp.mpc('-2.4','15.2')]
out={}
q=1+mp.sqrt(2); c=mp.mpf('2.1')
m=lambda s: q**(s-mp.mpf(1)/2)+c+q**(mp.mpf(1)/2-s)
G=lambda s: mp.zeta(s)*m(s)
b=mp.acosh(c/2)/mp.log(q); z0=mp.mpc(mp.mpf(1)/2+b, mp.pi/mp.log(q))
out['NRq_q_1+sqrt2_c_2.1']={'c_max_for_strip': float(mp.sqrt(q)+1/mp.sqrt(q)),
 'fe_defect_max': float(max(abs(G(u)*gam(u)-G(1-u)*gam(1-u))/abs(G(u)*gam(u)) for u in pts)),
 'offline_zero':[float(z0.real),float(z0.imag)], 'absG_at_zero': float(abs(G(z0))), 'winding': winding(G,z0,mp.mpf('0.05')),
 'l1_mass_off_integer_over_integer_coefficient': float((mp.sqrt(q)+1/mp.sqrt(q))/c),
 'log_coefficient_modulus_per_step_at_q': float(mp.e**(mp.acosh(c/2))*mp.sqrt(q))}
chi=[0,1,-1,-1,1]
def Gd(s,t=1): return 5**(s/2)*mp.dirichlet(s,chi)+t*(5**(s/2)+5**((1-s)/2))*mp.zeta(s)
mp.mp.dps=20; found=[]
for tt in range(2,100):
    for sg in ('0.65','0.85','1.1'):
        try: z=mp.findroot(Gd, mp.mpc(sg,tt), tol=1e-15, maxsteps=30)
        except Exception: continue
        if 0.501<z.real<1 and 1<z.imag<110 and abs(Gd(z))<1e-12 and all(abs(z-w)>1e-6 for w in found): found.append(z)
mp.mp.dps=30
out['DH5e_t_1_offline_zeros_in_strip']=[[float(z.real),float(z.imag),winding(Gd,z,mp.mpf('0.02')),winding(Gd,1-z.conjugate(),mp.mpf('0.02'))] for z in sorted(found,key=lambda z:z.imag)]
json.dump(out,open(__file__.replace('checks2.py','checks2.json'),'w'),indent=1); print(json.dumps(out,indent=1))
