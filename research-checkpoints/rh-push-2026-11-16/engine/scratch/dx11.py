import re,sys,os
n=int(sys.argv[1]); w=int(sys.argv[2])
for p in sys.argv[3:]:
    if p.endswith('.js'): fs=[p]
    else:
        f='src/pages/%s.jsx'%p
        if not os.path.exists(f): print('##',p,'MISSING'); continue
        s=open(f,errors='replace').read()
        fs=[i.replace('../data/','') for i in re.findall(r"from\s+'(\.\./data/[^']+)'",s)][:2]
        print('##',p,fs)
    for d in fs:
        dp='src/data/'+d
        if not dp.endswith('.js'): dp+='.js'
        if not os.path.exists(dp) or os.path.getsize(dp)>3_000_000: print('  (skip)',d); continue
        t=open(dp,errors='replace').read()
        hdr=' '.join(t[:w].split())
        print('  HDR',d,':',hdr)
        k=0
        for m in re.finditer(r"\b(headline|verdict|statement|oneLine|summary|claim|finding|conclusion|honest\w*|mechanism|obstruction)\s*:\s*",t):
            seg=' '.join(t[m.end():m.end()+w].split())
            if len(seg)<60 or seg[0] not in "'\"`": continue
            print('  -',m.group(1),':',seg)
            k+=1
            if k>=n: break
