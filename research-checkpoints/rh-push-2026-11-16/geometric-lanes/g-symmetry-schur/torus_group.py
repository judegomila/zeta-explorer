# Numerical check of the (Z/2)^3 symmetry group of the loaded torus E_r (zeta-view conventions).
# z = 4K u + 2 i K' (v - 1/2), w = (i/r) sn(z|m), eta = cn dn, m = r^-4, s0 = 1/(1-w), s = 1/2 + L (s0 - 1/2)
import mpmath as mp, itertools, json, random
mp.mp.dps = 30
def setup(r):
    m = mp.mpf(r)**-4
    return m, mp.ellipk(m), mp.ellipk(1-m)
def pt(u, v, r):
    m, K, Kp = setup(r)
    z = 4*K*u + 2j*Kp*(v-mp.mpf(1)/2)
    sn, cn, dn = mp.ellipfun('sn', z, m), mp.ellipfun('cn', z, m), mp.ellipfun('dn', z, m)
    return (1j/r)*sn, cn*dn
h = mp.mpf(1)/2
maps = {
 '1':  lambda u,v:(u,v),
 'D':  lambda u,v:(h-u,1-v),
 'R':  lambda u,v:(u,h-v),
 'A':  lambda u,v:(h-u,h+v),
 'C':  lambda u,v:(-u,v),
 'DC': lambda u,v:(h+u,1-v),
 'RC': lambda u,v:(-u,h-v),
 'tau=DRC': lambda u,v:(h+u,h+v),
}
# expected action on (w, eta)
exp = {
 '1':  lambda w,e:(w,e),
 'D':  lambda w,e:(w,-e),
 'R':  lambda w,e:(1/mp.conj(w), mp.conj(e)/mp.conj(w)**2),
 'A':  lambda w,e:(1/mp.conj(w), -mp.conj(e)/mp.conj(w)**2),
 'C':  lambda w,e:(mp.conj(w), mp.conj(e)),
 'DC': lambda w,e:(mp.conj(w), -mp.conj(e)),
 'RC': lambda w,e:(1/w, e/w**2),
 'tau=DRC': lambda w,e:(1/w, -e/w**2),
}
random.seed(1)
out = {}
for r in [1.3, 2, 3.7]:
    worst = {}
    for name in maps:
        err = 0
        for _ in range(25):
            u, v = mp.mpf(random.random()), mp.mpf(random.random())
            w, e = pt(u, v, r)
            w2, e2 = pt(*maps[name](u, v), r)
            we, ee = exp[name](w, e)
            err = max(err, abs(w2-we)/(1+abs(we)), abs(e2-ee)/(1+abs(ee)))
        worst[name] = mp.nstr(err, 3)
    out[str(r)] = worst
# spectral action: s0 = 1/(1-w): w->1/w gives s0 -> 1-s0 ; w->conj w gives conj ; w->1/conj w gives 1-conj
w = mp.mpc('0.3','0.8'); s0 = 1/(1-w)
out['spectral'] = {'1/w -> 1-s': mp.nstr(abs(1/(1-1/w) - (1-s0)),3),
                   'conj -> conj s': mp.nstr(abs(1/(1-mp.conj(w)) - mp.conj(s0)),3),
                   '1/conj -> 1-conj s': mp.nstr(abs(1/(1-1/mp.conj(w)) - (1-mp.conj(s0))),3)}
# fixed point sets on the (u,v) torus (mod 1): solved exactly by hand; record
out['fixed_sets'] = {'D':'4 points (2u=1/2,2v=0 mod 1)', 'RC':'4 points (2u=0, 2v=1/2)', 'tau':'none (translation)',
  'R':'2 circles v=1/4,3/4', 'C':'2 circles u=0,1/2', 'A':'none', 'DC':'none'}
print(json.dumps(out, indent=1)); json.dump(out, open('torus_group.json','w'), indent=1)
