import mpmath as mp, json
mp.mp.dps=50
rows=[json.loads(l) for l in open('../../../tmp/b145-B-out/walls/chain_window_rerun.jsonl')]
for a,b in zip(rows,rows[1:]):
    t=mp.mpf(a['t_last_hi']); assert a['t_last_hi']==b['t_first_lo']
    g=mp.siegeltheta(t)/mp.pi
    print("shared endpoint",a['t_last_hi'],"theta/pi =",mp.nstr(g,25)," nearest int",int(mp.nint(g)),"; n_last(chunk)=",a['n_last'],"n_first(next)=",b['n_first'], " n_last-1 =",int(a['n_last'])-1)
for key,r in [('t_first_lo',rows[0]),('t_last_hi',rows[-1])]:
    t=mp.mpf(r[key]); g=mp.siegeltheta(t)/mp.pi; print(key,r[key],"theta/pi=",mp.nstr(g,25))
