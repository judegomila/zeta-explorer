import klib, mpmath as mp
tw = klib.twin_table_mp(600, 5, 11)
fl = {T['key']: T for T in klib.twin_table(5, 11)}
for T in tw[:4]:
    f = fl[T['key']]
    print(T['key'], 'max |mp - float| coefficient', max(abs(float(mp.mpf(x)) - y) for x, y in zip(T['b'], f['b'])), '|eps|-1', T['abs_eps_minus_1'])
mp.mp.prec = 640
T = tw[0]; b = [mp.mpf(x) for x in T['b']]
for u in ('0.05', '0.3'):
    u = mp.mpf(u)
    print('evenness defect of Phi_twin at u =', u, mp.nstr(klib.phi_F_mp(u, b, T['q'], T['delta'], N=200)/klib.phi_F_mp(-u, b, T['q'], T['delta'], N=200) - 1, 5))
