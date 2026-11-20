"""RESULT.md = RESULT.tmpl.md with the generated tables (gen_tables.py) and the entries of fill.json."""
import subprocess, json, re, sys
t = open('RESULT.tmpl.md').read()
tabs = subprocess.run([sys.executable, 'gen_tables.py'], capture_output=True, text=True).stdout
parts = re.split(r'^### (T\d) [^\n]*\n', tabs, flags=re.M)
sec = {parts[i]: parts[i + 1].strip() for i in range(1, len(parts), 2)}
for k, v in sec.items(): t = t.replace('@@' + k + '@@', v)
for k, v in json.load(open('fill.json')).items(): t = t.replace('@@' + k + '@@', v)
left = sorted(set(re.findall(r'@@[A-Z0-9_]+@@', t)))
open('RESULT.md', 'w').write(t)
print('unfilled:', left)
