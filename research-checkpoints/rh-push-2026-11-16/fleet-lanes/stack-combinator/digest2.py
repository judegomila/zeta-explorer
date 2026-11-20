import re,sys
for fn in sys.argv[1:]:
    row=None
    def flush(r):
        if r and 'id' in r:
            c=' '.join(f"{k}={re.split(r'[ (;,:]',r.get(k,'?').strip())[0][:6] or '?'}" for k in ('DH','HEAT','TWIST','EA'))
            print(f"* {r['id']} [{r.get('status','')[:28]}] {c}\n    {r.get('statement','')[:200]}")
    for line in open(fn):
        line=line.rstrip()
        if line.startswith('### '):
            flush(row); row={'id':line[4:]}; continue
        m=re.match(r'^[-*] \**(type|statement|status|uses|DH|HEAT|TWIST|EA)\**\s*:\s*(.*)',line)
        if m and row is not None: row[m.group(1)]=m.group(2)
    flush(row)
