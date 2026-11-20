import sys,re
mod=sys.argv[1]; n=int(sys.argv[2]); ids=sys.argv[3:]
L={}
for line in open('tmp/research-2026-11-16/engine/index/full/dags_full.txt',encoding='utf-8'):
    m=re.match(r'\[dag:([^#]+)#([^\]]+)\] (.*)',line)
    if m and m.group(1)==mod: L.setdefault(m.group(2),[]).append(m.group(3))
for i in ids:
    for b in L.get(i,['MISSING']):
        # drop the status blurb for pa: keep from title on
        print('['+i+'] '+b[:n]); print()
