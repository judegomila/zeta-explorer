# task lists for t_gram.py batch (largest tasks first), split over three units
import json
big = []   # superseded by mk_tasks2.py
mid = []   # superseded by mk_tasks2.py
for nm, ts in (('zeta', ('-0.2', '-0.1', '-0.05', '0')), ('dh', ('0',)), ('chi-3', ('0',))):
    for t in ts:
        mid.append(['gram', nm, t, 1, 8192, 2048])
FAM = [('zeta', ('-0.2', '-0.1', '-0.05', '0', '0.05', '0.2', '0.5')), ('dh', ('0', '0.1', '0.25', '0.5', '1.0')),
       ('chi-3', ('0', '0.25')), ('chi-4', ('0',)), ('chi5', ('0',)), ('chi-7', ('0',)), ('chi-19', ('0',)), ('delta', ('0',)),
       ('ea0.35', ('0', '0.1', '0.25', '0.5')), ('ea0.2', ('0',)), ('tnr3_2.2', ('0', '0.25', '0.5')), ('tnr3_2.05', ('0',))]
std = []
for nm, ts in FAM:
    for t in ts:
        std.append(['scan', nm, t, 810.0, 0.1, 512])
for r in (32, 16, 8, 4, 2, 1):
    for nm, ts in FAM:
        for t in ts:
            std.append(['gram', nm, t, r, 4000, 512])
json.dump(big, open('gram_tasks_big.json', 'w')); json.dump(mid, open('gram_tasks_mid.json', 'w')); json.dump(std, open('gram_tasks_std.json', 'w'))
print(len(big), len(mid), len(std), 'tasks')
