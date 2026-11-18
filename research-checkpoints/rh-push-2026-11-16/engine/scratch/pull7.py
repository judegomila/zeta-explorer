import re,sys
ids=set(sys.argv[2].split(','));cap=int(sys.argv[1])
head=re.compile(r'^\s*\{\s*id:\s*(\d+)\s*,(.*)$')
with open('src/data/improvements.js','r',encoding='utf-8',errors='replace') as f:
    for line in f:
        m=head.match(line)
        if not m or m.group(1) not in ids: continue
        r=m.group(2);k=r.find('summary:')
        s=r[k+8:k+8+cap+200] if k>=0 else r[:cap]
        s=re.sub(r'\s+',' ',s)
        # skip the part already seen (first 150 chars)
        print('[%s] %s'%(m.group(1),s[140:cap]))
