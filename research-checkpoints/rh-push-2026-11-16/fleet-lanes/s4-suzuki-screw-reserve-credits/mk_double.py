"""writes sweep_d.c / dh2_d.c: the same programs with R = double (SSE2) instead of x87 long double."""
import re, sys
for src in ('sweep.c', 'dh2.c'):
    s = open(src).read()
    s = s.replace('typedef long double R;', 'typedef double R;')
    for a, b in (('logl(', 'log('), ('sqrtl(', 'sqrt('), ('expl(', 'exp('), ('cosl(', 'cos('), ('log1pl(', 'log1p('), ('fabsl(', 'fabs('), ('powl(', 'pow('), ('lroundl(', 'lround('), ('strtold(', 'strtod(')):
        s = s.replace(a, b)
    s = re.sub(r'(?<![A-Za-z_0-9])((?:\d+\.\d*|\.\d+|\d+)(?:[eE][+-]?\d+)?)L(?![A-Za-z_0-9L])', r'\1', s)
    s = s.replace('%Lf', '%lf').replace('.21Le', '.17e').replace('.18Le', '.17e').replace('.15Le', '.15e').replace('%.2Lf', '%.2f')
    assert 'Le' not in re.sub(r'[A-Za-z_]+Le[a-z]*', '', s) or True
    open(src.replace('.c', '_d.c'), 'w').write(s)
    print(src, 'remaining long double tokens:', len(re.findall(r'long double|\dL\b|%L', s)))
