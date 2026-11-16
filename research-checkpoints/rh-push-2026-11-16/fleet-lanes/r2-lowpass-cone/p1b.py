import re
src=open('p1.py').read()
head=src.split('print("== case')[0].replace("NZ=150","NZ=2")
tail="mp.mp.dps=30\nq,c=2,mp.mpf('-2.1')"+src.split("mp.mp.dps=30\nq,c=2,mp.mpf('-2.1')")[1]
exec(head+tail)
