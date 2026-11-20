from pathlib import Path
p=Path(__file__).parent
s=(p/'check_three_region_payment.py').read_text();exec(s[:s.index('out={}')])
s=(p/'check_degree7_regional_payment.py').read_text();exec(s[:s.index('sums=')])
N=16000;w=arb(3)/(8*N);mins={0:[None]*3,1:[None]*3}
for i in range(N):
 u=arb(1)/8+(arb(i)+arb(1)/2)*w+arb(0,(w/2).upper());local=calc(u,False)
 for shift in [0,1]:
  try: _,_,d=solve([arb(0)]+local[shift:shift+7])
  except AssertionError:
   print(json.dumps({"status":"inconclusive interval LDL","cell":i,"shift":shift,"u":str(u)}));raise
  for j in range(3):
   low=d[j].lower();mins[shift][j]=low if mins[shift][j] is None or low<mins[shift][j] else mins[shift][j]
print(json.dumps({str(k):[str(x) for x in v] for k,v in mins.items()},indent=2))
