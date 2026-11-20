import mpmath as mp, time
mp.mp.dps=34
for T in ('1000000000.5','100000000000.5'):
    t0=time.time(); s=mp.mpc(0.75, mp.mpf(T)); v=mp.zeta(s); print(T, v, time.time()-t0, flush=True)
