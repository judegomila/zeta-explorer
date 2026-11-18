import re,sys,os
n=int(sys.argv[1]); w=int(sys.argv[2])
kw=re.compile(r'(iff|equivalen|\\le|\\ge|>=|<=|= |positiv|kernel|Euler|prime|zero|theorem|lemma|proved|refuted|obstruct|fails|open|conjectur|bound|norm)',re.I)
for p in sys.argv[3:]:
    f='src/pages/%s.jsx'%p
    if not os.path.exists(f): print('##',p,'MISSING'); continue
    s=open(f,errors='replace').read()
    imps=re.findall(r"from\s+'(\.\./data/[^']+)'",s)
    print('##',p,len(s),'data:',' '.join(i.replace('../data/','') for i in imps[:4]))
    # text candidates: string literals and JSX text
    c=re.findall(r"'((?:[^'\\\n]|\\.){90,})'|\"((?:[^\"\\\n]|\\.){90,})\"|`((?:[^`\\]|\\.){90,})`|>\s*([^<>{}]{90,})\s*<",s)
    out=[]
    for t in c:
        x=' '.join(''.join(t).split())
        if 'className' in x or 'M0 ' in x or x.startswith('http'): continue
        if kw.search(x): out.append(x)
    out.sort(key=lambda x:-len(kw.findall(x))/ (len(x)**0.5))
    seen=0
    for x in out[:n]:
        print(' -',x[:w])
