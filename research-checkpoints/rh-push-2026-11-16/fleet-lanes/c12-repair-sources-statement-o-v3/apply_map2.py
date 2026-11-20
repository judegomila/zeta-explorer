# Correction to apply_map.py: the regular-representation row belongs to section 3.3 (ids Q), not 3.4 (ids S). S13 -> Q28.
import os
HERE = os.path.dirname(os.path.abspath(__file__))
MAP = os.path.join(HERE, '..', 'OBSTRUCTION_MAP.md')
L = open(MAP, encoding='utf-8').read().split('\n')
i = [k for k, l in enumerate(L) if l.startswith('| S13 |')]; assert len(i) == 1
row = L.pop(i[0]).replace('| S13 |', '| Q28 |', 1)
j = [k for k, l in enumerate(L) if l.startswith('| Q27 |')]; assert len(j) == 1
L.insert(j[0] + 1, row)
t = '\n'.join(L)
for old, new in [('P 53, G 32, Q 27, S 13, Z 37', 'P 53, G 32, Q 28, S 12, Z 37'),
                 ('S13 (regular-representation matrix series with the bridge square)', 'Q28 (regular-representation matrix series with the bridge square)'),
                 ('Verdict unchanged (row S13; second referee)', 'Verdict unchanged (row Q28; second referee)')]:
    assert t.count(old) == 1, old
    t = t.replace(old, new)
assert 'S13' not in t
open(MAP, 'w', encoding='utf-8').write(t)
print('moved to Q28; lines', len(L))
