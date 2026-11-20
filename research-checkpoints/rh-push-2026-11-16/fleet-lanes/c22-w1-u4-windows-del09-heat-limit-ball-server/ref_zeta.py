# Referee check of the zeta row (mpmath, 30 digits, separate code): for each rectangle, W_R - Q_gen from the listed zeros and from
# xi'/xi by mpmath, against the lane's contour integral C_R (computed without the zero list). Usage: python ref_zeta.py cells_zeta.json out.json
import sys, json
import mpmath as mp
mp.mp.dps = 30
D = json.load(open(sys.argv[1])); CW = 2*mp.mpf(D['CZ'])
def L(z):                                    # d/dz log xi(1/2 + z)
    s = mp.mpf(1)/2 + z
    return 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s)
RATES = {'P8': ([(mp.mpf('0.375'), mp.mpf('2500.921875'))], [mp.mpc(1)]),
         'P1': ([(mp.mpf('0.375'), mp.mpf('2500.921875')), (mp.mpf('0.625'), mp.mpf('2500.625'))], [mp.mpc(1), mp.mpc('-0.75', '0.5')])}
def hfun(row, z):
    V = 0; Vs = 0
    for (x, t), b in zip(*RATES[row]):
        zj = mp.mpc(x, -t); V += b/(z + zj); Vs += mp.conj(b)/(mp.conj(zj) - z)
    return V*Vs
Q = {}
for row in RATES:
    zs = [mp.mpc(x, -t) for x, t in RATES[row][0]]; bs = RATES[row][1]; tot = 0
    for i, zi in enumerate(zs):
        for j, zj in enumerate(zs): tot += bs[i]*mp.conj(bs[j])*(L(mp.conj(zj)) - L(-zi))/(zi + mp.conj(zj))
    Q[row] = tot
worst = 0
for zr in D['zeros']:
    g = mp.mpf(zr['re_w'])/2; worst = max(worst, abs(mp.zeta(mp.mpc(0.5, g))))
out = dict(dps=30, Qgen={r: mp.nstr(Q[r], 25) for r in Q}, Qgen_lane={r: D['Qgen_' + r][0] for r in Q}, max_abs_zeta_at_listed_zeros=float(worst), rows=[])
for k in D['table']:
    Y = k['Y']; r = dict(Y=Y)
    for row in RATES:
        W = 0; n = 0
        for zr in D['zeros']:
            x = mp.mpf(zr['re_w'])
            if CW - 2*Y < x < CW + 2*Y: W += hfun(row, 1j*mp.mpc(x, mp.mpf(zr['im_w']))/2); n += 1
        r[row] = dict(W_minus_Q_ref=mp.nstr(W - Q[row], 20), C_R_lane=k[row]['C_R'][0], zeros=n)
    out['rows'].append(r); print(json.dumps(r), flush=True)
json.dump(out, open(sys.argv[2], 'w'), indent=1); print(json.dumps({k_: v for k_, v in out.items() if k_ != 'rows'}))
