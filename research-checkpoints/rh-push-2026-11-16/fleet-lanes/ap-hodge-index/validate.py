import sys, json, mpmath as mp
sys.path.insert(0, sys.argv[1])
from hlib import *
mp.mp.dps = 25
O = make_objects(400000, 60000)
# zeta: single Gaussian s=0.6 at x=0 and pair d=0.7
zs = [mp.im(mp.zetazero(k)) for k in range(1, 30)]
for (d, s) in [(0, mp.mpf('0.25')), (mp.mpf('0.7'), mp.mpf('0.2'))]:
    P, Pr, A = entry_parts(O['zeta'], d, s, 0, s)
    _, v, amp = pair(d, s, 0, s)
    Z = sum(2*amp*mp.sqrt(2*mp.pi*v)*mp.exp(-v*g*g/2)*mp.cos(g*d) for g in zs)
    print('zeta d=%s  zeros %s  P-Prime+A %s  diff %s' % (mp.nstr(d,3), mp.nstr(Z, 20), mp.nstr(P-Pr+A, 20), mp.nstr(Z-(P-Pr+A), 3)))
# EA: zeros at t = gamma +- i a
a = mp.mpf(1)/5
for (d, s) in [(0, mp.mpf('0.25')), (mp.mpf('0.7'), mp.mpf('0.2'))]:
    P, Pr, A = entry_parts(O['EA_0.2'], d, s, 0, s)
    _, v, amp = pair(d, s, 0, s)
    Z = 0
    for g in zs:
        for sg in (1, -1):
            for sa in (1, -1):
                t = sg*g + sa*1j*a
                Z += amp*mp.sqrt(2*mp.pi*v)*mp.exp(-v*t*t/2)*mp.exp(1j*t*d)
    print('EA   d=%s  zeros %s  P-Prime+A %s  diff %s' % (mp.nstr(d,3), mp.nstr(Z.real, 20), mp.nstr(P-Pr+A, 20), mp.nstr(Z.real-(P-Pr+A), 3)))
# DH: zeros from json (t = -i(rho-1/2))
J = json.load(open(sys.argv[2]))
print('DH json keys', list(J.keys()), [len(J[k]) for k in J])
on = [mp.mpf(x) for x in J['on']]
offk = [k for k in J if k != 'on']
print('off sample', J[offk[0]][:2] if offk else None)

print(J[offk[0]][:3])
off = [(mp.mpf(b), mp.mpf(g)) for b, g in J['off']]
for (d, s) in [(0, mp.mpf('0.25')), (mp.mpf('0.7'), mp.mpf('0.2'))]:
    P, Pr, A = entry_parts(O['DH'], d, s, 0, s)
    _, v, amp = pair(d, s, 0, s)
    Z = 0
    c0 = amp*mp.sqrt(2*mp.pi*v)
    for g in on:
        Z += 2*c0*mp.exp(-v*g*g/2)*mp.cos(g*d)
    for b, g in off:
        for sb in (1, -1):
            for sg in (1, -1):
                t = sg*g - 1j*sb*(b-mp.mpf(1)/2)
                Z += c0*mp.exp(-v*t*t/2)*mp.exp(1j*t*d)
    print('DH   d=%s  zeros %s  P-Prime+A %s  diff %s' % (mp.nstr(d,3), mp.nstr(mp.re(Z), 20), mp.nstr(P-Pr+A, 20), mp.nstr(mp.re(Z)-(P-Pr+A), 3)))
