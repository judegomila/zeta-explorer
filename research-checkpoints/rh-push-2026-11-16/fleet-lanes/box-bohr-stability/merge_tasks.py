import json, sys
order = ['tasks3.json', 'tasks6.json', 'tasks5.json', 'tasks2.json', 'tasks4.json']
T3 = json.load(open('tasks3.json'))
head = [t for t in T3 if t['kind'] != 'win']
rest = [t for t in T3 if t['kind'] == 'win']
lists = [rest] + [json.load(open(f)) for f in order[1:]]
out = list(head)
# round-robin in blocks so every family advances
i = [0] * len(lists); blk = [40, 24, 10, 60, 120]
while any(i[k] < len(lists[k]) for k in range(len(lists))):
    for k in range(len(lists)):
        out.extend(lists[k][i[k]:i[k] + blk[k]]); i[k] += blk[k]
json.dump(out, open('tasksM.json', 'w'))
print(len(out), len(head))
