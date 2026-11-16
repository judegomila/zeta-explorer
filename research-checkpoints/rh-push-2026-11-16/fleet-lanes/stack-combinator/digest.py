import re,sys
for fn in sys.argv[1:]:
    cur=None
    for line in open(fn):
        line=line.rstrip()
        if line.startswith('### ') or line.startswith('## '):
            print(); print(line[:150]); continue
        m=re.match(r'^[-*] \**(type|statement|status|uses|DH|HEAT|TWIST|EA)\**\s*:\s*(.*)',line)
        if m:
            k,v=m.groups(); lim=260 if k=='statement' else 95
            print(f"  {k}: {v[:lim]}")
