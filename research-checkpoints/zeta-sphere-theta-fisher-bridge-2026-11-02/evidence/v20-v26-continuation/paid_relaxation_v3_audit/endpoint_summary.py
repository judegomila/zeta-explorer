"""Self-authored directed summary; full budget must already be complete."""
import sys,json
from pathlib import Path
root=Path(__file__).resolve().parent
sys.argv=['endpoint_summary.py','1024','1024']
import certify_degree5 as c
H,_=c.moments(c.arb(1));_,S,_,_=c.schur(H)
endpoint={'terminal_lower':str(S.lower()),'terminal_upper':str(S.upper())}
(root/'endpoint_directed.json').write_text(json.dumps(endpoint,indent=2))
path=root/'certificate.json'
try:raw=json.loads(path.read_text())
except (ValueError,FileNotFoundError):
 print(json.dumps(endpoint,indent=2));raise SystemExit('Budget not yet complete; endpoint only, not a certificate.')
assert raw['N']==1024 and raw['L']==1024 and len(raw['rows'])==1024
B=c.arb(raw['budget']);out=dict(**endpoint,budget_upper=str(B.upper()),paid_lower=str((S-B).lower()),PASS=bool(S>B))
# Coarse rational bounds are especially convenient to state without rounding ambiguity.
out['terminal_above_375000']=bool(S>375000);out['budget_below_330000']=bool(B<330000)
(root/'certificate_directed.json').write_text(json.dumps(out,indent=2));print(json.dumps(out,indent=2))
